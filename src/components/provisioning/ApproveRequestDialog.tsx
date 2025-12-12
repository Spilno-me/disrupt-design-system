import * as React from 'react'
import { CheckCircle } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog'

// =============================================================================
// TYPES
// =============================================================================

export interface TenantRequest {
  id: string
  requestNumber: string
  companyName: string
  primaryContactName: string
  primaryContactEmail: string
  estimatedMonthlyCost?: number
  status: string
}

export interface ApproveRequestDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Request to approve */
  request: TenantRequest | null
  /** Callback when approval is confirmed */
  onConfirm: (request: TenantRequest) => void | Promise<void>
  /** Whether the approval is currently in progress */
  isApproving?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ApproveRequestDialog - Confirmation dialog for approving a tenant provisioning request
 *
 * Displays request information and asks for confirmation before approval.
 *
 * @example
 * ```tsx
 * <ApproveRequestDialog
 *   open={approveDialogOpen}
 *   onOpenChange={setApproveDialogOpen}
 *   request={requestToApprove}
 *   onConfirm={handleApproveConfirm}
 *   isApproving={isApproving}
 * />
 * ```
 */
export function ApproveRequestDialog({
  open,
  onOpenChange,
  request,
  onConfirm,
  isApproving = false,
}: ApproveRequestDialogProps) {
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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-light">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <DialogTitle className="text-lg font-semibold text-primary">
              Approve Tenant Request
            </DialogTitle>
          </div>
          <DialogDescription className="pt-3 text-sm text-muted">
            Are you sure you want to approve request{' '}
            <span className="font-medium text-primary">{request.requestNumber}</span> for{' '}
            <span className="font-medium text-primary">{request.companyName}</span>?
            This will begin the provisioning process.
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
          {request.estimatedMonthlyCost && (
            <div className="flex justify-between text-sm">
              <span className="text-muted">Estimated Cost</span>
              <span className="text-primary font-semibold">
                ${request.estimatedMonthlyCost.toLocaleString()}/mo
              </span>
            </div>
          )}
        </div>

        {/* Info message */}
        <div className="rounded-lg border border-success bg-success-light/50 p-3">
          <p className="text-sm text-success font-medium">
            ✓ Approval will trigger the tenant provisioning workflow.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isApproving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="accent"
            onClick={handleConfirm}
            disabled={isApproving}
          >
            {isApproving ? 'Approving...' : 'Approve Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ApproveRequestDialog
