"use client"

/**
 * @file IncidentManagementTable.tsx
 * @description Complete incident management data table with responsive design
 */

import * as React from "react"
import { useState, useCallback, useMemo } from "react"
import { Pencil, Trash2, Rocket } from "lucide-react"
import { DataTable, type ColumnDef, type RowPriority } from "../DataTable"
import { DataTableSeverity } from "./DataTableSeverity"
import { DataTableMobileCard } from "./DataTableMobileCard"
import {
  IncidentStatusBadge,
  type IncidentStatus,
  type IncidentSeverity,
} from "./IncidentStatusBadge"
import { CopyableId } from "./CopyableId"
import { TruncatedText } from "./TruncatedText"
import { ActionTile } from "../ActionTile"
import { Tooltip, TooltipTrigger, TooltipContent } from "../tooltip"
import { Pagination } from "../Pagination"
import {
  NextStepButton,
  type NextStepSeverity,
} from "../../../flow/components/next-step-button"
import { cn } from "../../../lib/utils"
import { formatAge, getAgingStyles } from "../../../lib/date-utils"
import { useIsMobile } from "../../../hooks/useIsMobile"

// ============== CONSTANTS ==============

/** Data slot attribute for testing */
const DATA_SLOT = "incident-management-table"

/** Column widths for fixed-width columns */
const COLUMN_WIDTHS = {
  id: "190px",
  location: "220px",
  reporter: "140px",
  status: "145px",
  severity: "115px",
  age: "100px",
  actions: "155px",
} as const

/** Severity level to display configuration mapping */
const SEVERITY_DISPLAY_MAP = {
  critical: { level: "critical" as const, label: "Critical" },
  high: { level: "high" as const, label: "High" },
  medium: { level: "medium" as const, label: "Medium" },
  low: { level: "low" as const, label: "Low" },
  none: { level: "none" as const, label: "None" },
} as const

/** Severity sort order for column sorting (higher = more severe) */
const SEVERITY_SORT_ORDER: Record<IncidentSeverity, number> = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  none: 1,
}

/** Priority-based left border styles for rows */
const PRIORITY_BORDER_CLASSES: Record<string, string> = {
  critical: "border-l-4 border-l-error",
  high: "border-l-4 border-l-aging",
  medium: "border-l-4 border-l-warning",
  low: "border-l-4 border-l-success",
  none: "border-l-4 border-l-info",
  draft: "border-l-4 border-l-secondary border-dashed",
}

/** Legend item configuration */
const LEGEND_ITEMS = [
  { color: "bg-error", label: "Critical" },
  { color: "bg-aging", label: "High" },
  { color: "bg-warning", label: "Medium" },
  { color: "bg-success", label: "Low" },
  { color: "bg-info", label: "None" },
] as const

/** Draft legend item (special case with dashed border) */
const DRAFT_LEGEND_STYLES = "border border-dashed border-default bg-muted-bg"

/** Legend text styling */
const LEGEND_TEXT_SIZE = "text-xs"

/** Legend color swatch size */
const LEGEND_SWATCH_SIZE = "w-3 h-3"

/** Legend swatch border radius */
const LEGEND_SWATCH_RADIUS = "rounded-sm"

/** Mobile card gap */
const MOBILE_CARD_GAP = "gap-3"

/** Tooltip offset from trigger */
const TOOLTIP_OFFSET_PX = 4

/** Icon size class for action buttons */
const ACTION_ICON_SIZE = "size-4"

// ============== TYPES ==============

/**
 * Incident data structure for table rows
 */
export interface Incident {
  /** Unique internal identifier */
  id: string
  /** Human-readable incident ID (e.g., INC-XXXX) */
  incidentId: string
  /** Incident title/summary */
  title: string
  /** Location where incident occurred */
  location: string
  /** Name of person who reported the incident */
  reporter: string
  /** Row priority for border styling */
  priority: RowPriority
  /** Incident severity level */
  severity: IncidentSeverity
  /** Current workflow status */
  status: IncidentStatus
  /** Number of days since incident was created */
  ageDays: number
  /** Whether the incident is past its due date */
  overdue?: boolean
}

