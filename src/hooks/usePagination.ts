/**
 * usePagination - Generic hook for managing list pagination
 *
 * A reusable pagination hook that can be used across different modules.
 *
 * @example
 * ```tsx
 * const { paginatedItems, currentPage, handlePageChange } = usePagination({
 *   items: myDataArray,
 *   initialPageSize: 25,
 * })
 * ```
 *
 * @module hooks
 */

import { useState, useMemo, useCallback } from "react"

export interface UsePaginationOptions<T> {
  items: T[]
  initialPage?: number
  initialPageSize?: number
}

export interface UsePaginationReturn<T> {
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

export function usePagination<T>({
  items,
  initialPage = 1,
  initialPageSize = 10,
}: UsePaginationOptions<T>): UsePaginationReturn<T> {
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
