/**
 * ProcessSelector - Package selection with glass styling
 *
 * Visual: Glass Depth 2 with semantic tier colors
 * - Unselected: neutral glass (white/40)
 * - Selected: colored glass (tier color/40)
 *
 * @module partners/PricingCalculator/components/ProcessSelector
 */

import { Package, Check } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import {
  AppCard,
  AppCardContent,
  AppCardHeader,
  AppCardTitle,
  AppCardDescription,
} from '../../../ui/app-card'
import type { ProcessSelectorProps } from '../../types/pricing.types'
import type { ProcessTier } from '../../types/pricing.types'
import { PROCESS_TIER_ORDER, PACKAGE_STYLES, DEFAULT_PRICING_CONFIG } from '../constants'

/**
 * Process package selector with glass card styling.
 * Uses semantic tier colors for visual hierarchy.
 */
export function ProcessSelector({
  processes,
  onChange,
  pricingConfig = DEFAULT_PRICING_CONFIG,
  disabled,
}: ProcessSelectorProps) {
  const selectedTier = processes.length > 0 ? processes[0].tier : null

  const handleSelect = (tier: ProcessTier) => {
    if (disabled) return
    onChange([{ tier, quantity: 1 }])
  }

  return (
    <AppCard
      className="bg-white/40 dark:bg-black/40 backdrop-blur-[4px] !border-2 !border-accent shadow-md"
      data-testid="process-selector-card"
    >
      <AppCardHeader>
        <AppCardTitle className="text-lg flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" aria-hidden="true" />
          Select Package
        </AppCardTitle>
        <AppCardDescription>
          Choose the package that best fits your customer's needs
        </AppCardDescription>
      </AppCardHeader>
      <AppCardContent className="space-y-3">
        {PROCESS_TIER_ORDER.map((tier) => {
          const pricing = pricingConfig.processTiers[tier]
          const style = PACKAGE_STYLES[tier]
          const isSelected = selectedTier === tier

          return (
            <label
              key={tier}
              className={cn(
                // Base glass styling
                'flex cursor-pointer items-center gap-4 rounded-lg p-4 transition-all',
                'backdrop-blur-[4px] border-l-4',
                style.accentClass,
                // Selected vs unselected states
                isSelected
                  ? cn(
                      style.bgClass,
                      'border-2',
                      style.borderClass,
                      'ring-1 ring-accent/30 shadow-md'
                    )
                  : 'bg-white/20 dark:bg-black/20 backdrop-blur-[2px] border-2 border-default hover:bg-white/30 dark:hover:bg-black/30',
                // Disabled state
                disabled && 'cursor-not-allowed opacity-60'
              )}
            >
              {/* Custom Radio */}
              <div
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all',
                  isSelected ? 'border-accent bg-accent' : 'border-subtle'
                )}
              >
                {isSelected && <Check className="h-3 w-3 text-inverse" />}
              </div>

              <input
                type="radio"
                name="process-package"
                value={tier}
                checked={isSelected}
                onChange={() => handleSelect(tier)}
                disabled={disabled}
                className="sr-only"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary">{pricing.name}</span>
                  <span className="text-sm font-bold text-primary">
                    ${pricing.annualPrice.toLocaleString()}
                    <span className="font-normal text-secondary">/yr</span>
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-secondary">{style.description}</p>
              </div>
            </label>
          )
        })}
      </AppCardContent>
    </AppCard>
  )
}
