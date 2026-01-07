// =============================================================================
// STEP 4: REVIEW & PAY
// =============================================================================

import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import { Building2, Users, FileCheck } from 'lucide-react'
import { AppCard, AppCardContent } from '../../ui/app-card'
import { Checkbox } from '../../ui/checkbox'
import { Label } from '../../ui/label'
import { Separator } from '../../ui/separator'
import { WizardStepHeader } from '../WizardStep'
import { PaymentMethodSelector } from '../components/PaymentMethodSelector'
import { usePricingData } from '../hooks'
import type { TenantFormData } from '../tenant-provisioning.types'
import { DEFAULT_PRICING_CONFIG } from '../../partners/PricingCalculator/constants'
import { MONTHS_PER_YEAR } from '../tenant-provisioning.constants'
import type { ProcessTier } from '../../partners/types/pricing.types'

// =============================================================================
// TYPES
// =============================================================================

export interface ReviewPayStepProps {
  commissionPercentage?: number
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ReviewPayStep - Final step for order review and payment
 *
 * @component MOLECULE
 * @testId Auto-generated: `review-pay-{element}`
 *
 * Test IDs:
 * - `review-pay-step` - Root container
 * - `review-pay-company-summary` - Company info summary card
 * - `review-pay-contact-summary` - Contact & billing summary card
 * - `review-pay-package-summary` - Package & licenses summary card
 * - `review-pay-payment-method` - Payment method selection
 * - `review-pay-order-total` - Order total sidebar
 * - `review-pay-commission` - Commission preview (if shown)
 * - `review-pay-terms` - Terms acceptance container
 * - `review-pay-terms-checkbox` - Terms acceptance checkbox
 */
export function ReviewPayStep({ commissionPercentage }: ReviewPayStepProps) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<TenantFormData>()
  const paymentMethod = watch('paymentMethod')
  const acceptTerms = watch('acceptTerms')

  // Use shared pricing data hook
  const { licenses, pricingResult, selectedPackage } = usePricingData()

  // Register validation rules for controlled fields
  React.useEffect(() => {
    register('paymentMethod', { required: 'Please select a payment method' })
    register('acceptTerms', {
      required: 'You must accept the terms to continue',
      validate: (value) => value === true || 'You must accept the terms to continue'
    })
  }, [register])

  // Get form values for display
  const companyName = watch('companyName')
  const industry = watch('industry')
  const employeeCount = watch('employeeCount')
  const contactName = watch('contactName')
  const contactEmail = watch('contactEmail')
  const billingStreet = watch('billingStreet')
  const billingCity = watch('billingCity')
  const billingState = watch('billingState')
  const billingPostalCode = watch('billingPostalCode')
  const billingCountry = watch('billingCountry')

  // Get package name and pricing
  const packageName = selectedPackage ? DEFAULT_PRICING_CONFIG.processTiers[selectedPackage as ProcessTier]?.name : ''
  const packagePrice = selectedPackage ? DEFAULT_PRICING_CONFIG.processTiers[selectedPackage as ProcessTier]?.annualPrice / MONTHS_PER_YEAR : 0
  const monthlyTotal = (pricingResult?.dealTotal ?? 0) / MONTHS_PER_YEAR
  const commission = commissionPercentage ? (monthlyTotal * commissionPercentage) / 100 : 0

  return (
    <div className="space-y-6" data-testid="review-pay-step">
      <WizardStepHeader
        title="Review & Pay"
        description="Review your order and complete your purchase"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Info Summary */}
          <AppCard className="border-subtle shadow-sm" data-testid="review-pay-company-summary">
            <AppCardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-accent" />
                <h3 className="font-semibold font-sans text-primary">Company Information</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm font-sans">
                <div>
                  <span className="text-emphasis">Company</span>
                  <p className="font-medium text-primary">{companyName}</p>
                </div>
                <div>
                  <span className="text-emphasis">Industry</span>
                  <p className="font-medium text-primary">{industry}</p>
                </div>
                <div>
                  <span className="text-emphasis">Employees</span>
                  <p className="font-medium text-primary">{employeeCount}</p>
                </div>
              </div>
            </AppCardContent>
          </AppCard>

