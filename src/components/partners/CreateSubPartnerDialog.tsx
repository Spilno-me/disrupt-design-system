"use client"

import * as React from "react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { MapPin, Globe, Building2 } from "lucide-react"
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
import type { NetworkPartner, SubPartnerFormData } from "./types"
import { COMPANY_SIZES, COUNTRIES } from "../../constants/form-options"

// Re-export for backwards compatibility
export type { SubPartnerFormData }

export interface CreateSubPartnerDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Parent partner for the sub-partner */
  parentPartner: NetworkPartner | null
  /** Callback when form is submitted */
  onSubmit: (data: SubPartnerFormData, parentPartner: NetworkPartner) => void | Promise<void>
  /** Whether the form is currently submitting */
  isSubmitting?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CreateSubPartnerDialog({
  open,
  onOpenChange,
  parentPartner,
  onSubmit,
  isSubmitting = false,
}: CreateSubPartnerDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SubPartnerFormData>({
    defaultValues: {
      companyName: "",
      industry: "",
      companySize: "",
      website: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      country: "US",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
    },
  })

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset({
        companyName: "",
        industry: "",
        companySize: "",
        website: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        country: "US",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
      })
    }
  }, [open, reset])

  const handleFormSubmit = async (data: SubPartnerFormData) => {
    if (parentPartner) {
      await onSubmit(data, parentPartner)
    }
  }

  const selectedCountry = watch("country")

  if (!parentPartner) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* NOTE: Do NOT use overflow-y-auto on DialogContent - it clips the gradient border.
          Instead, use a scrollable inner container. */}
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary">
            Create Sub-Partner
          </DialogTitle>
          <p className="text-sm text-muted mt-1">
            Creating sub-partner under{" "}
            <span className="font-medium text-primary">{parentPartner.companyName}</span>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 overflow-y-auto flex-1">
          {/* Parent Partner Info */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent-bg border border-accent">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-surface">
              <Building2 className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary">Parent Partner</p>
              <p className="text-xs text-muted">{parentPartner.companyName}</p>
            </div>
          </div>

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
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Partner"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateSubPartnerDialog
