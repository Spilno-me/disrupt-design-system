// =============================================================================
// TENANT PROVISIONING - API TRANSFORMATION UTILITIES
// =============================================================================

import {
  PACKAGE_TO_TIER_MAP,
  TIER_TO_PACKAGE_MAP,
  type ApiPricingTier,
  type WizardPackage,
} from './tenant-provisioning.constants'
import type {
  TenantFormData,
  TenantApiRequest,
  TenantApiResponse,
} from './tenant-provisioning.types'

// =============================================================================
// FORM → API TRANSFORMATION
// =============================================================================

/**
 * Transforms wizard form data to API-ready request format.
 *
 * @example
 * ```tsx
 * const handleSubmit = async (formData: TenantFormData) => {
 *   const apiRequest = transformToApiRequest(formData)
 *   await fetch('/api/tenants', {
 *     method: 'POST',
 *     body: JSON.stringify(apiRequest)
 *   })
 * }
 * ```
 */
export function transformToApiRequest(
  formData: TenantFormData,
  estimatedValue?: number
): TenantApiRequest {
  return {
    // Company
    companyName: formData.companyName,
    legalName: formData.legalName,
    website: formData.website,
    industry: formData.industry,
    employeeCount: formData.employeeCount,

    // Contact
    contactName: formData.contactName,
    contactEmail: formData.contactEmail,
    contactPhone: formData.contactPhone,
    contactTitle: formData.contactTitle,

    // Billing (nested structure for API)
    billingAddress: {
      street: formData.billingStreet,
      city: formData.billingCity,
      state: formData.billingState,
      postalCode: formData.billingPostalCode,
      country: formData.billingCountry,
    },

    // Pricing (mapped to API tier)
    pricingTier: PACKAGE_TO_TIER_MAP[formData.package],
    licenses: {
      viewer: formData.viewerLicenses,
      contributor: formData.contributorLicenses,
      powerUser: formData.powerUserLicenses,
      creator: formData.creatorLicenses,
    },

    // Payment
    paymentMethod: formData.paymentMethod,

    // Optional calculated value
    estimatedValue,
  }
}

// =============================================================================
// API → FORM TRANSFORMATION (for editing existing requests)
// =============================================================================

/**
 * Transforms API response data back to form data for editing.
 * Useful when loading an existing tenant request into the wizard.
 *
 * @example
 * ```tsx
 * const existingRequest = await fetchTenantRequest(id)
 * const initialData = transformFromApiResponse(existingRequest)
 * <TenantProvisioningWizard initialData={initialData} />
 * ```
 */
export function transformFromApiResponse(
  apiData: Partial<TenantApiResponse> & {
    billingAddress?: TenantApiRequest['billingAddress']
    licenses?: TenantApiRequest['licenses']
    paymentMethod?: TenantApiRequest['paymentMethod']
  }
): Partial<TenantFormData> {
  const result: Partial<TenantFormData> = {}

  // Company
  if (apiData.companyName) result.companyName = apiData.companyName

  // Contact
  if (apiData.contactName) result.contactName = apiData.contactName
  if (apiData.contactEmail) result.contactEmail = apiData.contactEmail

  // Billing
  if (apiData.billingAddress) {
    result.billingStreet = apiData.billingAddress.street
    result.billingCity = apiData.billingAddress.city
    result.billingState = apiData.billingAddress.state
    result.billingPostalCode = apiData.billingAddress.postalCode
    result.billingCountry = apiData.billingAddress.country
  }

  // Pricing (map back from API tier)
  if (apiData.pricingTier) {
    result.package = TIER_TO_PACKAGE_MAP[apiData.pricingTier]
  }

  if (apiData.licenses) {
    result.viewerLicenses = apiData.licenses.viewer
    result.contributorLicenses = apiData.licenses.contributor
    result.powerUserLicenses = apiData.licenses.powerUser
    result.creatorLicenses = apiData.licenses.creator
  }

  // Payment
  if (apiData.paymentMethod) {
    result.paymentMethod = apiData.paymentMethod
  }

  return result
}

// =============================================================================
// TIER CONVERSION HELPERS
// =============================================================================

/**
 * Converts a wizard package to API pricing tier.
 */
export function packageToTier(pkg: WizardPackage): ApiPricingTier {
  return PACKAGE_TO_TIER_MAP[pkg]
}

/**
 * Converts an API pricing tier to wizard package.
 */
export function tierToPackage(tier: ApiPricingTier): WizardPackage {
  return TIER_TO_PACKAGE_MAP[tier]
}

// =============================================================================
// REQUEST NUMBER GENERATOR
// =============================================================================

/**
 * Generates a tenant request number.
 * Format: TR-YYYY-XXXX (e.g., TR-2025-0042)
 *
 * @param sequence - Sequential number (usually from database)
 */
export function generateRequestNumber(sequence: number): string {
  const year = new Date().getFullYear()
  const paddedSequence = String(sequence).padStart(4, '0')
  return `TR-${year}-${paddedSequence}`
}
