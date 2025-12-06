import { animate } from 'motion/react'
import { NAVIGATION } from '@/constants/appConstants'
import { LAYOUT, ANIMATION } from '@/constants/designTokens'

// =============================================================================
// NAVIGATION UTILITIES
// =============================================================================

const SCROLL_BEHAVIOR = 'smooth' as const

/**
 * Scroll to a specific element by its ID.
 * Used for in-page navigation (e.g., "Contact us" button).
 * Accounts for fixed header height.
 */
export function scrollToElement(elementId: string): void {
  const element = document.getElementById(elementId)

  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.scrollY
    const offsetPosition = elementPosition - LAYOUT.HEADER_HEIGHT_PX - LAYOUT.SCROLL_OFFSET_PX

    window.scrollTo({
      top: offsetPosition,
      behavior: SCROLL_BEHAVIOR,
    })
  }
}

/**
 * Scroll to the top of the page with smooth animation.
 * Uses motion library for a more refined easing curve.
 */
export function smoothScrollToTop(): void {
  const startPosition = window.scrollY
  if (startPosition === 0) return

  animate(startPosition, 0, {
    duration: ANIMATION.duration.SCROLL_LONG,
    ease: ANIMATION.easing.EASE_OUT,
    onUpdate: (value) => window.scrollTo(0, value),
  })
}

/**
 * Scroll to the top of the page (native behavior).
 * Used for simple "back to top" functionality.
 */
export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: SCROLL_BEHAVIOR })
}

/**
 * Animated scroll to an element with a delay.
 * Useful for mobile menus that need to close before scrolling.
 */
export function scrollToElementWithDelay(elementId: string, delayMs: number = ANIMATION.MENU_CLOSE_DELAY_MS): void {
  setTimeout(() => {
    const element = document.getElementById(elementId)
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - LAYOUT.HEADER_HEIGHT_PX

      animate(window.scrollY, offsetPosition, {
        duration: ANIMATION.duration.SCROLL,
        ease: ANIMATION.easing.EASE_OUT,
        onUpdate: (value) => window.scrollTo(0, value),
      })
    }
  }, delayMs)
}

/**
 * Navigate to a specific route using window.location.
 * Use for hard navigation when React Router is not available.
 */
export function navigateTo(path: string): void {
  window.location.href = path
}

// Convenience aliases for common navigation targets
export const navigateToHome = () => navigateTo(NAVIGATION.HOME)
export const navigateToPrivacyPolicy = () => navigateTo(NAVIGATION.PRIVACY_POLICY)
export const navigateToTermsOfService = () => navigateTo(NAVIGATION.TERMS_OF_SERVICE)
