---
name: new-feature
description: Start a new feature with branch, tests, and implementation
agent: developer
---

> **Base branch**: `$BASE_BRANCH` below means the configured base branch — plugin config `base_branch`, else the `BASE_BRANCH` env var (`.claude/.env`), else the repo default branch.

# New Feature Workflow

## Phase 1: Research

Understand the feature requirements and codebase context.

- [ ] Load agent memory from `.claude/memory/developer.json`
- [ ] Check for relevant past decisions or patterns
- [ ] Clarify feature requirements with user if ambiguous
- [ ] Identify where in the codebase this feature belongs
- [ ] Review existing patterns for similar features
- [ ] Check for related code that might be affected

**Output**: Clear understanding of scope and location

---

## Phase 2: Plan

Design the implementation approach.

- [ ] Fetch latest `$BASE_BRANCH`
- [ ] Plan file structure and naming
- [ ] Define expected behavior (test cases)
- [ ] Identify any dependencies or prerequisites
- [ ] Estimate complexity and break into steps if large

**Output**: Implementation plan with test cases defined

---

## Phase 3: Execute

Implement the feature using TDD.

- [ ] Create branch: `PROJ-XXXX` or `feature/<name>`
- [ ] Create test file for the new feature
- [ ] Define test stubs based on expected behavior
- [ ] Implement to make tests pass
- [ ] Follow existing code patterns
- [ ] Stage and commit with conventional format: `feat: <description>`

**Output**: Feature implemented with passing tests

---

## Phase 4: Verify

Confirm the feature works and record evidence.

- [ ] Execute full test suite (no regressions)
- [ ] Verify feature meets original requirements
- [ ] Save test output to `.claude/.tmp/evidence/new-feature/`
- [ ] Confirm commit is clean and well-formatted
- [ ] Record any significant decisions to `.claude/memory/developer.json`
- [ ] Note new patterns discovered

**Output**: Verification report with test evidence

---

## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| Test output | `.claude/.tmp/evidence/new-feature/test-output.txt` | |
| Coverage report | `.claude/.tmp/evidence/new-feature/coverage.txt` | |
