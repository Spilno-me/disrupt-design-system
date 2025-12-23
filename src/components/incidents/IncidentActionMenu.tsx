/**
 * IncidentActionMenu - Contextual action menu for incident management
 *
 * @component MOLECULE
 *
 * @description
 * Provides contextual actions for incidents in the management table.
 * Adapts between iOS-style ActionSheet (mobile) and DropdownMenu (desktop).
 *
 * Available actions depend on incident status:
 * - Draft: Submit, Edit, Delete
 * - Active/Other: Next Step (handled separately)
 *
 * @example
 * ```tsx
 * <IncidentActionMenu
 *   incidentId="INC-001"
 *   incidentTitle="Slip and Fall - Warehouse A"
 *   status="draft"
 *   onSubmit={(id) => submitIncident(id)}
 *   onEdit={(id) => editIncident(id)}
 *   onDelete={(id) => deleteIncident(id)}
 * />
 * ```
 */

import * as React from 'react'
import { Rocket, Pencil, Trash2, MoreVertical } from 'lucide-react'
import {
  ResponsiveActionMenu,
  ResponsiveActionMenuTrigger,
  ResponsiveActionMenuContent,
  ResponsiveActionMenuItem,
  ResponsiveActionMenuSeparator,
  ResponsiveActionMenuLabel,
} from '../ui/ResponsiveActionMenu'
import { ActionTile } from '../ui/ActionTile'
import type { IncidentStatus } from '../ui/table/IncidentStatusBadge'

// =============================================================================
// TYPES
// =============================================================================

export interface IncidentActionMenuProps {
  /** Unique incident identifier */
  incidentId: string
  /** Incident title for context */
  incidentTitle?: string
  /** Current incident status */
  status: IncidentStatus
  /** Callback when submit action is triggered */
  onSubmit?: (id: string) => void
  /** Callback when edit action is triggered */
  onEdit?: (id: string) => void
  /** Callback when delete action is triggered */
  onDelete?: (id: string) => void
  /** Optional custom trigger element */
  trigger?: React.ReactNode
  /** Additional class names for the trigger */
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function IncidentActionMenu({
  incidentId,
  incidentTitle,
  status,
  onSubmit,
  onEdit,
  onDelete,
  trigger,
  className,
}: IncidentActionMenuProps) {
  const isDraft = status === 'draft'

  // Only show menu for draft incidents (other statuses use NextStepButton)
  if (!isDraft) {
    return null
  }

  const defaultTrigger = (
    <ActionTile
      variant="neutral"
      appearance="outline"
      size="xs"
      aria-label="Incident actions"
      className={className}
    >
      <MoreVertical className="size-4" />
    </ActionTile>
  )

  return (
    <ResponsiveActionMenu>
      <ResponsiveActionMenuTrigger asChild>
        {trigger ?? defaultTrigger}
      </ResponsiveActionMenuTrigger>

      <ResponsiveActionMenuContent align="end">
        {incidentTitle && (
          <>
            <ResponsiveActionMenuLabel>
              {incidentTitle.length > 30
                ? `${incidentTitle.slice(0, 30)}...`
                : incidentTitle}
            </ResponsiveActionMenuLabel>
            <ResponsiveActionMenuSeparator />
          </>
        )}

        {onSubmit && (
          <ResponsiveActionMenuItem
            icon={<Rocket className="size-full" />}
            onSelect={() => onSubmit(incidentId)}
          >
            Submit Incident
          </ResponsiveActionMenuItem>
        )}

        {onEdit && (
          <ResponsiveActionMenuItem
            icon={<Pencil className="size-full" />}
            onSelect={() => onEdit(incidentId)}
          >
            Edit Draft
          </ResponsiveActionMenuItem>
        )}

        {onDelete && (
          <>
            <ResponsiveActionMenuSeparator />
            <ResponsiveActionMenuItem
              variant="destructive"
              icon={<Trash2 className="size-full" />}
              onSelect={() => onDelete(incidentId)}
            >
              Delete Draft
            </ResponsiveActionMenuItem>
          </>
        )}
      </ResponsiveActionMenuContent>
    </ResponsiveActionMenu>
  )
}

IncidentActionMenu.displayName = 'IncidentActionMenu'

export default IncidentActionMenu
