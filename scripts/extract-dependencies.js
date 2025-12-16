/**
 * Design System Dependency Extractor
 *
 * Scans component files to extract:
 * - Component to Component dependencies (imports)
 * - Component to Token dependencies (designTokens usage)
 *
 * Outputs: data/dependency-graph.json
 *
 * NOTE: This script only uses fs.readFileSync and fs.writeFileSync
 * No shell commands or child processes are used.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')

// =============================================================================
// CONFIGURATION
// =============================================================================

const COMPONENT_DIRS = [
  'src/components/ui',
  'src/components/visualization',
]

// Token exports we care about tracking
const PRIMITIVE_TOKENS = [
  'ABYSS', 'DEEP_CURRENT', 'DUSK_REEF', 'CORAL', 'WAVE',
  'SUNRISE', 'ORANGE', 'HARBOR', 'SLATE', 'PRIMITIVES'
]

const ALIAS_TOKENS = ['ALIAS']

const OTHER_TOKENS = [
  'SHADOWS', 'RADIUS', 'SPACING', 'TYPOGRAPHY', 'Z_INDEX',
  'GLASS_GRADIENTS', 'ANIMATION', 'TRANSITIONS'
]

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Get all TypeScript/TSX files in a directory recursively
 */
function getFilesRecursive(dir, files = []) {
  const fullPath = path.join(ROOT_DIR, dir)
  if (!fs.existsSync(fullPath)) return files

  const entries = fs.readdirSync(fullPath, { withFileTypes: true })

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      getFilesRecursive(entryPath, files)
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      // Skip story and test files
      if (entry.name.includes('.stories.') || entry.name.includes('.test.')) {
        continue
      }
      files.push(entryPath)
    }
  }

  return files
}

/**
 * Extract component name from file path
 */
function getComponentName(filePath) {
  const fileName = path.basename(filePath, path.extname(filePath))
  // Handle index files
  if (fileName === 'index') {
    const parentDir = path.basename(path.dirname(filePath))
    return parentDir
  }
  return fileName
}

/**
 * Parse imports from file content
 */
function parseImports(content) {
  const imports = {
    components: [],
    tokens: []
  }

  // Match import statements - looking for pattern: import { X } from 'path'
  const lines = content.split('\n')

  for (const line of lines) {
    // Skip if not an import line
    if (!line.trim().startsWith('import ')) continue

    // Check if it's a design tokens import
    const isTokenImport = line.includes('designTokens')

    // Extract named imports between { }
    const braceMatch = line.match(/\{([^}]+)\}/)
    if (braceMatch) {
      const namedImports = braceMatch[1]
        .split(',')
        .map(s => s.trim().split(/\s+as\s+/)[0].trim())
        .filter(s => s && !s.startsWith('type '))

      if (isTokenImport) {
        imports.tokens.push(...namedImports)
      } else {
        // Check if it's a local component import
        const isLocalImport = line.includes("from './") ||
                              line.includes("from '../") ||
                              line.includes("from '@/")

        // Skip external packages and non-component paths
        if (!isLocalImport) continue
        if (line.includes('/utils') ||
            line.includes('/hooks') ||
            line.includes('/types') ||
            line.includes('/lib/') ||
            line.includes('/constants/')) {
          continue
        }

        // Only add uppercase names (components)
        for (const name of namedImports) {
          if (/^[A-Z]/.test(name)) {
            imports.components.push(name)
          }
        }
      }
    }

    // Check for default import
    const defaultMatch = line.match(/import\s+([A-Z]\w+)\s+from/)
    if (defaultMatch && !isTokenImport) {
      const isLocalImport = line.includes("from './") ||
                            line.includes("from '../") ||
                            line.includes("from '@/")
      if (isLocalImport) {
        imports.components.push(defaultMatch[1])
      }
    }
  }

  return imports
}

/**
 * Categorize a token name
 */
