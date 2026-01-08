/**
 * useWorkspaceTree Hook
 *
 * Builds nested tree structure from flat nodes for rendering.
 * Memoizes tree computation for performance.
 */

import { useMemo } from 'react'
import type { WorkspaceNode } from '../types'
import { isFolder } from '../types'

// =============================================================================
// TYPES
// =============================================================================

export interface TreeNode {
  node: WorkspaceNode
  children: TreeNode[]
  depth: number
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Build tree recursively from flat node map
 */
function buildTree(
  parentId: string | null,
  nodes: Record<string, WorkspaceNode>,
  rootIds: string[],
  depth: number
): TreeNode[] {
  // Get children of this parent
  const childIds =
    parentId === null
      ? rootIds
      : Object.values(nodes)
          .filter((n) => n.parentId === parentId)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((n) => n.id)

  return childIds
    .map((id) => {
      const node = nodes[id]
      if (!node) return null

      const children = isFolder(node)
        ? buildTree(id, nodes, rootIds, depth + 1)
        : []

      return {
        node,
        children,
        depth,
      }
    })
    .filter((item): item is TreeNode => item !== null)
}

/**
 * Flatten tree for virtualization (if needed later)
 */
export function flattenTree(
  tree: TreeNode[],
  expandedIds: Set<string>
): TreeNode[] {
  const result: TreeNode[] = []

  function traverse(nodes: TreeNode[]) {
    for (const treeNode of nodes) {
      result.push(treeNode)

      if (
        isFolder(treeNode.node) &&
        expandedIds.has(treeNode.node.id) &&
        treeNode.children.length > 0
      ) {
        traverse(treeNode.children)
      }
    }
  }

  traverse(tree)
  return result
}

/**
 * Get visible node IDs in order (for keyboard navigation)
 */
export function getVisibleNodeIds(
  tree: TreeNode[],
  expandedIds: Set<string>
): string[] {
  const result: string[] = []

  function traverse(nodes: TreeNode[]) {
    for (const treeNode of nodes) {
      result.push(treeNode.node.id)

      if (
        isFolder(treeNode.node) &&
        expandedIds.has(treeNode.node.id) &&
        treeNode.children.length > 0
      ) {
        traverse(treeNode.children)
      }
    }
  }

  traverse(tree)
  return result
}

// =============================================================================
// HOOK
// =============================================================================

export interface UseWorkspaceTreeOptions {
  nodes: Record<string, WorkspaceNode>
  rootIds: string[]
}

export interface UseWorkspaceTreeResult {
  /** Full tree structure */
  tree: TreeNode[]
  /** Total node count */
  totalCount: number
  /** Folder count */
  folderCount: number
  /** Item count */
  itemCount: number
}

/**
 * Build tree structure from flat node data
 */
export function useWorkspaceTree({
  nodes,
  rootIds,
}: UseWorkspaceTreeOptions): UseWorkspaceTreeResult {
  return useMemo(() => {
    const tree = buildTree(null, nodes, rootIds, 0)

    const allNodes = Object.values(nodes)
    const folderCount = allNodes.filter(isFolder).length
    const itemCount = allNodes.length - folderCount

    return {
      tree,
      totalCount: allNodes.length,
      folderCount,
      itemCount,
    }
  }, [nodes, rootIds])
}

export default useWorkspaceTree
