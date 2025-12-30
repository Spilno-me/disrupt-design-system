"use client"

import * as React from "react"
import { cn } from "../../../lib/utils"

// =============================================================================
// CONSTANTS
// =============================================================================

/** Dot size classes mapped by size variant */
const DOT_SIZE_CLASSES = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
} as const

/** Text size classes mapped by size variant */
const TEXT_SIZE_CLASSES = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-sm',
} as const

/** Gap between dot and label */
const DOT_LABEL_GAP = 'gap-2'

/** Base dot styles applied to all variants */
const DOT_BASE_STYLES = 'rounded-full flex-shrink-0'

/** Base container styles */
const CONTAINER_BASE_STYLES = 'inline-flex items-center whitespace-nowrap'

// =============================================================================
// TYPES
// =============================================================================

/** Available dot color variants */
export type DotVariant = 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info'

/** Size options for the status dot */
export type DotSize = 'sm' | 'md' | 'lg'

/** Configuration for a single status */
export interface DotStatusConfig {
  /** Dot color variant */
  variant: DotVariant
  /** Display label for the status */
  label?: string
}

/** Mapping of status values to their configurations */
export type DotStatusMapping<T extends string = string> = Record<T, DotStatusConfig>

/** Props for the DataTableStatusDot component */
export interface DataTableStatusDotProps<T extends string = string>
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Status value to display */
  status: T
  /** Mapping of status values to configurations */
  mapping: DotStatusMapping<T>
  /** Size of the dot and text */
  size?: DotSize
  /** Whether to show the label (default: true) */
  showLabel?: boolean
}

// =============================================================================
// VARIANT STYLES
// =============================================================================

/** Dot background color by variant - uses semantic status tokens */
const DOT_VARIANT_STYLES: Record<DotVariant, string> = {
  default: 'bg-muted',
  secondary: 'bg-secondary',
  destructive: 'bg-error',
  success: 'bg-success',
  warning: 'bg-warning',
  info: 'bg-info',
}

// =============================================================================
// PRESET MAPPINGS
// =============================================================================

/** Standard active/inactive status mapping */
export const ACTIVE_DOT_STATUS_MAP: DotStatusMapping<'active' | 'inactive'> = {
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'secondary', label: 'Inactive' },
}

/** Partner status mapping */
export const PARTNER_DOT_STATUS_MAP: DotStatusMapping<'active' | 'inactive' | 'pending' | 'suspended'> = {
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'secondary', label: 'Inactive' },
  pending: { variant: 'warning', label: 'Pending' },
  suspended: { variant: 'destructive', label: 'Suspended' },
}

/** Workflow status mapping */
export const WORKFLOW_DOT_STATUS_MAP: DotStatusMapping<'draft' | 'submitted' | 'approved' | 'rejected'> = {
  draft: { variant: 'secondary', label: 'Draft' },
  submitted: { variant: 'warning', label: 'Submitted' },
  approved: { variant: 'success', label: 'Approved' },
  rejected: { variant: 'destructive', label: 'Rejected' },
}

/** Request status mapping */
export const REQUEST_DOT_STATUS_MAP: DotStatusMapping<'pending' | 'processing' | 'completed' | 'failed'> = {
  pending: { variant: 'warning', label: 'Pending' },
  processing: { variant: 'info', label: 'Processing' },
  completed: { variant: 'success', label: 'Completed' },
  failed: { variant: 'destructive', label: 'Failed' },
}

/** Lead status mapping */
export const LEAD_DOT_STATUS_MAP: DotStatusMapping<'new' | 'contacted' | 'qualified' | 'converted' | 'lost'> = {
  new: { variant: 'info', label: 'New' },
  contacted: { variant: 'warning', label: 'Contacted' },
  qualified: { variant: 'info', label: 'Qualified' },
  converted: { variant: 'success', label: 'Converted' },
  lost: { variant: 'secondary', label: 'Lost' },
}

/** Invoice status mapping */
export const INVOICE_DOT_STATUS_MAP: DotStatusMapping<'draft' | 'sent' | 'paid' | 'overdue' | 'partially_paid' | 'cancelled'> = {
  draft: { variant: 'secondary', label: 'Draft' },
  sent: { variant: 'info', label: 'Sent' },
  paid: { variant: 'success', label: 'Paid' },
  overdue: { variant: 'destructive', label: 'Overdue' },
  partially_paid: { variant: 'warning', label: 'Partially Paid' },
  cancelled: { variant: 'default', label: 'Cancelled' },
}

