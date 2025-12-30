/**
 * DDS Hooks
 *
 * Reusable React hooks for the design system.
 */

// Header contrast detection
export { useHeaderContrast } from './useHeaderContrast'

// Hero title rotation animation
export { useHeroTitleRotation } from './useHeroTitleRotation'

// Mobile detection
export { useIsMobile } from './useIsMobile'

// Mouse particle effects
export { useMouseParticles, type MouseParticle } from './useMouseParticles'

// iOS 26 Safari visual viewport bug fix
export {
  useVisualViewportFix,
  isIOS26ViewportBugAffected,
  type default as UseVisualViewportFix,
} from './useVisualViewportFix'
