/**
 * PartnerActionsCell - Action buttons for partner table rows
 *
 * Displays edit, manage users, and delete action tiles with tooltips.
 * Follows ActionTile pattern for row actions (3 visible buttons).
 *
 * @component ATOM
 */

import { Pencil, Users, Trash2 } from "lucide-react"
import { ActionTile } from "../../ui/ActionTile"
import { Tooltip, TooltipTrigger, TooltipContent } from "../../ui/tooltip"
import { TOOLTIP_SIDE_OFFSET } from "../constants"
import type { Partner } from "../types"

export interface PartnerActionsCellProps {
  /** Partner data for this row */
  partner: Partner
  /** Handler for edit action */
  onEdit: (partner: Partner) => void
  /** Handler for manage users action */
  onManageUsers?: (partner: Partner) => void
  /** Handler for delete action */
  onDelete: (partner: Partner) => void
}

/**
 * Action button with tooltip wrapper
 */
function ActionButton({
  variant,
  label,
  tooltipText,
  onClick,
  children,
}: {
  variant: "info" | "neutral" | "destructive"
  label: string
  tooltipText: string
  onClick: (e: React.MouseEvent) => void
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

export function PartnerActionsCell({
  partner,
  onEdit,
  onManageUsers,
  onDelete,
}: PartnerActionsCellProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(partner)
  }

  const handleManageUsers = (e: React.MouseEvent) => {
    e.stopPropagation()
    onManageUsers?.(partner)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(partner)
  }

  return (
    <div className="flex items-center gap-1">
      <ActionButton
        variant="info"
        label="Edit partner"
        tooltipText="Edit Partner"
        onClick={handleEdit}
      >
        <Pencil className="size-4" />
      </ActionButton>
      <ActionButton
        variant="neutral"
        label="Manage users"
        tooltipText="Manage Users"
        onClick={handleManageUsers}
      >
        <Users className="size-4" />
      </ActionButton>
      <ActionButton
        variant="destructive"
        label="Delete partner"
        tooltipText="Delete Partner"
        onClick={handleDelete}
      >
        <Trash2 className="size-4" />
      </ActionButton>
    </div>
  )
}
