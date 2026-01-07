/**
 * ChatConfigPanel - Configuration panel for chat-based pricing flow
 *
 * Combines employee count input and user license selection in a compact
 * glass-styled card. Adapted from UserLicenseSelector for conversational UI.
 *
 * Visual: Glass Depth 2 (40% opacity, 4px blur)
 * UX: Compact inline layout with NumberStepper controls
 *
 * @module provisioning/chat/pricing/ChatConfigPanel
 */

import { Settings2 } from 'lucide-react'
import {
  AppCard,
  AppCardContent,
  AppCardHeader,
  AppCardTitle,
} from '../../../ui/app-card'
import { NumberStepper } from '../../../ui/number-stepper'
import type { ChatConfigPanelProps } from '../types'
import type { UserLicenseTier } from '../../../partners/types/pricing.types'
import {
  LICENSE_TIER_ORDER,
  DEFAULT_PRICING_CONFIG,
} from '../../../partners/PricingCalculator/constants'

/**
 * Configuration panel with employee count and user license selection.
 * Uses glass styling (Depth 2) for visual hierarchy in chat flow.
 */
export function ChatConfigPanel({
  employeeCount,
  onEmployeeCountChange,
  userLicenses,
  onLicenseChange,
  disabled = false,
}: ChatConfigPanelProps) {
  // ---------------------------------------------------------------------------
  // License quantity helpers
  // ---------------------------------------------------------------------------

  const getQuantity = (tier: UserLicenseTier): number => {
    return userLicenses.find((l) => l.tier === tier)?.quantity ?? 0
  }

  const setQuantity = (tier: UserLicenseTier, quantity: number) => {
    const updated = LICENSE_TIER_ORDER.map((t) => ({
      tier: t,
      quantity: t === tier ? Math.max(0, quantity) : getQuantity(t),
    })).filter((l) => l.quantity > 0)
    onLicenseChange(updated)
  }

  const getLineTotal = (tier: UserLicenseTier): number => {
    const quantity = getQuantity(tier)
    const monthlyPrice = DEFAULT_PRICING_CONFIG.userLicenses[tier].monthlyPrice
    return quantity * monthlyPrice
  }

  // ---------------------------------------------------------------------------
  // Summary calculations
  // ---------------------------------------------------------------------------

  const totalUsers = userLicenses.reduce((sum, l) => sum + l.quantity, 0)
  const monthlyTotal = userLicenses.reduce((sum, l) => {
    const config = DEFAULT_PRICING_CONFIG.userLicenses[l.tier]
    return sum + config.monthlyPrice * l.quantity
  }, 0)
  const annualTotal = monthlyTotal * 12

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <AppCard
      className="bg-white/40 dark:bg-black/40 backdrop-blur-[4px] !border-2 !border-accent shadow-md"
      data-testid="chat-config-panel"
    >
      <AppCardHeader className="pb-2">
        <AppCardTitle className="text-lg flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary" aria-hidden="true" />
          Configuration
        </AppCardTitle>
      </AppCardHeader>

      <AppCardContent className="space-y-3">
        {/* Employee Count Row */}
        <div className="flex items-center justify-between gap-3 py-2 border-b border-subtle">
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-primary">Employee Count</span>
            <span className="text-xs text-secondary ml-1">(platform tier)</span>
          </div>
          <NumberStepper
            value={employeeCount}
            onChange={onEmployeeCountChange}
            min={1}
            max={10000}
            step={10}
            disabled={disabled}
            aria-label="Employee count"
          />
          <div className="w-24 text-right text-xs text-secondary">
            1–10,000
          </div>
        </div>

        {/* License Rows */}
        <div className="space-y-0">
          {LICENSE_TIER_ORDER.map((tier) => {
            const config = DEFAULT_PRICING_CONFIG.userLicenses[tier]
            const quantity = getQuantity(tier)
            const lineTotal = getLineTotal(tier)

            return (
              <div
                key={tier}
                className="flex items-center justify-between gap-3 py-2 border-b border-subtle last:border-0"
              >
                {/* Label: Name + Price */}
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-primary">{config.name}</span>
                  <span className="text-xs text-secondary ml-1">
                    (${config.monthlyPrice}/mo)
                  </span>
                </div>

                {/* Stepper */}
                <NumberStepper
                  value={quantity}
                  onChange={(value) => setQuantity(tier, value)}
                  min={0}
                  max={999}
                  disabled={disabled}
                  aria-label={`${config.name} licenses`}
                />

                {/* Line Total */}
                <div className="w-24 text-right text-sm font-medium text-accent">
                  {lineTotal > 0 ? `$${lineTotal.toLocaleString()}` : '—'}
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-default">
          <span className="text-sm text-secondary">
            {totalUsers} users • ${monthlyTotal.toLocaleString()}/mo
          </span>
          <span className="text-lg font-bold text-accent">
            ${annualTotal.toLocaleString()}/yr
          </span>
        </div>
      </AppCardContent>
    </AppCard>
  )
}

ChatConfigPanel.displayName = 'ChatConfigPanel'
