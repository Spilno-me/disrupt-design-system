/**
 * OrganizationSizeSelector - Tier-based organization size dropdown
 *
 * Displays 6 organization size tiers with user ranges and annual platform base prices.
 * Replaces employee count input for TenantRequestWizard flow.
 *
 * Visual: Glass Depth 2 (40% opacity) card wrapper
 * UX: Dropdown shows tier label, user range, and price per tier
 *
 * @module partners/PricingCalculator/components/OrganizationSizeSelector
 */

import { Building2, Info } from 'lucide-react'
import {
  AppCard,
  AppCardContent,
  AppCardHeader,
  AppCardTitle,
} from '../../../ui/app-card'
import { Label } from '../../../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../ui/tooltip'
import type { OrganizationSizeTier } from '../../types/pricing.types'
import { ORG_SIZE_TIERS, ORG_SIZE_TIER_ORDER } from '../constants'

export interface OrganizationSizeSelectorProps {
  /** Currently selected organization size tier */
  value: OrganizationSizeTier | ''
  /** Callback when tier selection changes */
  onChange: (tier: OrganizationSizeTier | '') => void
  /** Disable interactions */
  disabled?: boolean
  /** Hide the card wrapper (for inline usage) */
  inline?: boolean
  /** Custom test ID prefix */
  testId?: string
}

/**
 * Formats currency for display (e.g., $3,000/yr)
 */
function formatPrice(price: number): string {
  return `$${price.toLocaleString('en-US')}/yr`
}

/**
 * Organization size tier selector with dropdown.
 * Shows tier name, user range, and platform base price for each option.
 */
export function OrganizationSizeSelector({
  value,
  onChange,
  disabled,
  inline = false,
  testId = 'org-size-selector',
}: OrganizationSizeSelectorProps) {
  const selectedTier = value ? ORG_SIZE_TIERS[value] : null

  const content = (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="organization-size">Organization Size</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-secondary" aria-hidden="true" />
            </TooltipTrigger>
            <TooltipContent>
              Platform base price is determined by organization size tier
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Select
        value={value}
        onValueChange={(newValue) => onChange(newValue as OrganizationSizeTier | '')}
        disabled={disabled}
      >
        <SelectTrigger
          id="organization-size"
          className="w-full"
          data-testid={`${testId}-trigger`}
          aria-label="Organization size"
        >
          <SelectValue placeholder="Select organization size">
            {selectedTier && (
              <span className="flex items-center justify-between w-full">
                <span>
                  {selectedTier.label} ({selectedTier.userRange})
                </span>
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent data-testid={`${testId}-content`}>
          {ORG_SIZE_TIER_ORDER.map((tier) => {
            const config = ORG_SIZE_TIERS[tier]
            return (
              <SelectItem
                key={tier}
                value={tier}
                data-testid={`${testId}-option-${tier}`}
              >
                <span className="flex items-center justify-between w-full gap-4">
                  <span className="flex flex-col">
                    <span className="font-medium">{config.label}</span>
                    <span className="text-xs text-secondary">{config.userRange}</span>
                  </span>
                  <span className="text-sm font-semibold text-accent-strong">
                    {formatPrice(config.annualPrice)}
                  </span>
                </span>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>

      {/* Selected tier price display */}
      {selectedTier && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary">Platform Base Price</span>
          <span className="font-semibold text-primary">
            {formatPrice(selectedTier.annualPrice)}
          </span>
        </div>
      )}

      {/* Hint text when no selection */}
      {!selectedTier && (
        <p className="text-xs text-secondary text-center">
          Select your organization size to see platform pricing
        </p>
      )}
    </div>
  )

  // Inline mode: no card wrapper
  if (inline) {
    return <div data-testid={testId}>{content}</div>
  }

  // Default: wrapped in AppCard with Glass Depth 2 styling
  return (
    <AppCard
      className="bg-white/40 dark:bg-black/40 backdrop-blur-[4px] !border-2 !border-accent shadow-md"
      data-testid={testId}
    >
      <AppCardHeader>
        <AppCardTitle className="text-lg flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" aria-hidden="true" />
          Organization Size
        </AppCardTitle>
      </AppCardHeader>
      <AppCardContent>{content}</AppCardContent>
    </AppCard>
  )
}
