/**
 * usePageRenderer - Hook for rendering Partner Portal page content
 *
 * Extracts the page routing logic from the main component for cleaner separation.
 */

import * as React from 'react'
import { ReactNode } from 'react'
import type { Partner } from '../../../components/partners/PartnersPage'
import type { PartnerFormData } from '../../../components/partners/EditPartnerDialog'

import { DashboardContent } from './DashboardContent'
import { LeadsContent } from './LeadsContent'
import { TenantRequestsContent } from './TenantRequestsContent'
import { TenantProvisioningContent } from './TenantProvisioningContent'
import { TenantsContent } from './TenantsContent'
import { InvoicesContent } from './InvoicesContent'
import { EarningsContent } from './EarningsContent'
import { PartnersContent } from './PartnersContent'
import { PartnerEditContent } from './PartnerEditContent'
import { PricingCalculatorContent } from './PricingCalculatorContent'
import { SettingsContent } from './SettingsContent'
import { HelpContent } from './HelpContent'
import type { PartnerPortalPageProps, DashboardConfig, PartnerPortalStats } from './types'
import type { KPICardData, QuickActionData } from '../DashboardPage'
import type {
  UserProfile,
  CompanyProfile,
  NotificationSettings,
} from '../../../components/partners/SettingsPage'
import type { FilterState } from '../../../components/shared/SearchFilter/types'
import type { UserRole } from '../../../components/partners/dashboard'

export interface PageRendererConfig {
  // Page state
  activePage: string
  pageOverrides: Record<string, ReactNode>

  // User info
  userName: string
  userRole: UserRole

  // Dashboard config
  dashboardConfig?: DashboardConfig
  roleKpis: KPICardData[]
  roleQuickActions: QuickActionData[]

  // Data
  leads: NonNullable<PartnerPortalPageProps['leads']>
  stats?: PartnerPortalStats
  leadPartners: Array<{ id: string; name: string }>
  leadsInitialFilters?: FilterState
  tenants: NonNullable<PartnerPortalPageProps['tenants']>
  invoices: NonNullable<PartnerPortalPageProps['invoices']>
  earningsSummary: NonNullable<PartnerPortalPageProps['earningsSummary']>
  earnings: NonNullable<PartnerPortalPageProps['earnings']>
  partners: NonNullable<PartnerPortalPageProps['partners']>

  // Partner edit state
  editingPartner: Partner | null
  partnerPageMode: 'edit' | 'create'
  setEditingPartner: (partner: Partner | null) => void
  setPartnerPageMode: (mode: 'edit' | 'create') => void
  handlePageChange: (pageId: string) => void

  // Settings
  settingsUser: UserProfile
  settingsCompany: CompanyProfile
  settingsNotifications: NotificationSettings

  // Callbacks
  onLeadClick?: PartnerPortalPageProps['onLeadClick']
  onLeadAction?: PartnerPortalPageProps['onLeadAction']
  onCreateLead?: PartnerPortalPageProps['onCreateLead']
  onViewTenant?: PartnerPortalPageProps['onViewTenant']
  onEditTenant?: PartnerPortalPageProps['onEditTenant']
  onSuspendTenant?: PartnerPortalPageProps['onSuspendTenant']
  onActivateTenant?: PartnerPortalPageProps['onActivateTenant']
  onInvoiceClick?: PartnerPortalPageProps['onInvoiceClick']
  onInvoiceAction?: PartnerPortalPageProps['onInvoiceAction']
  onUpdateInvoice?: PartnerPortalPageProps['onUpdateInvoice']
  onEditPartner?: PartnerPortalPageProps['onEditPartner']
  onCreatePartner?: PartnerPortalPageProps['onCreatePartner']
  onManageUsers?: PartnerPortalPageProps['onManageUsers']
  onDeletePartner?: PartnerPortalPageProps['onDeletePartner']
  onCalculatePricing?: PartnerPortalPageProps['onCalculatePricing']
  onGenerateQuote?: PartnerPortalPageProps['onGenerateQuote']
  onSaveProfile?: PartnerPortalPageProps['onSaveProfile']
  onSaveCompany?: PartnerPortalPageProps['onSaveCompany']
  onSaveNotifications?: PartnerPortalPageProps['onSaveNotifications']
  onChangePassword?: PartnerPortalPageProps['onChangePassword']
  onChangeAvatar?: PartnerPortalPageProps['onChangeAvatar']
  onArticleClick?: PartnerPortalPageProps['onArticleClick']
  onContactSupport?: PartnerPortalPageProps['onContactSupport']
  onHelpSearch?: PartnerPortalPageProps['onHelpSearch']
}

