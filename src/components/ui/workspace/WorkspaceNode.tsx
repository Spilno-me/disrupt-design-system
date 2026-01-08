/**
 * WorkspaceNode - Individual draggable node in workspace tree
 *
 * Wraps content in Framer Motion Reorder.Item for drag-drop.
 * Handles selection, expansion, and inline rename.
 */

import * as React from 'react'
import { Reorder, useDragControls } from 'motion/react'
import { cn } from '../../../lib/utils'
import { useWorkspaceStore } from './store/workspace.store'
import { WorkspaceNodeContent } from './WorkspaceNodeContent'
import type { WorkspaceNode as WorkspaceNodeType, Product } from './types'
import { SHADOWS, Z_INDEX } from '../../../constants/designTokens'
import { getIndentPx } from './constants'

// =============================================================================
// TYPES
// =============================================================================

export interface WorkspaceNodeProps {
  /** Node data */
  node: WorkspaceNodeType
  /** Depth level for indentation */
  depth: number
  /** Whether node (if folder) is expanded */
  isExpanded?: boolean
  /** Whether node has children */
  hasChildren?: boolean
  /** Product context for routing */
  product: Product
  /** Additional class names */
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function WorkspaceNode({
  node,
  depth,
  isExpanded = false,
  hasChildren = false,
  product,
  className,
}: WorkspaceNodeProps) {
  const dragControls = useDragControls()

  // Store state
  const selectedNodeId = useWorkspaceStore((s) => s.selectedNodeId)
  const editingNodeId = useWorkspaceStore((s) => s.editingNodeId)
  const draggingNodeId = useWorkspaceStore((s) => s.draggingNodeId)

  // Store actions
  const setSelected = useWorkspaceStore((s) => s.setSelected)
  const setDragging = useWorkspaceStore((s) => s.setDragging)
  const toggleExpand = useWorkspaceStore((s) => s.toggleExpand)

  // Derived state
  const isSelected = selectedNodeId === node.id
  const isEditing = editingNodeId === node.id
  const isDragging = draggingNodeId === node.id
  const isOptimistic = node.isOptimistic ?? false

  // Calculate indentation
  const paddingLeft = getIndentPx(depth)

  // Handlers
  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      // Don't select if editing
      if (isEditing) return

      setSelected(node.id)

      // Toggle folder expansion on click
      if (node.type === 'folder' && !e.defaultPrevented) {
        toggleExpand(node.id)
      }
    },
    [node.id, node.type, isEditing, setSelected, toggleExpand]
  )

  const handleDragStart = React.useCallback(() => {
    setDragging(node.id)
  }, [node.id, setDragging])

  const handleDragEnd = React.useCallback(() => {
    setDragging(null)
  }, [setDragging])

  return (
    <Reorder.Item
      as="li"
      value={node.id}
      id={node.id}
      dragListener={false}
      dragControls={dragControls}
      className={cn('list-none', className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{
        opacity: isOptimistic ? 0.7 : 1,
        y: 0,
      }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
      whileDrag={{
        scale: 1.02,
        boxShadow: SHADOWS.xl,
        zIndex: Z_INDEX.header,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <WorkspaceNodeContent
        node={node}
        depth={depth}
        isSelected={isSelected}
        isEditing={isEditing}
        isDragging={isDragging}
        isExpanded={isExpanded}
        hasChildren={hasChildren}
        paddingLeft={paddingLeft}
        product={product}
        dragControls={dragControls}
        onClick={handleClick}
      />
    </Reorder.Item>
  )
}

WorkspaceNode.displayName = 'WorkspaceNode'

export default WorkspaceNode
