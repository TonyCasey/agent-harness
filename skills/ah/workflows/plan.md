---
name: plan
description: Document a feature and save to .claude/plans/
agent: planner
---

# Plan Workflow

## Phase 1: Research

Gather context about the feature and related systems.

- [ ] Load agent memory from `.claude/memory/planner.json`
- [ ] Ask user to describe the feature
- [ ] Clarify scope, requirements, constraints
- [ ] Read `.claude/knowledge/index.json` for available app summaries
- [ ] Load relevant summaries from `.claude/knowledge/apps/`
- [ ] Search knowledge base for terms related to the feature
- [ ] Identify:
  - Related systems that may be affected
  - Existing APIs or types that can be reused
  - Integration points to consider
  - Potential dependencies

**Output**: Feature requirements, related systems list

---

## Phase 2: Plan

Structure the feature documentation.

- [ ] Determine technical approach options
- [ ] Identify affected areas of the codebase
- [ ] Define acceptance criteria
- [ ] Consider integration points from knowledge base

**Output**: Documentation structure plan

---

## Phase 3: Execute

Create the feature plan document.

- [ ] Generate structured document using `${CLAUDE_PLUGIN_ROOT}/templates/feature-plan-template.txt`
- [ ] Include sections:
  - **Overview**: What and why
  - **Requirements**: What it needs to do
  - **Related Systems**: Apps/APIs/types from knowledge base
  - **Technical Approach**: How it will be implemented
  - **Integration Considerations**: Based on knowledge context
  - **Acceptance Criteria**: How to verify it works
- [ ] Save to `.claude/plans/{feature-name}.md`

**Output**: Feature plan document created

---

## Phase 4: Verify

Confirm plan is complete and suggest next steps.

- [ ] Verify all required sections are filled
- [ ] Save plan summary to `.claude/.tmp/evidence/plan/`
- [ ] Record planning patterns to `.claude/memory/planner.json`
- [ ] Display the plan to user
- [ ] Highlight related systems found in knowledge base
- [ ] Suggest: `ah plan .claude/plans/{feature-name}.md split`

**Output**: Plan confirmation, next steps

---

## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| Feature plan | `.claude/plans/{feature-name}.md` | |
| Related systems | `.claude/.tmp/evidence/plan/related-systems.txt` | |
