# ClaudeREF content

This repository is the community-editable knowledge base published on
[ClaudeREF.com](https://clauderef.com). It contains editorial content and the small amount of
validation tooling needed to review contributions. The website application, deployment, and internal
automation live in a separate private repository.

## Ways to contribute

- Correct an inaccurate or outdated page with the **Content correction** issue form.
- Propose a maintained Claude Code project with the **Ecosystem submission** form.
- Edit Markdown or JSON directly and open a focused pull request.
- Start a discussion when the right change is not yet clear.

Read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting. ClaudeREF is unofficial and is not
affiliated with or endorsed by Anthropic.

## Repository map

| Path                             | Purpose                                                         |
| -------------------------------- | --------------------------------------------------------------- |
| `content/news/`                  | Sourced Claude and Claude Code news from 2026 onward            |
| `content/library/`               | Articles and curated learning resources                         |
| `content/cheatsheet.md`          | Human-readable command and workflow reference                   |
| `content/cheatsheet-examples.md` | Copyable terminal examples                                      |
| `content/ecosystem.json`         | Curated repositories, taxonomy, cautions, and verification data |
| `public/covers/`                 | Article cover images referenced by content frontmatter          |
| `public/images/ecosystem/`       | Optional local project artwork                                  |
| `schemas/`                       | Machine-readable formats for structured contributions           |
| `scripts/`                       | Content-only validation; no website or deployment code          |

## Validate locally

Install [Bun](https://bun.sh/), then run:

```bash
bun install --frozen-lockfile
bun run validate
bun run format:check
```

CI runs the same checks, dependency auditing, and secret scanning. A pull request cannot modify or
deploy the private website. After an approved content change is merged, the private website
repository imports the reviewed snapshot through a separate pull request.

## Licensing

- Original editorial content under `content/` is available under [CC BY 4.0](CONTENT-LICENSE.md).
- Validation scripts and repository tooling are available under the [MIT License](LICENSE).
- Third-party names, quotations, logos, videos, and linked materials remain subject to their owners'
  terms.
