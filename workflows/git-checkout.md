---
name: git-checkout
description: Checkout a branch, creating it if needed
agent: developer
---

# Git Checkout Workflow

**Execute automatically without prompting.**

## Phase 1: Research

Parse branch name and check if it exists.

- [ ] Extract branch name from arguments
- [ ] If branch name contains a Jira ticket (PROJ-XXXX), use as-is
- [ ] Check if branch exists:
  ```bash
  git branch -a | grep -E "(^|\s)$BRANCH($|\s)" || echo "not found"
  ```

**Output**: Branch name, existence status

---

## Phase 2: Plan

Determine checkout strategy.

- [ ] If branch exists locally: plan `git checkout <branch>`
- [ ] If branch exists on remote only: plan `git checkout -b <branch> origin/<branch>`
- [ ] If branch doesn't exist: plan `git checkout -b <branch>`
- [ ] If creating new branch and no ticket prefix, prompt for ticket number

**Output**: Checkout command planned

---

## Phase 3: Execute

Perform the checkout.

- [ ] Execute the planned checkout command
- [ ] Handle any errors (uncommitted changes, conflicts)

**Output**: Branch checked out

---

## Phase 4: Verify

Confirm checkout succeeded.

- [ ] Show current branch: `git branch --show-current`
- [ ] Show recent commits: `git log --oneline -3`

**Output**: Branch confirmation