/**
 * Props for IncidentManagementTable component
 */
export interface IncidentManagementTableProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onSubmit"> {
  /** Incident data to display */
  data: Incident[]
  /** Callback when navigating to a location */
  onLocationClick?: (location: string) => void
  /** Callback when navigating to a reporter profile */
  onReporterClick?: (reporter: string) => void
  /** Callback for next step action */
  onNextStep?: (id: string) => void
  /** Callback for submit draft action */
  onSubmit?: (id: string) => void
  /** Callback for edit action */
  onEdit?: (id: string) => void
  /** Callback for delete action */
  onDelete?: (id: string) => void
  /** Callback when navigating to incident detail (mobile) */
  onIncidentClick?: (id: string) => void
  /** Callback for bulk delete */
  onBulkDelete?: (ids: string[]) => void
  /** Hide the priority legend */
  hideLegend?: boolean
  /** Hide the bulk actions panel */
  hideBulkActions?: boolean
  /** Enable pagination footer inside table */
  pagination?: boolean
  /** Current page (1-indexed) */
  currentPage?: number
  /** Total number of items (for pagination) */
  totalItems?: number
  /** Number of items per page */
  pageSize?: number
  /** Callback when page changes */
  onPageChange?: (page: number) => void
  /** Callback when page size changes */
  onPageSizeChange?: (pageSize: number) => void
  /** Available page sizes */
  pageSizeOptions?: number[]
}

// ============== DEFENSIVE VALIDATION ==============

/** Valid severity values */
const VALID_SEVERITIES: IncidentSeverity[] = ["critical", "high", "medium", "low", "none"]

/** Valid status values */
const VALID_STATUSES: IncidentStatus[] = ["draft", "reported", "investigation", "review", "closed"]

/** Valid priority values */
const VALID_PRIORITIES: RowPriority[] = ["critical", "high", "medium", "low", "none", "draft"]

/**
 * 🛡️ DEFENSIVE: Validates if a severity value is valid
 * Protects against adapter returning wrong types (e.g., numbers instead of strings)
 */
function isValidSeverity(value: unknown): value is IncidentSeverity {
  return typeof value === "string" && VALID_SEVERITIES.includes(value as IncidentSeverity)
}

/**
 * 🛡️ DEFENSIVE: Validates if a status value is valid
 */
function isValidStatus(value: unknown): value is IncidentStatus {
  return typeof value === "string" && VALID_STATUSES.includes(value as IncidentStatus)
}

/**
 * 🛡️ DEFENSIVE: Validates if a priority value is valid
 */
function isValidPriority(value: unknown): value is RowPriority {
  return typeof value === "string" && VALID_PRIORITIES.includes(value as RowPriority)
}

/**
 * 🛡️ DEFENSIVE: Validates if a string value is valid (not [object Object])
 */
function isValidString(value: unknown): value is string {
  return typeof value === "string" && !value.includes("[object")
}

/**
 * 🛡️ DEFENSIVE: Validates if age is a valid number
 */
function isValidAge(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value) && Number.isFinite(value)
}

// ============== HELPER FUNCTIONS ==============

/**
 * Maps row priority to NextStepButton severity
 * 🛡️ DEFENSIVE: Returns safe default if priority is invalid
 */
function mapPriorityToNextStepSeverity(priority: RowPriority): NextStepSeverity {
  if (!isValidPriority(priority)) return "medium" // Safe default
  if (priority === "critical") return "critical"
  if (priority === "high") return "high"
  if (priority === "medium") return "medium"
  if (priority === "low") return "low"
  return "none"
}

/**
 * Gets the CSS class for priority-based row border
 * 🛡️ DEFENSIVE: Returns empty string if priority is invalid
 */
function getPriorityBorderClass(priority: RowPriority): string {
  if (!isValidPriority(priority)) return ""
  return priority ? PRIORITY_BORDER_CLASSES[priority] || "" : ""
}

