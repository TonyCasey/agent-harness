# Agent Memory System

Filesystem-backed persistent memory for each agent. Unlike conversation history, this memory persists across sessions.

## Why Agent Memory?

- **Decisions**: Remember architectural choices and their rationale
- **Patterns**: Learn common patterns from repeated tasks
- **Context**: Build understanding of project over time

## Schema

Each agent has a JSON memory file:

```json
{
  "agent": "developer",
  "last_updated": "2026-03-18T10:00:00Z",
  "decisions": [
    {
      "date": "2026-03-15",
      "context": "Choosing auth strategy",
      "decision": "Use JWT with refresh tokens",
      "rationale": "Stateless, works with microservices"
    }
  ],
  "patterns": [
    {
      "name": "API error handling",
      "description": "All API routes wrap handlers in try-catch with standard error response",
      "seen_in": ["routes/users.ts", "routes/auth.ts"]
    }
  ],
  "notes": [
    {
      "date": "2026-03-18",
      "note": "User prefers explicit type annotations"
    }
  ]
}
```

## Fields

| Field | Type | Purpose |
|-------|------|---------|
| `agent` | string | Agent name (must match filename) |
| `last_updated` | ISO date | Last modification timestamp |
| `decisions` | array | Architectural/design decisions with rationale |
| `patterns` | array | Recurring patterns observed in codebase |
| `notes` | array | Miscellaneous learnings |

## Usage

### Reading Memory (Research Phase)
```markdown
## Phase 1: Research
- [ ] Load agent memory from `memory/<agent>.json`
- [ ] Check for relevant past decisions
- [ ] Review known patterns that might apply
```

### Writing Memory (Verify Phase)
```markdown
## Phase 4: Verify
- [ ] Record any significant decisions made
- [ ] Note new patterns discovered
- [ ] Update `memory/<agent>.json`
```

## Memory Files

| Agent | File | Purpose |
|-------|------|---------|
| developer | `developer.json` | Code patterns, testing strategies |
| planner | `planner.json` | Planning approaches, estimation learnings |
| pr-creator | `pr-creator.json` | PR patterns, common issues |
| pr-reviewer | `pr-reviewer.json` | Review findings, code smells |
| pr-watcher | `pr-watcher.json` | Comment resolution patterns |
| knowledge-agent | `knowledge-agent.json` | Scanning heuristics |
| task-automator | `task-automator.json` | Automation opportunities |

## Best Practices

1. **Be selective** - Only record genuinely useful insights
2. **Include rationale** - Future you needs to know WHY
3. **Update, don't duplicate** - Modify existing entries when context changes
4. **Prune periodically** - Remove outdated or incorrect entries
