/**
 * useLeadsWidgetFilter - Manages KPI widget filter state
 *
 * Handles:
 * - Active widget tracking (all, new, in_progress, converted, high_priority)
 * - Widget click -> filter state coordination
 * - Clear widget filter
 */

import { useState, useCallback } from 'react'
import type { FilterState } from '../../shared/SearchFilter/types'
import type { WidgetFilter } from '../types'
import { EMPTY_FILTER_STATE } from '../constants'

export interface UseLeadsWidgetFilterOptions {
  /** Callback to set filters */
  setFilters: (filters: FilterState) => void
  /** Callback to reset pagination */
  resetPage: () => void
}

export interface UseLeadsWidgetFilterReturn {
  /** Currently active widget filter */
  activeWidget: WidgetFilter
  /** Handle widget click (toggle or set filter) */
  handleWidgetClick: (widget: WidgetFilter) => void
  /** Clear active widget (called when manual filter changes) */
  clearActiveWidget: () => void
}

export function useLeadsWidgetFilter({
  setFilters,
  resetPage,
}: UseLeadsWidgetFilterOptions): UseLeadsWidgetFilterReturn {
  const [activeWidget, setActiveWidget] = useState<WidgetFilter>(null)

  const handleWidgetClick = useCallback((widget: WidgetFilter) => {
    // Toggle off if already active
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
        // Show all - clear filters
        setFilters(EMPTY_FILTER_STATE)
        break
      case 'new':
        setFilters({ status: ['new'], priority: [], source: [] })
        break
      case 'in_progress':
        setFilters({ status: ['in_progress'], priority: [], source: [] })
        break
      case 'converted':
        setFilters({ status: ['converted'], priority: [], source: [] })
        break
      case 'high_priority':
        setFilters({ status: [], priority: ['high'], source: [] })
        break
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
