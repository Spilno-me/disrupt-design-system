/**
 * Core API types for the simulation layer.
 * These types wrap all API responses and provide consistent error handling.
 */

/** Standard API response wrapper */
export interface ApiResponse<T> {
  data: T
  meta: {
    timestamp: string
    requestId: string
  }
}

/** Paginated API response */
export interface PaginatedResponse<T> extends Omit<ApiResponse<T[]>, 'data'> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

/** API Error response structure */
export interface ApiErrorResponse {
  code: ApiErrorCode
  message: string
  details?: Record<string, string[]>
  statusCode: number
}

/** Standard error codes */
export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NETWORK_ERROR'
  | 'INTERNAL_ERROR'

/** Common list/query parameters */
export interface ListParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

/** Generic filter type for entities */
export type FilterParams<T> = Partial<{
  [K in keyof T]: T[K] | T[K][]
}>

/** Combined list params with filters */
export interface QueryParams<T> extends ListParams {
  filters?: FilterParams<T>
}

/** Batch operation result */
export interface BatchResult<T> {
  succeeded: T[]
  failed: Array<{
    item: T
    error: string
  }>
}

/** Delete operation result */
export interface DeleteResult {
  deleted: boolean
  id: string
}

/** Count result for aggregations */
export interface CountResult {
  count: number
}
