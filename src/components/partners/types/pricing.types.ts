/**
 * Pricing Calculator V19 Types
 * Types for API-driven pricing calculator
 *
 * @module partners/types/pricing
 */

// =============================================================================
// ENUMS & BASIC TYPES
// =============================================================================

/** Company size classification */
export type CompanySize = 'smb' | 'mid_market' | 'enterprise'

/** Process package tier */
export type ProcessTier = 'standard' | 'premium' | 'advanced' | 'industry'

/** User license tier */
export type UserLicenseTier = 'viewer' | 'contributor' | 'power_user' | 'creator'

/** Billing cycle option */
export type BillingCycle = 'monthly' | 'annual'

// =============================================================================
// SELECTION TYPES
// =============================================================================

/** Process package selection */
export interface ProcessSelection {
  tier: ProcessTier
  quantity: number
}

/** User license selection */
export interface UserLicenseSelection {
  tier: UserLicenseTier
  quantity: number
}

// =============================================================================
// BREAKDOWN TYPES
// =============================================================================

/** Process pricing breakdown */
export interface ProcessBreakdown {
  tier: ProcessTier
  tierLabel: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

/** User license pricing breakdown */
export interface UserLicenseBreakdown {
  tier: UserLicenseTier
  tierLabel: string
  quantity: number
  monthlyUnitPrice: number
  annualUnitPrice: number
  lineTotal: number
}

// =============================================================================
// RESULT TYPES
// =============================================================================

/** Pricing calculation result from API */
export interface PricingCalculationResult {
  companySize: CompanySize
  platformBase: number
  processes: {
    subtotal: number
    volumeDiscountPercent: number
    volumeDiscountAmount: number
    total: number
    breakdown: ProcessBreakdown[]
  }
  userLicenses: {
    total: number
    breakdown: UserLicenseBreakdown[]
  }
  dealTotal: number
}

/** Commission preview result from API */
export interface CommissionPreviewResult {
  commissionTier: 1 | 2
  commissionRate: number
  commissionAmount: number
  ytdSalesBefore: number
  ytdSalesAfter: number
  tierUpgraded: boolean
}

/** Partner's current commission status */
export interface PartnerCommissionStatus {
  partnerId: string
  tier: 1 | 2
  rate: number
  ytdSales: number
  amountToNextTier: number | null
  tierUpgradeDate: string | null
  dealCount: number
  year: number
}

// =============================================================================
// CONFIG TYPES
// =============================================================================

/** Platform base pricing per company size */
export interface PlatformBaseConfig {
  minEmployees: number
  maxEmployees: number | null
  annualPrice: number
}

/** Process tier pricing config */
export interface ProcessTierConfig {
  name: string
  annualPrice: number
}

/** Volume discount tier */
export interface VolumeDiscountConfig {
  minQuantity: number
  maxQuantity: number | null
  discountPercent: number
}

/** User license pricing config */
export interface UserLicenseConfig {
  name: string
  monthlyPrice: number
  annualPrice: number
}

/** Complete pricing configuration from API */
export interface PricingConfig {
  platformBase: Record<CompanySize, PlatformBaseConfig>
  processTiers: Record<ProcessTier, ProcessTierConfig>
  volumeDiscounts: VolumeDiscountConfig[]
  userLicenses: Record<UserLicenseTier, UserLicenseConfig>
}

// =============================================================================
// FORM STATE TYPES
// =============================================================================

/** Calculator form state */
export interface CalculatorFormState {
  employeeCount: number
  processes: ProcessSelection[]
  userLicenses: UserLicenseSelection[]
}

/** Calculator calculation request */
export interface CalculateRequest {
  employeeCount: number
  processes: ProcessSelection[]
  userLicenses: UserLicenseSelection[]
}

/** Calculator calculation response */
export interface CalculateResponse {
  pricing: PricingCalculationResult
  commission: CommissionPreviewResult
}

// =============================================================================
// COMPONENT PROPS TYPES
// =============================================================================

/** Props for ProcessSelector component */
export interface ProcessSelectorProps {
  /** Currently selected processes */
  processes: ProcessSelection[]
  /** Callback when selection changes */
  onChange: (processes: ProcessSelection[]) => void
  /** Pricing config from API (optional, uses defaults if not provided) */
  pricingConfig?: PricingConfig
  /** Disable interactions */
  disabled?: boolean
}

/** Props for UserLicenseSelector component */
export interface UserLicenseSelectorProps {
  /** Currently selected licenses */
  licenses: UserLicenseSelection[]
  /** Callback when selection changes */
  onChange: (licenses: UserLicenseSelection[]) => void
  /** Pricing config from API (optional, uses defaults if not provided) */
  pricingConfig?: PricingConfig
  /** Disable interactions */
  disabled?: boolean
}

/** Props for CommissionPreview component */
export interface CommissionPreviewProps {
  /** Commission calculation result */
  commission: CommissionPreviewResult | null
  /** Partner's current commission status */
  tierStatus: PartnerCommissionStatus | null
  /** Total deal value */
  dealTotal: number
  /** Loading state */
  loading?: boolean
}

/** Props for PricingSummary component */
export interface PricingSummaryProps {
  /** Pricing calculation result */
  result: PricingCalculationResult | null
  /** Loading state */
  loading?: boolean
}

/** Props for CompanyInfoForm component */
export interface CompanyInfoFormProps {
  /** Current employee count value */
  employeeCount: number
  /** Callback when employee count changes */
  onChange: (count: number) => void
  /** Disable interactions */
  disabled?: boolean
}
