import { ReactNode, useState } from 'react'
import { motion } from 'motion/react'
import { GLASS_GRADIENTS } from '../../constants/designTokens'

// =============================================================================
// CONFIGURATION
// =============================================================================

// Glass gradients from design system
const GLASS_GRADIENT_DARK = GLASS_GRADIENTS.teal
const GLASS_GLOW_GRADIENT_DARK = GLASS_GRADIENTS.tealGlow
const _GLASS_GRADIENT_LIGHT = GLASS_GRADIENTS.white
const _GLASS_GLOW_GRADIENT_LIGHT = GLASS_GRADIENTS.whiteGlow

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
 * Wrapper component that adds static glass border effect to inputs on focus.
 */
export function GlassInputWrapper({ children }: GlassInputWrapperProps) {
  const [isFocused, setIsFocused] = useState(false)

  // Static centered position for the gradient
  const staticBackgroundPosition = '50% 0'

  return (
    <div
      className="relative w-full rounded-sm"
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={() => setIsFocused(false)}
    >
      {/* Glass border - static */}
      <motion.div
        className="absolute inset-[-2px] rounded-sm pointer-events-none"
        style={{
          padding: '2px',
          background: GLASS_GRADIENT,
          backgroundSize: '200% 100%',
          backgroundPosition: staticBackgroundPosition,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isFocused ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Glow effect - static */}
      <motion.div
        className="absolute inset-[-4px] rounded-md pointer-events-none"
        style={{
          background: GLASS_GLOW_GRADIENT,
          backgroundSize: '200% 100%',
          backgroundPosition: staticBackgroundPosition,
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
 * Wrapper component that adds static glass border effect to buttons on hover.
 * When isActive is true, the effect is always visible.
 */
export function GlassButtonWrapper({ children, className = '', isActive = false, colorMode: _colorMode = 'dark' }: GlassButtonWrapperProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Show effect when hovered OR when active
  const showEffect = isHovered || isActive

  // Always use teal glass effect regardless of background (brand color)
  const glassGradient = GLASS_GRADIENT_DARK
  const glowGradient = GLASS_GLOW_GRADIENT_DARK

  // Determine border radius based on className
  // Design system: rounded-md = 12px for buttons
  const isNavItem = className.includes('nav-item')
  const borderRadius = '12px' // rounded-md from design system
  const innerRadius = '11px'
  const glowRadius = '10px'
  const borderInset = '1px'
  const glowInset = '2px'

  // Subtle settings for nav items
  const borderOpacity = isNavItem ? 0.6 : 1
  const glowOpacity = isNavItem ? 0.4 : 1
  const glowBlur = isNavItem ? '4px' : '8px'
  const borderWidth = isNavItem ? '1px' : '2px'

  // Static centered position for the gradient
  const staticBackgroundPosition = '50% 0'

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
        {/* Inner glass border - static */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            inset: borderInset,
            borderRadius: innerRadius,
            border: `${borderWidth} solid transparent`,
            background: `${glassGradient} border-box`,
            backgroundSize: '200% 100%',
            backgroundPosition: staticBackgroundPosition,
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

        {/* Inner glow effect - static */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            inset: glowInset,
            borderRadius: glowRadius,
            background: glowGradient,
            backgroundSize: '200% 100%',
            backgroundPosition: staticBackgroundPosition,
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
