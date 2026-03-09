# Code Review Rule

When reviewing code, check for:

## Correctness
- Does the code do what it claims?
- Are edge cases handled?
- Is error handling appropriate?
- Are there potential null/undefined issues?

## Clarity
- Is the code easy to understand?
- Are names descriptive and consistent?
- Is complex logic commented?
- Could it be simplified?

## Performance
- Any obvious O(n²) or worse algorithms?
- Unnecessary iterations or allocations?
- Database N+1 queries?
- Missing indexes?

## Maintainability
- Is it DRY (Don't Repeat Yourself)?
- Is it modular and testable?
- Does it follow existing patterns?
- Will it be easy to modify later?

## Feedback Format
```
**[File:Line]** [severity: blocking|suggestion|nitpick]
[Description of issue]
[Suggested fix or question]
```

## Severity Levels
- **Blocking**: Must fix before merge (bugs, security, broken functionality)
- **Suggestion**: Should consider (better approaches, minor issues)
- **Nitpick**: Optional (style, preferences)
