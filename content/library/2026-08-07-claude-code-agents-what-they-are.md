---
title: "What 'agents' actually means in Claude Code"
date: 2026-08-07
time: "09:40"
type: article
tags: [claude-code, agents, subagents, context]
summary: "'Agent' means at least four different things in Claude Code. Sorting them — and the subagent-vs-skill boundary — is the key to building a maintainable workflow."
author: "Shai Chikorel"
featured: false
cover: "/covers/claude-code-agents-what-they-are.jpg"
tldr:
  - The word agent is overloaded: the agentic CLI, subagents, agent teams, and the Agent SDK are four distinct layers.
  - A subagent runs in its own context window with its own system prompt, tools, and permissions — not inside your main thread.
  - A skill changes what Claude knows; a subagent changes who does the work, where, and with what tools.
  - The description field is the routing interface — write it behaviourally, not as an identity.
  - Agent teams are a separate multi-session layer, not "more subagents" — and they're experimental by default.
---

## The short answer

Most practitioners think a Claude Code "agent" is "a skill with extra steps." That mental model is wrong in a useful way.

A skill loads instructions into your current conversation. A **subagent runs in its own context window**, with its own system prompt, its own tool access, and its own permissions, then hands back a result. Where the work happens — and where the tokens are consumed — is the difference that matters.

But "agents" in Claude Code means at least four things, and conflating them makes the feature hard to reason about.

## The four meanings of "agent"

1. **Claude Code itself is an agentic environment.** The CLI already has tools, an execution loop, and the ability to plan and act across steps. It's agentic before you configure anything.
2. **Subagents are the custom in-product primitive.** When someone says "I'm building an agent," they almost always mean a subagent: a specialized assistant that runs in its own context window with a custom system prompt, specific tool access, and independent permissions.
3. **Agent teams are a separate, multi-session layer.** Subagents work within a single session; agent teams coordinate across separate sessions. Teams are independent Claude Code instances that communicate via a shared task list and peer messaging. They're experimental, disabled by default, and require an environment flag.
4. **The Claude Agent SDK** is the same tools and agent loop exposed as a programmable library, outside the CLI.

This post is about layer 2 — subagents.

## Why subagents exist: context management

The primary reason is **finite context**. Every tool call, every file read, every partial analysis lands in the window and stays there. As a session grows, it fills with intermediate work — noise that degrades performance (call it *context rot*).

A subagent changes the shape of that problem. Ask it to investigate why a test suite is failing: it reads 20 files, greps for error patterns, checks config — all in *its own* window. Your main thread gets back a clean summary, not the search. The official docs put it directly: subagent work doesn't consume your main context.

Three secondary reasons:

- **Specialization** — a focused reviewer with your team's standards in its own system prompt is more reliable than a general assistant holding standards alongside everything else.
- **Constraint enforcement** — you specify exactly which tools a subagent can use. A read-only research agent that can't write files or run shell is a different risk profile from the main assistant.
- **Cost control** — subagents can run on a different model. Routing lightweight tasks to Haiku while the main session runs on Sonnet is a real cost handle.

## Building a subagent

A subagent is a Markdown file with YAML frontmatter, in `.claude/agents/` (project) or `~/.claude/agents/` (personal).

```yaml
---
name: code-reviewer
description: Reviews code changes for quality, security, and best practices.
 Use proactively after any significant code change.
tools: Read, Glob, Grep
model: sonnet
---

You are a code reviewer. When invoked, read the changed files and provide
specific, actionable feedback. Focus on what matters. Flag security issues
first, then logic problems, then style.
```

The fields:

- **name** — unique identifier, lowercase, hyphens only.
- **description** — the most important field. Claude reads this to decide *whether to delegate*. Write it behaviourally: what the agent does and when to use it. "Use proactively" is a documented signal to activate without being asked.
- **tools** — restrict what the agent can reach. `disallowedTools` inherits the main toolset then removes specific tools.
- **model** — route to `sonnet`, `opus`, `haiku`, or a full model id. Omit to inherit the main session model.
- **Body** — becomes the agent's system prompt. It receives this, the working directory, and nothing else from the main session.

This reviewer can read and search but cannot edit or run shell — a read-only reviewer can't accidentally modify what it's reviewing.

## Agents vs skills: the boundary

Skills and subagents both live in `.claude/`, both use frontmatter, both are sets of instructions. The difference is where the work happens:

- **A skill** loads into your current conversation; its instructions and reference files become part of the active context. Claude follows them in the same thread, and every step accumulates in your main window.
- **A subagent** runs separately in its own context window and returns a result.

A sentence that captures it:

> A **skill** changes what Claude knows or how it should approach a workflow.
> A **subagent** changes *who* is doing the work, in what context, and with what tools.

Concrete example: to enforce your team's review standards *throughout a session*, use a skill. To review 40 files in one pass *without filling your main context*, use a subagent.

## Best practices

- **The description is the routing interface.** Claude reads descriptions to decide when to delegate — it does *not* read the body first. Write activation conditions, not identity. "You are an expert reviewer with 20 years of experience" belongs in the system prompt, not the description.
- **Restrict tools deliberately.** An agent that inherits all tools is one you can't reason about when it breaks. Grant only what the task needs. Tool restriction is both security and predictability.
- **One task per agent.** A single description for "reviews code, writes tests, updates docs, and handles deploys" routes inconsistently. Three narrow files beat one broad one. The community consensus — collections of 100+ narrow subagents — points the same way: many focused agents outperform one general-purpose one.
- **Use `model` as a cost lever.** `haiku` on routine agents cuts cost; `opus` justifies itself on long, reasoning-heavy contexts. The default (`inherit`) applies the most powerful model to everything, which is often overkill.

## A quick word on agent teams

Agent teams are independent Claude Code sessions coordinated across *separate* sessions via a shared task list and peer messaging. They're experimental, disabled by default, and consume significantly more tokens (each teammate has its own billed context window).

The practical signal: **as long as your subagents report back to you and don't need to talk to each other, you don't need agent teams.** The moment one needs to hand off findings to another, that's when the upgrade earns its cost.

## When subagents are the wrong tool

Anthropic's own guidance: find the simplest solution, and only increase complexity when needed.

Skip a subagent when:

- The task is **one-off** — the authoring overhead (naming, description, tools, testing, maintenance) only pays back for recurring workflows.
- **Context isn't the problem** — if the work is lightweight, a well-written prompt in the main session is faster and easier to debug.
- You're tempted by the **monolith trap** — one agent covering research, implementation, review, and docs is untestable and inconsistently selected.

## Takeaway

Subagents are a **context management tool and an execution boundary**, not a capability upgrade. One agent, configured carefully — a focused description, a restricted tool set, a single clear job — is a reasonable afternoon's work. Complexity can grow from there, but it doesn't have to start there.

---
*Primary sources: Claude Code docs on [subagents](https://code.claude.com/docs/en/sub-agents) and [agent teams](https://code.claude.com/docs/en/agent-teams), and Anthropic's context-engineering guidance. Definitions and experimental status verified against official docs on 2026-08-07.*
