/**
 * useTenantsPagination - Hook for managing tenant list pagination
 *
 * Re-exports the generic usePagination hook with a domain-specific name.
 *
 * @module tenants/hooks
 */

export { usePagination as useTenantsPagination } from '../../../hooks/usePagination'
export type {
  UsePaginationOptions as UseTenantsPaginationOptions,
  UsePaginationReturn as UseTenantsPaginationReturn,
} from '../../../hooks/usePagination'
