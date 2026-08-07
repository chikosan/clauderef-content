---
title: "Cutting Claude Code token usage: enforce, don't suggest"
date: 2026-08-07
time: "10:10"
type: article
tags: [claude-code, tokens, mcp, hooks, workflow]
summary: "One practitioner's claim of 90%+ token savings comes from a 5-layer compression stack plus hooks that enforce it — the key insight is that suggestion isn't enforcement."
author: "Shai Chikorel"
featured: false
cover: "/covers/cut-claude-code-token-usage.jpg"
tldr:
  - A claim of 90%+ token savings stacks 5 compression layers, each catching what the previous missed.
  - The core insight: suggestion isn't enforcement — hooks that block the wasteful path beat a thousand words of CLAUDE.md.
  - Codebase memory MCP trades file reads for a knowledge graph (reported ~99% off on structural queries).
  - Context virtualization and a shell/API compression layer shrink large output before it enters context.
  - The numbers are self-reported and the tools pull third-party code — treat the stack as inspiration, not a copy-paste.
---

## The short answer

A [widely-circulated account](https://github.com/sgaabdu4/claude-code-tips) claims to cut Claude Code token usage by **90%+** using a **5-layer stack** where *each layer catches what the previous missed* — plus hooks that **enforce** the stack so Claude can't slip back to the lazy path.

The takeaway worth stealing is not the specific 90% figure (it's self-reported and very setup-specific) — it's the framing: **"Don't tell Claude to be efficient. Enforce it. One hook that blocks a wasteful pattern beats 1,000 words of CLAUDE.md."**

## The five layers

Each layer sits at a different point in the pipeline:

1. **Codebase Memory MCP** (knowledge graph) — trade file reads for structured queries. Reported ~99% off on code-exploration tokens.
2. **Context-mode** (output virtualization) — sandbox large outputs, index them into a searchable store, and return only a summary. Reported ~98% off on large outputs.
3. **RTK** (shell compression) — a binary that compresses CLI output in place before it enters context. Reported 60–90% off shell output.
4. **Headroom** (API-layer proxy) — compresses the whole prompt before it leaves the machine, including conversation history and system prompts. Reported 47–92% off.
5. **Caveman** (output style) — makes Claude itself talk less: no filler, no pleasantries. Reported 50–75% off Claude's own responses.

## The enforcement insight

The distinctive part is **enforcement via hooks**. The author doesn't just suggest using the knowledge graph first — a `PreToolUse` hook **blocks** the first `Read`/`Grep`/`Glob`/`Search` call until a `codebase-memory-mcp` tool has been used. Once the marker exists, the gate self-disarms for the rest of the session.

A second hook (`bash-ban-raw-tools`) blocks `cat`/`grep`/`find`/`head`/`tail` via Bash — because Bash output bypasses every compression hook and goes straight to context. Raw truncation pipes (`| head`) are also rejected, since they flood context before the trim.

That's the transferable principle: **make the efficient path the only path that exists.** Claude takes the path of least resistance every time.

## Quick wins before any hooks

Three zero-effort moves help immediately:

- `/clear` aggressively — short focused sessions beat long ones.
- **Disable unused MCP servers** per session — unused servers burn context silently via tool descriptions.
- **Prefer Mermaid over prose** for architecture — a 6-line diagram carries the shape of 3 paragraphs at a fraction of the tokens.

## A note on the numbers

This stack is a **power-user, opinionated setup** with real security caveats:

- The claimed percentages are individual measurements in one specific project — treat them as directional, not a guarantee.
- The installer pulls third-party code from PyPI, npm, plugin marketplaces, and GitHub releases. **Audit, pin, or verify those dependencies** before use on anything sensitive.
- Several layers (Headroom, context-mode, hooks, MCP servers) can see prompts, tool outputs, code, logs, and session data — treat them like local tools with access to secrets.
- The config drops permission prompts (`defaultMode: auto`, skip-dangerous flags), which means fewer human checkpoints before commands run.
- If any of that's unacceptable, do a manual install, skip the shell wrapper, and keep permission prompts on.

## Takeaway

The durable lesson isn't "stack 5 plugins." It's the **enforcement mindset**: if you want Claude to stop wasting tokens, don't just tell it — make the wasteful path impossible. Whether that's a hook that blocks raw `cat`/`grep`, a tool that virtualizes large output before it hits context, or an aggressive default-effort setting, the win comes from boundaries Claude physically can't cross — not from a better worded prompt.

---
*This is a practitioner write-up (Abid Abdul Gafoor, April 2026) with companion repo [sgaabdu4/claude-code-tips](https://github.com/sgaabdu4/claude-code-tips). The percentages are the author's own measurements. Claude Code mechanics (MCP disable, /clear, hooks) verified against official docs where applicable; the specific third-party tool claims are not independently verified on 2026-08-07.*
