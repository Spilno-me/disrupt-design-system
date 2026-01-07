/**
 * Pricing Calculation Utilities
 *
 * Pure functions for calculating pricing and commission.
 * No React dependencies - can be used in tests, server components, etc.
 *
 * @module partners/PricingCalculator/utils/pricing-calculations
 */

import type {
  CompanySize,
  ProcessSelection,
  UserLicenseSelection,
  PricingConfig,
  PricingCalculationResult,
  CommissionPreviewResult,
  PartnerCommissionStatus,
} from '../../types/pricing.types'

// =============================================================================
// PRICING CALCULATION
// =============================================================================

/**
 * Calculate pricing result from selections.
 * Pure function - no side effects.
 */
export function calculatePricingResult(
  employeeCount: number,
  processes: ProcessSelection[],
  licenses: UserLicenseSelection[],
  pricingConfig: PricingConfig
): PricingCalculationResult | null {
  const hasInputs = processes.length > 0 || licenses.length > 0
  if (!hasInputs) return null

  // Determine company size from employee count
  const companySize = determineCompanySize(employeeCount)
  const platformBase = pricingConfig.platformBase[companySize].annualPrice

  // Calculate processes
  const processBreakdown = processes.map((p) => {
    const config = pricingConfig.processTiers[p.tier]
    return {
      tier: p.tier,
      tierLabel: config.name,
      quantity: p.quantity,
      unitPrice: config.annualPrice,
      lineTotal: config.annualPrice * p.quantity,
    }
  })
  const processSubtotal = processBreakdown.reduce((sum, p) => sum + p.lineTotal, 0)
  const totalProcessQty = processes.reduce((sum, p) => sum + p.quantity, 0)

  // Volume discount
  const volumeDiscount = pricingConfig.volumeDiscounts.find(
    (d) =>
      totalProcessQty >= d.minQuantity &&
      (d.maxQuantity === null || totalProcessQty <= d.maxQuantity)
  )
  const volumeDiscountPercent = volumeDiscount?.discountPercent ?? 0
  const volumeDiscountAmount = processSubtotal * (volumeDiscountPercent / 100)

  // Calculate licenses
  const licenseBreakdown = licenses.map((l) => {
    const config = pricingConfig.userLicenses[l.tier]
    return {
      tier: l.tier,
      tierLabel: config.name,
      quantity: l.quantity,
      monthlyUnitPrice: config.monthlyPrice,
      annualUnitPrice: config.annualPrice,
      lineTotal: config.annualPrice * l.quantity,
    }
  })
  const licenseTotal = licenseBreakdown.reduce((sum, l) => sum + l.lineTotal, 0)

  const dealTotal = platformBase + (processSubtotal - volumeDiscountAmount) + licenseTotal

  return {
    companySize,
    platformBase,
    processes: {
      subtotal: processSubtotal,
      volumeDiscountPercent,
      volumeDiscountAmount,
      total: processSubtotal - volumeDiscountAmount,
      breakdown: processBreakdown,
    },
    userLicenses: {
      total: licenseTotal,
      breakdown: licenseBreakdown,
    },
    dealTotal,
  }
}

// =============================================================================
// COMMISSION CALCULATION
// =============================================================================

/**
 * Calculate commission preview from pricing result.
 * Pure function - no side effects.
 */
export function calculateCommission(
  pricingResult: PricingCalculationResult | null,
  commissionStatus: PartnerCommissionStatus | null
): CommissionPreviewResult | null {
  if (!pricingResult) return null

  const commissionRate = commissionStatus?.rate ?? 0.15
  const commissionTier = commissionStatus?.tier ?? 1

  return {
    commissionTier,
    commissionRate,
    commissionAmount: pricingResult.dealTotal * commissionRate,
    ytdSalesBefore: commissionStatus?.ytdSales ?? 0,
    ytdSalesAfter: (commissionStatus?.ytdSales ?? 0) + pricingResult.dealTotal,
    tierUpgraded: false,
  }
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Determine company size from employee count.
 */
export function determineCompanySize(employeeCount: number): CompanySize {
  if (employeeCount > 500) return 'enterprise'
  if (employeeCount > 100) return 'mid_market'
  return 'smb'
}

/**
 * Format currency value for display.
 * Uses en-US locale with USD currency, no decimal places.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
