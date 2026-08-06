---
name: worktree-sync
description: Re-sync gitignored .env files from the main repo into the current worktree
agent: developer
---

# Worktree Sync Workflow

Use when `.env` values have changed in the main repo and you need to refresh the current worktree, or when env files are missing for any reason.

**Execute automatically without prompting.**

## Phase 1: Research

- [ ] Resolve main repo: `git worktree list --porcelain | awk '/^worktree / {print $2; exit}'`
- [ ] Confirm `$PWD` is a worktree (not the main repo itself); if it IS the main repo, report and exit

**Output**: MAIN_REPO, target = $PWD

---

## Phase 2: Plan

- [ ] Plan to invoke the sync script — `${CLAUDE_PLUGIN_ROOT}/scripts/worktree-sync-env.sh` (plugin install) or `$MAIN_REPO/.claude/scripts/worktree-sync-env.sh` (legacy install)

**Output**: command planned

---

## Phase 3: Execute

```bash
# Plugin install: the sync script ships with the plugin. Legacy install: it was copied into .claude/scripts/.
SYNC_SCRIPT="${CLAUDE_PLUGIN_ROOT:+${CLAUDE_PLUGIN_ROOT}/scripts/worktree-sync-env.sh}"
SYNC_SCRIPT="${SYNC_SCRIPT:-$MAIN_REPO/.claude/scripts/worktree-sync-env.sh}"
bash "$SYNC_SCRIPT" "$PWD"
```

**Output**: env files copied

---

## Phase 4: Verify

- [ ] List the env files now present in the worktree:
  ```bash
  find . -maxdepth 5 \( -path './node_modules' -o -path './.next' -o -path './.claude/worktrees' \) -prune -o -name '.env' -print
  ```

**Output**: list of synced env files
