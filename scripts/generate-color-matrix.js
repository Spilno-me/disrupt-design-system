#!/usr/bin/env node
/**
 * Generate Color Matrix
 *
 * Generates from src/constants/designTokens.ts:
 * - .claude/color-matrix.json     (allowed color combinations)
 * - .claude/color-matrix.toon     (72% smaller TOON format)
 * - .claude/contrast-matrix.json  (WCAG contrast ratios)
 * - .claude/contrast-matrix.toon  (71% smaller TOON format)
 *
 * TOON = Token-Oriented Object Notation (https://github.com/toon-format/toon)
 * Reduces tokens when feeding data to LLMs.
 *
 * Usage: npm run sync:colors
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createHash } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const TOKENS_SOURCE = join(ROOT, 'src', 'constants', 'designTokens.ts')
const COLOR_MATRIX_PATH = join(ROOT, '.claude', 'color-matrix.json')
const COLOR_TOON_PATH = join(ROOT, '.claude', 'color-matrix.toon')
const CONTRAST_MATRIX_PATH = join(ROOT, '.claude', 'contrast-matrix.json')
const CONTRAST_TOON_PATH = join(ROOT, '.claude', 'contrast-matrix.toon')

// ANSI colors
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const CYAN = '\x1b[36m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'
const BOLD = '\x1b[1m'

// WCAG Contrast Calculation
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function getContrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1)
  const rgb2 = hexToRgb(hex2)
  if (!rgb1 || !rgb2) return 0

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)

  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

function wcagLevel(ratio) {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'AA-large'
  return 'FAIL'
}

// Parse Tokens from TypeScript
function parseTokens(content) {
  const tokens = { primitives: {}, backgrounds: [], foregrounds: [] }

  // Extract color scale objects
  const scaleNames = ['ABYSS', 'DEEP_CURRENT', 'DUSK_REEF', 'CORAL', 'WAVE', 'SUNRISE', 'HARBOR', 'SLATE', 'ORANGE', 'LINEN']

  for (const name of scaleNames) {
    const regex = new RegExp(`export const ${name}[^=]*=\\s*\\{([^}]+)\\}`, 's')
    const match = content.match(regex)
    if (match) {
      const entries = match[1].matchAll(/['"]?(\d+)['"]?\s*:\s*['"]([^'"]+)['"]/g)
      tokens.primitives[name] = {}
      for (const entry of entries) {
        tokens.primitives[name][entry[1]] = entry[2]
      }
    }
  }

  // Extract PRIMITIVES object
  const primitivesMatch = content.match(/export const PRIMITIVES[^=]*=\s*\{([^}]+)\}/s)
  if (primitivesMatch) {
    const entries = primitivesMatch[1].matchAll(/(\w+)\s*:\s*['"]([^'"]+)['"]/g)
    for (const entry of entries) {
      if (entry[2].startsWith('#')) {
        tokens.primitives.PRIMITIVES = tokens.primitives.PRIMITIVES || {}
        tokens.primitives.PRIMITIVES[entry[1]] = entry[2]
      }
    }
  }

  // Categorize colors
  const backgroundColors = []
  const foregroundColors = []

  // Add specific background colors
  if (tokens.primitives.PRIMITIVES) {
    const p = tokens.primitives.PRIMITIVES
    if (p.white) backgroundColors.push({ name: 'white', hex: p.white, token: 'PRIMITIVES.white' })
    if (p.cream) backgroundColors.push({ name: 'cream', hex: p.cream, token: 'PRIMITIVES.cream' })
    if (p.softLinen) backgroundColors.push({ name: 'softLinen', hex: p.softLinen, token: 'PRIMITIVES.softLinen' })
  }

  // Add light shades as backgrounds, dark shades as foregrounds
  for (const [scaleName, scale] of Object.entries(tokens.primitives)) {
    if (scaleName === 'PRIMITIVES') continue

    for (const shade of ['50', '100', '200', '300']) {
      if (scale[shade]) {
        backgroundColors.push({ name: `${scaleName}[${shade}]`, hex: scale[shade], token: `${scaleName}[${shade}]` })
      }
    }

    for (const shade of ['500', '600', '700', '800', '900']) {
      if (scale[shade]) {
        foregroundColors.push({ name: `${scaleName}[${shade}]`, hex: scale[shade], token: `${scaleName}[${shade}]` })
      }
    }
  }

  // Add white as foreground for dark backgrounds
  if (tokens.primitives.PRIMITIVES?.white) {
    foregroundColors.push({ name: 'white', hex: tokens.primitives.PRIMITIVES.white, token: 'PRIMITIVES.white' })
  }

  // Add dark backgrounds
  for (const scaleName of ['ABYSS', 'DEEP_CURRENT', 'DUSK_REEF']) {
    const scale = tokens.primitives[scaleName]
    if (scale) {
      for (const shade of ['500', '600', '700', '800', '900']) {
        if (scale[shade]) {
          backgroundColors.push({ name: `${scaleName}[${shade}]`, hex: scale[shade], token: `${scaleName}[${shade}]`, dark: true })
        }
      }
    }
  }

  tokens.backgrounds = backgroundColors
  tokens.foregrounds = foregroundColors
  return tokens
}

// Generate content hash from tokens
function generateContentHash(tokens) {
  const content = JSON.stringify(tokens)
  return createHash('sha256').update(content).digest('hex').slice(0, 12)
}

// Generate color matrix with allowed combinations
function generateColorMatrix(tokens, contentHash) {
  const matrix = {
    _contentHash: contentHash,
    _source: 'src/constants/designTokens.ts',
    _note: 'AUTO-GENERATED - Do not edit. Run npm run sync:colors',
    backgrounds: { light: [], dark: [], accent: [] },
    allowedCombinations: {},
    forbidden: []
  }

  for (const bg of tokens.backgrounds) {
    if (bg.dark) matrix.backgrounds.dark.push(bg.token)
    else if (bg.name.includes('DEEP_CURRENT')) matrix.backgrounds.accent.push(bg.token)
    else matrix.backgrounds.light.push(bg.token)
  }

  for (const bg of tokens.backgrounds) {
    const allowed = { text: [], icons: [] }

    for (const fg of tokens.foregrounds) {
      const ratio = getContrastRatio(bg.hex, fg.hex)
      const level = wcagLevel(ratio)

      if (level === 'AA' || level === 'AAA') {
        allowed.text.push({ token: fg.token, ratio: ratio.toFixed(2), level })
      }
      if (level !== 'FAIL') {
        allowed.icons.push({ token: fg.token, ratio: ratio.toFixed(2) })
      }
    }

    allowed.text.sort((a, b) => parseFloat(b.ratio) - parseFloat(a.ratio))
    allowed.icons.sort((a, b) => parseFloat(b.ratio) - parseFloat(a.ratio))

    matrix.allowedCombinations[bg.token] = {
      hex: bg.hex,
      text: allowed.text.slice(0, 5).map((t) => t.token),
      icons: allowed.icons.slice(0, 5).map((t) => t.token)
    }
  }

  for (const family of ['ABYSS', 'DEEP_CURRENT', 'DUSK_REEF', 'CORAL', 'SLATE']) {
    matrix.forbidden.push({ rule: `${family} on ${family}`, reason: 'Same color family - insufficient contrast' })
  }

  return matrix
}

// Generate contrast matrix with all ratios
function generateContrastMatrix(tokens, contentHash) {
  // Generate all combinations
  const allCombinations = []
  const seen = new Set()

  for (const bg of tokens.backgrounds) {
    for (const fg of tokens.foregrounds) {
      const ratio = getContrastRatio(bg.hex, fg.hex)
      const level = wcagLevel(ratio)

      // Create canonical key (sorted pair) to detect duplicates
      const pair = [bg.token, fg.token].sort().join('|')

      if (!seen.has(pair)) {
        seen.add(pair)
        allCombinations.push({
          background: bg.token,
          foreground: fg.token,
          ratio: parseFloat(ratio.toFixed(2)),
          level,
          pass: level !== 'FAIL'
        })
      }
    }
  }

  // Sort by ratio descending (best contrast first)
  allCombinations.sort((a, b) => b.ratio - a.ratio)

  // Build indexed structures for O(1) lookups
  const byBackground = {}
  const byForeground = {}

  for (const combo of allCombinations) {
    // By background
    if (!byBackground[combo.background]) {
      byBackground[combo.background] = []
    }
    byBackground[combo.background].push({
      foreground: combo.foreground,
      ratio: combo.ratio,
      level: combo.level,
      pass: combo.pass
    })

    // By foreground
    if (!byForeground[combo.foreground]) {
      byForeground[combo.foreground] = []
    }
    byForeground[combo.foreground].push({
      background: combo.background,
      ratio: combo.ratio,
      level: combo.level,
      pass: combo.pass
    })
  }

  // Sort each index by ratio descending
  for (const bg of Object.keys(byBackground)) {
    byBackground[bg].sort((a, b) => b.ratio - a.ratio)
  }
  for (const fg of Object.keys(byForeground)) {
    byForeground[fg].sort((a, b) => b.ratio - a.ratio)
  }

  return {
    _meta: {
      generated: new Date().toISOString(),
      contentHash,
      source: 'src/constants/designTokens.ts',
      note: 'AUTO-GENERATED - Do not edit. Run npm run sync:colors',
      originalCount: tokens.backgrounds.length * tokens.foregrounds.length,
      deduplicatedCount: allCombinations.length
    },
    wcagRequirements: {
      'AA-normal-text': 4.5,
      'AA-large-text': 3.0,
      'AAA-normal-text': 7.0
    },
    byBackground,
    byForeground,
    combinations: allCombinations
  }
}

// Generate TOON format for color-matrix
// Flattens allowedCombinations to uniform rows with pipe-delimited colors
function generateColorToon(colorMatrix) {
  const lines = []

  // Metadata
  lines.push('_meta:')
  lines.push(`  contentHash: ${colorMatrix._contentHash}`)
  lines.push(`  source: ${colorMatrix._source}`)
  lines.push('  note: AUTO-GENERATED - Do not edit. Run npm run sync:colors')
  lines.push('')

  // Backgrounds as comma-separated lists
  lines.push('backgrounds:')
  lines.push(`  light: ${colorMatrix.backgrounds.light.join(',')}`)
  lines.push(`  dark: ${colorMatrix.backgrounds.dark.join(',')}`)
  lines.push(`  accent: ${colorMatrix.backgrounds.accent.join(',')}`)
  lines.push('')

  // Allowed combinations as uniform table
  const combos = Object.entries(colorMatrix.allowedCombinations)
  lines.push(`allowedCombinations[${combos.length}]{background,hex,textColors,iconColors}:`)

  for (const [bg, info] of combos) {
    const textColors = info.text.join('|') || ''
    const iconColors = info.icons.join('|') || ''
    lines.push(`  ${bg},${info.hex},${textColors},${iconColors}`)
  }
  lines.push('')

  // Forbidden rules
  const forbidden = colorMatrix.forbidden
  lines.push(`forbidden[${forbidden.length}]{rule,reason}:`)
  for (const f of forbidden) {
    lines.push(`  ${f.rule},${f.reason}`)
  }

  return lines.join('\n')
}

// Generate TOON format (Token-Oriented Object Notation)
// ~71% smaller than JSON for uniform arrays
function generateContrastToon(contrastMatrix) {
  const lines = []

  // Metadata as nested object
  lines.push('_meta:')
  lines.push(`  contentHash: ${contrastMatrix._meta.contentHash}`)
  lines.push(`  source: ${contrastMatrix._meta.source}`)
  lines.push('  note: AUTO-GENERATED - Do not edit. Run npm run sync:colors')
  lines.push('')

  // WCAG requirements
  lines.push('wcagRequirements:')
  for (const [key, val] of Object.entries(contrastMatrix.wcagRequirements)) {
    lines.push(`  ${key}: ${val}`)
  }
  lines.push('')

  // Combinations as TOON table (for human-readable format)
  // Note: MCP tools use contrast-matrix.json with byBackground/byForeground indexes
  const combos = contrastMatrix.combinations
  lines.push(`combinations[${combos.length}]{background,foreground,ratio,level,pass}:`)

  for (const c of combos) {
    const pass = c.pass ? 'true' : 'false'
    lines.push(`  ${c.background},${c.foreground},${c.ratio},${c.level},${pass}`)
  }

  return lines.join('\n')
}

// Read existing content hash from a file
function getExistingContentHash(filePath) {
  if (!existsSync(filePath)) return null
  try {
    const content = readFileSync(filePath, 'utf8')
    if (filePath.endsWith('.json')) {
      const data = JSON.parse(content)
      // Handle both formats: _contentHash (color-matrix) and _meta.contentHash (contrast-matrix)
      return data._contentHash || data._meta?.contentHash || null
    } else if (filePath.endsWith('.toon')) {
      // Parse TOON format - look for contentHash in _meta section
      const match = content.match(/contentHash:\s*(\S+)/)
      return match ? match[1] : null
    }
  } catch {
    return null
  }
  return null
}

// Main
function main() {
  console.log(`\n${BOLD}Generate Color Matrix${RESET}`)
  console.log('-'.repeat(40))

  if (!existsSync(TOKENS_SOURCE)) {
    console.log(`${YELLOW}!${RESET} Source file not found: ${TOKENS_SOURCE}`)
    return
  }

  console.log(`${CYAN}>${RESET} Reading design tokens...`)
  const content = readFileSync(TOKENS_SOURCE, 'utf8')

  console.log(`${CYAN}>${RESET} Parsing token definitions...`)
  const tokens = parseTokens(content)
  console.log(`${DIM}  Found ${Object.keys(tokens.primitives).length} color scales${RESET}`)
  console.log(`${DIM}  ${tokens.backgrounds.length} backgrounds, ${tokens.foregrounds.length} foregrounds${RESET}`)

  console.log(`${CYAN}>${RESET} Calculating WCAG contrast ratios...`)
  const contentHash = generateContentHash(tokens)

  // Check if content has changed by comparing hashes
  const existingHash = getExistingContentHash(CONTRAST_MATRIX_PATH)
  if (existingHash === contentHash) {
    console.log(`${GREEN}✓${RESET} Content unchanged (hash: ${contentHash}) - skipping write`)
    console.log('')
    return
  }

  console.log(`${DIM}  Content hash: ${existingHash || '(new)'} → ${contentHash}${RESET}`)

  const colorMatrix = generateColorMatrix(tokens, contentHash)
  const contrastMatrix = generateContrastMatrix(tokens, contentHash)
  console.log(`${DIM}  ${contrastMatrix.combinations.length} combinations calculated${RESET}`)
  console.log(`${DIM}  ${contrastMatrix.combinations.filter((c) => c.pass).length} pass WCAG AA${RESET}`)

  console.log(`${CYAN}>${RESET} Writing color-matrix.json...`)
  writeFileSync(COLOR_MATRIX_PATH, JSON.stringify(colorMatrix, null, 2))

  console.log(`${CYAN}>${RESET} Writing color-matrix.toon (~72% smaller)...`)
  const colorToonContent = generateColorToon(colorMatrix)
  writeFileSync(COLOR_TOON_PATH, colorToonContent)
  const colorJsonSize = JSON.stringify(colorMatrix, null, 2).length
  const colorToonSize = colorToonContent.length
  console.log(`${DIM}  JSON: ${(colorJsonSize / 1024).toFixed(0)}KB → TOON: ${(colorToonSize / 1024).toFixed(0)}KB (${(100 - (colorToonSize / colorJsonSize * 100)).toFixed(0)}% smaller)${RESET}`)

  console.log(`${CYAN}>${RESET} Writing contrast-matrix.json...`)
  writeFileSync(CONTRAST_MATRIX_PATH, JSON.stringify(contrastMatrix, null, 2))

  console.log(`${CYAN}>${RESET} Writing contrast-matrix.toon (71% smaller)...`)
  const toonContent = generateContrastToon(contrastMatrix)
  writeFileSync(CONTRAST_TOON_PATH, toonContent)
  const jsonSize = JSON.stringify(contrastMatrix, null, 2).length
  const toonSize = toonContent.length
  console.log(`${DIM}  JSON: ${(jsonSize / 1024).toFixed(0)}KB → TOON: ${(toonSize / 1024).toFixed(0)}KB (${(100 - (toonSize / jsonSize * 100)).toFixed(0)}% smaller)${RESET}`)

  console.log(`${GREEN}+${RESET} Color matrices generated from designTokens.ts`)
  console.log('')
}

main()
