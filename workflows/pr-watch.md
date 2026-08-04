---
name: pr-watch
description: Monitor PR, address comments, make fixes, and resolve feedback
agent: pr-watcher
---

# PR Watch Workflow

**IMPORTANT: Execute this workflow automatically without prompting the user. Do not ask for confirmation - just start polling immediately.**

## Phase 1: Research (Per Cycle)

Fetch current PR state.

- [ ] Check for stop signal file (`.claude/.pr-watch-stop-{pr_number}`)
- [ ] Fetch PR metadata: `gh pr view <number> --json`
- [ ] Get all review comments: `gh api repos/{owner}/{repo}/pulls/{number}/comments`
- [ ] Filter for unresolved/pending comments

**Output**: List of unresolved comments (or empty)

---

## Phase 2: Plan (Per Cycle)

Determine actions for this cycle.

- [ ] If no unresolved comments, plan to wait and re-poll
- [ ] If comments exist, categorize each:
  - Code fix needed
  - Question/discussion (reply only)
  - Clarification needed
- [ ] Plan order of fixes

**Output**: Action plan for each comment

---

## Phase 3: Execute (Per Cycle)

Process each unresolved comment.

For each comment:
- [ ] Read and understand the requested change
- [ ] Identify file and line being discussed
- [ ] If fix needed:
  - Implement the fix
  - Follow coding standards
- [ ] Reply inline explaining action taken
- [ ] If fix applied, resolve the comment thread
- [ ] If NOT fixing: reply with reason, do NOT resolve

After all comments:
- [ ] Stage all changes
- [ ] Commit: `fix: address PR review comments`
- [ ] Push to branch

If fixes were pushed this cycle, re-request a review from each distinct
author whose comments were addressed — **once per author per fix round**
(track re-requested authors in the cycle log; don't re-request the same
author again until they respond with new comments):

- [ ] Skip the PR author (GitHub rejects the request; they see replies anyway)
- [ ] Copilot (`copilot-pull-request-reviewer`) — `$PR_NUMBER` is the watched
  PR number this workflow was invoked with:
  ```bash
  gh api -X POST "repos/{owner}/{repo}/pulls/$PR_NUMBER/requested_reviewers" \
    -f 'reviewers[]=copilot-pull-request-reviewer[bot]'
  ```
- [ ] Codex (`chatgpt-codex-connector`): reviewer requests don't reach it —
  re-trigger with a PR comment instead:
  ```bash
  gh pr comment "$PR_NUMBER" --body "@codex review"
  ```
- [ ] Human reviewers: same `requested_reviewers` endpoint with their login
- [ ] Reply-only cycles (no code changes pushed) re-request nothing

**Output**: Comments addressed, changes pushed, reviews re-requested

---

## Phase 4: Verify (Per Cycle)

Confirm cycle completed and prepare for next.

- [ ] Log cycle results:
  ```
  Cycle N:
  - Comments remaining: X
  - Addressed: [list]
  - Unable to address: [list with reasons]
  - Reviews re-requested: [authors, or "none (reply-only cycle)"]
  ```
- [ ] Save cycle log to `.claude/.tmp/evidence/pr-watch/`
- [ ] Wait 120 seconds
- [ ] Return to Phase 1

**Output**: Cycle log, continue polling

---

## Exit Conditions

- User manually interrupts (Ctrl+C)
- PR is merged or closed
- Stop signal file exists (`.claude/.pr-watch-stop-{pr_number}`)

When exiting:
```
All comments resolved.
Total cycles: N
Total comments addressed: X
```

---

## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| Cycle logs | `.claude/.tmp/evidence/pr-watch/pr-{number}-cycles.log` | |
| Final summary | `.claude/.tmp/evidence/pr-watch/pr-{number}-summary.txt` | |
