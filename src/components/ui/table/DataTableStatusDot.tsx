"use client"

import * as React from "react"
import { cn } from "../../../lib/utils"

// =============================================================================
// TYPES
// =============================================================================

export type DotVariant = 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info'

export interface DotStatusConfig {
  /** Dot color variant */
  variant: DotVariant
  /** Display label for the status */
  label?: string
}

export type DotStatusMapping<T extends string = string> = Record<T, DotStatusConfig>

export interface DataTableStatusDotProps<T extends string = string> {
  /** Status value */
  status: T
  /** Mapping of status values to configurations */
  mapping: DotStatusMapping<T>
  /** Size of the dot */
  size?: 'sm' | 'md' | 'lg'
  /** Additional className */
  className?: string
  /** Whether to show the label (default: true) */
  showLabel?: boolean
}

// =============================================================================
// DOT VARIANT STYLES
// =============================================================================

const dotVariantStyles: Record<DotVariant, string> = {
  default: 'bg-muted',
  secondary: 'bg-secondary',
  destructive: 'bg-error',
  success: 'bg-success',
  warning: 'bg-warning',
  info: 'bg-info',
}

const dotSizes: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
}

const textSizes: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-sm',
}

// =============================================================================
// COMMON STATUS MAPPINGS (Presets for convenience)
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
// COMPONENT
// =============================================================================

/**
 * DataTableStatusDot - Compact status indicator with colored dot and label
 *
 * A minimal, accessible status indicator that combines a colored dot
 * with a text label. Recommended as the standard for status display
 * in data tables for optimal balance of visual clarity and compactness.
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
 */
export function DataTableStatusDot<T extends string = string>({
  status,
  mapping,
  size = 'md',
  className,
  showLabel = true,
}: DataTableStatusDotProps<T>) {
  const config = mapping[status]

  // Fallback if status not in mapping
  if (!config) {
    console.warn(`DataTableStatusDot: Unknown status "${status}" not found in mapping`)
    return (
      <span className={cn("inline-flex items-center gap-2 whitespace-nowrap", className)}>
        <span
          className={cn(
            "rounded-full flex-shrink-0",
            dotVariantStyles.default,
            dotSizes[size]
          )}
          aria-hidden={showLabel}
          aria-label={showLabel ? undefined : String(status)}
        />
        {showLabel && (
          <span className={cn("text-muted", textSizes[size])}>
            {status}
          </span>
        )}
      </span>
    )
  }

  const { variant, label } = config
  const displayLabel = label || status

  return (
    <span className={cn("inline-flex items-center gap-2 whitespace-nowrap", className)}>
      <span
        className={cn(
          "rounded-full flex-shrink-0",
          dotVariantStyles[variant],
          dotSizes[size]
        )}
        aria-hidden={showLabel}
        aria-label={showLabel ? undefined : displayLabel}
      />
      {showLabel && (
        <span className={cn("text-primary", textSizes[size])}>
          {displayLabel}
        </span>
      )}
    </span>
  )
}

DataTableStatusDot.displayName = "DataTableStatusDot"

export default DataTableStatusDot
