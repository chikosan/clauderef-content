---
title: "Claude Code in January 2026 — skills, tasks, and native plugin management"
date: 2026-01-31
tags: [release, claude-code, skills, tasks, plugins]
summary: "January merged slash commands with skills, introduced dependency-aware tasks, improved plugin management, and prepared users to leave the npm installer."
---

Claude Code's January releases, from **2.0.76 through 2.1.29**, simplified customization and added stronger project coordination.

## What changed

- Slash commands and skills became one model, reducing the distinction users had to remember.
- A dependency-aware task system arrived, while VS Code gained native plugin management and remote-session browsing.
- The CLI began warning npm-install users to move to `claude install` and the native installer.
- MCP tool search gained a configurable context threshold, plans gained a custom directory, and `/config` became searchable.
- `--from-pr` made it possible to resume sessions associated with a pull request.

## Why it matters

The month established several concepts that later 2026 releases build on: skills as the reusable unit, tasks with explicit dependencies, and plugins that can be managed without hand-editing files.

## What to do

Use `claude install` if your setup still depends on the deprecated npm-global installation. Review project commands that were written before skills and slash commands were unified.

[Claude Code v2.0.76 release notes](https://github.com/anthropics/claude-code/releases/tag/v2.0.76) · [v2.1.29](https://github.com/anthropics/claude-code/releases/tag/v2.1.29)
