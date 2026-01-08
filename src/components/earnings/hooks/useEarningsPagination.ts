/**
 * useEarningsPagination - Hook for managing earnings list pagination
 *
 * Re-exports the generic usePagination hook with a domain-specific name.
 *
 * @module earnings/hooks
 */

export { usePagination as useEarningsPagination } from '../../../hooks/usePagination'
export type {
  UsePaginationOptions as UseEarningsPaginationOptions,
  UsePaginationReturn as UseEarningsPaginationReturn,
} from '../../../hooks/usePagination'
