import { useEffect, useRef, useState, useCallback } from 'react'
import { CursorAnimationController } from './CursorAnimationController'
import { PIXELS, REPEL } from './animation-config'
import { isFormInput, shouldTriggerRepel } from './animation-utils'
import '../CursorPixels.css'

const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export interface CursorPixelsProps {
  /** When true, dark pixels become white for visibility on dark backgrounds */
  darkMode?: boolean
}

/**
 * Custom cursor effect with animated pixel rectangles.
 * Pixels follow the mouse, float when idle, jitter on buttons, and explode on click.
 */
export function CursorPixels({ darkMode = false }: CursorPixelsProps) {
  const pixelRefs = useRef<(HTMLDivElement | null)[]>([])
  const controllerRef = useRef<CursorAnimationController | null>(null)
  const isInitializedRef = useRef(false)
  const [shouldRender, setShouldRender] = useState(true)

  // ============ Repel Detection ============

  const checkShouldRepel = useCallback((target: Element | null): boolean => {
    // Check for repel elements (buttons, checkboxes, etc.)
    if (shouldTriggerRepel(target)) return true

    // Also repel when a form input is focused
    if (isFormInput(document.activeElement)) return true

    return false
  }, [])

  // ============ Event Handlers ============

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const controller = controllerRef.current
    if (!controller) return

    controller.updateMousePosition({ x: e.clientX, y: e.clientY })

    const shouldRepel = checkShouldRepel(e.target as Element)

    // Show pixels on first mouse move (unless over a repel element)
    if (!isInitializedRef.current) {
      isInitializedRef.current = true
      if (!shouldRepel) {
        controller.showPixels()
      }
    }

    controller.handleRepel(shouldRepel)
  }, [checkShouldRepel])

  const handleMouseEnter = useCallback(() => {
    isInitializedRef.current = true
    controllerRef.current?.showPixels()
  }, [])

  const handleMouseLeave = useCallback(() => {
    isInitializedRef.current = false
    controllerRef.current?.hidePixels()
  }, [])

  const handleClick = useCallback(() => {
    controllerRef.current?.triggerDisrupt()
  }, [])

  const handleFocusIn = useCallback((e: FocusEvent) => {
    if (isFormInput(e.target as Element)) {
      controllerRef.current?.handleRepel(true)
    }
  }, [])

  const handleFocusOut = useCallback((e: FocusEvent) => {
    if (!isFormInput(e.target as Element)) return

    // Small delay to check if focus moved to another input
    setTimeout(() => {
      if (!isFormInput(document.activeElement)) {
        controllerRef.current?.handleRepel(false)
      }
    }, REPEL.FOCUS_TRANSITION_DELAY_MS)
  }, [])

  // ============ Setup & Cleanup ============

  useEffect(() => {
    if (isTouchDevice() || prefersReducedMotion()) {
      setShouldRender(false)
      return
    }

    const elements = pixelRefs.current.filter(Boolean) as HTMLDivElement[]
    if (elements.length === 0) return

    const controller = new CursorAnimationController()
    controller.initialize(elements)
    controllerRef.current = controller

    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('click', handleClick)
    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('focusout', handleFocusOut)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('focusout', handleFocusOut)

      controller.cleanup()
      controllerRef.current = null
    }
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave, handleClick, handleFocusIn, handleFocusOut])

  // ============ Render ============

  if (!shouldRender) return null

  // Get pixel color - swap dark pixels to white in darkMode
  const getPixelColor = (pixel: typeof PIXELS[number]) => {
    if (darkMode && pixel.id.startsWith('dark-')) {
      return '#FFFFFF'
    }
    return pixel.color
  }

  return (
    <div className="cursor-pixels-container" aria-hidden="true">
      {PIXELS.map((pixel, index) => (
        <div
          key={pixel.id}
          ref={(el) => { pixelRefs.current[index] = el }}
          className="cursor-pixel"
          style={{
            width: pixel.width,
            height: pixel.height,
            borderRadius: pixel.rx,
            backgroundColor: getPixelColor(pixel),
          }}
        />
      ))}
    </div>
  )
}
