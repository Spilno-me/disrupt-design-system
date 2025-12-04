import { useEffect, useRef, useCallback, useState } from 'react'
import gsap from 'gsap'
import './CursorPixels.css'

// Pixel configurations - each has unique size and trailing delay
const PIXELS = [
  { id: 'red-1', width: 12, height: 12, rx: 2, color: '#F70D1A', delay: 0.02 },
  { id: 'red-2', width: 10, height: 10, rx: 2, color: '#F70D1A', delay: 0.06 },
  { id: 'red-3', width: 14, height: 14, rx: 3, color: '#F70D1A', delay: 0.10 },
  { id: 'dark-1', width: 8, height: 8, rx: 1.5, color: '#2D3142', delay: 0.04 },
  { id: 'dark-2', width: 6, height: 6, rx: 1, color: '#2D3142', delay: 0.08 },
  { id: 'dark-3', width: 6, height: 6, rx: 1, color: '#2D3142', delay: 0.12 },
  { id: 'dark-4', width: 7, height: 7, rx: 1.5, color: '#2D3142', delay: 0.14 },
]

// Offset positions - creates the trailing "wake" below cursor
const PIXEL_OFFSETS = [
  { x: 5, y: 28 },
  { x: -12, y: 38 },
  { x: 14, y: 45 },
  { x: -4, y: 55 },
  { x: 8, y: 65 },
  { x: -10, y: 75 },
  { x: 3, y: 85 },
]

interface PixelState {
  element: HTMLDivElement
  quickX: gsap.QuickToFunc
  quickY: gsap.QuickToFunc
  index: number
}

