/**
 * useIOSScrollLock - Prevents body scroll behind modals/overlays on iOS Safari
 *
 * iOS Safari has a notorious issue where scrolling on modals/overlays "leaks"
 * to the body behind, causing the page to scroll even when it shouldn't.
 * This is due to iOS's "rubber band" scroll behavior.
 *
 * @description
 * This hook uses a technique documented by StripeArmy that:
 * 1. Creates a fixed container that captures all scroll events
 * 2. Uses the +1px trick to ensure the container is always "scrollable"
 * 3. Uses overscroll-behavior: none to prevent scroll chaining
 * 4. Calculates viewport height properly for iOS address bar changes
 *
 * @see https://www.npmjs.com/package/react-ios-scroll-lock
 * @see https://stripearmy.github.io/ios-scroll-lock-demo/
 */

import { useEffect, useRef, useCallback, useState } from 'react'

// =============================================================================
// CONSTANTS
// =============================================================================

/** CSS custom property name for iOS viewport height */
const ISL_VH_PROPERTY = '--isl-vh'

/** Default value for the CSS property (1% of viewport) */
const ISL_VH_DEFAULT = '1%'

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Detects if the current device is running iOS Safari
 * @returns true if iOS Safari (iPhone, iPad, iPod)
 */
export function isIOS(): boolean {
  if (typeof navigator === 'undefined') {
    return false
  }

  const ua = navigator.userAgent

  // Check for iOS devices (excluding MSStream for IE11 mobile view)
  const isIOSDevice =
    /iPad|iPhone|iPod/.test(ua) &&
    !(window as unknown as { MSStream?: unknown }).MSStream

  // Also check for iPad on iOS 13+ which reports as Mac
  const isIPadOS =
    navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1

  return isIOSDevice || isIPadOS
}

/**
 * Updates the --isl-vh CSS custom property based on window.innerHeight
 * This ensures proper height calculation when Safari's address bar changes
 */
function updateIOSViewportHeight(): void {
  if (typeof window === 'undefined') return

  // Calculate 1% of the viewport height in pixels
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty(ISL_VH_PROPERTY, `${vh}px`)
}

/**
 * Resets the --isl-vh CSS custom property to default
 */
function resetIOSViewportHeight(): void {
  if (typeof document === 'undefined') return
  document.documentElement.style.setProperty(ISL_VH_PROPERTY, ISL_VH_DEFAULT)
}

// =============================================================================
// HOOK OPTIONS
// =============================================================================

export interface UseIOSScrollLockOptions {
  /**
   * Whether the scroll lock is currently active.
   * @default false
   */
  isLocked?: boolean

  /**
   * Whether to apply iOS-specific viewport height fix.
   * When true, updates --isl-vh on resize for accurate height.
   * @default true (only applied on iOS)
   */
  applyIOSFix?: boolean

  /**
   * Whether to prevent body scrolling via document.body styles.
   * This is an additional safety measure on top of the CSS technique.
   * @default true
   */
  preventBodyScroll?: boolean

  /**
   * Callback when the lock state changes.
   */
  onLockChange?: (isLocked: boolean) => void

  /**
   * Enable debug logging for troubleshooting.
   * @default false
   */
  debug?: boolean
}

export interface UseIOSScrollLockReturn {
  /** Ref to attach to the scroll lock container */
  containerRef: React.RefObject<HTMLDivElement | null>

  /** Current lock state */
  isLocked: boolean

  /** Manually lock scrolling */
  lock: () => void

  /** Manually unlock scrolling */
  unlock: () => void

  /** Whether the current device is iOS */
  isIOSDevice: boolean
}

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

/**
 * Hook that manages iOS scroll lock state and applies the necessary fixes.
 *
 * The technique works by creating a layered structure:
 * 1. isl-holder: Fixed container covering viewport
 * 2. isl-scroller: Scrollable container with overscroll-behavior: none
 * 3. isl-scroller-inner: Height is 100% + 1px (forces scrollability)
 * 4. isl-scroller-content: Sticky positioned, holds actual content
 *
 * This prevents iOS's rubber band scrolling from propagating to the body.
 *
 * @param options - Configuration options
 * @returns Object with ref, state, and control methods
 */
