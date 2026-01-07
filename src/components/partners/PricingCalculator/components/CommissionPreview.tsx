/**
 * CommissionPreview - Commission display with glass styling
 *
 * Visual: Glass Depth 2 with accent tint (matches PricingSummary)
 * Accessibility: Progress bar with ARIA attributes
 * Performance: Consistent JSX structure prevents remount flicker
 *
 * @module partners/PricingCalculator/components/CommissionPreview
 */

import { Percent } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import type { CommissionPreviewProps } from '../../types/pricing.types'
import { formatCurrency } from '../utils/pricing-calculations'

/**
 * Commission preview display with glass card styling.
 * Shows tier status, commission amount, and progress to next tier.
 *
 * Uses consistent wrapper to prevent layout shift/flicker on state changes.
 */
export function CommissionPreview({
  commission,
  tierStatus,
  dealTotal,
  loading,
}: CommissionPreviewProps) {
  // Derived values (compute even when not displayed to keep structure stable)
  const hasData = !loading && commission && dealTotal > 0
  const commissionTier = commission?.commissionTier ?? 1
  const commissionRate = commission?.commissionRate ?? 0.33
  const commissionAmount = commission?.commissionAmount ?? 0
  const tierUpgraded = commission?.tierUpgraded ?? false
  const ratePercent = (commissionRate * 100).toFixed(0)

  // Progress calculation: use projected YTD (after this deal) not current YTD
  // commission.ytdSalesAfter = projected YTD after this deal closes
  // Fallback: tierStatus.ytdSales + dealTotal if API doesn't provide ytdSalesAfter
  const baseYtd = tierStatus?.ytdSales ?? 0
  const ytdSalesAfter =
    commission?.ytdSalesAfter && commission.ytdSalesAfter > 0
      ? commission.ytdSalesAfter
      : baseYtd + dealTotal
  const amountToNextTier = Math.max(0, 250000 - ytdSalesAfter)
  const progressPercent = Math.min(100, (ytdSalesAfter / 250000) * 100)

  // Consistent wrapper - same structure for all states to prevent remount
  return (
    <div
      className="bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent/60 rounded-lg p-6 shadow-md"
      data-slot="partner-commission"
    >
      {/* Header - always visible */}
      <div className="flex items-center gap-2 mb-4">
        <Percent className="h-5 w-5 text-accent" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-primary">Your Commission</h3>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-accent/20 rounded w-1/3" />
          <div className="h-16 bg-accent/20 rounded" />
        </div>
      )}

      {/* Empty state */}
      {!loading && !hasData && (
        <div className="text-center py-4">
          <p className="text-secondary text-sm">Select a package to preview earnings</p>
        </div>
      )}

      {/* Data state */}
      {hasData && (
        <>
          {/* Tier Badge and Rate */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className={cn(
                'inline-flex items-center rounded-full px-3 py-1.5 text-sm font-bold',
                commissionTier === 2
                  ? 'bg-warning text-warning-dark'
                  : 'bg-[#14161E] text-white' // ABYSS[800] + white = 18.05:1 AAA
              )}
            >
              Tier {commissionTier}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-primary">{ratePercent}</span>
              <span className="text-lg text-secondary">%</span>
            </div>
          </div>

          {/* Commission Amount Card */}
          <div className="rounded-lg bg-white/60 dark:bg-black/60 border border-default p-4 mb-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[11px] text-secondary uppercase tracking-wide">On this deal</p>
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(commissionAmount)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-secondary uppercase tracking-wide">Deal value</p>
                <p className="text-lg font-semibold text-primary">
                  {formatCurrency(dealTotal)}
                </p>
              </div>
            </div>
          </div>

          {/* Tier Upgrade Notice */}
          {tierUpgraded && (
            <div className="rounded-lg bg-warning/40 border border-warning p-3 mb-4">
              <p className="text-sm font-medium text-warning-dark">
                This deal upgrades you to Tier 2 - 50% commission on future deals!
              </p>
            </div>
          )}

          {/* Progress to Next Tier - shows projected YTD after this deal */}
          {commissionTier === 1 && amountToNextTier > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-secondary font-medium">Progress to Tier 2</span>
                <span className="text-primary font-medium">
                  ${ytdSalesAfter.toLocaleString()} / $250,000
                </span>
              </div>
              {/* ARIA-accessible progress bar - high contrast colors */}
              <div
                className="h-3 rounded-full bg-muted-bg dark:bg-muted-bg overflow-hidden border border-default"
                role="progressbar"
                aria-valuenow={Math.round(progressPercent)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progress to Tier 2"
              >
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-secondary mt-1.5">
                ${amountToNextTier.toLocaleString()} more to unlock 50% commission
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
