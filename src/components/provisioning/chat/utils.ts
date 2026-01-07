/**
 * Tenant Provisioning Chat Utilities
 *
 * Pure validation functions extracted from the main component
 * for Clean Code compliance (functions < 30 lines, single responsibility).
 */

import type { TenantFormData, FormSection, ChatMessage, SectionId } from "./types"
import { SECTIONS, SECTION_MESSAGES } from "./constants"

// =============================================================================
// VALIDATION RESULT TYPE
// =============================================================================

export interface ValidationResult {
  isValid: boolean
  errors: Partial<Record<keyof TenantFormData, string>>
}

// =============================================================================
// FIELD VALIDATORS
// =============================================================================

export function validatePhone(phone: string): boolean {
  if (!phone) return true
  const cleaned = phone.replace(/[\s()-]/g, "")
  return /^\+?\d{10,15}$/.test(cleaned)
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validateZip(zip: string, country: string): boolean {
  if (country === "United States") {
    return /^\d{5}(-\d{4})?$/.test(zip)
  }
  return zip.length > 0
}

// =============================================================================
// SECTION VALIDATION
// =============================================================================

export function validateSection(
  section: FormSection,
  formData: Partial<TenantFormData>
): ValidationResult {
  const errors: Partial<Record<keyof TenantFormData, string>> = {}
  let isValid = true

  for (const field of section.fields) {
    if (field === "billingState" && formData.billingCountry !== "United States") {
      continue
    }

    // Skip pricing fields - they are validated by PricingCard
    if (field === "employeeCount" || field === "processTier" || field === "userLicenses" || field === "calculatedTotal") {
      continue
    }

    const rawValue = formData[field]
    const value = typeof rawValue === "string" ? rawValue : ""

    if (field !== "contactPhone" && !value.trim()) {
      errors[field] = "This field is required"
      isValid = false
      continue
    }

    if (field === "contactEmail" && !validateEmail(value)) {
      errors[field] = "Please enter a valid email address"
      isValid = false
    }
    if (field === "contactPhone" && value && !validatePhone(value)) {
      errors[field] = "Please enter a valid phone number"
      isValid = false
    }
    if (field === "billingZip" && !validateZip(value, formData.billingCountry || "")) {
      errors[field] = formData.billingCountry === "United States"
        ? "Please enter a valid ZIP code (e.g., 12345)"
        : "Please enter a valid postal code"
      isValid = false
    }
  }

  return { isValid, errors }
}

// =============================================================================
// MESSAGE HELPERS
// =============================================================================

export function createSectionSummaryMessages(
  section: FormSection,
  formData: Partial<TenantFormData>
): ChatMessage[] {
  const summaryParts = section.fields
    .filter((f) => f !== "billingState" || formData.billingCountry === "United States")
    .map((f) => formData[f])
    .filter(Boolean)

  const messages: ChatMessage[] = [
    {
      id: "summary-" + section.id,
      type: "user-summary",
      content: summaryParts.join(" • "),
      sectionId: section.id,
    },
  ]

  if (section.aiTip) {
    const tip = section.aiTip(formData)
    if (tip) {
      messages.push({
        id: "tip-" + section.id,
        type: "ai-tip",
        content: tip,
      })
    }
  }

  return messages
}

export function createNextSectionMessage(nextIndex: number): ChatMessage {
  if (nextIndex < SECTIONS.length) {
    const nextSection = SECTIONS[nextIndex]
    return {
      id: "section-" + nextIndex,
      type: "assistant",
      content: SECTION_MESSAGES[nextSection.id],
      sectionId: nextSection.id,
    }
  }

  return {
    id: "review-intro",
    type: "assistant",
    content: SECTION_MESSAGES.review,
    sectionId: "review" as SectionId,
  }
}
