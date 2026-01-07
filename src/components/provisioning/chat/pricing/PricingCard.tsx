/**
 * PricingCard - Orchestrator for chat-based pricing flow
 *
 * Coordinates the 3 pricing sub-components (Process, Config, Summary)
 * and manages pricing state/calculations. Adapts display based on
 * the current step in the conversational flow.
 *
 * Steps:
 * 1. "employees" - Employee count input (determines platform tier)
 * 2. "package" - Process tier selection (Starter/Pro/Enterprise/Industry)
 * 3. "licenses" - User license configuration
 * 4. "summary" - Full pricing breakdown with billing toggle
 *
 * Visual: DDS Glass Depth 2 card with accent border
 *
 * @module provisioning/chat/pricing/PricingCard
 */

"use client"

import { useMemo, useCallback, useEffect } from "react"
import { motion } from "motion/react"
import { ChevronRight, Users, Package, Settings2, DollarSign } from "lucide-react"
import { Button } from "../../../ui/button"
import { NumberStepper } from "../../../ui/number-stepper"
import { ChatProcessSelector } from "./ChatProcessSelector"
import { ChatConfigPanel } from "./ChatConfigPanel"
import { ChatPricingSummary } from "./ChatPricingSummary"
import type { PricingCardProps } from "../types"
import type { ProcessTier, ProcessSelection } from "../../../partners/types/pricing.types"
import { calculatePricingResult } from "../../../partners/PricingCalculator/utils/pricing-calculations"
import { DEFAULT_PRICING_CONFIG } from "../../../partners/PricingCalculator/constants"

// =============================================================================
// CONSTANTS
// =============================================================================

const STEP_CONFIG = {
  employees: {
    title: "Company Size",
    icon: Users,
    description: "How many employees does this company have?",
  },
  package: {
    title: "Process Package",
    icon: Package,
    description: "Which package fits their needs?",
  },
  licenses: {
    title: "User Licenses",
    icon: Settings2,
    description: "Configure user access levels",
  },
  summary: {
    title: "Pricing Summary",
    icon: DollarSign,
    description: "Review the total pricing",
  },
} as const

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Pricing card orchestrator for conversational tenant setup.
 * Renders step-appropriate content and manages calculations.
 */
export function PricingCard({
  pricingState,
  onPricingChange,
  onSubmit,
  step,
  errors = {},
}: PricingCardProps) {
  const {
    employeeCount,
    processTier,
    userLicenses,
    billingCycle,
    result,
    isCalculating,
  } = pricingState

  const stepConfig = STEP_CONFIG[step]
  const StepIcon = stepConfig.icon

  // ---------------------------------------------------------------------------
  // Calculation Effect
  // ---------------------------------------------------------------------------

  /**
   * Recalculate pricing when inputs change.
   * Uses memoized ProcessSelection array from processTier.
   */
  const processSelection: ProcessSelection[] = useMemo(() => {
    if (!processTier) return []
    return [{ tier: processTier, quantity: 1 }]
  }, [processTier])

  // Calculate pricing result when we have process selection
  useEffect(() => {
    // Only calculate when we have a process tier selected
    if (!processTier) {
      if (result !== null) {
        onPricingChange({ result: null })
      }
      return
    }

    // Set calculating state
    onPricingChange({ isCalculating: true })

    // Calculate (simulated small delay for UX)
    const timer = setTimeout(() => {
      const newResult = calculatePricingResult(
        employeeCount,
        processSelection,
        userLicenses,
        DEFAULT_PRICING_CONFIG
      )
      onPricingChange({ result: newResult, isCalculating: false })
    }, 150)

    return () => clearTimeout(timer)
  }, [employeeCount, processTier, processSelection, userLicenses])

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleEmployeeChange = useCallback(
    (count: number) => {
      onPricingChange({ employeeCount: count })
    },
    [onPricingChange]
  )

  const handleProcessSelect = useCallback(
    (tier: ProcessTier) => {
      onPricingChange({ processTier: tier })
    },
    [onPricingChange]
  )

  const handleLicenseChange = useCallback(
    (licenses: typeof userLicenses) => {
      onPricingChange({ userLicenses: licenses })
    },
    [onPricingChange]
  )

  const handleBillingCycleChange = useCallback(
    (cycle: "monthly" | "annual") => {
      onPricingChange({ billingCycle: cycle })
    },
    [onPricingChange]
  )

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  const canContinue = useMemo(() => {
    switch (step) {
      case "employees":
        return employeeCount >= 1 && employeeCount <= 10000
      case "package":
        return processTier !== null
      case "licenses":
        // Licenses are optional, can continue with 0
        return true
      case "summary":
        return result !== null
      default:
        return false
    }
  }, [step, employeeCount, processTier, result])

  // ---------------------------------------------------------------------------
  // Render Step Content
  // ---------------------------------------------------------------------------

  const renderStepContent = () => {
    switch (step) {
      case "employees":
        return (
          <div className="space-y-4">
            <p className="text-sm text-secondary">{stepConfig.description}</p>
            <div className="flex items-center justify-between p-4 rounded-lg bg-surface border border-default">
              <div>
                <span className="text-sm font-medium text-primary">
                  Employee Count
                </span>
                <span className="text-xs text-secondary ml-2">
                  (1–10,000)
                </span>
              </div>
              <NumberStepper
                value={employeeCount}
                onChange={handleEmployeeChange}
                min={1}
                max={10000}
                step={10}
                aria-label="Employee count"
              />
            </div>
            {errors.employeeCount && (
              <p className="text-xs text-error">{errors.employeeCount}</p>
            )}
          </div>
        )

      case "package":
        return (
          <div className="space-y-4">
            <p className="text-sm text-secondary">{stepConfig.description}</p>
            <ChatProcessSelector
              selectedTier={processTier}
              onSelect={handleProcessSelect}
            />
            {errors.processTier && (
              <p className="text-xs text-error">{errors.processTier}</p>
            )}
          </div>
        )

      case "licenses":
        return (
          <div className="space-y-4">
            <p className="text-sm text-secondary">{stepConfig.description}</p>
            <ChatConfigPanel
              employeeCount={employeeCount}
              onEmployeeCountChange={handleEmployeeChange}
              userLicenses={userLicenses}
              onLicenseChange={handleLicenseChange}
            />
          </div>
        )

      case "summary":
        return (
          <div className="space-y-4">
            <p className="text-sm text-secondary">{stepConfig.description}</p>
            <ChatPricingSummary
              result={result}
              billingCycle={billingCycle}
              onBillingCycleChange={handleBillingCycleChange}
              isCalculating={isCalculating}
            />
          </div>
        )

      default:
        return null
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="ml-11"
      data-testid="pricing-card"
    >
      {/* DDS Glass Depth 2 */}
      <div className="overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent rounded-lg shadow-md">
        {/* Header - accent tint */}
        <div className="px-4 py-3 flex items-center gap-2 bg-accent/10 dark:bg-accent/5 border-b border-accent/30">
          <StepIcon className="w-4 h-4 text-accent" aria-hidden="true" />
          <span className="text-sm font-semibold text-accent">
            {stepConfig.title}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">{renderStepContent()}</div>

        {/* Submit Button */}
        <div className="px-4 pb-4">
          <Button
            type="button"
            variant="accent"
            className="w-full font-medium"
            onClick={onSubmit}
            disabled={!canContinue || isCalculating}
          >
            {step === "summary" ? "Confirm Pricing" : "Continue"}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

PricingCard.displayName = "PricingCard"
