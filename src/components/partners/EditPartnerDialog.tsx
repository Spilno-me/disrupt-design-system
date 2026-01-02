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
import { Partner, PartnerTier } from "./PartnersPage"

// =============================================================================
// TYPES
// =============================================================================

export interface PartnerFormData {
  // Company Information
  companyName: string
  industry: string
  companySize: string
  website: string

  // Contact Information
  contactName: string
  contactEmail: string
  contactPhone: string

  // Partner Type
  isMasterPartner: boolean

  // Address (Optional)
  country: string
  streetAddress: string
  city: string
  state: string
  zipCode: string

  // Tier
  tier: PartnerTier
}

export interface EditPartnerDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Partner to edit (null for new partner) */
  partner: Partner | null
  /** Callback when form is submitted */
  onSubmit: (data: PartnerFormData) => void | Promise<void>
  /** Whether the form is currently submitting */
  isSubmitting?: boolean
  /** Mode: 'edit' or 'create' */
  mode?: "edit" | "create"
}

// =============================================================================
// CONSTANTS
// =============================================================================

const COMPANY_SIZES = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1001-5000", label: "1001-5000 employees" },
  { value: "5000+", label: "5000+ employees" },
]

const COUNTRIES = [
  { value: "US", label: "United States", flag: "🇺🇸" },
  { value: "CA", label: "Canada", flag: "🇨🇦" },
  { value: "UK", label: "United Kingdom", flag: "🇬🇧" },
  { value: "AU", label: "Australia", flag: "🇦🇺" },
  { value: "DE", label: "Germany", flag: "🇩🇪" },
  { value: "FR", label: "France", flag: "🇫🇷" },
  { value: "JP", label: "Japan", flag: "🇯🇵" },
  { value: "SG", label: "Singapore", flag: "🇸🇬" },
]

// =============================================================================
// COMPONENT
// =============================================================================

export function EditPartnerDialog({
  open,
  onOpenChange,
  partner,
  onSubmit,
  isSubmitting = false,
  mode = "edit",
}: EditPartnerDialogProps) {
  const [isMasterPartner, setIsMasterPartner] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PartnerFormData>({
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
      tier: "Standard",
    },
  })

  // Reset form when partner changes
  useEffect(() => {
    if (partner && open) {
      reset({
        companyName: partner.name,
        industry: partner.name, // Using name as placeholder since Partner doesn't have industry
        companySize: "501-1000",
        website: `https://${partner.name.toLowerCase().replace(/\s+/g, "")}.com`,
        contactName: partner.contactName,
        contactEmail: partner.contactEmail,
        contactPhone: "",
        isMasterPartner: false,
        country: "US",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
        tier: partner.tier,
      })
      setIsMasterPartner(false)
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
        tier: "Standard",
      })
      setIsMasterPartner(false)
    }
  }, [partner, open, mode, reset])

  const handleFormSubmit = async (data: PartnerFormData) => {
    await onSubmit({ ...data, isMasterPartner })
  }

  const selectedCountry = watch("country")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="partners-edit-partner-dialog">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary" data-testid="partners-edit-partner-dialog-title">
            {mode === "edit" ? "Edit Partner" : "Add Partner"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" data-testid="partners-edit-partner-dialog-form">
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

          {/* Partner Type Section */}
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
                          {COUNTRIES.find((c) => c.value === selectedCountry)?.flag}{" "}
                          {COUNTRIES.find((c) => c.value === selectedCountry)?.label}
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        <span className="flex items-center gap-2">
                          {country.flag} {country.label}
                        </span>
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
              data-testid="partners-edit-partner-dialog-cancel-btn"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={isSubmitting}
              data-testid="partners-edit-partner-dialog-submit-btn"
            >
              {isSubmitting
                ? "Saving..."
                : mode === "edit"
                ? "Update Partner"
                : "Add Partner"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditPartnerDialog
