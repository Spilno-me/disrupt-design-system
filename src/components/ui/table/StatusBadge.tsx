/**
 * StatusBadge - Reusable status badge component for DataTable cells
 *
 * Ensures WCAG AAA contrast (11.69:1+) by always using text-primary on light backgrounds.
 * Supports multiple status systems with predefined configs.
 *
 * @component ATOM
 *
 * @example
 * // Common active/inactive/pending
 * <StatusBadge status="active" statusConfig={COMMON_STATUS_CONFIG} />
 *
 * @example
 * // Lead statuses
 * <StatusBadge status="qualified" statusConfig={LEAD_STATUS_CONFIG} />
 *
 * @example
 * // Custom status system
 * <StatusBadge
 *   status="processing"
 *   statusConfig={{
 *     processing: { label: 'Processing', background: 'bg-info-light', text: 'text-primary' }
 *   }}
 * />
 *
 * @testing
 * - `data-slot="status-badge"` - Root badge element
 * - `data-slot="status-badge-dot"` - Optional dot indicator
 *
 * @accessibility
 * - Uses WCAG AAA contrast ratios (11.69:1+)
 * - Always uses text-primary on light semantic backgrounds
 */

import * as React from "react"
import { cn } from "../../../lib/utils"

// ============== CONSTANTS ==============

/** Base styling classes for badge container */
const BADGE_BASE_CLASSES = "inline-flex items-center text-xs font-semibold"

/** Horizontal padding for badge */
const BADGE_PADDING_X = "px-2"

/** Vertical padding for badge */
const BADGE_PADDING_Y = "py-0.5"

/** Border radius for default variant */
const BADGE_BORDER_RADIUS_DEFAULT = "rounded"

/** Border radius for pill variant */
const BADGE_BORDER_RADIUS_PILL = "rounded-full"

/** Dot indicator size classes */
const DOT_SIZE_CLASSES = "w-1.5 h-1.5"

/** Dot indicator styling */
const DOT_STYLE_CLASSES = "rounded-full bg-current mr-1.5"

/** Data slot attribute value for root element */
const DATA_SLOT_ROOT = "status-badge"

/** Data slot attribute value for dot indicator */
const DATA_SLOT_DOT = "status-badge-dot"

// ============== TYPES ==============

/** Configuration for a single status value */
export interface StatusConfig {
  /** Display label */
  label: string
  /** Background color class (e.g., 'bg-success-light') */
  background: string
  /** Text color class - always 'text-primary' for contrast */
  text: string
  /** Optional border class */
  border?: string
  /** Show dot indicator before label */
  showDot?: boolean
}

/** Props for StatusBadge component */
export interface StatusBadgeProps<T extends string = string>
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Status value */
  status: T
  /** Status configuration map */
  statusConfig: Record<T, StatusConfig>
  /** Shape variant */
  variant?: "default" | "pill"
}

// ============== PRESET CONFIGS ==============

/** Common active/inactive/pending status system */
export const COMMON_STATUS_CONFIG = {
  active: {
    label: "Active",
    background: "bg-success-light",
    text: "text-primary",
  },
  inactive: {
    label: "Inactive",
    background: "bg-error-light",
    text: "text-primary",
  },
  pending: {
    label: "Pending",
    background: "bg-warning-light",
    text: "text-primary",
  },
} as const satisfies Record<string, StatusConfig>

/** Lead status system */
export const LEAD_STATUS_CONFIG = {
  new: {
    label: "New",
    background: "bg-info-light",
    text: "text-primary",
  },
  contacted: {
    label: "Contacted",
    background: "bg-warning-light",
    text: "text-primary",
  },
  qualified: {
    label: "Qualified",
    background: "bg-accent-bg",
    text: "text-primary",
  },
  converted: {
    label: "Converted",
    background: "bg-success-light",
    text: "text-primary",
  },
  lost: {
    label: "Lost",
    background: "bg-error-light",
    text: "text-primary",
  },
} as const satisfies Record<string, StatusConfig>

