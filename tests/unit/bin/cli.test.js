#!/usr/bin/env node

/**
 * CLI smoke tests for agent-harness
 *
 * Usage: node tests/unit/bin/cli.test.js
 *
 * Tests:
 * 1. init creates expected files
 * 2. status reports installed
 * 3. uninstall removes files
 * 4. status reports not installed
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const CLI_PATH = path.resolve(__dirname, '..', '..', '..', 'bin', 'cli.js');

let tempDir;
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertFileExists(filePath, message) {
  const fullPath = path.join(tempDir, filePath);
  assert(fs.existsSync(fullPath), message || `File should exist: ${filePath}`);
}

function assertFileNotExists(filePath, message) {
  const fullPath = path.join(tempDir, filePath);
  assert(!fs.existsSync(fullPath), message || `File should not exist: ${filePath}`);
}

function runCli(command) {
  return execSync(`node "${CLI_PATH}" ${command}`, {
    cwd: tempDir,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  });
}

// ============================================================================
// Setup
// ============================================================================

console.log('\n=== CLI Smoke Tests ===\n');

// Create temp directory
tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ah-test-'));
console.log(`Test directory: ${tempDir}\n`);

// ============================================================================
// Tests
// ============================================================================

console.log('1. Init');

test('creates .claude directory', () => {
  runCli('init');
  assertFileExists('.claude');
});

test('creates marker file', () => {
  assertFileExists('.claude/.agent-harness');
});

test('creates skills directory', () => {
  assertFileExists('.claude/skills/ah/SKILL.md');
});

test('creates workflows directory', () => {
  assertFileExists('.claude/workflows');
});

test('creates agents directory', () => {
  assertFileExists('.claude/agents');
});

test('creates memory directory', () => {
  assertFileExists('.claude/memory');
});

test('creates CLAUDE.md', () => {
  assertFileExists('CLAUDE.md');
});

console.log('\n2. Status');

test('reports installed', () => {
  const output = runCli('status');
  assert(output.includes('installed'), 'Should report as installed');
});

console.log('\n3. Re-init (idempotent)');

test('can run init again', () => {
  runCli('init');
  assertFileExists('.claude/.agent-harness');
});

console.log('\n4. Uninstall');

test('removes marker file', () => {
  runCli('uninstall');
  assertFileNotExists('.claude/.agent-harness');
});

test('removes skill files', () => {
  // Skills directory may remain if empty, but SKILL.md should be gone
  assertFileNotExists('.claude/skills/ah/SKILL.md');
});

console.log('\n5. Status after uninstall');

test('reports not installed', () => {
  const output = runCli('status');
  assert(output.includes('NOT installed') || output.includes('not installed'), 'Should report as not installed');
});

// ============================================================================
// Cleanup
// ============================================================================

console.log('\n6. Cleanup');

test('removes temp directory', () => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});

// ============================================================================
// Summary
// ============================================================================

console.log('\n=== Summary ===\n');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('\n✓ All tests passed!\n');
}
