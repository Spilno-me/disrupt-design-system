"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { MapPin, Globe } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Checkbox } from "../ui/checkbox"
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
import type { NetworkPartner, NetworkPartnerFormData } from "./types"
import { COMPANY_SIZES, COUNTRIES } from "../../constants/form-options"

// Re-export for backwards compatibility
export type { NetworkPartnerFormData }

export interface EditNetworkPartnerDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Partner to edit (null for new partner) */
  partner: NetworkPartner | null
  /** Callback when form is submitted */
  onSubmit: (data: NetworkPartnerFormData, partner?: NetworkPartner) => void | Promise<void>
  /** Whether the form is currently submitting */
  isSubmitting?: boolean
  /** Mode: 'edit' or 'create' */
  mode?: "edit" | "create"
}

// =============================================================================
// COMPONENT
// =============================================================================

export function EditNetworkPartnerDialog({
  open,
  onOpenChange,
  partner,
  onSubmit,
  isSubmitting = false,
  mode = "edit",
}: EditNetworkPartnerDialogProps) {
  const [isMasterPartner, setIsMasterPartner] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NetworkPartnerFormData>({
    defaultValues: {
      companyName: "",
      industry: "",
      companySize: "",
      website: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      isMasterPartner: false,
      country: "US",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
    },
  })

  // Reset form when partner changes
  useEffect(() => {
    if (partner && open) {
      reset({
        companyName: partner.companyName,
        industry: "",
        companySize: "501-1000",
        website: `https://${partner.companyName.toLowerCase().replace(/\s+/g, "")}.com`,
        contactName: partner.contactName,
        contactEmail: partner.contactEmail,
        contactPhone: "",
        isMasterPartner: partner.isMasterPartner,
        country: "US",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
      })
      setIsMasterPartner(partner.isMasterPartner)
    } else if (!partner && open && mode === "create") {
      reset({
        companyName: "",
        industry: "",
        companySize: "",
        website: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        isMasterPartner: false,
        country: "US",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
      })
      setIsMasterPartner(false)
    }
  }, [partner, open, mode, reset])

  const handleFormSubmit = async (data: NetworkPartnerFormData) => {
    await onSubmit({ ...data, isMasterPartner }, partner || undefined)
  }

  const selectedCountry = watch("country")

  // Determine dialog title based on mode
  const dialogTitle = mode === "edit" ? "Edit Partner" : "Add Partner"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* NOTE: Do NOT use overflow-y-auto on DialogContent - it clips the gradient border.
          Instead, use a scrollable inner container. */}
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col" data-testid="partners-edit-network-partner-dialog">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary" data-testid="partners-edit-network-partner-dialog-title">
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 overflow-y-auto flex-1" data-testid="partners-edit-network-partner-dialog-form">
          {/* Company Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary">Company Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm text-primary">
                  Company Name <span className="text-error">*</span>
                </Label>
                <Input
                  id="companyName"
                  placeholder="Company Name"
                  {...register("companyName", { required: "Company name is required" })}
                  className={cn(errors.companyName && "border-error")}
                />
                {errors.companyName && (
                  <p className="text-xs text-error">{errors.companyName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry" className="text-sm text-primary">
                  Industry
                </Label>
                <Input
                  id="industry"
                  placeholder="Industry"
                  {...register("industry")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companySize" className="text-sm text-primary">
                  Company Size
                </Label>
                <Select
                  value={watch("companySize")}
                  onValueChange={(value) => setValue("companySize", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm text-primary">
                  Website
                </Label>
                <Input
                  id="website"
                  placeholder="https://example.com"
                  {...register("website")}
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary">Contact Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName" className="text-sm text-primary">
                  Contact Name <span className="text-error">*</span>
                </Label>
                <Input
                  id="contactName"
                  placeholder="Contact Name"
                  {...register("contactName", { required: "Contact name is required" })}
                  className={cn(errors.contactName && "border-error")}
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
                />
                {errors.contactEmail && (
                  <p className="text-xs text-error">{errors.contactEmail.message}</p>
                )}
              </div>
            </div>

            <div className="w-1/2 pr-2">
              <div className="space-y-2">
                <Label htmlFor="contactPhone" className="text-sm text-primary">
                  Contact Phone
                </Label>
                <Input
                  id="contactPhone"
                  placeholder="+1 (555) 123-4567"
                  {...register("contactPhone")}
                />
              </div>
            </div>
          </div>

          {/* Partner Type Section - Only show in create mode or for root partners */}
          {(mode === "create" || (partner && !partner.parentId)) && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary">Partner Type</h3>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="masterPartner"
                  checked={isMasterPartner}
                  onCheckedChange={(checked) => setIsMasterPartner(checked === true)}
                />
                <div className="space-y-1">
                  <Label htmlFor="masterPartner" className="text-sm font-medium text-primary cursor-pointer">
                    Master Partner
                  </Label>
                  <p className="text-xs text-muted">
                    Master partners can create and manage sub-partners.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Address Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted" />
              <h3 className="text-sm font-semibold text-primary">Address (Optional)</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm text-primary flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-muted" />
                  Country
                </Label>
                <Select
                  value={watch("country")}
                  onValueChange={(value) => setValue("country", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country">
                      {selectedCountry && (
                        <span className="flex items-center gap-2">
                          {COUNTRIES.find((c) => c.value === selectedCountry)?.label}
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="streetAddress" className="text-sm text-primary">
                  Street Address
                </Label>
                <Input
                  id="streetAddress"
                  placeholder="123 Main Street"
                  {...register("streetAddress")}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm text-primary">
                    City
                  </Label>
                  <Input
                    id="city"
                    placeholder="City"
                    {...register("city")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm text-primary">
                    State <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="state"
                    placeholder="State"
                    {...register("state")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode" className="text-sm text-primary">
                    ZIP Code <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="zipCode"
                    placeholder="12345"
                    {...register("zipCode")}
                  />
                  <p className="text-xs text-muted">Example: 90210</p>
                </div>
              </div>
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
              data-testid="partners-edit-network-partner-dialog-cancel-btn"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={isSubmitting}
              data-testid="partners-edit-network-partner-dialog-submit-btn"
            >
              {isSubmitting
                ? "Saving..."
                : mode === "edit"
                ? "Update Partner"
                : "Create Partner"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditNetworkPartnerDialog
