---
version: 2.1.251
updated: 2026-08-29
---

## Keyboard Shortcuts

- `Ctrl+C` — Cancel input/generation
- `Ctrl+D` — Exit session
- `Ctrl+L` — Clear prompt input + force full screen redraw
- `Ctrl+O` — Toggle transcript viewer (verbose usage); cycles focus view in fullscreen
  - Example: press twice to cycle focus between compact and full transcript
- `Ctrl+Alt+F` — Toggle Focus view in VS Code
- `Ctrl+U` — Clear entire input buffer
- `Ctrl+Y` — Restore cleared input buffer
- `Ctrl+G` — Open in editor (same as Ctrl+X Ctrl+E)
- `Ctrl+R` — Reverse search history
  - Example: `Ctrl+R` then type `git` to find previous git commands
- `Ctrl+X` — Kill all background agents (press twice to confirm)
  - Example: first press shows running agents, second confirms termination
- `Ctrl+B` — Background running tasks
- `Ctrl+T` — Toggle task list
- `Esc Esc` — Rewind or summarize
- `Shift+Tab` — Cycle permission modes (default → acceptEdits → plan → …)
- `Alt+P` — Switch model
- `Alt+T` — Toggle extended thinking
- `Alt+O` — Toggle fast mode

## Slash Commands

- `/clear` — Clear conversation
  - Example: `/clear` resets context without touching files
  - Tip: use before switching topics
- `/compact [focus]` — Compact context
  - Example: `/compact focus` keeps only the current task context
- `/branch [name]` — Branch conversation (/fork alias)
  - Example: `/branch spike-refactor` fork current chat to try an idea safely
- `/usage` — Token usage, cost and cache breakdown (replaces /cost, /stats)
  - Example: `/usage` shows input, output and cache hit counts
- `/context` — Visualize context (grid)
  - Example: spot which files are hogging the window before `/compact`
- `/diff` — Interactive diff viewer
  - Example: review staged changes before saying "yes" to an edit
- `/keybindings` — Customize keyboard shortcuts
- `/scroll-speed [speed]` — Adjust output scroll speed
- `/terminal-setup` — Configure terminal keybindings
- `/init` — Create CLAUDE.md at repo root by scanning the codebase
  - Example: run once per new repo to bootstrap project memory
- `/memory` — Edit CLAUDE.md files, toggle auto memory, view entries
  - Example: `/memory` then pick "project" to add a repo-wide rule
- `/mcp` — Manage MCP servers (list, add, remove, auth)
- `/hooks` — Manage pre/post tool hooks
  - Example: add a hook that runs `bun test` after every Edit
- `/skills` — List available skills (built-in + project + personal)
- `/reload-skills` — Reload skills without restarting the session
- `/agents` — Manage agent configurations (list, create, edit)
- `/workflows` — View and manage background multi-agent workflow runs
- `/review [PR]` — Review PR locally
  - Example: `/review` reviews current branch diff
  - Example: `/review 128` reviews PR #128 against main
- `/ultrareview [PR#]` — Cloud code review — parallel multi-agent analysis
  - Example: `/ultrareview 42` runs multi-agent review on PR #42
- `/deep-research <question>` — Run a cited, multi-agent web research workflow (manual invocation)
- `/security-review` — Scan diff for vulnerabilities (secrets, injection, authz)
  - Example: run before every `git push` on sensitive services
- `/loop [interval] [prompt]` — Recurring task (/proactive alias)
  - Example: `/loop 10m run typecheck and fix new errors`
- `/ide` — IDE integrations status
- `/add-dir <path>` — Add working directory to the session
  - Example: `/add-dir ../shared-lib` to edit a sibling repo in the same chat
- `/teleport` — Pull a Claude Code web session into this terminal (/tp alias)
- `/remote-control [name]` — Continue this local session from claude.ai or the Claude app (/rc alias)
  - Example: `/remote-control feature-auth` keeps local tools available from another device
- `/btw <question>` — Ask a side question without adding to the conversation
  - Example: `/btw what does ENOSPC mean?` — answer isn't stored in history
- `/extra-usage` — Extra usage when rate limited
- `/voice` — Toggle push-to-talk voice dictation
- `/doctor` — Full setup checkup (/checkup alias)
  - Example: run first when auth, MCP, or model picker misbehaves
- `/insights` — Analyze sessions report
- `/desktop` — Continue in Desktop app
- `/rename [name]` — Rename current session
  - Example: `/rename feature-auth` so `claude -r feature-auth` finds it later
- `/help` — Show help + commands
- `/feedback` — Submit feedback (alias: /bug)

## CLI & Flags

- `claude` — Interactive
- `claude "q"` — With prompt
- `claude -p "q"` — Headless (SDK)
  - Example: `claude -p "refactor utils.ts to async"` > output.txt
