/**
 * TenantActionsCell - Action buttons for tenant table rows
 *
 * Displays action tiles with tooltips following the Salvador UX Rule:
 * - ≤3 actions: ALL visible as ActionTile buttons (no dropdown)
 * - ≥4 actions: 3 ActionTiles + overflow dropdown menu
 *
 * Current actions (2): View, Change Status → ALL inline
 *
 * @component ATOM
 */

import { Eye, Pencil } from "lucide-react"
import { ActionTile } from "../../ui/ActionTile"
import { Tooltip, TooltipTrigger, TooltipContent } from "../../ui/tooltip"
import { TOOLTIP_SIDE_OFFSET } from "../constants"
import type { Tenant } from "../types"

export interface TenantActionsCellProps {
  /** Tenant data for this row */
  tenant: Tenant
  /** Handler for view action */
  onView: (tenant: Tenant) => void
  /** Handler for change status action */
  onChangeStatus: (tenant: Tenant) => void
}

/**
 * Action button with tooltip wrapper
 */
function ActionButton({
  variant,
  label,
  tooltipText,
  onClick,
  testId,
  children,
}: {
  variant: "info" | "neutral" | "destructive"
  label: string
  tooltipText: string
  onClick: (e: React.MouseEvent) => void
  testId?: string
  children: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ActionTile
          variant={variant}
          appearance="filled"
          size="xs"
          onClick={onClick}
          aria-label={label}
          data-testid={testId}
        >
          {children}
        </ActionTile>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={TOOLTIP_SIDE_OFFSET}>
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  )
}

export function TenantActionsCell({
  tenant,
  onView,
  onChangeStatus,
}: TenantActionsCellProps) {
  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation()
    onView(tenant)
  }

  const handleChangeStatus = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChangeStatus(tenant)
  }

  // Salvador UX Rule: 2 actions → ALL visible, no dropdown
  return (
    <div className="flex items-center gap-1">
      <ActionButton
        variant="info"
        label="View tenant details"
        tooltipText="View Details"
        onClick={handleView}
        testId={`tenant-action-view-${tenant.id}`}
      >
        <Eye className="size-4" />
      </ActionButton>
      <ActionButton
        variant="neutral"
        label="Change tenant status"
        tooltipText="Change Status"
        onClick={handleChangeStatus}
        testId={`tenant-action-status-${tenant.id}`}
      >
        <Pencil className="size-4" />
      </ActionButton>
    </div>
  )
}
