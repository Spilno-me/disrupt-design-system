/**
 * CorrectiveActionsTable
 *
 * Table-based display for corrective actions using DataTable.
 * Follows the EMEX DynamicEntityTable pattern for consistency
 * across all entity types (Incidents, Corrective Actions, etc.).
 *
 * Features:
 * - Priority-based row borders (critical → low)
 * - Sortable columns
 * - Row selection
 * - Pagination
 * - Responsive with proper empty/loading states
 */

import { useMemo, useCallback } from 'react'
import { MoreHorizontal, ExternalLink, Edit, Trash2, Clock } from 'lucide-react'
import { DataTable, type ColumnDef, type RowPriority } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import {
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  formatDate,
  formatRelativeDate,
  getDueDateState,
  getUserDisplayName,
} from './helpers'
import type { CorrectiveAction, CorrectiveActionPermissions } from './types'
import { cn } from '@/lib/utils'

export interface CorrectiveActionsTableProps {
  /** List of corrective actions to display */
  actions: CorrectiveAction[]
  /** User permissions */
  permissions?: CorrectiveActionPermissions
  /** Row click handler (navigate to details) */
  onRowClick?: (action: CorrectiveAction) => void
  /** Edit action handler */
  onEdit?: (action: CorrectiveAction) => void
  /** Delete action handler */
  onDelete?: (action: CorrectiveAction) => void
  /** Request extension handler */
  onRequestExtension?: (action: CorrectiveAction) => void
  /** Selected row IDs */
  selectedRows?: Set<string>
  /** Selection change handler */
  onSelectionChange?: (selectedIds: Set<string>) => void
  /** Enable row selection */
  selectable?: boolean
  /** Loading state */
  isLoading?: boolean
  /** Enable pagination */
  pagination?: boolean
  /** Current page (1-indexed) */
  currentPage?: number
  /** Items per page */
  pageSize?: number
  /** Total items (for server-side pagination) */
  totalItems?: number
  /** Page change handler */
  onPageChange?: (page: number) => void
  /** Page size change handler */
  onPageSizeChange?: (size: number) => void
  /** Compact mode */
  compact?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Maps corrective action priority to DataTable row priority
 */
function mapPriorityToRowPriority(priority: CorrectiveAction['priority']): RowPriority {
  switch (priority) {
    case 'urgent':
      return 'critical'
    case 'high':
      return 'high'
    case 'medium':
      return 'medium'
    case 'low':
      return 'low'
    default:
      return null
  }
}

export function CorrectiveActionsTable({
  actions,
  permissions = {
    canView: true,
    canEdit: true,
    canCreate: true,
    canDelete: false,
    canApprove: false,
    canRequestExtension: true,
  },
  onRowClick,
  onEdit,
  onDelete,
  onRequestExtension,
  selectedRows = new Set(),
  onSelectionChange,
  selectable = false,
  isLoading = false,
  pagination = false,
  currentPage = 1,
  pageSize = 10,
  totalItems,
  onPageChange,
  onPageSizeChange,
  compact = false,
  className,
}: CorrectiveActionsTableProps) {
  // Build column definitions
  const columns = useMemo<ColumnDef<CorrectiveAction>[]>(() => {
    const cols: ColumnDef<CorrectiveAction>[] = [
      // Reference Number
      {
        id: 'referenceNumber',
        header: 'Reference',
        accessor: (row) => (
          <span className="font-mono text-sm text-primary font-medium">
            {row.referenceNumber}
          </span>
        ),
        sortable: true,
        sortValue: (row) => row.referenceNumber,
        width: '120px',
      },
      // Title
      {
        id: 'title',
        header: 'Title',
        accessor: (row) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-primary truncate max-w-[250px] inline-block">
                {row.title}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p>{row.title}</p>
            </TooltipContent>
          </Tooltip>
        ),
        sortable: true,
        sortValue: (row) => row.title,
        minWidth: '200px',
      },
      // Status
      {
        id: 'status',
        header: 'Status',
        accessor: (row) => {
          const config = STATUS_CONFIG[row.status]
          const StatusIcon = config.icon
          return (
            <Badge variant={config.variant} className="gap-1">
              <StatusIcon className="h-3 w-3" />
              {config.label}
            </Badge>
          )
        },
        sortable: true,
        sortValue: (row) => row.status,
        width: '140px',
      },
      // Priority
      {
        id: 'priority',
        header: 'Priority',
        accessor: (row) => {
          const config = PRIORITY_CONFIG[row.priority]
          const PriorityIcon = config.icon
          return (
            <Badge variant={config.variant} className="gap-1">
              <PriorityIcon className="h-3 w-3" />
              {config.label}
            </Badge>
          )
        },
        sortable: true,
        sortValue: (row) => PRIORITY_CONFIG[row.priority].sortOrder,
        width: '110px',
      },
      // Due Date
      {
        id: 'dueDate',
        header: 'Due Date',
        accessor: (row) => {
          const dueDateState = getDueDateState(row.dueDate, row.status)
          return (
            <div
              className={cn(
                'text-sm',
                dueDateState === 'overdue' && 'text-error font-medium',
                dueDateState === 'today' && 'text-warning font-medium',
                dueDateState === 'completed' && 'text-tertiary'
              )}
            >
              <div>{formatDate(row.dueDate)}</div>
              {dueDateState !== 'completed' && (
                <div className="text-xs text-secondary">
                  {formatRelativeDate(row.dueDate)}
                </div>
              )}
            </div>
          )
        },
        sortable: true,
        sortValue: (row) => new Date(row.dueDate).getTime(),
        width: '130px',
      },
      // Assignee
      {
        id: 'assignee',
        header: 'Assignee',
        accessor: (row) => (
          <span className="text-sm text-primary">
            {getUserDisplayName(row.actionOwner)}
          </span>
        ),
        sortable: true,
        sortValue: (row) => getUserDisplayName(row.actionOwner),
        width: '150px',
      },
      // Location
      {
        id: 'location',
        header: 'Location',
        accessor: (row) => (
          <span className="text-sm text-secondary">
            {row.location?.name || '—'}
          </span>
        ),
        sortable: true,
        sortValue: (row) => row.location?.name || '',
        width: '150px',
      },
      // Actions (always last)
      {
        id: 'actions',
        header: '',
        accessor: (row) => (
          <div className="flex items-center justify-end gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {onRowClick && (
                  <DropdownMenuItem onClick={() => onRowClick(row)}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                )}
                {permissions.canEdit && onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(row)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {permissions.canRequestExtension &&
                  onRequestExtension &&
                  row.status !== 'completed' &&
                  row.status !== 'closed' && (
                    <DropdownMenuItem onClick={() => onRequestExtension(row)}>
                      <Clock className="mr-2 h-4 w-4" />
                      Request Extension
                    </DropdownMenuItem>
                  )}
                {permissions.canDelete && onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-error focus:text-error"
                      onClick={() => onDelete(row)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        width: '60px',
        align: 'right',
      },
    ]

    return cols
  }, [permissions, onRowClick, onEdit, onDelete, onRequestExtension])

  // Row ID accessor
  const getRowId = useCallback((row: CorrectiveAction) => row.id, [])

  // Row priority accessor for colored borders
  const getRowPriority = useCallback(
    (row: CorrectiveAction): RowPriority => mapPriorityToRowPriority(row.priority),
    []
  )

  // Row test ID for testing
  const getRowTestId = useCallback(
    (row: CorrectiveAction) => `corrective-action-row-${row.id}`,
    []
  )

  return (
    <DataTable<CorrectiveAction>
      data={actions}
      columns={columns}
      getRowId={getRowId}
      getRowPriority={getRowPriority}
      getRowTestId={getRowTestId}
      selectable={selectable}
      selectedRows={selectedRows}
      onSelectionChange={onSelectionChange}
      onRowClick={onRowClick}
      loading={isLoading}
      stickyHeader
      bordered
      hoverable
      compact={compact}
      pagination={pagination}
      currentPage={currentPage}
      pageSize={pageSize}
      totalItems={totalItems}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      className={className}
      emptyState={
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-lg font-medium text-primary mb-1">No corrective actions found</p>
          <p className="text-sm text-secondary">
            Create a new corrective action to get started
          </p>
        </div>
      }
    />
  )
}

export default CorrectiveActionsTable
