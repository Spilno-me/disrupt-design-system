/**
 * Workspaces API Service
 *
 * REST-like API for workspace navigation operations.
 * Uses in-memory storage (not central store) per architectural decision.
 *
 * NOTE: Workspace state is kept LOCAL in component store. This API service
 * provides persistence simulation for optimistic updates pattern.
 */

import {
  simulateNetwork,
  buildResponse,
  generateId,
  deepClone,
  logApiCall,
} from '../core/utils'
import {
  ValidationError,
  NotFoundError,
} from '../core/errors'
import type { ApiResponse } from '../core/types'
import type {
  WorkspaceNode,
  WorkspaceFolder,
  WorkspaceItem,
  CreateFolderPayload,
  CreateItemPayload,
  UpdateNodePayload,
  MoveNodePayload,
  Product,
  FolderColor,
} from '../../components/ui/workspace/types'
import { isFolder } from '../../components/ui/workspace/types'
import { seedWorkspaceNodes } from '../data/seed/workspaces.seed'

// =============================================================================
// IN-MEMORY STORAGE (not using central store per architectural decision)
// =============================================================================

let workspaceNodes: WorkspaceNode[] = deepClone(seedWorkspaceNodes)

/**
 * Reset to seed data (useful for testing)
 */
export function resetWorkspaceData(): void {
  workspaceNodes = deepClone(seedWorkspaceNodes)
}

// =============================================================================
// VALIDATION
// =============================================================================

function validateCreateFolder(input: CreateFolderPayload): void {
  const errors: Record<string, string[]> = {}

  if (!input.name?.trim()) {
    errors.name = ['Folder name is required']
  } else if (input.name.length > 100) {
    errors.name = ['Folder name must be 100 characters or less']
  }

  if (!input.product) {
    errors.product = ['Product is required']
  }

  if (Object.keys(errors).length > 0) {
    throw ValidationError.fromFields(errors)
  }
}

function validateCreateItem(input: CreateItemPayload): void {
  const errors: Record<string, string[]> = {}

  if (!input.name?.trim()) {
    errors.name = ['Item name is required']
  } else if (input.name.length > 100) {
    errors.name = ['Item name must be 100 characters or less']
  }

  if (!input.href?.trim()) {
    errors.href = ['Item href is required']
  }

  if (!input.product) {
    errors.product = ['Product is required']
  }

  if (Object.keys(errors).length > 0) {
    throw ValidationError.fromFields(errors)
  }
}

// =============================================================================
// API METHODS
// =============================================================================

