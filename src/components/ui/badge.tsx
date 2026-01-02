import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

// =============================================================================
// VARIANTS
// =============================================================================

const badgeVariants = cva(
  "inline-flex items-center justify-center border font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        // Solid variants (original)
        default:
          "border-transparent bg-inverse-bg text-inverse dark:text-primary [a&]:hover:bg-inverse-bg/90",
        secondary:
          "border-transparent bg-muted-bg text-secondary [a&]:hover:bg-muted-bg/80",
        destructive:
          "border-transparent bg-destructive text-inverse [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-primary [a&]:hover:bg-muted-bg",
        success:
          "border-transparent bg-success-tint text-success-strong dark:bg-success-tint dark:text-white [a&]:hover:bg-success/90",
        warning:
          "border-transparent bg-warning-tint text-warning-dark dark:bg-warning-tint dark:text-white [a&]:hover:bg-warning/90",
        info:
          "border-transparent bg-info text-primary [a&]:hover:bg-info/90",
        // Border-only variants (EMEX pattern for status/priority badges)
        "border-success":
          "bg-transparent border-success text-success [a&]:hover:bg-success/10",
        "border-warning":
          "bg-transparent border-warning text-warning-dark dark:text-warning [a&]:hover:bg-warning/10",
        "border-info":
          "bg-transparent border-info text-info [a&]:hover:bg-info/10",
        "border-destructive":
          "bg-transparent border-destructive text-destructive [a&]:hover:bg-destructive/10",
        "border-secondary":
          "bg-transparent border-default text-secondary [a&]:hover:bg-muted-bg/50",
        // Priority/Severity border variants (semantic aliases)
        "border-low":
          "bg-transparent border-success text-success [a&]:hover:bg-success/10",
        "border-medium":
          "bg-transparent border-warning text-warning-dark dark:text-warning [a&]:hover:bg-warning/10",
        "border-high":
          "bg-transparent border-warning text-warning-dark dark:text-warning [a&]:hover:bg-warning/10",
        "border-critical":
          "bg-transparent border-destructive text-destructive [a&]:hover:bg-destructive/10",
      },
      shape: {
        default: "rounded-sm",
        pill: "rounded-full px-3 py-1",
        notification: "rounded-sm min-w-5 h-5 px-1.5",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      shape: "default",
      size: "sm",
    },
  }
)

// =============================================================================
// TYPES
// =============================================================================

/**
 * Badge component for displaying labels, statuses, and counts.
 *
 * ATOM: Accepts data-testid via props. Consumer provides context-specific testId.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Badge variant="success">Active</Badge>
 * <Badge variant="destructive" shape="pill">Error</Badge>
 * <Badge size="lg">Count: 42</Badge>
 *
 * // With data-testid (consumer provides context)
 * <Badge data-testid="user-status-badge" variant="success">Active</Badge>
 * <Badge data-testid="lead-priority-badge">High</Badge>
 *
 * // As interactive element
 * <Badge asChild data-testid="settings-badge-link">
 *   <a href="/settings">Settings</a>
 * </Badge>
 * ```
 */
export type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** Render as a different element using Radix Slot */
    asChild?: boolean
  }

// =============================================================================
// COMPONENT
// =============================================================================

function Badge({
  className,
  variant,
  shape,
  size,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, shape, size }), className)}
      {...props}
    />
  )
}

Badge.displayName = "Badge"

export { Badge, badgeVariants }
