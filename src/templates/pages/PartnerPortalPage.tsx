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
import {
  Users,
  Zap,
  FileText,
  Building2,
  Settings,
  DollarSign,
  ClipboardList,
} from 'lucide-react'
import { AppLayoutShell, AppNavItem } from '../layout/AppLayoutShell'
import { DashboardPage, KPICardData, ActivityItemData, QuickActionData } from './DashboardPage'
import { partnerNavItems, addBadges } from '../navigation/configs'
import { UserInfo, UserMenuItem } from '../../components/ui/AppHeader'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'

// Import page components
import { LeadsPage } from '../../components/leads/LeadsPage'
import type { Lead, LeadAction } from '../../components/leads/LeadCard'
import type { CreateLeadFormData } from '../../components/leads/CreateLeadDialog'
import { PartnersPage } from '../../components/partners/PartnersPage'
import type { Partner } from '../../components/partners/PartnersPage'
import type { PartnerFormData } from '../../components/partners/EditPartnerDialog'
import { PartnerNetworkPage, MOCK_NETWORK_PARTNERS } from '../../components/partners/PartnerNetworkPage'
import type { NetworkPartner } from '../../components/partners/PartnerNetworkPage'
import { InvoicesPage } from '../../components/partners/invoices/InvoicesPage'
import type { Invoice, InvoiceAction } from '../../components/partners/invoices/types'
import {
  ProvisioningMethodSelector,
  ProvisioningMethod,
} from '../../components/provisioning/ProvisioningMethodSelector'
import {
  TenantProvisioningChat,
  TenantFormData,
} from '../../components/provisioning/TenantProvisioningChat'

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
  onCreateInvoice?: () => void
  onUpdateInvoice?: (invoice: Invoice) => void

  // === Provisioning callbacks ===
  onProvisioningComplete?: (data: TenantFormData) => void

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
  /** Custom className */
  className?: string
  /** Show background (default: true) */
  showBackground?: boolean
  /** Custom page overrides - render your own content for specific pages */
  pageOverrides?: Record<string, ReactNode>
}

// =============================================================================
// SUB-COMPONENTS: Page Content
// =============================================================================

/** Tenant Provisioning Page */
function TenantProvisioningContent({
  onComplete,
}: {
  onComplete?: (data: TenantFormData) => void
}) {
  const [selectedMethod, setSelectedMethod] = useState<ProvisioningMethod | null>(null)

  if (!selectedMethod) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-primary mb-6">Tenant Provisioning</h1>
        <ProvisioningMethodSelector onSelectMethod={setSelectedMethod} />
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
    <div className="p-6">
      <Button variant="ghost" onClick={() => setSelectedMethod(null)} className="mb-4">
        Back to method selection
      </Button>
      <h2 className="text-xl font-semibold text-primary">Manual Wizard</h2>
      <p className="text-secondary mt-2">Manual wizard form implementation...</p>
    </div>
  )
}

/** Tenant Requests Page (placeholder) */
function TenantRequestsContent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-primary mb-6">Tenant Requests</h1>
      <Card className="bg-surface border-default">
        <CardContent className="p-8 text-center">
          <ClipboardList className="w-12 h-12 text-secondary mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-primary mb-2">Pending Requests</h2>
          <p className="text-secondary mb-4">Tenant requests will appear here</p>
        </CardContent>
      </Card>
    </div>
  )
}

