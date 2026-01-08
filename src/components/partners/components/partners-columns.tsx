/**
 * Column definitions for Partners DataTable
 *
 * Extracted from PartnersPage to maintain <30 line function rule.
 * Columns are stateless - actions handlers passed via factory function.
 *
 * @module partners/components/partners-columns
 */

import { Building2 } from "lucide-react"
import type { ColumnDef } from "../../ui/DataTable"
import { DataTableStatusDot, PARTNER_DOT_STATUS_MAP } from "../../ui/table"
import { TierBadge, PartnerId } from "./index"
import { PartnerActionsCell } from "./PartnerActionsCell"
import { formatDate } from "../utils"
import type { Partner } from "../types"

/** Column width for actions column */
const ACTIONS_COLUMN_WIDTH = "120px"

export interface PartnerColumnHandlers {
  onEdit: (partner: Partner) => void
  onManageUsers?: (partner: Partner) => void
  onDelete: (partner: Partner) => void
}

/**
 * Creates column definitions with action handlers
 */
export function createPartnerColumns(
  handlers: PartnerColumnHandlers
): ColumnDef<Partner>[] {
  return [
    {
      id: "partner",
      header: "Partner",
      sortable: true,
      sortValue: (row) => row.name,
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted-bg">
            <Building2 className="h-4 w-4 text-muted" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-primary">{row.name}</span>
            <PartnerId id={row.partnerId} />
          </div>
        </div>
      ),
    },
    {
      id: "contact",
      header: "Contact",
      sortable: true,
      sortValue: (row) => row.contactName,
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="text-sm text-primary">{row.contactName}</span>
          <span className="text-xs text-muted">{row.contactEmail}</span>
        </div>
      ),
    },
    {
      id: "tier",
      header: "Tier",
      sortable: true,
      sortValue: (row) => row.tier,
      accessor: (row) => <TierBadge tier={row.tier} />,
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      sortValue: (row) => row.status,
      accessor: (row) => (
        <DataTableStatusDot status={row.status} mapping={PARTNER_DOT_STATUS_MAP} />
      ),
    },
    {
      id: "created",
      header: "Created",
      sortable: true,
      sortValue: (row) => row.createdAt,
      accessor: (row) => (
        <span className="text-sm text-primary">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      align: "right",
      width: ACTIONS_COLUMN_WIDTH,
      sticky: "right",
      accessor: (row) => (
        <PartnerActionsCell
          partner={row}
          onEdit={handlers.onEdit}
          onManageUsers={handlers.onManageUsers}
          onDelete={handlers.onDelete}
        />
      ),
    },
  ]
}
