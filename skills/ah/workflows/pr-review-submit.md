---
name: pr-review-submit
description: Submit a pending PR review
agent: pr-reviewer
---

# PR Review Submit Workflow

Arguments: `ah pr review-submit <repo> <pr_number>`

## Phase 1: Research

Check for pending review on GitHub.

- [ ] Get pending review ID:
  ```bash
  REVIEW_ID=$(gh api repos/{github_organization}/{repo}/pulls/{pr_number}/reviews \
    --jq '.[] | select(.state == "PENDING") | .id' | head -1)
  ```
- [ ] If no pending review found, error:
  "No pending review found. Run `ah pr review {repo} {pr_number}` first."
- [ ] Count pending comments

**Output**: Review ID, comment count

---

## Phase 2: Plan

Confirm submission details with user.

- [ ] Show number of pending comments
- [ ] Ask for review decision:
  - APPROVE
  - REQUEST_CHANGES
  - COMMENT
- [ ] Optionally allow editing the summary body

**Output**: User's review decision

---

## Phase 3: Execute

Submit the pending review.

- [ ] Submit review with chosen event:
  ```bash
  gh api repos/{github_organization}/{repo}/pulls/{pr_number}/reviews/$REVIEW_ID/events \
    -f event="{APPROVE|REQUEST_CHANGES|COMMENT}" \
    -f body="{optional additional summary}"
  ```

**Output**: Review submitted

---

## Phase 4: Verify

Confirm submission and log result.

- [ ] Verify review state changed from PENDING
- [ ] Save submission log to `.claude/.tmp/evidence/pr-review-submit/`
- [ ] Output:
  - "Review submitted successfully"
  - "View at: https://github.com/{github_organization}/{repo}/pull/{pr_number}"

**Output**: Submission confirmation

---

## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| Submission log | `.claude/.tmp/evidence/pr-review-submit/pr-{number}.log` | |
