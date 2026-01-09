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
export type { PricingCalculatorProps, CommissionVisibilityMode } from './PricingCalculator'

// =============================================================================
// SUB-COMPONENTS (for composition)
// =============================================================================

export {
  ProcessSelector,
  UserLicenseSelector,
  CompanyInfoForm,
  PricingSummary,
  CommissionPreview,
  OrganizationSizeSelector,
} from './components'

export type { CompanyInfoFormProps, OrganizationSizeSelectorProps } from './components'

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
  ORG_SIZE_TIER_ORDER,
  ORG_SIZE_TIERS,
  INDUSTRIES,
  DEFAULT_PRICING_CONFIG,
  PACKAGE_STYLES,
  LICENSE_DESCRIPTIONS,
  GLASS_DEPTH_2,
} from './constants'

export type { Industry } from './constants'

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
  // Organization size types (NEW)
  OrganizationSizeTier,
  OrganizationSizeConfig,
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
