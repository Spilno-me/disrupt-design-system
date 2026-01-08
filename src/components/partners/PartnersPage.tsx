"use client"

/**
 * PartnersPage - Partners management page with tabs
 * State and handlers extracted to usePartnersPageState + usePartnersPageHandlers hooks
 * @component ORGANISM
 */

import * as React from "react"
import { useMemo } from "react"
import { Plus, Building2, Network } from "lucide-react"
import { cn } from "../../lib/utils"

// Constants
import { PARTNER_FILTER_GROUPS, PAGE_SIZE_OPTIONS, GLASS_CARD_CLASSES } from "./constants"

// Types
import type { Partner, PartnerStatus, PartnerTier, PartnersPageProps, PartnerNetworkPageProps } from "./types"
import type { FilterState } from "../shared/SearchFilter/types"
import { MOCK_PARTNERS } from "./data"

// Extracted hooks (state + handlers)
import { usePartnersPageState, usePartnersPageHandlers } from "./hooks"
import type { PartnersTab } from "./hooks"

// Extracted components
import { createPartnerColumns, PartnersEmptyState } from "./components"

// UI components
import { Button } from "../ui/button"
import { DataTable } from "../ui/DataTable"
import { SearchFilter } from "../shared/SearchFilter/SearchFilter"
import { EditPartnerDialog, PartnerFormData } from "./EditPartnerDialog"
import { DeletePartnerDialog } from "./DeletePartnerDialog"
import { PageActionPanel } from "../ui/PageActionPanel"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs"
import { PartnerNetworkPage } from "./PartnerNetworkPage"

// Re-export types for external consumers
export type { PartnerStatus, PartnerTier, Partner, PartnersPageProps, PartnersTab }
export { MOCK_PARTNERS }

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/** Check if any filters are currently active */
function hasActiveFilters(searchQuery: string, filters: FilterState): boolean {
  return searchQuery !== "" || filters.status.length > 0 || filters.tier.length > 0
}

/** Filter partners based on search query and filter state */
function filterPartners(partners: Partner[], searchQuery: string, filters: FilterState): Partner[] {
  return partners.filter((partner) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch = searchQuery === "" ||
      partner.name.toLowerCase().includes(query) ||
      partner.partnerId.toLowerCase().includes(query) ||
      partner.contactName.toLowerCase().includes(query) ||
      partner.contactEmail.toLowerCase().includes(query)
    const matchesStatus = filters.status.length === 0 || filters.status.includes(partner.status)
    const matchesTier = filters.tier.length === 0 || filters.tier.includes(partner.tier)
    return matchesSearch && matchesStatus && matchesTier
  })
}

