/**
 * useLeadsFiltering - Manages search and filter state for leads
 *
 * Handles:
 * - Search by name/company
 * - Multi-select status/priority/source filters
 * - Returns filtered leads based on current state
 */

import { useState, useCallback } from 'react'
import type { FilterState } from '../../shared/SearchFilter/types'
import type { Lead } from '../LeadCard'
import { EMPTY_FILTER_STATE } from '../constants'

export interface UseLeadsFilteringOptions {
  /** Initial filter state */
  initialFilters?: FilterState
  /** Callback when filters change (for resetting pagination) */
  onFiltersChange?: () => void
}

export interface UseLeadsFilteringReturn {
  /** Current search value */
  searchValue: string
  /** Update search value */
  setSearchValue: (value: string) => void
  /** Current filter state */
  filters: FilterState
  /** Update filters */
  setFilters: (filters: FilterState) => void
  /** Handle filter changes with pagination reset */
  handleFiltersChange: (newFilters: FilterState) => void
  /** Clear all filters */
  clearFilters: () => void
  /** Filter leads based on current state */
  filterLeads: (leads: Lead[]) => Lead[]
}

export function useLeadsFiltering({
  initialFilters,
  onFiltersChange,
}: UseLeadsFilteringOptions = {}): UseLeadsFilteringReturn {
  const [searchValue, setSearchValue] = useState('')
  const [filters, setFilters] = useState<FilterState>(
    initialFilters ?? EMPTY_FILTER_STATE
  )

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
    onFiltersChange?.()
  }, [onFiltersChange])

  const clearFilters = useCallback(() => {
    setFilters(EMPTY_FILTER_STATE)
    setSearchValue('')
    onFiltersChange?.()
  }, [onFiltersChange])

  const filterLeads = useCallback((leads: Lead[]): Lead[] => {
    return leads.filter((lead) => {
      // Search filter - MVP: only name and company
      if (searchValue) {
        const searchLower = searchValue.toLowerCase()
        const matchesSearch =
          lead.name.toLowerCase().includes(searchLower) ||
          lead.company.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Status filter (if any selected)
      if (filters.status.length > 0 && !filters.status.includes(lead.status)) {
        return false
      }

      // Priority filter (if any selected)
      if (filters.priority.length > 0 && !filters.priority.includes(lead.priority)) {
        return false
      }

      // Source filter (if any selected)
      if (filters.source.length > 0 && !filters.source.includes(lead.source)) {
        return false
      }

      return true
    })
  }, [searchValue, filters])

  return {
    searchValue,
    setSearchValue,
    filters,
    setFilters,
    handleFiltersChange,
    clearFilters,
    filterLeads,
  }
}
