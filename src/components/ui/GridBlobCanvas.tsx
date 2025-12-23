import React, { useEffect, useState, ReactNode, useMemo } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'motion/react'
import { ALIAS } from '../../constants/designTokens'

// =============================================================================
// CONFIGURATION
// =============================================================================

const CONFIG = {
  grid: { size: 20, color: 'var(--alias-grid-color, rgba(180, 180, 180, 0.4))' },
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

// Second blob waypoints - positioned on opposite side, different rhythm
const CONFIG_BLOB_2 = {
  waypointInterval: 2500, // Slightly slower for visual variety
  transitionDuration: 2.2,
  waypoints: [
    { x: 75, y: 70, w: 300, h: 260 },
    { x: 70, y: 55, w: 320, h: 280 },
    { x: 60, y: 45, w: 340, h: 300 },
    { x: 50, y: 35, w: 320, h: 280 },
    { x: 45, y: 45, w: 300, h: 260 },
    { x: 55, y: 55, w: 280, h: 240 },
    { x: 65, y: 65, w: 310, h: 270 },
    { x: 72, y: 60, w: 290, h: 250 },
  ],
  initialBlob: { x: 70, y: 65, w: 320, h: 280 },
}

// =============================================================================
// GRID PATTERN COMPONENT
// =============================================================================

function GridPattern() {
  const { size, color } = CONFIG.grid

  return (
    <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
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
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  )
}

// =============================================================================
// SINGLE BLOB COMPONENT (internal)
// =============================================================================

interface SingleBlobProps {
  scale: number
  config: typeof CONFIG | typeof CONFIG_BLOB_2
  initialDelay?: number // Stagger start for visual interest
}

function SingleBlob({ scale, config, initialDelay = 0 }: SingleBlobProps) {
  const [waypointIndex, setWaypointIndex] = useState(0)
  const [started, setStarted] = useState(initialDelay === 0)

  const blobConfig = 'blob' in config ? config.blob : config
  const waypoints = config.waypoints
  const initial = config.initialBlob

  // Motion values for smooth animation
  const x = useMotionValue(initial.x)
  const y = useMotionValue(initial.y)
  const width = useMotionValue(initial.w * scale)
  const height = useMotionValue(initial.h * scale)

  // Transform to CSS mask position and size
  const maskImage = useTransform(
    [x, y, width, height],
    ([xVal, yVal, wVal, hVal]) => {
      return ALIAS.mask.radialFade(wVal as number, hVal as number, xVal as number, yVal as number)
    }
  )

  // Initial delay before starting animation
  useEffect(() => {
    if (initialDelay > 0) {
      const timeout = setTimeout(() => setStarted(true), initialDelay)
      return () => clearTimeout(timeout)
    }
  }, [initialDelay])

  // Animate through waypoints
  useEffect(() => {
    if (!started) return

    const interval = setInterval(() => {
      setWaypointIndex(prev => (prev + 1) % waypoints.length)
    }, blobConfig.waypointInterval)

    return () => clearInterval(interval)
  }, [started, waypoints.length, blobConfig.waypointInterval])

  // Animate to new waypoint when index changes
  useEffect(() => {
    if (!started) return

    const wp = waypoints[waypointIndex]
    const duration = blobConfig.transitionDuration

    animate(x, wp.x, { duration, ease: 'easeInOut' })
    animate(y, wp.y, { duration, ease: 'easeInOut' })
    animate(width, wp.w * scale, { duration, ease: 'easeInOut' })
    animate(height, wp.h * scale, { duration, ease: 'easeInOut' })
  }, [waypointIndex, started, scale, x, y, width, height, waypoints, blobConfig.transitionDuration])

  return (
    <motion.div
      className="absolute inset-0"
      style={{ maskImage, WebkitMaskImage: maskImage }}
      aria-hidden="true"
    >
      <GridPattern />
    </motion.div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

interface GridBlobBackgroundProps {
  scale?: number
  /** Number of blobs to render (1 or 2). Default: 1 */
  blobCount?: 1 | 2
}

export function GridBlobBackground({ scale = 1, blobCount = 1 }: GridBlobBackgroundProps) {
  // Memoize blob configs to prevent re-renders
  const blobs = useMemo(() => {
    const configs = [
      { config: CONFIG, delay: 0 },
      { config: CONFIG_BLOB_2, delay: 500 }, // Stagger second blob
    ]
    return configs.slice(0, blobCount)
  }, [blobCount])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {blobs.map((blob, index) => (
        <SingleBlob
          key={index}
          scale={scale}
          config={blob.config}
          initialDelay={blob.delay}
        />
      ))}
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