/** Login account status mapping */
export const LOGIN_ACCOUNT_DOT_STATUS_MAP: DotStatusMapping<'active' | 'inactive' | 'pending' | 'locked'> = {
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'secondary', label: 'Inactive' },
  pending: { variant: 'warning', label: 'Pending' },
  locked: { variant: 'destructive', label: 'Locked' },
}

/** Tenant request status mapping */
export const TENANT_REQUEST_DOT_STATUS_MAP: DotStatusMapping<'pending_review' | 'approved' | 'rejected' | 'pending_payment' | 'provisioning' | 'completed'> = {
  pending_review: { variant: 'warning', label: 'Pending Review' },
  approved: { variant: 'success', label: 'Approved' },
  rejected: { variant: 'destructive', label: 'Rejected' },
  pending_payment: { variant: 'info', label: 'Pending Payment' },
  provisioning: { variant: 'info', label: 'Provisioning' },
  completed: { variant: 'success', label: 'Completed' },
}

// =============================================================================
// COMPONENTS
// =============================================================================

/**
 * DataTableStatusDot - Compact status indicator with colored dot and label.
 *
 * A minimal, accessible status indicator that combines a colored dot with
 * a text label. Designed as the standard for status display in data tables
 * for optimal balance of visual clarity and compactness.
 *
 * @component ATOM
 * @category Data Display
 *
 * @example
 * ```tsx
 * // Using preset mapping
 * <DataTableStatusDot status="active" mapping={PARTNER_DOT_STATUS_MAP} />
 *
 * // Custom mapping
 * const customMap = {
 *   todo: { variant: 'secondary', label: 'To Do' },
 *   doing: { variant: 'info', label: 'In Progress' },
 *   done: { variant: 'success', label: 'Done' }
 * }
 * <DataTableStatusDot status="doing" mapping={customMap} />
 *
 * // Dot only (no label)
 * <DataTableStatusDot status="active" mapping={PARTNER_DOT_STATUS_MAP} showLabel={false} />
 * ```
 *
 * @accessibility
 * - Color is supplemented with text label for colorblind users
 * - Uses semantic color tokens for consistent meaning
 * - When showLabel=false, includes aria-label for screen readers
 * - role="status" for live region announcements
 */
export function DataTableStatusDot<T extends string = string>({
  status,
  mapping,
  size = 'md',
  className,
  showLabel = true,
  ...props
}: DataTableStatusDotProps<T>) {
  const config = mapping[status]

  // Fallback for unknown status
  if (!config) {
    return (
      <span
        data-slot="data-table-status-dot"
        role="status"
        className={cn(CONTAINER_BASE_STYLES, DOT_LABEL_GAP, className)}
        {...props}
      >
        <span
          className={cn(DOT_BASE_STYLES, DOT_VARIANT_STYLES.default, DOT_SIZE_CLASSES[size])}
          aria-hidden={showLabel}
          aria-label={showLabel ? undefined : String(status)}
        />
        {showLabel && (
          <span className={cn("text-muted", TEXT_SIZE_CLASSES[size])}>
            {status}
          </span>
        )}
      </span>
    )
  }

  const { variant, label } = config
  const displayLabel = label || status

  return (
    <span
      data-slot="data-table-status-dot"
      role="status"
      className={cn(CONTAINER_BASE_STYLES, DOT_LABEL_GAP, className)}
      {...props}
    >
      <span
        className={cn(DOT_BASE_STYLES, DOT_VARIANT_STYLES[variant], DOT_SIZE_CLASSES[size])}
        aria-hidden={showLabel}
        aria-label={showLabel ? undefined : displayLabel}
      />
      {showLabel && (
        <span className={cn("text-primary", TEXT_SIZE_CLASSES[size])}>
          {displayLabel}
        </span>
      )}
    </span>
  )
}

DataTableStatusDot.displayName = "DataTableStatusDot"

// =============================================================================
// EXPORTS
// =============================================================================

export default DataTableStatusDot
