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
import { useState, useCallback, ReactNode } from 'react'
import { cn } from '../../lib/utils'
import {
  Users,
  Settings,
} from 'lucide-react'
import { AppLayoutShell, AppNavItem } from '../layout/AppLayoutShell'
import { DashboardPage, KPICardData, ActivityItemData, QuickActionData } from './DashboardPage'
import { partnerNavItems, addBadges } from '../navigation/configs'
import { UserInfo, UserMenuItem } from '../../components/ui/AppHeader'

// Import page components
import { LeadsPage } from '../../components/leads/LeadsPage'
import type { Lead, LeadAction } from '../../components/leads/LeadCard'
import type { CreateLeadFormData } from '../../components/leads/CreateLeadDialog'
import { PartnersPage } from '../../components/partners/PartnersPage'
import type { Partner } from '../../components/partners/PartnersPage'
import type { PartnerFormData } from '../../components/partners/EditPartnerDialog'
import { EditPartnerPage } from '../../components/partners/pages'
import { MOCK_NETWORK_PARTNERS } from '../../components/partners/PartnerNetworkPage'
import type { NetworkPartner } from '../../components/partners/PartnerNetworkPage'
import { InvoicesPage } from '../../components/partners/invoices/InvoicesPage'
import type { Invoice, InvoiceAction } from '../../components/partners/invoices/types'
import {
  ProvisioningMethodSelector,
  ProvisioningMethod,
} from '../../components/provisioning/ProvisioningMethodSelector'
import {
  TenantProvisioningChat,
  TenantChatFormData,
} from '../../components/provisioning/TenantProvisioningChat'
import {
  TenantProvisioningWizard,
  TenantFormData as WizardTenantFormData,
  transformToApiRequest,
} from '../../components/provisioning/TenantProvisioningWizard'
import {
  SettingsPage,
  UserProfile,
  CompanyProfile,
  NotificationSettings,
} from '../../components/partners/SettingsPage'
import { HelpPage, HelpArticle } from '../../components/partners/HelpPage'
import { PricingCalculator, type CalculateRequest } from '../../components/partners/PricingCalculator'
import {
  useRoleDashboardConfig,
  MOCK_DASHBOARD_DATA,
  type UserRole,
  type NavigationFilter,
  type DashboardHandlers,
} from '../../components/partners/dashboard'
import type { FilterState } from '../../components/shared/SearchFilter/types'
import { StatsCard } from '../../components/leads/StatsCard'
import { TenantsPage, MOCK_TENANTS } from '../../components/tenants'
import type { Tenant, TenantFormData } from '../../components/tenants'
import { MyEarningsPage, MOCK_EARNINGS, MOCK_EARNINGS_SUMMARY } from '../../components/earnings'
import type { Earning, EarningsSummary } from '../../components/earnings'
import { DataTable, ColumnDef } from '../../components/ui/DataTable'
import { Badge } from '../../components/ui/badge'
import { DataTableStatusDot, TENANT_REQUEST_DOT_STATUS_MAP } from '../../components/ui/table'

// =============================================================================
// TYPES
// =============================================================================

/** Stats for various data types */
export interface PartnerPortalStats {
  leads?: {
    totalLeads: { value: number; trend: string; trendDirection: 'up' | 'down' | 'neutral' }
    newLeads: { value: number; trend: string; trendDirection: 'up' | 'down' | 'neutral' }
    converted: { value: number; trend: string; trendDirection: 'up' | 'down' | 'neutral' }
    highPriority: { value: number; trend: string; trendDirection: 'up' | 'down' | 'neutral' }
  }
  invoices?: {
    totalInvoices: { value: number; trend: string; trendDirection: 'up' | 'down' | 'neutral' }
    draft: { value: number; trend: string; trendDirection: 'up' | 'down' | 'neutral' }
    unpaid: { value: number; trend: string; trendDirection: 'up' | 'down' | 'neutral' }
    overdue: { value: number; trend: string; trendDirection: 'up' | 'down' | 'neutral' }
    totalRevenue: { value: string; trend: string; trendDirection: 'up' | 'down' | 'neutral' }
  }
}

