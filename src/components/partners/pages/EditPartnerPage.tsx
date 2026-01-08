"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { MapPin, Globe, Save, Building2, ArrowLeft } from "lucide-react"
import { cn } from "../../../lib/utils"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Checkbox } from "../../ui/checkbox"
import { AppCard, AppCardContent, AppCardDescription, AppCardHeader, AppCardTitle } from "../../ui/app-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import { PageActionPanel } from "../../ui/PageActionPanel"
import type { Partner, PartnerTier } from "../PartnersPage"
import { COMPANY_SIZES, COUNTRIES } from "../../../constants/form-options"
import { GLASS_CARD_CLASSES } from "../constants"

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

export interface EditPartnerPageProps {
  /** Partner to edit (null for create mode) */
  partner: Partner | null
  /** Mode: 'edit' or 'create' */
  mode?: "edit" | "create"
  /** Callback when form is submitted */
  onSubmit: (data: PartnerFormData) => void | Promise<void>
  /** Callback to navigate back */
  onBack: () => void
  /** Whether the form is currently submitting */
  isSubmitting?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * EditPartnerPage - Full-page form for editing/creating partners
 *
 * Replaces EditPartnerDialog for complex forms (11+ fields).
 * Uses page-based pattern per UX Decision Framework.
 *
 * @example
 * ```tsx
 * <EditPartnerPage
 *   partner={selectedPartner}
 *   mode="edit"
 *   onSubmit={handleSubmit}
 *   onBack={() => navigate('partners')}
 * />
 * ```
 */
export function EditPartnerPage({
  partner,
  mode = partner ? "edit" : "create",
  onSubmit,
  onBack,
  isSubmitting = false,
}: EditPartnerPageProps) {
  const [isMasterPartner, setIsMasterPartner] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty: _isDirty },
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
    if (partner && mode === "edit") {
      reset({
        companyName: partner.name,
        industry: "",
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
    } else if (mode === "create") {
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
  }, [partner, mode, reset])

  const handleFormSubmit = async (data: PartnerFormData) => {
    await onSubmit({ ...data, isMasterPartner })
  }

  const selectedCountry = watch("country")
  const pageTitle = mode === "edit" ? "Edit Partner" : "Add Partner"
  const pageDescription = mode === "edit"
    ? `Editing ${partner?.name ?? "partner"}`
    : "Create a new partner account"

  return (
    <div className="p-6 space-y-6" data-testid="partners-edit-partner-page">
      {/* Page Header with Actions */}
      <PageActionPanel
        icon={<Building2 className="w-5 h-5" />}
        title={pageTitle}
        subtitle={pageDescription}
        iconClassName="text-accent"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              disabled={isSubmitting}
              data-testid="partners-edit-partner-page-back-btn"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              disabled={isSubmitting}
              data-testid="partners-edit-partner-page-cancel-btn"
            >
              Cancel
            </Button>
          </div>
        }
        primaryAction={
          <Button
            type="submit"
            form="partner-form"
            variant="accent"
            size="sm"
            disabled={isSubmitting}
            data-testid="partners-edit-partner-page-submit-btn"
          >
            <Save className="h-4 w-4 mr-1" />
            {isSubmitting
              ? "Saving..."
              : mode === "edit"
              ? "Update Partner"
              : "Create Partner"}
          </Button>
        }
      />

      <form id="partner-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" data-testid="partners-edit-partner-page-form">
        {/* Glass wrapper for all form sections */}
        <section className={cn("rounded-xl", GLASS_CARD_CLASSES)}>
          <div className="p-4 md:p-6 space-y-6">
            {/* Row 1: Company Information + Contact Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Company Information Section */}
              <AppCard
                shadow="sm"
                role="group"
                aria-labelledby="company-info-heading"
              >
                <AppCardHeader>
                  <AppCardTitle id="company-info-heading" className="text-lg">Company Information</AppCardTitle>
                  <AppCardDescription>Basic details about the partner company</AppCardDescription>
                </AppCardHeader>
                <AppCardContent className="space-y-4">
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
                  placeholder="e.g., Technology, Healthcare"
                  {...register("industry")}
                />
              </div>

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
              </AppCardContent>
            </AppCard>

            {/* Contact Information Section */}
            <AppCard
              shadow="sm"
              role="group"
              aria-labelledby="contact-info-heading"
            >
              <AppCardHeader>
                <AppCardTitle id="contact-info-heading" className="text-lg">Contact Information</AppCardTitle>
                <AppCardDescription>Primary contact for this partner</AppCardDescription>
              </AppCardHeader>
              <AppCardContent className="space-y-4">
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
              </AppCardContent>
            </AppCard>
          </div>

          {/* Row 2: Partner Type + Address */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Partner Type Section */}
            <AppCard
              shadow="sm"
              role="group"
              aria-labelledby="partner-type-heading"
            >
              <AppCardHeader>
                <AppCardTitle id="partner-type-heading" className="text-lg">Partner Type</AppCardTitle>
                <AppCardDescription>Configure partner capabilities</AppCardDescription>
              </AppCardHeader>
              <AppCardContent>
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
            </AppCardContent>
          </AppCard>

          {/* Address Section */}
          <AppCard
            shadow="sm"
            role="group"
            aria-labelledby="address-heading"
          >
            <AppCardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted" />
                <AppCardTitle id="address-heading" className="text-lg">Address</AppCardTitle>
              </div>
              <AppCardDescription>Physical location (optional)</AppCardDescription>
            </AppCardHeader>
            <AppCardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm text-primary flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-muted" />
                Country
              </Label>
              <Select
                value={watch("country")}
                onValueChange={(value) => setValue("country", value)}
              >
                <SelectTrigger className="w-full md:w-1/2">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  State
                </Label>
                <Input
                  id="state"
                  placeholder="State"
                  {...register("state")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-sm text-primary">
                  ZIP Code
                </Label>
                <Input
                  id="zipCode"
                  placeholder="12345"
                  {...register("zipCode")}
                />
              </div>
              </div>
            </AppCardContent>
          </AppCard>
          </div>
        </div>
        </section>
      </form>
    </div>
  )
}

export default EditPartnerPage
