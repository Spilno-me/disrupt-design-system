/**
 * CorrectiveActionsPage
 *
 * Full page layout for corrective actions management.
 * Follows DDS depth layering rules with glass panels and GridBlobBackground.
 *
 * Features:
 * - Animated grid blob background
 * - Glass panel content wrapper (Depth 2)
 * - PageActionPanel header
 * - Status tab filtering
 * - Grid/List view toggle
 */

import { useState } from 'react'
import { Plus, LayoutGrid, List, Download, ClipboardCheck, RefreshCw, Table } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageActionPanel } from '@/components/ui/PageActionPanel'
import { GridBlobBackground } from '@/components/ui/GridBlobCanvas'
import { SearchFilter, type FilterGroup, type FilterState } from '@/components/shared/SearchFilter'
import { CorrectiveActionsGrid } from './CorrectiveActionsGrid'
import { CorrectiveActionsTable } from './CorrectiveActionsTable'
import { STATUS_CONFIG, VALID_STATUSES, VALID_PRIORITIES, PRIORITY_CONFIG, isOverdue } from './helpers'
import type {
  CorrectiveAction,
  CorrectiveActionPermissions,
  CorrectiveActionStatus,
} from './types'
import { cn } from '@/lib/utils'

export interface CorrectiveActionsPageProps {
  /** List of corrective actions */
  actions: CorrectiveAction[]
  /** User permissions */
  permissions?: CorrectiveActionPermissions
  /** Page title */
  title?: string
  /** Page subtitle/description */
  subtitle?: string
  /** Create action handler */
  onCreate?: () => void
  /** Action click handler (navigate to details) */
  onActionClick?: (action: CorrectiveAction) => void
  /** Edit action handler */
  onEdit?: (action: CorrectiveAction) => void
  /** Delete action handler */
  onDelete?: (action: CorrectiveAction) => void
  /** Request extension handler */
  onRequestExtension?: (action: CorrectiveAction) => void
  /** Export handler */
  onExport?: () => void
  /** Refresh handler */
  onRefresh?: () => Promise<void>
  /** Loading state */
  isLoading?: boolean
  /** Additional CSS classes */
  className?: string
}

type ViewMode = 'table' | 'grid'

