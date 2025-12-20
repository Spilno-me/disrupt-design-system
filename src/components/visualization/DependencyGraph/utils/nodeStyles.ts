/**
 * Node style utilities for DependencyGraph
 *
 * Note: This visualization uses hardcoded colors for SVG rendering
 * since CSS variables don't work reliably in SVG contexts.
 */

/* eslint-disable no-restricted-syntax */

import type { GraphNode, NodeType, LinkType } from '../types'

// Color palette matching DDS brand colors
const COLORS = {
  // Components
  component: '#08A4BD', // DEEP_CURRENT[500]
  componentHover: '#33BFD7', // DEEP_CURRENT[400]

  // Token types
  tokenScale: '#5E4F7E', // DUSK_REEF[500]
  tokenAlias: '#08A4BD', // DEEP_CURRENT[500]
  tokenOther: '#64748B', // SLATE[500]

  // Links
  linkImport: '#757B87', // ABYSS[300]
  linkToken: '#066383', // DEEP_CURRENT[600] with opacity

  // UI
  text: '#FFFFFF',
  background: '#2D3142', // ABYSS[500]
  backgroundLight: '#474F5F', // ABYSS[400]
}

/**
 * Get fill color for a node based on its type
 * For shade nodes, returns the actual hex color from metadata
 * For color-scale nodes (central hexagons), returns the representative [500] shade
 */
export function getNodeColor(node: GraphNode): string {
  // For primitive shades, use the actual hex color
  if (node.type === 'primitive-shade' && node.metadata?.hex) {
    return node.metadata.hex
  }
  // For alias tokens, use the resolved hex if available
  if (node.type === 'alias-token' && node.metadata?.resolvedHex) {
    return node.metadata.resolvedHex
  }
  // For primitive base (white, cream, etc), use hex
  if (node.type === 'primitive-base' && node.metadata?.hex) {
    return node.metadata.hex
  }
  // For color scales (central hexagon), use representative hex from [500] shade
  if (node.type === 'color-scale' && node.metadata?.representativeHex) {
    return node.metadata.representativeHex
  }

  switch (node.type) {
    case 'component':
      return COLORS.component
    case 'token-scale':
    case 'color-scale':
      return COLORS.tokenScale
    case 'token-alias':
    case 'alias-category':
      return '#5E4F7E' // DUSK_REEF[500]
    case 'alias-token':
      return COLORS.tokenAlias
    case 'token-other':
      return COLORS.tokenOther
    case 'primitive-base':
      return '#FFFFFF'
    case 'primitive-shade':
      return COLORS.tokenScale
    default:
      return COLORS.component
  }
}

/**
 * Get hover color for a node
 */
export function getNodeHoverColor(node: GraphNode): string {
  switch (node.type) {
    case 'component':
      return COLORS.componentHover
    default:
      return getNodeColor(node)
  }
}

/**
 * Get radius for a node based on type and dependency count
 */
export function getNodeRadius(node: GraphNode): number {
  // Different base sizes for different node types
  let baseRadius: number
  switch (node.type) {
    case 'color-scale':
      baseRadius = 14 // Large for scale parents
      break
    case 'alias-category':
      baseRadius = 12 // Large for category parents
      break
    case 'component':
      baseRadius = 10
      break
    case 'primitive-shade':
      baseRadius = 8 // Show the actual color
      break
    case 'alias-token':
      baseRadius = 7
      break
    case 'primitive-base':
      baseRadius = 10
      break
    default:
      baseRadius = 6
  }

  // Scale based on connections
  const depCount = node.metadata?.dependencyCount || node.metadata?.shadeCount || node.metadata?.tokenCount || 0
  const scale = Math.min(1.5, 1 + depCount * 0.05)
  return baseRadius * scale
}

/**
 * Get stroke color for links
 */
export function getLinkColor(type: LinkType): string {
  switch (type) {
    case 'imports':
      return COLORS.linkImport
    case 'contains':
      return '#474F5F' // ABYSS[400] - hierarchy links
    case 'references':
      return '#08A4BD' // DEEP_CURRENT[500] - alias→primitive
    case 'uses-alias':
      return '#5E4F7E' // DUSK_REEF[500] - component→alias
    case 'uses-token':
    default:
      return COLORS.linkToken
  }
}

/**
 * Get stroke style for links
 */
export function getLinkDashArray(type: LinkType): string {
  switch (type) {
    case 'imports':
    case 'contains':
      return 'none' // Solid for hierarchy
    case 'references':
      return '6,3' // Dashed for references
    case 'uses-alias':
    case 'uses-token':
    default:
      return '4,2'
  }
}

/**
 * Get link opacity
 */
export function getLinkOpacity(type: LinkType): number {
  switch (type) {
    case 'imports':
      return 0.6
    case 'contains':
      return 0.5
    case 'references':
      return 0.7
    case 'uses-alias':
      return 0.5
    case 'uses-token':
    default:
      return 0.4
  }
}

/**
 * Get label for node type
 */
export function getNodeTypeLabel(type: NodeType): string {
  switch (type) {
    case 'component':
      return 'Component'
    case 'token-scale':
    case 'color-scale':
      return 'Color Scale'
    case 'token-alias':
    case 'alias-token':
      return 'Alias Token'
    case 'alias-category':
      return 'Alias Category'
    case 'primitive-base':
      return 'Base Primitive'
    case 'primitive-shade':
      return 'Color Shade'
    case 'token-other':
      return 'Token'
    default:
      return 'Node'
  }
}

/**
 * Get shape path for node (for SVG symbols)
 * Components: circle, Tokens: different shapes
 */
export function getNodeShape(type: NodeType): 'circle' | 'square' | 'diamond' | 'hexagon' {
  switch (type) {
    case 'component':
      return 'circle'
    case 'token-scale':
    case 'color-scale':
      return 'hexagon' // Hexagon for scale parents
    case 'alias-category':
      return 'diamond' // Diamond for categories
    case 'token-alias':
    case 'alias-token':
      return 'diamond'
    case 'primitive-base':
    case 'primitive-shade':
      return 'square' // Square shows color better
    default:
      return 'circle'
  }
}

export { COLORS }
