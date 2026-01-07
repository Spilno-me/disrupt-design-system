// =============================================================================
// STEP 3: PRICING
// Uses PricingCalculator components for consistent UI
// =============================================================================

import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import { WizardStepHeader } from '../WizardStep'
import { usePricingData, LICENSE_FIELD_MAP } from '../hooks'
import { TIER_2_COMMISSION_THRESHOLD } from '../tenant-provisioning.constants'
import type { TenantFormData } from '../tenant-provisioning.types'
import {
  ProcessSelector,
  UserLicenseSelector,
  PricingSummary,
  CommissionPreview,
} from '../../partners/PricingCalculator/components'
import { calculateCommission } from '../../partners/PricingCalculator/utils/pricing-calculations'
import { DEFAULT_PRICING_CONFIG } from '../../partners/PricingCalculator/constants'
import type {
  ProcessSelection,
  UserLicenseSelection,
  PartnerCommissionStatus,
} from '../../partners/types/pricing.types'

// =============================================================================
// TYPES
// =============================================================================

export interface PricingStepProps {
  commissionPercentage?: number
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * PricingStep - Third step for package and license selection
 *
 * @component MOLECULE
 * @testId Auto-generated: `pricing-step-{element}`
 *
 * Test IDs:
 * - `pricing-step` - Root container
 * - `pricing-step-selections` - Left column with selectors
 * - `pricing-step-process-selector` - Package/process selection
 * - `pricing-step-license-selector` - User license selection
 * - `pricing-step-summary-panel` - Right column with summaries
 * - `pricing-step-pricing-summary` - Pricing breakdown
 * - `pricing-step-commission-preview` - Commission preview (if shown)
 */
export function PricingStep({ commissionPercentage }: PricingStepProps) {
  const { setValue } = useFormContext<TenantFormData>()
  const { employeeCountNumber, processes, licenses, pricingResult } = usePricingData()

  // Handle process selection change - update form
  const handleProcessChange = (newProcesses: ProcessSelection[]) => {
    if (newProcesses.length > 0) {
      setValue('package', newProcesses[0].tier as TenantFormData['package'], { shouldValidate: true })
    }
  }

  // Handle license selection change - update form
  const handleLicenseChange = (newLicenses: UserLicenseSelection[]) => {
    // Reset all license fields first
    setValue('viewerLicenses', 0)
    setValue('contributorLicenses', 0)
    setValue('powerUserLicenses', 0)
    setValue('creatorLicenses', 0)

    // Set new values
    for (const license of newLicenses) {
      const fieldName = LICENSE_FIELD_MAP[license.tier]
      setValue(fieldName, license.quantity as never, { shouldValidate: true })
    }
  }

  // Calculate commission (simulate partner tier status)
  const commissionStatus: PartnerCommissionStatus | null = commissionPercentage ? {
    partnerId: 'wizard-preview',
    tier: commissionPercentage >= TIER_2_COMMISSION_THRESHOLD ? 2 : 1,
    rate: commissionPercentage / 100,
    ytdSales: 0,
    amountToNextTier: null,
    tierUpgradeDate: null,
    dealCount: 0,
    year: new Date().getFullYear(),
  } : null

  const commissionResult = React.useMemo(() => {
    return calculateCommission(pricingResult, commissionStatus)
  }, [pricingResult, commissionStatus])

  return (
    <div className="space-y-6" data-testid="pricing-step">
      <WizardStepHeader
        title="Configure Pricing"
        description="Select your package and user licenses"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Package Selection & Licenses */}
        <div className="lg:col-span-2 space-y-6" data-testid="pricing-step-selections">
          <div data-testid="pricing-step-process-selector">
            <ProcessSelector
              processes={processes}
              onChange={handleProcessChange}
              pricingConfig={DEFAULT_PRICING_CONFIG}
            />
          </div>

          <div data-testid="pricing-step-license-selector">
            <UserLicenseSelector
              licenses={licenses}
              onChange={handleLicenseChange}
              employeeCount={employeeCountNumber}
              pricingConfig={DEFAULT_PRICING_CONFIG}
            />
          </div>
        </div>

        {/* Right Column - Pricing Summary & Commission */}
        <div className="lg:col-span-1 space-y-6" data-testid="pricing-step-summary-panel">
          <div className="sticky top-4 space-y-6">
            <div data-testid="pricing-step-pricing-summary">
              <PricingSummary result={pricingResult} loading={false} />
            </div>

            {commissionPercentage && (
              <div data-testid="pricing-step-commission-preview">
                <CommissionPreview
                  commission={commissionResult}
                  tierStatus={commissionStatus}
                  dealTotal={pricingResult?.dealTotal ?? 0}
                  loading={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
