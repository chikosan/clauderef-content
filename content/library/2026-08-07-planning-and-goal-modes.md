---
title: "Effort, plan mode, and /goal: the controls that actually matter"
date: 2026-08-07
time: "09:30"
type: article
tags: [claude-code, workflow, agents, planning]
summary: "Reasoning effort, plan mode, and /goal solve different problems. Match the control to the task instead of defaulting to 'high effort' — these are the levers that separate prompt engineering from workflow engineering."
author: "Shai Chikorel"
featured: false
cover: "/covers/planning-and-goal-modes.jpg"
tldr:
  - Higher effort isn't intelligence — it's budgeted deliberation that costs more tokens and money.
  - Scale effort to reasoning burden, not to how important the task feels.
  - Plan mode adds a reviewable phase boundary, so you judge "is this the right plan?" before any file changes.
  - /goal (v2.1.139+) keeps Claude working across turns until a small fast model confirms a completion condition.
  - A good goal needs an outcome, a verification surface, constraints, boundaries, and a stop condition.
---

## The short answer

Claude Code's most-hyped setting — reasoning "effort" — matters less than the discipline you apply before you prompt. Three controls solve three different problems:

- **Effort level** — *how much* should Claude deliberate?
- **Plan mode** — *when* should Claude wait for approval before editing?
- **/goal mode** — *when* should Claude keep going without being asked?

The tools get confused with each other, so it's worth separating them. If you learn these three in Claude Code, the same mental model carries to Codex and other agentic coding tools, which are converging on the same control surface.

## Effort levels are budgeted deliberation, not intelligence

Effort levels sit on what Anthropic calls the **test-time-compute curve**: the model can reason before it acts, generating more or fewer internal steps and evaluating broader or narrower approaches. Higher effort uses more tokens to check more and different approaches. That's the whole story — "max" isn't magic, it's just more tokens than "medium".

Two patterns matter:

- Effort **saturates**: on the accuracy-vs-tokens curve, `xhigh` captures most of the power and the jump to `max` is negligible.
- Newer models shift the curve: what needed `max` on one model generation can be `medium` on the next.

So the practical rule is: **scale effort to reasoning burden, not to perceived task importance.**

- `low` — find a file, explain a function, run a known command.
- `medium` — standard bug fixes, adding tests, straightforward refactors (a well-calibrated default).
- `high`/`xhigh` — architecture decisions, multi-file migrations, debugging with an unclear root cause, security-sensitive code, public API changes.

Changing it is one command: `/effort`, then arrow keys and Enter.

## Plan mode: correct misunderstandings before they're baked into code

The most common way coding agents go wrong is **timing**, not reasoning. Plan mode creates a phase boundary:

```
inspect → reason → propose plan → wait
```

The agent explores and proposes without editing. It does write a plan to a staging area you can read, so you fix misunderstandings at the cheapest possible moment. Anthropic's best-practices workflow is four phases — **Explore → Plan → Implement → Verify** — and plan mode enforces the boundary between Plan and Implement.

The deeper benefit: plan mode *changes the question you ask*. Without it the question is "Did Claude do this correctly?" With it, the first question is "Is this the right plan?" — much easier to answer before files change.

Plan mode is the right default for anything touching more than two files, involving architecture, or carrying non-trivial reversal cost. Skip it only when the change is a single unambiguous line, or you're asking for an explanation rather than an implementation.

## /goal mode: a finish line Claude works toward on its own

[`/goal`](https://code.claude.com/docs/en/goal) (Claude Code **v2.1.139+**, May 2026) sets a completion condition and Claude keeps working across turns until the condition is met. The loop is **work → check → continue or complete**, not *work → wait → you decide → continue*.

The key mechanism: after each turn, a **small fast model** (Haiku by default) checks whether your stated condition holds. If yes, the goal clears and control returns; if no, Claude starts another turn. That evaluator is separate from the model doing the work — completion is decided by a fresh model, not the one that's been working. Pair `/goal` with auto mode for unattended tool calls.

The catch: `/goal` is only as good as the goal you give it. **A vague goal produces a vague loop.** "Improve code quality" gives the evaluator nothing to test.

### Writing a goal with a finish line

A well-formed goal has five parts:

- **Outcome** — what should be true when done
- **Verification surface** — how to confirm it (a command to run, an artefact, a metric)
- **Constraints** — what must not change
- **Boundaries** — which files/directories are in scope
- **Stop condition** — when to halt and report a blocker instead of trying forever

```text
/goal Make tests/auth/test_login.py pass on the current branch,
verified by running pytest tests/auth/test_login.py with exit code 0.
Preserve the existing public API. Only modify files under src/auth
and tests/auth. If a test requires external credentials not available
locally, stop and report which credential and what step failed.
```

One constraint worth knowing: the condition field has a **4,000-character limit** — generous for a well-structured goal.

## Four practical combinations

- **Low effort + inspect only** — exploration with no side effects. Fast and cheap.
- **High effort + plan mode** — architecture decisions and migrations; understand full scope before touching files.
- **Plan → review → goal** — the most reliable pattern for substantial work: spend a turn getting the plan right, review it, then let a `/goal` execute it autonomously.
- **Goal with strict boundaries** — iterative work on a well-defined scope where you want Claude to keep going but not wander.

## When NOT to use these modes

- **Skip high effort** when the task is simple and obviously right. `xhigh` on a rename costs tokens and latency for nothing.
- **Skip plan mode** when there's genuinely one sensible approach — the round-trip has no value.
- **Skip goal mode** when the finish line is vague with no verification command, or when the work could cause broad unintended changes before a human checkpoint. Goal mode reduces turn-by-turn oversight — a feature for test repair, a risk for anything touching production.

## Takeaway

Stop thinking of these as separate settings to configure. Treat them as questions to answer before every non-trivial task:

1. **How complex is the reasoning?** → set effort accordingly.
2. **Is the path known?** → if not, plan first.
3. **Does the work need iteration?** → write a goal with a finish line.

A well-scoped prompt with the right effort level and a clear plan beats an elaborate chain of clever instructions almost every time.

---
*Primary sources: Claude Code docs — [Keep Claude working toward a goal](https://code.claude.com/docs/en/goal), model configuration, and best practices. The /goal version (2.1.139, May 2026) and evaluator mechanism verified against the official docs on 2026-08-07.*
