/**
 * TrendingRiskAlert - Warning banner for negative risk trends
 *
 * Displays an alert banner when a location shows worsening incident trends.
 * Used in LocationRiskSummary and LocationRiskTab to highlight concerning patterns.
 */

import * as React from 'react'
import { AlertTriangle, TrendingUp, TrendingDown, X } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import type { TrendingRiskAlertProps } from './types'

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function TrendingRiskAlert({
  trend,
  trendPercentage,
  currentCount,
  previousCount,
  periodLabel = 'this period',
  onDismiss,
  className,
}: TrendingRiskAlertProps) {
  // Don't show for stable or improving trends
  if (trend !== 'worsening') return null

  const isSignificant = Math.abs(trendPercentage) > 25

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border',
        // Background and border colors based on severity
        isSignificant
          ? 'bg-error/10 border-error/30'
          : 'bg-warning/10 border-warning/30',
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full',
          isSignificant ? 'bg-error/20' : 'bg-warning/20'
        )}
      >
        <AlertTriangle
          className={cn(
            'size-4',
            isSignificant ? 'text-error' : 'text-warning-dark'
          )}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4
          className={cn(
            'font-semibold text-sm',
            isSignificant ? 'text-error' : 'text-warning-dark'
          )}
        >
          {isSignificant ? 'Significant Increase in Incidents' : 'Rising Incident Trend'}
        </h4>

        <p className="text-sm text-secondary mt-1">
          Incidents are up{' '}
          <span
            className={cn(
              'font-semibold',
              isSignificant ? 'text-error' : 'text-warning-dark'
            )}
          >
            {trendPercentage > 0 ? '+' : ''}
            {trendPercentage}%
          </span>{' '}
          {periodLabel}.
        </p>

        {/* Comparison */}
        <div className="flex items-center gap-4 mt-2 text-xs text-tertiary">
          <div className="flex items-center gap-1">
            <span>Previous:</span>
            <span className="font-medium text-secondary">{previousCount}</span>
          </div>
          <TrendingUp className="size-3 text-error" />
          <div className="flex items-center gap-1">
            <span>Current:</span>
            <span className="font-medium text-secondary">{currentCount}</span>
          </div>
        </div>

        {/* Recommendation */}
        {isSignificant && (
          <p className="text-xs text-tertiary mt-2 italic">
            Consider scheduling a safety audit to investigate root causes.
          </p>
        )}
      </div>

      {/* Dismiss button */}
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          className="size-7 shrink-0 -mt-1 -mr-1"
          onClick={onDismiss}
          aria-label="Dismiss alert"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  )
}

TrendingRiskAlert.displayName = 'TrendingRiskAlert'

export default TrendingRiskAlert
