# Contributing to ClaudeREF content

Thank you for helping make ClaudeREF more accurate and useful. Small, sourced changes are the
easiest to review.

## Choose a contribution path

### Correct existing content

For a short correction, use the **Content correction** issue form. For a direct edit, fork this
repository, create a branch from `main`, update the relevant file, and open a pull request.

### Submit an ecosystem project

Use the **Ecosystem submission** issue form or add one entry to `content/ecosystem.json`. A project
must:

- use a public GitHub repository;
- have at least 1,000 stars at verification time;
- not be archived;
- have activity within the previous year;
- have a clear license and installation path;
- not duplicate an existing repository;
- use at least five tags from the existing taxonomy; and
- describe both its practical value and meaningful cautions.

Maintainers verify repository facts before merging. Popularity is only an eligibility floor, not an
endorsement or quality guarantee.

### Add news or learning material

Use official Anthropic documentation, release notes, or repositories for product claims. Community
sources may help discovery but should not be the sole authority for Claude behaviour. News begins at
January 2026. Keep unfinished or unverified articles marked `draft: true`.

## Local validation

```bash
bun install --frozen-lockfile
bun run validate
bun run format:check
```

CI also audits dependencies and scans the complete proposed history for secrets. Never submit
credentials, private prompts, customer data, private URLs, generated memory, or internal working
notes.

## Pull-request checklist

- Explain what changed and who benefits.
- Link primary sources for factual claims.
- Keep unrelated changes out of the pull request.
- Add or update media only when it is licensed for redistribution.
- Keep covers below 2 MB and ecosystem images below 500 KB. SVG files cannot contain scripts, event
  handlers, foreign objects, or external resources.
- Confirm validation passes.
- Respond to review comments or explain disagreements with evidence.

By submitting a contribution, you agree that original editorial content is provided under CC BY 4.0
and repository tooling under MIT, unless another compatible license is clearly identified. Your Git
commit remains part of the attribution record.

Report suspected vulnerabilities privately according to [SECURITY.md](SECURITY.md), not in a public
issue.
