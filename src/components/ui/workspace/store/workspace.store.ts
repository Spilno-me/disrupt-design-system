/**
 * Workspace Store
 *
 * Zustand store for workspace navigation state.
 * Follows FormBuilder store pattern with undo/redo history.
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type {
  WorkspaceNode,
  WorkspaceFolder,
  WorkspaceItem,
  WorkspaceSnapshot,
  SyncStatus,
  PendingOperation,
  FolderColor,
  Product,
} from '../types'
import { isFolder } from '../types'
import { MAX_DEPTH, MAX_HISTORY_SIZE, MAX_NAME_LENGTH } from '../constants'

// =============================================================================
// STATE INTERFACE
// =============================================================================

export interface WorkspaceState {
  /** All nodes indexed by ID */
  nodes: Record<string, WorkspaceNode>
  /** Root-level node IDs in sort order */
  rootIds: string[]

  /** Expanded folder IDs */
  expandedFolderIds: string[]
  /** Currently selected node ID */
  selectedNodeId: string | null
  /** Node being renamed (inline edit) */
  editingNodeId: string | null
  /** Node being dragged */
  draggingNodeId: string | null

  /** Sync status with backend */
  syncStatus: SyncStatus
  /** Pending API operations queue */
  pendingOperations: PendingOperation[]

  /** Undo/redo history */
  history: WorkspaceSnapshot[]
  /** Current position in history (-1 = initial state) */
  historyIndex: number

  /** Current product context */
  product: Product
}

// =============================================================================
// ACTIONS INTERFACE
// =============================================================================

export interface WorkspaceActions {
  // Initialization
  initialize: (nodes: WorkspaceNode[], product: Product) => void
  reset: () => void

  // CRUD
  createFolder: (parentId: string | null, name: string, color?: FolderColor) => string
  createItem: (parentId: string | null, name: string, href: string, iconName?: string) => string
  rename: (id: string, name: string) => boolean
  deleteNode: (id: string) => void
  setColor: (id: string, color: FolderColor) => void

  // Reorder
  reorder: (parentId: string | null, orderedIds: string[]) => void
  move: (id: string, newParentId: string | null, insertIndex?: number) => boolean

  // UI State
  toggleExpand: (id: string) => void
  expandAll: () => void
  collapseAll: () => void
  setSelected: (id: string | null) => void
  setEditing: (id: string | null) => void
  setDragging: (id: string | null) => void

  // History
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean

  // Sync
  setSyncStatus: (status: SyncStatus) => void
  addPendingOperation: (op: Omit<PendingOperation, 'id' | 'timestamp' | 'retryCount'>) => void
  removePendingOperation: (id: string) => void

  // API Integration (optimistic updates)
  /** Replace temp ID with server ID - updates nodes, history, pending ops, UI state */
  replaceNodeId: (oldId: string, newId: string) => void
  /** Mark a node as no longer optimistic */
  confirmOptimistic: (id: string) => void
  /** Remove an optimistic node (rollback) */
  rollbackNode: (id: string) => void

  // Computed
  getChildren: (parentId: string | null) => WorkspaceNode[]
  getDepth: (id: string) => number
  canMoveToDepth: (nodeId: string, targetParentId: string | null) => boolean
  isDescendantOf: (nodeId: string, ancestorId: string) => boolean
}

// =============================================================================
// INITIAL STATE
// =============================================================================

const createInitialState = (): WorkspaceState => ({
  nodes: {},
  rootIds: [],
  expandedFolderIds: [],
  selectedNodeId: null,
  editingNodeId: null,
  draggingNodeId: null,
  syncStatus: 'idle',
  pendingOperations: [],
  history: [],
  historyIndex: -1,
  product: 'flow',
})

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/** Generate UUID (simple version for client-side optimistic IDs) */
function generateId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/** Create history snapshot */
function createSnapshot(
  nodes: Record<string, WorkspaceNode>,
  rootIds: string[],
  action: string
): WorkspaceSnapshot {
  return {
    nodes: { ...nodes },
    rootIds: [...rootIds],
    timestamp: Date.now(),
    action,
  }
}

/**
 * Add action to history with snapshot
 * Eliminates duplication of history pattern across CRUD operations
 */
function addToHistory(
  history: WorkspaceSnapshot[],
  historyIndex: number,
  nodes: Record<string, WorkspaceNode>,
  rootIds: string[],
  action: string
): { newHistory: WorkspaceSnapshot[]; newHistoryIndex: number } {
  const newHistory = history.slice(0, historyIndex + 1)
  newHistory.push(createSnapshot(nodes, rootIds, action))
  if (newHistory.length > MAX_HISTORY_SIZE) newHistory.shift()
  return { newHistory, newHistoryIndex: newHistory.length - 1 }
}

/** Get depth of a node by traversing parents */
function calculateDepth(
  nodeId: string,
  nodes: Record<string, WorkspaceNode>
): number {
  let depth = 0
  let currentId: string | null = nodeId

  while (currentId) {
    const currentNode: WorkspaceNode | undefined = nodes[currentId]
    if (!currentNode || !currentNode.parentId) break
    depth++
    currentId = currentNode.parentId
  }

  return depth
}

/** Check if nodeId is a descendant of ancestorId (node is NOT a descendant of itself) */
function checkIsDescendant(
  nodeId: string,
  ancestorId: string,
  nodes: Record<string, WorkspaceNode>
): boolean {
  // Start from node's parent - a node is NOT a descendant of itself
  const node = nodes[nodeId]
  if (!node) return false

  let currentId: string | null = node.parentId

  while (currentId) {
    if (currentId === ancestorId) return true
    const currentNode: WorkspaceNode | undefined = nodes[currentId]
    if (!currentNode) break
    currentId = currentNode.parentId
  }

  return false
}

/** Get maximum depth of subtree rooted at nodeId */
function getSubtreeMaxDepth(
  nodeId: string,
  nodes: Record<string, WorkspaceNode>
): number {
  const node = nodes[nodeId]
  if (!node || !isFolder(node)) return 0

  const childIds = Object.values(nodes)
    .filter((n) => n.parentId === nodeId)
    .map((n) => n.id)

  if (childIds.length === 0) return 0

  const childDepths = childIds.map((id) => getSubtreeMaxDepth(id, nodes))
  return 1 + Math.max(...childDepths)
}

// =============================================================================
// STORE
// =============================================================================

export type WorkspaceStore = WorkspaceState & WorkspaceActions

