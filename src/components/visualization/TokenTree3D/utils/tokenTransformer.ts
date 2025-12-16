/**
 * Token Transformer
 * Converts design tokens from designTokens.ts into TreeNode hierarchy
 *
 * Note: This utility intentionally imports Tier 1 primitives to visualize
 * the complete token hierarchy. It's not using them for styling.
 */

/* eslint-disable no-restricted-syntax */

import type { TreeNode } from '../types'
import {
  ABYSS,
  DEEP_CURRENT,
  DUSK_REEF,
  CORAL,
  WAVE,
  SUNRISE,
  ORANGE,
  HARBOR,
  SLATE,
  PRIMITIVES,
  ALIAS,
  SHADOWS,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
  Z_INDEX,
} from '@/constants/designTokens'

/** Color scale definition for transformation */
interface ColorScale {
  name: string
  scale: Record<string | number, string>
  description?: string
}

/** All brand color scales */
const COLOR_SCALES: ColorScale[] = [
  { name: 'ABYSS', scale: ABYSS, description: 'Dark neutral scale' },
  { name: 'DEEP_CURRENT', scale: DEEP_CURRENT, description: 'Teal/Turquoise' },
  { name: 'DUSK_REEF', scale: DUSK_REEF, description: 'Purple/Violet' },
  { name: 'CORAL', scale: CORAL, description: 'Red/Crimson' },
  { name: 'WAVE', scale: WAVE, description: 'Blue scale' },
  { name: 'SUNRISE', scale: SUNRISE, description: 'Yellow/Gold' },
  { name: 'ORANGE', scale: ORANGE, description: 'Orange scale' },
  { name: 'HARBOR', scale: HARBOR, description: 'Green scale' },
  { name: 'SLATE', scale: SLATE, description: 'Neutral gray' },
]

/**
 * Transform all design tokens into a hierarchical tree structure
 */
export function transformTokensToTree(): TreeNode {
  const root: TreeNode = {
    id: 'root',
    name: 'Design System',
    type: 'root',
    depth: 0,
    children: [],
    metadata: {
      usage: 'Disrupt Design System token hierarchy',
      childCount: 0,
    },
  }

  // Add Tier 1: Primitives
  root.children.push(transformPrimitives())

  // Add Tier 2: Alias
  root.children.push(transformAlias())

  // Add other token categories
  root.children.push(transformShadows())
  root.children.push(transformRadius())
  root.children.push(transformSpacing())
  root.children.push(transformTypography())
  root.children.push(transformZIndex())

  // Update root child count
  root.metadata!.childCount = root.children.length

  return root
}

/**
 * Transform Tier 1 Primitives (color scales)
 */
function transformPrimitives(): TreeNode {
  const primitives: TreeNode = {
    id: 'primitives',
    name: 'Primitives',
    type: 'category',
    depth: 1,
    children: [],
    metadata: {
      tier: 1,
      usage: 'Raw color values - source of truth',
    },
  }

  // Add color scales
  COLOR_SCALES.forEach(({ name, scale, description }) => {
    const scaleNode: TreeNode = {
      id: `scale-${name.toLowerCase()}`,
      name,
      type: 'scale',
      depth: 2,
      value: scale[500] as string, // Base shade for preview
      parentId: 'primitives',
      children: [],
      metadata: {
        tokenPath: name,
        usage: description,
        childCount: Object.keys(scale).length,
      },
    }

    // Add individual shades
    Object.entries(scale).forEach(([shade, hex]) => {
      scaleNode.children.push({
        id: `${name.toLowerCase()}-${shade}`,
        name: shade,
        type: 'value',
        depth: 3,
        value: hex,
        parentId: scaleNode.id,
        children: [],
        metadata: {
          tokenPath: `${name}[${shade}]`,
        },
      })
    })

    primitives.children.push(scaleNode)
  })

  // Add base primitives (white, black, cream, linkedIn)
  const basePrimitivesNode: TreeNode = {
    id: 'scale-base',
    name: 'Base',
    type: 'scale',
    depth: 2,
    parentId: 'primitives',
    children: [],
    metadata: {
      tokenPath: 'PRIMITIVES',
      usage: 'Single-value base colors',
      childCount: Object.keys(PRIMITIVES).length,
    },
  }

  Object.entries(PRIMITIVES).forEach(([name, hex]) => {
    basePrimitivesNode.children.push({
      id: `primitive-${name}`,
      name,
      type: 'value',
      depth: 3,
      value: hex,
      parentId: basePrimitivesNode.id,
      children: [],
      metadata: {
        tokenPath: `PRIMITIVES.${name}`,
      },
    })
  })

  primitives.children.push(basePrimitivesNode)
  primitives.metadata!.childCount = primitives.children.length

  return primitives
}

