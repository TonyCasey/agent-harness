---
name: ticket-create
description: Create a new ticket in the configured project tool
agent: project-agent
---

# Ticket Create Workflow

## Phase 1: Research

Detect project tool and gather input.

- [ ] Read `$PROJECT_TOOL` to determine which tool is configured
  - Supported: jira, linear, clickup, github-issues
- [ ] Extract title from arguments
- [ ] Determine ticket type (story/task, bug, subtask)
- [ ] Identify project: `$PROJECT_KEY`

**Output**: Project tool, ticket details

---

## Phase 2: Plan

Gather remaining details.

- [ ] Ask for description if not provided
- [ ] Ask for parent ticket if subtask
- [ ] Plan creation command for detected tool

**Output**: Complete ticket details

---

## Phase 3: Execute

Create the ticket.

### If Jira
```bash
jira create -p $PROJECT_KEY -i <type> -o summary="<title>" --noedit
jira edit $PROJECT_KEY-XXXX -o description="<description>" --noedit
jira take $PROJECT_KEY-XXXX
```

### If Linear
```bash
linear issue create --title "<title>" --description "<description>" --team $PROJECT_KEY
linear issue update $PROJECT_KEY-XXX --assignee @me
```

### If ClickUp
```bash
curl -X POST "https://api.clickup.com/api/v2/list/$CLICKUP_LIST_ID/task" \
  -H "Authorization: $CLICKUP_API_KEY" \
  -d '{"name": "<title>", "description": "<description>"}'
```

### If GitHub Issues
```bash
gh issue create --title "<title>" --body "<description>"
gh issue edit <number> --add-assignee @me
```

**Output**: Ticket created

---

## Phase 4: Verify

Confirm ticket creation.

- [ ] Verify ticket exists with correct details
- [ ] Display ticket URL
- [ ] Suggest: `ah git checkout $PROJECT_KEY-XXXX`

**Output**: Ticket confirmation, next steps
