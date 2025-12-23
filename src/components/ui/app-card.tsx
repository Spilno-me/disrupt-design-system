import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"
import { SHADOWS, type ShadowLevel } from "../../constants/designTokens"

/**
 * AppCard - Application card component (MOLECULE)
 *
 * A flexible card component for in-app use with semantic variants.
 * For website pricing cards, use the `Card` component instead.
 *
 * @example
 * ```tsx
 * // Basic card
 * <AppCard shadow="sm">
 *   <AppCardHeader>
 *     <AppCardTitle>Title</AppCardTitle>
 *     <AppCardDescription>Description text</AppCardDescription>
 *   </AppCardHeader>
 *   <AppCardContent>Main content</AppCardContent>
 * </AppCard>
 *
 * // With data-testid (auto-generated from title)
 * <AppCard data-testid="user-profile-card">
 *   <AppCardHeader>
 *     <AppCardTitle>User Profile</AppCardTitle>
 *   </AppCardHeader>
 * </AppCard>
 * ```
 *
 * @component MOLECULE - Auto-generates data-testid from content/props
 */

// =============================================================================
// CARD VARIANTS
// =============================================================================

const appCardVariants = cva(
  "flex flex-col rounded-xl font-sans",
  {
    variants: {
      variant: {
        // Default card - elevated background per DAPS (Card on page = bg-elevated)
        // Closer = Lighter: Cards float above page with lighter background
        default: "bg-elevated text-primary gap-6 border border-default py-6",
        // Elevated card - gradient background matching AppHeader for emphasized content
        elevated: "text-primary gap-6 border border-subtle p-6",
        // Surface card - one level deeper, for nested content or sidebars
        surface: "bg-surface text-primary gap-6 border border-default py-6",
        // Flat card - minimal styling, no border
        flat: "bg-surface text-primary gap-4 p-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface AppCardProps extends React.ComponentProps<"div">, VariantProps<typeof appCardVariants> {
  /** Shadow elevation level: none, sm, md (default), lg, xl, elevated (natural light from above) */
  shadow?: ShadowLevel
}

const AppCard = React.forwardRef<HTMLDivElement, AppCardProps>(
  ({ className, variant, shadow = 'md', style, children, ...props }, ref) => {
    // Build combined styles using SHADOWS tokens and gradient for elevated variant
    const combinedStyle: React.CSSProperties = {
      ...(shadow && shadow !== 'none' && { boxShadow: SHADOWS[shadow] }),
      // Apply gradient background for elevated variant (matches AppHeader subtle gradient)
      // Uses CSS variable for dark mode support
      ...(variant === 'elevated' && {
        background: 'var(--alias-gradient-subtle)',
      }),
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

/**
 * AppCardHeader - Header section of AppCard (MOLECULE)
 *
 * Container for card title, description, and optional actions.
 * Automatically handles grid layout when CardAction is present.
 *
 * @example
 * ```tsx
 * <AppCardHeader>
 *   <AppCardTitle>Title</AppCardTitle>
 *   <AppCardDescription>Description</AppCardDescription>
 *   <AppCardAction>
 *     <Button size="sm">Action</Button>
 *   </AppCardAction>
 * </AppCardHeader>
 * ```
 */
const AppCardHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
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
  }
)

AppCardHeader.displayName = "AppCardHeader"

/**
 * AppCardTitle - Title element for AppCard (ATOM)
 *
 * @example
 * ```tsx
 * <AppCardTitle>Dashboard Overview</AppCardTitle>
 * ```
 */
const AppCardTitle = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="app-card-title"
        className={cn("leading-none font-semibold text-primary", className)}
        {...props}
      />
    )
  }
)

AppCardTitle.displayName = "AppCardTitle"

/**
 * AppCardDescription - Description element for AppCard (ATOM)
 *
 * @example
 * ```tsx
 * <AppCardDescription>View your recent activity and metrics</AppCardDescription>
 * ```
 */
const AppCardDescription = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="app-card-description"
        className={cn("text-muted text-sm", className)}
        {...props}
      />
    )
  }
)

AppCardDescription.displayName = "AppCardDescription"

/**
 * AppCardAction - Action slot for AppCard header (ATOM)
 *
 * Positioned in the top-right corner of the card header.
 *
 * @example
 * ```tsx
 * <AppCardAction>
 *   <Button variant="ghost" size="sm">
 *     <MoreHorizontal className="w-4 h-4" />
 *   </Button>
 * </AppCardAction>
 * ```
 */
const AppCardAction = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="app-card-action"
        className={cn(
          "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
          className
        )}
        {...props}
      />
    )
  }
)

AppCardAction.displayName = "AppCardAction"

/**
 * AppCardContent - Main content area of AppCard (ATOM)
 *
 * @example
 * ```tsx
 * <AppCardContent>
 *   <p className="text-sm">Card content goes here</p>
 * </AppCardContent>
 * ```
 */
const AppCardContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="app-card-content"
        className={cn("px-6", className)}
        {...props}
      />
    )
  }
)

AppCardContent.displayName = "AppCardContent"

/**
 * AppCardFooter - Footer section of AppCard (ATOM)
 *
 * Typically used for actions or supplementary information.
 *
 * @example
 * ```tsx
 * <AppCardFooter className="justify-end gap-2">
 *   <Button variant="outline" size="sm">Cancel</Button>
 *   <Button size="sm">Save</Button>
 * </AppCardFooter>
 * ```
 */
const AppCardFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="app-card-footer"
        className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
        {...props}
      />
    )
  }
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
