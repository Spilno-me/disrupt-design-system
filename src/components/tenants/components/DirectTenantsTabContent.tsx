"use client"

/**
 * DirectTenantsTabContent - Tab content for Direct Tenants view
 * @module tenants/components/DirectTenantsTabContent
 *
 * Extracted from TenantsPage to fix God File issue (was 563 lines).
 * Contains the search, filter, and table for direct tenants.
 *
 * Salvador UX Rule (action-overflow):
 * - ≤3 actions = ALL visible as ActionTile buttons (no menu)
 * - ≥4 actions = 3 ActionTiles + overflow dropdown menu
 *
 * @since v2.0
 */

import * as React from "react"
import { useMemo, useCallback } from "react"
import {
  Building2,
  Phone,
  Mail,
} from "lucide-react"
import { formatCurrency } from "../../../lib/format"

// Types
import type {
  Tenant,
  OrganizationTier,
} from "../types"

// UI Components
import { Badge } from "../../ui/badge"
import { DataTable, type ColumnDef } from "../../ui/DataTable"
import { SearchFilter } from "../../shared/SearchFilter/SearchFilter"
import type { FilterState } from "../../shared/SearchFilter/types"
import { DataTableStatusDot, type DotStatusMapping } from "../../ui/table"
import { TenantActionsCell } from "./TenantActionsCell"

// Constants
import { TENANT_FILTER_GROUPS } from "../constants/filter.constants"

// =============================================================================
// CONSTANTS
// =============================================================================

const TENANT_DOT_STATUS_MAP: DotStatusMapping = {
  active: { label: "Active", variant: "success" },
  suspended: { label: "Suspended", variant: "destructive" },
  overdue: { label: "Overdue", variant: "warning" },
}

const TIER_LABELS: Record<OrganizationTier, string> = {
  micro: "Micro",
  small: "Small",
  "mid-market": "Mid-Market",
  large: "Large",
  enterprise: "Enterprise",
}

const TIER_ORDER: OrganizationTier[] = ["micro", "small", "mid-market", "large", "enterprise"]

// =============================================================================
// HELPERS
// =============================================================================