/** Get paginated slice of partners */
function paginatePartners(partners: Partner[], page: number, pageSize: number): Partner[] {
  const startIndex = (page - 1) * pageSize
  return partners.slice(startIndex, startIndex + pageSize)
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function PartnersPage({
  partners = MOCK_PARTNERS,
  onAddPartner, onViewPartner, onEditPartner, onCreatePartner,
  onManageUsers, onDeletePartner, onConfirmDelete,
  loading = false, className, activeTab, onTabChange, networkProps,
}: PartnersPageProps & {
  activeTab?: PartnersTab
  onTabChange?: (tab: PartnersTab) => void
  networkProps?: Partial<PartnerNetworkPageProps>
}) {
  // Use extracted hooks for state and handlers
  const state = usePartnersPageState()
  const currentTab = activeTab ?? state.internalTab

  const handlers = usePartnersPageHandlers(state, {
    onTabChange, onAddPartner, onViewPartner, onEditPartner,
    onCreatePartner, onDeletePartner, onConfirmDelete,
  })

  // Derived state (depends on props, must stay in component)
  const filteredPartners = useMemo(
    () => filterPartners(partners, state.searchQuery, state.filters),
    [partners, state.searchQuery, state.filters]
  )
  const paginatedPartners = useMemo(
    () => paginatePartners(filteredPartners, state.currentPage, state.pageSize),
    [filteredPartners, state.currentPage, state.pageSize]
  )
  const showFiltersActive = hasActiveFilters(state.searchQuery, state.filters)

  // Create columns with handlers
  const columns = useMemo(
    () => createPartnerColumns({
      onEdit: handlers.handleViewPartnerClick,
      onManageUsers,
      onDelete: handlers.handleDeletePartnerClick,
    }),
    [handlers.handleViewPartnerClick, onManageUsers, handlers.handleDeletePartnerClick]
  )

  return (
    <main data-slot="partners-page" data-testid="partners-page" className={cn("min-h-screen", className)}>
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <PageActionPanel
          icon={<Building2 className="w-6 h-6 md:w-8 md:h-8" />}
          iconClassName="text-accent"
          title="Partners"
          subtitle="Manage partner organizations and relationships"
          primaryAction={currentTab === "partners" ? (
            <Button variant="accent" size="sm" onClick={handlers.handleAddPartnerClick} data-testid="partners-add-button">
              <Plus className="h-4 w-4" />
              Add Partner
            </Button>
          ) : undefined}
        />

        <Tabs value={currentTab} onValueChange={handlers.handleTabChange} className="w-full">
          <TabsList variant="accent" animated className="mb-4" data-testid="partners-tabs">
            <TabsTrigger variant="accent" value="partners" data-testid="partners-tab-partners">
              <Building2 className="h-4 w-4 mr-1.5" />
              Partners
            </TabsTrigger>
            <TabsTrigger variant="accent" value="sub-partners" data-testid="partners-tab-sub-partners">
              <Network className="h-4 w-4 mr-1.5" />
              Sub-Partners
            </TabsTrigger>
          </TabsList>

          <TabsContent value="partners" className="mt-0">
            <section className={cn("rounded-xl", GLASS_CARD_CLASSES)}>
              <div className="flex flex-col gap-4 p-4 md:p-6">
                <SearchFilter
                  placeholder="Search partners..."
                  value={state.searchQuery}
                  onChange={handlers.handleSearchChange}
                  filterGroups={PARTNER_FILTER_GROUPS}
                  filters={state.filters}
                  onFiltersChange={handlers.handleFiltersChange}
                  className="bg-surface border border-default rounded-lg"
                  data-testid="partners-search-filter"
                />
                <DataTable
                  data={paginatedPartners}
                  columns={columns}
                  getRowId={(row) => row.id}
                  loading={loading}
                  hoverable bordered pagination
                  currentPage={state.currentPage}
                  totalItems={filteredPartners.length}
                  pageSize={state.pageSize}
                  onPageChange={state.setCurrentPage}
                  onPageSizeChange={handlers.handlePageSizeChange}
                  pageSizeOptions={[...PAGE_SIZE_OPTIONS]}
                  data-testid="partners-table"
                  emptyState={<PartnersEmptyState hasActiveFilters={showFiltersActive} />}
                />
              </div>
            </section>
          </TabsContent>

          <TabsContent value="sub-partners" className="mt-0">
            <PartnerNetworkPage {...networkProps} className="min-h-0 [&>div]:p-0" />
          </TabsContent>
        </Tabs>
      </div>

      <EditPartnerDialog
        open={state.editDialogOpen}
        onOpenChange={state.setEditDialogOpen}
        partner={state.selectedPartner}
        onSubmit={handlers.handleDialogSubmit}
        isSubmitting={state.isSubmitting}
        mode={state.dialogMode}
      />
      <DeletePartnerDialog
        open={state.deleteDialogOpen}
        onOpenChange={state.setDeleteDialogOpen}
        partner={state.partnerToDelete}
        onConfirm={handlers.handleDeleteConfirm}
        isDeleting={state.isDeleting}
      />
    </main>
  )
}

export default PartnersPage
