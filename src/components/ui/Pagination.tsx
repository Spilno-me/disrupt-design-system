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

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
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
  /** Compact mode */
  compact?: boolean
  /** Custom results text format */
  resultsTextFormat?: (start: number, end: number, total: number) => string
  /** Layout mode: 'responsive' uses container queries, 'row' forces horizontal layout */
  layout?: 'responsive' | 'row'
}

// =============================================================================
// PAGINATION COMPONENT
// =============================================================================

/**
 * Pagination - A comprehensive pagination component (MOLECULE)
 *
 * Features:
 * - Page number buttons with smart ellipsis
 * - Previous/Next navigation
 * - Optional First/Last page buttons
 * - Page size selector
 * - "Showing X-Y of Z results" text
 * - Keyboard accessible
 *
 * Testing:
 * - Component type: MOLECULE
 * - Use `data-slot="pagination"` to target the root container
 * - Use `data-slot="pagination-button"` for page number buttons
 * - Use `data-slot="pagination-prev"` for previous button
 * - Use `data-slot="pagination-next"` for next button
 *
 * Accessibility:
 * - ARIA labels on all navigation buttons (first, prev, next, last)
 * - `aria-current="page"` on active page button
 * - `aria-label="Pagination navigation"` on nav element
 * - Keyboard navigation: Tab, Shift+Tab, Enter, Space
 * - Disabled state properly communicated to screen readers
 * - Ellipsis marked with `aria-hidden="true"` (decorative)
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
 *
 * @example With custom results text
 * ```tsx
 * <Pagination
 *   currentPage={1}
 *   totalItems={100}
 *   pageSize={10}
 *   onPageChange={setPage}
 *   resultsTextFormat={(start, end, total) =>
 *     `Displaying leads ${start} to ${end} (${total} total)`
 *   }
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
  compact: _compact = false,
  resultsTextFormat,
  layout = 'responsive',
  ...props
}: PaginationProps) {
  // Layout classes based on mode
  const isRowLayout = layout === 'row'
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
      data-slot="pagination"
      className={cn(
        "flex gap-3 items-center",
        isRowLayout
          ? "flex-row justify-between"
          : "@container flex-col @md:flex-row @md:justify-between",
        className
      )}
      {...props}
    >
      {/* Results text - hidden on mobile, left on desktop */}
      {showResultsText && (
        <p className={cn(
          "text-sm text-primary text-left order-1",
          isRowLayout ? "block" : "hidden @md:block"
        )}>
          {resultsText}
        </p>
      )}

      {/* Page navigation - centered on mobile, center position on desktop */}
      {totalPages > 1 && (
        <nav
          className={cn(
            "flex items-center bg-surface rounded-lg shadow-inner border border-default",
            isRowLayout ? "gap-1 p-1 order-2" : "gap-0.5 @md:gap-1 p-1.5 @md:p-1 order-1 @md:order-2"
          )}
          aria-label="Pagination navigation"
        >
          {/* First page button - hidden on mobile */}
          {showFirstLastButtons && (
            <Button
              data-slot="pagination-first"
              variant="ghost"
              size="icon"
              onClick={goToFirstPage}
              disabled={currentPage === 1 || loading}
              aria-label="Go to first page"
              className={cn(
                "h-9 w-9 hover:bg-[var(--brand-deep-current-100)] dark:hover:bg-[var(--brand-deep-current-800)]",
                isRowLayout ? "flex" : "hidden @md:flex"
              )}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Previous page button - 44px on mobile for touch targets */}
          <Button
            data-slot="pagination-prev"
            variant="ghost"
            size="icon"
            onClick={goToPreviousPage}
            disabled={currentPage === 1 || loading}
            aria-label="Go to previous page"
            className={cn(
              "hover:bg-[var(--brand-deep-current-100)] dark:hover:bg-[var(--brand-deep-current-800)]",
              isRowLayout ? "h-9 w-9" : "h-11 w-11 @md:h-9 @md:w-9"
            )}
          >
            <ChevronLeft className={isRowLayout ? "h-4 w-4" : "h-5 w-5 @md:h-4 @md:w-4"} />
          </Button>

          {/* Page numbers - 44px touch targets on mobile */}
          <div className="flex items-center gap-0.5">
            {pageNumbers.map((page) => {
              if (page === "ellipsis-start" || page === "ellipsis-end") {
                return (
                  <span
                    key={page}
                    className={cn(
                      "flex items-center justify-center text-secondary",
                      isRowLayout ? "h-9 w-9" : "h-11 w-6 @md:h-9 @md:w-9"
                    )}
                    aria-hidden="true"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </span>
                )
              }

              const isCurrentPage = page === currentPage

              return (
                <Button
                  key={page}
                  data-slot="pagination-button"
                  variant={isCurrentPage ? "accent" : "ghost"}
                  size="icon"
                  onClick={() => goToPage(page)}
                  disabled={loading}
                  aria-label={`Go to page ${page}`}
                  aria-current={isCurrentPage ? "page" : undefined}
                  className={cn(
                    "font-medium transition-shadow duration-200",
                    isRowLayout ? "h-9 w-9 text-sm" : "h-11 w-10 @md:h-9 @md:w-9 text-base @md:text-sm",
                    isCurrentPage && "[--pg-shadow:inset_0_2px_4px_rgba(0,0,0,0.2)] hover:[--pg-shadow:none] cursor-default",
                    !isCurrentPage && "hover:bg-[var(--brand-deep-current-100)] dark:hover:bg-[var(--brand-deep-current-800)]"
                  )}
                  style={isCurrentPage ? {
                    boxShadow: 'var(--pg-shadow)'
                  } : undefined}
                >
                  {page}
                </Button>
              )
            })}
          </div>

          {/* Next page button - 44px on mobile for touch targets */}
          <Button
            data-slot="pagination-next"
            variant="ghost"
            size="icon"
            onClick={goToNextPage}
            disabled={currentPage === totalPages || loading}
            aria-label="Go to next page"
            className={cn(
              "hover:bg-[var(--brand-deep-current-100)] dark:hover:bg-[var(--brand-deep-current-800)]",
              isRowLayout ? "h-9 w-9" : "h-11 w-11 @md:h-9 @md:w-9"
            )}
          >
            <ChevronRight className={isRowLayout ? "h-4 w-4" : "h-5 w-5 @md:h-4 @md:w-4"} />
          </Button>

          {/* Last page button - hidden on mobile */}
          {showFirstLastButtons && (
            <Button
              data-slot="pagination-last"
              variant="ghost"
              size="icon"
              onClick={goToLastPage}
              disabled={currentPage === totalPages || loading}
              aria-label="Go to last page"
              className={cn(
                "h-9 w-9 hover:bg-[var(--brand-deep-current-100)] dark:hover:bg-[var(--brand-deep-current-800)]",
                isRowLayout ? "flex" : "hidden @md:flex"
              )}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          )}
        </nav>
      )}

      {/* Page size selector - hidden on mobile, right side on desktop */}
      {showPageSizeSelector && onPageSizeChange && (
        <div className={cn(
          "items-center gap-2 order-3",
          isRowLayout ? "flex" : "hidden @md:flex"
        )}>
          <span className="text-sm text-secondary">Rows:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(parseInt(value, 10))}
            disabled={loading}
          >
            <SelectTrigger className="w-[70px] h-9 text-sm bg-linen border-default">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()} className="text-sm py-2">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}

Pagination.displayName = "Pagination"

export default Pagination
