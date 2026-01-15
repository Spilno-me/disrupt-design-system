/**
 * PartnerPortalPage - Complete Partner Portal Application Template
 *
 * A fully-featured partner portal using AppLayoutShell with all pages pre-wired.
 * Consumers can use this as-is or customize individual pages.
 *
 * @example Basic usage
 * ```tsx
 * <PartnerPortalPage
 *   user={{ name: 'John Partner', email: 'john@partner.com' }}
 *   leads={leadsData}
 *   partners={partnersData}
 *   invoices={invoicesData}
 *   onCreateLead={(data) => api.createLead(data)}
 *   onNavigate={(pageId) => router.push(pageId)}
 * />
 * ```
 */

import * as React from 'react'
import { useState, useCallback } from 'react'
import { Users, Settings } from 'lucide-react'
import { AppLayoutShell } from '../layout/AppLayoutShell'
import { partnerNavItems, addBadges } from '../navigation/configs'
import type { UserMenuItem } from '../../components/ui/AppHeader'
import type { Partner } from '../../components/partners/PartnersPage'
import { MOCK_NETWORK_PARTNERS } from '../../components/partners/PartnerNetworkPage'
import {
  useRoleDashboardConfig,
  MOCK_DASHBOARD_DATA,
  type UserRole,
  type NavigationFilter,
  type DashboardHandlers,
} from '../../components/partners/dashboard'
import type { FilterState } from '../../components/shared/SearchFilter/types'
import { MOCK_TENANTS } from '../../components/tenants'
import { MOCK_EARNINGS, MOCK_EARNINGS_SUMMARY } from '../../components/earnings'
// Quick Action Dialog imports
import { CreateLeadDialog } from '../../components/leads/CreateLeadDialog'
import { CreateSubPartnerDialog } from '../../components/partners/CreateSubPartnerDialog'
import type { NetworkPartner, SubPartnerFormData } from '../../components/partners/types/partner-network.types'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../../components/ui/sheet'
import { TenantRequestWizard } from '../../components/partners/TenantRequest/TenantRequestWizard'

// Import from partner-portal module
import {
  usePageRenderer,
  DEFAULT_USER,
  getDefaultSettings,
  type PartnerPortalPageProps,
} from './partner-portal'

// Re-export types for backwards compatibility
export type {
  PartnerPortalStats,
  DashboardConfig,
  TenantRequestStatus,
  TenantRequest,
  PartnerPortalPageProps,
} from './partner-portal'

