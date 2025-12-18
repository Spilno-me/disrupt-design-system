#!/usr/bin/env node
/**
 * Token Drift Validation Script
 *
 * Purpose: Detect drift between the 3 intentionally separate token files:
 * - src/constants/designTokens.ts (TypeScript source)
 * - src/styles.css @theme (Tailwind v4 CSS-first config)
 * - tailwind-preset.js (Consumer package preset)
 *
 * This is NOT a generation script. DDS uses intentional manual sync.
 * This script detects when files have drifted out of sync.
 *
 * Run: npm run validate:tokens
 * Also runs via: prebuild (npm run build)
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = resolve(__dirname, '..')

// =============================================================================
// FILE PATHS
// =============================================================================

const FILES = {
  designTokens: resolve(ROOT, 'src/constants/designTokens.ts'),
  stylesCss: resolve(ROOT, 'src/styles.css'),
  tailwindPreset: resolve(ROOT, 'tailwind-preset.js'),
}

// =============================================================================
// ANSI COLORS
// =============================================================================

const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const CYAN = '\x1b[36m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'

function log(color, symbol, message) {
  console.log(`${color}${symbol}${RESET} ${message}`)
}

// =============================================================================
// EXPECTED DIFFERENCES (ALLOWLIST)
// These are intentional differences that should NOT trigger drift warnings
// =============================================================================

const ALLOWLIST = {
  // CSS uses OKLCH in :root, hex in @theme - intentional format difference
  formatDifferences: [
    { reason: 'OKLCH format in :root vs hex elsewhere', pattern: /oklch/i },
  ],

  // Opacity variants are derived - not all need to be in all files
  derivedTokens: [
    /overlay-white-\d+/,   // e.g., overlay-white-15, overlay-white-50
    /\/\d+$/,              // opacity modifiers like bg-error/90
  ],

  // CSS-only tokens (Tailwind v4 specific)
  cssOnlyTokens: [
    '--alias-',            // Alias tokens are CSS-internal references
    '--button-',           // Component CSS variables
    '--input-',
    '--card-',
    '--header-',
    '--nav-',
    '--badge-',
    '--tooltip-',
    '--modal-',
    '--feature-card-',
    '--pricing-',
    '--footer-',
  ],

  // Preset-only tokens (JS consumers need these, CSS doesn't)
  presetOnlyTokens: [
    'SAFELIST',
    'keyframes',
    'animation',
  ],
}

// =============================================================================
// PARSERS
// =============================================================================

/**
 * Extract color primitives from designTokens.ts
 * Format: PALETTE_NAME = { shade: '#HEX' }
 */