// ============== SUB-COMPONENTS ==============

/**
 * Data error indicator for invalid values
 * Shows a clear error state so consumers know their adapter needs fixing
 * @internal
 */
interface DataErrorProps {
  value: unknown
  field: string
}

function DataError({ value, field }: DataErrorProps) {
  const displayValue = typeof value === "object" ? "[object]" : String(value)
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-error bg-error-tint text-error text-xs font-mono"
      title={`Invalid ${field}: "${displayValue}" - Check your data adapter`}
    >
      <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
      {displayValue}
    </span>
  )
}
DataError.displayName = "DataError"

/**
 * Legend showing priority color indicators
 * @internal
 */
function PriorityLegend() {
  return (
    <div className={cn("flex flex-wrap gap-4", LEGEND_TEXT_SIZE)}>
      {LEGEND_ITEMS.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2">
          <span
            className={cn(LEGEND_SWATCH_SIZE, LEGEND_SWATCH_RADIUS, item.color)}
          />
          {item.label}
        </span>
      ))}
      <span className="inline-flex items-center gap-2">
        <span
          className={cn(
            LEGEND_SWATCH_SIZE,
            LEGEND_SWATCH_RADIUS,
            DRAFT_LEGEND_STYLES
          )}
        />
        Draft
      </span>
    </div>
  )
}
PriorityLegend.displayName = "PriorityLegend"

/**
 * Props for BulkActionsPanel component
 */
interface BulkActionsPanelProps {
  bulkActionsMode: boolean
  selectedCount: number
  onToggleMode: () => void
  onBulkDelete: () => void
}

/**
 * Panel for bulk action controls
 * @internal
 */
function BulkActionsPanel({
  bulkActionsMode,
  selectedCount,
  onToggleMode,
  onBulkDelete,
}: BulkActionsPanelProps) {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={onToggleMode}
        className={cn(
          "px-3 py-1.5 text-sm font-medium rounded-md border transition-colors",
          bulkActionsMode
            ? "bg-primary text-on-primary border-primary"
            : "bg-transparent text-secondary border-default hover:bg-muted-bg"
        )}
      >
        {bulkActionsMode ? "Exit Bulk Actions" : "Bulk Actions"}
      </button>

      {bulkActionsMode && selectedCount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-secondary">{selectedCount} selected</span>
          <button
            type="button"
            onClick={onBulkDelete}
            className="px-3 py-1.5 text-sm font-medium rounded-md bg-error text-on-status hover:bg-error/90 transition-colors"
          >
            Delete Selected
          </button>
        </div>
      )}
    </div>
  )
}
BulkActionsPanel.displayName = "BulkActionsPanel"

/**
 * Props for DraftActions component
 */
interface DraftActionsProps {
  incidentId: string
  onSubmit?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  stopPropagation?: boolean
}

/**
 * Action buttons for draft incidents (≤3 actions = visible per UX rule)
 * @internal
 */
