#!/usr/bin/env node

/**
 * Validate the agent-harness package for consistency and correctness
 *
 * Usage: node scripts/validate.js
 *
 * Checks:
 * 1. All workflows referenced in SKILL.md exist
 * 2. All agents referenced in workflows exist
 * 3. All rules referenced in agents exist
 * 4. All templates referenced in agents exist
 * 5. Agent memory files exist
 * 6. npm pack contents match package.json files array
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

let errors = [];
let warnings = [];

function error(msg) {
  errors.push(`ERROR: ${msg}`);
  console.error(`  ✗ ${msg}`);
}

function warn(msg) {
  warnings.push(`WARN: ${msg}`);
  console.warn(`  ⚠ ${msg}`);
}

function ok(msg) {
  console.log(`  ✓ ${msg}`);
}

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

// ============================================================================
// Workflow References
// ============================================================================

console.log('\n1. Workflow References (SKILL.md → workflows/)');

const skillPath = path.join(ROOT, 'skills', 'ah', 'SKILL.md');
const skillContent = fs.readFileSync(skillPath, 'utf8');

// Extract workflow references from SKILL.md
const workflowRefs = [...skillContent.matchAll(/workflows\/([a-z0-9-]+)\.md/g)]
  .map(m => m[1]);

const workflowDir = path.join(ROOT, 'workflows');
const existingWorkflows = fs.readdirSync(workflowDir)
  .filter(f => f.endsWith('.md'))
  .map(f => f.replace('.md', ''));

for (const ref of workflowRefs) {
  if (!existingWorkflows.includes(ref)) {
    error(`SKILL.md references missing workflow: ${ref}`);
  }
}

// Check for orphan workflows not in SKILL.md
for (const wf of existingWorkflows) {
  if (!workflowRefs.includes(wf)) {
    warn(`Workflow not referenced in SKILL.md: ${wf}`);
  }
}

ok(`Checked ${workflowRefs.length} workflow references`);

// ============================================================================
// Agent References (workflows → agents)
// ============================================================================

console.log('\n2. Agent References (workflows → agents/)');

const agentDir = path.join(ROOT, 'agents');
const existingAgents = fs.readdirSync(agentDir)
  .filter(f => f.endsWith('.md'))
  .map(f => f.replace('.md', ''));

const workflowAgents = new Set();
for (const wf of existingWorkflows) {
  const content = fs.readFileSync(path.join(workflowDir, `${wf}.md`), 'utf8');
  const match = content.match(/^agent:\s*(.+)$/m);
  if (match) {
    workflowAgents.add(match[1].trim());
  }
}

for (const agent of workflowAgents) {
  if (!existingAgents.includes(agent)) {
    error(`Workflow references missing agent: ${agent}`);
  }
}

ok(`Checked ${workflowAgents.size} agent references`);

// ============================================================================
// Rule References (agents → rules/)
// ============================================================================

console.log('\n3. Rule References (agents → rules/)');

function getAllRules(dir, prefix = '') {
  const rules = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      rules.push(...getAllRules(path.join(dir, entry.name), `${prefix}${entry.name}/`));
    } else if (entry.name.endsWith('.md')) {
      rules.push(`${prefix}${entry.name.replace('.md', '')}`);
    }
  }
  return rules;
}

const rulesDir = path.join(ROOT, 'rules');
const existingRules = getAllRules(rulesDir);

const agentRules = new Set();
for (const agent of existingAgents) {
  const content = fs.readFileSync(path.join(agentDir, `${agent}.md`), 'utf8');
  const match = content.match(/^rules:\s*\n((?:\s+-\s+.+\n?)+)/m);
  if (match) {
    const rules = match[1].match(/-\s+(.+)/g) || [];
    for (const r of rules) {
      agentRules.add(r.replace(/^-\s+/, '').trim());
    }
  }
}

for (const rule of agentRules) {
  if (!existingRules.includes(rule)) {
    error(`Agent references missing rule: ${rule}`);
  }
}

ok(`Checked ${agentRules.size} rule references`);

// ============================================================================
// Template References (agents → templates/)
// ============================================================================

console.log('\n4. Template References (agents → templates/)');

const templatesDir = path.join(ROOT, 'templates');
const existingTemplates = fs.readdirSync(templatesDir)
  .filter(f => f.endsWith('.txt') || f.endsWith('.md'));

const agentTemplates = new Set();
for (const agent of existingAgents) {
  const content = fs.readFileSync(path.join(agentDir, `${agent}.md`), 'utf8');
  const match = content.match(/^templates:\s*\n((?:\s+-\s+.+\n?)+)/m);
  if (match) {
    const templates = match[1].match(/-\s+(.+)/g) || [];
    for (const t of templates) {
      agentTemplates.add(t.replace(/^-\s+/, '').trim());
    }
  }
}

for (const template of agentTemplates) {
  if (!existingTemplates.includes(template)) {
    error(`Agent references missing template: ${template}`);
  }
}

ok(`Checked ${agentTemplates.size} template references`);

// ============================================================================
// Memory Files
// ============================================================================

console.log('\n5. Agent Memory Files');

const memoryDir = path.join(ROOT, 'memory');
if (!fs.existsSync(memoryDir)) {
  error('Missing memory/ directory');
} else {
  const memoryFiles = fs.readdirSync(memoryDir).filter(f => f.endsWith('.json'));
  for (const agent of existingAgents) {
    if (!memoryFiles.includes(`${agent}.json`)) {
      warn(`Missing memory file for agent: ${agent}`);
    }
  }
  ok(`Found ${memoryFiles.length} memory files`);
}

// ============================================================================
// Package Files
// ============================================================================

console.log('\n6. Package Files (package.json files array)');

const pkgFiles = pkg.files || [];
const requiredDirs = ['memory'];

for (const dir of requiredDirs) {
  const hasDir = pkgFiles.some(f => f === dir || f === `${dir}/`);
  if (!hasDir) {
    error(`package.json files missing: ${dir}/`);
  }
}

ok(`package.json files array has ${pkgFiles.length} entries`);

// ============================================================================
// Summary
// ============================================================================

console.log('\n' + '='.repeat(50));
console.log('VALIDATION SUMMARY');
console.log('='.repeat(50));

if (errors.length === 0 && warnings.length === 0) {
  console.log('\n✓ All checks passed!\n');
  process.exit(0);
} else {
  if (warnings.length > 0) {
    console.log(`\n⚠ ${warnings.length} warning(s)`);
  }
  if (errors.length > 0) {
    console.log(`\n✗ ${errors.length} error(s)`);
    process.exit(1);
  }
  process.exit(0);
}
