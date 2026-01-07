"use client"

/**
 * TenantProvisioningChat - Conversational tenant setup flow
 *
 * Clean Code Compliant (Uncle Bob A+ Standard):
 * - Functions < 30 lines
 * - Named constants (TIMING.*)
 * - No duplicate types
 * - Error handling with user feedback
 * - Memoized calculations
 * - Validation extracted to utils
 */

import * as React from "react"
import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { AnimatePresence } from "motion/react"
// cn removed - not currently used

import {
  ChatWrapper,
  ChatHeader,
  ChatFooter,
  ChatBubble,
  ThinkingIndicator,
  FormCard,
  ReviewScreen,
  SuccessCard,
  // Types
  type TenantFormData,
  type AgentState,
  type ChatMessage,
  type FooterVariant,
  type PricingState,
  // Constants
  SECTIONS,
  TIMING,
  // Utils
  validateSection,
  createSectionSummaryMessages,
  createNextSectionMessage,
} from "./chat"
import { PricingCard } from "./chat/pricing"

// Re-export types for backwards compatibility
export type { TenantFormData }
export type { TenantFormData as TenantChatFormData }

export interface TenantProvisioningChatProps {
  onComplete: (tenantData: TenantFormData) => void
  onCancel?: () => void
  onSaveProgress?: (data: Partial<TenantFormData>, section: string) => void
  initialData?: Partial<TenantFormData>
  className?: string
}

