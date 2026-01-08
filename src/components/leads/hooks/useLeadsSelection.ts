/**
 * useLeadsSelection - Manages row selection state for leads table
 *
 * Handles:
 * - Multi-select state tracking
 * - Select all / clear selection
 * - Bulk action coordination
 */

import { useState, useCallback } from 'react'
import type { Lead } from '../LeadCard'
import type { BulkAction } from '../BulkActionsToolbar'

export interface UseLeadsSelectionOptions {
  /** Callback for bulk actions */
  onBulkAction?: (action: BulkAction, leadIds: string[], data?: Record<string, unknown>) => void | Promise<void>
}

export interface UseLeadsSelectionReturn {
  /** Set of selected lead IDs */
  selectedLeads: Set<string>
  /** Set selected leads */
  setSelectedLeads: (leads: Set<string>) => void
  /** Clear all selections */
  clearSelection: () => void
  /** Select all leads from provided array */
  selectAll: (leads: Lead[]) => void
  /** Handle bulk action on selected leads */
  handleBulkAction: (action: BulkAction, data?: Record<string, unknown>) => Promise<void>
}

export function useLeadsSelection({
  onBulkAction,
}: UseLeadsSelectionOptions = {}): UseLeadsSelectionReturn {
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set())

  const clearSelection = useCallback(() => {
    setSelectedLeads(new Set())
  }, [])

  const selectAll = useCallback((leads: Lead[]) => {
    setSelectedLeads(new Set(leads.map(l => l.id)))
  }, [])

  const handleBulkAction = useCallback(async (action: BulkAction, data?: Record<string, unknown>) => {
    if (!onBulkAction) return
    const leadIds = Array.from(selectedLeads)
    await onBulkAction(action, leadIds, data)
    // Clear selection after delete action
    if (action === 'delete') {
      setSelectedLeads(new Set())
    }
  }, [onBulkAction, selectedLeads])

  return {
    selectedLeads,
    setSelectedLeads,
    clearSelection,
    selectAll,
    handleBulkAction,
  }
}