- `claude -c` — Continue last
- `claude -r "n"` — Resume by ID/name
  - Example: `claude -r "feature-auth"` resumes that session
- `claude update` — Update
  - Example: `claude update` pulls latest CLI; pairs with `/doctor`
- `claude auth login` — Sign in (--sso, --console)
  - Example: `claude auth login --console` for API-console-based sign-in
- `claude agents` — List agents
- `claude attach|logs|stop|respawn|rm` — Inspect and control background sessions
- `claude remote-control` — Start a local Remote Control server (subscription login required)
  - Example: `claude remote-control --continue` resumes the most recent Remote Control session
- `claude self-hosted-runner` — Run web, mobile, and desktop sessions on your infrastructure (Team/Enterprise)
  - Note: Windows requires an explicit `--base-dir`
  - Example: `claude self-hosted-runner --defer-shutdown-max-min 10` keeps attached sessions alive during shutdown
  - Example: `claude self-hosted-runner --proxy-authorization-command ./mint-proxy-token` refreshes proxy authorization per connection
- `claude mcp` — MCP config
  - Example: `claude mcp add github --transport http https://mcp.github.com`
- `claude plugin` — Plugin management
  - Note: marketplace `headersHelper` commands require trust approval and install/update confirmation
- `claude-api upgrade` — Migrate Python projects from the Anthropic SDK 0.x API to 1.x
- `claude project purge [path]` — Delete all Claude project state
  - Example: `claude project purge .` wipes local session/memory for this repo
- `claude ultrareview [target]` — Non-interactive code review (PR / branch / path)
  - Example: `claude ultrareview HEAD~5..HEAD` review last 5 commits from CI
- `--model` — Set model
  - Example: `--model sonnet-4-20250514` overrides the default model
- `--restricted` — Run with command/code tools and WebFetch disabled unless explicitly allowed
  - Example: `claude --restricted` keeps file access inside the working directory
- `--dangerously-skip-permissions` — Bypass permission prompts (use in CI only)
  - Example: pair with `--max-budget-usd` and a scoped sandbox
- `--output-format json` — Structured output
  - Example: `claude -p "list files" --output-format json | jq`
- `--forward-subagent-text` — Include nested subagent text in verbose stream-json output
- `--max-budget-usd 5` — Cost cap
  - Example: `claude -p "audit deps" --max-budget-usd 2` hard-stops at $2

## Config & Env

- `~/.claude/settings.json` — User settings (applies to every project)
  - Example: set default model, theme, and global permission rules here
- `.claude/settings.json` — Project settings (shared via VCS)
  - Example: pin `permissions.allow: ["Bash(bun test)"]` for the team
- `.claude/settings.local.json` — Local-only overrides (gitignored)
- `~/.claude.json` — OAuth tokens, MCP servers, session state
- `.mcp.json` — Project MCP servers (checked in, shared)
- `modelOverrides` — Map model picker labels → custom IDs
  - Example: `{"sonnet": "claude-sonnet-4-20250514"}`
- `autoMode.hard_deny` — Unconditional auto-mode classifier deny rules
  - Example: block `Bash(rm -rf *)` even when auto-mode is on
- `emojiCompletionEnabled` — Enable `:shortcode:` emoji completion (default true)
- `workflowSizeGuideline` — Advise dynamic workflow size (unrestricted/small/medium/large)
- `keybindingFlavor` — Set to `"readline"` for Bash-like word-editing shortcuts; `"classic"` remains the default
- `feedbackDrafts` — Control automatic feedback drafts after failures
- `sandbox.network.strictAllowlist` — Deny non-allowlisted hosts for sandboxed commands
- `hooks: if` — Conditional hooks using permission rule syntax
  - Example: `if: "Edit(src/**/*.ts)"` runs only on TS edits under src
- `DirectoryAdded` — Hook event after `/add-dir` or SDK `register_repo_root`
- `DISABLE_PROMPT_CACHING` — Startup warning when prompt caching is disabled
- `ANTHROPIC_API_KEY` — API key env var
  - Example: `export ANTHROPIC_API_KEY=sk-ant-...` before running `claude`
- `ANTHROPIC_MODEL` — Override default model via env
  - Example: `ANTHROPIC_MODEL=claude-opus-4 claude`
- `ANTHROPIC_BASE_URL` — Proxy/gateway override
  - Example: `ANTHROPIC_BASE_URL=https://gw.internal/anthropic`
- `MAX_THINKING_TOKENS` — 0 = off
  - Example: `MAX_THINKING_TOKENS=32000 claude -p "deep reasoning task"`
- `API_TIMEOUT_MS` — API timeout (default 600000ms)
  - Example: bump to `1200000` for very long reasoning runs
