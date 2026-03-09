# ClickUp API

ClickUp task management via REST API.

## Authentication

Get API token from: ClickUp Settings > Apps > API Token

```bash
export CLICKUP_API_KEY="pk_xxxxxxxxxx"
```

## API Base URL

```
https://api.clickup.com/api/v2
```

## Common Operations

### Tasks

```bash
# Get task
curl "https://api.clickup.com/api/v2/task/TASK_ID" \
  -H "Authorization: $CLICKUP_API_KEY"

# Create task
curl -X POST "https://api.clickup.com/api/v2/list/LIST_ID/task" \
  -H "Authorization: $CLICKUP_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Task Title",
    "description": "Task description",
    "assignees": [USER_ID],
    "priority": 3
  }'

# Update task
curl -X PUT "https://api.clickup.com/api/v2/task/TASK_ID" \
  -H "Authorization: $CLICKUP_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status": "in progress"}'

# Create subtask
curl -X POST "https://api.clickup.com/api/v2/list/LIST_ID/task" \
  -H "Authorization: $CLICKUP_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Subtask Title",
    "parent": "PARENT_TASK_ID"
  }'
```

### Lists

```bash
# Get lists in folder
curl "https://api.clickup.com/api/v2/folder/FOLDER_ID/list" \
  -H "Authorization: $CLICKUP_API_KEY"

# Get tasks in list
curl "https://api.clickup.com/api/v2/list/LIST_ID/task" \
  -H "Authorization: $CLICKUP_API_KEY"
```

### Spaces

```bash
# Get spaces
curl "https://api.clickup.com/api/v2/team/TEAM_ID/space" \
  -H "Authorization: $CLICKUP_API_KEY"
```

## Task Statuses

ClickUp uses customizable statuses per list. Common statuses:

- to do
- in progress
- review
- complete

## Priority Levels

- 1: Urgent
- 2: High
- 3: Normal
- 4: Low

## Environment Variables

```bash
export CLICKUP_API_KEY="pk_xxxxxxxxxx"
export CLICKUP_TEAM_ID="1234567"
export CLICKUP_SPACE_ID="12345678"
export CLICKUP_LIST_ID="123456789"
export PROJECT_TOOL=clickup
```

## Hierarchy

```
Workspace
└── Space ($CLICKUP_SPACE_ID)
    └── Folder (optional)
        └── List ($CLICKUP_LIST_ID)
            └── Task
                └── Subtask
```
