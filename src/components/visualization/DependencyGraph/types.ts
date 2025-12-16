/**
 * Type definitions for DependencyGraph visualization
 */

import type * as d3 from 'd3-force'

/** Node types in the dependency graph */
export type NodeType =
  | 'component'
  | 'token-scale'
  | 'token-alias'
  | 'token-other'
  // New token architecture types
  | 'primitive-base'
  | 'color-scale'
  | 'primitive-shade'
  | 'alias-category'
  | 'alias-token'

/** Link types between nodes */
export type LinkType = 'imports' | 'uses-token' | 'contains' | 'references' | 'uses-alias'

/** Group categories for clustering */
export type NodeGroup = 'ui' | 'visualization' | 'primitives' | 'alias' | 'other' | 'scales' | 'shades' | 'alias-categories' | 'aliases' | 'components'

/** Graph node data structure */
export interface GraphNode extends d3.SimulationNodeDatum {
  id: string
  name: string
  type: NodeType
  group: NodeGroup
  filePath?: string
  metadata?: {
    tokenValue?: string
    dependencyCount?: number
    // Token architecture metadata
    hex?: string
    scale?: string
    shade?: string
    category?: string
    description?: string
    hue?: string
    shadeCount?: number
    tokenCount?: number
    aliasCount?: number
    referencedScale?: string
    referencedShade?: string
    resolvedHex?: string
  }
  // D3 simulation adds these
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
  vx?: number
  vy?: number
}

/** Graph link data structure */
export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode
  target: string | GraphNode
  type: LinkType
}

/** Full dependency data from extraction */
export interface DependencyData {
  nodes: GraphNode[]
  links: GraphLink[]
  metadata: {
    extractedAt: string
    componentCount: number
    tokenCount: number
    linkCount: number
  }
}

/** Filter state for the graph */
export interface GraphFilters {
  showComponents: boolean
  showTokens: boolean
  showPrimitives: boolean
  showAlias: boolean
  selectedGroup: NodeGroup | 'all'
}

/** Configuration for the graph visualization */
export interface GraphConfig {
  width: number
  height: number
  nodeRadius: {
    component: number
    token: number
  }
  forces: {
    linkDistance: number
    chargeStrength: number
    collisionRadius: number
  }
  colors: {
    component: string
    tokenScale: string
    tokenAlias: string
    tokenOther: string
    linkImport: string
    linkToken: string
  }
}

/** Props for the main DependencyGraph component */
export interface DependencyGraphProps {
  /** Optional pre-loaded data (otherwise fetched from JSON) */
  data?: DependencyData
  /** Height of the visualization */
  height?: string | number
  /** Additional CSS class */
  className?: string
  /** Callback when a node is selected */
  onNodeSelect?: (node: GraphNode | null) => void
  /** Initial filters */
  initialFilters?: Partial<GraphFilters>
  /** Use token architecture view (shows full token hierarchy with hex values) */
  useTokenArchitecture?: boolean
}

/** Props for the detail panel */
export interface NodeDetailPanelProps {
  node: GraphNode | null
  connectedNodes: GraphNode[]
  onClose: () => void
}

/** Props for the controls panel */
export interface GraphControlsProps {
  filters: GraphFilters
  onFilterChange: (filters: GraphFilters) => void
  onReset: () => void
  nodeCount: number
  linkCount: number
}
