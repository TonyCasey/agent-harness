---
name: ticket-ship
description: End-to-end pipeline - ticket to draft PR (ticket-start -> implement -> test -> pr-ready -> pr-create -> close-out)
agent: developer
---

> **Base branch**: `$BASE_BRANCH` below means the configured base branch — plugin config `base_branch`, else the `BASE_BRANCH` env var (`.claude/.env`), else the repo default branch.

# Ticket Ship Workflow

One command drives a ticket from "Ready" to a reviewed draft PR into
`$BASE_BRANCH`: fetch the ticket, branch, implement with tests, validate, open the
draft PR, transition the ticket to In Review, and post the PR link back to
the ticket.

**Execute automatically** — do not prompt between stages. Stop ONLY at the
gates defined below. Runs interactively (user watching) or headless
(`claude -p`); the gates behave differently per mode as noted.

**Hard rules (all stages):**
- Base branch is `$BASE_BRANCH` (from config; do not assume `main`/`master`).
- Draft PRs only. Never merge. Never mark ready-for-review.
- One ticket per run.
- Every stop (success or failure) is mirrored to the ticket so the
  pipeline is observable from the project tool alone.

## Ticket operations

All ticket reads, comments, and status transitions go through the configured
project tool (`project_tool` in plugin config, else `$PROJECT_TOOL`) using its
CLI or REST API with credentials from `.claude/.env` — never MCP tools, since
headless runs have no MCP auth. Per-tool commands live in:

- `${CLAUDE_PLUGIN_ROOT}/rules/project-tool.md` — conventions, ticket formats, statuses
- `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/ticket-view.md` — fetch a ticket
- `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/ticket-transition.md` — change status

The inline snippets below are **ClickUp examples** (the trickiest tool:
custom-ID lookups need `custom_task_ids=true&team_id=$CLICKUP_TEAM_ID`, and
@mentions need the structured `comment` array, not `comment_text`). For Jira,
Linear, or GitHub Issues, substitute the equivalent command from the files
above — the pipeline steps are identical.

---

## Phase 1: Research

Delegate to `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/ticket-start.md` Phase 1:

- [ ] Normalize the ticket ref (bare number → `$PROJECT_KEY-N`)
- [ ] Fetch the ticket via the project tool (`ticket-view.md`). Example (ClickUp —
  always query by custom ID, never the internal task ID):
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
- **Headless**: post the questions as a ticket comment, set the ticket to
  a "needs info"-type status if one exists (otherwise leave status and rely
  on the comment), and EXIT. Never guess requirements.

Example (ClickUp):
```bash
curl -s -X POST "https://api.clickup.com/api/v2/task/$TICKET/comment?custom_task_ids=true&team_id=$CLICKUP_TEAM_ID" \
  -H "Authorization: $CLICKUP_API_KEY" -H "Content-Type: application/json" \
  -d '{"comment_text": "🤖 ticket-ship blocked: <questions>"}'
```

**Output**: Clear requirement summary, affected area, implementation type

---

## Phase 2: Plan

- [ ] Branch plan per `ticket-start.md`: fetch origin, checkout latest
  `$BASE_BRANCH`, create/checkout branch named exactly `$TICKET`
- [ ] Plan ticket transition to the working status (fetch exact status names
  first — see 3.1)
- [ ] Outline implementation:
  - **Bug** → follow `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/bug-fix.md` (failing test first,
    root cause, minimal fix)
  - **Feature/task** → follow `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/new-feature.md` (test
    stubs, implement, existing patterns)
- [ ] Read required rules per `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/develop.md` (clean
  architecture, testing principles, coding standards, commit standards)

**Output**: Branch plan, implementation plan with test cases

---

## Phase 3: Execute

### 3.1 Branch + ticket In Progress

- [ ] Working tree clean check (warn interactive / EXIT headless if dirty)
- [ ] `git fetch origin && git checkout $BASE_BRANCH && git pull --ff-only`
- [ ] `git checkout -b $TICKET` (or checkout + rebase onto `$BASE_BRANCH` if it exists)
- [ ] Fetch the exact status names from the project tool first — statuses
  vary per project/list (e.g. a ClickUp list may use "in development", not
  "in progress"; ClickUp: GET /api/v2/list/{list_id}) — then transition the
  ticket to the working status (`ticket-transition.md`)

