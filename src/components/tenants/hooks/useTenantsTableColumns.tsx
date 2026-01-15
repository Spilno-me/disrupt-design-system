/**
 * useTenantsTableColumns - Column definitions for Tenants DataTable
 * @module tenants/hooks
 *
 * Extracted from TenantsPage.tsx to reduce file size.
 * Provides memoized column definitions with ActionTile buttons.
 *
 * Salvador UX Rule (action-overflow):
 * - ≤3 actions = ALL visible as ActionTile buttons (no menu)
 * - ≥4 actions = 3 ActionTiles + overflow dropdown menu
 *
 * Per spec (Section 8.1) columns:
 * 1. Company / Tenant (company name + contact person)
 * 2. Contact (email + phone)
 * 3. Status (badge)
 * 4. Tier (organization size)
 * 5. Licenses (count)
 * 6. Monthly Payment (currency)
 * 7. Active Since (date)
 * 8. Actions (2 actions → ALL inline per Salvador rule)
 */

import { useMemo
} from "react"
import {
  Building2,
  Phone,
  Mail,
} from "lucide-react"
import { formatCurrency } from "../../../lib/format"

// Types
import type { Tenant } from "../types"
import type { ColumnDef } from "../../ui/DataTable"

// UI Components
import { Badge } from "../../ui/badge"
import { DataTableStatusDot } from "../../ui/table"
import { TenantActionsCell } from "../components"

// Constants & Utils
import { TENANT_DOT_STATUS_MAP, TIER_LABELS, TIER_ORDER } from "../constants"
import { formatTenantDate, getTierBadgeVariant } from "../utils"

// =============================================================================
// TYPES
// =============================================================================

export interface UseTenantsTableColumnsOptions {
  /** Callback when View action is clicked */
  onViewTenant: (tenant: Tenant) => void
  /** Callback when Change Status action is clicked */
  onChangeStatus: (tenant: Tenant) => void
}

export interface UseTenantsTableColumnsReturn {
  /** Memoized column definitions */
  columns: ColumnDef<Tenant>[]
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Hook providing memoized column definitions for the Tenants DataTable.
 *
 * @example
 * ```tsx
 * const { columns } = useTenantsTableColumns({
 *   onViewTenant: handleViewTenantClick,
 *   onChangeStatus: handleChangeStatusClick,
 * })
 *
 * <DataTable columns={columns} data={tenants} />
 * ```
 */
export function useTenantsTableColumns({
  onViewTenant,
  onChangeStatus,
}: UseTenantsTableColumnsOptions): UseTenantsTableColumnsReturn {

  // Column definitions per spec (Section 8.1)
  const columns: ColumnDef<Tenant>[] = useMemo(
    () => [
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
              <span className="font-medium text-primary truncate">
                {row.companyName}
              </span>
              <span className="text-xs text-muted truncate">
                {row.contactName}
              </span>
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
        accessor: (row) => (
          <DataTableStatusDot
            status={row.status}
            mapping={TENANT_DOT_STATUS_MAP}
          />
        ),
      },
      // 4. Tier
      {
        id: "tier",
        header: "Tier",
        sortable: true,
        sortValue: (row) => TIER_ORDER.indexOf(row.tier),
        accessor: (row) => (
          <Badge
            variant={getTierBadgeVariant(row.tier)}
            className="whitespace-nowrap"
          >
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
          <span className="text-sm text-primary">
            {formatTenantDate(row.activeSince)}
          </span>
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
    ],
    [onViewTenant, onChangeStatus]
  )

  return { columns }
}

export default useTenantsTableColumns
