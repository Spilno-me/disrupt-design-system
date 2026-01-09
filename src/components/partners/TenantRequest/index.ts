/**
 * TenantRequest Module
 *
 * 3-step wizard for creating tenant requests with organization-based pricing.
 *
 * @module partners/TenantRequest
 */

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export { TenantRequestWizard } from './TenantRequestWizard'
export type { TenantRequestWizardProps } from './TenantRequestWizard'

// =============================================================================
// STEP COMPONENTS (for testing/composition)
// =============================================================================

export { CompanyContactStep, PricingConfigStep, ReviewSubmitStep } from './steps'
export type {
  CompanyContactStepProps,
  PricingConfigStepProps,
  ReviewSubmitStepProps,
} from './steps'

// =============================================================================
// TYPES
// =============================================================================

export type {
  TenantRequestFormData,
  TenantRequestStatus,
  PartnerCommissionStatus,
} from './tenant-request.types'
