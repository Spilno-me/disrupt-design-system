/**
 * PricingCalculator Constants
 *
 * Static configuration, display order, and styling metadata.
 * Pricing values come from PricingConfig (API or defaults).
 *
 * @module partners/PricingCalculator/constants
 */

import type {
  ProcessTier,
  UserLicenseTier,
  PricingConfig,
  OrganizationSizeTier,
  OrganizationSizeConfig,
} from '../types/pricing.types'

// =============================================================================
// DISPLAY ORDER
// =============================================================================

/** Process tier display order */
export const PROCESS_TIER_ORDER: ProcessTier[] = [
  'standard',
  'premium',
  'advanced',
  'industry',
]

/** User license tier display order */
export const LICENSE_TIER_ORDER: UserLicenseTier[] = [
  'viewer',
  'contributor',
  'power_user',
  'creator',
]

/** Organization size tier display order */
export const ORG_SIZE_TIER_ORDER: OrganizationSizeTier[] = [
  'micro',
  'small',
  'mid_market',
  'upper_mid',
  'enterprise',
  'large_enterprise',
]

// =============================================================================
// ORGANIZATION SIZE TIERS (for TenantRequestWizard)
// =============================================================================

/**
 * Organization size tier configuration
 * 6 tiers with fixed platform base prices per spec
 */
export const ORG_SIZE_TIERS: Record<OrganizationSizeTier, OrganizationSizeConfig> = {
  micro: {
    label: 'Micro',
    userRange: '1-10 users',
    minEmployees: 1,
    maxEmployees: 10,
    annualPrice: 3000,
  },
  small: {
    label: 'Small',
    userRange: '11-50 users',
    minEmployees: 11,
    maxEmployees: 50,
    annualPrice: 5000,
  },
  mid_market: {
    label: 'Mid-Market',
    userRange: '51-100 users',
    minEmployees: 51,
    maxEmployees: 100,
    annualPrice: 7000,
  },
  upper_mid: {
    label: 'Upper Mid-Market',
    userRange: '101-250 users',
    minEmployees: 101,
    maxEmployees: 250,
    annualPrice: 10000,
  },
  enterprise: {
    label: 'Enterprise',
    userRange: '251-500 users',
    minEmployees: 251,
    maxEmployees: 500,
    annualPrice: 13000,
  },
  large_enterprise: {
    label: 'Large Enterprise',
    userRange: '500+ users',
    minEmployees: 501,
    maxEmployees: null,
    annualPrice: 18000,
  },
}

// =============================================================================
// INDUSTRIES (for TenantRequestWizard)
// =============================================================================

/** Industry options for dropdown selection */
export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Retail',
  'Manufacturing',
  'Education',
  'Government',
  'Non-Profit',
  'Other',
] as const

export type Industry = (typeof INDUSTRIES)[number]

// =============================================================================
// DEFAULT PRICING CONFIG
// =============================================================================

/** Default pricing config (used when API config not provided) */
export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  platformBase: {
    smb: { minEmployees: 1, maxEmployees: 100, annualPrice: 0 },
    mid_market: { minEmployees: 101, maxEmployees: 500, annualPrice: 5000 },
    enterprise: { minEmployees: 501, maxEmployees: null, annualPrice: 26000 },
  },
  processTiers: {
    standard: { name: 'Standard Package', annualPrice: 2000 },
    premium: { name: 'Premium Package', annualPrice: 3000 },
    advanced: { name: 'Advanced Package', annualPrice: 4000 },
    industry: { name: 'Industry Package', annualPrice: 6000 },
  },
  volumeDiscounts: [
    { minQuantity: 1, maxQuantity: 2, discountPercent: 0 },
    { minQuantity: 3, maxQuantity: 5, discountPercent: 10 },
    { minQuantity: 6, maxQuantity: null, discountPercent: 20 },
  ],
  userLicenses: {
    viewer: { name: 'Viewer', monthlyPrice: 10, annualPrice: 100 },
    contributor: { name: 'Contributor', monthlyPrice: 30, annualPrice: 300 },
    power_user: { name: 'Power User', monthlyPrice: 60, annualPrice: 600 },
    creator: { name: 'Creator', monthlyPrice: 150, annualPrice: 1500 },
  },
}

// =============================================================================
// PACKAGE STYLING (NON-PRICING METADATA)
// =============================================================================

/**
 * Package styling metadata for process tiers.
 * Uses DDS semantic tokens for theming support.
 *
 * Glass styling pattern (Depth 2):
 * - Selected: color/40 bg + color/60 border + backdrop-blur
 * - Unselected: white/40 bg + accent border
 */
export const PACKAGE_STYLES: Record<
  ProcessTier,
  {
    description: string
    /** Border accent (left edge indicator) */
    accentClass: string
    /** Background tint (selected state) - uses glass opacity */
    bgClass: string
    /** Border color for selected state */
    borderClass: string
  }
> = {
  standard: {
    description: 'Basic workflow automation and process management',
    accentClass: 'border-l-success',
    bgClass: 'bg-success/40',
    borderClass: 'border-success/60',
  },
  premium: {
    description: 'Advanced automation with analytics and reporting',
    accentClass: 'border-l-info',
    bgClass: 'bg-info/40',
    borderClass: 'border-info/60',
  },
  advanced: {
    description: 'Enterprise-grade with AI-powered insights',
    accentClass: 'border-l-accent-strong',
    bgClass: 'bg-accent/60', // Higher opacity for better visibility
    borderClass: 'border-accent',
  },
  industry: {
    description: 'Specialized industry-specific compliance & workflows',
    accentClass: 'border-l-warning',
    bgClass: 'bg-warning/40',
    borderClass: 'border-warning/60',
  },
}

// =============================================================================
// LICENSE DESCRIPTIONS
// =============================================================================

/** License tier descriptions for UI display */
export const LICENSE_DESCRIPTIONS: Record<UserLicenseTier, string> = {
  viewer: 'Read-only access to data and reports',
  contributor: 'Submit data and manage processes',
  power_user: 'Advanced analytics and oversight',
  creator: 'Build and configure processes',
}

// =============================================================================
// GLASS STYLING CONSTANTS
// =============================================================================

/**
 * Glass effect classes for Depth 2 (Card level)
 * Per DDS depth-layering-rules.md
 */
export const GLASS_DEPTH_2 = {
  /** Base glass effect for standalone elements (section, div) */
  neutral: 'bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent shadow-md',
  /** Glass with softer accent border (commission preview, etc.) */
  accent: 'bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent/60 shadow-md',
} as const
