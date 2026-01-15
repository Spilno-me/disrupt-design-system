"use client"

/**
 * TenantsPageV2 - Tabbed Tenants page with Direct + Passive Income views
 * @module tenants/TenantsPageV2
 *
 * Per spec Section 4.2 and 12.3:
 * - Two tabs: Direct Tenants (all roles) and Passive Income (partner-admin, system-admin only)
 * - Tab switching preserves filters/sort/search/pagination per tab
 * - V2 KPI widgets: Active (clickable), MRR (info), ARR (info), Overdue (clickable)
 *
 * @since v2.0
 */

import * as React from "react"
import { useState, useMemo, useCallback, useEffect } from "react"
import { Building2, DollarSign, Users } from "lucide-react"

// Types
import type {
  Tenant,
  TenantsStatsV2,
  TenantWidgetFilterV2,
  TenantsTabId,
  TenantsTabConfig,
  PassiveIncomeTenant,
  ChangeStatusFormData,
  UserRole,
} from "./types"

// Data
import {
  MOCK_TENANTS,
  MOCK_PASSIVE_INCOME,
  generateTenantsStatsV2,
} from "./data/mock-tenants"

// UI Components
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { PageActionPanel } from "../ui/PageActionPanel"

// Page Components
import {
  TenantsStatsCardsRowV2,
  ActiveFilterBanner,
  DirectTenantsTabContent,
  PassiveIncomeTabContent,
} from "./components"

// Hooks
import { useTabState } from "./hooks"

// Dialogs
import { ViewTenantDialog } from "./ViewTenantDialog"
import { ChangeStatusDialog } from "./ChangeStatusDialog"

// =============================================================================
// TYPES
// =============================================================================

export interface TenantsPageV2Props {
  /** Direct tenants data */
  tenants?: Tenant[]
  /** Passive income data (sub-partner earnings) */
  passiveIncomeData?: PassiveIncomeTenant[]
  /** V2 Stats data */
  stats?: TenantsStatsV2
  /** Tab configuration */
  tabConfig?: TenantsTabConfig
  /** Current user role for tab visibility */
  userRole?: UserRole
  /** Callback when tenant is viewed */
  onViewTenant?: (tenant: Tenant) => void
  /** Callback when tenant status changes */
  onChangeStatus?: (tenant: Tenant, data: ChangeStatusFormData) => void
  /** Loading state */
  loading?: boolean
  /** Additional className */
  className?: string
}

// =============================================================================
// CONSTANTS
// =============================================================================

const TAB_LABELS = {
  direct: "Direct Tenants",
  passive: "Passive Income",
} as const

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * TenantsPageV2 - Tabbed tenants management page
 *
 * @example
 * ```tsx
 * <TenantsPageV2
 *   tenants={tenants}
 *   passiveIncomeData={passiveIncome}
 *   userRole="partner-admin"
 * />
 * ```
 */