export const workspacesApi = {
  /**
   * Get all workspace nodes for a product
   */
  getAll: async (product: Product): Promise<ApiResponse<WorkspaceNode[]>> => {
    return simulateNetwork(async () => {
      logApiCall('GET', `/api/workspaces?product=${product}`)

      const nodes = workspaceNodes
        .filter((n) => n.product === product)
        .map((n) => deepClone(n))

      return buildResponse(nodes)
    })
  },

  /**
   * Get a single workspace node by ID
   */
  getById: async (id: string): Promise<ApiResponse<WorkspaceNode>> => {
    return simulateNetwork(async () => {
      logApiCall('GET', `/api/workspaces/${id}`)

      const node = workspaceNodes.find((n) => n.id === id)
      if (!node) {
        throw new NotFoundError('Workspace node', id)
      }

      return buildResponse(deepClone(node))
    })
  },

  /**
   * Create a new folder
   */
  createFolder: async (
    input: CreateFolderPayload
  ): Promise<ApiResponse<WorkspaceFolder>> => {
    return simulateNetwork(async () => {
      logApiCall('POST', '/api/workspaces/folders', input)

      validateCreateFolder(input)

      // Calculate sort order
      const siblings = workspaceNodes.filter(
        (n) => n.product === input.product && n.parentId === input.parentId
      )
      const sortOrder = siblings.length

      const newFolder: WorkspaceFolder = {
        id: `ws-folder-${generateId()}`,
        product: input.product,
        name: input.name.trim(),
        type: 'folder',
        color: input.color || 'default',
        parentId: input.parentId,
        sortOrder,
        updatedAt: Date.now(),
      }

      workspaceNodes.push(newFolder)

      return buildResponse(deepClone(newFolder))
    })
  },

  /**
   * Create a new item
   */
  createItem: async (
    input: CreateItemPayload
  ): Promise<ApiResponse<WorkspaceItem>> => {
    return simulateNetwork(async () => {
      logApiCall('POST', '/api/workspaces/items', input)

      validateCreateItem(input)

      // Calculate sort order
      const siblings = workspaceNodes.filter(
        (n) => n.product === input.product && n.parentId === input.parentId
      )
      const sortOrder = siblings.length

      const newItem: WorkspaceItem = {
        id: `ws-item-${generateId()}`,
        product: input.product,
        name: input.name.trim(),
        type: 'item',
        href: input.href,
        iconName: input.iconName,
        parentId: input.parentId,
        sortOrder,
        updatedAt: Date.now(),
      }

      workspaceNodes.push(newItem)

      return buildResponse(deepClone(newItem))
    })
  },

  /**
   * Update a workspace node (rename, change color)
   */
  update: async (
    id: string,
    input: UpdateNodePayload
  ): Promise<ApiResponse<WorkspaceNode>> => {
    return simulateNetwork(async () => {
      logApiCall('PATCH', `/api/workspaces/${id}`, input)

      const index = workspaceNodes.findIndex((n) => n.id === id)
      if (index === -1) {
        throw new NotFoundError('Workspace node', id)
      }

      const node = workspaceNodes[index]

      // Update fields
      if (input.name !== undefined) {
        node.name = input.name.trim()
      }

      if (input.color !== undefined && isFolder(node)) {
        ;(node as WorkspaceFolder).color = input.color
      }

      node.updatedAt = Date.now()

      return buildResponse(deepClone(node))
    })
  },

  /**
   * Delete a workspace node and all its descendants
   */
  delete: async (id: string): Promise<ApiResponse<{ deleted: string[] }>> => {
    return simulateNetwork(async () => {
      logApiCall('DELETE', `/api/workspaces/${id}`)

      const node = workspaceNodes.find((n) => n.id === id)
      if (!node) {
        throw new NotFoundError('Workspace node', id)
      }

      // Collect all IDs to delete (node + descendants)
      const idsToDelete = new Set<string>([id])

      const collectDescendants = (parentId: string) => {
        workspaceNodes
          .filter((n) => n.parentId === parentId)
          .forEach((n) => {
            idsToDelete.add(n.id)
            collectDescendants(n.id)
          })
      }

      if (isFolder(node)) {
        collectDescendants(id)
      }

      // Remove from array
      workspaceNodes = workspaceNodes.filter((n) => !idsToDelete.has(n.id))

      // Update sibling sort orders
      const siblings = workspaceNodes.filter(
        (n) => n.product === node.product && n.parentId === node.parentId
      )
      siblings
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .forEach((sibling, idx) => {
          sibling.sortOrder = idx
        })

      return buildResponse({ deleted: Array.from(idsToDelete) })
    })
  },

  /**
   * Move a node to a new parent
   */
  move: async (
    id: string,
    input: MoveNodePayload
  ): Promise<ApiResponse<WorkspaceNode>> => {
    return simulateNetwork(async () => {
      logApiCall('PATCH', `/api/workspaces/${id}/move`, input)

      const node = workspaceNodes.find((n) => n.id === id)
      if (!node) {
        throw new NotFoundError('Workspace node', id)
      }

      const oldParentId = node.parentId

      // Update old siblings' sort orders
      workspaceNodes
        .filter(
          (n) =>
            n.product === node.product &&
            n.parentId === oldParentId &&
            n.id !== id
        )
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .forEach((sibling, idx) => {
          sibling.sortOrder = idx
        })

      // Move node
      node.parentId = input.parentId
      node.sortOrder = input.sortOrder
      node.updatedAt = Date.now()

      // Update new siblings' sort orders to make room
      workspaceNodes
        .filter(
          (n) =>
            n.product === node.product &&
            n.parentId === input.parentId &&
            n.id !== id
        )
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .forEach((sibling, idx) => {
          const adjustedIdx = idx >= input.sortOrder ? idx + 1 : idx
          sibling.sortOrder = adjustedIdx
        })

      return buildResponse(deepClone(node))
    })
  },

  /**
   * Reorder children within a parent
   */
  reorder: async (
    product: Product,
    parentId: string | null,
    orderedIds: string[]
  ): Promise<ApiResponse<WorkspaceNode[]>> => {
    return simulateNetwork(async () => {
      logApiCall('PATCH', '/api/workspaces/reorder', { parentId, orderedIds })

      // Update sort orders
      const updatedNodes: WorkspaceNode[] = []
      orderedIds.forEach((id, idx) => {
        const node = workspaceNodes.find((n) => n.id === id)
        if (node) {
          node.sortOrder = idx
          node.updatedAt = Date.now()
          updatedNodes.push(deepClone(node))
        }
      })

      return buildResponse(updatedNodes)
    })
  },

  /**
   * Change folder color
   */
  setColor: async (
    id: string,
    color: FolderColor
  ): Promise<ApiResponse<WorkspaceFolder>> => {
    return simulateNetwork(async () => {
      logApiCall('PATCH', `/api/workspaces/${id}/color`, { color })

      const node = workspaceNodes.find((n) => n.id === id)
      if (!node) {
        throw new NotFoundError('Workspace node', id)
      }

      if (!isFolder(node)) {
        throw new ValidationError('Cannot set color on non-folder node')
      }

      ;(node as WorkspaceFolder).color = color
      node.updatedAt = Date.now()

      return buildResponse(deepClone(node) as WorkspaceFolder)
    })
  },
}
