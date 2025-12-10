import * as React from 'react'
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import { Info, Building2, Users, CreditCard, FileCheck, Plus, Minus } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Card, CardContent } from '../ui/card'
import { Separator } from '../ui/separator'
import { Wizard, useWizard, type WizardStep } from './Wizard'
import { ALIAS } from '../../constants/designTokens'
import { WizardStepper, CompactStepper } from './WizardStepper'
import { WizardStep as WizardStepComponent, WizardStepHeader, WizardStepSection } from './WizardStep'
import { WizardNavigation } from './WizardNavigation'

// =============================================================================
// TYPES
// =============================================================================

export interface TenantFormData {
  // Step 1: Company Information
  companyName: string
  legalName?: string
  website?: string
  industry: string
  employeeCount: string

  // Step 2: Contact & Billing
  contactName: string
  contactEmail: string
  contactPhone?: string
  contactTitle?: string
  billingStreet: string
  billingCity: string
  billingState: string
  billingPostalCode: string
  billingCountry: string

  // Step 3: Pricing
  package: 'standard' | 'premium' | 'advanced' | 'industry'
  viewerLicenses: number
  contributorLicenses: number
  powerUserLicenses: number
  creatorLicenses: number

  // Step 4: Review & Pay
  paymentMethod: 'invoice' | 'credit_card'
  acceptTerms: boolean
}

export interface TenantProvisioningWizardProps {
  /** Initial form data for editing */
  initialData?: Partial<TenantFormData>
  /** Callback when wizard is completed */
  onSubmit: (data: TenantFormData) => void | Promise<void>
  /** Callback when wizard is cancelled */
  onCancel?: () => void
  /** Whether submission is in progress */
  isSubmitting?: boolean
  /** Commission percentage to display (for partner portal) */
  commissionPercentage?: number
  /** Skip validation on step navigation (for development/preview) */
  skipValidation?: boolean
  /** Additional className */
  className?: string
}

// =============================================================================
// WIZARD STEPS DEFINITION
// =============================================================================

const WIZARD_STEPS: WizardStep[] = [
  { id: 'company', label: 'Company Info' },
  { id: 'contact', label: 'Contact & Billing' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'review', label: 'Review & Pay' },
]

// =============================================================================
// CONSTANTS
// =============================================================================

const INDUSTRIES = [
  'Manufacturing',
  'Construction',
  'Healthcare',
  'Oil & Gas',
  'Mining',
  'Transportation',
  'Utilities',
  'Chemical',
  'Food & Beverage',
  'Retail',
  'Other',
]

const EMPLOYEE_COUNTS = [
  { value: '1-50', label: '1-50 employees', tier: 'Starter' },
  { value: '51-200', label: '51-200 employees', tier: 'Growth' },
  { value: '201-500', label: '201-500 employees', tier: 'Professional' },
  { value: '501-1000', label: '501-1,000 employees', tier: 'Enterprise' },
  { value: '1001+', label: '1,000+ employees', tier: 'Enterprise Plus' },
]

const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Netherlands',
  'Singapore',
  'Japan',
  'Other',
]

const PACKAGES = [
  {
    id: 'standard' as const,
    name: 'Standard',
    description: 'Essential EHS compliance tools',
    basePrice: 499,
    color: 'bg-success',
  },
  {
    id: 'premium' as const,
    name: 'Premium',
    description: 'Advanced reporting and analytics',
    basePrice: 999,
    color: 'bg-default',
  },
  {
    id: 'advanced' as const,
    name: 'Advanced',
    description: 'Full platform with integrations',
    basePrice: 1999,
    color: 'bg-secondary',
  },
  {
    id: 'industry' as const,
    name: 'Industry Package',
    description: 'Custom industry-specific solutions',
    basePrice: 2999,
    color: 'bg-error',
  },
]

const LICENSE_TYPES = [
  { id: 'viewerLicenses' as const, name: 'Viewer', price: 5, description: 'View-only access' },
  { id: 'contributorLicenses' as const, name: 'Contributor', price: 15, description: 'Submit data and reports' },
  { id: 'powerUserLicenses' as const, name: 'Power User', price: 35, description: 'Full editing access' },
  { id: 'creatorLicenses' as const, name: 'Creator', price: 75, description: 'Create and manage workflows' },
]

