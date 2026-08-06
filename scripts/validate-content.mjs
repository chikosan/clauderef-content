import { access, lstat, readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const errors = [];
const isoDate = /^\d{4}-\d{2}-\d{2}$/;

function display(path) {
  return relative(root, path);
}

function fail(path, message) {
  errors.push(`${display(path)}: ${message}`);
}

async function filesBelow(directory, extension) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await filesBelow(path, extension)));
    if (
      (entry.isFile() || entry.isSymbolicLink()) &&
      (!extension || entry.name.endsWith(extension))
    ) {
      files.push(path);
    }
  }
  return files;
}

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    fail(
      path,
      `must contain valid JSON (${error instanceof Error ? error.message : "unknown error"})`,
    );
    return null;
  }
}

for (const forbidden of ["src", ".lovable", ".claude", "Dockerfile", "pipelines", ".env"]) {
  try {
    await access(join(root, forbidden));
    fail(join(root, forbidden), "website, deployment, or private working files do not belong here");
  } catch {
    // The public content boundary is intact.
  }
}

for (const path of await filesBelow(join(root, "content"), ".md")) {
  const raw = await readFile(path, "utf8");
  if (raw.includes("*** End Patch")) fail(path, "contains a leaked patch marker");
  if (/\b(?:TODO|FIXME):/i.test(raw) && !path.endsWith("article-template.md")) {
    fail(path, "contains an unresolved TODO or FIXME marker");
  }
}

for (const directory of [
  join(root, "public", "covers"),
  join(root, "public", "images", "ecosystem"),
]) {
  for (const path of await filesBelow(directory)) {
    const info = await lstat(path);
    if (info.isSymbolicLink()) fail(path, "symbolic links are not accepted as public media");
    const limit = path.includes(`${join("images", "ecosystem")}`) ? 500_000 : 2_000_000;
    if (info.size > limit)
      fail(path, `file exceeds the ${Math.round(limit / 1_000)} KB media limit`);
    if (path.endsWith(".svg")) {
      const svg = await readFile(path, "utf8");
      if (
        /<script\b|<foreignObject\b|\son[a-z]+\s*=|(?:href|src)\s*=\s*["'](?:https?:|\/\/|data:)/i.test(
          svg,
        )
      ) {
        fail(path, "SVG contains active content or an external resource reference");
      }
    }
  }
}

for (const path of await filesBelow(join(root, "content", "news"), ".md")) {
  const raw = await readFile(path, "utf8");
  const { data, content } = matter(raw);
  if (!data.title || !data.date || !data.summary) {
    fail(path, "title, date, and summary are required");
  }
  const date =
    data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? "");
  if (!isoDate.test(date) || date < "2026-01-01") {
    fail(path, "news archive must start at January 2026; remove older entries");
  }
  if (
    !/https:\/\/(?:www\.)?(?:anthropic\.com|code\.claude\.com)|https:\/\/github\.com\/anthropics\//.test(
      content,
    )
  ) {
    fail(path, "must link to an official Anthropic primary source");
  }
}

for (const path of await filesBelow(join(root, "content", "library"), ".md")) {
  const raw = await readFile(path, "utf8");
  const { data } = matter(raw);
  if (data.author === "clauderef.com") fail(path, "use a named Person author");
  if (!data.draft && data.type === "video" && (!data.youtube || !data.source)) {
    fail(path, "published videos require youtube and source URLs");
  }
  if (typeof data.cover === "string" && data.cover.startsWith("/")) {
    try {
      await access(join(root, "public", data.cover.slice(1)));
    } catch {
      fail(path, `cover does not exist: public${data.cover}`);
    }
  }
}

const ecosystemPath = join(root, "content", "ecosystem.json");
const ecosystem = await readJson(ecosystemPath);
const summaryPath = join(root, "content", "ecosystem-summary.json");
const summary = await readJson(summaryPath);

