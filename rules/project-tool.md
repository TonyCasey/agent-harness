# Project Tool Rule

Generic project tool conventions. For project-specific configuration, create `rules/project-tool.local.md`.

This rule defines conventions for project management tools. Agent Harness supports multiple tools - detect which one is configured and adapt accordingly.

## Configuration

Environment variables (generic):
- `$PROJECT_TOOL` - Which tool: jira, linear, clickup, github-issues
- `$PROJECT_BASE_URL` - Instance URL
- `$PROJECT_KEY` - Project/Team identifier
- `$PROJECT_USER_EMAIL` - User email for assignment

## Ticket Terminology

| Generic Term | Jira | Linear | ClickUp | GitHub |
|--------------|------|--------|---------|--------|
| Ticket | Issue/Story | Issue | Task | Issue |
| Parent | Story/Epic | Project | List | Milestone |
| Subtask | Subtask | Sub-issue | Subtask | Checklist |
| Project | Project | Team | Space | Repository |

## Tool-Specific Details

### Jira
- **Ticket format**: `$PROJECT_KEY-XXXX`
- **URL**: `$PROJECT_BASE_URL/browse/$PROJECT_KEY-XXXX`
- **CLI**: `jira`
- **Statuses**: To Do → In Progress → Code Review → Done

### Linear
- **Ticket format**: `$PROJECT_KEY-123`
- **URL**: `$PROJECT_BASE_URL/issue/$PROJECT_KEY-123`
- **CLI**: `linear` or API
- **Statuses**: Backlog → In Progress → In Review → Done

### ClickUp
- **Ticket format**: Task ID (numeric)
- **URL**: `$PROJECT_BASE_URL/t/TASK_ID`
- **CLI**: `clickup` or API
- **Statuses**: To Do → In Progress → Review → Complete

### GitHub Issues
- **Ticket format**: `#123`
- **URL**: Repository issues page
- **CLI**: `gh issue`
- **Statuses**: Open → Closed (with labels for workflow)

## Common Rules (All Tools)

### Branch Naming
Use ticket ID as branch name:
```
$PROJECT_KEY-1234
```

### PR Linking
Always include in PR:
- Title: `[$PROJECT_KEY-XXXX] - Description`
- Body: Link to ticket

```markdown
### Linked Issues
- [$PROJECT_KEY-1234]($PROJECT_BASE_URL/browse/$PROJECT_KEY-1234)
```

### Status Workflow
```
To Do → In Progress → In Review → Done
```

### Transition Rules
- Start work → move to `In Progress`
- PR created → move to `In Review`
- PR merged → move to `Done`

### Assignment
- Tickets MUST be assigned to the current user after creation

## CLI Commands by Tool

### Jira
```bash
jira view $PROJECT_KEY-1234
jira create -p $PROJECT_KEY -i Task -o summary="Title" --noedit
jira edit $PROJECT_KEY-1234 -o description="Description" --noedit
jira take $PROJECT_KEY-1234
jira subtask $PROJECT_KEY-1234 -o summary="Subtask" --noedit
jira transition $PROJECT_KEY-1234 "In Progress"
jira browse $PROJECT_KEY-1234
```

### Linear
```bash
linear issue view $PROJECT_KEY-123
linear issue create --title "Title" --team $PROJECT_KEY
linear issue update $PROJECT_KEY-123 --status "In Progress"
```

### ClickUp
```bash
# ClickUp typically uses API calls
curl -X POST "https://api.clickup.com/api/v2/list/LIST_ID/task" \
  -H "Authorization: $CLICKUP_API_KEY" \
  -d '{"name": "Title"}'
```

### GitHub Issues
```bash
gh issue view 123
gh issue create --title "Title" --body "Description"
gh issue edit 123 --add-assignee @me
gh issue close 123
```

---

## Local Overrides

To customize for your project, create `rules/project-tool.local.md` with:
- Specific project keys and URLs
- Custom status workflows
- Required fields for ticket creation
- Team-specific assignment rules

The workflow will use the local file if it exists.
