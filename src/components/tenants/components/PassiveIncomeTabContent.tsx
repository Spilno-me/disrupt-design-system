"use client"

/**
 * PassiveIncomeTabContent - Tab content for Passive Income view
 * @module tenants/components/PassiveIncomeTabContent
 *
 * Per spec Section 12.3: Passive Income tab shows earnings from sub-partners.
 * Only visible to partner-admin and system-admin roles.
 *
 * Table columns:
 * 1. Sub-Partner Name
 * 2. Tenant Company
 * 3. Sub-Partner Monthly Payment
 * 4. Commission Rate
 * 5. Your Monthly Earnings
 * 6. Status
 *
 * @since v2.0
 */

import * as React from "react"
import { useMemo } from "react"
import { Building2, Users, Percent } from "lucide-react"
import { formatCurrency } from "../../../lib/format"

// Types
import type { PassiveIncomeTenant } from "../types"

// UI Components
import { DataTable, type ColumnDef } from "../../ui/DataTable"
import { SearchFilter } from "../../shared/SearchFilter/SearchFilter"
import type { FilterState } from "../../shared/SearchFilter/types"
import { DataTableStatusDot, type DotStatusMapping } from "../../ui/table"

// =============================================================================
// CONSTANTS
// =============================================================================

const STATUS_DOT_MAP: DotStatusMapping = {
  active: { label: "Active", variant: "success" },
  suspended: { label: "Suspended", variant: "destructive" },
  overdue: { label: "Overdue", variant: "warning" },
}

const FILTER_GROUPS = [
  {
    key: "status",
    label: "Status",
    options: [
      { id: "active", label: "Active" },
      { id: "overdue", label: "Overdue" },
      { id: "suspended", label: "Suspended" },
    ],
  },
]

// =============================================================================
// HELPERS
// =============================================================================

const formatPercent = (value: number): string => {
  return `${(value * 100).toFixed(0)}%`
}

// =============================================================================
// TYPES
// =============================================================================

