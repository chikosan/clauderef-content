---
title: "Building a production agent harness around Claude Code"
date: 2026-08-07
time: "09:50"
type: article
tags: [claude-code, agents, architecture, automation]
summary: "What it actually takes to turn Claude Code into a multi-agent pipeline that watches Slack, opens MRs, self-heals CI, and improves its own code — a six-layer production harness."
author: "Shai Chikorel"
featured: false
cover: "/covers/production-agent-harness.jpg"
tldr:
  - A bare LLM is a brain in a jar — the harness is the scaffold that gives it senses, hands, and memory.
  - Three gaps close the distance to production: reactivity, persistence, and quality.
  - A structured output contract (not free prose) is the single biggest leverage point for keeping LLM output usable in a pipeline.
  - Confidence must be a gated, mechanically-capped number — not a self-reported score.
  - Self-improvement that modifies the harness's own code, human-reviewed, is what makes it production-grade.
---

## The short answer

A coding agent on its own is a brain in a jar. It can think and write code, but it can't answer your Slack DM at 3am, retry a failing CI job, or remember that a reviewer's question is still unanswered. The **harness** — the runtime scaffold around the LLM — is what gives it senses, hands, and memory.

This is a top-down view of one team's production multi-agent pipeline built on Claude Code: one that's watched a Slack channel, opened MRs against five internal repos, addressed reviewer comments overnight, and quietly self-healed CI for several months. The brain (the model) is essentially interchangeable; what changes is the harness around it.

## Why a harness, not just an agent

Three failure modes appear within the first week of wiring a chat UI in front of an LLM:

1. **It loses context when you close the tab.** A real task spans days. No single LLM call holds that state.
2. **It can't react to external change.** A reviewer comments at 4pm; CI fails on the third commit. The agent must wake up on events, not poll forever.
3. **It can't recover from its own failures.** It pushes a commit, CI breaks, and the operator has to re-explain tomorrow.

The harness closes three corresponding gaps: **reactivity**, **persistence**, and **quality**.

## The six layers

### 1. Event ingestion
The harness wakes up on external signals — Slack mentions, GitLab MR/CI events, PagerDuty pages — funneled into a unified dispatch queue. The LLM never polls; it gets called. The practical details matter: freeze cursors on empty Slack polls to avoid skipping occasions of consistency lag, dedupe by message tsc past, and pair Socket Mode with a poller as a safety net so connection drops don't swallow messages.

### 2. Agent orchestration
Workers spawn as transient units carrying a JSON payload naming a workflow + case directory + thread context. Each pipeline is a long-running Claude Code invocation with a curated prompt and a writeable scratch space. The choreography uses several specialized agents chained at defined hand-off points: an investigation agent, a long-lived follow-up agent, a consolidator, and a "doer" that makes the change, watches CI, and addresses review comments.

Two non-obvious choices: everything runs in **git worktrees** (concurrent cases never step on each other), and the case directory is the single source of truth to which every workflow resolves.

### 3. Persistent state
State lives in three layers: in-memory caches (rebuildable), local JSON maps (restart-safe), and **git-synced workspaces** (durable, cross-machine). State lives in git, not in a process — that's how a session resumes on a laptop or a remote VM with full context.

### 4. Self-healing loops
Three loops close without operator intervention: CI auto-fix (capped at 3 consecutive failures, then escalate), reviewer auto-reply (author-aware dedup so it doesn't re-fire), and an MFA-gated token refresh. Without retry budgets and self-recognition, loops spiral — one flaky test once produced 80 no-op commits in an afternoon.

### 5. Observability
Four surfaces: live Slack status updates (editing a single message), structured logs to grep, Slack DMs for terminal events (MR opened/merged, escalation), and a system log. Deliberately **no dashboard** — Slack and grep are the consoles. MCP health gets its own watchdog so an expired token surfaces as "tool returned empty result" instead of "the agent is stupid today."

### 6. Human-in-the-loop control
All operator interaction flows through a single self-DM with six command families (task, on-call, MR control, pause, finalize, registry). The pause kill switch is calibrated precisely: it silences automatic dispatch driven by *other people's* activity, but never the operator's own commands.

## The single biggest leverage point: structured output

The team's own conclusion: **free-form prose is the enemy of a pipeline.** Every investigation iteration ends with a parseable JSON contract — `completion_report` — with status, confidence, open questions, unchecked sources, contradictions, assumptions, and a draft response. The gates evaluate the parsed JSON as deterministic Python, not prose.

## Quality gates: making confidence mean something

Confidence would be marketing noise if the model could just write `95` without backing it up. The harness enforces a **19-function gate framework** with three families:

- **G-gates** (logical consistency) — reasoning can't contradict itself across rounds; an increase in open questions invalidates a confidence rise.
- **N-gates** (structural completeness) — artifacts must be fully formed; every fix pairs with a verify action.
- **A-gates** (assertion ceilings) — mechanical limits the model can't override through prose. Confidence is *arithmetically capped*: `1.0 − (open_questions × 0.08) − (unchecked_sources × 0.05)`, no matter what the model writes.

Gate violations become guard notes prepended to the next iteration's prompt — the forcing mechanism. Gate violations don't block the model; they make the model's previous violations the first thing it reads next round.

## Adversarial review: the red team inside

Once the investigation declares itself done with confidence ≥ 70, control passes to a **separate Claude invocation** playing adversarial reviewer. It evaluates 15 dimensions and produces a verdict — critical issues send the loop back; two consecutive minor-only passes or a clean pass completes it. The same model playing a different role catches a meaningful fraction of self-flattery that single-prompt iteration misses. A structurally separate red-team reviewer sees only the problem statement and final conclusion, checking whether the conclusion was reachable without the investigation's framing.

## Self-improvement: the harness fixes itself

The distinguishing feature: the harness's substrate is its own source code, and each closed case feeds back.

- **Per-case repair** — a gap analyzer identifies where the harness underperformed and opens one PR against the harness's own codebase. Human merge, no human write.
- **Cross-case reinforcement** — failure modes are counted per project; a weekly cron suggests SOP changes when a mode crosses thresholds. Deliberately *not* auto-applied, because automated decisions that compound mistakes are a known failure class.

After 20–30 cases, each project's SOP is personalized to its own failure patterns. The harness dogfoods this on itself: `pr-ci-fixer` picks up failures on the harness's own improvement MRs, so the agent keeps its own CI green.

## Takeaway

The load-bearing lesson is the **meta-loop**: every scar was caught because a real ticket exercised it. The build loop and operate loop are the same loop at different timescales.

> Build the loop first. Make it autonomous second. An autonomous system without a feedback path into its own substrate is just a faster way to ship the same set of mistakes, at scale.

---
*This is an architecture write-up of a practitioner's production system built on Claude Code. Concepts and quotes reference the original essay by Messi Li (May 2026); the mechanism design here is original synthesis. No affiliation with Anthropic.*
