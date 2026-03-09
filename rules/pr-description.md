# PR Description Rule

## Title Format

```
[$PROJECT_KEY-XXXX] - Short description of changes
```

Always include the ticket number prefix from your project tool.

## Draft Mode

Always create PRs in **draft mode** (`--draft` flag). This allows:
- CI checks to complete
- Self-review before requesting reviewers
- Mark as "Ready for review" when all checks pass

## Required Label

Always add the `TEST` label to trigger CI.

## Template

Use template: `templates/pr-description-template.txt`

## Unit Test Coverage Requirement

**All PRs must include unit tests for new/modified code.**

- New functions and methods require corresponding test cases
- Modified logic requires updated or new tests
- Tests must be included in the same PR, not a follow-up
- PR will not be approved without adequate test coverage

## Required Sections

1. **Changes** - Summary + bullet points of what changed
2. **Testing** - How changes were tested
3. **Functionality Review** - Acceptance criteria checklist (must include test verification)
4. **Linked Issues** - Ticket links
5. **Documentation** - Documentation update checkbox

## Section Guidelines

### Changes
Write a concise summary (1-3 sentences), then bullet points:

```
Add `findXByPosition` helper function to locate blocks at positions.

- Exported function `findBlockByPosition(blocks, position)` returns `IBlock | null`
- Returns `null` with warning log if no root block exists
- 5 unit tests covering all scenarios
```

### Functionality Review
Specific, verifiable acceptance criteria. **Must include test verification:**

```
- [ ] Function returns correct block at position
- [ ] Returns `null` when no block exists
- [ ] Unit tests added for new functionality
- [ ] All existing + new tests pass
```

### Linked Issues
Link to ticket and parent:

```
- [$PROJECT_KEY-XXXX]($PROJECT_BASE_URL/browse/$PROJECT_KEY-XXXX)
- Parent: [$PROJECT_KEY-YYYY]($PROJECT_BASE_URL/browse/$PROJECT_KEY-YYYY)
```

## Post-PR Creation

Transition ticket to "In Review" status:
1. If in `To Do`, first move to `In Progress`
2. Then move to `In Review` (or equivalent status for your tool)

## Sequential PR Workflow

For subtasks with dependencies, use sequential PRs (not stacked):

```
master ──┬──────────────┬──────────────┬──▶
         │              │              │
         └─ PROJ-1 ─PR──┘              │
                        └─ PROJ-2 ─PR──┘
```

Each subtask branches from latest master, PRs into master, wait for merge.
