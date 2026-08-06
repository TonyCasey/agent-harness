# Harness Reflection Rule

This rule enables the harness to self-improve by reflecting on artifacts created during workflow execution.

## Trigger Events

Reflect after ANY of these actions:

1. **Creating a file in `.tmp/`** - temporary scripts, outputs, workarounds
2. **Writing a shell script** (any `*.sh` file)
3. **Running a complex bash command** - pipelines (`|`), chains (`&&`), or commands >50 characters
4. **Creating a workaround** for missing harness functionality

## Reflection Checklist

When triggered, ask yourself:

1. **Is this reusable?** Will this be needed again in this or other projects?
2. **Is this general or specific?** Does it solve a general problem or just this instance?
3. **Does it already exist?** Is there something in the harness that does this?
4. **What type is it?** Script, rule, template, or workflow?

## Confidence Assessment

### High Confidence (auto-promote)

Promote automatically WITHOUT asking if:
- Pattern seen before (exists in `candidates` with `reuse_count > 0`)
- Clear category (obviously a script, rule, template, or workflow)
- General purpose (not project-specific, would work anywhere)
- Matches existing harness patterns

### Low Confidence (ask user)

Ask the user before promoting if:
- First time seeing this pattern
- Unclear categorization (could be multiple types)
- Might be project-specific
- Unusual or edge case

## Recording Procedure

**Always** record artifacts in the project's `.claude/memory/harness.json`:

```json
{
  "date": "YYYY-MM-DD",
  "type": "script|rule|template|workflow",
  "original_path": ".tmp/example.sh",
  "purpose": "Brief description of what it does",
  "context": "Which workflow/task created this",
  "reuse_count": 0
}
```

Add to the `candidates` array. If the artifact already exists in candidates, increment `reuse_count`.

## Promotion Procedure

### When Promoting

1. **Determine target location.** Promotion targets the project's `.claude/`
   directory — the installed plugin is read-only. If an artifact is general
   purpose enough to benefit every project, also suggest upstreaming it to the
   agent-harness plugin repository.

   | Type | Target | Example |
   |------|--------|---------|
   | script | `.claude/scripts/<name>.sh` | `.claude/scripts/check-coverage.sh` |
   | rule | `.claude/rules/<name>.md` | `.claude/rules/test-before-commit.md` |
   | template | `.claude/templates/<name>.txt` | `.claude/templates/bug-triage.txt` |
   | workflow | `.claude/workflows/<name>.md` | `.claude/workflows/dependency-check.md` |

2. **Create the file** in the target location with proper formatting:
   - Scripts: Add shebang, comments, make executable
   - Rules: Follow rule markdown format (see existing rules)
   - Templates: Use placeholder syntax `{{variable}}`
   - Workflows: Include frontmatter with agent assignment

3. **Update `.claude/memory/harness.json`:**
   - Remove from `candidates` array
   - Add to `promotions` array with `promoted_to` field

4. **Update references** if needed:
   - If it's a rule, agents pick it up as a project-local rule
   - If it's a workflow, it is runnable via `ah workflow <name>` (project
     `.claude/workflows/` overrides the plugin's copy)

5. **Log the promotion:**
   ```
   Promoted: .tmp/check-coverage.sh → .claude/scripts/check-coverage.sh
   ```

### High Confidence Flow

```
[Artifact created]
      ↓
[Reflect: high confidence]
      ↓
[Record in candidates OR increment reuse_count]
      ↓
[Auto-promote silently]
      ↓
[Move to promotions, create file]
      ↓
[Log: "Promoted X to Y"]
```

### Low Confidence Flow

```
[Artifact created]
      ↓
[Reflect: low confidence]
      ↓
[Record in candidates]
      ↓
[Ask user: "I created X for Y purpose. Should I promote this to Z?"]
      ↓
[If yes: promote]
[If no: keep as candidate, may promote later if reuse_count increases]
```

## Examples

### Example 1: Auto-Promotion (High Confidence)

```
Created: .tmp/run-tests-watch.sh
Content: npm test -- --watch

Reflection:
- Reusable? Yes, common development pattern
- General? Yes, works in any npm project
- Exists? No script for this in harness
- Type? Clearly a script

→ High confidence. Auto-promoting to .claude/scripts/run-tests-watch.sh
```

### Example 2: Ask User (Low Confidence)

```
Created: .tmp/parse-jira-response.sh
Content: Complex jq pipeline for Jira API

Reflection:
- Reusable? Maybe, depends on Jira usage
- General? Unclear, might be project-specific
- Type? Script, but very specialized

→ Low confidence. Asking user:
"I created a Jira response parser. This could be promoted to 
.claude/scripts/parse-jira-response.sh. Should I promote it?"
```

### Example 3: Pattern Becomes Rule

```
Observed: Always running `npm test` before `git commit` in multiple sessions

Reflection:
- This is a behavioral pattern, not a script
- Should be a rule that agents follow

→ Promote to .claude/rules/test-before-commit.md
```

## Memory Schema Reference

```json
// .claude/memory/harness.json
{
  "name": "harness",
  "last_updated": "ISO-8601 timestamp",
  "candidates": [
    {
      "date": "YYYY-MM-DD",
      "type": "script|rule|template|workflow",
      "original_path": "path/to/artifact",
      "purpose": "what it does",
      "context": "when/why created",
      "reuse_count": 0
    }
  ],
  "promotions": [
    {
      "date": "YYYY-MM-DD",
      "type": "script|rule|template|workflow", 
      "original_path": "original/path",
      "promoted_to": "final/path",
      "purpose": "what it does",
      "context": "why promoted"
    }
  ]
}
```

## Goal

The harness grows organically from actual usage. Over time:
- Fewer ad-hoc `.tmp/` files
- More reusable components in the harness
- Patterns discovered through work become permanent improvements