### 3.2 Implement

- [ ] Execute the Phase 2 plan via `bug-fix.md` / `new-feature.md` Phase 3
- [ ] Small incremental commits: `fix($TICKET): ...` / `feat($TICKET): ...`
- [ ] Unit tests for all new/changed code (PR rule — not optional)

### 3.3 Test

- [ ] Fast feedback while iterating: run only the tests covering the changed
  code with the project's test runner (e.g. a single-file `npx jest <file>`
  run), plus the project's quick lint-fix command if it has one
- [ ] Authoritative check — if a local CI mirror command is configured
  (plugin config `ci_command`, else `$CI_COMMAND` env var — e.g.
  `scripts/ci-local.sh`, running the same jobs as the hosted CI), it is the
  gate:
  ```bash
  mkdir -p .claude/.tmp/evidence/ticket-ship/$TICKET   # tee can't create it
  set -o pipefail   # without it, tee's exit status masks a red run
  $CI_COMMAND 2>&1 | tee .claude/.tmp/evidence/ticket-ship/$TICKET/ci-local.txt
  ```
  If the mirror supports partial runs for slow suites, they may be used for
  intermediate iterations, but a full run must be green before Gate 2
  passes. Suites the mirror keeps behind opt-in flags still run in hosted
  CI on the PR — pass the flags when the change touches those areas.
- [ ] Without a configured CI command: run the affected test suites, lint,
  and typecheck with the project's own commands, and save outputs to
  `.claude/.tmp/evidence/ticket-ship/$TICKET/`

### 🚧 GATE 2 — Local CI green (max 3 fix iterations)

If the authoritative check fails (tests, lint, typecheck, builds, or repo
guards): fix and re-run. Count iterations. After the **3rd** failed
iteration, STOP:

- Never weaken, skip, or delete tests to get green.
- **Interactive**: report the failure with output; ask how to proceed.
- **Headless**: push the branch as-is (WIP, no PR), comment on the ticket
  with the failure summary + branch link, leave the working status,
  EXIT.

### 3.4 PR readiness

- [ ] Delegate to `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/pr-ready.md`: all changes committed,
  branch ahead of `$BASE_BRANCH`, no merge conflicts with `$BASE_BRANCH`, pushed to
  remote

### 🚧 GATE 3 — Codex cross-model review (max 2 rounds)

An independent model reviews the branch diff before the PR exists. Run
non-interactively (uses the local `~/.codex` auth — a ChatGPT login or an
API key registered via `printenv OPENAI_API_KEY | codex login --with-api-key`,
where the key lives as `OPEN_API_KEY` in `.claude/.env`):

```bash
codex exec review --base $BASE_BRANCH \
  2>&1 | tee .claude/.tmp/evidence/ticket-ship/$TICKET/codex-review-round1.md
```

Note: the codex CLI does not allow custom instructions together with
`--base` — the deterministic diff scope matters more, so use codex's
default review instructions. Codex labels findings `[P1]`/`[P2]`/`[P3]`
(highest priority first). After the run, classify each finding yourself as
**blocking | suggestion | nitpick** per `${CLAUDE_PLUGIN_ROOT}/rules/code-review.md` —
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
  - **Headless**: push the branch WIP (no PR), ticket comment with the
    verdict + branch link, EXIT (same shape as Gate 2 headless failure)
- [ ] Record the final verdict line for the PR description:
  `Cross-model review: codex — <N> blocking after <R> round(s)`
- [ ] Post the codex review summary as a ticket comment. Example (ClickUp —
  structured `comment` array, plain text, no markdown tables):
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

- [ ] Delegate to `${CLAUDE_PLUGIN_ROOT}/skills/ah/workflows/pr-create.md`. Its local-CI pre-flight
  reuses the Gate 2 evidence when HEAD is unchanged; if Gate 3 codex fixes
  added commits, it re-runs — that re-validation is wanted, not redundant.
  Non-negotiables:
  ```bash
  gh pr create --draft --base $BASE_BRANCH \
    --title "[$TICKET] - <short description>" \
    --body "<from ${CLAUDE_PLUGIN_ROOT}/templates/pr-description-template.txt>"
  ```
  Add any labels the project's conventions require (see
  `.claude/rules/pr-description.local.md` if present).
