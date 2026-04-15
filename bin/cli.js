#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const TOOLKIT_NAME = 'agent-harness';

function getPackageRoot() {
  return path.resolve(__dirname, '..');
}

function getFileHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function normalizeTrackedFileEntry(entry) {
  if (typeof entry === 'string') {
    return { path: entry, hash: null };
  }
  if (entry && typeof entry.path === 'string') {
    return { path: entry.path, hash: entry.hash || null };
  }
  return null;
}

function copyDirRecursive(src, dest, options = {}) {
  const { trackedFiles = new Set(), dryRun = false } = options;
  const copied = [];
  const skipped = [];

  // Check if dest is a broken symlink (existsSync returns false but lstatSync succeeds)
  let isBrokenSymlink = false;
  try {
    fs.lstatSync(dest);
    isBrokenSymlink = !fs.existsSync(dest);
  } catch {
    // Path doesn't exist at all, which is fine
  }

  if (isBrokenSymlink) {
    // Remove broken symlink so we can create a real directory
    if (!dryRun) fs.unlinkSync(dest);
  }

  if (!fs.existsSync(dest)) {
    if (!dryRun) fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      const result = copyDirRecursive(srcPath, destPath, options);
      copied.push(...result.copied);
      skipped.push(...result.skipped);
    } else {
      // Always copy if: file doesn't exist, OR file is tracked by AH (we own it)
      const relPath = path.relative(options.claudeDir || dest, destPath);
      const isAhOwned = trackedFiles.has(relPath);

      if (!fs.existsSync(destPath) || isAhOwned) {
        if (!dryRun) {
          fs.copyFileSync(srcPath, destPath);
        }
        copied.push(destPath);
      } else {
        // File exists but not tracked by AH - user's file, don't touch
        skipped.push(destPath);
      }
    }
  }

  return { copied, skipped };
}

function removeDirIfExists(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    return true;
  }
  return false;
}