function parseDesignTokens(content) {
  const palettes = {}
  const lines = content.split('\n')

  // Extract each palette
  const paletteNames = ['ABYSS', 'DEEP_CURRENT', 'DUSK_REEF', 'CORAL', 'WAVE', 'SUNRISE', 'ORANGE', 'HARBOR', 'SLATE']

  for (const name of paletteNames) {
    const regex = new RegExp(`export const ${name} = \\{([\\s\\S]*?)\\} as const`, 'm')
    const match = content.match(regex)
    if (match) {
      palettes[name] = {}
      const shadeMatches = match[1].matchAll(/(\d+):\s*['"]([^'"]+)['"]/g)
      for (const m of shadeMatches) {
        palettes[name][m[1]] = m[2].toUpperCase()
      }
    }
  }

  // Extract PRIMITIVES
  const primitivesMatch = content.match(/export const PRIMITIVES = \{([\s\S]*?)\} as const/m)
  if (primitivesMatch) {
    palettes.PRIMITIVES = {}
    const primitiveMatches = primitivesMatch[1].matchAll(/(\w+):\s*['"]([^'"]+)['"]/g)
    for (const m of primitiveMatches) {
      palettes.PRIMITIVES[m[1]] = m[2].toUpperCase()
    }
  }

  // Extract RADIUS
  const radiusMatch = content.match(/export const RADIUS = \{([\s\S]*?)\} as const/m)
  const radius = {}
  if (radiusMatch) {
    const radiusMatches = radiusMatch[1].matchAll(/['"]?(\w+)['"]?:\s*['"]([^'"]+)['"]/g)
    for (const m of radiusMatches) {
      radius[m[1]] = m[2]
    }
  }

  return { palettes, radius, lines }
}

/**
 * Extract colors from tailwind-preset.js
 */
function parseTailwindPreset(content) {
  const palettes = {}
  const lines = content.split('\n')

  // Extract each palette (same names as designTokens)
  const paletteNames = ['ABYSS', 'DEEP_CURRENT', 'DUSK_REEF', 'CORAL', 'WAVE', 'SUNRISE', 'ORANGE', 'HARBOR', 'SLATE']

  for (const name of paletteNames) {
    const regex = new RegExp(`const ${name} = \\{([\\s\\S]*?)\\}`, 'm')
    const match = content.match(regex)
    if (match) {
      palettes[name] = {}
      const shadeMatches = match[1].matchAll(/(\d+):\s*['"]([^'"]+)['"]/g)
      for (const m of shadeMatches) {
        palettes[name][m[1]] = m[2].toUpperCase()
      }
    }
  }

  // Extract PRIMITIVES
  const primitivesMatch = content.match(/const PRIMITIVES = \{([\s\S]*?)\}/m)
  if (primitivesMatch) {
    palettes.PRIMITIVES = {}
    const primitiveMatches = primitivesMatch[1].matchAll(/(\w+):\s*['"]([^'"]+)['"]/g)
    for (const m of primitiveMatches) {
      palettes.PRIMITIVES[m[1]] = m[2].toUpperCase()
    }
  }

  // Extract RADIUS
  const radiusMatch = content.match(/const RADIUS = \{([\s\S]*?)\}/m)
  const radius = {}
  if (radiusMatch) {
    const radiusMatches = radiusMatch[1].matchAll(/['"]?(\w+)['"]?:\s*['"]([^'"]+)['"]/g)
    for (const m of radiusMatches) {
      radius[m[1]] = m[2]
    }
  }

  return { palettes, radius, lines }
}

/**
 * Extract @theme colors from styles.css
 */
function parseStylesCss(content) {
  const colors = {}
  const lines = content.split('\n')

  // Find the @theme block
  const themeMatch = content.match(/@theme \{([\s\S]*?)\n\}/)
  if (themeMatch) {
    const themeContent = themeMatch[1]

    // Extract --brand-* colors (primitives)
    const brandMatches = themeContent.matchAll(/--brand-([a-z-]+)-?(\d*):\s*(#[A-Fa-f0-9]+)/gi)
    for (const m of brandMatches) {
      const paletteName = m[1].toUpperCase().replace(/-/g, '_')
      const shade = m[2] || 'base'
      if (!colors[paletteName]) colors[paletteName] = {}
      colors[paletteName][shade] = m[3].toUpperCase()
    }

    // Extract --color-* semantic tokens
    const colorMatches = themeContent.matchAll(/--color-([a-z-]+):\s*(#[A-Fa-f0-9]+)/gi)
    for (const m of colorMatches) {
      const tokenName = m[1]
      const value = m[2].toUpperCase()
      if (!colors.SEMANTIC) colors.SEMANTIC = {}
      colors.SEMANTIC[tokenName] = value
    }
  }

  return { colors, lines }
}

/**
 * Find line number for a pattern in file content
 */
function findLineNumber(lines, pattern) {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(pattern)) {
      return i + 1 // 1-indexed
    }
  }
  return null
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Compare palettes between designTokens and tailwindPreset
 */
function comparePalettes(designTokens, tailwindPreset) {
  const drifts = []

  for (const [palette, shades] of Object.entries(designTokens.palettes)) {
    const presetPalette = tailwindPreset.palettes[palette]

    if (!presetPalette) {
      drifts.push({
        type: 'MISSING_PALETTE',
        message: `Palette "${palette}" exists in designTokens.ts but missing from tailwind-preset.js`,
        file: 'tailwind-preset.js',
      })
      continue
    }

    for (const [shade, value] of Object.entries(shades)) {
      const presetValue = presetPalette[shade]

      if (!presetValue) {
        const line = findLineNumber(tailwindPreset.lines, `const ${palette}`)
        drifts.push({
          type: 'MISSING_SHADE',
          message: `${palette}[${shade}] missing from tailwind-preset.js`,
          file: 'tailwind-preset.js',
          line,
        })
      } else if (value !== presetValue) {
        const dtLine = findLineNumber(designTokens.lines, value)
        const presetLine = findLineNumber(tailwindPreset.lines, presetValue)
        drifts.push({
          type: 'VALUE_MISMATCH',
          message: `${palette}[${shade}]: designTokens.ts has "${value}", tailwind-preset.js has "${presetValue}"`,
          files: [
            { name: 'designTokens.ts', line: dtLine },
            { name: 'tailwind-preset.js', line: presetLine },
          ],
        })
      }
    }
  }

  return drifts
}

/**
 * Compare radius values
 */
function compareRadius(designTokens, tailwindPreset) {
  const drifts = []

  for (const [key, value] of Object.entries(designTokens.radius)) {
    const presetValue = tailwindPreset.radius[key]

    if (!presetValue) {
      drifts.push({
        type: 'MISSING_RADIUS',
        message: `Radius "${key}" exists in designTokens.ts but missing from tailwind-preset.js`,
        file: 'tailwind-preset.js',
      })
    } else if (value !== presetValue) {
      drifts.push({
        type: 'VALUE_MISMATCH',
        message: `Radius "${key}": designTokens.ts has "${value}", tailwind-preset.js has "${presetValue}"`,
        files: ['designTokens.ts', 'tailwind-preset.js'],
      })
    }
  }

  return drifts
}

/**
 * Spot-check key semantic tokens in styles.css
 */
function validateSemanticTokens(designTokens, stylesCss) {
  const drifts = []

  // Key tokens that MUST match between designTokens and styles.css
  // NOTE: --color-teal uses [700] for WCAG AA text compliance (7.02:1 contrast)
  const keyMappings = [
    { dt: 'ABYSS.500', css: 'dark', expected: '#2D3142' },
    { dt: 'DEEP_CURRENT.700', css: 'teal', expected: '#056271' }, // WCAG: [700] for text contrast
    { dt: 'PRIMITIVES.cream', css: 'cream', expected: '#FBFBF3' },
    { dt: 'CORAL.500', css: 'error', expected: '#F70D1A' },
    { dt: 'HARBOR.500', css: 'success', expected: '#22C55E' },
    { dt: 'SUNRISE.500', css: 'warning', expected: '#EAB308' },
    { dt: 'WAVE.500', css: 'info', expected: '#3B82F6' },
  ]

  for (const mapping of keyMappings) {
    const cssValue = stylesCss.colors.SEMANTIC?.[mapping.css]
    if (cssValue && cssValue !== mapping.expected) {
      const line = findLineNumber(stylesCss.lines, `--color-${mapping.css}:`)
      drifts.push({
        type: 'SEMANTIC_MISMATCH',
        message: `--color-${mapping.css}: expected "${mapping.expected}" (from ${mapping.dt}), found "${cssValue}"`,
        file: 'styles.css',
        line,
      })
    }
  }

  return drifts
}

// =============================================================================
// MAIN
// =============================================================================

function main() {
  const startTime = performance.now()

  console.log('\n🔍 DDS Token Drift Validator\n')
  console.log(`${DIM}Checking: designTokens.ts ↔ styles.css ↔ tailwind-preset.js${RESET}\n`)

  // Read files
  log(CYAN, '→', 'Reading token files...')

  let designTokensContent, stylesCssContent, tailwindPresetContent

  try {
    designTokensContent = readFileSync(FILES.designTokens, 'utf-8')
    stylesCssContent = readFileSync(FILES.stylesCss, 'utf-8')
    tailwindPresetContent = readFileSync(FILES.tailwindPreset, 'utf-8')
  } catch (err) {
    log(RED, '✗', `Failed to read file: ${err.message}`)
    process.exit(1)
  }

  // Parse files
  log(CYAN, '→', 'Parsing token definitions...')

  const designTokens = parseDesignTokens(designTokensContent)
  const tailwindPreset = parseTailwindPreset(tailwindPresetContent)
  const stylesCss = parseStylesCss(stylesCssContent)

  // Count tokens found
  const dtPaletteCount = Object.keys(designTokens.palettes).length
  const dtColorCount = Object.values(designTokens.palettes).reduce(
    (sum, p) => sum + Object.keys(p).length,
    0
  )
  const presetColorCount = Object.values(tailwindPreset.palettes).reduce(
    (sum, p) => sum + Object.keys(p).length,
    0
  )

  log(GREEN, '✓', `designTokens.ts: ${dtPaletteCount} palettes, ${dtColorCount} colors`)
  log(GREEN, '✓', `tailwind-preset.js: ${presetColorCount} colors`)
  log(GREEN, '✓', `styles.css: ${Object.keys(stylesCss.colors.SEMANTIC || {}).length} semantic tokens`)

  // Run validations
  console.log('')
  log(CYAN, '→', 'Comparing token values...')

  const allDrifts = []

  // Compare designTokens ↔ tailwindPreset (palettes)
  allDrifts.push(...comparePalettes(designTokens, tailwindPreset))

  // Compare radius values
  allDrifts.push(...compareRadius(designTokens, tailwindPreset))

  // Validate semantic tokens in styles.css
  allDrifts.push(...validateSemanticTokens(designTokens, stylesCss))

  // Report results
  const endTime = performance.now()
  const elapsed = (endTime - startTime).toFixed(0)

  console.log('')
  console.log('─'.repeat(60))

  if (allDrifts.length === 0) {
    log(GREEN, '✓', 'No drift detected - all token files are in sync')
    console.log(`${DIM}Validation completed in ${elapsed}ms${RESET}`)
    console.log('─'.repeat(60))
    console.log('')
    process.exit(0)
  }

  // Report drifts
  log(RED, '✗', `Found ${allDrifts.length} drift issue(s):`)
  console.log('')

  for (const drift of allDrifts) {
    console.log(`  ${RED}•${RESET} ${drift.message}`)
    if (drift.file && drift.line) {
      console.log(`    ${DIM}└─ ${drift.file}:${drift.line}${RESET}`)
    } else if (drift.files) {
      for (const f of drift.files) {
        if (typeof f === 'object') {
          console.log(`    ${DIM}└─ ${f.name}:${f.line || '?'}${RESET}`)
        } else {
          console.log(`    ${DIM}└─ ${f}${RESET}`)
        }
      }
    }
  }

  console.log('')
  console.log('─'.repeat(60))
  log(YELLOW, '!', 'Action Required: Sync the token files to match designTokens.ts')
  console.log(`${DIM}Validation completed in ${elapsed}ms${RESET}`)
  console.log('─'.repeat(60))
  console.log('')

  process.exit(1)
}

main()
