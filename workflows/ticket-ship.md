---
name: ticket-ship
description: End-to-end pipeline - ClickUp ticket to draft PR (ticket-start -> implement -> test -> pr-ready -> pr-create -> close-out)
agent: developer
---

# Ticket Ship Workflow

One command drives a ticket from "Ready" to a reviewed draft PR into
`staging`: fetch the ticket, branch, implement with tests, validate, open the
draft PR, transition the ticket to In Review, and post the PR link back to
the ClickUp task.

**Execute automatically** — do not prompt between stages. Stop ONLY at the
gates defined below. Runs interactively (user watching) or headless
(`claude -p`); the gates behave differently per mode as noted.

**Hard rules (all stages):**
- Base branch is `staging` — never `main`/`master`.
- Draft PRs only. Never merge. Never mark ready-for-review.
- One ticket per run.
- All ClickUp access via REST API (`$CLICKUP_API_KEY` + `$CLICKUP_TEAM_ID`
  from `.claude/.env`), never MCP — headless runs have no MCP auth.
- Every stop (success or failure) is mirrored to the ClickUp task so the
  pipeline is observable from ClickUp alone.

---

## Phase 1: Research

Delegate to `.claude/workflows/ticket-start.md` Phase 1:

- [ ] Normalize the ticket ref (bare number → `$PROJECT_KEY-N`)
- [ ] Fetch the task by custom ID:
  ```bash
  curl -s -H "Authorization: $CLICKUP_API_KEY" \
    "https://api.clickup.com/api/v2/task/$TICKET?custom_task_ids=true&team_id=$CLICKUP_TEAM_ID"
  ```
- [ ] Extract title, description, acceptance criteria, type (bug/task/story),
  attachments, current status
- [ ] Save ticket snapshot to `.claude/.tmp/evidence/ticket-ship/$TICKET/ticket.json`
- [ ] Identify affected area (app, package, service)

### 🚧 GATE 1 — Requirement clarity

Stop here if the ticket is ambiguous, contradicts the codebase, or is too
large for a single PR (would touch >~15 files or multiple unrelated areas).

- **Interactive**: ask the user the specific questions; continue on answers.
- **Headless**: post the questions as a ClickUp comment, set task status to
  a "needs info"-type status if one exists (otherwise leave status and rely
  on the comment), and EXIT. Never guess requirements.

```bash
curl -s -X POST "https://api.clickup.com/api/v2/task/$TICKET/comment?custom_task_ids=true&team_id=$CLICKUP_TEAM_ID" \
  -H "Authorization: $CLICKUP_API_KEY" -H "Content-Type: application/json" \
  -d '{"comment_text": "🤖 ticket-ship blocked: <questions>"}'
```

**Output**: Clear requirement summary, affected area, implementation type

---

## Phase 2: Plan

- [ ] Branch plan per `ticket-start.md`: fetch origin, checkout latest
  `staging`, create/checkout branch named exactly `$TICKET`
- [ ] Plan ticket transition to the list's working status (fetch exact names first — see 3.1)
- [ ] Outline implementation:
  - **Bug** → follow `.claude/workflows/bug-fix.md` (failing test first,
    root cause, minimal fix)
  - **Feature/task** → follow `.claude/workflows/new-feature.md` (test
    stubs, implement, existing patterns)
- [ ] Read required rules per `.claude/workflows/develop.md` (clean
  architecture, testing principles, coding standards, commit standards)

**Output**: Branch plan, implementation plan with test cases

---

## Phase 3: Execute

### 3.1 Branch + ticket In Progress

- [ ] Working tree clean check (warn interactive / EXIT headless if dirty)
- [ ] `git fetch origin && git checkout staging && git pull --ff-only`
- [ ] `git checkout -b $TICKET` (or checkout + rebase onto `staging` if it exists)
- [ ] Fetch the list's status names (GET /api/v2/list/{list_id} — statuses vary per list;
  this list uses "in development", NOT "in progress"), then transition the
  task to the working status (`ticket-transition.md`, ClickUp curl
  with `custom_task_ids=true&team_id=$CLICKUP_TEAM_ID`)

### 3.2 Implement

