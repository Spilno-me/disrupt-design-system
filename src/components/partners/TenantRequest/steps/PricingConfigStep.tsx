/**
 * PricingConfigStep - Step 2 of TenantRequestWizard
 *
 * Configures pricing: Organization Size, Process Package, and User Licenses.
 * Displays real-time pricing summary and commission preview.
 *
 * @module partners/TenantRequest/steps/PricingConfigStep
 */

import { useFormContext, useWatch } from 'react-hook-form'
import { useMemo } from 'react'
import { FormField, FormItem, FormControl, FormMessage } from '../../../ui/form'
import {
  OrganizationSizeSelector,
  ProcessSelector,
  UserLicenseSelector,
  PricingSummary,
  CommissionPreview,
  calculatePricingResult,
  calculateCommission,
  DEFAULT_PRICING_CONFIG,
  ORG_SIZE_TIERS,
} from '../../PricingCalculator'
import type { TenantRequestFormData } from '../tenant-request.types'
import type {
  ProcessSelection,
  UserLicenseSelection,
  PartnerCommissionStatus,
  OrganizationSizeTier,
} from '../../types/pricing.types'

export interface PricingConfigStepProps {
  /** Partner's commission status for preview */
  commissionStatus?: PartnerCommissionStatus | null
  /** Show commission preview (default: true) */
  showCommission?: boolean
  /** Disable all form inputs */
  disabled?: boolean
}

/**
 * Step 2: Services & Pricing Configuration
 *
 * Layout: Two-column on desktop (config left, summary right)
 * Mobile: Single column, summary at bottom
 */
export function PricingConfigStep({
  commissionStatus = null,
  showCommission = true,
  disabled,
}: PricingConfigStepProps) {
  const { control, setValue } = useFormContext<TenantRequestFormData>()

  // Watch form values for pricing calculation
  const organizationSize = useWatch({ control, name: 'organizationSize' }) as OrganizationSizeTier | ''
  const selectedPackage = useWatch({ control, name: 'selectedPackage' })
  const viewerLicenses = useWatch({ control, name: 'viewerLicenses' })
  const contributorLicenses = useWatch({ control, name: 'contributorLicenses' })
  const powerUserLicenses = useWatch({ control, name: 'powerUserLicenses' })
  const creatorLicenses = useWatch({ control, name: 'creatorLicenses' })

  // Convert form values to pricing calculation inputs
  const processes: ProcessSelection[] = useMemo(() => {
    if (!selectedPackage) return []
    return [{ tier: selectedPackage as ProcessSelection['tier'], quantity: 1 }]
  }, [selectedPackage])

  const licenses: UserLicenseSelection[] = useMemo(() => {
    const result: UserLicenseSelection[] = []
    if (viewerLicenses > 0) result.push({ tier: 'viewer', quantity: viewerLicenses })
    if (contributorLicenses > 0) result.push({ tier: 'contributor', quantity: contributorLicenses })
    if (powerUserLicenses > 0) result.push({ tier: 'power_user', quantity: powerUserLicenses })
    if (creatorLicenses > 0) result.push({ tier: 'creator', quantity: creatorLicenses })
    return result
  }, [viewerLicenses, contributorLicenses, powerUserLicenses, creatorLicenses])

  // Calculate pricing result with org size override
  const pricingResult = useMemo(() => {
    // Get employee count from org size tier
    const employeeCount = organizationSize ? ORG_SIZE_TIERS[organizationSize].minEmployees : 1
    const baseResult = calculatePricingResult(employeeCount, processes, licenses, DEFAULT_PRICING_CONFIG)

    if (!baseResult) return null

    // Override platform base price with org size tier price
    if (organizationSize) {
      const orgTier = ORG_SIZE_TIERS[organizationSize]
      const adjustedPlatformBase = orgTier.annualPrice
      const adjustedDealTotal = baseResult.dealTotal - baseResult.platformBase + adjustedPlatformBase
      return {
        ...baseResult,
        platformBase: adjustedPlatformBase,
        dealTotal: adjustedDealTotal,
      }
    }

    return baseResult
  }, [organizationSize, processes, licenses])

  // Calculate commission preview
  const commissionResult = useMemo(
    () => calculateCommission(pricingResult, commissionStatus),
    [pricingResult, commissionStatus]
  )

  // Handler for process package toggle (clicking selected = deselect)
  const handlePackageChange = (newProcesses: ProcessSelection[]) => {
    if (newProcesses.length === 0) {
      setValue('selectedPackage', '')
    } else {
      setValue('selectedPackage', newProcesses[0].tier)
    }
  }

  // Handler for license changes
  const handleLicenseChange = (newLicenses: UserLicenseSelection[]) => {
    setValue('viewerLicenses', newLicenses.find((l) => l.tier === 'viewer')?.quantity ?? 0)
    setValue('contributorLicenses', newLicenses.find((l) => l.tier === 'contributor')?.quantity ?? 0)
    setValue('powerUserLicenses', newLicenses.find((l) => l.tier === 'power_user')?.quantity ?? 0)
    setValue('creatorLicenses', newLicenses.find((l) => l.tier === 'creator')?.quantity ?? 0)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left Column - Configuration */}
      <div className="lg:col-span-2 space-y-6">
        {/* Organization Size (REQUIRED) */}
        <FormField
          control={control}
          name="organizationSize"
          rules={{ required: 'Organization size is required to proceed' }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <OrganizationSizeSelector
                  value={field.value as OrganizationSizeTier | ''}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Process Package Selection */}
        <ProcessSelector
          processes={processes}
          onChange={handlePackageChange}
          pricingConfig={DEFAULT_PRICING_CONFIG}
          disabled={disabled}
        />

        {/* User Licenses */}
        <UserLicenseSelector
          licenses={licenses}
          onChange={handleLicenseChange}
          pricingConfig={DEFAULT_PRICING_CONFIG}
          disabled={disabled}
          hideEmployeeCount
        />
      </div>

      {/* Right Column - Pricing Summary */}
      <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <PricingSummary
          result={pricingResult}
          loading={false}
          organizationSize={organizationSize || undefined}
        />

        {showCommission && (
          <CommissionPreview
            commission={commissionResult}
            tierStatus={commissionStatus}
            dealTotal={pricingResult?.dealTotal ?? 0}
            loading={false}
          />
        )}
      </aside>
    </div>
  )
}