/**
 * Transform Tier 2 Alias tokens
 */
function transformAlias(): TreeNode {
  const alias: TreeNode = {
    id: 'alias',
    name: 'Alias',
    type: 'category',
    depth: 1,
    children: [],
    metadata: {
      tier: 2,
      usage: 'Semantic tokens - use these in components',
    },
  }

  // Transform each ALIAS category
  const aliasCategories: { key: keyof typeof ALIAS; name: string; usage: string }[] = [
    { key: 'text', name: 'Text', usage: 'Text colors' },
    { key: 'background', name: 'Background', usage: 'Background colors' },
    { key: 'border', name: 'Border', usage: 'Border colors' },
    { key: 'icon', name: 'Icon', usage: 'Icon colors' },
    { key: 'interactive', name: 'Interactive', usage: 'Interactive element colors' },
    { key: 'status', name: 'Status', usage: 'Status indicator colors' },
    { key: 'overlay', name: 'Overlay', usage: 'Overlay/backdrop colors' },
    { key: 'gradient', name: 'Gradient', usage: 'Gradient definitions' },
    { key: 'shadow', name: 'Shadow', usage: 'Shadow definitions' },
    { key: 'brand', name: 'Brand', usage: 'Brand accent colors' },
    { key: 'feature', name: 'Feature', usage: 'Feature indicator colors' },
    { key: 'aging', name: 'Aging', usage: 'Aging/urgent indicators' },
    { key: 'animation', name: 'Animation', usage: 'Animation/particle colors' },
    { key: 'electric', name: 'Electric', usage: 'Electric effect colors' },
  ]

  aliasCategories.forEach(({ key, name, usage }) => {
    const category = ALIAS[key]
    if (typeof category !== 'object') return

    const categoryNode: TreeNode = {
      id: `alias-${key}`,
      name,
      type: 'token',
      depth: 2,
      parentId: 'alias',
      children: [],
      metadata: {
        tokenPath: `ALIAS.${key}`,
        usage,
      },
    }

    // Add individual tokens (skip functions and complex values)
    Object.entries(category).forEach(([tokenName, tokenValue]) => {
      if (typeof tokenValue === 'function') return

      const valueStr = String(tokenValue)
      categoryNode.children.push({
        id: `alias-${key}-${tokenName}`,
        name: tokenName,
        type: 'value',
        depth: 3,
        value: valueStr.startsWith('#') || valueStr.startsWith('rgb') ? valueStr : undefined,
        parentId: categoryNode.id,
        children: [],
        metadata: {
          tokenPath: `ALIAS.${key}.${tokenName}`,
        },
      })
    })

    categoryNode.metadata!.childCount = categoryNode.children.length
    alias.children.push(categoryNode)
  })

  alias.metadata!.childCount = alias.children.length

  return alias
}

/**
 * Transform SHADOWS tokens
 */
function transformShadows(): TreeNode {
  const shadows: TreeNode = {
    id: 'shadows',
    name: 'Shadows',
    type: 'category',
    depth: 1,
    children: [],
    metadata: {
      usage: 'Elevation system with natural light physics',
    },
  }

  Object.entries(SHADOWS).forEach(([name, value]) => {
    shadows.children.push({
      id: `shadow-${name}`,
      name,
      type: 'value',
      depth: 2,
      parentId: 'shadows',
      children: [],
      metadata: {
        tokenPath: `SHADOWS.${name}`,
        usage: value === 'none' ? 'No shadow' : `Shadow level: ${name}`,
      },
    })
  })

  shadows.metadata!.childCount = shadows.children.length

  return shadows
}

/**
 * Transform RADIUS tokens
 */
function transformRadius(): TreeNode {
  const radius: TreeNode = {
    id: 'radius',
    name: 'Radius',
    type: 'category',
    depth: 1,
    children: [],
    metadata: {
      usage: 'Border radius scale',
    },
  }

  Object.entries(RADIUS).forEach(([name, value]) => {
    radius.children.push({
      id: `radius-${name}`,
      name,
      type: 'value',
      depth: 2,
      value: value,
      parentId: 'radius',
      children: [],
      metadata: {
        tokenPath: `RADIUS.${name}`,
      },
    })
  })

  radius.metadata!.childCount = radius.children.length

  return radius
}

/**
 * Transform SPACING tokens
 */