- [ ] Execute the Phase 2 plan via `bug-fix.md` / `new-feature.md` Phase 3
- [ ] Small incremental commits: `fix($TICKET): ...` / `feat($TICKET): ...`
- [ ] Unit tests for all new/changed code (PR rule — not optional)

### 3.3 Test

- [ ] Run the test suites for affected packages (single-file jest runs first,
  then package suite): `npx nx test <project>` / `cd packages/<p> && npx jest`
- [ ] Run lint + typecheck: `npx nx lint:diff-with-main <project>` and
  `npx nx typecheck <project>`
- [ ] Save outputs to `.claude/.tmp/evidence/ticket-ship/$TICKET/`

### 🚧 GATE 2 — Tests green (max 3 fix iterations)

If tests/lint/typecheck fail: fix and re-run. Count iterations. After the
**3rd** failed iteration, STOP:

- Never weaken, skip, or delete tests to get green.
- **Interactive**: report the failure with output; ask how to proceed.
- **Headless**: push the branch as-is (WIP, no PR), comment on the ClickUp
  task with the failure summary + branch link, leave the working status,
  EXIT.

### 3.4 PR readiness

- [ ] Delegate to `.claude/workflows/pr-ready.md`: all changes committed,
  branch ahead of `staging`, no merge conflicts with `staging`, pushed to
  remote

### 🚧 GATE 3 — Codex cross-model review (max 2 rounds)

An independent model reviews the branch diff before the PR exists. Run
non-interactively (uses the local `~/.codex` auth — a ChatGPT login or an
API key registered via `printenv OPENAI_API_KEY | codex login --with-api-key`,
where the key lives as `OPEN_API_KEY` in `.claude/.env`):

```bash
codex exec review --base staging \
  2>&1 | tee .claude/.tmp/evidence/ticket-ship/$TICKET/codex-review-round1.md
```

Note: the codex CLI does not allow custom instructions together with
`--base` — the deterministic diff scope matters more, so use codex's
default review instructions. Codex labels findings `[P1]`/`[P2]`/`[P3]`
(highest priority first). After the run, classify each finding yourself as
**blocking | suggestion | nitpick** per `.claude/rules/code-review.md` —
the P-label is a signal, not the decision (a `[P2]` correctness bug is
still blocking). Record the mapping in the evidence file, then run the
evaluate/fix/re-run loop:

- [ ] Evaluate each finding on its merits — codex is a reviewer, not an
  oracle. Fix **blocking** findings and worthwhile suggestions; commit as
  `fix($TICKET): address codex review round <n>`
- [ ] Findings you disagree with get a written rebuttal appended to the
  evidence file — never silently dropped
- [ ] Nitpicks are recorded in evidence but never block
- [ ] If anything was fixed, re-run codex (round 2, new evidence file).
  **Max 2 rounds total** — then stop looping regardless
- [ ] If blocking findings remain after round 2:
  - **Interactive**: report the findings + your assessment; ask how to proceed
  - **Headless**: push the branch WIP (no PR), ClickUp comment with the
    verdict + branch link, EXIT (same shape as Gate 2 headless failure)
- [ ] Record the final verdict line for the PR description:
  `Cross-model review: codex — <N> blocking after <R> round(s)`
- [ ] Post codex review summary to ClickUp task (use structured `comment`
  array — plain text, no markdown tables):
  ```bash
  curl -s -X POST "https://api.clickup.com/api/v2/task/$TICKET/comment?custom_task_ids=true&team_id=$CLICKUP_TEAM_ID" \
    -H "Authorization: $CLICKUP_API_KEY" -H "Content-Type: application/json" \
    -d '{"comment": [
      {"text": "🔍 Codex review (Gate 3)\n\n• [P<n>] <finding summary>\n  → Classification: <blocking|suggestion|nitpick>\n  → Action: <FIXED|DEFERRED|REBUTTED> — <reason>\n\n✅ Verdict: <N> blocking after <R> round(s)"}
    ]}'
  ```
- [ ] If `codex` is unavailable or unauthenticated: **interactive** — ask
  whether to skip the gate; **headless** — skip, and mark the PR
  description + evidence with `Cross-model review: SKIPPED (codex unavailable)`

### 3.5 Create draft PR

