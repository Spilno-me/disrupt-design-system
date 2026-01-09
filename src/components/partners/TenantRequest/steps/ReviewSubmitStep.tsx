/**
 * ReviewSubmitStep - Step 3 of TenantRequestWizard
 *
 * Read-only summary of all form data with collapsible sections.
 * Includes status dropdown and invoice preview buttons.
 *
 * @module partners/TenantRequest/steps/ReviewSubmitStep
 */

import { useState, useMemo } from 'react'
import { useFormContext, useWatch, Controller } from 'react-hook-form'
import { ChevronDown, ChevronRight, Building2, User, CreditCard, DollarSign, Eye, Printer } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../ui/collapsible'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select'
import { Button } from '../../../ui/button'
import { cn } from '../../../../lib/utils'
import type { TenantRequestFormData } from '../tenant-request.types'
import { ORG_SIZE_TIERS, DEFAULT_PRICING_CONFIG } from '../../PricingCalculator/constants'
import type { OrganizationSizeTier, ProcessTier } from '../../types/pricing.types'

export interface ReviewSubmitStepProps {
  /** Reference number for the request */
  referenceNumber?: string
  /** Created date string */
  createdAt?: string
  /** Handler for View Invoice button */
  onViewInvoice?: () => void
  /** Handler for Print Invoice button */
  onPrintInvoice?: () => void
}

interface SectionProps {
  title: string
  icon: React.ReactNode
  defaultOpen?: boolean
  children: React.ReactNode
  testId: string
}

