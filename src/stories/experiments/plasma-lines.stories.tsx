/**
 * Plasma Lines Experiment
 *
 * Interactive SVG lines with electricity/plasma pulse effect on hover.
 * Inspired by sci-fi UI effects where energy flows through circuit-like lines.
 *
 * Technique: stroke-dasharray + animated stroke-dashoffset
 * Reference: ElectricLucideIcon.tsx, CSS-Tricks SVG Line Animation
 */

import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { useState, useCallback, useId, useRef } from 'react'
import { motion } from 'motion/react'
import { cn } from '../../lib/utils'

// =============================================================================
// VELOCITY TRACKING UTILITIES
// =============================================================================

interface VelocityData {
  velocity: number
  direction: 'forward' | 'backward' | 'both'
  entryPoint: number // 0-1 along the line
}

function calculateVelocityData(
  currentX: number,
  currentY: number,
  lastX: number,
  lastY: number,
  deltaTime: number,
  lineStart: { x: number; y: number },
  lineEnd: { x: number; y: number }
): VelocityData {
  // Calculate mouse velocity
  const dx = currentX - lastX
  const dy = currentY - lastY
  const distance = Math.sqrt(dx * dx + dy * dy)
  const velocity = deltaTime > 0 ? distance / deltaTime : 0

  // Calculate line direction vector
  const lineDx = lineEnd.x - lineStart.x
  const lineDy = lineEnd.y - lineStart.y
  const lineLength = Math.sqrt(lineDx * lineDx + lineDy * lineDy)

  // Normalize line direction
  const lineUnitX = lineDx / lineLength
  const lineUnitY = lineDy / lineLength

  // Project mouse movement onto line direction (dot product)
  const projection = dx * lineUnitX + dy * lineUnitY

  // Determine direction based on projection
  const direction: 'forward' | 'backward' | 'both' =
    velocity < 200 ? 'both' : projection > 0 ? 'forward' : 'backward'

  // Calculate entry point along the line (0-1)
  const px = currentX - lineStart.x
  const py = currentY - lineStart.y
  const entryPoint = Math.max(0, Math.min(1, (px * lineUnitX + py * lineUnitY) / lineLength))

  return { velocity, direction, entryPoint }
}

// =============================================================================
// META
// =============================================================================