const formatDate = (date: Date | null) => {
  if (!date) return "—"
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

const getTierBadgeVariant = (tier: OrganizationTier) => {
  switch (tier) {
    case "enterprise":
    case "large":
      return "default" as const
    case "mid-market":
      return "info" as const
    case "small":
    case "micro":
      return "secondary" as const
    default:
      return "secondary" as const
  }
}

// =============================================================================
// TYPES
// =============================================================================

export interface DirectTenantsTabContentProps {
  /** Tenants data to display */
  tenants: Tenant[]
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
  /** Callback when view action is clicked */
  onViewTenant: (tenant: Tenant) => void
  /** Callback when change status action is clicked */
  onChangeStatus: (tenant: Tenant) => void
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * DirectTenantsTabContent - Content for the Direct Tenants tab
 *
 * @example
 * ```tsx
 * <DirectTenantsTabContent
 *   tenants={tenants}
 *   searchQuery={searchQuery}
 *   onSearchChange={setSearchQuery}
 *   filters={filters}
 *   onFiltersChange={setFilters}
 *   currentPage={currentPage}
 *   onPageChange={setCurrentPage}
 *   pageSize={pageSize}
 *   onPageSizeChange={setPageSize}
 *   onViewTenant={handleView}
 *   onChangeStatus={handleChangeStatus}
 * />
 * ```
 */
export function DirectTenantsTabContent({
  tenants,
  loading = false,
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  currentPage,
  onPageChange,
  pageSize,
  onPageSizeChange,
  onViewTenant,
  onChangeStatus,
}: DirectTenantsTabContentProps) {
  // Filter tenants based on search and filters
  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      // Search filter - company name + contact person (per spec)
      const matchesSearch =
        searchQuery === "" ||
        tenant.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.contactName.toLowerCase().includes(searchQuery.toLowerCase())

      // Status filter
      const matchesStatus =
        filters.status?.length === 0 || filters.status?.includes(tenant.status)

      return matchesSearch && matchesStatus
    })
  }, [tenants, searchQuery, filters])

  // Paginated tenants
  const paginatedTenants = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredTenants.slice(startIndex, startIndex + pageSize)
  }, [filteredTenants, currentPage, pageSize])

  // Row click handler
  const handleRowClick = useCallback((tenant: Tenant) => {
    onViewTenant(tenant)
  }, [onViewTenant])

  // Column definitions per spec (Section 8.1)
  const columns: ColumnDef<Tenant>[] = useMemo(() => [
    // 1. Company / Tenant
    {
      id: "tenant",
      header: "Company / Tenant",
      sortable: true,
      sortValue: (row) => row.companyName,
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted-bg shrink-0">
            <Building2 className="h-4 w-4 text-muted" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-primary truncate">{row.companyName}</span>
            <span className="text-xs text-muted truncate">{row.contactName}</span>
          </div>
        </div>
      ),
    },
    // 2. Contact
    {
      id: "contact",
      header: "Contact",
      accessor: (row) => (
        <div className="flex flex-col gap-0.5 text-sm">
          <div className="flex items-center gap-1.5 text-primary">
            <Mail className="h-3.5 w-3.5 text-muted shrink-0" />
            <span className="truncate">{row.contactEmail}</span>
          </div>
          {row.contactPhone && (
            <div className="flex items-center gap-1.5 text-muted">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{row.contactPhone}</span>
            </div>
          )}
        </div>
      ),
    },
    // 3. Status
    {
      id: "status",
      header: "Status",
      sortable: true,
      sortValue: (row) => row.status,
      accessor: (row) => <DataTableStatusDot status={row.status} mapping={TENANT_DOT_STATUS_MAP} />,
    },
    // 4. Tier
    {
      id: "tier",
      header: "Tier",
      sortable: true,
      sortValue: (row) => TIER_ORDER.indexOf(row.tier),
      accessor: (row) => (
        <Badge variant={getTierBadgeVariant(row.tier)} className="whitespace-nowrap">
          {TIER_LABELS[row.tier]}
        </Badge>
      ),
    },
    // 5. Licenses
    {
      id: "licenses",
      header: "Licenses",
      sortable: true,
      sortValue: (row) => row.licenses,
      accessor: (row) => (
        <span className="text-sm text-primary">{row.licenses}</span>
      ),
    },
    // 6. Monthly Payment
    {
      id: "monthlyPayment",
      header: "Monthly Payment",
      sortable: true,
      sortValue: (row) => row.monthlyPayment,
      accessor: (row) => (
        <span className="text-sm font-medium text-primary">
          {formatCurrency(row.monthlyPayment)}
        </span>
      ),
    },
    // 7. Active Since
    {
      id: "activeSince",
      header: "Active Since",
      sortable: true,
      sortValue: (row) => row.activeSince?.getTime() ?? 0,
      accessor: (row) => (
        <span className="text-sm text-primary">{formatDate(row.activeSince)}</span>
      ),
    },
    // 8. Actions (2 actions → ALL inline per Salvador UX rule)
    {
      id: "actions",
      header: "",
      align: "right",
      width: "100px",
      sticky: "right",
      accessor: (row) => (
        <TenantActionsCell
          tenant={row}
          onView={onViewTenant}
          onChangeStatus={onChangeStatus}
        />
      ),
    },
  ], [onViewTenant, onChangeStatus])

  return (
    <div className="flex flex-col gap-4">
      {/* Search and Filter Bar */}
      <SearchFilter
        placeholder="Search by company or contact name"
        value={searchQuery}
        onChange={onSearchChange}
        filterGroups={TENANT_FILTER_GROUPS}
        filters={filters}
        onFiltersChange={onFiltersChange}
        className="bg-surface border border-default rounded-lg"
        data-testid="tenants-search-filter"
      />

      {/* Data Table */}
      <DataTable
        data={paginatedTenants}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        hoverable
        bordered
        onRowClick={handleRowClick}
        pagination
        currentPage={currentPage}
        totalItems={filteredTenants.length}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={(size) => {
          onPageSizeChange(size)
          onPageChange(1)
        }}
        pageSizeOptions={[10, 25, 50]}
        data-testid="tenants-table"
        emptyState={
          <div className="flex flex-col items-center py-8">
            <div className="w-16 h-16 mb-4 rounded-full bg-muted-bg flex items-center justify-center">
              <Building2 className="h-8 w-8 text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              {searchQuery || (filters.status?.length ?? 0) > 0
                ? "No tenants found"
                : "No tenants yet"}
            </h3>
            <p className="text-muted text-sm max-w-sm text-center">
              {searchQuery || (filters.status?.length ?? 0) > 0
                ? "No tenants match your search criteria. Try adjusting your filters."
                : "Tenants will appear here once they complete the onboarding process."}
            </p>
          </div>
        }
      />
    </div>
  )
}

export default DirectTenantsTabContent
