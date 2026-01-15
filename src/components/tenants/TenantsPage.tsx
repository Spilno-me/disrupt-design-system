"use client"

/**
 * TenantsPage - Operational list of active customers
 * @module tenants/TenantsPage
 *
 * Per spec (05_tenants_page.md):
 * - KPI widgets (Total, Active, Overdue, Suspended)
 * - Search by company name + contact person
 * - Status filter
 * - Table with: Company/Tenant, Contact, Status, Tier, Licenses, Monthly Payment, Active Since, Actions
 * - Actions: View, Change Status
 * - Change Status modal with dropdown + notes
 */

import * as React from "react"
import { useState, useMemo, useCallback, useEffect } from "react"
import { Building2 } from "lucide-react"
import { cn } from "../../lib/utils"

// Types
import type {
  Tenant,
  TenantStatus,
  OrganizationTier,
  SubscriptionPackage,
  TenantsPageProps,
  TenantFormData,
  ChangeStatusFormData,
  TenantsStats,
} from "./types"

// Data
import { MOCK_TENANTS, MOCK_TENANTS_STATS, generateTenantsStats } from "./data/mock-tenants"

// Constants
import { TENANT_FILTER_GROUPS } from "./constants/filter.constants"

// UI Components
import { DataTable } from "../ui/DataTable"
import { SearchFilter } from "../shared/SearchFilter/SearchFilter"
import type { FilterState } from "../shared/SearchFilter/types"
import { PageActionPanel } from "../ui/PageActionPanel"

// Page Sub-Components
import { TenantsStatsCardsRow, ActiveFilterBanner } from "./components"

// Hooks
import { useTenantsWidgetFilter, useTenantsDialogs, useTenantsTableColumns } from "./hooks"

// Constants (extracted)
import { EMPTY_FILTER_STATE } from "./constants"

// Dialogs
import { ViewTenantDialog } from "./ViewTenantDialog"
import { EditTenantDialog } from "./EditTenantDialog"
import { ChangeStatusDialog } from "./ChangeStatusDialog"

// Re-export types for external consumers
export type { TenantStatus, OrganizationTier, SubscriptionPackage, Tenant, TenantsPageProps, TenantFormData }
export { MOCK_TENANTS, MOCK_TENANTS_STATS }

// =============================================================================
// MAIN COMPONENT
// =============================================================================
// Note: Constants and helpers extracted to ./constants/ and ./utils/
// Column definitions extracted to ./hooks/useTenantsTableColumns.tsx

/**
 * TenantsPage - Full page layout for managing tenants
 *
 * Features:
 * - KPI widgets row (Total, Active, Overdue, Suspended)
 * - Search and status filters
 * - Data table with spec-compliant columns
 * - Actions dropdown menu
 * - Pagination
 */
