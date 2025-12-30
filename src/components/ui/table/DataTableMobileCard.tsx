"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "../../../lib/utils"
import type { ActionItem } from "./DataTableActions"
import { DataTableActions } from "./DataTableActions"

// ==============================================================================
// CONSTANTS
// ==============================================================================

/** Base card styling - matches table row appearance */
const BASE_CARD_STYLES = "bg-surface rounded-lg border border-default"

/** Padding optimized for touch (44px touch targets) */
const CARD_PADDING = "p-3"

/** Interactive card state styles */
const INTERACTIVE_STYLES = [
  "cursor-pointer",
  "active:bg-surface-active",
  "hover:bg-surface-hover",
  "transition-colors duration-150",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-1",
]

/** Field grid configuration */
const FIELD_GRID_STYLES = "grid grid-cols-2 gap-x-4 gap-y-2 mt-3 pt-3 border-t border-subtle"

/** Label styles - small, muted, uppercase like table headers */
const FIELD_LABEL_STYLES = "text-[10px] uppercase tracking-wider text-tertiary font-medium mb-0.5"

/** Chevron icon size */
const CHEVRON_SIZE = "size-4"

/** Maximum visible actions in mobile card */
const MAX_VISIBLE_ACTIONS = 3

// ==============================================================================
// TYPES
// ==============================================================================

/**
 * Configuration for a single field displayed in the mobile card grid
 */
export interface MobileCardField {
  /** Field label displayed above the value */
  label: string
  /** Field value - can be text, number, or React node (badges, icons, etc.) */
  value: React.ReactNode
  /** Whether this is a primary field (shown with semibold text) */
  primary?: boolean
  /** Whether to span full width (2 columns) instead of 1 */
  fullWidth?: boolean
  /** Additional className for custom styling */
  className?: string
}

/**
 * Props for the DataTableMobileCard component
 */
export interface DataTableMobileCardProps<T = unknown>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Card title - typically the primary identifier */
  title: React.ReactNode
  /** Card subtitle - secondary identifier (e.g., ID, code) */
  subtitle?: React.ReactNode
  /** Status badge or indicator element */
  status?: React.ReactNode
  /** Icon element to display before the title */
  icon?: React.ReactNode
  /** Array of fields to display in grid layout */
  fields?: MobileCardField[]
  /** Row data for action handlers */
  row?: T
  /** Actions array or custom React node */
  actions?: ActionItem<T>[] | React.ReactNode
  /** User context for action permission checks */
  user?: unknown
  /** Click handler for the entire card */
  onTap?: () => void
  /** Children for custom content below fields */
  children?: React.ReactNode
  /** Show chevron indicator for tappable cards (default: true) */
  showChevron?: boolean
}

// ==============================================================================
// HELPER FUNCTIONS
// ==============================================================================

/**
 * Creates a keyboard event handler for accessible card interaction
 * Triggers onTap when Enter or Space is pressed
 */
function createKeyboardHandler(
  onTap?: () => void
): React.KeyboardEventHandler<HTMLDivElement> | undefined {
  if (!onTap) return undefined

  return (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onTap()
    }
  }
}

// ==============================================================================
// SUB-COMPONENTS
// ==============================================================================

/**
 * Renders the header section with icon, title, subtitle, status, and chevron
 */
interface CardHeaderProps {
  icon?: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  status?: React.ReactNode
  showChevron: boolean
  isTappable: boolean
}

