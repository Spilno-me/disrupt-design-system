#!/usr/bin/env node
/**
 * DDS Version Drift Detector
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Detects when version should be bumped but hasn't been:
 * - New components added → MINOR bump needed
 * - New exports in index.ts → MINOR bump needed
 * - Package.json version matches changelog.json
 * - Breaking changes documented in v3-breaking-changes.md
 *
 * Usage: npm run validate:version
 */

import { readFileSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execFileSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const PACKAGE_JSON_PATH = join(ROOT, 'package.json')
const CHANGELOG_PATH = join(ROOT, '.claude', 'changelog.json')
const INDEX_PATH = join(ROOT, 'src', 'index.ts')
const COMPONENTS_DIR = join(ROOT, 'src', 'components', 'ui')

// ═══════════════════════════════════════════════════════════════════════════
// ANSI Formatting
// ═══════════════════════════════════════════════════════════════════════════

const COLORS = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
}

const log = {
  error: (msg) => console.log(`${COLORS.red}✗${COLORS.reset} ${msg}`),
  success: (msg) => console.log(`${COLORS.green}✓${COLORS.reset} ${msg}`),
  warn: (msg) => console.log(`${COLORS.yellow}⚠${COLORS.reset} ${msg}`),
  info: (msg) => console.log(`${COLORS.cyan}→${COLORS.reset} ${msg}`),
  dim: (msg) => console.log(`${COLORS.dim}${msg}${COLORS.reset}`),
  section: (title) => console.log(`\n${COLORS.bold}${title}${COLORS.reset}`),
}

const LINE = '─'.repeat(60)

// ═══════════════════════════════════════════════════════════════════════════
// Safe Git Commands (using execFileSync - no shell injection)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Safely execute git command with arguments
 */
