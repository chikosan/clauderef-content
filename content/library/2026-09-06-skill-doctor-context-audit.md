---
title: "Use /skill-doctor to trim Claude Code skill context safely"
date: 2026-09-06
time: "10:00"
type: article
tags: [claude-code, skills, context, workflow]
summary: "A practical, reversible workflow for using Claude Code's /skill-doctor report to find unused skill listings, reduce context overhead, and keep the skills that earn their place."
author: "Shai Chikorel"
cover: "/covers/skill-doctor-context-audit.jpg"
featured: false
draft: true
tldr:
  - "/skill-doctor identifies loaded skills that have gone unused and shows their context cost; it does not prove a skill is useless."
  - "Use the report to make a small, reversible change, then retest a real task before removing more skills."
  - "Keep skills with a clear, recurring job even when they are not used in every session."
  - "Run the command in the terminal session on the machine that owns the skills; Remote Control cannot provide its usage report."
---

## Start with evidence, not a purge

Claude Code's skill list is part of the context it prepares so the model can discover available
workflows. That makes a large skill collection worth inspecting, but an unused skill is not
automatically bad. A release-only skill, a migration playbook, or an incident-response workflow
may be exactly the thing you need once a quarter.

The useful question is narrower: **which skills are paying a context cost in ordinary sessions
without helping the work you actually do?** Claude Code v2.1.261 added `/skill-doctor` for that
question. It reports loaded skills that have gone unused and their context cost, so you can decide
which ones to prune. [Anthropic's v2.1.261 release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.261)
are the source of truth for the command's availability and purpose.

Run it at the end of a representative terminal session:

```text
/skill-doctor
```

Choose a session that reflects normal work: for example, an implementation task that uses your
usual project instructions, plugins, and skills. Do not treat one short documentation edit as a
verdict on every specialized workflow in your setup.

## Read the report as a triage list

The report gives you two useful signals: whether a loaded skill was invoked, and what it costs in
context. Start with a high-cost skill that has not been used across the kind of work you do most.
Then classify it before changing anything.

- **Keep** a skill with a clear owner and a real recurring or high-risk job. Security review,
  deployment, and incident skills can be valuable even when they are infrequent.
- **Improve** a useful skill whose description is vague or overlaps another skill. Better names,
  clearer descriptions, and narrower triggers can make the right workflow easier for Claude to
  select.
- **Disable temporarily** a duplicate, obsolete, experimental, or project-irrelevant skill. This
  is the best first move because it gives you a comparison without throwing away the source.
- **Remove** only after the disabled version has survived real work and you know where the original
  is versioned or recoverable.

This distinction matters. The report measures recent usage and context impact; it does not assess
whether the instructions are correct, safe, or strategically important.

## Make one reversible change

Use the setting scope that matches where the skill belongs. A project-only experiment should live
in that project's local settings; a personal skill can be disabled in your user settings. Keep the
change small enough that you can attribute the result.

```json
{
  "skillOverrides": {
    "old-release-notes": "off"
  }
}
```

The exact setting location and available scopes are documented in Anthropic's
[skills guide](https://code.claude.com/docs/en/skills). Do not disable a skill by deleting its
files first. A reversible override lets you restore it immediately when a task exposes a gap.

After changing one or two candidates, start a fresh normal session and repeat the same class of
task. Look for concrete effects: did Claude still select the right workflow, did it miss an
important instruction, and did the session feel easier to steer? Re-run `/skill-doctor` after
enough representative work to see whether the change reduced the listing without creating a new
problem.

## Know the boundaries

`/skill-doctor` is a local-session diagnostic, not a universal inventory system. Anthropic's
release notes describe the command as showing loaded skills that go unused and their context cost.
That means its result is tied to the current machine and session context. It is also not a reason
to remove bundled or managed capabilities that you do not control.

When using Remote Control from a phone or browser, run the command in the terminal on the machine
where the session is running. The usage report needs that local session information, so a remote
connection cannot supply it.

## A maintenance cadence that stays useful

Run `/skill-doctor` after a plugin-installation spree, after retiring a project, or once every few
weeks if your personal setup evolves quickly. Keep a short note beside each disabled skill saying
why it was turned off and how to re-enable it. That converts a one-time cleanup into a controlled
maintenance practice.

The win is not the smallest possible skill list. It is a skill list where every loaded instruction
has a job, an owner, and a reason to be there.
