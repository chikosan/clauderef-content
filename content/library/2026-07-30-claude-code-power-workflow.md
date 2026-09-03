---
title: "A 20-minute tour of Claude Code power workflows"
cover: "/covers/claude-code-power-workflow.jpg"
date: 2026-07-30
time: "18:40"
type: video
draft: true
youtube: ""
embed: true
duration: "21:04"
tags: [workflow, skills, video]
summary: "Walkthrough of custom skills, plan mode and parallel reviews — with my notes and timestamps."
author: "Community talk"
source: ""
tldr:
  - Plan mode first, always — it converts vague asks into reviewable steps.
  - Custom skills are just markdown with frontmatter; version them in the repo.
  - Parallel review agents catch cross-file issues a single pass misses.
---
## What the talk covers

A 20-minute walkthrough aimed at people who already use Claude Code daily and
want to move past single prompts into repeatable, safer workflows. The speaker
builds up from one idea: give the model a narrow job with a defined output
shape, then keep your own thread for the decisions.

- **00:40** — why plan mode changes the failure mode. You review intent before
  any file changes, not the diff afterwards. It converts a vague ask into a
  reviewable list of steps, which is where most quality is won or lost.
- **04:10** — anatomy of a custom skill: markdown with frontmatter. Fields like
  `allowed-tools`, `context: fork`, and dynamic context injection determine what
  the skill can touch and what context it is handed. Skills are just files, so
  version them in the repo like any other code.
- **11:25** — `/ultrareview` on a large diff, and why it beats one long,
  meandering review pass. Splitting the review gives each pass a narrow lens and
  makes the output easier to act on.
- **17:50** — the configuration that matters day to day: model selection, effort
  level, and permission settings rather than cosmetic options.

## The through-line

Four different features, one recurring pattern. Whether it is plan mode, a
custom skill, a parallel review, or config, the lesson is the same: **narrow the
job, define the output shape, and keep control in your own thread.**

Plan mode is the lowest-cost version of this — it forces intent to be explicit.
Custom skills make a repeatable procedure a first-class, versionable artifact.
Parallel review agents are how you apply the pattern at scale without flooding
your main context. Together they turn Claude Code from "a smart autocomplete you
prompt carefully" into "a workflow you can reason about."

## My takeaway

The talk is valuable less for any single tip than for the operating model it
demonstrates. Before starting any non-trivial task, decide: what is the narrow
job, what shape should the output take, and which decisions stay with me? Once
those three answers are clear, almost everything else is configuration.

That is the same discipline behind production agent harnesses: the model does
the focused work, and a defined boundary — plan approval, a skill's allowed
tools, a structured report — keeps the result predictable. Adopting even the
cheapest version of that, plan mode on anything touching more than a file or
two, is the single fastest quality upgrade.
