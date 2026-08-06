---
title: "Claude Code in May 2026 — agent view, code review, and dynamic workflows"
date: 2026-05-31
tags: [release, claude-code, agents, code-review, workflows]
summary: "May added a unified agent view, resumable background sessions, richer usage reporting, code-review fixes, plugin scaffolding, and Opus 4.8 dynamic workflows."
---

Claude Code **2.1.126 through 2.1.159** made parallel work easier to see, resume, review, and automate.

## What changed

- `claude agents` introduced a single view of running, blocked, and completed sessions, later adding JSON output.
- Background sessions became resumable and could be pinned to remain available while idle.
- `/simplify` evolved into `/code-review`, with a `--fix` flow for applying selected findings.
- `/usage` began showing which skills, subagents, plugins, and MCP servers consumed limits.
- Opus 4.8 launched with effort control and research-preview dynamic workflows spanning many background agents.
- `.claude/skills` plugins could load without a marketplace, and `claude plugin init` could scaffold one.
- Auto mode expanded to Bedrock, Vertex, and Foundry as an opt-in preview.

## Why it matters

Agent work stopped being confined to one foreground conversation. The new views help, but teams should still control concurrency, review generated commits, and watch usage by category.

[Claude Code v2.1.126 release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.126) · [v2.1.159](https://github.com/anthropics/claude-code/releases/tag/v2.1.159)
