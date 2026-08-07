---
title: "Loop engineering: designing agents that iterate, verify, and remember"
date: 2026-08-07
time: "10:00"
type: article
tags: [claude-code, agents, workflow, automation]
summary: "A Claude loop is a repeatable workflow around the model — trigger, context, action, verification, state, and decision. Here's how to build one that's safe, stateful, and worth scheduling."
author: "Shai Chikorel"
featured: false
cover: "/covers/loops-with-claude-code.jpg"
tldr:
  - A loop isn't "ask Claude again" — it's a repeatable workflow: trigger, context, action, verification, state update, decision.
  - Loops earn their cost when the task repeats, the output is checkable, and the next run benefits from the previous one.
  - PROGRESS.md is the loop's memory interface — read it before acting, update it before stopping.
  - Separate the worker from the checker; a verifier needs a pass/fail standard, not a vague review.
  - /loop is time-driven (interval repeats); /goal is condition-driven (continue until done) — they solve different problems.
---

## The short answer

Most Claude workflows start as manual prompting: prompt, wait, inspect, decide what to ask next. That works for one-off tasks, but breaks down when the work is **repetitive, stateful, or needs several rounds of checking**. At that point the better abstraction isn't a better prompt — it's a **loop**.

A Claude loop is a repeatable workflow around the model. It defines what triggers the run, what context Claude reads, what it's allowed to do, how the output is verified, where state is stored, and when the loop stops, repeats, or escalates to a human.

A loop has six parts:

- **Trigger** — manual command, schedule, file change, Git event, failed CI.
- **Context** — the task, relevant files, instructions, previous progress.
- **Action** — Claude performs the next step.
- **Verification** — the result is checked against a concrete condition.
- **State update** — what happened, what changed, what should happen next.
- **Decision** — stop, ask for human review, or run another iteration.

## When to build a loop (and when not to)

A loop adds structure, persistence, and automation — but also cost and complexity. It's worth it when the task is **repetitive, stateful, and checkable**:

- *Repetitive* — happens often enough to justify the setup.
- *Stateful* — each run benefits from remembering previous runs.
- *Checkable* — there's a concrete way to reject bad output.

Run a **loop-readiness check** before committing: does it repeat? can the result be verified? does Claude have context? is there a clear stop condition? is there a safe review point?

A bad first loop: "Every day, improve the product strategy document until it feels stronger." Vague, no stop condition, no verification. A good one: "Every Friday, review the strategy doc, list what changed, write a structured note to `outputs/strategy-review.md`. Do not edit the doc directly."

**The permission ladder** — most first loops should start at Level 1 or 2:
1. Read-only analysis
2. Draft output (reports in an `outputs/` folder)
3. Sandbox edits
4. Draft external action (draft PR/message/ticket)
5. Human-approved action
6. Fully automated low-risk action

## The minimum viable loop

A minimal loop needs: **one task**, **one context file**, **one state file**, **one output location**, and **one verification step**.

```
minimal-claude-loop/
├── TASK.md               # the loop's goal
├── PROGRESS.md           # state between runs
├── LOOP_INSTRUCTIONS.md  # how to behave each iteration
└── outputs/
    └── daily-review.md   # where results land
```

The first loop should be *boring by design*: read context, do one constrained job, write to a predictable place, update state, stop. Repeatability beats autonomy.

## Persistent state: PROGRESS.md

The thing that makes a loop a loop, not a repeated prompt, is **state outside the session**. This is the most important difference between prompting and loop engineering: in manual prompting, continuity lives in the conversation; in a loop, it should live in the workspace.

PROGRESS.md is the loop's memory interface. Read it before acting, update it before stopping. If it's missing, stale, or too long, the loop loses continuity.

Keep it short and structured: current state, last run, open items, blockers, needs-human-review, next run should, decisions made, do-not-repeat. **"If Claude needs it to decide the next action, keep it in PROGRESS.md. If a human may want to inspect it later, store it in `outputs/`."**

The state file is also a **control surface** and a **safety mechanism** — the Do Not Repeat and Needs Human Review sections stop the loop from retrying failed actions or silently continuing past a judgment call.

## Verification: separate the worker from the checker

A loop should not stop because Claude *says* it's finished. It should stop because a **concrete condition has been checked**: a file exists, a structure is present, a test passes, a checklist completes.

Use the **maker-checker pattern**: a worker produces, a checker evaluates against explicit criteria. Even in one Claude run, write them as separate phases. The system that generates the output should not be the only signal that approves it.

A weak checker is another optimist: "Review the output and tell me if it looks good." A strong checker has a standard:

> "For each item, return PASS or FAIL. Do not assume a missing section is present. Do not mark complete if any required item fails."

Define what happens on failure: **retry** (small, safe), **escalate** (needs judgment / risky), or **stop** (hit iteration/permission/budget limits). Add an iteration limit so it can't spin forever.

## Scheduling with /loop

Once the loop runs reliably manually, schedule it. [`/loop`](https://code.claude.com/docs/en/scheduled-tasks) is the quickest way to rerun a prompt on an interval while the session stays open.

```text
/loop 24h Run the daily project review loop for this workspace.
Follow LOOP_INSTRUCTIONS.md exactly. Read TASK.md and PROGRESS.md
first. Write the report to outputs/daily-review.md, update PROGRESS.md,
run the verification checklist, and stop if human review is required.
Do not modify any files except outputs/daily-review.md and PROGRESS.md.
```

Test with a short interval (`/loop 15m`) while watching, then move to the real cadence.

**`/loop` vs `/goal`** — they solve different problems:

- `/loop` is **time-driven**: the next run happens because time has passed (poll a deploy, review the folder each morning).
- `/goal` is **condition-driven**: Claude keeps working because a completion condition hasn't been met (continue until tests pass).

A scheduled loop needs a **stop policy** — runs that find nothing should update state quietly or note "no meaningful change"; don't generate a long report just because the loop ran. Reduce review load; don't create a new inbox.

## Takeaway

Loop engineering is the practice of designing **boundaries**: what starts the loop, what Claude can access and change, how progress is recorded, how results are verified, and when a human must review. A reliable loop doesn't depend on trusting the model — it depends on clear control.

Build the loop first, make it autonomous second. Start with one task, one state file, one output, and one verification checklist; run it manually; only then schedule it. The architecture — trigger → context → action → verification → state → review — stays the same whether the loop stays local or connects to GitHub, Slack, or CI.

---
*Primary sources: Claude Code docs on [scheduled tasks / /loop](https://code.claude.com/docs/en/scheduled-tasks) and [/goal](https://code.claude.com/docs/en/goal). Compound mechanics (PROGRESS.md, maker-checker, permission ladder) are practitioner-synthesized from the source guide; /loop and /goal behavior verified against official docs on 2026-08-07.*
