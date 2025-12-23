/**
 * IncidentStatsBar - Compact stats display for incident header
 *
 * Displays key incident metrics in a horizontal bar:
 * - Steps completed (e.g., "0/2 Steps Complete")
 * - Documents count
 * - Days open
 *
 * @example
 * ```tsx
 * <IncidentStatsBar
 *   stepsCompleted={0}
 *   stepsTotal={2}
 *   documentsCount={2}
 *   daysOpen={1}
 * />
 * ```
 */

import * as React from 'react'
import { FileText, Clock } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import type { IncidentStatsBarProps } from '../types'

/**
 * Individual stat item
 */
function StatItem({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string | number
  icon?: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="flex flex-col items-center px-3 lg:px-4 py-2 lg:py-1">
      <span className="text-base lg:text-lg font-semibold tabular-nums text-primary">
        {value}
      </span>
      <span className="text-xs text-tertiary whitespace-nowrap flex items-center gap-1">
        {Icon && <Icon className="size-3" aria-hidden="true" />}
        {label}
      </span>
    </div>
  )
}

/**
 * IncidentStatsBar - Key metrics display
 *
 * Responsive layout:
 * - Mobile: Compact grid with smaller text
 * - Desktop: Horizontal flex with dividers
 */
export function IncidentStatsBar({
  stepsCompleted,
  stepsTotal,
  documentsCount,
  daysOpen,
  className,
}: IncidentStatsBarProps) {
  // Pluralize documents label
  const documentsLabel = documentsCount === 1 ? 'Document' : 'Documents'

  return (
    <div
      className={cn(
        // Mobile: grid layout, Desktop: flex with dividers
        'grid grid-cols-3 gap-1',
        'lg:flex lg:items-center lg:divide-x lg:divide-default lg:gap-0',
        'bg-muted-bg/50 lg:bg-transparent rounded-lg lg:rounded-none',
        className
      )}
      role="group"
      aria-label="Incident statistics"
    >
      <StatItem
        value={`${stepsCompleted}/${stepsTotal}`}
        label="Steps"
      />
      <StatItem
        value={documentsCount}
        label={documentsLabel}
        icon={FileText}
      />
      <StatItem
        value={daysOpen}
        label="Days Open"
        icon={Clock}
      />
    </div>
  )
}

export default IncidentStatsBar