function categorizeToken(tokenName) {
  if (PRIMITIVE_TOKENS.includes(tokenName)) return 'token-scale'
  if (ALIAS_TOKENS.includes(tokenName)) return 'token-alias'
  return 'token-other'
}

// =============================================================================
// MAIN EXTRACTION
// =============================================================================

function extractDependencies() {
  console.log('Extracting design system dependencies...\n')

  const nodes = new Map() // id -> node data
  const links = [] // { source, target, type }

  // Step 1: Collect all component files
  console.log('Scanning component directories...')
  const allFiles = []
  for (const dir of COMPONENT_DIRS) {
    const files = getFilesRecursive(dir)
    allFiles.push(...files)
  }
  console.log('Found ' + allFiles.length + ' component files\n')

  // Step 2: Create component nodes
  for (const filePath of allFiles) {
    const name = getComponentName(filePath)
    const id = 'component:' + name

    // Skip if already added (handles index.ts re-exports)
    if (nodes.has(id)) continue

    const group = filePath.includes('/visualization/') ? 'visualization' : 'ui'

    nodes.set(id, {
      id: id,
      name: name,
      type: 'component',
      group: group,
      filePath: filePath,
      metadata: {
        dependencyCount: 0
      }
    })
  }

  // Step 3: Parse each file for imports
  console.log('Parsing imports...')
  for (const filePath of allFiles) {
    const fullPath = path.join(ROOT_DIR, filePath)
    const content = fs.readFileSync(fullPath, 'utf-8')
    const componentName = getComponentName(filePath)
    const componentId = 'component:' + componentName

    const { components, tokens } = parseImports(content)

    // Add component links
    for (const importedComponent of components) {
      const targetId = 'component:' + importedComponent
      if (nodes.has(targetId) && targetId !== componentId) {
        links.push({
          source: componentId,
          target: targetId,
          type: 'imports'
        })

        const node = nodes.get(componentId)
        if (node && node.metadata) {
          node.metadata.dependencyCount++
        }
      }
    }

    // Track tokens used
    for (const token of tokens) {
      const tokenId = 'token:' + token
      const tokenType = categorizeToken(token)

      // Create token node if not exists
      if (!nodes.has(tokenId)) {
        let tokenGroup = 'other'
        if (tokenType === 'token-scale') tokenGroup = 'primitives'
        if (tokenType === 'token-alias') tokenGroup = 'alias'

        nodes.set(tokenId, {
          id: tokenId,
          name: token,
          type: tokenType,
          group: tokenGroup
        })
      }

      // Add link
      links.push({
        source: componentId,
        target: tokenId,
        type: 'uses-token'
      })

      const node = nodes.get(componentId)
      if (node && node.metadata) {
        node.metadata.dependencyCount++
      }
    }
  }

  // Step 4: Build output with deduped links
  const componentCount = [...nodes.values()].filter(n => n.type === 'component').length
  const tokenCount = [...nodes.values()].filter(n => n.type.startsWith('token')).length

  const uniqueLinks = []
  const linkSet = new Set()
  for (const link of links) {
    const key = link.source + '|' + link.target + '|' + link.type
    if (!linkSet.has(key)) {
      linkSet.add(key)
      uniqueLinks.push(link)
    }
  }

  const output = {
    nodes: [...nodes.values()],
    links: uniqueLinks,
    metadata: {
      extractedAt: new Date().toISOString(),
      componentCount: componentCount,
      tokenCount: tokenCount,
      linkCount: uniqueLinks.length
    }
  }

  // Step 5: Write output
  const outputPath = path.join(ROOT_DIR, 'data', 'dependency-graph.json')
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2))

  console.log('\nExtraction complete!')
  console.log('- Components: ' + componentCount)
  console.log('- Tokens: ' + tokenCount)
  console.log('- Links: ' + uniqueLinks.length)
  console.log('\nOutput: ' + outputPath)

  return output
}

// Run extraction
extractDependencies()
