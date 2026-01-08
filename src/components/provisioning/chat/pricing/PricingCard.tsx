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

import { useMemo, useCallback, useEffect, useRef } from "react"
import { motion } from "motion/react"
import { ChevronRight, Users, Package, Settings2, DollarSign } from "lucide-react"
import { Button } from "../../../ui/button"
import type { PricingCardProps, PricingStep } from "../types"
import type { ProcessTier, ProcessSelection, UserLicenseSelection } from "../../../partners/types/pricing.types"
import { calculatePricingResult } from "../../../partners/PricingCalculator/utils/pricing-calculations"
import { DEFAULT_PRICING_CONFIG } from "../../../partners/PricingCalculator/constants"
import {
  EmployeeStepContent,
  PackageStepContent,
  LicenseStepContent,
  SummaryStepContent,
  MIN_EMPLOYEE_COUNT,
  MAX_EMPLOYEE_COUNT,
} from "./PricingCardSteps"

// =============================================================================
// CONSTANTS
// =============================================================================

/** Delay in ms before triggering calculation (UX smoothing) */
const CALCULATION_DELAY_MS = 150

/** Configuration for each pricing wizard step */
const STEP_CONFIG: Record<PricingStep, {
  title: string
  icon: typeof Users
  description: string
}> = {
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
}

// =============================================================================
// HOOKS
// =============================================================================

/** Validates if user can proceed to next step based on current state */
function useCanContinue(
  step: PricingStep,
  employeeCount: number,
  processTier: ProcessTier | null,
  result: PricingCardProps["pricingState"]["result"]
): boolean {
  return useMemo(() => {
    switch (step) {
      case "employees":
        return employeeCount >= MIN_EMPLOYEE_COUNT && employeeCount <= MAX_EMPLOYEE_COUNT
      case "package":
        return processTier !== null
      case "licenses":
        return true // Licenses are optional
      case "summary":
        return result !== null
      default:
        return false
    }
  }, [step, employeeCount, processTier, result])
}

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

  // Ref to avoid triggering effect on callback identity change
  const onPricingChangeRef = useRef(onPricingChange)
  onPricingChangeRef.current = onPricingChange

  // ---------------------------------------------------------------------------
  // Calculation Effect
  // ---------------------------------------------------------------------------

  const processSelection: ProcessSelection[] = useMemo(() => {
    if (!processTier) return []
    return [{ tier: processTier, quantity: 1 }]
  }, [processTier])

  useEffect(() => {
    if (!processTier) {
      if (result !== null) {
        onPricingChangeRef.current({ result: null })
      }
      return
    }

    onPricingChangeRef.current({ isCalculating: true })

    const timer = setTimeout(() => {
      const newResult = calculatePricingResult(
        employeeCount,
        processSelection,
        userLicenses,
        DEFAULT_PRICING_CONFIG
      )
      onPricingChangeRef.current({ result: newResult, isCalculating: false })
    }, CALCULATION_DELAY_MS)

    return () => clearTimeout(timer)
  }, [employeeCount, processTier, processSelection, userLicenses, result])

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleEmployeeChange = useCallback(
    (count: number) => onPricingChange({ employeeCount: count }),
    [onPricingChange]
  )

  const handleProcessSelect = useCallback(
    (tier: ProcessTier) => onPricingChange({ processTier: tier }),
    [onPricingChange]
  )

  const handleLicenseChange = useCallback(
    (licenses: UserLicenseSelection[]) => onPricingChange({ userLicenses: licenses }),
    [onPricingChange]
  )

  const handleBillingCycleChange = useCallback(
    (cycle: "monthly" | "annual") => onPricingChange({ billingCycle: cycle }),
    [onPricingChange]
  )

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  const canContinue = useCanContinue(step, employeeCount, processTier, result)

  // ---------------------------------------------------------------------------
  // Render Step Content
  // ---------------------------------------------------------------------------

  const renderStepContent = () => {
    switch (step) {
      case "employees":
        return (
          <EmployeeStepContent
            description={stepConfig.description}
            employeeCount={employeeCount}
            onEmployeeChange={handleEmployeeChange}
            error={errors.employeeCount}
          />
        )
      case "package":
        return (
          <PackageStepContent
            description={stepConfig.description}
            processTier={processTier}
            onProcessSelect={handleProcessSelect}
            error={errors.processTier}
          />
        )
      case "licenses":
        return (
          <LicenseStepContent
            description={stepConfig.description}
            employeeCount={employeeCount}
            onEmployeeCountChange={handleEmployeeChange}
            userLicenses={userLicenses}
            onLicenseChange={handleLicenseChange}
          />
        )
      case "summary":
        return (
          <SummaryStepContent
            description={stepConfig.description}
            result={result}
            billingCycle={billingCycle}
            onBillingCycleChange={handleBillingCycleChange}
            isCalculating={isCalculating}
          />
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
          <StepIcon className="size-4 text-accent" aria-hidden="true" />
          <span className="text-sm font-semibold text-accent">{stepConfig.title}</span>
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
            <ChevronRight className="size-4 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

PricingCard.displayName = "PricingCard"
