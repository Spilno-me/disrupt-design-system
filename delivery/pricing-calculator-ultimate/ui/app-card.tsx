import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

/**
 * AppCard - Application card component
 * Standalone version with inlined design tokens
 */

// Inlined shadow tokens (from DDS design tokens)
const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  elevated: '0 -4px 10px 0px rgba(0, 0, 0, 0.03), 0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)',
} as const

type ShadowLevel = keyof typeof SHADOWS

// Subtle gradient for elevated variant
const SUBTLE_GRADIENT = 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(251, 251, 243, 0.98) 100%)'

const appCardVariants = cva(
  "flex flex-col rounded-lg font-sans",
  {
    variants: {
      variant: {
        default: "bg-surface text-primary gap-6 border border-default py-6",
        elevated: "text-primary gap-6 border border-subtle p-6",
        flat: "bg-surface text-primary gap-4 p-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface AppCardProps extends React.ComponentProps<"div">, VariantProps<typeof appCardVariants> {
  shadow?: ShadowLevel
}

const AppCard = React.forwardRef<HTMLDivElement, AppCardProps>(
  ({ className, variant, shadow = 'md', style, children, ...props }, ref) => {
    const combinedStyle: React.CSSProperties = {
      ...(shadow && shadow !== 'none' && { boxShadow: SHADOWS[shadow] }),
      ...(variant === 'elevated' && { background: SUBTLE_GRADIENT }),
      ...style,
    }

    return (
      <div
        ref={ref}
        data-slot="app-card"
        className={cn(appCardVariants({ variant }), className)}
        style={Object.keys(combinedStyle).length > 0 ? combinedStyle : undefined}
        {...props}
      >
        {children}
      </div>
    )
  }
)
AppCard.displayName = "AppCard"

const AppCardHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="app-card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=app-card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
)
AppCardHeader.displayName = "AppCardHeader"

const AppCardTitle = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="app-card-title"
      className={cn("leading-none font-semibold text-primary", className)}
      {...props}
    />
  )
)
AppCardTitle.displayName = "AppCardTitle"

const AppCardDescription = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="app-card-description"
      className={cn("text-muted text-sm", className)}
      {...props}
    />
  )
)
AppCardDescription.displayName = "AppCardDescription"

const AppCardAction = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="app-card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  )
)
AppCardAction.displayName = "AppCardAction"

const AppCardContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="app-card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
)
AppCardContent.displayName = "AppCardContent"

const AppCardFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="app-card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
)
AppCardFooter.displayName = "AppCardFooter"

export {
  AppCard,
  appCardVariants,
  AppCardHeader,
  AppCardFooter,
  AppCardTitle,
  AppCardAction,
  AppCardDescription,
  AppCardContent,
}

export type { AppCardProps }
