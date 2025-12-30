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

// ============== CONSTANTS ==============

/** Default number of skeleton rows shown during loading state */
const DEFAULT_LOADING_ROWS = 5

/** Default page size for pagination */
const DEFAULT_PAGE_SIZE = 10

/** Default available page size options */
const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 25, 50] as const

/** Default starting page (1-indexed) */
const DEFAULT_CURRENT_PAGE = 1

/** Minimum column width to prevent collapse */
const MIN_COLUMN_WIDTH = "80px"

/** Icon dimensions for sort indicators */
const SORT_ICON_SIZE = "h-4 w-4"

/** Skeleton dimensions for loading states */
const SKELETON_CHECKBOX_SIZE = "h-4 w-4"
const SKELETON_HEADER_WIDTH = "w-20"
const SKELETON_CELL_MAX_WIDTH = "max-w-[120px]"

/** Empty state icon dimensions */
const EMPTY_STATE_ICON_CONTAINER_SIZE = "w-12 h-12"
const EMPTY_STATE_ICON_SIZE = "w-6 h-6"

/** Cell padding classes */
const CELL_PADDING_COMPACT = "px-3 py-2"
const CELL_PADDING_DEFAULT = "px-4 py-3"

/** Checkbox column width */
const CHECKBOX_COLUMN_WIDTH = "w-10"

/** Priority border width using box-shadow inset */
const PRIORITY_BORDER_WIDTH_PX = 4

/** Data slot attribute values for testing */
const DATA_SLOTS = {
  wrapper: "data-table-wrapper",
  table: "data-table",
  header: "data-table-header",
  headerRow: "data-table-header-row",
  body: "data-table-body",
  bodyRow: "data-table-body-row",
  emptyState: "data-table-empty-state",
  pagination: "data-table-pagination",
  priorityBorder: "priority-border",
} as const

/**
 * Priority border color mapping using CSS variables for dark mode support.
 * Colors match the severity scale:
 * - critical (red) → high (orange) → medium (amber) → low (green) → none (cyan)
 * Border design: 4px left border (solid) + 1px bottom border (gradient fade)
 */
const PRIORITY_BORDER_COLORS: Record<
  Exclude<RowPriority, null>,
  { color: string; style: "solid" | "dashed" }
> = {
  critical: { color: "var(--color-error)", style: "solid" },
  high: { color: "var(--color-aging)", style: "solid" },
  medium: { color: "var(--color-warning)", style: "solid" },
  low: { color: "var(--color-success)", style: "solid" },
  none: { color: "var(--color-info)", style: "solid" },
  draft: { color: "var(--border)", style: "dashed" },
}

/** Header background gradient style */
const HEADER_GRADIENT_STYLE = {
  background:
    "linear-gradient(180deg, var(--color-surface) 0%, var(--color-surface) 20%, var(--color-surface-hover) 100%)",
} as const

/** Last column gradient fade percentage */
const GRADIENT_FADE_PERCENTAGE = "85%"

// ============== TYPES ==============

/** Sort direction for column sorting */
export type SortDirection = "asc" | "desc" | null

/** Column definition for the data table */
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
 * Priority levels for row border styling (ordered from highest to lowest):
 * - critical: Highest priority, red border
 * - high: Orange border
 * - medium: Amber border
 * - low: Green border
 * - none: Cyan border (unassigned severity)
 * - draft: Gray dashed border (unpublished)
 */
export type RowPriority =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "none"
  | "draft"
  | null

/** Props for the DataTable component */
export interface DataTableProps<T>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
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
  tableClassName?: string
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

/** Internal props for table header cell */
interface HeaderCellProps<T> {
  column: ColumnDef<T>
  colIndex: number
  columnsLength: number
  headerPadding: string
  activeSortColumn: string | null
  activeSortDirection: SortDirection
  onSort: (columnId: string) => void
}

/** Internal props for table body row */
interface BodyRowProps<T> {
  row: T
  index: number
  columns: ColumnDef<T>[]
  rowId: string
  isSelected: boolean
  isLastRow: boolean
  priorityBorderConfig: { color: string; style: "solid" | "dashed" } | null
  cellPadding: string
  striped: boolean
  hoverable: boolean
  bordered: boolean
  selectable: boolean
  bodyRowClassName?: string
  getRowTestId?: (row: T) => string
  onRowClick?: (row: T) => void
  onSelectRow: (rowId: string, checked: boolean) => void
}

