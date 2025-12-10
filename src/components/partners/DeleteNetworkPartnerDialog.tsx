"use client"

import * as React from "react"
import { AlertTriangle, Building2 } from "lucide-react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog"
import { NetworkPartner } from "./PartnerNetworkPage"

// =============================================================================
// TYPES
// =============================================================================

export interface DeleteNetworkPartnerDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Partner to delete */
  partner: NetworkPartner | null
  /** Callback when delete is confirmed */
  onConfirm: (partner: NetworkPartner) => void | Promise<void>
  /** Whether the delete is currently in progress */
  isDeleting?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DeleteNetworkPartnerDialog({
  open,
  onOpenChange,
  partner,
  onConfirm,
  isDeleting = false,
}: DeleteNetworkPartnerDialogProps) {
  const handleConfirm = async () => {
    if (partner) {
      await onConfirm(partner)
    }
  }

  if (!partner) return null

  const hasSubPartners = partner.subPartners && partner.subPartners.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-errorLight">
              <AlertTriangle className="h-5 w-5 text-error" />
            </div>
            <DialogTitle className="text-lg font-semibold text-primary">
              Delete Partner
            </DialogTitle>
          </div>
          <DialogDescription className="pt-3 text-sm text-muted">
            Are you sure you want to delete{" "}
            <span className="font-medium text-primary">{partner.companyName}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* Partner details */}
        <div className="rounded-lg border border-default bg-mutedBg/50 p-4 space-y-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-infoLight">
              <Building2 className="h-4 w-4 text-info" />
            </div>
            <span className="font-medium text-primary">{partner.companyName}</span>
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
          {partner.isMasterPartner && (
            <div className="flex justify-between text-sm">
              <span className="text-muted">Type</span>
              <span className="text-accent font-medium">Master Partner</span>
            </div>
          )}
        </div>

        {/* Warning for master partners with sub-partners */}
        {hasSubPartners && (
          <div className="rounded-lg border border-warning bg-warningLight p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-warning">Warning</p>
                <p className="text-muted mt-1">
                  This partner has {partner.subPartners?.length} sub-partner
                  {partner.subPartners && partner.subPartners.length > 1 ? "s" : ""}.
                  Deleting this partner will also remove all sub-partners.
                </p>
              </div>
            </div>
          </div>
        )}

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
            {isDeleting ? "Deleting..." : "Delete Partner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteNetworkPartnerDialog
