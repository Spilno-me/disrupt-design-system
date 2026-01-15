/**
 * Tenants Hooks - Custom hooks for tenant management
 *
 * @module tenants/hooks
 */

// Dialog management
export {
  useTenantsDialogs,
  type UseTenantsDialogsOptions,
  type UseTenantsDialogsReturn,
} from "./useTenantsDialogs"

// Table columns (extracted from TenantsPage)
export {
  useTenantsTableColumns,
  type UseTenantsTableColumnsOptions,
  type UseTenantsTableColumnsReturn,
} from "./useTenantsTableColumns"

// Filtering and pagination
export { useTenantsFiltering } from "./useTenantsFiltering"
export { useTenantsPagination } from "./useTenantsPagination"
export { useTenantsWidgetFilter } from "./useTenantsWidgetFilter"

// Tab state
export { useTabState, type UseTabStateReturn, type TabState } from "./useTabState"
