#!/usr/bin/env node
/**
 * Validates agent-context.json against its schema
 *
 * Usage: npm run validate-context
 *
 * This script performs basic validation without requiring ajv dependency.
 * For full JSON Schema validation, install ajv: npm i -D ajv
 */

import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const CONTEXT_PATH = join(ROOT, '.claude', 'agent-context.json')
const SCHEMA_PATH = join(ROOT, '.claude', 'agent-context.schema.json')
const TAILWIND_PRESET_PATH = join(ROOT, 'tailwind-preset.js')

// ANSI colors
const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const RESET = '\x1b[0m'

function log(color, symbol, message) {
  console.log(`${color}${symbol}${RESET} ${message}`)
}

/**
 * Extract valid Tailwind classes from tailwind-preset.js safelist
 */
function extractValidTailwindClasses() {
  if (!existsSync(TAILWIND_PRESET_PATH)) {
    return null // Can't validate without preset
  }

  const content = readFileSync(TAILWIND_PRESET_PATH, 'utf8')

  // Extract SAFELIST array
  const safelistMatch = content.match(/const SAFELIST\s*=\s*\[([\s\S]*?)\]/m)
  if (!safelistMatch) return null

  // Extract class names from the array
  const classes = new Set()
  const classMatches = safelistMatch[1].matchAll(/'([^']+)'/g)
  for (const match of classMatches) {
    classes.add(match[1])
  }

  return classes
}

function validateBasicStructure(context, schema) {
  const errors = []

  // Check required top-level properties
  const required = schema.required || []
  for (const prop of required) {
    if (!(prop in context)) {
      errors.push(`Missing required property: ${prop}`)
    }
  }

  // Validate version format
  if (context.version && !/^\d+\.\d+\.\d+$/.test(context.version)) {
    errors.push(`Invalid version format: ${context.version} (expected semver)`)
  }

  // Validate component statuses and testId
  const validStatuses = ['STABILIZED', 'FROZEN', 'TODO', 'UTILITY', 'DOMAIN']
  const validTypes = ['ATOM', 'MOLECULE', 'UTILITY']
  const validTestId = ['ready', 'TODO', 'N/A']
  const registry = context.components?.registry?.ui || {}

  for (const [name, def] of Object.entries(registry)) {
    if (def.status && !validStatuses.includes(def.status)) {
      errors.push(`Invalid status "${def.status}" for component ${name}`)
    }
    if (!def.path) {
      errors.push(`Missing path for component ${name}`)
    }
    if (!def.type) {
      errors.push(`Missing type (ATOM/MOLECULE/UTILITY) for component ${name}`)
    } else if (!validTypes.includes(def.type)) {
      errors.push(`Invalid type "${def.type}" for component ${name}`)
    }
    if (!def.testId) {
      errors.push(`Missing testId status for component ${name}`)
    } else if (!validTestId.includes(def.testId)) {
      errors.push(`Invalid testId "${def.testId}" for component ${name}`)
    }
  }

  // Validate color hex values and Tailwind classes
  const validTailwindClasses = extractValidTailwindClasses()
  const colorGroups = ['brand', 'semantic', 'surfaces', 'text', 'border']
  const invalidClasses = []

  for (const group of colorGroups) {
    const colors = context.colors?.[group] || {}
    for (const [name, def] of Object.entries(colors)) {
      if (def.hex && !/^#[0-9A-Fa-f]{6}$/.test(def.hex)) {
        errors.push(`Invalid hex color "${def.hex}" in colors.${group}.${name}`)
      }

      // Validate Tailwind classes if we have the safelist
      if (validTailwindClasses && def.class) {
        const classes = def.class.split(' ')
        for (const cls of classes) {
          if (!validTailwindClasses.has(cls)) {
            invalidClasses.push(`${cls} (in colors.${group}.${name})`)
          }
        }
      }
    }
  }

  // Report invalid Tailwind classes as warnings (not errors)
  if (invalidClasses.length > 0) {
    console.log(`${YELLOW}⚠${RESET} Tailwind classes not in safelist (may still work):`)
    invalidClasses.forEach(cls => console.log(`    ${cls}`))
    console.log('')
  }

  // Validate progress numbers
  const progress = context.components?.stabilization?.progress
  if (progress) {
    if (typeof progress.stabilized !== 'number' || progress.stabilized < 0) {
      errors.push('Invalid progress.stabilized value')
    }
    if (typeof progress.total !== 'number' || progress.total < 0) {
      errors.push('Invalid progress.total value')
    }
    if (progress.stabilized > progress.total) {
      errors.push('progress.stabilized cannot exceed progress.total')
    }
  }

  return errors
}

function main() {
  console.log('\nValidating agent-context.json...\n')

  // Check files exist
  if (!existsSync(CONTEXT_PATH)) {
    log(RED, '✗', `Context file not found: ${CONTEXT_PATH}`)
    process.exit(1)
  }

  if (!existsSync(SCHEMA_PATH)) {
    log(YELLOW, '⚠', `Schema file not found: ${SCHEMA_PATH}`)
    log(YELLOW, '⚠', 'Running basic validation only...')
  }

  // Parse JSON files
  let context, schema
  try {
    context = JSON.parse(readFileSync(CONTEXT_PATH, 'utf8'))
  } catch (e) {
    log(RED, '✗', `Failed to parse context JSON: ${e.message}`)
    process.exit(1)
  }

  try {
    schema = JSON.parse(readFileSync(SCHEMA_PATH, 'utf8'))
  } catch (e) {
    log(YELLOW, '⚠', `Failed to parse schema JSON: ${e.message}`)
    schema = { required: ['version', 'meta', 'criticalRules', 'colors', 'shadows', 'components'] }
  }

  // Run validation
  const errors = validateBasicStructure(context, schema)

  if (errors.length > 0) {
    console.log('Validation errors:')
    errors.forEach(err => log(RED, '  ✗', err))
    console.log('')
    log(RED, '✗', `${errors.length} error(s) found`)
    process.exit(1)
  }

  // Summary
  const componentCount = Object.keys(context.components?.registry?.ui || {}).length
  const stabilized = context.components?.stabilization?.progress?.stabilized || 0
  const total = context.components?.stabilization?.progress?.total || 0
  const testIdProgress = context.components?.registry?.testIdProgress || {}

  log(GREEN, '✓', `Version: ${context.version}`)
  log(GREEN, '✓', `Components: ${componentCount} registered`)
  log(GREEN, '✓', `Stabilization: ${stabilized}/${total} (${context.components?.stabilization?.progress?.percentage || '0%'})`)
  log(GREEN, '✓', `testId coverage: ${testIdProgress.ready || 0} ready, ${testIdProgress.todo || 0} TODO, ${testIdProgress.na || 0} N/A`)
  log(GREEN, '✓', `Colors: ${Object.keys(context.colors || {}).length - 1} groups defined`)
  console.log('')
  log(GREEN, '✓', 'agent-context.json is valid!')
  console.log('')
}

main()
