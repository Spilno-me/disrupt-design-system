/**
 * Tenant Provisioning Chat Constants
 *
 * Static data and validation helpers for the conversational tenant setup flow.
 */

import { Building2, User, MapPin, Calculator, Package, Users } from "lucide-react"
import { createElement } from "react"
import type { FormSection, SectionId, TenantFormData } from "./types"

// =============================================================================
// DROPDOWN OPTIONS
// =============================================================================

export const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC",
] as const

export const COUNTRIES = [
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
] as const

export const INDUSTRIES = [
  "Manufacturing",
  "Healthcare",
  "Construction",
  "Energy",
  "Transportation",
  "Other",
] as const

export const COMPANY_SIZES = ["1-50", "51-200", "201-500", "501-1000", "1000+"] as const

export const PRICING_TIERS = ["Starter", "Professional", "Enterprise"] as const

export const BILLING_CYCLES = ["Monthly", "Annually (Save 20%)"] as const

// =============================================================================
// TIMING CONSTANTS (Clean Code: Named constants instead of magic numbers)
// =============================================================================

export const TIMING = {
  /** Delay before showing initial welcome message */
  INIT_DELAY_MS: 300,
  /** Delay between section transitions */
  TRANSITION_DELAY_MS: 200,
  /** Duration of "thinking" animation */
  THINKING_DURATION_MS: 400,
  /** Simulated tenant creation time */
  TENANT_CREATION_MS: 1500,
  /** Duration to show completion feedback before reset */
  COMPLETION_FEEDBACK_MS: 2000,
} as const

// =============================================================================
// SECTION CONFIGURATION
// =============================================================================

export const SECTIONS: FormSection[] = [
  {
    id: "company",
    title: "Company Information",
    icon: createElement(Building2, { className: "w-4 h-4" }),
    fields: ["companyName", "industry", "companySize"],
    aiTip: (data) => {
      if (data.industry === "Manufacturing") {
        return "Manufacturing companies often benefit from our compliance modules. I'll make sure those are available in your setup."
      }
      if (data.industry === "Healthcare") {
        return "Healthcare organizations have specific HIPAA compliance needs. Our Professional tier includes healthcare-specific features."
      }
      if (data.companySize === "1000+") {
        return "Enterprise-scale companies often benefit from dedicated support. Consider our Enterprise tier for priority assistance."
      }
      return null
    },
  },
  {
    id: "contact",
    title: "Primary Contact",
    icon: createElement(User, { className: "w-4 h-4" }),
    fields: ["contactName", "contactEmail", "contactPhone"],
    aiTip: (data) => {
      if (data.contactEmail && data.companyName) {
        return `A welcome email will be sent to ${data.contactEmail} once the tenant is created.`
      }
      return null
    },
  },
  {
    id: "billing",
    title: "Billing Address",
    icon: createElement(MapPin, { className: "w-4 h-4" }),
    fields: ["billingStreet", "billingCity", "billingCountry", "billingState", "billingZip"],
  },
  // ---------------------------------------------------------------------------
  // Pricing sections (3-step flow)
  // ---------------------------------------------------------------------------
  {
    id: "pricing-employees",
    title: "Employee Count",
    icon: createElement(Calculator, { className: "w-4 h-4" }),
    fields: ["employeeCount"],
    aiTip: (data) => {
      if (data.employeeCount && data.employeeCount >= 500) {
        return "With 500+ employees, you may qualify for enterprise volume discounts. I'll make sure to apply any available discounts."
      }
      return null
    },
  },
  {
    id: "pricing-package",
    title: "Process Package",
    icon: createElement(Package, { className: "w-4 h-4" }),
    fields: ["processTier"],
    aiTip: (data) => {
      if (data.industry === "Manufacturing" && data.processTier === "standard") {
        return "Manufacturing companies often benefit from our Premium tier which includes advanced compliance tracking."
      }
      if (data.industry === "Healthcare" && data.processTier !== "industry") {
        return "Healthcare organizations may need our Industry tier for HIPAA-specific features and dedicated support."
      }
      return null
    },
  },
  {
    id: "pricing-licenses",
    title: "User Licenses",
    icon: createElement(Users, { className: "w-4 h-4" }),
    fields: ["userLicenses"],
    aiTip: (data) => {
      if (data.billingCycle === "annual") {
        return "Great choice! Annual billing saves you 20% compared to monthly payments."
      }
      return null
    },
  },
  // Legacy subscription section (deprecated - kept for backwards compatibility)
  // TODO: Remove in v3.0
  // {
  //   id: "subscription",
  //   title: "Subscription",
  //   icon: createElement(CreditCard, { className: "w-4 h-4" }),
  //   fields: ["pricingTier", "billingCycle"],
  // },
]

// =============================================================================
// SECTION MESSAGES
// =============================================================================

export const SECTION_MESSAGES: Record<SectionId, string> = {
  company:
    "Let's start with your company details. Fill in what you know — I'll help with the rest.",
  contact: "Now let's set up the primary contact for this tenant.",
  billing: "Almost there! I need the billing address for invoices.",
  // Pricing flow (3-step)
  "pricing-employees":
    "Let's figure out your pricing. How many employees does this company have?",
  "pricing-package":
    "Great! Now which process package fits their needs best?",
  "pricing-licenses":
    "Would you like to add any user licenses? These are optional.",
  // Legacy (deprecated - kept for backwards compatibility)
  subscription: "Finally, choose your pricing plan.",
  review:
    "Here's a summary of the tenant you're about to create. Review and confirm when ready.",
}

// =============================================================================
// PRICING DETAILS
// =============================================================================

/**
 * @deprecated Use pricing calculator instead. This is kept for legacy UI only.
 */
export const PLAN_DETAILS: Record<string, { price: string; desc: string }> = {
  Starter: { price: "$299/mo", desc: "Essential features for small teams" },
  Professional: { price: "$599/mo", desc: "Advanced tools for growing businesses" },
  Enterprise: { price: "$1,299/mo", desc: "Full platform with dedicated support" },
}

// =============================================================================
// FIELD CONFIGURATION
// =============================================================================

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "select"
  | "radio"
  | "plan"
  | "cycle"
  | "number"           // For employee count
  | "process-tier"     // For process package selection
  | "user-licenses"    // For license configuration

export interface FieldConfig {
  label: string
  type: FieldType
  placeholder: string
  options?: readonly string[]
}

export const FIELD_CONFIG: Partial<Record<keyof TenantFormData, FieldConfig>> = {
  // Company section
  companyName: { label: "Company Name", type: "text", placeholder: "Acme Corporation" },
  industry: {
    label: "Industry",
    type: "select",
    placeholder: "Select industry...",
    options: INDUSTRIES,
  },
  companySize: { label: "Company Size", type: "radio", placeholder: "", options: COMPANY_SIZES },
  // Contact section
  contactName: { label: "Full Name", type: "text", placeholder: "John Smith" },
  contactEmail: { label: "Email Address", type: "email", placeholder: "john@company.com" },
  contactPhone: { label: "Phone (optional)", type: "tel", placeholder: "+1 555 123 4567" },
  // Billing address section
  billingStreet: { label: "Street Address", type: "text", placeholder: "123 Main St, Suite 100" },
  billingCity: { label: "City", type: "text", placeholder: "New York" },
  billingCountry: {
    label: "Country",
    type: "select",
    placeholder: "Select country...",
    options: COUNTRIES,
  },
  billingState: {
    label: "State",
    type: "select",
    placeholder: "Select state...",
    options: US_STATES,
  },
  billingZip: { label: "ZIP Code", type: "text", placeholder: "10001" },
  // Pricing section (new 3-step flow)
  employeeCount: {
    label: "Number of Employees",
    type: "number",
    placeholder: "Enter employee count",
  },
  processTier: {
    label: "Process Package",
    type: "process-tier",
    placeholder: "Select a package",
  },
  userLicenses: {
    label: "User Licenses",
    type: "user-licenses",
    placeholder: "Configure licenses (optional)",
  },
  billingCycle: {
    label: "Billing Cycle",
    type: "cycle",
    placeholder: "",
    options: BILLING_CYCLES,
  },
  // Legacy fields (deprecated - kept for backwards compatibility)
  pricingTier: {
    label: "Pricing Plan",
    type: "plan",
    placeholder: "",
    options: PRICING_TIERS,
  },
}

// =============================================================================
// AGENT STATUS TEXT
// =============================================================================

export function getAgentStatusText(state: string): string {
  switch (state) {
    case "thinking":
      return "Processing..."
    case "planning":
      return "Planning..."
    case "executing":
      return "Creating tenant..."
    case "calculating":
      return "Calculating pricing..."
    case "complete":
      return "Complete!"
    default:
      return "Ready to help"
  }
}