// ============== HELPER FUNCTIONS ==============

/**
 * Compares two values for sorting.
 * Handles null values, strings, dates, and numbers.
 */
function compareValues(
  valueA: string | number | Date | null | React.ReactNode,
  valueB: string | number | Date | null | React.ReactNode
): number {
  if (valueA == null && valueB == null) return 0
  if (valueA == null) return 1
  if (valueB == null) return -1

  if (typeof valueA === "string" && typeof valueB === "string") {
    return valueA.localeCompare(valueB)
  }
  if (valueA instanceof Date && valueB instanceof Date) {
    return valueA.getTime() - valueB.getTime()
  }
  return valueA < valueB ? -1 : valueA > valueB ? 1 : 0
}

/**
 * Sorts data array by specified column and direction.
 * Returns original array if no sort is active.
 */
function sortData<T>(
  data: T[],
  columns: ColumnDef<T>[],
  sortColumn: string | null,
  sortDirection: SortDirection
): T[] {
  if (!sortColumn || !sortDirection) return data

  const column = columns.find((c) => c.id === sortColumn)
  if (!column) return data

  return [...data].sort((a, b) => {
    const valueA = column.sortValue ? column.sortValue(a) : column.accessor(a)
    const valueB = column.sortValue ? column.sortValue(b) : column.accessor(b)
    const comparison = compareValues(valueA, valueB)
    return sortDirection === "desc" ? -comparison : comparison
  })
}

/**
 * Calculates the next sort direction in the cycle: null → asc → desc → null
 */
function getNextSortDirection(
  columnId: string,
  currentColumn: string | null,
  currentDirection: SortDirection
): SortDirection {
  if (currentColumn !== columnId) return "asc"
  if (currentDirection === "asc") return "desc"
  if (currentDirection === "desc") return null
  return "asc"
}

/**
 * Generates gradient background style for priority borders on last column.
 */
function getLastColumnGradient(color: string): string {
  return `linear-gradient(to right, ${color} 0%, transparent ${GRADIENT_FADE_PERCENTAGE})`
}

/**
 * Generates default border gradient for last column.
 */
function getDefaultLastColumnGradient(): string {
  return `linear-gradient(to right, var(--border) 0%, transparent ${GRADIENT_FADE_PERCENTAGE})`
}

// ============== COMPONENTS ==============

/**
 * SortIndicator - Renders the sort direction icon for sortable columns.
 * @internal
 */
function SortIndicator({
  columnId,
  sortable,
  activeSortColumn,
  activeSortDirection,
}: {
  columnId: string
  sortable?: boolean
  activeSortColumn: string | null
  activeSortDirection: SortDirection
}) {
  if (!sortable) return null

  const isActive = activeSortColumn === columnId
  const direction = isActive ? activeSortDirection : null

  return (
    <span className="ml-1 inline-flex flex-col">
      {direction === "asc" ? (
        <ChevronUp className={cn(SORT_ICON_SIZE, "text-primary")} />
      ) : direction === "desc" ? (
        <ChevronDown className={cn(SORT_ICON_SIZE, "text-primary")} />
      ) : (
        <ChevronsUpDown className={cn(SORT_ICON_SIZE, "text-secondary")} />
      )}
    </span>
  )
}
SortIndicator.displayName = "SortIndicator"

/**
 * TableHeaderCell - Renders a single header cell with sort support.
 * @internal
 */
function TableHeaderCell<T>({
  column,
  colIndex,
  columnsLength,
  headerPadding,
  activeSortColumn,
  activeSortDirection,
  onSort,
}: HeaderCellProps<T>) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (column.sortable && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault()
      onSort(column.id)
    }
  }

  return (
    <th
      key={column.id}
      className={cn(
        headerPadding,
        "text-left text-sm font-medium text-secondary whitespace-nowrap",
        colIndex < columnsLength - 1 && "border-r border-default",
        column.sortable &&
          "cursor-pointer select-none hover:text-primary transition-colors",
        column.headerClassName
      )}
      style={{
        width: column.width,
        minWidth: column.minWidth || MIN_COLUMN_WIDTH,
        maxWidth: column.maxWidth,
      }}
      onClick={() => column.sortable && onSort(column.id)}
      tabIndex={column.sortable ? 0 : undefined}
      onKeyDown={handleKeyDown}
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
        <SortIndicator
          columnId={column.id}
          sortable={column.sortable}
          activeSortColumn={activeSortColumn}
          activeSortDirection={activeSortDirection}
        />
      </span>
    </th>
  )
}
TableHeaderCell.displayName = "TableHeaderCell"

