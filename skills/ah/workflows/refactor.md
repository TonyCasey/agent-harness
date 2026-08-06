---
name: refactor
description: Safe refactoring with test coverage verification
agent: developer
---

# Refactor Workflow

## Phase 1: Research

Understand the code to be refactored and its dependencies.

- [ ] Load agent memory from `.claude/memory/developer.json`
- [ ] Check for relevant past refactoring patterns
- [ ] Analyze target code structure
- [ ] Map dependencies (who calls this code)
- [ ] Check existing test coverage status
- [ ] Identify risks or breaking change potential
- [ ] Save before-state snapshot

**Output**: Dependency map, coverage status, risk assessment

---

## Phase 2: Plan

Plan the refactoring approach.

- [ ] Define the refactoring goal (readability, performance, DRY, etc.)
- [ ] Break into incremental transformation steps
- [ ] Identify tests needed before refactoring
- [ ] Plan rollback strategy if issues arise

**Output**: Step-by-step refactoring plan

---

## Phase 3: Execute

Perform the refactoring incrementally.

- [ ] Create branch: `refactor/<target-slug>`
- [ ] Write characterization tests if coverage is insufficient
- [ ] Make small, incremental changes
- [ ] One transformation at a time
- [ ] Run tests after each change
- [ ] Commit working states
- [ ] Final commit with conventional format: `refactor: <description>`

**Output**: Refactored code with all tests passing

---

## Phase 4: Verify

Confirm behavior is preserved and record evidence.

- [ ] All existing tests pass
- [ ] No functionality changed (unless intentional)
- [ ] Performance not degraded (benchmark if applicable)
- [ ] Save before/after diff to `.claude/.tmp/evidence/refactor/`
- [ ] Save test output to evidence directory
- [ ] Record refactoring pattern to `.claude/memory/developer.json` if reusable
- [ ] Note any architectural decisions made

**Output**: Verification report with diff and test evidence

---

## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| Before snapshot | `.claude/.tmp/evidence/refactor/before.txt` | |
| After snapshot | `.claude/.tmp/evidence/refactor/after.txt` | |
| Diff | `.claude/.tmp/evidence/refactor/diff.patch` | |
| Test output | `.claude/.tmp/evidence/refactor/test-output.txt` | |
