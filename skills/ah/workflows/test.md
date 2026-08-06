---
name: test
description: Run Playwright tests for a repository
agent: developer
---

# Test Workflow

Run Playwright end-to-end tests for a repository.

## Arguments

- `{repo}` - Repository name (must have tests in `tests/{repo}/`)
- `{test_file}` (optional) - Specific test file to run

## Phase 1: Research

Locate tests and verify environment.

- [ ] Check for test files in `.claude/tests/{repo}/`:
  ```bash
  ls .claude/tests/{repo}/
  ```
- [ ] If no tests found, inform user:
  - "No tests found in `.claude/tests/{repo}/`"
  - "Create test files with `.spec.mjs` extension"
- [ ] Verify Playwright is available:
  ```bash
  npx playwright --version
  ```
- [ ] If not installed, prompt user to install

**Output**: Test files list, environment status

---

## Phase 2: Plan

Plan test execution.

- [ ] Determine which tests to run (all or specific file)
- [ ] Check for test configuration
- [ ] Plan headless vs headed mode

**Output**: Test execution plan

---

## Phase 3: Execute

Run the tests.

- [ ] If specific test file provided:
  ```bash
  node .claude/tests/{repo}/{test_file}
  ```
- [ ] Otherwise, run all tests:
  ```bash
  for f in .claude/tests/{repo}/*.spec.mjs; do
    echo "Running: $f"
    node "$f"
  done
  ```
- [ ] Capture output

**Output**: Test execution complete

---

## Phase 4: Verify

Report results and save evidence.

- [ ] Parse test results (pass/fail)
- [ ] Save test output to `.claude/.tmp/evidence/test/`
- [ ] Report:
  - Test results (pass/fail)
  - Any errors encountered
  - Summary of tests run

**Output**: Test results summary

---

## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| Test output | `.claude/.tmp/evidence/test/{repo}-output.txt` | |
| Summary | `.claude/.tmp/evidence/test/{repo}-summary.json` | |

---

## Notes

- Tests are standalone Playwright scripts (not @playwright/test runner)
- Each test manages its own browser launch/close
- Tests run in non-headless mode by default for debugging
- Add `headless: true` in tests for CI environments
