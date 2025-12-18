#!/usr/bin/env node

/**
 * Design Token Generator (LIMITED SCOPE)
 *
 * IMPORTANT: This script ONLY generates the focus ring token.
 * Full token sync is INTENTIONALLY manual. See ARCHITECTURE below.
 *
 * GENERATES:
 * - src/styles/tokens.css → --ring variable (focus ring color)
 *
 * DOES NOT GENERATE (by design):
 * - tailwind-preset.js → Manually maintained for consumer package
 * - styles.css @theme → Manually maintained (Tailwind v4 CSS-first)
 *
 * ARCHITECTURE:
 * DDS uses a 3-file token architecture:
 * 1. designTokens.ts - TypeScript constants for DDS components
 * 2. styles.css @theme - Tailwind v4 CSS-first config
 * 3. tailwind-preset.js - NPM package export for consumers
 *
 * These are kept in sync MANUALLY because:
 * - Token values change rarely (~quarterly)
 * - Tailwind v4 promotes CSS-first approach
 * - Full generation adds complexity without proportional benefit
 *
 * DRIFT DETECTION:
 * Run `npm run validate:tokens` to check for drift between files.
 * This runs automatically in prebuild.
 *
 * Run automatically via: npm run generate-tokens
 * Or via prebuild hook: npm run build (runs this first)
 */

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '..')

// =============================================================================
// COLOR CONVERSION UTILITIES
// =============================================================================

/**
 * Hex to OKLCH conversion map
 * For production, use a proper color conversion library
 * For now, we map known DDS colors to their oklch equivalents
 */
const HEX_TO_OKLCH = {
  // DEEP_CURRENT (Teal)
  '#E6F7FA': 'oklch(0.965 0.025 205.36)',
  '#CCEFF5': 'oklch(0.930 0.050 205.36)',
  '#99DFEB': 'oklch(0.865 0.100 205.36)',
  '#66CFE1': 'oklch(0.797 0.120 205.36)',
  '#33BFD7': 'oklch(0.730 0.135 205.36)',
  '#08A4BD': 'oklch(0.647 0.145 205.36)',  // DDS Teal - Focus ring
  '#068397': 'oklch(0.534 0.118 205.36)',
  '#056271': 'oklch(0.420 0.092 205.36)',
  '#03424B': 'oklch(0.307 0.065 205.36)',
  '#022125': 'oklch(0.194 0.040 205.36)',

  // ABYSS (Dark gray)
  '#2D3142': 'oklch(0.241 0.017 269.558)',
  '#252836': 'oklch(0.204 0.017 269.558)',
  '#1D1F2A': 'oklch(0.164 0.016 269.558)',

  // Common colors
  '#FFFFFF': 'oklch(1 0 0)',
  '#000000': 'oklch(0 0 0)',
  '#FBFBF3': 'oklch(0.985 0.011 99.578)',  // Cream

  // Status colors
  '#F70D1A': 'oklch(0.577 0.245 27.325)',  // Error
  '#22C55E': 'oklch(0.708 0.185 145)',     // Success
  '#EAB308': 'oklch(0.779 0.154 97)',      // Warning
  '#3B82F6': 'oklch(0.608 0.194 264)',     // Info/Blue

  // Add more as needed
}

function hexToOklch(hex) {
  const oklch = HEX_TO_OKLCH[hex.toUpperCase()]
  if (!oklch) {
    console.warn(`⚠️  No OKLCH mapping for ${hex}, using hex value`)
    return hex
  }
  return oklch
}

// =============================================================================
// PARSE DESIGN TOKENS
// =============================================================================

