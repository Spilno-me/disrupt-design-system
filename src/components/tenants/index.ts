/**
 * Tenants Module Exports
 * @module tenants
 */

// Main page components
export { TenantsPage, MOCK_TENANTS, MOCK_TENANTS_STATS } from "./TenantsPage"
export { default as TenantsPageDefault } from "./TenantsPage"
export { TenantsPageV2 } from "./TenantsPageV2"
export { default as TenantsPageV2Default } from "./TenantsPageV2"

// Dialog components
export { ViewTenantDialog } from "./ViewTenantDialog"
export { EditTenantDialog } from "./EditTenantDialog"
export { ChangeStatusDialog } from "./ChangeStatusDialog"
// Legacy dialogs (deprecated - use ChangeStatusDialog instead)
export { SuspendTenantDialog } from "./SuspendTenantDialog"
export { ActivateTenantDialog } from "./ActivateTenantDialog"

// Sub-components
export {
  TenantsStatsCardsRow,
  TenantsStatsCardsRowV2,
  ActiveFilterBanner,
  DirectTenantsTabContent,
  PassiveIncomeTabContent,
} from "./components"

// Hooks
export { useTenantsWidgetFilter, useTabState, useTenantsDialogs } from "./hooks"

// Types - V1 (legacy, kept for backwards compatibility)
export type {
  TenantStatus,
  OrganizationTier,
  SubscriptionPackage,
  TenantWidgetFilter,
  Tenant,
  TenantFormData,
  ChangeStatusFormData,
  TenantStatData,
  TenantsStats,
  TenantsPageProps,
} from "./types"

// Types - V2 (new)
export type {
  UserRole,
  TenantWidgetFilterV2,
  TenantMonetaryStatData,
  TenantsStatsV2,
  TenantsTabId,
  TenantsTabConfig,
  PassiveIncomeTenant,
} from "./types"

export type { ViewTenantDialogProps } from "./ViewTenantDialog"
export type { EditTenantDialogProps } from "./EditTenantDialog"
export type { ChangeStatusDialogProps } from "./ChangeStatusDialog"
export type { SuspendTenantDialogProps } from "./SuspendTenantDialog"
export type { ActivateTenantDialogProps } from "./ActivateTenantDialog"
export type {
  TenantsStatsCardsRowProps,
  TenantsStatsCardsRowV2Props,
  ActiveFilterBannerProps,
  DirectTenantsTabContentProps,
  PassiveIncomeTabContentProps,
} from "./components"
export type { TenantsPageV2Props } from "./TenantsPageV2"
export type { UseTabStateReturn, TabState } from "./hooks"

// Data
export { generateTenantsStats, generateTenantsStatsV2, MOCK_TENANTS_STATS_V2, MOCK_PASSIVE_INCOME } from "./data/mock-tenants"

// Constants
export { TENANT_FILTER_GROUPS } from "./constants/filter.constants"
