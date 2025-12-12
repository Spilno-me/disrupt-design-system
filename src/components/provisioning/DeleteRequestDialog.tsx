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
import type { TenantRequest } from './ApproveRequestDialog'

// =============================================================================
// TYPES
// =============================================================================

export interface DeleteRequestDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Request to delete */
  request: TenantRequest | null
  /** Callback when delete is confirmed */
  onConfirm: (request: TenantRequest) => void | Promise<void>
  /** Whether the delete is currently in progress */
  isDeleting?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * DeleteRequestDialog - Confirmation dialog for deleting a tenant provisioning request
 *
 * Displays request information and asks for confirmation before deletion.
 * Used for permanently removing requests from the system.
 *
 * @example
 * ```tsx
 * <DeleteRequestDialog
 *   open={deleteDialogOpen}
 *   onOpenChange={setDeleteDialogOpen}
 *   request={requestToDelete}
 *   onConfirm={handleDeleteConfirm}
 *   isDeleting={isDeleting}
 * />
 * ```
 */
export function DeleteRequestDialog({
  open,
  onOpenChange,
  request,
  onConfirm,
  isDeleting = false,
}: DeleteRequestDialogProps) {
  const handleConfirm = async () => {
    if (request) {
      await onConfirm(request)
    }
  }

  if (!request) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-light">
              <AlertTriangle className="h-5 w-5 text-error" />
            </div>
            <DialogTitle className="text-lg font-semibold text-primary">
              Delete Tenant Request
            </DialogTitle>
          </div>
          <DialogDescription className="pt-3 text-sm text-muted">
            Are you sure you want to delete request{' '}
            <span className="font-medium text-primary">{request.requestNumber}</span> for{' '}
            <span className="font-medium text-primary">{request.companyName}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* Request details */}
        <div className="rounded-lg border border-default bg-muted-bg/50 p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Request Number</span>
            <span className="font-mono text-primary">{request.requestNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Company</span>
            <span className="text-primary font-medium">{request.companyName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Contact</span>
            <span className="text-primary">{request.primaryContactName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Email</span>
            <span className="text-primary">{request.primaryContactEmail}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Status</span>
            <span className="text-primary capitalize">{request.status}</span>
          </div>
        </div>

        {/* Warning message */}
        <div className="rounded-lg border border-error bg-error-light/50 p-3">
          <p className="text-sm text-error font-medium">
            ⚠️ All request data and provisioning history will be permanently deleted.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
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
            {isDeleting ? 'Deleting...' : 'Delete Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteRequestDialog
