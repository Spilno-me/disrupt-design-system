#!/usr/bin/env node
/**
 * Generate Color Matrix
 *
 * Generates .claude/color-matrix.json and .claude/contrast-matrix.json
 * from the single source of truth: src/constants/designTokens.ts
 *
 * Calculates WCAG 2.1 contrast ratios for all color combinations.
 *
 * Usage: npm run sync:colors
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const TOKENS_SOURCE = join(ROOT, 'src', 'constants', 'designTokens.ts')
const COLOR_MATRIX_PATH = join(ROOT, '.claude', 'color-matrix.json')
const CONTRAST_MATRIX_PATH = join(ROOT, '.claude', 'contrast-matrix.json')

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
  const scaleNames = ['ABYSS', 'DEEP_CURRENT', 'DUSK_REEF', 'CORAL', 'WAVE', 'SUNRISE', 'HARBOR', 'SLATE', 'ORANGE']

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

    for (const shade of ['50', '100', '200']) {
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

// Generate color matrix with allowed combinations
function generateColorMatrix(tokens) {
  const matrix = {
    _generated: new Date().toISOString(),
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
function generateContrastMatrix(tokens) {
  const matrix = {
    _generated: new Date().toISOString(),
    _source: 'src/constants/designTokens.ts',
    _note: 'AUTO-GENERATED - Do not edit. Run npm run sync:colors',
    wcagRequirements: { 'AA-normal-text': '4.5:1', 'AA-large-text': '3.0:1', 'AAA-normal-text': '7.0:1' },
    combinations: []
  }

  for (const bg of tokens.backgrounds) {
    for (const fg of tokens.foregrounds) {
      const ratio = getContrastRatio(bg.hex, fg.hex)
      const level = wcagLevel(ratio)
      matrix.combinations.push({
        background: bg.token,
        foreground: fg.token,
        ratio: parseFloat(ratio.toFixed(2)),
        level,
        pass: level !== 'FAIL'
      })
    }
  }

  matrix.combinations.sort((a, b) => b.ratio - a.ratio)
  return matrix
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
  const colorMatrix = generateColorMatrix(tokens)
  const contrastMatrix = generateContrastMatrix(tokens)
  console.log(`${DIM}  ${contrastMatrix.combinations.length} combinations calculated${RESET}`)
  console.log(`${DIM}  ${contrastMatrix.combinations.filter((c) => c.pass).length} pass WCAG AA${RESET}`)

  console.log(`${CYAN}>${RESET} Writing color-matrix.json...`)
  writeFileSync(COLOR_MATRIX_PATH, JSON.stringify(colorMatrix, null, 2))

  console.log(`${CYAN}>${RESET} Writing contrast-matrix.json...`)
  writeFileSync(CONTRAST_MATRIX_PATH, JSON.stringify(contrastMatrix, null, 2))

  console.log(`${GREEN}+${RESET} Color matrices generated from designTokens.ts`)
  console.log('')
}

main()
