/**
 * Type definitions for Tenants page
 * @module tenants/types/tenants.types
 */

// =============================================================================
// STATUS & TIER TYPES
// =============================================================================

/** Tenant account status */
export type TenantStatus = "active" | "suspended" | "overdue"

/** Organization size tier (for baseline pricing) */
export type OrganizationTier = "micro" | "small" | "mid-market" | "large" | "enterprise"

/** Feature package level */
export type SubscriptionPackage = "starter" | "professional" | "enterprise"

// =============================================================================
// USER ROLE TYPE
// =============================================================================

/**
 * User role for role-based visibility control
 * @since v2.0
 *
 * - system-admin: Sees all tenants, both tabs
 * - partner-admin: Sees own tenants, both tabs (if sub-partners exist)
 * - sub-partner: Sees own tenants, Direct Tenants tab only
 */
export type UserRole = "system-admin" | "partner-admin" | "sub-partner"

// =============================================================================
// WIDGET FILTER TYPE
// =============================================================================

/**
 * @deprecated Use TenantWidgetFilterV2 instead. Will be removed in v3.
 * Migration: Remove "suspended" from filter options.
 */
export type TenantWidgetFilter = "all" | "active" | "overdue" | "suspended" | null

/**
 * V2 Widget filter - only clickable filters (MRR/ARR are informational, not filterable)
 * Per spec Section 5.2: Only Active and Overdue are clickable filters
 * @since v2.0
 */
export type TenantWidgetFilterV2 = "all" | "active" | "overdue" | null

// =============================================================================
// CORE ENTITY
// =============================================================================

export interface Tenant {
  /** Unique identifier */
  id: string
  /** Company/organization name */
  companyName: string
  /** Current status */
  status: TenantStatus
  /** Organization size tier (for baseline pricing) */
  tier: OrganizationTier
  /** Subscription package level (feature set) */
  subscriptionPackage: SubscriptionPackage
  /** Date tenant was created */
  createdAt: Date
  /** Date tenant became active (or null if not yet active) */
  activeSince: Date | null
  /** Primary contact name */
  contactName: string
  /** Primary contact email */
  contactEmail: string
  /** Primary contact phone (optional) */
  contactPhone?: string
  /** Total license count */
  licenses: number
  /** Monthly payment amount in USD */
  monthlyPayment: number
  /** @deprecated Use monthlyPayment instead */
  monthlyRevenue?: number
  /** Number of users on the tenant */
  userCount: number
}

// =============================================================================
// FORM DATA
// =============================================================================

export interface TenantFormData {
  /** Company/organization name */
  companyName: string
  /** Primary contact name */
  contactName: string
  /** Primary contact email */
  contactEmail: string
  /** Subscription package level */
  subscriptionPackage: SubscriptionPackage
}

// =============================================================================
// STATS TYPES (KPI Widgets)
// =============================================================================

/** Individual stat card data */
export interface TenantStatData {
  /** Display value */
  value: number
  /** Trend indicator (e.g., "+12%", "-5") */
  trend?: string
  /** Trend direction for styling */
  trendDirection?: "up" | "down" | "neutral"
}

/**
 * @deprecated Use TenantsStatsV2 instead. Will be removed in v3.
 * Migration: { total, active, overdue, suspended } → { active, mrr, arr, overdue }
 */
export interface TenantsStats {
  /** Total tenants count */
  total: TenantStatData
  /** Active tenants count */
  active: TenantStatData
  /** Overdue tenants count */
  overdue: TenantStatData
  /** Suspended tenants count */
  suspended: TenantStatData
}

/** Currency-aware stat data for monetary values */
export interface TenantMonetaryStatData extends TenantStatData {
  /** Currency code (default: USD) */
  currency?: string
}

/**
 * V2 Stats for KPI widget cards - matches spec Section 5.1
 * Layout: [Active (clickable)] [MRR (info)] [ARR (info)] [Overdue (clickable)]
 * @since v2.0
 */
export interface TenantsStatsV2 {
  /** Active tenants count - CLICKABLE filter */
  active: TenantStatData
  /** Monthly Recurring Revenue - sum of active tenants' monthly payments - INFORMATIONAL */
  mrr: TenantMonetaryStatData
  /** Annual Recurring Revenue - MRR × 12 - INFORMATIONAL */
  arr: TenantMonetaryStatData
  /** Overdue tenants count - CLICKABLE filter */
  overdue: TenantStatData
}

// =============================================================================
// CHANGE STATUS TYPES
// =============================================================================

/** Data for status change form */
export interface ChangeStatusFormData {
  /** New status to set */
  status: TenantStatus
  /** Optional note/reason for the change */
  note?: string
}

// =============================================================================
// TAB TYPES
// =============================================================================

/** Tab identifiers for the Tenants page */
export type TenantsTabId = "direct" | "passive"

/**
 * Tab configuration object - avoids props explosion per 3-3-3 rule
 * Note: userRole is passed as a separate prop to TenantsPageV2, not in tabConfig
 * @since v2.0
 */
export interface TenantsTabConfig {
  /** Default tab to show on mount */
  defaultTab?: TenantsTabId
  /** Callback when tab changes */
  onTabChange?: (tab: TenantsTabId) => void
}

// =============================================================================
// PAGE PROPS
// =============================================================================

export interface TenantsPageProps {
  /** Initial tenants data */
  tenants?: Tenant[]
  /**
   * @deprecated Use statsV2 instead. Will be removed in v3.
   */
  stats?: TenantsStats
  /**
   * V2 stats with MRR/ARR per spec Section 5.1
   * @since v2.0
   */
  statsV2?: TenantsStatsV2
  /** Callback when view action is clicked */
  onViewTenant?: (tenant: Tenant) => void
  /** Callback when edit form is submitted */
  onEditTenant?: (tenant: Tenant, data: TenantFormData) => void | Promise<void>
  /** Callback when status is changed */
  onChangeStatus?: (tenant: Tenant, data: ChangeStatusFormData) => void | Promise<void>
  /** @deprecated Use onChangeStatus instead */
  onSuspendTenant?: (tenant: Tenant) => void | Promise<void>
  /** @deprecated Use onChangeStatus instead */
  onActivateTenant?: (tenant: Tenant) => void | Promise<void>
  /** Loading state */
  loading?: boolean
  /** Additional className for the container */
  className?: string
  /**
   * Tab configuration for role-based visibility and tab control
   * @since v2.0
   */
  tabConfig?: TenantsTabConfig
  /**
   * Passive income data for sub-partner earnings tab
   * @since v2.0
   */
  passiveIncomeData?: PassiveIncomeTenant[]
}

// =============================================================================
// PASSIVE INCOME TYPES
// =============================================================================

/**
 * Passive Income tenant record - per spec Section 12.3
 * Used in the Passive Income tab to show sub-partner earnings
 * @since v2.0
 */
export interface PassiveIncomeTenant {
  /** Unique identifier */
  id: string
  /** Sub-partner company name */
  subPartnerName: string
  /** Sub-partner ID for linking */
  subPartnerId: string
  /** Tenant company name */
  tenantCompanyName: string
  /** Tenant ID for linking */
  tenantId: string
  /** Sub-partner's monthly payment from this tenant */
  subPartnerMonthlyPayment: number
  /** Commission rate (e.g., 0.15 for 15%) */
  commissionRate: number
  /** Your monthly earnings from this tenant (calculated: payment × rate) */
  yourMonthlyEarnings: number
  /** Tenant status */
  status: TenantStatus
}
