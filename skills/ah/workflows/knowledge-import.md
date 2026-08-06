---
name: knowledge-import
description: Import knowledge summary from another repository
agent: knowledge-agent
---

# Knowledge Import Workflow

Import an app summary from another repository into the local knowledge base.

## Arguments

- `<repo-path>` - Path to the repository to import from

## Phase 1: Research

Validate source repository has knowledge.

- [ ] Load agent memory from `.claude/memory/knowledge-agent.json`
- [ ] Check source has summary: `<repo-path>/.claude/knowledge/self.md`
- [ ] If not found, suggest running `ah knowledge scan` in that repo first
- [ ] Read source summary content

**Output**: Source summary validated

---

## Phase 2: Plan

Plan the import operation.

- [ ] Extract app name from:
  1. H1 header (`# app-name`)
  2. Or Overview section
  3. Or derive from repo folder name
- [ ] Normalize to lowercase, hyphenated format
- [ ] Plan target path: `.claude/knowledge/apps/{app-name}.md`
- [ ] Check if entry already exists (update vs create)

**Output**: Import plan, target path

---

## Phase 3: Execute

Copy summary and update index.

- [ ] Ensure target directory exists:
  ```bash
  mkdir -p .claude/knowledge/apps/
  ```
- [ ] Copy summary to target path
- [ ] Load or create `.claude/knowledge/index.json`
- [ ] Add/update entry:
  ```json
  {
    "name": "{app-name}",
    "path": "apps/{app-name}.md",
    "scannedAt": "{timestamp from source}",
    "importedAt": "{current timestamp}",
    "source": "import",
    "sourcePath": "{repo-path}"
  }
  ```
- [ ] Save updated index

**Output**: Summary copied, index updated

---

## Phase 4: Verify

Confirm import and report.

- [ ] Verify file exists at target path
- [ ] Save import log to `.claude/.tmp/evidence/knowledge-import/`
- [ ] Output:
  - App name imported
  - Summary location
  - Key sections found
  - Any warnings (outdated summary, missing sections)

**Output**: Import confirmation

---

## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| Import log | `.claude/.tmp/evidence/knowledge-import/import.log` | |
