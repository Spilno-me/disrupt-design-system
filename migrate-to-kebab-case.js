#!/usr/bin/env node

/**
 * DDS Naming Convention Migration Script
 * Migrates camelCase naming to kebab-case for CSS variables and Tailwind classes
 *
 * Usage:
 *   node migrate-to-kebab-case.js --dry-run  // Preview changes
 *   node migrate-to-kebab-case.js            // Apply changes
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// camelCase to kebab-case mappings
const MAPPINGS = {
  'inverseBg': 'inverse-bg',
  'mutedBg': 'muted-bg',
  'accentStrong': 'accent-strong',
  'accentBg': 'accent-bg',
  'surfaceHover': 'surface-hover',
  'surfaceActive': 'surface-active',
  'errorLight': 'error-light',
  'errorMuted': 'error-muted',
  'successLight': 'success-light',
  'successMuted': 'success-muted',
  'warningLight': 'warning-light',
  'warningMuted': 'warning-muted',
  'infoLight': 'info-light',
  'infoMuted': 'info-muted',
  'lightPurple': 'light-purple',
  'darkPurple': 'dark-purple',
  'tealLight': 'teal-light',
  'agingLight': 'aging-light',
  'agingDark': 'aging-dark',
  'linkHover': 'link-hover',
  'inverseSubtle': 'inverse-subtle',
  'accentSubtle': 'accent-subtle',
  'errorSubtle': 'error-subtle',
  'successSubtle': 'success-subtle',
  'warningSubtle': 'warning-subtle',
  'infoSubtle': 'info-subtle',
};

// File patterns to process
const FILE_PATTERNS = [
  'src/**/*.{tsx,ts,jsx,js}',
  'src/**/*.css',
  'src/**/*.mdx',
  'tailwind-preset.js',
  'tailwind.config.js',
  'CLAUDE.md',
  'DDS-UI-REFERENCE.md',
];

