import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"
import { SHADOWS, type ShadowLevel } from "../../constants/designTokens"

// =============================================================================
// CARD VARIANTS
// =============================================================================

const cardVariants = cva(
  "flex flex-col rounded-lg font-sans",
  {
    variants: {
      variant: {
        // Default card - white background with subtle border
        default: "bg-white text-dark gap-6 border border-slate py-6",
        // Pricing card - dashed border
        pricing: "bg-white p-6 h-full border border-dashed border-slate rounded-[14px]",
        // Highlighted pricing card - accent border
        pricingHighlight: "bg-white p-6 border-2 border-dashed border-error rounded-[14px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface CardProps extends React.ComponentProps<"div">, VariantProps<typeof cardVariants> {
  /** Shadow elevation level: none, sm, md, lg, xl */
  shadow?: ShadowLevel
}

function Card({ className, variant, shadow, style, ...props }: CardProps) {
  // Build combined styles using SHADOWS tokens (Tier 1 primitive for shadows)
  const combinedStyle: React.CSSProperties = {
    ...(shadow && shadow !== 'none' && { boxShadow: SHADOWS[shadow] }),
    ...style,
  }

  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant }), className)}
      style={Object.keys(combinedStyle).length > 0 ? combinedStyle : undefined}
      {...props}
    />
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

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
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

export {
  Card,
  cardVariants,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
