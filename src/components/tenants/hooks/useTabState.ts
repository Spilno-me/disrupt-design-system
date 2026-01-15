/**
 * useTabState - Hook for per-tab state preservation
 * @module tenants/hooks/useTabState
 *
 * Per spec Section 4.2: Tab switching must preserve table state
 * (filters/sort/search/pagination) per tab during the session.
 *
 * @since v2.0
 */

import { useState, useCallback } from "react"
import type { FilterState } from "../../shared/SearchFilter/types"
import type { TenantsTabId } from "../types"

// =============================================================================
// TYPES
// =============================================================================

/** State for a single tab */
export interface TabState {
  searchQuery: string
  filters: FilterState
  currentPage: number
  pageSize: number
}

/** Combined state for all tabs */
export interface TabsState {
  direct: TabState
  passive: TabState
}

/** Return type for useTabState hook */
export interface UseTabStateReturn {
  /** Currently active tab */
  activeTab: TenantsTabId
  /** Set the active tab */
  setActiveTab: (tab: TenantsTabId) => void
  /** Get state for a specific tab */
  getTabState: (tab: TenantsTabId) => TabState
  /** Update search query for a tab */
  setSearchQuery: (tab: TenantsTabId, value: string) => void
  /** Update filters for a tab */
  setFilters: (tab: TenantsTabId, filters: FilterState) => void
  /** Update current page for a tab */
  setCurrentPage: (tab: TenantsTabId, page: number) => void
  /** Update page size for a tab */
  setPageSize: (tab: TenantsTabId, size: number) => void
  /** Reset a tab's state to defaults */
  resetTabState: (tab: TenantsTabId) => void
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_TAB_STATE: TabState = {
  searchQuery: "",
  filters: { status: [] },
  currentPage: 1,
  pageSize: 10,
}

const DEFAULT_TABS_STATE: TabsState = {
  direct: { ...DEFAULT_TAB_STATE },
  passive: { ...DEFAULT_TAB_STATE },
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * useTabState - Manages state for multiple tabs with preservation
 *
 * @example
 * ```tsx
 * const {
 *   activeTab,
 *   setActiveTab,
 *   getTabState,
 *   setSearchQuery,
 *   setFilters,
 * } = useTabState({ defaultTab: "direct" })
 *
 * const directState = getTabState("direct")
 * ```
 */
export function useTabState(options?: {
  defaultTab?: TenantsTabId
}): UseTabStateReturn {
  const [activeTab, setActiveTab] = useState<TenantsTabId>(
    options?.defaultTab ?? "direct"
  )
  const [tabsState, setTabsState] = useState<TabsState>(DEFAULT_TABS_STATE)

  const getTabState = useCallback((tab: TenantsTabId): TabState => {
    return tabsState[tab]
  }, [tabsState])

  const setSearchQuery = useCallback((tab: TenantsTabId, value: string) => {
    setTabsState((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], searchQuery: value, currentPage: 1 },
    }))
  }, [])

  const setFilters = useCallback((tab: TenantsTabId, filters: FilterState) => {
    setTabsState((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], filters, currentPage: 1 },
    }))
  }, [])

  const setCurrentPage = useCallback((tab: TenantsTabId, page: number) => {
    setTabsState((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], currentPage: page },
    }))
  }, [])

  const setPageSize = useCallback((tab: TenantsTabId, size: number) => {
    setTabsState((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], pageSize: size, currentPage: 1 },
    }))
  }, [])

  const resetTabState = useCallback((tab: TenantsTabId) => {
    setTabsState((prev) => ({
      ...prev,
      [tab]: { ...DEFAULT_TAB_STATE },
    }))
  }, [])

  return {
    activeTab,
    setActiveTab,
    getTabState,
    setSearchQuery,
    setFilters,
    setCurrentPage,
    setPageSize,
    resetTabState,
  }
}

export default useTabState