function ReviewSection({ title, icon, defaultOpen = true, children, testId }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        className={cn(
          'flex items-center gap-2 w-full p-3 rounded-lg',
          'hover:bg-accent/10 cursor-pointer transition-colors text-left'
        )}
        data-testid={`${testId}-toggle`}
      >
        {open ? <ChevronDown className="h-4 w-4 text-secondary" /> : <ChevronRight className="h-4 w-4 text-secondary" />}
        {icon}
        <span className="text-lg font-semibold text-primary">{title}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-4">
        <div className="grid gap-3 sm:grid-cols-2 pt-2">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function ReviewField({ label, value }: { label: string; value: string | number | undefined }) {
  if (!value && value !== 0) return null
  return (
    <div>
      <dt className="text-xs text-secondary">{label}</dt>
      <dd className="text-sm font-medium text-primary">{value}</dd>
    </div>
  )
}

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`
}

export function ReviewSubmitStep({
  referenceNumber,
  createdAt,
  onViewInvoice,
  onPrintInvoice,
}: ReviewSubmitStepProps) {
  const { control } = useFormContext<TenantRequestFormData>()
  const formValues = useWatch({ control }) as TenantRequestFormData

  // Calculate pricing summary
  const pricingSummary = useMemo(() => {
    const orgSize = formValues.organizationSize as OrganizationSizeTier | ''
    const platformBase = orgSize ? ORG_SIZE_TIERS[orgSize].annualPrice : 0

    const packageTier = formValues.selectedPackage as ProcessTier | ''
    const packagePrice = packageTier ? DEFAULT_PRICING_CONFIG.processTiers[packageTier].annualPrice : 0
    const packageName = packageTier ? DEFAULT_PRICING_CONFIG.processTiers[packageTier].name : ''

    const licenses = DEFAULT_PRICING_CONFIG.userLicenses
    const licensesTotal =
      (formValues.viewerLicenses || 0) * licenses.viewer.annualPrice +
      (formValues.contributorLicenses || 0) * licenses.contributor.annualPrice +
      (formValues.powerUserLicenses || 0) * licenses.power_user.annualPrice +
      (formValues.creatorLicenses || 0) * licenses.creator.annualPrice

    const total = platformBase + packagePrice + licensesTotal

    return {
      platformBase,
      packageName,
      packagePrice,
      licensesTotal,
      total,
      monthlyTotal: Math.round(total / 12),
    }
  }, [formValues])

  return (
    <div className="space-y-6">
      {/* Header with reference number and date */}
      {(referenceNumber || createdAt) && (
        <div className="flex items-center justify-between text-sm text-secondary pb-4 border-b border-subtle">
          {referenceNumber && <span>Reference: {referenceNumber}</span>}
          {createdAt && <span>Created: {createdAt}</span>}
        </div>
      )}

      {/* Company Information */}
      <ReviewSection
        title="Company Information"
        icon={<Building2 className="h-5 w-5 text-primary" aria-hidden="true" />}
        testId="review-company"
      >
        <ReviewField label="Company Name" value={formValues.companyName} />
        <ReviewField label="Legal Name" value={formValues.legalName} />
        <ReviewField label="Website" value={formValues.website} />
        <ReviewField label="Industry" value={formValues.industry} />
      </ReviewSection>

      {/* Contact Information */}
      <ReviewSection
        title="Contact Information"
        icon={<User className="h-5 w-5 text-primary" aria-hidden="true" />}
        testId="review-contact"
      >
        <ReviewField label="Full Name" value={formValues.contactName} />
        <ReviewField label="Job Title" value={formValues.contactTitle} />
        <ReviewField label="Email" value={formValues.contactEmail} />
        <ReviewField label="Phone" value={formValues.contactPhone} />
      </ReviewSection>

      {/* Billing Information (collapsed by default) */}
      <ReviewSection
        title="Billing Information"
        icon={<CreditCard className="h-5 w-5 text-primary" aria-hidden="true" />}
        defaultOpen={false}
        testId="review-billing"
      >
        <ReviewField label="Street Address" value={formValues.billingStreet} />
        <ReviewField label="City" value={formValues.billingCity} />
        <ReviewField label="State / Province" value={formValues.billingState} />
        <ReviewField label="Postal Code" value={formValues.billingPostalCode} />
        <ReviewField label="Country" value={formValues.billingCountry} />
        {!formValues.billingStreet && !formValues.billingCity && (
          <p className="text-sm text-secondary sm:col-span-2">No billing information provided</p>
        )}
      </ReviewSection>

      {/* Pricing Summary */}
      <ReviewSection
        title="Pricing Summary"
        icon={<DollarSign className="h-5 w-5 text-primary" aria-hidden="true" />}
        testId="review-pricing"
      >
        <ReviewField
          label="Organization Size"
          value={formValues.organizationSize ? ORG_SIZE_TIERS[formValues.organizationSize as OrganizationSizeTier].label : ''}
        />
        <ReviewField label="Platform Base" value={formatCurrency(pricingSummary.platformBase)} />
        <ReviewField label="Package" value={pricingSummary.packageName} />
        <ReviewField label="Package Price" value={formatCurrency(pricingSummary.packagePrice)} />
        {formValues.viewerLicenses > 0 && (
          <ReviewField label="Viewer Licenses" value={`${formValues.viewerLicenses} @ $100/yr each`} />
        )}
        {formValues.contributorLicenses > 0 && (
          <ReviewField label="Contributor Licenses" value={`${formValues.contributorLicenses} @ $300/yr each`} />
        )}
        {formValues.powerUserLicenses > 0 && (
          <ReviewField label="Power User Licenses" value={`${formValues.powerUserLicenses} @ $600/yr each`} />
        )}
        {formValues.creatorLicenses > 0 && (
          <ReviewField label="Creator Licenses" value={`${formValues.creatorLicenses} @ $1,500/yr each`} />
        )}
        <div className="sm:col-span-2 pt-3 mt-3 border-t border-subtle">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-secondary">Annual Total</span>
            <span className="text-2xl font-bold text-primary">{formatCurrency(pricingSummary.total)}</span>
          </div>
          <div className="flex justify-end">
            <span className="text-xs text-secondary">{formatCurrency(pricingSummary.monthlyTotal)}/month</span>
          </div>
        </div>
      </ReviewSection>

      {/* Status & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-6 border-t border-default">
        {/* Status Dropdown */}
        <div className="flex items-center gap-3">
          <label htmlFor="status-select" className="text-sm font-medium text-primary">
            Status
          </label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="status-select" className="w-48" data-testid="status-select">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submit for Approval</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Invoice Preview Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={onViewInvoice} data-testid="view-invoice-btn">
            <Eye className="mr-2 h-4 w-4" aria-hidden="true" />
            View Invoice
          </Button>
          <Button variant="outline" onClick={onPrintInvoice || (() => window.print())} data-testid="print-invoice-btn">
            <Printer className="mr-2 h-4 w-4" aria-hidden="true" />
            Print Invoice
          </Button>
        </div>
      </div>
    </div>
  )
}
