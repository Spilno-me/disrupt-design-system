#!/usr/bin/env node
/**
 * DDS Prompt Drift Validator
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Validates that all file/directory paths referenced in prompts actually exist.
 * Prevents reality drift where prompts reference deleted or moved files.
 *
 * Usage: npm run validate:prompts
 */

import { readFileSync, existsSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

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
}

const LINE = '─'.repeat(60)

// ═══════════════════════════════════════════════════════════════════════════
// Path Validation
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if a path exists (file or directory)
 */
function pathExists(relativePath) {
  const fullPath = join(ROOT, relativePath)

  try {
    const stat = statSync(fullPath)
    return { exists: true, isDir: stat.isDirectory() }
  } catch {
    return { exists: false }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Validation
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  console.log(`\n${COLORS.bold}DDS Prompt Drift Validator${COLORS.reset}`)
  console.log(LINE)

  const promptsPath = join(ROOT, 'src/components/shared/PromptLibrary/prompts.ts')

  if (!existsSync(promptsPath)) {
    log.error('prompts.ts not found')
    process.exit(1)
  }

  log.info('Reading prompts.ts...')
  const content = readFileSync(promptsPath, 'utf8')

  // Extract all .claude file paths
  const claudePaths = [...new Set(
    [...content.matchAll(/\.claude\/[\w-]+\.(md|json)/g)].map(m => m[0])
  )]

  // Extract all src/ directory paths (only ones that look like real paths)
  const srcPaths = [...new Set(
    [...content.matchAll(/src\/(?:components|stories|constants|lib|styles)[\w\-_\/]*/g)].map(m => m[0])
  )]

  log.info('Checking .claude/ file references...')
  const errors = []

  // Validate .claude paths
  for (const path of claudePaths) {
    const result = pathExists(path)
    if (!result.exists) {
      errors.push({ path, type: 'claude' })
    }
  }

  // Validate src/ paths
  log.info('Checking src/ directory references...')
  for (const path of srcPaths) {
    const cleanPath = path.replace(/\/$/, '')
    const result = pathExists(cleanPath)

    // If exact path exists, it's valid
    if (result.exists) continue

    // Try with .ts extension (common for file references)
    const withTs = pathExists(cleanPath + '.ts')
    if (withTs.exists) continue

    // Try with .tsx extension
    const withTsx = pathExists(cleanPath + '.tsx')
    if (withTsx.exists) continue

    // Path not found - only report if it looks like a real path (not partial)
    if (path.includes('_infrastructure') || path.split('/').length >= 3) {
      errors.push({ path, type: 'src' })
    }
  }

  const totalChecked = claudePaths.length + srcPaths.length

  // Report
  console.log('')
  log.dim(`  .claude/ files: ${claudePaths.length}`)
  log.dim(`  src/ directories: ${srcPaths.length}`)

  if (errors.length > 0) {
    console.log(`\n${COLORS.bold}Errors (Must Fix)${COLORS.reset}`)
    console.log(LINE)

    for (const e of errors) {
      log.error(`Missing: ${e.path}`)
    }

    console.log('')
    console.log(LINE)
    log.error(`${errors.length} broken path reference(s) found`)
    log.dim('Fix: Update prompts.ts with correct paths or create missing files')
    console.log('')
    process.exit(1)
  }

  // Success
  console.log('')
  console.log(LINE)
  log.success(`All ${totalChecked} path references are valid`)
  log.dim('Prompts are in sync with codebase')
  console.log('')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
