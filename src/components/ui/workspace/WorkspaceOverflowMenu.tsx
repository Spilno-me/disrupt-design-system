/**
 * WorkspaceOverflowMenu - Actions dropdown for workspace nodes
 *
 * Follows Action Overflow Rule: 5+ actions → overflow menu.
 * Shows keyboard shortcuts for discoverability.
 */

import * as React from 'react'
import {
  MoreHorizontal,
  Pencil,
  Palette,
  FolderPlus,
  Copy,
  Trash2,
  ChevronRight,
} from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Button } from '../button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../dropdown-menu'
import { useWorkspaceStore } from './store/workspace.store'
import { FolderColorPicker } from './FolderColorPicker'
import type { WorkspaceNode, FolderColor } from './types'
import { isFolder } from './types'
import { KEYBOARD_SHORTCUTS } from './constants'

// =============================================================================
// TYPES
// =============================================================================

export interface WorkspaceOverflowMenuProps {
  /** Node data */
  node: WorkspaceNode
  /** Whether node has children */
  hasChildren: boolean
  /** Additional class names */
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function WorkspaceOverflowMenu({
  node,
  hasChildren,
  className,
}: WorkspaceOverflowMenuProps) {
  const [open, setOpen] = React.useState(false)

  // Store actions
  const setEditing = useWorkspaceStore((s) => s.setEditing)
  const setColor = useWorkspaceStore((s) => s.setColor)
  const createFolder = useWorkspaceStore((s) => s.createFolder)
  const deleteNode = useWorkspaceStore((s) => s.deleteNode)

  // Handlers
  const handleRename = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setEditing(node.id)
      setOpen(false)
    },
    [node.id, setEditing]
  )

  const handleColorChange = React.useCallback(
    (color: FolderColor) => {
      setColor(node.id, color)
      setOpen(false)
    },
    [node.id, setColor]
  )

  const handleNewSubfolder = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      createFolder(node.id, 'New Folder')
      setOpen(false)
    },
    [node.id, createFolder]
  )

  const handleDuplicate = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      // For now, create a copy at the same level with "(copy)" suffix
      if (isFolder(node)) {
        createFolder(node.parentId, `${node.name} (copy)`, node.color)
      }
      // Items would need createItem which requires href
      setOpen(false)
    },
    [node, createFolder]
  )

  const handleDelete = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      // TODO: Add confirmation dialog for folders with children
      deleteNode(node.id)
      setOpen(false)
    },
    [node.id, deleteNode]
  )

  // Stop propagation on trigger click
  const handleTriggerClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  const isFolderNode = isFolder(node)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('size-6 shrink-0', className)}
          onClick={handleTriggerClick}
          aria-label="More actions"
          data-testid={`workspace-menu-${node.id}-trigger`}
        >
          <MoreHorizontal className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48" data-testid={`workspace-menu-${node.id}`}>
        {/* Rename */}
        <DropdownMenuItem onClick={handleRename} data-testid={`workspace-menu-${node.id}-rename`}>
          <Pencil className="size-4 mr-2" />
          <span className="flex-1">Rename</span>
          <span className="text-xs text-muted ml-2">{KEYBOARD_SHORTCUTS.RENAME}</span>
        </DropdownMenuItem>

        {/* Change Color (folders only) */}
        {isFolderNode && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger data-testid={`workspace-menu-${node.id}-color`}>
              <Palette className="size-4 mr-2" />
              <span className="flex-1">Change Color</span>
              <ChevronRight className="size-4 ml-2" />
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="p-2">
              <FolderColorPicker
                currentColor={node.color}
                onColorChange={handleColorChange}
              />
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}

        {/* New Subfolder (folders only) */}
        {isFolderNode && (
          <DropdownMenuItem onClick={handleNewSubfolder} data-testid={`workspace-menu-${node.id}-subfolder`}>
            <FolderPlus className="size-4 mr-2" />
            <span className="flex-1">New Subfolder</span>
            <span className="text-xs text-muted ml-2">{KEYBOARD_SHORTCUTS.NEW_FOLDER}</span>
          </DropdownMenuItem>
        )}

        {/* Duplicate */}
        <DropdownMenuItem onClick={handleDuplicate} data-testid={`workspace-menu-${node.id}-duplicate`}>
          <Copy className="size-4 mr-2" />
          <span>Duplicate</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Delete */}
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-error focus:text-error focus:bg-error-light"
          data-testid={`workspace-menu-${node.id}-delete`}
        >
          <Trash2 className="size-4 mr-2" />
          <span className="flex-1">Delete</span>
          <span className="text-xs text-error/60 ml-2">{KEYBOARD_SHORTCUTS.DELETE}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

WorkspaceOverflowMenu.displayName = 'WorkspaceOverflowMenu'

export default WorkspaceOverflowMenu
