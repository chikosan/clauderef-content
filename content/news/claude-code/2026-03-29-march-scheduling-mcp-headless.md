---
title: "Claude Code in March 2026 — scheduling, MCP elicitation, and stronger headless runs"
date: 2026-03-29
tags: [release, claude-code, mcp, automation, headless]
summary: "March added recurring prompts, MCP input dialogs, longer model outputs, persistent plugin data, and a minimal bare mode for scripted runs."
---

Claude Code **2.1.68 through 2.1.87** expanded automation while giving users more control over context and scripted execution.

## What changed

- `/loop` and cron tools could run prompts or commands repeatedly inside a session.
- `/context` began suggesting concrete ways to reduce memory and tool-output pressure.
- MCP elicitation let servers request structured input during a task, with matching hook events.
- Opus 4.6 and Sonnet 4.6 gained output limits up to 128K tokens where supported.
- `${CLAUDE_PLUGIN_DATA}` gave plugins storage that survives updates.
- `--bare` provided a smaller headless mode without hooks, LSP, plugin sync, or skill-directory scans.
- Windows gained a preview PowerShell tool and managed policy gained additional hook and settings controls.

## Why it matters

Claude Code became more useful for scheduled and automated work, but recurring prompts and MCP-driven input can create long-lived actions. Use explicit stop conditions and review server permissions.

[Claude Code v2.1.68 release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.68) · [v2.1.87](https://github.com/anthropics/claude-code/releases/tag/v2.1.87)
