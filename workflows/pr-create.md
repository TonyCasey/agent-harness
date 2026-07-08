---
name: pr-create
description: Create a pull request with proper description and checks
agent: pr-creator
---

# PR Create Workflow

## Required Rules

**You MUST read and follow these rules before creating the PR:**

1. **PR Description**: Check for `.claude/rules/pr-description.local.md` first, fall back to `.claude/rules/pr-description.md`
2. **Commit Standards**: Check for `.claude/rules/commit-standards.local.md` first, fall back to `.claude/rules/commit-standards.md`

**These are not optional.** Verify compliance before creating the PR.

---

## Phase 1: Research

Gather context about the current branch and changes.

- [ ] Verify on a feature branch (not `staging`/`main`)
- [ ] Check for uncommitted changes
- [ ] Get commits since branching from `staging`
- [ ] Identify changed files
- [ ] Extract ticket from branch name (PROJ-XXXX)
- [ ] Detect change type (feature, fix, refactor, docs)

**Output**: Branch context, commit list, change summary

---

## Phase 2: Plan

Validate readiness and plan PR content.

- [ ] Ensure branch is pushed to remote
- [ ] Check for merge conflicts with `staging`
- [ ] Review test coverage for changed code
- [ ] Identify any missing tests that must be added
- [ ] Plan PR title and description sections

**Output**: Readiness checklist, PR structure plan

---

## Phase 3: Execute

Run checks, create tests if needed, and create the PR.

- [ ] Run linters
- [ ] Run tests (all must pass)
- [ ] **Create unit tests for new/changed code if missing**
- [ ] Generate PR description using `templates/pr-description-template.local.txt` if exists, `templates/pr-description-template.local.txt` if not
- [ ] Create PR in draft mode:
  ```bash
  gh pr create --draft --title "[PROJ-XXXX] - ..." --base staging --body "..."
  ```

PRs are created as drafts to allow for:
- CI checks to run
- Self-review before requesting reviewers

**Output**: Draft PR created

---

## Phase 4: Verify

Confirm PR was created correctly and record evidence.

- [ ] Confirm PR URL is accessible
- [ ] Verify CI checks have started
- [ ] Save PR metadata to `.claude/.tmp/evidence/pr-create/`
- [ ] Output PR URL to user
- [ ] Remind to transition ticket to Code Review status

**Output**: PR URL, CI status snapshot

---

## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| PR metadata | `.claude/.tmp/evidence/pr-create/pr-{number}.json` | |
| Test results | `.claude/.tmp/evidence/pr-create/test-output.txt` | |
| Lint results | `.claude/.tmp/evidence/pr-create/lint-output.txt` | |