- [ ] Body follows `${CLAUDE_PLUGIN_ROOT}/rules/pr-description.md` (Changes, Testing,
  Functionality Review with test-verification checkboxes, Linked Issues
  with the ticket URL, Documentation). Take the ticket URL from the
  `url` field of the ticket snapshot — never construct/guess it
- [ ] Testing section includes the Gate 3 verdict line
  (`Cross-model review: codex — <N> blocking after <R> round(s)`)

### 🚧 GATE 4 — PR shape check

Verify before close-out; fix and re-verify if any fail:

- [ ] `gh pr view --json isDraft` → `true`
- [ ] `gh pr view --json baseRefName` → `$BASE_BRANCH`
- [ ] Title matches `[$TICKET] - ...`
- [ ] Any project-required labels present

**Output**: Draft PR URL

---

## Phase 4: Verify (close-out)

- [ ] Transition the ticket to the review status (`ticket-transition.md` —
  use the exact status name fetched in 3.1). Example (ClickUp):
  ```bash
  curl -s -X PUT "https://api.clickup.com/api/v2/task/$TICKET?custom_task_ids=true&team_id=$CLICKUP_TEAM_ID" \
    -H "Authorization: $CLICKUP_API_KEY" -H "Content-Type: application/json" \
    -d '{"status": "in review"}'
  ```
- [ ] Comment the PR link on the ticket. Example (ClickUp — use the
  structured `comment` array for mentions; `comment_text` does not support
  @mentions):
  ```bash
  curl -s -X POST "https://api.clickup.com/api/v2/task/$TICKET/comment?custom_task_ids=true&team_id=$CLICKUP_TEAM_ID" \
    -H "Authorization: $CLICKUP_API_KEY" -H "Content-Type: application/json" \
    -d '{"comment": [
      {"text": "🤖 ticket-ship: draft PR ready → <PR_URL>\nTests: <n> passing | Lint: clean | Typecheck: clean"}
    ]}'
  ```
- [ ] Notify the assignee that the PR is ready for review. Example (ClickUp
  structured mention):
  ```bash
  curl -s -X POST "https://api.clickup.com/api/v2/task/$TICKET/comment?custom_task_ids=true&team_id=$CLICKUP_TEAM_ID" \
    -H "Authorization: $CLICKUP_API_KEY" -H "Content-Type: application/json" \
    -d '{"comment": [
      {"type": "tag", "text": "@<assignee_name>"},
      {"text": " PR ready for review! <PR_URL>"}
    ]}'
  ```
- [ ] Confirm the ticket status is now the review status (re-fetch the ticket)
- [ ] Save run summary to `.claude/.tmp/evidence/ticket-ship/$TICKET/summary.md`
  (stages completed, gate outcomes, iteration counts, PR URL)
- [ ] Report: ticket, branch, PR URL, test/lint results, anything deferred

**Output**: Draft PR into `$BASE_BRANCH`, ticket In Review with PR link, evidence

---

## Failure handling summary

| Failure | Interactive | Headless |
|---|---|---|
| Ambiguous ticket (Gate 1) | Ask user | Ticket comment + exit |
| Dirty working tree | Warn + ask | Exit with comment |
| Local CI red after 3 iterations (Gate 2) | Report + ask | Push WIP branch, comment, exit |
| Blocking codex findings after 2 rounds (Gate 3) | Report + ask | Push WIP branch, comment, exit |
| codex unavailable (Gate 3) | Ask to skip | Skip; mark PR + evidence SKIPPED |
| PR shape wrong (Gate 4) | Fix + re-verify | Fix + re-verify; if impossible, comment + exit |
| Project tool API error on close-out | Report; PR already exists — give URL | Retry once, then exit non-zero (PR URL in stdout) |

---

## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| Ticket snapshot | `.claude/.tmp/evidence/ticket-ship/$TICKET/ticket.json` | |
| Local CI output (Gate 2) | `.claude/.tmp/evidence/ticket-ship/$TICKET/ci-local.txt` | |
| Test/lint output (no CI mirror) | `.claude/.tmp/evidence/ticket-ship/$TICKET/tests.txt`, `lint-typecheck.txt` | |
| Codex review round(s) | `.claude/.tmp/evidence/ticket-ship/$TICKET/codex-review-round*.md` | |
| Run summary | `.claude/.tmp/evidence/ticket-ship/$TICKET/summary.md` | |