export { MOCK_TENANT_REQUESTS } from './partner-portal'

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_USER_MENU_ITEMS: UserMenuItem[] = [
  { id: 'profile', label: 'Profile', icon: <Users className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  { id: 'logout', label: 'Log out', destructive: true },
]

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * PartnerPortalPage - Complete Partner Portal Application
 *
 * A production-ready partner portal that uses AppLayoutShell and pre-wired pages.
 * Supports both automatic (pass data, let it render) and controlled (custom content) modes.
 */
export function PartnerPortalPage(props: PartnerPortalPageProps) {
  const {
    user = DEFAULT_USER,
    userMenuItems = DEFAULT_USER_MENU_ITEMS,
    notificationCount = 0,
    leads = [],
    partners = [],
    networkPartners: _networkPartners = MOCK_NETWORK_PARTNERS,
    invoices = [],
    stats,
    dashboardConfig,
    badges = {},
    onLeadClick,
    onLeadAction,
    onCreateLead,
    leadPartners = [],
    onEditPartner,
    onCreatePartner,
    onManageUsers,
    onDeletePartner,
    onEditNetworkPartner: _onEditNetworkPartner,
    onAddSubPartner: _onAddSubPartner,
    onDeleteNetworkPartner: _onDeleteNetworkPartner,
    onInvoiceClick,
    onInvoiceAction,
    onUpdateInvoice,
    onProvisioningComplete: _onProvisioningComplete,
    settingsUser,
    settingsCompany,
    settingsNotifications,
    onSaveProfile,
    onSaveCompany,
    onSaveNotifications,
    onChangePassword,
    onChangeAvatar,
    onArticleClick,
    onContactSupport,
    onHelpSearch,
    onCalculatePricing,
    onGenerateQuote,
    tenants = MOCK_TENANTS,
    passiveIncomeData,
    tenantsStats,
    onViewTenant,
    onChangeStatus,
    onEditTenant,
    onSuspendTenant,
    onActivateTenant,
    earningsSummary = MOCK_EARNINGS_SUMMARY,
    earnings = MOCK_EARNINGS,
    initialPage = 'dashboard',
    currentPageId,
    onPageChange,
    onNavigate,
    onNotificationClick,
    onMenuItemClick,
    onHelpClick,
    onLogoClick,
    pageOverrides = {},
  } = props

  // State
  const [internalPage, setInternalPage] = useState(initialPage)
  const [pageFilters, setPageFilters] = useState<NavigationFilter | undefined>()
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [partnerPageMode, setPartnerPageMode] = useState<'edit' | 'create'>('edit')

  // Quick Action Dialog states
  const [createLeadDialogOpen, setCreateLeadDialogOpen] = useState(false)
  const [createSubPartnerDialogOpen, setCreateSubPartnerDialogOpen] = useState(false)
  const [tenantRequestSheetOpen, setTenantRequestSheetOpen] = useState(false)

  const activePage = currentPageId ?? internalPage
  const userRole: UserRole = user.role ?? 'partner'
  const userName = user.name?.split(' ')[0] ?? 'Partner'

  // Navigation handlers
  const handlePageChange = useCallback(
    (pageId: string) => (onPageChange ? onPageChange(pageId) : setInternalPage(pageId)),
    [onPageChange]
  )

  const handleNavigateWithFilter = useCallback(
    (pageId: string, filters?: NavigationFilter) => {
      setPageFilters(filters)
      handlePageChange(pageId)
    },
    [handlePageChange]
  )

  // Convert NavigationFilter -> FilterState for LeadsPage
  const leadsInitialFilters: FilterState | undefined = pageFilters
    ? { status: pageFilters.status ?? [], priority: pageFilters.priority ?? [], source: [] }
    : undefined

  // Dashboard handlers - open dialogs directly for immediate action
  const dashboardHandlers: DashboardHandlers = {
    onNavigate: handleNavigateWithFilter,
    onCreateLead: () => setCreateLeadDialogOpen(true),
    onCreateTenantRequest: () => setTenantRequestSheetOpen(true),
    onAddPartner: () => setCreateSubPartnerDialogOpen(true),
  }

  // Get the current user's partner for sub-partner creation (first network partner or mock)
  const currentUserPartner: NetworkPartner = _networkPartners[0] ?? MOCK_NETWORK_PARTNERS[0]

  // Quick Action dialog handlers
  const handleCreateLeadSubmit = useCallback(
    async (data: Parameters<NonNullable<typeof onCreateLead>>[0]) => {
      await onCreateLead?.(data)
      setCreateLeadDialogOpen(false)
    },
    [onCreateLead]
  )

  const handleCreateSubPartnerSubmit = useCallback(
    async (_data: SubPartnerFormData, parentPartner: NetworkPartner) => {
      // Call the parent callback if provided
      // Note: _onAddSubPartner expects to receive the parentPartner for context
      // The form data (_data) can be handled by the consumer's onAddSubPartner implementation
      _onAddSubPartner?.(parentPartner)
      setCreateSubPartnerDialogOpen(false)
    },
    [_onAddSubPartner]
  )

  const handleTenantRequestCancel = useCallback(() => {
    setTenantRequestSheetOpen(false)
  }, [])

  const { kpis: roleKpis, quickActions: roleQuickActions } = useRoleDashboardConfig({
    userRole,
    handlers: dashboardHandlers,
    data: MOCK_DASHBOARD_DATA[userRole],
  })

  const navItemsWithBadges = addBadges(partnerNavItems, badges)
  const { defaultUser, defaultCompany, defaultNotifications } = getDefaultSettings(user)

  // Render page content
  const pageContent = usePageRenderer({
    activePage,
    pageOverrides,
    userName,
    userRole,
    dashboardConfig,
    roleKpis,
    roleQuickActions,
    leads,
    stats,
    leadPartners,
    leadsInitialFilters,
    tenants,
    passiveIncomeData,
    tenantsStats,
    invoices,
    earningsSummary,
    earnings,
    partners,
    editingPartner,
    partnerPageMode,
    setEditingPartner,
    setPartnerPageMode,
    handlePageChange,
    settingsUser: settingsUser ?? defaultUser,
    settingsCompany: settingsCompany ?? defaultCompany,
    settingsNotifications: settingsNotifications ?? defaultNotifications,
    onLeadClick,
    onLeadAction,
    onCreateLead,
    onViewTenant,
    onChangeStatus,
    onEditTenant,
    onSuspendTenant,
    onActivateTenant,
    onInvoiceClick,
    onInvoiceAction,
    onUpdateInvoice,
    onEditPartner,
    onCreatePartner,
    onManageUsers,
    onDeletePartner,
    onCalculatePricing,
    onGenerateQuote,
    onSaveProfile,
    onSaveCompany,
    onSaveNotifications,
    onChangePassword,
    onChangeAvatar,
    onArticleClick,
    onContactSupport,
    onHelpSearch,
  })

  // Menu handlers
  const handleHelpClick = useCallback(() => {
    handlePageChange('help')
    onHelpClick?.()
  }, [handlePageChange, onHelpClick])

  const handleMenuItemClick = useCallback(
    (item: UserMenuItem) => {
      if (item.id === 'settings') handlePageChange('settings')
      onMenuItemClick?.(item)
    },
    [handlePageChange, onMenuItemClick]
  )

  return (
    <>
      <AppLayoutShell
        product="partner"
        navItems={navItemsWithBadges}
        initialPage={initialPage}
        currentPageId={activePage}
        onPageChange={handlePageChange}
        user={user}
        userMenuItems={userMenuItems}
        notificationCount={notificationCount}
        onNavigate={onNavigate}
        onNotificationClick={onNotificationClick}
        onMenuItemClick={handleMenuItemClick}
        onHelpClick={handleHelpClick}
        onLogoClick={onLogoClick}
        showHelpItem={true}
      >
        {pageContent}
      </AppLayoutShell>

      {/* Quick Action Dialogs */}
      <CreateLeadDialog
        open={createLeadDialogOpen}
        onOpenChange={setCreateLeadDialogOpen}
        onSubmit={handleCreateLeadSubmit}
        partners={leadPartners}
      />

      <CreateSubPartnerDialog
        open={createSubPartnerDialogOpen}
        onOpenChange={setCreateSubPartnerDialogOpen}
        parentPartner={currentUserPartner}
        onSubmit={handleCreateSubPartnerSubmit}
      />

      {/* Tenant Request Sheet (for wizard) */}
      <Sheet open={tenantRequestSheetOpen} onOpenChange={setTenantRequestSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl p-0 overflow-hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>Create Tenant Request</SheetTitle>
            <SheetDescription>Create a new tenant request for your customer</SheetDescription>
          </SheetHeader>
          <div className="h-full overflow-auto">
            <TenantRequestWizard
              onCancel={handleTenantRequestCancel}
              onSubmit={async (data) => {
                // Handle submission - close sheet after success
                setTenantRequestSheetOpen(false)
              }}
              onSaveDraft={async (data) => {
                // Handle draft save - close sheet after success
                setTenantRequestSheetOpen(false)
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default PartnerPortalPage