function init() {
  const cwd = process.cwd();
  const claudeDir = path.join(cwd, '.claude');
  const packageRoot = getPackageRoot();
  const markerFile = path.join(claudeDir, '.agent-harness');
  const bdMarkerFile = path.join(claudeDir, '.bounce-developer');

  console.log('Setting up Agent Harness in .claude/\n');

  // Create .claude directory if it doesn't exist
  if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true });
    console.log('Created .claude/');
  }

  // Check for bounce-developer migration
  const isMigration = !fs.existsSync(markerFile) && fs.existsSync(bdMarkerFile);
  if (isMigration) {
    console.log('Detected bounce-developer installation - migrating to agent-harness...\n');
  }

  // Load existing tracked files (AH-owned files that we can safely update)
  // Also recognize bounce-developer files for migration
  const trackedFiles = new Set();
  const sourceMarker = fs.existsSync(markerFile) ? markerFile :
                       fs.existsSync(bdMarkerFile) ? bdMarkerFile : null;

  if (sourceMarker) {
    try {
      const existing = JSON.parse(fs.readFileSync(sourceMarker, 'utf8'));
      for (const entry of existing.files || []) {
        const normalized = normalizeTrackedFileEntry(entry);
        if (normalized) trackedFiles.add(normalized.path);
      }
    } catch {}
  }

  // Directories to copy
  const dirs = [
    { src: 'skills', dest: 'skills', description: 'skills (commands)' },
    { src: 'workflows', dest: 'workflows', description: 'workflows' },
    { src: 'agents', dest: 'agents', description: 'agents' },
    { src: 'rules', dest: 'rules', description: 'rules' },
    { src: 'templates', dest: 'templates', description: 'templates' },
    { src: 'tools', dest: 'tools', description: 'tool docs' },
    { src: 'memory', dest: 'memory', description: 'agent memory' },
    { src: 'scripts', dest: 'scripts', description: 'scripts' },
  ];

  const allCopied = [];
  const allSkipped = [];

  for (const dir of dirs) {
    const srcDir = path.join(packageRoot, dir.src);
    const destDir = path.join(claudeDir, dir.dest);

    if (!fs.existsSync(srcDir)) continue;

    const { copied, skipped } = copyDirRecursive(srcDir, destDir, {
      trackedFiles,
      claudeDir
    });
    allCopied.push(...copied);
    allSkipped.push(...skipped);

    if (copied.length > 0) {
      console.log(`Copied ${dir.description} (${copied.length} files)`);
    }
    if (skipped.length > 0) {
      console.log(`Skipped ${dir.description} (${skipped.length} user files preserved)`);
    }
  }

  // Merge hooks.json (preserve user hooks, add/update AH hooks)
  const srcHooks = path.join(packageRoot, 'hooks', 'hooks.json');
  const destHooks = path.join(claudeDir, 'hooks.json');
  if (fs.existsSync(srcHooks)) {
    const ahHooks = JSON.parse(fs.readFileSync(srcHooks, 'utf8'));
    let finalHooks = ahHooks;

    if (fs.existsSync(destHooks)) {
      try {
        const existingHooks = JSON.parse(fs.readFileSync(destHooks, 'utf8'));
        // Merge: AH hooks take precedence, but preserve user-added hooks
        finalHooks = { ...existingHooks };
        for (const [hookType, hookArray] of Object.entries(ahHooks)) {
          if (!finalHooks[hookType]) {
            finalHooks[hookType] = hookArray;
          } else {
            // Merge arrays, AH hooks first
            const existingMatchers = new Set(finalHooks[hookType].map(h => h.matcher || h.command));
            for (const ahHook of hookArray) {
              const matcher = ahHook.matcher || ahHook.command;
              if (!existingMatchers.has(matcher)) {
                finalHooks[hookType].unshift(ahHook);
              }
            }
          }
        }
        console.log('Merged hooks.json (preserved user hooks)');
      } catch {
        console.log('Copied hooks.json (existing file was invalid)');
      }
    } else {
      console.log('Copied hooks.json');
    }
    fs.writeFileSync(destHooks, JSON.stringify(finalHooks, null, 2));
    allCopied.push(destHooks);
  }

  // Copy README.md (AH documentation - always update)
  const srcReadme = path.join(packageRoot, 'README.md');
  const destReadme = path.join(claudeDir, 'README.md');
  if (fs.existsSync(srcReadme)) {
    fs.copyFileSync(srcReadme, destReadme);
    console.log('Updated README.md');
    allCopied.push(destReadme);
  }

  // Copy .env.example (only if doesn't exist - don't overwrite user's config)
  const srcEnvExample = path.join(packageRoot, '.env.example');
  const destEnvExample = path.join(claudeDir, '.env.example');
  if (fs.existsSync(srcEnvExample) && !fs.existsSync(destEnvExample)) {
    fs.copyFileSync(srcEnvExample, destEnvExample);
    console.log('Copied .env.example (copy to .env and configure)');
    allCopied.push(destEnvExample);
  }

  // Update project CLAUDE.md with AH section (read from INIT-CLAUDE.md template)
  const claudeMdPath = path.join(cwd, 'CLAUDE.md');
  const ahSectionStart = '<!-- AGENT-HARNESS:START -->';
  const ahSectionEnd = '<!-- AGENT-HARNESS:END -->';
  const initClaudeMdPath = path.join(packageRoot, 'INIT-CLAUDE.md');
  const ahSectionContent = fs.existsSync(initClaudeMdPath)
    ? fs.readFileSync(initClaudeMdPath, 'utf8').trim()
    : '## Agent Harness\n\nRun `/ah` for available commands. See `.claude/README.md` for documentation.';
  const ahSection = `${ahSectionStart}\n${ahSectionContent}\n${ahSectionEnd}`;

  if (fs.existsSync(claudeMdPath)) {
    let content = fs.readFileSync(claudeMdPath, 'utf8');

    // Migration: replace old DT section markers if present
    const oldStart = '<!-- DEV-TOOLS:START -->';
    const oldEnd = '<!-- DEV-TOOLS:END -->';
    const oldStartIdx = content.indexOf(oldStart);
    const oldEndIdx = content.indexOf(oldEnd);
    if (oldStartIdx !== -1 && oldEndIdx !== -1) {
      content = content.substring(0, oldStartIdx) + ahSection + content.substring(oldEndIdx + oldEnd.length);
      console.log('Updated CLAUDE.md (migrated from DT to AH section)');
    } else {
      const startIdx = content.indexOf(ahSectionStart);
      const endIdx = content.indexOf(ahSectionEnd);

      if (startIdx !== -1 && endIdx !== -1) {
        // Replace existing AH section
        content = content.substring(0, startIdx) + ahSection + content.substring(endIdx + ahSectionEnd.length);
        console.log('Updated CLAUDE.md (replaced AH section)');
      } else {
        // Append AH section
        content = content.trimEnd() + '\n\n' + ahSection + '\n';
        console.log('Updated CLAUDE.md (appended AH section)');
      }
    }
    fs.writeFileSync(claudeMdPath, content);
  } else {
    // Create new CLAUDE.md with AH section
    const newContent = `# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

${ahSection}
`;
    fs.writeFileSync(claudeMdPath, newContent);
    console.log('Created CLAUDE.md with AH section');
  }

  // Create knowledge directory structure (NEVER overwrite - user data)
  const knowledgeDir = path.join(claudeDir, 'knowledge');
  const knowledgeAppsDir = path.join(knowledgeDir, 'apps');
  const indexFile = path.join(knowledgeDir, 'index.json');

  // Create directories if missing, but never touch existing files
  if (!fs.existsSync(knowledgeDir)) {
    fs.mkdirSync(knowledgeDir, { recursive: true });
    console.log('Created knowledge/ directory');
  }
  if (!fs.existsSync(knowledgeAppsDir)) {
    fs.mkdirSync(knowledgeAppsDir, { recursive: true });
  }
  // Only create index.json if it doesn't exist
  if (!fs.existsSync(indexFile)) {
    const initialIndex = {
      version: '1.0',
      updatedAt: new Date().toISOString(),
      apps: []
    };
    fs.writeFileSync(indexFile, JSON.stringify(initialIndex, null, 2));
    console.log('Created knowledge/index.json');
  }

  // Create/update marker file to track what we installed
  let existingFiles = [];

  // Load existing marker if present
  if (fs.existsSync(markerFile)) {
    try {
      const existing = JSON.parse(fs.readFileSync(markerFile, 'utf8'));
      existingFiles = existing.files || [];
    } catch {}
  }

  // Build marker file with hashes for safe uninstall
  // NEVER track user data directories
  const protectedPaths = ['knowledge/', 'plans/', 'reviews/', '.tmp/'];
  const isProtected = (p) => protectedPaths.some(prefix => p.startsWith(prefix));

  const fileHashes = new Map();

  for (const rawEntry of existingFiles) {
    const entry = normalizeTrackedFileEntry(rawEntry);
    if (!entry || isProtected(entry.path)) continue;
    fileHashes.set(entry.path, entry.hash);
  }

  for (const copiedFile of allCopied) {
    const relPath = path.relative(claudeDir, copiedFile);
    if (isProtected(relPath)) continue;
    fileHashes.set(relPath, getFileHash(copiedFile));
  }

  for (const [relPath, hash] of fileHashes.entries()) {
    if (hash) continue;
    const fullPath = path.join(claudeDir, relPath);
    if (fs.existsSync(fullPath)) {
      fileHashes.set(relPath, getFileHash(fullPath));
    }
  }

  const markerContent = {
    version: require(path.join(packageRoot, 'package.json')).version,
    installedAt: new Date().toISOString(),
    migratedFrom: isMigration ? 'bounce-developer' : undefined,
    files: [...fileHashes.entries()].map(([filePath, fileHash]) => ({
      path: filePath,
      hash: fileHash,
    })),
  };
  fs.writeFileSync(markerFile, JSON.stringify(markerContent, null, 2));

  // Clean up old bounce-developer marker after successful migration
  if (isMigration && fs.existsSync(bdMarkerFile)) {
    fs.unlinkSync(bdMarkerFile);
    console.log('Removed old .bounce-developer marker');
  }

  // Install Playwright browsers if not already installed
  // Run from package root where playwright is a dependency
  console.log('\nChecking Playwright browsers...');
  try {
    // Use cross-platform approach: stdio: 'pipe' instead of shell redirection
    execSync('npx playwright install chromium', {
      cwd: packageRoot,
      stdio: 'inherit',
      shell: true
    });
    console.log('Playwright chromium browser ready');
  } catch (err) {
    // Don't fail init if Playwright setup fails - it's optional
    console.log('Note: Playwright browser setup skipped.');
    console.log('If you need Playwright tests, run: npx playwright install chromium');
  }

  console.log(`
Setup complete!

${allCopied.length} files copied, ${allSkipped.length} files skipped (already exist)

Available commands:
  ah git checkout <branch>  - Checkout or create branch
  ah git commit [message]   - Stage and commit changes
  ah git push               - Push to remote
  ah pr create [title]      - Create a pull request
  ah pr watch <pr-number>   - Watch and auto-fix PR comments
  ah pr review <repo> <pr>  - Review PR locally
  ah ticket create <title>  - Create a ticket
  ah knowledge scan         - Generate repo summary
`);

  if (allSkipped.length > 0) {
    console.log('User files were preserved. AH files were updated.\n');
  }

  console.log('To generate knowledge base, run: ah knowledge scan\n');
}

