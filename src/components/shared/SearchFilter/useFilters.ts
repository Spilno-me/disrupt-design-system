import { useCallback, useMemo } from 'react'
import type { FilterGroup, FilterState } from './types'

export interface UseFiltersOptions {
  /** Filter groups configuration */
  filterGroups: FilterGroup[]
  /** Current filter state */
  filters: FilterState
  /** Callback when filters change */
  onFiltersChange?: (filters: FilterState) => void
}

export interface UseFiltersReturn {
  /** Toggle a filter option on/off */
  toggleFilter: (groupKey: string, optionId: string) => void
  /** Clear all filters */
  clearAll: () => void
  /** Check if a filter option is selected */
  isSelected: (groupKey: string, optionId: string) => boolean
  /** Get selected options for a group */
  getSelectedForGroup: (groupKey: string) => string[]
  /** Count of active filters across all groups */
  activeCount: number
  /** Whether any filters are active */
  hasActiveFilters: boolean
}

/**
 * Hook for managing filter state.
 * Handles toggling, clearing, and counting active filters.
 */
export function useFilters({
  filterGroups,
  filters,
  onFiltersChange,
}: UseFiltersOptions): UseFiltersReturn {
  const toggleFilter = useCallback(
    (groupKey: string, optionId: string) => {
      if (!onFiltersChange) return

      const currentGroupFilters = filters[groupKey] || []
      const isCurrentlySelected = currentGroupFilters.includes(optionId)

      const newGroupFilters = isCurrentlySelected
        ? currentGroupFilters.filter((id) => id !== optionId)
        : [...currentGroupFilters, optionId]

      onFiltersChange({
        ...filters,
        [groupKey]: newGroupFilters,
      })
    },
    [filters, onFiltersChange]
  )

  const clearAll = useCallback(() => {
    if (!onFiltersChange) return

    const clearedFilters: FilterState = {}
    filterGroups.forEach((group) => {
      clearedFilters[group.key] = []
    })
    onFiltersChange(clearedFilters)
  }, [filterGroups, onFiltersChange])

  const isSelected = useCallback(
    (groupKey: string, optionId: string): boolean => {
      return (filters[groupKey] || []).includes(optionId)
    },
    [filters]
  )

  const getSelectedForGroup = useCallback(
    (groupKey: string): string[] => {
      return filters[groupKey] || []
    },
    [filters]
  )

  const activeCount = useMemo(() => {
    return Object.values(filters).reduce(
      (sum, arr) => sum + (arr?.length || 0),
      0
    )
  }, [filters])

  const hasActiveFilters = activeCount > 0

  return {
    toggleFilter,
    clearAll,
    isSelected,
    getSelectedForGroup,
    activeCount,
    hasActiveFilters,
  }
}