export function CorrectiveActionsPage({
  actions,
  permissions = {
    canView: true,
    canEdit: true,
    canCreate: true,
    canDelete: false,
    canApprove: false,
    canRequestExtension: true,
  },
  title = 'Corrective Actions',
  subtitle = 'Manage and track corrective and preventive actions',
  onCreate,
  onActionClick,
  onEdit,
  onDelete,
  onRequestExtension,
  onExport,
  onRefresh,
  isLoading = false,
  className,
}: CorrectiveActionsPageProps) {
  // View mode: table is default (matches EMEX pattern)
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [statusTab, setStatusTab] = useState<CorrectiveActionStatus | 'all' | 'overdue'>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Search & filter state
  const [searchValue, setSearchValue] = useState('')
  const [filterState, setFilterState] = useState<FilterState>({})

  // Refresh handler with loading state
  const handleRefresh = async () => {
    if (!onRefresh) return
    setIsRefreshing(true)
    await onRefresh()
    await new Promise((resolve) => setTimeout(resolve, 300))
    setIsRefreshing(false)
  }

  // Build filter groups for SearchFilter
  const filterGroups: FilterGroup[] = [
    {
      key: 'priority',
      label: 'Priority',
      options: VALID_PRIORITIES.map((p) => ({
        id: p,
        label: PRIORITY_CONFIG[p].label,
      })),
    },
    {
      key: 'assignee',
      label: 'Assignee',
      options: Array.from(
        new Map(
          actions
            .filter((a) => a.actionOwner)
            .map((a) => [
              a.actionOwner!.id,
              a.actionOwner!.firstName && a.actionOwner!.lastName
                ? `${a.actionOwner!.firstName} ${a.actionOwner!.lastName}`
                : a.actionOwner!.email || a.actionOwner!.id,
            ])
        ).entries()
      ).map(([id, name]) => ({ id, label: name })),
    },
  ]

  // Filter by status tab + search + filters
  const filteredActions = actions.filter((action) => {
    // Status tab filter
    if (statusTab !== 'all') {
      if (statusTab === 'overdue') {
        if (!isOverdue(action)) return false
      } else if (action.status !== statusTab) {
        return false
      }
    }

    // Search filter
    if (searchValue) {
      const searchLower = searchValue.toLowerCase()
      const matchesSearch =
        action.title.toLowerCase().includes(searchLower) ||
        action.description.toLowerCase().includes(searchLower) ||
        action.referenceNumber.toLowerCase().includes(searchLower)
      if (!matchesSearch) return false
    }

    // Priority filter
    const selectedPriorities = filterState.priority || []
    if (selectedPriorities.length > 0 && !selectedPriorities.includes(action.priority)) {
      return false
    }

    // Assignee filter
    const selectedAssignees = filterState.assignee || []
    if (selectedAssignees.length > 0 && !selectedAssignees.includes(action.actionOwner?.id || '')) {
      return false
    }

    return true
  })

  // Count actions by status for tab badges
  const statusCounts = VALID_STATUSES.reduce((acc, status) => {
    acc[status] = actions.filter((a) => a.status === status).length
    return acc
  }, {} as Record<CorrectiveActionStatus, number>)

  const overdueCount = actions.filter(isOverdue).length

  return (
    <main
      data-slot="corrective-actions-page"
      data-testid="corrective-actions-page"
      className={cn('relative min-h-screen bg-page overflow-hidden', className)}
    >
      {/* Animated grid blob background */}
      <GridBlobBackground scale={1.2} blobCount={2} />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6 p-4 md:p-6">
        {/* Page Header - Using PageActionPanel for consistency */}
        <PageActionPanel
          data-testid="corrective-actions-header"
          icon={<ClipboardCheck className="w-6 h-6 md:w-8 md:h-8" />}
          iconClassName="text-accent"
          title={title}
          subtitle={subtitle}
          primaryAction={
            permissions.canCreate && onCreate && (
              <Button
                data-testid="corrective-actions-create-button"
                variant="default"
                size="sm"
                onClick={onCreate}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                New Action
              </Button>
            )
          }
          actions={
            <div className="flex items-center gap-2">
              {/* Export button */}
              {onExport && (
                <Button variant="outline" size="sm" onClick={onExport} className="gap-2">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              )}

              {/* Refresh button */}
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="gap-2"
                >
                  <RefreshCw className={cn('size-4', isRefreshing && 'animate-spin')} />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
              )}

              {/* View toggle: Table (default, matches EMEX) or Grid */}
              <div className="flex items-center border border-default rounded-lg">
                <Button
                  variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="rounded-r-none"
                  onClick={() => setViewMode('table')}
                  title="Table view"
                >
                  <Table className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="rounded-l-none"
                  onClick={() => setViewMode('grid')}
                  title="Card grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          }
        />

        {/* Main Content Panel - Depth 2 Glass Card */}
        <section
          data-testid="corrective-actions-content"
          className={cn(
            'rounded-xl border-2 border-accent',
            'bg-white/40 dark:bg-black/40 backdrop-blur-[4px] shadow-md',
            'flex flex-col'
          )}
        >
          {/* Section Header */}
          <div className="flex items-center gap-3 border-b border-default p-4">
            <div className="flex-shrink-0 p-2 rounded-lg bg-muted-bg">
              <ClipboardCheck className="w-5 h-5 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-primary truncate">
                {statusTab === 'all'
                  ? 'All Actions'
                  : statusTab === 'overdue'
                  ? 'Overdue Actions'
                  : STATUS_CONFIG[statusTab as CorrectiveActionStatus].label}
              </h2>
              <p className="text-sm text-secondary">
                {filteredActions.length} actions
                {statusTab === 'overdue' && ' requiring immediate attention'}
              </p>
            </div>
          </div>

          {/* Content area with padding */}
          <div className="flex flex-col gap-4 p-4 md:p-6">
            {/* Status Tabs - Accent variant with sliding animation */}
            <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as typeof statusTab)}>
              <TabsList variant="accent" animated className="flex-wrap h-auto gap-1">
                <TabsTrigger variant="accent" value="all">
                  All
                  <span className="ml-1.5 text-xs opacity-70">
                    ({actions.length})
                  </span>
                </TabsTrigger>

                {overdueCount > 0 && (
                  <TabsTrigger variant="accent" value="overdue">
                    Overdue
                    <span className="ml-1.5 text-xs bg-error/20 text-error px-1.5 py-0.5 rounded-full">
                      {overdueCount}
                    </span>
                  </TabsTrigger>
                )}

                {VALID_STATUSES.map((status) => {
                  const config = STATUS_CONFIG[status]
                  const count = statusCounts[status]
                  if (count === 0) return null

                  return (
                    <TabsTrigger
                      key={status}
                      value={status}
                      variant="accent"
                    >
                      {config.label}
                      <span className="ml-1.5 text-xs opacity-70">
                        ({count})
                      </span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </Tabs>

            {/* Search & Filter (no glass on glass - use surface styling) */}
            <SearchFilter
              placeholder="Search corrective actions..."
              value={searchValue}
              onChange={setSearchValue}
              filterGroups={filterGroups}
              filters={filterState}
              onFiltersChange={setFilterState}
              size="compact"
              className="!bg-surface !backdrop-blur-none !border-default !shadow-sm"
            />

            {/* Results count */}
            <div className="text-sm text-secondary">
              {filteredActions.length} of {actions.length} actions
              {searchValue && ` matching "${searchValue}"`}
            </div>

            {/* Table View (default, matches EMEX pattern) or Card Grid */}
            {viewMode === 'table' ? (
              <CorrectiveActionsTable
                actions={filteredActions}
                permissions={permissions}
                onRowClick={onActionClick}
                onEdit={onEdit}
                onDelete={onDelete}
                onRequestExtension={onRequestExtension}
                isLoading={isLoading}
                pagination
                pageSize={10}
                currentPage={1}
                onPageChange={() => {}}
                compact
              />
            ) : (
              <CorrectiveActionsGrid
                actions={filteredActions}
                permissions={permissions}
                onActionClick={onActionClick}
                onEdit={onEdit}
                onDelete={onDelete}
                onRequestExtension={onRequestExtension}
                showFilters={false}
                columns={3}
                isLoading={isLoading}
                emptyMessage={
                  statusTab === 'overdue'
                    ? 'No overdue actions'
                    : statusTab !== 'all'
                    ? `No ${STATUS_CONFIG[statusTab as CorrectiveActionStatus].label.toLowerCase()} actions`
                    : 'No corrective actions found'
                }
              />
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default CorrectiveActionsPage
