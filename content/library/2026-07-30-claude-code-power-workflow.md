---
title: "A 20-minute tour of Claude Code power workflows"
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

## Notes

- **00:40** — why plan mode changes the failure mode: you review intent, not diffs.
- **04:10** — anatomy of a custom skill: `allowed-tools`, `context: fork`, dynamic
  context injection.
- **11:25** — `/ultrareview` on a large diff, and why it beats one long review.
- **17:50** — config that actually matters day to day.

## My takeaway

The pattern that repeats through the whole talk: give the model a narrow job with
a defined output shape, then keep your own thread for decisions.
