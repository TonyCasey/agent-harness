---
name: ah
description: Agent Harness commands. Use for PR workflows, project tool integration, and development automation.
argument-hint: <command> [subcommand] [args]
---

# Agent Harness

Route to the appropriate workflow based on command and subcommand.

## Commands

| Command | Subcommand | Workflow | Example |
|---------|------------|----------|---------|
| `git` | `checkout <branch>` | `.claude/workflows/git-checkout.md` | `ah git checkout feature-123` |
| `git` | `commit [message]` | `.claude/workflows/git-commit.md` | `ah git commit "feat: add login"` |
| `git` | `push` | `.claude/workflows/git-push.md` | `ah git push` |
| `git` | `status` | `.claude/workflows/git-status.md` | `ah git status` |
| `git` | `remember <decision>` | `.claude/workflows/git-remember.md` | `ah git remember "chose JWT for auth"` |
| `git` | `recall [query]` | `.claude/workflows/git-recall.md` | `ah git recall "authentication"` |
| `pr` | `create [title]` | `.claude/workflows/pr-create.md` | `ah pr create "Add login feature"` |
| `pr` | `watch <pr-number>` | `.claude/workflows/pr-watch.md` | `ah pr watch 123` |
| `pr` | `stop <pr-number>` | `.claude/workflows/pr-stop.md` | `ah pr stop 123` |
| `pr` | `review <repo> <pr-number>` | `.claude/workflows/pr-review.md` |
| `pr` | `review-local <repo> <pr-number>` | `.claude/workflows/pr-review-local.md` |
| `pr` | `review-submit <repo> <pr-number>` | `.claude/workflows/pr-review-submit.md` | 
| `ticket` | `create <title>` | `.claude/workflows/ticket-create.md` | `ah ticket create "New feature"` |
| `ticket` | `view <ticket>` | `.claude/workflows/ticket-view.md` | `ah ticket view PROJ-1234` |
| `ticket` | `transition <ticket> <status>` | `.claude/workflows/ticket-transition.md` | `ah ticket transition PROJ-1234 "In Progress"` |
| `new-feature` | `<name>` | `.claude/workflows/new-feature.md` | `ah new-feature user-auth` |
| `bug-fix` | `<issue>` | `.claude/workflows/bug-fix.md` | `ah bug-fix "login fails"` |
| `pr-ready` | | `.claude/workflows/pr-ready.md` | `ah pr-ready` |
| `refactor` | `<target>` | `.claude/workflows/refactor.md` | `ah refactor utils.ts` |
| `automate` | `<task>` | `.claude/workflows/automate.md` | `ah automate "run tests"` |
| `plan` | `<feature-name>` | `.claude/workflows/plan.md` | `ah plan user-authentication` |
| `plan` | `split <path>` | `.claude/workflows/plan-split.md` | `ah plan split .claude/plans/auth.md` |
| `plan` | `tickets <path>` | `.claude/workflows/plan-tickets.md` | `ah plan tickets .claude/plans/auth.md` |
| `knowledge` | `scan` | `.claude/workflows/knowledge-scan.md` | `ah knowledge scan` |
| `knowledge` | `import <repo-path>` | `.claude/workflows/knowledge-import.md` | `ah knowledge import ~/code/api` |
| `knowledge` | `search <query>` | `.claude/workflows/knowledge-search.md` | `ah knowledge search "authentication"` |
| `test` | `<repo> [test-file]` | `.claude/workflows/test.md` |
| `workflow` | `<name>` | `.claude/workflows/<name>.md` | `ah workflow pr-create` |

## Routing Logic

1. Parse the first argument as the command
2. Parse remaining arguments based on command type
3. Read the workflow from `.claude/workflows/<workflow-name>.md`
4. Read the agent from `.claude/agents/<agent-name>.md` (specified in workflow frontmatter)
5. Follow agent rules from `.claude/rules/`
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

  ah pr create [title]           Create a pull request
  ah pr watch <pr-number>        Watch PR and auto-fix comments
  ah pr stop <pr-number>         Stop watching a PR
  ah pr review <repo> <pr>       Online review (fast, no local setup)
  ah pr review-local <repo> <pr> Full local review (clones, runs services)
  ah pr review-submit <repo> <pr> Submit a pending review

  ah ticket create <title>       Create a ticket (Jira, Linear, ClickUp, GitHub)
  ah ticket view <ticket>        View ticket details
  ah ticket transition <t> <s>   Transition ticket status

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
