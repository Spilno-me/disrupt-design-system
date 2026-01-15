/**
 * Partner Portal Page Types
 *
 * Type definitions for the Partner Portal page template.
 * Extracted from PartnerPortalPage.tsx for maintainability.
 */

import type { ReactNode } from 'react'
import type { KPICardData, ActivityItemData, QuickActionData } from '../DashboardPage'
import type { UserInfo, UserMenuItem } from '../../../components/ui/AppHeader'
import type { Lead, LeadAction } from '../../../components/leads/LeadCard'
import type { CreateLeadFormData } from '../../../components/leads/CreateLeadDialog'
import type { Partner } from '../../../components/partners/PartnersPage'
import type { PartnerFormData } from '../../../components/partners/EditPartnerDialog'
import type { NetworkPartner } from '../../../components/partners/PartnerNetworkPage'
import type { Invoice, InvoiceAction } from '../../../components/partners/invoices/types'
import type {
  UserProfile,
  CompanyProfile,
  NotificationSettings,
} from '../../../components/partners/SettingsPage'
import type { HelpArticle } from '../../../components/partners/HelpPage'
import type { CalculateRequest } from '../../../components/partners/PricingCalculator'
import type {
  Tenant,
  TenantFormData,
  PassiveIncomeTenant,
  ChangeStatusFormData,
  TenantsStatsV2,
} from '../../../components/tenants'
import type { Earning, EarningsSummary } from '../../../components/earnings'
import type { AppNavItem } from '../../layout/AppLayoutShell'
import type { TenantChatFormData } from '../../../components/provisioning/TenantProvisioningChat'
import type { TenantFormData as WizardTenantFormData } from '../../../components/provisioning/TenantProvisioningWizard'

// =============================================================================
// STAT TYPES
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

// =============================================================================
// TENANT REQUEST TYPES
// =============================================================================

/** Tenant request status */
export type TenantRequestStatus =
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'pending_payment'
  | 'provisioning'
  | 'completed'

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

// =============================================================================
// MAIN PROPS INTERFACE
// =============================================================================

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

  // === Tenants Data & Callbacks (V2) ===
  /** Tenants data */
  tenants?: Tenant[]
  /** Passive income data (sub-partner earnings) */
  passiveIncomeData?: PassiveIncomeTenant[]
  /** V2 Stats for tenants KPI widgets */
  tenantsStats?: TenantsStatsV2
  /** Callback when viewing tenant details */
  onViewTenant?: (tenant: Tenant) => void
  /** Callback when tenant status is changed (V2 unified) */
  onChangeStatus?: (tenant: Tenant, data: ChangeStatusFormData) => void | Promise<void>
  /** @deprecated Use onChangeStatus instead - Callback when editing a tenant */
  onEditTenant?: (tenant: Tenant, data: TenantFormData) => void
  /** @deprecated Use onChangeStatus instead - Callback when suspending a tenant */
  onSuspendTenant?: (tenant: Tenant) => void
  /** @deprecated Use onChangeStatus instead - Callback when activating a suspended tenant */
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