          {/* Contact & Billing Summary */}
          <AppCard className="border-subtle shadow-sm" data-testid="review-pay-contact-summary">
            <AppCardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-accent" />
                <h3 className="font-semibold font-sans text-primary">Contact & Billing</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-sans">
                <div>
                  <span className="text-emphasis">Primary Contact</span>
                  <p className="font-medium text-primary">{contactName}</p>
                  <p className="text-emphasis">{contactEmail}</p>
                </div>
                <div>
                  <span className="text-emphasis">Billing Address</span>
                  <p className="font-medium text-primary">{billingStreet}</p>
                  <p className="text-emphasis">
                    {billingCity}, {billingState} {billingPostalCode}
                  </p>
                  <p className="text-emphasis">{billingCountry}</p>
                </div>
              </div>
            </AppCardContent>
          </AppCard>

          {/* Package & Licenses Summary */}
          <AppCard className="border-subtle shadow-sm" data-testid="review-pay-package-summary">
            <AppCardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <FileCheck className="w-5 h-5 text-accent" />
                <h3 className="font-semibold font-sans text-primary">Package & Licenses</h3>
              </div>
              <div className="space-y-3 text-sm font-sans">
                <div className="flex justify-between">
                  <span className="text-emphasis">Package</span>
                  <span className="font-medium text-primary">
                    {packageName} - ${Math.round(packagePrice).toLocaleString()}/mo
                  </span>
                </div>
                {licenses.map((license) => {
                  const config = DEFAULT_PRICING_CONFIG.userLicenses[license.tier]
                  return (
                    <div key={license.tier} className="flex justify-between">
                      <span className="text-emphasis">{config.name} Licenses</span>
                      <span className="font-medium text-primary">
                        {license.quantity} x ${config.monthlyPrice} = ${(license.quantity * config.monthlyPrice).toLocaleString()}/mo
                      </span>
                    </div>
                  )
                })}
              </div>
            </AppCardContent>
          </AppCard>

          {/* Payment Method Selection */}
          <div data-testid="review-pay-payment-method">
            <PaymentMethodSelector
              value={paymentMethod}
              onChange={(method) => setValue('paymentMethod', method, { shouldValidate: true })}
            />
          </div>
        </div>

        {/* Pricing Summary Sidebar */}
        <div className="lg:col-span-1">
          <AppCard className="border-default sticky top-4" data-testid="review-pay-order-total">
            <AppCardContent className="pt-6">
              <h3 className="font-semibold font-sans text-primary mb-4">Order Total</h3>

              <div className="space-y-3 text-sm font-sans">
                <div className="flex justify-between">
                  <span className="text-emphasis">Subtotal</span>
                  <span className="text-primary">
                    ${monthlyTotal.toLocaleString()}/mo
                  </span>
                </div>

                <Separator className="my-2" />

                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-primary">Total Due</span>
                  <span className="text-accent">
                    ${monthlyTotal.toLocaleString()}/mo
                  </span>
                </div>

                {commissionPercentage && commission > 0 && (
                  <>
                    <Separator className="my-2" />
                    <div className="p-3 rounded-lg bg-success-light" data-testid="review-pay-commission">
                      <div className="flex justify-between text-success">
                        <span className="font-medium">
                          Your Commission ({commissionPercentage}%)
                        </span>
                        <span className="font-semibold">
                          ${commission.toLocaleString()}/mo
                        </span>
                      </div>
                      <p className="text-xs text-success mt-1">
                        Paid monthly with customer billing
                      </p>
                    </div>
                  </>
                )}
              </div>
            </AppCardContent>
          </AppCard>
        </div>

        {/* Terms & Conditions - Full width */}
        <div className="lg:col-span-3 space-y-2" data-testid="review-pay-terms">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted-bg border border-default">
            <Checkbox
              id="acceptTerms"
              checked={acceptTerms}
              onCheckedChange={(checked) => {
                setValue('acceptTerms', checked as boolean)
                // Clear error when user checks the box (but don't validate when unchecking)
                if (checked && errors.acceptTerms) {
                  setValue('acceptTerms', true, { shouldValidate: true })
                }
              }}
              aria-invalid={!!errors.acceptTerms}
              className="mt-0.5 shrink-0"
              data-testid="review-pay-terms-checkbox"
            />
            <Label htmlFor="acceptTerms" className="text-sm font-sans text-primary leading-relaxed cursor-pointer">
              I agree to the <a href="#" className="text-accent hover:underline font-medium whitespace-nowrap">Terms of Service</a> and <a href="#" className="text-accent hover:underline font-medium whitespace-nowrap">Privacy Policy</a>. I understand that my subscription will begin immediately upon payment.
            </Label>
          </div>
          {errors.acceptTerms && (
            <p className="text-xs font-sans text-error">
              {errors.acceptTerms.message as string}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
