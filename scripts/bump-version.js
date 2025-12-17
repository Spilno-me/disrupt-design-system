#!/usr/bin/env node

/**
 * Version Bump Script
 * Automatically updates version across all files in the DDS project
 *
 * Usage:
 *   npm run version:patch     # 2.5.0 → 2.5.1
 *   npm run version:minor     # 2.5.0 → 2.6.0
 *   npm run version:major     # 2.5.0 → 3.0.0
 *   npm run version 2.5.1     # Set specific version
 *
 * Files updated:
 *   - package.json
 *   - package-lock.json (via npm install)
 *   - .claude/agent-context.json
 *   - .claude/changelog.json
 *   - .claude/tokens-reference.json
 *   - TESTING.md
 *   - src/stories/01-Introduction.mdx
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// Get current version from package.json
function getCurrentVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8'));
  return pkg.version;
}

// Parse version string to components
function parseVersion(version) {
  const [major, minor, patch] = version.split('.').map(Number);
  return { major, minor, patch };
}

// Increment version based on type
function incrementVersion(currentVersion, type) {
  const { major, minor, patch } = parseVersion(currentVersion);

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Invalid version type: ${type}`);
  }
}

// Determine new version from arguments
function getNewVersion() {
  const arg = process.argv[2];

  if (!arg) {
    console.error('❌ Usage:');
    console.error('   npm run version:patch     # Increment patch (2.5.0 → 2.5.1)');
    console.error('   npm run version:minor     # Increment minor (2.5.0 → 2.6.0)');
    console.error('   npm run version:major     # Increment major (2.5.0 → 3.0.0)');
    console.error('   npm run version 2.5.1     # Set specific version');
    process.exit(1);
  }

  const currentVersion = getCurrentVersion();

  // Check if it's a version type or specific version
  if (['patch', 'minor', 'major'].includes(arg)) {
    return incrementVersion(currentVersion, arg);
  }

  // Validate specific version format
  if (!/^\d+\.\d+\.\d+$/.test(arg)) {
    console.error('❌ Invalid version format. Use semantic versioning: X.Y.Z');
    process.exit(1);
  }

  return arg;
}

const currentVersion = getCurrentVersion();
const newVersion = getNewVersion();

console.log(`\n🚀 Bumping version: ${currentVersion} → ${newVersion}\n`);

// Track updates
const updates = [];

// Helper to update JSON file
function updateJsonFile(relativePath, updateFn) {
  const filePath = path.join(ROOT, relativePath);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${relativePath} (not found)`);
    return;
  }

  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  updateFn(content);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
  updates.push(relativePath);
  console.log(`✅ ${relativePath}`);
}

// Helper to update text file with regex
function updateTextFile(relativePath, patterns) {
  const filePath = path.join(ROOT, relativePath);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${relativePath} (not found)`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  let updated = false;

  for (const { pattern, replacement } of patterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      updated = true;
    }
  }

  if (updated) {
    fs.writeFileSync(filePath, content);
    updates.push(relativePath);
    console.log(`✅ ${relativePath}`);
  } else {
    console.log(`⚠️  ${relativePath} (no matches found)`);
  }
}

// 1. package.json
updateJsonFile('package.json', (json) => {
  json.version = newVersion;
});

// 2. .claude/agent-context.json
updateJsonFile('.claude/agent-context.json', (json) => {
  if (json.meta) {
    json.meta.version = newVersion;
  }
});

// 3. .claude/changelog.json
updateJsonFile('.claude/changelog.json', (json) => {
  json.currentVersion = newVersion;
});

// 4. .claude/tokens-reference.json
updateJsonFile('.claude/tokens-reference.json', (json) => {
  json.version = newVersion;
});

// 5. TESTING.md - update version line
updateTextFile('TESTING.md', [
  {
    pattern: /\*\*Version:\*\*\s*\d+\.\d+\.\d+/,
    replacement: `**Version:** ${newVersion}`,
  },
]);

// 6. src/stories/01-Introduction.mdx - update version badge
const shortVersion = `v${newVersion.split('.').slice(0, 2).join('.')}`;
updateTextFile('src/stories/01-Introduction.mdx', [
  {
    pattern: /version="v\d+\.\d+"/,
    replacement: `version="${shortVersion}"`,
  },
]);

// 7. Update package-lock.json using execFileSync (safe, no shell injection)
console.log('\n📦 Updating package-lock.json...');
try {
  execFileSync('npm', ['install', '--package-lock-only'], { cwd: ROOT, stdio: 'pipe' });
  updates.push('package-lock.json');
  console.log('✅ package-lock.json');
} catch (error) {
  console.log('⚠️  package-lock.json (failed to update)');
}

// Summary
console.log('\n' + '─'.repeat(50));
console.log(`📋 Version bumped: ${currentVersion} → ${newVersion}`);
console.log(`   Files updated: ${updates.length}`);
console.log('─'.repeat(50));

// Agent instruction block - this prompts Claude to update the changelog
console.log('\n<agent-task>');
console.log('UPDATE_CHANGELOG');
console.log(`VERSION=${newVersion}`);
console.log(`PREVIOUS_VERSION=${currentVersion}`);
console.log(`DATE=${new Date().toISOString().split('T')[0]}`);
console.log('</agent-task>');

console.log('\n📝 AGENT: Please update CHANGELOG.md now:');
console.log(`   1. Add a new ## [${newVersion}] - ${new Date().toISOString().split('T')[0]} section`);
console.log('   2. Move relevant items from [Unreleased] or add new entries');
console.log('   3. Categorize changes: Added, Changed, Fixed, Removed');
console.log('   4. Then stage all files and commit');
console.log('');
