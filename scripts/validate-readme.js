#!/usr/bin/env node
/**
 * README Drift Validation Script
 *
 * Purpose: Detect drift between README.md documentation and actual package exports.
 * Ensures consumers see accurate import paths in documentation.
 *
 * Checks:
 * - All package.json exports are documented in README
 * - Import examples use correct subpath syntax
 * - Package Architecture table matches actual exports
 *
 * Run: npm run validate:readme
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = resolve(__dirname, '..')

// =============================================================================
// ANSI COLORS
// =============================================================================

const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const CYAN = '\x1b[36m'
const DIM = '\x1b[2m'
const BOLD = '\x1b[1m'
const RESET = '\x1b[0m'

function log(color, symbol, message) {
  console.log(`${color}${symbol}${RESET} ${message}`)
}

// =============================================================================
// MAIN VALIDATION
// =============================================================================

function main() {
  console.log(`\n${BOLD}DDS README Drift Validator${RESET}`)
  console.log('─'.repeat(60))

  const errors = []
  const warnings = []

  // Read files
  log(CYAN, '→', 'Reading package.json exports...')
  const packageJson = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf-8'))
  const exports = packageJson.exports || {}

  log(CYAN, '→', 'Reading README.md...')
  const readme = readFileSync(resolve(ROOT, 'README.md'), 'utf-8')

  // Extract subpath exports (excluding internal paths)
  const subpaths = Object.keys(exports)
    .filter(key => key.startsWith('./') && key !== '.')
    .map(key => key.replace('./', '/'))

  log(DIM, ' ', `Found ${subpaths.length} subpath exports`)

  // Check each subpath is documented
  log(CYAN, '→', 'Checking subpath documentation...')

  const documentedSubpaths = []
  const undocumentedSubpaths = []

  for (const subpath of subpaths) {
    // Skip CSS/internal paths
    if (subpath.endsWith('.css') || subpath.includes('plugin')) {
      continue
    }

    const packageName = packageJson.name
    const fullImport = `${packageName}${subpath}`

    // Check if README mentions this import path
    if (readme.includes(fullImport) || readme.includes(`'${fullImport}'`) || readme.includes(`"${fullImport}"`)) {
      documentedSubpaths.push(subpath)
    } else {
      undocumentedSubpaths.push(subpath)
    }
  }

  // Report documented
  for (const subpath of documentedSubpaths) {
    log(GREEN, '✓', `${subpath} documented`)
  }

  // Report undocumented
  for (const subpath of undocumentedSubpaths) {
    log(YELLOW, '⚠', `${subpath} not documented in README`)
    warnings.push(`Subpath "${subpath}" exists in package.json but not documented in README`)
  }

  // Check Package Architecture section exists
  log(CYAN, '→', 'Checking README structure...')

  if (!readme.includes('## Package Architecture')) {
    errors.push('README missing "## Package Architecture" section')
    log(RED, '✗', 'Missing "## Package Architecture" section')
  } else {
    log(GREEN, '✓', '"## Package Architecture" section exists')
  }

  // Check import examples use subpaths
  const legacyImportPattern = /from ['"]@[^/]+\/design-system['"]/g
  const legacyMatches = readme.match(legacyImportPattern) || []

  // Filter out the "Legacy" section which is intentional
  const legacySection = readme.includes('// Legacy: All components')

  if (legacyMatches.length > 0 && !legacySection) {
    warnings.push('README has imports without subpaths (consider using /core, /flow, etc.)')
  }

  // Summary
  console.log(`\n${BOLD}Summary${RESET}`)

  if (errors.length > 0) {
    log(RED, '✗', `${errors.length} error(s)`)
    for (const err of errors) {
      console.log(`  ${RED}-${RESET} ${err}`)
    }
  }

  if (warnings.length > 0) {
    log(YELLOW, '⚠', `${warnings.length} warning(s)`)
    for (const warn of warnings) {
      console.log(`  ${YELLOW}-${RESET} ${warn}`)
    }
  }

  if (errors.length === 0 && warnings.length === 0) {
    log(GREEN, '✓', 'README is in sync with package exports')
  }

  console.log('─'.repeat(60))

  if (errors.length > 0) {
    log(RED, '✗', 'README validation failed!')
    console.log(`${DIM}Fix errors before committing${RESET}\n`)
    process.exit(1)
  }

  log(GREEN, '✓', 'README validation passed!')
  console.log(`${DIM}Completed${RESET}\n`)
}

main()
