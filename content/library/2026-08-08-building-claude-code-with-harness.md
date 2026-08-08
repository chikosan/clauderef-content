---
title: "Harness engineering: what actually makes Claude Code work"
date: 2026-08-08
time: "10:30"
type: article
tags: [claude-code, architecture, harness, agents]
summary: "Claude Code's success isn't better prompts — it's the harness around the model: a streaming agent loop, a typed tool registry, and a context management layer. Here's the reproducible thesis."
author: "Shai Chikorel"
featured: false
cover: "/covers/building-claude-code-with-harness.jpg"
tldr:
  - The differentiator isn't model quality alone — it's the harness around the model.
  - Claude Code's harness has 5 core components, starting with a single-threaded master loop.
  - A typed tool dispatch registry constrains what the model can express and the harness must execute.
  - A context management layer keeps reasoning coherent across sessions that exceed the window.
  - The same harness is reproducible — you can build it, not just observe it.
---

## The short answer

By early 2026, [Claude Code crossed $1 billion in annualized revenue](https://www.anthropic.com/news/anthropic-acquires-bun-as-claude-code-reaches-usd1b-milestone) within six months of launch. It did not get there because of better prompts. It got there because **Anthropic built the right harness around the right model** — a streaming agent loop, a permission-governed tool dispatch system, and a context management layer that keeps the model focused across long sessions.

And crucially: **that harness is reproducible.** Building one — not just using Claude Code — is the subject of the source material, and the architecture is worth understanding whether or not you recreate it.

## The five core components

Claude Code is built from five components that work together:

1. **A single-threaded master loop** that drives the model through perception, reasoning, and tool-execution cycles, feeding results back into context until the task reaches a terminal state.
2. A **typed tool dispatch registry** mapping tool names to handlers — bash, read, write, grep, glob — each with a strict input schema that constrains what the model can express and the harness must execute.
3. A **context management layer** combining on-demand skill injection, three-tier conversation compression, and disk-persisted memory to keep reasoning coherent across sessions exceeding the model's window.

(The full source covers multi-agents, MCP, skills systems, and context pipelines in depth; the above sketch is the load-bearing core.)

## Why the harness is the real product

The insight generalizes beyond Claude Code: **the brain (the model) is largely interchangeable across agent frameworks — what changes is the harness around it.** A bare model can think and generate code, but it can't wake up on events, remember between sessions, recover from its own failures, or enforce permission boundaries. The harness supplies all of that.

Two of the five components carry most of the weight:

- **The typed tool registry** is the permission and safety surface. Because each tool has a strict schema, what the model can request is bounded, and what the harness must execute is deterministic. This is the layer that makes tool use predictable — and why restricting tool access is both a security and a reliability move.
- **The context management layer** is what lets a single model instance stay focused across arbitrarily long work. On-demand skill injection, layered compression, and persistent memory together keep the window from filling with noise.

## The parallel with your own setup

If you use Claude Code, you don't need to rebuild this. But the architecture explains *why* certain practices work:

- **Subagents** exist because of the context layer — they push heavy work into separate windows so the main thread stays clean.
- **Hooks** are the programmable extension of the tool registry — the boundary that runs real code before an action.
- **MCP** and **skills** are how the harness consumes external capabilities without cramming them into context.

Understanding the harness reframes these as one coherent system rather than a pile of features.

## Takeaway

The lesson is the frame: **agent quality is a harness problem, not a prompt problem.** A great model in a weak harness gives you a clever brain with no hands, no memory, and no guardrails. Build (or use) the harness deliberately — the agent loop, the typed tool boundary, and the context layer are the parts that turn a model into a system you can trust for days-long autonomous work.

---
*Primary source: [Building Claude Code with Harness Engineering](https://levelup.gitconnected.com/building-claude-code-with-harness-engineering-d2e8c0da85f0) (Fareed Khan, Level Up Coding, April 2026). The $1B revenue figure links to Anthropic's announcement; the five-component model is from the source. Note: the source is a long, member-gated essay; this entry synthesizes the verifiable core architecture and frames it for practitioners.*
