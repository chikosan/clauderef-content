---
title: "Claude Code in June 2026 — safe mode, nested agents, and Sonnet 5"
date: 2026-06-30
tags: [release, claude-code, security, subagents, sonnet]
summary: "June added safe mode, nested subagents, credential isolation, MCP login commands, managed version limits, and Sonnet 5 as the default model."
---

Claude Code **2.1.160 through 2.1.197** strengthened troubleshooting and policy while allowing agent hierarchies to grow deeper.

## What changed

- `--safe-mode` disabled instructions, plugins, skills, hooks, and MCP servers for clean troubleshooting.
- Subagents gained the ability to spawn subagents, with depth controls added in later releases.
- `sandbox.credentials` could block sandboxed commands from reading credential files and secret environment variables.
- `claude mcp login` and `logout` enabled MCP authentication from the CLI, including SSH-friendly flows.
- Administrators could enforce minimum and maximum Claude Code versions.
- Shell startup files and sensitive Git configuration received stronger write prompts.
- Sonnet 5 became the default model with a native 1M-token context window and introductory API pricing.

## Why it matters

Safe mode gives users a clean way to separate core-product failures from customization problems. Nested agents increase capability and cost together, so keep depth and concurrency bounded.

[Claude Code v2.1.160 release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.160) · [v2.1.197](https://github.com/anthropics/claude-code/releases/tag/v2.1.197)
