---
name: git-status
description: Show detailed git status
agent: developer
---

# Git Status Workflow

**Execute automatically without prompting.**

Read-only operation - minimal R→P→E→V structure.

## Phase 1: Research

Gather all git state information.

- [ ] Current branch:
  ```bash
  git branch --show-current
  ```
- [ ] Latest commit:
  ```bash
  git log --oneline -1
  ```
- [ ] Working directory status:
  ```bash
  git status --short
  ```
- [ ] Ahead/behind upstream:
  ```bash
  git rev-list --left-right --count HEAD...@{u} 2>/dev/null || echo "no upstream"
  ```
- [ ] Recent commits:
  ```bash
  git log --oneline -5
  ```
- [ ] Stash list:
  ```bash
  git stash list
  ```

**Output**: Complete git state

---

## Phase 2-3: Plan & Execute

N/A - read-only operation, display gathered information.

---

## Phase 4: Verify

Format and display status summary.

- [ ] Format output clearly with sections
- [ ] Highlight important states (uncommitted changes, behind remote)

**Output**: Formatted status display
