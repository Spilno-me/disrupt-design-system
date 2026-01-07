// =============================================================================
// SHARED PRICING DATA HOOK
// Eliminates duplication between PricingStep and ReviewPayStep
// =============================================================================

import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import type { TenantFormData } from '../tenant-provisioning.types'
import { EMPLOYEE_COUNT_MIDPOINTS, DEFAULT_EMPLOYEE_COUNT } from '../tenant-provisioning.constants'
import { calculatePricingResult } from '../../partners/PricingCalculator/utils/pricing-calculations'
import { DEFAULT_PRICING_CONFIG } from '../../partners/PricingCalculator/constants'
import type {
  ProcessSelection,
  UserLicenseSelection,
  ProcessTier,
  UserLicenseTier,
} from '../../partners/types/pricing.types'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Maps license tier to form field name */
export const LICENSE_FIELD_MAP: Record<UserLicenseTier, keyof TenantFormData> = {
  viewer: 'viewerLicenses',
  contributor: 'contributorLicenses',
  power_user: 'powerUserLicenses',
  creator: 'creatorLicenses',
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Shared hook for pricing calculations used by PricingStep and ReviewPayStep.
 * Extracts pricing data from form context and calculates results.
 */
export function usePricingData() {
  const { watch } = useFormContext<TenantFormData>()

  // Watch form values
  const employeeCount = watch('employeeCount')
  const selectedPackage = watch('package')
  const viewerLicenses = watch('viewerLicenses')
  const contributorLicenses = watch('contributorLicenses')
  const powerUserLicenses = watch('powerUserLicenses')
  const creatorLicenses = watch('creatorLicenses')

  // Convert employee count string to number
  const employeeCountNumber = EMPLOYEE_COUNT_MIDPOINTS[employeeCount] ?? DEFAULT_EMPLOYEE_COUNT

  // Build ProcessSelection[] from form package
  const processes: ProcessSelection[] = useMemo(() => {
    if (!selectedPackage) return []
    return [{ tier: selectedPackage as ProcessTier, quantity: 1 }]
  }, [selectedPackage])

  // Build UserLicenseSelection[] from form license values
  const licenses: UserLicenseSelection[] = useMemo(() => {
    const result: UserLicenseSelection[] = []
    const tiers: UserLicenseTier[] = ['viewer', 'contributor', 'power_user', 'creator']
    const quantities = {
      viewer: viewerLicenses,
      contributor: contributorLicenses,
      power_user: powerUserLicenses,
      creator: creatorLicenses,
    }

    for (const tier of tiers) {
      const quantity = quantities[tier] || 0
      if (quantity > 0) {
        result.push({ tier, quantity })
      }
    }
    return result
  }, [viewerLicenses, contributorLicenses, powerUserLicenses, creatorLicenses])

  // Calculate pricing result
  const pricingResult = useMemo(() => {
    return calculatePricingResult(employeeCountNumber, processes, licenses, DEFAULT_PRICING_CONFIG)
  }, [employeeCountNumber, processes, licenses])

  return {
    employeeCountNumber,
    processes,
    licenses,
    pricingResult,
    selectedPackage,
  }
}
