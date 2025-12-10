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
import { LoginAccount } from "./PartnerLoginAccountsPage"

// =============================================================================
// TYPES
// =============================================================================

export interface DeleteLoginAccountDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Login account to delete */
  account: LoginAccount | null
  /** Callback when delete is confirmed */
  onConfirm: (account: LoginAccount) => void | Promise<void>
  /** Whether the delete is currently in progress */
  isDeleting?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * DeleteLoginAccountDialog - Confirmation dialog for deleting a login account
 *
 * Displays account information and asks for confirmation before deletion.
 *
 * @example
 * ```tsx
 * <DeleteLoginAccountDialog
 *   open={deleteDialogOpen}
 *   onOpenChange={setDeleteDialogOpen}
 *   account={accountToDelete}
 *   onConfirm={handleDeleteConfirm}
 *   isDeleting={isDeleting}
 * />
 * ```
 */
export function DeleteLoginAccountDialog({
  open,
  onOpenChange,
  account,
  onConfirm,
  isDeleting = false,
}: DeleteLoginAccountDialogProps) {
  const handleConfirm = async () => {
    if (account) {
      await onConfirm(account)
    }
  }

  if (!account) return null

  const fullName = `${account.firstName} ${account.lastName}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-light">
              <AlertTriangle className="h-5 w-5 text-error" />
            </div>
            <DialogTitle className="text-lg font-semibold text-primary">
              Delete Login Account
            </DialogTitle>
          </div>
          <DialogDescription className="pt-3 text-sm text-muted">
            Are you sure you want to delete the login account for{" "}
            <span className="font-medium text-primary">{fullName}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* Account details */}
        <div className="rounded-lg border border-default bg-muted-bg/50 p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Name</span>
            <span className="text-primary">{fullName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Email</span>
            <span className="text-primary">{account.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Status</span>
            <span className="text-primary capitalize">{account.status}</span>
          </div>
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
            {isDeleting ? "Deleting..." : "Delete Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteLoginAccountDialog
