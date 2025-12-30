"use client"

import * as React from "react"
import { useState, useMemo, useCallback } from "react"
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Minus,
} from "lucide-react"
import { cn } from "../../lib/utils"
import { Checkbox } from "./checkbox"
import { Skeleton } from "./Skeleton"
import { Pagination } from "./Pagination"

// =============================================================================
// TYPES
// =============================================================================

export type SortDirection = "asc" | "desc" | null

export interface ColumnDef<T> {
  /** Unique identifier for the column */
  id: string
  /** Header content */
  header: React.ReactNode
  /** Function to access the cell value */
  accessor: (row: T) => React.ReactNode
  /** Whether the column is sortable */
  sortable?: boolean
  /** Sort value accessor (for custom sorting) */
  sortValue?: (row: T) => string | number | Date | null
  /** Column width (CSS value) */
  width?: string
  /** Minimum width (CSS value) */
  minWidth?: string
  /** Maximum width (CSS value) */
  maxWidth?: string
  /** Text alignment */
  align?: "left" | "center" | "right"
  /** Whether the column is sticky */
  sticky?: "left" | "right"
  /** Additional cell className */
  cellClassName?: string
  /** Additional header className */
  headerClassName?: string
}

/**
 * Priority levels for row border styling (constant, ordered from highest to lowest):
 * - critical: Highest priority, red border
 * - high: Orange border
 * - medium: Amber border
 * - low: Green border
 * - none: Cyan border (unassigned severity)
 * - draft: Gray dashed border (unpublished)
 */
export type RowPriority = 'critical' | 'high' | 'medium' | 'low' | 'none' | 'draft' | null

export interface DataTableProps<T> {
  /** Array of data items */
  data: T[]
  /** Column definitions */
  columns: ColumnDef<T>[]
  /** Unique key accessor for each row */
  getRowId: (row: T) => string
  /** Whether rows are selectable */
  selectable?: boolean
  /** Selected row IDs */
  selectedRows?: Set<string>
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: Set<string>) => void
  /** Whether the header is sticky */
  stickyHeader?: boolean
  /** Maximum height (enables scrolling) */
  maxHeight?: string
  /** Loading state */
  loading?: boolean
  /** Number of skeleton rows to show when loading */
  loadingRows?: number
  /** Empty state content */
  emptyState?: React.ReactNode
  /** Callback when row is clicked */
  onRowClick?: (row: T) => void
  /** Current sort state */
  sortColumn?: string | null
  /** Current sort direction */
  sortDirection?: SortDirection
  /** Callback when sort changes */
  onSortChange?: (column: string, direction: SortDirection) => void
  /** Additional table className */
  className?: string
  /** Additional wrapper className */
  wrapperClassName?: string
  /** Additional header row className */
  headerRowClassName?: string
  /** Additional body row className */
  bodyRowClassName?: string
  /** Whether to show borders between rows */
  bordered?: boolean
  /** Whether to show striped rows */
  striped?: boolean
  /** Whether to highlight row on hover */
  hoverable?: boolean
  /** Compact mode (smaller padding) */
  compact?: boolean
  /** Function to determine row priority for colored left border */
  getRowPriority?: (row: T) => RowPriority
  /** Function to generate test ID for each row */
  getRowTestId?: (row: T) => string
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
// DATA TABLE COMPONENT
// =============================================================================

