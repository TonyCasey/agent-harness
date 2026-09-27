#!/bin/bash
# Reinstall agent-harness globally from local build
# Usage: ./scripts/reinstall-local.sh [--skip-init]
#
# This script:
# 1. Creates a .tgz package (npm pack)
# 2. Uninstalls existing global agent-harness
# 3. Installs the new package globally
# 4. Runs agent-harness init in test directory (unless --skip-init)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
RELEASES_DIR="$PROJECT_ROOT/releases"

# Load .env if present
if [ -f "$PROJECT_ROOT/.env" ]; then
  export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)
fi

# Default to tonycasey if not set
GITHUB_ORG="${GITHUB_ORG:-tonycasey}"

# Parse arguments
SKIP_INIT=false
for arg in "$@"; do
  case $arg in
    --skip-init)
      SKIP_INIT=true
      shift
      ;;
  esac
done

echo "=== Agent Harness Local Reinstall ==="
echo ""

# Step 1: Create releases directory
mkdir -p "$RELEASES_DIR"

# Step 2: Package
echo "1. Creating package..."
cd "$PROJECT_ROOT"
npm pack --pack-destination "$RELEASES_DIR"

# Find the latest .tgz file
PACKAGE_FILE=$(ls -t "$RELEASES_DIR"/*.tgz 2>/dev/null | head -1)
if [ -z "$PACKAGE_FILE" ]; then
  echo "Error: No .tgz file found in $RELEASES_DIR"
  exit 1
fi
echo "   Package: $PACKAGE_FILE"

# Step 3: Uninstall existing
echo ""
echo "2. Uninstalling existing global agent-harness..."
npm uninstall -g "@${GITHUB_ORG}/agent-harness" 2>/dev/null || true

# Step 4: Install new package
echo ""
echo "3. Installing new package globally..."
npm install -g "$PACKAGE_FILE"

# Step 5: Verify installation
echo ""
echo "4. Verifying installation..."
WHICH_AH=$(which agent-harness 2>/dev/null || echo "not found")
echo "   Installed at: $WHICH_AH"

# Step 6: Test init (unless skipped)
if [ "$SKIP_INIT" = false ]; then
  echo ""
  echo "5. Testing init in temp directory..."
  TEST_DIR=$(mktemp -d)
  cd "$TEST_DIR"
  agent-harness init
  echo ""
  echo "   Test directory: $TEST_DIR"
  ls -la "$TEST_DIR/.claude/"

  # Cleanup
  rm -rf "$TEST_DIR"
  echo "   Cleaned up test directory"
else
  echo ""
  echo "5. Skipping init test (--skip-init flag)"
fi

echo ""
echo "=== Done ==="
echo ""
echo "agent-harness installed globally from local build."
echo ""
echo "To use in a project:"
echo "  cd /path/to/project"
echo "  agent-harness init"
echo "  claude"
