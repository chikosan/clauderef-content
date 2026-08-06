---
title: "Claude Code ultrareview — parallel multi-agent cloud review"
date: 2026-07-12
tags: [feature, claude-code, review]
summary: "Kick off a fleet of reviewers against a PR from your terminal."
---

Ultrareview is a research-preview Claude Code feature that runs multiple review agents in isolated remote sandboxes, then combines their findings into one report. It requires claude.ai authentication; availability and billing depend on your plan.

```bash
/code-review ultra 1234
claude ultrareview origin/main
```

`/ultrareview` is also available as an alias in supported builds. The feature is best suited to medium-to-large diffs where parallel reviewers can inspect different parts of the change.

[Official ultrareview documentation](https://code.claude.com/docs/en/ultrareview) · [Claude Code CLI reference](https://code.claude.com/docs/en/cli-usage)
