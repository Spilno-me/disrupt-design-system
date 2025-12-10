// Main component
export { SearchFilter, default } from './SearchFilter'
export type { SearchFilterProps } from './SearchFilter'

// Types
export type { FilterOption, FilterGroup, FilterState } from './types'

// Hooks (for custom implementations)
export { useSearchInput } from './useSearchInput'
export type { UseSearchInputOptions, UseSearchInputReturn } from './useSearchInput'

export { useFilters } from './useFilters'
export type { UseFiltersOptions, UseFiltersReturn } from './useFilters'

export { useDebounce } from './useDebounce'

// Sub-components (for custom compositions)
export { SearchInput } from './SearchInput'
export type { SearchInputProps } from './SearchInput'

export { FilterDropdown } from './FilterDropdown'
export type { FilterDropdownProps } from './FilterDropdown'

export { MobileFilterSheet } from './MobileFilterSheet'
export type { MobileFilterSheetProps } from './MobileFilterSheet'

export { MobileFilterButton } from './MobileFilterButton'
export type { MobileFilterButtonProps } from './MobileFilterButton'

export { FilterBadge } from './FilterBadge'
export type { FilterBadgeProps } from './FilterBadge'

// Error boundary
export { SearchFilterErrorBoundary } from './SearchFilterErrorBoundary'

// Constants
export {
  DEFAULT_DEBOUNCE_MS,
  MAX_SEARCH_LENGTH,
  ANIMATION_DURATION_MS,
} from './constants'
