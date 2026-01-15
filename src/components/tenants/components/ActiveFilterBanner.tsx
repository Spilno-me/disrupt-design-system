/**
 * ActiveFilterBanner - Shows when a KPI widget filter is active
 * @module tenants/components/ActiveFilterBanner
 */

import { Filter, X } from 'lucide-react'
import type { TenantWidgetFilter } from '../types'

// =============================================================================
// TYPES
// =============================================================================

export interface ActiveFilterBannerProps {
  /** The currently active widget filter */
  activeWidget: TenantWidgetFilter
  /** Number of tenants after filter applied */
  filteredCount: number
  /** Total number of tenants */
  totalCount: number
  /** Callback to clear the filter */
  onClear: () => void
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Map widget filter to display label */
const FILTER_LABELS: Record<string, string> = {
  active: 'Active Tenants',
  overdue: 'Overdue Tenants',
  suspended: 'Suspended Tenants',
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ActiveFilterBanner({
  activeWidget,
  filteredCount,
  totalCount,
  onClear,
}: ActiveFilterBannerProps) {
  const filterLabel = FILTER_LABELS[activeWidget as string] ?? ''

  return (
    <div
      className="flex items-center justify-between gap-4 px-4 py-3 bg-accent-bg border border-accent rounded-lg"
      role="status"
      aria-live="polite"
      data-testid="tenants-active-filter-banner"
    >
      <div className="flex items-center gap-2 text-sm text-accent">
        <Filter className="w-4 h-4" aria-hidden="true" />
        <span className="font-medium">Filter active: {filterLabel}</span>
        <span className="text-accent/70">
          — Showing {filteredCount} of {totalCount} tenants
        </span>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-accent bg-surface border border-accent rounded-md hover:bg-accent-bg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        data-testid="tenants-clear-filter-button"
      >
        <X className="w-3.5 h-3.5" aria-hidden="true" />
        Clear filter
      </button>
    </div>
  )
}

export default ActiveFilterBanner
