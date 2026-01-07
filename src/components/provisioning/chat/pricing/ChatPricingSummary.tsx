/**
 * ChatPricingSummary - Pricing breakdown display for conversational flow
 *
 * Visual: Glass Depth 2 styling (bg-white/40 backdrop-blur-[4px])
 * Shows platform base, processes, licenses, volume discount, and total.
 * Includes billing cycle toggle with annual discount note.
 *
 * @module provisioning/chat/pricing/ChatPricingSummary
 */

import { DollarSign } from "lucide-react"
import type { ChatPricingSummaryProps } from "../types"
import type { PricingCalculationResult } from "../../../partners/types/pricing.types"
import { formatCurrency } from "../../../partners/PricingCalculator/utils/pricing-calculations"
import {
  AppCard,
  AppCardContent,
  AppCardHeader,
  AppCardTitle,
} from "../../../ui/app-card"

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

/** Loading skeleton placeholder */
function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-3" data-testid="pricing-loading">
      <div className="h-4 bg-accent/20 rounded w-full" />
      <div className="h-4 bg-accent/20 rounded w-3/4" />
      <div className="h-4 bg-accent/20 rounded w-5/6" />
      <div className="h-8 bg-accent/20 rounded w-1/2 mt-4" />
    </div>
  )
}

/** Empty state when no pricing result */
function EmptyState() {
  return (
    <div className="text-center py-6" data-testid="pricing-empty">
      <DollarSign
        className="h-8 w-8 text-muted mx-auto mb-3"
        aria-hidden="true"
      />
      <p className="text-primary font-medium mb-1">No pricing calculated</p>
      <p className="text-secondary text-sm">
        Complete the pricing steps to see your total
      </p>
    </div>
  )
}

/** Billing cycle toggle component */
interface BillingToggleProps {
  billingCycle: "monthly" | "annual"
  onBillingCycleChange: (cycle: "monthly" | "annual") => void
}

function BillingToggle({ billingCycle, onBillingCycleChange }: BillingToggleProps) {
  return (
    <div className="flex items-center justify-between mb-4 pb-4 border-b border-subtle">
      <span className="text-sm text-secondary">Billing Cycle</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onBillingCycleChange("monthly")}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            billingCycle === "monthly"
              ? "bg-accent text-primary font-medium"
              : "text-secondary hover:text-primary"
          }`}
          aria-pressed={billingCycle === "monthly"}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => onBillingCycleChange("annual")}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            billingCycle === "annual"
              ? "bg-accent text-primary font-medium"
              : "text-secondary hover:text-primary"
          }`}
          aria-pressed={billingCycle === "annual"}
        >
          Annual
        </button>
      </div>
    </div>
  )
}

/** Pricing breakdown display */
interface PricingBreakdownProps {
  result: PricingCalculationResult
  billingCycle: "monthly" | "annual"
}

function PricingBreakdown({ result, billingCycle }: PricingBreakdownProps) {
  // Calculate monthly equivalent if annual billing
  const displayTotal =
    billingCycle === "annual" ? result.dealTotal : result.dealTotal / 12
  const periodLabel = billingCycle === "annual" ? "Annual" : "Monthly"

  return (
    <div className="space-y-4">
      {/* Platform Base */}
      <div className="flex justify-between text-sm">
        <span className="text-secondary">Platform Base</span>
        <span className="text-primary font-medium">
          {formatCurrency(result.platformBase)}
          <span className="text-secondary text-xs ml-1">/yr</span>
        </span>
      </div>

      {/* Processes */}
      {result.processes.breakdown.length > 0 && (
        <div className="space-y-2 text-sm">
          {result.processes.breakdown.map((item) => (
            <div key={item.tier} className="flex justify-between">
              <span className="text-secondary">
                {item.tierLabel} (x{item.quantity})
              </span>
              <span className="text-primary">
                {formatCurrency(item.lineTotal)}
              </span>
            </div>
          ))}

          {/* Volume Discount */}
          {result.processes.volumeDiscountAmount > 0 && (
            <div className="flex justify-between font-medium">
              <span className="text-success">
                Volume Discount ({result.processes.volumeDiscountPercent}%)
              </span>
              <span className="text-success">
                -{formatCurrency(result.processes.volumeDiscountAmount)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* User Licenses */}
      {result.userLicenses.breakdown.length > 0 && (
        <div className="space-y-2 text-sm border-t border-subtle pt-4">
          <p className="text-secondary font-medium mb-2">User Licenses</p>
          {result.userLicenses.breakdown.map((item) => (
            <div key={item.tier} className="flex justify-between">
              <span className="text-secondary">
                {item.tierLabel} (x{item.quantity})
              </span>
              <span className="text-primary">
                {formatCurrency(item.lineTotal)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Total */}
      <div className="border-t border-strong pt-4">
        <div className="flex justify-between items-baseline">
          <span className="text-primary font-medium">Total ({periodLabel})</span>
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(displayTotal)}
          </span>
        </div>

        {/* Show alternative period */}
        <p className="text-xs text-secondary text-right mt-1">
          {billingCycle === "annual" ? (
            <>{formatCurrency(result.dealTotal / 12)}/month</>
          ) : (
            <>{formatCurrency(result.dealTotal)}/year</>
          )}
        </p>

        {/* Annual discount note */}
        {billingCycle === "annual" && (
          <p className="text-xs text-success text-right mt-1">
            Save 20% with annual billing
          </p>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Pricing summary display for conversational tenant setup.
 * Shows pricing breakdown with billing cycle toggle.
 *
 * Uses Glass Depth 2 styling for card presentation.
 */
export function ChatPricingSummary({
  result,
  billingCycle,
  onBillingCycleChange,
  isCalculating = false,
}: ChatPricingSummaryProps) {
  const hasData = !isCalculating && result !== null

  return (
    <AppCard
      className="!bg-white/40 dark:!bg-black/40 backdrop-blur-[4px] !border-2 !border-accent shadow-md"
      data-testid="chat-pricing-summary"
    >
      <AppCardHeader>
        <AppCardTitle className="text-lg flex items-center gap-2">
          <DollarSign
            className="h-5 w-5 text-primary"
            aria-hidden="true"
          />
          Pricing Summary
        </AppCardTitle>
      </AppCardHeader>

      <AppCardContent>
        {/* Billing cycle toggle - always visible when not calculating */}
        {!isCalculating && (
          <BillingToggle
            billingCycle={billingCycle}
            onBillingCycleChange={onBillingCycleChange}
          />
        )}

        {/* Loading state */}
        {isCalculating && <LoadingSkeleton />}

        {/* Empty state */}
        {!isCalculating && !hasData && <EmptyState />}

        {/* Data state */}
        {hasData && result && (
          <PricingBreakdown result={result} billingCycle={billingCycle} />
        )}
      </AppCardContent>
    </AppCard>
  )
}
