/**
 * Disrupt Market Components
 *
 * Product-specific components for the Disrupt Market application.
 * These components are NOT included in the main DDS export to prevent
 * polluting other products (Flow, Partner, etc.) with Market-specific code.
 *
 * @usage
 * ```tsx
 * import { MARKET_FILTER_OPTIONS } from '@adrozdenko/design-system/market'
 * import { MarketplacePage } from '@adrozdenko/design-system/market'
 * ```
 */

// =============================================================================
// SEARCH & FILTER - Market-specific filter configuration
// =============================================================================

// Re-export SearchFilter from shared for Market usage
export { SearchFilter } from '../components/shared/SearchFilter'
export type {
  SearchFilterProps,
  FilterState,
  FilterGroup,
  FilterOption,
} from '../components/shared/SearchFilter'

// Market-specific filter options
export { MARKET_FILTER_OPTIONS } from '../components/market'
export type {
  FilterCategory,
  FilterBadge,
  FilterPricing,
  MarketFilterState,
} from '../components/market'

// =============================================================================
// MARKETPLACE COMPONENTS (Future)
// =============================================================================
// TODO: Add Market-specific components here as they are developed:
// - MarketplacePage
// - ProductCard
// - ProductGrid
// - ProductDetailPage
// - CategoryBrowser
// - SellerProfile
// - PurchaseDialog
// - ReviewsSection

// =============================================================================
// ICONS - Market-specific icons
// =============================================================================

// Export Market icons when available
// export * from '../components/market/icons'
