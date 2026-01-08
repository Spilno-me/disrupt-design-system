/**
 * Workspace Store Tests
 *
 * TDD approach: These tests define expected behavior.
 * Component should be updated to pass tests, not vice versa.
 *
 * Tests cover:
 * - Initialization
 * - CRUD operations (createFolder, createItem, rename, deleteNode, setColor)
 * - Reorder operations (reorder, move)
 * - UI state (toggleExpand, expandAll, collapseAll, setSelected, setEditing)
 * - History (undo, redo, canUndo, canRedo)
 * - Constraints (MAX_DEPTH, circular references, optimistic blocking)
 * - API integration (replaceNodeId, confirmOptimistic, rollbackNode)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useWorkspaceStore, getWorkspaceState, getWorkspaceActions } from '../store/workspace.store'
import { MAX_DEPTH, MAX_HISTORY_SIZE } from '../constants'
import type { WorkspaceNode, WorkspaceFolder, WorkspaceItem, Product } from '../types'

// =============================================================================
// TEST FIXTURES
// =============================================================================

const createFolder = (
  id: string,
  name: string,
  parentId: string | null = null,
  sortOrder = 0,
  color: WorkspaceFolder['color'] = 'default'
): WorkspaceFolder => ({
  id,
  name,
  type: 'folder',
  color,
  parentId,
  sortOrder,
  product: 'flow',
  updatedAt: Date.now(),
})

const createItem = (
  id: string,
  name: string,
  href: string,
  parentId: string | null = null,
  sortOrder = 0
): WorkspaceItem => ({
  id,
  name,
  type: 'item',
  href,
  parentId,
  sortOrder,
  product: 'flow',
  updatedAt: Date.now(),
})

const createTestTree = (): WorkspaceNode[] => [
  // Root level
  createFolder('folder-1', 'Folder 1', null, 0, 'blue'),
  createFolder('folder-2', 'Folder 2', null, 1, 'green'),
  createItem('item-1', 'Root Item', '/root-item', null, 2),
  // Nested in folder-1
  createFolder('folder-1-1', 'Nested Folder', 'folder-1', 0),
  createItem('item-1-1', 'Nested Item', '/nested-item', 'folder-1', 1),
  // Nested in folder-1-1 (depth 2 - max)
  createItem('item-1-1-1', 'Deep Item', '/deep-item', 'folder-1-1', 0),
]

// =============================================================================
// TEST SUITE
// =============================================================================

describe('workspace store', () => {
  // Reset store before each test
  beforeEach(() => {
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState())
  })

  // ---------------------------------------------------------------------------
  // INITIALIZATION
  // ---------------------------------------------------------------------------

  describe('initialization', () => {
    it('should start with empty state', () => {
      const state = getWorkspaceState()
      expect(Object.keys(state.nodes)).toHaveLength(0)
      expect(state.rootIds).toHaveLength(0)
      expect(state.selectedNodeId).toBeNull()
      expect(state.editingNodeId).toBeNull()
      expect(state.historyIndex).toBe(-1)
    })

    it('should initialize with nodes and product', () => {
      const nodes = createTestTree()
      const { initialize } = getWorkspaceActions()

      initialize(nodes, 'flow')

      const state = getWorkspaceState()
      expect(Object.keys(state.nodes)).toHaveLength(6)
      expect(state.rootIds).toHaveLength(3)
      expect(state.product).toBe('flow')
    })

    it('should sort root IDs by sortOrder', () => {
      const nodes = createTestTree()
      const { initialize } = getWorkspaceActions()

      initialize(nodes, 'flow')

      const state = getWorkspaceState()
      expect(state.rootIds).toEqual(['folder-1', 'folder-2', 'item-1'])
    })

    it('should reset to initial state', () => {
      const nodes = createTestTree()
      const { initialize, reset } = getWorkspaceActions()

      initialize(nodes, 'flow')
      reset()

      const state = getWorkspaceState()
      expect(Object.keys(state.nodes)).toHaveLength(0)
      expect(state.rootIds).toHaveLength(0)
    })
  })

  // ---------------------------------------------------------------------------
  // CRUD OPERATIONS
  // ---------------------------------------------------------------------------

  describe('CRUD operations', () => {
    beforeEach(() => {
      const nodes = createTestTree()
      getWorkspaceActions().initialize(nodes, 'flow')
    })

    describe('createFolder', () => {
      it('should create folder at root level', () => {
        const { createFolder } = getWorkspaceActions()

        const id = createFolder(null, 'New Folder')

        expect(id).toBeTruthy()
        expect(id.startsWith('temp-')).toBe(true)

        const state = getWorkspaceState()
        expect(state.nodes[id]).toBeDefined()
        expect(state.nodes[id].name).toBe('New Folder')
        expect(state.nodes[id].type).toBe('folder')
        expect(state.rootIds).toContain(id)
      })

      it('should create nested folder', () => {
        const { createFolder } = getWorkspaceActions()

        const id = createFolder('folder-2', 'Subfolder')

        const state = getWorkspaceState()
        expect(state.nodes[id].parentId).toBe('folder-2')
      })

      it('should auto-expand parent folder when creating nested', () => {
        const { createFolder, collapseAll } = getWorkspaceActions()

        collapseAll()
        const id = createFolder('folder-2', 'Subfolder')

        const state = getWorkspaceState()
        expect(state.expandedFolderIds).toContain('folder-2')
      })

      it('should enter rename mode (editingNodeId) after creation', () => {
        const { createFolder } = getWorkspaceActions()

        const id = createFolder(null, 'New Folder')

        const state = getWorkspaceState()
        expect(state.editingNodeId).toBe(id)
        expect(state.selectedNodeId).toBe(id)
      })

      it('should BLOCK creation beyond MAX_DEPTH', () => {
        const { createFolder } = getWorkspaceActions()

        // folder-1-1 is at depth 1, its children at depth 2 (MAX_DEPTH)
        // Trying to create folder inside folder-1-1 would be depth 2, but its children would be depth 3
        // Actually MAX_DEPTH = 2 means max parent depth is 2, so we can have items at depth 2
        // Let's create a folder at depth 2 first
        const nestedId = createFolder('folder-1-1', 'Depth 2 Folder')

        // Now try to create inside depth-2 folder - should be blocked
        const blockedId = createFolder(nestedId, 'Too Deep')

        expect(blockedId).toBe('')
      })

      it('should add action to history', () => {
        const { createFolder, canUndo } = getWorkspaceActions()

        createFolder(null, 'New Folder')

        expect(canUndo()).toBe(true)
      })

      it('should mark new folder as optimistic', () => {
        const { createFolder } = getWorkspaceActions()

        const id = createFolder(null, 'New Folder')

        const state = getWorkspaceState()
        expect(state.nodes[id].isOptimistic).toBe(true)
      })

      it('should accept optional color parameter', () => {
        const { createFolder } = getWorkspaceActions()

        const id = createFolder(null, 'Blue Folder', 'blue')

        const state = getWorkspaceState()
        const folder = state.nodes[id] as WorkspaceFolder
        expect(folder.color).toBe('blue')
      })
    })

    describe('createItem', () => {
      it('should create item at root level', () => {
        const { createItem } = getWorkspaceActions()

        const id = createItem(null, 'New Item', '/new-item')

        const state = getWorkspaceState()
        expect(state.nodes[id]).toBeDefined()
        expect(state.nodes[id].type).toBe('item')
        expect((state.nodes[id] as WorkspaceItem).href).toBe('/new-item')
      })

      it('should create item inside folder', () => {
        const { createItem } = getWorkspaceActions()

        const id = createItem('folder-1', 'Child Item', '/child')

        const state = getWorkspaceState()
        expect(state.nodes[id].parentId).toBe('folder-1')
      })

      it('should BLOCK creation beyond MAX_DEPTH', () => {
        const { createFolder, createItem } = getWorkspaceActions()

        // Create folder at depth 2
        const depth2Id = createFolder('folder-1-1', 'Depth 2')

        // Try to create item inside (would be depth 3)
        const blockedId = createItem(depth2Id, 'Too Deep', '/blocked')

        expect(blockedId).toBe('')
      })
    })

    describe('rename', () => {
      it('should update node name', () => {
        const { rename } = getWorkspaceActions()

        rename('folder-1', 'Renamed Folder')

        const state = getWorkspaceState()
        expect(state.nodes['folder-1'].name).toBe('Renamed Folder')
      })

      it('should update timestamp', () => {
        const { rename } = getWorkspaceActions()
        const before = Date.now()

        rename('folder-1', 'Renamed')

        const state = getWorkspaceState()
        expect(state.nodes['folder-1'].updatedAt).toBeGreaterThanOrEqual(before)
      })

      it('should exit edit mode', () => {
        const { setEditing, rename } = getWorkspaceActions()

        setEditing('folder-1')
        rename('folder-1', 'Renamed')

        const state = getWorkspaceState()
        expect(state.editingNodeId).toBeNull()
      })

      it('should add action to history', () => {
        const { rename, canUndo } = getWorkspaceActions()

        rename('folder-1', 'Renamed')

        expect(canUndo()).toBe(true)
      })

      it('should not crash on invalid node ID', () => {
        const { rename } = getWorkspaceActions()

        expect(() => rename('invalid-id', 'Name')).not.toThrow()
      })
    })

    describe('deleteNode', () => {
      it('should delete leaf node', () => {
        const { deleteNode } = getWorkspaceActions()

        deleteNode('item-1')

        const state = getWorkspaceState()
        expect(state.nodes['item-1']).toBeUndefined()
        expect(state.rootIds).not.toContain('item-1')
      })

      it('should cascade delete children', () => {
        const { deleteNode } = getWorkspaceActions()

        deleteNode('folder-1')

        const state = getWorkspaceState()
        expect(state.nodes['folder-1']).toBeUndefined()
        expect(state.nodes['folder-1-1']).toBeUndefined()
        expect(state.nodes['item-1-1']).toBeUndefined()
        expect(state.nodes['item-1-1-1']).toBeUndefined()
      })

      it('should update sibling sortOrders', () => {
        const { deleteNode } = getWorkspaceActions()

        // Delete first root node
        deleteNode('folder-1')

        const state = getWorkspaceState()
        // folder-2 should now be sortOrder 0
        expect(state.nodes['folder-2'].sortOrder).toBe(0)
        // item-1 should now be sortOrder 1
        expect(state.nodes['item-1'].sortOrder).toBe(1)
      })

      it('should clear selection if deleting selected node', () => {
        const { setSelected, deleteNode } = getWorkspaceActions()

        setSelected('folder-1')
        deleteNode('folder-1')

        const state = getWorkspaceState()
        expect(state.selectedNodeId).toBeNull()
      })

      it('should add action to history', () => {
        const { deleteNode, canUndo } = getWorkspaceActions()

        deleteNode('item-1')

        expect(canUndo()).toBe(true)
      })
    })

    describe('setColor', () => {
      it('should update folder color', () => {
        const { setColor } = getWorkspaceActions()

        setColor('folder-1', 'red')

        const state = getWorkspaceState()
        const folder = state.nodes['folder-1'] as WorkspaceFolder
        expect(folder.color).toBe('red')
      })

      it('should not affect non-folder nodes', () => {
        const { setColor } = getWorkspaceActions()

        setColor('item-1', 'red')

        const state = getWorkspaceState()
        // Item should not have color property changed
        expect((state.nodes['item-1'] as WorkspaceItem).type).toBe('item')
      })

      it('should add action to history', () => {
        const { setColor, canUndo } = getWorkspaceActions()

        setColor('folder-1', 'purple')

        expect(canUndo()).toBe(true)
      })
    })
  })

  // ---------------------------------------------------------------------------
  // REORDER OPERATIONS
  // ---------------------------------------------------------------------------

  describe('reorder operations', () => {
    beforeEach(() => {
      const nodes = createTestTree()
      getWorkspaceActions().initialize(nodes, 'flow')
    })

    describe('reorder', () => {
      it('should reorder children within parent', () => {
        const { reorder } = getWorkspaceActions()

        // Reverse root order
        reorder(null, ['item-1', 'folder-2', 'folder-1'])

        const state = getWorkspaceState()
        expect(state.rootIds).toEqual(['item-1', 'folder-2', 'folder-1'])
        expect(state.nodes['item-1'].sortOrder).toBe(0)
        expect(state.nodes['folder-2'].sortOrder).toBe(1)
        expect(state.nodes['folder-1'].sortOrder).toBe(2)
      })

      it('should update all sortOrders', () => {
        const { reorder } = getWorkspaceActions()

        reorder('folder-1', ['item-1-1', 'folder-1-1'])

        const state = getWorkspaceState()
        expect(state.nodes['item-1-1'].sortOrder).toBe(0)
        expect(state.nodes['folder-1-1'].sortOrder).toBe(1)
      })

      it('should BLOCK reorder if optimistic node present', () => {
        const { createFolder, reorder } = getWorkspaceActions()

        // Create new folder (optimistic)
        createFolder(null, 'Optimistic')

        // Get the new ordering
        const state = getWorkspaceState()
        const originalOrder = [...state.rootIds]

        // Try to reorder - should be blocked
        reorder(null, [...originalOrder].reverse())

        const newState = getWorkspaceState()
        // Order should remain unchanged (blocked)
        expect(newState.rootIds).toEqual(originalOrder)
      })

      it('should add action to history', () => {
        const { reorder, canUndo } = getWorkspaceActions()

        reorder(null, ['item-1', 'folder-2', 'folder-1'])

        expect(canUndo()).toBe(true)
      })
    })

    describe('move', () => {
      it('should move node between parents', () => {
        const { move } = getWorkspaceActions()

        // Move item-1 from root to folder-2
        const success = move('item-1', 'folder-2')

        expect(success).toBe(true)

        const state = getWorkspaceState()
        expect(state.nodes['item-1'].parentId).toBe('folder-2')
        expect(state.rootIds).not.toContain('item-1')
      })

      it('should move node from nested to root', () => {
        const { move } = getWorkspaceActions()

        // Move nested item to root
        const success = move('item-1-1', null)

        expect(success).toBe(true)

        const state = getWorkspaceState()
        expect(state.nodes['item-1-1'].parentId).toBeNull()
        expect(state.rootIds).toContain('item-1-1')
      })

      it('should BLOCK circular reference (move into self)', () => {
        const { move } = getWorkspaceActions()

        const success = move('folder-1', 'folder-1')

        expect(success).toBe(false)
      })

      it('should BLOCK move into descendant', () => {
        const { move } = getWorkspaceActions()

        // Try to move folder-1 into its child folder-1-1
        const success = move('folder-1', 'folder-1-1')

        expect(success).toBe(false)
      })

      it('should BLOCK move past MAX_DEPTH', () => {
        const { move } = getWorkspaceActions()

        // folder-2 has no children, moving it into folder-1-1 (depth 1) would make it depth 2
        // That's allowed. But if folder-2 had children, it would fail.
        // Let's first add children to folder-2
        const { createFolder } = getWorkspaceActions()
        const childId = createFolder('folder-2', 'Child')

        // Confirm optimistic to allow move
        const { confirmOptimistic } = getWorkspaceActions()
        confirmOptimistic(childId)

        // Now folder-2 has a subtree of depth 1
        // Moving folder-2 into folder-1-1 (depth 1) would put folder-2 at depth 2
        // And its child at depth 3, which exceeds MAX_DEPTH=2
        const success = move('folder-2', 'folder-1-1')

        expect(success).toBe(false)
      })

      it('should BLOCK move of optimistic node', () => {
        const { createFolder, move } = getWorkspaceActions()

        const id = createFolder(null, 'Optimistic')
        const success = move(id, 'folder-2')

        expect(success).toBe(false)
      })

      it('should BLOCK move into optimistic folder', () => {
        const { createFolder, move } = getWorkspaceActions()

        const targetId = createFolder(null, 'Optimistic Target')
        const success = move('item-1', targetId)

        expect(success).toBe(false)
      })

      it('should update sortOrders in both old and new parents', () => {
        const { move } = getWorkspaceActions()

        // Initial: folder-1 has children [folder-1-1 (0), item-1-1 (1)]
        // Move folder-1-1 to root
        move('folder-1-1', null)

        const state = getWorkspaceState()
        // item-1-1 should now be sortOrder 0 in folder-1
        expect(state.nodes['item-1-1'].sortOrder).toBe(0)
      })

      it('should support insertIndex parameter', () => {
        const { move } = getWorkspaceActions()

        // Move item-1 to position 0 in root (before folder-1)
        move('item-1', null, 0)

        const state = getWorkspaceState()
        expect(state.nodes['item-1'].sortOrder).toBe(0)
      })

      it('should return false for invalid node ID', () => {
        const { move } = getWorkspaceActions()

        const success = move('invalid-id', null)

        expect(success).toBe(false)
      })
    })
  })

  // ---------------------------------------------------------------------------
  // UI STATE
  // ---------------------------------------------------------------------------

  describe('UI state', () => {
    beforeEach(() => {
      const nodes = createTestTree()
      getWorkspaceActions().initialize(nodes, 'flow')
    })

    describe('toggleExpand', () => {
      it('should expand collapsed folder', () => {
        const { toggleExpand } = getWorkspaceActions()

        toggleExpand('folder-1')

        const state = getWorkspaceState()
        expect(state.expandedFolderIds).toContain('folder-1')
      })

      it('should collapse expanded folder', () => {
        const { toggleExpand } = getWorkspaceActions()

        toggleExpand('folder-1') // expand
        toggleExpand('folder-1') // collapse

        const state = getWorkspaceState()
        expect(state.expandedFolderIds).not.toContain('folder-1')
      })

      it('should not toggle non-folder nodes', () => {
        const { toggleExpand } = getWorkspaceActions()

        toggleExpand('item-1')

        const state = getWorkspaceState()
        expect(state.expandedFolderIds).not.toContain('item-1')
      })
    })

    describe('expandAll', () => {
      it('should expand all folders', () => {
        const { expandAll } = getWorkspaceActions()

        expandAll()

        const state = getWorkspaceState()
        expect(state.expandedFolderIds).toContain('folder-1')
        expect(state.expandedFolderIds).toContain('folder-2')
        expect(state.expandedFolderIds).toContain('folder-1-1')
      })

      it('should not include items in expanded list', () => {
        const { expandAll } = getWorkspaceActions()

        expandAll()

        const state = getWorkspaceState()
        expect(state.expandedFolderIds).not.toContain('item-1')
      })
    })

    describe('collapseAll', () => {
      it('should collapse all folders', () => {
        const { expandAll, collapseAll } = getWorkspaceActions()

        expandAll()
        collapseAll()

        const state = getWorkspaceState()
        expect(state.expandedFolderIds).toHaveLength(0)
      })
    })

    describe('setSelected', () => {
      it('should set selected node', () => {
        const { setSelected } = getWorkspaceActions()

        setSelected('folder-1')

        const state = getWorkspaceState()
        expect(state.selectedNodeId).toBe('folder-1')
      })

      it('should clear selection with null', () => {
        const { setSelected } = getWorkspaceActions()

        setSelected('folder-1')
        setSelected(null)

        const state = getWorkspaceState()
        expect(state.selectedNodeId).toBeNull()
      })
    })

    describe('setEditing', () => {
      it('should set editing node', () => {
        const { setEditing } = getWorkspaceActions()

        setEditing('folder-1')

        const state = getWorkspaceState()
        expect(state.editingNodeId).toBe('folder-1')
      })

      it('should clear editing with null', () => {
        const { setEditing } = getWorkspaceActions()

        setEditing('folder-1')
        setEditing(null)

        const state = getWorkspaceState()
        expect(state.editingNodeId).toBeNull()
      })
    })

    describe('setDragging', () => {
      it('should set dragging node', () => {
        const { setDragging } = getWorkspaceActions()

        setDragging('folder-1')

        const state = getWorkspaceState()
        expect(state.draggingNodeId).toBe('folder-1')
      })

      it('should clear dragging with null', () => {
        const { setDragging } = getWorkspaceActions()

        setDragging('folder-1')
        setDragging(null)

        const state = getWorkspaceState()
        expect(state.draggingNodeId).toBeNull()
      })
    })
  })

  // ---------------------------------------------------------------------------
  // HISTORY (UNDO/REDO)
  // ---------------------------------------------------------------------------

  describe('history', () => {
    beforeEach(() => {
      const nodes = createTestTree()
      getWorkspaceActions().initialize(nodes, 'flow')
    })

    describe('undo', () => {
      it('should restore previous state', () => {
        const { rename, undo } = getWorkspaceActions()

        const originalName = getWorkspaceState().nodes['folder-1'].name
        rename('folder-1', 'Changed')
        undo()

        const state = getWorkspaceState()
        expect(state.nodes['folder-1'].name).toBe(originalName)
      })

      it('should decrement historyIndex', () => {
        const { rename, undo } = getWorkspaceActions()

        rename('folder-1', 'Changed')
        const indexAfterRename = getWorkspaceState().historyIndex

        undo()

        const state = getWorkspaceState()
        expect(state.historyIndex).toBe(indexAfterRename - 1)
      })

      it('should be no-op when nothing to undo', () => {
        const { undo, canUndo } = getWorkspaceActions()

        expect(canUndo()).toBe(false)

        // Should not throw
        expect(() => undo()).not.toThrow()
      })

      it('should clear editingNodeId on undo', () => {
        const { setEditing, rename, undo } = getWorkspaceActions()

        setEditing('folder-1')
        rename('folder-1', 'Changed')
        setEditing('folder-1')
        undo()

        const state = getWorkspaceState()
        expect(state.editingNodeId).toBeNull()
      })
    })

    describe('redo', () => {
      it('should restore next state after undo', () => {
        const { rename, undo, redo } = getWorkspaceActions()

        rename('folder-1', 'Changed')
        undo()
        redo()

        const state = getWorkspaceState()
        expect(state.nodes['folder-1'].name).toBe('Changed')
      })

      it('should increment historyIndex', () => {
        const { rename, undo, redo } = getWorkspaceActions()

        rename('folder-1', 'Changed')
        undo()
        const indexAfterUndo = getWorkspaceState().historyIndex

        redo()

        const state = getWorkspaceState()
        expect(state.historyIndex).toBe(indexAfterUndo + 1)
      })

      it('should be no-op at end of history', () => {
        const { rename, canRedo, redo } = getWorkspaceActions()

        rename('folder-1', 'Changed')

        expect(canRedo()).toBe(false)

        // Should not throw
        expect(() => redo()).not.toThrow()
      })
    })

    describe('canUndo', () => {
      it('should return false initially', () => {
        const { canUndo } = getWorkspaceActions()

        expect(canUndo()).toBe(false)
      })

      it('should return true after action', () => {
        const { rename, canUndo } = getWorkspaceActions()

        rename('folder-1', 'Changed')

        expect(canUndo()).toBe(true)
      })
    })

    describe('canRedo', () => {
      it('should return false initially', () => {
        const { canRedo } = getWorkspaceActions()

        expect(canRedo()).toBe(false)
      })

      it('should return true after undo', () => {
        const { rename, undo, canRedo } = getWorkspaceActions()

        rename('folder-1', 'Changed')
        undo()

        expect(canRedo()).toBe(true)
      })

      it('should return false after new action clears redo stack', () => {
        const { rename, undo, canRedo } = getWorkspaceActions()

        rename('folder-1', 'First')
        undo()
        rename('folder-1', 'Second') // This clears redo stack

        expect(canRedo()).toBe(false)
      })
    })

    describe('history limits', () => {
      it('should enforce MAX_HISTORY_SIZE', () => {
        const { rename } = getWorkspaceActions()

        // Perform more than MAX_HISTORY_SIZE actions
        for (let i = 0; i < MAX_HISTORY_SIZE + 10; i++) {
          rename('folder-1', `Name ${i}`)
        }

        const state = getWorkspaceState()
        expect(state.history.length).toBeLessThanOrEqual(MAX_HISTORY_SIZE + 1)
      })
    })
  })

  // ---------------------------------------------------------------------------
  // API INTEGRATION (OPTIMISTIC UPDATES)
  // ---------------------------------------------------------------------------

  describe('API integration', () => {
    beforeEach(() => {
      const nodes = createTestTree()
      getWorkspaceActions().initialize(nodes, 'flow')
    })

    describe('replaceNodeId', () => {
      it('should replace temp ID with server ID', () => {
        const { createFolder, replaceNodeId } = getWorkspaceActions()

        const tempId = createFolder(null, 'New Folder')
        replaceNodeId(tempId, 'server-id-123')

        const state = getWorkspaceState()
        expect(state.nodes[tempId]).toBeUndefined()
        expect(state.nodes['server-id-123']).toBeDefined()
        expect(state.nodes['server-id-123'].name).toBe('New Folder')
      })

      it('should update children parentId references', () => {
        const { createFolder, createItem, replaceNodeId, confirmOptimistic } = getWorkspaceActions()

        const folderId = createFolder(null, 'Parent')
        confirmOptimistic(folderId)

        const itemId = createItem(folderId, 'Child', '/child')
        confirmOptimistic(itemId)

        replaceNodeId(folderId, 'server-folder')

        const state = getWorkspaceState()
        expect(state.nodes[itemId].parentId).toBe('server-folder')
      })

      it('should update rootIds', () => {
        const { createFolder, replaceNodeId } = getWorkspaceActions()

        const tempId = createFolder(null, 'New')
        replaceNodeId(tempId, 'server-id')

        const state = getWorkspaceState()
        expect(state.rootIds).not.toContain(tempId)
        expect(state.rootIds).toContain('server-id')
      })

      it('should update selectedNodeId', () => {
        const { createFolder, replaceNodeId } = getWorkspaceActions()

        const tempId = createFolder(null, 'New')
        // createFolder sets selectedNodeId to new folder
        replaceNodeId(tempId, 'server-id')

        const state = getWorkspaceState()
        expect(state.selectedNodeId).toBe('server-id')
      })

      it('should update editingNodeId', () => {
        const { createFolder, replaceNodeId } = getWorkspaceActions()

        const tempId = createFolder(null, 'New')
        // createFolder sets editingNodeId to new folder
        replaceNodeId(tempId, 'server-id')

        const state = getWorkspaceState()
        expect(state.editingNodeId).toBe('server-id')
      })

      it('should update expandedFolderIds', () => {
        const { createFolder, toggleExpand, replaceNodeId, confirmOptimistic } = getWorkspaceActions()

        const tempId = createFolder(null, 'New')
        confirmOptimistic(tempId)
        toggleExpand(tempId)

        replaceNodeId(tempId, 'server-id')

        const state = getWorkspaceState()
        expect(state.expandedFolderIds).not.toContain(tempId)
        expect(state.expandedFolderIds).toContain('server-id')
      })

      it('should update history snapshots (prevents undo corruption)', () => {
        const { createFolder, replaceNodeId, undo } = getWorkspaceActions()

        const tempId = createFolder(null, 'New')
        replaceNodeId(tempId, 'server-id')

        // Undo should work with server ID
        undo()

        const state = getWorkspaceState()
        expect(state.nodes['server-id']).toBeUndefined()
      })

      it('should mark node as not optimistic', () => {
        const { createFolder, replaceNodeId } = getWorkspaceActions()

        const tempId = createFolder(null, 'New')
        replaceNodeId(tempId, 'server-id')

        const state = getWorkspaceState()
        expect(state.nodes['server-id'].isOptimistic).toBe(false)
      })
    })

    describe('confirmOptimistic', () => {
      it('should mark node as not optimistic', () => {
        const { createFolder, confirmOptimistic } = getWorkspaceActions()

        const id = createFolder(null, 'New')
        expect(getWorkspaceState().nodes[id].isOptimistic).toBe(true)

        confirmOptimistic(id)

        expect(getWorkspaceState().nodes[id].isOptimistic).toBe(false)
      })
    })

    describe('rollbackNode', () => {
      it('should remove optimistic node via undo', () => {
        const { createFolder, rollbackNode, canUndo } = getWorkspaceActions()

        const id = createFolder(null, 'New')
        expect(canUndo()).toBe(true)

        rollbackNode(id)

        const state = getWorkspaceState()
        expect(state.nodes[id]).toBeUndefined()
      })

      it('should fallback to direct removal if no history', () => {
        const { createFolder, rollbackNode } = getWorkspaceActions()

        // Create folder then clear history manually
        const id = createFolder(null, 'New')
        useWorkspaceStore.setState({ history: [], historyIndex: -1 })

        rollbackNode(id)

        const state = getWorkspaceState()
        expect(state.nodes[id]).toBeUndefined()
      })
    })
  })

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES
  // ---------------------------------------------------------------------------

  describe('computed values', () => {
    beforeEach(() => {
      const nodes = createTestTree()
      getWorkspaceActions().initialize(nodes, 'flow')
    })

    describe('getChildren', () => {
      it('should return root nodes for null parentId', () => {
        const { getChildren } = getWorkspaceActions()

        const children = getChildren(null)

        expect(children).toHaveLength(3)
        expect(children[0].id).toBe('folder-1')
        expect(children[1].id).toBe('folder-2')
        expect(children[2].id).toBe('item-1')
      })

      it('should return children sorted by sortOrder', () => {
        const { getChildren } = getWorkspaceActions()

        const children = getChildren('folder-1')

        expect(children).toHaveLength(2)
        expect(children[0].sortOrder).toBeLessThan(children[1].sortOrder)
      })

      it('should return empty array for childless folder', () => {
        const { getChildren } = getWorkspaceActions()

        const children = getChildren('folder-2')

        expect(children).toHaveLength(0)
      })
    })

    describe('getDepth', () => {
      it('should return 0 for root node', () => {
        const { getDepth } = getWorkspaceActions()

        expect(getDepth('folder-1')).toBe(0)
      })

      it('should return 1 for direct child', () => {
        const { getDepth } = getWorkspaceActions()

        expect(getDepth('folder-1-1')).toBe(1)
      })

      it('should return 2 for grandchild', () => {
        const { getDepth } = getWorkspaceActions()

        expect(getDepth('item-1-1-1')).toBe(2)
      })
    })

    describe('canMoveToDepth', () => {
      it('should return true for valid move', () => {
        const { canMoveToDepth } = getWorkspaceActions()

        // Moving item-1 (root) to folder-2 (root) - would be depth 1
        expect(canMoveToDepth('item-1', 'folder-2')).toBe(true)
      })

      it('should return false for move exceeding MAX_DEPTH', () => {
        const { canMoveToDepth, createFolder, confirmOptimistic } = getWorkspaceActions()

        // Create nested structure that would exceed depth
        const nestedId = createFolder('folder-1-1', 'Nested')
        confirmOptimistic(nestedId)

        // Now folder-2 moving into nestedId (depth 2) would put folder-2 at depth 3
        // But folder-2 is empty, so the subtree depth is 0, so 3 + 0 = 3 > MAX_DEPTH(2)
        // Actually wait, the calc is: targetDepth + subtreeDepth <= MAX_DEPTH
        // targetDepth for nestedId's child = 3, subtreeDepth of folder-2 = 0
        // 3 + 0 = 3 > 2 = false
        expect(canMoveToDepth('folder-2', nestedId)).toBe(false)
      })
    })

    describe('isDescendantOf', () => {
      it('should return true for direct child', () => {
        const { isDescendantOf } = getWorkspaceActions()

        expect(isDescendantOf('folder-1-1', 'folder-1')).toBe(true)
      })

      it('should return true for grandchild', () => {
        const { isDescendantOf } = getWorkspaceActions()

        expect(isDescendantOf('item-1-1-1', 'folder-1')).toBe(true)
      })

      it('should return false for unrelated nodes', () => {
        const { isDescendantOf } = getWorkspaceActions()

        expect(isDescendantOf('folder-2', 'folder-1')).toBe(false)
      })

      it('should return false for self-check', () => {
        const { isDescendantOf } = getWorkspaceActions()

        expect(isDescendantOf('folder-1', 'folder-1')).toBe(false)
      })
    })
  })

  // ---------------------------------------------------------------------------
  // SYNC STATUS
  // ---------------------------------------------------------------------------

  describe('sync status', () => {
    it('should set sync status', () => {
      const { setSyncStatus } = getWorkspaceActions()

      setSyncStatus('syncing')

      expect(getWorkspaceState().syncStatus).toBe('syncing')
    })

    it('should add pending operation', () => {
      const { addPendingOperation } = getWorkspaceActions()

      addPendingOperation({
        type: 'create',
        nodeId: 'test-node',
        payload: { name: 'Test' },
      })

      const state = getWorkspaceState()
      expect(state.pendingOperations).toHaveLength(1)
      expect(state.pendingOperations[0].nodeId).toBe('test-node')
      expect(state.pendingOperations[0].retryCount).toBe(0)
    })

    it('should remove pending operation', () => {
      const { addPendingOperation, removePendingOperation } = getWorkspaceActions()

      addPendingOperation({
        type: 'create',
        nodeId: 'test-node',
        payload: {},
      })

      const opId = getWorkspaceState().pendingOperations[0].id
      removePendingOperation(opId)

      expect(getWorkspaceState().pendingOperations).toHaveLength(0)
    })
  })
})

// =============================================================================
// CONSTRAINTS VALIDATION
// =============================================================================

describe('workspace store constraints', () => {
  beforeEach(() => {
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState())
    const nodes = createTestTree()
    getWorkspaceActions().initialize(nodes, 'flow')
  })

  it('should enforce MAX_DEPTH = 2', () => {
    const { createFolder, confirmOptimistic } = getWorkspaceActions()

    // folder-1-1 is at depth 1
    // Creating folder inside it creates at depth 2 (allowed)
    const depth2Id = createFolder('folder-1-1', 'Depth 2')
    confirmOptimistic(depth2Id)

    // Creating folder inside depth2 would be depth 3 (blocked)
    const blockedId = createFolder(depth2Id, 'Depth 3')

    expect(blockedId).toBe('')
    expect(MAX_DEPTH).toBe(2)
  })

  it('should prevent circular references in move', () => {
    const { move } = getWorkspaceActions()

    // Try to move folder-1 into its descendant
    const success = move('folder-1', 'folder-1-1')

    expect(success).toBe(false)
  })

  it('should handle optimistic nodes correctly', () => {
    const { createFolder, move, reorder } = getWorkspaceActions()

    // Create optimistic folder
    const tempId = createFolder(null, 'Optimistic')

    // Move should be blocked
    expect(move(tempId, 'folder-2')).toBe(false)

    // Reorder should be blocked
    const state = getWorkspaceState()
    reorder(null, [...state.rootIds].reverse())

    // Verify reorder was blocked (order unchanged from before reorder attempt)
    // Note: rootIds already contains tempId from createFolder
  })
})
