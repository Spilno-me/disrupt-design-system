import { ReactNode, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'motion/react'
import { useEffect } from 'react'

// =============================================================================
// CONFIGURATION
// =============================================================================

// Teal glass effect - matches brand color (#08A4BD)
// Wider bands for more visible glass border effect
const GLASS_GRADIENT_DARK = `linear-gradient(
  0deg,
  #08A4BD 0%,
  #3DBDD4 8%,
  #5FCFDF 15%,
  transparent 25%,
  transparent 75%,
  #5FCFDF 85%,
  #3DBDD4 92%,
  #08A4BD 100%
)`

// Stronger glow effect
const GLASS_GLOW_GRADIENT_DARK = `linear-gradient(
  0deg,
  rgba(8, 164, 189, 0.9) 0%,
  rgba(61, 189, 212, 0.7) 10%,
  transparent 25%,
  transparent 75%,
  rgba(61, 189, 212, 0.7) 90%,
  rgba(8, 164, 189, 0.9) 100%
)`

// Light mode (for dark backgrounds) - white glass effect
const GLASS_GRADIENT_LIGHT = `linear-gradient(
  0deg,
  rgba(255, 255, 255, 0.9) 0%,
  rgba(255, 255, 255, 0.8) 5%,
  rgba(255, 255, 255, 1) 8%,
  transparent 12%,
  transparent 88%,
  rgba(255, 255, 255, 1) 92%,
  rgba(255, 255, 255, 0.8) 95%,
  rgba(255, 255, 255, 0.9) 100%
)`

const GLASS_GLOW_GRADIENT_LIGHT = `linear-gradient(
  0deg,
  rgba(255, 255, 255, 0.5) 0%,
  rgba(255, 255, 255, 0.3) 5%,
  transparent 12%,
  transparent 88%,
  rgba(255, 255, 255, 0.3) 95%,
  rgba(255, 255, 255, 0.5) 100%
)`

const ANIMATION_DURATION = 1.5
const ACTIVE_ANIMATION_DURATION = 4 // Slower, calming animation for active state

// Default gradients (dark mode - teal)
const GLASS_GRADIENT = GLASS_GRADIENT_DARK
const GLASS_GLOW_GRADIENT = GLASS_GLOW_GRADIENT_DARK

// =============================================================================
// GLASS INPUT WRAPPER
// =============================================================================

interface GlassInputWrapperProps {
  children: ReactNode
}

/**
 * Wrapper component that adds glass border effect to inputs on focus.
 * Uses animated gradient that flows around the border.
 */
export function GlassInputWrapper({ children }: GlassInputWrapperProps) {
  const [isFocused, setIsFocused] = useState(false)

  // Use numeric value for animation (200 to -200)
  const positionX = useMotionValue(200)
  const backgroundPosition = useTransform(positionX, (x) => `${x}% 0`)

  useEffect(() => {
    if (isFocused) {
      // Reset to start position
      positionX.set(200)
      const animation = animate(positionX, -200, {
        duration: ANIMATION_DURATION,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop',
      })
      return () => animation.stop()
    }
  }, [isFocused, positionX])

  return (
    <div
      className="relative w-full rounded-sm"
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={() => setIsFocused(false)}
    >
      {/* Glass border */}
      <motion.div
        className="absolute inset-[-2px] rounded-sm pointer-events-none"
        style={{
          padding: '2px',
          background: GLASS_GRADIENT,
          backgroundSize: '200% 100%',
          backgroundPosition,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isFocused ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Glow effect */}
      <motion.div
        className="absolute inset-[-4px] rounded-md pointer-events-none"
        style={{
          background: GLASS_GLOW_GRADIENT,
          backgroundSize: '200% 100%',
          backgroundPosition,
          filter: 'blur(6px)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isFocused ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}

// =============================================================================
// GLASS BUTTON WRAPPER
// =============================================================================

interface GlassButtonWrapperProps {
  children: ReactNode
  className?: string
  isActive?: boolean
  /** Color mode: 'dark' for teal effect on light bg, 'light' for white effect on dark bg */
  colorMode?: 'dark' | 'light'
}

/**
 * Wrapper component that adds glass border effect to buttons on hover.
 * Uses animated gradient that flows around the border.
 * When isActive is true, the effect is always visible.
 * colorMode controls the gradient colors based on background.
 */
export function GlassButtonWrapper({ children, className = '', isActive = false, colorMode = 'dark' }: GlassButtonWrapperProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Show effect when hovered OR when active
  const showEffect = isHovered || isActive

  // Always use teal glass effect regardless of background (brand color)
  const glassGradient = GLASS_GRADIENT_DARK
  const glowGradient = GLASS_GLOW_GRADIENT_DARK

  // Use numeric value for animation (200 to -200)
  const positionX = useMotionValue(200)
  const backgroundPosition = useTransform(positionX, (x) => `${x}% 0`)

  // Determine border radius based on className
  // Design system: rounded-sm = 8px for all interactive elements
  const isNavItem = className.includes('nav-item')
  const borderRadius = '8px' // rounded-sm from design system
  const innerRadius = '7px'
  const glowRadius = '6px'
  const borderInset = '1px'
  const glowInset = '2px'

  // Subtle settings for nav items
  const borderOpacity = isNavItem ? 0.6 : 1
  const glowOpacity = isNavItem ? 0.4 : 1
  const glowBlur = isNavItem ? '4px' : '8px'
  const borderWidth = isNavItem ? '1px' : '2px'

  useEffect(() => {
    if (isActive && !isHovered) {
      // Static centered position for active state (just glow, no animation)
      positionX.set(50)
    } else if (showEffect) {
      // Animate on hover
      positionX.set(200)
      const animation = animate(positionX, -200, {
        duration: ANIMATION_DURATION,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop',
      })
      return () => animation.stop()
    }
  }, [showEffect, isActive, isHovered, positionX])

  return (
    <div
      className={`relative inline-flex w-fit cursor-pointer ${className}`}
      style={{ borderRadius, isolation: 'isolate' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow container - clips the glow effect */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ borderRadius }}
      >
        {/* Inner glass border */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            inset: borderInset,
            borderRadius: innerRadius,
            border: `${borderWidth} solid transparent`,
            background: `${glassGradient} border-box`,
            backgroundSize: '200% 100%',
            backgroundPosition,
            mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            zIndex: 10,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: showEffect ? borderOpacity : 0 }}
          transition={{ duration: 0.2 }}
        />

        {/* Inner glow effect */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            inset: glowInset,
            borderRadius: glowRadius,
            background: glowGradient,
            backgroundSize: '200% 100%',
            backgroundPosition,
            filter: `blur(${glowBlur})`,
            zIndex: 10,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: showEffect ? glowOpacity : 0 }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Content - force children to match border radius */}
      <div
        className="relative z-[1] [&>*]:!rounded-sm overflow-hidden"
        style={{ borderRadius }}
      >
        {children}
      </div>
    </div>
  )
}

// =============================================================================
// BACKWARD COMPATIBILITY ALIASES
// =============================================================================

// Export old names as aliases for backward compatibility
export const ElectricInputWrapper = GlassInputWrapper
export const ElectricButtonWrapper = GlassButtonWrapper
