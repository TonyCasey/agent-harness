---
name: pr-review-local
description: Perform a full local code review on a pull request
agent: pr-reviewer
---

# PR Review Workflow (Local)

Full local review that clones the repository and reviews source files directly.

## Phase 1: Research

Clone repository and gather context.

- [ ] Load agent memory from `.claude/memory/pr-reviewer.json`
- [ ] Set up review directory:
  ```bash
  REVIEW_DIR=${REVIEW_DIR:-~/review}
  mkdir -p $REVIEW_DIR
  ```
- [ ] Clone and checkout PR:
  ```bash
  gh pr checkout {pr_number} -R {owner}/{repo} --detach
  ```
- [ ] Install dependencies if applicable
- [ ] Get PR metadata (title, description, changed files)
- [ ] Check memory for known patterns in this repo

**Output**: Local checkout ready, PR context

---

## Phase 2: Plan

Plan review approach based on changes.

- [ ] List changed files
- [ ] Identify high-risk areas
- [ ] Plan security review focus
- [ ] Prepare inline comment structure

**Output**: Review plan, focus areas

---

## Phase 3: Execute

Review source files and create pending review.

- [ ] **Review ACTUAL source files in `$REVIEW_DIR/` (NOT GitHub diff)**:
  - Read files from `$REVIEW_DIR/{repo_name}/src/...`
  - Check for bugs and logic errors
  - Verify error handling
  - Check code style consistency
  - Look for performance issues
- [ ] Security review:
  - Check for hardcoded secrets
  - Look for injection vulnerabilities
  - Verify input validation
  - Check authentication/authorization
- [ ] Collect inline comments (file, line, comment)
- [ ] Get commit SHA:
  ```bash
  COMMIT_SHA=$(gh pr view {pr_number} --json headRefOid -q .headRefOid)
  ```
- [ ] Create pending review on GitHub:
  ```bash
  gh api repos/{owner}/{repo}/pulls/{pr_number}/reviews \
    -f commit_id="$COMMIT_SHA" \
    --input - <<'EOF'
  {
    "event": "PENDING",
    "body": "## Summary\n...",
    "comments": [...]
  }
  EOF
  ```
- [ ] Save local backup to `.claude/reviews/pr-{pr_number}-review.md`

**Output**: Pending review created on GitHub

---

## Phase 4: Verify

Confirm review is ready for submission.

- [ ] Verify review appears on GitHub
- [ ] Save review evidence to `.claude/.tmp/evidence/pr-review-local/`
- [ ] Record common issues to `.claude/memory/pr-reviewer.json`
- [ ] Output:
  - "Pending review created with {N} inline comments"
  - "Submit with: `ah pr review-submit {repo} {pr_number}`"
  - "Local backup: `.claude/reviews/pr-{pr_number}-review.md`"

**Output**: Review confirmation, next steps

---

## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| Review backup | `.claude/reviews/pr-{number}-review.md` | |
| Review summary | `.claude/.tmp/evidence/pr-review-local/summary.md` | |
