#!/usr/bin/env node
/**
 * Generate Color Intelligence
 *
 * Generates from src/data/color-intelligence.json:
 * - .claude/color-intelligence.toon  (~100 lines compressed TOON format)
 * - src/data/color-intelligence.types.ts  (TypeScript type definitions)
 *
 * Usage: npm run sync:color-intelligence
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const SOURCE_PATH = join(ROOT, 'src', 'data', 'color-intelligence.json')
const TOON_PATH = join(ROOT, '.claude', 'color-intelligence.toon')
const TYPES_PATH = join(ROOT, 'src', 'data', 'color-intelligence.types.ts')

// ANSI colors
const GREEN = '\x1b[32m'
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const CYAN = '\x1b[36m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'
const BOLD = '\x1b[1m'

// Required keys for validation
const REQUIRED_KEYS = [
  '_meta',
  'contexts',
  'boundaries',
  'harmony_principles',
  'color_properties',
  'harmony_lookup',
  'glass',
  'forbidden',
  'escapeHatch',
  'composite_rules'
]

// Color families extracted from color_properties
const COLOR_FAMILIES = [
  'ABYSS',
  'DEEP_CURRENT',
  'WAVE',
  'HARBOR',
  'CORAL',
  'SUNRISE',
  'ORANGE',
  'SLATE',
  'LINEN',
  'IVORY',
  'DUSK_REEF'
]

/**
 * Validate JSON structure
 */
function validateStructure(data) {
  const errors = []

  for (const key of REQUIRED_KEYS) {
    if (!(key in data)) {
      errors.push(`Missing required key: ${key}`)
    }
  }

  // Validate _meta has required fields
  if (data._meta) {
    if (!data._meta.version) errors.push('Missing _meta.version')
    if (!data._meta.schemaVersion) errors.push('Missing _meta.schemaVersion')
  }

  // Validate contexts is an object with entries
  if (data.contexts && typeof data.contexts === 'object') {
    if (Object.keys(data.contexts).length === 0) {
      errors.push('contexts object is empty')
    }
  }

  // Validate harmony_principles has P1-P5
  if (data.harmony_principles) {
    const expectedPrinciples = ['P1_temperature_compatibility', 'P2_semantic_separation', 'P3_family_contrast', 'P4_dominance', 'P5_semantic_priority']
    for (const p of expectedPrinciples) {
      if (!(p in data.harmony_principles)) {
        errors.push(`Missing harmony principle: ${p}`)
      }
    }
  }

  // Validate forbidden is an array
  if (data.forbidden && !Array.isArray(data.forbidden)) {
    errors.push('forbidden must be an array')
  }

  return errors
}

/**
 * Generate TOON format content (without timestamp header)
 */