export interface PassiveIncomeTabContentProps {
  /** Passive income data */
  data: PassiveIncomeTenant[]
  /** Loading state */
  loading?: boolean
  /** Search query value */
  searchQuery: string
  /** Callback when search changes */
  onSearchChange: (value: string) => void
  /** Current filter state */
  filters: FilterState
  /** Callback when filters change */
  onFiltersChange: (filters: FilterState) => void
  /** Current page number */
  currentPage: number
  /** Callback when page changes */
  onPageChange: (page: number) => void
  /** Current page size */
  pageSize: number
  /** Callback when page size changes */
  onPageSizeChange: (size: number) => void
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * PassiveIncomeTabContent - Content for the Passive Income tab
 *
 * @example
 * ```tsx
 * <PassiveIncomeTabContent
 *   data={passiveIncomeData}
 *   searchQuery={searchQuery}
 *   onSearchChange={setSearchQuery}
 *   filters={filters}
 *   onFiltersChange={setFilters}
 *   currentPage={currentPage}
 *   onPageChange={setCurrentPage}
 *   pageSize={pageSize}
 *   onPageSizeChange={setPageSize}
 * />
 * ```
 */
export function PassiveIncomeTabContent({
  data,
  loading = false,
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  currentPage,
  onPageChange,
  pageSize,
  onPageSizeChange,
}: PassiveIncomeTabContentProps) {
  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search filter - sub-partner name + tenant company
      const matchesSearch =
        searchQuery === "" ||
        item.subPartnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tenantCompanyName.toLowerCase().includes(searchQuery.toLowerCase())

      // Status filter
      const matchesStatus =
        filters.status?.length === 0 || filters.status?.includes(item.status)

      return matchesSearch && matchesStatus
    })
  }, [data, searchQuery, filters])

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredData.slice(startIndex, startIndex + pageSize)
  }, [filteredData, currentPage, pageSize])

  // Calculate totals for summary row
  const totals = useMemo(() => {
    const activeItems = filteredData.filter((item) => item.status === "active")
    return {
      totalEarnings: activeItems.reduce((sum, item) => sum + item.yourMonthlyEarnings, 0),
      activeCount: activeItems.length,
    }
  }, [filteredData])

  // Column definitions per spec Section 12.3
  const columns: ColumnDef<PassiveIncomeTenant>[] = useMemo(
    () => [
      // 1. Sub-Partner Name
      {
        id: "subPartner",
        header: "Sub-Partner",
        sortable: true,
        sortValue: (row) => row.subPartnerName,
        accessor: (row) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted-bg shrink-0">
              <Users className="h-4 w-4 text-muted" />
            </div>
            <span className="font-medium text-primary">{row.subPartnerName}</span>
          </div>
        ),
      },
      // 2. Tenant Company
      {
        id: "tenant",
        header: "Tenant Company",
        sortable: true,
        sortValue: (row) => row.tenantCompanyName,
        accessor: (row) => (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted shrink-0" />
            <span className="text-primary">{row.tenantCompanyName}</span>
          </div>
        ),
      },
      // 3. Sub-Partner Monthly Payment
      {
        id: "payment",
        header: "Sub-Partner Payment",
        sortable: true,
        sortValue: (row) => row.subPartnerMonthlyPayment,
        accessor: (row) => (
          <span className="text-sm text-primary">
            {formatCurrency(row.subPartnerMonthlyPayment)}
          </span>
        ),
      },
      // 4. Commission Rate
      {
        id: "commission",
        header: "Commission",
        sortable: true,
        sortValue: (row) => row.commissionRate,
        accessor: (row) => (
          <div className="flex items-center gap-1">
            <Percent className="h-3.5 w-3.5 text-muted" />
            <span className="text-sm text-primary">{formatPercent(row.commissionRate)}</span>
          </div>
        ),
      },
      // 5. Your Monthly Earnings
      {
        id: "earnings",
        header: "Your Earnings",
        sortable: true,
        sortValue: (row) => row.yourMonthlyEarnings,
        accessor: (row) => (
          <span className="text-sm font-semibold text-success">
            {formatCurrency(row.yourMonthlyEarnings)}
          </span>
        ),
      },
      // 6. Status
      {
        id: "status",
        header: "Status",
        sortable: true,
        sortValue: (row) => row.status,
        accessor: (row) => <DataTableStatusDot status={row.status} mapping={STATUS_DOT_MAP} />,
      },
    ],
    []
  )

  return (
    <div className="flex flex-col gap-4">
      {/* Summary Banner */}
      <div className="flex items-center justify-between px-4 py-3 bg-success-light dark:bg-success/10 border border-success/20 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm text-success-dark dark:text-success font-medium">Total Monthly Earnings:</span>
          <span className="text-lg font-bold text-success-dark dark:text-success">
            {formatCurrency(totals.totalEarnings)}
          </span>
        </div>
        <span className="text-sm text-success-dark dark:text-success">
          From {totals.activeCount} active sub-partner tenant{totals.activeCount !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Search and Filter Bar */}
      <SearchFilter
        placeholder="Search by sub-partner or tenant company"
        value={searchQuery}
        onChange={onSearchChange}
        filterGroups={FILTER_GROUPS}
        filters={filters}
        onFiltersChange={onFiltersChange}
        className="bg-surface border border-default rounded-lg"
        data-testid="passive-income-search-filter"
      />

      {/* Data Table */}
      <DataTable
        data={paginatedData}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        hoverable
        bordered
        pagination
        currentPage={currentPage}
        totalItems={filteredData.length}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={(size) => {
          onPageSizeChange(size)
          onPageChange(1)
        }}
        pageSizeOptions={[10, 25, 50]}
        data-testid="passive-income-table"
        emptyState={
          <div className="flex flex-col items-center py-8">
            <div className="w-16 h-16 mb-4 rounded-full bg-muted-bg flex items-center justify-center">
              <Users className="h-8 w-8 text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              {searchQuery || (filters.status?.length ?? 0) > 0
                ? "No earnings found"
                : "No passive income yet"}
            </h3>
            <p className="text-muted text-sm max-w-sm text-center">
              {searchQuery || (filters.status?.length ?? 0) > 0
                ? "No earnings match your search criteria. Try adjusting your filters."
                : "Passive income from sub-partners will appear here once they onboard tenants."}
            </p>
          </div>
        }
      />
    </div>
  )
}

export default PassiveIncomeTabContent
