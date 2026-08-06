---
title: "The four MCP servers actually worth wiring up"
date: 2026-08-01
time: "08:05"
type: article
tags: [mcp, tooling]
summary: "Most MCP servers are demos. These four earn their place in a daily setup."
author: "Shai Chikorel"
cover: "/covers/mcp-worth-wiring.jpg"
---

## The shortlist

- **Filesystem** — scoped to a project root, not your home directory.
- **Git** — history and blame answers without shelling out.
- **Fetch** — reading docs pages inline beats copy-pasting them.
- **Postgres** — read-only credentials, schema questions answered instantly.

## Wiring one up

```bash
claude mcp add fetch -- npx -y @modelcontextprotocol/server-fetch
claude mcp list
```

## What to avoid

Anything that writes to production, anything unscoped, and anything you would
not hand a new contractor on day one.
