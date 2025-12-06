import { ReactNode, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'motion/react'
import { useEffect } from 'react'

// =============================================================================
// CONFIGURATION
// =============================================================================

// Cyan/teal electric effect - works on both light and dark backgrounds
const ELECTRIC_GRADIENT_DARK = `linear-gradient(
  0deg,
  #00CED1 0%,
  #00ffff 5%,
  #00ffff 8%,
  transparent 12%,
  transparent 88%,
  #00ffff 92%,
  #00ffff 95%,
  #00CED1 100%
)`

const ELECTRIC_GLOW_GRADIENT_DARK = `linear-gradient(
  0deg,
  rgba(0, 206, 209, 0.6) 0%,
  rgba(0, 255, 255, 0.4) 5%,
  transparent 12%,
  transparent 88%,
  rgba(0, 255, 255, 0.4) 95%,
  rgba(0, 206, 209, 0.6) 100%
)`

// Light mode (for dark backgrounds) - white electric effect (matches white nav text)
const ELECTRIC_GRADIENT_LIGHT = `linear-gradient(
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

const ELECTRIC_GLOW_GRADIENT_LIGHT = `linear-gradient(
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

// Default gradients (dark mode - cyan)
const ELECTRIC_GRADIENT = ELECTRIC_GRADIENT_DARK
const ELECTRIC_GLOW_GRADIENT = ELECTRIC_GLOW_GRADIENT_DARK

// =============================================================================
// ELECTRIC INPUT WRAPPER
// =============================================================================

interface ElectricInputWrapperProps {
  children: ReactNode
}

/**
 * Wrapper component that adds electric border effect to inputs on focus.
 * Uses animated gradient that flows around the border like electricity.
 */
export function ElectricInputWrapper({ children }: ElectricInputWrapperProps) {
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
      className="relative w-full rounded-[6px]"
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={() => setIsFocused(false)}
    >
      {/* Electric border */}
      <motion.div
        className="absolute inset-[-2px] rounded-[8px] pointer-events-none"
        style={{
          padding: '2px',
          background: ELECTRIC_GRADIENT,
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
        className="absolute inset-[-4px] rounded-[10px] pointer-events-none"
        style={{
          background: ELECTRIC_GLOW_GRADIENT,
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
// ELECTRIC BUTTON WRAPPER
// =============================================================================

interface ElectricButtonWrapperProps {
  children: ReactNode
  className?: string
  isActive?: boolean
  /** Color mode: 'dark' for cyan effect on light bg, 'light' for white effect on dark bg */
  colorMode?: 'dark' | 'light'
}

/**
 * Wrapper component that adds electric border effect to buttons on hover.
 * Uses animated gradient that flows around the border like electricity.
 * When isActive is true, the effect is always visible.
 * colorMode controls the gradient colors based on background.
 */
export function ElectricButtonWrapper({ children, className = '', isActive = false, colorMode = 'dark' }: ElectricButtonWrapperProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Show effect when hovered OR when active
  const showEffect = isHovered || isActive

  // Always use cyan/teal electric effect regardless of background
  // The electric border should be consistently visible on both light and dark backgrounds
  const electricGradient = ELECTRIC_GRADIENT_DARK
  const glowGradient = ELECTRIC_GLOW_GRADIENT_DARK

  // Use numeric value for animation (200 to -200)
  const positionX = useMotionValue(200)
  const backgroundPosition = useTransform(positionX, (x) => `${x}% 0`)

  // Determine border radius based on className
  const isNavItem = className.includes('nav-item')
  const borderRadius = isNavItem ? '8px' : '12px'
  const innerRadius = isNavItem ? '7px' : '10px'
  const glowRadius = isNavItem ? '6px' : '8px'
  const borderInset = isNavItem ? '1px' : '2px'
  const glowInset = isNavItem ? '2px' : '4px'

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
      className={`relative inline-flex cursor-pointer ${className}`}
      style={{ borderRadius, isolation: 'isolate' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow container - clips the glow effect */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ borderRadius }}
      >
        {/* Inner electric border */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            inset: borderInset,
            borderRadius: innerRadius,
            border: '1px solid transparent',
            background: `${electricGradient} border-box`,
            backgroundSize: '200% 100%',
            backgroundPosition,
            mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            zIndex: 10,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: showEffect ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Inner glow effect */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            inset: glowInset,
            borderRadius: glowRadius,
            background: glowGradient.replace('0.3', '0.2').replace('0.5', '0.4'),
            backgroundSize: '200% 100%',
            backgroundPosition,
            filter: 'blur(4px)',
            zIndex: 10,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: showEffect ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-[1] w-full">{children}</div>
    </div>
  )
}
