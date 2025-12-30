/**
 * RiskTypeBreakdown - Horizontal bar chart showing incidents by category
 *
 * Displays a breakdown of incidents by type (slip/fall, chemical, etc.)
 * with horizontal bars and percentages.
 */

import * as React from 'react'
import { cn } from '../../../../lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'
import type { RiskTypeBreakdownProps } from './types'
import type { IncidentType } from '../../../../api/types/incident.types'

// =============================================================================
// INCIDENT TYPE CONFIG
// =============================================================================

const INCIDENT_TYPE_CONFIG: Record<
  IncidentType,
  { label: string; color: string; icon: string }
> = {
  injury: { label: 'Injury', color: 'bg-error', icon: '🩹' },
  near_miss: { label: 'Near Miss', color: 'bg-warning', icon: '⚠️' },
  environmental: { label: 'Environmental', color: 'bg-success', icon: '🌿' },
  equipment: { label: 'Equipment Failure', color: 'bg-info', icon: '⚙️' },
  chemical: { label: 'Chemical Spill', color: 'bg-aging', icon: '🧪' },
  fire: { label: 'Fire', color: 'bg-error', icon: '🔥' },
  other: { label: 'Other', color: 'bg-muted-bg', icon: '📋' },
}

// =============================================================================
// BAR ITEM
// =============================================================================

interface BarItemProps {
  type: IncidentType
  count: number
  total: number
  maxCount: number
}

function BarItem({ type, count, total, maxCount }: BarItemProps) {
  const config = INCIDENT_TYPE_CONFIG[type] || INCIDENT_TYPE_CONFIG.other
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0
  const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0

  return (
    <div className="group">
      {/* Label row */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm">{config.icon}</span>
          <span className="text-sm text-secondary truncate">{config.label}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-medium text-primary tabular-nums">
            {count}
          </span>
          <span className="text-xs text-tertiary tabular-nums w-10 text-right">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Bar */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="h-2 bg-muted-bg rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300',
                config.color,
                'group-hover:opacity-80'
              )}
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs">
            {config.label}: {count} incident{count !== 1 ? 's' : ''} ({percentage}%)
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function RiskTypeBreakdown({
  byType,
  totalCount,
  className,
}: RiskTypeBreakdownProps) {
  // Sort types by count descending
  const sortedTypes = React.useMemo(() => {
    const entries = Object.entries(byType) as [IncidentType, number][]
    return entries
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)
  }, [byType])

  // Find max count for bar scaling
  const maxCount = sortedTypes.length > 0 ? sortedTypes[0][1] : 0

  if (sortedTypes.length === 0) {
    return (
      <div className={cn('p-4 rounded-lg border border-default bg-muted-bg/30', className)}>
        <p className="text-sm text-tertiary text-center">
          No incident type data available
        </p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-primary">
          Incidents by Type
        </h4>
        <span className="text-xs text-tertiary">
          {totalCount} total
        </span>
      </div>

      {/* Bars */}
      <div className="space-y-3">
        {sortedTypes.map(([type, count]) => (
          <BarItem
            key={type}
            type={type}
            count={count}
            total={totalCount}
            maxCount={maxCount}
          />
        ))}
      </div>

      {/* Legend hint */}
      {sortedTypes.length > 3 && (
        <p className="text-xs text-tertiary pt-2 border-t border-default">
          Showing {sortedTypes.length} incident categories
        </p>
      )}
    </div>
  )
}

RiskTypeBreakdown.displayName = 'RiskTypeBreakdown'

export default RiskTypeBreakdown
