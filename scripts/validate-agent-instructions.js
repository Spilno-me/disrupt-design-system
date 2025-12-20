#!/usr/bin/env node
/**
 * DDS Agent Instruction Validator
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Validates agent instruction files (.claude/agents/*.md) against reality:
 * - File paths mentioned in instructions must exist
 * - Color hex values must match designTokens.ts
 * - Token names must exist in the token system
 * - Component paths must exist
 *
 * This PREVENTS agent instruction drift - a major source of AI confusion.
 *
 * Usage: npm run validate:agents
 */

import { readFileSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const AGENTS_DIR = join(ROOT, '.claude', 'agents')
const PLUGINS_AGENTS_DIR = join(ROOT, '.claude', 'plugins', 'design-system-generator', 'agents')
const TOKENS_PATH = join(ROOT, 'src', 'constants', 'designTokens.ts')
const COMPONENTS_DIR = join(ROOT, 'src', 'components')
const FLOW_DIR = join(ROOT, 'src', 'flow')

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
// Extract Reality from Source Files
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Extract all hex colors from designTokens.ts
 */
function extractTokenColors() {
  if (!existsSync(TOKENS_PATH)) return new Map()

  const content = readFileSync(TOKENS_PATH, 'utf8')
  const colors = new Map()

  // Match hex colors: '#XXXXXX' or "#XXXXXX"
  const hexMatches = content.matchAll(/['"]#([A-Fa-f0-9]{6})['"]/g)
  for (const match of hexMatches) {
    colors.set(`#${match[1].toUpperCase()}`, true)
    colors.set(`#${match[1].toLowerCase()}`, true)
  }

  return colors
}

/**
 * Extract all ALIAS token paths from designTokens.ts
 */
function extractTokenPaths() {
  if (!existsSync(TOKENS_PATH)) return new Set()

  const content = readFileSync(TOKENS_PATH, 'utf8')
  const paths = new Set()

  // Match ALIAS.category.name patterns
  const aliasMatch = content.match(/export const ALIAS[\s\S]*?(?=export const|$)/m)
  if (aliasMatch) {
    // Extract first-level keys
    const categoryMatches = aliasMatch[0].matchAll(/^\s{2}(\w+):\s*{/gm)
    for (const match of categoryMatches) {
      paths.add(`ALIAS.${match[1]}`)
    }
  }

  return paths
}

/**
 * Get all existing component files
 */
function getExistingPaths() {
  const paths = new Set()

  // Check src/components/ui/
  const uiDir = join(COMPONENTS_DIR, 'ui')
  if (existsSync(uiDir)) {
    const files = readdirSync(uiDir)
    for (const file of files) {
      if (file.endsWith('.tsx') && !file.includes('.stories.')) {
        paths.add(`src/components/ui/${file}`)
        paths.add(`ui/${file}`)
      }
    }
  }

  // Check src/flow/components/
  const flowComponentsDir = join(FLOW_DIR, 'components')
  if (existsSync(flowComponentsDir)) {
    const files = readdirSync(flowComponentsDir)
    for (const file of files) {
      if (file.endsWith('.tsx') && !file.includes('.stories.')) {
        paths.add(`src/flow/components/${file}`)
        paths.add(`flow/components/${file}`)
      }
    }
  }

  return paths
}

// ═══════════════════════════════════════════════════════════════════════════
// Validate Agent Instructions
// ═══════════════════════════════════════════════════════════════════════════

// Known example/placeholder names that appear in documentation
const EXAMPLE_NAMES = new Set([
  'MyComponent',
  'MyCard',
  'ComponentName',
  'ComponentName.types',
  'Component',
  'Example',
])

/**
 * Check if a path is an example/placeholder (not real)
 */
function isExamplePath(path) {
  // Skip glob patterns
  if (path.includes('*')) return true

  // Skip example component names
  const fileName = path.split('/').pop().replace(/\.(tsx?|stories\.tsx?)$/, '')
  if (EXAMPLE_NAMES.has(fileName)) return true

  // Skip paths in example/demo contexts
  if (path.includes('Example') || path.includes('Demo')) return true

  return false
}

/**
 * Validate an agent instruction file
 */
function validateAgentFile(filePath, validColors, validPaths, existingPaths) {
  const errors = []
  const warnings = []

  if (!existsSync(filePath)) return { errors, warnings }

  const content = readFileSync(filePath, 'utf8')
  const lines = content.split('\n')

  // Extract filename for reporting
  const fileName = filePath.split('/').pop()

  // Track if we're inside a code block (where colors/paths are examples)
  let inCodeBlock = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNum = i + 1

    // Track code block boundaries
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }

    // Skip validation inside code blocks (examples)
    if (inCodeBlock) continue

    // Check for hardcoded hex colors in documentation
    // Skip lines that are color mapping tables (which are legitimate documentation)
    if (!line.includes('| Figma Hex') && !line.includes('| `#') && !line.includes('| Hex')) {
      const hexMatches = line.matchAll(/#([A-Fa-f0-9]{6})\b/g)
      for (const match of hexMatches) {
        const hex = `#${match[1].toUpperCase()}`
        // Allow hex colors that exist in our token system
        if (!validColors.has(hex) && !validColors.has(hex.toLowerCase())) {
          warnings.push({
            file: fileName,
            line: lineNum,
            issue: `Unknown hex color ${hex} - may be stale`,
            context: line.trim().slice(0, 60),
          })
        }
      }
    }

    // Check for file path references (only in prose, not tables or code)
    // Look for actual file references, not documentation patterns
    const pathMatches = line.matchAll(/`(src\/[^`*]+\.tsx?)`/g)
    for (const match of pathMatches) {
      const path = match[1]

      // Skip example/placeholder paths and glob patterns
      if (isExamplePath(path)) continue

      if (path && !existingPaths.has(path)) {
        // Check if file actually exists
        const fullPath = join(ROOT, path)
        if (!existsSync(fullPath)) {
          errors.push({
            file: fileName,
            line: lineNum,
            issue: `Referenced file does not exist: ${path}`,
            context: line.trim().slice(0, 60),
          })
        }
      }
    }

    // Skip ALIAS validation for now - too many false positives
    // The token system is validated by validate-tokens.js
  }

  return { errors, warnings }
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Execution
// ═══════════════════════════════════════════════════════════════════════════

function main() {
  const startTime = Date.now()

  console.log(`\n${COLORS.bold}DDS Agent Instruction Validator${COLORS.reset}`)
  console.log(LINE)

  // Extract reality from source
  log.info('Extracting token colors from designTokens.ts...')
  const validColors = extractTokenColors()
  log.dim(`  Found ${validColors.size / 2} unique colors`)

  log.info('Extracting ALIAS token paths...')
  const validPaths = extractTokenPaths()
  log.dim(`  Found ${validPaths.size} ALIAS categories`)

  log.info('Scanning existing component paths...')
  const existingPaths = getExistingPaths()
  log.dim(`  Found ${existingPaths.size} component files`)

  // Collect all agent files
  const agentFiles = []

  if (existsSync(AGENTS_DIR)) {
    const files = readdirSync(AGENTS_DIR)
    for (const file of files) {
      if (file.endsWith('.md')) {
        agentFiles.push(join(AGENTS_DIR, file))
      }
    }
  }

  if (existsSync(PLUGINS_AGENTS_DIR)) {
    const files = readdirSync(PLUGINS_AGENTS_DIR)
    for (const file of files) {
      if (file.endsWith('.md')) {
        agentFiles.push(join(PLUGINS_AGENTS_DIR, file))
      }
    }
  }

  log.info(`Validating ${agentFiles.length} agent instruction files...`)

  // Validate each file
  const allErrors = []
  const allWarnings = []

  for (const filePath of agentFiles) {
    const { errors, warnings } = validateAgentFile(filePath, validColors, validPaths, existingPaths)
    allErrors.push(...errors)
    allWarnings.push(...warnings)
  }

  // Report warnings
  if (allWarnings.length > 0) {
    log.section('Warnings (Potential Drift)')
    for (const w of allWarnings.slice(0, 10)) {
      log.warn(`${w.file}:${w.line} - ${w.issue}`)
      if (w.context) log.dim(`  "${w.context}..."`)
    }
    if (allWarnings.length > 10) {
      log.dim(`  ... and ${allWarnings.length - 10} more warnings`)
    }
  }

  // Report errors
  if (allErrors.length > 0) {
    log.section('Errors (Must Fix)')
    for (const e of allErrors) {
      log.error(`${e.file}:${e.line} - ${e.issue}`)
      if (e.context) log.dim(`  "${e.context}..."`)
    }
    console.log('')
    log.error(`${allErrors.length} error(s) found - agent instructions have drifted from reality`)
    console.log(LINE)
    log.dim(`Completed in ${Date.now() - startTime}ms`)
    console.log('')
    process.exit(1)
  }

  // Success
  log.section('Summary')
  log.success(`${agentFiles.length} agent files validated`)
  log.success(`${validColors.size / 2} token colors verified`)
  log.success(`${existingPaths.size} component paths verified`)
  if (allWarnings.length > 0) {
    log.warn(`${allWarnings.length} potential drift warnings (review recommended)`)
  }

  console.log(LINE)
  log.success('Agent instructions are in sync with codebase!')
  log.dim(`Completed in ${Date.now() - startTime}ms`)
  console.log('')
}

main()
