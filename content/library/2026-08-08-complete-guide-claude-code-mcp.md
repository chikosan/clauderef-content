---
title: "MCP in Claude Code: the complete mental model"
date: 2026-08-08
time: "11:20"
type: article
tags: [claude-code, mcp, integration, architecture]
summary: "A practical guide to MCP in Claude Code: what the protocol is, how it connects Claude to external tools and data, how it differs from skills, and how the stateless 2026-07-28 spec changes server building."
author: "Shai Chikorel"
featured: false
cover: "/covers/complete-guide-claude-code-mcp.jpg"
tldr:
  - MCP is how Claude Code reads and writes external systems — Notion, GitHub, databases — instead of you pasting data in.
  - It's the Model Context Protocol: the open standard Anthropic released for connecting agents to tools and data.
  - MCP opens a door from Claude Code's local world to external tools; skills and commands stay inside Claude's own world.
  - The 2026-07-28 spec moved MCP to a stateless core — servers run on serverless/edge, not just long-lived processes.
  - Use MCP for live external access; use skills for reusable procedures. They compose, they don't compete.
---

## The short answer

MCP — the **Model Context Protocol** — is how Claude Code reads and writes external systems. Inside
its local world, Claude Code works fine: it reads your repo, runs your commands. But it knows nothing
about what's happening outside. MCP is the open door.

With MCP, Claude Code can look up requirements in Notion while writing code, read GitHub issues,
or connect to a database and query real data. Instead of you copying and pasting information into
the chat, the agent reaches external tools and data directly.

## Two things "MCP" points to

The term is overloaded, which causes most of the confusion:

1. **Model Context Protocol** — the open-source protocol Anthropic released in late 2024 for
   connecting AI agents to tools and data. It's the standard that defines how an agent discovers,
   calls, and gets results from external capabilities.
2. **The MCP servers/integrations** people refer to as "MCPs" — the concrete servers exposing those
   capabilities (a Notion server, a GitHub server, a database server).

Both matter. The protocol is the contract; the servers are the implementations.

## Where MCP sits vs skills

The cleanest way to think about it: **MCP opens Claude Code to the outside world; skills organize
how Claude Code behaves inside that world.**

- A **skill** packages a reusable procedure — instructions, conventions, and workflows — that
  Claude loads and follows. It changes what Claude *knows* or how it approaches a task.
- **MCP** gives Claude live *access* to external tools and data. It changes what Claude can *reach*.

They compose rather than compete: a skill can document the right way to use an MCP server, and an
MCP server can be the thing a skill invokes to fetch real data. The distinction is *access* vs
*procedure*.

## The protocol, simply

At its core, MCP is a client-server protocol:

- The **client** (Claude Code) loads tool definitions and orchestrates a message loop where each
  tool call and result passes through the model.
- The **server** exposes tools/resources to the client over a transport — historically a
  stateful bidirectional connection.

The key consequence of the protocol design: **tool access is reach, not memory.** Connecting many
servers means more tool definitions and results flowing through the model, which can consume
significant context. That's why the protocol and its surrounding patterns emphasize keeping tool
surface area focused.

## The 2026-07-28 stateless shift

The **2026-07-28 MCP spec** changed the protocol's core from a **bidirectional stateful** model to a
**stateless request/response** model. This matters for anyone building or running servers:

- Servers no longer need to hold a persistent session.
- They become deployable on **serverless, edge, and standard load-balanced HTTP infrastructure**.
- Building an MCP server becomes closer to building a modest HTTP endpoint than managing a
  long-lived service.

That shift is the quiet infrastructure change that makes MCP possible to run at scale — the same
model that made modern web APIs trivial to operate.

## Takeaway

Build the mental model in three layers:

1. **Protocol** — MCP is the open standard for connecting agents to external tools and data.
2. **Access vs. procedure** — MCP gives live external access; skills package reusable procedures.
3. **Stateless now** — since 2026-07-28, MCP servers are request/response endpoints you can host
   almost anywhere.

When a task needs live external data or an action on another system, reach for MCP. When it needs
a repeatable internal workflow, reach for a skill. And if you build servers, treat them like
stateless endpoints — that's the direction the protocol has committed to.

---
*Source: [The Complete Guide to Claude Code: MCP](https://ai.gopubby.com/the-complete-guide-to-claude-code-mcp-41a58df0a34f) (zhaozhiming, AI Advances, Jul 2026). Protocol principles, server-vs-skills framing, and context-loading discussion derive from that source. The MCP 2026-07-28 stateless-core facts are verified against [Anthropic's MCP announcement](https://claude.com/blog/bringing-mcp-2026-07-28-to-claude).*