// =============================================================================
// FORM FIELD COMPONENT
// =============================================================================

interface FormFieldProps {
  name: string
  label: string
  required?: boolean
  helperText?: string
  children: React.ReactNode
  className?: string
}

function FormField({
  name,
  label,
  required,
  helperText,
  children,
  className,
}: FormFieldProps) {
  const { formState: { errors } } = useFormContext()
  const error = errors[name]

  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={name} className="text-primary font-medium font-sans">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </Label>
      {children}
      {helperText && !error && (
        <p className="text-xs font-sans text-emphasis">{helperText}</p>
      )}
      {error && (
        <p className="text-xs font-sans text-error">{error.message as string}</p>
      )}
    </div>
  )
}

// =============================================================================
// STEP 1: COMPANY INFORMATION
// =============================================================================

function CompanyInfoStep() {
  const { register, formState: { errors }, setValue, watch } = useFormContext<TenantFormData>()
  const employeeCount = watch('employeeCount')
  const selectedTier = EMPLOYEE_COUNTS.find(e => e.value === employeeCount)?.tier

  return (
    <div className="space-y-6">
      <WizardStepHeader
        title="Company Information"
        description="Tell us about your organization"
      />

      <Card className="border-default">
        <CardContent className="pt-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField name="companyName" label="Company Name" required>
              <Input
                id="companyName"
                placeholder="Enter company name"
                aria-invalid={!!errors.companyName}
                {...register('companyName', { required: 'Company name is required' })}
              />
            </FormField>

            <FormField name="legalName" label="Legal Name" helperText="If different from company name">
              <Input
                id="legalName"
                placeholder="Enter legal name"
                {...register('legalName')}
              />
            </FormField>
          </div>

          <FormField name="website" label="Website">
            <Input
              id="website"
              type="url"
              placeholder="https://www.example.com"
              {...register('website')}
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField name="industry" label="Industry" required>
              <Select
                value={watch('industry')}
                onValueChange={(value) => setValue('industry', value, { shouldValidate: true })}
              >
                <SelectTrigger className="w-full" aria-invalid={!!errors.industry}>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              name="employeeCount"
              label="Number of Employees"
              required
              helperText="This determines your platform tier pricing"
            >
              <Select
                value={watch('employeeCount')}
                onValueChange={(value) => setValue('employeeCount', value, { shouldValidate: true })}
              >
                <SelectTrigger className="w-full" aria-invalid={!!errors.employeeCount}>
                  <SelectValue placeholder="Select employee count" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYEE_COUNTS.map((count) => (
                    <SelectItem key={count.value} value={count.value}>
                      {count.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          {selectedTier && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-accentBg border border-accent">
              <Info className="w-4 h-4 text-accent shrink-0" />
              <span className="text-sm text-primary">
                Based on your employee count, you qualify for the <strong>{selectedTier}</strong> tier.
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// =============================================================================
// STEP 2: CONTACT & BILLING
// =============================================================================

function ContactBillingStep() {
  const { register, formState: { errors }, setValue, watch } = useFormContext<TenantFormData>()

  return (
    <div className="space-y-6">
      <WizardStepHeader
        title="Contact & Billing Information"
        description="Primary contact and billing address details"
      />

      {/* Primary Contact Section */}
      <Card className="border-default">
        <CardContent className="pt-6">
          <WizardStepSection title="Primary Contact">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField name="contactName" label="Full Name" required>
                <Input
                  id="contactName"
                  placeholder="Enter full name"
                  aria-invalid={!!errors.contactName}
                  {...register('contactName', { required: 'Contact name is required' })}
                />
              </FormField>

              <FormField name="contactEmail" label="Email" required>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="email@company.com"
                  aria-invalid={!!errors.contactEmail}
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
                  {...register('contactPhone')}
                />
              </FormField>

              <FormField name="contactTitle" label="Title">
                <Input
                  id="contactTitle"
                  placeholder="e.g., EHS Manager"
                  {...register('contactTitle')}
                />
              </FormField>
            </div>
          </WizardStepSection>
        </CardContent>
      </Card>

      {/* Billing Address Section */}
      <Card className="border-default">
        <CardContent className="pt-6">
          <WizardStepSection title="Billing Address">
            <div className="space-y-5">
              <FormField name="billingStreet" label="Street Address" required>
                <Input
                  id="billingStreet"
                  placeholder="123 Main Street"
                  aria-invalid={!!errors.billingStreet}
                  {...register('billingStreet', { required: 'Street address is required' })}
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <FormField name="billingCity" label="City" required>
                  <Input
                    id="billingCity"
                    placeholder="City"
                    aria-invalid={!!errors.billingCity}
                    {...register('billingCity', { required: 'City is required' })}
                  />
                </FormField>

                <FormField name="billingState" label="State/Province" required>
                  <Input
                    id="billingState"
                    placeholder="State"
                    aria-invalid={!!errors.billingState}
                    {...register('billingState', { required: 'State is required' })}
                  />
                </FormField>

                <FormField name="billingPostalCode" label="Postal Code" required>
                  <Input
                    id="billingPostalCode"
                    placeholder="12345"
                    aria-invalid={!!errors.billingPostalCode}
                    {...register('billingPostalCode', { required: 'Postal code is required' })}
                  />
                </FormField>
              </div>

              <FormField name="billingCountry" label="Country" required>
                <Select
                  value={watch('billingCountry')}
                  onValueChange={(value) => setValue('billingCountry', value, { shouldValidate: true })}
                >
                  <SelectTrigger className="w-full md:w-1/2" aria-invalid={!!errors.billingCountry}>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </WizardStepSection>
        </CardContent>
      </Card>
    </div>
  )
}

// =============================================================================
// STEP 3: PRICING
// =============================================================================

interface LicenseCounterProps {
  name: keyof TenantFormData
  label: string
  description: string
  price: number
}

function LicenseCounter({ name, label, description, price }: LicenseCounterProps) {
  const { watch, setValue } = useFormContext<TenantFormData>()
  const value = (watch(name) as number) || 0

  const increment = () => setValue(name, value + 1 as never, { shouldValidate: true })
  const decrement = () => setValue(name, Math.max(0, value - 1) as never, { shouldValidate: true })

  return (
    <div className="flex items-center justify-between py-3 border-b border-default last:border-b-0">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium font-sans text-primary">{label}</span>
          <span className="text-xs font-sans text-emphasis">${price}/user/mo</span>
        </div>
        <p className="text-xs font-sans text-emphasis mt-0.5">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={decrement}
          disabled={value === 0}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center font-medium font-sans text-primary">{value}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={increment}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

interface PackageCardProps {
  pkg: typeof PACKAGES[number]
  selected: boolean
  onSelect: () => void
}

function PackageCard({ pkg, selected, onSelect }: PackageCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'relative flex flex-col p-4 rounded-lg border-2 text-left transition-all w-full font-sans',
        selected
          ? 'border-accent bg-accentBg'
          : 'border-default bg-surface hover:border-accent'
      )}
    >
      {/* Colored left border indicator */}
      <div className={cn('absolute left-0 top-2 bottom-2 w-1 rounded-full', pkg.color)} />

      <div className="pl-3">
        <span className="font-semibold text-primary">{pkg.name}</span>
        <p className="text-xs text-emphasis mt-1">{pkg.description}</p>
        <p className="text-sm font-medium text-accent mt-2">
          ${pkg.basePrice}/mo base
        </p>
      </div>

      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent-strong flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  )
}

function PricingStep({ commissionPercentage }: { commissionPercentage?: number }) {
  const { watch, setValue } = useFormContext<TenantFormData>()
  const selectedPackage = watch('package')
  const employeeCount = watch('employeeCount')
  const selectedTier = EMPLOYEE_COUNTS.find(e => e.value === employeeCount)?.tier || 'Starter'

  // Calculate totals
  const packagePrice = PACKAGES.find(p => p.id === selectedPackage)?.basePrice || 0
  const licenseTotal = LICENSE_TYPES.reduce((total, license) => {
    const count = (watch(license.id) as number) || 0
    return total + count * license.price
  }, 0)
  const monthlyTotal = packagePrice + licenseTotal
  const annualTotal = monthlyTotal * 12
  const commission = commissionPercentage ? (monthlyTotal * commissionPercentage) / 100 : 0

  return (
    <div className="space-y-6">
      <WizardStepHeader
        title="Configure Pricing"
        description="Select your package and user licenses"
      />

      {/* Tier Info Banner */}
      <div className="flex items-center gap-3 p-4 rounded-lg bg-mutedBg border border-default">
        <Building2 className="w-5 h-5 text-primary shrink-0" />
        <div>
          <p className="text-sm font-sans text-primary">
            <span className="font-medium">{employeeCount}</span> employees
          </p>
          <p className="text-xs font-sans text-emphasis">
            Pricing tier: <span className="font-medium">{selectedTier}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Package Selection & Licenses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Package Selection */}
          <Card className="border-default">
            <CardContent className="pt-6">
              <WizardStepSection title="Select Package">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PACKAGES.map((pkg) => (
                    <PackageCard
                      key={pkg.id}
                      pkg={pkg}
                      selected={selectedPackage === pkg.id}
                      onSelect={() => setValue('package', pkg.id, { shouldValidate: true })}
                    />
                  ))}
                </div>
              </WizardStepSection>
            </CardContent>
          </Card>

          {/* User Licenses */}
          <Card className="border-default">
            <CardContent className="pt-6">
              <WizardStepSection
                title="User Licenses"
                description="Add the number of licenses needed for each user type"
              >
                <div className="divide-y divide-default">
                  {LICENSE_TYPES.map((license) => (
                    <LicenseCounter
                      key={license.id}
                      name={license.id}
                      label={license.name}
                      description={license.description}
                      price={license.price}
                    />
                  ))}
                </div>
              </WizardStepSection>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Investment Summary */}
        <div className="lg:col-span-1">
          <Card className="border-default sticky top-4">
            <CardContent className="pt-6">
              <h3 className="font-semibold font-sans text-primary mb-4">Investment Summary</h3>

              <div className="space-y-3 text-sm font-sans">
                <div className="flex justify-between">
                  <span className="text-emphasis">Package Base</span>
                  <span className="text-primary font-medium">
                    ${packagePrice.toLocaleString()}/mo
                  </span>
                </div>

                <Separator className="my-2" />

                {LICENSE_TYPES.map((license) => {
                  const count = (watch(license.id) as number) || 0
                  if (count === 0) return null
                  return (
                    <div key={license.id} className="flex justify-between">
                      <span className="text-emphasis">
                        {license.name} ({count})
                      </span>
                      <span className="text-primary">
                        ${(count * license.price).toLocaleString()}/mo
                      </span>
                    </div>
                  )
                })}

                <Separator className="my-2" />

                <div className="flex justify-between font-medium">
                  <span className="text-primary">Monthly Total</span>
                  <span className="text-accent text-base">
                    ${monthlyTotal.toLocaleString()}/mo
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-emphasis">Annual Total</span>
                  <span className="text-emphasis">
                    ${annualTotal.toLocaleString()}/yr
                  </span>
                </div>

                {commissionPercentage && commission > 0 && (
                  <>
                    <Separator className="my-2" />
                    <div className="flex justify-between p-2 rounded bg-successLight">
                      <span className="text-success font-medium">
                        Your Commission ({commissionPercentage}%)
                      </span>
                      <span className="text-success font-medium">
                        ${commission.toLocaleString()}/mo
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// STEP 4: REVIEW & PAY
// =============================================================================

function ReviewPayStep({ commissionPercentage }: { commissionPercentage?: number }) {
  const { watch, setValue, formState: { errors } } = useFormContext<TenantFormData>()
  const paymentMethod = watch('paymentMethod')
  const acceptTerms = watch('acceptTerms')

  // Get all form values
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
  const selectedPackage = watch('package')

  // Calculate totals
  const packageData = PACKAGES.find(p => p.id === selectedPackage)
  const packagePrice = packageData?.basePrice || 0
  const licenseTotal = LICENSE_TYPES.reduce((total, license) => {
    const count = (watch(license.id) as number) || 0
    return total + count * license.price
  }, 0)
  const monthlyTotal = packagePrice + licenseTotal
  const commission = commissionPercentage ? (monthlyTotal * commissionPercentage) / 100 : 0

  return (
    <div className="space-y-6">
      <WizardStepHeader
        title="Review & Pay"
        description="Review your order and complete your purchase"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Info Summary */}
          <Card className="border-default">
            <CardContent className="pt-6">
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
            </CardContent>
          </Card>

          {/* Contact & Billing Summary */}
          <Card className="border-default">
            <CardContent className="pt-6">
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
            </CardContent>
          </Card>

          {/* Package & Licenses Summary */}
          <Card className="border-default">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <FileCheck className="w-5 h-5 text-accent" />
                <h3 className="font-semibold font-sans text-primary">Package & Licenses</h3>
              </div>
              <div className="space-y-3 text-sm font-sans">
                <div className="flex justify-between">
                  <span className="text-emphasis">Package</span>
                  <span className="font-medium text-primary">
                    {packageData?.name} - ${packagePrice}/mo
                  </span>
                </div>
                {LICENSE_TYPES.map((license) => {
                  const count = (watch(license.id) as number) || 0
                  if (count === 0) return null
                  return (
                    <div key={license.id} className="flex justify-between">
                      <span className="text-emphasis">{license.name} Licenses</span>
                      <span className="font-medium text-primary">
                        {count} x ${license.price} = ${count * license.price}/mo
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <Card className="border-default">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-accent" />
                <h3 className="font-semibold font-sans text-primary">Payment Method</h3>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setValue('paymentMethod', 'invoice', { shouldValidate: true })}
                  className={cn(
                    'flex items-center gap-3 w-full p-4 rounded-lg border-2 text-left transition-all font-sans',
                    paymentMethod === 'invoice'
                      ? 'border-accent bg-accentBg'
                      : 'border-default hover:border-accent'
                  )}
                >
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                      paymentMethod === 'invoice' ? 'border-accent' : 'border-default'
                    )}
                  >
                    {paymentMethod === 'invoice' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-accent-strong" />
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-primary">Invoice</span>
                    <p className="text-xs text-emphasis">
                      Pay via bank transfer within 30 days
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setValue('paymentMethod', 'credit_card', { shouldValidate: true })}
                  className={cn(
                    'flex items-center gap-3 w-full p-4 rounded-lg border-2 text-left transition-all font-sans',
                    paymentMethod === 'credit_card'
                      ? 'border-accent bg-accentBg'
                      : 'border-default hover:border-accent'
                  )}
                >
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                      paymentMethod === 'credit_card' ? 'border-accent' : 'border-default'
                    )}
                  >
                    {paymentMethod === 'credit_card' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-accent-strong" />
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-primary">Credit Card</span>
                    <p className="text-xs text-emphasis">
                      Pay securely with credit or debit card
                    </p>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Terms & Conditions */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-mutedBg border border-default">
            <Checkbox
              id="acceptTerms"
              checked={acceptTerms}
              onCheckedChange={(checked) =>
                setValue('acceptTerms', checked as boolean, { shouldValidate: true })
              }
              aria-invalid={!!errors.acceptTerms}
              className="mt-0.5 shrink-0"
            />
            <Label htmlFor="acceptTerms" className="text-sm font-sans text-primary leading-relaxed cursor-pointer">
              I agree to the <a href="#" className="text-accent hover:underline font-medium whitespace-nowrap">Terms of Service</a> and <a href="#" className="text-accent hover:underline font-medium whitespace-nowrap">Privacy Policy</a>. I understand that my subscription will begin immediately upon payment.
            </Label>
          </div>
          {errors.acceptTerms && (
            <p className="text-xs font-sans text-error -mt-4">
              {errors.acceptTerms.message as string}
            </p>
          )}
        </div>

        {/* Pricing Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-default sticky top-4">
            <CardContent className="pt-6">
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
                    <div className="p-3 rounded-lg bg-successLight">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// MAIN WIZARD COMPONENT
// =============================================================================

export function TenantProvisioningWizard({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  commissionPercentage,
  skipValidation = false,
  className,
}: TenantProvisioningWizardProps) {
  const methods = useForm<TenantFormData>({
    defaultValues: {
      companyName: '',
      legalName: '',
      website: '',
      industry: '',
      employeeCount: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      contactTitle: '',
      billingStreet: '',
      billingCity: '',
      billingState: '',
      billingPostalCode: '',
      billingCountry: '',
      package: 'standard',
      viewerLicenses: 0,
      contributorLicenses: 0,
      powerUserLicenses: 0,
      creatorLicenses: 0,
      paymentMethod: 'invoice',
      acceptTerms: false,
      ...initialData,
    },
    mode: 'onChange',
  })

  const { trigger, handleSubmit } = methods

  // Validation rules per step
  const validateStep = async (step: number): Promise<boolean> => {
    if (skipValidation) return true

    switch (step) {
      case 0:
        return trigger(['companyName', 'industry', 'employeeCount'])
      case 1:
        return trigger([
          'contactName',
          'contactEmail',
          'billingStreet',
          'billingCity',
          'billingState',
          'billingPostalCode',
          'billingCountry',
        ])
      case 2:
        return trigger(['package'])
      case 3:
        return trigger(['paymentMethod', 'acceptTerms'])
      default:
        return true
    }
  }

  const handleFormSubmit = handleSubmit(async (data) => {
    // Validate terms acceptance (skip if skipValidation is enabled)
    if (!skipValidation && !data.acceptTerms) {
      methods.setError('acceptTerms', {
        type: 'manual',
        message: 'You must accept the terms to continue',
      })
      return
    }

    await onSubmit(data)
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleFormSubmit} className={cn('flex flex-col h-full w-full', className)}>
        <div className="flex flex-col h-full w-full">
          <Wizard
            steps={WIZARD_STEPS}
            allowStepNavigation={true}
            className="flex flex-col h-full bg-surface"
          >
            {/* Header with Stepper - white background with gradient bottom border */}
            <div className="bg-surface shrink-0 relative">
              {/* Desktop Stepper */}
              <div className="hidden md:block">
                <WizardStepper clickable={true} className="max-w-3xl mx-auto" />
              </div>
              {/* Mobile Compact Stepper */}
              <div className="md:hidden">
                <CompactStepper />
              </div>
              {/* Gradient border */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, ${ALIAS.background.surface} 0%, ${ALIAS.border.default} 50%, ${ALIAS.background.surface} 100%)`,
                }}
              />
            </div>

            {/* Step Content - scrollable area */}
            <div className="flex-1 overflow-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
              <div className="w-full">
                <WizardStepComponent step={0}>
                  <CompanyInfoStep />
                </WizardStepComponent>

                <WizardStepComponent step={1}>
                  <ContactBillingStep />
                </WizardStepComponent>

                <WizardStepComponent step={2}>
                  <PricingStep commissionPercentage={commissionPercentage} />
                </WizardStepComponent>

                <WizardStepComponent step={3}>
                  <ReviewPayStep commissionPercentage={commissionPercentage} />
                </WizardStepComponent>

                {/* Navigation buttons - directly under form content */}
                <div className="mt-8 pt-6 relative">
                  {/* Gradient border */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                      background: `linear-gradient(90deg, ${ALIAS.background.surface} 0%, ${ALIAS.border.default} 50%, ${ALIAS.background.surface} 100%)`,
                    }}
                  />
                  <WizardNavigationWithValidation
                    validateStep={validateStep}
                    onCancel={onCancel}
                    isSubmitting={isSubmitting}
                  />
                </div>
              </div>
            </div>
          </Wizard>
        </div>
      </form>
    </FormProvider>
  )
}

// =============================================================================
// NAVIGATION WITH VALIDATION
// =============================================================================

interface WizardNavigationWithValidationProps {
  validateStep: (step: number) => Promise<boolean>
  onCancel?: () => void
  isSubmitting: boolean
}

function WizardNavigationWithValidation({
  validateStep,
  onCancel,
  isSubmitting,
}: WizardNavigationWithValidationProps) {
  const { currentStep } = useWizard()

  const handleNext = async (): Promise<boolean> => {
    const isValid = await validateStep(currentStep)
    return isValid
  }

  return (
    <WizardNavigation
      onCancel={onCancel}
      onNext={handleNext}
      submitLabel="Complete Purchase"
      isSubmitting={isSubmitting}
      disabled={isSubmitting}
      className="border-t-0 pt-0"
    />
  )
}
