---
title: "Claude Code in April 2026 — Opus 4.7, a native binary, and faster long sessions"
date: 2026-04-29
tags: [release, claude-code, opus, performance, mcp]
summary: "April introduced Opus 4.7, native platform binaries, focus and fullscreen views, faster resume and MCP startup, and stronger managed settings."
---

Claude Code **2.1.89 through 2.1.123** focused on performance, enterprise configuration, and a calmer terminal experience.

## What changed

- Opus 4.7 arrived with an `xhigh` effort level and auto mode for eligible Max users.
- The CLI moved from bundled JavaScript to a native per-platform binary.
- Focus and fullscreen views reduced terminal flicker and collapsed tool activity.
- Large-session resume and multi-server MCP startup became substantially faster.
- `/powerup` added interactive lessons and Bedrock gained an interactive setup flow.
- Vim visual modes, persistent `/config` settings, and MCP `alwaysLoad` support expanded customization.
- Managed settings could fail closed when remote policy could not be refreshed.

## Why it matters

The native runtime and session improvements make long-running work feel less fragile. Administrators also gained controls that are safer for environments where stale policy cannot be accepted.

[Claude Code v2.1.89 release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.89) · [v2.1.123](https://github.com/anthropics/claude-code/releases/tag/v2.1.123)
