/**
 * Form Options Constants
 *
 * Shared dropdown options for forms across the application.
 * Consolidates COMPANY_SIZES and COUNTRIES to prevent duplication.
 *
 * @see src/components/partners/ - Partner dialogs
 * @see src/components/provisioning/ - Tenant provisioning
 */

// =============================================================================
// COMPANY SIZES
// =============================================================================

/**
 * Company size options with value/label pairs for partner forms.
 * Used in Select/Dropdown components.
 */
export const COMPANY_SIZES = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1001-5000", label: "1001-5000 employees" },
  { value: "5000+", label: "5000+ employees" },
] as const

/** Type for company size values */
export type CompanySize = (typeof COMPANY_SIZES)[number]["value"]

/** Type for the full company size option object */
export type CompanySizeOption = (typeof COMPANY_SIZES)[number]

// =============================================================================
// COUNTRIES
// =============================================================================

/**
 * Country options with value/label/flag for partner forms.
 * Flag can be ISO code (for CountryFlag component) or emoji.
 */
export const COUNTRIES = [
  { value: "US", label: "United States", flag: "US" },
  { value: "CA", label: "Canada", flag: "CA" },
  { value: "UK", label: "United Kingdom", flag: "UK" },
  { value: "AU", label: "Australia", flag: "AU" },
  { value: "DE", label: "Germany", flag: "DE" },
  { value: "FR", label: "France", flag: "FR" },
  { value: "JP", label: "Japan", flag: "JP" },
  { value: "SG", label: "Singapore", flag: "SG" },
] as const

/** Type for country code values */
export type Country = (typeof COUNTRIES)[number]["value"]

/** Type for the full country option object */
export type CountryOption = (typeof COUNTRIES)[number]

// =============================================================================
// SIMPLE STRING ARRAYS (for provisioning flows)
// =============================================================================

/**
 * Simple country name strings for provisioning forms.
 * Re-exported from tenant-provisioning.constants.ts for backwards compatibility.
 */
export const COUNTRY_NAMES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "Singapore",
  "Netherlands",
  "Switzerland",
  "Other",
] as const

/** Type for country name strings */
export type CountryName = (typeof COUNTRY_NAMES)[number]

/**
 * Simple company size strings for provisioning chat.
 * Different ranges than partner forms (more granular tiers).
 */
export const COMPANY_SIZE_RANGES = [
  "1-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
] as const

/** Type for company size range strings */
export type CompanySizeRange = (typeof COMPANY_SIZE_RANGES)[number]