/** Pricing Calculator Page (placeholder) */
function PricingCalculatorContent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-primary mb-6">Pricing Calculator</h1>
      <Card className="bg-surface border-default">
        <CardContent className="p-8 text-center">
          <DollarSign className="w-12 h-12 text-teal mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-primary mb-2">Calculate Tenant Pricing</h2>
          <p className="text-secondary mb-4">Use the chat-based provisioning for interactive pricing</p>
          <Button variant="accent">Open Pricing Chat</Button>
        </CardContent>
      </Card>
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
  networkPartners = MOCK_NETWORK_PARTNERS,
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
  onEditNetworkPartner,
  onAddSubPartner,
  onDeleteNetworkPartner,

  // Invoice callbacks
  onInvoiceClick,
  onInvoiceAction,
  onCreateInvoice,
  onUpdateInvoice,

  // Provisioning callbacks
  onProvisioningComplete,

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
  className,
  showBackground = true,
  pageOverrides = {},
}: PartnerPortalPageProps) {
  // Internal page state (uncontrolled mode)
  const [internalPage, setInternalPage] = useState(initialPage)
  const activePage = currentPageId ?? internalPage

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

  // Build nav items with badges
  const navItemsWithBadges = addBadges(partnerNavItems, badges)

  // Default dashboard config
  const defaultKPIs: KPICardData[] = dashboardConfig?.kpis ?? [
    { id: '1', label: 'Total Revenue', value: '$0', trend: '0%', trendDirection: 'neutral' },
    { id: '2', label: 'Active Partners', value: partners.length, trend: '+0', trendDirection: 'neutral' },
    { id: '3', label: 'Open Leads', value: leads.length, trend: '0', trendDirection: 'neutral' },
    { id: '4', label: 'Pending Invoices', value: invoices.filter(i => i.status === 'sent').length, trend: '0', trendDirection: 'neutral' },
  ]

  const defaultQuickActions: QuickActionData[] = dashboardConfig?.quickActions ?? [
    { id: '1', label: 'New Tenant Provisioning', icon: <Zap className="w-4 h-4" />, onClick: () => handlePageChange('tenant-provisioning') },
    { id: '2', label: 'View All Leads', icon: <Users className="w-4 h-4" />, onClick: () => handlePageChange('leads') },
    { id: '3', label: 'Manage Invoices', icon: <FileText className="w-4 h-4" />, onClick: () => handlePageChange('invoices') },
    { id: '4', label: 'Partner Management', icon: <Building2 className="w-4 h-4" />, onClick: () => handlePageChange('partners') },
  ]

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
            kpis={defaultKPIs}
            activity={dashboardConfig?.activity ?? []}
            quickActions={defaultQuickActions}
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
          />
        )

      case 'tenant-provisioning':
        return <TenantProvisioningContent onComplete={onProvisioningComplete} />

      case 'tenant-requests':
        return <TenantRequestsContent />

      case 'invoices':
        return (
          <InvoicesPage
            invoices={invoices}
            stats={stats?.invoices}
            onInvoiceClick={onInvoiceClick}
            onInvoiceAction={onInvoiceAction}
            onCreateInvoice={onCreateInvoice}
            onUpdateInvoice={onUpdateInvoice}
          />
        )

      case 'partners':
        return (
          <div className="p-6">
            <PartnersPage
              partners={partners}
              onEditPartner={onEditPartner}
              onCreatePartner={onCreatePartner}
              onManageUsers={onManageUsers}
              onConfirmDelete={onDeletePartner}
            />
          </div>
        )

      case 'partner-network':
        return (
          <div className="p-6">
            <PartnerNetworkPage
              partners={networkPartners}
              onEditPartner={onEditNetworkPartner}
              onAddSubPartner={onAddSubPartner}
              onDeletePartner={onDeleteNetworkPartner}
            />
          </div>
        )

      case 'pricing-calculator':
        return <PricingCalculatorContent />

      default:
        return (
          <DashboardPage
            title="Dashboard"
            subtitle={`Welcome back, ${user.name?.split(' ')[0] ?? 'Partner'}`}
            kpis={defaultKPIs}
            quickActions={defaultQuickActions}
          />
        )
    }
  }

  return (
    <AppLayoutShell
      product="partner"
      navItems={navItemsWithBadges}
      initialPage={initialPage}
      currentPageId={currentPageId}
      onPageChange={handlePageChange}
      user={user}
      userMenuItems={userMenuItems}
      notificationCount={notificationCount}
      onNavigate={onNavigate}
      onNotificationClick={onNotificationClick}
      onMenuItemClick={onMenuItemClick}
      onHelpClick={onHelpClick}
      onLogoClick={onLogoClick}
      showBackground={showBackground}
      showHelpItem={true}
      className={className}
    >
      {renderPageContent()}
    </AppLayoutShell>
  )
}

export default PartnerPortalPage