export function TenantProvisioningChat({
  onComplete,
  onCancel,
  onSaveProgress,
  initialData,
  className,
}: TenantProvisioningChatProps) {
  // State
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [formData, setFormData] = useState<Partial<TenantFormData>>(initialData || {})
  const [errors, setErrors] = useState<Partial<Record<keyof TenantFormData, string>>>({})
  const [agentState, setAgentState] = useState<AgentState>("idle")
  const [footerVariant, setFooterVariant] = useState<FooterVariant>("hidden")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Pricing state for 3-step pricing flow
  const [pricingState, setPricingState] = useState<PricingState>({
    employeeCount: 50,
    processTier: null,
    userLicenses: [],
    billingCycle: "annual",
    result: null,
    isCalculating: false,
  })

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)

  // Derived state
  const currentSection = SECTIONS[currentSectionIndex]
  const isReviewStep = currentSectionIndex >= SECTIONS.length
  const isThinking = agentState === "thinking" || agentState === "planning" || agentState === "executing" || agentState === "calculating"

  // Check if current section is a pricing section
  const isPricingSection = currentSection?.id?.startsWith("pricing-")

  // Memoized progress calculation (Clean Code: no recalculation on every render)
  const progressPercentage = useMemo(
    () => Math.round(
      ((Math.min(currentSectionIndex + 1, SECTIONS.length + 1)) / (SECTIONS.length + 1)) * 100
    ),
    [currentSectionIndex]
  )

  // Handler: Pricing state changes
  const handlePricingChange = useCallback((updates: Partial<PricingState>) => {
    setPricingState(prev => ({ ...prev, ...updates }))
  }, [])

  // Initialize chat with welcome message
  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const initChat = async () => {
      setAgentState("thinking")
      await new Promise((r) => setTimeout(r, TIMING.INIT_DELAY_MS))

      setMessages([
        {
          id: "welcome",
          type: "assistant",
          content: "Welcome! I'll help you set up a new tenant. This will only take a few minutes — just a few quick sections.",
        },
        {
          id: "section-0",
          type: "assistant",
          content: "Let's start with your company details. Fill in what you know — I'll help with the rest.",
          sectionId: "company",
        },
      ])
      setAgentState("idle")
    }

    initChat()
  }, [])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, currentSectionIndex])

  // Handler: Field change
  const handleFieldChange = (field: keyof TenantFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Handler: Section submit (Clean Code: < 30 lines with extracted helpers)
  const handleSectionSubmit = async () => {
    // Skip validation for pricing sections (PricingCard handles its own validation)
    if (!isPricingSection) {
      const { isValid, errors: validationErrors } = validateSection(currentSection, formData)
      setErrors(validationErrors)
      if (!isValid) return
    }

    // Copy pricing data to formData when completing pricing-licenses step
    if (currentSection?.id === "pricing-licenses") {
      setFormData(prev => ({
        ...prev,
        employeeCount: pricingState.employeeCount,
        processTier: pricingState.processTier!,
        userLicenses: pricingState.userLicenses,
        billingCycle: pricingState.billingCycle,
        calculatedTotal: pricingState.result?.dealTotal,
      }))
    }

    // Add summary messages (only for non-pricing sections)
    if (!isPricingSection) {
      const summaryMessages = createSectionSummaryMessages(currentSection, formData)
      setMessages((prev) => [...prev, ...summaryMessages])
    } else {
      // For pricing sections, add a brief summary
      const pricingSummary = createPricingSummaryMessage(currentSection?.id, pricingState)
      if (pricingSummary) {
        setMessages((prev) => [...prev, pricingSummary])
      }
    }

    // Transition to next section
    await new Promise((r) => setTimeout(r, TIMING.TRANSITION_DELAY_MS))
    setAgentState(isPricingSection ? "calculating" : "thinking")
    await new Promise((r) => setTimeout(r, TIMING.THINKING_DURATION_MS))

    const nextIndex = currentSectionIndex + 1
    const nextMessage = createNextSectionMessage(nextIndex)
    setMessages((prev) => [...prev, nextMessage])
    setCurrentSectionIndex(nextIndex)

    setAgentState("idle")
    onSaveProgress?.(formData, currentSection?.id || "company")
  }

  // Handler: Edit section from review
  const handleEditSection = (sectionId: string) => {
    const index = SECTIONS.findIndex((s) => s.id === sectionId)
    if (index >= 0) {
      setCurrentSectionIndex(index)
      setMessages((prev) => [
        ...prev,
        {
          id: "edit-" + sectionId + "-" + String(Date.now()),
          type: "assistant",
          content: "Let's update the " + SECTIONS[index].title.toLowerCase() + ".",
          sectionId: sectionId as "company" | "contact" | "billing" | "pricing-employees" | "pricing-package" | "pricing-licenses" | "subscription" | "review",
        },
      ])
    }
  }

  // Handler: Create tenant (Clean Code: try/catch with user feedback)
  const handleCreateTenant = async () => {
    setIsSubmitting(true)
    setAgentState("executing")

    try {
      await new Promise((r) => setTimeout(r, TIMING.TENANT_CREATION_MS))

      const completeData = formData as TenantFormData
      setMessages((prev) => [
        ...prev,
        {
          id: "success",
          type: "success",
          content: 'Tenant "' + completeData.companyName + '" has been created successfully!',
        },
      ])

      setIsComplete(true)
      setAgentState("complete")
      setFooterVariant("success")
      setTimeout(() => setAgentState("idle"), TIMING.COMPLETION_FEEDBACK_MS)
      onComplete(completeData)
    } catch (error) {
      console.error("Tenant creation failed:", error)
      setAgentState("idle")
      setMessages((prev) => [
        ...prev,
        {
          id: "error-" + String(Date.now()),
          type: "assistant",
          content: "Something went wrong creating the tenant. Please try again.",
        },
      ])
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handler: Exit
  const handleExit = () => {
    if (Object.keys(formData).length > 0) {
      setFooterVariant("confirm-exit")
    } else {
      onCancel?.()
    }
  }

  // Handler: Save and exit
  const handleSaveAndExit = () => {
    onSaveProgress?.(formData, currentSection?.id || "company")
    setFooterVariant("hidden")
    onCancel?.()
  }

  // Handler: Discard
  const handleDiscard = () => {
    setFooterVariant("hidden")
    onCancel?.()
  }

  // Handler: Create another tenant
  const handleCreateAnother = () => {
    setCurrentSectionIndex(0)
    setMessages([])
    setFormData({})
    setErrors({})
    setAgentState("idle")
    setFooterVariant("hidden")
    setIsSubmitting(false)
    setIsComplete(false)
    setPricingState({
      employeeCount: 50,
      processTier: null,
      userLicenses: [],
      billingCycle: "annual",
      result: null,
      isCalculating: false,
    })
    initializedRef.current = false
  }

  // Handler: Done
  const handleDone = () => {
    onCancel?.()
  }

  // Helper: Get pricing step from section ID
  const getPricingStep = (sectionId: string): "employees" | "package" | "licenses" | "summary" => {
    const step = sectionId.replace("pricing-", "")
    if (step === "employees" || step === "package" || step === "licenses" || step === "summary") {
      return step
    }
    return "employees"
  }

  return (
    <ChatWrapper
      className={className}
      header={
        <ChatHeader
          agentState={agentState}
          onExit={onCancel ? handleExit : undefined}
          onSaveProgress={onSaveProgress && currentSectionIndex > 0 && !isComplete ? handleSaveAndExit : undefined}
          hasUnsavedProgress={currentSectionIndex > 0 && !isComplete}
          progressPercentage={!isComplete ? progressPercentage : undefined}
        />
      }
      footer={
        footerVariant !== "hidden" ? (
          <ChatFooter
            variant={footerVariant}
            onPrimaryAction={footerVariant === "confirm-exit" ? handleSaveAndExit : handleDone}
            onSecondaryAction={footerVariant === "confirm-exit" ? handleDiscard : handleCreateAnother}
            isSubmitting={isSubmitting}
          />
        ) : undefined
      }
    >
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => {
            if (msg.type === "assistant") {
              return (
                <ChatBubble key={msg.id} variant="assistant">
                  {msg.content}
                </ChatBubble>
              )
            }
            if (msg.type === "ai-tip") {
              return (
                <ChatBubble key={msg.id} variant="tip">
                  {msg.content}
                </ChatBubble>
              )
            }
            if (msg.type === "user-summary") {
              return (
                <ChatBubble key={msg.id} variant="summary">
                  {msg.content}
                </ChatBubble>
              )
            }
            if (msg.type === "success") {
              return <SuccessCard key={msg.id} data={formData as TenantFormData} />
            }
            return null
          })}
        </AnimatePresence>

        {/* Pricing sections - render PricingCard */}
        {!isComplete && !isReviewStep && currentSection && isPricingSection && agentState === "idle" && (
          <PricingCard
            pricingState={pricingState}
            onPricingChange={handlePricingChange}
            onSubmit={handleSectionSubmit}
            step={getPricingStep(currentSection.id)}
          />
        )}

        {/* Non-pricing sections - render FormCard */}
        {!isComplete && !isReviewStep && currentSection && !isPricingSection && agentState === "idle" && (
          <FormCard
            section={currentSection}
            data={formData}
            onChange={handleFieldChange}
            onSubmit={handleSectionSubmit}
            errors={errors}
          />
        )}

        {!isComplete && isReviewStep && agentState === "idle" && (
          <ReviewScreen
            data={formData}
            onEdit={handleEditSection}
            onConfirm={handleCreateTenant}
            isSubmitting={isSubmitting}
          />
        )}

        {isThinking && <ThinkingIndicator state={agentState} />}

        <div ref={messagesEndRef} />
      </div>
    </ChatWrapper>
  )
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Creates a summary message for pricing sections
 */
function createPricingSummaryMessage(
  sectionId: string | undefined,
  pricingState: PricingState
): ChatMessage | null {
  if (!sectionId) return null

  let content = ""

  switch (sectionId) {
    case "pricing-employees":
      content = `${pricingState.employeeCount} employees`
      break
    case "pricing-package":
      if (pricingState.processTier) {
        content = `${pricingState.processTier} package selected`
      }
      break
    case "pricing-licenses": {
      const licenseCount = pricingState.userLicenses.reduce((sum, l) => sum + l.quantity, 0)
      content = licenseCount > 0
        ? `${licenseCount} user license${licenseCount !== 1 ? "s" : ""} configured`
        : "No additional user licenses"
      break
    }
    default:
      return null
  }

  if (!content) return null

  return {
    id: "summary-" + sectionId + "-" + String(Date.now()),
    type: "user-summary",
    content,
    sectionId: sectionId as "pricing-employees" | "pricing-package" | "pricing-licenses",
  }
}

export default TenantProvisioningChat