export const useWorkspaceStore = create<WorkspaceStore>()(
  devtools(
    (set, get) => ({
      ...createInitialState(),

      // ─────────────────────────────────────────────────────────────────────
      // INITIALIZATION
      // ─────────────────────────────────────────────────────────────────────

      initialize: (nodes: WorkspaceNode[], product: Product) => {
        const nodesMap: Record<string, WorkspaceNode> = {}
        const rootIds: string[] = []

        // Build nodes map and collect root IDs
        for (const node of nodes) {
          nodesMap[node.id] = node
          if (node.parentId === null) {
            rootIds.push(node.id)
          }
        }

        // Sort root IDs by sortOrder
        rootIds.sort((a, b) => nodesMap[a].sortOrder - nodesMap[b].sortOrder)

        set({
          nodes: nodesMap,
          rootIds,
          product,
          history: [],
          historyIndex: -1,
        })
      },

      reset: () => {
        set(createInitialState())
      },

      // ─────────────────────────────────────────────────────────────────────
      // CRUD OPERATIONS
      // ─────────────────────────────────────────────────────────────────────

      createFolder: (
        parentId: string | null,
        name: string,
        color: FolderColor = 'default'
      ): string => {
        const state = get()
        const { nodes, rootIds, history, historyIndex, expandedFolderIds } = state

        // Check depth limit
        if (parentId) {
          const parentDepth = calculateDepth(parentId, nodes)
          if (parentDepth >= MAX_DEPTH) {
            console.warn('[Workspace] Cannot create folder: max depth exceeded')
            return ''
          }
        }

        // Generate ID
        const id = generateId()

        // Calculate sort order
        const siblings = parentId
          ? Object.values(nodes).filter((n) => n.parentId === parentId)
          : rootIds.map((rid) => nodes[rid])
        const sortOrder = siblings.length

        // Create folder
        const newFolder: WorkspaceFolder = {
          id,
          product: state.product,
          name,
          type: 'folder',
          color,
          parentId,
          sortOrder,
          updatedAt: Date.now(),
          isOptimistic: true,
        }

        // Save to history
        const { newHistory, newHistoryIndex } = addToHistory(
          history, historyIndex, nodes, rootIds, 'Create folder'
        )

        // Update state
        const newNodes = { ...nodes, [id]: newFolder }
        const newRootIds = parentId === null ? [...rootIds, id] : rootIds

        // Auto-expand parent folder if creating inside one
        const newExpandedIds =
          parentId && !expandedFolderIds.includes(parentId)
            ? [...expandedFolderIds, parentId]
            : expandedFolderIds

        set({
          nodes: newNodes,
          rootIds: newRootIds,
          history: newHistory,
          historyIndex: newHistoryIndex,
          selectedNodeId: id,
          editingNodeId: id, // Start inline rename
          expandedFolderIds: newExpandedIds,
        })

        return id
      },

      createItem: (
        parentId: string | null,
        name: string,
        href: string,
        iconName?: string
      ): string => {
        const state = get()
        const { nodes, rootIds, history, historyIndex, expandedFolderIds } = state

        // Check depth limit
        if (parentId) {
          const parentDepth = calculateDepth(parentId, nodes)
          if (parentDepth >= MAX_DEPTH) {
            console.warn('[Workspace] Cannot create item: max depth exceeded')
            return ''
          }
        }

        const id = generateId()

        const siblings = parentId
          ? Object.values(nodes).filter((n) => n.parentId === parentId)
          : rootIds.map((rid) => nodes[rid])
        const sortOrder = siblings.length

        const newItem: WorkspaceItem = {
          id,
          product: state.product,
          name,
          type: 'item',
          href,
          iconName,
          parentId,
          sortOrder,
          updatedAt: Date.now(),
          isOptimistic: true,
        }

        const { newHistory, newHistoryIndex } = addToHistory(
          history, historyIndex, nodes, rootIds, 'Create item'
        )

        const newNodes = { ...nodes, [id]: newItem }
        const newRootIds = parentId === null ? [...rootIds, id] : rootIds

        // Auto-expand parent folder if creating inside one
        const newExpandedIds =
          parentId && !expandedFolderIds.includes(parentId)
            ? [...expandedFolderIds, parentId]
            : expandedFolderIds

        set({
          nodes: newNodes,
          rootIds: newRootIds,
          history: newHistory,
          historyIndex: newHistoryIndex,
          selectedNodeId: id,
          editingNodeId: id,
          expandedFolderIds: newExpandedIds,
        })

        return id
      },

      rename: (id: string, name: string): boolean => {
        const state = get()
        const { nodes, rootIds, history, historyIndex } = state
        const node = nodes[id]

        if (!node) return false

        // Trim and truncate name
        const trimmedName = name.trim().slice(0, MAX_NAME_LENGTH)

        // Reject empty/whitespace-only names
        if (!trimmedName) {
          return false
        }

        // Same name = no-op, but return true (not a failure)
        if (trimmedName === node.name) {
          // Exit edit mode without adding to history
          set({ editingNodeId: null })
          return true
        }

        // Check for duplicate sibling names (case-insensitive)
        const siblings = Object.values(nodes).filter(
          (n) => n.parentId === node.parentId && n.id !== id
        )
        const isDuplicate = siblings.some(
          (s) => s.name.toLowerCase() === trimmedName.toLowerCase()
        )
        if (isDuplicate) {
          return false
        }

        const { newHistory, newHistoryIndex } = addToHistory(
          history, historyIndex, nodes, rootIds, 'Rename'
        )

        set({
          nodes: {
            ...nodes,
            [id]: { ...node, name: trimmedName, updatedAt: Date.now() },
          },
          history: newHistory,
          historyIndex: newHistoryIndex,
          editingNodeId: null,
        })

        return true
      },

      deleteNode: (id: string) => {
        const state = get()
        const { nodes, rootIds, history, historyIndex, selectedNodeId } = state
        const node = nodes[id]

        if (!node) return

        // Collect all descendant IDs to delete
        const idsToDelete = new Set<string>([id])
        const collectDescendants = (parentId: string) => {
          Object.values(nodes).forEach((n) => {
            if (n.parentId === parentId) {
              idsToDelete.add(n.id)
              if (isFolder(n)) {
                collectDescendants(n.id)
              }
            }
          })
        }
        if (isFolder(node)) {
          collectDescendants(id)
        }

        // Save to history
        const { newHistory, newHistoryIndex } = addToHistory(
          history, historyIndex, nodes, rootIds, 'Delete'
        )

        // Remove nodes
        const newNodes = { ...nodes }
        idsToDelete.forEach((did) => delete newNodes[did])

        // Remove from rootIds if needed
        const newRootIds = rootIds.filter((rid) => !idsToDelete.has(rid))

        // Update sibling sort orders
        const parentId = node.parentId
        const siblings = parentId
          ? Object.values(newNodes).filter((n) => n.parentId === parentId)
          : newRootIds.map((rid) => newNodes[rid])
        siblings
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .forEach((sibling, idx) => {
            if (newNodes[sibling.id]) {
              newNodes[sibling.id] = { ...newNodes[sibling.id], sortOrder: idx }
            }
          })

        set({
          nodes: newNodes,
          rootIds: newRootIds,
          history: newHistory,
          historyIndex: newHistoryIndex,
          selectedNodeId: idsToDelete.has(selectedNodeId ?? '') ? null : selectedNodeId,
          editingNodeId: null,
        })
      },

      setColor: (id: string, color: FolderColor) => {
        const state = get()
        const { nodes, rootIds, history, historyIndex } = state
        const node = nodes[id]

        if (!node || !isFolder(node)) return

        const { newHistory, newHistoryIndex } = addToHistory(
          history, historyIndex, nodes, rootIds, 'Change color'
        )

        set({
          nodes: {
            ...nodes,
            [id]: { ...node, color, updatedAt: Date.now() },
          },
          history: newHistory,
          historyIndex: newHistoryIndex,
        })
      },

      // ─────────────────────────────────────────────────────────────────────
      // REORDER OPERATIONS
      // ─────────────────────────────────────────────────────────────────────

      reorder: (parentId: string | null, orderedIds: string[]) => {
        const state = get()
        const { nodes, rootIds, history, historyIndex } = state

        // Block if any node in the reorder is pending sync
        const hasOptimisticNode = orderedIds.some((id) => nodes[id]?.isOptimistic)
        if (hasOptimisticNode) {
          console.warn('[Workspace] Cannot reorder with pending nodes - wait for sync')
          return
        }

        const { newHistory, newHistoryIndex } = addToHistory(
          history, historyIndex, nodes, rootIds, 'Reorder'
        )

        // Update sort orders
        const newNodes = { ...nodes }
        orderedIds.forEach((id, idx) => {
          if (newNodes[id]) {
            newNodes[id] = { ...newNodes[id], sortOrder: idx, updatedAt: Date.now() }
          }
        })

        // Update rootIds if reordering at root level
        const newRootIds = parentId === null ? orderedIds : rootIds

        set({
          nodes: newNodes,
          rootIds: newRootIds,
          history: newHistory,
          historyIndex: newHistoryIndex,
        })
      },

      move: (id: string, newParentId: string | null, insertIndex?: number): boolean => {
        const state = get()
        const { nodes, rootIds, history, historyIndex } = state
        const node = nodes[id]

        if (!node) return false

        // Block if source node is pending sync (prevents race conditions)
        if (node.isOptimistic) {
          console.warn('[Workspace] Cannot move pending node - wait for sync')
          return false
        }

        // Block if target folder is pending sync
        if (newParentId && nodes[newParentId]?.isOptimistic) {
          console.warn('[Workspace] Cannot move into pending folder - wait for sync')
          return false
        }

        // Validate: can't move into self or descendant
        if (newParentId && (newParentId === id || checkIsDescendant(newParentId, id, nodes))) {
          console.warn('[Workspace] Cannot move: circular reference')
          return false
        }

        // Validate depth
        if (!state.canMoveToDepth(id, newParentId)) {
          console.warn('[Workspace] Cannot move: would exceed max depth')
          return false
        }

        const { newHistory, newHistoryIndex } = addToHistory(
          history, historyIndex, nodes, rootIds, 'Move'
        )

        const oldParentId = node.parentId
        const newNodes = { ...nodes }

        // Update old siblings' sort orders
        const oldSiblings = oldParentId
          ? Object.values(newNodes).filter((n) => n.parentId === oldParentId && n.id !== id)
          : rootIds.filter((rid) => rid !== id).map((rid) => newNodes[rid])
        oldSiblings
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .forEach((sibling, idx) => {
            newNodes[sibling.id] = { ...newNodes[sibling.id], sortOrder: idx }
          })

        // Get new siblings and calculate sort order
        const newSiblings = newParentId
          ? Object.values(newNodes).filter((n) => n.parentId === newParentId)
          : rootIds.filter((rid) => rid !== id).map((rid) => newNodes[rid])
        const newSortOrder = insertIndex ?? newSiblings.length

        // Update moved node
        newNodes[id] = {
          ...node,
          parentId: newParentId,
          sortOrder: newSortOrder,
          updatedAt: Date.now(),
        }

        // Update new siblings' sort orders
        newSiblings
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .forEach((sibling, idx) => {
            const adjustedIdx = idx >= newSortOrder ? idx + 1 : idx
            newNodes[sibling.id] = { ...newNodes[sibling.id], sortOrder: adjustedIdx }
          })

        // Update rootIds
        let newRootIds = [...rootIds]
        if (oldParentId === null && newParentId !== null) {
          // Moving from root to nested
          newRootIds = newRootIds.filter((rid) => rid !== id)
        } else if (oldParentId !== null && newParentId === null) {
          // Moving from nested to root
          newRootIds.splice(newSortOrder, 0, id)
        }

        set({
          nodes: newNodes,
          rootIds: newRootIds,
          history: newHistory,
          historyIndex: newHistoryIndex,
        })

        return true
      },

      // ─────────────────────────────────────────────────────────────────────
      // UI STATE
      // ─────────────────────────────────────────────────────────────────────

      toggleExpand: (id: string) => {
        const { expandedFolderIds, nodes } = get()
        const node = nodes[id]

        if (!node || !isFolder(node)) return

        const isExpanded = expandedFolderIds.includes(id)
        set({
          expandedFolderIds: isExpanded
            ? expandedFolderIds.filter((eid) => eid !== id)
            : [...expandedFolderIds, id],
        })
      },

      expandAll: () => {
        const { nodes } = get()
        const folderIds = Object.values(nodes)
          .filter(isFolder)
          .map((f) => f.id)
        set({ expandedFolderIds: folderIds })
      },

      collapseAll: () => {
        set({ expandedFolderIds: [] })
      },

      setSelected: (id: string | null) => {
        set({ selectedNodeId: id })
      },

      setEditing: (id: string | null) => {
        set({ editingNodeId: id })
      },

      setDragging: (id: string | null) => {
        set({ draggingNodeId: id })
      },

      // ─────────────────────────────────────────────────────────────────────
      // HISTORY (UNDO/REDO)
      // ─────────────────────────────────────────────────────────────────────

      undo: () => {
        const { history, historyIndex, nodes, rootIds } = get()

        if (historyIndex < 0) return

        const snapshot = history[historyIndex]

        // Save current state for redo (if not already at end)
        if (historyIndex === history.length - 1) {
          const newHistory = [...history]
          newHistory.push(createSnapshot(nodes, rootIds, 'Before undo'))
          set({ history: newHistory })
        }

        set({
          nodes: snapshot.nodes,
          rootIds: snapshot.rootIds,
          historyIndex: historyIndex - 1,
          editingNodeId: null,
        })
      },

      redo: () => {
        const { history, historyIndex } = get()

        if (historyIndex >= history.length - 2) return

        const nextSnapshot = history[historyIndex + 2]
        if (nextSnapshot) {
          set({
            nodes: nextSnapshot.nodes,
            rootIds: nextSnapshot.rootIds,
            historyIndex: historyIndex + 1,
          })
        }
      },

      canUndo: () => {
        return get().historyIndex >= 0
      },

      canRedo: () => {
        const { history, historyIndex } = get()
        return historyIndex < history.length - 2
      },

      // ─────────────────────────────────────────────────────────────────────
      // SYNC
      // ─────────────────────────────────────────────────────────────────────

      setSyncStatus: (status: SyncStatus) => {
        set({ syncStatus: status })
      },

      addPendingOperation: (op) => {
        const { pendingOperations } = get()
        set({
          pendingOperations: [
            ...pendingOperations,
            {
              ...op,
              id: generateId(),
              timestamp: Date.now(),
              retryCount: 0,
            },
          ],
        })
      },

      removePendingOperation: (id: string) => {
        const { pendingOperations } = get()
        set({
          pendingOperations: pendingOperations.filter((op) => op.id !== id),
        })
      },

      // ─────────────────────────────────────────────────────────────────────
      // API INTEGRATION (OPTIMISTIC UPDATES)
      // ─────────────────────────────────────────────────────────────────────

      replaceNodeId: (oldId: string, newId: string) => {
        const {
          nodes,
          rootIds,
          history,
          pendingOperations,
          selectedNodeId,
          editingNodeId,
          draggingNodeId,
          expandedFolderIds,
        } = get()

        const node = nodes[oldId]
        if (!node) return

        // 1. Build new nodes map with cascading parentId updates
        const newNodes: Record<string, WorkspaceNode> = {}
        for (const [id, n] of Object.entries(nodes)) {
          if (id === oldId) {
            // Replace the node with new ID
            newNodes[newId] = { ...n, id: newId, isOptimistic: false }
          } else if (n.parentId === oldId) {
            // Update child's parentId reference
            newNodes[id] = { ...n, parentId: newId }
          } else {
            newNodes[id] = n
          }
        }

        // 2. Update history snapshots (CRITICAL - prevents undo corruption)
        const newHistory = history.map((snapshot) => {
          const snapshotNodes: Record<string, WorkspaceNode> = {}
          for (const [id, n] of Object.entries(snapshot.nodes)) {
            if (id === oldId) {
              snapshotNodes[newId] = { ...n, id: newId, isOptimistic: false }
            } else if (n.parentId === oldId) {
              snapshotNodes[id] = { ...n, parentId: newId }
            } else {
              snapshotNodes[id] = n
            }
          }
          return {
            ...snapshot,
            nodes: snapshotNodes,
            rootIds: snapshot.rootIds.map((id) => (id === oldId ? newId : id)),
          }
        })

        // 3. Update pending operations
        const newPendingOps = pendingOperations.map((op) => ({
          ...op,
          nodeId: op.nodeId === oldId ? newId : op.nodeId,
        }))

        // 4. Update ALL UI state
        set({
          nodes: newNodes,
          rootIds: rootIds.map((id) => (id === oldId ? newId : id)),
          history: newHistory,
          pendingOperations: newPendingOps,
          selectedNodeId: selectedNodeId === oldId ? newId : selectedNodeId,
          editingNodeId: editingNodeId === oldId ? newId : editingNodeId,
          draggingNodeId: draggingNodeId === oldId ? newId : draggingNodeId,
          expandedFolderIds: expandedFolderIds.map((id) => (id === oldId ? newId : id)),
        })
      },

      confirmOptimistic: (id: string) => {
        const { nodes } = get()
        const node = nodes[id]

        if (!node) return

        set({
          nodes: {
            ...nodes,
            [id]: { ...node, isOptimistic: false },
          },
        })
      },

      rollbackNode: (id: string) => {
        // Use undo to revert the optimistic change
        // This leverages the existing history system
        const { canUndo, undo, nodes, selectedNodeId, editingNodeId } = get()

        // If we can undo, do it (this will revert to state before the optimistic add)
        if (canUndo()) {
          undo()
        } else {
          // Fallback: directly remove the node if no history
          const node = nodes[id]
          if (!node) return

          const newNodes = { ...nodes }
          delete newNodes[id]

          set({
            nodes: newNodes,
            rootIds: get().rootIds.filter((rid) => rid !== id),
            selectedNodeId: selectedNodeId === id ? null : selectedNodeId,
            editingNodeId: editingNodeId === id ? null : editingNodeId,
          })
        }
      },

      // ─────────────────────────────────────────────────────────────────────
      // COMPUTED
      // ─────────────────────────────────────────────────────────────────────

      getChildren: (parentId: string | null): WorkspaceNode[] => {
        const { nodes, rootIds } = get()

        if (parentId === null) {
          return rootIds.map((id) => nodes[id]).filter(Boolean)
        }

        return Object.values(nodes)
          .filter((n) => n.parentId === parentId)
          .sort((a, b) => a.sortOrder - b.sortOrder)
      },

      getDepth: (id: string): number => {
        const { nodes } = get()
        return calculateDepth(id, nodes)
      },

      canMoveToDepth: (nodeId: string, targetParentId: string | null): boolean => {
        const { nodes } = get()
        const node = nodes[nodeId]

        if (!node) return false

        // Calculate target depth
        const targetDepth = targetParentId
          ? calculateDepth(targetParentId, nodes) + 1
          : 0

        // If moving a folder, check if subtree would exceed max depth
        if (isFolder(node)) {
          const subtreeDepth = getSubtreeMaxDepth(nodeId, nodes)
          return targetDepth + subtreeDepth <= MAX_DEPTH
        }

        // Items can go up to MAX_DEPTH
        return targetDepth <= MAX_DEPTH
      },

      isDescendantOf: (nodeId: string, ancestorId: string): boolean => {
        const { nodes } = get()
        return checkIsDescendant(nodeId, ancestorId, nodes)
      },
    }),
    { name: 'workspace-store' }
  )
)

