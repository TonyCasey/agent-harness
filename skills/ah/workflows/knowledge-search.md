---
name: knowledge-search
description: Search across knowledge base for relevant context
agent: knowledge-agent
---

# Knowledge Search Workflow

Search the organizational knowledge base for apps, APIs, types, or patterns matching a query.

## Arguments

- `<query>` - Search terms (e.g., "authentication", "User type", "POST /api")

## Phase 1: Research

Load knowledge base and prepare for search.

- [ ] Load agent memory from `.claude/memory/knowledge-agent.json`
- [ ] Read `.claude/knowledge/index.json` for list of all known apps
- [ ] Load all summaries:
  - `.claude/knowledge/self.md` (current repo)
  - `.claude/knowledge/apps/*.md` (imported repos)
- [ ] Parse search query

**Output**: Knowledge base loaded, query parsed

---

## Phase 2: Plan

Plan search strategy based on query.

- [ ] Determine search weights:
  - App name: +10 (exact match)
  - Overview section: +5
  - APIs/Models sections: +3 (for API/type queries)
  - Other sections: +1
- [ ] Plan ranking algorithm

**Output**: Search strategy

---

## Phase 3: Execute

Search and rank results.

- [ ] For each summary, search for query terms in all sections
- [ ] Score matches by section weight
- [ ] Accumulate scores for multiple matches
- [ ] Sort by score descending
- [ ] For each match, extract:
  - App name and purpose
  - Specific sections containing matches
  - Relevant excerpts (2-3 lines around match)

**Output**: Ranked search results

---

## Phase 4: Verify

Format and display results.

- [ ] Format structured output:
  ```
  ## Search Results for "{query}"

  ### {app-name} (score: X)
  **Purpose**: {one-line purpose}
  **Matches**:
  - In {section}: "{excerpt with **highlighted** match}"
  ```
- [ ] Suggest related apps (dependencies, integration points)
- [ ] Display "No matches found" if empty
- [ ] Save search results to `.claude/.tmp/evidence/knowledge-search/`

**Output**: Formatted search results

---

## Evidence Checklist

| Artifact | Path | Status |
|----------|------|--------|
| Search results | `.claude/.tmp/evidence/knowledge-search/results.json` | |
