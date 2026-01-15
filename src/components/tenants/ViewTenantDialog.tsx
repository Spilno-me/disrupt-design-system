"use client"

import * as React from "react"
import { Building2, Mail, User, Calendar, DollarSign, Users } from "lucide-react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Badge } from "../ui/badge"
import { formatCurrency } from "../../lib/format"
import type { Tenant } from "./types"

// =============================================================================
// TYPES
// =============================================================================

export interface ViewTenantDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Tenant to view */
  tenant: Tenant | null
  /** Callback when edit action is clicked */
  onEdit?: (tenant: Tenant) => void
  /** Callback when suspend action is clicked */
  onSuspend?: (tenant: Tenant) => void
  /** Callback when activate action is clicked */
  onActivate?: (tenant: Tenant) => void
}

// =============================================================================
// HELPERS
// =============================================================================

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

const getStatusVariant = (status: Tenant["status"]) => {
  switch (status) {
    case "active":
      return "success"
    case "suspended":
      return "destructive"
    case "overdue":
      return "warning"
    default:
      return "secondary"
  }
}

const getPackageVariant = (pkg: Tenant["subscriptionPackage"]) => {
  switch (pkg) {
    case "enterprise":
      return "default"
    case "professional":
      return "info"
    case "starter":
      return "secondary"
    default:
      return "secondary"
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ViewTenantDialog - Dialog for viewing tenant details
 *
 * Displays comprehensive tenant information in a centered modal dialog.
 * Uses Dialog (not Sheet) per UX rules: 4-7 fields = Dialog pattern.
 *
 * @example
 * ```tsx
 * <ViewTenantDialog
 *   open={viewDialogOpen}
 *   onOpenChange={setViewDialogOpen}
 *   tenant={selectedTenant}
 *   onEdit={handleEdit}
 *   onSuspend={handleSuspend}
 * />
 * ```
 */
export function ViewTenantDialog({
  open,
  onOpenChange,
  tenant,
  onEdit,
  onSuspend,
  onActivate,
}: ViewTenantDialogProps) {
  if (!tenant) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="tenants-view-tenant-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-primary" data-testid="tenants-view-tenant-dialog-title">
            <Building2 className="h-5 w-5 text-accent" />
            {tenant.companyName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status & Package Badges */}
          <div className="flex items-center gap-2" data-testid="tenants-view-tenant-dialog-badges">
            <Badge variant={getStatusVariant(tenant.status)} className="capitalize">
              {tenant.status}
            </Badge>
            <Badge variant={getPackageVariant(tenant.subscriptionPackage)} className="capitalize">
              {tenant.subscriptionPackage}
            </Badge>
          </div>

          {/* Contact Section */}
          <div className="space-y-3 rounded-lg border border-default bg-surface p-4" data-testid="tenants-view-tenant-dialog-contact">
            <h3 className="text-sm font-semibold text-primary">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted" />
                <span className="text-primary">{tenant.contactName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted" />
                <span className="text-primary">{tenant.contactEmail}</span>
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="space-y-3 rounded-lg border border-default bg-surface p-4" data-testid="tenants-view-tenant-dialog-subscription">
            <h3 className="text-sm font-semibold text-primary">Subscription Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <DollarSign className="h-3.5 w-3.5" />
                  Monthly Payment
                </div>
                <div className="text-sm font-medium text-primary">
                  {formatCurrency(tenant.monthlyPayment)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <Users className="h-3.5 w-3.5" />
                  Active Users
                </div>
                <div className="text-sm font-medium text-primary">
                  {tenant.userCount}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <Calendar className="h-3.5 w-3.5" />
                  Created
                </div>
                <div className="text-sm font-medium text-primary">
                  {formatDate(tenant.createdAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4" data-testid="tenants-view-tenant-dialog-actions">
            {onEdit && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  onOpenChange(false)
                  onEdit(tenant)
                }}
                data-testid="tenants-view-tenant-dialog-edit-btn"
              >
                Edit Tenant
              </Button>
            )}
            {tenant.status === "active" && onSuspend && (
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  onOpenChange(false)
                  onSuspend(tenant)
                }}
                data-testid="tenants-view-tenant-dialog-suspend-btn"
              >
                Suspend
              </Button>
            )}
            {tenant.status === "suspended" && onActivate && (
              <Button
                variant="accent"
                className="flex-1"
                onClick={() => {
                  onOpenChange(false)
                  onActivate(tenant)
                }}
                data-testid="tenants-view-tenant-dialog-activate-btn"
              >
                Activate
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ViewTenantDialog
