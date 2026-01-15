"use client"

import * as React from "react"
import { CheckCircle } from "lucide-react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog"
import { formatCurrency } from "../../lib/format"
import type { Tenant } from "./types"

// =============================================================================
// TYPES
// =============================================================================

export interface ActivateTenantDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Tenant to activate */
  tenant: Tenant | null
  /** Callback when activation is confirmed */
  onConfirm: (tenant: Tenant) => void | Promise<void>
  /** Whether the activation is currently in progress */
  isActivating?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ActivateTenantDialog - Confirmation dialog for activating a suspended tenant
 *
 * Displays tenant information and asks for confirmation before activation.
 *
 * @example
 * ```tsx
 * <ActivateTenantDialog
 *   open={activateDialogOpen}
 *   onOpenChange={setActivateDialogOpen}
 *   tenant={tenantToActivate}
 *   onConfirm={handleActivateConfirm}
 *   isActivating={isActivating}
 * />
 * ```
 */
export function ActivateTenantDialog({
  open,
  onOpenChange,
  tenant,
  onConfirm,
  isActivating = false,
}: ActivateTenantDialogProps) {
  const handleConfirm = async () => {
    if (tenant) {
      await onConfirm(tenant)
    }
  }

  if (!tenant) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="tenants-activate-tenant-dialog">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-light" data-testid="tenants-activate-tenant-dialog-icon">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <DialogTitle className="text-lg font-semibold text-primary" data-testid="tenants-activate-tenant-dialog-title">
              Activate Tenant
            </DialogTitle>
          </div>
          <DialogDescription className="pt-3 text-sm text-muted">
            Are you sure you want to activate{" "}
            <span className="font-medium text-primary">{tenant.companyName}</span>?
            This will restore access for all {tenant.userCount} users.
          </DialogDescription>
        </DialogHeader>

        {/* Tenant details - use rounded-md (12px) for nested corners hierarchy */}
        <div className="rounded-md border border-default bg-surface p-4 space-y-2" data-testid="tenants-activate-tenant-dialog-details">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Package</span>
            <span className="font-medium text-primary capitalize">{tenant.subscriptionPackage}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Monthly Payment</span>
            <span className="text-primary">{formatCurrency(tenant.monthlyPayment)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Users to Restore</span>
            <span className="text-primary">{tenant.userCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Contact</span>
            <span className="text-primary">{tenant.contactEmail}</span>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isActivating}
            data-testid="tenants-activate-tenant-dialog-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="accent"
            onClick={handleConfirm}
            disabled={isActivating}
            data-testid="tenants-activate-tenant-dialog-confirm-btn"
          >
            {isActivating ? "Activating..." : "Activate Tenant"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ActivateTenantDialog
