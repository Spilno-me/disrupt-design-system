/**
 * Type exports for Tenants module
 * @module tenants/types
 */

export type {
  // Core types
  TenantStatus,
  OrganizationTier,
  SubscriptionPackage,
  // Widget filters
  TenantWidgetFilter, // @deprecated - use TenantWidgetFilterV2
  TenantWidgetFilterV2,
  // User role (v2)
  UserRole,
  // Entity
  Tenant,
  TenantFormData,
  ChangeStatusFormData,
  // Stats
  TenantStatData,
  TenantMonetaryStatData,
  TenantsStats, // @deprecated - use TenantsStatsV2
  TenantsStatsV2,
  // Tab types (v2)
  TenantsTabId,
  TenantsTabConfig,
  // Passive Income (v2)
  PassiveIncomeTenant,
  // Page props
  TenantsPageProps,
} from "./tenants.types"
