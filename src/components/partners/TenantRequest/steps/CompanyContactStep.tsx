/**
 * CompanyContactStep - Step 1 of TenantRequestWizard
 *
 * Collects company information, primary contact details, and optional billing address.
 * Validation follows spec requirements (NO DIGITS for names, DIGITS ONLY for postal code).
 *
 * @module partners/TenantRequest/steps/CompanyContactStep
 */

import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Building2, User, CreditCard, ChevronDown, ChevronRight } from 'lucide-react'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../../../ui/form'
import { Input } from '../../../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../../ui/collapsible'
import { cn } from '../../../../lib/utils'
import type { TenantRequestFormData } from '../tenant-request.types'
import { INDUSTRIES } from '../../PricingCalculator/constants'

const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'Other',
] as const

export interface CompanyContactStepProps {
  disabled?: boolean
}

export function CompanyContactStep({ disabled }: CompanyContactStepProps) {
  const { control } = useFormContext<TenantRequestFormData>()
  const [billingOpen, setBillingOpen] = useState(false)

  return (
    <div className="space-y-8">
      {/* Company Information */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-primary">Company Information</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={control}
            name="companyName"
            rules={{
              required: 'Company name is required',
              minLength: { value: 2, message: 'Min 2 characters' },
              maxLength: { value: 150, message: 'Max 150 characters' },
              pattern: { value: /^[A-Za-z0-9\s&.,\-'()/]+$/, message: 'Invalid characters' },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name <span className="text-error">*</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Acme Corporation" disabled={disabled} data-testid="company-name-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="legalName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Legal Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Acme Corporation Inc." disabled={disabled} data-testid="legal-name-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="website"
            rules={{ pattern: { value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/, message: 'Invalid URL' } }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://example.com" disabled={disabled} data-testid="website-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="industry"
            rules={{ required: 'Industry is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry <span className="text-error">*</span></FormLabel>
                <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                  <FormControl>
                    <SelectTrigger className="w-full" data-testid="industry-select" aria-label="Industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {INDUSTRIES.map((ind) => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      {/* Primary Contact */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-primary">Primary Contact</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={control}
            name="contactName"
            rules={{
              required: 'Contact name is required',
              validate: { twoWords: (v) => (v?.trim().split(/\s+/).length ?? 0) >= 2 || 'Enter first and last name' },
              pattern: { value: /^[A-Za-z\s\-']+$/, message: 'Name cannot contain numbers' },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name <span className="text-error">*</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="John Smith" disabled={disabled} data-testid="contact-name-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="contactTitle"
            rules={{ pattern: { value: /^[A-Za-z\s\-']*$/, message: 'Title cannot contain numbers' } }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Director of Operations" disabled={disabled} data-testid="contact-title-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="contactEmail"
            rules={{
              required: 'Email is required',
              maxLength: { value: 254, message: 'Max 254 characters' },
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email <span className="text-error">*</span></FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="john@example.com" disabled={disabled} data-testid="contact-email-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="contactPhone"
            rules={{
              required: 'Phone is required',
              validate: { minDigits: (v) => (v?.replace(/\D/g, '').length ?? 0) >= 7 || 'Enter at least 7 digits' },
              pattern: { value: /^[\d\s\-+()]+$/, message: 'Invalid phone' },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone <span className="text-error">*</span></FormLabel>
                <FormControl>
                  <Input {...field} type="tel" placeholder="+1 (555) 123-4567" disabled={disabled} data-testid="contact-phone-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      {/* Billing Information (collapsible, all optional) */}
      <Collapsible open={billingOpen} onOpenChange={setBillingOpen}>
        <CollapsibleTrigger className={cn('flex items-center gap-2 w-full p-3 rounded-lg hover:bg-accent/10 cursor-pointer transition-colors text-left')} data-testid="billing-section-toggle">
          {billingOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <CreditCard className="h-5 w-5 text-primary" aria-hidden="true" />
          <span className="text-lg font-semibold text-primary">Billing Information</span>
          <span className="text-sm text-secondary ml-2">(Optional)</span>
        </CollapsibleTrigger>

        <CollapsibleContent className="pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField control={control} name="billingStreet" render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Street Address</FormLabel>
                <FormControl><Input {...field} placeholder="123 Main Street" disabled={disabled} data-testid="billing-street-input" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={control} name="billingCity" rules={{ pattern: { value: /^[A-Za-z\s\-']*$/, message: 'City cannot contain numbers' } }} render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl><Input {...field} placeholder="San Francisco" disabled={disabled} data-testid="billing-city-input" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={control} name="billingState" rules={{ pattern: { value: /^[A-Za-z\s\-']*$/, message: 'State cannot contain numbers' } }} render={({ field }) => (
              <FormItem>
                <FormLabel>State / Province</FormLabel>
                <FormControl><Input {...field} placeholder="California" disabled={disabled} data-testid="billing-state-input" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={control} name="billingPostalCode" rules={{ pattern: { value: /^[\d-]*$/, message: 'Postal code: numbers only' } }} render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl><Input {...field} placeholder="94102" disabled={disabled} data-testid="billing-postal-input" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={control} name="billingCountry" render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                  <FormControl>
                    <SelectTrigger className="w-full" data-testid="billing-country-select" aria-label="Country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COUNTRIES.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
