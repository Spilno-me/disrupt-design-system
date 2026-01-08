import * as React from 'react'
import { Building2, Mail, Phone, MapPin } from 'lucide-react'
import { AppCard, AppCardContent, AppCardHeader, AppCardTitle, AppCardDescription } from '../../../ui/app-card'
import { Input } from '../../../ui/input'
import { Label } from '../../../ui/label'
import type { Invoice } from '../types'

// =============================================================================
// TYPES
// =============================================================================

export interface InvoiceBillToCardProps {
  /** Company data from invoice */
  company: Invoice['company']
  /** Whether in edit mode */
  isEditing?: boolean
  /** Form register function (for edit mode) */
  register?: any
  /** Form errors (for edit mode) */
  errors?: any
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * InvoiceBillToCard - Displays/edits company billing information
 *
 * @example
 * ```tsx
 * <InvoiceBillToCard
 *   company={invoice.company}
 *   isEditing={mode === 'edit'}
 *   register={register}
 *   errors={errors}
 * />
 * ```
 */
export function InvoiceBillToCard({
  company,
  isEditing = false,
  register,
  errors,
}: InvoiceBillToCardProps) {
  if (isEditing) {
    return (
      <AppCard shadow="sm" role="group" aria-labelledby="bill-to-heading">
        <AppCardHeader>
          <AppCardTitle id="bill-to-heading" className="text-lg">Bill To</AppCardTitle>
          <AppCardDescription>Customer billing details</AppCardDescription>
        </AppCardHeader>
        <AppCardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-sm text-primary">
              Company Name <span className="text-error">*</span>
            </Label>
            <Input
              id="companyName"
              placeholder="Company Name"
              {...register?.('company.name', { required: 'Company name is required' })}
              className={errors?.company?.name ? 'border-error' : ''}
            />
            {errors?.company?.name && (
              <p className="text-xs text-error">{errors.company.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyEmail" className="text-sm text-primary">
              Contact Email <span className="text-error">*</span>
            </Label>
            <Input
              id="companyEmail"
              type="email"
              placeholder="contact@company.com"
              {...register?.('company.email', {
                required: 'Contact email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className={errors?.company?.email ? 'border-error' : ''}
            />
            {errors?.company?.email && (
              <p className="text-xs text-error">{errors.company.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyPhone" className="text-sm text-primary">
              Phone
            </Label>
            <Input
              id="companyPhone"
              placeholder="+1 (555) 123-4567"
              {...register?.('company.phone')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyAddress" className="text-sm text-primary">
              Address
            </Label>
            <Input
              id="companyAddress"
              placeholder="123 Main Street"
              {...register?.('company.address')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyCity" className="text-sm text-primary">
                City
              </Label>
              <Input
                id="companyCity"
                placeholder="City"
                {...register?.('company.city')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyState" className="text-sm text-primary">
                State
              </Label>
              <Input
                id="companyState"
                placeholder="State"
                {...register?.('company.state')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyZip" className="text-sm text-primary">
                ZIP Code
              </Label>
              <Input
                id="companyZip"
                placeholder="12345"
                {...register?.('company.zip')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyCountry" className="text-sm text-primary">
                Country
              </Label>
              <Input
                id="companyCountry"
                placeholder="Country"
                {...register?.('company.country')}
              />
            </div>
          </div>
        </AppCardContent>
      </AppCard>
    )
  }

  // View mode
  return (
    <AppCard shadow="sm" role="group" aria-labelledby="bill-to-heading">
      <AppCardHeader>
        <AppCardTitle id="bill-to-heading" className="text-lg">Bill To</AppCardTitle>
        <AppCardDescription>Customer billing details</AppCardDescription>
      </AppCardHeader>
      <AppCardContent>
        <div className="flex flex-col gap-2 p-4 rounded-lg bg-muted-bg border border-subtle">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted flex-shrink-0" />
            <span className="font-semibold text-primary">{company.name}</span>
          </div>
          {company.address && (
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-muted flex-shrink-0 mt-0.5" />
              <div className="text-sm text-primary">
                <div>{company.address}</div>
                {(company.city || company.state || company.zip) && (
                  <div>
                    {company.city}
                    {company.state && `, ${company.state}`}
                    {company.zip && ` ${company.zip}`}
                  </div>
                )}
                {company.country && <div>{company.country}</div>}
              </div>
            </div>
          )}
          {company.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted flex-shrink-0" />
              <span className="text-sm text-primary">{company.email}</span>
            </div>
          )}
          {company.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted flex-shrink-0" />
              <span className="text-sm text-primary">{company.phone}</span>
            </div>
          )}
        </div>
      </AppCardContent>
    </AppCard>
  )
}

export default InvoiceBillToCard