export function useIOSScrollLock(
  options: UseIOSScrollLockOptions | boolean = {}
): UseIOSScrollLockReturn {
  // Support simple boolean usage: useIOSScrollLock(isOpen)
  const normalizedOptions: UseIOSScrollLockOptions =
    typeof options === 'boolean' ? { isLocked: options } : options

  const {
    isLocked: externalIsLocked = false,
    applyIOSFix = true,
    preventBodyScroll = true,
    onLockChange,
    debug = false,
  } = normalizedOptions

  const containerRef = useRef<HTMLDivElement>(null)
  const [isLocked, setIsLocked] = useState(externalIsLocked)
  const [isIOSDevice] = useState(() => isIOS())
  const originalBodyStyleRef = useRef<{
    overflow: string
    position: string
    top: string
    width: string
  } | null>(null)
  const scrollPositionRef = useRef(0)

  // Sync external isLocked prop with internal state
  useEffect(() => {
    setIsLocked(externalIsLocked)
  }, [externalIsLocked])

  // Debug logging
  const log = useCallback(
    (...args: unknown[]) => {
      if (debug) {
        console.log('[useIOSScrollLock]', ...args)
      }
    },
    [debug]
  )

  // Lock scrolling
  const lock = useCallback(() => {
    if (typeof document === 'undefined') return

    log('Locking scroll')

    // Save current scroll position
    scrollPositionRef.current = window.scrollY

    // Apply body scroll prevention if enabled
    if (preventBodyScroll) {
      originalBodyStyleRef.current = {
        overflow: document.body.style.overflow,
        position: document.body.style.position,
        top: document.body.style.top,
        width: document.body.style.width,
      }

      // Lock body scroll (backup technique for non-iOS)
      document.body.style.overflow = 'hidden'

      // On iOS, we need position:fixed to truly prevent body scroll
      // But this resets scroll position, so we compensate with top
      if (isIOSDevice) {
        document.body.style.position = 'fixed'
        document.body.style.top = `-${scrollPositionRef.current}px`
        document.body.style.width = '100%'
      }
    }

    setIsLocked(true)
    onLockChange?.(true)
  }, [isIOSDevice, preventBodyScroll, onLockChange, log])

  // Unlock scrolling
  const unlock = useCallback(() => {
    if (typeof document === 'undefined') return

    log('Unlocking scroll')

    // Restore body styles
    if (preventBodyScroll && originalBodyStyleRef.current) {
      document.body.style.overflow = originalBodyStyleRef.current.overflow
      document.body.style.position = originalBodyStyleRef.current.position
      document.body.style.top = originalBodyStyleRef.current.top
      document.body.style.width = originalBodyStyleRef.current.width
      originalBodyStyleRef.current = null
    }

    // Restore scroll position on iOS
    if (isIOSDevice && scrollPositionRef.current > 0) {
      window.scrollTo(0, scrollPositionRef.current)
    }

    setIsLocked(false)
    onLockChange?.(false)
  }, [isIOSDevice, preventBodyScroll, onLockChange, log])

  // Apply iOS viewport height fix
  useEffect(() => {
    if (!isIOSDevice || !applyIOSFix) {
      return
    }

    log('Setting up iOS viewport height fix')

    // Initial calculation
    updateIOSViewportHeight()

    // Update on resize (triggered by address bar changes)
    const handleResize = () => {
      updateIOSViewportHeight()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      resetIOSViewportHeight()
    }
  }, [isIOSDevice, applyIOSFix, log])

  // Auto-lock/unlock based on externalIsLocked
  useEffect(() => {
    if (externalIsLocked) {
      lock()
    } else {
      unlock()
    }

    return () => {
      // Cleanup on unmount
      if (externalIsLocked) {
        unlock()
      }
    }
  }, [externalIsLocked, lock, unlock])

  return {
    containerRef,
    isLocked,
    lock,
    unlock,
    isIOSDevice,
  }
}

export default useIOSScrollLock
