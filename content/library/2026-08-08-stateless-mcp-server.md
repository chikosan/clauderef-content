---
title: "MCP 2026-07-28: the stateless core and why it changes servers"
date: 2026-08-08
time: "10:00"
type: article
tags: [claude-code, mcp, integration, architecture]
summary: "The Model Context Protocol moved to a stateless core with request/response semantics. Here's what changed in the 2026-07-28 spec and why it makes MCP servers deployable anywhere, including serverless."
author: "Shai Chikorel"
featured: false
cover: "/covers/stateless-mcp-server.jpg"
tldr:
  - The MCP 2026-07-28 spec moves the protocol from a bidirectional stateful model to a stateless request/response core.
  - A stateless server can run on serverless, edge, and ordinary load-balanced HTTP — no persistent session to manage.
  - Standardized extensions (MCP Apps, Tasks) and hardened auth ship with the same release.
  - It's the shift that makes building and connecting agentic experiences at enterprise scale materially easier.
  - MCP surpassed 400M monthly SDK downloads, a 4x increase this year, per Anthropic.
---

## The short answer

The [Model Context Protocol 2026-07-28 spec](https://claude.com/blog/bringing-mcp-2026-07-28-to-claude) is one of the most significant MCP releases to date, and its headline is a **stateless core**.

MCP moves from a bidirectional, stateful protocol to a **request/response model**. That single change ripples through everything: servers no longer need to hold a persistent session, which makes them deployable on **serverless, edge, and standard load-balanced HTTP infrastructure** instead of only long-lived processes.

## What actually changed

- **Stateless core.** The protocol drops the concept of a maintained session between client and server. Each request is self-contained and answered on its own — closer to how HTTP works than to a stateful duplex connection.
- **Extensions framework.** The same release introduces standardized extensions including **MCP Apps** and **Tasks**, plus hardened **auth**.
- **Enterprise leverage.** Anthropic frames the value as letting teams "build and connect agentic experiences at enterprise scale" — an explicit nod to how much simpler stateless deployments are to operate.

## Why stateless matters for server builders

If you build MCP servers, the stateful model was the awkward part: you had to keep a long-running process alive, manage session lifecycle, and handle reconnects. Stateless removes that burden.

A stateless server is just an HTTP endpoint that answers tool calls. That means:

- It runs on **serverless functions** (scale to zero, no idle process cost).
- It runs on **edge** and **load-balanced HTTP** infrastructure with no session-affinity concerns.
- It's trivially **replicable and horizontally scalable** — any instance can answer any request.

This is the infrastructure shift that lets AI agents connect to tools the same way web apps connect to APIs.

## Context: the protocol is already everywhere

The stateless change lands on a protocol that's already the industry standard for connecting agents to tools and data. Anthropic reports MCP **surpassed 400M monthly SDK downloads — a 4x increase this year** — with Microsoft, Google, and a growing roster of vendors shipping MCP compatibility.

So the practical takeaway isn't "learn a niche protocol." It's: the default way agents reach external systems just got a lot cheaper and easier to run.

## The parallel move: graph engineering

The stateless shift pairs with a broader change in how agentic systems are built. The same period has seen a move from **loop engineering** (everything inside one context window) toward **graph engineering** — where subagents act as nodes, an orchestrator coordinates them, and shared state lives outside any single window.

MCP's stateless core supports this direction: if servers are stateless endpoints, graphical, parallel, fan-out architectures become much easier to wire up.

## Takeaway

The 2026-07-28 spec is a quiet but load-bearing change: **MCP servers no longer have to be stateful processes.** If you've been putting off building an MCP server because persistent session management felt heavy, that reason is gone. A stateless tool endpoint is now a modest HTTP service you can host almost anywhere — the same model that made modern web APIs trivial to operate.

---
*Primary source: [Bringing MCP 2026-07-28 to Claude](https://claude.com/blog/bringing-mcp-2026-07-28-to-claude) (Claude/Anthropic). Stateless core, extensions, auth, and the 400M download figure verified against that post on 2026-08-08. The "graph engineering" framing derives from community commentary, flagged as interpretation, not an Anthropic claim.*