/** Dashboard configuration */
export interface DashboardConfig {
  kpis?: KPICardData[]
  activity?: ActivityItemData[]
  quickActions?: QuickActionData[]
}

/** Tenant request status */
export type TenantRequestStatus = 'pending_review' | 'approved' | 'rejected' | 'pending_payment' | 'provisioning' | 'completed'

/** Tenant request data */
export interface TenantRequest {
  id: string
  requestNumber: string
  companyName: string
  contactName: string
  contactEmail: string
  pricingTier: 'starter' | 'professional' | 'enterprise'
  estimatedValue: number
  status: TenantRequestStatus
  submittedAt: string
}

/** Mock tenant requests for prototype */
export const MOCK_TENANT_REQUESTS: TenantRequest[] = [
  { id: '1', requestNumber: 'TR-2025-0042', companyName: 'Apex Manufacturing Co.', contactName: 'Sarah Mitchell', contactEmail: 'sarah@apexmfg.com', pricingTier: 'enterprise', estimatedValue: 156000, status: 'pending_review', submittedAt: '2025-12-14' },
  { id: '2', requestNumber: 'TR-2025-0041', companyName: 'GreenTech Solutions', contactName: 'Michael Chen', contactEmail: 'm.chen@greentech.io', pricingTier: 'professional', estimatedValue: 48000, status: 'approved', submittedAt: '2025-12-12' },
  { id: '3', requestNumber: 'TR-2025-0040', companyName: 'Coastal Energy Partners', contactName: 'Jennifer Walsh', contactEmail: 'jwalsh@coastalenergy.com', pricingTier: 'enterprise', estimatedValue: 98000, status: 'pending_payment', submittedAt: '2025-12-10' },
  { id: '4', requestNumber: 'TR-2025-0039', companyName: 'Summit Logistics', contactName: 'David Park', contactEmail: 'd.park@summitlogistics.com', pricingTier: 'enterprise', estimatedValue: 245000, status: 'provisioning', submittedAt: '2025-12-08' },
  { id: '5', requestNumber: 'TR-2025-0038', companyName: 'Urban Development Corp', contactName: 'Amanda Foster', contactEmail: 'a.foster@urbandev.com', pricingTier: 'professional', estimatedValue: 3600, status: 'rejected', submittedAt: '2025-12-05' },
  { id: '6', requestNumber: 'TR-2025-0037', companyName: 'Pacific Waste Management', contactName: 'Robert Kim', contactEmail: 'r.kim@pacificwaste.com', pricingTier: 'professional', estimatedValue: 62000, status: 'completed', submittedAt: '2025-12-01' },
]

/** Props for PartnerPortalPage */
export interface PartnerPortalPageProps {
  // === User & Auth ===
  /** Current user information */
  user?: UserInfo
  /** Custom user menu items */
  userMenuItems?: UserMenuItem[]
  /** Notification count */
  notificationCount?: number

  // === Data ===
  /** Leads data */
  leads?: Lead[]
  /** Partners data */
  partners?: Partner[]
  /** Network partners data */
  networkPartners?: NetworkPartner[]
  /** Invoices data */
  invoices?: Invoice[]
  /** Stats for various pages */
  stats?: PartnerPortalStats
  /** Dashboard configuration */
  dashboardConfig?: DashboardConfig

  // === Badge counts ===
  /** Badge counts by page ID */
  badges?: Record<string, number>

  // === Lead callbacks ===
  onLeadClick?: (lead: Lead) => void
  onLeadAction?: (lead: Lead, action: LeadAction) => void
  onCreateLead?: (data: CreateLeadFormData) => void
  /** Partners to assign leads to */
  leadPartners?: Array<{ id: string; name: string }>

  // === Partner callbacks ===
  onEditPartner?: (partner: Partner, data: PartnerFormData) => void
  onCreatePartner?: (data: PartnerFormData) => void
  onManageUsers?: (partner: Partner) => void
  onDeletePartner?: (partner: Partner) => void

  // === Network Partner callbacks ===
  onEditNetworkPartner?: (partner: NetworkPartner) => void
  onAddSubPartner?: (parent: NetworkPartner) => void
  onDeleteNetworkPartner?: (partner: NetworkPartner) => void

