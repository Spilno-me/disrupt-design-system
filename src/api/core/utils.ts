/**
 * API Utility Functions
 * Helpers for delay simulation, ID generation, and response building.
 */

import { getApiConfig } from './config'
import { NetworkError } from './errors'
import type { ApiResponse, PaginatedResponse, ListParams } from './types'

/**
 * Generate a random number between min and max (inclusive)
 */
export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Delay execution for specified milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Generate a UUID v4
 */
export function generateId(): string {
  return crypto.randomUUID()
}

/**
 * Generate a human-readable ID with prefix
 * @example generateHumanId('INC', 2025, 847) => 'INC-2025-0847'
 */
export function generateHumanId(prefix: string, year: number, sequence: number): string {
  const paddedSequence = sequence.toString().padStart(4, '0')
  return `${prefix}-${year}-${paddedSequence}`
}

/**
 * Generate a unique request ID for tracking
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Get current ISO timestamp
 */
export function timestamp(): string {
  return new Date().toISOString()
}

/**
 * Simulate network delay and potential failure
 * Wraps any function with realistic API behavior.
 */
export async function simulateNetwork<T>(fn: () => T | Promise<T>): Promise<T> {
  const config = getApiConfig()

  // Apply delay if enabled
  if (config.delays.enabled) {
    const delayMs = randomBetween(config.delays.min, config.delays.max)
    await delay(delayMs)
  }

  // Simulate random network failure if enabled
  if (config.errors.enabled && Math.random() < config.errors.networkFailureRate) {
    throw new NetworkError('Network request failed. Please try again.')
  }

  // Execute the actual function
  return fn()
}

/**
 * Build a standard API response
 */
export function buildResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    meta: {
      timestamp: timestamp(),
      requestId: generateRequestId(),
    },
  }
}

/**
 * Build a paginated API response
 */
export function buildPaginatedResponse<T>(
  items: T[],
  total: number,
  params: ListParams
): PaginatedResponse<T> {
  const config = getApiConfig()
  const page = params.page ?? 1
  const pageSize = Math.min(params.pageSize ?? config.pagination.defaultPageSize, config.pagination.maxPageSize)
  const totalPages = Math.ceil(total / pageSize)

  return {
    data: items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
    meta: {
      timestamp: timestamp(),
      requestId: generateRequestId(),
    },
  }
}

/**
 * Apply pagination to an array
 */
export function paginate<T>(items: T[], params: ListParams): T[] {
  const config = getApiConfig()
  const page = params.page ?? 1
  const pageSize = Math.min(params.pageSize ?? config.pagination.defaultPageSize, config.pagination.maxPageSize)

  const startIndex = (page - 1) * pageSize
  return items.slice(startIndex, startIndex + pageSize)
}

/**
 * Apply sorting to an array
 */
export function sortBy<T>(items: T[], field: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...items].sort((a, b) => {
    const aVal = a[field]
    const bVal = b[field]

    if (aVal === bVal) return 0
    if (aVal === null || aVal === undefined) return 1
    if (bVal === null || bVal === undefined) return -1

    const comparison = aVal < bVal ? -1 : 1
    return order === 'asc' ? comparison : -comparison
  })
}

/**
 * Apply search filter to an array (searches string fields)
 */
export function searchFilter<T>(
  items: T[],
  search: string,
  fields: (keyof T)[]
): T[] {
  const searchLower = search.toLowerCase().trim()
  if (!searchLower) return items

  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field]
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchLower)
      }
      return false
    })
  )
}

/**
 * Apply filters to an array
 */
export function applyFilters<T>(
  items: T[],
  filters: Partial<Record<keyof T, unknown>>
): T[] {
  if (!filters || Object.keys(filters).length === 0) return items

  return items.filter((item) =>
    Object.entries(filters).every(([key, filterValue]) => {
      if (filterValue === undefined || filterValue === null) return true

      const itemValue = item[key as keyof T]

      // Handle array filter values (OR logic)
      if (Array.isArray(filterValue)) {
        return filterValue.includes(itemValue)
      }

      // Exact match
      return itemValue === filterValue
    })
  )
}

/**
 * Deep clone an object (for immutable operations)
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1: string | Date, date2: string | Date = new Date()): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffMs = Math.abs(d2.getTime() - d1.getTime())
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

/**
 * Check if a date is in the past
 */
export function isPast(date: string | Date): boolean {
  return new Date(date) < new Date()
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Log API operation if logging is enabled
 */
export function logApiCall(
  operation: string,
  params?: unknown,
  result?: unknown
): void {
  const config = getApiConfig()
  if (!config.logging.enabled) return

  const logData: Record<string, unknown> = {
    operation,
    timestamp: timestamp(),
  }

  if (params !== undefined) {
    logData.params = params
  }

  if (config.logging.verbose && result !== undefined) {
    logData.result = result
  }

  console.log('[API]', logData)
}
