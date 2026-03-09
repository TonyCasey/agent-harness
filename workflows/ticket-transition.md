---
name: ticket-transition
description: Transition ticket to new status in the configured project tool
agent: project-agent
---

# Ticket Transition Workflow

## Phase 1: Research

Detect tool and get current ticket state.

- [ ] Read `$PROJECT_TOOL` to determine which tool is configured
- [ ] Extract ticket ID from arguments
- [ ] Extract target status from arguments
- [ ] Fetch current ticket status

**Output**: Current status, target status

---

## Phase 2: Plan

Validate transition is allowed.

- [ ] Check if transition is valid (e.g., can't go from Done to To Do)
- [ ] Map generic status names to tool-specific names if needed:
  - "in progress" → Jira: "In Progress", Linear: "In Progress", etc.
- [ ] Plan transition command

**Output**: Transition validated

---

## Phase 3: Execute

Perform the transition.

### If Jira
```bash
jira transition $PROJECT_KEY-XXXX "In Progress"
```

### If Linear
```bash
linear issue update $PROJECT_KEY-XXX --status "In Progress"
```

### If ClickUp
```bash
curl -X PUT "https://api.clickup.com/api/v2/task/TASK_ID" \
  -H "Authorization: $CLICKUP_API_KEY" \
  -d '{"status": "in progress"}'
```

### If GitHub Issues
```bash
gh issue edit <number> --add-label "in-progress" --remove-label "todo"
# Or close if transitioning to Done
gh issue close <number>
```

**Output**: Transition complete

---

## Phase 4: Verify

Confirm new status.

- [ ] Verify ticket is now in target status
- [ ] Display new status
- [ ] Display ticket URL

**Output**: Status confirmation