/**
 * PriorityBorderOverlay - Renders the priority or default bottom border for cells.
 * @internal
 */
function PriorityBorderOverlay({
  priorityConfig,
  isLastColumn,
  isLastRow,
  bordered,
}: {
  priorityConfig: { color: string; style: "solid" | "dashed" } | null
  isLastColumn: boolean
  isLastRow: boolean
  bordered: boolean
}) {
  if (isLastRow) return null

  if (priorityConfig) {
    return (
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: isLastColumn
            ? getLastColumnGradient(priorityConfig.color)
            : priorityConfig.color,
        }}
        data-slot={DATA_SLOTS.priorityBorder}
      />
    )
  }

  if (bordered) {
    return (
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: isLastColumn
            ? getDefaultLastColumnGradient()
            : "var(--border)",
        }}
      />
    )
  }

  return null
}
PriorityBorderOverlay.displayName = "PriorityBorderOverlay"

/**
 * TableBodyCell - Renders a single body cell with content and borders.
 * @internal
 */
function TableBodyCell<T>({
  column,
  row,
  colIndex,
  columnsLength,
  cellPadding,
  priorityBorderConfig,
  isLastRow,
  bordered,
}: {
  column: ColumnDef<T>
  row: T
  colIndex: number
  columnsLength: number
  cellPadding: string
  priorityBorderConfig: { color: string; style: "solid" | "dashed" } | null
  isLastRow: boolean
  bordered: boolean
}) {
  const isLastColumn = colIndex === columnsLength - 1

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
        minWidth: column.minWidth || MIN_COLUMN_WIDTH,
        maxWidth: column.maxWidth,
      }}
    >
      {column.accessor(row)}
      <PriorityBorderOverlay
        priorityConfig={priorityBorderConfig}
        isLastColumn={isLastColumn}
        isLastRow={isLastRow}
        bordered={bordered}
      />
    </td>
  )
}
TableBodyCell.displayName = "TableBodyCell"

/**
 * SelectionCheckboxCell - Renders the checkbox cell for row selection.
 * @internal
 */
function SelectionCheckboxCell({
  rowId,
  isSelected,
  cellPadding,
  priorityBorderConfig,
  isLastRow,
  bordered,
  onSelectRow,
}: {
  rowId: string
  isSelected: boolean
  cellPadding: string
  priorityBorderConfig: { color: string; style: "solid" | "dashed" } | null
  isLastRow: boolean
  bordered: boolean
  onSelectRow: (rowId: string, checked: boolean) => void
}) {
  return (
    <td
      className={cn(cellPadding, CHECKBOX_COLUMN_WIDTH, "relative")}
      onClick={(e) => e.stopPropagation()}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={(checked) => onSelectRow(rowId, checked === true)}
        aria-label={`Select row ${rowId}`}
      />
      <PriorityBorderOverlay
        priorityConfig={priorityBorderConfig}
        isLastColumn={false}
        isLastRow={isLastRow}
        bordered={bordered}
      />
    </td>
  )
}
SelectionCheckboxCell.displayName = "SelectionCheckboxCell"

/**
 * TableBodyRow - Renders a single data row with all cells.
 * @internal
 */
