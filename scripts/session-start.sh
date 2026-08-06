#!/bin/bash
# Session start hook - loads knowledge, rules, and memories
# Output is injected into Claude's context at session start

echo "## Agent Harness Session Started"
echo ""

# Check if knowledge base exists
if [ -f ".claude/knowledge/index.json" ]; then
  APP_COUNT=$(grep -c '"name"' .claude/knowledge/index.json 2>/dev/null | head -1 || echo "0")
  APP_COUNT=${APP_COUNT:-0}
  echo "Knowledge base: ${APP_COUNT} app(s) indexed"

  # Show available apps
  if [ "$APP_COUNT" != "0" ]; then
    APPS=$(grep '"name"' .claude/knowledge/index.json 2>/dev/null | sed 's/.*"name": "\([^"]*\)".*/\1/' | tr '\n' ', ' | sed 's/,$//')
    if [ -n "$APPS" ]; then
      echo "Apps: $APPS"
    fi
  fi
else
  echo "Knowledge base: Not initialized (run \`ah knowledge scan\`)"
fi

echo ""

# Count rules (plugin install ships rules with the plugin; legacy install uses .claude/rules)
if [ -n "$CLAUDE_PLUGIN_ROOT" ] && [ -d "$CLAUDE_PLUGIN_ROOT/rules" ]; then
  RULES_DIR="$CLAUDE_PLUGIN_ROOT/rules"
else
  RULES_DIR=".claude/rules"
fi
RULE_COUNT=$(find "$RULES_DIR" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
RULE_COUNT=${RULE_COUNT:-0}
echo "Rules: ${RULE_COUNT} files in ${RULES_DIR}/"

echo ""

# Load memories with decisions/patterns
if [ -d ".claude/memory" ]; then
  HAS_MEMORIES=false

  for memory_file in .claude/memory/*.json; do
    if [ -f "$memory_file" ]; then
      # Check if file has actual decisions or patterns (not empty arrays)
      if command -v jq &> /dev/null; then
        decision_count=$(jq '.decisions | length' "$memory_file" 2>/dev/null || echo "0")
        pattern_count=$(jq '.patterns | length' "$memory_file" 2>/dev/null || echo "0")
      else
        # Fallback: check if arrays are non-empty
        decision_count=$(grep -o '"decision"' "$memory_file" 2>/dev/null | wc -l | tr -d ' ')
        pattern_count=$(grep -o '"patterns":\s*\[\s*{' "$memory_file" 2>/dev/null | wc -l | tr -d ' ')
      fi

      decision_count=${decision_count:-0}
      pattern_count=${pattern_count:-0}

      if [ "$decision_count" != "0" ] || [ "$pattern_count" != "0" ]; then
        if [ "$HAS_MEMORIES" = false ]; then
          echo "## Agent Memories"
          echo ""
          HAS_MEMORIES=true
        fi

        agent_name=$(basename "$memory_file" .json)
        echo "### ${agent_name}"

        # Output recent decisions (last 3)
        if [ "$decision_count" != "0" ]; then
          echo "Decisions:"
          if command -v jq &> /dev/null; then
            jq -r '.decisions[-3:][] | "  - \(.decision) (\(.date // "no date"))"' "$memory_file" 2>/dev/null
          fi
        fi

        # Output patterns
        if [ "$pattern_count" != "0" ]; then
          echo "Patterns:"
          if command -v jq &> /dev/null; then
            jq -r '.patterns[] | "  - \(.name): \(.description // "")"' "$memory_file" 2>/dev/null
          fi
        fi
        echo ""
      fi
    fi
  done

  if [ "$HAS_MEMORIES" = false ]; then
    echo "Memories: No decisions or patterns recorded yet."
    echo ""
  fi
fi

echo "---"
echo "Commands: \`/ah\` | Knowledge: \`ah knowledge search <query>\`"
echo ""
