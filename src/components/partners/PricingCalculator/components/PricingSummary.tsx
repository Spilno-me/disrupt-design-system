/**
 * PricingSummary - Pricing breakdown display with glass styling
 *
 * Visual: Glass Depth 2 + sticky positioning
 * Shows platform base, processes, licenses, and total
 * Performance: Consistent JSX structure prevents remount flicker
 *
 * @module partners/PricingCalculator/components/PricingSummary
 */

import { DollarSign } from 'lucide-react'
import {
  AppCard,
  AppCardContent,
  AppCardHeader,
  AppCardTitle,
} from '../../../ui/app-card'
import type { PricingSummaryProps } from '../../types/pricing.types'
import { formatCurrency } from '../utils/pricing-calculations'
import { ORG_SIZE_TIERS } from '../constants'

/**
 * Pricing summary display with glass card styling.
 * Sticky sidebar positioning for visibility during scrolling.
 *
 * Uses consistent wrapper to prevent layout shift/flicker on state changes.
 */
export function PricingSummary({ result, loading, organizationSize }: PricingSummaryProps) {
  const hasData = !loading && result
  const orgSizeTier = organizationSize ? ORG_SIZE_TIERS[organizationSize] : null

  // Consistent wrapper - same structure for all states to prevent remount
  return (
    <AppCard
      className="!bg-white/40 dark:!bg-black/40 backdrop-blur-[4px] !border-2 !border-accent shadow-md"
      data-testid="pricing-summary-card"
    >
      <AppCardHeader>
        <AppCardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" aria-hidden="true" />
          Pricing Summary
        </AppCardTitle>
      </AppCardHeader>
      <AppCardContent>
        {/* Loading state */}
        {loading && (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-accent/20 rounded w-full" />
            <div className="h-4 bg-accent/20 rounded w-3/4" />
            <div className="h-8 bg-accent/20 rounded w-1/2 mt-4" />
          </div>
        )}

        {/* Empty state */}
        {!loading && !hasData && (
          <div className="text-center py-6">
            <DollarSign className="h-8 w-8 text-muted mx-auto mb-3" aria-hidden="true" />
            <p className="text-primary font-medium mb-1">No package selected</p>
            <p className="text-secondary text-sm">Select a package to see pricing</p>
          </div>
        )}

        {/* Data state */}
        {hasData && (
          <div className="space-y-4">
            {/* Platform Base */}
            <div className="flex justify-between text-sm">
              <span className="text-secondary">
                Platform Base
                {orgSizeTier && (
                  <span className="text-xs ml-1">({orgSizeTier.label})</span>
                )}
              </span>
              <span className="text-primary font-medium">
                {formatCurrency(result.platformBase)}
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
                    <span className="text-primary">{formatCurrency(item.lineTotal)}</span>
                  </div>
                ))}
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
                {result.userLicenses.breakdown.map((item) => (
                  <div key={item.tier} className="flex justify-between">
                    <span className="text-secondary">
                      {item.tierLabel} (x{item.quantity})
                    </span>
                    <span className="text-primary">{formatCurrency(item.lineTotal)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            <div className="border-t border-strong pt-4">
              <div className="flex justify-between items-baseline">
                <span className="text-primary font-medium">Total (Annual)</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(result.dealTotal)}
                </span>
              </div>
              <p className="text-xs text-secondary text-right mt-1">
                {formatCurrency(result.dealTotal / 12)}/month
              </p>
            </div>
          </div>
        )}
      </AppCardContent>
    </AppCard>
  )
}
