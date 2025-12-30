import { useState, useEffect } from 'react'

/**
 * Hook to detect viewport width below a breakpoint
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [breakpoint])

  return isMobile
}
