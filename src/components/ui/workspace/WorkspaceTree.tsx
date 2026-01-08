/**
 * WorkspaceTree - Recursive tree renderer with drag-drop reordering
 *
 * Uses Framer Motion Reorder for smooth drag animations.
 * Renders tree nodes recursively with depth-based indentation.
 */

import * as React from 'react'
import { Reorder, AnimatePresence } from 'motion/react'
import { cn } from '../../../lib/utils'
import { useWorkspaceStore } from './store/workspace.store'
import { WorkspaceNode } from './WorkspaceNode'
import type { TreeNode } from './hooks/useWorkspaceTree'
import type { Product } from './types'
import { isFolder } from './types'

// =============================================================================
// TYPES
// =============================================================================

export interface WorkspaceTreeProps {
  /** Tree nodes to render */
  tree: TreeNode[]
  /** Product context for routing */
  product: Product
  /** Parent ID for nested groups (null for root) */
  parentId?: string | null
  /** Additional class names */
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function WorkspaceTree({
  tree,
  product,
  parentId = null,
  className,
}: WorkspaceTreeProps) {
  // Store actions
  const reorder = useWorkspaceStore((s) => s.reorder)
  const expandedFolderIds = useWorkspaceStore((s) => s.expandedFolderIds)

  // Get ordered IDs for this level
  const orderedIds = React.useMemo(
    () => tree.map((t) => t.node.id),
    [tree]
  )

  // Handle reorder
  const handleReorder = React.useCallback(
    (newOrder: string[]) => {
      reorder(parentId, newOrder)
    },
    [reorder, parentId]
  )

  if (tree.length === 0) {
    return null
  }

  return (
    <Reorder.Group
      as="ul"
      axis="y"
      values={orderedIds}
      onReorder={handleReorder}
      className={cn('list-none m-0 p-0', className)}
      role="group"
    >
      <AnimatePresence initial={false}>
        {tree.map((treeNode) => {
          const { node, children, depth } = treeNode
          const isExpanded =
            isFolder(node) && expandedFolderIds.includes(node.id)
          const hasChildren = children.length > 0

          return (
            <React.Fragment key={node.id}>
              <WorkspaceNode
                node={node}
                depth={depth}
                isExpanded={isExpanded}
                hasChildren={hasChildren}
                product={product}
              />

              {/* Render children if folder is expanded */}
              {isFolder(node) && isExpanded && hasChildren && (
                <li className="list-none">
                  <WorkspaceTree
                    tree={children}
                    product={product}
                    parentId={node.id}
                  />
                </li>
              )}
            </React.Fragment>
          )
        })}
      </AnimatePresence>
    </Reorder.Group>
  )
}

WorkspaceTree.displayName = 'WorkspaceTree'

export default WorkspaceTree