if (ecosystem) {
  if (!isoDate.test(ecosystem.updated ?? "")) fail(ecosystemPath, "updated must be YYYY-MM-DD");

  const tagIds = new Set();
  const tagLabels = new Set();
  const groupIds = new Set();
  if (!Array.isArray(ecosystem.tagGroups) || ecosystem.tagGroups.length === 0) {
    fail(ecosystemPath, "tagGroups must be a non-empty array");
  } else {
    for (const [groupIndex, group] of ecosystem.tagGroups.entries()) {
      const groupLabel = `tagGroups[${groupIndex}]`;
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(group.id ?? "")) {
        fail(ecosystemPath, `${groupLabel}.id must be a normalized identifier`);
      }
      if (typeof group.label !== "string" || !group.label.trim()) {
        fail(ecosystemPath, `${groupLabel}.label must be a non-empty string`);
      }
      if (groupIds.has(group.id)) fail(ecosystemPath, `duplicate tag group: ${group.id}`);
      groupIds.add(group.id);
      if (!Array.isArray(group.tags) || group.tags.length === 0) {
        fail(ecosystemPath, `${groupLabel}.tags must be a non-empty array`);
        continue;
      }
      for (const [tagIndex, tag] of group.tags.entries()) {
        const tagLabel = `${groupLabel}.tags[${tagIndex}]`;
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tag.id ?? "")) {
          fail(ecosystemPath, `${tagLabel}.id must be a normalized identifier`);
        }
        for (const field of ["label", "description"]) {
          if (typeof tag[field] !== "string" || !tag[field].trim()) {
            fail(ecosystemPath, `${tagLabel}.${field} must be a non-empty string`);
          }
        }
        if (tagIds.has(tag.id)) fail(ecosystemPath, `duplicate taxonomy tag: ${tag.id}`);
        const normalizedLabel = tag.label?.trim().toLowerCase();
        if (tagLabels.has(normalizedLabel)) {
          fail(ecosystemPath, `duplicate taxonomy label: ${tag.label}`);
        }
        tagIds.add(tag.id);
        tagLabels.add(normalizedLabel);
      }
    }
  }

  if (!Array.isArray(ecosystem.projects) || ecosystem.projects.length === 0) {
    fail(ecosystemPath, "projects must be a non-empty array");
  } else {
    const slugs = new Set();
    const repositories = new Set();
    const requiredStrings = [
      "slug",
      "name",
      "owner",
      "repository",
      "category",
      "summary",
      "bestFor",
      "whyInteresting",
      "caution",
      "license",
      "verified",
      "source",
      "lastPushedAt",
    ];
    const allowedSources = new Set([
      "awesome-claude-code",
      "clauderef-research",
      "community-submission",
    ]);

    for (const [index, project] of ecosystem.projects.entries()) {
      const label = `projects[${index}]`;
      for (const field of requiredStrings) {
        if (typeof project[field] !== "string" || !project[field].trim()) {
          fail(ecosystemPath, `${label}.${field} must be a non-empty string`);
        }
      }
      for (const field of ["install", "compatibility", "tags"]) {
        if (
          !Array.isArray(project[field]) ||
          project[field].some((item) => typeof item !== "string")
        ) {
          fail(ecosystemPath, `${label}.${field} must be an array of strings`);
        }
      }
      if (project.tags?.length < 5)
        fail(ecosystemPath, `${label}.tags must contain at least five useful tags`);
      if (new Set(project.tags).size !== project.tags.length)
        fail(ecosystemPath, `${label}.tags contains duplicates`);
      for (const tag of project.tags ?? []) {
        if (!tagIds.has(tag)) fail(ecosystemPath, `${label}.tags contains unknown tag: ${tag}`);
      }
      if (typeof project.official !== "boolean")
        fail(ecosystemPath, `${label}.official must be a boolean`);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug ?? "")) {
        fail(ecosystemPath, `${label}.slug must be a normalized identifier`);
      }
      if (
        !/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/.test(
          project.repository ?? "",
        )
      ) {
        fail(ecosystemPath, `${label}.repository must be a GitHub repository URL`);
      }
      if (!isoDate.test(project.verified ?? ""))
        fail(ecosystemPath, `${label}.verified must be YYYY-MM-DD`);
      if (!isoDate.test(project.lastPushedAt ?? ""))
        fail(ecosystemPath, `${label}.lastPushedAt must be YYYY-MM-DD`);
      if (!Number.isInteger(project.starsAtVerification) || project.starsAtVerification < 1000) {
        fail(ecosystemPath, `${label}.starsAtVerification must be an integer of at least 1000`);
      }
      if (!allowedSources.has(project.source))
        fail(ecosystemPath, `${label}.source is not recognized`);
      const ageInDays =
        (Date.parse(`${ecosystem.updated}T00:00:00Z`) -
          Date.parse(`${project.lastPushedAt}T00:00:00Z`)) /
        86_400_000;
      if (!Number.isFinite(ageInDays) || ageInDays < 0 || ageInDays > 365) {
        fail(ecosystemPath, `${label}.lastPushedAt must be within one year of updated`);
      }
      const sentences = project.summary?.match(/[^.!?]+[.!?]+/g)?.length ?? 0;
      if (sentences < 2 || sentences > 4)
        fail(ecosystemPath, `${label}.summary must contain two to four complete sentences`);
      if (
        project.icon !== undefined &&
        !/^\/images\/ecosystem\/[A-Za-z0-9_.-]+\.(?:svg|png|webp)$/.test(project.icon)
      ) {
        fail(ecosystemPath, `${label}.icon must be a local ecosystem image path`);
      }
      if (project.icon) {
        try {
          await access(join(root, "public", project.icon.slice(1)));
        } catch {
          fail(ecosystemPath, `${label}.icon does not exist in public/`);
        }
      }
      const slug = project.slug?.toLowerCase();
      const repository = project.repository?.replace(/\/$/, "").toLowerCase();
      if (slugs.has(slug)) fail(ecosystemPath, `duplicate slug: ${project.slug}`);
      if (repositories.has(repository))
        fail(ecosystemPath, `duplicate repository: ${project.repository}`);
      slugs.add(slug);
      repositories.add(repository);
    }
  }
}

if (ecosystem && summary) {
  if (summary.updated !== ecosystem.updated) fail(summaryPath, "updated must match ecosystem.json");
  if (summary.projectCount !== ecosystem.projects?.length)
    fail(summaryPath, "projectCount must match ecosystem.json");
}

if (errors.length) {
  console.error(`Content validation failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log("Content validation passed.");
