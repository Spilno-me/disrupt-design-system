// =============================================================================
// STEP 2: CONTACT & BILLING
// =============================================================================

import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '../../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { AppCard, AppCardContent } from '../../ui/app-card'
import { WizardStepHeader, WizardStepSection } from '../WizardStep'
import { FormField } from '../components/FormField'
import type { TenantFormData } from '../tenant-provisioning.types'
import { COUNTRIES } from '../tenant-provisioning.constants'

/**
 * ContactBillingStep - Second step collecting contact and billing details
 *
 * @component MOLECULE
 * @testId Auto-generated: `contact-billing-{element}`
 *
 * Test IDs:
 * - `contact-billing-step` - Root container
 * - `contact-billing-contact-section` - Primary contact card
 * - `contact-billing-name` - Contact name input
 * - `contact-billing-email` - Contact email input
 * - `contact-billing-phone` - Contact phone input
 * - `contact-billing-title` - Contact title input
 * - `contact-billing-address-section` - Billing address card
 * - `contact-billing-street` - Street address input
 * - `contact-billing-city` - City input
 * - `contact-billing-state` - State input
 * - `contact-billing-postal-code` - Postal code input
 * - `contact-billing-country-select` - Country dropdown trigger
 * - `contact-billing-country-{slug}` - Country dropdown options (e.g., `contact-billing-country-united-states`)
 */
export function ContactBillingStep() {
  const { register, formState: { errors }, setValue, watch } = useFormContext<TenantFormData>()

  // Register validation rules for controlled fields (Select)
  React.useEffect(() => {
    register('billingCountry', { required: 'Country is required' })
  }, [register])

  return (
    <div className="space-y-6" data-testid="contact-billing-step">
      <WizardStepHeader
        title="Contact & Billing Information"
        description="Primary contact and billing address details"
      />

      {/* Primary Contact Section */}
      <AppCard className="border-subtle shadow-sm" data-testid="contact-billing-contact-section">
        <AppCardContent className="pt-6">
          <WizardStepSection title="Primary Contact">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField name="contactName" label="Full Name" required>
                <Input
                  id="contactName"
                  placeholder="Enter full name"
                  aria-invalid={!!errors.contactName}
                  data-testid="contact-billing-name"
                  {...register('contactName', { required: 'Contact name is required' })}
                />
              </FormField>

              <FormField name="contactEmail" label="Email" required>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="email@company.com"
                  aria-invalid={!!errors.contactEmail}
                  data-testid="contact-billing-email"
                  {...register('contactEmail', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
              </FormField>

              <FormField name="contactPhone" label="Phone">
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  data-testid="contact-billing-phone"
                  {...register('contactPhone')}
                />
              </FormField>

              <FormField name="contactTitle" label="Title">
                <Input
                  id="contactTitle"
                  placeholder="e.g., EHS Manager"
                  data-testid="contact-billing-title"
                  {...register('contactTitle')}
                />
              </FormField>
            </div>
          </WizardStepSection>
        </AppCardContent>
      </AppCard>

      {/* Billing Address Section */}
      <AppCard className="border-subtle shadow-sm" data-testid="contact-billing-address-section">
        <AppCardContent className="pt-6">
          <WizardStepSection title="Billing Address">
            <div className="space-y-5">
              <FormField name="billingStreet" label="Street Address" required>
                <Input
                  id="billingStreet"
                  placeholder="123 Main Street"
                  aria-invalid={!!errors.billingStreet}
                  data-testid="contact-billing-street"
                  {...register('billingStreet', { required: 'Street address is required' })}
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <FormField name="billingCity" label="City" required>
                  <Input
                    id="billingCity"
                    placeholder="City"
                    aria-invalid={!!errors.billingCity}
                    data-testid="contact-billing-city"
                    {...register('billingCity', { required: 'City is required' })}
                  />
                </FormField>

                <FormField name="billingState" label="State/Province" required>
                  <Input
                    id="billingState"
                    placeholder="State"
                    aria-invalid={!!errors.billingState}
                    data-testid="contact-billing-state"
                    {...register('billingState', { required: 'State is required' })}
                  />
                </FormField>

                <FormField name="billingPostalCode" label="Postal Code" required>
                  <Input
                    id="billingPostalCode"
                    placeholder="12345"
                    aria-invalid={!!errors.billingPostalCode}
                    data-testid="contact-billing-postal-code"
                    {...register('billingPostalCode', { required: 'Postal code is required' })}
                  />
                </FormField>
              </div>

              <FormField name="billingCountry" label="Country" required>
                <Select
                  value={watch('billingCountry')}
                  onValueChange={(value) => setValue('billingCountry', value, { shouldValidate: true })}
                >
                  <SelectTrigger className="w-full md:w-1/2" aria-invalid={!!errors.billingCountry} data-testid="contact-billing-country-select">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem
                        key={country}
                        value={country}
                        data-testid={`contact-billing-country-${country.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </WizardStepSection>
        </AppCardContent>
      </AppCard>
    </div>
  )
}
