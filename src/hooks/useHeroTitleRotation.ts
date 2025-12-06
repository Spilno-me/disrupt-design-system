import { useState, useEffect } from 'react'

const DEFAULT_INTERVAL = 4000

/**
 * Hook for rotating through hero titles at a set interval.
 * Returns the current index for the titles array.
 *
 * @param titlesCount - Number of titles to rotate through
 * @param interval - Time in ms between rotations (default: 4000ms)
 * @returns Current index in the titles array
 *
 * @example
 * ```tsx
 * const titles = ['Title 1', 'Title 2', 'Title 3']
 * const currentIndex = useHeroTitleRotation(titles.length)
 * return <h1>{titles[currentIndex]}</h1>
 * ```
 */
export function useHeroTitleRotation(
  titlesCount: number,
  interval = DEFAULT_INTERVAL
): number {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % titlesCount)
    }, interval)
    return () => clearInterval(timer)
  }, [titlesCount, interval])

  return currentIndex
}