  // === Invoice callbacks ===
  onInvoiceClick?: (invoice: Invoice) => void
  onInvoiceAction?: (invoice: Invoice, action: InvoiceAction) => void
  onUpdateInvoice?: (invoice: Invoice) => void

  // === Provisioning callbacks ===
  onProvisioningComplete?: (data: TenantChatFormData | WizardTenantFormData) => void

  // === Settings data ===
  /** User profile for settings */
  settingsUser?: UserProfile
  /** Company profile for settings */
  settingsCompany?: CompanyProfile
  /** Notification settings */
  settingsNotifications?: NotificationSettings

  // === Settings callbacks ===
  onSaveProfile?: (profile: UserProfile) => void
  onSaveCompany?: (company: CompanyProfile) => void
  onSaveNotifications?: (notifications: NotificationSettings) => void
  onChangePassword?: (currentPassword: string, newPassword: string) => void
  onChangeAvatar?: (file: File) => void

  // === Help callbacks ===
  onArticleClick?: (article: HelpArticle) => void
  onContactSupport?: () => void
  onHelpSearch?: (query: string) => void

  // === Pricing Calculator ===
  /** Callback when pricing calculation is requested */
  onCalculatePricing?: (request: CalculateRequest) => void
  /** Callback when quote generation is requested */
  onGenerateQuote?: (request: CalculateRequest) => void

  // === Tenants Data & Callbacks ===
  /** Tenants data */
  tenants?: Tenant[]
  /** Callback when viewing tenant details */
  onViewTenant?: (tenant: Tenant) => void
  /** Callback when editing a tenant */
  onEditTenant?: (tenant: Tenant, data: TenantFormData) => void
  /** Callback when suspending a tenant */
  onSuspendTenant?: (tenant: Tenant) => void
  /** Callback when activating a suspended tenant */
  onActivateTenant?: (tenant: Tenant) => void

  // === Earnings Data ===
  /** Earnings summary for My Earnings page */
  earningsSummary?: EarningsSummary
  /** Earnings history */
  earnings?: Earning[]

  // === Navigation & Layout ===
  /** Initial page to show */
  initialPage?: string
  /** Controlled current page */
  currentPageId?: string
  /** Callback when navigation changes */
  onPageChange?: (pageId: string) => void
  /** Callback when any nav item is clicked */
  onNavigate?: (item: AppNavItem) => void
  /** Callback when notification bell clicked */
  onNotificationClick?: () => void
  /** Callback when user menu item clicked */
  onMenuItemClick?: (item: UserMenuItem) => void
  /** Callback when help is clicked */
  onHelpClick?: () => void
  /** Callback when logo is clicked */
  onLogoClick?: () => void

  // === Customization ===
  /** Custom page overrides - render your own content for specific pages */
  pageOverrides?: Record<string, ReactNode>
}

// =============================================================================
// SUB-COMPONENTS: Page Content
// =============================================================================

