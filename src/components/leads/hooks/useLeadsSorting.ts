/**
 * useLeadsSorting - Manages sort state and sorting logic for leads
 *
 * Handles:
 * - Sort column tracking
 * - Sort direction (asc/desc/null)
 * - Multi-column sorting logic
 */

import { useState, useCallback } from 'react'
import type { SortDirection } from '../../ui/DataTable'
import type { Lead } from '../LeadCard'

export interface UseLeadsSortingReturn {
  /** Current sort column */
  sortColumn: string | null
  /** Current sort direction */
  sortDirection: SortDirection
  /** Handle sort change from table header click */
  handleSortChange: (column: string, direction: SortDirection) => void
  /** Sort leads based on current state */
  sortLeads: (leads: Lead[]) => Lead[]
}

/** Priority sort order mapping */
const PRIORITY_ORDER: Record<string, number> = { high: 3, medium: 2, low: 1 }

export function useLeadsSorting(): UseLeadsSortingReturn {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const handleSortChange = useCallback((column: string, direction: SortDirection) => {
    setSortColumn(direction ? column : null)
    setSortDirection(direction)
  }, [])

  const sortLeads = useCallback((leads: Lead[]): Lead[] => {
    if (!sortColumn || !sortDirection) return leads

    return [...leads].sort((a, b) => {
      let valueA: string | number | null = null
      let valueB: string | number | null = null

      switch (sortColumn) {
        case 'name':
          valueA = a.name.toLowerCase()
          valueB = b.name.toLowerCase()
          break
        case 'company':
          valueA = a.company.toLowerCase()
          valueB = b.company.toLowerCase()
          break
        case 'email':
          valueA = a.email.toLowerCase()
          valueB = b.email.toLowerCase()
          break
        case 'priority':
          valueA = PRIORITY_ORDER[a.priority]
          valueB = PRIORITY_ORDER[b.priority]
          break
        case 'score':
          valueA = a.score ?? 0
          valueB = b.score ?? 0
          break
        case 'status':
          valueA = a.status
          valueB = b.status
          break
        case 'source':
          valueA = a.source
          valueB = b.source
          break
        case 'value':
          valueA = a.value ?? 0
          valueB = b.value ?? 0
          break
        default:
          return 0
      }

      if (valueA == null && valueB == null) return 0
      if (valueA == null) return 1
      if (valueB == null) return -1

      let comparison = 0
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        comparison = valueA.localeCompare(valueB)
      } else {
        comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0
      }

      return sortDirection === 'desc' ? -comparison : comparison
    })
  }, [sortColumn, sortDirection])

  return {
    sortColumn,
    sortDirection,
    handleSortChange,
    sortLeads,
  }
}
