// =============================================================================
// TENANT PROVISIONING WIZARD - CONSTANTS
// =============================================================================

import type { WizardStep } from './Wizard'

// =============================================================================
// WIZARD STEPS
// =============================================================================

export const WIZARD_STEPS: WizardStep[] = [
  { id: 'company', label: 'Company Info' },
  { id: 'contact', label: 'Contact & Billing' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'review', label: 'Review & Pay' },
]

// =============================================================================
// FORM OPTIONS
// =============================================================================

export const INDUSTRIES = [
  'Manufacturing',
  'Construction',
  'Healthcare',
  'Oil & Gas',
  'Mining',
  'Transportation',
  'Utilities',
  'Chemical',
  'Food & Beverage',
  'Retail',
  'Other',
] as const

export const EMPLOYEE_COUNTS = [
  { value: '1-50', label: '1-50 employees', tier: 'Starter' },
  { value: '51-200', label: '51-200 employees', tier: 'Growth' },
  { value: '201-500', label: '201-500 employees', tier: 'Professional' },
  { value: '501-1000', label: '501-1,000 employees', tier: 'Enterprise' },
  { value: '1001+', label: '1,000+ employees', tier: 'Enterprise Plus' },
] as const

export const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Netherlands',
  'Singapore',
  'Japan',
  'Other',
] as const

// =============================================================================
// EMPLOYEE COUNT CONVERSION (eliminates magic numbers)
// =============================================================================

/** Maps employee count range strings to representative numbers for pricing */
export const EMPLOYEE_COUNT_MIDPOINTS: Record<string, number> = {
  '1-50': 25,
  '51-200': 125,
  '201-500': 350,
  '501-1000': 750,
  '1001+': 1500,
}

/** Default employee count when range not found */
export const DEFAULT_EMPLOYEE_COUNT = 100

// =============================================================================
// PRICING CONSTANTS
// =============================================================================

/** Commission percentage threshold for tier 2 qualification */
export const TIER_2_COMMISSION_THRESHOLD = 15

/** Number of months per year for annual→monthly conversion */
export const MONTHS_PER_YEAR = 12

// =============================================================================
// API TIER MAPPING
// =============================================================================

/** API pricing tier type */
export type ApiPricingTier = 'starter' | 'professional' | 'enterprise'

/** Wizard package type */
export type WizardPackage = 'standard' | 'premium' | 'advanced' | 'industry'

/**
 * Maps wizard package names to API pricing tier names.
 * Use this when transforming form data for API submission.
 */
export const PACKAGE_TO_TIER_MAP: Record<WizardPackage, ApiPricingTier> = {
  standard: 'starter',
  premium: 'professional',
  advanced: 'enterprise',
  industry: 'enterprise',
}

/**
 * Reverse mapping: API tier → wizard package (for pre-filling forms from API data)
 */
export const TIER_TO_PACKAGE_MAP: Record<ApiPricingTier, WizardPackage> = {
  starter: 'standard',
  professional: 'premium',
  enterprise: 'advanced',
}
