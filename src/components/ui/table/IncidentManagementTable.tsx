/**
 * IncidentManagementTable - Complete incident management data table
 *
 * A fully-featured table for managing EHS incidents with:
 * - Priority-based row borders
 * - Severity indicators
 * - Status badges
 * - Age tracking with overdue alerts
 * - Bulk actions
 * - Mobile responsive card view
 */

import * as React from 'react'
import { useState } from 'react'
import { Pencil, Trash2, Rocket } from 'lucide-react'
import { DataTable, type ColumnDef, type RowPriority } from '../DataTable'
import { DataTableSeverity } from './DataTableSeverity'
import { DataTableMobileCard } from './DataTableMobileCard'
import { IncidentStatusBadge, type IncidentStatus, type IncidentSeverity } from './IncidentStatusBadge'
import { CopyableId } from './CopyableId'
import { TruncatedText } from './TruncatedText'
import { ActionTile } from '../ActionTile'
import { Tooltip, TooltipTrigger, TooltipContent } from '../tooltip'
import { NextStepButton, type NextStepSeverity } from '../../../flow/components/next-step-button'
import { cn } from '../../../lib/utils'
import { formatAge, getAgingStyles } from '../../../lib/date-utils'
import { useIsMobile } from '../../../hooks/useIsMobile'

// =============================================================================
// TYPES
// =============================================================================

export interface Incident {
  id: string
  incidentId: string
  title: string
  location: string
  reporter: string
  priority: RowPriority
  severity: IncidentSeverity
  status: IncidentStatus
  ageDays: number
  overdue?: boolean
}

export interface IncidentManagementTableProps {
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
  /** Additional CSS classes */
  className?: string
  // Pagination props
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

// =============================================================================
// CONSTANTS
// =============================================================================

// Column widths for fixed-width columns (DataTable uses CSS width values)
const COLUMN_WIDTHS = {
  id: '190px',       // INC-XXXXXXXXXXXX + copy button + padding
  location: '220px', // Typical location names
  reporter: '140px', // Typical names
  status: '145px',   // Status badges + border padding
  severity: '115px', // Severity indicator + label (e.g., "Critical")
  age: '100px',      // Age badge
  actions: '140px',  // Action buttons + right padding
} as const

const INCIDENT_TABLE_SEVERITY_MAP = {
  critical: { level: 'critical' as const, label: 'Critical' },
  high: { level: 'high' as const, label: 'High' },
  medium: { level: 'medium' as const, label: 'Medium' },
  low: { level: 'low' as const, label: 'Low' },
  none: { level: 'none' as const, label: 'None' },
}

const SEVERITY_SORT_ORDER: Record<IncidentSeverity, number> = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  none: 1,
}

const PRIORITY_BORDER_MAP: Record<string, string> = {
  critical: 'border-l-4 border-l-error',
  high: 'border-l-4 border-l-aging',
  medium: 'border-l-4 border-l-warning',
  low: 'border-l-4 border-l-success',
  none: 'border-l-4 border-l-info',
  draft: 'border-l-4 border-l-secondary border-dashed',
}

