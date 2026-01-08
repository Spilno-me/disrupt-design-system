/**
 * Workspace Sync Hook
 *
 * Wraps store actions with API calls for persistence.
 * Implements optimistic updates with rollback on failure.
 *
 * @example
 * ```tsx
 * const { createFolder, isLoading, isPending } = useWorkspaceSync({ product: 'flow' })
 *
 * // Create with optimistic update
 * const folderId = await createFolder(null, 'My Folder', 'blue')
 *
 * // Check if specific node is pending sync
 * if (isPending(nodeId)) {
 *   // Show spinner or disable actions
 * }
 * ```
 */

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { workspacesApi } from '@/api'
import { useWorkspaceStore } from '../store/workspace.store'
import type {
  WorkspaceNode,
  Product,
  FolderColor,
  SyncStatus,
} from '../types'
import type { ApiError } from '@/api'

// =============================================================================
// TYPES
// =============================================================================

export interface UseWorkspaceSyncOptions {
  /** Product context for API calls */
  product: Product
  /** Called when any sync error occurs */
  onError?: (error: ApiError) => void
  /** Called when sync succeeds */
  onSuccess?: (action: string) => void
}

export interface UseWorkspaceSyncReturn {
  // CRUD operations (wrapped with API calls)
  createFolder: (
    parentId: string | null,
    name: string,
    color?: FolderColor
  ) => Promise<string>
  createItem: (
    parentId: string | null,
    name: string,
    href: string,
    iconName?: string
  ) => Promise<string>
  rename: (id: string, name: string) => Promise<void>
  deleteNode: (id: string) => Promise<void>
  move: (
    id: string,
    newParentId: string | null,
    insertIndex?: number
  ) => Promise<void>
  setColor: (id: string, color: FolderColor) => Promise<void>

  // Loading states
  /** True while loading initial data */
  isLoading: boolean
  /** Check if specific node has pending operation */
  isPending: (id: string) => boolean
  /** Current sync status */
  syncStatus: SyncStatus

  // Error state
  /** Last error (cleared on next operation) */
  lastError: ApiError | null
}

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

