import * as React from 'react'
import { useState, useCallback } from 'react'
import { XCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
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

export interface RejectRequestDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Request to reject */
  request: TenantRequest | null
  /** Callback when rejection is confirmed */
  onConfirm: (request: TenantRequest, reason: string) => void | Promise<void>
  /** Whether the rejection is currently in progress */
  isRejecting?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * RejectRequestDialog - Confirmation dialog for rejecting a tenant provisioning request
 *
 * Displays request information and requires a rejection reason before confirming.
 *
 * @example
 * ```tsx
 * <RejectRequestDialog
 *   open={rejectDialogOpen}
 *   onOpenChange={setRejectDialogOpen}
 *   request={requestToReject}
 *   onConfirm={handleRejectConfirm}
 *   isRejecting={isRejecting}
 * />
 * ```
 */
export function RejectRequestDialog({
  open,
  onOpenChange,
  request,
  onConfirm,
  isRejecting = false,
}: RejectRequestDialogProps) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  // Reset form when dialog opens/closes
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (!newOpen) {
      setReason('')
      setError('')
    }
    onOpenChange(newOpen)
  }, [onOpenChange])

  const handleConfirm = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason for rejection')
      return
    }

    if (request) {
      await onConfirm(request, reason)
      setReason('')
      setError('')
    }
  }

  if (!request) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-light">
              <XCircle className="h-5 w-5 text-error" />
            </div>
            <DialogTitle className="text-lg font-semibold text-primary">
              Reject Tenant Request
            </DialogTitle>
          </div>
          <DialogDescription className="pt-3 text-sm text-muted">
            You are rejecting request{' '}
            <span className="font-medium text-primary">{request.requestNumber}</span> for{' '}
            <span className="font-medium text-primary">{request.companyName}</span>.
            Please provide a reason for the rejection.
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
        </div>

        {/* Rejection reason */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reason" className="text-primary">
            Rejection Reason <span className="text-error">*</span>
          </Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              if (error) setError('')
            }}
            placeholder="Please provide a clear reason for rejecting this request..."
            rows={4}
            className={error ? 'border-error focus:ring-error' : ''}
            aria-invalid={!!error}
            aria-describedby={error ? 'reason-error' : undefined}
          />
          {error && (
            <p id="reason-error" className="text-sm text-error">
              {error}
            </p>
          )}
          <p className="text-xs text-muted">
            This reason will be sent to the contact person and stored in the system.
          </p>
        </div>

        {/* Warning message */}
        <div className="rounded-lg border border-error bg-error-light/50 p-3">
          <p className="text-sm text-error font-medium">
            ⚠️ The request will be marked as rejected and the contact will be notified.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isRejecting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isRejecting}
          >
            {isRejecting ? 'Rejecting...' : 'Reject Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RejectRequestDialog
