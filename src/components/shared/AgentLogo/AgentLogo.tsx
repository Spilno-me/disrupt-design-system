"use client"

/* eslint-disable no-restricted-syntax */
// AgentLogo uses specific brand colors (PRIMITIVES.cream) for logo variants
// that are not available in ALIAS tokens - this is intentional for brand consistency

import { motion } from "motion/react"
import {
  DEEP_CURRENT,
  ABYSS,
  CORAL,
  PRIMITIVES,
} from "@/constants/designTokens"

// =============================================================================
// AGENT LOGO COMPONENT (Animated Copilot Logo)
// =============================================================================

// Position configurations for the 3 shapes
// Position 1: Large (top-right), Position 2: Medium (bottom), Position 3: Small (left)
const logoPositions = {
  large: { x: 52, y: 0, width: 81, height: 81, rx: 11 },
  medium: { x: 46, y: 127, width: 41, height: 41, rx: 4 },
  small: { x: 0, y: 87, width: 23, height: 23, rx: 3 },
}

// Color configurations for dark and light backgrounds
const logoColors = {
  // For dark backgrounds (default)
  dark: {
    large: DEEP_CURRENT[500], // Deep Current - biggest
    medium: PRIMITIVES.cream, // Tide Foam - medium
    small: CORAL[500],        // Coral red - smallest
  },
  // For light backgrounds
  light: {
    large: DEEP_CURRENT[500], // Deep Current - biggest
    medium: ABYSS[500],       // Abyss - medium
    small: CORAL[500],        // Coral red - smallest
  },
}

export type LogoState = "idle" | "thinking" | "planning" | "executing" | "listening" | "complete"
export type LogoVariant = "dark" | "light"

export interface AgentLogoProps {
  className?: string
  state?: LogoState
  /** Use "dark" for dark backgrounds (default), "light" for light backgrounds */
  variant?: LogoVariant
}

