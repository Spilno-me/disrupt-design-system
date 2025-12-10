/**
 * Disrupt Market Product Components
 *
 * Components specific to the Disrupt Market product.
 */

// Re-export SearchFilter from shared
export { SearchFilter } from '../shared/SearchFilter'
export type {
  SearchFilterProps,
  FilterState,
  FilterGroup,
  FilterOption,
} from '../shared/SearchFilter'

// =============================================================================
// MARKET-SPECIFIC FILTER OPTIONS
// =============================================================================

/** Market-specific filter options for marketplace listings */
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

/** Convenience type for Market filter state */
export interface MarketFilterState {
  categories: FilterCategory[]
  badges: FilterBadge[]
  pricing: FilterPricing[]
}
