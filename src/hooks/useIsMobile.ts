import { useState, useEffect, useRef } from 'react'

/**
 * Hook to detect viewport width below a breakpoint
 *
 * Uses requestAnimationFrame-based throttling to prevent excessive
 * state updates during window resize operations.
 *
 * @param breakpoint - Width threshold in pixels (default: 640 for sm breakpoint)
 * @returns true if viewport width is below the breakpoint
 *
 * @example
 * // Phone only (default)
 * const isMobile = useIsMobile()
 *
 * @example
 * // Tablet and below (lg breakpoint)
 * const isTabletOrMobile = useIsMobile(1024)
 */
export function useIsMobile(breakpoint: number = 640) {
  const [isMobile, setIsMobile] = useState(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    const handleResize = () => {
      if (rafRef.current !== null) {
        return
      }
      rafRef.current = requestAnimationFrame(() => {
        checkMobile()
        rafRef.current = null
      })
    }

    checkMobile()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [breakpoint])

  return isMobile
}