// =============================================================================
// NON-REACTIVE ACCESSORS
// =============================================================================

/** Get store state snapshot */
export function getWorkspaceState(): WorkspaceState {
  return useWorkspaceStore.getState()
}

/** Get store actions */
export function getWorkspaceActions(): WorkspaceActions {
  const state = useWorkspaceStore.getState()
  return {
    initialize: state.initialize,
    reset: state.reset,
    createFolder: state.createFolder,
    createItem: state.createItem,
    rename: state.rename,
    deleteNode: state.deleteNode,
    setColor: state.setColor,
    reorder: state.reorder,
    move: state.move,
    toggleExpand: state.toggleExpand,
    expandAll: state.expandAll,
    collapseAll: state.collapseAll,
    setSelected: state.setSelected,
    setEditing: state.setEditing,
    setDragging: state.setDragging,
    undo: state.undo,
    redo: state.redo,
    canUndo: state.canUndo,
    canRedo: state.canRedo,
    setSyncStatus: state.setSyncStatus,
    addPendingOperation: state.addPendingOperation,
    removePendingOperation: state.removePendingOperation,
    replaceNodeId: state.replaceNodeId,
    confirmOptimistic: state.confirmOptimistic,
    rollbackNode: state.rollbackNode,
    getChildren: state.getChildren,
    getDepth: state.getDepth,
    canMoveToDepth: state.canMoveToDepth,
    isDescendantOf: state.isDescendantOf,
  }
}
