// =============================================================================
// TENANT PROVISIONING WIZARD - TYPES
// =============================================================================

import type { ApiPricingTier, WizardPackage } from './tenant-provisioning.constants'

// =============================================================================
// FORM DATA (Internal wizard state)
// =============================================================================

export interface TenantFormData {
  // Step 1: Company Information
  companyName: string
  legalName?: string
  website?: string
  industry: string
  employeeCount: string

  // Step 2: Contact & Billing
  contactName: string
  contactEmail: string
  contactPhone?: string
  contactTitle?: string
  billingStreet: string
  billingCity: string
  billingState: string
  billingPostalCode: string
  billingCountry: string

  // Step 3: Pricing
  package: 'standard' | 'premium' | 'advanced' | 'industry'
  viewerLicenses: number
  contributorLicenses: number
  powerUserLicenses: number
  creatorLicenses: number

  // Step 4: Review & Pay
  paymentMethod: 'invoice' | 'credit_card'
  acceptTerms: boolean
}

export interface TenantProvisioningWizardProps {
  /** Initial form data for editing */
  initialData?: Partial<TenantFormData>
  /** Callback when wizard is completed */
  onSubmit: (data: TenantFormData) => void | Promise<void>
  /** Callback when wizard is cancelled */
  onCancel?: () => void
  /** Whether submission is in progress */
  isSubmitting?: boolean
  /** Commission percentage to display (for partner portal) */
  commissionPercentage?: number
  /** Skip validation on step navigation (for development/preview) */
  skipValidation?: boolean
  /** Additional className */
  className?: string
}

// =============================================================================
// API-READY TYPES (For backend submission)
// =============================================================================

/** Status of a tenant provisioning request */
export type TenantRequestStatus =
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'pending_payment'
  | 'provisioning'
  | 'completed'

/**
 * API-ready tenant request data.
 * Use `transformToApiRequest()` to convert TenantFormData to this format.
 */
export interface TenantApiRequest {
  // Company
  companyName: string
  legalName?: string
  website?: string
  industry: string
  employeeCount: string

  // Contact
  contactName: string
  contactEmail: string
  contactPhone?: string
  contactTitle?: string

  // Billing
  billingAddress: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }

  // Pricing (API format)
  pricingTier: ApiPricingTier
  licenses: {
    viewer: number
    contributor: number
    powerUser: number
    creator: number
  }

  // Payment
  paymentMethod: 'invoice' | 'credit_card'

  // Calculated (consumer should provide)
  estimatedValue?: number
}

/**
 * API response when a tenant request is created
 */
export interface TenantApiResponse {
  id: string
  requestNumber: string
  status: TenantRequestStatus
  submittedAt: string
  companyName: string
  contactName: string
  contactEmail: string
  pricingTier: ApiPricingTier
  estimatedValue: number
}

// =============================================================================
// RE-EXPORTS FOR TYPE COMPATIBILITY
// =============================================================================

export type { ApiPricingTier, WizardPackage }