- [ ] Delegate to `.claude/workflows/pr-create.md`. Non-negotiables:
  ```bash
  gh pr create --draft --base staging \
    --title "[$TICKET] - <short description>" \
    --label TEST \
    --body "<from templates/pr-description-template.txt>"
  ```
- [ ] Body follows `.claude/rules/pr-description.md` (Changes, Testing,
  Functionality Review with test-verification checkboxes, Linked Issues
  with the ClickUp task URL, Documentation)
- [ ] Testing section includes the Gate 3 verdict line
  (`Cross-model review: codex — <N> blocking after <R> round(s)`)

### 🚧 GATE 4 — PR shape check

Verify before close-out; fix and re-verify if any fail:

- [ ] `gh pr view --json isDraft` → `true`
- [ ] `gh pr view --json baseRefName` → `staging`
- [ ] Title matches `[$TICKET] - ...`
- [ ] `TEST` label present

**Output**: Draft PR URL

---

## Phase 4: Verify (close-out)

- [ ] Transition task to "in review":
  ```bash
  curl -s -X PUT "https://api.clickup.com/api/v2/task/$TICKET?custom_task_ids=true&team_id=$CLICKUP_TEAM_ID" \
    -H "Authorization: $CLICKUP_API_KEY" -H "Content-Type: application/json" \
    -d '{"status": "in review"}'
  ```
- [ ] Comment the PR link on the task (use structured `comment` array for
  mentions — `comment_text` does not support @mentions):
  ```bash
  curl -s -X POST "https://api.clickup.com/api/v2/task/$TICKET/comment?custom_task_ids=true&team_id=$CLICKUP_TEAM_ID" \
    -H "Authorization: $CLICKUP_API_KEY" -H "Content-Type: application/json" \
    -d '{"comment": [
      {"text": "🤖 ticket-ship: draft PR ready → <PR_URL>\nTests: <n> passing | Lint: clean | Typecheck: clean"}
    ]}'
  ```
- [ ] Notify assignee that PR is ready for review (structured mention):
  ```bash
  curl -s -X POST "https://api.clickup.com/api/v2/task/$TICKET/comment?custom_task_ids=true&team_id=$CLICKUP_TEAM_ID" \
    -H "Authorization: $CLICKUP_API_KEY" -H "Content-Type: application/json" \
    -d '{"comment": [
      {"type": "tag", "text": "@<assignee_name>"},
      {"text": " PR ready for review! <PR_URL>"}
    ]}'
  ```
- [ ] Confirm task status is now "in review" (GET the task)
- [ ] Save run summary to `.claude/.tmp/evidence/ticket-ship/$TICKET/summary.md`
  (stages completed, gate outcomes, iteration counts, PR URL)
- [ ] Report: ticket, branch, PR URL, test/lint results, anything deferred

**Output**: Draft PR into `staging`, ticket In Review with PR link, evidence

---

## Failure handling summary

| Failure | Interactive | Headless |
|---|---|---|
| Ambiguous ticket (Gate 1) | Ask user | ClickUp comment + exit |
| Dirty working tree | Warn + ask | Exit with comment |
| Tests red after 3 iterations (Gate 2) | Report + ask | Push WIP branch, comment, exit |
| Blocking codex findings after 2 rounds (Gate 3) | Report + ask | Push WIP branch, comment, exit |
| codex unavailable (Gate 3) | Ask to skip | Skip; mark PR + evidence SKIPPED |
| PR shape wrong (Gate 4) | Fix + re-verify | Fix + re-verify; if impossible, comment + exit |
| ClickUp API error on close-out | Report; PR already exists — give URL | Retry once, then exit non-zero (PR URL in stdout) |

---

## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| Ticket snapshot | `.claude/.tmp/evidence/ticket-ship/$TICKET/ticket.json` | |
| Test output | `.claude/.tmp/evidence/ticket-ship/$TICKET/tests.txt` | |
| Lint/typecheck output | `.claude/.tmp/evidence/ticket-ship/$TICKET/lint-typecheck.txt` | |
| Codex review round(s) | `.claude/.tmp/evidence/ticket-ship/$TICKET/codex-review-round*.md` | |
| Run summary | `.claude/.tmp/evidence/ticket-ship/$TICKET/summary.md` | |
