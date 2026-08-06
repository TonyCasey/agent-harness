---
name: git-recall
description: Search git memory for past decisions and context
agent: developer
---

# Git Recall Workflow

**Execute automatically without prompting.**

Requires git-mem to be installed (`npm install -g git-mem`).

## Phase 1: Research

Check environment and parse query.

- [ ] Check git-mem available:
  ```bash
  which git-mem || echo "git-mem not installed"
  ```
- [ ] If not installed, suggest: `npm install -g git-mem && git-mem init`
- [ ] Parse search query from arguments
- [ ] Determine search scope (all memories vs specific type)

**Output**: Query parsed, environment ready

---

## Phase 2: Plan

Plan search strategy.

- [ ] If query provided: plan `git mem recall "<query>"`
- [ ] If no query: plan to show recent memories
- [ ] If looking for specific type (decision/gotcha): plan trailer search

**Output**: Search command planned

---

## Phase 3: Execute

Search git memory.

- [ ] If search query provided:
  ```bash
  git mem recall "<query>" --limit 10
  ```
- [ ] If no query, show recent:
  ```bash
  git mem recall --limit 10
  ```
- [ ] For specific decision types:
  ```bash
  git mem trailers --query AI-Decision --limit 5
  ```

**Output**: Search results

---

## Phase 4: Verify

Format and display results.

- [ ] Format memories in readable output:
  - Memory content
  - Type (decision/gotcha/convention/fact)
  - Confidence level
  - Associated commit
  - Tags
- [ ] Highlight most relevant matches

**Output**: Formatted memory display
