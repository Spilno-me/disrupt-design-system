/**
 * PricingCalculator Module
 *
 * Interactive pricing calculator for partner portal.
 * Supports standalone and API-driven modes.
 *
 * @module partners/PricingCalculator
 */

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export { PricingCalculator } from './PricingCalculator'
export type { PricingCalculatorProps } from './PricingCalculator'

// =============================================================================
// SUB-COMPONENTS (for composition)
// =============================================================================

export {
  ProcessSelector,
  UserLicenseSelector,
  CompanyInfoForm,
  PricingSummary,
  CommissionPreview,
} from './components'

export type { CompanyInfoFormProps } from './components'

// =============================================================================
// UTILITIES
// =============================================================================

export {
  calculatePricingResult,
  calculateCommission,
  determineCompanySize,
  formatCurrency,
} from './utils/pricing-calculations'

// =============================================================================
// CONSTANTS
// =============================================================================

export {
  PROCESS_TIER_ORDER,
  LICENSE_TIER_ORDER,
  DEFAULT_PRICING_CONFIG,
  PACKAGE_STYLES,
  LICENSE_DESCRIPTIONS,
  GLASS_DEPTH_2,
} from './constants'

// =============================================================================
// TYPES (re-export from pricing.types.ts for convenience)
// =============================================================================

export type {
  // Domain types
  ProcessTier,
  ProcessSelection,
  UserLicenseTier,
  UserLicenseSelection,
  PricingConfig,
  PricingCalculationResult,
  CommissionPreviewResult,
  PartnerCommissionStatus,
  CalculateRequest,
  // Additional types
  CompanySize,
  ProcessBreakdown,
  UserLicenseBreakdown,
  PlatformBaseConfig,
  ProcessTierConfig,
  VolumeDiscountConfig,
  UserLicenseConfig,
  CalculatorFormState,
  CalculateResponse,
  ProcessSelectorProps,
  UserLicenseSelectorProps,
  CommissionPreviewProps,
  PricingSummaryProps,
} from '../types/pricing.types'
