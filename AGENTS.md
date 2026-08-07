# ClaudeREF content — Codex project instructions

This repo is the community-editable knowledge base published on ClaudeREF.com. It holds editorial
content plus content-only validation tooling. The website app lives in the sibling `../clauderef`
repo, which consumes this repo's content via `content-source.json`.

## Primary rules

- **Community content lives here**, in `content/`. Do not edit app `content/` in the `clauderef`
  repo; add content here and it syncs upstream.
- **Verify before claiming done.** Check product claims against a primary source (official docs,
  release notes, the actual GitHub repo) — stars/agent counts in blog posts go stale fast.
- **Never publish an unreviewed AI draft.** Keep unverified or unfinished entries `draft: true`, and
  do not commit until a maintainer has reviewed.

## Adding an article (content/library/)

1. Copy `content/article-template.md` to `content/library/YYYY-MM-DD-descriptive-slug.md`.
2. Fill in `title`, `date`, `time`, `summary`, `tags`, `author`, and 3–5 `tldr` bullets. Reuse
   existing tags; lowercase, 2–5 of them.
3. Use a named Person as `author` (never `clauderef.com`).
4. Body: use `##`/`###` headings (feed the TOC), keep sections short and scannable, bold-first-terms
   in lists. Raw HTML is escaped — markdown only.
5. Cover: put a 1280×720 jpg at `public/covers/<slug>.jpg` and set `cover: "/covers/<slug>.jpg"`, or
   omit `cover` to use the bundled fallback. If a cover is referenced, it must exist (validator
   checks it).
6. Converted topics (e.g. a useful video or article) get an exact `source` link and credited,
   attributed, non-paraphrased original analysis. Do not rewrite a source.
7. For news (`content/news/`), also link an official Anthropic primary source in the body — the
   validator enforces this.

## Adding an ecosystem project (content/ecosystem.json)

Eligibility floor: public GitHub repo, ≥1000 stars at verification, not archived, active within the
past year, clear license + install path, ≥5 tags from the existing taxonomy, no duplicate. Describe
practical value and meaningful cautions. Maintainers verify facts before merge.

## Validation

```bash
bun install --frozen-lockfile
bun run validate      # required before considering an entry done
bun run format:check  # prettier must be clean
```

`npm run validate` also works. An entry is not "done" until validation passes and a maintainer has
reviewed the rendered page and diff.
