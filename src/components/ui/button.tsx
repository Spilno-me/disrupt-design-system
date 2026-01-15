import * as React from "react"
import { useState, useEffect } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, useMotionValue, useTransform, animate } from "motion/react"

import { cn } from "../../lib/utils"
import { GLASS_GRADIENTS, Z_INDEX } from "../../constants/designTokens"

// =============================================================================
// CONSTANTS
// =============================================================================

const ANIMATION_DURATION_SECONDS = 1.5
const BORDER_RADIUS = '12px'
const INNER_RADIUS = '11px'
const GLOW_RADIUS = '10px'

/** Variants that skip glass effect */
const SKIP_EFFECT_VARIANTS = new Set(['link', 'ghost', 'accent-soft'])

/** CSS mask for border-only gradient effect (white = show through) */
const GLASS_MASK = 'linear-gradient(white 0 0) padding-box, linear-gradient(white 0 0)'

/** Variant-specific glass gradients for hover effect */
const VARIANT_GRADIENTS = {
  default: { gradient: GLASS_GRADIENTS.teal, glow: GLASS_GRADIENTS.tealGlow },
  destructive: { gradient: GLASS_GRADIENTS.red, glow: GLASS_GRADIENTS.redGlow },
  outline: { gradient: GLASS_GRADIENTS.teal, glow: GLASS_GRADIENTS.tealGlow },
  secondary: { gradient: GLASS_GRADIENTS.teal, glow: GLASS_GRADIENTS.tealGlow },
  ghost: { gradient: GLASS_GRADIENTS.teal, glow: GLASS_GRADIENTS.tealGlow },
  link: { gradient: GLASS_GRADIENTS.teal, glow: GLASS_GRADIENTS.tealGlow },
  contact: { gradient: GLASS_GRADIENTS.teal, glow: GLASS_GRADIENTS.tealGlow },
  accent: { gradient: GLASS_GRADIENTS.teal, glow: GLASS_GRADIENTS.tealGlow },
  'accent-soft': { gradient: GLASS_GRADIENTS.teal, glow: GLASS_GRADIENTS.tealGlow },
} as const

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
          "bg-error-strong text-on-status shadow-sm hover:bg-error-strong/90 focus-visible:ring-error/30",
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
        // Accent - Teal/brand secondary (solid)
        accent:
          "bg-accent-strong text-inverse shadow-sm hover:bg-accent-strong/90",
        // Accent Soft - Tinted accent with transparency (for quick actions, highlights)
        "accent-soft":
          "bg-accent/50 text-accent-strong border border-accent/60 hover:bg-accent/90 dark:bg-accent/50 dark:border-accent/60 dark:text-primary dark:hover:bg-accent/90",
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
  /** Enable beacon/pulse effect to draw attention (default: true for destructive variant) */
  beacon?: boolean
}

/**
 * Beacon pulse colors per variant.
 * Uses rgba with specific alpha values for pulse animation keyframes.
 * Cannot use ALIAS tokens as they don't support dynamic alpha.
 */
/* eslint-disable no-restricted-syntax -- Beacon animation requires rgba for pulse effect */
const BEACON_COLORS = {
  default: { color: 'rgba(45, 49, 66, 0.5)', fade: 'rgba(45, 49, 66, 0)' },       // ABYSS[700]
  destructive: { color: 'rgba(220, 38, 38, 0.5)', fade: 'rgba(220, 38, 38, 0)' }, // EMBER[600]
  outline: { color: 'rgba(8, 164, 189, 0.5)', fade: 'rgba(8, 164, 189, 0)' },     // LAGOON[500]
  secondary: { color: 'rgba(94, 79, 126, 0.5)', fade: 'rgba(94, 79, 126, 0)' },   // VELVET[500]
  ghost: { color: 'rgba(8, 164, 189, 0.5)', fade: 'rgba(8, 164, 189, 0)' },       // LAGOON[500]
  link: { color: 'rgba(8, 164, 189, 0.5)', fade: 'rgba(8, 164, 189, 0)' },        // LAGOON[500]
  contact: { color: 'rgba(45, 49, 66, 0.5)', fade: 'rgba(45, 49, 66, 0)' },       // ABYSS[700]
  accent: { color: 'rgba(8, 164, 189, 0.5)', fade: 'rgba(8, 164, 189, 0)' },      // LAGOON[500]
} as const
/* eslint-enable no-restricted-syntax */

type ButtonVariant = keyof typeof VARIANT_GRADIENTS

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Extracts margin classes from className for wrapper application.
 * Handles: m-4, mx-auto, -mt-2, md:ml-4, m-[24px]
 * Does NOT extract: space-*, gap-* (these apply to children)
 */
