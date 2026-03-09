# Jira

Issue tracking and project management.

## Jira Instance

```
$JIRA_BASE_URL
```

## Ticket Format

```
$JIRA_PROJECT_KEY-XXXX
```

Example: `$JIRA_PROJECT_KEY-9694`

## Ticket URL Pattern

```
$JIRA_BASE_URL/browse/$JIRA_PROJECT_KEY-XXXX
```

## CLI Installation (Optional)

```bash
# Install Jira CLI
brew install ankitpokhrel/jira-cli/jira-cli

# Configure
jira init

# Enter:
# - Server: $JIRA_BASE_URL
# - Login: $JIRA_USER_EMAIL
# - API Token: (generate from Atlassian account settings)
```

### Generate API Token

1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Name it (e.g., "Jira CLI")
4. Copy token and use during `jira init`

## Common CLI Commands

### View Issues

```bash
# View ticket
jira view $JIRA_PROJECT_KEY-9694

# View my assigned issues
jira list -a "$JIRA_USER_EMAIL"

# View sprint issues
jira sprint list --current
```

### Create Issues

```bash
# Create ticket (description must be set via edit - Jira template overrides on create)
jira create -p $JIRA_PROJECT_KEY -i Task -o summary="Title" --noedit
jira edit $JIRA_PROJECT_KEY-XXXX -o description="Description here" --noedit
jira take $JIRA_PROJECT_KEY-XXXX  # Assign to self

# Create subtask under parent story
jira subtask $JIRA_PROJECT_KEY-9694 -o summary="Subtask title" --noedit
jira edit $JIRA_PROJECT_KEY-YYYY -o description="Details" --noedit
jira take $JIRA_PROJECT_KEY-YYYY
```

### Transitions

```bash
# List available transitions
jira transitions $JIRA_PROJECT_KEY-9694

# Move to In Progress
jira transition $JIRA_PROJECT_KEY-9694 "In Progress"

# Move to Code Review
jira transition $JIRA_PROJECT_KEY-9694 "Code Review"

# Move to Done
jira transition $JIRA_PROJECT_KEY-9694 "Done"
```

### Comments

```bash
# Add comment
jira comment $JIRA_PROJECT_KEY-9694 "PR created: https://github.com/..."
```

## Workflow States

```
To Do → In Progress → Code Review → Done
```

### Transition Rules

1. **Starting work**: Move to `In Progress`
2. **PR created**: Move to `Code Review`
3. **PR merged**: Move to `Done`

## PR Integration

### Title Format

Always include Jira ticket in PR title:

```
[$JIRA_PROJECT_KEY-XXXX] - Description of changes
```

### PR Body Links

```markdown
### Linked Issues
- [$JIRA_PROJECT_KEY-9694]($JIRA_BASE_URL/browse/$JIRA_PROJECT_KEY-9694)
- Parent: [$JIRA_PROJECT_KEY-9687]($JIRA_BASE_URL/browse/$JIRA_PROJECT_KEY-9687)
```

### Reference Format (Bottom of PR)

```markdown
[$JIRA_PROJECT_KEY-9694]: $JIRA_BASE_URL/browse/$JIRA_PROJECT_KEY-9694
```

## Branch Naming

Use Jira ticket as branch name:

```bash
git checkout -b $JIRA_PROJECT_KEY-9694
```

## Story → Subtask Workflow

For stories with multiple subtasks:

1. Story: `$JIRA_PROJECT_KEY-9687` (parent)
2. Subtasks: `$JIRA_PROJECT_KEY-9694`, `$JIRA_PROJECT_KEY-9695`, `$JIRA_PROJECT_KEY-9696`

Link subtasks to parent in PR:

```markdown
- [$JIRA_PROJECT_KEY-9694]($JIRA_BASE_URL/browse/$JIRA_PROJECT_KEY-9694)
- Parent: [$JIRA_PROJECT_KEY-9687]($JIRA_BASE_URL/browse/$JIRA_PROJECT_KEY-9687)
```

## Useful Links

| Resource | URL |
|----------|-----|
| Board | `$JIRA_BASE_URL/jira/software/projects/$JIRA_PROJECT_KEY/boards/...` |
| Backlog | `$JIRA_BASE_URL/jira/software/projects/$JIRA_PROJECT_KEY/backlog` |

## Environment Variable (Optional)

```bash
# Add to ~/.zshrc for CLI
export JIRA_API_TOKEN="your_token_here"
export JIRA_BASE_URL="https://your-org.atlassian.net"
export JIRA_USER_EMAIL="your-email@example.com"
export JIRA_PROJECT_KEY="PROJ"
```

## Quick Reference

```bash
# View ticket in browser
open "$JIRA_BASE_URL/browse/$JIRA_PROJECT_KEY-9694"

# Or with CLI
jira browse $JIRA_PROJECT_KEY-9694
```