- `CLAUDECODE` — Detect CC shell (=1 when running inside Claude Code)
  - Example: `if [ "$CLAUDECODE" = "1" ]; then ...` in your shell rc
- `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` — Running subagent cap (default 20)
- `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` — Nested subagent layers (default 3; 1 disables nesting)
- `DISABLE_UPDATES` — Block all update paths (pinned CLI in CI)

## Skills & Agents

### Built-in Skills

- `Skill tool` — Discovers built-in slash commands (/init, /review, /security-review, …)
  - Example: auto-invoked when you ask "review my code" or "init project memory"
  - Tip: skills load only when their description matches your prompt
- `/code-review [effort|ultra] [--fix] [--comment] [target]` — Background code review
  - Example: `/code-review high --fix` deep review + auto-apply safe fixes
  - Example: `/code-review low` quick pass on the current diff
- `/batch` — Large parallel changes (5-30 worktrees)
  - Example: `/batch rename all snake_case vars to camelCase across the repo`
  - Tip: each task runs in its own git worktree so changes don't collide
- `/debug [desc]` — Troubleshoot from debug log
  - Example: `/debug login returns 500 after deploy`
- `/loop [interval] [prompt]` — Recurring scheduled task
  - Example: `/loop 5m check for failing tests and fix them`
- `/claude-api` — Load API + SDK reference into context
  - Example: run before asking "write a TS client for streaming completions"

### Custom Skill Locations

- `.claude/skills/<name>/` — Project skills (shared via VCS)
  - Example: `.claude/skills/deploy/SKILL.md` — team-wide deploy playbook
- `~/.claude/skills/<name>/` — Personal skills (all projects)
  - Example: `~/.claude/skills/pr-desc/SKILL.md` — your PR-writing style
- `SKILL.md` — Skill entry file with YAML frontmatter + prompt body
- `scripts/` — Optional executables invoked by the skill
- `references/` — Optional docs loaded on demand via progressive disclosure

### Skill Frontmatter

- `description` — Auto-invocation trigger (highest-leverage line)
  - Example: `description: Review a PR and post inline comments`
- `allowed-tools` — Skip permission prompts for listed tools
  - Example: `allowed-tools: [Bash(git *), Read, Edit]`
- `disallowed-tools` — Block specific tools from the skill
- `model` — Override model for this skill (e.g. `sonnet`, `haiku`, `opus`)
- `effort` — Override effort level (`low` / `medium` / `high`)
- `paths: [globs]` — Restrict skill to matching paths (YAML list)
  - Example: `paths: ["src/**/*.ts", "!**/*.test.ts"]`
- `context: fork` — Run the skill in an isolated subagent context
- `background: false` — Make a forked skill wait for its result (background is default)
- `$ARGUMENTS` — User input placeholder inside the prompt body
  - Example: `Analyze the following bug: $ARGUMENTS`
- `${CLAUDE_SKILL_DIR}` — Absolute path to the skill's own directory
  - Example: `!cat ${CLAUDE_SKILL_DIR}/references/style.md`
- `${CLAUDE_EFFORT}` — Current effort level (skill variable)
- `` !`cmd` `` — Dynamic context injection (runs at skill load)
  - Example: `` Current branch: !`git branch --show-current` ``
- `plugin bin/` — Ship executables usable via the Bash tool

### Built-in Agents

- `Explore` — Fast read-only research agent (Haiku, cheap)
  - Example: "explore how auth is wired" — no edits, structured report back
- `Plan` — Research + design agent for plan mode
- `General` — Full toolset, complex multi-step tasks
- `Bash` — Terminal agent with its own separate context

### Agent Frontmatter

- `permissionMode` — `default` / `acceptEdits` / `plan` / `dontAsk` / `bypassPermissions`
  - Example: `permissionMode: acceptEdits` auto-applies edits without prompting
- `isolation: worktree` — Run the agent in a dedicated git worktree
- `memory: user|project|local` — Persistent memory scope for the agent
- `background: true` — Run as a background task (see `Ctrl+B`, `/workflows`)
- `maxTurns` — Cap agentic turns to prevent runaway loops
  - Example: `maxTurns: 20`
- `initialPrompt` — Auto-submit the first turn on agent start
- `SendMessage` — Resume a running agent (replaces the older `resume`)
- `@agent-name` — Mention a named subagent from the main chat
  - Example: `@reviewer take a look at this diff`

## MCP Servers

- `--transport http` — Remote HTTP (recommended)
- `--transport stdio` — Local process
- `--transport sse` — Remote SSE
- `Local ~/.claude.json` — Scope: you only
- `Project .mcp.json` — Scope: shared/VCS
- `User ~/.claude.json` — Scope: global
- `/mcp` — Interactive UI
- `claude mcp list` — List all servers
- `alwaysLoad: true` — Keep server connected across all sessions
