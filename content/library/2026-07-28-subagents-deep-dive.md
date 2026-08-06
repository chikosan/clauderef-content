---
title: "Subagents, properly: when forking context beats one long thread"
date: 2026-07-28
time: "09:15"
type: article
tags: [agents, workflow, context]
summary: "A practical model for when to spawn a subagent, what to put in its prompt, and how to keep the parent thread cheap."
author: "Shai Chikorel"
cover: "/covers/subagents-deep-dive.jpg"
featured: true
tldr:
  - Spawn a subagent when the work is read-heavy and the findings compress well.
  - Keep the parent thread as the plan; let children do the searching.
  - Return a short structured report, not a transcript.
---

## Why fork at all

A single long thread pays for every file it ever read. A subagent reads the same
files in its own context, then hands back a summary a fraction of the size.

## The rule of thumb

Fork when **input tokens are large and the useful output is small**. Exploring a
codebase, auditing dependencies, scanning logs — all ideal.

```bash
# ask for a report, not a narration
claude -p "Find every place we read process.env directly. Return a table: file, line, var."
```

## What to put in the subagent prompt

- The exact question, with the shape of the answer you want back.
- The boundaries: which folders, which file types.
- A hard instruction to return findings only.

## Keeping the parent cheap

Treat the parent thread as a plan document. Paste the report, act on it, and
`/clear` once the task is done — it is cheaper than `/compact` when you no
longer need the history.
