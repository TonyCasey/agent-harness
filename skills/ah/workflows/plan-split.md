---
name: plan-split
description: Create an execution plan with actionable tasks
agent: planner
---

# Plan Split Workflow

## Phase 1: Research

Load and understand the feature plan.

- [ ] Load agent memory from `.claude/memory/planner.json`
- [ ] Read plan from specified path
- [ ] Parse requirements, approach, and acceptance criteria
- [ ] Check for estimation patterns from memory
- [ ] Identify dependencies between requirements

**Output**: Parsed plan, dependency map

---

## Phase 2: Plan

Design the task breakdown.

- [ ] Identify logical work units
- [ ] Ensure each task is:
  - Small enough for a single PR
  - Clear and actionable
  - Has defined acceptance criteria
- [ ] Order tasks by dependency (foundation first)
- [ ] Estimate relative complexity

**Output**: Draft task list with order

---

## Phase 3: Execute

Create execution plan and get approval.

- [ ] Present task breakdown for user review
- [ ] Allow adjustments based on feedback
- [ ] Create `{plan-name}-execution-plan.md` using template
- [ ] Include reference to original plan
- [ ] Update original plan status to "Tasks Defined"
- [ ] Add link to execution plan file

**Output**: Execution plan created

---

## Phase 4: Verify

Confirm plan is ready for ticket creation.

- [ ] Verify all tasks have clear acceptance criteria
- [ ] Verify task ordering makes sense
- [ ] Save task summary to `.claude/.tmp/evidence/plan-split/`
- [ ] Display the execution plan
- [ ] Suggest: `ah plan <execution-plan-path> tickets`

**Output**: Execution plan confirmation

---

## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| Execution plan | `.claude/plans/{name}-execution-plan.md` | |
| Task summary | `.claude/.tmp/evidence/plan-split/tasks.json` | |
