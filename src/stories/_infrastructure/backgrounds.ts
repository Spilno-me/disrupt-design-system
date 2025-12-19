/**
 * Story Background Configuration
 *
 * Single source of truth for Storybook background colors.
 * Uses ALIAS (semantic) tokens - never primitives.
 *
 * To change backgrounds, edit the values HERE.
 */

import { ALIAS } from '@/constants/designTokens'

// =============================================================================
// BACKGROUND VALUES (from semantic ALIAS tokens)
// =============================================================================

export const STORY_BACKGROUNDS = {
  /** Light mode background - soft linen surface (default) */
  light: ALIAS.background.surface,       // #EBF9FF (softLinen)

  /** Dark mode background - inverse subtle for shadow visibility */
  dark: ALIAS.background.inverseSubtle,  // #1D1F2A (ABYSS[700])
} as const

// =============================================================================
// STORYBOOK CONFIG - Enable backgrounds with soft linen as default
// =============================================================================

/**
 * Storybook backgrounds addon configuration.
 * Soft linen is the default background for consistent story presentation.
 */
export const STORYBOOK_BACKGROUNDS = {
  default: 'soft-linen',
  values: [
    { name: 'soft-linen', value: ALIAS.background.surface },
    { name: 'white', value: ALIAS.text.inverse },
    { name: 'dark', value: ALIAS.background.inverseSubtle },
  ],
} as const

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type StoryBackgroundName = keyof typeof STORY_BACKGROUNDS
