/**
 * PricingCard Step Content Components
 *
 * Sub-components for each step of the pricing wizard flow.
 * Extracted from PricingCard for clean code compliance (<300 lines per file).
 *
 * @module provisioning/chat/pricing/PricingCardSteps
 */

"use client"

import { NumberStepper } from "../../../ui/number-stepper"
import { ChatProcessSelector } from "./ChatProcessSelector"
import { ChatConfigPanel } from "./ChatConfigPanel"
import { ChatPricingSummary } from "./ChatPricingSummary"
import type { PricingCardProps } from "../types"
import type { ProcessTier, UserLicenseSelection } from "../../../partners/types/pricing.types"

// =============================================================================
// CONSTANTS
// =============================================================================

/** Minimum employee count allowed */
export const MIN_EMPLOYEE_COUNT = 1

/** Maximum employee count allowed */
export const MAX_EMPLOYEE_COUNT = 10000

/** Step increment for employee count stepper */
export const EMPLOYEE_COUNT_STEP = 10

// =============================================================================
// EMPLOYEE STEP
// =============================================================================

export interface EmployeeStepContentProps {
  description: string
  employeeCount: number
  onEmployeeChange: (count: number) => void
  error?: string
}

/** Renders employee count input step */
export function EmployeeStepContent({
  description,
  employeeCount,
  onEmployeeChange,
  error,
}: EmployeeStepContentProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-secondary">{description}</p>
      <div className="flex items-center justify-between p-4 rounded-lg bg-surface border border-default">
        <div>
          <span className="text-sm font-medium text-primary">Employee Count</span>
          <span className="text-xs text-secondary ml-2">
            ({MIN_EMPLOYEE_COUNT.toLocaleString()}–{MAX_EMPLOYEE_COUNT.toLocaleString()})
          </span>
        </div>
        <NumberStepper
          value={employeeCount}
          onChange={onEmployeeChange}
          min={MIN_EMPLOYEE_COUNT}
          max={MAX_EMPLOYEE_COUNT}
          step={EMPLOYEE_COUNT_STEP}
          aria-label="Employee count"
        />
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
}

// =============================================================================
// PACKAGE STEP
// =============================================================================

export interface PackageStepContentProps {
  description: string
  processTier: ProcessTier | null
  onProcessSelect: (tier: ProcessTier) => void
  error?: string
}

/** Renders process package selection step */
export function PackageStepContent({
  description,
  processTier,
  onProcessSelect,
  error,
}: PackageStepContentProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-secondary">{description}</p>
      <ChatProcessSelector selectedTier={processTier} onSelect={onProcessSelect} />
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
}

// =============================================================================
// LICENSE STEP
// =============================================================================

export interface LicenseStepContentProps {
  description: string
  employeeCount: number
  onEmployeeCountChange: (count: number) => void
  userLicenses: UserLicenseSelection[]
  onLicenseChange: (licenses: UserLicenseSelection[]) => void
}

/** Renders user license configuration step */
export function LicenseStepContent({
  description,
  employeeCount,
  onEmployeeCountChange,
  userLicenses,
  onLicenseChange,
}: LicenseStepContentProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-secondary">{description}</p>
      <ChatConfigPanel
        employeeCount={employeeCount}
        onEmployeeCountChange={onEmployeeCountChange}
        userLicenses={userLicenses}
        onLicenseChange={onLicenseChange}
      />
    </div>
  )
}

// =============================================================================
// SUMMARY STEP
// =============================================================================

export interface SummaryStepContentProps {
  description: string
  result: PricingCardProps["pricingState"]["result"]
  billingCycle: "monthly" | "annual"
  onBillingCycleChange: (cycle: "monthly" | "annual") => void
  isCalculating: boolean
}

/** Renders pricing summary step */
export function SummaryStepContent({
  description,
  result,
  billingCycle,
  onBillingCycleChange,
  isCalculating,
}: SummaryStepContentProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-secondary">{description}</p>
      <ChatPricingSummary
        result={result}
        billingCycle={billingCycle}
        onBillingCycleChange={onBillingCycleChange}
        isCalculating={isCalculating}
      />
    </div>
  )
}
