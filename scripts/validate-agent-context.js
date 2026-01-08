#!/usr/bin/env node
/**
 * DDS Agent Context Validator
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Validates .claude/agent-context.json - the single source of truth for DDS.
 *
 * DESIGN PRINCIPLE: Self-documenting validation
 * - Valid values are read FROM the JSON (testIdLegend, statusLegend)
 * - No hardcoded enums that drift from source
 * - Cross-validates counts (testIdProgress vs actual)
 *
 * Usage: npm run validate-context
 */

import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const CONTEXT_PATH = join(ROOT, '.claude', 'agent-context.json')
const SCHEMA_PATH = join(ROOT, '.claude', 'agent-context.schema.json')
const TAILWIND_PRESET_PATH = join(ROOT, 'tailwind-preset.js')
const COMPONENTS_DIR = join(ROOT, 'src', 'components')

// ═══════════════════════════════════════════════════════════════════════════
// ANSI Formatting
// ═══════════════════════════════════════════════════════════════════════════

const COLORS = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
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
// Validation Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Extract valid Tailwind classes from safelist
 */
function extractValidTailwindClasses() {
  if (!existsSync(TAILWIND_PRESET_PATH)) return null

  const content = readFileSync(TAILWIND_PRESET_PATH, 'utf8')
  const safelistMatch = content.match(/const SAFELIST\s*=\s*\[([\s\S]*?)\]/m)
  if (!safelistMatch) return null

  const classes = new Set()
  const classMatches = safelistMatch[1].matchAll(/'([^']+)'/g)
  for (const match of classMatches) {
    classes.add(match[1])
  }
  return classes
}

/**
 * Validate component registry
 * Key insight: Read valid values FROM the JSON's legends, not hardcoded
 */
function validateComponents(context) {
  const errors = []
  const warnings = []
  const registry = context.components?.registry || {}
  const uiComponents = registry.ui || {}

  // SELF-DOCUMENTING: Extract valid values from the JSON's own legends
  // Legends are at components.registry.statusLegend, not stabilization
  const statusLegend = registry.statusLegend || {}
  const testIdLegend = registry.testIdLegend || {}

  const validStatuses = Object.keys(statusLegend)
  const validTestIds = Object.keys(testIdLegend)
  // Component hierarchy types - from atomic design methodology
  const validTypes = ['ATOM', 'MOLECULE', 'ORGANISM', 'PAGE', 'UTILITY']

  // Track actual counts for cross-validation
  const testIdCounts = { ready: 0, todo: 0, na: 0, 'data-slot': 0 }

  for (const [name, def] of Object.entries(uiComponents)) {
    // Status validation
    if (def.status && validStatuses.length > 0 && !validStatuses.includes(def.status)) {
      errors.push({
        component: name,
        field: 'status',
        value: def.status,
        expected: validStatuses,
      })
    }

    // Type validation
    if (!def.type) {
      errors.push({ component: name, field: 'type', value: 'MISSING', expected: validTypes })
    } else if (!validTypes.includes(def.type)) {
      errors.push({ component: name, field: 'type', value: def.type, expected: validTypes })
    }

    // Path validation
    if (!def.path) {
      errors.push({ component: name, field: 'path', value: 'MISSING', expected: ['relative path'] })
    } else {
      // Verify file exists
      const fullPath = join(COMPONENTS_DIR, def.path)
      if (!existsSync(fullPath)) {
        warnings.push(`${name}: file not found at ${def.path}`)
      }
    }

    // testId validation - use self-documented valid values
    if (!def.testId) {
      errors.push({ component: name, field: 'testId', value: 'MISSING', expected: validTestIds })
    } else if (validTestIds.length > 0 && !validTestIds.includes(def.testId)) {
      errors.push({ component: name, field: 'testId', value: def.testId, expected: validTestIds })
    } else {
      // Count for cross-validation
      const key = def.testId === 'TODO' ? 'todo' : def.testId === 'N/A' ? 'na' : def.testId
      if (key in testIdCounts) testIdCounts[key]++
    }
  }

  // Cross-validate testIdProgress counts
  const declaredProgress = registry.testIdProgress || {}
  const countMismatches = []

  if (declaredProgress.ready !== undefined && declaredProgress.ready !== testIdCounts.ready) {
    countMismatches.push(`testIdProgress.ready: declared ${declaredProgress.ready}, actual ${testIdCounts.ready}`)
  }
  if (declaredProgress.todo !== undefined && declaredProgress.todo !== testIdCounts.todo) {
    countMismatches.push(`testIdProgress.todo: declared ${declaredProgress.todo}, actual ${testIdCounts.todo}`)
  }
  if (declaredProgress.na !== undefined && declaredProgress.na !== testIdCounts.na) {
    countMismatches.push(`testIdProgress.na: declared ${declaredProgress.na}, actual ${testIdCounts.na}`)
  }

  return { errors, warnings, testIdCounts, countMismatches, validStatuses, validTestIds }
}

/**
 * Validate color definitions
 */
