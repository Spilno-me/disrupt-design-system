"use client"

import * as React from "react"
import { Badge, type BadgeProps } from "../badge"
import { cn } from "../../../lib/utils"

// ============== CONSTANTS ==============

/** Default size for table badges */
const DEFAULT_SIZE = "sm" as const

/** Default icon visibility setting */
const DEFAULT_SHOW_ICON = true

/** Icon size class for badge icons */
const ICON_SIZE_CLASS = "mr-1 h-3 w-3"

/** Fallback variant when status not found in mapping */
const FALLBACK_VARIANT = "outline" as const

// ============== TYPES ==============

/** Available badge variants matching DDS design tokens */
export type StatusVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"

/** Configuration for a single status value */
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

/** Mapping of status values to their configurations */
export type StatusMapping<T extends string = string> = Record<T, StatusConfig>

/** Props for the DataTableBadge component */
export interface DataTableBadgeProps<T extends string = string>
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Status value to display */
  status: T
  /** Mapping of status values to configurations */
  mapping: StatusMapping<T>
  /** Badge size variant */
  size?: "sm" | "md" | "lg"
  /** Whether to show icon if configured */
  showIcon?: boolean
}

// ============== STATUS MAPPINGS ==============

/** Standard active/inactive status mapping */
export const ACTIVE_STATUS_MAP: StatusMapping<"active" | "inactive"> = {
  active: { variant: "success", label: "Active" },
  inactive: { variant: "secondary", label: "Inactive" },
}

/** Workflow status mapping (draft → submitted → approved) */
export const WORKFLOW_STATUS_MAP: StatusMapping<"draft" | "submitted" | "approved" | "rejected"> = {
  draft: { variant: "secondary", label: "Draft" },
  submitted: { variant: "warning", label: "Submitted" },
  approved: { variant: "success", label: "Approved" },
  rejected: { variant: "destructive", label: "Rejected" },
}

/** Request status mapping */
export const REQUEST_STATUS_MAP: StatusMapping<"pending" | "processing" | "completed" | "failed"> = {
  pending: { variant: "warning", label: "Pending" },
  processing: { variant: "info", label: "Processing" },
  completed: { variant: "success", label: "Completed" },
  failed: { variant: "destructive", label: "Failed" },
}

/** Partner status mapping */
export const PARTNER_STATUS_MAP: StatusMapping<"active" | "inactive" | "pending" | "suspended"> = {
  active: { variant: "success", label: "Active" },
  inactive: { variant: "secondary", label: "Inactive" },
  pending: { variant: "warning", label: "Pending" },
  suspended: { variant: "destructive", label: "Suspended" },
}

// ============== COMPONENTS ==============

/**
 * DataTableBadge - Standardized status badge for data tables
 *
 * Displays status values with consistent styling using DDS design tokens.
 * Supports preset mappings or custom status configurations.
 *
 * @component ATOM
 *
 * @example
 * ```tsx
 * // Using preset mapping
 * <DataTableBadge status="active" mapping={PARTNER_STATUS_MAP} />
 *
 * // Custom mapping
 * const customMap = {
 *   todo: { variant: "secondary", label: "To Do" },
 *   doing: { variant: "info", label: "In Progress" },
 *   done: { variant: "success", label: "Done" },
 * }
 * <DataTableBadge status="doing" mapping={customMap} />
 * ```
 */
export function DataTableBadge<T extends string = string>({
  status,
  mapping,
  size = DEFAULT_SIZE,
  className,
  showIcon = DEFAULT_SHOW_ICON,
  ...props
}: DataTableBadgeProps<T>) {
  const config = mapping[status]

  // Render fallback badge for unknown status
  if (!config) {
    return (
      <Badge
        data-slot="data-table-badge"
        variant={FALLBACK_VARIANT}
        size={size}
        className={className}
        {...props}
      >
        {status}
      </Badge>
    )
  }

  const { variant, label, icon: Icon, className: configClassName } = config
  const displayLabel = label || status

  return (
    <Badge
      data-slot="data-table-badge"
      variant={variant as BadgeProps["variant"]}
      size={size}
      className={cn(configClassName, className)}
      {...props}
    >
      {showIcon && Icon && <Icon className={ICON_SIZE_CLASS} />}
      {displayLabel}
    </Badge>
  )
}

DataTableBadge.displayName = "DataTableBadge"

export default DataTableBadge
