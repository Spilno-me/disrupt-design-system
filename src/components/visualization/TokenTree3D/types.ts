/**
 * TokenTree3D Types
 * Type definitions for the 3D token hierarchy visualization
 */

/** Node type in the token tree */
export type TreeNodeType = 'root' | 'category' | 'scale' | 'token' | 'value'

/** A single node in the token tree */
export interface TreeNode {
  /** Unique identifier for the node */
  id: string
  /** Display name */
  name: string
  /** Type of node for rendering decisions */
  type: TreeNodeType
  /** Color value for color tokens (hex string) */
  value?: string
  /** Depth level in the tree (0 = root) */
  depth: number
  /** Child nodes */
  children: TreeNode[]
  /** Parent node ID */
  parentId?: string
  /** 3D position [x, y, z] - computed by layout algorithm */
  position?: [number, number, number]
  /** Whether children are visible */
  expanded?: boolean
  /** Additional metadata */
  metadata?: TreeNodeMetadata
}

/** Metadata attached to tree nodes */
export interface TreeNodeMetadata {
  /** Token path for copying, e.g., "ABYSS[500]" or "ALIAS.text.primary" */
  tokenPath?: string
  /** Human-readable usage description */
  usage?: string
  /** Tier level (1 = Primitives, 2 = Alias) */
  tier?: 1 | 2
  /** Number of child tokens (for collapsed display) */
  childCount?: number
}

/** Configuration for the tree visualization */
export interface TreeConfig {
  /** Auto-rotation speed (0 = disabled) */
  rotationSpeed: number
  /** Node sizes */
  nodeSize: {
    base: number
    hover: number
    selected: number
  }
  /** Colors for tree elements */
  colors: {
    connection: string
    nodeDefault: string
    nodeHover: string
    nodeSelected: string
    label: string
    labelBackground: string
  }
  /** Animation durations in seconds */
  animation: {
    expand: number
    hover: number
    camera: number
  }
  /** Layout parameters */
  layout: {
    baseRadius: number
    radiusIncrement: number
    verticalSpread: number
  }
}

/** Props for the main TokenTree3D component */
export interface TokenTree3DProps {
  /** Node IDs to expand initially */
  initialExpanded?: string[]
  /** Callback when a node is selected */
  onNodeSelect?: (node: TreeNode) => void
  /** Whether to show labels on nodes */
  showLabels?: boolean
  /** Whether to auto-rotate the scene */
  autoRotate?: boolean
  /** Additional CSS class for the container */
  className?: string
  /** Height of the visualization */
  height?: string | number
}

/** Props for the TreeNode 3D component */
export interface TreeNodeProps {
  node: TreeNode
  config: TreeConfig
  isExpanded: boolean
  isSelected: boolean
  isHovered: boolean
  onClick: () => void
  onHover: (hovering: boolean) => void
  showLabel: boolean
}

/** Props for tree connection lines */
export interface TreeConnectionProps {
  parentPosition: [number, number, number]
  childPosition: [number, number, number]
  color: string
  opacity?: number
}

/** State for tree interaction */
export interface TreeInteractionState {
  hoveredNodeId: string | null
  selectedNodeId: string | null
  expandedNodeIds: Set<string>
}

/** Props for the detail panel overlay */
export interface NodeDetailPanelProps {
  node: TreeNode | null
  onClose: () => void
  onCopyValue?: (value: string) => void
}