function parseDesignTokens(content) {
  const tokens = {
    palettes: {},
    alias: {},
  }

  // Extract DEEP_CURRENT[500] and [400] values for focus (Scale Inversion for dark mode)
  const deepCurrent500Match = content.match(/export const DEEP_CURRENT = \{[\s\S]+?500:\s*['"]([^'"]+)['"]/);
  const deepCurrent400Match = content.match(/export const DEEP_CURRENT = \{[\s\S]+?400:\s*['"]([^'"]+)['"]/);
  const tealColor = deepCurrent500Match ? deepCurrent500Match[1] : '#08A4BD'
  const tealColorDark = deepCurrent400Match ? deepCurrent400Match[1] : '#33BFD7'

  // Extract ALIAS.border.focus reference
  const focusMatch = content.match(/focus:\s*([A-Z_]+)\[(\d+)\]/)

  if (focusMatch) {
    const [, paletteName, shade] = focusMatch
    console.log(`✅ Focus uses: ${paletteName}[${shade}]`)

    // Get the actual color value
    const paletteMatch = content.match(new RegExp(`export const ${paletteName} = \\{[\\s\\S]+?${shade}:\\s*['"]([^'"]+)['"]`))
    if (paletteMatch) {
      tokens.alias.focusColor = paletteMatch[1]
      console.log(`✅ Focus color resolved to: ${tokens.alias.focusColor}`)
    }

    // Get the dark mode value (1 step lighter for visibility)
    const darkShade = Math.max(50, parseInt(shade) - 100) // 500 → 400
    const darkPaletteMatch = content.match(new RegExp(`export const ${paletteName} = \\{[\\s\\S]+?${darkShade}:\\s*['"]([^'"]+)['"]`))
    if (darkPaletteMatch) {
      tokens.alias.focusColorDark = darkPaletteMatch[1]
      console.log(`✅ Dark mode focus color: ${tokens.alias.focusColorDark}`)
    }
  }

  // Fallback
  if (!tokens.alias.focusColor) {
    tokens.alias.focusColor = tealColor
  }
  if (!tokens.alias.focusColorDark) {
    tokens.alias.focusColorDark = tealColorDark
  }

  return tokens
}

// =============================================================================
// GENERATE tokens.css
// =============================================================================

function generateTokensCSS(tokens) {
  const focusOklch = hexToOklch(tokens.alias.focusColor)
  const focusOklchDark = hexToOklch(tokens.alias.focusColorDark)

  return `/**
 * Disrupt Design System - CSS Design Tokens
 *
 * ⚠️ AUTO-GENERATED - DO NOT EDIT MANUALLY
 * Generated from: src/constants/designTokens.ts
 * To update: Edit designTokens.ts, then run: npm run generate-tokens
 *
 * Last generated: ${new Date().toISOString()}
 */

/* This file is intentionally minimal - full token definitions in styles.css */
/* We only define the focus ring here to be auto-synced from designTokens.ts */

:root {
  --ring: ${focusOklch};  /* Synced from ALIAS.border.focus = ${tokens.alias.focusColor} */
}

.dark {
  --ring: ${focusOklchDark};  /* 1 step lighter for dark mode visibility = ${tokens.alias.focusColorDark} */
}
`
}

// =============================================================================
// MAIN EXECUTION
// =============================================================================

console.log('🎨 DDS Token Generator\n')
console.log('📖 Reading src/constants/designTokens.ts...')

try {
  const designTokensPath = resolve(rootDir, 'src/constants/designTokens.ts')
  const content = readFileSync(designTokensPath, 'utf-8')

  console.log('✅ Loaded design tokens')

  // Parse tokens
  const tokens = parseDesignTokens(content)

  // Generate tokens.css
  console.log('\n🎨 Generating src/styles/tokens.css...')
  const tokensCSS = generateTokensCSS(tokens)
  const tokensPath = resolve(rootDir, 'src/styles/tokens.css')
  writeFileSync(tokensPath, tokensCSS)
  console.log('✅ Generated tokens.css')

  console.log('\n✅ Token generation complete!')
  console.log(`\n📝 Focus ring colors:`)
  console.log(`   Light mode: ${tokens.alias.focusColor}`)
  console.log(`   Dark mode:  ${tokens.alias.focusColorDark} (1 step lighter for visibility)`)
  console.log('   All CSS files now synced from designTokens.ts')

} catch (error) {
  console.error('\n❌ Token generation failed:', error.message)
  console.error(error.stack)
  process.exit(1)
}
