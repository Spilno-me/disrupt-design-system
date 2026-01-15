/**
 * useTenantsWidgetFilter - Manages KPI widget filter state for Tenants page
 *
 * Handles:
 * - Active widget tracking (all, active, overdue, suspended)
 * - Widget click -> filter state coordination
 * - Toggle behavior (clicking active widget clears it)
 * - Clear widget filter
 *
 * @module tenants/hooks
 */

import { useState, useCallback } from 'react'
import type { FilterState } from '../../shared/SearchFilter/types'
import type { TenantWidgetFilter } from '../types'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Empty filter state (all filters cleared) */
const EMPTY_FILTER_STATE: FilterState = {
  status: [],
  subscriptionPackage: [],
}

// =============================================================================
// TYPES
// =============================================================================

export interface UseTenantsWidgetFilterOptions {
  /** Callback to set filters */
  setFilters: (filters: FilterState) => void
  /** Callback to reset pagination */
  resetPage: () => void
}

export interface UseTenantsWidgetFilterReturn {
  /** Currently active widget filter */
  activeWidget: TenantWidgetFilter
  /** Handle widget click (toggle or set filter) */
  handleWidgetClick: (widget: TenantWidgetFilter) => void
  /** Clear active widget (called when manual filter changes) */
  clearActiveWidget: () => void
}

// =============================================================================
// HOOK
// =============================================================================

export function useTenantsWidgetFilter({
  setFilters,
  resetPage,
}: UseTenantsWidgetFilterOptions): UseTenantsWidgetFilterReturn {
  const [activeWidget, setActiveWidget] = useState<TenantWidgetFilter>(null)

  const handleWidgetClick = useCallback((widget: TenantWidgetFilter) => {
    // Toggle off if already active (per spec: "Clicking the active widget again removes that widget filter")
    if (activeWidget === widget) {
      setActiveWidget(null)
      setFilters(EMPTY_FILTER_STATE)
      resetPage()
      return
    }

    setActiveWidget(widget)
    resetPage()

    switch (widget) {
      case 'all':
        // Show all - clear filters (per spec: "clears all status widget filters")
        setFilters(EMPTY_FILTER_STATE)
        break
      case 'active':
        setFilters({ status: ['active'], subscriptionPackage: [] })
        break
      case 'overdue':
        setFilters({ status: ['overdue'], subscriptionPackage: [] })
        break
      case 'suspended':
        setFilters({ status: ['suspended'], subscriptionPackage: [] })
        break
      default:
        setFilters(EMPTY_FILTER_STATE)
    }
  }, [activeWidget, setFilters, resetPage])

  const clearActiveWidget = useCallback(() => {
    setActiveWidget(null)
  }, [])

  return {
    activeWidget,
    handleWidgetClick,
    clearActiveWidget,
  }
}
