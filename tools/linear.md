# Linear CLI

Linear's command-line interface for issue management.

## Installation

```bash
npm install -g @linear/cli
```

## Authentication

```bash
linear auth
```

Or set environment variable:
```bash
export LINEAR_API_KEY="lin_api_xxxxxxxxxxxx"
```

## Common Commands

### Issues

```bash
# View issue
linear issue view ENG-123

# List issues
linear issue list
linear issue list --team ENG
linear issue list --assignee @me

# Create issue
linear issue create --title "Title" --team ENG
linear issue create --title "Title" --description "Details" --team ENG --priority 2

# Update issue
linear issue update ENG-123 --status "In Progress"
linear issue update ENG-123 --assignee @me
linear issue update ENG-123 --priority 1

# Create sub-issue
linear issue create --title "Subtask" --team ENG --parent ENG-123
```

### Teams

```bash
# List teams
linear team list

# View team
linear team view ENG
```

## Issue States

Linear uses customizable workflow states per team. Common states:

- Backlog
- Todo
- In Progress
- In Review
- Done
- Canceled

## Priority Levels

- 0: No priority
- 1: Urgent
- 2: High
- 3: Medium
- 4: Low

## API Usage

For operations not supported by CLI:

```bash
# GraphQL API
curl -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "{ viewer { id name } }"}'
```

## Environment Variables

```bash
export LINEAR_API_KEY="lin_api_xxxxxxxxxxxx"
export PROJECT_TOOL=linear
export PROJECT_KEY=ENG  # Team key
```
