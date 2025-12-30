/**
 * Column Utilities - Helpers for DataTable column configuration
 *
 * Provides utilities for responsive column visibility and common column patterns.
 *
 * @example
 * ```tsx
 * import { responsiveColumn, createActionsColumn, createIdColumn } from './column-utils'
 *
 * const columns = [
 *   createIdColumn('id'),
 *   { id: 'name', header: 'Name', accessor: (r) => r.name },
 *   responsiveColumn({
 *     id: 'createdBy',
 *     header: 'Created By',
 *     accessor: (r) => r.createdBy,
 *     hideOn: 'tablet', // Hidden on tablet and mobile
 *   }),
 *   responsiveColumn({
 *     id: 'modifiedAt',
 *     header: 'Modified',
 *     accessor: (r) => r.modifiedAt,
 *     hideOn: 'mobile', // Hidden only on mobile
 *   }),
 *   createActionsColumn(getActions),
 * ]
 * ```
 */

import type { ColumnDef } from './DataTable'

// =============================================================================
// TYPES
// =============================================================================

/** Breakpoint levels for responsive hiding */
export type ResponsiveBreakpoint = 'mobile' | 'tablet' | 'desktop' | 'always'

/** Extended column definition with responsive support */
export interface ResponsiveColumnDef<T> extends ColumnDef<T> {
  /** Hide column at this breakpoint and below */
  hideOn?: ResponsiveBreakpoint
  /** Priority for column (lower = more important, always visible) */
  priority?: number
}

// =============================================================================
// RESPONSIVE CSS CLASSES
// =============================================================================

/**
 * CSS classes for responsive column visibility
 *
 * Based on Tailwind breakpoints:
 * - mobile: < 640px (sm)
 * - tablet: < 1024px (lg)
 * - desktop: < 1280px (xl)
 */
export const RESPONSIVE_CLASSES = {
  /** Hidden on mobile only (< 640px) */
  mobile: 'hidden sm:table-cell',
  /** Hidden on tablet and below (< 1024px) */
  tablet: 'hidden lg:table-cell',
  /** Hidden on desktop and below (< 1280px) */
  desktop: 'hidden xl:table-cell',
  /** Always visible */
  always: '',
} as const

/**
 * Get CSS class for responsive visibility
 */
export function getResponsiveClass(hideOn?: ResponsiveBreakpoint): string {
  if (!hideOn || hideOn === 'always') return ''
  return RESPONSIVE_CLASSES[hideOn]
}

// =============================================================================
// COLUMN HELPERS
// =============================================================================

/**
 * Create a responsive column with auto-hiding at breakpoints
 */
export function responsiveColumn<T>(
  column: ResponsiveColumnDef<T>
): ColumnDef<T> {
  const { hideOn, priority, ...rest } = column
  const responsiveClass = getResponsiveClass(hideOn)

  return {
    ...rest,
    cellClassName: responsiveClass
      ? `${responsiveClass}${rest.cellClassName ? ` ${rest.cellClassName}` : ''}`
      : rest.cellClassName,
    headerClassName: responsiveClass
      ? `${responsiveClass}${rest.headerClassName ? ` ${rest.headerClassName}` : ''}`
      : rest.headerClassName,
  }
}

/**
 * Create a standard ID column with truncation
 *
 * @example
 * ```tsx
 * const columns = [
 *   createIdColumn('id', { hideOn: 'tablet' }),
 *   // ... other columns
 * ]
 * ```
 */
export function createIdColumn<T extends { id: string }>(
  accessor: keyof T | ((row: T) => string) = 'id',
  options?: {
    header?: string
    hideOn?: ResponsiveBreakpoint
    width?: string
  }
): ColumnDef<T> {
  const getValue = typeof accessor === 'function'
    ? accessor
    : (row: T) => String(row[accessor])

  const responsiveClass = getResponsiveClass(options?.hideOn)

  return {
    id: 'id',
    header: options?.header || 'ID',
    accessor: getValue,
    width: options?.width || '180px',
    cellClassName: `font-mono text-xs text-secondary${responsiveClass ? ` ${responsiveClass}` : ''}`,
    headerClassName: responsiveClass || undefined,
  }
}

/**
 * Create a standard actions column
 *
 * @example
 * ```tsx
 * const columns = [
 *   // ... data columns
 *   createActionsColumn((row) => [
 *     { id: 'edit', label: 'Edit', icon: Edit, onClick: () => handleEdit(row) },
 *     { id: 'delete', label: 'Delete', icon: Trash2, onClick: () => handleDelete(row) },
 *   ]),
 * ]
 * ```
 */
