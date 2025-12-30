import { useState, memo } from 'react'
import { cn } from '../../../lib/utils'

// Sub-components
import { SearchInput } from './SearchInput'
import { FilterDropdown } from './FilterDropdown'
import { MobileFilterButton } from './MobileFilterButton'
import { MobileFilterSheet } from './MobileFilterSheet'
import { SearchFilterErrorBoundary } from './SearchFilterErrorBoundary'

// Hooks
import { useSearchInput } from './useSearchInput'
import { useFilters } from './useFilters'

// Types
import type { FilterGroup, FilterState } from './types'

// =============================================================================
// PROPS
// =============================================================================

export interface SearchFilterProps {
  /** Placeholder text for the search input */
  placeholder?: string
  /** Current search value (controlled mode) */
  value?: string
  /** Default search value (uncontrolled mode) */
  defaultValue?: string
  /** Callback when search value changes (immediate) */
  onChange?: (value: string) => void
  /** Callback when search value changes (debounced - use for API calls) */
  onDebouncedChange?: (value: string) => void
  /** Debounce delay in ms. Default: 300ms. Set to 0 to disable. */
  debounceMs?: number
  /** Maximum input length. Default: 200 */
  maxLength?: number
  /** Filter groups configuration - defines available filters */
  filterGroups?: FilterGroup[]
  /** Current filter state - selected options per group */
  filters?: FilterState
  /** Callback when filters change */
  onFiltersChange?: (filters: FilterState) => void
  /** Callback when search is submitted (Enter key) */
  onSearch?: (value: string) => void
  /** Additional class names */
  className?: string
  /** Whether the component should be full width (default: true) */
  fullWidth?: boolean
  /** Hide the filter button entirely - shows search only */
  hideFilters?: boolean
  /** Disable the entire component */
  disabled?: boolean
  /** Show loading spinner in search input (for search-in-progress) */
  isSearching?: boolean
  /** Show loading state for filters (async filter groups) */
  isLoadingFilters?: boolean
  /** Custom error handler */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  /** Custom fallback UI for errors */
  errorFallback?: React.ReactNode
  /**
   * Size variant:
   * - 'default': Full-featured with gradient, shadow, larger padding (for page-level)
   * - 'compact': Smaller, no gradient/shadow, button-height (for inner sections)
   */
  size?: 'default' | 'compact'
}

// =============================================================================
// INNER COMPONENT (memoized)
// =============================================================================

interface SearchFilterInnerProps extends Omit<SearchFilterProps, 'onError' | 'errorFallback'> {}

