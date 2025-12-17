"use client"

import * as React from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog"
import { Partner } from "./PartnersPage"

// =============================================================================
// TYPES
// =============================================================================

export interface DeletePartnerDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Partner to delete */
  partner: Partner | null
  /** Callback when delete is confirmed */
  onConfirm: (partner: Partner) => void | Promise<void>
  /** Whether the delete is currently in progress */
  isDeleting?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * DeletePartnerDialog - Confirmation dialog for deleting a partner
 *
 * Displays partner information and asks for confirmation before deletion.
 *
 * @example
 * ```tsx
 * <DeletePartnerDialog
 *   open={deleteDialogOpen}
 *   onOpenChange={setDeleteDialogOpen}
 *   partner={partnerToDelete}
 *   onConfirm={handleDeleteConfirm}
 *   isDeleting={isDeleting}
 * />
 * ```
 */
export function DeletePartnerDialog({
  open,
  onOpenChange,
  partner,
  onConfirm,
  isDeleting = false,
}: DeletePartnerDialogProps) {
  const handleConfirm = async () => {
    if (partner) {
      await onConfirm(partner)
    }
  }

  if (!partner) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-light">
              <AlertTriangle className="h-5 w-5 text-error" />
            </div>
            <DialogTitle className="text-lg font-semibold text-primary">
              Delete Partner
            </DialogTitle>
          </div>
          <DialogDescription className="pt-3 text-sm text-muted">
            Are you sure you want to delete{" "}
            <span className="font-medium text-primary">{partner.name}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* Partner details - use rounded-md (12px) for nested corners hierarchy */}
        <div className="rounded-md border border-default bg-muted-bg/50 p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Partner ID</span>
            <span className="font-mono text-primary">{partner.partnerId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Contact</span>
            <span className="text-primary">{partner.contactName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Email</span>
            <span className="text-primary">{partner.contactEmail}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Status</span>
            <span className="text-primary capitalize">{partner.status}</span>
          </div>
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
            {isDeleting ? "Deleting..." : "Delete Partner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeletePartnerDialog
