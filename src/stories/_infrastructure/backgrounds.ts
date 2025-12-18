/**
 * Story Background Configuration
 *
 * Single source of truth for Storybook background colors.
 * Only 2 backgrounds: light and dark - auto-switches with theme toggle.
 *
 * To change backgrounds, edit the values HERE.
 */

import { ABYSS, PRIMITIVES } from '@/constants/designTokens'

// =============================================================================
// BACKGROUND VALUES (from design tokens)
// =============================================================================

export const STORY_BACKGROUNDS = {
  /** Light mode background - warm cream instead of pure white */
  light: PRIMITIVES.cream,           // #FBFBF3 (tide-foam)

  /** Dark mode background - softer dark for shadow visibility */
  dark: ABYSS[800],                  // #14161E (one step lighter than 900)
} as const

// =============================================================================
// STORYBOOK CONFIG - Backgrounds disabled, controlled by CSS
// =============================================================================

/**
 * Disable Storybook's backgrounds addon - we control via CSS.
 * The background auto-switches when you toggle the theme.
 */
export const STORYBOOK_BACKGROUNDS = {
  disable: true,
} as const

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type StoryBackgroundName = keyof typeof STORY_BACKGROUNDS
