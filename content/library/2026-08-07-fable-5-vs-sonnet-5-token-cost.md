---
title: "Fable 5 vs Sonnet 5: what a 3x token price gap actually costs you"
date: 2026-08-07
time: "09:20"
type: article
tags: [claude, models, pricing, workflow]
summary: "A practical look at the real price gap between Claude Fable 5 and Sonnet 5, and why model choice — not prompt quality — is where most token budget leaks."
author: "Shai Chikorel"
featured: false
cover: "/covers/fable-5-vs-sonnet-5-token-cost.jpg"
tldr:
  - Fable 5 ($10/$50 per million tokens) costs roughly 3–5x Sonnet 5's introductory $2/$10 rate — a gap that shows up even on trivial prompts.
  - The cheapest model isn't always the cheapest outcome: caching behavior and output volume shift the real cost per task.
  - Sonnet 5's tokenizer maps the same input to more tokens (roughly 1.0–1.35x), so recheck budgets when migrating.
  - For most everyday coding, Sonnet-tier is the price/performance default; Fable-class is for the hardest autonomous work.
  - A fresh-session benchmark on your own workload beats trusting any blog's numbers, including this one's.
---

## The short answer

Claude **Fable 5** ([launched June 9, 2026](https://www.anthropic.com/claude/fable)) is Anthropic's most capable generally available model, priced at **$10 per million input tokens and $50 per million output tokens**. **Sonnet 5** ([launched June 30](https://www.anthropic.com/pricing)) runs at an introductory **$2/$10** through August 31, then its standard **$3/$15**.

On list price, Fable 5 is **~3.3–5x Sonnet 5** depending on the window. That gap is real and shows up even on trivial prompts — but it isn't the whole story.

## The "Hello" test and why it's misleading

A cost comparison that circulated widely found a single "Hello" prompt cost over **3x more on Fable 5 than Sonnet 5** ($0.47 vs ~$0.15). The headline is true to the tariff, but the per-task framing obscures what actually drives cost:

- **Output tokens dominate.** Fable 5 returned ~80 output tokens on "Hello" versus Sonnet's 141 — so per *token* Fable was more expensive, but raw prompt cost was dominated by the session's context, not the one-word reply.
- **Cache behavior shifts the real number.** Sonnet read far more tokens from cache (cached reads are ~90% cheaper), which is why its bill was lower even with more output. Whoever caches better wins, model-to-model.
- **A single "Hello" is a bad benchmark.** It measures the tariff, not the workload. The ratio matters, not the absolute cents.

## Where the cost gap actually shows

On real coding tasks the pattern holds but gets messy, because it's not just the sticker price:

- **Output volume.** The high-end model tends to write more (longer comments, more explanation). More output at 5x output price compounds fast.
- **Slow starts / weaker caching.** If the big model re-reads context instead of hitting cache, every subsequent turn is more expensive.
- **Agent loops.** In Claude Code, one "task" is many model calls. A 3x per-token gap becomes a 3x gap on *every* tool call in the loop.

The practical rule: **model tier dominates prompt tuning as a cost lever.** You can't save a 5x price gap by writing a better prompt.

## The tokenizer gotcha

Sonnet 5 shipped an updated tokenizer that can map the *same input* to roughly **1.0–1.35x as many tokens**, depending on content. This matters when migrating between models or comparing two models' token counts — identical prompts can bill different input token totals. Any cost comparison that doesn't control for this is comparing apples to oranges.

## When to pay for Fable-class

Fable 5's case is narrow and expensive:

- The **hardest autonomous knowledge work / long-horizon coding**, where a single Fable run replaces many cheaper runs.
- Problems where **50-million-line codebases** or frontier reasoning genuinely need the extra capability.
- When **token efficiency offsets the price**: Anthropic reports Fable 5 doing in a day what took its team over two months by hand, using a third of the reasoning tokens on frontier physics research.

For everyday coding — feature work, refactors, tests, debugging — **Sonnet-tier is the price/performance default.** That matches evidence that Opus 5 deliberately launches at **half** Fable 5's price, positioned as "Fable-5-adjacent at ~half the cost."

## The one habit worth stealing

Don't trust anyone's benchmark — including this one. The reliable move is a **fresh-session cost check on your own workload**:

1. Pick 3–5 representative tasks.
2. Run each in a **fresh session** per model (so cache starts cold).
3. Record session cost, output tokens, and cache reads/writes.
4. Compare per-task cost, not per-token price.

Cold-cache fresh sessions matter because the moment two models have different cache histories, their numbers stop being comparable.

## Takeaway

Sonnet 5 is the sensible default for most Claude Code work; Fable 5 is reserved for the hardest, most autonomous tasks where its token efficiency can pay for the tariff. Budget-conscious teams should treat **model tier, not prompt quality, as the primary cost lever** — and measure fresh-session cost on their own tasks before deciding.

---
*Primary sources: [Claude Fable pricing](https://www.anthropic.com/claude/fable) and the [Anthropic pricing page](https://www.anthropic.com/pricing). Model pricing and launch dates verified against Anthropic sources on 2026-08-07; the article's per-session cost figures are the secondary author's measurements, not Anthropic's.*
