---
name: bug-fix
description: Systematic bug investigation and fix workflow
agent: developer
---

# Bug Fix Workflow

## Phase 1: Research

Understand the bug and gather context.

- [ ] Load agent memory from `.claude/memory/developer.json`
- [ ] Read linked issue or error message
- [ ] Identify affected area of code
- [ ] Reproduce the issue if possible
- [ ] Check for related past fixes in memory

**Output**: Bug description, reproduction steps, affected files

---

## Phase 2: Plan

Plan the investigation and fix approach.

- [ ] Create branch: `PROJ-XXXX` or `fix/<issue-slug>`
- [ ] Trace the code path mentally
- [ ] Identify potential root causes
- [ ] Plan a failing test to prove the bug

**Output**: Investigation plan, test strategy

---

## Phase 3: Execute

Write test, find root cause, implement fix.

- [ ] Create test that reproduces the bug
- [ ] Verify test fails (proves bug exists)
- [ ] Investigate and identify root cause (not just symptoms)
- [ ] Document findings
- [ ] Fix root cause with minimal changes
- [ ] Avoid unrelated changes
- [ ] Commit with conventional format: `fix: <description>`

**Output**: Passing test, minimal fix committed

---

## Phase 4: Verify

Confirm fix works and record evidence.

- [ ] Run new test (should pass)
- [ ] Run full test suite (no regressions)
- [ ] Save test output to `.claude/.tmp/evidence/bug-fix/`
- [ ] Record fix pattern to `.claude/memory/developer.json` if reusable
- [ ] Confirm fix addresses original issue

**Output**: Verification report with test evidence

---

## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| Failing test output | `.claude/.tmp/evidence/bug-fix/failing-test.txt` | |
| Passing test output | `.claude/.tmp/evidence/bug-fix/passing-test.txt` | |
| Full suite output | `.claude/.tmp/evidence/bug-fix/full-suite.txt` | |
