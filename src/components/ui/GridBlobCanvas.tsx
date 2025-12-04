import React, { useEffect, useState, ReactNode } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'motion/react'
import { GRID_PATTERNS } from '../../constants/designTokens'
import { GRID_CLASSES } from '../../constants/tailwindClasses'

// =============================================================================
// CONFIGURATION
// =============================================================================

const CONFIG = {
  grid: {
    size: parseInt(GRID_PATTERNS.preset.default.size),
    color: GRID_PATTERNS.preset.default.color,
    strokeWidth: GRID_PATTERNS.preset.default.strokeWidth,
  },
  blob: {
    waypointInterval: 2000,
    transitionDuration: 1.8,
  },
  waypoints: [
    { x: 35, y: 25, w: 350, h: 280 },
    { x: 45, y: 40, w: 380, h: 300 },
    { x: 55, y: 50, w: 420, h: 340 },
    { x: 65, y: 60, w: 450, h: 360 },
    { x: 60, y: 70, w: 400, h: 320 },
    { x: 50, y: 65, w: 370, h: 300 },
    { x: 40, y: 50, w: 340, h: 270 },
    { x: 38, y: 35, w: 360, h: 290 },
  ],
  initialBlob: { x: 40, y: 30, w: 400, h: 320 },
}

// =============================================================================
// GRID PATTERN COMPONENT
// =============================================================================

function GridPattern() {
  const { size, color, strokeWidth } = CONFIG.grid

  return (
    <svg className={GRID_CLASSES.svg} aria-hidden="true">
      <defs>
        <pattern
          id="grid-pattern"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

interface GridBlobBackgroundProps {
  scale?: number
}

export function GridBlobBackground({ scale = 1 }: GridBlobBackgroundProps) {
  const [waypointIndex, setWaypointIndex] = useState(0)

  // Motion values for smooth animation
  const x = useMotionValue(CONFIG.initialBlob.x)
  const y = useMotionValue(CONFIG.initialBlob.y)
  const width = useMotionValue(CONFIG.initialBlob.w * scale)
  const height = useMotionValue(CONFIG.initialBlob.h * scale)

  // Transform to CSS mask position and size
  const maskImage = useTransform(
    [x, y, width, height],
    ([xVal, yVal, wVal, hVal]) => {
      // Create radial gradient mask with soft edges
      return `radial-gradient(ellipse ${wVal}px ${hVal}px at ${xVal}% ${yVal}%,
        rgba(0,0,0,1) 0%,
        rgba(0,0,0,0.8) 50%,
        rgba(0,0,0,0.3) 70%,
        rgba(0,0,0,0) 100%)`
    }
  )

  // Animate through waypoints
  useEffect(() => {
    const interval = setInterval(() => {
      setWaypointIndex(prev => (prev + 1) % CONFIG.waypoints.length)
    }, CONFIG.blob.waypointInterval)

    return () => clearInterval(interval)
  }, [])

  // Animate to new waypoint when index changes
  useEffect(() => {
    const wp = CONFIG.waypoints[waypointIndex]
    const duration = CONFIG.blob.transitionDuration

    animate(x, wp.x, { duration, ease: 'easeInOut' })
    animate(y, wp.y, { duration, ease: 'easeInOut' })
    animate(width, wp.w * scale, { duration, ease: 'easeInOut' })
    animate(height, wp.h * scale, { duration, ease: 'easeInOut' })
  }, [waypointIndex, scale, x, y, width, height])

  return (
    <div className={GRID_CLASSES.container} style={{ zIndex: 0 }}>
      <motion.div
        className="absolute inset-0"
        style={{ maskImage, WebkitMaskImage: maskImage }}
        aria-hidden="true"
      >
        <GridPattern />
      </motion.div>
    </div>
  )
}

/** Wrapper for sections needing grid blob. Usage: <BlobSection className="py-16">...</BlobSection> */
interface BlobSectionProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode
  className?: string
  as?: 'section' | 'div'
}

export function BlobSection({ children, className = '', as: Tag = 'section', ...rest }: BlobSectionProps) {
  return (
    <Tag className={`relative overflow-hidden ${className}`} {...rest}>
      <GridBlobBackground />
      <div className="relative z-[1]">{children}</div>
    </Tag>
  )
}

export { GridBlobBackground as GridBlobCanvas }
