# Workflow Structure Rule

All workflows MUST follow the Research → Plan → Execute → Verify (R→P→E→V) structure.

## Required Phases

### Phase 1: Research
- MUST gather context before taking action
- MUST identify risks or blockers
- MUST document output: what was learned

### Phase 2: Plan
- MUST outline approach before executing
- MUST confirm with user if requirements are ambiguous
- MUST document output: the action plan

### Phase 3: Execute
- MUST follow the plan from Phase 2
- MUST make incremental progress with checkpoints
- MUST document output: work artifacts produced

### Phase 4: Verify
- MUST validate the result meets requirements
- MUST run tests or validation checks
- MUST save evidence to `.tmp/evidence/<workflow-name>/`
- MUST document output: verification status with evidence paths

## Evidence Requirements

Every workflow MUST include an Evidence Checklist table:

```markdown
## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| <artifact_name> | `.tmp/evidence/<workflow>/...` | |
```

## Phase Markers

Use consistent markdown headers:

```markdown
## Phase 1: Research
...
## Phase 2: Plan
...
## Phase 3: Execute
...
## Phase 4: Verify
...
```

## Output Documentation

Each phase MUST end with an **Output** line describing what the phase produces:

```markdown
**Output**: <description of phase output>
```

## Exceptions

Simple utility workflows (e.g., `git-status`) may omit phases if the operation is:
- Read-only
- Atomic (single step)
- No risk of side effects

Even then, prefer including at least Research and Verify phases.
