"use client"

import * as React from "react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Separator } from "../ui/separator"
import type { Tenant, TenantFormData, SubscriptionPackage } from "./types"

// =============================================================================
// TYPES
// =============================================================================

export interface EditTenantDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Tenant to edit */
  tenant: Tenant | null
  /** Callback when form is submitted */
  onSubmit: (data: TenantFormData) => void | Promise<void>
  /** Whether the form is currently submitting */
  isSubmitting?: boolean
}

// =============================================================================
// CONSTANTS
// =============================================================================

const SUBSCRIPTION_PACKAGES: { value: SubscriptionPackage; label: string }[] = [
  { value: "starter", label: "Starter" },
  { value: "professional", label: "Professional" },
  { value: "enterprise", label: "Enterprise" },
]

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * EditTenantDialog - Dialog for editing tenant details
 *
 * Form dialog with company and contact information fields.
 *
 * @example
 * ```tsx
 * <EditTenantDialog
 *   open={editDialogOpen}
 *   onOpenChange={setEditDialogOpen}
 *   tenant={selectedTenant}
 *   onSubmit={handleEditSubmit}
 *   isSubmitting={isSubmitting}
 * />
 * ```
 */
export function EditTenantDialog({
  open,
  onOpenChange,
  tenant,
  onSubmit,
  isSubmitting = false,
}: EditTenantDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TenantFormData>({
    defaultValues: {
      companyName: "",
      contactName: "",
      contactEmail: "",
      subscriptionPackage: "starter",
    },
  })

  // Reset form when tenant changes
  useEffect(() => {
    if (tenant && open) {
      reset({
        companyName: tenant.companyName,
        contactName: tenant.contactName,
        contactEmail: tenant.contactEmail,
        subscriptionPackage: tenant.subscriptionPackage,
      })
    }
  }, [tenant, open, reset])

  const handleFormSubmit = async (data: TenantFormData) => {
    await onSubmit(data)
  }

  if (!tenant) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* NOTE: Do NOT use overflow-y-auto on DialogContent - it clips the gradient border.
          Instead, use a scrollable inner container. */}
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col" data-testid="tenants-edit-tenant-dialog">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary" data-testid="tenants-edit-tenant-dialog-title">
            Edit Tenant
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 overflow-y-auto flex-1" data-testid="tenants-edit-tenant-dialog-form">
          {/* Company Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary">Company Information</h3>

            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm text-primary">
                Company Name <span className="text-error">*</span>
              </Label>
              <Input
                id="companyName"
                placeholder="Company Name"
                {...register("companyName", { required: "Company name is required" })}
                className={cn(errors.companyName && "border-error")}
                data-testid="tenants-edit-tenant-dialog-company-name"
              />
              {errors.companyName && (
                <p className="text-xs text-error">{errors.companyName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subscriptionPackage" className="text-sm text-primary">
                Subscription Package
              </Label>
              <Select
                value={watch("subscriptionPackage")}
                onValueChange={(value) => setValue("subscriptionPackage", value as SubscriptionPackage)}
              >
                <SelectTrigger data-testid="tenants-edit-tenant-dialog-package">
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
                <SelectContent>
                  {SUBSCRIPTION_PACKAGES.map((pkg) => (
                    <SelectItem key={pkg.value} value={pkg.value}>
                      {pkg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary">Contact Information</h3>

            <div className="space-y-2">
              <Label htmlFor="contactName" className="text-sm text-primary">
                Contact Name <span className="text-error">*</span>
              </Label>
              <Input
                id="contactName"
                placeholder="Contact Name"
                {...register("contactName", { required: "Contact name is required" })}
                className={cn(errors.contactName && "border-error")}
                data-testid="tenants-edit-tenant-dialog-contact-name"
              />
              {errors.contactName && (
                <p className="text-xs text-error">{errors.contactName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail" className="text-sm text-primary">
                Contact Email <span className="text-error">*</span>
              </Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="email@example.com"
                {...register("contactEmail", {
                  required: "Contact email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={cn(errors.contactEmail && "border-error")}
                data-testid="tenants-edit-tenant-dialog-contact-email"
              />
              {errors.contactEmail && (
                <p className="text-xs text-error">{errors.contactEmail.message}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              data-testid="tenants-edit-tenant-dialog-cancel-btn"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={isSubmitting}
              data-testid="tenants-edit-tenant-dialog-submit-btn"
            >
              {isSubmitting ? "Saving..." : "Update Tenant"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditTenantDialog
