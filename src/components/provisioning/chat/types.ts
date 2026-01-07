/**
 * Tenant Provisioning Chat Types
 *
 * Shared type definitions for the conversational tenant setup flow.
 */

import type { ReactNode } from "react"
import type {
  ProcessTier,
  UserLicenseSelection,
  PricingCalculationResult,
} from "../../partners/types/pricing.types"

// =============================================================================
// FORM DATA TYPES
// =============================================================================

export interface TenantFormData {
  // Company section
  companyName: string
  industry: string
  companySize: string
  // Contact section
  contactEmail: string
  contactName: string
  contactPhone: string
  // Billing address section
  billingStreet: string
  billingCity: string
  billingState: string
  billingZip: string
  billingCountry: string
  // Pricing section (extended for full calculator)
  employeeCount: number
  processTier: ProcessTier
  userLicenses: UserLicenseSelection[]
  billingCycle: "monthly" | "annual"
  calculatedTotal?: number
  // Legacy fields (for backwards compatibility)
  pricingTier: string
}

// =============================================================================
// PRICING STATE TYPES
// =============================================================================

/** State for the pricing card component */
export interface PricingState {
  employeeCount: number
  processTier: ProcessTier | null
  userLicenses: UserLicenseSelection[]
  billingCycle: "monthly" | "annual"
  result: PricingCalculationResult | null
  isCalculating: boolean
}

/** @deprecated Use TenantFormData instead */
export type TenantChatFormData = TenantFormData

// =============================================================================
// AGENT & SECTION TYPES
// =============================================================================

export type AgentState = "idle" | "thinking" | "planning" | "executing" | "calculating" | "complete"

export type SectionId =
  | "company"
  | "contact"
  | "billing"
  | "pricing-employees"   // Step 4a: How many employees?
  | "pricing-package"     // Step 4b: Which package?
  | "pricing-licenses"    // Step 4c: User licenses
  | "subscription"        // Legacy (deprecated)
  | "review"

export interface FormSection {
  id: SectionId
  title: string
  icon: ReactNode
  fields: (keyof TenantFormData)[]
  aiTip?: (data: Partial<TenantFormData>) => string | null
}

// =============================================================================
// MESSAGE TYPES
// =============================================================================

export type ChatMessageType =
  | "assistant"
  | "user-summary"
  | "ai-tip"
  | "form-card"
  | "review"
  | "success"

export interface ChatMessage {
  id: string
  type: ChatMessageType
  content: string
  sectionId?: SectionId
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================

export interface TenantProvisioningChatProps {
  onComplete: (tenantData: TenantFormData) => void
  onCancel?: () => void
  onSaveProgress?: (data: Partial<TenantFormData>, section: string) => void
  initialData?: Partial<TenantFormData>
  className?: string
}

export interface ChatBubbleProps {
  children: ReactNode
  variant?: "assistant" | "tip" | "summary"
  /** If true, shows typing animation before revealing content (MAYA credibility) */
  isNew?: boolean
}

export interface FormCardProps {
  section: FormSection
  data: Partial<TenantFormData>
  onChange: (field: keyof TenantFormData, value: string) => void
  onSubmit: () => void
  errors: Partial<Record<keyof TenantFormData, string>>
}

export interface ReviewScreenProps {
  data: Partial<TenantFormData>
  onEdit: (sectionId: SectionId) => void
  onConfirm: () => void
  isSubmitting: boolean
}

export interface SuccessCardProps {
  data: TenantFormData
}

export interface ChatWrapperProps {
  header: ReactNode
  footer?: ReactNode
  children: ReactNode
  className?: string
}

export interface ChatHeaderProps {
  agentState: AgentState
  onExit?: () => void
  onSaveProgress?: () => void
  hasUnsavedProgress?: boolean
  progressPercentage?: number
}

export type FooterVariant = "hidden" | "confirm-exit" | "success"

export interface ChatFooterProps {
  variant: FooterVariant
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
  isSubmitting?: boolean
}

export interface ThinkingIndicatorProps {
  state: "thinking" | "planning" | "executing" | "calculating"
  message?: string
}

// =============================================================================
// PRICING COMPONENT PROPS
// =============================================================================

export interface ChatProcessSelectorProps {
  selectedTier: ProcessTier | null
  onSelect: (tier: ProcessTier) => void
  disabled?: boolean
}

export interface ChatConfigPanelProps {
  employeeCount: number
  onEmployeeCountChange: (count: number) => void
  userLicenses: UserLicenseSelection[]
  onLicenseChange: (licenses: UserLicenseSelection[]) => void
  disabled?: boolean
}

export interface ChatPricingSummaryProps {
  result: PricingCalculationResult | null
  billingCycle: "monthly" | "annual"
  onBillingCycleChange: (cycle: "monthly" | "annual") => void
  isCalculating?: boolean
}

export interface PricingCardProps {
  /** Current pricing state */
  pricingState: PricingState
  /** Handler for pricing changes */
  onPricingChange: (state: Partial<PricingState>) => void
  /** Handler for section completion */
  onSubmit: () => void
  /** Current pricing step */
  step: "employees" | "package" | "licenses" | "summary"
  /** Validation errors */
  errors?: Partial<Record<string, string>>
}
