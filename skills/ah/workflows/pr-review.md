---
name: pr-review
description: Lightweight online PR review (no local setup)
agent: pr-reviewer
---

# PR Review Workflow (Online)

Fast, lightweight review using GitHub API only. No local cloning or services.

## Phase 1: Research

Fetch PR details and understand the changes.

- [ ] Load agent memory from `.claude/memory/pr-reviewer.json`
- [ ] Fetch PR metadata:
  ```bash
  gh pr view {pr_number} -R {organization}/{repo} --json title,body,headRefOid,baseRefName,headRefName,files,additions,deletions
  ```
- [ ] Get the diff:
  ```bash
  gh pr diff {pr_number} -R {organization}/{repo}
  ```
- [ ] Understand the purpose of the PR from title/body
- [ ] Check for known patterns from memory

**Output**: PR context, diff, change scope

---

## Phase 2: Plan

Plan the review approach based on change type.

- [ ] Identify high-risk areas to focus on
- [ ] Note files that need security review
- [ ] Plan review structure (summary, issues, suggestions)
- [ ] Prepare inline comment list

**Output**: Review plan, focus areas

---

## Phase 3: Execute

Review code and create pending review on GitHub.

- [ ] Review diff for:
  - Bugs and logic errors
  - Error handling
  - Code style consistency
  - Performance issues
  - Security concerns (hardcoded secrets, injection, input validation)
- [ ] Collect inline comments (file, line, comment)
- [ ] Get commit SHA:
  ```bash
  COMMIT_SHA=$(gh pr view {pr_number} -R {organization}/{repo} --json headRefOid -q .headRefOid)
  ```
- [ ] Create pending review with inline comments:
  ```bash
  gh api repos/{organization}/{repo}/pulls/{pr_number}/reviews \
    -f commit_id="$COMMIT_SHA" \
    --input - <<'EOF'
  {
    "event": "PENDING",
    "body": "## Summary\n{overall assessment}\n\n## Highlights\n- {good things}",
    "comments": [...]
  }
  EOF
  ```

**Output**: Pending review created on GitHub

---

## Phase 4: Verify

Confirm review was created and notify user.

- [ ] Verify review appears on GitHub
- [ ] Save review summary to `.claude/.tmp/evidence/pr-review/`
- [ ] Record common issues found to `.claude/memory/pr-reviewer.json`
- [ ] Output:
  - "Pending review created on GitHub with {N} inline comments"
  - "PR: https://github.com/{organization}/{repo}/pull/{pr_number}"
  - "Submit with: `ah pr review-submit {repo} {pr_number}`"

**Output**: Review confirmation, next steps

---

## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| Review summary | `.claude/.tmp/evidence/pr-review/pr-{number}-summary.md` | |
| Issues found | `.claude/.tmp/evidence/pr-review/pr-{number}-issues.json` | |
