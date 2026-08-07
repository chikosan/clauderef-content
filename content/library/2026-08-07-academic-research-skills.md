---
title: "Academic Research Skills: a 39-agent research team inside Claude Code"
date: 2026-08-07
time: "09:00"
type: article
tags: [claude-code, research, agents, workflow]
summary: "An open-source Claude Code skill suite that runs a full research-to-publication pipeline: deep research, paper writing, peer review, revision, and PDF output."
author: "Shai Chikorel"
featured: false
cover: "/covers/academic-research-skills.jpg"
tldr:
  - Four skills (deep-research, academic-paper, academic-paper-reviewer, academic-pipeline) coordinate ~39 specialized agents end-to-end.
  - Integrity gates verify every citation and data claim before a paper goes to review, catching hallucinated references early.
  - Multi-perspective peer review with an editor-in-chief, domain reviewers, and a devil's advocate, followed by tracked revision rounds.
  - Output lands in Markdown, DOCX, and LaTeX compiled to PDF; APA, IEEE, Chicago, MLA, and Vancouver citation formats are supported.
  - A full end-to-end pipeline run is token-hungry (roughly $4-6 and 2-4 hours), so start with a single skill first.
---

## The problem

Finding solid references and formatting citations eats hours, and most researchers do it alone.
The failure mode is usually not the writing—it's letting an unverified reference or an
ungrounded claim slip into a draft that took days to produce.

[Academic Research Skills](https://github.com/Imbad0202/academic-research-skills) is an
open-source suite of Claude Code skills (41K+ stars, CC-BY-NC 4.0) that wires a collaborative
team of specialized agents around that workflow, from a first research question to a compiled PDF.

## What the suite is

It ships as **four skills** that work independently or as one pipeline:

- **deep-research** (14 agents) — question formulation, literature search, source verification,
  meta-analysis, and synthesis.
- **academic-paper** (12 agents) — structure, argument building, drafting, citation compliance,
  and formatting across five citation styles (APA, IEEE, Chicago, MLA, Vancouver).
- **academic-paper-reviewer** (7 agents) — a multi-perspective peer-review panel.
- **academic-pipeline** (5 agents) — the orchestrator connecting the other three.

In total that's a claimed ~39-agent ensemble across 27 modes, routed by how you ask.

## The routing model

You don't pick a mode explicitly—you describe the task and Claude Code routes it:

| You say | Claude runs |
|--------|-------------|
| "I have a vague idea, help me frame it" | `deep-research` **socratic** (guided dialogue) |
| "Give me a literature summary on X" | `deep-research` **quick** |
| "Help me write a paper about Y" | `academic-paper` **full** |
| "Review this paper" | `academic-paper-reviewer` **full** |
| "Produce a complete research paper on Z" | `academic-pipeline` (full 10-stage run) |

The **socratic modes** are the interesting part: instead of handing back an answer, the mentor
agent asks 5–15 rounds of questions to force you to sharpen the research question yourself.

## The full pipeline

`academic-pipeline` chains the other skills into a 10-stage run:

1. **Research** — question refinement (FINER-style), literature search, source verification.
2. **Write** — structure architect builds an outline with word allocation; argument builder maps
   thesis and evidence chains.
3. **Integrity check (Stage 2.5)** — every reference, data point, and claim is audited *before*
   review. This is the guard that catches hallucinated citations.
4. **Peer review** — editor-in-chief plus domain reviewers and a devil's advocate score the paper
   on a 0–100 rubric.
5. **Coaching** — a Socratic pass explains *why* points were raised, so you learn while revising.
6. **Revise** — each review comment is tracked to a resolution status.
7. **Re-review** (Stage 3′ with integrity gate 4.5) — panel checks the revised paper.
8. **Re-revise** — address any remaining points (capped loops).
9. **Final integrity check** — rerun the citation/claim audit on the final version.
10. **Finalize** — format conversion and output in Markdown, DOCX, and LaTeX → PDF (Tectonic).

The pipeline is built around mandatory integrity gates between research, review, and finalization,
so a claim can't reach the finished PDF without being checked.

## Installation

The repo supports several install paths ([see SETUP.md](https://github.com/Imbad0202/academic-research-skills/blob/main/docs/SETUP.md)).
The quickest project-local setup:

```bash
git clone https://github.com/Imbad0202/academic-research-skills.git ~/academic-research-skills
cd /path/to/your/project
mkdir -p .claude/skills
ln -s ~/academic-research-skills/deep-research .claude/skills/deep-research
ln -s ~/academic-research-skills/academic-paper .claude/skills/academic-paper
ln -s ~/academic-research-skills/academic-paper-reviewer .claude/skills/academic-paper-reviewer
ln -s ~/academic-research-skills/academic-pipeline .claude/skills/academic-pipeline
```

Then run `claude` in that directory. You can also install globally under `~/.claude/skills/` or via
the Claude Code plugin marketplace.

## Practical notes

- **Start with one skill.** A full pipeline run is expensive—the README estimates roughly $4–6 in
  API cost and 2–4 hours of collaborative work. `deep-research` alone or the reviewer alone is a
  low-cost way to test before committing token budget.
- **The license is non-commercial.** It's CC-BY-NC 4.0, not MIT—fine for personal and academic
  use, but check before using it to drive revenue-generating work.
- **Multi-agent stages want subagents enabled.** The repo recommends agent teams for the parallel
  research/writing/review stages.
- **Claude Code skills are loaded from `SKILL.md`.** Each of the four directories must sit at
  `.claude/skills/<skill-name>/SKILL.md` for discovery to work.

## Takeaway

The highest-value idea here isn't the number of agents—it's the **mandatory integrity gates**.
Running a citation and claim audit *before* the paper goes to review (and again before
finalization) is exactly the step most writers skip. Even if you never run the full 10-stage
pipeline, borrowing that single habit—verify every reference before you let a draft be "finished"—
improves any research workflow.

---
*Source: the [academic-research-skills](https://github.com/Imbad0202/academic-research-skills) repository
and its [README](https://github.com/Imbad0202/academic-research-skills/blob/main/README.md). Star count and
pipeline details verified from the repository on 2026-08-07.*
