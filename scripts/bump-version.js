#!/usr/bin/env node

/**
 * Version Bump Script
 * Updates version across all files in the DDS project
 *
 * Usage:
 *   node scripts/bump-version.js <version>
 *   node scripts/bump-version.js 2.5.0
 *
 * Files updated:
 *   - package.json
 *   - .claude/agent-context.json
 *   - .claude/changelog.json
 *   - .claude/tokens-reference.json
 *   - TESTING.md
 *   - src/stories/01-Introduction.mdx
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const newVersion = process.argv[2];

if (!newVersion) {
  console.error('❌ Usage: node scripts/bump-version.js <version>');
  console.error('   Example: node scripts/bump-version.js 2.5.0');
  process.exit(1);
}

// Validate version format
if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
  console.error('❌ Invalid version format. Use semantic versioning: X.Y.Z');
  process.exit(1);
}

console.log(`\n🚀 Bumping version to ${newVersion}\n`);

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
  const oldVersion = content.version || content.currentVersion || 'unknown';
  updateFn(content);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
  updates.push({ file: relativePath, from: oldVersion, to: newVersion });
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
    updates.push({ file: relativePath, to: newVersion });
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

// Summary
console.log('\n📋 Summary:');
console.log(`   Files updated: ${updates.length}`);
console.log(`   New version: ${newVersion}`);
console.log('\n💡 Don\'t forget to:');
console.log('   1. Update CHANGELOG.md with release notes');
console.log('   2. Run: npm install (to update package-lock.json)');
console.log('   3. Commit changes');
console.log('');
