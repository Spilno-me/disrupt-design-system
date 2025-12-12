"use client"

import * as React from "react"
import { Card } from "../card"
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
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * DataTableMobileCard - Mobile-optimized card view for data table rows
 *
 * Automatically used by DataTable in responsive mode on mobile devices.
 * Can also be used standalone for custom mobile layouts.
 *
 * @example
 * ```tsx
 * <DataTableMobileCard
 *   title="Acme Corp"
 *   subtitle="john@acme.com"
 *   status={<DataTableBadge status="active" mapping={STATUS_MAP} />}
 *   fields={[
 *     { label: 'Revenue', value: '$45,000' },
 *     { label: 'Leads', value: '120' }
 *   ]}
 *   actions={partnerActions}
 *   row={partner}
 *   user={currentUser}
 *   onTap={() => navigate(`/partners/${partner.id}`)}
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
}: DataTableMobileCardProps<T>) {
  return (
    <Card
      className={cn(
        "p-4 space-y-3",
        onTap && "cursor-pointer active:bg-surface-active transition-colors",
        className
      )}
      onClick={onTap}
    >
      {/* Header - Title, Subtitle, Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Icon */}
          {icon && (
            <div className="flex-shrink-0 mt-1">
              {icon}
            </div>
          )}

          {/* Title & Subtitle */}
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-primary truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-secondary truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Status Badge */}
        {status && (
          <div className="flex-shrink-0">
            {status}
          </div>
        )}
      </div>

      {/* Fields Grid */}
      {fields && fields.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {fields.map((field, index) => (
            <div key={index} className={cn("min-w-0", field.className)}>
              <p className="text-xs text-secondary mb-1">{field.label}</p>
              <div className={cn(
                "text-sm truncate",
                field.primary ? "font-semibold text-primary" : "font-medium text-primary"
              )}>
                {field.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Content */}
      {children}

      {/* Actions */}
      {actions && (
        <div className="pt-3 border-t border-default">
          {Array.isArray(actions) && row ? (
            <DataTableActions
              actions={actions as ActionItem<T>[]}
              row={row}
              user={user}
              layout="horizontal"
              size="sm"
              showLabels
              provideTooltip={false}
              maxVisible={2}
            />
          ) : (
            <>{actions}</>
          )}
        </div>
      )}
    </Card>
  )
}

export default DataTableMobileCard
