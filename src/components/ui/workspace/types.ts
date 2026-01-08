/**
 * Workspace Types
 *
 * Discriminated union types for type-safe folder/item handling.
 * Uses flat data structure - tree is derived client-side from parentId.
 */

// =============================================================================
// FOLDER COLORS
// =============================================================================

export const FOLDER_COLORS = [
  'default',
  'blue',
  'green',
  'amber',
  'red',
  'purple',
  'cyan',
] as const

export type FolderColor = (typeof FOLDER_COLORS)[number]

// =============================================================================
// PRODUCT TYPE (moved before WorkspaceNodeBase for type resolution)
// =============================================================================

export type Product = 'flow' | 'market' | 'partner'

// =============================================================================
// NODE TYPES (DISCRIMINATED UNION)
// =============================================================================

/**
 * Base properties shared by all workspace nodes
 */
interface WorkspaceNodeBase {
  /** UUID from backend */
  id: string
  /** Product context - enables O(n) filtering without tree traversal */
  product: Product
  /** Display name */
  name: string
  /** Parent node ID (null = root level) */
  parentId: string | null
  /** Sort order within parent (0-based) */
  sortOrder: number
  /** Timestamp for conflict detection */
  updatedAt: number
  /** True if pending sync to backend */
  isOptimistic?: boolean
}

/**
 * Folder node - can contain children
 */
export interface WorkspaceFolder extends WorkspaceNodeBase {
  type: 'folder'
  /** Folder color for visual organization */
  color: FolderColor
}

/**
 * Item node - links to a page/resource
 */
export interface WorkspaceItem extends WorkspaceNodeBase {
  type: 'item'
  /** Navigation target URL */
  href: string
  /** Lucide icon name (serializable) */
  iconName?: string
}

/**
 * Union type for all workspace nodes
 */
export type WorkspaceNode = WorkspaceFolder | WorkspaceItem

// =============================================================================
// TREE HELPERS
// =============================================================================

/**
 * Type guard for folders
 */
export function isFolder(node: WorkspaceNode): node is WorkspaceFolder {
  return node.type === 'folder'
}

/**
 * Type guard for items
 */
export function isItem(node: WorkspaceNode): node is WorkspaceItem {
  return node.type === 'item'
}

// =============================================================================
// SYNC TYPES
// =============================================================================

export type SyncStatus = 'idle' | 'syncing' | 'error'

export type OperationType = 'create' | 'update' | 'delete' | 'move'

export interface PendingOperation {
  id: string
  type: OperationType
  nodeId: string
  timestamp: number
  payload: unknown
  retryCount: number
}

// =============================================================================
// HISTORY TYPES (UNDO/REDO)
// =============================================================================

export interface WorkspaceSnapshot {
  nodes: Record<string, WorkspaceNode>
  rootIds: string[]
  timestamp: number
  action: string
}

// =============================================================================
// API TYPES
// =============================================================================

export interface CreateFolderPayload {
  name: string
  parentId: string | null
  color: FolderColor
  product: Product
}

export interface CreateItemPayload {
  name: string
  parentId: string | null
  href: string
  iconName?: string
  product: Product
}

export interface UpdateNodePayload {
  name?: string
  color?: FolderColor
}

export interface MoveNodePayload {
  parentId: string | null
  sortOrder: number
}
