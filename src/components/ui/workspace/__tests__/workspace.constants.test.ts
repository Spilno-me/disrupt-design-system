/**
 * Workspace Constants Tests
 *
 * TDD approach: Tests define expected behavior for constants and pure functions.
 */

import { describe, it, expect } from 'vitest'
import {
  MAX_DEPTH,
  MAX_CHILDREN_PER_FOLDER,
  MAX_TOTAL_NODES,
  MAX_HISTORY_SIZE,
  MAX_NAME_LENGTH,
  WORKSPACE_MAX_HEIGHT,
  BASE_INDENT_PX,
  INDENT_PER_LEVEL_PX,
  getIndentPx,
  DOUBLE_CLICK_THRESHOLD_MS,
  DRAG_EXPAND_DELAY_MS,
  UNDO_TOAST_DURATION_MS,
  RETRY_DELAYS_MS,
  ARIA_ANNOUNCE_DELAY_MS,
  KEYBOARD_SHORTCUTS,
  FOLDER_COLOR_MAP,
} from '../constants'
import { FOLDER_COLORS, isFolder, isItem } from '../types'
import type { WorkspaceFolder, WorkspaceItem } from '../types'

// =============================================================================
// STRUCTURE LIMITS
// =============================================================================

describe('structure limits', () => {
  it('should define MAX_DEPTH as 2 (root → child → grandchild)', () => {
    expect(MAX_DEPTH).toBe(2)
  })

  it('should define MAX_CHILDREN_PER_FOLDER as reasonable limit', () => {
    expect(MAX_CHILDREN_PER_FOLDER).toBe(50)
    expect(MAX_CHILDREN_PER_FOLDER).toBeGreaterThan(0)
    expect(MAX_CHILDREN_PER_FOLDER).toBeLessThanOrEqual(100)
  })

  it('should define MAX_TOTAL_NODES as reasonable limit', () => {
    expect(MAX_TOTAL_NODES).toBe(200)
    expect(MAX_TOTAL_NODES).toBeGreaterThan(MAX_CHILDREN_PER_FOLDER)
  })

  it('should define MAX_HISTORY_SIZE for undo/redo', () => {
    expect(MAX_HISTORY_SIZE).toBe(50)
    expect(MAX_HISTORY_SIZE).toBeGreaterThan(10) // Allow meaningful history
  })

  it('should define MAX_NAME_LENGTH for folder/item names', () => {
    expect(MAX_NAME_LENGTH).toBe(50)
    expect(MAX_NAME_LENGTH).toBeGreaterThan(10) // Allow reasonable names
    expect(MAX_NAME_LENGTH).toBeLessThanOrEqual(100) // Fit in UI
  })
})

// =============================================================================
// LAYOUT CONSTANTS
// =============================================================================

describe('layout constants', () => {
  it('should define WORKSPACE_MAX_HEIGHT as CSS value', () => {
    expect(WORKSPACE_MAX_HEIGHT).toBe('300px')
    expect(WORKSPACE_MAX_HEIGHT).toMatch(/^\d+px$/)
  })

  it('should define BASE_INDENT_PX as reasonable base padding', () => {
    expect(BASE_INDENT_PX).toBe(12)
    expect(BASE_INDENT_PX).toBeGreaterThan(0)
  })

  it('should define INDENT_PER_LEVEL_PX as reasonable step', () => {
    expect(INDENT_PER_LEVEL_PX).toBe(20)
    expect(INDENT_PER_LEVEL_PX).toBeGreaterThanOrEqual(16) // Minimum for visual distinction
  })
})

// =============================================================================
// INDENTATION FUNCTION
// =============================================================================

describe('getIndentPx', () => {
  it('should return BASE_INDENT_PX for depth 0', () => {
    expect(getIndentPx(0)).toBe(BASE_INDENT_PX)
  })

  it('should increase by INDENT_PER_LEVEL_PX per depth', () => {
    const depth0 = getIndentPx(0)
    const depth1 = getIndentPx(1)
    const depth2 = getIndentPx(2)

    expect(depth1 - depth0).toBe(INDENT_PER_LEVEL_PX)
    expect(depth2 - depth1).toBe(INDENT_PER_LEVEL_PX)
  })

  it('should calculate correctly: BASE + (depth * PER_LEVEL)', () => {
    expect(getIndentPx(0)).toBe(12) // 12 + 0*20
    expect(getIndentPx(1)).toBe(32) // 12 + 1*20
    expect(getIndentPx(2)).toBe(52) // 12 + 2*20
    expect(getIndentPx(3)).toBe(72) // 12 + 3*20 (even if beyond MAX_DEPTH)
  })

  it('should work with any depth (no upper bound in function)', () => {
    expect(getIndentPx(5)).toBe(12 + 5 * 20)
    expect(getIndentPx(10)).toBe(12 + 10 * 20)
  })
})

