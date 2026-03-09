---
name: ticket-view
description: View ticket details from the configured project tool
agent: project-agent
---

# Ticket View Workflow

Read-only operation - lightweight R→P→E→V structure.

## Phase 1: Research

Detect tool and validate ticket ID.

- [ ] Read `$PROJECT_TOOL` to determine which tool is configured
- [ ] Extract ticket ID from arguments
- [ ] Validate format for the configured tool

**Output**: Valid ticket ID

---

## Phase 2: Plan

Plan fetch command.

- [ ] Select appropriate command for detected tool

**Output**: Fetch command ready

---

## Phase 3: Execute

Fetch ticket details.

### If Jira
```bash
jira view $PROJECT_KEY-XXXX
```

### If Linear
```bash
linear issue view $PROJECT_KEY-XXX
```

### If ClickUp
```bash
curl "https://api.clickup.com/api/v2/task/TASK_ID" \
  -H "Authorization: $CLICKUP_API_KEY"
```

### If GitHub Issues
```bash
gh issue view <number>
```

**Output**: Ticket data fetched

---

## Phase 4: Verify

Format and display ticket details.

- [ ] Display formatted output:
  - Title and description
  - Status and assignee
  - Parent ticket (if subtask)
  - Linked PRs
  - Comments summary

**Output**: Formatted ticket display
