/**
 * Tenants Module Exports
 * @module tenants
 */

// Main page component
export { TenantsPage, TENANT_DOT_STATUS_MAP } from "./TenantsPage"
export { default as TenantsPageDefault } from "./TenantsPage"

// Dialog components
export { ViewTenantDialog } from "./ViewTenantDialog"
export { EditTenantDialog } from "./EditTenantDialog"
export { SuspendTenantDialog } from "./SuspendTenantDialog"
export { ActivateTenantDialog } from "./ActivateTenantDialog"

// Types
export type {
  TenantStatus,
  SubscriptionPackage,
  Tenant,
  TenantFormData,
  TenantsPageProps,
} from "./types"

export type { ViewTenantDialogProps } from "./ViewTenantDialog"
export type { EditTenantDialogProps } from "./EditTenantDialog"
export type { SuspendTenantDialogProps } from "./SuspendTenantDialog"
export type { ActivateTenantDialogProps } from "./ActivateTenantDialog"

// Data
export { MOCK_TENANTS } from "./data/mock-tenants"

// Constants
export { TENANT_FILTER_GROUPS } from "./constants/filter.constants"