// =============================================================================
// TIMING CONSTANTS
// =============================================================================

describe('timing constants', () => {
  it('should define DOUBLE_CLICK_THRESHOLD_MS', () => {
    expect(DOUBLE_CLICK_THRESHOLD_MS).toBe(300)
    // Should be within typical double-click range (200-500ms)
    expect(DOUBLE_CLICK_THRESHOLD_MS).toBeGreaterThanOrEqual(200)
    expect(DOUBLE_CLICK_THRESHOLD_MS).toBeLessThanOrEqual(500)
  })

  it('should define DRAG_EXPAND_DELAY_MS for folder auto-expand', () => {
    expect(DRAG_EXPAND_DELAY_MS).toBe(500)
    // Not too fast (accidental), not too slow (frustrating)
    expect(DRAG_EXPAND_DELAY_MS).toBeGreaterThanOrEqual(300)
    expect(DRAG_EXPAND_DELAY_MS).toBeLessThanOrEqual(1000)
  })

  it('should define UNDO_TOAST_DURATION_MS', () => {
    expect(UNDO_TOAST_DURATION_MS).toBe(5000)
    // Long enough to read and act
    expect(UNDO_TOAST_DURATION_MS).toBeGreaterThanOrEqual(3000)
  })

  it('should define RETRY_DELAYS_MS with exponential backoff', () => {
    expect(RETRY_DELAYS_MS).toEqual([1000, 2000, 4000])
    // Should be increasing
    for (let i = 1; i < RETRY_DELAYS_MS.length; i++) {
      expect(RETRY_DELAYS_MS[i]).toBeGreaterThan(RETRY_DELAYS_MS[i - 1])
    }
  })

  it('should define ARIA_ANNOUNCE_DELAY_MS', () => {
    expect(ARIA_ANNOUNCE_DELAY_MS).toBe(100)
    // Should be short for responsive announcements
    expect(ARIA_ANNOUNCE_DELAY_MS).toBeLessThanOrEqual(200)
  })
})

// =============================================================================
// KEYBOARD SHORTCUTS
// =============================================================================

describe('keyboard shortcuts', () => {
  it('should define all expected shortcuts', () => {
    expect(KEYBOARD_SHORTCUTS).toHaveProperty('RENAME')
    expect(KEYBOARD_SHORTCUTS).toHaveProperty('DELETE')
    expect(KEYBOARD_SHORTCUTS).toHaveProperty('NEW_FOLDER')
    expect(KEYBOARD_SHORTCUTS).toHaveProperty('UNDO')
    expect(KEYBOARD_SHORTCUTS).toHaveProperty('REDO')
    expect(KEYBOARD_SHORTCUTS).toHaveProperty('EXPAND')
    expect(KEYBOARD_SHORTCUTS).toHaveProperty('COLLAPSE')
    expect(KEYBOARD_SHORTCUTS).toHaveProperty('NEXT')
    expect(KEYBOARD_SHORTCUTS).toHaveProperty('PREV')
    expect(KEYBOARD_SHORTCUTS).toHaveProperty('SELECT')
    expect(KEYBOARD_SHORTCUTS).toHaveProperty('CANCEL')
  })

  it('should use standard conventions', () => {
    expect(KEYBOARD_SHORTCUTS.RENAME).toBe('F2')
    expect(KEYBOARD_SHORTCUTS.DELETE).toBe('Delete')
    expect(KEYBOARD_SHORTCUTS.UNDO).toBe('cmd+z')
    expect(KEYBOARD_SHORTCUTS.REDO).toBe('cmd+shift+z')
    expect(KEYBOARD_SHORTCUTS.EXPAND).toBe('ArrowRight')
    expect(KEYBOARD_SHORTCUTS.COLLAPSE).toBe('ArrowLeft')
    expect(KEYBOARD_SHORTCUTS.NEXT).toBe('ArrowDown')
    expect(KEYBOARD_SHORTCUTS.PREV).toBe('ArrowUp')
    expect(KEYBOARD_SHORTCUTS.SELECT).toBe('Enter')
    expect(KEYBOARD_SHORTCUTS.CANCEL).toBe('Escape')
  })
})

