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
// CONSTANTS
// =============================================================================

/** Default maximum number of page buttons to show */
const DEFAULT_MAX_PAGE_BUTTONS = 7

/** Default page size options for the selector dropdown */
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

/** Touch-friendly button size for mobile (44px meets WCAG touch target guidelines) */
const MOBILE_TOUCH_TARGET_CLASS = "h-11 w-11"
const MOBILE_TOUCH_TARGET_WIDE_CLASS = "h-11 w-10"

/** Desktop button size (36px standard interactive) */
const DESKTOP_BUTTON_SIZE_CLASS = "h-9 w-9"

/** Icon sizes for responsive layouts */
const MOBILE_ICON_SIZE_CLASS = "h-5 w-5"
const DESKTOP_ICON_SIZE_CLASS = "h-4 w-4"

/** Page size selector trigger dimensions */
const PAGE_SIZE_TRIGGER_WIDTH = "w-[70px]"
const PAGE_SIZE_TRIGGER_HEIGHT = "h-9"

/** Hover background for nav buttons - uses accent background semantic token */
const NAV_BUTTON_HOVER_BG = "hover:bg-accent-bg"

/** Current page shadow for inset pressed appearance */
const CURRENT_PAGE_SHADOW = "inset_0_2px_4px_rgba(0,0,0,0.2)"

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
// COMPONENT
// =============================================================================

/**
 * Pagination - A comprehensive pagination component for navigating through data.
 *
 * @component MOLECULE
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
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  showPageSizeSelector = true,
  showResultsText = true,
  showFirstLastButtons = true,
  maxPageButtons = DEFAULT_MAX_PAGE_BUTTONS,
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
                DESKTOP_BUTTON_SIZE_CLASS,
                NAV_BUTTON_HOVER_BG,
                isRowLayout ? "flex" : "hidden @md:flex"
              )}
            >
              <ChevronsLeft className={DESKTOP_ICON_SIZE_CLASS} />
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
              NAV_BUTTON_HOVER_BG,
              isRowLayout
                ? DESKTOP_BUTTON_SIZE_CLASS
                : `${MOBILE_TOUCH_TARGET_CLASS} @md:${DESKTOP_BUTTON_SIZE_CLASS}`
            )}
          >
            <ChevronLeft className={isRowLayout
              ? DESKTOP_ICON_SIZE_CLASS
              : `${MOBILE_ICON_SIZE_CLASS} @md:${DESKTOP_ICON_SIZE_CLASS}`}
            />
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
                      isRowLayout
                        ? DESKTOP_BUTTON_SIZE_CLASS
                        : `h-11 w-6 @md:${DESKTOP_BUTTON_SIZE_CLASS}`
                    )}
                    aria-hidden="true"
                  >
                    <MoreHorizontal className={DESKTOP_ICON_SIZE_CLASS} />
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
                    isRowLayout
                      ? `${DESKTOP_BUTTON_SIZE_CLASS} text-sm`
                      : `${MOBILE_TOUCH_TARGET_WIDE_CLASS} @md:${DESKTOP_BUTTON_SIZE_CLASS} text-base @md:text-sm`,
                    isCurrentPage && `[--pg-shadow:${CURRENT_PAGE_SHADOW}] hover:[--pg-shadow:none] cursor-default`,
                    !isCurrentPage && NAV_BUTTON_HOVER_BG
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
              NAV_BUTTON_HOVER_BG,
              isRowLayout
                ? DESKTOP_BUTTON_SIZE_CLASS
                : `${MOBILE_TOUCH_TARGET_CLASS} @md:${DESKTOP_BUTTON_SIZE_CLASS}`
            )}
          >
            <ChevronRight className={isRowLayout
              ? DESKTOP_ICON_SIZE_CLASS
              : `${MOBILE_ICON_SIZE_CLASS} @md:${DESKTOP_ICON_SIZE_CLASS}`}
            />
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
                DESKTOP_BUTTON_SIZE_CLASS,
                NAV_BUTTON_HOVER_BG,
                isRowLayout ? "flex" : "hidden @md:flex"
              )}
            >
              <ChevronsRight className={DESKTOP_ICON_SIZE_CLASS} />
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
            <SelectTrigger
              className={cn(
                PAGE_SIZE_TRIGGER_WIDTH,
                PAGE_SIZE_TRIGGER_HEIGHT,
                "text-sm bg-linen border-default"
              )}
              aria-label="Rows per page"
            >
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