// Check touch capability
const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export function CursorPixels() {
  const pixelRefs = useRef<(HTMLDivElement | null)[]>([])
  const pixelsRef = useRef<PixelState[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const [shouldRender, setShouldRender] = useState(true)

  // State machine
  const stateRef = useRef<'following' | 'idle' | 'disrupting'>('following')
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idleTweensRef = useRef<gsap.core.Tween[]>([])
  const disruptTlRef = useRef<gsap.core.Timeline | null>(null)
  const isExcitedRef = useRef(false)
  const excitedTweensRef = useRef<gsap.core.Tween[]>([])

  useEffect(() => {
    if (isTouchDevice()) setShouldRender(false)
  }, [])

  // Initialize quickTo for a pixel
  const initQuickTo = useCallback((pixel: PixelState) => {
    const config = PIXELS[pixel.index]
    const duration = 0.3 + config.delay * 2
    pixel.quickX = gsap.quickTo(pixel.element, 'x', { duration, ease: 'power3.out' })
    pixel.quickY = gsap.quickTo(pixel.element, 'y', { duration, ease: 'power3.out' })
  }, [])

  // Move all pixels to follow mouse
  const updatePositions = useCallback(() => {
    if (stateRef.current === 'disrupting') return
    if (isExcitedRef.current) return // Skip when in repel state

    const { x, y } = mouseRef.current
    pixelsRef.current.forEach((pixel) => {
      const offset = PIXEL_OFFSETS[pixel.index]
      pixel.quickX(x + offset.x)
      pixel.quickY(y + offset.y)
    })
  }, [])

  // ============ IDLE STATE ============
  const startIdle = useCallback(() => {
    if (stateRef.current !== 'following') return
    stateRef.current = 'idle'

    // Create gentle floating animation for each pixel
    pixelsRef.current.forEach((pixel, i) => {
      const xRange = 6 + Math.random() * 6
      const yRange = 8 + Math.random() * 6
      const duration = 2 + Math.random() * 1.5
      const delay = i * 0.1

      const tween = gsap.to(pixel.element, {
        x: `+=${xRange * (Math.random() > 0.5 ? 1 : -1)}`,
        y: `+=${yRange * (Math.random() > 0.5 ? 1 : -1)}`,
        rotation: (Math.random() - 0.5) * 10,
        duration,
        delay,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })

      idleTweensRef.current.push(tween)
    })
  }, [])

  const stopIdle = useCallback(() => {
    if (stateRef.current !== 'idle') return

    // Kill idle tweens and capture positions
    idleTweensRef.current.forEach((t) => t.kill())
    idleTweensRef.current = []

    // Smoothly reset rotation and reinitialize quickTo
    pixelsRef.current.forEach((pixel) => {
      // Capture current position
      const currentX = gsap.getProperty(pixel.element, 'x') as number
      const currentY = gsap.getProperty(pixel.element, 'y') as number

      // Reinitialize quickTo from current position
      initQuickTo(pixel)

      // Set position explicitly so quickTo knows where to start
      gsap.set(pixel.element, { x: currentX, y: currentY })

      // Smoothly reset rotation
      gsap.to(pixel.element, {
        rotation: 0,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    })

    stateRef.current = 'following'
  }, [initQuickTo])

  // ============ REPEL STATE (hover buttons/links) ============
  // Repel offsets - pixels spread outward when hovering interactive elements
  const REPEL_OFFSETS = [
    { x: 35, y: 20, rotation: -20 },
    { x: -40, y: 25, rotation: 25 },
    { x: 45, y: 45, rotation: -15 },
    { x: -35, y: 55, rotation: 30 },
    { x: 40, y: 70, rotation: -25 },
    { x: -45, y: 80, rotation: 20 },
    { x: 35, y: 95, rotation: -30 },
  ]

  const startExcited = useCallback(() => {
    if (stateRef.current === 'disrupting') return
    if (isExcitedRef.current) return
    isExcitedRef.current = true

    // Stop idle if running
    if (stateRef.current === 'idle') {
      stopIdle()
    }

    const { x: mouseX, y: mouseY } = mouseRef.current

    // Repel pixels outward from cursor
    pixelsRef.current.forEach((pixel, i) => {
      const repelOffset = REPEL_OFFSETS[i]
      const targetX = mouseX + repelOffset.x
      const targetY = mouseY + repelOffset.y

      const tween = gsap.to(pixel.element, {
        x: targetX,
        y: targetY,
        rotation: repelOffset.rotation,
        scale: 0.85,
        duration: 0.3,
        ease: 'back.out(1.5)',
        overwrite: 'auto',
      })

      excitedTweensRef.current.push(tween)
    })
  }, [stopIdle])

  // Update repelled positions as mouse moves
  const updateRepelPositions = useCallback(() => {
    if (!isExcitedRef.current) return

    const { x: mouseX, y: mouseY } = mouseRef.current

    pixelsRef.current.forEach((pixel, i) => {
      const repelOffset = REPEL_OFFSETS[i]
      gsap.to(pixel.element, {
        x: mouseX + repelOffset.x,
        y: mouseY + repelOffset.y,
        duration: 0.15,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    })
  }, [])

  const stopExcited = useCallback(() => {
    if (!isExcitedRef.current) return
    isExcitedRef.current = false

    excitedTweensRef.current.forEach((t) => t.kill())
    excitedTweensRef.current = []

    const { x: mouseX, y: mouseY } = mouseRef.current

    // Return pixels to following positions with spring back
    pixelsRef.current.forEach((pixel) => {
      const offset = PIXEL_OFFSETS[pixel.index]

      gsap.to(pixel.element, {
        x: mouseX + offset.x,
        y: mouseY + offset.y,
        scale: 1,
        rotation: 0,
        duration: 0.4,
        ease: 'back.out(1.2)',
        overwrite: 'auto',
        onComplete: () => initQuickTo(pixel),
      })
    })
  }, [initQuickTo])

  // ============ DISRUPT STATE (click) ============
  const playDisrupt = useCallback(() => {
    if (stateRef.current === 'disrupting') return

    // Clean up other states
    if (stateRef.current === 'idle') {
      idleTweensRef.current.forEach((t) => t.kill())
      idleTweensRef.current = []
    }
    if (isExcitedRef.current) {
      excitedTweensRef.current.forEach((t) => t.kill())
      excitedTweensRef.current = []
      isExcitedRef.current = false
    }

    stateRef.current = 'disrupting'

    // Kill any existing disrupt timeline
    if (disruptTlRef.current) {
      disruptTlRef.current.kill()
    }

    const mouseX = mouseRef.current.x
    const mouseY = mouseRef.current.y

    // Create master timeline
    const masterTl = gsap.timeline({
      onComplete: () => {
        disruptTlRef.current = null
        stateRef.current = 'following'

        // Reinitialize quickTo for all pixels
        pixelsRef.current.forEach((pixel) => {
          initQuickTo(pixel)
        })

        // Immediately update to current mouse position
        updatePositions()
      },
    })

    disruptTlRef.current = masterTl

    // Animation duration
    const duration = 0.5

    // Animate each pixel
    pixelsRef.current.forEach((pixel) => {
      const offset = PIXEL_OFFSETS[pixel.index]

      // Get where the pixel currently IS
      const currentX = gsap.getProperty(pixel.element, 'x') as number
      const currentY = gsap.getProperty(pixel.element, 'y') as number
      const currentScale = gsap.getProperty(pixel.element, 'scale') as number || 1
      const currentRotation = gsap.getProperty(pixel.element, 'rotation') as number || 0

      // Calculate where it SHOULD end up (home position)
      const homeX = mouseX + offset.x
      const homeY = mouseY + offset.y

      // Random explosion direction and distance
      const angle = Math.random() * Math.PI * 2
      const distance = 30 + Math.random() * 30
      const explodeX = currentX + Math.cos(angle) * distance
      const explodeY = currentY + Math.sin(angle) * distance
      const explodeRotation = currentRotation + (Math.random() - 0.5) * 90
      const explodeScale = Math.max(currentScale, 1) * (1.1 + Math.random() * 0.15)

      // Create pixel timeline
      const pixelTl = gsap.timeline()

      // Phase 1: Explode outward (0% → 25%)
      pixelTl.to(pixel.element, {
        x: explodeX,
        y: explodeY,
        scale: explodeScale,
        rotation: explodeRotation,
        duration: duration * 0.22,
        ease: 'power2.out',
      })

      // Phase 2: Settle and hold (25% → 50%)
      pixelTl.to(pixel.element, {
        x: explodeX * 0.85 + homeX * 0.15,
        y: explodeY * 0.85 + homeY * 0.15,
        scale: explodeScale * 0.95,
        rotation: explodeRotation * 0.9,
        duration: duration * 0.28,
        ease: 'power1.inOut',
      })

      // Phase 3: Return home smoothly (50% → 100%)
      pixelTl.to(pixel.element, {
        x: homeX,
        y: homeY,
        scale: 1,
        rotation: 0,
        duration: duration * 0.5,
        ease: 'power2.inOut',
      })

      // Add to master timeline at position 0 (all start together)
      masterTl.add(pixelTl, 0)
    })
  }, [initQuickTo, updatePositions])

  // ============ MOUSE HANDLERS ============
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY }

    // Check for interactive elements
    const target = e.target as HTMLElement
    const isInteractive = target?.closest('a, button, [role="button"]')

    if (isInteractive) {
      if (isExcitedRef.current) {
        updateRepelPositions() // Update repel positions as mouse moves
      } else {
        startExcited()
      }
    } else if (isExcitedRef.current) {
      stopExcited()
    }

    // Handle idle state
    if (stateRef.current === 'idle') {
      stopIdle()
    }

    // Reset idle timeout
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current)
    }

    idleTimeoutRef.current = setTimeout(() => {
      if (stateRef.current === 'following' && !isExcitedRef.current) {
        startIdle()
      }
    }, 600)

    // Update positions
    updatePositions()
  }, [startIdle, stopIdle, startExcited, stopExcited, updatePositions, updateRepelPositions])

  const handleMouseEnter = useCallback(() => {
    pixelsRef.current.forEach((pixel) => {
      gsap.to(pixel.element, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      })
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    // Clean up
    if (stateRef.current === 'idle') {
      idleTweensRef.current.forEach((t) => t.kill())
      idleTweensRef.current = []
    }
    stopExcited()

    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current)
    }

    stateRef.current = 'following'

    pixelsRef.current.forEach((pixel) => {
      gsap.to(pixel.element, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
      })
    })
  }, [stopExcited])

  const handleClick = useCallback(() => {
    playDisrupt()
  }, [playDisrupt])

  // ============ SETUP ============
  useEffect(() => {
    if (isTouchDevice()) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Initialize pixels
    pixelsRef.current = []
    pixelRefs.current.forEach((el, index) => {
      if (!el) return

      const config = PIXELS[index]
      const duration = 0.3 + config.delay * 2

      const pixel: PixelState = {
        element: el,
        quickX: gsap.quickTo(el, 'x', { duration, ease: 'power3.out' }),
        quickY: gsap.quickTo(el, 'y', { duration, ease: 'power3.out' }),
        index,
      }

      pixelsRef.current.push(pixel)

      // Set initial state
      gsap.set(el, { x: 0, y: 0, scale: 1, rotation: 0, opacity: 0 })
    })

    // Event listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('click', handleClick)

      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)
      if (disruptTlRef.current) disruptTlRef.current.kill()
      idleTweensRef.current.forEach((t) => t.kill())
      excitedTweensRef.current.forEach((t) => t.kill())

      pixelsRef.current.forEach((pixel) => {
        gsap.killTweensOf(pixel.element)
      })
    }
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave, handleClick, initQuickTo])

  if (!shouldRender) return null

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
            backgroundColor: pixel.color,
          }}
        />
      ))}
    </div>
  )
}