// =============================================================================
// COMPONENT
// =============================================================================

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
  // Pagination props
  pagination = false,
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
}: IncidentManagementTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null)
  const [bulkActionsMode, setBulkActionsMode] = useState(false)
  const isMobile = useIsMobile()

  const handleLocationClick = (location: string) => {
    if (onLocationClick) {
      onLocationClick(location)
    }
  }

  const handleReporterClick = (reporter: string) => {
    if (onReporterClick) {
      onReporterClick(reporter)
    }
  }

  const incidentColumns: ColumnDef<Incident>[] = [
    {
      id: 'incidentId',
      header: 'ID',
      accessor: (row) => <CopyableId id={row.incidentId} />,
      sortable: true,
      sortValue: (row) => row.incidentId,
      width: COLUMN_WIDTHS.id,
      cellClassName: 'whitespace-nowrap',
    },
    {
      id: 'title',
      header: 'Title',
      accessor: (row) => (
        <TruncatedText className="font-medium">{row.title}</TruncatedText>
      ),
      sortable: true,
      sortValue: (row) => row.title.toLowerCase(),
      // FLEXIBLE COLUMN: No width = takes ALL remaining space after fixed columns
      cellClassName: 'overflow-hidden',
    },
    {
      id: 'location',
      header: 'Location',
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
      cellClassName: 'whitespace-nowrap',
    },
    {
      id: 'reporter',
      header: 'Reporter',
      accessor: (row) => (
        <button
          type="button"
          onClick={() => handleReporterClick(row.reporter)}
          className="text-link hover:text-link-hover hover:underline transition-colors text-left"
        >
          {row.reporter}
        </button>
      ),
      sortable: true,
      sortValue: (row) => row.reporter.toLowerCase(),
      width: COLUMN_WIDTHS.reporter,
      cellClassName: 'whitespace-nowrap',
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => <IncidentStatusBadge status={row.status} severity={row.severity} />,
      sortable: true,
      sortValue: (row) => row.status,
      width: COLUMN_WIDTHS.status,
      cellClassName: 'whitespace-nowrap',
      align: 'left',
    },
    {
      id: 'severity',
      header: 'Severity',
      accessor: (row) => (
        <DataTableSeverity
          value={row.severity}
          mapping={INCIDENT_TABLE_SEVERITY_MAP}
          size="sm"
          showLabel
        />
      ),
      sortable: true,
      sortValue: (row) => SEVERITY_SORT_ORDER[row.severity],
      width: COLUMN_WIDTHS.severity,
      cellClassName: 'whitespace-nowrap',
      align: 'left',
    },
    {
      id: 'age',
      header: 'Age',
      accessor: (row) => {
        const label = formatAge(row.ageDays)

        if (row.overdue) {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error text-on-status text-xs font-bold tabular-nums overdue-pulse">
              {label}
            </span>
          )
        }

        return (
          <span className={`text-sm tabular-nums ${getAgingStyles(row.ageDays)}`}>{label}</span>
        )
      },
      sortable: true,
      sortValue: (row) => row.ageDays,
      width: COLUMN_WIDTHS.age,
      cellClassName: 'whitespace-nowrap',
      align: 'center',
      headerClassName: 'text-center',
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row) => {
        const getSeverity = (priority: RowPriority): NextStepSeverity => {
          if (priority === 'critical') return 'critical'
          if (priority === 'high') return 'high'
          if (priority === 'medium') return 'medium'
          if (priority === 'low') return 'low'
          return 'none'
        }

        if (row.status === 'draft') {
          return (
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <ActionTile
                    variant="success"
                    appearance="filled"
                    size="xs"
                    onClick={() => { if (onSubmit) onSubmit(row.id) }}
                    aria-label="Submit incident"
                  >
                    <Rocket className="size-4" />
                  </ActionTile>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={4}>Submit incident</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ActionTile
                    variant="neutral"
                    appearance="filled"
                    size="xs"
                    onClick={() => { if (onEdit) onEdit(row.id) }}
                    aria-label="Edit incident"
                  >
                    <Pencil className="size-4" />
                  </ActionTile>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={4}>Edit incident</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ActionTile
                    variant="destructive"
                    appearance="filled"
                    size="xs"
                    onClick={() => { if (onDelete) onDelete(row.id) }}
                    aria-label="Delete incident"
                  >
                    <Trash2 className="size-4" />
                  </ActionTile>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={4}>Delete draft</TooltipContent>
              </Tooltip>
            </div>
          )
        }

        return (
          <NextStepButton
            severity={getSeverity(row.priority)}
            size="sm"
            onClick={() => {
              if (onNextStep) {
                onNextStep(row.id)
              }
            }}
          />
        )
      },
      width: COLUMN_WIDTHS.actions,
      cellClassName: 'whitespace-nowrap pr-4',
      align: 'left',
      headerClassName: 'pr-4',
    },
  ]

  const getPriorityBorderClass = (priority: RowPriority) => {
    return priority ? PRIORITY_BORDER_MAP[priority] || '' : ''
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Legend */}
      {!hideLegend && (
        <div className="flex flex-wrap gap-4 text-xs">
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-error" /> Critical
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-aging" /> High
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-warning" /> Medium
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-success" /> Low
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-info" /> None
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm border border-dashed border-default bg-muted-bg" /> Draft
          </span>
        </div>
      )}

      {/* Bulk Actions Panel - hidden on mobile */}
      {!hideBulkActions && !isMobile && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setBulkActionsMode(!bulkActionsMode)
              if (bulkActionsMode) setSelectedRows(new Set())
            }}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-md border transition-colors',
              bulkActionsMode
                ? 'bg-primary text-on-primary border-primary'
                : 'bg-transparent text-secondary border-default hover:bg-muted-bg'
            )}
          >
            {bulkActionsMode ? 'Exit Bulk Actions' : 'Bulk Actions'}
          </button>

          {bulkActionsMode && selectedRows.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary">{selectedRows.size} selected</span>
              <button
                type="button"
                onClick={() => {
                  const ids = [...selectedRows]
                  if (onBulkDelete) {
                    onBulkDelete(ids)
                  }
                }}
                className="px-3 py-1.5 text-sm font-medium rounded-md bg-error text-on-status hover:bg-error/90 transition-colors"
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mobile Card View */}
      {isMobile ? (
        <div className="space-y-3">
          {data.map((incident) => (
            <DataTableMobileCard
              key={incident.id}
              title={incident.title}
              subtitle={incident.incidentId}
              status={<IncidentStatusBadge status={incident.status} severity={incident.severity} />}
              fields={[
                { label: 'Location', value: incident.location },
                { label: 'Reporter', value: incident.reporter },
                {
                  label: 'Severity',
                  value: (
                    <DataTableSeverity
                      value={incident.severity}
                      mapping={INCIDENT_TABLE_SEVERITY_MAP}
                      size="sm"
                      showLabel
                    />
                  ),
                },
                {
                  label: 'Age',
                  value: incident.overdue ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error text-on-status text-xs font-bold">
                      {formatAge(incident.ageDays)}
                    </span>
                  ) : (
                    <span className="text-sm tabular-nums">{formatAge(incident.ageDays)}</span>
                  ),
                },
              ]}
              className={getPriorityBorderClass(incident.priority)}
              onTap={() => { if (onIncidentClick) onIncidentClick(incident.id) }}
            />
          ))}
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
          onSortChange={(column, direction) => {
            setSortColumn(direction ? column : null)
            setSortDirection(direction)
          }}
          onSelectionChange={setSelectedRows}
          hoverable
          bordered
          getRowPriority={(row) => row.priority}
          // Pagination props
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

export default IncidentManagementTable
