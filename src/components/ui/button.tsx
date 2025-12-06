import * as React from "react"
import { useState, useEffect } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, useMotionValue, useTransform, animate } from "motion/react"

import { cn } from "../../lib/utils"

// =============================================================================
// GLASS EFFECT CONFIGURATION
// =============================================================================

const GLASS_GRADIENT = `linear-gradient(
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

const GLASS_GLOW_GRADIENT = `linear-gradient(
  0deg,
  rgba(8, 164, 189, 0.9) 0%,
  rgba(61, 189, 212, 0.7) 10%,
  transparent 25%,
  transparent 75%,
  rgba(61, 189, 212, 0.7) 90%,
  rgba(8, 164, 189, 0.9) 100%
)`

const ANIMATION_DURATION = 1.5

// =============================================================================
// BUTTON VARIANTS
// =============================================================================

const buttonVariants = cva(
  "flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        contact:
          "h-10 bg-dark text-white hover:bg-dark/90 px-6 py-2 font-medium",
      },
      size: {
        default: "h-10 px-6 py-2 has-[>svg]:px-4",
        sm: "h-9 px-4 py-2 has-[>svg]:px-3",
        lg: "h-12 px-8 py-3 has-[>svg]:px-6",
        icon: "size-10",
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
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  noEffect = false,
  effectActive = false,
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

  // Check if button should be full width
  const isFullWidth = className?.includes('w-full')

  return (
    <div
      className={cn("relative inline-flex", isFullWidth ? "w-full" : "w-fit")}
      style={{ borderRadius, isolation: 'isolate' }}
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
            zIndex: 10,
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
            zIndex: 10,
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
        style={{ borderRadius }}
        {...props}
      />
    </div>
  )
}

export { Button, buttonVariants }
