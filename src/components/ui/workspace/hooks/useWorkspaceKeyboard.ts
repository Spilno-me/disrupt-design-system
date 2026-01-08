/**
 * useWorkspaceKeyboard Hook
 *
 * Handles keyboard navigation for workspace tree.
 * Follows DirectoryTreeItem.tsx pattern from codebase.
 */

import * as React from 'react'
import { useWorkspaceStore } from '../store/workspace.store'
import { useWorkspaceTree, getVisibleNodeIds } from './useWorkspaceTree'
import { isFolder } from '../types'

// =============================================================================
// HOOK
// =============================================================================

export interface UseWorkspaceKeyboardOptions {
  /** Callback when item is activated (Enter on item) */
  onNavigate?: (href: string) => void
}

export function useWorkspaceKeyboard(options: UseWorkspaceKeyboardOptions = {}) {
  const { onNavigate } = options

  // Store state
  const nodes = useWorkspaceStore((s) => s.nodes)
  const rootIds = useWorkspaceStore((s) => s.rootIds)
  const expandedFolderIds = useWorkspaceStore((s) => s.expandedFolderIds)
  const selectedNodeId = useWorkspaceStore((s) => s.selectedNodeId)
  const editingNodeId = useWorkspaceStore((s) => s.editingNodeId)

  // Store actions
  const setSelected = useWorkspaceStore((s) => s.setSelected)
  const setEditing = useWorkspaceStore((s) => s.setEditing)
  const toggleExpand = useWorkspaceStore((s) => s.toggleExpand)
  const deleteNode = useWorkspaceStore((s) => s.deleteNode)
  const undo = useWorkspaceStore((s) => s.undo)
  const redo = useWorkspaceStore((s) => s.redo)

  // Build tree for visibility calculation
  const { tree } = useWorkspaceTree({ nodes, rootIds })

  // Get visible node IDs in order
  const visibleIds = React.useMemo(
    () => getVisibleNodeIds(tree, new Set(expandedFolderIds)),
    [tree, expandedFolderIds]
  )

  // Focus node by ID
  const focusNode = React.useCallback(
    (id: string) => {
      setSelected(id)
      // Focus the DOM element
      const element = document.getElementById(id)
      if (element) {
        element.focus()
      }
    },
    [setSelected]
  )

  // Focus next visible node
  const focusNextNode = React.useCallback(() => {
    if (!selectedNodeId) {
      if (visibleIds.length > 0) {
        focusNode(visibleIds[0])
      }
      return
    }

    const currentIndex = visibleIds.indexOf(selectedNodeId)
    if (currentIndex < visibleIds.length - 1) {
      focusNode(visibleIds[currentIndex + 1])
    }
  }, [selectedNodeId, visibleIds, focusNode])

  // Focus previous visible node
  const focusPrevNode = React.useCallback(() => {
    if (!selectedNodeId) {
      if (visibleIds.length > 0) {
        focusNode(visibleIds[visibleIds.length - 1])
      }
      return
    }

    const currentIndex = visibleIds.indexOf(selectedNodeId)
    if (currentIndex > 0) {
      focusNode(visibleIds[currentIndex - 1])
    }
  }, [selectedNodeId, visibleIds, focusNode])

  // Keyboard event handler
  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      // Skip if editing (input field handles its own keys)
      if (editingNodeId) return

      // Skip if not in workspace context
      const target = e.target as HTMLElement
      if (!target.closest('[role="tree"], [role="treeitem"]')) return

      const selectedNode = selectedNodeId ? nodes[selectedNodeId] : null

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          focusNextNode()
          break

        case 'ArrowUp':
          e.preventDefault()
          focusPrevNode()
          break

        case 'ArrowRight':
          if (selectedNode && isFolder(selectedNode)) {
            e.preventDefault()
            const isExpanded = expandedFolderIds.includes(selectedNode.id)
            if (!isExpanded) {
              toggleExpand(selectedNode.id)
            } else {
              // Already expanded, move to first child
              focusNextNode()
            }
          }
          break

        case 'ArrowLeft':
          if (selectedNode && isFolder(selectedNode)) {
            const isExpanded = expandedFolderIds.includes(selectedNode.id)
            if (isExpanded) {
              e.preventDefault()
              toggleExpand(selectedNode.id)
            } else if (selectedNode.parentId) {
              e.preventDefault()
              focusNode(selectedNode.parentId)
            }
          } else if (selectedNode?.parentId) {
            e.preventDefault()
            focusNode(selectedNode.parentId)
          }
          break

        case 'Enter':
          if (selectedNode) {
            e.preventDefault()
            if (isFolder(selectedNode)) {
              toggleExpand(selectedNode.id)
            } else if (selectedNode.type === 'item' && onNavigate) {
              onNavigate(selectedNode.href)
            }
          }
          break

        case 'F2':
          if (selectedNodeId) {
            e.preventDefault()
            setEditing(selectedNodeId)
          }
          break

        case 'Delete':
        case 'Backspace':
          if (selectedNodeId && !e.metaKey && !e.ctrlKey) {
            e.preventDefault()
            // TODO: Add confirmation dialog for folders with children
            deleteNode(selectedNodeId)
          }
          break

        case 'Escape':
          if (selectedNodeId) {
            e.preventDefault()
            setSelected(null)
          }
          break

        case 'z':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault()
            if (e.shiftKey) {
              redo()
            } else {
              undo()
            }
          }
          break

        case ' ':
          // Space toggles folder expansion
          if (selectedNode && isFolder(selectedNode)) {
            e.preventDefault()
            toggleExpand(selectedNode.id)
          }
          break
      }
    },
    [
      editingNodeId,
      selectedNodeId,
      nodes,
      expandedFolderIds,
      focusNextNode,
      focusPrevNode,
      focusNode,
      toggleExpand,
      setEditing,
      setSelected,
      deleteNode,
      undo,
      redo,
      onNavigate,
    ]
  )

  // Attach keyboard listener
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return {
    focusNode,
    focusNextNode,
    focusPrevNode,
    visibleIds,
  }
}

export default useWorkspaceKeyboard
