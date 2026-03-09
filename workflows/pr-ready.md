---
name: pr-ready
description: Prepare current branch for pull request
agent: developer
---

# PR Ready Workflow

## Phase 1: Research

Check current branch state and gather context.

- [ ] Verify all changes are committed
- [ ] Verify branch is ahead of master
- [ ] Verify branch is pushed to remote
- [ ] Identify what changed in this branch

**Output**: Branch status, list of changes

---

## Phase 2: Plan

Determine what needs to pass before PR is ready.

- [ ] Identify required linters for this project
- [ ] Identify test commands to run
- [ ] Check if coverage report is available
- [ ] Plan any missing tests that need to be written

**Output**: Checklist of validations to run

---

## Phase 3: Execute

Run all validations and fix issues.

- [ ] Run linters and fix any issues
- [ ] Execute full test suite (all must pass)
- [ ] Check unit test coverage for new/modified functions
- [ ] Write missing tests if coverage is insufficient
- [ ] Run coverage report if available: `npm run test:coverage`

**Output**: All checks passing

---

## Phase 4: Verify

Confirm readiness and summarize for PR.

- [ ] Save lint output to `.claude/.tmp/evidence/pr-ready/`
- [ ] Save test output to `.claude/.tmp/evidence/pr-ready/`
- [ ] Summarize changes in branch
- [ ] List files modified
- [ ] Identify breaking changes (if any)
- [ ] Report readiness status
- [ ] Suggest next step: `ah pr create`

**Output**: Readiness summary, next steps

---

## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| Lint output | `.claude/.tmp/evidence/pr-ready/lint.txt` | |
| Test output | `.claude/.tmp/evidence/pr-ready/tests.txt` | |
| Coverage report | `.claude/.tmp/evidence/pr-ready/coverage.txt` | |
