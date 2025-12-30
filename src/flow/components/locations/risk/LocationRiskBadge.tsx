/**
 * LocationRiskBadge - Incident count badge for tree items
 *
 * Displays a compact badge showing:
 * - Incident count (rolled-up or direct)
 * - Severity-colored indicator
 * - Optional trend arrow
 *
 * Designed to fit within LocationTreeItem without disrupting layout.
 */

import * as React from 'react'
import { AlertTriangle, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../../../components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'
import type { LocationRiskBadgeProps, RiskSeverity, RiskTrend } from './types'

// =============================================================================
// SEVERITY COLOR MAPPING
// =============================================================================

const SEVERITY_COLORS: Record<RiskSeverity, { bg: string; text: string; border: string }> = {
  critical: {
    bg: 'bg-error/15',
    text: 'text-error',
    border: 'border-error/30',
  },
  high: {
    bg: 'bg-warning/15',
    text: 'text-warning-dark',
    border: 'border-warning/30',
  },
  medium: {
    bg: 'bg-warning/15',
    text: 'text-warning-dark',
    border: 'border-warning/30',
  },
  low: {
    bg: 'bg-success/15',
    text: 'text-success-dark',
    border: 'border-success/30',
  },
  none: {
    bg: 'bg-muted-bg',
    text: 'text-tertiary',
    border: 'border-default',
  },
}

// =============================================================================
// TREND ICON
// =============================================================================

function TrendIcon({ trend, className }: { trend: RiskTrend; className?: string }) {
  const iconClass = cn('size-3', className)

  switch (trend) {
    case 'improving':
      return <TrendingDown className={cn(iconClass, 'text-success')} />
    case 'worsening':
      return <TrendingUp className={cn(iconClass, 'text-error')} />
    default:
      return <Minus className={cn(iconClass, 'text-tertiary')} />
  }
}

// =============================================================================
// TOOLTIP CONTENT
// =============================================================================

function RiskTooltipContent({
  riskData,
  showRolledUp,
}: {
  riskData: NonNullable<LocationRiskBadgeProps['riskData']>
  showRolledUp: boolean
}) {
  const { directCount, totalCount, bySeverity, trend, trendPercentage, daysSinceLastIncident } =
    riskData

  return (
    <div className="space-y-2 min-w-40">
      {/* Incident counts */}
      <div className="flex items-center justify-between">
        <span className="text-tertiary text-xs">
          {showRolledUp ? 'Total Incidents' : 'Direct Incidents'}
        </span>
        <span className="font-semibold">{showRolledUp ? totalCount : directCount}</span>
      </div>

      {showRolledUp && directCount !== totalCount && (
        <div className="flex items-center justify-between text-xs text-tertiary">
          <span>At this location</span>
          <span>{directCount}</span>
        </div>
      )}

      {/* Severity breakdown */}
      <div className="pt-1 border-t border-default space-y-1">
        <span className="text-xs text-tertiary">By Severity</span>
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
          {bySeverity.critical > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-error">Critical</span>
              <span className="font-medium">{bySeverity.critical}</span>
            </div>
          )}
          {bySeverity.high > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-warning-dark">High</span>
              <span className="font-medium">{bySeverity.high}</span>
            </div>
          )}
          {bySeverity.medium > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-warning-dark">Medium</span>
              <span className="font-medium">{bySeverity.medium}</span>
            </div>
          )}
          {bySeverity.low > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-success-dark">Low</span>
              <span className="font-medium">{bySeverity.low}</span>
            </div>
          )}
        </div>
      </div>

      {/* Trend */}
      {trend !== 'stable' && (
        <div className="flex items-center justify-between pt-1 border-t border-default text-xs">
          <span className="text-tertiary">Trend</span>
          <span
            className={cn(
              'flex items-center gap-1',
              trend === 'improving' ? 'text-success' : 'text-error'
            )}
          >
            <TrendIcon trend={trend} />
            {trendPercentage > 0 ? '+' : ''}
            {trendPercentage}%
          </span>
        </div>
      )}

      {/* Days since last incident */}
      {daysSinceLastIncident !== null && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-tertiary">Last incident</span>
          <span>
            {daysSinceLastIncident === 0
              ? 'Today'
              : daysSinceLastIncident === 1
                ? 'Yesterday'
                : `${daysSinceLastIncident} days ago`}
          </span>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function LocationRiskBadge({
  riskData,
  showRolledUp = true,
  size = 'sm',
  showTrend = false,
  className,
}: LocationRiskBadgeProps) {
  // Don't render if no risk data or no incidents
  if (!riskData) return null

  const count = showRolledUp ? riskData.totalCount : riskData.directCount
  if (count === 0) return null

  const severity = riskData.highestSeverity
  const colors = SEVERITY_COLORS[severity]

  const badge = (
    <Badge
      variant="outline"
      size={size}
      className={cn(
        'shrink-0 gap-1',
        colors.bg,
        colors.text,
        colors.border,
        // Pulse animation for critical severity
        severity === 'critical' && 'animate-pulse',
        className
      )}
    >
      {severity === 'critical' && <AlertTriangle className="size-3" />}
      <span className="font-semibold tabular-nums">{count}</span>
      {showTrend && riskData.trend !== 'stable' && (
        <TrendIcon trend={riskData.trend} className="size-2.5" />
      )}
    </Badge>
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>{badge}</TooltipTrigger>
      <TooltipContent side="top" className="p-3">
        <RiskTooltipContent riskData={riskData} showRolledUp={showRolledUp} />
      </TooltipContent>
    </Tooltip>
  )
}

LocationRiskBadge.displayName = 'LocationRiskBadge'

export default LocationRiskBadge
