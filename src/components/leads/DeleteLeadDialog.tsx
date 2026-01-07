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
import type { Lead } from './LeadCard'

// =============================================================================
// TYPES
// =============================================================================

export interface DeleteLeadDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Lead to delete */
  lead: Lead | null
  /** Callback when delete is confirmed */
  onConfirm: (lead: Lead) => void | Promise<void>
  /** Whether the delete is currently in progress */
  isDeleting?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * DeleteLeadDialog - Confirmation dialog for deleting a lead
 *
 * Displays lead information and asks for confirmation before deletion.
 * Follows destructive action patterns with warning styling.
 *
 * @example
 * ```tsx
 * <DeleteLeadDialog
 *   open={deleteDialogOpen}
 *   onOpenChange={setDeleteDialogOpen}
 *   lead={leadToDelete}
 *   onConfirm={handleDeleteConfirm}
 *   isDeleting={isDeleting}
 * />
 * ```
 */
export function DeleteLeadDialog({
  open,
  onOpenChange,
  lead,
  onConfirm,
  isDeleting = false,
}: DeleteLeadDialogProps) {
  const handleConfirm = async () => {
    if (lead) {
      await onConfirm(lead)
    }
  }

  if (!lead) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-light">
              <AlertTriangle className="h-5 w-5 text-error" />
            </div>
            <DialogTitle className="text-lg font-semibold text-primary">
              Delete Lead
            </DialogTitle>
          </div>
          <DialogDescription className="pt-3 text-sm text-muted">
            Are you sure you want to delete this lead?{' '}
            <span className="font-medium text-primary">{lead.name}</span> from{' '}
            <span className="font-medium text-primary">{lead.company}</span>
            {' '}will be permanently removed. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* Lead details */}
        <div className="rounded-lg border border-default bg-muted-bg/50 p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Contact</span>
            <span className="text-primary font-medium">{lead.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Company</span>
            <span className="text-primary">{lead.company}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Email</span>
            <span className="text-primary">{lead.email}</span>
          </div>
          {lead.phone && (
            <div className="flex justify-between text-sm">
              <span className="text-muted">Phone</span>
              <span className="text-primary">{lead.phone}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted">Status</span>
            <span className={`px-2 py-0.5 text-xs font-semibold rounded capitalize ${
              lead.status === 'new' ? 'bg-info-light text-info' :
              lead.status === 'in_progress' ? 'bg-warning-light text-warning' :
              lead.status === 'converted' ? 'bg-success-light text-success' :
              'bg-error-light text-error'
            }`}>
              {lead.status === 'in_progress' ? 'In Progress' : lead.status}
            </span>
          </div>
          {lead.value && lead.value > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted">Deal Value</span>
              <span className="text-primary font-semibold">
                ${lead.value.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Warning message */}
        <div className="rounded-lg border border-error bg-error-light/50 p-3">
          <p className="text-sm text-error font-medium">
            ⚠️ All lead data, activities, and history will be permanently deleted.
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
            {isDeleting ? 'Deleting...' : 'Delete Lead'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteLeadDialog
