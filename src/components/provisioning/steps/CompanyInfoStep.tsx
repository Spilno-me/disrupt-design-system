// =============================================================================
// STEP 1: COMPANY INFORMATION
// =============================================================================

import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import { Info } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Input } from '../../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { AppCard, AppCardContent } from '../../ui/app-card'
import { ToggleGroup, ToggleGroupItem } from '../../ui/toggle-group'
import { WizardStepHeader } from '../WizardStep'
import { FormField } from '../components/FormField'
import type { TenantFormData } from '../tenant-provisioning.types'
import { INDUSTRIES, EMPLOYEE_COUNTS } from '../tenant-provisioning.constants'

/**
 * CompanyInfoStep - First step collecting company details
 *
 * @component MOLECULE
 * @testId Auto-generated: `company-info-{element}`
 *
 * Test IDs:
 * - `company-info-step` - Root container
 * - `company-info-company-name` - Company name input
 * - `company-info-legal-name` - Legal name input
 * - `company-info-industry-select` - Industry dropdown trigger
 * - `company-info-industry-{slug}` - Industry dropdown options (e.g., `company-info-industry-manufacturing`)
 * - `company-info-website` - Website input
 * - `company-info-employees-{value}` - Employee count chips
 * - `company-info-tier-badge` - Tier qualification notice
 */
export function CompanyInfoStep() {
  const { register, formState: { errors }, setValue, watch } = useFormContext<TenantFormData>()
  const employeeCount = watch('employeeCount')
  const selectedTier = EMPLOYEE_COUNTS.find(e => e.value === employeeCount)?.tier

  // Register validation rules for controlled fields (Select, ToggleGroup)
  React.useEffect(() => {
    register('industry', { required: 'Industry is required' })
    register('employeeCount', { required: 'Employee count is required' })
  }, [register])

  return (
    <div className="space-y-6" data-testid="company-info-step">
      <WizardStepHeader
        title="Company Information"
        description="Tell us about your organization"
      />

      <AppCard className="border-subtle shadow-sm">
        <AppCardContent className="pt-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField name="companyName" label="Company Name" required>
              <Input
                id="companyName"
                placeholder="Enter company name"
                aria-invalid={!!errors.companyName}
                data-testid="company-info-company-name"
                {...register('companyName', { required: 'Company name is required' })}
              />
            </FormField>

            <FormField name="legalName" label="Legal Name" helperText="If different from company name">
              <Input
                id="legalName"
                placeholder="Enter legal name"
                data-testid="company-info-legal-name"
                {...register('legalName')}
              />
            </FormField>
          </div>

          {/* Row 2: Industry + Website (side by side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField name="industry" label="Industry" required>
              <Select
                value={watch('industry')}
                onValueChange={(value) => setValue('industry', value, { shouldValidate: true })}
              >
                <SelectTrigger className="w-full" aria-invalid={!!errors.industry} data-testid="company-info-industry-select">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((industry) => (
                    <SelectItem
                      key={industry}
                      value={industry}
                      data-testid={`company-info-industry-${industry.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, 'and')}`}
                    >
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField name="website" label="Website">
              <div className="flex">
                {/* Visual prefix - non-editable */}
                <span className={cn(
                  "inline-flex items-center px-3 rounded-l-sm border border-r-0 border-default",
                  "bg-muted text-tertiary text-sm select-none h-12 md:h-10"
                )}>
                  https://
                </span>
                {/* User input - domain only */}
                <Input
                  id="website"
                  type="text"
                  placeholder="example.com"
                  className="rounded-l-none"
                  data-testid="company-info-website"
                  {...register('website', {
                    setValueAs: (v: string) => v ? `https://${v.replace(/^https?:\/\//, '')}` : '',
                  })}
                  onBlur={(e) => {
                    // Auto-normalize: remove protocol if user typed it
                    const cleaned = e.target.value.replace(/^https?:\/\//, '')
                    e.target.value = cleaned
                  }}
                />
              </div>
            </FormField>
          </div>

          {/* Row 3: Employee Count Chips (full width) */}
          <FormField
            name="employeeCount"
            label="Number of Employees"
            required
            helperText="This determines your platform tier pricing"
          >
            <ToggleGroup
              type="single"
              value={employeeCount}
              onValueChange={(value) => {
                if (value) setValue('employeeCount', value, { shouldValidate: true })
              }}
              className="flex flex-wrap gap-2 justify-start bg-transparent p-0"
            >
              {EMPLOYEE_COUNTS.map((count) => (
                <ToggleGroupItem
                  key={count.value}
                  value={count.value}
                  data-testid={`company-info-employees-${count.value}`}
                  className={cn(
                    'h-auto px-4 py-2 rounded-lg border text-sm font-medium',
                    'data-[state=on]:bg-accent-bg data-[state=on]:border-accent data-[state=on]:text-accent',
                    'data-[state=off]:bg-surface data-[state=off]:border-default data-[state=off]:text-secondary',
                    'hover:border-subtle transition-colors',
                    errors.employeeCount && 'border-error'
                  )}
                >
                  {count.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FormField>

          {selectedTier && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-accent-bg border border-accent" data-testid="company-info-tier-badge">
              <Info className="w-4 h-4 text-accent shrink-0" />
              <span className="text-sm text-primary">
                Based on your employee count, you qualify for the <strong>{selectedTier}</strong> tier.
              </span>
            </div>
          )}
        </AppCardContent>
      </AppCard>
    </div>
  )
}
