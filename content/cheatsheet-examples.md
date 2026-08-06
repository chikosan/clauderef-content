---
title: Cheatsheet examples
description: Rich, real-world examples for each command. Keyed by the command exactly as written in cheatsheet.md.
---

<!--
HOW TO USE THIS FILE
  ## `<command>`      <- must match the command in content/cheatsheet.md (backticks optional)
  - Example: ...      <- any number of bullets; they show in the detail modal + CLI output
Inline nested bullets in cheatsheet.md still work; these are appended after them.
-->

## `Ctrl+R`

- Works like shell reverse-search: type a fragment, press `Ctrl+R` again to walk older matches.
- Great for re-running a long prompt you wrote 20 turns ago instead of retyping it.

## `Esc Esc`

- Double-tap right after a bad edit to rewind the conversation to before that turn.
- Also offers "summarize" when the context window is nearly full.

## `Shift+Tab`

- `default` -> asks before edits; `acceptEdits` -> applies edits silently; `plan` -> read-only research.
- Use `plan` mode for "how does auth work?" so Claude can't touch files while exploring.

## `/clear`

- Best between unrelated tasks: keeps files on disk, throws away token history.
- Cheaper and faster than `/compact` when you don't need the old context at all.

## `/compact [focus]`

- `/compact keep the failing test output and the auth middleware` — steer what survives.
- Run it when `/context` shows the window above ~70% instead of waiting for auto-compact.

## `/branch [name]`

- `/branch try-zod` — experiment with a refactor, then go back to the original thread if it fails.
- Branches share the working tree, so commit or stash before diverging on risky edits.

## `/usage`

- Shows cache-read vs cache-write tokens — a low cache-hit rate usually means you're editing files that sit early in context.
- Pair with `--max-budget-usd` in headless runs to keep CI spend predictable.

## `/context`

- Renders a grid of what's in the window: system prompt, CLAUDE.md, files, tool output.
- If one file dominates, ask Claude to re-read only the relevant range instead of the whole file.

## `/review [PR]`

- `/review` — reviews your current branch diff against the base branch.
- `/review 128` — pulls PR #128 locally and comments inline.
- Combine with `/security-review` before pushing anything that touches auth or payments.

## `/security-review`

- Scans the diff for hardcoded secrets, injection sinks, missing authorization checks.
- Run on the diff, not the whole repo — findings stay actionable.

## `/loop [interval] [prompt]`

- `/loop 10m run bun test and fix any new failures` — babysits a long refactor.
- `/loop 1h check for upstream dependency updates and open a PR`.

## `/hooks`

- Post-edit formatting: run `bunx prettier --write $CLAUDE_FILE` after every `Edit`.
- Pre-commit guard: block `Bash(git push --force)` outright.

## `/memory`

- Project scope -> `./CLAUDE.md` (committed, team-wide rules like "use bun, never npm").
- User scope -> `~/.claude/CLAUDE.md` (personal style: "be terse", "prefer TS strict").

## `/add-dir <path>`

- `/add-dir ../design-system` — edit an app and its shared package in one session.
- Monorepo alternative: start `claude` at the repo root instead.

## `/teleport`

- Pull a session started on Claude Code on the web into the current repository and terminal.
- Check that your local checkout points at the same repository before accepting the transfer.

## `/btw <question>`

- `/btw what's the difference between SSE and streamable HTTP for MCP?` — answer isn't kept in history.
- Use it for side questions so you don't pollute a long task's context.

## `claude -p "q"`

- `claude -p "summarize the diff" --output-format json | jq -r .result` — scriptable in CI.
- `git diff | claude -p "write a conventional commit message"` — reads stdin.

## `claude -r "n"`

- `claude -r` with no argument opens a picker of recent sessions.
- Name sessions with `/rename` first so resume-by-name stays readable.

## `claude mcp`

- `claude mcp add linear --transport http https://mcp.linear.app/sse` — remote server.
- `claude mcp add -s project fs --transport stdio -- bunx @modelcontextprotocol/server-filesystem .` — checked into `.mcp.json`.
- `claude mcp list` then `/mcp` to authenticate anything showing "needs auth".

## `--model`

- `claude --model opus` for architecture work, `--model haiku` for bulk mechanical edits.
- Per-skill override via `model:` in the skill frontmatter beats the session flag.

## `--dangerously-skip-permissions`

- CI only, inside a container with no production credentials mounted.
- Always pair with `--max-budget-usd` and a narrow working directory.

