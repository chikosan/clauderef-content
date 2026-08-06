---
title: "Claude Code 2.1.221 — VS Code Focus view and safer credential masking"
date: 2026-08-04
tags: [release, claude-code, vscode, sandbox, security]
summary: "Claude Code adds a dedicated VS Code Focus view, Linux credential masking, prompt auditing, safer command checks, and smarter plugin activation."
---

Claude Code **2.1.221** combines a quieter editor experience with several security and reliability improvements.

## What changed

- VS Code gains a Focus view that hides tool activity behind expandable per-turn summaries. Toggle it with `Ctrl+Alt+F` or the **Claude Code: Toggle Focus view** command.
- Linux and WSL sandbox credential files support `mode: "mask"`, exposing sentinel content inside the sandbox while substituting the real value only on approved outbound requests. macOS falls back to denying access.
- The bundled `claude-api` skill adds `prompt-audit` for finding prompt and tool-description patterns written for older models.
- Permission checks now catch hidden zsh commands in `[[ ]]` regular-expression conditionals and suspicious quoted PowerShell paths.
- Plugins can activate immediately when safe, stale marketplace catalogs refresh before install failures, and `/fork` sessions receive their own worktrees.
- Auto-mode checks reuse prompt caches more efficiently, and usage statistics now separate cache reads and writes.

## What to do

Update if you use sandboxed credentials, editor Focus view, plugins, or automated permission checks.

```bash
claude update
```

[Official Claude Code 2.1.221 release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.221)
