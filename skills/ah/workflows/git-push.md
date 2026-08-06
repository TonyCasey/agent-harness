---
name: git-push
description: Push current branch to remote
agent: developer
---

# Git Push Workflow

**Execute automatically without prompting.**

## Phase 1: Research

Check current branch and remote tracking.

- [ ] Get current branch:
  ```bash
  git branch --show-current
  ```
- [ ] Check remote tracking:
  ```bash
  git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || echo "no upstream"
  ```

**Output**: Branch name, upstream status

---

## Phase 2: Plan

Determine push command.

- [ ] If upstream exists: plan `git push`
- [ ] If no upstream: plan `git push -u origin <branch>`

**Output**: Push command planned

---

## Phase 3: Execute

Push to remote.

- [ ] Execute the planned push command
- [ ] Handle any errors (rejected push, auth issues)

**Output**: Push completed

---

## Phase 4: Verify

Confirm push succeeded.

- [ ] Show push result
- [ ] Show remote URL: `git remote get-url origin`

**Output**: Push confirmation
