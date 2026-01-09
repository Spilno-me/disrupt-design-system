/**
 * TenantRequest Types
 *
 * Types for the Create Tenant Request wizard form data and validation.
 *
 * @module partners/TenantRequest/types
 */

import type {
  OrganizationSizeTier,
  ProcessTier,
  UserLicenseTier,
} from '../types/pricing.types'

// Re-export for convenience
export type { PartnerCommissionStatus } from '../types/pricing.types'
import type { Industry } from '../PricingCalculator/constants'

// =============================================================================
// FORM DATA TYPES
// =============================================================================

/** Tenant request form data structure */
export interface TenantRequestFormData {
  // Step 1: Company Information
  companyName: string
  legalName: string
  website: string
  industry: Industry | ''

  // Step 1: Primary Contact
  contactName: string
  contactEmail: string
  contactPhone: string
  contactTitle: string

  // Step 1: Billing Information (all optional)
  billingStreet: string
  billingCity: string
  billingState: string
  billingPostalCode: string
  billingCountry: string

  // Step 2: Pricing Configuration
  organizationSize: OrganizationSizeTier | ''
  selectedPackage: ProcessTier | ''
  viewerLicenses: number
  contributorLicenses: number
  powerUserLicenses: number
  creatorLicenses: number

  // Step 3: Status
  status: TenantRequestStatus
}

/** Tenant request status options */
export type TenantRequestStatus = 'draft' | 'submitted'

/** Default form values */
export const DEFAULT_TENANT_REQUEST_FORM: TenantRequestFormData = {
  // Company Information
  companyName: '',
  legalName: '',
  website: '',
  industry: '',

  // Primary Contact
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  contactTitle: '',

  // Billing Information
  billingStreet: '',
  billingCity: '',
  billingState: '',
  billingPostalCode: '',
  billingCountry: '',

  // Pricing Configuration
  organizationSize: '',
  selectedPackage: '',
  viewerLicenses: 0,
  contributorLicenses: 0,
  powerUserLicenses: 0,
  creatorLicenses: 0,

  // Status
  status: 'draft',
}

// =============================================================================
// WIZARD STEP TYPES
// =============================================================================

/** Wizard step identifiers */
export type TenantRequestStep = 'company-contact' | 'pricing-config' | 'review-submit'

/** Wizard step configuration */
export interface StepConfig {
  id: TenantRequestStep
  title: string
  description: string
}

/** Wizard steps configuration */
export const WIZARD_STEPS: StepConfig[] = [
  {
    id: 'company-contact',
    title: 'Company & Contact',
    description: 'Enter company and contact information',
  },
  {
    id: 'pricing-config',
    title: 'Pricing Configuration',
    description: 'Configure services and pricing',
  },
  {
    id: 'review-submit',
    title: 'Review & Submit',
    description: 'Review and submit your request',
  },
]

// =============================================================================
// VALIDATION FIELD GROUPS
// =============================================================================

/** Step 1 required fields for validation */
export const STEP_1_REQUIRED_FIELDS = [
  'companyName',
  'industry',
  'contactName',
  'contactEmail',
  'contactPhone',
] as const

/** Step 2 required fields for validation */
export const STEP_2_REQUIRED_FIELDS = [
  'organizationSize',
  'selectedPackage',
] as const

// =============================================================================
// API TYPES (for future backend integration)
// =============================================================================

/** API request to create/update tenant request */
export interface CreateTenantRequestPayload {
  companyInfo: {
    name: string
    legalName?: string
    website?: string
    industry: Industry
  }
  contact: {
    name: string
    email: string
    phone: string
    title?: string
  }
  billing?: {
    street?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
  pricing: {
    organizationSize: OrganizationSizeTier
    packageTier: ProcessTier
    licenses: {
      tier: UserLicenseTier
      quantity: number
    }[]
  }
  status: TenantRequestStatus
}

/** API response for tenant request */
export interface TenantRequestResponse {
  id: string
  referenceNumber: string
  createdAt: string
  updatedAt: string
  status: TenantRequestStatus
  data: CreateTenantRequestPayload
}