function DraftActions({
  incidentId,
  onSubmit,
  onEdit,
  onDelete,
  stopPropagation = false,
}: DraftActionsProps) {
  const handleClick = (
    e: React.MouseEvent,
    callback?: (id: string) => void
  ) => {
    if (stopPropagation) e.stopPropagation()
    callback?.(incidentId)
  }

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <ActionTile
            variant="success"
            appearance="filled"
            size="xs"
            onClick={(e) => handleClick(e, onSubmit)}
            aria-label="Submit incident"
          >
            <Rocket className={ACTION_ICON_SIZE} />
          </ActionTile>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={TOOLTIP_OFFSET_PX}>
          Submit incident
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <ActionTile
            variant="info"
            appearance="filled"
            size="xs"
            onClick={(e) => handleClick(e, onEdit)}
            aria-label="Edit incident"
          >
            <Pencil className={ACTION_ICON_SIZE} />
          </ActionTile>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={TOOLTIP_OFFSET_PX}>
          Edit incident
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <ActionTile
            variant="destructive"
            appearance="filled"
            size="xs"
            onClick={(e) => handleClick(e, onDelete)}
            aria-label="Delete incident"
          >
            <Trash2 className={ACTION_ICON_SIZE} />
          </ActionTile>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={TOOLTIP_OFFSET_PX}>
          Delete draft
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
DraftActions.displayName = "DraftActions"

/**
 * Props for AgeBadge component
 */
interface AgeBadgeProps {
  ageDays: number
  overdue?: boolean
}

/**
 * Age display with overdue styling
 * 🛡️ DEFENSIVE: Handles NaN/invalid ages from broken adapters
 * @internal
 */
function AgeBadge({ ageDays, overdue }: AgeBadgeProps) {
  // 🛡️ DEFENSIVE: Check for invalid age values
  if (!isValidAge(ageDays)) {
    return <DataError value={ageDays} field="ageDays" />
  }

  const label = formatAge(ageDays)

  if (overdue) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error text-on-status text-xs font-bold tabular-nums overdue-pulse">
        {label}
      </span>
    )
  }

  return (
    <span className={cn("text-sm tabular-nums", getAgingStyles(ageDays))}>
      {label}
    </span>
  )
}
AgeBadge.displayName = "AgeBadge"

// ============== COMPONENTS ==============

/**
 * IncidentManagementTable - Complete incident management data table
 *
 * @component MOLECULE
 * @category Data Display
 *
 * A fully-featured table for managing EHS incidents with:
 * - Priority-based row borders (color-coded left border)
 * - Severity indicators with sort support
 * - Status badges showing workflow state
 * - Age tracking with overdue alerts (pulsing badge)
 * - Bulk actions for batch operations
 * - Mobile responsive card view with pagination
 * - Touch-friendly 44px targets on mobile (Fitts' Law)
 *
 * @example Basic Usage
 * ```tsx
 * <IncidentManagementTable
 *   data={incidents}
 *   onNextStep={(id) => handleNextStep(id)}
 *   onEdit={(id) => navigateToEdit(id)}
 * />
 * ```
 *
 * @example With Pagination
 * ```tsx
 * <IncidentManagementTable
 *   data={incidents}
 *   pagination
 *   currentPage={page}
 *   totalItems={totalCount}
 *   pageSize={10}
 *   onPageChange={setPage}
 *   onBulkDelete={handleBulkDelete}
 * />
 * ```
 *
 * @testing
 * - `data-slot="incident-management-table"` - Root container
 * - Uses DataTable data-slots internally for table testing
 * - Uses DataTableMobileCard data-slots for mobile testing
 *
 * @accessibility
 * - All action buttons have aria-labels
 * - Tooltips provide additional context
 * - Keyboard navigation supported via DataTable
 * - Mobile cards support tap interaction
 */
