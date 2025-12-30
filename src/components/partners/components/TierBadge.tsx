/**
 * TierBadge - Displays partner tier as a styled badge
 * @module partners/components/TierBadge
 */

import { cn } from "../../../lib/utils"
import type { PartnerTier } from "../types"

interface TierBadgeProps {
  /** Partner tier level */
  tier: PartnerTier
}

const TIER_CONFIG: Record<PartnerTier, { label: string; className: string }> = {
  Standard: {
    label: "Standard",
    className: "border-success text-primary bg-success-light"
  },
  Premium: {
    label: "Premium",
    className: "border-accent text-primary bg-accent-bg"
  },
  Enterprise: {
    label: "Enterprise",
    className: "border-default text-primary bg-muted-bg"
  },
}

/**
 * TierBadge - Renders a styled badge showing partner tier level
 */
export function TierBadge({ tier }: TierBadgeProps) {
  const config = TIER_CONFIG[tier]

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
