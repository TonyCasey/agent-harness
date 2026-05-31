#!/bin/bash
# Copies all gitignored .env files (and .claude/.agent-harness) from the main
# repo into a target worktree directory.
#
# Usage: worktree-sync-env.sh [target-dir]
#   target-dir: defaults to $PWD

set -euo pipefail

TARGET="${1:-$PWD}"
TARGET=$(cd "$TARGET" && pwd)

MAIN_REPO=$(git worktree list --porcelain | awk '/^worktree / {print $2; exit}')
if [ -z "${MAIN_REPO:-}" ]; then
  echo "Error: not inside a git repository" >&2
  exit 1
fi

if [ "$MAIN_REPO" = "$TARGET" ]; then
  echo "Target is the main repo — nothing to sync."
  exit 0
fi

echo "Main repo: $MAIN_REPO"
echo "Target:    $TARGET"
echo ""

COUNT=0

while IFS= read -r src; do
  [ -f "$src" ] || continue
  rel="${src#$MAIN_REPO/}"
  dst="$TARGET/$rel"
  mkdir -p "$(dirname "$dst")"
  cp "$src" "$dst"
  echo "  copied  $rel"
  COUNT=$((COUNT + 1))
done < <(find "$MAIN_REPO" \
  \( -path '*/node_modules' -o -path '*/.next' -o -path '*/dist' \
     -o -path '*/.turbo' -o -path '*/coverage' -o -path '*/build' \
     -o -path '*/.claude/worktrees' -o -path '*/assets/theme' \) -prune -o \
  \( -name '.env' -o -name '.env.local' -o -name '.env.*.local' \) -type f -print 2>/dev/null)

if [ -f "$MAIN_REPO/.claude/.agent-harness" ]; then
  mkdir -p "$TARGET/.claude"
  cp "$MAIN_REPO/.claude/.agent-harness" "$TARGET/.claude/.agent-harness"
  echo "  copied  .claude/.agent-harness"
  COUNT=$((COUNT + 1))
fi

echo ""
echo "Synced $COUNT file(s) into $TARGET"