/** Invoice status system */
export const INVOICE_STATUS_CONFIG = {
  draft: {
    label: "Draft",
    background: "bg-muted-bg",
    text: "text-primary",
    border: "border border-default",
    showDot: true,
  },
  sent: {
    label: "Sent",
    background: "bg-info-light",
    text: "text-primary",
  },
  paid: {
    label: "Paid",
    background: "bg-success-light",
    text: "text-primary",
  },
  overdue: {
    label: "Overdue",
    background: "bg-error-light",
    text: "text-primary",
  },
  partially_paid: {
    label: "Partially Paid",
    background: "bg-warning-light",
    text: "text-primary",
  },
} as const satisfies Record<string, StatusConfig>

/** Incident/Request status system */
export const REQUEST_STATUS_CONFIG = {
  draft: {
    label: "Draft",
    background: "bg-muted-bg",
    text: "text-primary",
    border: "border border-dashed border-default",
  },
  reported: {
    label: "Reported",
    background: "bg-accent-bg",
    text: "text-primary",
    border: "border border-accent",
  },
  pending_payment: {
    label: "Pending Payment",
    background: "bg-warning-light",
    text: "text-primary",
    border: "border border-warning/30",
  },
  pending_approval: {
    label: "Pending Approval",
    background: "bg-info-light",
    text: "text-primary",
    border: "border border-info/30",
  },
  approved: {
    label: "Approved",
    background: "bg-success-light",
    text: "text-primary",
    border: "border border-success/30",
  },
  rejected: {
    label: "Rejected",
    background: "bg-error-light",
    text: "text-primary",
    border: "border border-error/30",
  },
  investigation: {
    label: "Investigation",
    background: "bg-error-light",
    text: "text-primary",
    border: "border border-error/30",
  },
  review: {
    label: "Review",
    background: "bg-warning-light",
    text: "text-primary",
    border: "border border-warning/30",
  },
  closed: {
    label: "Closed",
    background: "bg-success-light",
    text: "text-primary",
    border: "border border-success/30",
  },
  provisioned: {
    label: "Provisioned",
    background: "bg-accent-bg",
    text: "text-primary",
    border: "border border-accent/30",
  },
} as const satisfies Record<string, StatusConfig>

// ============== HELPER FUNCTIONS ==============

/**
 * Returns the border radius class based on variant
 */
function getBorderRadiusClass(variant: "default" | "pill"): string {
  return variant === "pill" ? BADGE_BORDER_RADIUS_PILL : BADGE_BORDER_RADIUS_DEFAULT
}

// ============== COMPONENTS ==============

/**
 * StatusBadge - Generic status badge with guaranteed WCAG AAA contrast
 *
 * @param status - The status value to display
 * @param statusConfig - Configuration map for status values
 * @param variant - Shape variant ('default' or 'pill')
 * @param className - Additional CSS classes
 * @param props - Additional HTML attributes spread to root element
 */
export function StatusBadge<T extends string>({
  status,
  statusConfig,
  variant = "default",
  className,
  ...props
}: StatusBadgeProps<T>) {
  const config = statusConfig[status]

  if (!config) {
    console.warn(`StatusBadge: No config found for status "${status}"`)
    return null
  }

  return (
    <span
      data-slot={DATA_SLOT_ROOT}
      className={cn(
        BADGE_BASE_CLASSES,
        BADGE_PADDING_X,
        BADGE_PADDING_Y,
        getBorderRadiusClass(variant),
        config.background,
        config.text,
        config.border,
        className
      )}
      {...props}
    >
      {config.showDot && (
        <span
          data-slot={DATA_SLOT_DOT}
          className={cn(DOT_SIZE_CLASSES, DOT_STYLE_CLASSES)}
          aria-hidden="true"
        />
      )}
      {config.label}
    </span>
  )
}

StatusBadge.displayName = "StatusBadge"

export default StatusBadge
