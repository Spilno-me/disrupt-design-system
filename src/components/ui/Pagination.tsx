"use client"

import * as React from "react"
import { useMemo, useCallback } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "./button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

// =============================================================================
// TYPES
// =============================================================================

export interface PaginationProps {
  /** Current page (1-indexed) */
  currentPage: number
  /** Total number of items */
  totalItems: number
  /** Number of items per page */
  pageSize: number
  /** Callback when page changes */
  onPageChange: (page: number) => void
  /** Callback when page size changes */
  onPageSizeChange?: (pageSize: number) => void
  /** Available page sizes */
  pageSizeOptions?: number[]
  /** Whether to show page size selector */
  showPageSizeSelector?: boolean
  /** Whether to show "Showing X-Y of Z" text */
  showResultsText?: boolean
  /** Whether to show first/last page buttons */
  showFirstLastButtons?: boolean
  /** Maximum number of page buttons to show */
  maxPageButtons?: number
  /** Loading state */
  loading?: boolean
  /** Additional className */
  className?: string
  /** Compact mode */
  compact?: boolean
  /** Custom results text format */
  resultsTextFormat?: (start: number, end: number, total: number) => string
}

// =============================================================================
// PAGINATION COMPONENT
// =============================================================================

/**
 * Pagination - A comprehensive pagination component
 *
 * Features:
 * - Page number buttons with smart ellipsis
 * - Previous/Next navigation
 * - Optional First/Last page buttons
 * - Page size selector
 * - "Showing X-Y of Z results" text
 * - Keyboard accessible
 *
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={1}
 *   totalItems={100}
 *   pageSize={10}
 *   onPageChange={setPage}
 *   onPageSizeChange={setPageSize}
 *   showPageSizeSelector
 *   showResultsText
 * />
 * ```
 */
export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSizeSelector = true,
  showResultsText = true,
  showFirstLastButtons = true,
  maxPageButtons = 7,
  loading = false,
  className,
  compact = false,
  resultsTextFormat,
}: PaginationProps) {
  // Calculate pagination values
  const totalPages = Math.ceil(totalItems / pageSize)
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  // Generate page numbers to display
  const pageNumbers = useMemo(() => {
    const pages: (number | "ellipsis-start" | "ellipsis-end")[] = []

    if (totalPages <= maxPageButtons) {
      // Show all pages if total is within limit
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate range around current page
      const sideButtons = Math.floor((maxPageButtons - 3) / 2) // -3 for first, last, and ellipsis
      let startPage = Math.max(2, currentPage - sideButtons)
      let endPage = Math.min(totalPages - 1, currentPage + sideButtons)

      // Adjust range if at edges
      if (currentPage <= sideButtons + 2) {
        endPage = Math.min(totalPages - 1, maxPageButtons - 2)
      } else if (currentPage >= totalPages - sideButtons - 1) {
        startPage = Math.max(2, totalPages - maxPageButtons + 3)
      }

      // Add start ellipsis
      if (startPage > 2) {
        pages.push("ellipsis-start")
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      // Add end ellipsis
      if (endPage < totalPages - 1) {
        pages.push("ellipsis-end")
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }, [currentPage, totalPages, maxPageButtons])

  // Navigation handlers
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !loading) {
      onPageChange(page)
    }
  }, [currentPage, totalPages, loading, onPageChange])

  const goToFirstPage = useCallback(() => goToPage(1), [goToPage])
  const goToPreviousPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage])
  const goToNextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage])
  const goToLastPage = useCallback(() => goToPage(totalPages), [totalPages, goToPage])

  // Results text
  const resultsText = useMemo(() => {
    if (resultsTextFormat) {
      return resultsTextFormat(startItem, endItem, totalItems)
    }
    return `Showing ${startItem}-${endItem} of ${totalItems.toLocaleString()} results`
  }, [startItem, endItem, totalItems, resultsTextFormat])

  // Don't render if no items or only one page
  if (totalItems === 0) {
    return null
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      {/* Results text and page size selector */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        {showResultsText && (
          <p className="text-base md:text-sm text-muted">
            {resultsText}
          </p>
        )}

        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-3">
            <span className="text-base md:text-sm text-muted">Rows per page:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(parseInt(value, 10))}
              disabled={loading}
            >
              <SelectTrigger className="w-[80px] h-11 md:h-9 text-base md:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()} className="text-base md:text-sm py-3 md:py-2">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Page navigation */}
      {totalPages > 1 && (
        <nav
          className="flex items-center gap-1 md:gap-1"
          aria-label="Pagination navigation"
        >
          {/* First page button */}
          {showFirstLastButtons && (
            <Button
              variant="ghost"
              size="icon"
              onClick={goToFirstPage}
              disabled={currentPage === 1 || loading}
              aria-label="Go to first page"
              className="h-11 w-11 md:h-9 md:w-9"
            >
              <ChevronsLeft className="h-5 w-5 md:h-4 md:w-4" />
            </Button>
          )}

          {/* Previous page button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousPage}
            disabled={currentPage === 1 || loading}
            aria-label="Go to previous page"
            className="h-11 w-11 md:h-9 md:w-9"
          >
            <ChevronLeft className="h-5 w-5 md:h-4 md:w-4" />
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((page) => {
              if (page === "ellipsis-start" || page === "ellipsis-end") {
                return (
                  <span
                    key={page}
                    className="flex h-11 w-11 md:h-9 md:w-9 items-center justify-center text-muted"
                    aria-hidden="true"
                  >
                    <MoreHorizontal className="h-5 w-5 md:h-4 md:w-4" />
                  </span>
                )
              }

              const isCurrentPage = page === currentPage

              return (
                <Button
                  key={page}
                  variant={isCurrentPage ? "accent" : "ghost"}
                  size="icon"
                  onClick={() => goToPage(page)}
                  disabled={loading}
                  aria-label={`Go to page ${page}`}
                  aria-current={isCurrentPage ? "page" : undefined}
                  className={cn(
                    "h-11 w-11 md:h-9 md:w-9 font-medium text-base md:text-sm",
                    isCurrentPage && "pointer-events-none"
                  )}
                >
                  {page}
                </Button>
              )
            })}
          </div>

          {/* Next page button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextPage}
            disabled={currentPage === totalPages || loading}
            aria-label="Go to next page"
            className="h-11 w-11 md:h-9 md:w-9"
          >
            <ChevronRight className="h-5 w-5 md:h-4 md:w-4" />
          </Button>

          {/* Last page button */}
          {showFirstLastButtons && (
            <Button
              variant="ghost"
              size="icon"
              onClick={goToLastPage}
              disabled={currentPage === totalPages || loading}
              aria-label="Go to last page"
              className="h-11 w-11 md:h-9 md:w-9"
            >
              <ChevronsRight className="h-5 w-5 md:h-4 md:w-4" />
            </Button>
          )}
        </nav>
      )}
    </div>
  )
}

export default Pagination
