---
title: "Claude 5.5: Opus, Sonnet, and Haiku arrive with new pricing"
date: 2026-10-07
tags: [model, claude, coding, pricing]
summary: "Anthropic's Claude 5.5 family spans complex coding, everyday work, and high-volume tasks, with different API rates and tradeoffs."
author: "Shai Chikorel"
draft: true
---

Anthropic introduced **Opus 5.5** on September 22, followed by **Sonnet 5.5** on September 28 and **Haiku 5.5** on October 7. The models offer different speed, cost, and capability tradeoffs for Claude Code and API workflows.

## Choosing a model

- **Opus 5.5** targets demanding coding and long-running work. Anthropic reports lower typical workload costs than Opus 5, though actual savings depend on the task and token usage.
- **Sonnet 5.5** is positioned for everyday tasks, bug fixes, and fast iteration. Anthropic reports faster output than Sonnet 5.
- **Haiku 5.5** is intended for high-volume, cost-sensitive jobs such as classification and summaries, and can also serve as a coding subagent.

Run representative tasks and compare quality, latency, and total token usage before changing an existing workflow. Provider availability and safeguards can differ.

## API pricing

Anthropic's announcements list base input and output prices per million tokens of $4 and $20 for Opus 5.5 and $2 and $10 for Sonnet 5.5. Haiku 5.5 lists $0.10 input and $0.50 output for prompts up to 100,000 tokens, and $0.50 input and $2.50 output for longer prompts. Cache operations have separate rates. Anthropic also reduced Sonnet 5.5 cache-read pricing to $0.10 per million tokens when it announced Haiku 5.5.

Check current provider pricing and applicable long-context rates before budgeting: these figures describe the announcements and may change.

## Claude Code

The Claude Code release notes identify Sonnet 5.5 support in v2.1.284 and Haiku 5.5 as the default Haiku model on the Anthropic API in v2.1.293. Update Claude Code and check the current model documentation for your provider before relying on a model alias.

[Opus 5.5 announcement](https://www.anthropic.com/claude-opus-5-5) · [Sonnet 5.5 announcement](https://www.anthropic.com/claude-sonnet-5-5) · [Haiku 5.5 announcement](https://www.anthropic.com/claude-haiku-5-5) · [Claude Code changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