/** Tenant Provisioning Page */
function _TenantProvisioningContent({
  onComplete,
}: {
  onComplete?: (data: TenantChatFormData | WizardTenantFormData) => void
}) {
  const [selectedMethod, setSelectedMethod] = useState<ProvisioningMethod | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Example API submission handler
  const handleWizardSubmit = async (data: WizardTenantFormData) => {
    setIsSubmitting(true)
    try {
      // Transform form data to API format
      const apiRequest = transformToApiRequest(data)

      // Simulate API call (replace with real API in consumer app)
      await new Promise(resolve => setTimeout(resolve, 1500))

      console.log('API Request:', apiRequest)

      onComplete?.(data)
      setSelectedMethod(null)
    } catch (error) {
      console.error('Submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!selectedMethod) {
    return (
      <div className="p-6 h-full flex flex-col">
        <h1 className="text-2xl font-semibold text-primary mb-6">Tenant Provisioning</h1>
        <div className="flex-1 flex items-center justify-center">
          <ProvisioningMethodSelector onSelectMethod={setSelectedMethod} className="min-h-0" />
        </div>
      </div>
    )
  }

  if (selectedMethod === 'chat') {
    return (
      <div className="h-full">
        <TenantProvisioningChat
          onComplete={(data) => {
            onComplete?.(data)
            setSelectedMethod(null)
          }}
          onCancel={() => setSelectedMethod(null)}
        />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center min-h-0">
        {/* Glass Card - Depth 1 (Elevated) */}
        <div className={cn(
          "w-full max-w-5xl mb-8",
          "rounded-xl",
          "bg-white/60 dark:bg-black/60 backdrop-blur-[8px]",
          "border-2 border-accent shadow-lg",
          "flex flex-col"
        )}>
          <TenantProvisioningWizard
            onSubmit={handleWizardSubmit}
            onCancel={() => setSelectedMethod(null)}
            commissionPercentage={15}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  )
}


/** Tenant Requests Content - Uses existing StatsCard and DataTable */
function TenantRequestsContent() {
  const requests = MOCK_TENANT_REQUESTS

  // Stats from mock data
  const stats = {
    total: requests.length,
    pendingReview: requests.filter(r => r.status === 'pending_review').length,
    approved: requests.filter(r => r.status === 'approved').length,
    inProgress: requests.filter(r => r.status === 'pending_payment' || r.status === 'provisioning').length,
  }

  // Column definitions for DataTable
  const columns: ColumnDef<TenantRequest>[] = [
    {
      id: 'requestNumber',
      header: 'Request #',
      accessor: (row) => <span className="font-mono text-sm">{row.requestNumber}</span>,
    },
    {
      id: 'companyName',
      header: 'Company',
      accessor: (row) => (
        <div>
          <div className="font-medium text-primary">{row.companyName}</div>
          <div className="text-sm text-muted">{row.contactName}</div>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'pricingTier',
      header: 'Tier',
      accessor: (row) => (
        <Badge variant={row.pricingTier === 'enterprise' ? 'default' : 'secondary'}>
          {row.pricingTier.charAt(0).toUpperCase() + row.pricingTier.slice(1)}
        </Badge>
      ),
    },
    {
      id: 'estimatedValue',
      header: 'Value',
      accessor: (row) => (
        <span className="font-medium">
          ${row.estimatedValue.toLocaleString()}
        </span>
      ),
      align: 'right',
      sortable: true,
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => (
        <DataTableStatusDot status={row.status} mapping={TENANT_REQUEST_DOT_STATUS_MAP} />
      ),
      align: 'left',
    },
    {
      id: 'submittedAt',
      header: 'Submitted',
      accessor: (row) => row.submittedAt,
      sortable: true,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-primary">Tenant Requests</h1>
        <p className="text-secondary mt-1">Review and manage tenant provisioning requests</p>
      </div>

      {/* Stats Row - Using existing StatsCard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Requests" value={stats.total} />
        <StatsCard title="Pending Review" value={stats.pendingReview} trend={`${stats.pendingReview}`} trendDirection="neutral" />
        <StatsCard title="Approved" value={stats.approved} trend="+2" trendDirection="up" />
        <StatsCard title="In Progress" value={stats.inProgress} />
      </div>

      {/* Data Table - Using existing DataTable */}
      <div className="bg-surface rounded-lg border border-default overflow-hidden">
        <DataTable
          data={requests}
          columns={columns}
          getRowId={(row) => row.id}
          onRowClick={(row) => console.log('Request clicked:', row)}
          emptyState={
            <div className="text-center py-12">
              <p className="text-muted">No tenant requests found</p>
            </div>
          }
        />
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * PartnerPortalPage - Complete Partner Portal Application
 *
 * A production-ready partner portal that uses AppLayoutShell and pre-wired pages.
 * Supports both automatic (pass data, let it render) and controlled (custom content) modes.
 */
export function PartnerPortalPage({
  // User & Auth
  user = { name: 'Partner User', email: 'user@partner.com' },
  userMenuItems = [
    { id: 'profile', label: 'Profile', icon: <Users className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'logout', label: 'Log out', destructive: true },
  ],
  notificationCount = 0,

  // Data
  leads = [],
  partners = [],
  networkPartners: _networkPartners = MOCK_NETWORK_PARTNERS,
  invoices = [],
  stats,
  dashboardConfig,
  badges = {},

  // Lead callbacks
  onLeadClick,
  onLeadAction,
  onCreateLead,
  leadPartners = [],

  // Partner callbacks
  onEditPartner,
  onCreatePartner,
  onManageUsers,
  onDeletePartner,

  // Network Partner callbacks
  onEditNetworkPartner: _onEditNetworkPartner,
  onAddSubPartner: _onAddSubPartner,
  onDeleteNetworkPartner: _onDeleteNetworkPartner,

  // Invoice callbacks
  onInvoiceClick,
  onInvoiceAction,
  onUpdateInvoice,

  // Provisioning callbacks
  onProvisioningComplete: _onProvisioningComplete,

  // Settings data & callbacks
  settingsUser,
  settingsCompany,
  settingsNotifications,
  onSaveProfile,
  onSaveCompany,
  onSaveNotifications,
  onChangePassword,
  onChangeAvatar,

  // Help callbacks
  onArticleClick,
  onContactSupport,
  onHelpSearch,

  // Pricing Calculator
  onCalculatePricing,
  onGenerateQuote,

  // Tenants data & callbacks
  tenants = MOCK_TENANTS,
  onViewTenant,
  onEditTenant,
  onSuspendTenant,
  onActivateTenant,

  // Earnings data
  earningsSummary = MOCK_EARNINGS_SUMMARY,
  earnings = MOCK_EARNINGS,

  // Navigation & Layout
  initialPage = 'dashboard',
  currentPageId,
  onPageChange,
  onNavigate,
  onNotificationClick,
  onMenuItemClick,
  onHelpClick,
  onLogoClick,

  // Customization
  pageOverrides = {},
}: PartnerPortalPageProps) {
  // Internal page state (uncontrolled mode)
  const [internalPage, setInternalPage] = useState(initialPage)
  const activePage = currentPageId ?? internalPage

  // Page filter state (for KPI → filtered page navigation)
  const [pageFilters, setPageFilters] = useState<NavigationFilter | undefined>()

  // Partner edit state (for page-based edit flow)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [partnerPageMode, setPartnerPageMode] = useState<'edit' | 'create'>('edit')

  // Handle page navigation
  const handlePageChange = useCallback(
    (pageId: string) => {
      if (onPageChange) {
        onPageChange(pageId)
      } else {
        setInternalPage(pageId)
      }
    },
    [onPageChange]
  )

  // Handle navigation with filters (from dashboard KPIs)
  const handleNavigateWithFilter = useCallback(
    (pageId: string, filters?: NavigationFilter) => {
      setPageFilters(filters)
      handlePageChange(pageId)
    },
    [handlePageChange]
  )

  // Convert NavigationFilter → FilterState for LeadsPage
  const leadsInitialFilters: FilterState | undefined = pageFilters
    ? {
        status: pageFilters.status ?? [],
        priority: pageFilters.priority ?? [],
        source: [],
      }
    : undefined

  // Get user's role (default to 'partner' if not specified)
  const userRole: UserRole = user.role ?? 'partner'

  // Dashboard handlers
  const dashboardHandlers: DashboardHandlers = {
    onNavigate: handleNavigateWithFilter,
    onCreateLead: () => {
      handlePageChange('leads')
      // Note: LeadsPage handles its own create dialog
    },
    onCreateTenantRequest: () => {
      handlePageChange('tenant-provisioning')
    },
    onAddPartner: () => {
      handlePageChange('partners')
    },
  }

  // Get role-based dashboard configuration
  const { kpis: roleKpis, quickActions: roleQuickActions } = useRoleDashboardConfig({
    userRole,
    handlers: dashboardHandlers,
    data: MOCK_DASHBOARD_DATA[userRole],
  })

  // Build nav items with badges
  const navItemsWithBadges = addBadges(partnerNavItems, badges)

  // Default settings data (derived from user if not provided)
  const defaultSettingsUser: UserProfile = settingsUser ?? {
    firstName: user.name?.split(' ')[0] ?? 'Partner',
    lastName: user.name?.split(' ').slice(1).join(' ') ?? 'User',
    email: user.email ?? 'user@partner.com',
    phone: '+1 (555) 123-4567',
    role: 'Partner Administrator',
    timezone: 'America/New_York',
  }

  const defaultSettingsCompany: CompanyProfile = settingsCompany ?? {
    name: 'Partner Company',
    address: '123 Business Park Drive',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    country: 'United States',
    website: 'https://partnercompany.com',
    phone: '+1 (555) 987-6543',
  }

  const defaultSettingsNotifications: NotificationSettings = settingsNotifications ?? {
    emailNewLeads: true,
    emailInvoices: true,
    emailTenantRequests: true,
    emailWeeklyDigest: false,
    pushNotifications: true,
    smsAlerts: false,
  }

  // Render page content based on active page
  const renderPageContent = () => {
    // Check for page override first
    if (pageOverrides[activePage]) {
      return pageOverrides[activePage]
    }

    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardPage
            title="Dashboard"
            subtitle={`Welcome back, ${user.name?.split(' ')[0] ?? 'Partner'}`}
            kpis={dashboardConfig?.kpis ?? roleKpis}
            activity={dashboardConfig?.activity ?? []}
            quickActions={dashboardConfig?.quickActions ?? roleQuickActions}
          />
        )

      case 'leads':
        return (
          <LeadsPage
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

      case 'tenants':
        return (
          <div className="p-6">
            <TenantsPage
              tenants={tenants}
              onViewTenant={onViewTenant}
              onEditTenant={onEditTenant}
              onSuspendTenant={onSuspendTenant}
              onActivateTenant={onActivateTenant}
            />
          </div>
        )

      case 'invoices':
        return (
          <InvoicesPage
            invoices={invoices}
            stats={stats?.invoices}
            onInvoiceClick={onInvoiceClick}
            onInvoiceAction={onInvoiceAction}
            onUpdateInvoice={onUpdateInvoice}
          />
        )

      case 'my-earnings':
        return (
          <div className="p-6">
            <MyEarningsPage
              summary={earningsSummary}
              earnings={earnings}
            />
          </div>
        )

      case 'partners':
        return (
          <div className="p-6">
            <PartnersPage
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
          </div>
        )

      case 'partner-edit':
        return (
          <EditPartnerPage
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
          <div className="p-6">
            <PricingCalculator
              onCalculate={onCalculatePricing}
              onGenerateQuote={onGenerateQuote}
              showCommission={userRole === 'system_admin'}
            />
          </div>
        )

      case 'settings':
        return (
          <SettingsPage
            user={defaultSettingsUser}
            company={defaultSettingsCompany}
            notifications={defaultSettingsNotifications}
            onSaveProfile={onSaveProfile}
            onSaveCompany={onSaveCompany}
            onSaveNotifications={onSaveNotifications}
            onChangePassword={onChangePassword}
            onChangeAvatar={onChangeAvatar}
          />
        )

      case 'help':
        return (
          <HelpPage
            onArticleClick={onArticleClick}
            onContactSupport={onContactSupport}
            onSearch={onHelpSearch}
          />
        )

      default:
        return (
          <DashboardPage
            title="Dashboard"
            subtitle={`Welcome back, ${user.name?.split(' ')[0] ?? 'Partner'}`}
            kpis={dashboardConfig?.kpis ?? roleKpis}
            quickActions={dashboardConfig?.quickActions ?? roleQuickActions}
          />
        )
    }
  }

  // Handle help click - navigate to help page
  const handleHelpClick = useCallback(() => {
    handlePageChange('help')
    onHelpClick?.()
  }, [handlePageChange, onHelpClick])

  // Handle settings click from user menu
  const handleMenuItemClick = useCallback(
    (item: UserMenuItem) => {
      if (item.id === 'settings') {
        handlePageChange('settings')
      }
      onMenuItemClick?.(item)
    },
    [handlePageChange, onMenuItemClick]
  )

  return (
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
      {renderPageContent()}
    </AppLayoutShell>
  )
}

export default PartnerPortalPage
