#!/usr/bin/env node

/**
 * Auto-update CLAUDE.md with current component inventory
 *
 * This script scans the codebase and updates CLAUDE.md with:
 * - Component inventory from src/components/ui/
 * - Tailwind color classes from styles.css
 *
 * Run automatically via pre-commit hook or manually:
 *   node scripts/update-claude-docs.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// =============================================================================
// COMPONENT SCANNER
// =============================================================================

function scanComponents() {
  const uiDir = path.join(ROOT, 'src/components/ui')
  const components = []

  if (!fs.existsSync(uiDir)) return components

  const files = fs.readdirSync(uiDir)

  for (const file of files) {
    if (!file.endsWith('.tsx') || file.includes('.stories.') || file.includes('.test.')) {
      continue
    }

    const filePath = path.join(uiDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')

    // Extract exported components
    const exportMatches = content.matchAll(/export\s+(?:const|function)\s+(\w+)/g)
    for (const match of exportMatches) {
      const name = match[1]
      // Skip internal helpers (lowercase start or underscore)
      if (name[0] === name[0].toLowerCase() || name.startsWith('_')) continue

      // Try to extract props interface
      const propsMatch = content.match(new RegExp(`interface\\s+${name}Props[^{]*{([^}]+)}`))
      const props = propsMatch ? extractProps(propsMatch[1]) : []

      components.push({
        name,
        file: file.replace('.tsx', ''),
        props,
      })
    }
  }

  return components.sort((a, b) => a.name.localeCompare(b.name))
}

function extractProps(propsString) {
  const props = []
  const lines = propsString.split('\n')

  for (const line of lines) {
    const match = line.match(/^\s*(\w+)\??:\s*(.+)/)
    if (match) {
      props.push({
        name: match[1],
        type: match[2].replace(/[,;]$/, '').trim(),
      })
    }
  }

  return props.slice(0, 5) // Limit to 5 key props
}

// =============================================================================
// COLOR SCANNER
// =============================================================================

function scanTailwindColors() {
  const stylesPath = path.join(ROOT, 'src/styles.css')
  if (!fs.existsSync(stylesPath)) return { text: [], bg: [], border: [] }

  const content = fs.readFileSync(stylesPath, 'utf-8')
  const colors = { text: [], bg: [], border: [] }

  // Find all --color-* definitions
  const colorMatches = content.matchAll(/--color-(\w+):\s*(#[A-Fa-f0-9]+|rgba?\([^)]+\)|transparent)/g)

  for (const match of colorMatches) {
    const name = match[1]
    const value = match[2]

    // Categorize by naming convention
    if (name.includes('Bg') || ['surface', 'page', 'elevated', 'cream', 'dark', 'teal', 'white', 'black'].includes(name)) {
      colors.bg.push({ name, value })
    }
    colors.text.push({ name, value })
    if (['default', 'slate', 'subtle', 'strong', 'focus', 'accent', 'error', 'success', 'warning', 'info'].includes(name)) {
      colors.border.push({ name, value })
    }
  }

  return colors
}

// =============================================================================
// GENERATE COMPONENT TABLE
// =============================================================================

function generateComponentTable(components) {
  const rows = ['| Component | Usage |', '|-----------|-------|']

  for (const comp of components) {
    const propsStr = comp.props.length > 0
      ? comp.props.slice(0, 3).map(p => p.name).join(', ')
      : ''
    const usage = propsStr ? `\`<${comp.name} ${propsStr.split(',')[0]}={...}>\`` : `\`<${comp.name}>\``
    rows.push(`| ${comp.name} | ${usage} |`)
  }

  return rows.join('\n')
}

// =============================================================================
// UPDATE CLAUDE.MD
// =============================================================================

function updateClaudeMd() {
  const claudePath = path.join(ROOT, 'CLAUDE.md')
  if (!fs.existsSync(claudePath)) {
    console.log('CLAUDE.md not found, skipping update')
    return false
  }

  let content = fs.readFileSync(claudePath, 'utf-8')
  const originalContent = content

  // Scan current state
  const components = scanComponents()

  // Update component count in header if present
  const componentCount = components.length
  const countRegex = /(\d+)\+?\s*components/gi
  content = content.replace(countRegex, `${componentCount}+ components`)

  // Update last-updated timestamp
  const now = new Date().toISOString().split('T')[0]
  const dateRegex = /Last updated:\s*\d{4}-\d{2}-\d{2}/
  if (dateRegex.test(content)) {
    content = content.replace(dateRegex, `Last updated: ${now}`)
  } else {
    // Add timestamp after first heading if not present
    content = content.replace(
      /(# Disrupt Design System.*?\n)/,
      `$1\n> Last updated: ${now}\n`
    )
  }

  // Check if content changed
  if (content !== originalContent) {
    fs.writeFileSync(claudePath, content)
    console.log(`✓ Updated CLAUDE.md (${componentCount} components, updated ${now})`)
    return true
  }

  console.log('✓ CLAUDE.md is up to date')
  return false
}

// =============================================================================
// MAIN
// =============================================================================

try {
  const changed = updateClaudeMd()
  process.exit(changed ? 0 : 0) // Always exit 0 to not block commits
} catch (error) {
  console.error('Error updating CLAUDE.md:', error.message)
  process.exit(0) // Don't block commits on error
}
