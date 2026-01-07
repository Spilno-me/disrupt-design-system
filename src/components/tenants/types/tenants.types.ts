/**
 * Type definitions for Tenants page
 * @module tenants/types/tenants.types
 */

// =============================================================================
// STATUS & PACKAGE TYPES
// =============================================================================

export type TenantStatus = "active" | "suspended" | "overdue"

export type SubscriptionPackage = "starter" | "professional" | "enterprise"

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
  /** Subscription package level */
  subscriptionPackage: SubscriptionPackage
  /** Date tenant was created */
  createdAt: Date
  /** Primary contact name */
  contactName: string
  /** Primary contact email */
  contactEmail: string
  /** Monthly revenue in USD */
  monthlyRevenue: number
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
// PAGE PROPS
// =============================================================================

export interface TenantsPageProps {
  /** Initial tenants data */
  tenants?: Tenant[]
  /** Callback when view action is clicked */
  onViewTenant?: (tenant: Tenant) => void
  /** Callback when edit form is submitted */
  onEditTenant?: (tenant: Tenant, data: TenantFormData) => void | Promise<void>
  /** Callback when suspend is confirmed */
  onSuspendTenant?: (tenant: Tenant) => void | Promise<void>
  /** Callback when activate is confirmed */
  onActivateTenant?: (tenant: Tenant) => void | Promise<void>
  /** Loading state */
  loading?: boolean
  /** Additional className for the container */
  className?: string
}
