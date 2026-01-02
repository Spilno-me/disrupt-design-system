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
// GRID PATTERN COMPONENTS
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

/** Grid pattern mask - creates a mask where only the grid lines are visible */
function GridMask({ id = 'grid-mask' }: { id?: string }) {
  const { size } = CONFIG.grid

  return (
    <svg className="absolute inset-0 w-full h-full" style={{ width: 0, height: 0 }}>
      <defs>
        <pattern
          id={id}
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
        >
          {/* White lines = visible through mask */}
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
        </pattern>
        <mask id={`${id}-mask`}>
          <rect width="100%" height="100%" fill={`url(#${id})`} />
        </mask>
      </defs>
    </svg>
  )
}

// =============================================================================
// SINGLE BLOB COMPONENT (internal) - Original animated mask variant
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
// ANIMATED COLOR BLOB (for color-grid variant)
// =============================================================================

interface AnimatedColorBlobProps {
  config: typeof CONFIG | typeof CONFIG_BLOB_2
  color: string
  initialDelay?: number
  instanceId: string
}

/**
 * Colored grid layer with animated blob mask
 * Shows a colored version of the grid, but only visible within the animated blob shape.
 * This creates the effect of grid lines changing color where the blob passes.
 */
function ColoredGridBlob({ config, color, initialDelay = 0, instanceId }: AnimatedColorBlobProps) {
  const [waypointIndex, setWaypointIndex] = useState(0)
  const [started, setStarted] = useState(initialDelay === 0)

  const blobConfig = 'blob' in config ? config.blob : config
  const waypoints = config.waypoints
  const initial = config.initialBlob

  // Motion values for smooth animation (same as SingleBlob)
  const x = useMotionValue(initial.x)
  const y = useMotionValue(initial.y)
  const width = useMotionValue(initial.w)
  const height = useMotionValue(initial.h)

  // Transform to CSS radial mask (blob shape) - same as SingleBlob
  const maskImage = useTransform(
    [x, y, width, height],
    ([xVal, yVal, wVal, hVal]) => {
      return ALIAS.mask.radialFade(wVal as number, hVal as number, xVal as number, yVal as number)
    }
  )

  // Initial delay
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

  // Animate to new waypoint
  useEffect(() => {
    if (!started) return

    const wp = waypoints[waypointIndex]
    const duration = blobConfig.transitionDuration

    animate(x, wp.x, { duration, ease: 'easeInOut' })
    animate(y, wp.y, { duration, ease: 'easeInOut' })
    animate(width, wp.w, { duration, ease: 'easeInOut' })
    animate(height, wp.h, { duration, ease: 'easeInOut' })
  }, [waypointIndex, started, x, y, width, height, waypoints, blobConfig.transitionDuration])

  const { size: gridSize } = CONFIG.grid

  return (
    <motion.div
      className="absolute inset-0"
      style={{ maskImage, WebkitMaskImage: maskImage }}
      aria-hidden="true"
    >
      {/* Colored grid pattern - only visible within the blob mask */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <pattern
            id={`colored-grid-${instanceId}`}
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke={color}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#colored-grid-${instanceId})`} />
      </svg>
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
  /**
   * Variant:
   * - 'animated': Original animated mask effect (grid reveals through blob shape)
   * - 'static': Non-animated gradient blobs
   * - 'color-grid': Visible base grid + animated color blobs masked by grid pattern
   */
  variant?: 'animated' | 'static' | 'color-grid'
  /** For static/color-grid: primary blob color. Defaults to accent */
  primaryBlobColor?: string
  /** For static/color-grid: secondary blob color. Defaults to success */
  secondaryBlobColor?: string
}

export function GridBlobBackground({
  scale = 1,
  blobCount = 2,
  variant = 'color-grid',
  primaryBlobColor = 'var(--color-accent)',
  secondaryBlobColor = 'var(--color-success)',
}: GridBlobBackgroundProps) {
  // Static variant - simple CSS gradient blobs without animation
  if (variant === 'static') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(var(--color-primary) 1px, transparent 1px),
              linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)
            `,
            backgroundSize: `${CONFIG.grid.size}px ${CONFIG.grid.size}px`,
          }}
        />
        {/* Primary blob (top-right) */}
        <div
          className="absolute -top-1/4 -right-1/4 w-3/4 h-3/4 rounded-full opacity-60 dark:opacity-40 blur-3xl"
          style={{
            background: `radial-gradient(circle, ${primaryBlobColor} 0%, transparent 70%)`,
          }}
        />
        {/* Secondary blob (bottom-left) */}
        {blobCount === 2 && (
          <div
            className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full opacity-40 dark:opacity-25 blur-3xl"
            style={{
              background: `radial-gradient(circle, ${secondaryBlobColor} 0%, transparent 70%)`,
            }}
          />
        )}
      </div>
    )
  }

  // Color-grid variant - visible grid + animated colored grid lines
  // Layer 1: Base gray grid (always visible)
  // Layer 2+: Colored grids with blob masks (color only shows where blob is)
  if (variant === 'color-grid') {
    const instanceId = React.useId()
    const blobConfigs = [
      { config: CONFIG, color: primaryBlobColor, delay: 0 },
      { config: CONFIG_BLOB_2, color: secondaryBlobColor, delay: 600 },
    ].slice(0, blobCount)

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Layer 1: Base grid pattern - barely perceptible */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.06] dark:opacity-[0.04]" aria-hidden="true">
          <defs>
            <pattern
              id="base-grid-pattern"
              width={CONFIG.grid.size}
              height={CONFIG.grid.size}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${CONFIG.grid.size} 0 L 0 0 0 ${CONFIG.grid.size}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#base-grid-pattern)" className="text-primary" />
        </svg>

        {/* Layer 2+: Colored grids with animated blob masks - subtle colors */}
        <div className="absolute inset-0 opacity-40 dark:opacity-30">
          {blobConfigs.map((blob, index) => (
            <ColoredGridBlob
              key={index}
              config={blob.config}
              color={blob.color}
              initialDelay={blob.delay}
              instanceId={`${instanceId}-${index}`}
            />
          ))}
        </div>
      </div>
    )
  }

  // Animated variant (original behavior)
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
  /**
   * Variant:
   * - 'animated': Original animated mask effect
   * - 'static': Non-animated gradient blobs
   * - 'color-grid': Visible grid + animated colored grid lines
   */
  variant?: 'animated' | 'static' | 'color-grid'
  /** Number of blobs (1 or 2). Default: 2 for static/color-grid, 1 for animated */
  blobCount?: 1 | 2
  /** Primary blob color (for static/color-grid) */
  primaryBlobColor?: string
  /** Secondary blob color (for static/color-grid) */
  secondaryBlobColor?: string
}

export function BlobSection({
  children,
  className = '',
  as: Tag = 'section',
  variant = 'color-grid',
  blobCount = 2,
  primaryBlobColor,
  secondaryBlobColor,
  ...rest
}: BlobSectionProps) {

  return (
    <Tag className={`relative overflow-hidden ${className}`} {...rest}>
      <GridBlobBackground
        variant={variant}
        blobCount={blobCount}
        primaryBlobColor={primaryBlobColor}
        secondaryBlobColor={secondaryBlobColor}
      />
      <div className="relative z-[1]">{children}</div>
    </Tag>
  )
}

export { GridBlobBackground as GridBlobCanvas }
