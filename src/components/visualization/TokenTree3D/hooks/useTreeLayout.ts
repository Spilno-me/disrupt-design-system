/**
 * useTreeLayout Hook
 * Calculates 3D positions for tree nodes using radial layout algorithm
 */

import { useMemo } from 'react'
import type { TreeNode } from '../types'

interface LayoutOptions {
  /** Base radius for depth 1 nodes */
  baseRadius: number
  /** Radius increment per depth level */
  radiusIncrement: number
  /** Vertical spread between layers */
  verticalSpread: number
}

const DEFAULT_OPTIONS: LayoutOptions = {
  baseRadius: 3,
  radiusIncrement: 2.5,
  verticalSpread: 1.5,
}

/**
 * Calculate 3D positions for all nodes in a tree
 * Uses radial layout with concentric rings per depth level
 */
export function useTreeLayout(
  root: TreeNode,
  expandedNodeIds: Set<string>,
  options: Partial<LayoutOptions> = {}
): TreeNode {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  return useMemo(() => {
    return layoutNode(root, 0, 0, Math.PI * 2, 0, expandedNodeIds, opts)
  }, [root, expandedNodeIds, opts])
}

/**
 * Recursively layout a node and its children
 */
function layoutNode(
  node: TreeNode,
  depth: number,
  angleStart: number,
  angleEnd: number,
  parentY: number,
  expandedNodeIds: Set<string>,
  options: LayoutOptions
): TreeNode {
  const isExpanded = depth === 0 || expandedNodeIds.has(node.id)

  // Calculate position using spherical coordinates
  const angle = (angleStart + angleEnd) / 2
  const radius = depth * options.radiusIncrement

  // Add vertical variation based on depth to create 3D depth
  const yOffset =
    depth === 0
      ? 0
      : depth === 1
        ? options.verticalSpread * 0.5
        : depth === 2
          ? -options.verticalSpread * 0.3
          : options.verticalSpread * 0.2 * (depth % 2 === 0 ? 1 : -1)

  const position: [number, number, number] =
    depth === 0
      ? [0, 0, 0]
      : [radius * Math.cos(angle), parentY + yOffset, radius * Math.sin(angle)]

  // Layout children if expanded
  const children: TreeNode[] = []
  if (isExpanded && node.children.length > 0) {
    const angleStep = (angleEnd - angleStart) / node.children.length

    node.children.forEach((child, index) => {
      const childAngleStart = angleStart + index * angleStep
      const childAngleEnd = childAngleStart + angleStep

      children.push(
        layoutNode(
          child,
          depth + 1,
          childAngleStart,
          childAngleEnd,
          position[1],
          expandedNodeIds,
          options
        )
      )
    })
  }

  return {
    ...node,
    depth,
    position,
    expanded: isExpanded,
    children,
  }
}

/**
 * Get all visible nodes from a laid-out tree
 */
export function getVisibleNodes(node: TreeNode): TreeNode[] {
  const result: TreeNode[] = [node]

  if (node.expanded) {
    node.children.forEach((child) => {
      result.push(...getVisibleNodes(child))
    })
  }

  return result
}

/**
 * Get all connections (parent-child pairs) for visible nodes
 */
export function getVisibleConnections(
  node: TreeNode
): Array<{ parent: TreeNode; child: TreeNode }> {
  const connections: Array<{ parent: TreeNode; child: TreeNode }> = []

  if (node.expanded && node.position) {
    node.children.forEach((child) => {
      if (child.position) {
        connections.push({ parent: node, child })
        connections.push(...getVisibleConnections(child))
      }
    })
  }

  return connections
}
