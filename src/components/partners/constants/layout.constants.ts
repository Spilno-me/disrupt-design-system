/**
 * Layout constants for partner components
 * @module partners/constants/layout.constants
 */

/** Indentation padding per depth level for nested partners (pixels) */
export const INDENT_PADDING_PX = 32

/** Base padding for partner rows (pixels) */
export const BASE_PADDING_PX = 16

/** Extra indent for metrics card within expanded content (pixels) */
export const METRICS_CARD_INDENT_PX = 32

/** Partner ID truncation length */
export const PARTNER_ID_TRUNCATE_LENGTH = 12

/** Delay before opening dialog to prevent focus conflicts (ms) */
export const FOCUS_DELAY_MS = 150

// =============================================================================
// GLASS/FROSTED UI CLASSES
// =============================================================================

/**
 * Glass card styling for depth level 2 (content cards, panels).
 * Uses DDS glass rules: 40% opacity + 4px blur + accent border.
 *
 * @see MCP: mcp__dds__get_glass_rules({ depth: 2 })
 */
export const GLASS_CARD_CLASSES =
  'bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent shadow-md'

/**
 * Glass card styling without shadow (for nested contexts)
 */
export const GLASS_CARD_FLAT_CLASSES =
  'bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent'

/**
 * Glass surface for lower emphasis areas (60% accent border)
 */
export const GLASS_SURFACE_CLASSES =
  'bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent/60'
