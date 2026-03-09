---
name: git-commit
description: Stage, commit with AI metadata trailers, and optionally store memory notes
agent: developer
---

# Git Commit Workflow

**Execute automatically without prompting.**

## Phase 1: Research

Check for changes and analyze them.

- [ ] Check status:
  ```bash
  git status --short
  ```
- [ ] If no changes, report "Nothing to commit" and exit
- [ ] Analyze staged and unstaged changes:
  ```bash
  git diff --staged --stat
  git diff --staged
  ```
- [ ] Identify what changed (files, functions, features)
- [ ] Note any significant decisions made during implementation

**Output**: Change analysis, decision notes

---

## Phase 2: Plan

Plan commit message and trailers.

- [ ] Determine commit type: feat, fix, refactor, docs, test, chore
- [ ] If no message provided, draft one using conventional format
- [ ] Plan AI trailers:
  - `AI-Agent: Claude-Code`
  - `AI-Model: <current model>`
  - `AI-Decision:` (if applicable)
  - `AI-Gotcha:` (if applicable)
  - `AI-Context:` (relevant tags)

**Output**: Commit message draft with trailers

---

## Phase 3: Execute

Stage changes and create commit.

- [ ] Stage changes:
  - If specific files provided: `git add <files>`
  - If no files specified: `git add -A`
- [ ] Create commit with full message and trailers:
  ```bash
  git commit -m "<complete message with trailers>"
  ```
- [ ] If significant decision/convention, store in git notes:
  ```bash
  git notes --ref=refs/notes/ai-mem add -m '{"type":"decision",...}' HEAD
  ```

**Output**: Commit created

---

## Phase 4: Verify

Confirm commit and show result.

- [ ] Show the result:
  ```bash
  git log -1 --format="%H%n%s%n%n%b"
  ```
- [ ] Display:
  - Commit hash
  - Subject line
  - Trailers added
  - Note if memory was stored

**Output**: Commit confirmation

---

## Example Output

```
Committed: abc1234

feat: add JWT authentication middleware

AI-Agent: Claude-Code
AI-Model: claude-opus-4-5-20251101
AI-Decision: JWT over sessions for stateless horizontal scaling
AI-Context: [auth, middleware, api]

Decision stored in git notes
```