export function AgentLogo({ className, state = "idle", variant = "dark" }: AgentLogoProps) {
  const colors = logoColors[variant]
  // Animation configurations per state
  const getAnimationConfig = () => {
    switch (state) {
      case "thinking":
        // Fast pulsing - shapes breathe/pulse in place
        return {
          type: "pulse" as const,
          duration: 1.2,
        }
      case "planning":
        // Sequential rotation - shapes swap positions methodically
        return {
          type: "rotate" as const,
          duration: 3.6,
          pauseDuration: 0.8,
        }
      case "executing":
        // Fast rotation - shapes move quickly between positions
        return {
          type: "rotate" as const,
          duration: 1.8,
          pauseDuration: 0.3,
        }
      case "listening":
        // Gentle floating/bobbing
        return {
          type: "float" as const,
          duration: 2,
        }
      case "complete":
        // Quick settle into place with bounce
        return {
          type: "settle" as const,
          duration: 0.6,
        }
      case "idle":
      default:
        // Slow, relaxed rotation with long pauses
        return {
          type: "rotate" as const,
          duration: 5.4,
          pauseDuration: 1.2,
        }
    }
  }

  const config = getAnimationConfig()

  // Complete - snap back to logo with bounce
  if (state === "complete") {
    const centerX = 66.5
    const centerY = 84

    return (
      <svg
        viewBox="-15 -15 163 198"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Large rectangle - snaps from center to position */}
        <motion.rect
          fill={colors.large}
          initial={{
            x: centerX - 20,
            y: centerY - 20,
            width: 40,
            height: 40,
            rx: 20,
          }}
          animate={{
            x: logoPositions.large.x,
            y: logoPositions.large.y,
            width: logoPositions.large.width,
            height: logoPositions.large.height,
            rx: logoPositions.large.rx,
          }}
          transition={{
            duration: 0.5,
            ease: [0.34, 1.56, 0.64, 1], // bounce overshoot
          }}
        />
        {/* Medium rectangle - snaps from center to position */}
        <motion.rect
          fill={colors.medium}
          initial={{
            x: centerX - 15,
            y: centerY - 15,
            width: 30,
            height: 30,
            rx: 15,
          }}
          animate={{
            x: logoPositions.medium.x,
            y: logoPositions.medium.y,
            width: logoPositions.medium.width,
            height: logoPositions.medium.height,
            rx: logoPositions.medium.rx,
          }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        />
        {/* Small rectangle - snaps from center to position */}
        <motion.rect
          fill={colors.small}
          initial={{
            x: centerX - 10,
            y: centerY - 10,
            width: 20,
            height: 20,
            rx: 10,
          }}
          animate={{
            x: logoPositions.small.x,
            y: logoPositions.small.y,
            width: logoPositions.small.width,
            height: logoPositions.small.height,
            rx: logoPositions.small.rx,
          }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        />
      </svg>
    )
  }

  // Thinking - dots orbit around center like electrons
  if (state === "thinking") {
    const centerX = 66.5
    const centerY = 84
    const orbitRadius = 35
    const dotSize = 18
    const cycleDuration = 2.5

    return (
      <svg
        viewBox="-15 -15 163 198"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Dot 1 - orbits at normal speed */}
        <motion.circle
          fill={colors.large}
          r={dotSize / 2}
          animate={{
            cx: [
              centerX + orbitRadius,
              centerX,
              centerX - orbitRadius,
              centerX,
              centerX + orbitRadius,
            ],
            cy: [
              centerY,
              centerY - orbitRadius,
              centerY,
              centerY + orbitRadius,
              centerY,
            ],
          }}
          transition={{
            duration: cycleDuration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        {/* Dot 2 - orbits offset by 120deg */}
        <motion.circle
          fill={colors.medium}
          r={dotSize / 2}
          animate={{
            cx: [
              centerX - orbitRadius * 0.5,
              centerX + orbitRadius * 0.866,
              centerX - orbitRadius * 0.5,
              centerX - orbitRadius * 0.866,
              centerX - orbitRadius * 0.5,
            ],
            cy: [
              centerY - orbitRadius * 0.866,
              centerY + orbitRadius * 0.5,
              centerY + orbitRadius * 0.866,
              centerY - orbitRadius * 0.5,
              centerY - orbitRadius * 0.866,
            ],
          }}
          transition={{
            duration: cycleDuration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        {/* Dot 3 - orbits offset by 240deg */}
        <motion.circle
          fill={colors.small}
          r={dotSize / 2}
          animate={{
            cx: [
              centerX - orbitRadius * 0.5,
              centerX - orbitRadius * 0.866,
              centerX + orbitRadius * 0.5,
              centerX + orbitRadius * 0.866,
              centerX - orbitRadius * 0.5,
            ],
            cy: [
              centerY + orbitRadius * 0.866,
              centerY - orbitRadius * 0.5,
              centerY - orbitRadius * 0.866,
              centerY + orbitRadius * 0.5,
              centerY + orbitRadius * 0.866,
            ],
          }}
          transition={{
            duration: cycleDuration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </svg>
    )
  }

  // Listening - sound wave with 3 vertical bars
  if (config.type === "float") {
    const barWidth = 16
    const barSpacing = 28
    const centerX = 66.5
    const centerY = 84
    const barPositions = [
      { x: centerX - barSpacing - barWidth / 2 },
      { x: centerX - barWidth / 2 },
      { x: centerX + barSpacing - barWidth / 2 },
    ]
    const minHeight = 20
    const maxHeight = 70

    return (
      <svg
        viewBox="-15 -15 163 198"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Bar 1 - from large rect */}
        <motion.rect
          fill={colors.large}
          initial={{
            x: logoPositions.large.x,
            y: logoPositions.large.y,
            width: logoPositions.large.width,
            height: logoPositions.large.height,
            rx: logoPositions.large.rx,
          }}
          animate={{
            x: barPositions[0].x,
            y: [centerY - minHeight / 2, centerY - maxHeight / 2, centerY - minHeight / 2],
            width: barWidth,
            height: [minHeight, maxHeight, minHeight],
            rx: barWidth / 2,
          }}
          transition={{
            x: { duration: 0.4, ease: "easeOut" },
            width: { duration: 0.4, ease: "easeOut" },
            rx: { duration: 0.4, ease: "easeOut" },
            y: { duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
            height: { duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
          }}
        />
        {/* Bar 2 - from medium rect (center, tallest) */}
        <motion.rect
          fill={colors.medium}
          initial={{
            x: logoPositions.medium.x,
            y: logoPositions.medium.y,
            width: logoPositions.medium.width,
            height: logoPositions.medium.height,
            rx: logoPositions.medium.rx,
          }}
          animate={{
            x: barPositions[1].x,
            y: [centerY - maxHeight / 2, centerY - minHeight / 2, centerY - maxHeight / 2],
            width: barWidth,
            height: [maxHeight, minHeight, maxHeight],
            rx: barWidth / 2,
          }}
          transition={{
            x: { duration: 0.4, ease: "easeOut" },
            width: { duration: 0.4, ease: "easeOut" },
            rx: { duration: 0.4, ease: "easeOut" },
            y: { duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
            height: { duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
          }}
        />
        {/* Bar 3 - from small rect */}
        <motion.rect
          fill={colors.small}
          initial={{
            x: logoPositions.small.x,
            y: logoPositions.small.y,
            width: logoPositions.small.width,
            height: logoPositions.small.height,
            rx: logoPositions.small.rx,
          }}
          animate={{
            x: barPositions[2].x,
            y: [centerY - minHeight / 2, centerY - maxHeight / 2, centerY - minHeight / 2],
            width: barWidth,
            height: [minHeight, maxHeight, minHeight],
            rx: barWidth / 2,
          }}
          transition={{
            x: { duration: 0.4, ease: "easeOut" },
            width: { duration: 0.4, ease: "easeOut" },
            rx: { duration: 0.4, ease: "easeOut" },
            y: { duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
            height: { duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
          }}
        />
      </svg>
    )
  }

  // Planning - dots on left that extend into horizontal lines like a todo list
  if (state === "planning") {
    const dotSize = 14
    const lineHeight = 14
    const leftX = 15
    const lineMaxWidth = 100
    const rowSpacing = 30
    const centerY = 84
    const rows = [
      { y: centerY - rowSpacing },
      { y: centerY },
      { y: centerY + rowSpacing },
    ]
    const cycleDuration = 3

    return (
      <svg
        viewBox="-15 -15 163 198"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Row 1 - from large rect */}
        <motion.rect
          fill={colors.large}
          initial={{
            x: logoPositions.large.x,
            y: logoPositions.large.y,
            width: logoPositions.large.width,
            height: logoPositions.large.height,
            rx: logoPositions.large.rx,
          }}
          animate={{
            x: leftX,
            y: rows[0].y - lineHeight / 2,
            width: [dotSize, lineMaxWidth, lineMaxWidth, dotSize],
            height: lineHeight,
            rx: lineHeight / 2,
          }}
          transition={{
            x: { duration: 0.4, ease: "easeOut" },
            y: { duration: 0.4, ease: "easeOut" },
            height: { duration: 0.4, ease: "easeOut" },
            rx: { duration: 0.4, ease: "easeOut" },
            width: {
              duration: cycleDuration,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.25, 0.75, 1],
              delay: 0.4,
            },
          }}
        />
        {/* Row 2 - from medium rect */}
        <motion.rect
          fill={colors.medium}
          initial={{
            x: logoPositions.medium.x,
            y: logoPositions.medium.y,
            width: logoPositions.medium.width,
            height: logoPositions.medium.height,
            rx: logoPositions.medium.rx,
          }}
          animate={{
            x: leftX,
            y: rows[1].y - lineHeight / 2,
            width: [dotSize, lineMaxWidth * 0.7, lineMaxWidth * 0.7, dotSize],
            height: lineHeight,
            rx: lineHeight / 2,
          }}
          transition={{
            x: { duration: 0.4, ease: "easeOut" },
            y: { duration: 0.4, ease: "easeOut" },
            height: { duration: 0.4, ease: "easeOut" },
            rx: { duration: 0.4, ease: "easeOut" },
            width: {
              duration: cycleDuration,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.25, 0.75, 1],
              delay: 0.7,
            },
          }}
        />
        {/* Row 3 - from small rect */}
        <motion.rect
          fill={colors.small}
          initial={{
            x: logoPositions.small.x,
            y: logoPositions.small.y,
            width: logoPositions.small.width,
            height: logoPositions.small.height,
            rx: logoPositions.small.rx,
          }}
          animate={{
            x: leftX,
            y: rows[2].y - lineHeight / 2,
            width: [dotSize, lineMaxWidth * 0.85, lineMaxWidth * 0.85, dotSize],
            height: lineHeight,
            rx: lineHeight / 2,
          }}
          transition={{
            x: { duration: 0.4, ease: "easeOut" },
            y: { duration: 0.4, ease: "easeOut" },
            height: { duration: 0.4, ease: "easeOut" },
            rx: { duration: 0.4, ease: "easeOut" },
            width: {
              duration: cycleDuration,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.25, 0.75, 1],
              delay: 1.0,
            },
          }}
        />
      </svg>
    )
  }

  // Executing - fast continuous orbit
  if (state === "executing") {
    const centerX = 66.5
    const centerY = 84
    const orbitRadius = 35
    const dotSize = 18
    const cycleDuration = 0.8  // Much faster than thinking

    return (
      <svg
        viewBox="-15 -15 163 198"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Dot 1 - orbits fast */}
        <motion.circle
          fill={colors.large}
          r={dotSize / 2}
          animate={{
            cx: [
              centerX + orbitRadius,
              centerX,
              centerX - orbitRadius,
              centerX,
              centerX + orbitRadius,
            ],
            cy: [
              centerY,
              centerY - orbitRadius,
              centerY,
              centerY + orbitRadius,
              centerY,
            ],
          }}
          transition={{
            duration: cycleDuration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        {/* Dot 2 - offset by 120deg */}
        <motion.circle
          fill={colors.medium}
          r={dotSize / 2}
          animate={{
            cx: [
              centerX - orbitRadius * 0.5,
              centerX + orbitRadius * 0.866,
              centerX - orbitRadius * 0.5,
              centerX - orbitRadius * 0.866,
              centerX - orbitRadius * 0.5,
            ],
            cy: [
              centerY - orbitRadius * 0.866,
              centerY + orbitRadius * 0.5,
              centerY + orbitRadius * 0.866,
              centerY - orbitRadius * 0.5,
              centerY - orbitRadius * 0.866,
            ],
          }}
          transition={{
            duration: cycleDuration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        {/* Dot 3 - offset by 240deg */}
        <motion.circle
          fill={colors.small}
          r={dotSize / 2}
          animate={{
            cx: [
              centerX - orbitRadius * 0.5,
              centerX - orbitRadius * 0.866,
              centerX + orbitRadius * 0.5,
              centerX + orbitRadius * 0.866,
              centerX - orbitRadius * 0.5,
            ],
            cy: [
              centerY + orbitRadius * 0.866,
              centerY - orbitRadius * 0.5,
              centerY - orbitRadius * 0.866,
              centerY + orbitRadius * 0.5,
              centerY + orbitRadius * 0.866,
            ],
          }}
          transition={{
            duration: cycleDuration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </svg>
    )
  }

  // Idle - shapes swap animation patterns each cycle for perpetual variety
  // Define 3 distinct motion patterns (offsets from base position)
  const patternA = { xOff: [0, -3, 2, 0], yOff: [0, -6, -2, 0], scale: [1, 1.02, 0.98, 1] }
  const patternB = { xOff: [0, 4, -2, 0], yOff: [0, 5, -3, 0], scale: [1, 0.95, 1.05, 1] }
  const patternC = { xOff: [0, 5, -3, 0], yOff: [0, -4, 6, 0], scale: [1, 1.1, 0.9, 1] }

  // Chain 3 patterns into one sequence (skip first keyframe of p2/p3 since it matches previous end)
  const chain = (baseX: number, baseY: number, p1: typeof patternA, p2: typeof patternA, p3: typeof patternA) => ({
    x: [...p1.xOff, ...p2.xOff.slice(1), ...p3.xOff.slice(1)].map(off => baseX + off),
    y: [...p1.yOff, ...p2.yOff.slice(1), ...p3.yOff.slice(1)].map(off => baseY + off),
    scale: [...p1.scale, ...p2.scale.slice(1), ...p3.scale.slice(1)],
  })

  // Each shape cycles through patterns in different order
  const largeAnim = chain(logoPositions.large.x, logoPositions.large.y, patternA, patternB, patternC)
  const mediumAnim = chain(logoPositions.medium.x, logoPositions.medium.y, patternB, patternC, patternA)
  const smallAnim = chain(logoPositions.small.x, logoPositions.small.y, patternC, patternA, patternB)

  const cycleDuration = 9 // 3 seconds per pattern × 3 patterns

  return (
    <svg
      viewBox="-15 -15 163 198"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <motion.rect
        width={logoPositions.large.width}
        height={logoPositions.large.height}
        rx={logoPositions.large.rx}
        fill={colors.large}
        initial={{ x: logoPositions.large.x, y: logoPositions.large.y, scale: 1 }}
        animate={largeAnim}
        transition={{ duration: cycleDuration, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center", transformBox: "fill-box" }}
      />
      <motion.rect
        width={logoPositions.medium.width}
        height={logoPositions.medium.height}
        rx={logoPositions.medium.rx}
        fill={colors.medium}
        initial={{ x: logoPositions.medium.x, y: logoPositions.medium.y, scale: 1 }}
        animate={mediumAnim}
        transition={{ duration: cycleDuration, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center", transformBox: "fill-box" }}
      />
      <motion.rect
        width={logoPositions.small.width}
        height={logoPositions.small.height}
        rx={logoPositions.small.rx}
        fill={colors.small}
        initial={{ x: logoPositions.small.x, y: logoPositions.small.y, scale: 1 }}
        animate={smallAnim}
        transition={{ duration: cycleDuration, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center", transformBox: "fill-box" }}
      />
    </svg>
  )
}

export default AgentLogo
