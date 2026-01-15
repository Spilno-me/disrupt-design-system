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
import { formatCurrency } from "../../lib/format"
import type { Tenant } from "./types"

// =============================================================================
// TYPES
// =============================================================================

export interface SuspendTenantDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Tenant to suspend */
  tenant: Tenant | null
  /** Callback when suspend is confirmed */
  onConfirm: (tenant: Tenant) => void | Promise<void>
  /** Whether the suspend is currently in progress */
  isSuspending?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * SuspendTenantDialog - Confirmation dialog for suspending a tenant
 *
 * Displays tenant information and asks for confirmation before suspension.
 *
 * @example
 * ```tsx
 * <SuspendTenantDialog
 *   open={suspendDialogOpen}
 *   onOpenChange={setSuspendDialogOpen}
 *   tenant={tenantToSuspend}
 *   onConfirm={handleSuspendConfirm}
 *   isSuspending={isSuspending}
 * />
 * ```
 */
export function SuspendTenantDialog({
  open,
  onOpenChange,
  tenant,
  onConfirm,
  isSuspending = false,
}: SuspendTenantDialogProps) {
  const handleConfirm = async () => {
    if (tenant) {
      await onConfirm(tenant)
    }
  }

  if (!tenant) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="tenants-suspend-tenant-dialog">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-light" data-testid="tenants-suspend-tenant-dialog-icon">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <DialogTitle className="text-lg font-semibold text-primary" data-testid="tenants-suspend-tenant-dialog-title">
              Suspend Tenant
            </DialogTitle>
          </div>
          <DialogDescription className="pt-3 text-sm text-muted">
            Are you sure you want to suspend{" "}
            <span className="font-medium text-primary">{tenant.companyName}</span>?
            This will disable access for all {tenant.userCount} users.
          </DialogDescription>
        </DialogHeader>

        {/* Tenant details - use rounded-md (12px) for nested corners hierarchy */}
        <div className="rounded-md border border-default bg-surface p-4 space-y-2" data-testid="tenants-suspend-tenant-dialog-details">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Package</span>
            <span className="font-medium text-primary capitalize">{tenant.subscriptionPackage}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Monthly Payment</span>
            <span className="text-primary">{formatCurrency(tenant.monthlyPayment)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Active Users</span>
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
            disabled={isSuspending}
            data-testid="tenants-suspend-tenant-dialog-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isSuspending}
            data-testid="tenants-suspend-tenant-dialog-confirm-btn"
          >
            {isSuspending ? "Suspending..." : "Suspend Tenant"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SuspendTenantDialog
