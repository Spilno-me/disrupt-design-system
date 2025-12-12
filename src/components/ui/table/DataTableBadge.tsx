"use client"

import * as React from "react"
import { Badge, type BadgeProps } from "../badge"
import { cn } from "../../../lib/utils"

// =============================================================================
// TYPES
// =============================================================================

export type StatusVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'

export interface StatusConfig {
  /** Badge variant - uses DDS token-based variants */
  variant: StatusVariant
  /** Display label for the status */
  label?: string
  /** Optional icon component */
  icon?: React.ComponentType<{ className?: string }>
  /** Custom className */
  className?: string
}

export type StatusMapping<T extends string = string> = Record<T, StatusConfig>

export interface DataTableBadgeProps<T extends string = string> {
  /** Status value */
  status: T
  /** Mapping of status values to configurations */
  mapping: StatusMapping<T>
  /** Optional size override */
  size?: 'sm' | 'md' | 'lg'
  /** Additional className */
  className?: string
  /** Whether to show icon */
  showIcon?: boolean
}

// =============================================================================
// COMMON STATUS MAPPINGS (Presets for convenience)
// =============================================================================

/** Standard active/inactive status mapping */
export const ACTIVE_STATUS_MAP: StatusMapping<'active' | 'inactive'> = {
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'secondary', label: 'Inactive' },
}

/** Workflow status mapping (draft → submitted → approved) */
export const WORKFLOW_STATUS_MAP: StatusMapping<'draft' | 'submitted' | 'approved' | 'rejected'> = {
  draft: { variant: 'secondary', label: 'Draft' },
  submitted: { variant: 'warning', label: 'Submitted' },
  approved: { variant: 'success', label: 'Approved' },
  rejected: { variant: 'destructive', label: 'Rejected' },
}

/** Request status mapping */
export const REQUEST_STATUS_MAP: StatusMapping<'pending' | 'processing' | 'completed' | 'failed'> = {
  pending: { variant: 'warning', label: 'Pending' },
  processing: { variant: 'info', label: 'Processing' },
  completed: { variant: 'success', label: 'Completed' },
  failed: { variant: 'destructive', label: 'Failed' },
}

/** Partner status mapping */
export const PARTNER_STATUS_MAP: StatusMapping<'active' | 'inactive' | 'pending' | 'suspended'> = {
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'secondary', label: 'Inactive' },
  pending: { variant: 'warning', label: 'Pending' },
  suspended: { variant: 'destructive', label: 'Suspended' },
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * DataTableBadge - Standardized status badge for data tables
 *
 * Uses design tokens exclusively through Badge component variants.
 * Supports custom mappings for any status types.
 *
 * @example
 * ```tsx
 * // Using preset mapping
 * <DataTableBadge status="active" mapping={PARTNER_STATUS_MAP} />
 *
 * // Custom mapping
 * const customMap = {
 *   todo: { variant: 'secondary', label: 'To Do' },
 *   doing: { variant: 'info', label: 'In Progress' },
 *   done: { variant: 'success', label: 'Done' }
 * }
 * <DataTableBadge status="doing" mapping={customMap} />
 * ```
 */
export function DataTableBadge<T extends string = string>({
  status,
  mapping,
  size = 'sm',
  className,
  showIcon = true,
}: DataTableBadgeProps<T>) {
  const config = mapping[status]

  // Fallback if status not in mapping
  if (!config) {
    console.warn(`DataTableBadge: Unknown status "${status}" not found in mapping`)
    return (
      <Badge variant="outline" size={size} className={className}>
        {status}
      </Badge>
    )
  }

  const { variant, label, icon: Icon, className: configClassName } = config
  const displayLabel = label || status

  return (
    <Badge
      variant={variant as BadgeProps['variant']}
      size={size}
      className={cn(configClassName, className)}
    >
      {showIcon && Icon && (
        <Icon className="mr-1 h-3 w-3" />
      )}
      {displayLabel}
    </Badge>
  )
}

export default DataTableBadge
