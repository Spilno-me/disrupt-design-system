#!/usr/bin/env node
/**
 * Sync Prompt Library
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Generates .claude/prompt-library.md from the single source of truth:
 * src/components/shared/PromptLibrary/prompts.ts
 *
 * This ensures Claude agents and Storybook always show the same prompts.
 *
 * Usage: npm run sync:prompts
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const PROMPTS_SOURCE = join(ROOT, 'src', 'components', 'shared', 'PromptLibrary', 'prompts.ts')
const OUTPUT_PATH = join(ROOT, '.claude', 'prompt-library.md')

// ═══════════════════════════════════════════════════════════════════════════
// ANSI Formatting
// ═══════════════════════════════════════════════════════════════════════════

const COLORS = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
}

const log = {
  success: (msg) => console.log(`${COLORS.green}✓${COLORS.reset} ${msg}`),
  info: (msg) => console.log(`${COLORS.cyan}→${COLORS.reset} ${msg}`),
  dim: (msg) => console.log(`${COLORS.dim}${msg}${COLORS.reset}`),
}

// ═══════════════════════════════════════════════════════════════════════════
// Parse Prompts from TypeScript
// ═══════════════════════════════════════════════════════════════════════════

function parsePrompts(content) {
  const prompts = []

  // Match each prompt object in the array
  const promptRegex = /\{\s*id:\s*['"]([^'"]+)['"]/g
  const matches = [...content.matchAll(promptRegex)]

  for (const match of matches) {
    const startIndex = match.index
    let braceCount = 0
    let endIndex = startIndex

    // Find the matching closing brace
    for (let i = startIndex; i < content.length; i++) {
      if (content[i] === '{') braceCount++
      if (content[i] === '}') braceCount--
      if (braceCount === 0) {
        endIndex = i + 1
        break
      }
    }

    const promptStr = content.slice(startIndex, endIndex)

    // Extract fields
    const id = match[1]
    const titleMatch = promptStr.match(/title:\s*['"]([^'"]+)['"]/)
    const categoryMatch = promptStr.match(/category:\s*['"]([^'"]+)['"]/)
    const descriptionMatch = promptStr.match(/description:\s*['"]([^'"]+)['"]/)

    // Extract prompt content (handles template literals)
    let promptContent = ''
    const promptMatch = promptStr.match(/prompt:\s*`([\s\S]*?)`/)
    if (promptMatch) {
      promptContent = promptMatch[1]
        .replace(/\\`/g, '`')
        .replace(/\\\\/g, '\\')
        .trim()
    }

    // Extract variables
    const variablesMatch = promptStr.match(/variables:\s*\[([^\]]*)\]/)
    const variables = variablesMatch
      ? variablesMatch[1].match(/['"]([^'"]+)['"]/g)?.map((v) => v.replace(/['"]/g, '')) || []
      : []

    if (titleMatch && promptContent) {
      prompts.push({
        id,
        title: titleMatch[1],
        category: categoryMatch ? categoryMatch[1] : 'general',
        description: descriptionMatch ? descriptionMatch[1] : '',
        variables,
        prompt: promptContent,
      })
    }
  }

  return prompts
}

// ═══════════════════════════════════════════════════════════════════════════
// Generate Markdown
// ═══════════════════════════════════════════════════════════════════════════

function generateMarkdown(prompts) {
  const lines = [
    '# DDS Prompt Library',
    '',
    '> ⚠️ **AUTO-GENERATED** - Do not edit directly!',
    '> Edit `src/components/shared/PromptLibrary/prompts.ts` instead.',
    '> Run `npm run sync:prompts` to regenerate.',
    '',
    '**Human-to-Agent prompt templates for consistent, high-quality results.**',
    '',
    'Copy the prompt, replace `{VARIABLE}` with your actual values, paste to agent.',
    '',
    '---',
    '',
  ]

  // Group by category
  const byCategory = prompts.reduce((acc, prompt) => {
    const cat = prompt.category || 'general'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(prompt)
    return acc
  }, {})

  // Category display names
  const categoryNames = {
    stories: 'Story Creation',
    components: 'Component Development',
    tokens: 'Token Operations',
    documentation: 'Documentation',
    review: 'Review & Validation',
    general: 'General',
  }

  for (const [category, categoryPrompts] of Object.entries(byCategory)) {
    const displayName = categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1)

    lines.push(`## ${displayName}`)
    lines.push('')

    for (const prompt of categoryPrompts) {
      lines.push(`### ${prompt.title}`)
      lines.push('')

      if (prompt.description) {
        lines.push(`*${prompt.description}*`)
        lines.push('')
      }

      if (prompt.variables.length > 0) {
        lines.push(`**Variables:** ${prompt.variables.map((v) => `\`{${v}}\``).join(', ')}`)
        lines.push('')
      }

      lines.push('```')
      lines.push(prompt.prompt)
      lines.push('```')
      lines.push('')
    }

    lines.push('---')
    lines.push('')
  }

  // Add footer
  lines.push('## Adding New Prompts')
  lines.push('')
  lines.push('Edit `src/components/shared/PromptLibrary/prompts.ts` and run:')
  lines.push('')
  lines.push('```bash')
  lines.push('npm run sync:prompts')
  lines.push('```')
  lines.push('')
  lines.push('The prompt will appear in both Storybook and this file automatically.')

  return lines.join('\n')
}

// ═══════════════════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════════════════

function main() {
  console.log(`\n${COLORS.bold}Sync Prompt Library${COLORS.reset}`)
  console.log('─'.repeat(40))

  if (!existsSync(PROMPTS_SOURCE)) {
    log.info(`Source file not found: ${PROMPTS_SOURCE}`)
    log.dim('Skipping prompt library sync')
    return
  }

  log.info('Reading prompts from source...')
  const content = readFileSync(PROMPTS_SOURCE, 'utf8')

  log.info('Parsing prompt definitions...')
  const prompts = parsePrompts(content)
  log.dim(`  Found ${prompts.length} prompts`)

  log.info('Generating markdown...')
  const markdown = generateMarkdown(prompts)

  // Check if content changed
  let changed = true
  if (existsSync(OUTPUT_PATH)) {
    const existing = readFileSync(OUTPUT_PATH, 'utf8')
    changed = existing !== markdown
  }

  if (changed) {
    writeFileSync(OUTPUT_PATH, markdown)
    log.success(`Updated ${OUTPUT_PATH}`)
  } else {
    log.success('prompt-library.md is already in sync')
  }

  console.log('')
}

main()
