# Harness Engineering Improvements

Based on OpenAI's harness engineering principles, this plan improves the agent-harness plugin across four pillars: Structured Execution, Context Architecture, Verification & Evidence, and Agent Memory.

## Summary

| Priority | Improvement | Tasks | Status |
|----------|-------------|-------|--------|
| 1 | Structured Execution Pattern | 4 | Complete |
| 2 | Verification & Evidence | 3 | Complete |
| 3 | Tiered Context Architecture | 4 | Complete |
| 4 | Agent Memory System | 3 | Complete |

---

## Phase 1: Structured Execution Pattern

Standardize all workflows to follow Research → Plan → Execute → Verify.

### Task 1.1: Create workflow template
- [x] Create `templates/workflow-template.md` with R→P→E→V structure
- [x] Add phase markers: `## Phase 1: Research`, `## Phase 2: Plan`, etc.
- [x] Document expected outputs for each phase
- **Output**: `templates/workflow-template.md`

### Task 1.2: Update high-traffic workflows
- [x] Refactor `workflows/pr-create.md` to R→P→E→V
- [x] Refactor `workflows/new-feature.md` to R→P→E→V
- [x] Refactor `workflows/refactor.md` to R→P→E→V
- **Output**: 3 updated workflow files

### Task 1.3: Update remaining workflows
- [x] Audit all 27 workflows for R→P→E→V compliance
- [x] Refactor all workflows to standard structure
- [x] Ensure consistent phase naming
- **Output**: All 27 workflows follow R→P→E→V structure
- **Status**: Complete

### Task 1.4: Add workflow validation rule
- [x] Create `rules/workflow-structure.md` defining R→P→E→V requirements
- [x] Document phase requirements and outputs
- **Output**: `rules/workflow-structure.md`

---

## Phase 2: Verification & Evidence

Add proof artifacts to demonstrate work completion.

### Task 2.1: Create evidence directory structure
- [x] Define `.tmp/evidence/` structure for session artifacts
- [x] Create subdirectories: `tests/`, `diffs/`, `logs/`
- [x] Add to `.gitignore`
- **Output**: Evidence directory structure

### Task 2.2: Add verification steps to workflows
- [x] Update `workflows/refactor.md` to save before/after diffs
- [x] Update `workflows/pr-create.md` to save CI status snapshot
- [x] Update `workflows/new-feature.md` with evidence paths
- **Output**: Workflows produce evidence artifacts

### Task 2.3: Create verification template
- [x] Create `templates/verification-report.txt`
- [x] Include: task summary, evidence paths, pass/fail status
- [x] Agents populate this at Phase 4 (Verify)
- **Output**: `templates/verification-report.txt`

---

## Phase 3: Tiered Context Architecture

Progressive disclosure of context based on task needs.

### Task 3.1: Design tier structure
- [x] Define Tier 1: Always loaded (project identity, commands)
- [x] Define Tier 2: Task-specific (code patterns, conventions)
- [x] Define Tier 3: On-demand (deep implementation details)
- [x] Document in `context/README.md`
- **Output**: `context/README.md` with tier definitions

### Task 3.2: Create context directory
- [x] Create `context/tier-1/` with project identity files
- [x] Create `context/tier-2/` with coding patterns
- [x] Create `context/tier-3/` with implementation details
- **Output**: Tiered context directory structure

### Task 3.3: Update agents with context loading
- [x] Add `context-tiers` frontmatter to agent definitions
- [x] Developer agent: tiers 1, 2
- [x] Planner agent: tier 1 only
- [x] PR-reviewer agent: tiers 1, 2, 3
- [x] All other agents: tier 1
- **Output**: Agents specify which tiers they need

### Task 3.4: Update SKILL.md routing
- [x] Modify routing logic to load context based on agent's `context-tiers`
- [x] Tier 1 always loaded
- [x] Tiers 2-3 loaded only when specified
- **Output**: Progressive context loading in skill router

---

## Phase 4: Agent Memory System

Filesystem-backed memory per agent for decisions and patterns.

### Task 4.1: Design memory schema
- [x] Define JSON schema for agent memory files
- [x] Fields: decisions[], patterns[], notes[], last_updated
- [x] Document in `memory/README.md`
- **Output**: `memory/README.md` with schema

### Task 4.2: Create memory directory
- [x] Create `memory/` directory
- [x] Create initial memory files for each agent (empty structure)
- **Output**: `memory/<agent-name>.json` for 7 agents

### Task 4.3: Add memory operations to workflows
- [x] Add "record decision" step to `workflows/new-feature.md`
- [x] Add "record pattern" step to `workflows/refactor.md`
- [x] Add "consult memory" step to research phases
- **Output**: Workflows read/write agent memory

---

## Execution Order

```
Completed 2026-03-18:
  - Phase 1: Tasks 1.1, 1.2, 1.3, 1.4 ✓
  - Phase 2: Tasks 2.1, 2.2, 2.3 ✓
  - Phase 3: Tasks 3.1, 3.2, 3.3, 3.4 ✓
  - Phase 4: Tasks 4.1, 4.2, 4.3 ✓
  - README updated with step-by-step usage guide ✓
```

## Success Criteria

- [x] High-traffic workflows follow R→P→E→V structure
- [x] Workflows reference evidence paths in `.tmp/evidence/`
- [x] Context loading is tiered (not everything upfront)
- [x] Agents persist decisions to filesystem memory
- [x] New workflows can use `templates/workflow-template.md`
- [x] All 27 workflows follow R→P→E→V

## Files Created/Modified

### New Files
- `templates/workflow-template.md`
- `templates/verification-report.txt`
- `rules/workflow-structure.md`
- `context/README.md`
- `context/tier-1/project-identity.md`
- `context/tier-1/constraints.md`
- `context/tier-2/typescript-patterns.md`
- `context/tier-2/testing-patterns.md`
- `context/tier-3/decisions.md`
- `memory/README.md`
- `memory/*.json` (7 agent memory files)

### Modified Files
- `workflows/pr-create.md` - R→P→E→V structure
- `workflows/new-feature.md` - R→P→E→V + memory
- `workflows/refactor.md` - R→P→E→V + memory
- `agents/*.md` - Added context-tiers frontmatter
- `skills/ah/SKILL.md` - Updated routing logic
- `.gitignore` - Added .tmp/

## References

- [Harness engineering: leveraging Codex in an agent-first world | OpenAI](https://openai.com/index/harness-engineering/)
- [Harness Engineering - Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html)