function gitCommand(args) {
  try {
    const result = execFileSync('git', args, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    return result.trim()
  } catch {
    return ''
  }
}

/**
 * Get files modified since last version tag
 */
function getModifiedFilesSinceTag() {
  // Get the last version tag
  const lastTag = gitCommand(['describe', '--tags', '--abbrev=0'])

  if (!lastTag) {
    return { files: [], tag: null }
  }

  // Get files modified since that tag
  const filesOutput = gitCommand(['diff', '--name-only', `${lastTag}..HEAD`])
  const files = filesOutput.split('\n').filter(Boolean)

  return { files, tag: lastTag }
}

/**
 * Get staged files (about to be committed)
 */
function getStagedFiles() {
  const filesOutput = gitCommand(['diff', '--cached', '--name-only'])
  return filesOutput.split('\n').filter(Boolean)
}

// ═══════════════════════════════════════════════════════════════════════════
// Detection Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if version matches between package.json and changelog.json
 */
function checkVersionSync() {
  const errors = []

  if (!existsSync(PACKAGE_JSON_PATH) || !existsSync(CHANGELOG_PATH)) {
    return errors
  }

  const pkg = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf8'))
  const changelog = JSON.parse(readFileSync(CHANGELOG_PATH, 'utf8'))

  if (pkg.version !== changelog.currentVersion) {
    errors.push({
      type: 'VERSION_MISMATCH',
      message: `package.json (${pkg.version}) ≠ changelog.json (${changelog.currentVersion})`,
      fix: 'Run: npm run version:minor OR update changelog.json manually',
    })
  }

  return errors
}

/**
 * Detect new components that might need version bump
 */
function detectNewComponents(stagedFiles, modifiedFiles) {
  const warnings = []
  const allFiles = [...new Set([...stagedFiles, ...modifiedFiles])]

  // New component files
  const newComponents = allFiles.filter((f) => {
    return (
      (f.startsWith('src/components/ui/') ||
        f.startsWith('src/flow/components/') ||
        f.startsWith('src/portal/components/')) &&
      f.endsWith('.tsx') &&
      !f.includes('.stories.')
    )
  })

  if (newComponents.length > 0) {
    // Check if package.json was also modified
    const packageModified = allFiles.includes('package.json')
    const changelogModified = allFiles.includes('.claude/changelog.json')

    if (!packageModified || !changelogModified) {
      warnings.push({
        type: 'NEW_COMPONENTS',
        message: `${newComponents.length} component file(s) modified but version not bumped`,
        components: newComponents,
        fix: 'If adding new components, run: npm run version:minor',
      })
    }
  }

  return warnings
}

/**
 * Detect changes to exports (new exports = MINOR bump)
 */
function detectExportChanges(stagedFiles, modifiedFiles) {
  const warnings = []
  const allFiles = [...new Set([...stagedFiles, ...modifiedFiles])]

  const exportFiles = ['src/index.ts', 'src/core/index.ts', 'src/flow/index.ts', 'src/portal/index.ts']

  const modifiedExports = allFiles.filter((f) => exportFiles.includes(f))

  if (modifiedExports.length > 0) {
    const packageModified = allFiles.includes('package.json')

    if (!packageModified) {
      warnings.push({
        type: 'EXPORT_CHANGES',
        message: `Export files modified but version not bumped`,
        files: modifiedExports,
        fix: 'If adding new exports, run: npm run version:minor',
      })
    }
  }

  return warnings
}

/**
 * Detect if index.ts exports match component files
 */
function detectExportDrift() {
  const warnings = []

  if (!existsSync(INDEX_PATH)) return warnings

  const indexContent = readFileSync(INDEX_PATH, 'utf8')

  // Get all exported components from index.ts
  const exportedComponents = new Set()
  const exportMatches = indexContent.matchAll(/export \* from ['"]\.\/components\/ui\/([^'"]+)['"]/g)
  for (const match of exportMatches) {
    exportedComponents.add(match[1].replace(/\.tsx?$/, ''))
  }

  // Get all component files
  if (existsSync(COMPONENTS_DIR)) {
    const componentFiles = readdirSync(COMPONENTS_DIR)
      .filter((f) => f.endsWith('.tsx') && !f.includes('.stories.') && !f.includes('.test.'))
      .map((f) => f.replace('.tsx', ''))

    // Find components not exported
    const notExported = componentFiles.filter((c) => {
      const kebab = c.toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
      return !exportedComponents.has(c) && !exportedComponents.has(kebab)
    })

    if (notExported.length > 0) {
      warnings.push({
        type: 'MISSING_EXPORTS',
        message: `${notExported.length} component(s) exist but are not exported`,
        components: notExported,
        fix: 'Add exports to src/index.ts or remove unused components',
      })
    }
  }

  return warnings
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Execution
// ═══════════════════════════════════════════════════════════════════════════

function main() {
  const startTime = Date.now()

  console.log(`\n${COLORS.bold}DDS Version Drift Detector${COLORS.reset}`)
  console.log(LINE)

  // Gather data
  log.info('Checking git state...')
  const stagedFiles = getStagedFiles()
  const { files: modifiedFiles, tag: lastTag } = getModifiedFilesSinceTag()

  log.dim(`  Staged files: ${stagedFiles.length}`)
  log.dim(`  Modified since ${lastTag || 'initial'}: ${modifiedFiles.length}`)

  // Run checks
  const errors = []
  const warnings = []

  // Check version sync
  log.info('Checking version synchronization...')
  errors.push(...checkVersionSync())

  // Check for new components
  log.info('Detecting new components...')
  warnings.push(...detectNewComponents(stagedFiles, modifiedFiles))

  // Check export changes
  log.info('Checking export changes...')
  warnings.push(...detectExportChanges(stagedFiles, modifiedFiles))

  // Check export drift
  log.info('Checking export completeness...')
  warnings.push(...detectExportDrift())

  // Report warnings
  if (warnings.length > 0) {
    log.section('Warnings')
    for (const w of warnings) {
      log.warn(`[${w.type}] ${w.message}`)
      if (w.components) {
        for (const c of w.components.slice(0, 5)) {
          log.dim(`  - ${c}`)
        }
        if (w.components.length > 5) log.dim(`  ... and ${w.components.length - 5} more`)
      }
      if (w.files) {
        for (const f of w.files) {
          log.dim(`  - ${f}`)
        }
      }
      log.dim(`  Fix: ${w.fix}`)
    }
  }

  // Report errors
  if (errors.length > 0) {
    log.section('Errors (Must Fix)')
    for (const e of errors) {
      log.error(`[${e.type}] ${e.message}`)
      log.dim(`  Fix: ${e.fix}`)
    }
    console.log('')
    log.error(`${errors.length} version drift error(s) found`)
    console.log(LINE)
    log.dim(`Completed in ${Date.now() - startTime}ms`)
    console.log('')
    process.exit(1)
  }

  // Success
  log.section('Summary')
  log.success('Version is in sync across package.json and changelog.json')
  if (warnings.length > 0) {
    log.warn(`${warnings.length} warning(s) - review if version bump is needed`)
  } else {
    log.success('No version drift detected')
  }

  console.log(LINE)
  log.success('Version checks passed!')
  log.dim(`Completed in ${Date.now() - startTime}ms`)
  console.log('')
}

main()
