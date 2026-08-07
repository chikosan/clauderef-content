---
title: "Agentic analytics isn't text-to-SQL — it's context engineering"
date: 2026-08-07
time: "09:10"
type: article
tags: [claude-code, analytics, data, agents]
summary: "Anthropic's self-service analytics post is the clearest statement yet that reliable analytics agents are a context-and-verification problem, not a SQL-generation problem."
author: "Shai Chikorel"
featured: false
cover: "/covers/agentic-analytics-not-text-to-sql.jpg"
tldr:
  - Pointing Claude at a warehouse creates a false sense of precision — accuracy is a context and verification problem, not a code-generation one.
  - Without skills, Claude scored no better than 21% on Anthropic's analytics evals; with skills it cleared 95% aggregate and ~99% in some domains.
  - Three failure modes dominate: concept/entity ambiguity, data staleness, and retrieval failure.
  - The fix is a four-layer stack: data foundations, sources of truth, skills, and validation.
  - Skills go stale fast — Anthropic watched offline accuracy drift from ~95% to ~65% in a month before they treated maintenance as an engineering problem.
---

## The short answer

[Anthropic's post on self-service analytics](https://claude.com/blog/how-anthropic-enables-self-service-data-analytics-with-claude) is the clearest production write-up yet on why *agentic analytics is not just text-to-SQL*.

The headline: Anthropic automates about **95% of its business analytics queries** with Claude at **~95% aggregate accuracy**. But the part that matters is *how* — and almost none of it is SQL. Anthropic's own data shows Claude scored **no better than 21%** on their analytics evals without skills, and cleared **95%+, up to ~99% in some domains**, with them. The jump came from procedural guidance, not better SQL generation.

## Why text-to-SQL is the wrong frame

Text-to-SQL is the part you can demo in 30 seconds: ask in English, see a query, get a number. It feels magical. It also creates a **false sense of precision**, because none of it proves the business question was answered correctly.

Take "What was active customer revenue last month?" The SQL is the easy part. The hard part is deciding: what counts as *active*? Which customer definition is official? Gross or net? Which date field? Which refunds and fraud filters apply? The model only writes SQL *after* all those choices are made.

That's why Anthropic's framing — **"data is not software"** — is the thesis. Software has tests and deterministic proofs. Analytics has one correct answer from one correct source, with no deterministic way to prove correctness from the output alone. The agent can write perfect SQL and still be semantically wrong.

## The three failure modes

Anthropic attributes the overwhelming majority of errors to three things:

- **Concept/entity ambiguity** — "active users" or "revenue" maps to multiple plausible implementations, and the wrong one still looks professional.
- **Data staleness** — schemas, business definitions, and docs change; yesterday's correct procedure becomes quietly wrong.
- **Retrieval failure** — the right answer exists but the search space is so large the agent misses it and confidently builds on a near miss.

The warehouse alone doesn't solve these. Warehouses store data; they don't store the *meaning* of the business.

## The four-layer stack

Anthropic's answer is a stack where SQL sits *downstream* of all the hard decisions:

1. **Data foundations** — canonical, single-source-of-truth datasets, dimensional modeling, freshness checks, metadata treated as a first-class product. Fewer plausible candidates before retrieval even starts.
2. **Sources of truth** — the semantic layer, lineage, query corpus, and business context. Agents are *structurally required* to consult the semantic layer first; raw SQL is the fallback.
3. **Skills** — procedural knowledge: which source first, when to fall back, what to clarify, how to review adversarially. This is where the accuracy jump comes from.
4. **Validation** — offline evals, ablation runs, adversarial review, provenance footers, and maintenance loops.

Two counterintuitive findings stand out:

- **Don't let the LLM build the semantic layer.** Anthropic tried auto-generating metric definitions from raw tables. It produced plausible-looking definitions that encoded the very ambiguities they were trying to remove, and was *net-negative* on evals versus a smaller human-curated layer. Generate docs with Claude, but let a human own the definitions.
- **Raw query history barely helps.** Giving the agent direct access to thousands of prior SQL queries moved accuracy by less than a point. Eighty percent of the time the answer was in the corpus — the agent even read it — but still didn't use it. The bottleneck is *structure*, not access.

## The maintenance lesson

The most practical warning: **skills rot**. Skill docs describe a data model that changes daily. Anthropic watched offline accuracy **drift from ~95% to ~65% in a month** before treating skill maintenance as an engineering problem.

Their fix was boring and effective: colocate the skill markdown in the same repo as the data models, so the PR that changes a model is the same PR that updates its docs. A code-review hook flags any reporting-model change that doesn't touch a skill file. Now roughly 90% of their data-model PRs include a skill change in the same diff.

## Getting started (don't build a cathedral)

Anthropic's own advice: a handful of **canonical datasets**, a few dozen **offline evals**, and one **thin knowledge skill** capture most of the upside. Everything else is what they added once those existed.

A pragmatic starting sequence:

1. **Pick one domain**, not the whole warehouse.
2. **Create one governed source of truth** — canonical datasets, explicit metric definitions, ownership, freshness checks — before touching prompts.
3. **Put the semantic layer first**, make raw SQL a fallback.
4. **Write one thin skill/playbook** encoding the analyst's procedure: clarify, source, validate, report, cite provenance.
5. **Build a small eval set** — 20–30 real questions with expected answers beats a hundred internal demos.

## Takeaway

The same "false sense of precision" trap that Anthropic warns about applies to your own setup: wiring a frontier model straight to a database and calling it analytics is how you end up with confident wrong numbers. The durable habit to borrow is the **provenance footer** — every analytics answer should state its source tier (semantic layer › curated reference › raw table), freshness, and owner. If you can't produce that footer, neither can your agent, and that's the signal that the context layer is missing.

---
*Primary source: [How Anthropic enables self-service data analytics with Claude](https://claude.com/blog/how-anthropic-enables-self-service-data-analytics-with-claude) (Anthropic, June 3, 2026). Facts (95%/~99%, 21%, three failure modes, drift 95%→65%) verified against the Anthropic primary post on 2026-08-07.*
