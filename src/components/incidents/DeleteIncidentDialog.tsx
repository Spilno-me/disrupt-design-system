/**
 * DeleteIncidentDialog - Confirmation dialog for deleting draft incidents
 *
 * @component MOLECULE
 *
 * @description
 * A destructive action confirmation dialog for deleting draft incidents.
 * Shows incident details and requires explicit confirmation before deletion.
 * Only draft incidents can be deleted - active incidents require archival workflow.
 *
 * UX Laws Applied:
 * - Proximity: Related info grouped in details card
 * - Feedback: Clear warning messaging and loading states
 * - Error Prevention: Requires explicit confirmation for destructive action
 *
 * @example
 * ```tsx
 * <DeleteIncidentDialog
 *   open={deleteDialogOpen}
 *   onOpenChange={setDeleteDialogOpen}
 *   incident={incidentToDelete}
 *   onConfirm={handleDeleteConfirm}
 *   isDeleting={isDeleting}
 * />
 * ```
 */

import * as React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog'
import { DataTableSeverity } from '../ui/table/DataTableSeverity'
import type { IncidentSeverity } from '../ui/table/IncidentStatusBadge'

// =============================================================================
// TYPES
// =============================================================================

export interface IncidentToDelete {
  /** Unique identifier */
  id: string
  /** Display ID (e.g., INC-000001) */
  incidentId: string
  /** Incident title */
  title: string
  /** Location where incident occurred */
  location: string
  /** Person who reported the incident */
  reporter: string
  /** Severity level */
  severity: IncidentSeverity
  /** Age in days */
  ageDays?: number
}

export interface DeleteIncidentDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Incident to delete */
  incident: IncidentToDelete | null
  /** Callback when delete is confirmed */
  onConfirm: (incident: IncidentToDelete) => void | Promise<void>
  /** Whether the delete is currently in progress */
  isDeleting?: boolean
}

// =============================================================================
// CONSTANTS
// =============================================================================

const SEVERITY_MAP = {
  critical: { level: 'critical' as const, label: 'Critical' },
  high: { level: 'high' as const, label: 'High' },
  medium: { level: 'medium' as const, label: 'Medium' },
  low: { level: 'low' as const, label: 'Low' },
  none: { level: 'none' as const, label: 'None' },
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DeleteIncidentDialog({
  open,
  onOpenChange,
  incident,
  onConfirm,
  isDeleting = false,
}: DeleteIncidentDialogProps) {
  const handleConfirm = async () => {
    if (incident) {
      await onConfirm(incident)
    }
  }

  if (!incident) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-light">
              <AlertTriangle className="h-5 w-5 text-error" />
            </div>
            <DialogTitle className="text-lg font-semibold text-primary">
              Delete Draft Incident
            </DialogTitle>
          </div>
          <DialogDescription className="pt-3 text-sm text-muted">
            Are you sure you want to delete this draft incident?{' '}
            <span className="font-medium text-primary">{incident.incidentId}</span>
            {' '}will be permanently removed. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* Incident details */}
        <div className="rounded-lg border border-default bg-muted-bg/50 p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted">ID</span>
            <span className="text-primary font-mono font-medium">{incident.incidentId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Title</span>
            <span className="text-primary font-medium truncate max-w-[200px]">
              {incident.title}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Location</span>
            <span className="text-primary">{incident.location}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Reporter</span>
            <span className="text-primary">{incident.reporter}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted">Severity</span>
            <DataTableSeverity
              value={incident.severity}
              mapping={SEVERITY_MAP}
              size="sm"
              showLabel
            />
          </div>
          {incident.ageDays !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-muted">Age</span>
              <span className="text-primary tabular-nums">
                {incident.ageDays} {incident.ageDays === 1 ? 'day' : 'days'}
              </span>
            </div>
          )}
        </div>

        {/* Warning message */}
        <div className="rounded-lg border border-error bg-error-light/50 p-3">
          <p className="text-sm text-error font-medium">
            ⚠️ All draft data including attached evidence and notes will be permanently deleted.
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Draft'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

DeleteIncidentDialog.displayName = 'DeleteIncidentDialog'

export default DeleteIncidentDialog
