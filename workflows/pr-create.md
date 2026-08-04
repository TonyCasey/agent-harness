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

- [ ] Run the authoritative checks. If the project provides a local CI
  mirror (`scripts/ci-local.sh` — same path-gated jobs as the hosted CI),
  it is the gate; all triggered jobs must pass before the PR is created:
  ```bash
  set -o pipefail   # without it, tee's exit status masks a red run
  scripts/ci-local.sh --dry-run   # see which jobs the diff triggers
  scripts/ci-local.sh 2>&1 | tee .claude/.tmp/evidence/pr-create/ci-local.txt
  ```
  Reuse rule: skip the run if an evidence file from this session (e.g.
  ticket-ship Gate 2) shows the **same HEAD sha** in its header and ends
  green — copy it into the pr-create evidence path instead. Any new commit
  since that run means a fresh run.
- [ ] Without a CI mirror script: run linters and tests directly (all must
  pass), saving outputs to the evidence paths below
- [ ] **Create unit tests for new/changed code if missing** (then re-run
  the checks)
- [ ] Generate PR description using `templates/pr-description-template.local.txt`
  if it exists, falling back to `templates/pr-description-template.txt`
- [ ] Create PR in draft mode:
  ```bash
  gh pr create --draft --title "[PROJ-XXXX] - ..." --base staging --body "..."
  ```
- [ ] If the repo uses Copilot code review, request it (works on drafts).
  `gh pr edit --add-reviewer` cannot resolve the bot — use the REST endpoint:
  ```bash
  PR_NUMBER=$(gh pr view --json number --jq .number)
  gh api -X POST "repos/{owner}/{repo}/pulls/$PR_NUMBER/requested_reviewers" \
    -f 'reviewers[]=copilot-pull-request-reviewer[bot]'
  ```

PRs are created as drafts to allow for:
- CI checks to run
- Self-review before requesting reviewers

**Output**: Draft PR created

---

## Phase 4: Verify

Confirm PR was created correctly and record evidence.

- [ ] Confirm PR URL is accessible
- [ ] If a Copilot review was requested, verify it appears in requested
  reviewers: `gh pr view --json reviewRequests`
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
| Local CI output | `.claude/.tmp/evidence/pr-create/ci-local.txt` | |
| Test results (no CI mirror) | `.claude/.tmp/evidence/pr-create/test-output.txt` | |
| Lint results (no CI mirror) | `.claude/.tmp/evidence/pr-create/lint-output.txt` | |
