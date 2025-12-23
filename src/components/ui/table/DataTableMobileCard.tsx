"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "../../../lib/utils"
import type { ActionItem } from "./DataTableActions"
import { DataTableActions } from "./DataTableActions"

// =============================================================================
// TYPES
// =============================================================================

export interface MobileCardField {
  /** Field label */
  label: string
  /** Field value (can be React node for badges, etc.) */
  value: React.ReactNode
  /** Whether this is a primary field (shown prominently) */
  primary?: boolean
  /** Whether to span full width (2 columns) */
  fullWidth?: boolean
  /** Additional className */
  className?: string
}

export interface DataTableMobileCardProps<T = unknown> {
  /** Card title */
  title: React.ReactNode
  /** Card subtitle */
  subtitle?: React.ReactNode
  /** Status badge or indicator */
  status?: React.ReactNode
  /** Icon to show */
  icon?: React.ReactNode
  /** Array of fields to display */
  fields?: MobileCardField[]
  /** Row data */
  row?: T
  /** Actions to show */
  actions?: ActionItem<T>[] | React.ReactNode
  /** User context for actions */
  user?: unknown
  /** Click handler for card */
  onTap?: () => void
  /** Additional className */
  className?: string
  /** Children for custom content */
  children?: React.ReactNode
  /** Show chevron indicator for tappable cards */
  showChevron?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * DataTableMobileCard - Table row transformed into a mobile card
 *
 * Designed to look like a table row converted to a card format.
 * Maintains visual consistency with desktop DataTable:
 * - Left border for priority/severity indication
 * - Compact horizontal layout
 * - Table-like field grid
 * - Same status badges and action buttons
 *
 * @example
 * ```tsx
 * <DataTableMobileCard
 *   title="Chemical Spill - Building A"
 *   subtitle="INC-2024-001234"
 *   status={<IncidentStatusBadge status="open" severity="high" />}
 *   fields={[
 *     { label: 'Location', value: 'Building A' },
 *     { label: 'Reporter', value: 'John Doe' },
 *     { label: 'Severity', value: <SeverityIndicator level="high" /> },
 *     { label: 'Age', value: '3d' }
 *   ]}
 *   className="border-l-4 border-l-error"
 *   onTap={() => navigate(`/incidents/${id}`)}
 * />
 * ```
 */
export function DataTableMobileCard<T = unknown>({
  title,
  subtitle,
  status,
  icon,
  fields,
  row,
  actions,
  user,
  onTap,
  className,
  children,
  showChevron = true,
}: DataTableMobileCardProps<T>) {
  return (
    <div
      role={onTap ? "button" : undefined}
      tabIndex={onTap ? 0 : undefined}
      onClick={onTap}
      onKeyDown={onTap ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(); } } : undefined}
      className={cn(
        // Base card styling - matches table row appearance
        "bg-surface rounded-lg border border-default",
        // Padding optimized for touch (44px touch targets)
        "p-3",
        // Interactive states
        onTap && [
          "cursor-pointer",
          "active:bg-surface-active",
          "hover:bg-surface-hover",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-1"
        ],
        className
      )}
    >
      {/* Row 1: Header - Title, Subtitle, Status, Chevron */}
      <div className="flex items-center gap-2">
        {/* Icon (optional) */}
        {icon && (
          <div className="flex-shrink-0 text-secondary">
            {icon}
          </div>
        )}

        {/* Title & Subtitle - left aligned, takes remaining space */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-primary text-sm truncate">
              {title}
            </h3>
          </div>
          {subtitle && (
            <p className="text-xs text-tertiary font-mono truncate">
              {subtitle}
            </p>
          )}
        </div>

        {/* Status Badge - right aligned */}
        {status && (
          <div className="flex-shrink-0">
            {status}
          </div>
        )}

        {/* Chevron indicator for tappable cards */}
        {onTap && showChevron && (
          <ChevronRight className="size-4 text-tertiary flex-shrink-0" />
        )}
      </div>

      {/* Row 2: Fields Grid - compact table-like layout */}
      {fields && fields.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 pt-3 border-t border-subtle">
          {fields.map((field, index) => (
            <div
              key={index}
              className={cn(
                "min-w-0",
                field.fullWidth && "col-span-2",
                field.className
              )}
            >
              {/* Label - small, muted, uppercase like table headers */}
              <p className="text-[10px] uppercase tracking-wider text-tertiary font-medium mb-0.5">
                {field.label}
              </p>
              {/* Value - matches table cell styling */}
              <div className={cn(
                "text-sm truncate",
                field.primary ? "font-semibold text-primary" : "text-primary"
              )}>
                {field.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Content */}
      {children}

      {/* Row 3: Actions - separated by border, full width */}
      {actions && (
        <div className="mt-3 pt-3 border-t border-subtle">
          {Array.isArray(actions) && row ? (
            <DataTableActions
              actions={actions as ActionItem<T>[]}
              row={row}
              user={user}
              layout="horizontal"
              size="sm"
              showLabels
              provideTooltip={false}
              maxVisible={3}
            />
          ) : !Array.isArray(actions) ? (
            <div className="flex items-center justify-end gap-2">
              {actions}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default DataTableMobileCard
