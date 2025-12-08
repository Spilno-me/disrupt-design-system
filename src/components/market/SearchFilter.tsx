import * as React from 'react'
import { cn } from '../../lib/utils'
import { MAPPED, RADIUS, ALIAS } from '../../constants/designTokens'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '../ui/dropdown-menu'

// =============================================================================
// FILTER OPTIONS - Market Module Filters
// =============================================================================

export const MARKET_FILTER_OPTIONS = {
  categories: [
    { id: 'safety', label: 'Safety' },
    { id: 'quality', label: 'Quality' },
    { id: 'operations', label: 'Operations' },
    { id: 'compliance', label: 'Compliance' },
  ],
  badges: [
    { id: 'featured', label: 'Featured' },
    { id: 'agentic', label: 'Agentic' },
  ],
  pricing: [
    { id: 'free', label: 'Free' },
    { id: 'paid', label: 'Paid' },
  ],
} as const

export type FilterCategory = (typeof MARKET_FILTER_OPTIONS.categories)[number]['id']
export type FilterBadge = (typeof MARKET_FILTER_OPTIONS.badges)[number]['id']
export type FilterPricing = (typeof MARKET_FILTER_OPTIONS.pricing)[number]['id']

export interface FilterState {
  categories: FilterCategory[]
  badges: FilterBadge[]
  pricing: FilterPricing[]
}

// =============================================================================
// ICONS
// =============================================================================

const SearchIcon = ({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M14 14L11.1067 11.1067"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const FilterIcon = ({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M2 4H14"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.66667 8H11.3333"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.66667 12H9.33333"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// =============================================================================
// COMPONENT
// =============================================================================

export interface SearchFilterProps {
  /** Placeholder text for the search input */
  placeholder?: string
  /** Current search value */
  value?: string
  /** Callback when search value changes */
  onChange?: (value: string) => void
  /** Current filter state */
  filters?: FilterState
  /** Callback when filters change */
  onFiltersChange?: (filters: FilterState) => void
  /** Callback when search is submitted (Enter key) */
  onSearch?: (value: string) => void
  /** Additional class names */
  className?: string
  /** Whether the component should be full width */
  fullWidth?: boolean
}

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  badges: [],
  pricing: [],
}

/**
 * SearchFilter - A search input with filter functionality
 *
 * Part of the Disrupt Market product component library.
 * Features a gradient background, search input, and filter dropdown.
 */
export function SearchFilter({
  placeholder = 'Search modules...',
  value,
  onChange,
  filters = DEFAULT_FILTERS,
  onFiltersChange,
  onSearch,
  className,
  fullWidth = true,
}: SearchFilterProps) {
  const [internalValue, setInternalValue] = React.useState(value ?? '')
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)

  const currentValue = value ?? internalValue

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInternalValue(newValue)
    onChange?.(newValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(currentValue)
    }
  }

  const toggleFilter = <T extends string>(
    filterType: keyof FilterState,
    filterId: T
  ) => {
    if (!onFiltersChange) return

    const currentFilters = filters[filterType] as T[]
    const newFilters = currentFilters.includes(filterId)
      ? currentFilters.filter((id) => id !== filterId)
      : [...currentFilters, filterId]

    onFiltersChange({
      ...filters,
      [filterType]: newFilters,
    })
  }

  // Count active filters
  const activeFilterCount =
    filters.categories.length + filters.badges.length + filters.pricing.length

  return (
    <div
      className={cn(
        'relative flex items-center justify-between gap-3 p-3',
        fullWidth ? 'w-full' : 'w-auto',
        className
      )}
      style={{
        background: MAPPED.searchFilter.bg,
        border: `1px solid ${MAPPED.searchFilter.border}`,
        borderRadius: RADIUS.md,
        boxShadow: MAPPED.searchFilter.shadow,
      }}
    >
      {/* Input container with search icon */}
      <div
        className="relative flex flex-1 items-center h-9"
        style={{
          background: MAPPED.searchFilter.input.bg,
          border: `1px solid ${MAPPED.searchFilter.border}`,
          borderRadius: RADIUS.sm,
        }}
      >
        {/* Search icon */}
        <div className="absolute left-3 flex items-center pointer-events-none">
          <SearchIcon
            style={{ color: MAPPED.searchFilter.icon.search }}
          />
        </div>

        {/* Search input */}
        <input
          type="text"
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full h-full bg-transparent border-none outline-none',
            'text-sm font-normal font-sans tracking-tight',
            'pl-9 pr-3',
            'search-filter-input'
          )}
          style={{
            color: MAPPED.searchFilter.input.text,
            '--placeholder-color': MAPPED.searchFilter.input.placeholder,
          } as React.CSSProperties}
        />
      </div>

      {/* Filter dropdown */}
      <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              'relative flex items-center justify-center',
              'w-9 h-9 flex-shrink-0',
              'transition-opacity hover:opacity-80',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1'
            )}
            style={{
              background: MAPPED.searchFilter.filterButton.bg,
              border: `1px solid ${MAPPED.searchFilter.filterButton.border}`,
              borderRadius: RADIUS.sm,
            }}
            aria-label="Filter"
          >
            <FilterIcon
              style={{ color: MAPPED.searchFilter.icon.filter }}
            />
            {/* Active filter badge */}
            {activeFilterCount > 0 && (
              <span
                className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs font-medium rounded-full"
                style={{
                  background: ALIAS.interactive.accent,
                  color: ALIAS.text.inverse,
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          {/* Categories */}
          <DropdownMenuLabel>Category</DropdownMenuLabel>
          <DropdownMenuGroup>
            {MARKET_FILTER_OPTIONS.categories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category.id}
                checked={filters.categories.includes(category.id)}
                onCheckedChange={() => toggleFilter('categories', category.id)}
              >
                {category.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Badges */}
          <DropdownMenuLabel>Type</DropdownMenuLabel>
          <DropdownMenuGroup>
            {MARKET_FILTER_OPTIONS.badges.map((badge) => (
              <DropdownMenuCheckboxItem
                key={badge.id}
                checked={filters.badges.includes(badge.id)}
                onCheckedChange={() => toggleFilter('badges', badge.id)}
              >
                {badge.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Pricing */}
          <DropdownMenuLabel>Pricing</DropdownMenuLabel>
          <DropdownMenuGroup>
            {MARKET_FILTER_OPTIONS.pricing.map((price) => (
              <DropdownMenuCheckboxItem
                key={price.id}
                checked={filters.pricing.includes(price.id)}
                onCheckedChange={() => toggleFilter('pricing', price.id)}
              >
                {price.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default SearchFilter
