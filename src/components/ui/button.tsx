import * as React from "react"
import { useState, useEffect } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, useMotionValue, useTransform, animate } from "motion/react"

import { cn } from "../../lib/utils"
import { GLASS_GRADIENTS, Z_INDEX } from "../../constants/designTokens"

// =============================================================================
// GLASS EFFECT CONFIGURATION
// =============================================================================

const GLASS_GRADIENT = GLASS_GRADIENTS.teal
const GLASS_GLOW_GRADIENT = GLASS_GRADIENTS.tealGlow
const ANIMATION_DURATION = 1.5

// =============================================================================
// BUTTON VARIANTS
// =============================================================================

const buttonVariants = cva(
  "flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium font-sans transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-accent/30 focus-visible:border-accent",
  {
    variants: {
      variant: {
        // Primary - Dark background (brand primary)
        default:
          "bg-inverse-bg text-inverse shadow-sm hover:bg-inverse-bg/90",
        // Destructive - Error/danger state (uses stronger red for better contrast)
        destructive:
          "bg-error-strong text-inverse shadow-sm hover:bg-error-strong/90 focus-visible:ring-error/30",
        // Outline - Bordered variant
        outline:
          "border border-default bg-surface text-primary shadow-sm hover:bg-page",
        // Secondary - Light background
        secondary:
          "bg-muted-bg text-secondary shadow-sm hover:bg-muted-bg/80",
        // Ghost - Transparent until hover
        ghost:
          "text-primary hover:bg-page",
        // Link - Text only
        link: "text-accent underline-offset-4 hover:underline",
        // Contact - Specific CTA button
        contact:
          "h-10 bg-inverse-bg text-inverse hover:bg-inverse-bg/90 px-6 py-2 font-medium",
        // Accent - Teal/brand secondary
        accent:
          "bg-accent-strong text-inverse shadow-sm hover:bg-accent-strong/90",
      },
      size: {
        default: "h-12 md:h-10 px-6 py-3 md:py-2 has-[>svg]:px-4",
        sm: "h-11 md:h-9 px-4 py-2 has-[>svg]:px-3",
        lg: "h-14 md:h-12 px-8 py-3 has-[>svg]:px-6",
        icon: "size-12 md:size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// =============================================================================
// BUTTON COMPONENT
// =============================================================================

interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /** Disable the electric hover effect */
  noEffect?: boolean
  /** Keep the electric effect always active */
  effectActive?: boolean
  /** Make button full width */
  fullWidth?: boolean
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  noEffect = false,
  effectActive = false,
  fullWidth = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  const [isHovered, setIsHovered] = useState(false)

  // Variants that should not have the effect
  const skipEffect = variant === 'link' || variant === 'ghost' || noEffect

  // Show effect when hovered OR when effectActive is true
  const showEffect = !skipEffect && (isHovered || effectActive)

  // Animation for glass border
  const positionX = useMotionValue(200)
  const backgroundPosition = useTransform(positionX, (x) => `${x}% 0`)

  useEffect(() => {
    if (effectActive && !isHovered) {
      // Static centered position for always-active state
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
  }, [showEffect, effectActive, isHovered, positionX])

  // For link and ghost variants, or when noEffect is true, render without wrapper
  if (skipEffect) {
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }

  const borderRadius = '12px'
  const innerRadius = '11px'
  const glowRadius = '10px'

  // Check if button should be full width (explicit prop takes precedence)
  const isFullWidth = fullWidth || className?.includes('w-full')

  return (
    <div
      className={cn("relative", isFullWidth ? "flex" : "inline-flex")}
      style={{
        borderRadius,
        isolation: 'isolate',
        width: isFullWidth ? '100%' : 'fit-content'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow container */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ borderRadius }}
      >
        {/* Inner glass border */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            inset: '1px',
            borderRadius: innerRadius,
            border: '2px solid transparent',
            background: `${GLASS_GRADIENT} border-box`,
            backgroundSize: '200% 100%',
            backgroundPosition,
            mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            zIndex: Z_INDEX.dropdown,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: showEffect ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />

        {/* Inner glow effect */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            inset: '2px',
            borderRadius: glowRadius,
            background: GLASS_GLOW_GRADIENT,
            backgroundSize: '200% 100%',
            backgroundPosition,
            filter: 'blur(8px)',
            zIndex: Z_INDEX.dropdown,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: showEffect ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Button content */}
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }), "relative z-[1]")}
        style={{ borderRadius, width: isFullWidth ? '100%' : undefined }}
        {...props}
      />
    </div>
  )
}

export { Button, buttonVariants }
