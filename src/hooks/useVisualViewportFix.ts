/**
 * useVisualViewportFix - iOS 26 Safari visual viewport bug workaround
 *
 * iOS 26 introduced a bug where `visualViewport.height` doesn't properly reset
 * after keyboard dismissal, remaining ~24px smaller than `window.innerHeight`.
 * This causes fixed/absolute positioned elements to misalign.
 *
 * @description
 * This hook monitors the visual viewport and calculates an offset that can be
 * used to compensate for the bug. It sets a CSS custom property that components
 * can use to adjust their positioning.
 *
 * @usage
 * ```tsx
 * // In your app root or layout
 * import { useVisualViewportFix } from '@/hooks/useVisualViewportFix'
 *
 * function App() {
 *   useVisualViewportFix() // Sets --viewport-offset CSS variable
 *   return <div>...</div>
 * }
 *
 * // In CSS, use the offset to adjust fixed elements:
 * .fixed-element {
 *   bottom: calc(0px + var(--viewport-offset, 0px));
 * }
 * ```
 *
 * @see https://developer.apple.com/forums/thread/800125
 * @see https://github.com/adobe/react-spectrum/pull/8888
 */

import { useEffect, useCallback } from 'react'

/**
 * Options for the viewport fix hook
 */
interface UseVisualViewportFixOptions {
  /**
   * Whether to automatically apply the fix.
   * Set to false if you want to handle the offset manually.
   * @default true
   */
  autoApply?: boolean

  /**
   * CSS custom property name for the viewport offset.
   * @default '--viewport-offset'
   */
  cssPropertyName?: string

  /**
   * Threshold in pixels below which the offset is ignored.
   * Helps filter out minor rounding differences.
   * @default 5
   */
  threshold?: number

  /**
   * Callback when the viewport offset changes.
   * Useful for manual handling or debugging.
   */
  onChange?: (offset: number) => void
}

/**
 * Hook that monitors and compensates for iOS 26 visual viewport bugs.
 *
 * The bug: After keyboard dismissal, `visualViewport.height` stays smaller
 * than `window.innerHeight` by ~24px (the keyboard safe area height).
 *
 * This hook:
 * 1. Listens to visualViewport resize and scroll events
 * 2. Calculates the offset between visualViewport.height and innerHeight
 * 3. Sets a CSS custom property for compensation
 * 4. Resets the offset when keyboard is fully dismissed
 *
 * @param options - Configuration options
 * @returns Object with current offset and reset function
 */
export function useVisualViewportFix(options: UseVisualViewportFixOptions = {}) {
  const {
    autoApply = true,
    cssPropertyName = '--viewport-offset',
    threshold = 5,
    onChange,
  } = options

  const updateOffset = useCallback(() => {
    if (typeof window === 'undefined' || !window.visualViewport) {
      return
    }

    const vvHeight = window.visualViewport.height
    const innerHeight = window.innerHeight

    // Calculate the offset (positive when visualViewport is smaller)
    let offset = innerHeight - vvHeight

    // Ignore small offsets below threshold (likely rounding issues)
    if (Math.abs(offset) < threshold) {
      offset = 0
    }

    // Apply the CSS property if autoApply is enabled
    if (autoApply) {
      document.documentElement.style.setProperty(
        cssPropertyName,
        `${Math.max(0, offset)}px`
      )
    }

    // Call the onChange callback if provided
    onChange?.(offset)
  }, [autoApply, cssPropertyName, threshold, onChange])

  const resetOffset = useCallback(() => {
    if (autoApply) {
      document.documentElement.style.setProperty(cssPropertyName, '0px')
    }
    onChange?.(0)
  }, [autoApply, cssPropertyName, onChange])

  useEffect(() => {
    // Skip if not in browser or visualViewport not supported
    if (typeof window === 'undefined' || !window.visualViewport) {
      return
    }

    // Initial update
    updateOffset()

    // Listen to visualViewport events
    const handleResize = () => {
      updateOffset()
    }

    const handleScroll = () => {
      // Update on scroll as the bug can manifest during scrolling
      updateOffset()
    }

    // Also listen to blur events (keyboard dismissal)
    const handleBlur = () => {
      // Delay to allow viewport to settle after keyboard animation
      setTimeout(updateOffset, 100)
    }

    window.visualViewport.addEventListener('resize', handleResize)
    window.visualViewport.addEventListener('scroll', handleScroll)
    window.addEventListener('blur', handleBlur, true)

    // Cleanup
    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize)
      window.visualViewport?.removeEventListener('scroll', handleScroll)
      window.removeEventListener('blur', handleBlur, true)
      resetOffset()
    }
  }, [updateOffset, resetOffset])

  return {
    /** Manually reset the offset to zero */
    resetOffset,
    /** Manually trigger an offset update */
    updateOffset,
  }
}

/**
 * Utility to check if the current device is likely affected by the iOS 26 bug.
 *
 * The bug primarily affects:
 * - iPhone 12 and older on iOS 26
 * - iOS 26 Simulator
 *
 * iPhone 16 Pro Max on iOS 26.0 (23A5318c) is NOT affected.
 *
 * @returns true if likely affected
 */
export function isIOS26ViewportBugAffected(): boolean {
  if (typeof navigator === 'undefined') {
    return false
  }

  const ua = navigator.userAgent

  // Check if it's iOS Safari
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream
  const isSafari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS/.test(ua)

  if (!isIOS || !isSafari) {
    return false
  }

  // Check iOS version (26.x)
  const iosVersionMatch = ua.match(/OS (\d+)_/)
  if (iosVersionMatch) {
    const majorVersion = parseInt(iosVersionMatch[1], 10)
    return majorVersion >= 26
  }

  return false
}

export default useVisualViewportFix
