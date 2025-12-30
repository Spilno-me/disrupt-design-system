/**
 * LocationRiskSummary - Compact risk panel for LocationInfo
 *
 * Displays key risk metrics in a compact format:
 * - Trending alert (if worsening)
 * - Safety score indicator
 * - Incident count by severity
 * - Days since last incident
 * - Quick action buttons
 */

import * as React from 'react'
import {
  AlertTriangle,
  Shield,
  Calendar,
  ExternalLink,
  ClipboardCheck,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'
import { TrendingRiskAlert } from './TrendingRiskAlert'
import type { LocationRiskSummaryProps, RiskSeverity, RiskTrend } from './types'
import { DEFAULT_SAFETY_THRESHOLDS } from './types'

// =============================================================================
// HELPERS
// =============================================================================

function getSafetyColor(score: number): string {
  if (score < DEFAULT_SAFETY_THRESHOLDS.critical) return 'text-error'
  if (score < DEFAULT_SAFETY_THRESHOLDS.warning) return 'text-warning-dark'
  return 'text-success'
}

function getSafetyBgColor(score: number): string {
  if (score < DEFAULT_SAFETY_THRESHOLDS.critical) return 'bg-error'
  if (score < DEFAULT_SAFETY_THRESHOLDS.warning) return 'bg-warning'
  return 'bg-success'
}

function getSafetyLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 80) return 'Good'
  if (score >= 70) return 'Fair'
  if (score >= 60) return 'Needs Attention'
  if (score >= 40) return 'At Risk'
  return 'Critical'
}

function getTrendIcon(trend: RiskTrend) {
  switch (trend) {
    case 'improving':
      return <TrendingDown className="size-3.5 text-success" />
    case 'worsening':
      return <TrendingUp className="size-3.5 text-error" />
    default:
      return <Minus className="size-3.5 text-tertiary" />
  }
}

function formatDaysSince(days: number | null): string {
  if (days === null) return 'No incidents'
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days} days ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)}+ years ago`
}

// =============================================================================
// SEVERITY BAR
// =============================================================================

function SeverityBar({
  bySeverity,
  total,
}: {
  bySeverity: { critical: number; high: number; medium: number; low: number }
  total: number
}) {
  if (total === 0) return null

  const segments = [
    { severity: 'critical' as const, count: bySeverity.critical, color: 'bg-error' },
    { severity: 'high' as const, count: bySeverity.high, color: 'bg-warning' },
    { severity: 'medium' as const, count: bySeverity.medium, color: 'bg-amber-400' },
    { severity: 'low' as const, count: bySeverity.low, color: 'bg-success' },
  ].filter((s) => s.count > 0)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-tertiary">By Severity</span>
        <span className="font-medium text-secondary">{total} total</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-muted-bg">
        {segments.map(({ severity, count, color }) => (
          <Tooltip key={severity}>
            <TooltipTrigger asChild>
              <div
                className={cn('h-full transition-all', color)}
                style={{ width: `${(count / total) * 100}%` }}
              />
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs capitalize">
                {severity}: {count} ({Math.round((count / total) * 100)}%)
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
        {segments.map(({ severity, count, color }) => (
          <div key={severity} className="flex items-center gap-1">
            <div className={cn('size-2 rounded-full', color)} />
            <span className="capitalize text-tertiary">{severity}</span>
            <span className="font-medium text-secondary">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function LocationRiskSummary({
  riskData,
  onViewIncidents,
  onScheduleAudit,
  className,
}: LocationRiskSummaryProps) {
  const { safetyScore, totalCount, bySeverity, trend, trendPercentage, daysSinceLastIncident } =
    riskData

  // Calculate previous count for trend alert
  const previousCount =
    trend !== 'stable' && trendPercentage !== 0
      ? Math.round(totalCount / (1 + trendPercentage / 100))
      : totalCount

  return (
    <div className={cn('space-y-4', className)}>
      {/* Trending Alert */}
      {trend === 'worsening' && trendPercentage > 15 && (
        <TrendingRiskAlert
          trend={trend}
          trendPercentage={trendPercentage}
          currentCount={totalCount}
          previousCount={previousCount}
          periodLabel="vs last 30 days"
        />
      )}

      {/* Safety Score Card */}
      <div className="flex items-center gap-4 p-4 rounded-lg border border-default bg-muted-bg/30">
        {/* Score circle */}
        <div className="relative">
          <div
            className={cn(
              'flex items-center justify-center size-16 rounded-full border-4',
              safetyScore < DEFAULT_SAFETY_THRESHOLDS.critical
                ? 'border-error/30 bg-error/10'
                : safetyScore < DEFAULT_SAFETY_THRESHOLDS.warning
                  ? 'border-warning/30 bg-warning/10'
                  : 'border-success/30 bg-success/10'
            )}
          >
            <span className={cn('text-2xl font-bold tabular-nums', getSafetyColor(safetyScore))}>
              {safetyScore}
            </span>
          </div>
          {/* Trend indicator */}
          <div className="absolute -bottom-1 -right-1 p-0.5 bg-surface rounded-full">
            {getTrendIcon(trend)}
          </div>
        </div>

        {/* Score details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-tertiary" />
            <span className="text-sm font-medium text-primary">Safety Score</span>
          </div>
          <p className={cn('text-sm font-semibold mt-0.5', getSafetyColor(safetyScore))}>
            {getSafetyLabel(safetyScore)}
          </p>
          <div className="mt-2 h-1.5 w-full bg-muted-bg rounded-full overflow-hidden">
            <div
              className={cn('h-full transition-all rounded-full', getSafetyBgColor(safetyScore))}
              style={{ width: `${safetyScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Incident Summary */}
      {totalCount > 0 ? (
        <div className="space-y-3">
          {/* Severity breakdown */}
          <SeverityBar bySeverity={bySeverity} total={totalCount} />

          {/* Last incident */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="size-4 text-tertiary" />
            <span className="text-tertiary">Last incident:</span>
            <span
              className={cn(
                'font-medium',
                daysSinceLastIncident !== null && daysSinceLastIncident < 7
                  ? 'text-error'
                  : 'text-secondary'
              )}
            >
              {formatDaysSince(daysSinceLastIncident)}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 rounded-lg border border-success/30 bg-success/5">
          <div className="flex size-10 items-center justify-center rounded-full bg-success/10">
            <Shield className="size-5 text-success" />
          </div>
          <div>
            <p className="text-sm font-medium text-success-dark">No Incidents Recorded</p>
            <p className="text-xs text-tertiary">This location has a clean safety record.</p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 pt-2">
        {onViewIncidents && totalCount > 0 && (
          <Button variant="outline" size="sm" onClick={onViewIncidents} className="flex-1">
            <AlertTriangle className="size-4 mr-1.5" />
            View Incidents
            <ExternalLink className="size-3 ml-1 text-tertiary" />
          </Button>
        )}
        {onScheduleAudit && (
          <Button
            variant={safetyScore < DEFAULT_SAFETY_THRESHOLDS.warning ? 'default' : 'outline'}
            size="sm"
            onClick={onScheduleAudit}
            className="flex-1"
          >
            <ClipboardCheck className="size-4 mr-1.5" />
            Schedule Audit
          </Button>
        )}
      </div>
    </div>
  )
}

LocationRiskSummary.displayName = 'LocationRiskSummary'

export default LocationRiskSummary
