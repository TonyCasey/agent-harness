---
name: git-remember
description: Store a decision or learning in git memory
agent: developer
---

# Git Remember Workflow

**Execute automatically without prompting.**

Requires git-mem to be installed (`npm install -g git-mem`).

## Phase 1: Research

Check environment and parse memory content.

- [ ] Check git-mem available:
  ```bash
  which git-mem || echo "git-mem not installed"
  ```
- [ ] If not installed, suggest: `npm install -g git-mem && git-mem init`
- [ ] Parse memory content from arguments

**Output**: Memory content, environment ready

---

## Phase 2: Plan

Determine memory type and tags.

- [ ] Parse memory type from argument:
  - `decision` - Architectural or implementation decision
  - `gotcha` - Bug, edge case, or "watch out for this"
  - `convention` - Coding pattern or team convention
  - `fact` - General knowledge about the codebase
- [ ] Default to `decision` if not specified
- [ ] Identify relevant tags from content

**Output**: Memory type, tags

---

## Phase 3: Execute

Store the memory.

- [ ] Store memory:
  ```bash
  git mem remember "<content>" \
    --type <type> \
    --confidence high \
    --tags "<relevant,tags>"
  ```

**Output**: Memory stored

---

## Phase 4: Verify

Confirm memory was stored.

- [ ] Verify storage:
  ```bash
  git mem recall --limit 1 --json
  ```
- [ ] Display confirmation with memory details

**Output**: Storage confirmation
