import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '../../lib/utils'
import { COLORS, ALIAS } from '../../constants/designTokens'

// =============================================================================
// TYPES
// =============================================================================

export interface LinkedInButtonProps {
  /** LinkedIn profile/company URL */
  href?: string
  /** Button size in pixels */
  size?: number
  /** Custom class name */
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * LinkedInButton - An animated LinkedIn icon button with spinning dashed border.
 * Features a spin animation on hover with inertia and color fill effect.
 */
export function LinkedInButton({
  href = 'https://linkedin.com',
  size = 32,
  className,
}: LinkedInButtonProps) {
  const [showFill, setShowFill] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  // All animation state in refs to avoid stale closures
  const stateRef = useRef({
    isHovered: false,
    rotation: 0,
    speed: 0,
    animationId: null as number | null,
  })

  const maxSpeed = 8
  const acceleration = 0.4
  const deceleration = 0.15
  const fillTriggerSpeed = 7

  const animate = useCallback(() => {
    const state = stateRef.current

    if (state.isHovered) {
      state.speed = Math.min(state.speed + acceleration, maxSpeed)
      if (state.speed >= fillTriggerSpeed) {
        setShowFill(true)
      }
    } else {
      state.speed = Math.max(state.speed - deceleration, 0)
    }

    if (state.speed > 0.01) {
      state.rotation += state.speed
      if (svgRef.current) {
        svgRef.current.style.transform = `rotate(${state.rotation}deg)`
      }
      state.animationId = requestAnimationFrame(animate)
    } else {
      state.speed = 0
      state.animationId = null
    }
  }, [])

  const startAnimation = useCallback(() => {
    if (stateRef.current.animationId === null) {
      stateRef.current.animationId = requestAnimationFrame(animate)
    }
  }, [animate])

  const handleMouseEnter = useCallback(() => {
    stateRef.current.isHovered = true
    startAnimation()
  }, [startAnimation])

  const handleMouseLeave = useCallback(() => {
    stateRef.current.isHovered = false
    setShowFill(false)
    startAnimation()
  }, [startAnimation])

  useEffect(() => {
    return () => {
      if (stateRef.current.animationId !== null) {
        cancelAnimationFrame(stateRef.current.animationId)
      }
    }
  }, [])

  const iconSize = Math.round(size * 0.4375) // ~14px at 32px size

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'relative flex items-center justify-center cursor-pointer',
        className
      )}
      style={{ width: size, height: size }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Spinning dashed border */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 32 32"
      >
        <circle
          cx="16"
          cy="16"
          r="15"
          fill="none"
          stroke={COLORS.dark}
          strokeWidth="1"
          strokeDasharray="4.71 4.71"
          strokeLinecap="butt"
        />
      </svg>

      {/* Fill background that appears on spin trigger */}
      <div
        className={cn(
          'absolute inset-0 rounded-full transition-all duration-200',
          showFill ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        )}
        style={{ backgroundColor: ALIAS.brand.linkedIn }}
      />

      {/* LinkedIn icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        className="relative z-10"
      >
        <path
          d="M20.6667 0C21.3518 0 22.0089 0.280951 22.4934 0.781048C22.9778 1.28115 23.25 1.95942 23.25 2.66667V21.3333C23.25 22.0406 22.9778 22.7189 22.4934 23.219C22.0089 23.719 21.3518 24 20.6667 24H2.58333C1.89819 24 1.24111 23.719 0.756641 23.219C0.272172 22.7189 0 22.0406 0 21.3333V2.66667C0 1.95942 0.272172 1.28115 0.756641 0.781048C1.24111 0.280951 1.89819 0 2.58333 0H20.6667ZM20.0208 20.6667V13.6C20.0208 12.4472 19.5772 11.3416 18.7875 10.5264C17.9978 9.71128 16.9268 9.25333 15.81 9.25333C14.7121 9.25333 13.4333 9.94667 12.8133 10.9867V9.50667H9.20958V20.6667H12.8133V14.0933C12.8133 13.0667 13.6142 12.2267 14.6088 12.2267C15.0883 12.2267 15.5483 12.4233 15.8874 12.7734C16.2266 13.1235 16.4171 13.5983 16.4171 14.0933V20.6667H20.0208ZM5.01167 7.41333C5.58719 7.41333 6.13913 7.17733 6.54609 6.75725C6.95304 6.33717 7.18167 5.76742 7.18167 5.17333C7.18167 3.93333 6.21292 2.92 5.01167 2.92C4.43272 2.92 3.87749 3.1574 3.46811 3.57999C3.05873 4.00257 2.82875 4.57571 2.82875 5.17333C2.82875 6.41333 3.81042 7.41333 5.01167 7.41333ZM6.80708 20.6667V9.50667H3.22917V20.6667H6.80708Z"
          fill={showFill ? 'white' : COLORS.dark}
          className="transition-colors duration-200"
        />
      </svg>
    </a>
  )
}