// =============================================================================
// FOLDER COLOR MAP
// =============================================================================

describe('folder color map', () => {
  it('should define all FOLDER_COLORS', () => {
    for (const color of FOLDER_COLORS) {
      expect(FOLDER_COLOR_MAP).toHaveProperty(color)
    }
  })

  it('should have bg, text, and icon classes for each color', () => {
    for (const color of FOLDER_COLORS) {
      const config = FOLDER_COLOR_MAP[color]
      expect(config).toHaveProperty('bg')
      expect(config).toHaveProperty('text')
      expect(config).toHaveProperty('icon')
    }
  })

  it('should use DDS token classes (bg-*, text-*)', () => {
    for (const color of FOLDER_COLORS) {
      const config = FOLDER_COLOR_MAP[color]
      expect(config.bg).toMatch(/^bg-/)
      expect(config.text).toMatch(/^text-/)
      expect(config.icon).toMatch(/^text-/)
    }
  })

  it('should have default color as first/muted', () => {
    const defaultConfig = FOLDER_COLOR_MAP.default
    expect(defaultConfig.bg).toBe('bg-muted-bg')
    expect(defaultConfig.text).toBe('text-primary')
    expect(defaultConfig.icon).toBe('text-muted')
  })

  it('should use semantic colors for non-default', () => {
    expect(FOLDER_COLOR_MAP.blue.icon).toContain('info')
    expect(FOLDER_COLOR_MAP.green.icon).toContain('success')
    expect(FOLDER_COLOR_MAP.amber.icon).toContain('warning')
    expect(FOLDER_COLOR_MAP.red.icon).toContain('error')
  })
})

// =============================================================================
// TYPE GUARDS
// =============================================================================

describe('type guards', () => {
  const mockFolder: WorkspaceFolder = {
    id: 'f1',
    name: 'Test Folder',
    type: 'folder',
    color: 'default',
    parentId: null,
    sortOrder: 0,
    product: 'flow',
    updatedAt: Date.now(),
  }

  const mockItem: WorkspaceItem = {
    id: 'i1',
    name: 'Test Item',
    type: 'item',
    href: '/test',
    parentId: null,
    sortOrder: 0,
    product: 'flow',
    updatedAt: Date.now(),
  }

  describe('isFolder', () => {
    it('should return true for folder nodes', () => {
      expect(isFolder(mockFolder)).toBe(true)
    })

    it('should return false for item nodes', () => {
      expect(isFolder(mockItem)).toBe(false)
    })

    it('should narrow type correctly', () => {
      if (isFolder(mockFolder)) {
        // TypeScript should allow access to folder-specific props
        expect(mockFolder.color).toBeDefined()
      }
    })
  })

  describe('isItem', () => {
    it('should return true for item nodes', () => {
      expect(isItem(mockItem)).toBe(true)
    })

    it('should return false for folder nodes', () => {
      expect(isItem(mockFolder)).toBe(false)
    })

    it('should narrow type correctly', () => {
      if (isItem(mockItem)) {
        // TypeScript should allow access to item-specific props
        expect(mockItem.href).toBeDefined()
      }
    })
  })
})

// =============================================================================
// FOLDER_COLORS ARRAY
// =============================================================================

describe('FOLDER_COLORS array', () => {
  it('should include default as first color', () => {
    expect(FOLDER_COLORS[0]).toBe('default')
  })

  it('should have 7 color options', () => {
    expect(FOLDER_COLORS).toHaveLength(7)
  })

  it('should include expected colors', () => {
    expect(FOLDER_COLORS).toContain('default')
    expect(FOLDER_COLORS).toContain('blue')
    expect(FOLDER_COLORS).toContain('green')
    expect(FOLDER_COLORS).toContain('amber')
    expect(FOLDER_COLORS).toContain('red')
    expect(FOLDER_COLORS).toContain('purple')
    expect(FOLDER_COLORS).toContain('cyan')
  })
})