export function IncidentManagementTable({
  data,
  onLocationClick,
  onReporterClick,
  onNextStep,
  onSubmit,
  onEdit,
  onDelete,
  onIncidentClick,
  onBulkDelete,
  hideLegend = false,
  hideBulkActions = false,
  className,
  pagination = false,
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
  ...props
}: IncidentManagementTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null)
  const [bulkActionsMode, setBulkActionsMode] = useState(false)
  const isMobile = useIsMobile()

  // Handlers with useCallback for stable references
  const handleLocationClick = useCallback(
    (location: string) => onLocationClick?.(location),
    [onLocationClick]
  )

  const handleReporterClick = useCallback(
    (reporter: string) => onReporterClick?.(reporter),
    [onReporterClick]
  )

  const handleToggleBulkMode = useCallback(() => {
    setBulkActionsMode((prev) => {
      if (prev) setSelectedRows(new Set())
      return !prev
    })
  }, [])

  const handleBulkDelete = useCallback(() => {
    if (onBulkDelete && selectedRows.size > 0) {
      onBulkDelete([...selectedRows])
    }
  }, [onBulkDelete, selectedRows])

  const handleSortChange = useCallback(
    (column: string, direction: "asc" | "desc" | null) => {
      setSortColumn(direction ? column : null)
      setSortDirection(direction)
    },
    []
  )

  // Column definitions
  const incidentColumns: ColumnDef<Incident>[] = useMemo(
    () => [
      {
        id: "incidentId",
        header: "ID",
        accessor: (row) => <CopyableId id={row.incidentId} />,
        sortable: true,
        sortValue: (row) => row.incidentId,
        width: COLUMN_WIDTHS.id,
        cellClassName: "whitespace-nowrap",
      },
      {
        id: "title",
        header: "Title",
        accessor: (row) => (
          <TruncatedText className="font-medium">{row.title}</TruncatedText>
        ),
        sortable: true,
        sortValue: (row) => row.title.toLowerCase(),
        cellClassName: "overflow-hidden",
      },
      {
        id: "location",
        header: "Location",
        accessor: (row) => (
          <button
            type="button"
            onClick={() => handleLocationClick(row.location)}
            className="text-link hover:text-link-hover hover:underline transition-colors text-left"
          >
            {row.location}
          </button>
        ),
        sortable: true,
        sortValue: (row) => row.location.toLowerCase(),
        width: COLUMN_WIDTHS.location,
        cellClassName: "whitespace-nowrap",
      },
      {
        id: "reporter",
        header: "Reporter",
        accessor: (row) => {
          // 🛡️ DEFENSIVE: Handle [object Object] or invalid reporter values
          if (!isValidString(row.reporter)) {
            return <DataError value={row.reporter} field="reporter" />
          }
          return (
            <button
              type="button"
              onClick={() => handleReporterClick(row.reporter)}
              className="text-link hover:text-link-hover hover:underline transition-colors text-left"
            >
              {row.reporter}
            </button>
          )
        },
        sortable: true,
        sortValue: (row) => isValidString(row.reporter) ? row.reporter.toLowerCase() : "",
        width: COLUMN_WIDTHS.reporter,
        cellClassName: "whitespace-nowrap",
      },
      {
        id: "status",
        header: "Status",
        accessor: (row) => {
          // 🛡️ DEFENSIVE: Handle invalid status values
          if (!isValidStatus(row.status)) {
            return <DataError value={row.status} field="status" />
          }
          return (
            <IncidentStatusBadge status={row.status} severity={row.severity} />
          )
        },
        sortable: true,
        sortValue: (row) => isValidStatus(row.status) ? row.status : "",
        width: COLUMN_WIDTHS.status,
        cellClassName: "whitespace-nowrap",
        align: "left",
      },
      {
        id: "severity",
        header: "Severity",
        accessor: (row) => {
          // 🛡️ DEFENSIVE: Handle invalid severity values (e.g., numbers)
          if (!isValidSeverity(row.severity)) {
            return <DataError value={row.severity} field="severity" />
          }
          return (
            <DataTableSeverity
              value={row.severity}
              mapping={SEVERITY_DISPLAY_MAP}
              size="sm"
              showLabel
            />
          )
        },
        sortable: true,
        sortValue: (row) => isValidSeverity(row.severity) ? SEVERITY_SORT_ORDER[row.severity] : 0,
        width: COLUMN_WIDTHS.severity,
        cellClassName: "whitespace-nowrap",
        align: "left",
      },
      {
        id: "age",
        header: "Age",
        accessor: (row) => <AgeBadge ageDays={row.ageDays} overdue={row.overdue} />,
        sortable: true,
        sortValue: (row) => row.ageDays,
        width: COLUMN_WIDTHS.age,
        cellClassName: "whitespace-nowrap",
        align: "center",
        headerClassName: "text-center",
      },
      {
        id: "actions",
        header: "Actions",
        accessor: (row) => {
          if (row.status === "draft") {
            return (
              <DraftActions
                incidentId={row.id}
                onSubmit={onSubmit}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )
          }
          return (
            <NextStepButton
              severity={mapPriorityToNextStepSeverity(row.priority)}
              size="sm"
              onClick={() => onNextStep?.(row.id)}
            />
          )
        },
        width: COLUMN_WIDTHS.actions,
        cellClassName: "whitespace-nowrap pr-4",
        align: "left",
        headerClassName: "pr-4",
      },
    ],
    [handleLocationClick, handleReporterClick, onSubmit, onEdit, onDelete, onNextStep]
  )

  // Mobile card renderer
  const renderMobileCard = useCallback(
    (incident: Incident) => {
      const mobileActions =
        incident.status === "draft" ? (
          <div className="flex items-center justify-end gap-2">
            <DraftActions
              incidentId={incident.id}
              onSubmit={onSubmit}
              onEdit={onEdit}
              onDelete={onDelete}
              stopPropagation
            />
          </div>
        ) : (
          <div className="flex justify-end">
            <NextStepButton
              severity={mapPriorityToNextStepSeverity(incident.priority)}
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onNextStep?.(incident.id)
              }}
            />
          </div>
        )

      return (
        <DataTableMobileCard
          key={incident.id}
          title={incident.title}
          subtitle={incident.incidentId}
          status={
            isValidStatus(incident.status) ? (
              <IncidentStatusBadge
                status={incident.status}
                severity={incident.severity}
              />
            ) : <DataError value={incident.status} field="status" />
          }
          fields={[
            { label: "Location", value: incident.location },
            {
              label: "Reporter",
              value: isValidString(incident.reporter)
                ? incident.reporter
                : <DataError value={incident.reporter} field="reporter" />
            },
            {
              label: "Severity",
              value: isValidSeverity(incident.severity) ? (
                <DataTableSeverity
                  value={incident.severity}
                  mapping={SEVERITY_DISPLAY_MAP}
                  size="sm"
                  showLabel
                />
              ) : <DataError value={incident.severity} field="severity" />,
            },
            {
              label: "Age",
              value: (
                <AgeBadge ageDays={incident.ageDays} overdue={incident.overdue} />
              ),
            },
          ]}
          actions={mobileActions}
          className={getPriorityBorderClass(incident.priority)}
          onTap={() => onIncidentClick?.(incident.id)}
          showChevron={false}
        />
      )
    },
    [onSubmit, onEdit, onDelete, onNextStep, onIncidentClick]
  )

  return (
    <div
      className={cn("space-y-4", className)}
      data-slot={DATA_SLOT}
      {...props}
    >
      {/* Legend */}
      {!hideLegend && <PriorityLegend />}

      {/* Bulk Actions Panel - hidden on mobile */}
      {!hideBulkActions && !isMobile && (
        <BulkActionsPanel
          bulkActionsMode={bulkActionsMode}
          selectedCount={selectedRows.size}
          onToggleMode={handleToggleBulkMode}
          onBulkDelete={handleBulkDelete}
        />
      )}

      {/* Mobile Card View */}
      {isMobile ? (
        <div className={cn("flex flex-col", MOBILE_CARD_GAP)}>
          {data.map(renderMobileCard)}

          {/* Mobile Pagination */}
          {pagination && totalItems && pageSize && currentPage && onPageChange && (
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={onPageChange}
              showPageSizeSelector={false}
              showResultsText={false}
              showFirstLastButtons={false}
              maxPageButtons={5}
              className="justify-center pt-2"
            />
          )}
        </div>
      ) : (
        /* Desktop Table View */
        <DataTable
          data={data}
          columns={incidentColumns}
          getRowId={(row) => row.id}
          selectable={bulkActionsMode}
          selectedRows={selectedRows}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          onSelectionChange={setSelectedRows}
          hoverable
          bordered
          getRowPriority={(row) => isValidPriority(row.priority) ? row.priority : "none"}
          pagination={pagination}
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  )
}
IncidentManagementTable.displayName = "IncidentManagementTable"

// ============== EXPORTS ==============

export default IncidentManagementTable