function extractMarginClasses(className?: string): {
  marginClasses: string;
  otherClasses: string;
} {
  if (!className) return { marginClasses: '', otherClasses: '' };

  // Comprehensive pattern for all margin variants:
  // - Simple: m-4, mx-2, -ml-4, m-auto
  // - Responsive: sm:m-4, md:ml-4, lg:-mx-2
  // - Arbitrary: m-[24px], mt-[var(--spacing)]
  const marginPattern = /^(sm:|md:|lg:|xl:|2xl:)?-?m[lrtbxy]?-(\d+|auto|px|\[[\w()%-]+\])$/;

  const marginClasses: string[] = [];
  const otherClasses: string[] = [];

  for (const cls of className.split(/\s+/).filter(Boolean)) {
    if (marginPattern.test(cls)) {
      marginClasses.push(cls);
    } else {
      otherClasses.push(cls);
    }
  }

  return {
    marginClasses: marginClasses.join(' '),
    otherClasses: otherClasses.join(' '),
  };
}

// =============================================================================
// HOOKS
// =============================================================================

/** Manages glass border animation state and position */
function useGlassAnimation(isHovered: boolean, effectActive: boolean) {
  const positionX = useMotionValue(200)
  const backgroundPosition = useTransform(positionX, (x) => `${x}% 0`)
  const isAnimating = isHovered || effectActive

  useEffect(() => {
    if (effectActive && !isHovered) {
      positionX.set(50)
      return
    }
    if (isAnimating) {
      positionX.set(200)
      const animation = animate(positionX, -200, {
        duration: ANIMATION_DURATION_SECONDS,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop',
      })
      return () => animation.stop()
    }
  }, [isAnimating, effectActive, isHovered, positionX])

  return { backgroundPosition, isAnimating }
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface GlassEffectProps {
  isVisible: boolean
  backgroundPosition: ReturnType<typeof useTransform<number, string>>
  gradient: string
  glow: string
}

/** Animated glass border effect on hover */
function GlassEffect({ isVisible, backgroundPosition, gradient, glow }: GlassEffectProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ borderRadius: BORDER_RADIUS }}>
      <motion.div
        className="absolute pointer-events-none"
        style={{
          inset: '1px',
          borderRadius: INNER_RADIUS,
          border: '2px solid transparent',
          background: `${gradient} border-box`,
          backgroundSize: '200% 100%',
          backgroundPosition,
          mask: GLASS_MASK,
          maskComposite: 'exclude',
          WebkitMask: GLASS_MASK,
          WebkitMaskComposite: 'xor',
          zIndex: Z_INDEX.dropdown,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="absolute pointer-events-none"
        style={{
          inset: '2px',
          borderRadius: GLOW_RADIUS,
          background: glow,
          backgroundSize: '200% 100%',
          backgroundPosition,
          filter: 'blur(8px)',
          clipPath: `inset(0 round ${GLOW_RADIUS})`,
          zIndex: Z_INDEX.dropdown,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  )
}

/** Pulsing beacon effect to draw attention */
function BeaconEffect({ variant }: { variant: ButtonVariant }) {
  const { color, fade } = BEACON_COLORS[variant]
  return (
    <span
      className="absolute inset-0 animate-beacon pointer-events-none"
      style={{
        '--beacon-color': color,
        '--beacon-color-fade': fade,
        borderRadius: BORDER_RADIUS,
      } as React.CSSProperties}
      aria-hidden="true"
    />
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Button - Primary interactive element for user actions.
 * Features glass hover effect and optional beacon pulse.
 * @component ATOM
 */
function Button({
  className,
  variant = 'default',
  size,
  asChild = false,
  noEffect = false,
  effectActive = false,
  fullWidth = false,
  beacon,
  ...props
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const Comp = asChild ? Slot : "button"

  const variantKey = variant as ButtonVariant
  const shouldSkipEffect = SKIP_EFFECT_VARIANTS.has(variantKey) || noEffect
  const showBeacon = beacon ?? (variant === 'destructive')
  const isFullWidth = fullWidth || className?.includes('w-full')

  // Extract margin classes to apply to wrapper (fixes effects width mismatch)
  const { marginClasses, otherClasses } = extractMarginClasses(className)

  const { backgroundPosition, isAnimating } = useGlassAnimation(isHovered, effectActive)
  const { gradient, glow } = VARIANT_GRADIENTS[variantKey]

  // Simple render for variants without glass effect
  if (shouldSkipEffect) {
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }

  return (
    <div
      className={cn("relative", isFullWidth ? "flex" : "inline-flex", marginClasses)}
      style={{ borderRadius: BORDER_RADIUS, isolation: 'isolate', width: isFullWidth ? '100%' : 'fit-content' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showBeacon && <BeaconEffect variant={variantKey} />}
      <GlassEffect isVisible={isAnimating} backgroundPosition={backgroundPosition} gradient={gradient} glow={glow} />
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size }), otherClasses, "relative z-[1]")}
        style={{ borderRadius: BORDER_RADIUS, width: isFullWidth ? '100%' : undefined }}
        {...props}
      />
    </div>
  )
}

export { Button, buttonVariants }
