---
name: worktree-create
description: Create a git worktree under .claude/worktrees/<name> and sync gitignored env files from the main repo
agent: developer
---

> **Base branch**: `$BASE_BRANCH` below means the configured base branch — plugin config `base_branch`, else the `BASE_BRANCH` env var (`.claude/.env`), else the repo default branch.

# Worktree Create Workflow

Creates a worktree at `<main-repo>/.claude/worktrees/<name>` and copies all gitignored `.env` files (root + per-app/service) plus `.claude/.agent-harness` into it, so the new worktree is immediately usable.

**Execute automatically without prompting.**

## Phase 1: Research

Parse arguments and resolve paths.

- [ ] Extract `<name>` (required) — used for both the worktree directory and the new branch
- [ ] Extract `<base-branch>` (optional, default: `$BASE_BRANCH`)
- [ ] Resolve main repo path:
  ```bash
  MAIN_REPO=$(git worktree list --porcelain | awk '/^worktree / {print $2; exit}')
  ```
- [ ] Compute target path: `$MAIN_REPO/.claude/worktrees/<name>`
- [ ] Abort if target path already exists
- [ ] Check whether branch `<name>` already exists locally or on a remote

**Output**: name, base-branch, MAIN_REPO, absolute target path, branch existence

---

## Phase 2: Plan

Choose the worktree-add invocation.

- [ ] If branch `<name>` does NOT exist:
  `git worktree add -b <name> <abs-target> <base-branch>`
- [ ] If branch `<name>` exists locally:
  `git worktree add <abs-target> <name>`
- [ ] If branch `<name>` exists only on remote `origin/<name>`:
  `git worktree add -b <name> <abs-target> origin/<name>`

**Output**: command planned

---

## Phase 3: Execute

Always run with absolute paths so it works correctly when invoked from inside another worktree.

```bash
git worktree add -b "<name>" "$MAIN_REPO/.claude/worktrees/<name>" "<base-branch>"
# Plugin install: the sync script ships with the plugin. Legacy install: it was copied into .claude/scripts/.
SYNC_SCRIPT="${CLAUDE_PLUGIN_ROOT:+${CLAUDE_PLUGIN_ROOT}/scripts/worktree-sync-env.sh}"
SYNC_SCRIPT="${SYNC_SCRIPT:-$MAIN_REPO/.claude/scripts/worktree-sync-env.sh}"
bash "$SYNC_SCRIPT" "$MAIN_REPO/.claude/worktrees/<name>"
```

- [ ] Create the worktree
- [ ] Sync env files via `worktree-sync-env.sh`

**Output**: worktree created, env files copied

---

## Phase 4: Verify

- [ ] `git worktree list` shows the new entry
- [ ] Target directory contains a root `.env` (fail loudly if missing)
- [ ] Print the `cd` command for the user:
  `cd <abs-target>`

**Output**: confirmation + cd command
