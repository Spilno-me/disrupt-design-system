/**
 * ComplianceBadge - Training compliance status indicator
 *
 * Displays a user's or location's training compliance status with
 * appropriate semantic colors and icons.
 *
 * @example
 * ```tsx
 * <ComplianceBadge status="compliant" />
 * <ComplianceBadge status="expiring_soon" showLabel />
 * <ComplianceBadge status="non_compliant" size="lg" />
 * ```
 */

import * as React from 'react'
import {
  ShieldCheck,
  AlertTriangle,
  ShieldX,
  Minus,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../../../components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'
import type { ComplianceStatus } from '../types'
import { COMPLIANCE_STATUS_CONFIG } from '../types'

// =============================================================================
// TYPES
// =============================================================================

export interface ComplianceBadgeProps {
  /** Compliance status to display */
  status: ComplianceStatus
  /** Show text label alongside icon */
  showLabel?: boolean
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Additional class names */
  className?: string
  /** Show tooltip with description */
  showTooltip?: boolean
  /** Custom tooltip content */
  tooltipContent?: React.ReactNode
}

// =============================================================================
// ICON MAP
// =============================================================================

const ICON_MAP = {
  compliant: ShieldCheck,
  expiring_soon: AlertTriangle,
  non_compliant: ShieldX,
  not_applicable: Minus,
}

// =============================================================================
// SIZE CONFIGS
// =============================================================================

const SIZE_CONFIG = {
  sm: {
    badge: 'text-xs px-1.5 py-0.5',
    icon: 'size-3',
    iconOnly: 'size-5',
  },
  md: {
    badge: 'text-xs px-2 py-0.5',
    icon: 'size-3.5',
    iconOnly: 'size-6',
  },
  lg: {
    badge: 'text-sm px-2.5 py-1',
    icon: 'size-4',
    iconOnly: 'size-7',
  },
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ComplianceBadge({
  status,
  showLabel = false,
  size = 'md',
  className,
  showTooltip = true,
  tooltipContent,
}: ComplianceBadgeProps) {
  const config = COMPLIANCE_STATUS_CONFIG[status]
  const Icon = ICON_MAP[status]
  const sizeConfig = SIZE_CONFIG[size]

  const badge = (
    <Badge
      variant={config.variant}
      className={cn(
        'gap-1 font-medium',
        showLabel ? sizeConfig.badge : 'p-1',
        className
      )}
    >
      <Icon className={showLabel ? sizeConfig.icon : sizeConfig.iconOnly} />
      {showLabel && <span>{config.label}</span>}
    </Badge>
  )

  if (!showTooltip) {
    return badge
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          {tooltipContent || (
            <div className="space-y-1">
              <p className="font-medium">{config.label}</p>
              <p className="text-xs text-muted">{config.description}</p>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

ComplianceBadge.displayName = 'ComplianceBadge'

export default ComplianceBadge
