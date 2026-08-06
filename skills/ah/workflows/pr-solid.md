---
name: pr-solid
description: SOLID principles and best practices audit for PR changes
agent: developer
---

> **Base branch**: `$BASE_BRANCH` below means the configured base branch — plugin config `base_branch`, else the `BASE_BRANCH` env var (`.claude/.env`), else the repo default branch.

# PR SOLID Audit Workflow

Audits changed code in the current branch for SOLID principles and clean architecture violations.

## Phase 1: Research

Identify what code changed in this branch.

- [ ] Get list of changed files vs $BASE_BRANCH branch
- [ ] Filter to source files only (exclude tests, configs, generated)
- [ ] Categorize by layer: domain, application, infrastructure, UI
- [ ] Identify new vs modified files

```bash
# Get changed TypeScript files
git diff --name-only origin/$BASE_BRANCH...HEAD -- '*.ts' '*.tsx' | grep -v -E '(test|spec|config|\.d\.ts)' > .tmp/changed-files.txt
```

**Output**: List of changed source files by category

---

## Phase 2: Analyze

Check each changed file against SOLID principles and clean architecture.

### SOLID Checks

For each changed file, evaluate:

#### Single Responsibility (SRP)
- [ ] Does class/module have one reason to change?
- [ ] Are there multiple unrelated concerns mixed together?
- [ ] Is the file > 200 lines? (potential SRP violation)

#### Open/Closed (OCP)
- [ ] Can behavior be extended without modification?
- [ ] Are there switch statements on type that should be polymorphism?
- [ ] Are interfaces used to allow extension?

#### Liskov Substitution (LSP)
- [ ] Do derived classes honor base class contracts?
- [ ] Are there methods that throw NotImplementedError?
- [ ] Do overrides change expected behavior?

#### Interface Segregation (ISP)
- [ ] Are interfaces small and focused?
- [ ] Do implementers use all interface methods?
- [ ] Should large interfaces be split?

#### Dependency Inversion (DIP)
- [ ] Do high-level modules depend on abstractions?
- [ ] Are concrete classes instantiated directly (not via DI)?
- [ ] Is there module-level mutable state?

### Clean Architecture Checks

- [ ] Domain layer has no external dependencies
- [ ] Application layer imports only from domain
- [ ] Infrastructure implements domain interfaces
- [ ] No upward dependencies (infra → app → domain)

**Output**: List of potential violations with file:line references

---

## Phase 3: Report

Generate a focused audit report for the PR.

### Report Format

Create `.tmp/evidence/pr-solid/audit.md` with:

```markdown
# SOLID Audit: [Branch Name]

**Date**: YYYY-MM-DD
**Files Changed**: X
**Issues Found**: Y

## Summary

| Principle | Issues | Severity |
|-----------|--------|----------|
| SRP       | X      | High/Med/Low |
| OCP       | X      | High/Med/Low |
| LSP       | X      | High/Med/Low |
| ISP       | X      | High/Med/Low |
| DIP       | X      | High/Med/Low |
| Architecture | X   | High/Med/Low |

## Issues

### [File Path]

**Issue**: [Description]
**Principle**: [SRP/OCP/LSP/ISP/DIP/Architecture]
**Severity**: [High/Medium/Low]
**Line**: [Line number]
**Recommendation**: [How to fix]

## Passed Checks

[List what looks good]
```

**Output**: Audit report saved to evidence folder

---

## Phase 4: Verify

Summarize findings and determine if PR is ready.

- [ ] Save audit report to `.tmp/evidence/pr-solid/audit.md`
- [ ] Count high-severity issues (blockers)
- [ ] Count medium-severity issues (should fix)
- [ ] Count low-severity issues (nice to have)
- [ ] Report pass/fail status

### Pass Criteria

- **PASS**: No high-severity issues
- **WARN**: Medium-severity issues present (recommend fixing)
- **FAIL**: High-severity issues must be fixed before merge

**Output**: Pass/Warn/Fail status with summary

---

## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| Changed files list | `.tmp/evidence/pr-solid/changed-files.txt` | |
| Audit report | `.tmp/evidence/pr-solid/audit.md` | |

---

## Quick Reference: What to Flag

### High Severity (Blockers)

- Domain importing from infrastructure
- Application importing from infrastructure
- Hardcoded secrets or credentials
- Direct database access in services (no repository)
- Module-level mutable state in packages

### Medium Severity (Should Fix)

- Classes with 5+ dependencies (SRP violation)
- Files > 300 lines (likely SRP violation)
- Missing interface for external service
- Generic `Error` instead of domain error
- Duplicated code across files

### Low Severity (Nice to Have)

- Missing JSDoc on public interfaces
- Could extract helper function
- Consider splitting large interface
- Test coverage below 80%
