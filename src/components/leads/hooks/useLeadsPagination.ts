/**
 * useLeadsPagination - Manages pagination state for leads
 *
 * Handles:
 * - Current page tracking
 * - Page size selection
 * - Paginating lead arrays
 */

import { useState, useCallback } from 'react'
import { DEFAULT_PAGE_SIZE } from '../constants'

export interface UseLeadsPaginationOptions {
  /** Initial page size */
  defaultPageSize?: number
}

export interface UseLeadsPaginationReturn {
  /** Current page (1-indexed) */
  currentPage: number
  /** Set current page */
  setCurrentPage: (page: number) => void
  /** Current page size */
  pageSize: number
  /** Handle page size change (resets to page 1) */
  handlePageSizeChange: (newPageSize: number) => void
  /** Reset to first page */
  resetPage: () => void
  /** Paginate an array of items */
  paginateItems: <T>(items: T[]) => T[]
}

export function useLeadsPagination({
  defaultPageSize = DEFAULT_PAGE_SIZE,
}: UseLeadsPaginationOptions = {}): UseLeadsPaginationReturn {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }, [])

  const resetPage = useCallback(() => {
    setCurrentPage(1)
  }, [])

  const paginateItems = useCallback(<T>(items: T[]): T[] => {
    const startIndex = (currentPage - 1) * pageSize
    return items.slice(startIndex, startIndex + pageSize)
  }, [currentPage, pageSize])

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    handlePageSizeChange,
    resetPage,
    paginateItems,
  }
}
