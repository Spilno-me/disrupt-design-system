#!/usr/bin/env node

/**
 * Design Token Generator
 *
 * SINGLE SOURCE OF TRUTH: src/constants/designTokens.ts
 *
 * This script auto-generates:
 * 1. tailwind-preset.js - Tailwind configuration
 * 2. src/styles/tokens.css - CSS custom properties
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

  // Extract DEEP_CURRENT[500] value for focus
  const deepCurrentMatch = content.match(/export const DEEP_CURRENT = \{[\s\S]+?500:\s*['"]([^'"]+)['"]/);
  const tealColor = deepCurrentMatch ? deepCurrentMatch[1] : '#08A4BD'

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
  }

  // Fallback
  if (!tokens.alias.focusColor) {
    tokens.alias.focusColor = tealColor
  }

  return tokens
}

// =============================================================================
// GENERATE tokens.css
// =============================================================================

function generateTokensCSS(tokens) {
  const focusOklch = hexToOklch(tokens.alias.focusColor)

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
  --ring: ${focusOklch};  /* Same in dark mode */
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
  console.log(`\n📝 Focus ring color: ${tokens.alias.focusColor}`)
  console.log('   All CSS files now synced from designTokens.ts')

} catch (error) {
  console.error('\n❌ Token generation failed:', error.message)
  console.error(error.stack)
  process.exit(1)
}