const SearchFilterInner = memo(function SearchFilterInner({
  placeholder = 'Search...',
  value,
  defaultValue,
  onChange,
  onDebouncedChange,
  debounceMs,
  maxLength,
  filterGroups = [],
  filters = {},
  onFiltersChange,
  onSearch,
  className,
  fullWidth = true,
  hideFilters = false,
  disabled = false,
  isSearching = false,
  isLoadingFilters = false,
  size = 'default',
}: SearchFilterInnerProps) {
  // UI state for dropdowns/sheets
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false)

  // Search input state
  const searchInput = useSearchInput({
    value,
    defaultValue,
    onChange,
    onDebouncedChange,
    onSearch,
    debounceMs,
    maxLength,
  })

  // Filter state
  const filterState = useFilters({
    filterGroups,
    filters,
    onFiltersChange,
  })

  // Determine visibility - show filters if:
  // 1. Not explicitly hidden
  // 2. Has filter groups OR is loading filters
  // 3. Has onFiltersChange callback
  const showFilters = !hideFilters && (filterGroups.length > 0 || isLoadingFilters) && onFiltersChange

  // Size-based styles
  const isCompact = size === 'compact'

  return (
    <div
      className={cn(
        'relative flex items-center justify-between',
        // Size variants - both use glass now
        // Light: white glass, Dark: black glass
        isCompact
          // Depth 3 glass for compact (inner sections)
          ? 'gap-2 px-2 py-1.5 rounded-lg bg-white/20 dark:bg-black/20 backdrop-blur-[2px] border-2 border-accent shadow-sm'
          // Depth 2 glass for default (page-level, more prominent)
          : 'gap-3 p-3 rounded-xl bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent shadow-md',
        fullWidth && 'w-full',
        disabled && 'opacity-60',
        className
      )}
      data-disabled={disabled || undefined}
    >
      {/* Search Input */}
      <SearchInput
        value={searchInput.inputValue}
        isFocused={searchInput.isFocused}
        placeholder={placeholder}
        maxLength={searchInput.maxLength}
        disabled={disabled}
        isSearching={isSearching}
        onChange={searchInput.handleChange}
        onKeyDown={searchInput.handleKeyDown}
        onFocus={searchInput.handleFocus}
        onBlur={searchInput.handleBlur}
        size={size}
      />

      {/* Filter Controls */}
      {showFilters && (
        <>
          {/* Mobile: Button that opens bottom sheet */}
          <MobileFilterButton
            onClick={() => setIsMobileSheetOpen(true)}
            activeCount={filterState.activeCount}
            disabled={disabled}
            isLoading={isLoadingFilters}
            size={size}
          />

          {/* Desktop: Dropdown menu */}
          <FilterDropdown
            filterGroups={filterGroups}
            isSelected={filterState.isSelected}
            onToggle={filterState.toggleFilter}
            onClearAll={filterState.clearAll}
            activeCount={filterState.activeCount}
            open={isDropdownOpen}
            onOpenChange={setIsDropdownOpen}
            disabled={disabled}
            isLoading={isLoadingFilters}
            size={size}
          />

          {/* Mobile: Bottom sheet */}
          <MobileFilterSheet
            open={isMobileSheetOpen}
            onOpenChange={setIsMobileSheetOpen}
            filterGroups={filterGroups}
            getSelectedForGroup={filterState.getSelectedForGroup}
            onToggle={filterState.toggleFilter}
            onClearAll={filterState.clearAll}
            activeCount={filterState.activeCount}
          />
        </>
      )}
    </div>
  )
})

// =============================================================================
// MAIN COMPONENT (with error boundary)
// =============================================================================

/**
 * SearchFilter - A universal search input with optional filter functionality.
 *
 * Features:
 * - Debounced search for API calls (`onDebouncedChange`)
 * - Input validation (`maxLength`)
 * - Loading states (`isSearching`, `isLoadingFilters`)
 * - Disabled state
 * - Customizable filter groups
 * - Mobile-responsive (bottom sheet on mobile, dropdown on desktop)
 * - Error boundary with retry capability
 * - Pure Tailwind styling (zero inline styles)
 * - Radix UI primitives for accessibility
 * - Empty state handling
 *
 * @example
 * // Search only (no filters)
 * <SearchFilter
 *   placeholder="Search..."
 *   value={search}
 *   onChange={setSearch}
 *   onDebouncedChange={handleApiSearch}
 *   isSearching={isLoading}
 *   hideFilters
 * />
 *
 * @example
 * // Search with filters and loading state
 * <SearchFilter
 *   placeholder="Search leads..."
 *   value={search}
 *   onChange={setSearch}
 *   onDebouncedChange={handleApiSearch}
 *   filterGroups={filterGroups}
 *   filters={filters}
 *   onFiltersChange={setFilters}
 *   isLoadingFilters={isLoadingFilterOptions}
 * />
 *
 * @example
 * // Disabled state
 * <SearchFilter
 *   placeholder="Search..."
 *   disabled={!hasPermission}
 *   filterGroups={[]}
 *   filters={{}}
 *   onFiltersChange={() => {}}
 * />
 */
export function SearchFilter({
  onError,
  errorFallback,
  ...props
}: SearchFilterProps) {
  return (
    <SearchFilterErrorBoundary onError={onError} fallback={errorFallback}>
      <SearchFilterInner {...props} />
    </SearchFilterErrorBoundary>
  )
}

export default SearchFilter
