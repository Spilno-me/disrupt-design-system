/**
 * EntityTemplatesTable - Data table for entity templates
 *
 * Displays templates in a sortable, paginated table with
 * action buttons for view and edit operations.
 *
 * Responsive design:
 * - Desktop (lg+): Full data table with all columns
 * - Mobile (<lg): Card-based view with touch-friendly actions
 *
 * Actions are positioned on the right side following Flow app patterns:
 * - 3 actions visible as icon buttons
 * - If more than 3, overflow menu with "..."
 *
 * @component MOLECULE
 * @testId Auto-generated: template-row-{id}, template-view-{id},
 *         template-edit-{id}, template-delete-{id}
 */

import * as React from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../../../components/ui/badge'
import { CopyButton } from '../../../../components/ui/CopyButton'
import { DataTable, type ColumnDef } from '../../../../components/ui/DataTable'
import { Pagination } from '../../../../components/ui/Pagination'
import { RowActions, type RowAction } from '../../../../components/ui/RowActions'
import { EntityTemplateCard } from '../mobile/EntityTemplateCard'
import type { EntityTemplatesTableProps, EntityTemplate } from '../types'

// =============================================================================
// TABLE COLUMN WIDTHS (fixed values for table layout structure)
// =============================================================================

const COLUMN_WIDTHS = {
  version: '80px',
  type: '100px',
  businessKey: '180px',
  date: '120px',
  actionsCompact: '80px',
  actions: '120px',
} as const

// =============================================================================
// COMPONENT
// =============================================================================

