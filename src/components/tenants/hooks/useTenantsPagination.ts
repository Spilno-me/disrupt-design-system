/**
 * useTenantsPagination - Hook for managing tenant list pagination
 *
 * Handles pagination state and computed paginated data.
 *
 * @module tenants/hooks
 */

import { useState, useMemo, useCallback } from "react"

interface UseTenantsPaginationOptions<T> {
  items: T[]
  initialPage?: number
  initialPageSize?: number
}

interface UseTenantsPaginationReturn<T> {
  currentPage: number
  setCurrentPage: (page: number) => void
  pageSize: number
  setPageSize: (size: number) => void
  paginatedItems: T[]
  totalItems: number
  totalPages: number
  handlePageChange: (page: number) => void
  handlePageSizeChange: (size: number) => void
  resetPagination: () => void
}

export function useTenantsPagination<T>({
  items,
  initialPage = 1,
  initialPageSize = 10,
}: UseTenantsPaginationOptions<T>): UseTenantsPaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(items.length / pageSize)
  }, [items.length, pageSize])

  // Get paginated items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return items.slice(startIndex, startIndex + pageSize)
  }, [items, currentPage, pageSize])

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  // Handle page size change (resets to page 1)
  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }, [])

  // Reset pagination to initial state
  const resetPagination = useCallback(() => {
    setCurrentPage(initialPage)
    setPageSize(initialPageSize)
  }, [initialPage, initialPageSize])

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    paginatedItems,
    totalItems: items.length,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
    resetPagination,
  }
}