## `--output-format json`

- Fields: `result`, `total_cost_usd`, `num_turns`, `session_id` — pipe into `jq` for CI gates.
- Use `--output-format stream-json` when you want incremental output in a log.

## `--forward-subagent-text`

- `claude -p --output-format stream-json --verbose --forward-subagent-text "review the diff"` — include nested subagent text with `parent_tool_use_id` links.
- Valid only with print mode and `stream-json`; omit it when you need only final tool results.

## `~/.claude/settings.json`

- `{"model": "opus", "permissions": {"allow": ["Bash(git status)", "Read"]}}`
- Applies everywhere; keep team rules in the project file instead.

## `.claude/settings.json`

- Commit it: `{"permissions": {"allow": ["Bash(bun test)", "Bash(bun run lint)"], "deny": ["Bash(rm -rf *)"]}}`
- Anything machine-specific belongs in `.claude/settings.local.json`.

## `hooks: if`

- `if: "Edit(src/**/*.ts)"` — run typecheck only when TS source changes.
- `if: "Bash(git commit*)"` — run the test suite before commits land.

## `emojiCompletionEnabled`

- Put `{"emojiCompletionEnabled": false}` in settings to keep `:heart:` as literal text.

## `workflowSizeGuideline`

- `{"workflowSizeGuideline": "small"}` asks dynamic workflows to aim for a smaller agent team; it is guidance, not a hard cap.

## `sandbox.network.strictAllowlist`

- In user or managed settings: `{"sandbox":{"network":{"allowedDomains":["github.com"],"strictAllowlist":true}}}`.
- It does not apply from project or local settings, and it governs sandboxed commands rather than in-process tools such as WebFetch.

## `DirectoryAdded`

- Use this hook for logging or setup after `/add-dir`; it cannot block a directory that has already been added.

## `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`

- `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS=8 claude` lowers the default running-agent cap for a resource-constrained machine.

## `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`

- `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=1 claude` disables nested subagent spawning while preserving direct subagents.

## `MAX_THINKING_TOKENS`

- `MAX_THINKING_TOKENS=0` disables extended thinking for cheap mechanical work.
- `MAX_THINKING_TOKENS=32000` for gnarly debugging or architecture decisions.

## `/batch`

- `/batch add JSDoc to every exported function in src/lib` — fans out into isolated worktrees.
- Each task is independent; avoid it when changes touch the same files.

## `/code-review [effort|ultra] [--fix] [--comment] [target]`

- `/code-review high --fix` — deep pass that applies safe fixes to the working tree.
- `/code-review low` — fast sanity check on the current diff before pushing.
- `/code-review ultra --comment 128` — run cloud review for PR 128 and post inline comments when supported.

## `/debug [desc]`

- `/debug prod 500s on /api/checkout since Friday` — reads the debug log and recent diffs.
- Paste the stack trace in the same message for a much faster diagnosis.

## `.claude/skills/<name>/`

- `.claude/skills/release/SKILL.md` + `scripts/bump.sh` — one-command release playbook for the team.
- Keep `description:` action-oriented; it's what triggers auto-invocation.

## `description`

- Good: `description: Review a PR diff for security issues and post inline comments`.
- Bad: `description: helper` — never matches a prompt, so the skill never loads.

## `allowed-tools`

- `allowed-tools: [Bash(git *), Read, Edit]` — no permission prompts inside the skill.
- Keep it minimal; a skill with `Bash(*)` is effectively unsandboxed.

## `context: fork`

- Runs the skill in a subagent so its tool output never enters your main context.
- Ideal for noisy work: log crawling, dependency audits, large greps.

## `background: false`

- Add beside `context: fork` when later steps in the invoking turn require the forked skill's result.
- Leave it unset when the skill can finish independently in the background.

## `permissionMode`

- `dontAsk` — agent runs its full toolset without prompts (use with `isolation: worktree`).
- `plan` — research-only agent that can read but never write.

## `isolation: worktree`

- Each agent gets its own git worktree, so parallel agents can't clobber each other's edits.
- Merge results back with a normal branch merge when you're happy.

## `--transport http`

- Preferred for hosted servers: `claude mcp add gh --transport http https://api.githubcopilot.com/mcp/`.
- Handles OAuth via `/mcp` instead of hand-managed tokens.

## `alwaysLoad: true`

- Keeps a server connected in every session — good for an internal docs server.
- Costs context on every start, so reserve it for servers you actually use daily.
