/**
 * Leads Hooks - Extracted business logic for LeadsPage
 *
 * Each hook handles a single responsibility:
 * - useLeadsFiltering: Search and filter state
 * - useLeadsSorting: Sort column and direction
 * - useLeadsPagination: Page and page size
 * - useLeadsSelection: Row selection for bulk actions
 * - useLeadsDialogs: Dialog open states
 * - useLeadsWidgetFilter: KPI widget click-to-filter
 */

export { useLeadsFiltering } from './useLeadsFiltering'
export type { UseLeadsFilteringOptions, UseLeadsFilteringReturn } from './useLeadsFiltering'

export { useLeadsSorting } from './useLeadsSorting'
export type { UseLeadsSortingReturn } from './useLeadsSorting'

export { useLeadsPagination } from './useLeadsPagination'
export type { UseLeadsPaginationOptions, UseLeadsPaginationReturn } from './useLeadsPagination'

export { useLeadsSelection } from './useLeadsSelection'
export type { UseLeadsSelectionOptions, UseLeadsSelectionReturn } from './useLeadsSelection'

export { useLeadsDialogs } from './useLeadsDialogs'
export type { UseLeadsDialogsOptions, UseLeadsDialogsReturn } from './useLeadsDialogs'

export { useLeadsWidgetFilter } from './useLeadsWidgetFilter'
export type { UseLeadsWidgetFilterOptions, UseLeadsWidgetFilterReturn } from './useLeadsWidgetFilter'
