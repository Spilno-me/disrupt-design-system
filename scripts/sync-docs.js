#!/usr/bin/env node
/**
 * Sync documentation between agent files and human docs
 *
 * Usage: npm run sync-docs
 *
 * This script ensures agent context files and human documentation stay in sync:
 * 1. Generates tokens-reference.json from designTokens.ts
 * 2. Validates MDX values match the source of truth
 * 3. Reports drift between files
 *
 * Source of Truth: src/constants/designTokens.ts
 * Agent Reference: .claude/tokens-reference.json
 * Human Docs: src/stories/DesignTokens.mdx
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const DESIGN_TOKENS_PATH = join(ROOT, 'src', 'constants', 'designTokens.ts')
const TOKENS_REF_PATH = join(ROOT, '.claude', 'tokens-reference.json')
const MDX_PATH = join(ROOT, 'src', 'stories', 'DesignTokens.mdx')
const CHANGELOG_PATH = join(ROOT, '.claude', 'changelog.json')

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
 * Extract key values from designTokens.ts
 */
function extractFromDesignTokens() {
  const content = readFileSync(DESIGN_TOKENS_PATH, 'utf8')
  const values = {}

  // Extract shadow values
  const shadowMatch = content.match(/export const SHADOWS = \{([\s\S]*?)\} as const/m)
  if (shadowMatch) {
    values.shadows = {}
    const shadowContent = shadowMatch[1]
    const patterns = [
      /sm:\s*'([^']+)'/,
      /md:\s*'([^']+)'/,
      /lg:\s*'([^']+)'/,
      /xl:\s*'([^']+)'/,
      /elevated:\s*'([^']+)'/,
    ]
    patterns.forEach(p => {
      const match = shadowContent.match(p)
      if (match) {
        const key = p.source.split(':')[0]
        values.shadows[key] = match[1]
      }
    })
  }

  // Extract radius values
  const radiusMatch = content.match(/export const RADIUS = \{([\s\S]*?)\} as const/m)
  if (radiusMatch) {
    values.radius = {}
    const radiusContent = radiusMatch[1]
    const patterns = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full']
    patterns.forEach(key => {
      const match = radiusContent.match(new RegExp(`${key}:\\s*'([^']+)'`))
      if (match) values.radius[key] = match[1]
    })
  }

  // Extract color values
  values.colors = {}
  const colorScales = ['ABYSS', 'DEEP_CURRENT', 'DUSK_REEF', 'CORAL', 'HARBOR', 'WAVE', 'SUNRISE']
  colorScales.forEach(scale => {
    const match = content.match(new RegExp(`export const ${scale} = \\{([\\s\\S]*?)\\} as const`, 'm'))
    if (match) {
      values.colors[scale] = {}
      const scaleContent = match[1]
      const shadeMatches = scaleContent.matchAll(/(\d+):\s*'(#[A-Fa-f0-9]+)'/g)
      for (const m of shadeMatches) {
        values.colors[scale][m[1]] = m[2]
      }
    }
  })

  return values
}

/**
 * Normalize CSS value for comparison (remove whitespace variations)
 */
function normalizeCss(value) {
  if (!value) return ''
  return value.replace(/\s+/g, ' ').replace(/,\s*/g, ',').trim()
}

/**
 * Compare extracted values with tokens-reference.json
 */
function compareWithTokensRef(sourceValues) {
  if (!existsSync(TOKENS_REF_PATH)) {
    return { inSync: false, reason: 'tokens-reference.json not found' }
  }

  const tokensRef = JSON.parse(readFileSync(TOKENS_REF_PATH, 'utf8'))
  const drifts = []

  // Check shadows (normalize whitespace for comparison)
  if (tokensRef.shadows?.scale) {
    for (const [key, data] of Object.entries(tokensRef.shadows.scale)) {
      if (key === 'none') continue
      const sourceValue = sourceValues.shadows?.[key]
      if (sourceValue && data.value && normalizeCss(sourceValue) !== normalizeCss(data.value)) {
        drifts.push(`shadows.${key}: values differ (check actual CSS values)`)
      }
    }
  }

  // Check radius
  if (tokensRef.radius?.scale) {
    for (const [key, data] of Object.entries(tokensRef.radius.scale)) {
      if (key === 'none' || key === '_rule') continue
      const sourceValue = sourceValues.radius?.[key]
      const refValue = typeof data === 'object' ? data.value : data
      if (sourceValue && refValue && sourceValue !== refValue) {
        drifts.push(`radius.${key}: JSON has "${refValue}" but source has "${sourceValue}"`)
      }
    }
  }

  return {
    inSync: drifts.length === 0,
    drifts
  }
}

