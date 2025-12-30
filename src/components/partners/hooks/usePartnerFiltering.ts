/**
 * usePartnerFiltering - Hook for filtering partner data
 * @module partners/hooks/usePartnerFiltering
 */

import { useMemo } from "react"
import type { FilterState } from "../../shared/SearchFilter/types"
import type { NetworkPartner } from "../types"

interface UsePartnerFilteringParams {
  /** Partners to filter */
  partners: NetworkPartner[]
  /** Search query string */
  searchQuery: string
  /** Active filter state */
  filters: FilterState
}

/**
 * usePartnerFiltering - Filters partners based on search and filter criteria
 *
 * Supports hierarchical filtering - if a sub-partner matches, the parent is included.
 *
 * @returns Filtered array of partners
 */
export function usePartnerFiltering({
  partners,
  searchQuery,
  filters,
}: UsePartnerFilteringParams): NetworkPartner[] {
  return useMemo(() => {
    const query = searchQuery.toLowerCase()
    const hasStatusFilter = filters.status && filters.status.length > 0
    const hasTypeFilter = filters.type && filters.type.length > 0

    const filterPartner = (partner: NetworkPartner): NetworkPartner | null => {
      // Search filter
      const matchesSearch = !query ||
        partner.companyName.toLowerCase().includes(query) ||
        partner.contactName.toLowerCase().includes(query) ||
        partner.contactEmail.toLowerCase().includes(query)

      // Status filter
      const matchesStatus = !hasStatusFilter || filters.status.includes(partner.status)

      // Type filter
      const partnerType = partner.isMasterPartner ? "master" : "sub"
      const matchesType = !hasTypeFilter || filters.type.includes(partnerType)

      // Check sub-partners recursively
      const filteredSubPartners = partner.subPartners
        ?.map(filterPartner)
        .filter((p): p is NetworkPartner => p !== null)

      // Include if partner matches all criteria or has matching sub-partners
      if ((matchesSearch && matchesStatus && matchesType) ||
          (filteredSubPartners && filteredSubPartners.length > 0)) {
        return {
          ...partner,
          subPartners: filteredSubPartners,
        }
      }

      return null
    }

    return partners.map(filterPartner).filter((p): p is NetworkPartner => p !== null)
  }, [partners, searchQuery, filters])
}

/**
 * Counts total partners including sub-partners
 */
export function usePartnerCount(partners: NetworkPartner[]): number {
  return useMemo(() => {
    const countPartners = (partnerList: NetworkPartner[]): number => {
      return partnerList.reduce((acc, p) => {
        return acc + 1 + (p.subPartners ? countPartners(p.subPartners) : 0)
      }, 0)
    }
    return countPartners(partners)
  }, [partners])
}