function generateToonContent(data) {
  const lines = []

  // Note: Header with timestamp is added in generateToon() to allow content comparison
  // Do NOT add empty line here - it's part of the header

  // Contexts summary (13 contexts)
  lines.push('## Contexts [13]')
  lines.push('')
  const contextNames = Object.keys(data.contexts)
  for (const name of contextNames) {
    const ctx = data.contexts[name]
    const desc = ctx.description || 'No description'
    lines.push(`  ${name}: ${desc}`)
  }
  lines.push('')

  // Harmony Principles (P1-P5) as one-liners
  lines.push('## Harmony Principles')
  lines.push('')
  if (data.harmony_principles) {
    const principles = [
      { key: 'P1_temperature_compatibility', short: 'P1' },
      { key: 'P2_semantic_separation', short: 'P2' },
      { key: 'P3_family_contrast', short: 'P3' },
      { key: 'P4_dominance', short: 'P4' },
      { key: 'P5_semantic_priority', short: 'P5' }
    ]
    for (const { key, short } of principles) {
      const p = data.harmony_principles[key]
      if (p && p.rule) {
        lines.push(`  ${short}: ${p.rule}`)
      }
    }
  }
  lines.push('')

  // Forbidden patterns (5 patterns)
  lines.push('## Forbidden Patterns [5]')
  lines.push('')
  if (data.forbidden && Array.isArray(data.forbidden)) {
    for (const f of data.forbidden) {
      lines.push(`  - ${f.pattern}: ${f.reason}`)
    }
  }
  lines.push('')

  // Glass depth summary
  lines.push('## Glass Depths')
  lines.push('')
  if (data.glass) {
    if (data.glass.depth1_elevated) {
      lines.push(`  depth1: opacity=${data.glass.depth1_elevated.opacity}% blur=${data.glass.depth1_elevated.blur} (direct text OK)`)
    }
    if (data.glass.depth2_card) {
      lines.push(`  depth2: opacity=${data.glass.depth2_card.opacity}% blur=${data.glass.depth2_card.blur} (semantic or nested)`)
    }
    if (data.glass.depth3_surface) {
      lines.push(`  depth3: opacity=${data.glass.depth3_surface.opacity}% blur=${data.glass.depth3_surface.blur} (nested solid required)`)
    }
    if (data.glass.rules) {
      lines.push(`  minOpacityForDirectText: ${data.glass.rules.minOpacityForDirectText}%`)
      lines.push(`  nestedGlass: ${data.glass.rules.nestedGlass}`)
    }
  }
  lines.push('')

  // Color families with temperature
  lines.push('## Color Families [11]')
  lines.push('')
  if (data.color_properties) {
    for (const family of COLOR_FAMILIES) {
      const props = data.color_properties[family]
      if (props) {
        const semantic = props.semantic ? ` (${props.semantic})` : ''
        lines.push(`  ${family}: ${props.temperature}${semantic} - ${props.role}`)
      }
    }
  }
  lines.push('')

  // Escape hatch
  lines.push('## Escape Hatch')
  lines.push('')
  if (data.escapeHatch) {
    lines.push(`  attribute: ${data.escapeHatch.attribute}`)
    lines.push(`  usage: ${data.escapeHatch.usage}`)
  }
  lines.push('')

  // Composite rules summary
  lines.push('## Composite Rules')
  lines.push('')
  if (data.composite_rules) {
    if (data.composite_rules.valid_nesting) {
      lines.push('  valid: ' + Object.keys(data.composite_rules.valid_nesting).join(', '))
    }
    if (data.composite_rules.forbidden_nesting) {
      const patterns = data.composite_rules.forbidden_nesting.map(f => f.pattern)
      lines.push('  forbidden: ' + patterns.join(', '))
    }
    if (data.composite_rules.decision_rule) {
      lines.push(`  rule: ${data.composite_rules.decision_rule}`)
    }
  }

  return lines.join('\n')
}

/**
 * Generate TOON with header (compares content to avoid timestamp churn)
 */
function generateToon(data, existingContent) {
  const content = generateToonContent(data)

  // Extract existing content without header (first 5 lines: 4 comments + 1 empty)
  const existingWithoutHeader = existingContent
    ? existingContent.split('\n').slice(5).join('\n')
    : null

  // If content hasn't changed, return null to signal no update needed
  if (existingWithoutHeader === content) {
    return null
  }

  // Content changed - generate new file with fresh timestamp
  const header = [
    '# Color Intelligence (TOON)',
    `# Generated: ${new Date().toISOString()}`,
    '# Source: src/data/color-intelligence.json',
    '# Use MCP tools for queries: mcp__dds__get_color_guidance, mcp__dds__check_contrast',
    '' // Empty line before content
  ].join('\n')

  return header + content
}

/**
 * Generate TypeScript type definitions (without timestamp - added separately)
 */
