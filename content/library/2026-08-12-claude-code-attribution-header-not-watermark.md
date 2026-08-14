---
title: "Claude Code's attribution header is not an AI watermark"
date: 2026-08-12
time: "10:30"
type: article
summary: "Claude Code sends attribution metadata on some direct API traffic, but official sources do not support claims of an invisible signature in every generated file or response."
tags: [claude-code, security, privacy, api]
author: "Shai Chikorel"
cover: "/covers/claude-code-attribution-header-not-watermark.jpg"
featured: false
draft: false
tldr:
  - The documented signal is a Claude Code attribution header used on certain direct Anthropic API connections.
  - It is separate from visible commit and pull-request attribution configured in `settings.json`.
  - No official source found supports the claim that every generated file or text response contains an invisible watermark.
  - Custom gateways should test caching and compatibility before disabling the header with `CLAUDE_CODE_ATTRIBUTION_HEADER`.
---

## The short answer

Claude Code has **attribution metadata**, but calling it an invisible watermark embedded in every AI-generated file and response is not supported by Anthropic's public documentation or release notes.

The official evidence points to an attribution header associated with Claude Code requests on some direct Anthropic API connections. A header travels with an API request; it is not automatically part of the model's prose, source code, image, or file bytes. If generated output is copied elsewhere, an HTTP or request-level header does not travel inside that content.

## Three things that are easy to mix up

Claude Code has several attribution mechanisms with different purposes:

- **Request attribution** — metadata sent with certain model requests. Claude Code 2.1.229 explicitly mentions `CLAUDE_CODE_ATTRIBUTION_HEADER` for direct Anthropic API connections.
- **Git attribution** — configurable text added to commits and pull requests. The `attribution` setting can customize or omit those visible bylines.
- **Usage attribution** — product analytics that break down usage by skills, agents, plugins, MCP servers, and other entry points.

None of these is evidence of a hidden forensic marker inserted into every generated document. A content watermark would need to survive copying, formatting, file conversion, and other transformations. Anthropic's cited Claude Code materials do not announce such a system.

## What the official release actually confirms

Claude Code 2.1.229 fixed auto mode failing on every tool call when users disabled the attribution header through `CLAUDE_CODE_ATTRIBUTION_HEADER` on direct Anthropic API connections. That sentence confirms the environment variable and that the header participates in this request path.

It does not establish that the metadata identifies a particular generated file, proves authorship, or can be extracted from pasted text. It also does not say the mechanism applies to every Claude product, every authentication path, or every third-party provider.

There is a separate public GitHub issue about the header interacting poorly with prompt caching behind custom `ANTHROPIC_BASE_URL` gateways. That issue is useful operational evidence, but it is a community report rather than a product guarantee. Treat its implementation observations as something to reproduce in your own gateway, not as official documentation of intent.

## Why gateway operators should care

Even when metadata is not a watermark, it can affect infrastructure. Custom gateways commonly normalize, forward, log, or reject unfamiliar fields. Metadata placed in a cache-sensitive request segment can also change cache keys.

If you operate a gateway:

1. Capture sanitized request structure in a test environment without logging prompts or credentials.
2. Compare cache-hit behavior across repeat requests.
3. Test both the default and `CLAUDE_CODE_ATTRIBUTION_HEADER=0` paths.
4. Upgrade to Claude Code 2.1.229 or newer before testing auto mode with the header disabled.
5. Document the compatibility decision for your users.

Do not disable metadata reflexively. It may support billing, routing, safety, or product diagnostics, and the public docs do not fully specify the consequences. The environment variable is an escape hatch, not proof that disabling it is always harmless.

## What this means for generated content

Do not use this header to claim that a file was or was not AI-generated. It is not a reliable content-authenticity mechanism. Conversely, removing visible Claude Code commit attribution does not prove that Claude was uninvolved; it only changes the configured Git byline.

If provenance matters, use explicit records: reviewed commits, signed commits, build attestations, documented AI-use policies, and source-control history. Those mechanisms describe how an artifact was produced without depending on an undocumented hidden signal.

## Takeaway

The precise claim is narrower and more useful: Claude Code can attach attribution metadata to some API traffic, and custom gateways should test how it behaves. Until Anthropic publishes a content-watermark specification, claims of an invisible signature in every response should be treated as unverified.

---
*Product behavior verified against the [Claude Code 2.1.229 release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.229), [official attribution settings](https://code.claude.com/docs/en/configuration), and the public [Claude Code attribution-header issue](https://github.com/anthropics/claude-code/issues/50085), which is treated as community evidence rather than an Anthropic product statement.*
