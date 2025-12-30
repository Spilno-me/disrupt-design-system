/**
 * useIsMobile - Responsive breakpoint hook
 *
 * Detects if the current viewport is below the mobile breakpoint
 * using matchMedia for efficient, real-time updates.
 *
 * @param breakpoint - CSS pixel width (default: 1024 for lg breakpoint)
 * @returns boolean - true if viewport width < breakpoint
 */

import { useState, useEffect } from 'react'

export function useIsMobile(breakpoint = 1024): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)

    // Set initial value
    setIsMobile(mediaQuery.matches)

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }

    // Modern browsers
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [breakpoint])

  return isMobile
}

export default useIsMobile
