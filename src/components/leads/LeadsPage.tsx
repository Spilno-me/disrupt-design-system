import * as React from 'react'
import { useMemo, useCallback } from 'react'
import { cn } from '../../lib/utils'

// UI Components
import { LeadsDataTable } from './LeadsDataTable'
import { CreateLeadDialog } from './CreateLeadDialog'
import { EditLeadDialog } from './EditLeadDialog'
import { DeleteLeadDialog } from './DeleteLeadDialog'
import { ViewLeadDialog } from './ViewLeadDialog'
import { BulkActionsToolbar } from './BulkActionsToolbar'
import { SearchFilter } from '../shared/SearchFilter/SearchFilter'
import { Pagination } from '../ui/Pagination'
import { GridBlobBackground } from '../ui/GridBlobCanvas'

// Page Sub-Components
import {
  PageHeader,
  StatsCardsRow,
  ActiveFilterBanner,
  MobileLeadsList,
} from './components'

// Hooks
import {
  useLeadsFiltering,
  useLeadsSorting,
  useLeadsPagination,
  useLeadsSelection,
  useLeadsDialogs,
  useLeadsWidgetFilter,
} from './hooks'

// Constants and Types
import { LEADS_FILTER_GROUPS, PAGE_SIZE_OPTIONS } from './constants'
import type { LeadsPageProps } from './types'
import type { Lead, LeadAction } from './LeadCard'
import type { ExportOptions } from './ExportButton'

// Re-export types for backwards compatibility
export type { LeadsPageProps } from './types'

// =============================================================================
// LEADS PAGE COMPONENT
// =============================================================================

/**
 * LeadsPage - Full page layout for managing leads
 *
 * Includes:
 * - Stats cards row showing KPIs
 * - Search and filter bar
 * - Data table for desktop (md+)
 * - Card grid for mobile (< md)
 * - Pagination
 *
 * @example
 * ```tsx
 * <LeadsPage
 *   leads={leadsData}
 *   stats={{
 *     totalLeads: { value: 6, trend: '+12%', trendDirection: 'up' },
 *     newLeads: { value: 0, trend: '+5' },
 *     converted: { value: 0, trend: '0.0%' },
 *   }}
 *   onLeadClick={(lead) => router.push(`/leads/${lead.id}`)}
 * />
 * ```
 */
