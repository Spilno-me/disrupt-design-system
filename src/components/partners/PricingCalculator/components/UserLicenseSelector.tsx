/**
 * UserLicenseSelector - Combined configuration panel
 *
 * Includes:
 * - Employee count (determines platform tier)
 * - User license quantities with live line totals
 *
 * Visual: Glass Depth 2 (40% opacity)
 * UX: Compact inline layout with NumberStepper controls
 *
 * @module partners/PricingCalculator/components/UserLicenseSelector
 */

import { Settings2 } from 'lucide-react'
import {
  AppCard,
  AppCardContent,
  AppCardHeader,
  AppCardTitle,
} from '../../../ui/app-card'
import { NumberStepper } from '../../../ui/number-stepper'
import type { UserLicenseSelectorProps, UserLicenseTier } from '../../types/pricing.types'
import { LICENSE_TIER_ORDER, DEFAULT_PRICING_CONFIG } from '../constants'

/** Extended props to include employee count */
export interface ConfigurationPanelProps extends UserLicenseSelectorProps {
  /** Current employee count value */
  employeeCount?: number
  /** Callback when employee count changes */
  onEmployeeCountChange?: (count: number) => void
}

/**
 * Combined configuration panel with employee count and user licenses.
 * Compact inline layout with NumberStepper controls.
 */
export function UserLicenseSelector({
  licenses,
  onChange,
  pricingConfig = DEFAULT_PRICING_CONFIG,
  disabled,
  employeeCount,
  onEmployeeCountChange,
}: ConfigurationPanelProps) {
  const getQuantity = (tier: UserLicenseTier): number => {
    return licenses.find((l) => l.tier === tier)?.quantity ?? 0
  }

  const setQuantity = (tier: UserLicenseTier, quantity: number) => {
    const updated = LICENSE_TIER_ORDER.map((t) => ({
      tier: t,
      quantity: t === tier ? Math.max(0, quantity) : getQuantity(t),
    })).filter((l) => l.quantity > 0)
    onChange(updated)
  }

  const getLineTotal = (tier: UserLicenseTier): number => {
    const quantity = getQuantity(tier)
    const monthlyPrice = pricingConfig.userLicenses[tier].monthlyPrice
    return quantity * monthlyPrice
  }

  const totalUsers = licenses.reduce((sum, l) => sum + l.quantity, 0)
  const monthlyTotal = licenses.reduce((sum, l) => {
    const config = pricingConfig.userLicenses[l.tier]
    return sum + config.monthlyPrice * l.quantity
  }, 0)

  return (
    <AppCard
      className="bg-white/40 dark:bg-black/40 backdrop-blur-[4px] !border-2 !border-accent shadow-md"
      data-testid="configuration-panel"
    >
      <AppCardHeader className="pb-2">
        <AppCardTitle className="text-lg flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary" aria-hidden="true" />
          Configuration
        </AppCardTitle>
      </AppCardHeader>
      <AppCardContent className="space-y-3">
        {/* Employee Count Row (if props provided) */}
        {employeeCount !== undefined && onEmployeeCountChange && (
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
        )}

        {/* License Rows */}
        <div className="space-y-0">
          {LICENSE_TIER_ORDER.map((tier) => {
            const config = pricingConfig.userLicenses[tier]
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
                  <span className="text-xs text-secondary ml-1">(${config.monthlyPrice}/mo)</span>
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

        {/* Compact Summary */}
        <div className="flex items-center justify-between pt-2 border-t border-default">
          <span className="text-sm text-secondary">
            {totalUsers} users • ${monthlyTotal.toLocaleString()}/mo
          </span>
          <span className="text-lg font-bold text-accent">
            ${(monthlyTotal * 12).toLocaleString()}/yr
          </span>
        </div>
      </AppCardContent>
    </AppCard>
  )
}
