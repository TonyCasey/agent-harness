---
name: plan-tickets
description: Create tickets from an execution plan in the configured project tool
agent: planner
---

# Plan Tickets Workflow

## Phase 1: Research

Detect project tool and load execution plan.

- [ ] Load agent memory from `.claude/memory/planner.json`
- [ ] Read `$PROJECT_TOOL` to determine which tool is configured
  - Supported: jira, linear, clickup, github-issues
- [ ] Load execution plan from specified path
- [ ] Verify it's an execution plan (has Tasks section)
- [ ] Parse tasks and their details

**Output**: Project tool, parsed tasks

---

## Phase 2: Plan

Plan ticket structure and confirm with user.

- [ ] Count tasks in the plan
- [ ] Determine structure:
  - **Single task**: ONE parent ticket with task details
  - **Multiple tasks**: Parent ticket + child tickets/subtasks
- [ ] Display tasks that will become tickets
- [ ] Confirm with user before creating

**Output**: Ticket creation plan approved

---

## Phase 3: Execute

Create tickets in the project tool.

### If Jira
```bash
# Create parent Story
jira create -p $PROJECT_KEY -i Story -o summary="Feature: {feature_name}" --noedit
jira edit $PROJECT_KEY-XXXX -o description="{description}" --noedit
jira take $PROJECT_KEY-XXXX

# Create subtasks
jira subtask $PROJECT_KEY-XXXX -o summary="{task_name}" --noedit
```

### If Linear
```bash
linear issue create --title "Feature: {feature_name}" --team $PROJECT_KEY
linear issue create --title "{task_name}" --team $PROJECT_KEY --parent $PROJECT_KEY-XXX
```

### If ClickUp
```bash
curl -X POST "https://api.clickup.com/api/v2/list/$CLICKUP_LIST_ID/task" ...
curl -X POST "https://api.clickup.com/api/v2/task/PARENT_ID/subtask" ...
```

### If GitHub Issues
```bash
gh issue create --title "Feature: {feature_name}" --body "{description}"
gh issue create --title "{task_name}" --body "Parent: #PARENT_NUMBER\n\n{task_description}"
```

- [ ] Update execution plan with ticket links
- [ ] Update each task with its ticket ID
- [ ] Update original plan with parent ticket link

**Output**: Tickets created

---

## Phase 4: Verify

Confirm tickets created and update status.

- [ ] Verify all tickets exist in project tool
- [ ] Update plan status to "In Progress"
- [ ] Save ticket creation log to `.claude/.tmp/evidence/plan-tickets/`
- [ ] Output:
  - List all created tickets with URLs
  - Suggest first task: `ah git checkout $PROJECT_KEY-XXXX`

**Output**: Ticket summary, next steps

---

## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| Ticket log | `.claude/.tmp/evidence/plan-tickets/tickets.json` | |
