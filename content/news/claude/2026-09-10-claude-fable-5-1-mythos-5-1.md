---
title: "Claude Fable 5.1 lowers cache-read costs; Mythos 5.1 stays restricted"
date: 2026-09-10
tags: [model, fable, coding, pricing, security]
summary: "Fable 5.1 launches broadly with stronger long-running work and cheaper cache reads, while the same underlying Mythos 5.1 model is limited to trusted cyber and life-science programs."
author: "Shai Chikorel"
draft: true
---

Anthropic released **Claude Fable 5.1** across Claude, Claude Code, the Claude API, AWS, Google Cloud, and Microsoft Azure. **Claude Mythos 5.1** uses the same underlying model with different safeguards and is available only through vetted cybersecurity and life-science access programs.

## What changed

- **Long-running work is the main product claim.** Anthropic positions Fable 5.1 for difficult coding, knowledge work, and research tasks that run across many tool calls. In Claude Code, the model supports `low`, `medium`, `high`, `xhigh`, and `max` effort and defaults to high effort when no other setting wins.
- **Cache reads are substantially cheaper.** API cache reads cost $0.25 per million tokens, 75% below Fable 5. Standard input and output prices remain $10 and $50 per million tokens. Anthropic estimates about 25% lower cost for a typical workload and as much as 45% for cache-heavy agentic work; those percentages come from its August 2026 usage sample rather than a guarantee for every prompt.
- **The model is broadly available, but Mythos is not.** Developers can request `claude-fable-5-1` on the Claude API. Claude Code v2.1.257 or later can select it with `/model fable`; Claude apps gateway deployments may need the full model ID if their gateway has not changed the alias.
- **Enterprise safeguards are changing separately.** Anthropic says its Enterprise Frontier Safeguards will roll out in phases beginning later in 2026, using customer-controlled cloud infrastructure to support misuse detection with zero-data-retention privacy. This future availability should not be treated as a feature already enabled for every enterprise deployment.

## Why it matters

The practical upgrade is not simply a higher benchmark score. Reusing a large cached context can make repeated repository and agent workflows materially less expensive, while high effort remains a deliberate latency and usage choice. Teams should compare cost per completed task on their own harness, including retries and review time, instead of comparing token prices alone.

Mythos 5.1 has a different operational boundary. Its broader cyber and biology capabilities are not a selectable general-purpose tier, and Anthropic says Fable safeguards may route some flagged cyber or biology requests to an Opus model. Security and life-science teams should confirm access and routing with their Anthropic account configuration before designing a production workflow around it.

[Official announcement: Claude Fable 5.1 and Claude Mythos 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1) · [Claude Code model configuration](https://code.claude.com/docs/en/model-config)