function uninstall() {
  const cwd = process.cwd();
  const claudeDir = path.join(cwd, '.claude');
  const markerFile = path.join(claudeDir, '.agent-harness');

  if (!fs.existsSync(markerFile)) {
    console.log('Agent Harness is not installed in this directory.');
    console.log('(No .claude/.agent-harness marker found)');
    return;
  }

  let marker;
  try {
    marker = JSON.parse(fs.readFileSync(markerFile, 'utf8'));
  } catch {
    console.log('Could not read marker file. Manual cleanup may be required.');
    return;
  }

  console.log('Removing Agent Harness files...\n');

  let removed = 0;
  let notFound = 0;
  let preserved = 0;

  // Remove tracked files
  for (const rawEntry of marker.files || []) {
    const entry = normalizeTrackedFileEntry(rawEntry);
    if (!entry) continue;

    const relPath = entry.path;
    const fullPath = path.join(claudeDir, relPath);
    if (fs.existsSync(fullPath)) {
      if (entry.hash) {
        const currentHash = getFileHash(fullPath);
        if (currentHash !== entry.hash) {
          preserved++;
          continue;
        }
      }
      fs.unlinkSync(fullPath);
      removed++;
    } else {
      notFound++;
    }
  }

  // Clean up empty directories (NEVER touch user data directories)
  const dirsToClean = ['skills', 'workflows', 'agents', 'rules', 'templates', 'tools', 'memory', 'scripts'];
  // Explicitly protect user data directories
  const protectedDirs = ['knowledge', 'plans', 'reviews'];
  for (const dir of dirsToClean) {
    if (protectedDirs.includes(dir)) continue;
    const dirPath = path.join(claudeDir, dir);
    if (fs.existsSync(dirPath)) {
      try {
        // Remove subdirectories first (like skills/ah/)
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory()) {
            const subDir = path.join(dirPath, entry.name);
            const subEntries = fs.readdirSync(subDir);
            if (subEntries.length === 0) {
              fs.rmdirSync(subDir);
            }
          }
        }
        // Remove parent if empty
        const remaining = fs.readdirSync(dirPath);
        if (remaining.length === 0) {
          fs.rmdirSync(dirPath);
        }
      } catch (e) {
        // Directory not empty or other error, skip
      }
    }
  }

  // Remove marker file
  fs.unlinkSync(markerFile);

  console.log(`Removed ${removed} files (${preserved} preserved, ${notFound} already missing)`);
  console.log('Agent Harness has been uninstalled from this directory.');
}