export function createActionsColumn<T>(
  getActions: (row: T) => React.ReactNode,
  options?: {
    header?: string
    width?: string
    sticky?: 'left' | 'right'
  }
): ColumnDef<T> {
  return {
    id: 'actions',
    header: options?.header || 'Actions',
    accessor: getActions,
    width: options?.width || '120px',
    align: 'right',
    sticky: options?.sticky,
    cellClassName: 'text-right',
    headerClassName: 'text-right',
  }
}

/**
 * Create a status badge column
 *
 * @example
 * ```tsx
 * const columns = [
 *   createStatusColumn('status', {
 *     getBadgeVariant: (status) => status === 'active' ? 'success' : 'secondary',
 *     getLabel: (status) => STATUS_LABELS[status],
 *   }),
 * ]
 * ```
 */
export function createStatusColumn<T, S extends string>(
  accessor: keyof T | ((row: T) => S),
  options: {
    header?: string
    getBadgeVariant: (status: S) => string
    getLabel: (status: S) => string
    hideOn?: ResponsiveBreakpoint
  }
): ColumnDef<T> {
  const getValue = typeof accessor === 'function'
    ? accessor
    : (row: T) => row[accessor] as S

  const responsiveClass = getResponsiveClass(options.hideOn)

  return {
    id: 'status',
    header: options.header || 'Status',
    accessor: (row) => {
      const status = getValue(row)
      return options.getLabel(status)
    },
    sortable: true,
    sortValue: getValue as (row: T) => string,
    cellClassName: responsiveClass || undefined,
    headerClassName: responsiveClass || undefined,
  }
}

/**
 * Create a date column with formatting
 */
export function createDateColumn<T>(
  accessor: keyof T | ((row: T) => Date | string | null),
  options?: {
    id?: string
    header?: string
    format?: 'date' | 'datetime' | 'relative'
    hideOn?: ResponsiveBreakpoint
  }
): ColumnDef<T> {
  const getValue = typeof accessor === 'function'
    ? accessor
    : (row: T) => row[accessor] as Date | string | null

  const responsiveClass = getResponsiveClass(options?.hideOn)

  const formatDate = (value: Date | string | null): string => {
    if (!value) return '-'
    const date = typeof value === 'string' ? new Date(value) : value

    switch (options?.format) {
      case 'datetime':
        return date.toLocaleString()
      case 'relative':
        return getRelativeTime(date)
      default:
        return date.toLocaleDateString()
    }
  }

  return {
    id: options?.id || 'date',
    header: options?.header || 'Date',
    accessor: (row) => formatDate(getValue(row)),
    sortable: true,
    sortValue: (row) => {
      const value = getValue(row)
      if (!value) return 0
      return typeof value === 'string' ? new Date(value).getTime() : value.getTime()
    },
    cellClassName: `text-secondary text-sm${responsiveClass ? ` ${responsiveClass}` : ''}`,
    headerClassName: responsiveClass || undefined,
  }
}

/**
 * Get relative time string
 */
function getRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

// =============================================================================
// COLUMN VISIBILITY MANAGEMENT
// =============================================================================

/**
 * Filter columns based on visibility settings
 *
 * @example
 * ```tsx
 * const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set())
 *
 * const visibleColumns = filterVisibleColumns(allColumns, hiddenColumns)
 * ```
 */
export function filterVisibleColumns<T>(
  columns: ColumnDef<T>[],
  hiddenColumnIds: Set<string>
): ColumnDef<T>[] {
  return columns.filter((col) => !hiddenColumnIds.has(col.id))
}

/**
 * Get column IDs grouped by priority for column picker UI
 */
export function getColumnsByPriority<T>(
  columns: ResponsiveColumnDef<T>[]
): {
  essential: string[] // Always visible
  default: string[] // Visible by default
  optional: string[] // Hidden by default
} {
  const essential: string[] = []
  const defaultCols: string[] = []
  const optional: string[] = []

  columns.forEach((col) => {
    const priority = col.priority ?? 1

    if (priority === 0 || col.id === 'actions') {
      essential.push(col.id)
    } else if (priority === 1) {
      defaultCols.push(col.id)
    } else {
      optional.push(col.id)
    }
  })

  return { essential, default: defaultCols, optional }
}