const meta: Meta = {
  title: 'Experiments/Plasma Lines',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `
# Plasma Lines Experiment

Interactive lines that send an energy pulse when hovered.

## Features
- **Hover-triggered pulse**: Mouse over any line to send a plasma burst
- **SVG-based**: Clean scalable paths with glow filters
- **Gradient fade tail**: Comet-like effect with fading trail
- **Configurable**: Speed, color, intensity all adjustable

## Technique
Uses \`stroke-dasharray\` + animated \`stroke-dashoffset\` with multiple stacked layers
to create a traveling pulse with gradient fade-out tail.
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj

// =============================================================================
// TYPES
// =============================================================================

interface Point {
  x: number
  y: number
}

interface PlasmaLineProps {
  /** Start point */
  start: Point
  /** End point */
  end: Point
  /** Control points for bezier curve (optional) */
  controlPoints?: [Point, Point]
  /** Base color of the line */
  baseColor?: string
  /** Plasma/glow color */
  plasmaColor?: string
  /** Line thickness */
  strokeWidth?: number
  /** Animation duration in seconds */
  duration?: number
  /** Glow intensity (blur radius) */
  glowIntensity?: number
  /** Unique ID for SVG filters */
  id?: string
}

// =============================================================================
// PLASMA LINE COMPONENT
// =============================================================================

function PlasmaLine({
  start,
  end,
  controlPoints,
  baseColor = 'rgba(100, 150, 180, 0.3)',
  plasmaColor = '#00FFFF',
  strokeWidth = 2,
  duration = 0.6,
  glowIntensity = 12,
  id: providedId,
}: PlasmaLineProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const autoId = useId()
  const id = providedId || autoId.replace(/:/g, '')

  // Build path string
  const pathD = controlPoints
    ? `M ${start.x} ${start.y} C ${controlPoints[0].x} ${controlPoints[0].y}, ${controlPoints[1].x} ${controlPoints[1].y}, ${end.x} ${end.y}`
    : `M ${start.x} ${start.y} L ${end.x} ${end.y}`

  // Calculate path length for dash animation
  const pathLength = controlPoints
    ? 400 // Approximate for curves
    : Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2))

  const handleMouseEnter = useCallback(() => {
    if (!isAnimating) {
      setIsAnimating(true)
    }
  }, [isAnimating])

  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false)
  }, [])

  return (
    <g>
      {/* SVG Filters for glow effect */}
      <defs>
        <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={glowIntensity} result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Base line (always visible, dim) */}
      <path
        d={pathD}
        fill="none"
        stroke={baseColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        style={{ cursor: 'pointer' }}
        onMouseEnter={handleMouseEnter}
      />

      {/* Hover detection area (wider for easier interaction) */}
      <path
        d={pathD}
        fill="none"
        stroke="transparent"
        strokeWidth={strokeWidth + 20}
        strokeLinecap="round"
        style={{ cursor: 'pointer' }}
        onMouseEnter={handleMouseEnter}
      />

      {/* Animated plasma pulse with gradient fade-out tail */}
      {isAnimating && (
        <>
          {/* Tail layer 4 - very faint, longest trail */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={plasmaColor}
            strokeWidth={strokeWidth + 2}
            strokeLinecap="round"
            opacity={0.1}
            filter={`url(#glow-${id})`}
            initial={{
              strokeDasharray: `${pathLength * 0.25} ${pathLength}`,
              strokeDashoffset: pathLength * 1.1,
            }}
            animate={{
              strokeDashoffset: -pathLength * 0.25,
            }}
            transition={{
              duration: duration,
              ease: 'linear',
            }}
          />

          {/* Tail layer 3 - faint */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={plasmaColor}
            strokeWidth={strokeWidth + 2}
            strokeLinecap="round"
            opacity={0.2}
            filter={`url(#glow-${id})`}
            initial={{
              strokeDasharray: `${pathLength * 0.18} ${pathLength}`,
              strokeDashoffset: pathLength * 1.05,
            }}
            animate={{
              strokeDashoffset: -pathLength * 0.18,
            }}
            transition={{
              duration: duration,
              ease: 'linear',
            }}
          />

          {/* Tail layer 2 - medium glow */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={plasmaColor}
            strokeWidth={strokeWidth + 3}
            strokeLinecap="round"
            opacity={0.4}
            filter={`url(#glow-${id})`}
            initial={{
              strokeDasharray: `${pathLength * 0.12} ${pathLength}`,
              strokeDashoffset: pathLength,
            }}
            animate={{
              strokeDashoffset: -pathLength * 0.12,
            }}
            transition={{
              duration: duration,
              ease: 'linear',
            }}
          />

          {/* Main glow layer - bright colored */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={plasmaColor}
            strokeWidth={strokeWidth + 4}
            strokeLinecap="round"
            filter={`url(#glow-${id})`}
            initial={{
              strokeDasharray: `${pathLength * 0.08} ${pathLength}`,
              strokeDashoffset: pathLength * 0.95,
              opacity: 0.9,
            }}
            animate={{
              strokeDashoffset: -pathLength * 0.08,
              opacity: [0.9, 1, 0.9],
            }}
            transition={{
              duration: duration,
              ease: 'linear',
            }}
            onAnimationComplete={handleAnimationComplete}
          />

          {/* Core bright white line - leading edge */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{
              strokeDasharray: `${pathLength * 0.04} ${pathLength}`,
              strokeDashoffset: pathLength * 0.93,
            }}
            animate={{
              strokeDashoffset: -pathLength * 0.04,
            }}
            transition={{
              duration: duration,
              ease: 'linear',
            }}
          />
        </>
      )}
    </g>
  )
}

// =============================================================================
// VELOCITY-REACTIVE PLASMA LINE COMPONENT
// =============================================================================

interface VelocityPlasmaLineProps {
  /** Start point */
  start: Point
  /** End point */
  end: Point
  /** Control points for bezier curve (optional) */
  controlPoints?: [Point, Point]
  /** Base color of the line */
  baseColor?: string
  /** Plasma/glow color */
  plasmaColor?: string
  /** Line thickness */
  strokeWidth?: number
  /** Base animation duration (modified by velocity) */
  baseDuration?: number
  /** Glow intensity (blur radius) */
  glowIntensity?: number
  /** Unique ID for SVG filters */
  id?: string
  /** Minimum duration (fastest pulse) */
  minDuration?: number
  /** Maximum duration (slowest pulse) */
  maxDuration?: number
  /** Velocity threshold for "slow" mode (pixels/ms) */
  slowThreshold?: number
}

type AnimationMode = 'idle' | 'forward' | 'backward' | 'ripple'

function VelocityPlasmaLine({
  start,
  end,
  controlPoints,
  baseColor = 'rgba(100, 150, 180, 0.3)',
  plasmaColor = '#00FFFF',
  strokeWidth = 2,
  baseDuration = 0.6,
  glowIntensity = 12,
  id: providedId,
  minDuration = 0.2,
  maxDuration = 1.5,
  slowThreshold = 200,
}: VelocityPlasmaLineProps) {
  const [animationMode, setAnimationMode] = useState<AnimationMode>('idle')
  const [duration, setDuration] = useState(baseDuration)
  const [entryPoint, setEntryPoint] = useState(0.5)
  const autoId = useId()
  const id = providedId || autoId.replace(/:/g, '')

  // Refs for velocity tracking
  const lastMousePos = useRef<{ x: number; y: number; time: number } | null>(null)
  const svgRef = useRef<SVGGElement>(null)

  // Build path string
  const pathD = controlPoints
    ? `M ${start.x} ${start.y} C ${controlPoints[0].x} ${controlPoints[0].y}, ${controlPoints[1].x} ${controlPoints[1].y}, ${end.x} ${end.y}`
    : `M ${start.x} ${start.y} L ${end.x} ${end.y}`

  // Calculate path length for dash animation
  const pathLength = controlPoints
    ? 400
    : Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2))

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGPathElement>) => {
      if (animationMode !== 'idle') return

      const svg = svgRef.current?.ownerSVGElement
      if (!svg) return

      const point = svg.createSVGPoint()
      point.x = e.clientX
      point.y = e.clientY
      const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse())

      const currentTime = performance.now()
      const currentX = svgPoint.x
      const currentY = svgPoint.y

      if (lastMousePos.current) {
        const deltaTime = currentTime - lastMousePos.current.time

        if (deltaTime > 10) {
          // Minimum 10ms between samples
          const velocityData = calculateVelocityData(
            currentX,
            currentY,
            lastMousePos.current.x,
            lastMousePos.current.y,
            deltaTime,
            start,
            end
          )

          // Map velocity to duration (faster velocity = shorter duration)
          const velocityNormalized = Math.min(velocityData.velocity / 1000, 1)
          const newDuration = maxDuration - velocityNormalized * (maxDuration - minDuration)
          setDuration(newDuration)
          setEntryPoint(velocityData.entryPoint)

          // Trigger animation based on velocity and direction
          if (velocityData.velocity < slowThreshold) {
            setAnimationMode('ripple')
          } else if (velocityData.direction === 'forward') {
            setAnimationMode('forward')
          } else {
            setAnimationMode('backward')
          }

          lastMousePos.current = { x: currentX, y: currentY, time: currentTime }
        }
      } else {
        lastMousePos.current = { x: currentX, y: currentY, time: currentTime }
      }
    },
    [animationMode, start, end, maxDuration, minDuration, slowThreshold]
  )

  const handleMouseLeave = useCallback(() => {
    lastMousePos.current = null
  }, [])

  const handleAnimationComplete = useCallback(() => {
    setAnimationMode('idle')
  }, [])

  // Calculate offsets for ripple mode (starts from entry point)
  const forwardStartOffset = pathLength * (1 - entryPoint)
  const backwardStartOffset = -pathLength * entryPoint

  return (
    <g ref={svgRef}>
      {/* SVG Filters for glow effect */}
      <defs>
        <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={glowIntensity} result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Base line (always visible, dim) */}
      <path
        d={pathD}
        fill="none"
        stroke={baseColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Hover detection area (wider for easier interaction) */}
      <path
        d={pathD}
        fill="none"
        stroke="transparent"
        strokeWidth={strokeWidth + 30}
        strokeLinecap="round"
        style={{ cursor: 'pointer' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {/* Forward pulse */}
      {(animationMode === 'forward' || animationMode === 'ripple') && (
        <>
          {/* Tail layer - faint */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={plasmaColor}
            strokeWidth={strokeWidth + 2}
            strokeLinecap="round"
            opacity={0.15}
            filter={`url(#glow-${id})`}
            initial={{
              strokeDasharray: `${pathLength * 0.2} ${pathLength}`,
              strokeDashoffset:
                animationMode === 'ripple' ? forwardStartOffset * 1.05 : pathLength * 1.05,
            }}
            animate={{
              strokeDashoffset: -pathLength * 0.2,
            }}
            transition={{
              duration: duration,
              ease: animationMode === 'ripple' ? 'easeOut' : 'linear',
            }}
          />

          {/* Main glow */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={plasmaColor}
            strokeWidth={strokeWidth + 4}
            strokeLinecap="round"
            filter={`url(#glow-${id})`}
            initial={{
              strokeDasharray: `${pathLength * 0.08} ${pathLength}`,
              strokeDashoffset: animationMode === 'ripple' ? forwardStartOffset : pathLength * 0.95,
              opacity: 0.9,
            }}
            animate={{
              strokeDashoffset: -pathLength * 0.08,
              opacity: [0.9, 1, 0.9],
            }}
            transition={{
              duration: duration,
              ease: animationMode === 'ripple' ? 'easeOut' : 'linear',
            }}
            onAnimationComplete={animationMode === 'forward' ? handleAnimationComplete : undefined}
          />

          {/* Core white */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{
              strokeDasharray: `${pathLength * 0.04} ${pathLength}`,
              strokeDashoffset:
                animationMode === 'ripple' ? forwardStartOffset * 0.97 : pathLength * 0.93,
            }}
            animate={{
              strokeDashoffset: -pathLength * 0.04,
            }}
            transition={{
              duration: duration,
              ease: animationMode === 'ripple' ? 'easeOut' : 'linear',
            }}
          />
        </>
      )}

      {/* Backward pulse (only in ripple mode or backward mode) */}
      {(animationMode === 'backward' || animationMode === 'ripple') && (
        <>
          {/* Tail layer - faint */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={plasmaColor}
            strokeWidth={strokeWidth + 2}
            strokeLinecap="round"
            opacity={0.15}
            filter={`url(#glow-${id})`}
            initial={{
              strokeDasharray: `${pathLength * 0.2} ${pathLength}`,
              strokeDashoffset:
                animationMode === 'ripple' ? backwardStartOffset * 0.95 : -pathLength * 0.05,
            }}
            animate={{
              strokeDashoffset: pathLength * 1.2,
            }}
            transition={{
              duration: duration,
              ease: animationMode === 'ripple' ? 'easeOut' : 'linear',
            }}
          />

          {/* Main glow */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={plasmaColor}
            strokeWidth={strokeWidth + 4}
            strokeLinecap="round"
            filter={`url(#glow-${id})`}
            initial={{
              strokeDasharray: `${pathLength * 0.08} ${pathLength}`,
              strokeDashoffset: animationMode === 'ripple' ? backwardStartOffset : -pathLength * 0.03,
              opacity: 0.9,
            }}
            animate={{
              strokeDashoffset: pathLength * 1.08,
              opacity: [0.9, 1, 0.9],
            }}
            transition={{
              duration: duration,
              ease: animationMode === 'ripple' ? 'easeOut' : 'linear',
            }}
            onAnimationComplete={handleAnimationComplete}
          />

          {/* Core white */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{
              strokeDasharray: `${pathLength * 0.04} ${pathLength}`,
              strokeDashoffset:
                animationMode === 'ripple' ? backwardStartOffset * 1.03 : -pathLength * 0.01,
            }}
            animate={{
              strokeDashoffset: pathLength * 1.04,
            }}
            transition={{
              duration: duration,
              ease: animationMode === 'ripple' ? 'easeOut' : 'linear',
            }}
          />
        </>
      )}
    </g>
  )
}
// =============================================================================
// LIVING PLASMA LINE COMPONENT
// =============================================================================

interface LivingPlasmaLineProps {
  /** Start point */
  start: Point
  /** End point */
  end: Point
  /** Control points for bezier curve (optional) */
  controlPoints?: [Point, Point]
  /** Base color of the line */
  baseColor?: string
  /** Plasma/glow color */
  plasmaColor?: string
  /** Line thickness */
  strokeWidth?: number
  /** Glow intensity (blur radius) */
  glowIntensity?: number
  /** Unique ID for SVG filters */
  id?: string
  /** Velocity threshold for impulse vs fluid mode (pixels/ms) */
  impulseThreshold?: number
}

function LivingPlasmaLine({
  start,
  end,
  controlPoints,
  baseColor = 'rgba(100, 150, 180, 0.3)',
  plasmaColor = '#00FFFF',
  strokeWidth = 2,
  glowIntensity = 12,
  id: providedId,
  impulseThreshold = 300,
}: LivingPlasmaLineProps) {
  // Animation states
  const [mode, setMode] = useState<'idle' | 'impulse' | 'fluid'>('idle')
  const [impulseDirection, setImpulseDirection] = useState<'forward' | 'backward'>('forward')
  const [impulseDuration, setImpulseDuration] = useState(0.5)
  const [fluidPosition, setFluidPosition] = useState(0.5) // 0-1 along line
  
  const autoId = useId()
  const id = providedId || autoId.replace(/:/g, '')

  // Refs for tracking
  const lastMousePos = useRef<{ x: number; y: number; time: number } | null>(null)
  const svgRef = useRef<SVGGElement>(null)
  const fluidAnimationRef = useRef<number | null>(null)

  // Build path string
  const pathD = controlPoints
    ? `M ${start.x} ${start.y} C ${controlPoints[0].x} ${controlPoints[0].y}, ${controlPoints[1].x} ${controlPoints[1].y}, ${end.x} ${end.y}`
    : `M ${start.x} ${start.y} L ${end.x} ${end.y}`

  // Calculate path length
  const pathLength = controlPoints
    ? 400
    : Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2))

  // Calculate position along line (0-1)
  const getPositionOnLine = useCallback(
    (mouseX: number, mouseY: number): number => {
      const lineDx = end.x - start.x
      const lineDy = end.y - start.y
      const lineLength = Math.sqrt(lineDx * lineDx + lineDy * lineDy)
      const lineUnitX = lineDx / lineLength
      const lineUnitY = lineDy / lineLength
      const px = mouseX - start.x
      const py = mouseY - start.y
      return Math.max(0, Math.min(1, (px * lineUnitX + py * lineUnitY) / lineLength))
    },
    [start, end]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGPathElement>) => {
      const svg = svgRef.current?.ownerSVGElement
      if (!svg) return

      const point = svg.createSVGPoint()
      point.x = e.clientX
      point.y = e.clientY
      const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse())

      const currentTime = performance.now()
      const currentX = svgPoint.x
      const currentY = svgPoint.y
      const position = getPositionOnLine(currentX, currentY)

      if (lastMousePos.current && mode !== 'impulse') {
        const deltaTime = currentTime - lastMousePos.current.time

        if (deltaTime > 8) {
          const dx = currentX - lastMousePos.current.x
          const dy = currentY - lastMousePos.current.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const velocity = distance / deltaTime

          if (velocity > impulseThreshold) {
            // Fast movement - trigger impulse
            const lineDx = end.x - start.x
            const lineDy = end.y - start.y
            const lineLength = Math.sqrt(lineDx * lineDx + lineDy * lineDy)
            const projection = (dx * lineDx + dy * lineDy) / lineLength

            setImpulseDirection(projection > 0 ? 'forward' : 'backward')
            setImpulseDuration(Math.max(0.2, 0.6 - velocity / 2000))
            setMode('impulse')
          } else {
            // Slow movement - fluid mode, glow follows mouse
            setFluidPosition(position)
            if (mode !== 'fluid') {
              setMode('fluid')
            }
          }

          lastMousePos.current = { x: currentX, y: currentY, time: currentTime }
        }
      } else if (!lastMousePos.current) {
        lastMousePos.current = { x: currentX, y: currentY, time: currentTime }
        setFluidPosition(position)
        setMode('fluid')
      }
    },
    [mode, start, end, impulseThreshold, getPositionOnLine]
  )

  const handleMouseLeave = useCallback(() => {
    lastMousePos.current = null
    setMode('idle')
    if (fluidAnimationRef.current) {
      cancelAnimationFrame(fluidAnimationRef.current)
    }
  }, [])

  const handleImpulseComplete = useCallback(() => {
    setMode('idle')
  }, [])

  // Fluid position along path (for the glowing segment)
  const fluidOffset = pathLength * (1 - fluidPosition)
  const fluidSegmentLength = pathLength * 0.15 // 15% of line glows

  return (
    <g ref={svgRef}>
      {/* SVG Filters */}
      <defs>
        <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={glowIntensity} result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`soft-glow-${id}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={glowIntensity * 1.5} result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Base line (always visible, dim) */}
      <path
        d={pathD}
        fill="none"
        stroke={baseColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Hover detection area */}
      <path
        d={pathD}
        fill="none"
        stroke="transparent"
        strokeWidth={strokeWidth + 40}
        strokeLinecap="round"
        style={{ cursor: 'pointer' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {/* FLUID MODE - Living glow that follows mouse */}
      {mode === 'fluid' && (
        <>
          {/* Outer soft aura */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={plasmaColor}
            strokeWidth={strokeWidth + 8}
            strokeLinecap="round"
            filter={`url(#soft-glow-${id})`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.2, 0.35, 0.2],
              strokeDashoffset: fluidOffset,
            }}
            transition={{
              opacity: {
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              strokeDashoffset: {
                duration: 0.15,
                ease: 'easeOut',
              },
            }}
            style={{
              strokeDasharray: `${fluidSegmentLength * 2} ${pathLength}`,
            }}
          />

          {/* Inner glow */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={plasmaColor}
            strokeWidth={strokeWidth + 4}
            strokeLinecap="round"
            filter={`url(#glow-${id})`}
            animate={{
              opacity: [0.5, 0.8, 0.5],
              strokeDashoffset: fluidOffset,
            }}
            transition={{
              opacity: {
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.1,
              },
              strokeDashoffset: {
                duration: 0.12,
                ease: 'easeOut',
              },
            }}
            style={{
              strokeDasharray: `${fluidSegmentLength} ${pathLength}`,
            }}
          />

          {/* Core bright center */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            animate={{
              opacity: [0.7, 1, 0.7],
              strokeDashoffset: fluidOffset,
            }}
            transition={{
              opacity: {
                duration: 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.2,
              },
              strokeDashoffset: {
                duration: 0.1,
                ease: 'easeOut',
              },
            }}
            style={{
              strokeDasharray: `${fluidSegmentLength * 0.5} ${pathLength}`,
            }}
          />
        </>
      )}

      {/* IMPULSE MODE - Fast directional burst */}
      {mode === 'impulse' && (
        <>
          {/* Tail */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={plasmaColor}
            strokeWidth={strokeWidth + 2}
            strokeLinecap="round"
            opacity={0.15}
            filter={`url(#glow-${id})`}
            initial={{
              strokeDasharray: `${pathLength * 0.25} ${pathLength}`,
              strokeDashoffset: impulseDirection === 'forward' ? pathLength * 1.1 : -pathLength * 0.1,
            }}
            animate={{
              strokeDashoffset: impulseDirection === 'forward' ? -pathLength * 0.25 : pathLength * 1.25,
            }}
            transition={{ duration: impulseDuration, ease: 'linear' }}
          />

          {/* Main glow */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={plasmaColor}
            strokeWidth={strokeWidth + 4}
            strokeLinecap="round"
            filter={`url(#glow-${id})`}
            initial={{
              strokeDasharray: `${pathLength * 0.1} ${pathLength}`,
              strokeDashoffset: impulseDirection === 'forward' ? pathLength : -pathLength * 0.05,
              opacity: 0.9,
            }}
            animate={{
              strokeDashoffset: impulseDirection === 'forward' ? -pathLength * 0.1 : pathLength * 1.1,
              opacity: [0.9, 1, 0.8],
            }}
            transition={{ duration: impulseDuration, ease: 'linear' }}
            onAnimationComplete={handleImpulseComplete}
          />

          {/* Core white */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{
              strokeDasharray: `${pathLength * 0.05} ${pathLength}`,
              strokeDashoffset: impulseDirection === 'forward' ? pathLength * 0.97 : -pathLength * 0.02,
            }}
            animate={{
              strokeDashoffset: impulseDirection === 'forward' ? -pathLength * 0.05 : pathLength * 1.05,
            }}
            transition={{ duration: impulseDuration, ease: 'linear' }}
          />
        </>
      )}
    </g>
  )
}

// =============================================================================
// CIRCUIT GRID COMPONENT
// =============================================================================

interface CircuitGridProps {
  width: number
  height: number
  plasmaColor?: string
  density?: 'low' | 'medium' | 'high'
}

function CircuitGrid({
  width,
  height,
  plasmaColor = '#00FFFF',
  density = 'medium',
}: CircuitGridProps) {
  const spacing = density === 'low' ? 150 : density === 'medium' ? 100 : 60

  const lines: React.ReactNode[] = []
  let lineIndex = 0

  // Horizontal lines
  for (let y = spacing; y < height - spacing; y += spacing) {
    const segments = 2 + (y % 3)
    let currentX = 50

    for (let s = 0; s < segments; s++) {
      const segmentLength = (width - 100) / segments + ((s % 2) - 0.5) * 40
      const endX = Math.min(currentX + segmentLength, width - 50)

      lines.push(
        <PlasmaLine
          key={`h-${lineIndex++}`}
          start={{ x: currentX, y }}
          end={{ x: endX, y }}
          plasmaColor={plasmaColor}
          baseColor="rgba(100, 150, 180, 0.2)"
          strokeWidth={1.5}
          duration={0.4 + (s % 3) * 0.1}
        />
      )

      currentX = endX + 20 + (s % 2) * 20
    }
  }

  // Vertical lines
  for (let x = spacing; x < width - spacing; x += spacing) {
    const segments = 1 + (x % 2)
    let currentY = 50

    for (let s = 0; s < segments; s++) {
      const segmentLength = (height - 100) / segments + ((s % 2) - 0.5) * 40
      const endY = Math.min(currentY + segmentLength, height - 50)

      lines.push(
        <PlasmaLine
          key={`v-${lineIndex++}`}
          start={{ x, y: currentY }}
          end={{ x, y: endY }}
          plasmaColor={plasmaColor}
          baseColor="rgba(100, 150, 180, 0.2)"
          strokeWidth={1.5}
          duration={0.4 + (s % 3) * 0.1}
        />
      )

      currentY = endY + 20 + (s % 2) * 20
    }
  }

  // Diagonal connections
  const diagonalCount = density === 'low' ? 4 : density === 'medium' ? 8 : 12
  for (let i = 0; i < diagonalCount; i++) {
    const startX = ((i * 137) % (width - 200)) + 100
    const startY = ((i * 89) % (height - 200)) + 100
    const angle = ((i * 45) % 360) * (Math.PI / 180)
    const length = 80 + (i % 4) * 30

    lines.push(
      <PlasmaLine
        key={`d-${lineIndex++}`}
        start={{ x: startX, y: startY }}
        end={{
          x: startX + Math.cos(angle) * length,
          y: startY + Math.sin(angle) * length,
        }}
        plasmaColor={plasmaColor}
        baseColor="rgba(100, 150, 180, 0.15)"
        strokeWidth={1}
        duration={0.5}
      />
    )
  }

  return <>{lines}</>
}

// =============================================================================
// NODE COMPONENT (connection points)
// =============================================================================

interface NodeProps {
  x: number
  y: number
  size?: number
  color?: string
}

function Node({ x, y, size = 6, color = '#00FFFF' }: NodeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const id = useId().replace(/:/g, '')

  return (
    <g>
      <defs>
        <filter id={`node-glow-${id}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer ring */}
      <motion.circle
        cx={x}
        cy={y}
        r={size}
        fill="none"
        stroke={color}
        strokeWidth={1}
        opacity={0.3}
        animate={{
          r: isHovered ? size + 8 : size,
          opacity: isHovered ? 0.6 : 0.3,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Inner filled circle */}
      <motion.circle
        cx={x}
        cy={y}
        r={size * 0.4}
        fill={color}
        filter={`url(#node-glow-${id})`}
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          scale: isHovered ? 1.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      />
    </g>
  )
}

// =============================================================================
// STORIES
// =============================================================================

export const SingleLine: Story = {
  name: 'Single Line',
  render: () => (
    <div className="min-h-screen bg-abyss-950 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Plasma Line</h1>
        <p className="text-abyss-400">Hover over the line to send a pulse</p>
      </div>

      <svg width="600" height="100" className="overflow-visible">
        <PlasmaLine
          start={{ x: 50, y: 50 }}
          end={{ x: 550, y: 50 }}
          plasmaColor="#00FFFF"
          strokeWidth={3}
          duration={0.8}
          glowIntensity={15}
        />
      </svg>
    </div>
  ),
}

export const MultipleLines: Story = {
  name: 'Multiple Lines',
  render: () => (
    <div className="min-h-screen bg-abyss-950 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Multiple Plasma Lines</h1>
        <p className="text-abyss-400">Each line triggers independently</p>
      </div>

      <svg width="600" height="300" className="overflow-visible">
        {/* Horizontal lines */}
        <PlasmaLine
          start={{ x: 50, y: 50 }}
          end={{ x: 550, y: 50 }}
          plasmaColor="#00FFFF"
          strokeWidth={2}
        />
        <PlasmaLine
          start={{ x: 50, y: 150 }}
          end={{ x: 550, y: 150 }}
          plasmaColor="#FF00FF"
          strokeWidth={2}
        />
        <PlasmaLine
          start={{ x: 50, y: 250 }}
          end={{ x: 550, y: 250 }}
          plasmaColor="#00FF88"
          strokeWidth={2}
        />

        {/* Vertical connectors */}
        <PlasmaLine
          start={{ x: 300, y: 50 }}
          end={{ x: 300, y: 250 }}
          plasmaColor="#FFFF00"
          strokeWidth={2}
        />

        {/* Diagonal */}
        <PlasmaLine
          start={{ x: 100, y: 50 }}
          end={{ x: 200, y: 150 }}
          plasmaColor="#FF6600"
          strokeWidth={2}
        />
        <PlasmaLine
          start={{ x: 400, y: 150 }}
          end={{ x: 500, y: 250 }}
          plasmaColor="#FF6600"
          strokeWidth={2}
        />
      </svg>
    </div>
  ),
}

export const CurvedLines: Story = {
  name: 'Curved Lines (Bezier)',
  render: () => (
    <div className="min-h-screen bg-abyss-950 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Curved Plasma</h1>
        <p className="text-abyss-400">Bezier curves with plasma effect</p>
      </div>

      <svg width="600" height="400" className="overflow-visible">
        {/* S-curve */}
        <PlasmaLine
          start={{ x: 50, y: 200 }}
          end={{ x: 550, y: 200 }}
          controlPoints={[
            { x: 200, y: 50 },
            { x: 400, y: 350 },
          ]}
          plasmaColor="#00FFFF"
          strokeWidth={3}
          duration={1}
        />

        {/* Wave */}
        <PlasmaLine
          start={{ x: 50, y: 100 }}
          end={{ x: 550, y: 100 }}
          controlPoints={[
            { x: 150, y: 200 },
            { x: 450, y: 0 },
          ]}
          plasmaColor="#FF00FF"
          strokeWidth={2}
          duration={0.8}
        />

        {/* Arc */}
        <PlasmaLine
          start={{ x: 50, y: 350 }}
          end={{ x: 550, y: 350 }}
          controlPoints={[
            { x: 200, y: 250 },
            { x: 400, y: 250 },
          ]}
          plasmaColor="#00FF88"
          strokeWidth={2}
          duration={0.9}
        />
      </svg>
    </div>
  ),
}

export const CircuitPattern: Story = {
  name: 'Circuit Pattern',
  render: () => {
    const [key, setKey] = React.useState(0)

    return (
      <div className="min-h-screen bg-abyss-950 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-abyss-900/50 via-abyss-950 to-abyss-950" />

        {/* Header */}
        <div className="relative z-10 text-center pt-12">
          <h1 className="text-3xl font-bold text-white mb-2">Circuit Board</h1>
          <p className="text-abyss-400 mb-4">Hover over any line to send a pulse</p>
          <button
            onClick={() => setKey((k) => k + 1)}
            className="px-4 py-2 bg-abyss-800 hover:bg-abyss-700 text-abyss-200 rounded-lg text-sm transition-colors"
          >
            Regenerate Pattern
          </button>
        </div>

        {/* Circuit SVG */}
        <svg
          key={key}
          width="100%"
          height="100%"
          viewBox="0 0 1200 800"
          className="absolute inset-0"
          preserveAspectRatio="xMidYMid slice"
        >
          <CircuitGrid width={1200} height={800} plasmaColor="#00FFFF" density="medium" />
        </svg>
      </div>
    )
  },
}

export const NetworkNodes: Story = {
  name: 'Network with Nodes',
  render: () => (
    <div className="min-h-screen bg-abyss-950 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Neural Network</h1>
        <p className="text-abyss-400">Connected nodes with plasma links</p>
      </div>

      <svg width="800" height="500" className="overflow-visible">
        {/* Layer 1 to Layer 2 connections */}
        <PlasmaLine start={{ x: 150, y: 100 }} end={{ x: 400, y: 150 }} plasmaColor="#00FFFF" />
        <PlasmaLine start={{ x: 150, y: 100 }} end={{ x: 400, y: 250 }} plasmaColor="#00FFFF" />
        <PlasmaLine start={{ x: 150, y: 100 }} end={{ x: 400, y: 350 }} plasmaColor="#00FFFF" />

        <PlasmaLine start={{ x: 150, y: 250 }} end={{ x: 400, y: 150 }} plasmaColor="#00FFFF" />
        <PlasmaLine start={{ x: 150, y: 250 }} end={{ x: 400, y: 250 }} plasmaColor="#00FFFF" />
        <PlasmaLine start={{ x: 150, y: 250 }} end={{ x: 400, y: 350 }} plasmaColor="#00FFFF" />

        <PlasmaLine start={{ x: 150, y: 400 }} end={{ x: 400, y: 150 }} plasmaColor="#00FFFF" />
        <PlasmaLine start={{ x: 150, y: 400 }} end={{ x: 400, y: 250 }} plasmaColor="#00FFFF" />
        <PlasmaLine start={{ x: 150, y: 400 }} end={{ x: 400, y: 350 }} plasmaColor="#00FFFF" />

        {/* Layer 2 to Layer 3 connections */}
        <PlasmaLine start={{ x: 400, y: 150 }} end={{ x: 650, y: 200 }} plasmaColor="#FF00FF" />
        <PlasmaLine start={{ x: 400, y: 150 }} end={{ x: 650, y: 300 }} plasmaColor="#FF00FF" />

        <PlasmaLine start={{ x: 400, y: 250 }} end={{ x: 650, y: 200 }} plasmaColor="#FF00FF" />
        <PlasmaLine start={{ x: 400, y: 250 }} end={{ x: 650, y: 300 }} plasmaColor="#FF00FF" />

        <PlasmaLine start={{ x: 400, y: 350 }} end={{ x: 650, y: 200 }} plasmaColor="#FF00FF" />
        <PlasmaLine start={{ x: 400, y: 350 }} end={{ x: 650, y: 300 }} plasmaColor="#FF00FF" />

        {/* Nodes - Layer 1 (Input) */}
        <Node x={150} y={100} color="#00FFFF" size={8} />
        <Node x={150} y={250} color="#00FFFF" size={8} />
        <Node x={150} y={400} color="#00FFFF" size={8} />

        {/* Nodes - Layer 2 (Hidden) */}
        <Node x={400} y={150} color="#FF00FF" size={8} />
        <Node x={400} y={250} color="#FF00FF" size={8} />
        <Node x={400} y={350} color="#FF00FF" size={8} />

        {/* Nodes - Layer 3 (Output) */}
        <Node x={650} y={200} color="#00FF88" size={10} />
        <Node x={650} y={300} color="#00FF88" size={10} />

        {/* Labels */}
        <text x={150} y={450} textAnchor="middle" fill="#4B5563" fontSize={12}>
          Input
        </text>
        <text x={400} y={420} textAnchor="middle" fill="#4B5563" fontSize={12}>
          Hidden
        </text>
        <text x={650} y={370} textAnchor="middle" fill="#4B5563" fontSize={12}>
          Output
        </text>
      </svg>
    </div>
  ),
}

export const ColorVariants: Story = {
  name: 'Color Variants',
  render: () => (
    <div className="min-h-screen bg-abyss-950 p-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Plasma Colors</h1>
        <p className="text-abyss-400">Different energy signatures</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {[
          { name: 'Cyan Electric', color: '#00FFFF', bg: 'from-cyan-950/30' },
          { name: 'Magenta Plasma', color: '#FF00FF', bg: 'from-fuchsia-950/30' },
          { name: 'Green Surge', color: '#00FF88', bg: 'from-emerald-950/30' },
          { name: 'Gold Energy', color: '#FFD700', bg: 'from-amber-950/30' },
          { name: 'Red Alert', color: '#FF4444', bg: 'from-red-950/30' },
          { name: 'Purple Void', color: '#8B5CF6', bg: 'from-violet-950/30' },
        ].map(({ name, color, bg }) => (
          <div
            key={name}
            className={cn(
              'bg-gradient-to-r to-transparent rounded-xl p-6 border border-abyss-800',
              bg
            )}
          >
            <p className="text-xs uppercase tracking-wider text-abyss-500 mb-4">{name}</p>
            <svg width="100%" height="40" className="overflow-visible">
              <PlasmaLine
                start={{ x: 20, y: 20 }}
                end={{ x: 780, y: 20 }}
                plasmaColor={color}
                strokeWidth={3}
                duration={0.8}
                glowIntensity={12}
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  ),
}

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: () => {
    const [pulseSpeed, setPulseSpeed] = React.useState(0.6)
    const [glowIntensity, setGlowIntensity] = React.useState(12)
    const [strokeWidth, setStrokeWidth] = React.useState(3)
    const [plasmaColor, setPlasmaColor] = React.useState('#00FFFF')

    const colors = [
      { value: '#00FFFF', label: 'Cyan' },
      { value: '#FF00FF', label: 'Magenta' },
      { value: '#00FF88', label: 'Green' },
      { value: '#FFD700', label: 'Gold' },
      { value: '#FF4444', label: 'Red' },
      { value: '#8B5CF6', label: 'Purple' },
    ]

    return (
      <div className="min-h-screen bg-abyss-950 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Interactive Plasma</h1>
            <p className="text-abyss-400">Customize the effect</p>
          </div>

          {/* Controls */}
          <div className="bg-abyss-900/50 rounded-xl p-6 mb-8 border border-abyss-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Speed */}
              <div>
                <label className="text-sm text-abyss-400 block mb-2">
                  Pulse Speed: {pulseSpeed.toFixed(1)}s
                </label>
                <input
                  type="range"
                  min="0.2"
                  max="2"
                  step="0.1"
                  value={pulseSpeed}
                  onChange={(e) => setPulseSpeed(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              {/* Glow */}
              <div>
                <label className="text-sm text-abyss-400 block mb-2">
                  Glow Intensity: {glowIntensity}
                </label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={glowIntensity}
                  onChange={(e) => setGlowIntensity(parseInt(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              {/* Stroke Width */}
              <div>
                <label className="text-sm text-abyss-400 block mb-2">
                  Line Thickness: {strokeWidth}px
                </label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="0.5"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              {/* Color */}
              <div>
                <label className="text-sm text-abyss-400 block mb-2">Plasma Color</label>
                <div className="flex gap-2">
                  {colors.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setPlasmaColor(value)}
                      className={cn(
                        'w-8 h-8 rounded-full border-2 transition-transform',
                        plasmaColor === value
                          ? 'border-white scale-110'
                          : 'border-transparent hover:scale-105'
                      )}
                      style={{ backgroundColor: value }}
                      title={label}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-abyss-900/30 rounded-2xl p-12 border border-abyss-800">
            <svg width="100%" height="200" className="overflow-visible">
              {/* Horizontal */}
              <PlasmaLine
                key={`h-${plasmaColor}-${pulseSpeed}-${glowIntensity}-${strokeWidth}`}
                start={{ x: 50, y: 50 }}
                end={{ x: 750, y: 50 }}
                plasmaColor={plasmaColor}
                strokeWidth={strokeWidth}
                duration={pulseSpeed}
                glowIntensity={glowIntensity}
              />

              {/* Diagonal */}
              <PlasmaLine
                key={`d-${plasmaColor}-${pulseSpeed}-${glowIntensity}-${strokeWidth}`}
                start={{ x: 50, y: 150 }}
                end={{ x: 750, y: 100 }}
                plasmaColor={plasmaColor}
                strokeWidth={strokeWidth}
                duration={pulseSpeed}
                glowIntensity={glowIntensity}
              />

              {/* Curved */}
              <PlasmaLine
                key={`c-${plasmaColor}-${pulseSpeed}-${glowIntensity}-${strokeWidth}`}
                start={{ x: 50, y: 180 }}
                end={{ x: 750, y: 180 }}
                controlPoints={[
                  { x: 250, y: 100 },
                  { x: 550, y: 250 },
                ]}
                plasmaColor={plasmaColor}
                strokeWidth={strokeWidth}
                duration={pulseSpeed * 1.2}
                glowIntensity={glowIntensity}
              />
            </svg>
          </div>
        </div>
      </div>
    )
  },
}

export const VelocityReactive: Story = {
  name: 'Velocity Reactive',
  render: () => (
    <div className="min-h-screen bg-abyss-950 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Velocity-Reactive Plasma</h1>
        <p className="text-abyss-400 mb-4">
          Speed matters! Fast swipe = quick pulse. Slow hover = gentle ripple both ways.
        </p>
        <div className="flex gap-8 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400" />
            <span className="text-abyss-500">Fast → Direction pulse</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-fuchsia-400" />
            <span className="text-abyss-500">Slow → Ripple both ways</span>
          </div>
        </div>
      </div>

      <svg width="800" height="400" className="overflow-visible">
        {/* Horizontal lines */}
        <VelocityPlasmaLine
          start={{ x: 50, y: 80 }}
          end={{ x: 750, y: 80 }}
          plasmaColor="#00FFFF"
          strokeWidth={3}
          glowIntensity={15}
        />
        <VelocityPlasmaLine
          start={{ x: 50, y: 180 }}
          end={{ x: 750, y: 180 }}
          plasmaColor="#FF00FF"
          strokeWidth={3}
          glowIntensity={15}
        />
        <VelocityPlasmaLine
          start={{ x: 50, y: 280 }}
          end={{ x: 750, y: 280 }}
          plasmaColor="#00FF88"
          strokeWidth={3}
          glowIntensity={15}
        />

        {/* Diagonal */}
        <VelocityPlasmaLine
          start={{ x: 100, y: 350 }}
          end={{ x: 700, y: 320 }}
          plasmaColor="#FFD700"
          strokeWidth={2}
          glowIntensity={12}
        />
      </svg>

      <div className="mt-8 bg-abyss-900/50 rounded-lg p-4 border border-abyss-800 max-w-lg">
        <p className="text-abyss-400 text-sm text-center">
          <strong className="text-white">Try it:</strong> Swipe quickly across a line vs. slowly
          hovering over it. Watch how the plasma responds to your speed!
        </p>
      </div>
    </div>
  ),
}

export const VelocityNetwork: Story = {
  name: 'Velocity Network',
  render: () => (
    <div className="min-h-screen bg-abyss-950 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Interactive Neural Network</h1>
        <p className="text-abyss-400">Velocity-reactive connections between nodes</p>
      </div>

      <svg width="900" height="500" className="overflow-visible">
        {/* Layer 1 to Layer 2 */}
        <VelocityPlasmaLine start={{ x: 150, y: 100 }} end={{ x: 450, y: 150 }} plasmaColor="#00FFFF" />
        <VelocityPlasmaLine start={{ x: 150, y: 100 }} end={{ x: 450, y: 250 }} plasmaColor="#00FFFF" />
        <VelocityPlasmaLine start={{ x: 150, y: 100 }} end={{ x: 450, y: 350 }} plasmaColor="#00FFFF" />

        <VelocityPlasmaLine start={{ x: 150, y: 250 }} end={{ x: 450, y: 150 }} plasmaColor="#00FFFF" />
        <VelocityPlasmaLine start={{ x: 150, y: 250 }} end={{ x: 450, y: 250 }} plasmaColor="#00FFFF" />
        <VelocityPlasmaLine start={{ x: 150, y: 250 }} end={{ x: 450, y: 350 }} plasmaColor="#00FFFF" />

        <VelocityPlasmaLine start={{ x: 150, y: 400 }} end={{ x: 450, y: 150 }} plasmaColor="#00FFFF" />
        <VelocityPlasmaLine start={{ x: 150, y: 400 }} end={{ x: 450, y: 250 }} plasmaColor="#00FFFF" />
        <VelocityPlasmaLine start={{ x: 150, y: 400 }} end={{ x: 450, y: 350 }} plasmaColor="#00FFFF" />

        {/* Layer 2 to Layer 3 */}
        <VelocityPlasmaLine start={{ x: 450, y: 150 }} end={{ x: 750, y: 200 }} plasmaColor="#FF00FF" />
        <VelocityPlasmaLine start={{ x: 450, y: 150 }} end={{ x: 750, y: 300 }} plasmaColor="#FF00FF" />

        <VelocityPlasmaLine start={{ x: 450, y: 250 }} end={{ x: 750, y: 200 }} plasmaColor="#FF00FF" />
        <VelocityPlasmaLine start={{ x: 450, y: 250 }} end={{ x: 750, y: 300 }} plasmaColor="#FF00FF" />

        <VelocityPlasmaLine start={{ x: 450, y: 350 }} end={{ x: 750, y: 200 }} plasmaColor="#FF00FF" />
        <VelocityPlasmaLine start={{ x: 450, y: 350 }} end={{ x: 750, y: 300 }} plasmaColor="#FF00FF" />

        {/* Nodes - Layer 1 */}
        <Node x={150} y={100} color="#00FFFF" size={10} />
        <Node x={150} y={250} color="#00FFFF" size={10} />
        <Node x={150} y={400} color="#00FFFF" size={10} />

        {/* Nodes - Layer 2 */}
        <Node x={450} y={150} color="#FF00FF" size={10} />
        <Node x={450} y={250} color="#FF00FF" size={10} />
        <Node x={450} y={350} color="#FF00FF" size={10} />

        {/* Nodes - Layer 3 */}
        <Node x={750} y={200} color="#00FF88" size={12} />
        <Node x={750} y={300} color="#00FF88" size={12} />

        {/* Labels */}
        <text x={150} y={460} textAnchor="middle" fill="#6B7280" fontSize={14}>Input</text>
        <text x={450} y={420} textAnchor="middle" fill="#6B7280" fontSize={14}>Hidden</text>
        <text x={750} y={370} textAnchor="middle" fill="#6B7280" fontSize={14}>Output</text>
      </svg>
    </div>
  ),
}

export const LivingPlasma: Story = {
  name: 'Living Plasma (Fluid + Impulse)',
  render: () => (
    <div className="min-h-screen bg-abyss-950 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Living Plasma</h1>
        <p className="text-abyss-400 mb-6">
          Move slowly: plasma follows you like a living thing, breathing gently.
          <br />
          Swipe fast: plasma shoots as an energy impulse.
        </p>
        <div className="flex gap-8 justify-center text-sm mb-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐌</span>
            <span className="text-abyss-400">Slow = Fluid, breathing glow follows you</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-abyss-400">Fast = Sharp impulse burst</span>
          </div>
        </div>
      </div>

      <svg width="900" height="350" className="overflow-visible">
        {/* Main demo lines */}
        <LivingPlasmaLine
          start={{ x: 50, y: 80 }}
          end={{ x: 850, y: 80 }}
          plasmaColor="#00FFFF"
          strokeWidth={3}
          glowIntensity={15}
        />
        <LivingPlasmaLine
          start={{ x: 50, y: 175 }}
          end={{ x: 850, y: 175 }}
          plasmaColor="#FF00FF"
          strokeWidth={3}
          glowIntensity={15}
        />
        <LivingPlasmaLine
          start={{ x: 50, y: 270 }}
          end={{ x: 850, y: 270 }}
          plasmaColor="#00FF88"
          strokeWidth={3}
          glowIntensity={15}
        />
      </svg>

      <div className="mt-10 bg-abyss-900/50 rounded-lg p-5 border border-abyss-800 max-w-2xl text-center">
        <p className="text-abyss-300 text-sm">
          <strong className="text-white">The difference:</strong> Slow hovering creates a{' '}
          <span className="text-cyan-400">breathing, living presence</span> that follows your mouse.
          Fast swiping triggers a{' '}
          <span className="text-fuchsia-400">sharp directional impulse</span>.
        </p>
      </div>
    </div>
  ),
}

export const LivingCircuit: Story = {
  name: 'Living Circuit Board',
  render: () => (
    <div className="min-h-screen bg-abyss-950 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-cyan-950/20 via-abyss-950 to-abyss-950" />

      {/* Header */}
      <div className="relative z-10 text-center pt-12">
        <h1 className="text-3xl font-bold text-white mb-2">Living Circuit</h1>
        <p className="text-abyss-400">Each line responds to your presence</p>
      </div>

      {/* Circuit SVG */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 700"
        className="absolute inset-0 mt-24"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Horizontal lines */}
        <LivingPlasmaLine start={{ x: 100, y: 100 }} end={{ x: 500, y: 100 }} plasmaColor="#00FFFF" strokeWidth={2} />
        <LivingPlasmaLine start={{ x: 550, y: 100 }} end={{ x: 1100, y: 100 }} plasmaColor="#00FFFF" strokeWidth={2} />
        
        <LivingPlasmaLine start={{ x: 100, y: 250 }} end={{ x: 400, y: 250 }} plasmaColor="#FF00FF" strokeWidth={2} />
        <LivingPlasmaLine start={{ x: 450, y: 250 }} end={{ x: 750, y: 250 }} plasmaColor="#FF00FF" strokeWidth={2} />
        <LivingPlasmaLine start={{ x: 800, y: 250 }} end={{ x: 1100, y: 250 }} plasmaColor="#FF00FF" strokeWidth={2} />
        
        <LivingPlasmaLine start={{ x: 100, y: 400 }} end={{ x: 600, y: 400 }} plasmaColor="#00FF88" strokeWidth={2} />
        <LivingPlasmaLine start={{ x: 650, y: 400 }} end={{ x: 1100, y: 400 }} plasmaColor="#00FF88" strokeWidth={2} />
        
        <LivingPlasmaLine start={{ x: 100, y: 550 }} end={{ x: 350, y: 550 }} plasmaColor="#FFD700" strokeWidth={2} />
        <LivingPlasmaLine start={{ x: 400, y: 550 }} end={{ x: 800, y: 550 }} plasmaColor="#FFD700" strokeWidth={2} />
        <LivingPlasmaLine start={{ x: 850, y: 550 }} end={{ x: 1100, y: 550 }} plasmaColor="#FFD700" strokeWidth={2} />

        {/* Vertical connectors */}
        <LivingPlasmaLine start={{ x: 300, y: 100 }} end={{ x: 300, y: 250 }} plasmaColor="#00FFFF" strokeWidth={1.5} />
        <LivingPlasmaLine start={{ x: 600, y: 250 }} end={{ x: 600, y: 400 }} plasmaColor="#FF00FF" strokeWidth={1.5} />
        <LivingPlasmaLine start={{ x: 900, y: 100 }} end={{ x: 900, y: 400 }} plasmaColor="#00FF88" strokeWidth={1.5} />
        <LivingPlasmaLine start={{ x: 200, y: 400 }} end={{ x: 200, y: 550 }} plasmaColor="#FFD700" strokeWidth={1.5} />
        <LivingPlasmaLine start={{ x: 1000, y: 250 }} end={{ x: 1000, y: 550 }} plasmaColor="#8B5CF6" strokeWidth={1.5} />

        {/* Diagonal accents */}
        <LivingPlasmaLine start={{ x: 500, y: 100 }} end={{ x: 550, y: 250 }} plasmaColor="#FF6B6B" strokeWidth={1.5} />
        <LivingPlasmaLine start={{ x: 750, y: 250 }} end={{ x: 800, y: 400 }} plasmaColor="#FF6B6B" strokeWidth={1.5} />

        {/* Nodes at intersections */}
        <Node x={300} y={100} color="#00FFFF" size={6} />
        <Node x={500} y={100} color="#00FFFF" size={6} />
        <Node x={550} y={100} color="#00FFFF" size={6} />
        <Node x={900} y={100} color="#00FFFF" size={6} />
        
        <Node x={300} y={250} color="#FF00FF" size={6} />
        <Node x={550} y={250} color="#FF00FF" size={6} />
        <Node x={600} y={250} color="#FF00FF" size={6} />
        <Node x={750} y={250} color="#FF00FF" size={6} />
        <Node x={900} y={250} color="#FF00FF" size={6} />
        <Node x={1000} y={250} color="#FF00FF" size={6} />
        
        <Node x={200} y={400} color="#00FF88" size={6} />
        <Node x={600} y={400} color="#00FF88" size={6} />
        <Node x={800} y={400} color="#00FF88" size={6} />
        <Node x={900} y={400} color="#00FF88" size={6} />
        
        <Node x={200} y={550} color="#FFD700" size={6} />
        <Node x={1000} y={550} color="#FFD700" size={6} />
      </svg>
    </div>
  ),
}