// Files to exclude
const EXCLUDE_PATTERNS = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.storybook/**',
];

class MigrationReport {
  constructor() {
    this.fileChanges = new Map();
    this.totalReplacements = 0;
  }

  addChange(filePath, oldText, newText, occurrences) {
    if (!this.fileChanges.has(filePath)) {
      this.fileChanges.set(filePath, []);
    }
    this.fileChanges.get(filePath).push({ oldText, newText, occurrences });
    this.totalReplacements += occurrences;
  }

  print() {
    console.log(`\n${colors.bright}${colors.green}Migration Report${colors.reset}`);
    console.log(`${'='.repeat(60)}\n`);

    if (this.fileChanges.size === 0) {
      console.log(`${colors.yellow}No changes needed. All files are already using kebab-case!${colors.reset}\n`);
      return;
    }

    console.log(`${colors.cyan}Files modified: ${this.fileChanges.size}${colors.reset}`);
    console.log(`${colors.cyan}Total replacements: ${this.totalReplacements}${colors.reset}\n`);

    // Group by directory
    const byDir = new Map();
    for (const [filePath, changes] of this.fileChanges) {
      const dir = path.dirname(filePath);
      if (!byDir.has(dir)) byDir.set(dir, []);
      byDir.get(dir).push({ filePath, changes });
    }

    for (const [dir, files] of byDir) {
      console.log(`${colors.blue}${dir}/${colors.reset}`);
      for (const { filePath, changes } of files) {
        const fileName = path.basename(filePath);
        const total = changes.reduce((sum, c) => sum + c.occurrences, 0);
        console.log(`  ${fileName} ${colors.yellow}(${total} changes)${colors.reset}`);

        for (const { oldText, newText, occurrences } of changes) {
          console.log(`    ${colors.reset}${oldText}${colors.reset} → ${colors.green}${newText}${colors.reset} ${colors.yellow}×${occurrences}${colors.reset}`);
        }
      }
      console.log('');
    }
  }
}

function createReplacements() {
  const replacements = [];

  for (const [camelCase, kebabCase] of Object.entries(MAPPINGS)) {
    // CSS variables: --color-camelCase → --color-kebab-case
    replacements.push({
      pattern: new RegExp(`--color-${camelCase}\\b`, 'g'),
      replacement: `--color-${kebabCase}`,
      description: `CSS var: --color-${camelCase}`,
    });

    // Tailwind classes: bg-camelCase, text-camelCase, border-camelCase, etc.
    const prefixes = ['bg', 'text', 'border', 'from', 'to', 'via', 'ring', 'placeholder'];
    for (const prefix of prefixes) {
      replacements.push({
        pattern: new RegExp(`(${prefix}-)${camelCase}\\b`, 'g'),
        replacement: `$1${kebabCase}`,
        description: `Tailwind: ${prefix}-${camelCase}`,
      });

      // Hover, focus, active variants: hover:bg-camelCase
      const variants = ['hover', 'focus', 'active', 'disabled', 'group-hover', 'peer-checked'];
      for (const variant of variants) {
        replacements.push({
          pattern: new RegExp(`(${variant}:${prefix}-)${camelCase}\\b`, 'g'),
          replacement: `$1${kebabCase}`,
          description: `Tailwind: ${variant}:${prefix}-${camelCase}`,
        });
      }

      // Opacity variants: bg-camelCase/50, hover:bg-camelCase/90
      replacements.push({
        pattern: new RegExp(`(${prefix}-)${camelCase}(/\\d+)\\b`, 'g'),
        replacement: `$1${kebabCase}$2`,
        description: `Tailwind opacity: ${prefix}-${camelCase}/N`,
      });
      replacements.push({
        pattern: new RegExp(`(hover:${prefix}-)${camelCase}(/\\d+)\\b`, 'g'),
        replacement: `$1${kebabCase}$2`,
        description: `Tailwind opacity: hover:${prefix}-${camelCase}/N`,
      });
    }

    // Quoted strings in configs: 'camelCase' → 'kebab-case'
    replacements.push({
      pattern: new RegExp(`(['"\`])${camelCase}(['"\`])`, 'g'),
      replacement: `$1${kebabCase}$2`,
      description: `String: '${camelCase}'`,
    });

    // Object keys in TypeScript/JavaScript (be careful with this one)
    // Only replace in specific contexts like safelist arrays
    replacements.push({
      pattern: new RegExp(`(['"]\s*${camelCase}\s*['"])`, 'g'),
      replacement: (match) => match.replace(camelCase, kebabCase),
      description: `Array/Object: "${camelCase}"`,
    });
  }

  return replacements;
}

async function processFile(filePath, replacements, dryRun = false) {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  const changes = [];

  for (const { pattern, replacement, description } of replacements) {
    const matches = [...content.matchAll(pattern)];
    if (matches.length > 0) {
      newContent = newContent.replace(pattern, replacement);
      changes.push({
        description,
        occurrences: matches.length,
        oldText: matches[0][0],
        newText: typeof replacement === 'function'
          ? replacement(matches[0][0])
          : matches[0][0].replace(pattern, replacement),
      });
    }
  }

  if (newContent !== content) {
    if (!dryRun) {
      fs.writeFileSync(filePath, newContent, 'utf8');
    }
    return changes;
  }

  return null;
}

async function migrate(dryRun = false) {
  const startTime = Date.now();
  const report = new MigrationReport();

  console.log(`\n${colors.bright}${colors.cyan}DDS camelCase → kebab-case Migration${colors.reset}`);
  console.log(`${'='.repeat(60)}\n`);

  if (dryRun) {
    console.log(`${colors.yellow}DRY RUN MODE - No files will be modified${colors.reset}\n`);
  }

  // Find all files
  console.log('Scanning files...');
  const files = await glob(FILE_PATTERNS, {
    ignore: EXCLUDE_PATTERNS,
    nodir: true,
  });

  console.log(`Found ${files.length} files to process\n`);

  // Create replacement patterns
  const replacements = createReplacements();

  // Process files
  let processedCount = 0;
  for (const file of files) {
    const changes = await processFile(file, replacements, dryRun);
    if (changes) {
      processedCount++;
      for (const change of changes) {
        report.addChange(file, change.oldText, change.newText, change.occurrences);
      }
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  report.print();

  console.log(`${colors.bright}Summary${colors.reset}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Files scanned: ${files.length}`);
  console.log(`Files modified: ${processedCount}`);
  console.log(`Total replacements: ${report.totalReplacements}`);
  console.log(`Duration: ${duration}s\n`);

  if (dryRun) {
    console.log(`${colors.yellow}This was a dry run. Run without --dry-run to apply changes.${colors.reset}\n`);
  } else {
    console.log(`${colors.green}✓ Migration complete!${colors.reset}\n`);
    console.log(`${colors.cyan}Next steps:${colors.reset}`);
    console.log(`  1. Run: npm run build`);
    console.log(`  2. Run: npm run storybook`);
    console.log(`  3. Review: git diff`);
    console.log(`  4. If good: git add . && git commit -m "refactor: migrate to kebab-case naming convention"`);
    console.log(`  5. If bad: git reset --hard\n`);
  }
}

// Parse CLI arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run') || args.includes('-d');

// Run migration
migrate(dryRun).catch((error) => {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
});