function CardHeader({
  icon,
  title,
  subtitle,
  status,
  showChevron,
  isTappable,
}: CardHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Icon (optional) */}
      {icon && <div className="flex-shrink-0 text-secondary">{icon}</div>}

      {/* Title & Subtitle - left aligned, takes remaining space */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-primary text-sm truncate">{title}</h3>
        </div>
        {subtitle && (
          <p className="text-xs text-tertiary font-mono truncate">{subtitle}</p>
        )}
      </div>

      {/* Status Badge - right aligned */}
      {status && <div className="flex-shrink-0">{status}</div>}

      {/* Chevron indicator for tappable cards */}
      {isTappable && showChevron && (
        <ChevronRight
          className={cn(CHEVRON_SIZE, "text-tertiary flex-shrink-0")}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

/**
 * Renders a single field in the grid layout
 */
interface FieldItemProps {
  field: MobileCardField
}

function FieldItem({ field }: FieldItemProps) {
  return (
    <div
      className={cn("min-w-0", field.fullWidth && "col-span-2", field.className)}
    >
      {/* Label - small, muted, uppercase like table headers */}
      <p className={FIELD_LABEL_STYLES}>{field.label}</p>
      {/* Value - matches table cell styling */}
      <div
        className={cn(
          "text-sm truncate",
          field.primary ? "font-semibold text-primary" : "text-primary"
        )}
      >
        {field.value}
      </div>
    </div>
  )
}

/**
 * Renders the fields grid section
 */
interface FieldsGridProps {
  fields: MobileCardField[]
}

function FieldsGrid({ fields }: FieldsGridProps) {
  if (fields.length === 0) return null

  return (
    <div className={FIELD_GRID_STYLES}>
      {fields.map((field, index) => (
        <FieldItem key={index} field={field} />
      ))}
    </div>
  )
}

/**
 * Renders the actions section
 */
interface ActionsRowProps<T> {
  actions: ActionItem<T>[] | React.ReactNode
  row?: T
  user?: unknown
}

function ActionsRow<T>({ actions, row, user }: ActionsRowProps<T>) {
  const isActionsArray = Array.isArray(actions)

  return (
    <div className="mt-3 pt-3 border-t border-subtle">
      {isActionsArray && row ? (
        <DataTableActions
          actions={actions as ActionItem<T>[]}
          row={row}
          user={user}
          layout="horizontal"
          size="sm"
          showLabels
          provideTooltip={false}
          maxVisible={MAX_VISIBLE_ACTIONS}
        />
      ) : !isActionsArray ? (
        <div className="flex items-center justify-end gap-2">{actions}</div>
      ) : null}
    </div>
  )
}

// ==============================================================================
// COMPONENTS
// ==============================================================================

/**
 * DataTableMobileCard - Table row transformed into a mobile-friendly card format
 *
 * Designed to look like a table row converted to a card format.
 * Maintains visual consistency with desktop DataTable:
 * - Left border for priority/severity indication (via className)
 * - Compact horizontal layout with touch-optimized spacing
 * - Table-like field grid with label/value pairs
 * - Same status badges and action buttons as desktop
 *
 * @component MOLECULE
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
  ...props
}: DataTableMobileCardProps<T>) {
  const isTappable = Boolean(onTap)

  return (
    <div
      data-slot="data-table-mobile-card"
      role={isTappable ? "button" : undefined}
      tabIndex={isTappable ? 0 : undefined}
      onClick={onTap}
      onKeyDown={createKeyboardHandler(onTap)}
      className={cn(
        BASE_CARD_STYLES,
        CARD_PADDING,
        isTappable && INTERACTIVE_STYLES,
        className
      )}
      {...props}
    >
      {/* Row 1: Header - Title, Subtitle, Status, Chevron */}
      <CardHeader
        icon={icon}
        title={title}
        subtitle={subtitle}
        status={status}
        showChevron={showChevron}
        isTappable={isTappable}
      />

      {/* Row 2: Fields Grid - compact table-like layout */}
      {fields && fields.length > 0 && <FieldsGrid fields={fields} />}

      {/* Custom Content */}
      {children}

      {/* Row 3: Actions - separated by border, full width */}
      {actions && <ActionsRow actions={actions} row={row} user={user} />}
    </div>
  )
}

DataTableMobileCard.displayName = "DataTableMobileCard"

export default DataTableMobileCard