function generateTypesContent(data) {
  const lines = []

  // Note: Header with timestamp is added in generateTypes() to allow content comparison
  // Do NOT add empty line here - it's part of the header

  // ContextName type union (13 contexts)
  const contextNames = Object.keys(data.contexts)
  lines.push('/** All available context names (13 total) */')
  lines.push(`export type ContextName = ${contextNames.map(n => `'${n}'`).join(' | ')};`)
  lines.push('')

  // Theme type
  lines.push('/** Theme variants */')
  lines.push("export type Theme = 'light' | 'dark';")
  lines.push('')

  // ColorFamily type union (11 families)
  lines.push('/** Color families (11 total) */')
  lines.push(`export type ColorFamily = ${COLOR_FAMILIES.map(f => `'${f}'`).join(' | ')};`)
  lines.push('')

  // Temperature type
  lines.push('/** Color temperature classifications */')
  lines.push("export type Temperature = 'cool' | 'neutral-cool' | 'neutral' | 'neutral-warm' | 'warm';")
  lines.push('')

  // SemanticMeaning type
  lines.push('/** Semantic color meanings */')
  lines.push("export type SemanticMeaning = 'brand' | 'error' | 'warning' | 'success' | 'info' | 'highlight' | null;")
  lines.push('')

  // GlassRules interface
  lines.push('/** Glass morphism rules */')
  lines.push('export interface GlassRules {')
  lines.push('  minOpacityForDirectText: number;')
  lines.push('  minOpacityForSemanticText: number;')
  lines.push('  belowMinOpacity: string;')
  lines.push('  backdropBlurRequired: boolean;')
  lines.push('  nestedGlass: string;')
  lines.push('  textPlacementDecisionTree: string[];')
  lines.push('}')
  lines.push('')

  // GlassDepth interface
  lines.push('/** Individual glass depth configuration */')
  lines.push('export interface GlassDepth {')
  lines.push('  opacity: number;')
  lines.push('  blur: string;')
  lines.push('  light: string;')
  lines.push('  dark: string;')
  lines.push('  textStrategy: string;')
  lines.push('  textColor: string;')
  lines.push('  notes: string;')
  lines.push('  border?: string;')
  lines.push('}')
  lines.push('')

  // HarmonyEntry interface
  lines.push('/** Harmony lookup entry for a color family */')
  lines.push('export interface HarmonyEntry {')
  lines.push('  companions: ColorFamily[];')
  lines.push('  accents: ColorFamily[];')
  lines.push('  avoid: ColorFamily[];')
  lines.push('  avoid_reason: string;')
  lines.push('}')
  lines.push('')

  // HarmonyLookup interface
  lines.push('/** Full harmony lookup table */')
  lines.push('export interface HarmonyLookup {')
  lines.push('  _note?: string;')
  lines.push('  [family: string]: HarmonyEntry | string | undefined;')
  lines.push('}')
  lines.push('')

  // ColorContext interface
  lines.push('/** Color context configuration */')
  lines.push('export interface ColorContext {')
  lines.push('  description: string;')
  lines.push('  depth?: number;')
  lines.push('  solid?: {')
  lines.push('    light: { bg: string; hex: string };')
  lines.push('    dark: { bg: string; hex: string };')
  lines.push('  };')
  lines.push('  glass?: {')
  lines.push('    light: string;')
  lines.push('    dark: string;')
  lines.push('  };')
  lines.push('  text?: {')
  lines.push('    primary: string;')
  lines.push('    secondary?: string;')
  lines.push('    muted?: string;')
  lines.push('  };')
  lines.push('  border?: string;')
  lines.push('  shadow?: string;')
  lines.push('  note?: string;')
  lines.push('  [key: string]: unknown;')
  lines.push('}')
  lines.push('')

  // ColorIntelligence main interface
  lines.push('/** Main color intelligence structure */')
  lines.push('export interface ColorIntelligence {')
  lines.push('  _meta: {')
  lines.push('    version: string;')
  lines.push('    generated: string;')
  lines.push('    source: string;')
  lines.push('    schemaVersion: string;')
  lines.push('    description: string;')
  lines.push('  };')
  lines.push('  contexts: Record<ContextName, ColorContext>;')
  lines.push('  boundaries: {')
  lines.push('    _note: string;')
  lines.push('    dark_backgrounds: Record<string, unknown>;')
  lines.push('    light_backgrounds: Record<string, unknown>;')
  lines.push('    semantic_backgrounds: Record<string, unknown>;')
  lines.push('  };')
  lines.push('  harmony_principles: Record<string, unknown>;')
  lines.push('  color_properties: Record<ColorFamily, {')
  lines.push('    temperature: Temperature;')
  lines.push('    semantic: SemanticMeaning;')
  lines.push('    role: string;')
  lines.push('    compatible_temps: Temperature[];')
  lines.push('    note?: string;')
  lines.push('  }>;')
  lines.push('  harmony_lookup: HarmonyLookup;')
  lines.push('  glass: {')
  lines.push('    depth1_elevated: GlassDepth;')
  lines.push('    depth2_card: GlassDepth;')
  lines.push('    depth3_surface: GlassDepth;')
  lines.push('    rules: GlassRules;')
  lines.push('    examples: {')
  lines.push('      correct: string[];')
  lines.push('      forbidden: string[];')
  lines.push('    };')
  lines.push('  };')
  lines.push('  forbidden: Array<{')
  lines.push('    pattern: string;')
  lines.push('    examples: string[];')
  lines.push('    reason: string;')
  lines.push('    exceptions: Array<{ pattern: string; context: string; reason: string }> | [];')
  lines.push('  }>;')
  lines.push('  escapeHatch: {')
  lines.push('    attribute: string;')
  lines.push('    usage: string;')
  lines.push('    example: string;')
  lines.push('    note: string;')
  lines.push('    validReasons: string[];')
  lines.push('  };')
  lines.push('  composite_rules: {')
  lines.push('    _note: string;')
  lines.push('    valid_nesting: Record<string, {')
  lines.push('      description: string;')
  lines.push('      behavior: string;')
  lines.push('      example: string;')
  lines.push('    }>;')
  lines.push('    forbidden_nesting: Array<{')
  lines.push('      pattern: string;')
  lines.push('      reason: string;')
  lines.push('      fix: string;')
  lines.push('    }>;')
  lines.push('    decision_rule: string;')
  lines.push('  };')
  lines.push('}')
  lines.push('')

  return lines.join('\n')
}