export function LeadsPage({
  leads,
  stats,
  onLeadClick,
  onLeadAction,
  onCreateLead,
  onEditLead,
  onDeleteLead,
  partners = [],
  title = 'Leads',
  defaultPageSize = 10,
  loading = false,
  className,
  onBulkAction,
  onExport,
  initialFilters,
}: LeadsPageProps) {
  // Pagination hook
  const pagination = useLeadsPagination({ defaultPageSize })

  // Filtering hook
  const filtering = useLeadsFiltering({
    initialFilters,
    onFiltersChange: pagination.resetPage,
  })

  // Widget filter hook (depends on filtering.setFilters)
  const widgetFilter = useLeadsWidgetFilter({
    setFilters: filtering.setFilters,
    resetPage: pagination.resetPage,
  })

  // Sorting hook
  const sorting = useLeadsSorting()

  // Selection hook
  const selection = useLeadsSelection({ onBulkAction })

  // Dialog hook - manages Create, Edit, Delete, View dialogs internally
  const dialogs = useLeadsDialogs({
    onCreateLead,
    onEditLead,
    onDeleteLead,
  })

  // Derived data: filter -> sort -> paginate
  const filteredLeads = useMemo(
    () => filtering.filterLeads(leads),
    [filtering, leads]
  )

  const sortedLeads = useMemo(
    () => sorting.sortLeads(filteredLeads),
    [sorting, filteredLeads]
  )

  const paginatedLeads = useMemo(
    () => pagination.paginateItems(sortedLeads),
    [pagination, sortedLeads]
  )

  // Handle filter change with widget clear
  const handleFiltersChange = useCallback((newFilters: typeof filtering.filters) => {
    filtering.handleFiltersChange(newFilters)
    widgetFilter.clearActiveWidget()
  }, [filtering, widgetFilter])

  // Handle search change
  const handleSearchChange = useCallback((value: string) => {
    filtering.setSearchValue(value)
    pagination.resetPage()
  }, [filtering, pagination])

  // Handle action from table/card - routes to dialogs or external handler
  const handleLeadAction = useCallback((lead: Lead, action: LeadAction) => {
    // If external handler provided, use it
    if (onLeadAction) {
      onLeadAction(lead, action)
      return
    }

    // Otherwise, use internal dialog management
    switch (action) {
      case 'view':
        dialogs.openViewDialog(lead)
        break
      case 'edit':
        dialogs.openEditDialog(lead)
        break
      case 'delete':
        dialogs.openDeleteDialog(lead)
        break
      default:
        // For other actions (assign, convert, etc.), do nothing internally
        break
    }
  }, [onLeadAction, dialogs])

  // Handle export
  const handleExport = useCallback(async (options: ExportOptions) => {
    if (!onExport) return
    await onExport(options)
  }, [onExport])

  return (
    <div className={cn('relative min-h-full bg-surface', className)}>
      <GridBlobBackground scale={2} />

      <div className="relative z-10 flex flex-col gap-6 p-6">
        {/* Page Header */}
        <PageHeader
          title={title}
          selectedCount={selection.selectedLeads.size}
          totalCount={sortedLeads.length}
          onExport={onExport ? handleExport : undefined}
          onCreateLead={onCreateLead ? () => dialogs.setCreateDialogOpen(true) : undefined}
        />

        {/* Stats Cards Row */}
        {stats && (
          <StatsCardsRow
            stats={stats}
            activeWidget={widgetFilter.activeWidget}
            onWidgetClick={widgetFilter.handleWidgetClick}
          />
        )}

        {/* Active Filter Banner */}
        {widgetFilter.activeWidget && widgetFilter.activeWidget !== 'all' && (
          <ActiveFilterBanner
            activeWidget={widgetFilter.activeWidget}
            filteredCount={filteredLeads.length}
            totalCount={leads.length}
            onClear={() => widgetFilter.handleWidgetClick('all')}
          />
        )}

        {/* Search and Filter Bar */}
        <SearchFilter
          placeholder="Search by name or company..."
          value={filtering.searchValue}
          onChange={handleSearchChange}
          filterGroups={LEADS_FILTER_GROUPS}
          filters={filtering.filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Bulk Actions Toolbar */}
        {onBulkAction && (
          <BulkActionsToolbar
            selectedCount={selection.selectedLeads.size}
            totalCount={sortedLeads.length}
            onAction={selection.handleBulkAction}
            onClearSelection={selection.clearSelection}
            onSelectAll={() => selection.selectAll(sortedLeads)}
            availablePartners={partners.map(p => ({ id: p.id, name: p.name }))}
          />
        )}

        {/* Desktop: Data Table */}
        <div className="hidden md:block">
          <LeadsDataTable
            leads={paginatedLeads}
            selectedLeads={selection.selectedLeads}
            onSelectionChange={selection.setSelectedLeads}
            onLeadClick={onLeadClick}
            onActionClick={handleLeadAction}
            sortColumn={sorting.sortColumn}
            sortDirection={sorting.sortDirection}
            onSortChange={sorting.handleSortChange}
            loading={loading}
            pagination
            currentPage={pagination.currentPage}
            totalItems={sortedLeads.length}
            pageSize={pagination.pageSize}
            onPageChange={pagination.setCurrentPage}
            onPageSizeChange={pagination.handlePageSizeChange}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
          />
        </div>

        {/* Mobile: Card Grid */}
        <div className="md:hidden">
          <MobileLeadsList
            leads={paginatedLeads}
            loading={loading}
            searchValue={filtering.searchValue}
            onLeadClick={onLeadClick}
            onCardAction={handleLeadAction}
          />
        </div>

        {/* Mobile Pagination */}
        <div className="md:hidden">
          {sortedLeads.length > 0 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalItems={sortedLeads.length}
              pageSize={pagination.pageSize}
              onPageChange={pagination.setCurrentPage}
              onPageSizeChange={pagination.handlePageSizeChange}
              showPageSizeSelector
              showResultsText
              showFirstLastButtons
            />
          )}
        </div>
      </div>

      {/* Create Lead Dialog */}
      {onCreateLead && (
        <CreateLeadDialog
          open={dialogs.createDialogOpen}
          onOpenChange={dialogs.setCreateDialogOpen}
          onSubmit={dialogs.handleCreateLead}
          partners={partners}
          isSubmitting={dialogs.isCreating}
        />
      )}

      {/* Edit Lead Dialog */}
      {dialogs.leadToEdit && (
        <EditLeadDialog
          open={dialogs.editDialogOpen}
          onOpenChange={dialogs.setEditDialogOpen}
          lead={dialogs.leadToEdit}
          onSubmit={dialogs.handleEditLead}
          partners={partners}
          isSubmitting={dialogs.isEditing}
        />
      )}

      {/* Delete Lead Dialog */}
      <DeleteLeadDialog
        open={dialogs.deleteDialogOpen}
        onOpenChange={dialogs.setDeleteDialogOpen}
        lead={dialogs.leadToDelete}
        onConfirm={dialogs.handleDeleteLead}
        isDeleting={dialogs.isDeleting}
      />

      {/* View Lead Dialog */}
      <ViewLeadDialog
        open={dialogs.viewDialogOpen}
        onOpenChange={dialogs.setViewDialogOpen}
        lead={dialogs.leadToView}
        onEdit={(lead) => {
          dialogs.setViewDialogOpen(false)
          dialogs.openEditDialog(lead)
        }}
        onDelete={(lead) => {
          dialogs.setViewDialogOpen(false)
          dialogs.openDeleteDialog(lead)
        }}
      />
    </div>
  )
}

export default LeadsPage
