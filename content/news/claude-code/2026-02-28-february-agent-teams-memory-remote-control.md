---
title: "Claude Code in February 2026 — agent teams, auto-memory, and Remote Control"
date: 2026-02-28
tags: [release, claude-code, agents, memory, remote-control]
summary: "February brought Opus and Sonnet 4.6 support, experimental agent teams, automatic memory, Remote Control, and new bundled workflow commands."
---

Claude Code **2.1.30 through 2.1.63** turned the CLI into a more persistent, multi-agent workspace.

## What changed

- Opus 4.6 and Sonnet 4.6 became available, with fast mode for Opus 4.6.
- Research-preview agent teams added collaborative work, teammate hooks, and automatic reuse of idle teammates.
- Claude began saving useful context to auto-memory, managed through `/memory`.
- `claude remote-control` opened local sessions to supported remote clients.
- `/simplify` and `/batch` arrived as bundled commands, and PDF reads gained page ranges.
- New `claude auth login`, `status`, and `logout` commands improved non-interactive authentication management.

## Why it matters

Sessions could now retain useful knowledge, coordinate several agents, and remain reachable outside the original terminal. Those conveniences also increased the need to review stored memory and bound parallel work.

## What to do

Open `/memory` to review what is retained. Treat agent teams as an opt-in, token-intensive workflow and set clear task boundaries before enabling them.

[Claude Code v2.1.30 release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.30) · [v2.1.63](https://github.com/anthropics/claude-code/releases/tag/v2.1.63)
