"use client"

import { motion } from "motion/react"
import { ALIAS } from "../../constants/designTokens"

// =============================================================================
// EXECUTING ANIMATION - Three-dot orbital loader
// =============================================================================

// Color configurations for light and dark themes using DDS tokens
const logoColorSchemes = {
  // For light backgrounds (login card with white bg-surface)
  light: {
    large: ALIAS.brand.secondary,  // Deep Current (teal)
    medium: ALIAS.brand.primary,   // Abyss (dark navy - visible on light bg)
    small: ALIAS.brand.accent,     // Coral (red)
  },
  // For dark backgrounds (future dark theme)
  dark: {
    large: ALIAS.brand.secondary,  // Deep Current (teal)
    medium: ALIAS.background.page, // Cream (visible on dark bg)
    small: ALIAS.brand.accent,     // Coral (red)
  },
}

export type ColorVariant = "light" | "dark"

export interface ExecutingAnimationProps {
  className?: string
  variant?: ColorVariant
}

/**
 * ExecutingAnimation - Three-dot orbital loading animation
 *
 * Used in loading states to show activity. Features three colored dots
 * orbiting in a circular pattern with offset phases.
 *
 * @param className - Optional CSS classes for sizing and positioning
 * @param variant - Color scheme: "light" for light backgrounds, "dark" for dark backgrounds
 *
 * @example
 * ```tsx
 * <ExecutingAnimation className="w-32 h-32" variant="light" />
 * ```
 */
export function ExecutingAnimation({ className, variant = "light" }: ExecutingAnimationProps) {
  const colors = logoColorSchemes[variant]
  const centerX = 66.5
  const centerY = 84
  const orbitRadius = 35
  const dotSize = 18
  const cycleDuration = 0.8

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
        cx={centerX + orbitRadius}
        cy={centerY}
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
      {/* Dot 2 - offset by 120° */}
      <motion.circle
        fill={colors.medium}
        r={dotSize / 2}
        cx={centerX - orbitRadius * 0.5}
        cy={centerY - orbitRadius * 0.866}
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
      {/* Dot 3 - offset by 240° */}
      <motion.circle
        fill={colors.small}
        r={dotSize / 2}
        cx={centerX - orbitRadius * 0.5}
        cy={centerY + orbitRadius * 0.866}
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