export function TenantsPage({
  tenants: initialTenants = MOCK_TENANTS,
  stats: initialStats,
  onViewTenant,
  onEditTenant,
  onChangeStatus,
  onSuspendTenant, // deprecated
  onActivateTenant, // deprecated
  loading = false,
  className,
}: TenantsPageProps) {
  // Internal tenant state - allows UI updates after actions
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants)

  // Sync internal state when prop changes
  useEffect(() => {
    setTenants(initialTenants)
  }, [initialTenants])

  // Compute stats from tenants (or use provided stats)
  const stats: TenantsStats = useMemo(() => {
    return initialStats ?? generateTenantsStats(tenants)
  }, [initialStats, tenants])

  // Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTER_STATE)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Widget filter hook
  const widgetFilter = useTenantsWidgetFilter({
    setFilters,
    resetPage: () => setCurrentPage(1),
  })

  // Dialog management hook (extracted state + handlers)
  const dialogs = useTenantsDialogs({
    onViewTenant,
    onEditTenant,
    onChangeStatus,
    setTenants,
    onSuspendTenant,
    onActivateTenant,
  })

  // Table columns hook (extracted column definitions)
  const { columns } = useTenantsTableColumns({
    onViewTenant: dialogs.handleViewTenantClick,
    onChangeStatus: dialogs.handleChangeStatusClick,
  })

  // Filter tenants based on search and filters
  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      // Search filter - company name + contact person (per spec)
      const matchesSearch =
        searchQuery === "" ||
        tenant.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.contactName.toLowerCase().includes(searchQuery.toLowerCase())

      // Status filter
      const matchesStatus =
        filters.status?.length === 0 || filters.status?.includes(tenant.status)

      return matchesSearch && matchesStatus
    })
  }, [tenants, searchQuery, filters])

  // Paginated tenants
  const paginatedTenants = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredTenants.slice(startIndex, startIndex + pageSize)
  }, [filteredTenants, currentPage, pageSize])

  // Handle filter changes (clears widget filter)
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
    widgetFilter.clearActiveWidget()
  }, [widgetFilter])

  // Handle search change
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }, [])

  // Row click handler (delegates to dialogs hook)
  const handleRowClick = useCallback((tenant: Tenant) => {
    dialogs.handleViewTenantClick(tenant)
  }, [dialogs])

  return (
    <main
      data-slot="tenants-page"
      data-testid="tenants-page"
      className={cn("min-h-screen", className)}
    >
      <div className="flex flex-col gap-6 p-4 md:p-6">
        {/* Page Header */}
        <PageActionPanel
          icon={<Building2 className="w-6 h-6 md:w-8 md:h-8" />}
          iconClassName="text-accent"
          title="Tenants"
          subtitle="Manage active customers and monitor account status."
        />

        {/* KPI Widgets */}
        <TenantsStatsCardsRow
          stats={stats}
          activeWidget={widgetFilter.activeWidget}
          onWidgetClick={widgetFilter.handleWidgetClick}
        />

        {/* Active Filter Banner */}
        {widgetFilter.activeWidget && widgetFilter.activeWidget !== "all" && (
          <ActiveFilterBanner
            activeWidget={widgetFilter.activeWidget}
            filteredCount={filteredTenants.length}
            totalCount={tenants.length}
            onClear={() => widgetFilter.handleWidgetClick("all")}
          />
        )}

        {/* Glass container for main content */}
        <section className="rounded-xl border-2 border-accent bg-white/40 dark:bg-black/40 backdrop-blur-[4px] shadow-md">
          <div className="flex flex-col gap-4 p-4 md:p-6">
            {/* Search and Filter Bar */}
            <SearchFilter
              placeholder="Search by company or contact name"
              value={searchQuery}
              onChange={handleSearchChange}
              filterGroups={TENANT_FILTER_GROUPS}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              className="bg-surface border border-default rounded-lg"
              data-testid="tenants-search-filter"
            />

            {/* Data Table */}
            <DataTable
              data={paginatedTenants}
              columns={columns}
              getRowId={(row) => row.id}
              loading={loading}
              hoverable
              bordered
              onRowClick={handleRowClick}
              pagination
              currentPage={currentPage}
              totalItems={filteredTenants.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setCurrentPage(1)
              }}
              pageSizeOptions={[10, 25, 50]}
              data-testid="tenants-table"
              emptyState={
                <div className="flex flex-col items-center py-8">
                  <div className="w-16 h-16 mb-4 rounded-full bg-muted-bg flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-muted" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    {searchQuery || (filters.status?.length ?? 0) > 0
                      ? "No tenants found"
                      : "No tenants yet"}
                  </h3>
                  <p className="text-muted text-sm max-w-sm text-center">
                    {searchQuery || (filters.status?.length ?? 0) > 0
                      ? "No tenants match your search criteria. Try adjusting your filters."
                      : "Tenants will appear here once they complete the onboarding process."}
                  </p>
                </div>
              }
            />
          </div>
        </section>
      </div>

      {/* View Tenant Dialog */}
      <ViewTenantDialog
        open={dialogs.viewDialogOpen}
        onOpenChange={dialogs.setViewDialogOpen}
        tenant={dialogs.selectedTenant}
        onEdit={dialogs.handleEditTenantClick}
        onSuspend={dialogs.handleChangeStatusClick}
        onActivate={dialogs.handleChangeStatusClick}
      />

      {/* Edit Tenant Dialog */}
      <EditTenantDialog
        open={dialogs.editDialogOpen}
        onOpenChange={dialogs.setEditDialogOpen}
        tenant={dialogs.tenantToEdit}
        onSubmit={dialogs.handleEditSubmit}
        isSubmitting={dialogs.isSubmitting}
      />

      {/* Change Status Dialog */}
      <ChangeStatusDialog
        open={dialogs.changeStatusDialogOpen}
        onOpenChange={dialogs.setChangeStatusDialogOpen}
        tenant={dialogs.tenantToChangeStatus}
        onConfirm={dialogs.handleChangeStatusConfirm}
        isSubmitting={dialogs.isChangingStatus}
      />
    </main>
  )
}

export default TenantsPage