export function useWorkspaceSync({
  product,
  onError,
  onSuccess,
}: UseWorkspaceSyncOptions): UseWorkspaceSyncReturn {
  const store = useWorkspaceStore()
  const [isLoading, setIsLoading] = useState(true)
  const [lastError, setLastError] = useState<ApiError | null>(null)

  // ─────────────────────────────────────────────────────────────────────────
  // INITIAL DATA LOAD
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      setIsLoading(true)
      setLastError(null)

      try {
        const response = await workspacesApi.getAll(product)
        if (isMounted) {
          store.initialize(response.data, product)
        }
      } catch (err) {
        if (isMounted) {
          const apiError = err as ApiError
          setLastError(apiError)
          toast.error('Failed to load workspace', {
            description: apiError.message || 'Please try again later.',
          })
          onError?.(apiError)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [product, onError])

  // ─────────────────────────────────────────────────────────────────────────
  // CRUD OPERATIONS
  // ─────────────────────────────────────────────────────────────────────────

  const createFolder = useCallback(
    async (
      parentId: string | null,
      name: string,
      color: FolderColor = 'default'
    ): Promise<string> => {
      setLastError(null)

      // Optimistic update - creates node with temp ID
      const tempId = store.createFolder(parentId, name, color)
      if (!tempId) {
        throw new Error('Failed to create folder locally')
      }

      try {
        const response = await workspacesApi.createFolder({
          parentId,
          name,
          color,
          product,
        })

        // Replace temp ID with server ID
        store.replaceNodeId(tempId, response.data.id)
        onSuccess?.('createFolder')

        return response.data.id
      } catch (err) {
        const apiError = err as ApiError
        setLastError(apiError)

        // Rollback optimistic update
        store.rollbackNode(tempId)

        toast.error('Failed to create folder', {
          description: 'Your changes have been reverted.',
          action: {
            label: 'Retry',
            onClick: () => createFolder(parentId, name, color),
          },
        })

        onError?.(apiError)
        throw err
      }
    },
    [product, store, onError, onSuccess]
  )

  const createItem = useCallback(
    async (
      parentId: string | null,
      name: string,
      href: string,
      iconName?: string
    ): Promise<string> => {
      setLastError(null)

      const tempId = store.createItem(parentId, name, href, iconName)
      if (!tempId) {
        throw new Error('Failed to create item locally')
      }

      try {
        const response = await workspacesApi.createItem({
          parentId,
          name,
          href,
          iconName,
          product,
        })

        store.replaceNodeId(tempId, response.data.id)
        onSuccess?.('createItem')

        return response.data.id
      } catch (err) {
        const apiError = err as ApiError
        setLastError(apiError)
        store.rollbackNode(tempId)

        toast.error('Failed to create item', {
          description: 'Your changes have been reverted.',
          action: {
            label: 'Retry',
            onClick: () => createItem(parentId, name, href, iconName),
          },
        })

        onError?.(apiError)
        throw err
      }
    },
    [product, store, onError, onSuccess]
  )

  const rename = useCallback(
    async (id: string, name: string): Promise<void> => {
      setLastError(null)

      // Get old name for rollback
      const node = store.nodes[id]
      const oldName = node?.name

      // Optimistic update
      store.rename(id, name)

      try {
        await workspacesApi.update(id, { name })
        onSuccess?.('rename')
      } catch (err) {
        const apiError = err as ApiError
        setLastError(apiError)

        // Rollback
        if (oldName) {
          store.rename(id, oldName)
        }

        toast.error('Failed to rename', {
          description: 'Your changes have been reverted.',
        })

        onError?.(apiError)
        throw err
      }
    },
    [store, onError, onSuccess]
  )

  const deleteNode = useCallback(
    async (id: string): Promise<void> => {
      setLastError(null)

      // Store current state for potential rollback
      const wasDeleted = store.nodes[id]

      // Optimistic delete
      store.deleteNode(id)

      try {
        await workspacesApi.delete(id)
        onSuccess?.('delete')
      } catch (err) {
        const apiError = err as ApiError
        setLastError(apiError)

        // Rollback via undo
        store.undo()

        toast.error('Failed to delete', {
          description: 'Your changes have been reverted.',
        })

        onError?.(apiError)
        throw err
      }
    },
    [store, onError, onSuccess]
  )

  const move = useCallback(
    async (
      id: string,
      newParentId: string | null,
      insertIndex?: number
    ): Promise<void> => {
      setLastError(null)

      // Optimistic move
      const success = store.move(id, newParentId, insertIndex)
      if (!success) {
        throw new Error('Failed to move node locally')
      }

      try {
        const node = store.nodes[id]
        await workspacesApi.move(id, {
          parentId: newParentId,
          sortOrder: node?.sortOrder ?? insertIndex ?? 0,
        })
        onSuccess?.('move')
      } catch (err) {
        const apiError = err as ApiError
        setLastError(apiError)

        // Rollback via undo
        store.undo()

        toast.error('Failed to move', {
          description: 'Your changes have been reverted.',
        })

        onError?.(apiError)
        throw err
      }
    },
    [store, onError, onSuccess]
  )

  const setColor = useCallback(
    async (id: string, color: FolderColor): Promise<void> => {
      setLastError(null)

      // Get old color for rollback
      const node = store.nodes[id]
      const oldColor = node && 'color' in node ? node.color : undefined

      // Optimistic update
      store.setColor(id, color)

      try {
        await workspacesApi.setColor(id, color)
        onSuccess?.('setColor')
      } catch (err) {
        const apiError = err as ApiError
        setLastError(apiError)

        // Rollback
        if (oldColor) {
          store.setColor(id, oldColor)
        }

        toast.error('Failed to change color', {
          description: 'Your changes have been reverted.',
        })

        onError?.(apiError)
        throw err
      }
    },
    [store, onError, onSuccess]
  )

  // ─────────────────────────────────────────────────────────────────────────
  // UTILITY FUNCTIONS
  // ─────────────────────────────────────────────────────────────────────────

  const isPending = useCallback(
    (id: string): boolean => {
      return store.nodes[id]?.isOptimistic ?? false
    },
    [store.nodes]
  )

  // ─────────────────────────────────────────────────────────────────────────
  // RETURN
  // ─────────────────────────────────────────────────────────────────────────

  return {
    createFolder,
    createItem,
    rename,
    deleteNode,
    move,
    setColor,
    isLoading,
    isPending,
    syncStatus: store.syncStatus,
    lastError,
  }
}