function validateColors(context) {
  const errors = []
  const warnings = []
  const validTailwindClasses = extractValidTailwindClasses()
  const colorGroups = ['brand', 'semantic', 'surfaces', 'text', 'border']

  for (const group of colorGroups) {
    const colors = context.colors?.[group] || {}
    for (const [name, def] of Object.entries(colors)) {
      // Hex format validation
      if (def.hex && !/^#[0-9A-Fa-f]{6}$/.test(def.hex)) {
        errors.push(`Invalid hex "${def.hex}" in colors.${group}.${name}`)
      }

      // Tailwind class validation (warnings only)
      if (validTailwindClasses && def.class) {
        const classes = def.class.split(' ')
        for (const cls of classes) {
          if (!validTailwindClasses.has(cls)) {
            warnings.push(`${cls} (in colors.${group}.${name})`)
          }
        }
      }
    }
  }

  return { errors, warnings }
}

/**
 * Validate basic structure
 */
function validateStructure(context, schema) {
  const errors = []

  // Required properties
  const required = schema.required || ['version', 'meta', 'criticalRules', 'colors', 'shadows', 'components']
  for (const prop of required) {
    if (!(prop in context)) {
      errors.push(`Missing required property: ${prop}`)
    }
  }

  // Version format
  if (context.version && !/^\d+\.\d+\.\d+$/.test(context.version)) {
    errors.push(`Invalid version format: ${context.version} (expected semver X.Y.Z)`)
  }

  // Progress numbers
  const progress = context.components?.stabilization?.progress
  if (progress) {
    if (typeof progress.stabilized !== 'number' || progress.stabilized < 0) {
      errors.push('Invalid progress.stabilized value')
    }
    if (typeof progress.total !== 'number' || progress.total < 0) {
      errors.push('Invalid progress.total value')
    }
    if (progress.stabilized > progress.total) {
      errors.push(`progress.stabilized (${progress.stabilized}) exceeds progress.total (${progress.total})`)
    }
  }

  return errors
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Execution
// ═══════════════════════════════════════════════════════════════════════════

function main() {
  const startTime = Date.now()

  console.log(`\n${COLORS.bold}DDS Agent Context Validator${COLORS.reset}`)
  console.log(LINE)

  // ─── File Checks ───────────────────────────────────────────────────────────
  if (!existsSync(CONTEXT_PATH)) {
    log.error(`Context file not found: ${CONTEXT_PATH}`)
    process.exit(1)
  }

  let schema = { required: [] }
  if (existsSync(SCHEMA_PATH)) {
    try {
      schema = JSON.parse(readFileSync(SCHEMA_PATH, 'utf8'))
    } catch (e) {
      log.warn(`Schema parse error: ${e.message}`)
    }
  }

  // ─── Parse Context ─────────────────────────────────────────────────────────
  let context
  try {
    context = JSON.parse(readFileSync(CONTEXT_PATH, 'utf8'))
  } catch (e) {
    log.error(`Failed to parse JSON: ${e.message}`)
    process.exit(1)
  }

  // ─── Run Validations ───────────────────────────────────────────────────────
  const structureErrors = validateStructure(context, schema)
  const componentResult = validateComponents(context)
  const colorResult = validateColors(context)

  // ─── Report Warnings ───────────────────────────────────────────────────────
  const allWarnings = [
    ...componentResult.warnings,
    ...colorResult.warnings,
    ...componentResult.countMismatches,
  ]

  if (allWarnings.length > 0) {
    log.section('Warnings')
    allWarnings.forEach((w) => log.warn(w))
  }

  // ─── Report Errors ─────────────────────────────────────────────────────────
  const allErrors = [
    ...structureErrors,
    ...colorResult.errors,
    ...componentResult.errors.map((e) => {
      const expected = Array.isArray(e.expected) ? e.expected.join(' | ') : e.expected
      return `${e.component}.${e.field}: "${e.value}" (expected: ${expected})`
    }),
  ]

  if (allErrors.length > 0) {
    log.section('Errors')
    allErrors.forEach((e) => log.error(e))
    console.log('')
    log.error(`${allErrors.length} error(s) found`)
    console.log(LINE)
    log.dim(`Completed in ${Date.now() - startTime}ms`)
    console.log('')
    process.exit(1)
  }

  // ─── Success Summary ───────────────────────────────────────────────────────
  log.section('Summary')

  const componentCount = Object.keys(context.components?.registry?.ui || {}).length
  const stabilized = context.components?.stabilization?.progress?.stabilized || 0
  const total = context.components?.stabilization?.progress?.total || 0
  const percentage = context.components?.stabilization?.progress?.percentage || '0%'
  const { testIdCounts, validStatuses, validTestIds } = componentResult

  log.success(`Version: ${context.version}`)
  log.success(`Components: ${componentCount} registered`)
  log.success(`Stabilization: ${stabilized}/${total} (${percentage})`)
  log.success(`testId: ${testIdCounts.ready} ready, ${testIdCounts['data-slot']} data-slot, ${testIdCounts.todo} TODO, ${testIdCounts.na} N/A`)
  log.success(`Colors: ${Object.keys(context.colors || {}).length} groups defined`)

  log.dim(`\nValid statuses: ${validStatuses.join(', ')}`)
  log.dim(`Valid testIds: ${validTestIds.join(', ')}`)

  console.log(LINE)
  log.success('agent-context.json is valid!')
  log.dim(`Completed in ${Date.now() - startTime}ms`)
  console.log('')
}

main()
