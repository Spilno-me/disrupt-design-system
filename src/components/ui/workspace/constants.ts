/**
 * Workspace Constants
 *
 * Limits, colors, and configuration for workspace navigation.
 */

import type { FolderColor } from './types'

// =============================================================================
// STRUCTURE LIMITS
// =============================================================================

/** Maximum nesting depth (root = 0, child = 1, grandchild = 2) */
export const MAX_DEPTH = 2

/** Maximum items per folder (performance guard) */
export const MAX_CHILDREN_PER_FOLDER = 50

/** Maximum total nodes per workspace */
export const MAX_TOTAL_NODES = 200

/** History size for undo/redo */
export const MAX_HISTORY_SIZE = 50

/** Maximum characters for folder/item names */
export const MAX_NAME_LENGTH = 50

// =============================================================================
// LAYOUT
// =============================================================================

/** Maximum height for workspace content area (prevents excessive scrolling) */
export const WORKSPACE_MAX_HEIGHT = '300px'

// =============================================================================
// FOLDER COLOR TOKENS (DDS compliant)
// =============================================================================

/**
 * Map folder colors to DDS tokens
 * Agent 7 validated these tokens for accessibility
 */
export const FOLDER_COLOR_MAP: Record<FolderColor, { bg: string; text: string; icon: string }> = {
  default: {
    bg: 'bg-muted-bg',
    text: 'text-primary',
    icon: 'text-muted',
  },
  blue: {
    bg: 'bg-info-light',
    text: 'text-info',
    icon: 'text-info',
  },
  green: {
    bg: 'bg-success-light',
    text: 'text-success-strong',
    icon: 'text-success',
  },
  amber: {
    bg: 'bg-warning-light',
    text: 'text-warning-dark',
    icon: 'text-warning',
  },
  red: {
    bg: 'bg-error-light',
    text: 'text-error-strong',
    icon: 'text-error',
  },
  purple: {
    bg: 'bg-light-purple',
    text: 'text-dark-purple',
    icon: 'text-dark-purple',
  },
  cyan: {
    bg: 'bg-accent-bg',
    text: 'text-text-accent',
    icon: 'text-accent',
  },
}

// =============================================================================
// INDENTATION (Visual Hierarchy)
// =============================================================================

/** Base padding for level 0 (root folders) */
export const BASE_INDENT_PX = 12

/** Increment per depth level */
export const INDENT_PER_LEVEL_PX = 20

/**
 * Get padding-left value for a given depth
 */
export function getIndentPx(depth: number): number {
  return BASE_INDENT_PX + depth * INDENT_PER_LEVEL_PX
}

// =============================================================================
// TIMING
// =============================================================================

/** Double-click threshold in ms (Agent 6 recommendation) */
export const DOUBLE_CLICK_THRESHOLD_MS = 300

/** Auto-expand folder delay during drag (hover time) */
export const DRAG_EXPAND_DELAY_MS = 500

/** Toast duration for undo action */
export const UNDO_TOAST_DURATION_MS = 5000

/** API retry delays (exponential backoff) */
export const RETRY_DELAYS_MS = [1000, 2000, 4000]

// =============================================================================
// ACCESSIBILITY
// =============================================================================

/** ARIA live region announcement delay */
export const ARIA_ANNOUNCE_DELAY_MS = 100

// =============================================================================
// KEYBOARD SHORTCUTS
// =============================================================================

export const KEYBOARD_SHORTCUTS = {
  RENAME: 'F2',
  DELETE: 'Delete',
  NEW_FOLDER: 'cmd+n',
  UNDO: 'cmd+z',
  REDO: 'cmd+shift+z',
  EXPAND: 'ArrowRight',
  COLLAPSE: 'ArrowLeft',
  NEXT: 'ArrowDown',
  PREV: 'ArrowUp',
  SELECT: 'Enter',
  CANCEL: 'Escape',
} as const
