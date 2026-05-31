---
name: ticket-start
description: Start work on a ticket - read requirement, branch from staging, begin development
agent: developer
---

# Ticket Start Workflow

End-to-end start of work on a ticket: fetch the ticket, create a branch off
`staging` named after the ticket (e.g. `$PROJECT_KEY-XXX`), transition the
ticket to In Progress, understand the requirement, and begin implementation.

**Execute automatically** - no prompt for branch/status when the ticket is
unambiguous.

## Phase 1: Research

Detect tool, fetch ticket, and understand the requirement.

- [ ] Read `$PROJECT_TOOL`, `$PROJECT_KEY`, `$PROJECT_BASE_URL` from `.env`
- [ ] Extract ticket reference from arguments. Accept either:
  - Bare number (e.g. `28`) → normalize to `$PROJECT_KEY-28`
  - Full ID (e.g. `LTBL-28`) → use as-is
- [ ] Fetch ticket details using the configured tool (see Phase 3 commands in
  `.claude/workflows/ticket-view.md`). For ClickUp, ALWAYS query by
  `custom_id` with `custom_task_ids=true&team_id=$CLICKUP_TEAM_ID` — do not
  use the internal ClickUp task ID (see feedback memory
  `clickup-ticket-refs`).
- [ ] Extract from the ticket:
  - Title, description, acceptance criteria
  - Type (bug / task / story)
  - Attachments (screenshots etc.) — note URLs for reference
  - Priority / severity
  - Current status
- [ ] Load agent memory from `.claude/memory/developer.json` for related
  patterns or past decisions
- [ ] Identify the affected area of the codebase (app, service, package)

**Output**: Ticket ID, branch name (`$PROJECT_KEY-XXX`), clear requirement
summary, affected area identified

---

## Phase 2: Plan

Plan branching, ticket transition, and implementation approach.

- [ ] Confirm base branch is `staging` (this project's integration branch)
- [ ] Plan: `git fetch origin && git checkout staging && git pull --ff-only`
- [ ] Plan: `git checkout -b $PROJECT_KEY-XXX` (skip if branch already exists
  — then `git checkout $PROJECT_KEY-XXX` and rebase if needed)
- [ ] Plan ticket transition to "In Progress" (see
  `.claude/workflows/ticket-transition.md`)
- [ ] Outline implementation approach:
  - For bugs: reproduction, root cause investigation, failing test first
  - For features: file layout, test cases, existing patterns to follow
- [ ] Flag ambiguity in requirements — ask the user before coding if the
  ticket is unclear or scope is too large

**Output**: Branch plan, transition plan, implementation approach

---

## Phase 3: Execute

Create branch, transition ticket, begin work.

### 3.1 Branch from staging

```bash
git fetch origin
git checkout staging
git pull --ff-only
git checkout -b $PROJECT_KEY-XXX    # or: git checkout $PROJECT_KEY-XXX
```

- [ ] Verify working tree is clean before checkout (warn user if dirty)
- [ ] If branch already exists locally or on remote, check out and rebase
  onto latest `staging` rather than creating anew

### 3.2 Transition ticket to In Progress

Delegate to `.claude/workflows/ticket-transition.md`. For ClickUp:

```bash
curl -X PUT "https://api.clickup.com/api/v2/task/$PROJECT_KEY-XXX?custom_task_ids=true&team_id=$CLICKUP_TEAM_ID" \
  -H "Authorization: $CLICKUP_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status": "in progress"}'
```

### 3.3 Begin implementation

- [ ] For **bugs**: follow `.claude/workflows/bug-fix.md` from Phase 3
  (write failing test, find root cause, minimal fix)
- [ ] For **features**: follow `.claude/workflows/new-feature.md` from
  Phase 3 (test stubs, implement, commit)
- [ ] Make small incremental commits with conventional format referencing
  the ticket: `fix($PROJECT_KEY-XXX): ...` or `feat($PROJECT_KEY-XXX): ...`

**Output**: Branch created and checked out, ticket In Progress,
implementation started

---

## Phase 4: Verify

Confirm environment is ready for work.

- [ ] Current branch matches `$PROJECT_KEY-XXX`:
  `git branch --show-current`
- [ ] Branch is based on latest `staging`:
  `git log --oneline staging..HEAD` and `git log --oneline HEAD..origin/staging`
- [ ] Ticket status is "In Progress" in the project tool
- [ ] Save ticket snapshot to `.claude/.tmp/evidence/ticket-start/$PROJECT_KEY-XXX.json`
- [ ] Display summary: ticket, branch, base, next implementation step

**Output**: Verified start state with evidence

---

## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| Ticket snapshot | `.claude/.tmp/evidence/ticket-start/$PROJECT_KEY-XXX.json` | |
| Branch log | `.claude/.tmp/evidence/ticket-start/$PROJECT_KEY-XXX-branch.txt` | |

---

## Notes

- Base branch is `staging` for this repo (not `main`).
- Branch naming MUST match the ticket custom ID exactly (e.g. `LTBL-28`) so
  `ah pr create` and other workflows can link the PR back to the ticket.
- If the ticket is a sub-task, still name the branch after the sub-task's
  custom ID, not the parent.
