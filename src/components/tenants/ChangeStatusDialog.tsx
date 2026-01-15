"use client"

/**
 * ChangeStatusDialog - Modal for changing tenant status
 * @module tenants/ChangeStatusDialog
 *
 * Per spec (Section 11):
 * - Title: "Change tenant status"
 * - Field 1: Status dropdown (Active/Overdue/Suspended)
 * - Field 2: Note (optional) with placeholder
 * - Actions: Cancel, Save
 * - Warning when switching to Suspended
 */

import * as React from "react"
import { useState, useCallback, useEffect } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import type { Tenant, TenantStatus, ChangeStatusFormData } from "./types"

// =============================================================================
// CONSTANTS
// =============================================================================

const STATUS_OPTIONS: { value: TenantStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "overdue", label: "Overdue" },
  { value: "suspended", label: "Suspended" },
]

const MAX_NOTE_LENGTH = 1000

// =============================================================================
// TYPES
// =============================================================================

export interface ChangeStatusDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Tenant to change status for */
  tenant: Tenant | null
  /** Callback when status change is confirmed */
  onConfirm: (tenant: Tenant, data: ChangeStatusFormData) => void | Promise<void>
  /** Whether the status change is in progress */
  isSubmitting?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ChangeStatusDialog - Unified modal for changing tenant status
 *
 * @example
 * ```tsx
 * <ChangeStatusDialog
 *   open={changeStatusDialogOpen}
 *   onOpenChange={setChangeStatusDialogOpen}
 *   tenant={selectedTenant}
 *   onConfirm={handleStatusChange}
 *   isSubmitting={isChangingStatus}
 * />
 * ```
 */
export function ChangeStatusDialog({
  open,
  onOpenChange,
  tenant,
  onConfirm,
  isSubmitting = false,
}: ChangeStatusDialogProps) {
  // Form state
  const [status, setStatus] = useState<TenantStatus>("active")
  const [note, setNote] = useState("")

  // Reset form when dialog opens with new tenant
  useEffect(() => {
    if (open && tenant) {
      setStatus(tenant.status)
      setNote("")
    }
  }, [open, tenant])

  // Handle submit
  const handleSubmit = useCallback(async () => {
    if (!tenant) return
    await onConfirm(tenant, { status, note: note.trim() || undefined })
  }, [tenant, status, note, onConfirm])

  // Check if status is changing to suspended (show warning)
  const isChangingToSuspended = tenant?.status !== "suspended" && status === "suspended"

  // Check if form has changes
  const hasChanges = tenant && status !== tenant.status

  if (!tenant) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="tenants-change-status-dialog">
        <DialogHeader>
          <DialogTitle
            className="text-lg font-semibold text-primary"
            data-testid="tenants-change-status-dialog-title"
          >
            Change tenant status
          </DialogTitle>
          <DialogDescription className="text-sm text-muted">
            Update the status for{" "}
            <span className="font-medium text-primary">{tenant.companyName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Status Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="status-select">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as TenantStatus)}
            >
              <SelectTrigger
                id="status-select"
                className="w-full"
                data-testid="tenants-change-status-select"
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    data-testid={`tenants-change-status-option-${option.value}`}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Note Field */}
          <div className="space-y-2">
            <Label htmlFor="status-note">
              Note{" "}
              <span className="text-muted font-normal">(optional)</span>
            </Label>
            <Textarea
              id="status-note"
              placeholder="Reason / internal note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, MAX_NOTE_LENGTH))}
              className="min-h-[80px] resize-none"
              data-testid="tenants-change-status-note"
            />
            <p className="text-xs text-muted text-right">
              {note.length}/{MAX_NOTE_LENGTH}
            </p>
          </div>

          {/* Suspension Warning */}
          {isChangingToSuspended && (
            <div
              className="flex items-start gap-3 p-3 rounded-md border border-warning bg-warning-light"
              role="alert"
              data-testid="tenants-change-status-suspension-warning"
            >
              <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <p className="text-sm text-warning-dark">
                Suspended tenants cannot access the platform until reactivated.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            data-testid="tenants-change-status-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={isChangingToSuspended ? "destructive" : "default"}
            onClick={handleSubmit}
            disabled={isSubmitting || !hasChanges}
            data-testid="tenants-change-status-save-btn"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ChangeStatusDialog
