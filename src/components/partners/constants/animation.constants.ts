/**
 * Animation constants for partner components
 * @module partners/constants/animation.constants
 */

/** Easing curve for exit animations */
export const EASE_OUT = [0.4, 0, 0.2, 1] as const

/** Easing curve for enter animations */
export const EASE_IN = [0.4, 0, 1, 1] as const

/** Animation duration for height transitions (ms) */
export const ANIMATION_DURATION_MS = 1000

/** Animation duration for slide down (seconds) */
export const SLIDE_DURATION_SEC = 0.25

/** Animation duration for opacity transitions (seconds) */
export const OPACITY_DURATION_SEC = 0.2

/** Margin top value for expanded content */
export const EXPANDED_MARGIN_TOP = 12

/** Slide down animation variants for framer-motion */
export const slideDownVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  visible: {
    opacity: 1,
    height: "auto",
    marginTop: EXPANDED_MARGIN_TOP,
    marginBottom: 0,
    transition: {
      height: { duration: SLIDE_DURATION_SEC, ease: EASE_OUT },
      opacity: { duration: OPACITY_DURATION_SEC, delay: 0.05 },
      marginTop: { duration: SLIDE_DURATION_SEC, ease: EASE_OUT },
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    marginBottom: 0,
    transition: {
      height: { duration: 0.2, ease: EASE_IN },
      opacity: { duration: 0.15 },
      marginTop: { duration: 0.2 },
    },
  },
}

/** Expanded content animation variants for framer-motion */
export const expandedContentVariants = {
  hidden: {
    opacity: 0,
    height: 0,
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      height: { duration: 0.3, ease: EASE_OUT },
      opacity: { duration: SLIDE_DURATION_SEC, delay: 0.05 },
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      height: { duration: SLIDE_DURATION_SEC, ease: EASE_IN },
      opacity: { duration: 0.15 },
    },
  },
}