export function TenantsPageV2({
  tenants: initialTenants = MOCK_TENANTS,
  passiveIncomeData: initialPassiveIncome = MOCK_PASSIVE_INCOME,
  stats: initialStats,
  tabConfig,
  userRole = "partner-admin",
  onViewTenant,
  onChangeStatus,
  loading = false,
  className,
}: TenantsPageV2Props) {
  // Internal state
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants)
  const [passiveIncomeData] = useState<PassiveIncomeTenant[]>(initialPassiveIncome)

  // Sync with props
  useEffect(() => {
    setTenants(initialTenants)
  }, [initialTenants])

  // Compute stats
  const stats: TenantsStatsV2 = useMemo(() => {
    return initialStats ?? generateTenantsStatsV2(tenants)
  }, [initialStats, tenants])

  // Tab state management (per-tab state preservation)
  const {
    activeTab,
    setActiveTab,
    getTabState,
    setSearchQuery,
    setFilters,
    setCurrentPage,
    setPageSize,
  } = useTabState({ defaultTab: tabConfig?.defaultTab ?? "direct" })

  // Widget filter state
  const [activeWidget, setActiveWidget] = useState<TenantWidgetFilterV2>(null)

  // Dialog state
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [changeStatusDialogOpen, setChangeStatusDialogOpen] = useState(false)
  const [tenantToChangeStatus, setTenantToChangeStatus] = useState<Tenant | null>(null)
  const [isChangingStatus, setIsChangingStatus] = useState(false)

  // Role-based tab visibility
  const showPassiveIncomeTab = userRole === "partner-admin" || userRole === "system-admin"

  // Widget click handler
  const handleWidgetClick = useCallback((widget: TenantWidgetFilterV2) => {
    setActiveWidget(widget)

    // Apply filter based on widget
    if (widget === "active" || widget === "overdue") {
      setFilters("direct", { status: [widget] })
      setCurrentPage("direct", 1)
    } else if (widget === null) {
      setFilters("direct", { status: [] })
    }
  }, [setFilters, setCurrentPage])

  // Clear widget filter
  const clearWidgetFilter = useCallback(() => {
    setActiveWidget(null)
    setFilters("direct", { status: [] })
  }, [setFilters])

  // Tab change handler
  const handleTabChange = useCallback((value: string) => {
    const newTab = value as TenantsTabId
    setActiveTab(newTab)
    tabConfig?.onTabChange?.(newTab)
  }, [setActiveTab, tabConfig])

  // View tenant handler
  const handleViewTenant = useCallback((tenant: Tenant) => {
    if (onViewTenant) {
      onViewTenant(tenant)
    } else {
      setSelectedTenant(tenant)
      setViewDialogOpen(true)
    }
  }, [onViewTenant])

  // Change status handler
  const handleChangeStatus = useCallback((tenant: Tenant) => {
    setTenantToChangeStatus(tenant)
    setChangeStatusDialogOpen(true)
  }, [])

  // Confirm status change
  const handleChangeStatusConfirm = useCallback(async (tenant: Tenant, data: ChangeStatusFormData) => {
    setIsChangingStatus(true)
    try {
      if (onChangeStatus) {
        await onChangeStatus(tenant, data)
      }
      // Update internal state
      setTenants((prev) =>
        prev.map((t) =>
          t.id === tenant.id
            ? {
                ...t,
                status: data.status,
                monthlyPayment: data.status === "suspended" ? 0 : t.monthlyPayment,
              }
            : t
        )
      )
      setChangeStatusDialogOpen(false)
    } finally {
      setIsChangingStatus(false)
    }
  }, [onChangeStatus])

  // Get current tab state
  const directTabState = getTabState("direct")
  const passiveTabState = getTabState("passive")

  // Count badges
  const directCount = tenants.length
  const passiveCount = passiveIncomeData.length

  return (
    <main
      data-slot="tenants-page-v2"
      data-testid="tenants-page-v2"
      className={className}
    >
      <div className="flex flex-col gap-6 p-4 md:p-6">
        {/* Page Header */}
        <PageActionPanel
          icon={<Building2 className="w-6 h-6 md:w-8 md:h-8" />}
          iconClassName="text-accent"
          title={TAB_LABELS[activeTab]}
          subtitle={
            activeTab === "direct"
              ? "Manage active customers and monitor account status."
              : "Track earnings from sub-partner tenant relationships."
          }
        />

        {/* KPI Widgets (Direct Tenants tab only) */}
        {activeTab === "direct" && (
          <TenantsStatsCardsRowV2
            stats={stats}
            activeWidget={activeWidget}
            onWidgetClick={handleWidgetClick}
          />
        )}

        {/* Active Filter Banner */}
        {activeTab === "direct" && activeWidget && (
          <ActiveFilterBanner
            activeWidget={activeWidget}
            filteredCount={tenants.filter((t) => t.status === activeWidget).length}
            totalCount={tenants.length}
            onClear={clearWidgetFilter}
          />
        )}

        {/* Tabs Container */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList variant="accent" animated className="w-full max-w-md">
            <TabsTrigger variant="accent" value="direct" className="flex-1">
              <Users className="h-4 w-4" />
              {TAB_LABELS.direct}
              <Badge variant="secondary" size="sm" className="ml-1">
                {directCount}
              </Badge>
            </TabsTrigger>
            {showPassiveIncomeTab && (
              <TabsTrigger variant="accent" value="passive" className="flex-1">
                <DollarSign className="h-4 w-4" />
                {TAB_LABELS.passive}
                <Badge variant="secondary" size="sm" className="ml-1">
                  {passiveCount}
                </Badge>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Direct Tenants Tab */}
          <TabsContent value="direct">
            <section className="rounded-xl border-2 border-accent bg-white/40 dark:bg-black/40 backdrop-blur-[4px] shadow-md">
              <div className="p-4 md:p-6">
                <DirectTenantsTabContent
                  tenants={tenants}
                  loading={loading}
                  searchQuery={directTabState.searchQuery}
                  onSearchChange={(value) => setSearchQuery("direct", value)}
                  filters={directTabState.filters}
                  onFiltersChange={(filters) => {
                    setFilters("direct", filters)
                    setActiveWidget(null)
                  }}
                  currentPage={directTabState.currentPage}
                  onPageChange={(page) => setCurrentPage("direct", page)}
                  pageSize={directTabState.pageSize}
                  onPageSizeChange={(size) => setPageSize("direct", size)}
                  onViewTenant={handleViewTenant}
                  onChangeStatus={handleChangeStatus}
                />
              </div>
            </section>
          </TabsContent>

          {/* Passive Income Tab */}
          {showPassiveIncomeTab && (
            <TabsContent value="passive">
              <section className="rounded-xl border-2 border-accent bg-white/40 dark:bg-black/40 backdrop-blur-[4px] shadow-md">
                <div className="p-4 md:p-6">
                  <PassiveIncomeTabContent
                    data={passiveIncomeData}
                    loading={loading}
                    searchQuery={passiveTabState.searchQuery}
                    onSearchChange={(value) => setSearchQuery("passive", value)}
                    filters={passiveTabState.filters}
                    onFiltersChange={(filters) => setFilters("passive", filters)}
                    currentPage={passiveTabState.currentPage}
                    onPageChange={(page) => setCurrentPage("passive", page)}
                    pageSize={passiveTabState.pageSize}
                    onPageSizeChange={(size) => setPageSize("passive", size)}
                  />
                </div>
              </section>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* View Tenant Dialog */}
      <ViewTenantDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        tenant={selectedTenant}
        onEdit={handleChangeStatus}
        onSuspend={handleChangeStatus}
        onActivate={handleChangeStatus}
      />

      {/* Change Status Dialog */}
      <ChangeStatusDialog
        open={changeStatusDialogOpen}
        onOpenChange={setChangeStatusDialogOpen}
        tenant={tenantToChangeStatus}
        onConfirm={handleChangeStatusConfirm}
        isSubmitting={isChangingStatus}
      />
    </main>
  )
}

export default TenantsPageV2
