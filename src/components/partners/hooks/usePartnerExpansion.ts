/**
 * usePartnerExpansion - Hook for managing partner expand/collapse state
 * @module partners/hooks/usePartnerExpansion
 */

import { useState, useCallback } from "react"
import type { NetworkPartner } from "../types"

interface UsePartnerExpansionReturn {
  /** Set of currently expanded partner IDs */
  expandedIds: Set<string>
  /** Whether all partners are expanded */
  allExpanded: boolean
  /** Expand all partners */
  expandAll: () => void
  /** Collapse all partners */
  collapseAll: () => void
  /** Toggle individual partner expansion */
  toggleExpand: (id: string) => void
}

/**
 * Recursively collects all partner IDs from a hierarchy
 */
function getAllPartnerIds(partners: NetworkPartner[]): string[] {
  return partners.flatMap((p) => [
    p.id,
    ...(p.subPartners ? getAllPartnerIds(p.subPartners) : []),
  ])
}

/**
 * usePartnerExpansion - Manages expand/collapse state for partner hierarchy
 *
 * @param partners - Array of partners (for expand all functionality)
 * @returns Expansion state and control functions
 */
export function usePartnerExpansion(partners: NetworkPartner[]): UsePartnerExpansionReturn {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [allExpanded, setAllExpanded] = useState(false)

  const expandAll = useCallback(() => {
    setExpandedIds(new Set(getAllPartnerIds(partners)))
    setAllExpanded(true)
  }, [partners])

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set())
    setAllExpanded(false)
  }, [])

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        setAllExpanded(false)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  return {
    expandedIds,
    allExpanded,
    expandAll,
    collapseAll,
    toggleExpand,
  }
}
