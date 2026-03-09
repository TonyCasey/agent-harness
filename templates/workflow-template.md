---
name: {{workflow_name}}
description: {{workflow_description}}
agent: {{agent_name}}
---

# {{Workflow Title}}

## Phase 1: Research

Gather context and understand the scope before taking action.

- [ ] {{research_step_1}}
- [ ] {{research_step_2}}
- [ ] Identify risks or blockers

**Output**: Understanding of current state and requirements

---

## Phase 2: Plan

Outline the approach before executing.

- [ ] {{plan_step_1}}
- [ ] {{plan_step_2}}
- [ ] Confirm approach with user if ambiguous

**Output**: Clear action plan

---

## Phase 3: Execute

Perform the work following the plan.

- [ ] {{execute_step_1}}
- [ ] {{execute_step_2}}
- [ ] {{execute_step_3}}

**Output**: Completed work artifacts

---

## Phase 4: Verify

Validate the result and record evidence.

- [ ] Run tests / validation checks
- [ ] Save evidence to `.tmp/evidence/{{workflow_name}}/`
- [ ] Confirm success criteria met

**Output**: Verification report with evidence paths

---

## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| {{artifact_1}} | `.tmp/evidence/{{workflow_name}}/{{file_1}}` | |
| {{artifact_2}} | `.tmp/evidence/{{workflow_name}}/{{file_2}}` | |