/**
 * DataTable - A reusable, generic data table component
 *
 * @component ORGANISM
 * @category Data Display
 *
 * Features:
 * - Sortable columns with visual indicators
 * - Row selection with checkboxes (select all, individual)
 * - Loading state with skeleton rows
 * - Empty state support
 * - Sticky header support
 * - Priority-based colored row borders
 * - Configurable column widths and alignment
 * - Keyboard navigation support
 *
 * @example
 * ```tsx
 * <DataTable
 *   data={users}
 *   columns={[
 *     { id: 'name', header: 'Name', accessor: (row) => row.name, sortable: true },
 *     { id: 'email', header: 'Email', accessor: (row) => row.email },
 *   ]}
 *   getRowId={(row) => row.id}
 *   selectable
 *   onSelectionChange={setSelectedIds}
 * />
 * ```
 *
 * @example With Priority Borders
 * ```tsx
 * <DataTable
 *   data={incidents}
 *   columns={columns}
 *   getRowId={(row) => row.id}
 *   getRowPriority={(row) => row.priority}
 *   selectable
 * />
 * ```
 *
 * @testing
 * Use data-slot attributes for testing:
 * - `data-slot="data-table-wrapper"` - Table wrapper container
 * - `data-slot="data-table"` - Table element
 * - `data-slot="data-table-header"` - Table header
 * - `data-slot="data-table-header-row"` - Header row
 * - `data-slot="data-table-body"` - Table body
 * - `data-slot="data-table-body-row"` - Body row (includes data-row-id and data-selected)
 * - `data-slot="data-table-empty-state"` - Empty state container
 *
 * @accessibility
 * - Sortable columns support keyboard navigation (Enter/Space)
 * - Clickable rows support keyboard navigation (Enter/Space)
 * - Checkboxes include aria-label for screen readers
 * - Sort state communicated via aria-sort attribute
 * - Select all checkbox shows indeterminate state when partially selected
 */
// Priority border color mapping - using CSS variables for dark mode support
// Colors match the severity scale: critical (red) → high (orange) → medium (amber) → low (green) → none (cyan)
// Border design: 4px left border (solid) + 1px bottom border (solid across all columns, fades to transparent in last column)
const PRIORITY_BORDER_COLORS: Record<Exclude<RowPriority, null>, { color: string; style: 'solid' | 'dashed' }> = {
  critical: { color: 'var(--color-error)', style: 'solid' },         // Red - highest priority
  high: { color: 'var(--color-aging)', style: 'solid' },             // Orange - urgent
  medium: { color: 'var(--color-warning)', style: 'solid' },         // Amber - standard
  low: { color: 'var(--color-success)', style: 'solid' },            // Green - low priority
  none: { color: 'var(--color-info)', style: 'solid' },              // Cyan - unassigned severity
  draft: { color: 'var(--border)', style: 'dashed' },                // Gray dashed - unpublished
}

