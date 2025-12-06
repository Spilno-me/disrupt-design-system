import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"
import { COLORS, SHADOWS, type ShadowLevel } from "../../constants/designTokens"

// =============================================================================
// CARD VARIANTS
// =============================================================================

const cardVariants = cva(
  "flex flex-col rounded-lg",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground gap-6 border py-6",
        pricing: "bg-white p-6 h-full border border-dashed border-slate-300 rounded-[14px]",
        pricingHighlight: "bg-white p-6 border-2 border-dashed rounded-[14px]",
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
  // Build combined styles
  const combinedStyle: React.CSSProperties = {
    ...(variant === "pricingHighlight" && { borderColor: COLORS.ferrariRed }),
    ...(shadow && shadow !== 'none' && { boxShadow: SHADOWS[shadow] }),
    ...style,
  }

  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant }), className)}
      style={combinedStyle}
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
      className={cn("text-muted-foreground text-sm", className)}
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
