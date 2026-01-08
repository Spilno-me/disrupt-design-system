/**
 * WorkspaceNodeContent - Visual content of a workspace node
 *
 * Renders icon, name (or inline input), and overflow menu trigger.
 * Handles click, double-click for rename, and drag handle.
 */

import * as React from 'react'
import type { DragControls } from 'motion/react'
import {
  GripVertical,
  ChevronRight,
  FileText,
  File,
  Link,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '../../../lib/utils'
import { useWorkspaceStore } from './store/workspace.store'
import { FolderIcon } from './FolderIcon'
import { InlineRenameInput } from './InlineRenameInput'
import { WorkspaceOverflowMenu } from './WorkspaceOverflowMenu'
import type { WorkspaceNode, Product } from './types'
import { isFolder, isItem } from './types'
import { DOUBLE_CLICK_THRESHOLD_MS } from './constants'

// =============================================================================
// TYPES
// =============================================================================

export interface WorkspaceNodeContentProps {
  /** Node data */
  node: WorkspaceNode
  /** Depth level */
  depth: number
  /** Whether node is selected */
  isSelected: boolean
  /** Whether node is in edit mode */
  isEditing: boolean
  /** Whether node is being dragged */
  isDragging: boolean
  /** Whether folder is expanded */
  isExpanded: boolean
  /** Whether node has children */
  hasChildren: boolean
  /** Left padding in pixels */
  paddingLeft: number
  /** Product context */
  product: Product
  /** Framer Motion drag controls */
  dragControls: DragControls
  /** Click handler */
  onClick: (e: React.MouseEvent) => void
}

// =============================================================================
// ICON MAPPING
// =============================================================================

/**
 * Static map of supported icons for items.
 * Using explicit imports for type safety and tree-shaking.
 */
const ITEM_ICONS: Record<string, LucideIcon> = {
  FileText,
  File,
  Link,
  ExternalLink,
}

/**
 * Get Lucide icon by name
 */
function getIconByName(iconName?: string): LucideIcon {
  if (!iconName) return FileText
  return ITEM_ICONS[iconName] ?? FileText
}

// =============================================================================
// COMPONENT
// =============================================================================

export function WorkspaceNodeContent({
  node,
  depth,
  isSelected,
  isEditing,
  isDragging,
  isExpanded,
  hasChildren,
  paddingLeft,
  product,
  dragControls,
  onClick,
}: WorkspaceNodeContentProps) {
  // Double-click detection for rename
  const clickTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const clickCountRef = React.useRef(0)

  // Store actions
  const setEditing = useWorkspaceStore((s) => s.setEditing)
  const rename = useWorkspaceStore((s) => s.rename)

  // Handle click with double-click detection
  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      clickCountRef.current += 1

      if (clickCountRef.current === 1) {
        // First click - start timer
        clickTimerRef.current = setTimeout(() => {
          // Single click - forward to parent handler
          clickCountRef.current = 0
          onClick(e)
        }, DOUBLE_CLICK_THRESHOLD_MS)
      } else if (clickCountRef.current === 2) {
        // Double click - trigger rename
        if (clickTimerRef.current) {
          clearTimeout(clickTimerRef.current)
        }
        clickCountRef.current = 0
        setEditing(node.id)
      }
    },
    [node.id, onClick, setEditing]
  )

  // Handle rename complete
  const handleRenameComplete = React.useCallback(
    (newName: string) => {
      if (newName.trim() && newName !== node.name) {
        rename(node.id, newName.trim())
      } else {
        setEditing(null)
      }
    },
    [node.id, node.name, rename, setEditing]
  )

  // Handle rename cancel
  const handleRenameCancel = React.useCallback(() => {
    setEditing(null)
  }, [setEditing])

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current)
      }
    }
  }, [])

  // Render icon based on node type
  const renderIcon = () => {
    if (isFolder(node)) {
      return (
        <FolderIcon
          color={node.color}
          isOpen={isExpanded}
          size={16}
          className="shrink-0"
          data-testid={`workspace-node-${node.id}-icon`}
        />
      )
    }

    if (isItem(node)) {
      const Icon = getIconByName(node.iconName)
      return (
        <Icon
          className="size-4 text-muted shrink-0"
          data-testid={`workspace-node-${node.id}-icon`}
        />
      )
    }

    return null
  }

  return (
    <div
      className={cn(
        'group flex items-center gap-1 py-1.5 pr-1 rounded-md cursor-pointer',
        'transition-colors duration-150',
        'hover:bg-accent-bg',
        isSelected && 'bg-accent-bg',
        isDragging && 'opacity-50'
      )}
      style={{ paddingLeft }}
      onClick={handleClick}
      role="treeitem"
      aria-selected={isSelected}
      aria-expanded={isFolder(node) ? isExpanded : undefined}
      tabIndex={0}
      data-testid={`workspace-node-${node.id}`}
    >
      {/* Drag Handle */}
      <div
        className={cn(
          'flex items-center justify-center w-5 h-5 shrink-0',
          'cursor-grab active:cursor-grabbing',
          'opacity-0 group-hover:opacity-100 transition-opacity',
          'touch-none select-none'
        )}
        onPointerDown={(e) => {
          e.stopPropagation()
          dragControls.start(e)
        }}
        data-testid={`workspace-node-${node.id}-drag-handle`}
      >
        <GripVertical className="size-3 text-muted" />
      </div>

      {/* Expand/Collapse Chevron (folders only) */}
      {isFolder(node) && hasChildren ? (
        <ChevronRight
          className={cn(
            'size-3.5 text-muted shrink-0 transition-transform',
            isExpanded && 'rotate-90'
          )}
          data-testid={`workspace-node-${node.id}-chevron`}
        />
      ) : (
        <span className="w-3.5 shrink-0" />
      )}

      {/* Icon */}
      {renderIcon()}

      {/* Name / Inline Edit */}
      <div className="flex-1 min-w-0 ml-1.5">
        {isEditing ? (
          <InlineRenameInput
            nodeId={node.id}
            initialValue={node.name}
            onComplete={handleRenameComplete}
            onCancel={handleRenameCancel}
          />
        ) : (
          <span
            className={cn(
              'block text-sm truncate',
              isSelected ? 'text-primary font-medium' : 'text-primary'
            )}
            data-testid={`workspace-node-${node.id}-name`}
          >
            {node.name}
          </span>
        )}
      </div>

      {/* Overflow Menu */}
      {!isEditing && (
        <WorkspaceOverflowMenu
          node={node}
          hasChildren={hasChildren}
          className={cn(
            'opacity-0 group-hover:opacity-100',
            'focus-within:opacity-100'
          )}
        />
      )}
    </div>
  )
}

WorkspaceNodeContent.displayName = 'WorkspaceNodeContent'

export default WorkspaceNodeContent
