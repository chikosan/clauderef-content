---
title: "Is Claude Code auto mode now the default? What actually changed"
date: 2026-08-09
time: "16:14"
type: article
summary: "Claude Code removed auto mode's opt-in consent step, but that is not the same as silently replacing every user's configured permission mode."
tags: [claude-code, security, workflow, automation]
author: "Shai Chikorel"
featured: false
draft: false
tldr:
  - Claude Code 2.1.152 removed auto mode's separate opt-in consent step; it did not erase configured permission defaults.
  - Auto mode delegates many tool decisions to a classifier and still carries measurable residual risk.
  - Project-local settings cannot redefine the auto mode classifier; use user or managed settings for that policy.
  - Keep manual review for high-stakes infrastructure, secrets, destructive operations, and production changes.
---

## The short answer

Claude Code made **auto mode easier to enter**, but “auto mode is now the default” is too broad. The official Claude Code 2.1.152 notes say that auto mode no longer requires separate opt-in consent. Later releases also removed provider-specific feature gates and taught `/doctor` to propose auto mode where it is available. None of those changes mean Claude Code silently overwrites every user's configured permission mode. In fact, the 2.1.200 release notes explicitly renamed the default permission mode to **Manual** in the CLI, help text, VS Code, and JetBrains.

That distinction matters because availability, consent, and default selection are three different controls. A feature can be available without an environment flag, stop showing a one-time consent screen, and still respect `permissions.defaultMode` in settings.

## What auto mode does

Auto mode is Anthropic's middle ground between approving every consequential tool call and using `--dangerously-skip-permissions`. It uses two layers:

- **An input probe** warns the agent when tool output appears to contain prompt injection.
- **A transcript classifier** reviews actions with meaningful downside before they execute.

Routine safe tools and in-project edits can bypass the classifier. Shell commands, external integrations, writes outside the project, and other higher-impact actions may be classified. When an action is denied, Claude normally tries a safer path instead of interrupting immediately.

Anthropic's published evaluation is useful precisely because it does not claim perfection. The full two-stage pipeline reported a 0.4% false-positive rate on internal traffic and a 17% false-negative rate on a small set of real overeager actions. Anthropic explicitly says auto mode is not a replacement for careful human review on high-stakes infrastructure.

## What changed in the product

The rollout happened in steps, which is why a headline can flatten several releases into one “default” event:

- **Claude Code 2.1.111** removed the need for the old `--enable-auto-mode` flag for eligible Max users.
- **Claude Code 2.1.152** removed the separate opt-in consent requirement.
- **Claude Code 2.1.207** made auto mode available on Bedrock, Vertex AI, and Foundry without the earlier environment-variable opt-in.
- **Claude Code 2.1.210** fixed `/doctor` so it could propose the auto-mode default on those external providers.
- Other releases fixed background sessions so they honor `permissions.defaultMode` rather than being forced into auto mode.

The safe reading is: Anthropic progressively removed rollout friction and recommends auto mode more broadly. Your explicit permission configuration still matters.

## What to check on your machine

Run the built-in diagnostics and inspect your settings before assuming a headline describes your session:

```bash
claude doctor
```

Inside Claude Code, use `/config` and `/permissions` to review the active mode and recent decisions. If you customize classifier policy, start from the bundled baseline rather than replacing it blindly:

```bash
claude auto-mode defaults
```

Current documentation says auto mode configuration is accepted from user and managed settings, not shared project settings. That prevents a repository from weakening the classifier merely because you opened it.

## Where manual approval still wins

Auto mode is best for routine development in a version-controlled project where changes are reviewable. Prefer explicit approval when a task touches production, cloud resources, credentials, external publication, irreversible deletion, force pushes, billing, or other people's data.

The right mental model is not “Anthropic turned permissions off.” It is “Claude Code can delegate more permission decisions to a fallible safety classifier.” That is a useful trade for many coding sessions, but it remains a trade.

## Takeaway

Do not change your workflow based on the word “default” alone. Verify the active mode, preserve narrow permission rules, and keep a human in the loop wherever a mistaken approval would be expensive or hard to reverse.

---
*Product behavior verified against the [official auto mode engineering report](https://www.anthropic.com/engineering/claude-code-auto-mode), [Claude Code configuration docs](https://code.claude.com/docs/en/configuration), and official release notes for [2.1.152](https://github.com/anthropics/claude-code/releases/tag/v2.1.152), [2.1.200](https://github.com/anthropics/claude-code/releases/tag/v2.1.200), [2.1.207](https://github.com/anthropics/claude-code/releases/tag/v2.1.207), and [2.1.210](https://github.com/anthropics/claude-code/releases/tag/v2.1.210).*
