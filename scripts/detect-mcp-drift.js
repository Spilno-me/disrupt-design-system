#!/usr/bin/env node
/**
 * MCP Drift Detection & Auto-Sync
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Detects drift between actual component files and MCP registry.
 * Can auto-add missing components with extracted metadata.
 *
 * Usage:
 *   npm run mcp:detect     # Report drift (default)
 *   npm run mcp:sync       # Auto-fix drift
 *
 * Strategy:
 *   1. Scan src/components/ui for .tsx files
 *   2. Compare against .claude/agent-context.json registry
 *   3. Extract metadata from new files (type, status, variants, testId)
 *   4. Report or auto-merge missing entries
 */

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ════════════════════════════════════════════════════════════════════════════
// Configuration
// ════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  contextPath: join(ROOT, '.claude', 'agent-context.json'),
  componentDirs: [
    { dir: join(ROOT, 'src', 'components', 'ui'), prefix: 'ui/' },
  ],
  excludePatterns: [
    /\.stories\.tsx$/,
    /\.test\.tsx$/,
    /\.spec\.tsx$/,
    /index\.tsx?$/,
    /types\.ts$/,
    /\.d\.ts$/,
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// ANSI Formatting
// ════════════════════════════════════════════════════════════════════════════

const C = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  reset: '\x1b[0m',
};

const log = {
  error: (msg) => console.log(`${C.red}✗${C.reset} ${msg}`),
  success: (msg) => console.log(`${C.green}✓${C.reset} ${msg}`),
  warn: (msg) => console.log(`${C.yellow}⚠${C.reset} ${msg}`),
  info: (msg) => console.log(`${C.cyan}→${C.reset} ${msg}`),
  dim: (msg) => console.log(`${C.dim}${msg}${C.reset}`),
  header: (msg) => console.log(`\n${C.bold}${msg}${C.reset}`),
};

const LINE = '─'.repeat(60);

// ════════════════════════════════════════════════════════════════════════════
// Metadata Extraction
// ════════════════════════════════════════════════════════════════════════════

/**
 * Convert kebab-case to PascalCase
 */