/**
 * Generate TypeScript types with header (compares content to avoid timestamp churn)
 */
function generateTypes(data, existingContent) {
  const content = generateTypesContent(data)

  // Extract existing content without the header (first 4 lines)
  const existingWithoutHeader = existingContent
    ? existingContent.split('\n').slice(4).join('\n')
    : null

  // If content hasn't changed, return existing file as-is (preserves timestamp)
  if (existingWithoutHeader === content) {
    return null // Signal: no update needed
  }

  // Content changed - generate new file with fresh timestamp
  const header = [
    '// Auto-generated - DO NOT EDIT',
    '// Generated from: src/data/color-intelligence.json',
    `// Generated at: ${new Date().toISOString()}`,
    '' // Empty line before content
  ].join('\n')

  return header + content
}

/**
 * Format file size for display
 */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`
  return `${(bytes / 1024).toFixed(1)}KB`
}

/**
 * Main
 */
function main() {
  console.log(`\n${BOLD}Generate Color Intelligence${RESET}`)
  console.log('-'.repeat(40))

  // Check source file exists
  if (!existsSync(SOURCE_PATH)) {
    console.log(`${RED}!${RESET} Source file not found: ${SOURCE_PATH}`)
    process.exit(1)
  }

  // Read and parse source
  console.log(`${CYAN}>${RESET} Reading color-intelligence.json...`)
  let data
  try {
    const content = readFileSync(SOURCE_PATH, 'utf8')
    data = JSON.parse(content)
  } catch (err) {
    console.log(`${RED}!${RESET} Failed to parse JSON: ${err.message}`)
    process.exit(1)
  }

  // Validate structure
  console.log(`${CYAN}>${RESET} Validating JSON structure...`)
  const errors = validateStructure(data)
  if (errors.length > 0) {
    console.log(`${RED}!${RESET} Validation failed:`)
    for (const err of errors) {
      console.log(`${RED}  - ${err}${RESET}`)
    }
    process.exit(1)
  }
  console.log(`${DIM}  All ${REQUIRED_KEYS.length} required keys present${RESET}`)
  console.log(`${DIM}  ${Object.keys(data.contexts).length} contexts found${RESET}`)

  // Generate TOON (only if content changed)
  console.log(`${CYAN}>${RESET} Generating color-intelligence.toon...`)
  const existingToon = existsSync(TOON_PATH) ? readFileSync(TOON_PATH, 'utf8') : null
  const toonContent = generateToon(data, existingToon)

  let toonSize, toonLines
  if (toonContent === null) {
    console.log(`${GREEN}✓${RESET} TOON unchanged - skipping write`)
    toonSize = existingToon.length
    toonLines = existingToon.split('\n').length
  } else {
    writeFileSync(TOON_PATH, toonContent)
    toonSize = toonContent.length
    toonLines = toonContent.split('\n').length
    console.log(`${DIM}  ${toonLines} lines, ${formatSize(toonSize)}${RESET}`)
  }

  // Generate TypeScript types (only if content changed)
  console.log(`${CYAN}>${RESET} Generating color-intelligence.types.ts...`)
  const existingTypes = existsSync(TYPES_PATH) ? readFileSync(TYPES_PATH, 'utf8') : null
  const typesContent = generateTypes(data, existingTypes)

  if (typesContent === null) {
    console.log(`${GREEN}✓${RESET} Types unchanged - skipping write`)
    var typesSize = existingTypes.length
  } else {
    writeFileSync(TYPES_PATH, typesContent)
    var typesSize = typesContent.length
    console.log(`${DIM}  ${formatSize(typesSize)}${RESET}`)
  }

  // Summary
  const sourceSize = readFileSync(SOURCE_PATH, 'utf8').length
  const timestamp = new Date().toISOString()

  console.log('')
  console.log(`${GREEN}+${RESET} Generated at ${timestamp}`)
  console.log(`${DIM}  Source: ${formatSize(sourceSize)} -> TOON: ${formatSize(toonSize)} (${Math.round((1 - toonSize / sourceSize) * 100)}% smaller)${RESET}`)
  console.log(`${DIM}  Types: ${formatSize(typesSize)}${RESET}`)
  console.log('')
}

main()
