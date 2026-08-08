---
# ============================================================
# ARTICLE / VIDEO TEMPLATE — content/library/*.md
# Copy this file to: content/library/YYYY-MM-DD-my-slug.md
# The filename sets the default date + URL slug (/content/my-slug).
# Any file dropped in content/library/ appears automatically.
# ============================================================

title: "Short, specific, benefit-first title (max ~70 chars)" # required
date: 2026-01-01 # YYYY-MM-DD (defaults to filename date)
time: "09:00" # HH:MM, used for same-day ordering
type: article # article | video

summary: "One or two sentences that sell the piece. Used on cards, meta description and RSS." # required
tags: [claude-code, workflow] # lowercase, 2-5 tags, reuse existing ones
author: "Shai Chikorel"

# Thumbnail. Every item MUST look good on the grid:
#   - articles: put a 1280x720 jpg in public/covers/ and reference it here
#   - videos: the native YouTube thumbnail is used automatically
#   - if omitted entirely, a bundled fallback cover is chosen deterministically
cover: "/covers/my-slug.jpg"

# --- video only -----------------------------------------------
youtube: "" # full watch URL or bare video id
embed: true # true = click-to-load player, false = link card
duration: "12:34"
source: "" # original link (video, tweet, blog post)
# --------------------------------------------------------------

featured: false # true pins it to the top of /content
draft: false # true hides it from the site and feeds

# 3-5 punchy takeaways. Shown in the "key takeaways" box and the CLI view.
tldr:
  - The single most useful thing a reader gets from this.
  - A second concrete, non-obvious point.
  - A third, ideally something actionable today.
---

## Start with the problem

One short paragraph on why this matters. No preamble, no "in this article we
will". Write like a senior dev explaining to a peer.

## The core idea

Use `##` for main sections and `###` for sub-sections — they become the table of
contents and anchor links automatically. Keep sections short and scannable.

```bash
# code blocks get a copy button; keep them runnable and minimal
claude -p "Find every place we read process.env directly"
```

## Practical notes

- Bullets for lists of rules, flags or trade-offs.
- **Bold** the term, then explain it after an em dash.
- Raw HTML is escaped for safety — use markdown only.

## Takeaway

Close with the one habit or change the reader should adopt.

## Length

Target the body word count: **at least 400 words, sweet spot 500–900 words**. Never below 350
for a published article. Videos may be lighter, but still aim for 300+ words of genuine
notes and interpretation — not a bare timestamp list. Depth beats padding: if a topic only
merits a 300-word note, add real value or skip it rather than inflating for length.


<!--
AGENT CHECKLIST before saving:
1. Filename is content/library/YYYY-MM-DD-slug.md, slug is kebab-case.
2. title, summary, tags, tldr filled in; no placeholder text left.
3. A cover exists at /covers/<slug>.jpg (1280x720), or the bundled fallback is intentional.
   Confirm the cover is original, licensed for this use, or in the public domain; keep proof.
4. type matches the content (video needs youtube + duration + source).
5. Body uses ## / ### headings so the TOC is meaningful (aim for 3+).
6. Remove any frontmatter key you are not using instead of leaving it blank
   (except youtube/duration/source on articles — just delete those lines).
7. Verify product facts against a primary source and link that source in the body.
8. Keep draft: true until every required field, source, and claim is review-ready.
9. Credit quoted or third-party material and keep quotations no longer than necessary.
-->