function TableBodyRow<T>({
  row,
  index,
  columns,
  rowId,
  isSelected,
  isLastRow,
  priorityBorderConfig,
  cellPadding,
  striped,
  hoverable,
  bordered,
  selectable,
  bodyRowClassName,
  getRowTestId,
  onRowClick,
  onSelectRow,
}: BodyRowProps<T>) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onRowClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault()
      onRowClick(row)
    }
  }

  return (
    <tr
      key={rowId}
      className={cn(
        "relative group/row",
        striped && index % 2 === 1 && "bg-muted-bg/30",
        hoverable && "transition-all duration-150 ease-out",
        isSelected && "bg-accent-bg",
        onRowClick && "cursor-pointer",
        bodyRowClassName
      )}
      data-slot={DATA_SLOTS.bodyRow}
      data-row-id={rowId}
      data-selected={isSelected ? "true" : undefined}
      data-testid={getRowTestId?.(row)}
      data-hoverable={hoverable ? "true" : undefined}
      style={{
        boxShadow: priorityBorderConfig
          ? `inset ${PRIORITY_BORDER_WIDTH_PX}px 0 0 0 ${priorityBorderConfig.color}`
          : undefined,
      }}
      onClick={() => onRowClick?.(row)}
      role={onRowClick ? "button" : undefined}
      tabIndex={onRowClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
    >
      {selectable && (
        <SelectionCheckboxCell
          rowId={rowId}
          isSelected={isSelected}
          cellPadding={cellPadding}
          priorityBorderConfig={priorityBorderConfig}
          isLastRow={isLastRow}
          bordered={bordered}
          onSelectRow={onSelectRow}
        />
      )}
      {columns.map((column, colIndex) => (
        <TableBodyCell
          key={column.id}
          column={column}
          row={row}
          colIndex={colIndex}
          columnsLength={columns.length}
          cellPadding={cellPadding}
          priorityBorderConfig={priorityBorderConfig}
          isLastRow={isLastRow}
          bordered={bordered}
        />
      ))}
    </tr>
  )
}
TableBodyRow.displayName = "TableBodyRow"

/**
 * LoadingState - Renders skeleton loading state for the table.
 * @internal
 */
