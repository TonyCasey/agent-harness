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

- [ ] Plan to invoke `bash "$MAIN_REPO/${CLAUDE_PLUGIN_ROOT}/scripts/worktree-sync-env.sh" "$PWD"`

**Output**: command planned

---

## Phase 3: Execute

```bash
bash "$MAIN_REPO/${CLAUDE_PLUGIN_ROOT}/scripts/worktree-sync-env.sh" "$PWD"
```

**Output**: env files copied

---

## Phase 4: Verify

- [ ] List the env files now present in the worktree:
  ```bash
  find . -maxdepth 5 \( -path './node_modules' -o -path './.next' -o -path './.claude/worktrees' \) -prune -o -name '.env' -print
  ```

**Output**: list of synced env files
