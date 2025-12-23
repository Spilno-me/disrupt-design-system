/**
 * Story Infrastructure
 *
 * Centralized exports for story templates, decorators, and utilities.
 * All stories should import from this module for consistency.
 *
 * @example
 * import {
 *   createAtomMeta,
 *   StorySection,
 *   StoryFlex,
 *   withStoryContainer,
 *   renderVariants,
 * } from '@/stories/_infrastructure'
 */

// =============================================================================
// META PRESETS (for story configuration)
// =============================================================================

export {
  // Atomic level presets (spread into meta)
  ATOM_META,
  MOLECULE_META,
  ORGANISM_META,
  TEMPLATE_META,
  PAGE_META,
  // Description helpers (create type-badged descriptions)
  atomDescription,
  moleculeDescription,
  organismDescription,
  templateDescription,
  pageDescription,
  // Constants
  ATOMIC_LEVELS,
  // Type helper
  type StoryOf,
} from './presets'

// =============================================================================
// DECORATORS (for story wrappers)
// =============================================================================

export {
  // Constants
  STORY_WIDTHS,
  STORY_SPACING,
  // Decorator factories
  withStoryContainer,
  withDarkBackground,
  withSurfaceBackground,
  withFullscreen,
  // Section components
  StorySection,
  StoryGrid,
  StoryFlex,
  // Info components
  StoryInfoBox,
  StoryAnatomy,
} from './decorators'

// =============================================================================
// RENDERERS (for story render functions)
// =============================================================================

export {
  // Variant renderers
  renderVariants,
  renderSizes,
  renderStates,
  // Matrix renderers
  renderMatrix,
  // Section renderers
  renderSections,
  // Comparison renderers
  renderComparison,
  // Interactive demos
  renderInteractiveDemo,
} from './renderers'

// =============================================================================
// BACKGROUNDS (single source of truth)
// =============================================================================

export {
  STORY_BACKGROUNDS,
  STORYBOOK_BACKGROUNDS,
  type StoryBackgroundName,
} from './backgrounds'

// =============================================================================
// DEVICE FRAMES (mobile & tablet presentation)
// =============================================================================

export {
  // iPhone component & presets
  IPhoneFrame,
  IPhoneMobileFrame,
  IPhoneSEFrame,
  IPhoneStandardFrame,
  IPhoneProFrame,
  IPhoneProMaxFrame,
  // iPad component & presets
  IPadFrame,
  IPadStandardFrame,
  IPadAirFrame,
  IPadPro11Frame,
  IPadPro12Frame,
  IPadMiniFrame,
  // Adaptive component (auto-detects viewport)
  AdaptiveDeviceFrame,
  // Decorators
  withIPhoneFrame,
  withIPadFrame,
  withAdaptiveDeviceFrame,
  // Viewport detection hook
  useDeviceFromViewport,
  // Specs for reference
  IPHONE_SPECS,
  IPAD_SPECS,
  // Defaults (single source of truth)
  STATUS_BAR_DEFAULTS,
  // Types
  type IPhoneFrameProps,
  type IPhoneMobileFrameProps,
  type IPhoneModel,
  type IPadFrameProps,
  type IPadModel,
  type AdaptiveDeviceFrameProps,
  type DeviceDetectionResult,
} from './device-frames'

// =============================================================================
// STORY TEMPLATES (copy-paste starters)
// =============================================================================

export * from './templates'
