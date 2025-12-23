/**
 * IncidentDetailsHeader - Main header for incident details page
 *
 * Displays incident ID, description, stats, and refresh button.
 * Uses severity to color the hazard icon.
 *
 * @example
 * ```tsx
 * <IncidentDetailsHeader
 *   incidentId="INC-51634456533"
 *   title="Chemical Spill reported near Loading Dock"
 *   severity="high"
 *   stepsCompleted={0}
 *   stepsTotal={2}
 *   documentsCount={2}
 *   daysOpen={1}
 *   onRefresh={() => refetch()}
 * />
 * ```
 */

import * as React from 'react'
import { TriangleAlert, RefreshCw } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { CopyableId } from '../../../ui/table/CopyableId'
import { IncidentStatsBar } from './IncidentStatsBar'
import type { IncidentDetailsHeaderProps, IncidentSeverity } from '../types'

/**
 * Severity-based colors for the hazard icon
 */
const severityIconColors: Record<IncidentSeverity, string> = {
  critical: 'text-error',
  high: 'text-aging-dark dark:text-aging',
  medium: 'text-warning-dark dark:text-warning',
  low: 'text-success',
  none: 'text-info',
}

/**
 * IncidentDetailsHeader - Incident header with ID, stats, and actions
 */
export function IncidentDetailsHeader({
  incidentId,
  title,
  severity,
  stepsCompleted,
  stepsTotal,
  documentsCount,
  daysOpen,
  onRefresh,
  className,
}: IncidentDetailsHeaderProps) {
  return (
    <div
      className={cn(
        // DAPS: Card on page = bg-elevated + shadow-md (Closer = Lighter)
        'bg-elevated border border-default rounded-xl p-4',
        'shadow-md',
        className
      )}
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Left side: Icon, ID, and description */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Hazard icon with severity color */}
          <div className="flex-shrink-0 mt-0.5">
            <TriangleAlert
              className={cn('size-6', severityIconColors[severity])}
              aria-hidden="true"
            />
          </div>

          <div className="flex-1 min-w-0">
            {/* Incident ID with copy button */}
            <div className="flex items-center gap-2 mb-1">
              <CopyableId id={incidentId} className="text-lg font-semibold" />
            </div>

            {/* Description text */}
            <p className="text-sm text-secondary line-clamp-2">
              {title}
            </p>
          </div>
        </div>

        {/* Right side: Stats and refresh */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <IncidentStatsBar
            stepsCompleted={stepsCompleted}
            stepsTotal={stepsTotal}
            documentsCount={documentsCount}
            daysOpen={daysOpen}
          />

          {/* Refresh button */}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className={cn(
                'p-2 rounded-lg',
                // Responsive touch targets: 44px mobile, 32px desktop
                'min-h-11 min-w-11 lg:min-h-8 lg:min-w-8',
                'flex items-center justify-center',
                'text-secondary hover:text-primary',
                'hover:bg-muted-bg',
                'transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
              )}
              aria-label="Refresh incident data"
              title="Refresh"
            >
              <RefreshCw className="size-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default IncidentDetailsHeader
