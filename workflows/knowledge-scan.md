---
name: knowledge-scan
description: Scan repository to generate knowledge summary for cross-repo sharing
agent: knowledge-agent
---

# Knowledge Scan Workflow

Generate structured knowledge for cross-repo sharing.

## What Gets Generated

| Output | Purpose |
|--------|---------|
| `.claude/knowledge/self.md` | Cross-repo knowledge sharing |
| `.claude/memory/knowledge-agent.json` | Scanning heuristics learned |

---

## Phase 1: Research

Gather information about the repository.

- [ ] Load agent memory from `.claude/memory/knowledge-agent.json`
- [ ] Read core configuration files:
  - `package.json` - name, description, dependencies, scripts
  - `tsconfig.json` - TypeScript configuration
  - `README.md` - project documentation
  - `CLAUDE.md` - existing project instructions
- [ ] Extract: project name, purpose, tech stack, repository URL
- [ ] List top-level directories and identify their purpose
- [ ] Check scanning heuristics from memory for this project type

**Output**: Project metadata, directory structure

---

## Phase 2: Plan

Plan analysis based on project type.

- [ ] Detect architectural patterns:
  - Clean Architecture: `domain/`, `application/`, `infrastructure/`
  - MVC: `controllers/`, `models/`, `views/`
  - Feature-based: `features/`, `modules/`
  - Layer-based: `api/`, `services/`, `repositories/`
- [ ] Identify API style (REST, GraphQL, events)
- [ ] Identify coding patterns to extract

**Output**: Analysis plan

---

## Phase 3: Execute

Analyze codebase and generate all outputs.

### 3.1: Deep Analysis
- [ ] Find public APIs:
  - Express routes: `router.get`, `router.post`, `app.use`
  - API handlers in `routes/`, `api/`, `handlers/`
  - GraphQL resolvers, event handlers
- [ ] Extract data models from `types/`, `models/`, `entities/`
- [ ] Map dependencies (internal packages, external SDKs)
- [ ] Identify integration points (API calls, shared events, data stores)
- [ ] Detect coding patterns:
  - Error handling approach
  - Logging conventions
  - Test organization
  - Import/export patterns

### 3.2: Generate Knowledge Summary
- [ ] Create `.claude/knowledge/self.md` using template
- [ ] Fill all sections with gathered information
- [ ] Add generation timestamp

**Output**: Knowledge summary generated

---

## Phase 4: Verify

Confirm all outputs and update index.

- [ ] Verify `.claude/knowledge/self.md` has all sections
- [ ] Create/update `.claude/knowledge/index.json`:
  - Add entry for this app
  - Set source to "scan"
  - Set scannedAt to current timestamp
- [ ] Save scan evidence to `.claude/.tmp/evidence/knowledge-scan/`
- [ ] Record new scanning heuristics to `.claude/memory/knowledge-agent.json`
- [ ] Output summary:
  - Files generated/updated
  - Patterns detected

**Output**: Knowledge summary confirmed, index updated

---

## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| Knowledge summary | `.claude/knowledge/self.md` | |
| Index update | `.claude/knowledge/index.json` | |
| Scan log | `.claude/.tmp/evidence/knowledge-scan/scan.log` | |

---

## Notes

- **Re-running is safe** - summary is regenerated each scan
- **Review recommended** - after scan, review summary for accuracy