export function DataTable<T>({
  data,
  columns,
  getRowId,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  stickyHeader = false,
  maxHeight,
  loading = false,
  loadingRows = 5,
  emptyState,
  onRowClick,
  sortColumn = null,
  sortDirection = null,
  onSortChange,
  className,
  wrapperClassName,
  headerRowClassName,
  bodyRowClassName,
  bordered = true,
  striped = false,
  hoverable = true,
  compact = false,
  getRowPriority,
  getRowTestId,
  // Pagination props
  pagination = false,
  currentPage = 1,
  totalItems,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50],
}: DataTableProps<T>) {
  // Local sort state (used if onSortChange is not provided)
  const [localSortColumn, setLocalSortColumn] = useState<string | null>(null)
  const [localSortDirection, setLocalSortDirection] = useState<SortDirection>(null)

  // Use controlled or local sort state
  const activeSortColumn = onSortChange ? sortColumn : localSortColumn
  const activeSortDirection = onSortChange ? sortDirection : localSortDirection

  // Handle sort click
  const handleSort = useCallback((columnId: string) => {
    const column = columns.find(c => c.id === columnId)
    if (!column?.sortable) return

    let newDirection: SortDirection = "asc"
    if (activeSortColumn === columnId) {
      if (activeSortDirection === "asc") newDirection = "desc"
      else if (activeSortDirection === "desc") newDirection = null
    }

    if (onSortChange) {
      onSortChange(columnId, newDirection)
    } else {
      setLocalSortColumn(newDirection ? columnId : null)
      setLocalSortDirection(newDirection)
    }
  }, [columns, activeSortColumn, activeSortDirection, onSortChange])

  // Always sort data internally based on active sort state
  // Works for both controlled (onSortChange provided) and uncontrolled modes
  const sortedData = useMemo(() => {
    if (!activeSortColumn || !activeSortDirection) {
      return data
    }

    const column = columns.find(c => c.id === activeSortColumn)
    if (!column) return data

    return [...data].sort((a, b) => {
      const valueA = column.sortValue ? column.sortValue(a) : column.accessor(a)
      const valueB = column.sortValue ? column.sortValue(b) : column.accessor(b)

      // Handle null values
      if (valueA == null && valueB == null) return 0
      if (valueA == null) return 1
      if (valueB == null) return -1

      // Compare values
      let comparison = 0
      if (typeof valueA === "string" && typeof valueB === "string") {
        comparison = valueA.localeCompare(valueB)
      } else if (valueA instanceof Date && valueB instanceof Date) {
        comparison = valueA.getTime() - valueB.getTime()
      } else {
        comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0
      }

      return activeSortDirection === "desc" ? -comparison : comparison
    })
  }, [data, columns, activeSortColumn, activeSortDirection])

  // Selection handlers
  const allRowIds = useMemo(() => new Set(data.map(getRowId)), [data, getRowId])
  const allSelected = allRowIds.size > 0 && [...allRowIds].every(id => selectedRows.has(id))
  const someSelected = [...allRowIds].some(id => selectedRows.has(id)) && !allSelected

  const handleSelectAll = useCallback((checked: boolean) => {
    if (!onSelectionChange) return
    if (checked) {
      onSelectionChange(allRowIds)
    } else {
      onSelectionChange(new Set())
    }
  }, [allRowIds, onSelectionChange])

  const handleSelectRow = useCallback((rowId: string, checked: boolean) => {
    if (!onSelectionChange) return
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(rowId)
    } else {
      newSelected.delete(rowId)
    }
    onSelectionChange(newSelected)
  }, [selectedRows, onSelectionChange])

  // Render sort indicator
  const renderSortIndicator = (columnId: string, sortable?: boolean) => {
    if (!sortable) return null

    const isActive = activeSortColumn === columnId
    const direction = isActive ? activeSortDirection : null

    return (
      <span className="ml-1 inline-flex flex-col">
        {direction === "asc" ? (
          <ChevronUp className="h-4 w-4 text-primary" />
        ) : direction === "desc" ? (
          <ChevronDown className="h-4 w-4 text-primary" />
        ) : (
          <ChevronsUpDown className="h-4 w-4 text-secondary" />
        )}
      </span>
    )
  }

  // Cell padding
  const cellPadding = compact ? "px-3 py-2" : "px-4 py-3"
  const headerPadding = compact ? "px-3 py-2" : "px-4 py-3"

  // Render loading skeleton
  if (loading) {
    return (
      <div className={cn("overflow-hidden rounded-xl border border-default shadow-md w-full min-w-0", wrapperClassName)} data-slot="data-table-wrapper">
        <div className="overflow-x-auto w-full" style={{ maxHeight }}>
          <table className={cn("w-full min-w-max", className)} style={{ borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'auto' }} data-slot="data-table">
            <thead
              className="border-b border-default"
              style={{
                background: 'linear-gradient(180deg, var(--color-surface) 0%, var(--color-surface) 20%, var(--color-surface-hover) 100%)',
              }}
              data-slot="data-table-header"
            >
              <tr className="shadow-[inset_0_-1px_0_0_var(--border)]" data-slot="data-table-header-row">
                {selectable && (
                  <th className={cn(headerPadding, "w-10 border-r border-default")}>
                    <Skeleton className="h-4 w-4" rounded="sm" />
                  </th>
                )}
                {columns.map((column, colIndex) => (
                  <th
                    key={column.id}
                    className={cn(
                      headerPadding,
                      "text-left text-sm font-medium text-secondary whitespace-nowrap",
                      colIndex < columns.length - 1 && "border-r border-default",
                      column.headerClassName
                    )}
                    style={{
                      width: column.width,
                      minWidth: column.minWidth || '80px',
                      maxWidth: column.maxWidth,
                    }}
                  >
                    <Skeleton className="h-4 w-20" rounded="sm" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-surface" data-slot="data-table-body">
              {Array.from({ length: loadingRows }).map((_, index) => (
                <tr
                  key={index}
                  className={cn(bordered && "border-t border-default")}
                  data-slot="data-table-body-row"
                >
                  {selectable && (
                    <td className={cn(cellPadding, "w-10")}>
                      <Skeleton className="h-4 w-4" rounded="sm" />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={cn(cellPadding, column.cellClassName)}
                      style={{
                        textAlign: column.align,
                        minWidth: column.minWidth || '80px',
                      }}
                    >
                      <Skeleton className="h-4 w-full max-w-[120px]" rounded="sm" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // Render empty state
  if (data.length === 0) {
    return (
      <div className={cn("overflow-hidden rounded-xl border border-default shadow-md w-full min-w-0", wrapperClassName)} data-slot="data-table-wrapper">
        <div className="overflow-x-auto w-full" style={{ maxHeight }}>
          <table className={cn("w-full min-w-max", className)} style={{ borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'auto' }} data-slot="data-table">
            <thead
              className={cn("border-b border-default", stickyHeader && "sticky top-0 z-10")}
              style={{
                background: 'linear-gradient(180deg, var(--color-surface) 0%, var(--color-surface) 20%, var(--color-surface-hover) 100%)',
              }}
              data-slot="data-table-header"
            >
              <tr className={cn("shadow-[inset_0_-1px_0_0_var(--border)]", headerRowClassName)} data-slot="data-table-header-row">
                {selectable && (
                  <th className={cn(headerPadding, "w-10 border-r border-default")}>
                    <Checkbox disabled />
                  </th>
                )}
                {columns.map((column, colIndex) => (
                  <th
                    key={column.id}
                    className={cn(
                      headerPadding,
                      "text-left text-sm font-medium text-secondary whitespace-nowrap",
                      colIndex < columns.length - 1 && "border-r border-default",
                      column.headerClassName
                    )}
                    style={{
                      width: column.width,
                      minWidth: column.minWidth || '80px',
                      maxWidth: column.maxWidth,
                    }}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>
        <div className="flex flex-col items-center justify-center py-12 bg-surface" data-slot="data-table-empty-state">
          {emptyState || (
            <>
              <div className="w-12 h-12 mb-4 rounded-full bg-muted-bg flex items-center justify-center">
                <Minus className="w-6 h-6 text-secondary" />
              </div>
              <p className="text-sm text-secondary">No data available</p>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("overflow-hidden rounded-xl border border-default shadow-md w-full min-w-0", wrapperClassName)} data-slot="data-table-wrapper">
      <div className="overflow-x-auto w-full" style={{ maxHeight }}>
        <table className={cn("w-full min-w-max", className)} style={{ borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'auto' }} data-slot="data-table">
          <thead
            className={cn(
              "border-b border-default",
              stickyHeader && "sticky top-0 z-10"
            )}
            style={{
              // Gradient background matching QuickFilter pattern
              background: 'linear-gradient(180deg, var(--color-surface) 0%, var(--color-surface) 20%, var(--color-surface-hover) 100%)',
            }}
            data-slot="data-table-header"
          >
            <tr className={cn("shadow-[inset_0_-1px_0_0_var(--border)]", headerRowClassName)} data-slot="data-table-header-row">
              {selectable && (
                <th className={cn(headerPadding, "w-10 border-r border-default")}>
                  <Checkbox
                    checked={allSelected}
                    // Show indeterminate state when some but not all selected
                    data-indeterminate={someSelected}
                    onCheckedChange={(checked) => handleSelectAll(checked === true)}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column, colIndex) => (
                <th
                  key={column.id}
                  className={cn(
                    headerPadding,
                    "text-left text-sm font-medium text-secondary whitespace-nowrap",
                    // Add right border separator except for last column
                    colIndex < columns.length - 1 && "border-r border-default",
                    column.sortable && "cursor-pointer select-none hover:text-primary transition-colors",
                    column.headerClassName
                  )}
                  style={{
                    width: column.width,
                    minWidth: column.minWidth || '80px', // Ensure minimum width to prevent collapse
                    maxWidth: column.maxWidth,
                  }}
                  onClick={() => column.sortable && handleSort(column.id)}
                  tabIndex={column.sortable ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (column.sortable && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault()
                      handleSort(column.id)
                    }
                  }}
                  aria-sort={
                    activeSortColumn === column.id
                      ? activeSortDirection === "asc"
                        ? "ascending"
                        : activeSortDirection === "desc"
                        ? "descending"
                        : "none"
                      : undefined
                  }
                >
                  <span className="inline-flex items-center">
                    {column.header}
                    {renderSortIndicator(column.id, column.sortable)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-surface" data-slot="data-table-body">
            {sortedData.map((row, index) => {
              const rowId = getRowId(row)
              const isSelected = selectedRows.has(rowId)
              const rowPriority = getRowPriority?.(row)
              const priorityBorderConfig = rowPriority ? PRIORITY_BORDER_COLORS[rowPriority] : null
              const isLastRow = index === sortedData.length - 1

              return (
                <tr
                  key={rowId}
                  className={cn(
                    "relative group/row",
                    striped && index % 2 === 1 && "bg-muted-bg/30",
                    // Refined hover: subtle background + inner glow effect
                    hoverable && "transition-all duration-150 ease-out",
                    isSelected && "bg-accent-bg",
                    onRowClick && "cursor-pointer",
                    bodyRowClassName
                  )}
                  data-slot="data-table-body-row"
                  data-row-id={rowId}
                  data-selected={isSelected ? 'true' : undefined}
                  data-testid={getRowTestId?.(row)}
                  data-hoverable={hoverable ? 'true' : undefined}
                  style={{
                    // Apply priority-colored left border using box-shadow (thinner: 4px)
                    boxShadow: priorityBorderConfig
                      ? `inset 4px 0 0 0 ${priorityBorderConfig.color}`
                      : undefined,
                  }}
                  onClick={() => onRowClick?.(row)}
                  role={onRowClick ? "button" : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (onRowClick && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault()
                      onRowClick(row)
                    }
                  }}
                >
                  {selectable && (
                    <td
                      className={cn(cellPadding, "w-10 relative")}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleSelectRow(rowId, checked === true)}
                        aria-label={`Select row ${rowId}`}
                      />
                      {/* Priority solid bottom border - spans this cell */}
                      {priorityBorderConfig && !isLastRow && (
                        <div
                          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
                          style={{ background: priorityBorderConfig.color }}
                          data-slot="priority-border"
                        />
                      )}
                      {/* Default bottom border for non-priority rows */}
                      {bordered && !isLastRow && !priorityBorderConfig && (
                        <div
                          className="absolute bottom-0 left-0 right-0 h-px bg-default pointer-events-none"
                        />
                      )}
                    </td>
                  )}
                  {columns.map((column, colIndex) => {
                    const isLastColumn = colIndex === columns.length - 1
                    return (
                      <td
                        key={column.id}
                        className={cn(
                          cellPadding,
                          "text-sm text-primary relative whitespace-nowrap",
                          column.cellClassName
                        )}
                        style={{
                          textAlign: column.align,
                          width: column.width,
                          minWidth: column.minWidth || '80px', // Ensure minimum width to prevent collapse
                          maxWidth: column.maxWidth,
                        }}
                      >
                        {column.accessor(row)}
                        {/* Priority bottom border: solid for all columns, gradient fade on last column */}
                        {priorityBorderConfig && !isLastRow && (
                          <div
                            className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
                            style={{
                              background: isLastColumn
                                ? `linear-gradient(to right, ${priorityBorderConfig.color} 0%, transparent 85%)`
                                : priorityBorderConfig.color,
                            }}
                            data-slot="priority-border"
                          />
                        )}
                        {/* Default bottom border for non-priority rows */}
                        {bordered && !isLastRow && !priorityBorderConfig && (
                          <div
                            className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
                            style={{
                              background: isLastColumn
                                ? 'linear-gradient(to right, var(--border) 0%, transparent 85%)'
                                : 'var(--border)',
                            }}
                          />
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      {pagination && onPageChange && (
        <div
          className="border-t border-default px-4 py-3"
          style={{
            background: 'linear-gradient(180deg, var(--color-surface) 0%, var(--color-surface) 20%, var(--color-surface-hover) 100%)',
          }}
          data-slot="data-table-pagination"
        >
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems ?? data.length}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            pageSizeOptions={pageSizeOptions}
            showPageSizeSelector={!!onPageSizeChange}
            showResultsText
            layout="row"
          />
        </div>
      )}
    </div>
  )
}

DataTable.displayName = "DataTable"

export default DataTable