function toPascal(str) {
  return str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

/**
 * Extract component metadata from file content
 */
function extractMetadata(content, filename) {
  const name = toPascal(filename.replace('.tsx', ''));

  // Detect component type from content patterns
  let type = 'ATOM';
  if (/ORGANISM/i.test(content) || /Sidebar|Page|Layout|Shell/.test(name)) {
    type = 'ORGANISM';
  } else if (/MOLECULE/i.test(content) || /Dialog|Sheet|Menu|Panel|Timeline|Table|Card.*Form/.test(name)) {
    type = 'MOLECULE';
  } else if (/PAGE/i.test(content) || /Page$/.test(name)) {
    type = 'PAGE';
  }

  // Detect status
  let status = 'TODO';
  const statusMatch = content.match(/@status\s+(STABILIZED|FROZEN|TODO|UTILITY)/i);
  if (statusMatch) {
    status = statusMatch[1].toUpperCase();
  } else if (/FROZEN/.test(content)) {
    status = 'FROZEN';
  } else if (/STABILIZED/.test(content)) {
    status = 'STABILIZED';
  }

  // shadcn/radix components are typically frozen
  const isShadcn = content.includes('@radix-ui') || content.includes('class-variance-authority');
  if (isShadcn && status === 'TODO') status = 'FROZEN';

  // Utility/animation/renderer components
  const isUtility = /Animation|Particle|Canvas|Effect|Renderer|Optimized|Blur|Parallax|Electric|Scroll.*Lock|Scroll.*Wrapper|Error.*Boundary|Made.*Love|Glass/.test(name);
  if (isUtility && status === 'TODO') status = 'UTILITY';

  // TestId status based on component status
  let testId = 'TODO';
  if (status === 'FROZEN' || status === 'UTILITY') {
    testId = 'N/A';
  } else if (/data-testid/.test(content)) {
    testId = 'ready';
  }

  // Extract variants from CVA
  const variants = [];
  const variantMatch = content.match(/variants:\s*\{([^}]+)\}/s);
  if (variantMatch) {
    const variantKeys = variantMatch[1].match(/(\w+):\s*\{/g);
    if (variantKeys) {
      variantKeys.forEach(v => {
        const key = v.replace(/:\s*\{/, '').trim();
        if (!['defaultVariants', 'compoundVariants'].includes(key)) {
          variants.push(key);
        }
      });
    }
  }

  return { name, type, status, testId, variants };
}

// ════════════════════════════════════════════════════════════════════════════
// File Scanning
// ════════════════════════════════════════════════════════════════════════════

/**
 * Get all component files from configured directories
 */
function scanComponentFiles() {
  const components = new Map();

  for (const { dir, prefix } of CONFIG.componentDirs) {
    if (!existsSync(dir)) continue;

    const files = readdirSync(dir).filter(f => {
      if (!f.endsWith('.tsx')) return false;
      return !CONFIG.excludePatterns.some(p => p.test(f));
    });

    for (const file of files) {
      const content = readFileSync(join(dir, file), 'utf8');
      const meta = extractMetadata(content, file);
      components.set(meta.name, {
        ...meta,
        path: prefix + file,
      });
    }
  }

  return components;
}

// ════════════════════════════════════════════════════════════════════════════
// Drift Detection
// ════════════════════════════════════════════════════════════════════════════

/**
 * Compare scanned files against registry
 */
function detectDrift() {
  const context = JSON.parse(readFileSync(CONFIG.contextPath, 'utf8'));
  const registry = context.components?.registry?.ui || {};
  const registeredNames = new Set(Object.keys(registry));

  const scannedComponents = scanComponentFiles();
  const scannedNames = new Set(scannedComponents.keys());

  // Find missing (in files but not in registry)
  const missing = [];
  for (const [name, meta] of scannedComponents) {
    if (!registeredNames.has(name)) {
      missing.push({ name, ...meta });
    }
  }

  // Find orphaned (in registry but not in files)
  const orphaned = [];
  for (const name of registeredNames) {
    if (!scannedNames.has(name)) {
      orphaned.push(name);
    }
  }

  return {
    missing,
    orphaned,
    registeredCount: registeredNames.size,
    scannedCount: scannedNames.size,
    context,
  };
}

// ════════════════════════════════════════════════════════════════════════════
// Auto-Sync
// ════════════════════════════════════════════════════════════════════════════

/**
 * Add missing components to registry
 */
function syncMissing(drift) {
  const { missing, context } = drift;

  if (missing.length === 0) {
    log.success('No missing components to sync');
    return;
  }

  for (const comp of missing) {
    const entry = {
      path: comp.path,
      type: comp.type,
      status: comp.status,
      testId: comp.testId,
    };
    if (comp.variants.length > 0) {
      entry.variants = comp.variants;
    }
    context.components.registry.ui[comp.name] = entry;
    log.success(`Added: ${comp.name} (${comp.type}, ${comp.status})`);
  }

  // Update metadata
  context.meta.lastUpdated = new Date().toISOString().split('T')[0];

  // Update counts
  const ui = context.components.registry.ui;
  const statusCounts = { STABILIZED: 0, FROZEN: 0, TODO: 0, UTILITY: 0, DOMAIN: 0, PAGE: 0, ORGANISM: 0 };
  const testIdCounts = { ready: 0, todo: 0, na: 0, 'data-slot': 0 };

  for (const comp of Object.values(ui)) {
    statusCounts[comp.status] = (statusCounts[comp.status] || 0) + 1;
    if (comp.testId === 'ready') testIdCounts.ready++;
    else if (comp.testId === 'TODO') testIdCounts.todo++;
    else if (comp.testId === 'N/A') testIdCounts.na++;
    else if (comp.testId === 'data-slot') testIdCounts['data-slot']++;
  }

  const total = Object.keys(ui).length;
  context.components.stabilization.progress = {
    stabilized: statusCounts.STABILIZED,
    frozen: statusCounts.FROZEN,
    todo: statusCounts.TODO,
    utility: statusCounts.UTILITY,
    total,
    percentage: Math.round((statusCounts.STABILIZED / total) * 100) + '%',
  };
  context.components.registry.testIdProgress = testIdCounts;

  // Write back
  writeFileSync(CONFIG.contextPath, JSON.stringify(context, null, 2) + '\n');
  log.success(`Synced ${missing.length} components to registry`);
}

// ════════════════════════════════════════════════════════════════════════════
// Main
// ════════════════════════════════════════════════════════════════════════════

function main() {
  const autoSync = process.argv.includes('--sync') || process.argv.includes('-s');

  console.log(`${C.bold}MCP Drift Detector${C.reset}`);
  console.log(LINE);

  const drift = detectDrift();

  log.header('Summary');
  log.info(`Scanned: ${drift.scannedCount} component files`);
  log.info(`Registered: ${drift.registeredCount} in MCP registry`);

  if (drift.missing.length === 0 && drift.orphaned.length === 0) {
    log.success('No drift detected - MCP is in sync!');
    process.exit(0);
  }

  if (drift.missing.length > 0) {
    log.header(`Missing (${drift.missing.length} files not in registry)`);
    for (const comp of drift.missing) {
      log.warn(`${comp.name} → ${comp.type}, ${comp.status}`);
    }
  }

  if (drift.orphaned.length > 0) {
    log.header(`Orphaned (${drift.orphaned.length} in registry but no file)`);
    for (const name of drift.orphaned) {
      log.error(`${name} → remove from registry?`);
    }
  }

  console.log(LINE);

  if (autoSync) {
    log.header('Auto-Syncing...');
    syncMissing(drift);
    log.dim('Note: Orphaned entries must be removed manually');
  } else {
    log.dim('Run with --sync to auto-add missing components');
  }

  // Exit with error code if drift detected (useful for CI)
  process.exit(drift.missing.length > 0 || drift.orphaned.length > 0 ? 1 : 0);
}

main();
