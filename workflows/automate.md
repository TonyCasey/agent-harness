---
name: automate
description: Create shell scripts to automate repetitive tasks
agent: task-automator
---

# Automate Workflow

## Phase 1: Research

Understand the automation need.

- [ ] Load agent memory from `.claude/memory/task-automator.json`
- [ ] Analyze what repetitive task user wants to automate
- [ ] Identify inputs, outputs, and frequency
- [ ] Look for existing scripts in `scripts/` or project root
- [ ] Check for similar automation already in place
- [ ] Identify patterns to follow

**Output**: Task analysis, existing scripts review

---

## Phase 2: Plan

Design the automation solution.

- [ ] Determine script type (bash, node, etc.)
- [ ] Design script interface (arguments, options)
- [ ] Plan error handling approach
- [ ] Choose location for script
- [ ] Prepare usage documentation

**Output**: Script design, location plan

---

## Phase 3: Execute

Implement and get approval.

- [ ] Propose solution to user with:
  - What it will do
  - Example usage
  - Where it will be saved
- [ ] Wait for user approval
- [ ] Create shell script in appropriate location
- [ ] Make executable: `chmod +x`
- [ ] Add usage comments at top of script

**Output**: Script created

---

## Phase 4: Verify

Test and confirm automation works.

- [ ] Run script to verify it works
- [ ] Save test output to `.claude/.tmp/evidence/automate/`
- [ ] Record automation pattern to `.claude/memory/task-automator.json`
- [ ] Report result to user
- [ ] Suggest how to run the script

**Output**: Working automation, usage instructions

---

## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| Script | `scripts/{name}.sh` | |
| Test output | `.claude/.tmp/evidence/automate/test-output.txt` | |