function status() {
  const cwd = process.cwd();
  const claudeDir = path.join(cwd, '.claude');
  const markerFile = path.join(claudeDir, '.agent-harness');

  if (!fs.existsSync(markerFile)) {
    console.log('Agent Harness is NOT installed in this directory.');
    return;
  }

  let marker;
  try {
    marker = JSON.parse(fs.readFileSync(markerFile, 'utf8'));
  } catch {
    console.log('Agent Harness marker exists but could not be read.');
    return;
  }

  console.log('Agent Harness is installed');
  console.log(`  Version: ${marker.version}`);
  console.log(`  Installed: ${marker.installedAt}`);
  console.log(`  Files: ${(marker.files || []).length}`);
}

function showHelp() {
  console.log(`
Agent Harness - Claude Code Toolkit

Usage:
  agent-harness <command>

Commands:
  init          Set up or update toolkit in .claude/ directory
                (Updates AH files, preserves your custom files)
  uninstall     Remove toolkit files from .claude/
                (Preserves files you modified)
  status        Check if toolkit is installed
  path          Print the path to the toolkit package
  version       Show version number
  help          Show this help message

Examples:
  cd /path/to/your/project
  agent-harness init     # Install or update
  claude                 # Commands are now available!

  agent-harness status   # Check installation
  agent-harness uninstall # Remove toolkit
`);
}

function showPath() {
  console.log(getPackageRoot());
}

function showVersion() {
  const pkg = require(path.join(getPackageRoot(), 'package.json'));
  console.log(pkg.version);
}

// Main
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'init':
    init();
    break;
  case 'uninstall':
  case 'remove':
    uninstall();
    break;
  case 'status':
    status();
    break;
  case 'path':
    showPath();
    break;
  case 'version':
  case '--version':
  case '-v':
    showVersion();
    break;
  case 'help':
  case '--help':
  case '-h':
  case undefined:
    showHelp();
    break;
  default:
    console.error(`Unknown command: ${command}`);
    showHelp();
    process.exit(1);
}