function transformSpacing(): TreeNode {
  const spacing: TreeNode = {
    id: 'spacing',
    name: 'Spacing',
    type: 'category',
    depth: 1,
    children: [],
    metadata: {
      usage: 'Layout spacing system (4px base)',
    },
  }

  // Add px values
  if (SPACING.px) {
    const pxNode: TreeNode = {
      id: 'spacing-px',
      name: 'Pixel Values',
      type: 'token',
      depth: 2,
      parentId: 'spacing',
      children: [],
      metadata: {
        tokenPath: 'SPACING.px',
        usage: 'Pixel-based spacing for inline styles',
      },
    }

    Object.entries(SPACING.px).forEach(([name, value]) => {
      pxNode.children.push({
        id: `spacing-px-${name}`,
        name,
        type: 'value',
        depth: 3,
        value: value,
        parentId: pxNode.id,
        children: [],
        metadata: {
          tokenPath: `SPACING.px.${name}`,
        },
      })
    })

    pxNode.metadata!.childCount = pxNode.children.length
    spacing.children.push(pxNode)
  }

  spacing.metadata!.childCount = spacing.children.length

  return spacing
}

/**
 * Transform TYPOGRAPHY tokens
 */
function transformTypography(): TreeNode {
  const typography: TreeNode = {
    id: 'typography',
    name: 'Typography',
    type: 'category',
    depth: 1,
    children: [],
    metadata: {
      usage: 'Font families, sizes, and weights',
    },
  }

  // Font families
  if (TYPOGRAPHY.fontFamily) {
    const familyNode: TreeNode = {
      id: 'typography-family',
      name: 'Font Family',
      type: 'token',
      depth: 2,
      parentId: 'typography',
      children: [],
      metadata: {
        tokenPath: 'TYPOGRAPHY.fontFamily',
      },
    }

    Object.entries(TYPOGRAPHY.fontFamily).forEach(([name, value]) => {
      familyNode.children.push({
        id: `typography-family-${name}`,
        name,
        type: 'value',
        depth: 3,
        parentId: familyNode.id,
        children: [],
        metadata: {
          tokenPath: `TYPOGRAPHY.fontFamily.${name}`,
          usage: value,
        },
      })
    })

    familyNode.metadata!.childCount = familyNode.children.length
    typography.children.push(familyNode)
  }

  // Font weights
  if (TYPOGRAPHY.fontWeight) {
    const weightNode: TreeNode = {
      id: 'typography-weight',
      name: 'Font Weight',
      type: 'token',
      depth: 2,
      parentId: 'typography',
      children: [],
      metadata: {
        tokenPath: 'TYPOGRAPHY.fontWeight',
      },
    }

    Object.entries(TYPOGRAPHY.fontWeight).forEach(([name, value]) => {
      weightNode.children.push({
        id: `typography-weight-${name}`,
        name,
        type: 'value',
        depth: 3,
        value: value,
        parentId: weightNode.id,
        children: [],
        metadata: {
          tokenPath: `TYPOGRAPHY.fontWeight.${name}`,
        },
      })
    })

    weightNode.metadata!.childCount = weightNode.children.length
    typography.children.push(weightNode)
  }

  typography.metadata!.childCount = typography.children.length

  return typography
}

/**
 * Transform Z_INDEX tokens
 */
function transformZIndex(): TreeNode {
  const zIndex: TreeNode = {
    id: 'z-index',
    name: 'Z-Index',
    type: 'category',
    depth: 1,
    children: [],
    metadata: {
      usage: 'Layer stacking order',
    },
  }

  Object.entries(Z_INDEX).forEach(([name, value]) => {
    zIndex.children.push({
      id: `z-index-${name}`,
      name,
      type: 'value',
      depth: 2,
      value: String(value),
      parentId: 'z-index',
      children: [],
      metadata: {
        tokenPath: `Z_INDEX.${name}`,
      },
    })
  })

  zIndex.metadata!.childCount = zIndex.children.length

  return zIndex
}

/**
 * Count total nodes in a tree
 */
export function countNodes(node: TreeNode): number {
  return 1 + node.children.reduce((sum, child) => sum + countNodes(child), 0)
}

/**
 * Flatten tree to array of all nodes
 */
export function flattenTree(node: TreeNode): TreeNode[] {
  const result: TreeNode[] = [node]
  node.children.forEach((child) => {
    result.push(...flattenTree(child))
  })
  return result
}

/**
 * Find a node by ID
 */
export function findNodeById(root: TreeNode, id: string): TreeNode | null {
  if (root.id === id) return root
  for (const child of root.children) {
    const found = findNodeById(child, id)
    if (found) return found
  }
  return null
}
