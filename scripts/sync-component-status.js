#!/usr/bin/env node
/**
 * Syncs component status from JSDoc annotations to agent-context.json
 *
 * Usage: npm run sync-components
 *
 * Scans src/components/ui/*.tsx for JSDoc patterns:
 *   - ATOM / MOLECULE / UTILITY → type
 *   - @status STABILIZED|TODO|FROZEN → status
 *   - data-testid patterns → testId readiness
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname, basename } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const UI_DIR = join(ROOT, 'src', 'components', 'ui')
const CONTEXT_PATH = join(ROOT, '.claude', 'agent-context.json')

// ANSI colors
const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const CYAN = '\x1b[36m'
const RESET = '\x1b[0m'

function log(color, symbol, message) {
  console.log(`${color}${symbol}${RESET} ${message}`)
}

/**
 * Extract component metadata from file content
 */
function extractMetadata(content, filename) {
  const meta = {
    type: null,
    status: null,
    testIdReady: false,
  }

  // Extract type (ATOM/MOLECULE/UTILITY)
  if (/\bATOM\b/.test(content)) {
    meta.type = 'ATOM'
  } else if (/\bMOLECULE\b/.test(content)) {
    meta.type = 'MOLECULE'
  } else if (/\bUTILITY\b/.test(content)) {
    meta.type = 'UTILITY'
  }

  // Extract status from @status tag or FROZEN/STABILIZED comments
  const statusMatch = content.match(/@status\s+(STABILIZED|TODO|FROZEN|UTILITY|DOMAIN)/i)
  if (statusMatch) {
    meta.status = statusMatch[1].toUpperCase()
  } else if (/FROZEN/.test(content)) {
    meta.status = 'FROZEN'
  }

  // Check testId readiness
  // For ATOM: has {...props} spread and data-testid in JSDoc
  // For MOLECULE: has auto-generation pattern
  if (meta.type === 'ATOM') {
    const hasPropsSpread = /\{\.\.\.props\}/.test(content)
    const hasTestIdDoc = /data-testid/.test(content)
    meta.testIdReady = hasPropsSpread && hasTestIdDoc
  } else if (meta.type === 'MOLECULE') {
    // Check for testId prop or auto-generation
    const hasTestIdProp = /testId\??\s*:/.test(content)
    const hasAutoGen = /data-testid=\{.*\$\{/.test(content) || /data-testid=\{testId/.test(content)
    meta.testIdReady = hasTestIdProp || hasAutoGen || /data-testid/.test(content)
  }

  return meta
}

/**
 * Get component name from filename
 */
function getComponentName(filename) {
  // Remove extension and handle kebab-case
  const base = basename(filename, '.tsx')
  // Convert kebab-case to PascalCase
  return base.split('-').map(part =>
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join('')
}

function main() {
  console.log('\nSyncing component status from JSDoc...\n')

  // Read current context
  let context
  try {
    context = JSON.parse(readFileSync(CONTEXT_PATH, 'utf8'))
  } catch (e) {
    log(RED, '✗', `Failed to read agent-context.json: ${e.message}`)
    process.exit(1)
  }

  // Get all .tsx files in ui directory
  const files = readdirSync(UI_DIR).filter(f => f.endsWith('.tsx') && !f.includes('.stories.'))

  const updates = []
  const registry = context.components?.registry?.ui || {}

  for (const file of files) {
    const filepath = join(UI_DIR, file)
    const content = readFileSync(filepath, 'utf8')
    const componentName = getComponentName(file)

    const meta = extractMetadata(content, file)

    // Check if component exists in registry
    const existing = registry[componentName]

    if (!existing) {
      log(YELLOW, '?', `${componentName} not in registry (${file})`)
      continue
    }

    // Check for differences
    const changes = []

    if (meta.type && existing.type !== meta.type) {
      changes.push(`type: ${existing.type || 'none'} → ${meta.type}`)
      existing.type = meta.type
    }

    if (meta.status && existing.status !== meta.status) {
      changes.push(`status: ${existing.status || 'none'} → ${meta.status}`)
      existing.status = meta.status
    }

    const expectedTestId = meta.testIdReady ? 'ready' : 'TODO'
    if (existing.testId !== 'N/A' && existing.testId !== expectedTestId) {
      // Only update if not N/A (frozen/utility)
      if (existing.status !== 'FROZEN' && existing.status !== 'UTILITY') {
        changes.push(`testId: ${existing.testId} → ${expectedTestId}`)
        existing.testId = expectedTestId
      }
    }

    if (changes.length > 0) {
      updates.push({ name: componentName, changes })
      log(CYAN, '↻', `${componentName}: ${changes.join(', ')}`)
    }
  }

  if (updates.length === 0) {
    log(GREEN, '✓', 'All components are in sync')
    console.log('')
    return
  }

  // Update progress counts
  const uiComponents = Object.values(registry)
  const testIdProgress = {
    ready: uiComponents.filter(c => c.testId === 'ready').length,
    todo: uiComponents.filter(c => c.testId === 'TODO').length,
    na: uiComponents.filter(c => c.testId === 'N/A').length,
  }
  context.components.registry.testIdProgress = testIdProgress

  // Write updated context
  try {
    writeFileSync(CONTEXT_PATH, JSON.stringify(context, null, 2) + '\n')
    console.log('')
    log(GREEN, '✓', `Updated ${updates.length} component(s) in agent-context.json`)
    log(GREEN, '✓', `testId progress: ${testIdProgress.ready} ready, ${testIdProgress.todo} TODO, ${testIdProgress.na} N/A`)
    console.log('')
  } catch (e) {
    log(RED, '✗', `Failed to write agent-context.json: ${e.message}`)
    process.exit(1)
  }
}

main()