function LoadingState<T>({
  columns,
  loadingRows,
  selectable,
  headerPadding,
  cellPadding,
  bordered,
  wrapperClassName,
  tableClassName,
  maxHeight,
}: {
  columns: ColumnDef<T>[]
  loadingRows: number
  selectable: boolean
  headerPadding: string
  cellPadding: string
  bordered: boolean
  wrapperClassName?: string
  tableClassName?: string
  maxHeight?: string
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-default shadow-md w-full min-w-0",
        wrapperClassName
      )}
      data-slot={DATA_SLOTS.wrapper}
    >
      <div className="overflow-x-auto w-full" style={{ maxHeight }}>
        <table
          className={cn("w-full min-w-max", tableClassName)}
          style={{ borderCollapse: "separate", borderSpacing: 0, tableLayout: "auto" }}
          data-slot={DATA_SLOTS.table}
        >
          <thead
            className="border-b border-default"
            style={HEADER_GRADIENT_STYLE}
            data-slot={DATA_SLOTS.header}
          >
            <tr
              className="shadow-[inset_0_-1px_0_0_var(--border)]"
              data-slot={DATA_SLOTS.headerRow}
            >
              {selectable && (
                <th className={cn(headerPadding, CHECKBOX_COLUMN_WIDTH, "border-r border-default")}>
                  <Skeleton className={SKELETON_CHECKBOX_SIZE} rounded="sm" />
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
                    minWidth: column.minWidth || MIN_COLUMN_WIDTH,
                    maxWidth: column.maxWidth,
                  }}
                >
                  <Skeleton className={cn("h-4", SKELETON_HEADER_WIDTH)} rounded="sm" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-surface" data-slot={DATA_SLOTS.body}>
            {Array.from({ length: loadingRows }).map((_, index) => (
              <tr
                key={index}
                className={cn(bordered && "border-t border-default")}
                data-slot={DATA_SLOTS.bodyRow}
              >
                {selectable && (
                  <td className={cn(cellPadding, CHECKBOX_COLUMN_WIDTH)}>
                    <Skeleton className={SKELETON_CHECKBOX_SIZE} rounded="sm" />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn(cellPadding, column.cellClassName)}
                    style={{
                      textAlign: column.align,
                      minWidth: column.minWidth || MIN_COLUMN_WIDTH,
                    }}
                  >
                    <Skeleton
                      className={cn("h-4 w-full", SKELETON_CELL_MAX_WIDTH)}
                      rounded="sm"
                    />
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
LoadingState.displayName = "LoadingState"

/**
 * EmptyState - Renders empty state when no data is available.
 * @internal
 */
function EmptyState<T>({
  columns,
  selectable,
  stickyHeader,
  headerPadding,
  headerRowClassName,
  emptyState,
  wrapperClassName,
  tableClassName,
  maxHeight,
}: {
  columns: ColumnDef<T>[]
  selectable: boolean
  stickyHeader: boolean
  headerPadding: string
  headerRowClassName?: string
  emptyState?: React.ReactNode
  wrapperClassName?: string
  tableClassName?: string
  maxHeight?: string
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-default shadow-md w-full min-w-0",
        wrapperClassName
      )}
      data-slot={DATA_SLOTS.wrapper}
    >
      <div className="overflow-x-auto w-full" style={{ maxHeight }}>
        <table
          className={cn("w-full min-w-max", tableClassName)}
          style={{ borderCollapse: "separate", borderSpacing: 0, tableLayout: "auto" }}
          data-slot={DATA_SLOTS.table}
        >
          <thead
            className={cn("border-b border-default", stickyHeader && "sticky top-0 z-10")}
            style={HEADER_GRADIENT_STYLE}
            data-slot={DATA_SLOTS.header}
          >
            <tr
              className={cn("shadow-[inset_0_-1px_0_0_var(--border)]", headerRowClassName)}
              data-slot={DATA_SLOTS.headerRow}
            >
              {selectable && (
                <th className={cn(headerPadding, CHECKBOX_COLUMN_WIDTH, "border-r border-default")}>
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
                    minWidth: column.minWidth || MIN_COLUMN_WIDTH,
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
      <div
        className="flex flex-col items-center justify-center py-12 bg-surface"
        data-slot={DATA_SLOTS.emptyState}
      >
        {emptyState || (
          <>
            <div
              className={cn(
                EMPTY_STATE_ICON_CONTAINER_SIZE,
                "mb-4 rounded-full bg-muted-bg flex items-center justify-center"
              )}
            >
              <Minus className={cn(EMPTY_STATE_ICON_SIZE, "text-secondary")} />
            </div>
            <p className="text-sm text-secondary">No data available</p>
          </>
        )}
      </div>
    </div>
  )
}
EmptyState.displayName = "EmptyState"

/**
 * DataTable - A reusable, generic data table component.
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
 * - Integrated pagination
 *
 * @example Basic Usage
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
 * - `data-slot="data-table-pagination"` - Pagination footer
 *
 * @accessibility
 * - Sortable columns support keyboard navigation (Enter/Space)
 * - Clickable rows support keyboard navigation (Enter/Space)
 * - Checkboxes include aria-label for screen readers
 * - Sort state communicated via aria-sort attribute
 * - Select all checkbox shows indeterminate state when partially selected
 */
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
  loadingRows = DEFAULT_LOADING_ROWS,
  emptyState,
  onRowClick,
  sortColumn = null,
  sortDirection = null,
  onSortChange,
  className,
  tableClassName,
  wrapperClassName,
  headerRowClassName,
  bodyRowClassName,
  bordered = true,
  striped = false,
  hoverable = true,
  compact = false,
  getRowPriority,
  getRowTestId,
  pagination = false,
  currentPage = DEFAULT_CURRENT_PAGE,
  totalItems,
  pageSize = DEFAULT_PAGE_SIZE,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [...DEFAULT_PAGE_SIZE_OPTIONS],
  ...props
}: DataTableProps<T>) {
  // Local sort state (used if onSortChange is not provided)
  const [localSortColumn, setLocalSortColumn] = useState<string | null>(null)
  const [localSortDirection, setLocalSortDirection] = useState<SortDirection>(null)

  // Use controlled or local sort state
  const activeSortColumn = onSortChange ? sortColumn : localSortColumn
  const activeSortDirection = onSortChange ? sortDirection : localSortDirection

  // Cell padding based on compact mode
  const cellPadding = compact ? CELL_PADDING_COMPACT : CELL_PADDING_DEFAULT
  const headerPadding = compact ? CELL_PADDING_COMPACT : CELL_PADDING_DEFAULT

  // Handle sort click
  const handleSort = useCallback(
    (columnId: string) => {
      const column = columns.find((c) => c.id === columnId)
      if (!column?.sortable) return

      const newDirection = getNextSortDirection(
        columnId,
        activeSortColumn,
        activeSortDirection
      )

      if (onSortChange) {
        onSortChange(columnId, newDirection)
      } else {
        setLocalSortColumn(newDirection ? columnId : null)
        setLocalSortDirection(newDirection)
      }
    },
    [columns, activeSortColumn, activeSortDirection, onSortChange]
  )

  // Sorted data
  const sortedData = useMemo(
    () => sortData(data, columns, activeSortColumn, activeSortDirection),
    [data, columns, activeSortColumn, activeSortDirection]
  )

  // Selection state
  const allRowIds = useMemo(() => new Set(data.map(getRowId)), [data, getRowId])
  const allSelected =
    allRowIds.size > 0 && [...allRowIds].every((id) => selectedRows.has(id))
  const someSelected =
    [...allRowIds].some((id) => selectedRows.has(id)) && !allSelected

  // Selection handlers
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (!onSelectionChange) return
      onSelectionChange(checked ? allRowIds : new Set())
    },
    [allRowIds, onSelectionChange]
  )

  const handleSelectRow = useCallback(
    (rowId: string, checked: boolean) => {
      if (!onSelectionChange) return
      const newSelected = new Set(selectedRows)
      if (checked) {
        newSelected.add(rowId)
      } else {
        newSelected.delete(rowId)
      }
      onSelectionChange(newSelected)
    },
    [selectedRows, onSelectionChange]
  )

  // Loading state
  if (loading) {
    return (
      <LoadingState
        columns={columns}
        loadingRows={loadingRows}
        selectable={selectable}
        headerPadding={headerPadding}
        cellPadding={cellPadding}
        bordered={bordered}
        wrapperClassName={wrapperClassName}
        tableClassName={tableClassName}
        maxHeight={maxHeight}
      />
    )
  }

  // Empty state
  if (data.length === 0) {
    return (
      <EmptyState
        columns={columns}
        selectable={selectable}
        stickyHeader={stickyHeader}
        headerPadding={headerPadding}
        headerRowClassName={headerRowClassName}
        emptyState={emptyState}
        wrapperClassName={wrapperClassName}
        tableClassName={tableClassName}
        maxHeight={maxHeight}
      />
    )
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-default shadow-md w-full min-w-0",
        wrapperClassName,
        className
      )}
      data-slot={DATA_SLOTS.wrapper}
      {...props}
    >
      <div className="overflow-x-auto w-full" style={{ maxHeight }}>
        <table
          className={cn("w-full min-w-max", tableClassName)}
          style={{ borderCollapse: "separate", borderSpacing: 0, tableLayout: "auto" }}
          data-slot={DATA_SLOTS.table}
        >
          <thead
            className={cn(
              "border-b border-default",
              stickyHeader && "sticky top-0 z-10"
            )}
            style={HEADER_GRADIENT_STYLE}
            data-slot={DATA_SLOTS.header}
          >
            <tr
              className={cn("shadow-[inset_0_-1px_0_0_var(--border)]", headerRowClassName)}
              data-slot={DATA_SLOTS.headerRow}
            >
              {selectable && (
                <th className={cn(headerPadding, CHECKBOX_COLUMN_WIDTH, "border-r border-default")}>
                  <Checkbox
                    checked={allSelected}
                    data-indeterminate={someSelected}
                    onCheckedChange={(checked) => handleSelectAll(checked === true)}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column, colIndex) => (
                <TableHeaderCell
                  key={column.id}
                  column={column}
                  colIndex={colIndex}
                  columnsLength={columns.length}
                  headerPadding={headerPadding}
                  activeSortColumn={activeSortColumn}
                  activeSortDirection={activeSortDirection}
                  onSort={handleSort}
                />
              ))}
            </tr>
          </thead>
          <tbody className="bg-surface" data-slot={DATA_SLOTS.body}>
            {sortedData.map((row, index) => {
              const rowId = getRowId(row)
              const isSelected = selectedRows.has(rowId)
              const rowPriority = getRowPriority?.(row)
              const priorityBorderConfig = rowPriority
                ? PRIORITY_BORDER_COLORS[rowPriority]
                : null
              const isLastRow = index === sortedData.length - 1

              return (
                <TableBodyRow
                  key={rowId}
                  row={row}
                  index={index}
                  columns={columns}
                  rowId={rowId}
                  isSelected={isSelected}
                  isLastRow={isLastRow}
                  priorityBorderConfig={priorityBorderConfig}
                  cellPadding={cellPadding}
                  striped={striped}
                  hoverable={hoverable}
                  bordered={bordered}
                  selectable={selectable}
                  bodyRowClassName={bodyRowClassName}
                  getRowTestId={getRowTestId}
                  onRowClick={onRowClick}
                  onSelectRow={handleSelectRow}
                />
              )
            })}
          </tbody>
        </table>
      </div>

      {pagination && onPageChange && (
        <div
          className="border-t border-default px-4 py-3"
          style={HEADER_GRADIENT_STYLE}
          data-slot={DATA_SLOTS.pagination}
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
