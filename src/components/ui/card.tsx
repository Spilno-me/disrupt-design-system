/**
 * Card - Website pricing card component (FROZEN)
 *
 * ⚠️ FROZEN FOR WEBSITE USE - DO NOT MODIFY
 *
 * This component is used exclusively by the production website's pricing section.
 * Any changes risk breaking the live website.
 *
 * For in-app cards, use the `AppCard` component instead.
 *
 * @frozen Website component - no changes allowed until v3.0.0
 * @see AppCard for app-specific card usage
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"
import { SHADOWS, type ShadowLevel, ALIAS } from "../../constants/designTokens"

// =============================================================================
// ANIMATED BORDER COMPONENT
// =============================================================================

function AnimatedDashedBorder({ color = ALIAS.status.error }: { color?: string }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ borderRadius: 'inherit' }}
    >
      <style>
        {`
          @keyframes marchingAnts {
            to {
              stroke-dashoffset: -32;
            }
          }
        `}
      </style>
      <rect
        x="1"
        y="1"
        width="calc(100% - 2px)"
        height="calc(100% - 2px)"
        rx="13"
        ry="13"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeDasharray="8 8"
        style={{
          animation: 'marchingAnts 1s linear infinite',
        }}
      />
    </svg>
  )
}

// =============================================================================
// CARD VARIANTS
// =============================================================================

const cardVariants = cva(
  "flex flex-col rounded-lg font-sans",
  {
    variants: {
      variant: {
        // Pricing card - dashed border (WEBSITE ONLY)
        pricing: "bg-white p-6 h-full border border-dashed border-slate rounded-[14px]",
        // Highlighted pricing card - animated marching ants border (WEBSITE ONLY)
        pricingHighlight: "bg-white p-6 rounded-[14px] relative overflow-hidden",
      },
    },
    defaultVariants: {
      variant: "pricing",
    },
  }
)

interface CardProps extends React.ComponentProps<"div">, VariantProps<typeof cardVariants> {
  /** Shadow elevation level: none, sm, md, lg, xl, elevated (natural light from above) */
  shadow?: ShadowLevel
}

/**
 * Card component for website pricing cards only.
 *
 * ⚠️ FROZEN - Website production use only
 *
 * @example
 * ```tsx
 * // Pricing card (website only)
 * <Card variant="pricing" shadow="sm">
 *   <CardHeader>
 *     <CardTitle>Standard</CardTitle>
 *     <CardDescription>$30/mo</CardDescription>
 *   </CardHeader>
 *   <CardContent>Features list</CardContent>
 * </Card>
 * ```
 */

function Card({ className, variant, shadow, style, children, ...props }: CardProps) {
  // Build combined styles using SHADOWS tokens (Tier 1 primitive for shadows)
  const combinedStyle: React.CSSProperties = {
    ...(shadow && shadow !== 'none' && { boxShadow: SHADOWS[shadow] }),
    ...style,
  }

  // For pricingHighlight, add animated SVG border
  if (variant === 'pricingHighlight') {
    return (
      <div
        data-slot="card"
        className={cn(cardVariants({ variant }), className)}
        style={Object.keys(combinedStyle).length > 0 ? combinedStyle : undefined}
        {...props}
      >
        <AnimatedDashedBorder />
        <div className="relative z-10 flex flex-col h-full">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant }), className)}
      style={Object.keys(combinedStyle).length > 0 ? combinedStyle : undefined}
      {...props}
    >
      {children}
    </div>
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted text-sm", className)}
      {...props}
    />
  )
}


function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

Card.displayName = "Card"
CardHeader.displayName = "CardHeader"
CardTitle.displayName = "CardTitle"
CardDescription.displayName = "CardDescription"
CardContent.displayName = "CardContent"
CardFooter.displayName = "CardFooter"

export {
  Card,
  cardVariants,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
}

export type { CardProps }
