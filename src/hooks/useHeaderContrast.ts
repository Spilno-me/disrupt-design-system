import { useState, useEffect, useRef, RefObject } from 'react'

/**
 * Calculate perceived brightness of a color (0-255)
 * Using the relative luminance formula
 */
function getColorBrightness(color: string): number {
  // Parse rgb/rgba color
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!match) return 255 // Default to bright (use dark text)

  const r = parseInt(match[1], 10)
  const g = parseInt(match[2], 10)
  const b = parseInt(match[3], 10)

  // Perceived brightness formula (accounts for human eye sensitivity)
  return (r * 299 + g * 587 + b * 114) / 1000
}

/**
 * Check if any element at a point indicates a dark image background
 * Only checks for explicit data-dark-background markers, not dark CSS colors
 */
function checkPointForDarkImageBackground(x: number, y: number): { foundDarkImage: boolean; bgColor: string } {
  const elementsAtPoint = document.elementsFromPoint(x, y)

  let bgColor = 'rgb(251, 251, 243)' // Default cream
  let foundDarkImage = false

  // First pass: check for elements with dark background images (explicit markers only)
  for (const el of elementsAtPoint) {
    // Skip header and its children
    if (el.closest('[data-element="main-header"]')) continue

    // Check for dark background image marker on this element
    if (el.getAttribute('data-dark-background') === 'true') {
      foundDarkImage = true
      break
    }
  }

  // If we found a dark image section, return early
  if (foundDarkImage) {
    return { foundDarkImage: true, bgColor }
  }

  // Second pass: find background color (for non-image based contrast detection)
  for (const el of elementsAtPoint) {
    // Skip header and its children
    if (el.closest('[data-element="main-header"]')) continue

    const style = window.getComputedStyle(el)
    const bg = style.backgroundColor

    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      bgColor = bg
      break
    }
  }

  return { foundDarkImage, bgColor }
}

/**
 * Check if any dark image elements overlap with the header area
 * Only triggers for elements with background images, not dark text on light backgrounds
 */
function checkDarkImageElementsInHeaderArea(): boolean {
  const headerHeight = 82 // Approximate header height
  // Only select elements explicitly marked as having dark background images
  const darkImageElements = document.querySelectorAll('[data-dark-background="true"]')

  for (const el of darkImageElements) {
    const rect = el.getBoundingClientRect()
    // Check if the element overlaps with the header area (top of viewport)
    if (rect.top < headerHeight && rect.bottom > 0) {
      return true
    }
  }

  return false
}

/**
 * Samples the background color at an element's position and returns
 * whether dark or light text should be used for optimal contrast.
 */
export function useContrastColor(elementRef: RefObject<HTMLElement | null>): 'dark' | 'light' {
  const [contrastMode, setContrastMode] = useState<'dark' | 'light'>('dark')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    // Create an offscreen canvas for sampling
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas')
      canvasRef.current.width = 1
      canvasRef.current.height = 1
    }

    const checkContrast = () => {
      const element = elementRef.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const x = Math.floor(rect.left + rect.width / 2)
      const y = Math.floor(rect.top + rect.height / 2)

      // Sample color from the page using html2canvas approach
      // Instead, we'll use a simpler method: check elements at that position
      const elementsAtPoint = document.elementsFromPoint(x, y)

      // Find the first element with a background color (skip the header and nav elements)
      let bgColor = 'rgb(251, 251, 243)' // Default cream color

      for (const el of elementsAtPoint) {
        // Skip header and its children
        if (el.closest('[data-element="main-header"]')) continue

        const style = window.getComputedStyle(el)
        const bg = style.backgroundColor

        // Check if it has a non-transparent background
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
          bgColor = bg
          break
        }

        // Check for background image (dark images)
        const bgImage = style.backgroundImage
        if (bgImage && bgImage !== 'none') {
          // Assume images are dark-ish for hero sections
          const elDataset = el.getAttribute('data-element') || ''
          if (elDataset.includes('hero')) {
            bgColor = 'rgb(50, 50, 50)' // Assume dark for hero
            break
          }
        }
      }

      // Parse the color and calculate brightness
      const brightness = getColorBrightness(bgColor)

      // Use dark text for bright backgrounds, light text for dark backgrounds
      setContrastMode(brightness > 128 ? 'dark' : 'light')
    }

    // Check on scroll and resize
    checkContrast()

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          checkContrast()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [elementRef])

  return contrastMode
}

/**
 * Hook for the entire header navigation - samples at multiple points across viewport
 * to detect when header is over dark backgrounds (like hero images).
 *
 * Usage:
 * - Add `data-dark-background="true"` to sections with dark background images
 * - The hook will return 'light' when header is over dark sections (use white text)
 * - Returns 'dark' for light backgrounds (use dark text)
 */
export function useHeaderContrast(): 'dark' | 'light' {
  const [contrastMode, setContrastMode] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const checkContrast = () => {
      // First, check if any dark IMAGE elements overlap with the header using bounding rect
      // This only triggers for elements with data-dark-background="true" (images/photos)
      // NOT for dark text on light backgrounds
      if (checkDarkImageElementsInHeaderArea()) {
        setContrastMode('light')
        return
      }

      const y = 50 // Header height area
      const viewportWidth = window.innerWidth

      // Sample at multiple x positions to catch elements that don't span full width
      // Check: 25%, 50%, 75% of viewport width
      const samplePoints = [
        Math.floor(viewportWidth * 0.25),
        Math.floor(viewportWidth * 0.5),
        Math.floor(viewportWidth * 0.75),
      ]

      let foundDarkImage = false
      let bgColor = 'rgb(251, 251, 243)' // Default cream

      for (const x of samplePoints) {
        const result = checkPointForDarkImageBackground(x, y)
        if (result.foundDarkImage) {
          foundDarkImage = true
          break
        }
        // Use the first non-default background color found
        if (result.bgColor !== 'rgb(251, 251, 243)') {
          bgColor = result.bgColor
        }
      }

      if (foundDarkImage) {
        setContrastMode('light')
      } else {
        // For non-image backgrounds, always use dark text
        // This ensures dark text on light backgrounds stays dark
        setContrastMode('dark')
      }
    }

    checkContrast()

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          checkContrast()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    // Also check after a small delay for dynamic content
    const timeout = setTimeout(checkContrast, 100)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      clearTimeout(timeout)
    }
  }, [])

  return contrastMode
}
