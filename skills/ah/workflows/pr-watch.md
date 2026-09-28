---
name: pr-watch
description: Monitor a PR and address its review feedback in rounds, one push per round
agent: pr-watcher
---

# PR Watch Workflow

**IMPORTANT: Execute this workflow automatically without prompting the user. Do not ask for confirmation - just start polling immediately.**

Feedback is handled in **rounds**, not comment by comment. Every push starts a
new CI run and a new review from each automated reviewer, so fixing each
comment as it arrives turns one review into many. A round waits until every
automated reviewer has reviewed the latest commit, fixes everything that is
open, and pushes once.

**Automated reviewers** are the bots that review pull requests on their own:
Copilot (`copilot-pull-request-reviewer[bot]`), CodeRabbit (`coderabbitai[bot]`)
and Codex (`chatgpt-codex-connector[bot]`). A bot is **expected** on this PR once
it has done any of these:
- reviewed any commit of it
- commented on it (CodeRabbit posts its summary comment minutes before its
  first review)
- been requested as a reviewer and not reviewed yet (Copilot, before its
  first review)

Without the last two, a PR's first round would start as soon as the fastest
bot finished and miss the others' first reviews. An expected bot has **caught
up** when it has submitted a review whose `commit_id` is the PR's head SHA.

## Phase 1: Research (Per Cycle)

Fetch the PR's state and decide whether a round can start.

- [ ] Check for stop signal file (`.claude/.pr-watch-stop-{pr_number}`)
- [ ] Fetch PR metadata: `gh pr view <number> --json state,headRefOid,reviews,comments`
- [ ] Exit if the PR is merged or closed
- [ ] List the expected automated reviewers and whether each has caught up:
  ```bash
  # Reviews, with the commit each one reviewed
  gh api "repos/{owner}/{repo}/pulls/<number>/reviews" --paginate \
    --jq '.[] | "\(.user.login) \(.commit_id)"'
  # Bots that have commented on the PR
  gh api "repos/{owner}/{repo}/issues/<number>/comments" --paginate \
    --jq '.[].user.login'
  # Reviewers requested and not yet reviewed
  gh api "repos/{owner}/{repo}/pulls/<number>/requested_reviewers" \
    --jq '.users[].login'
  ```
  A pending request for Copilot lists it as `Copilot`, while its reviews come
  from `copilot-pull-request-reviewer[bot]`: treat the two as the same bot.
  Other bots that comment, such as `sonarqubecloud[bot]`, are not reviewers.
- [ ] Note when the head commit was pushed (the round log records each push
  this workflow makes; otherwise use the head commit's committer date)
- [ ] Fetch CI state: `gh pr checks <number> --json name,bucket`

**Output**: head SHA, reviewers caught up or pending, time since the push, CI state

---

## Phase 2: Plan (Per Cycle)

Start a round only when the reviews for the head commit are in.

- [ ] If any expected reviewer has not caught up and the head was pushed less
  than **15 minutes** ago, do nothing this cycle: wait and re-poll. Past 15
  minutes, start the round without it and note that in the round log.
- [ ] Otherwise collect everything open for this round:
  - Unresolved review threads, from bots and humans:
    ```bash
    gh api graphql -f query='query { repository(owner:"{owner}", name:"{repo}") {
      pullRequest(number: <number>) { reviewThreads(first: 100) { nodes {
        id isResolved path line comments(first: 10) { nodes { databaseId author { login } body } }
      } } } } }'
    ```
  - Findings stated only in review bodies for the head commit, which have no
    thread to reply to: Copilot's "Previously missed" and "Open" items, and
    CodeRabbit's "Outside diff range comments"
  - Failed CI checks: read the failing job's log and decide whether the PR
    caused it
- [ ] If nothing is open, every expected reviewer has caught up and CI has
  finished green, the PR is done: go to Exit
- [ ] Categorize each item:
  - Code fix needed
  - Question or discussion (reply only)
  - Declined (reply with the reason, do not change code)
  - Clarification needed
- [ ] Look for items with a shared root cause and plan one fix for them

**Output**: the round's items and the planned action for each, or "waiting for <reviewers>"

---

## Phase 3: Execute (Per Round)

Fix everything in the round, then push once.

- [ ] Implement every planned fix, following the coding standards
- [ ] Run the tests for the code you changed
- [ ] Run the configured local CI command (`$CI_COMMAND`, e.g.
  `scripts/ci-local.sh`) when one is set, so the push does not start a CI run
  that fails on something checkable locally
- [ ] Commit once: `fix: address PR review round N`
- [ ] Push once
- [ ] Reply to every item:
  - Threads: reply inline with the action taken, naming the commit; resolve
    the thread only if a fix was applied
  - Declined or reply-only threads: reply with the reason, do not resolve
  - Review-body findings: one PR comment that lists each finding and what was
    done about it
- [ ] Re-request a review from each distinct author whose items were fixed,
  **once per round**:
  - [ ] Skip the PR author (GitHub rejects the request; they see replies anyway)
  - [ ] Copilot — `<number>` is the watched PR number:
    ```bash
    gh api -X POST "repos/{owner}/{repo}/pulls/<number>/requested_reviewers" \
      -f 'reviewers[]=copilot-pull-request-reviewer[bot]'
    ```
  - [ ] Codex (`chatgpt-codex-connector[bot]`): reviewer requests don't reach
    it — re-trigger with a PR comment instead:
    ```bash
    gh pr comment <number> --body "@codex review"
    ```
  - [ ] CodeRabbit reviews every push on its own: no request needed
  - [ ] Human reviewers: same `requested_reviewers` endpoint with their login
  - [ ] Reply-only rounds (no code pushed) re-request nothing

**Output**: one commit and one push for the round, every item replied to, reviews re-requested

---

## Phase 4: Verify (Per Cycle)

Log the cycle and continue polling.

- [ ] Log each cycle:
  ```
  Cycle N (round M, or waiting):
  - Head: <sha>; reviewers caught up: [list]; pending: [list, minutes waited]
  - Items this round: X (threads Y, review-body findings Z, failed checks W)
  - Fixed: [list]
  - Replied without a fix: [list with reasons]
  - Pushed: <sha> | nothing
  - Reviews re-requested: [authors, or "none"]
  ```
- [ ] Save the cycle log to `.claude/.tmp/evidence/pr-watch/`
- [ ] Wait 120 seconds
- [ ] Return to Phase 1

**Output**: Cycle log, continue polling

---

## Exit Conditions

- User manually interrupts (Ctrl+C)
- PR is merged or closed
- Stop signal file exists (`.claude/.pr-watch-stop-{pr_number}`)
- Nothing is open, every expected reviewer has caught up on the head commit, and CI finished green

When exiting:
```
PR watch finished: <merged | closed | stopped | nothing left open>
Rounds (pushes): N
Items addressed: X (declined or reply-only: Y)
```

---

## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| Cycle logs | `.claude/.tmp/evidence/pr-watch/pr-{number}-cycles.log` | |
| Final summary | `.claude/.tmp/evidence/pr-watch/pr-{number}-summary.txt` | |
