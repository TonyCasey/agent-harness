---
name: ah
description: Agent Harness commands. Use for PR workflows, project tool integration, and development automation.
argument-hint: <command> [subcommand] [args]
---

# Agent Harness

Route to the appropriate workflow based on command and subcommand.

## Configuration

Values configured when the plugin was enabled (used by workflows wherever they
mention "the configured X"):

- Base branch: `${user_config.base_branch}`
- Project tool: `${user_config.project_tool}`
- Project key: `${user_config.project_key}`
- Local CI command: `${user_config.ci_command}`

If a value above still shows a literal `${user_config...}` placeholder, the
plugin config is unavailable — fall back to `$BASE_BRANCH`, `$PROJECT_TOOL`,
`$PROJECT_KEY`, `$CI_COMMAND` environment variables (loading `.claude/.env` if
present), then to sensible defaults (repo default branch, `github-issues`, none, none).

## Path Resolution

Workflow, rule, agent, and template files ship with this plugin. Resolve
`${CLAUDE_PLUGIN_ROOT}` references against the plugin's install directory
(this skill's own directory is `${CLAUDE_PLUGIN_ROOT}/skills/ah/`). If the
placeholder did not resolve (legacy `.claude/` install via `ah init`), use the
project-relative `.claude/` equivalents instead: `.claude/workflows/`,
`.claude/rules/`, `.claude/agents/`, `.claude/templates/`.

Per-project runtime state (knowledge base, plans, evidence, memory) always
lives in the project, under `${CLAUDE_PROJECT_DIR}/.claude/`.

## Commands

| Command | Subcommand | Workflow | Example |
|---------|------------|----------|---------|
| `git` | `checkout <branch>` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/git-checkout.md` | `ah git checkout feature-123` |
| `git` | `commit [message]` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/git-commit.md` | `ah git commit "feat: add login"` |
| `git` | `push` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/git-push.md` | `ah git push` |
| `git` | `status` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/git-status.md` | `ah git status` |
| `git` | `remember <decision>` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/git-remember.md` | `ah git remember "chose JWT for auth"` |
| `git` | `recall [query]` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/git-recall.md` | `ah git recall "authentication"` |
| `worktree` | `create <name> [base-branch]` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/worktree-create.md` | `ah worktree create PROJ-31 main` |
| `worktree` | `sync` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/worktree-sync.md` | `ah worktree sync` |
| `pr` | `create [title]` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/pr-create.md` | `ah pr create "Add login feature"` |
| `pr` | `watch <pr-number>` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/pr-watch.md` | `ah pr watch 123` |
| `pr` | `stop <pr-number>` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/pr-stop.md` | `ah pr stop 123` |
| `pr` | `review <repo> <pr-number>` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/pr-review.md` |
| `pr` | `review-local <repo> <pr-number>` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/pr-review-local.md` |
| `pr` | `review-submit <repo> <pr-number>` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/pr-review-submit.md` |
| `pr` | `solid` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/pr-solid.md` | `ah pr solid` |
| `ticket` | `ship <ticket>` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/ticket-ship.md` | `ah ticket ship PROJ-59` |
| `ticket` | `create <title>` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/ticket-create.md` | `ah ticket create "New feature"` |
| `ticket` | `view <ticket>` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/ticket-view.md` | `ah ticket view PROJ-1234` |
| `ticket` | `start <ticket>` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/ticket-start.md` | `ah ticket start 28` |
| `ticket` | `transition <ticket> <status>` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/ticket-transition.md` | `ah ticket transition PROJ-1234 "In Progress"` |
| `develop` | `[plan-path]` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/develop.md` | `ah develop` or `ah develop .claude/plans/auth-execution-plan.md` |
| `new-feature` | `<name>` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/new-feature.md` | `ah new-feature user-auth` |
| `bug-fix` | `<issue>` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/bug-fix.md` | `ah bug-fix "login fails"` |
| `pr-ready` | | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/pr-ready.md` | `ah pr-ready` |
| `refactor` | `<target>` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/refactor.md` | `ah refactor utils.ts` |
| `automate` | `<task>` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/automate.md` | `ah automate "run tests"` |
| `plan` | `<feature-name>` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/plan.md` | `ah plan user-authentication` |
| `plan` | `split <path>` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/plan-split.md` | `ah plan split .claude/plans/auth.md` |
| `plan` | `tickets <path>` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/plan-tickets.md` | `ah plan tickets .claude/plans/auth.md` |
| `knowledge` | `scan` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/knowledge-scan.md` | `ah knowledge scan` |
| `knowledge` | `import <repo-path>` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/knowledge-import.md` | `ah knowledge import ~/code/api` |
| `knowledge` | `search <query>` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/knowledge-search.md` | `ah knowledge search "authentication"` |
| `test` | `<repo> [test-file]` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/test.md` |
| `workflow` | `<name>` | `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/<name>.md` | `ah workflow pr-create` |

## Routing Logic

1. Parse the first argument as the command
2. Parse remaining arguments based on command type
3. Read the workflow from `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/<workflow-name>.md` (a project may override any workflow by providing `.claude/workflows/<workflow-name>.md` — prefer that copy when it exists)
4. Read the agent from `${CLAUDE_PLUGIN_ROOT}/agents/<agent-name>.md` (specified in workflow frontmatter)
5. Follow agent rules from `${CLAUDE_PLUGIN_ROOT}/rules/` (project-local overrides: `.claude/rules/<name>.local.md`)
6. Execute the workflow steps using allowed tools

## If No Arguments

Show this help:

```
Agent Harness Commands:

  ah git checkout <branch>       Checkout or create a branch
  ah git commit [message]        Stage and commit with AI metadata
  ah git push                    Push current branch to remote
  ah git status                  Show detailed git status
  ah git remember <decision>     Store a decision in git memory
  ah git recall [query]          Search past decisions/context

  ah worktree create <name> [base]  Create worktree + sync .env files (default base: main)
  ah worktree sync                  Re-sync .env files from main repo into current worktree

  ah pr create [title]           Create a pull request
  ah pr watch <pr-number>        Watch PR and auto-fix comments
  ah pr stop <pr-number>         Stop watching a PR
  ah pr review <repo> <pr>       Online review (fast, no local setup)
  ah pr review-local <repo> <pr> Full local review (clones, runs services)
  ah pr review-submit <repo> <pr> Submit a pending review
  ah pr solid                    SOLID principles audit for current branch

  ah ticket ship <ticket>        Ticket -> code -> tests -> codex review -> draft PR (full pipeline)
  ah ticket create <title>       Create a ticket (Jira, Linear, ClickUp, GitHub)
  ah ticket view <ticket>        View ticket details
  ah ticket start <ticket>       Branch from base branch, transition ticket, start dev
  ah ticket transition <t> <s>   Transition ticket status

  ah develop [plan-path]         Execute tasks from plan (enforces architecture rules)
  ah new-feature <name>          Start a new feature
  ah bug-fix <issue>             Fix a bug
  ah pr-ready                    Prepare branch for PR
  ah refactor <target>           Safe refactoring

  ah plan <feature-name>         Document a feature plan
  ah plan split <path>           Break down plan into tasks
  ah plan tickets <path>         Create tickets from tasks

  ah knowledge scan              Generate summary of current repo
  ah knowledge import <path>     Import summary from another repo
  ah knowledge search <query>    Search knowledge base

  ah test <repo> [test-file]     Run Playwright tests for a repo

  ah automate <task>             Automate a task
  ah workflow <name>             Run a workflow by name
```