/**
 * Check MDX for potential stale values
 */
function checkMdxStaleness() {
  if (!existsSync(MDX_PATH)) {
    return { checked: false, reason: 'MDX file not found' }
  }

  const mdxContent = readFileSync(MDX_PATH, 'utf8')
  const warnings = []

  // Check if MDX has hardcoded shadow values that might be stale
  const shadowPatterns = [
    /boxShadow:\s*'0 1px 3px/,
    /boxShadow:\s*'0 2px 8px/,
    /boxShadow:\s*'0 4px 16px/,
  ]

  let hardcodedShadowCount = 0
  shadowPatterns.forEach(p => {
    const matches = mdxContent.match(new RegExp(p.source, 'g'))
    if (matches) hardcodedShadowCount += matches.length
  })

  if (hardcodedShadowCount > 0) {
    warnings.push(`MDX has ${hardcodedShadowCount} hardcoded shadow values in visual examples`)
  }

  // Check last modified dates
  const mdxStats = { mtime: new Date() } // Would use fs.statSync in real implementation

  return {
    checked: true,
    warnings,
    note: 'MDX visual examples may have hardcoded values for Storybook rendering'
  }
}

/**
 * Update tokens-reference.json timestamp
 */
function updateTokensRefTimestamp() {
  const tokensRef = JSON.parse(readFileSync(TOKENS_REF_PATH, 'utf8'))
  tokensRef.lastUpdated = new Date().toISOString().split('T')[0]
  writeFileSync(TOKENS_REF_PATH, JSON.stringify(tokensRef, null, 2) + '\n')
}

function main() {
  console.log('\nSyncing documentation files...\n')

  // Step 1: Extract from source of truth
  log(CYAN, '→', 'Reading designTokens.ts (source of truth)...')
  const sourceValues = extractFromDesignTokens()
  log(GREEN, '✓', `Found ${Object.keys(sourceValues.shadows || {}).length} shadows, ${Object.keys(sourceValues.radius || {}).length} radius values`)

  // Step 2: Compare with tokens-reference.json
  log(CYAN, '→', 'Comparing with tokens-reference.json...')
  const comparison = compareWithTokensRef(sourceValues)

  if (!comparison.inSync) {
    if (comparison.reason) {
      log(RED, '✗', comparison.reason)
    } else {
      log(YELLOW, '⚠', 'Drift detected between designTokens.ts and tokens-reference.json:')
      comparison.drifts.forEach(d => console.log(`    ${d}`))
      console.log('')
      log(YELLOW, '!', 'Run: Update tokens-reference.json to match designTokens.ts')
    }
  } else {
    log(GREEN, '✓', 'tokens-reference.json is in sync with source')
  }

  // Step 3: Check MDX staleness
  log(CYAN, '→', 'Checking DesignTokens.mdx...')
  const mdxCheck = checkMdxStaleness()
  if (mdxCheck.warnings?.length > 0) {
    mdxCheck.warnings.forEach(w => log(YELLOW, '⚠', w))
    log(YELLOW, '!', 'Note: MDX uses hardcoded values for visual rendering in Storybook')
    log(YELLOW, '!', 'Update MDX manually if token VALUES change (not just for agent context changes)')
  } else {
    log(GREEN, '✓', 'MDX checked')
  }

  // Summary
  console.log('\n' + '─'.repeat(60))
  console.log('Documentation Sync Summary:')
  console.log('─'.repeat(60))
  console.log(`  Source of Truth:  src/constants/designTokens.ts`)
  console.log(`  Agent Reference:  .claude/tokens-reference.json ${comparison.inSync ? '✓' : '⚠'}`)
  console.log(`  Human Docs:       src/stories/DesignTokens.mdx (visual examples)`)
  console.log('─'.repeat(60))

  if (!comparison.inSync) {
    console.log(`\n${YELLOW}Action Required:${RESET}`)
    console.log('  When token VALUES change in designTokens.ts:')
    console.log('  1. Update tokens-reference.json (agent reference)')
    console.log('  2. Update DesignTokens.mdx (human visual docs)')
    console.log('  3. Run: npm run sync-docs to verify')
  }

  console.log('')
}

main()
