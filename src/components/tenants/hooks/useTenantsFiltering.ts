/**
 * useTenantsFiltering - Hook for filtering tenant data
 *
 * Handles search query and filter state management for tenant lists.
 *
 * @module tenants/hooks
 */

import { useState, useMemo, useCallback } from "react"
import type { Tenant } from "../types"
import type { FilterState } from "../../shared/SearchFilter/types"

interface UseTenantsFilteringOptions {
  tenants: Tenant[]
  initialSearchQuery?: string
  initialFilters?: FilterState
}

interface UseTenantsFilteringReturn {
  searchQuery: string
  setSearchQuery: (query: string) => void
  filters: FilterState
  setFilters: (filters: FilterState) => void
  filteredTenants: Tenant[]
  handleFiltersChange: (newFilters: FilterState) => void
  clearFilters: () => void
  hasActiveFilters: boolean
}

export function useTenantsFiltering({
  tenants,
  initialSearchQuery = "",
  initialFilters = { status: [], subscriptionPackage: [] },
}: UseTenantsFilteringOptions): UseTenantsFilteringReturn {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [filters, setFilters] = useState<FilterState>(initialFilters)

  // Filter tenants based on search and filters
  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        tenant.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())

      // Status filter (if any selected)
      const matchesStatus =
        !filters.status?.length || filters.status.includes(tenant.status)

      // Package filter (if any selected)
      const matchesPackage =
        !filters.subscriptionPackage?.length ||
        filters.subscriptionPackage.includes(tenant.subscriptionPackage)

      return matchesSearch && matchesStatus && matchesPackage
    })
  }, [tenants, searchQuery, filters])

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery("")
    setFilters({ status: [], subscriptionPackage: [] })
  }, [])

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery !== "" ||
      (filters.status?.length ?? 0) > 0 ||
      (filters.subscriptionPackage?.length ?? 0) > 0
    )
  }, [searchQuery, filters])

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    filteredTenants,
    handleFiltersChange,
    clearFilters,
    hasActiveFilters,
  }
}
