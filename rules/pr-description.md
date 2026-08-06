# PR Description Rule

Generic PR standards. For project-specific requirements, create `.claude/rules/pr-description.local.md`.

## Title Format

```
[TICKET-ID] - Short description of changes
```

Include the ticket/issue ID from your project tool if available.

## Draft Mode

Always create PRs in **draft mode** (`--draft` flag). This allows:
- CI checks to complete
- Self-review before requesting reviewers
- Mark as "Ready for review" when all checks pass

## Template

Use template: `.claude/templates/pr-description-template.local.txt` if exists, otherwise `${CLAUDE_PLUGIN_ROOT}/templates/pr-description-template.txt` (legacy `ah init` install: `.claude/templates/pr-description-template.txt`)

## Unit Test Coverage Requirement

**All PRs must include unit tests for new/modified code.**

- New functions and methods require corresponding test cases
- Modified logic requires updated or new tests
- Tests must be included in the same PR, not a follow-up
- PR will not be approved without adequate test coverage

## Required Sections

1. **Summary** - What changed and why
2. **Changes** - Bullet points of specific changes
3. **Testing** - How changes were tested
4. **Checklist** - Verification items

## Section Guidelines

### Summary
One paragraph explaining the purpose of the PR:

```markdown
## Summary
Add helper function to locate blocks by position, enabling more efficient 
block lookups in the editor.
```

### Changes
Bullet points of what changed:

```markdown
## Changes
- Add `findBlockByPosition(blocks, position)` function
- Returns `Block | null` based on position match
- Add 5 unit tests covering edge cases
```

### Testing
How the changes were verified:

```markdown
## Test Plan
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] No regressions in existing functionality
```

### Linked Issues
Link to related tickets:

```markdown
## Linked Issues
- Fixes #123
- Related to #456
```

## Post-PR Creation

Transition ticket to "In Review" status if using a project tool.

## Sequential PR Workflow

For subtasks with dependencies, use sequential PRs (not stacked):

```
base ─────┬──────────────┬──────────────┬──▶
          │              │              │
          └─ TASK-1 ─PR──┘              │
                         └─ TASK-2 ─PR──┘
```

Each subtask branches from the latest base branch, PRs into it, wait for merge.

---

## Local Overrides

To customize for your project, create `.claude/rules/pr-description.local.md` with:
- Company-specific sections
- Required labels
- Repository-specific testing instructions
- Custom checklists

The workflow will use the local file if it exists.