export function EntityTemplatesTable({
  templates,
  isLoading = false,
  currentPage,
  pageSize,
  sortColumn,
  sortDirection,
  onView,
  onEdit,
  onDelete,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  isCompact = false,
  'data-testid': testId,
}: EntityTemplatesTableProps & { isCompact?: boolean; 'data-testid'?: string }) {
  // Format date for display
  const formatDate = React.useCallback((dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }, [])

  // Build actions array for a row - always show all 3 actions for consistency
  const getRowActions = React.useCallback(
    (row: EntityTemplate): RowAction[] => {
      // Determine disabled states
      const canEdit = !!onEdit
      const canDelete = !!onDelete && !row.isSystem

      return [
        {
          id: 'view',
          label: 'View details',
          icon: Eye,
          onClick: () => onView(row),
          variant: 'neutral',
          'data-testid': `template-view-${row.id}`,
        },
        {
          id: 'edit',
          label: canEdit ? 'Edit template' : 'Edit unavailable',
          icon: Pencil,
          onClick: () => onEdit?.(row),
          variant: 'info',
          disabled: !canEdit,
          'data-testid': `template-edit-${row.id}`,
        },
        {
          id: 'delete',
          label: row.isSystem ? 'System templates cannot be deleted' : (onDelete ? 'Delete template' : 'Delete unavailable'),
          icon: Trash2,
          onClick: () => onDelete?.(row),
          variant: 'destructive',
          disabled: !canDelete,
          'data-testid': `template-delete-${row.id}`,
        },
      ]
    },
    [onView, onEdit, onDelete]
  )

  // Columns hidden in compact mode (during editing)
  const COMPACT_HIDDEN_COLUMNS = ['version', 'businessKeyTemplate', 'createdAt']

  // Define all table columns - actions on the RIGHT (last column)
  const allColumns: ColumnDef<EntityTemplate>[] = React.useMemo(
    () => [
      {
        id: 'name',
        header: 'Name',
        sortable: true,
        minWidth: isCompact ? '120px' : '150px',
        accessor: (row) => (
          <span className={cn('font-medium text-primary', isCompact && 'text-sm')}>
            {row.name}
          </span>
        ),
        sortValue: (row) => row.name.toLowerCase(),
      },
      {
        id: 'code',
        header: 'Code',
        sortable: true,
        minWidth: isCompact ? '140px' : '180px',
        accessor: (row) => (
          <div className="flex items-center gap-2">
            <code
              className={cn(
                'text-sm font-mono text-secondary bg-muted-bg px-1.5 py-0.5 rounded',
                isCompact && 'max-w-[100px] truncate'
              )}
            >
              {row.code}
            </code>
            {!isCompact && <CopyButton value={row.code} />}
          </div>
        ),
        sortValue: (row) => row.code.toLowerCase(),
      },
      {
        id: 'version',
        header: 'Version',
        width: COLUMN_WIDTHS.version,
        align: 'center',
        sortable: true,
        accessor: (row) => <span className="text-secondary">{row.version}</span>,
        sortValue: (row) => row.version,
      },
      {
        id: 'type',
        header: 'Type',
        width: COLUMN_WIDTHS.type,
        sortable: true,
        accessor: (row) => (
          <Badge
            variant={row.isSystem ? 'destructive' : 'outline'}
            size="sm"
            className={cn(
              row.isSystem
                ? 'bg-coral-100 text-coral-700 border-coral-200'
                : 'bg-muted-bg text-secondary border-default'
            )}
          >
            {row.isSystem ? (
              <>
                <span className="mr-1">&#9675;</span>
                System
              </>
            ) : (
              'Custom'
            )}
          </Badge>
        ),
        sortValue: (row) => (row.isSystem ? 0 : 1),
      },
      {
        id: 'businessKeyTemplate',
        header: 'Business Key',
        minWidth: COLUMN_WIDTHS.businessKey,
        sortable: true,
        accessor: (row) =>
          row.businessKeyTemplate ? (
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono text-secondary bg-muted-bg px-1.5 py-0.5 rounded">
                {row.businessKeyTemplate}
              </code>
              <CopyButton value={row.businessKeyTemplate} />
            </div>
          ) : (
            <span className="text-tertiary">—</span>
          ),
        sortValue: (row) => row.businessKeyTemplate?.toLowerCase() ?? '',
      },
      {
        id: 'createdAt',
        header: 'Created',
        width: COLUMN_WIDTHS.date,
        sortable: true,
        accessor: (row) => (
          <span className="text-secondary whitespace-nowrap">{formatDate(row.createdAt)}</span>
        ),
        sortValue: (row) => new Date(row.createdAt).getTime(),
      },
      // Actions column - RIGHT side, using RowActions component
      {
        id: 'actions',
        header: <span className="sr-only">Actions</span>,
        width: isCompact ? COLUMN_WIDTHS.actionsCompact : COLUMN_WIDTHS.actions,
        align: 'right',
        accessor: (row) => (
          <RowActions
            actions={getRowActions(row)}
            maxInline={3}
            size="sm"
          />
        ),
      },
    ],
    [formatDate, isCompact, getRowActions]
  )

  // Filter columns based on compact mode
  const columns = React.useMemo(() => {
    if (!isCompact) return allColumns
    return allColumns.filter((col) => !COMPACT_HIDDEN_COLUMNS.includes(col.id))
  }, [allColumns, isCompact])

  // Calculate paginated data
  const paginatedTemplates = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return templates.slice(start, start + pageSize)
  }, [templates, currentPage, pageSize])

  // Empty state component (shared between desktop and mobile)
  const emptyState = (
    <div className="flex flex-col items-center justify-center py-8">
      <p className="text-sm text-secondary">No templates found</p>
      <p className="text-xs text-tertiary mt-1">
        Try adjusting your search or filter criteria
      </p>
    </div>
  )

  return (
    <>
      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden lg:block">
        <DataTable
          data-testid={testId}
          data={paginatedTemplates}
          columns={columns}
          getRowId={(row) => row.id}
          getRowTestId={(row) => `template-row-${row.id}`}
          loading={isLoading}
          loadingRows={5}
          stickyHeader
          bordered
          hoverable
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSortChange={onSortChange}
          pagination
          currentPage={currentPage}
          totalItems={templates.length}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={[5, 10, 25, 50]}
          emptyState={emptyState}
        />
      </div>

      {/* Mobile Card View - Hidden on desktop */}
      <div className="lg:hidden">
        {isLoading ? (
          // Loading skeleton for mobile
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-32 bg-muted-bg/50 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : paginatedTemplates.length === 0 ? (
          emptyState
        ) : (
          <div className="space-y-3">
            {/* Template Cards */}
            {paginatedTemplates.map((template) => (
              <EntityTemplateCard
                key={template.id}
                template={template}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}

            {/* Mobile Pagination */}
            {templates.length > pageSize && (
              <div className="pt-4">
                <Pagination
                  currentPage={currentPage}
                  totalItems={templates.length}
                  pageSize={pageSize}
                  onPageChange={onPageChange}
                  onPageSizeChange={onPageSizeChange}
                  pageSizeOptions={[5, 10, 25]}
                  showPageSizeSelector={false}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

EntityTemplatesTable.displayName = 'EntityTemplatesTable'

export default EntityTemplatesTable