/**
 * Renders the appropriate page content based on the active page ID.
 */
export function usePageRenderer(config: PageRendererConfig): ReactNode {
  const {
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
    invoices,
    earningsSummary,
    earnings,
    partners,
    editingPartner,
    partnerPageMode,
    setEditingPartner,
    setPartnerPageMode,
    handlePageChange,
    settingsUser,
    settingsCompany,
    settingsNotifications,
    onLeadClick,
    onLeadAction,
    onCreateLead,
    onViewTenant,
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
  } = config

  // Check for page override first
  if (pageOverrides[activePage]) {
    return pageOverrides[activePage]
  }

  // Render default dashboard for unknown pages
  const renderDashboard = () => (
    <DashboardContent
      userName={userName}
      dashboardConfig={dashboardConfig}
      roleKpis={roleKpis}
      roleQuickActions={roleQuickActions}
    />
  )

  switch (activePage) {
    case 'dashboard':
      return renderDashboard()

    case 'leads':
      return (
        <LeadsContent
          leads={leads}
          stats={stats?.leads}
          onLeadClick={onLeadClick}
          onLeadAction={onLeadAction}
          onCreateLead={onCreateLead}
          partners={leadPartners}
          initialFilters={leadsInitialFilters}
        />
      )

    case 'tenant-requests':
      return <TenantRequestsContent />

    case 'tenant-provisioning':
      return <TenantProvisioningContent />

    case 'tenants':
      return (
        <TenantsContent
          tenants={tenants}
          onViewTenant={onViewTenant}
          onEditTenant={onEditTenant}
          onSuspendTenant={onSuspendTenant}
          onActivateTenant={onActivateTenant}
        />
      )

    case 'invoices':
      return (
        <InvoicesContent
          invoices={invoices}
          stats={stats?.invoices}
          onInvoiceClick={onInvoiceClick}
          onInvoiceAction={onInvoiceAction}
          onUpdateInvoice={onUpdateInvoice}
        />
      )

    case 'my-earnings':
      return <EarningsContent summary={earningsSummary} earnings={earnings} />

    case 'partners':
      return (
        <PartnersContent
          partners={partners}
          onViewPartner={(partner) => {
            setEditingPartner(partner)
            setPartnerPageMode('edit')
            handlePageChange('partner-edit')
          }}
          onAddPartner={() => {
            setEditingPartner(null)
            setPartnerPageMode('create')
            handlePageChange('partner-edit')
          }}
          onEditPartner={onEditPartner}
          onCreatePartner={onCreatePartner}
          onManageUsers={onManageUsers}
          onConfirmDelete={onDeletePartner}
        />
      )

    case 'partner-edit':
      return (
        <PartnerEditContent
          partner={editingPartner}
          mode={partnerPageMode}
          onSubmit={async (data) => {
            if (partnerPageMode === 'edit' && editingPartner && onEditPartner) {
              await onEditPartner(editingPartner, data as PartnerFormData)
            } else if (partnerPageMode === 'create' && onCreatePartner) {
              await onCreatePartner(data as PartnerFormData)
            }
            handlePageChange('partners')
          }}
          onBack={() => handlePageChange('partners')}
        />
      )

    case 'pricing-calculator':
      return (
        <PricingCalculatorContent
          onCalculate={onCalculatePricing}
          onGenerateQuote={onGenerateQuote}
          showCommission={userRole === 'system_admin'}
        />
      )

    case 'settings':
      return (
        <SettingsContent
          user={settingsUser}
          company={settingsCompany}
          notifications={settingsNotifications}
          onSaveProfile={onSaveProfile}
          onSaveCompany={onSaveCompany}
          onSaveNotifications={onSaveNotifications}
          onChangePassword={onChangePassword}
          onChangeAvatar={onChangeAvatar}
        />
      )

    case 'help':
      return (
        <HelpContent
          onArticleClick={onArticleClick}
          onContactSupport={onContactSupport}
          onSearch={onHelpSearch}
        />
      )

    default:
      return renderDashboard()
  }
}
