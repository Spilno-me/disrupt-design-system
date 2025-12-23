/**
 * CompactOverviewTab - Space-optimized 2-column overview layout
 *
 * Redesigned layout that saves ~30% vertical space by:
 * - Removing duplicate Reference ID (shown in header)
 * - Combining Incident Info + Description into single card
 * - Moving Location to narrower right sidebar
 * - Using denser metadata grid (4 columns)
 *
 * Layout breakdown:
 * - Left column (~65%): IncidentSummaryCard (info + description)
 * - Right column (~35%): CompactLocationCard (map + location details)
 *
 * Mobile: Stacks vertically (summary first, then location)
 *
 * @example
 * ```tsx
 * <CompactOverviewTab
 *   incident={incident}
 *   onLocationClick={(id) => navigate(`/locations/${id}`)}
 *   onFacilityClick={(id) => navigate(`/facilities/${id}`)}
 *   onReporterClick={(id) => navigate(`/users/${id}`)}
 * />
 * ```
 */

import * as React from 'react'
import { cn } from '../../../../lib/utils'
import { IncidentSummaryCard } from './IncidentSummaryCard'
import { CompactLocationCard } from './CompactLocationCard'
import type { IncidentDetail } from '../types'

export interface CompactOverviewTabProps {
  incident: IncidentDetail
  onLocationClick?: (id: string) => void
  onFacilityClick?: (id: string) => void
  onReporterClick?: (id: string) => void
  onEdit?: () => void
  className?: string
}

/**
 * CompactOverviewTab - 2-column space-efficient layout
 */
export function CompactOverviewTab({
  incident,
  onLocationClick,
  onFacilityClick,
  onReporterClick,
  className,
}: CompactOverviewTabProps) {
  return (
    <div
      className={cn(
        // 2-column grid: ~65% left, ~35% right
        'grid grid-cols-1 lg:grid-cols-[1fr_320px]',
        // Responsive gap
        'gap-4 lg:gap-6',
        className
      )}
    >
      {/* Left: Combined incident info + description */}
      <IncidentSummaryCard
        status={incident.status}
        severity={incident.severity}
        type={incident.type}
        reporter={incident.reporter}
        createdAt={incident.createdAt}
        description={incident.description}
        onReporterClick={onReporterClick}
        maxLines={6}
      />

      {/* Right: Compact location sidebar */}
      <CompactLocationCard
        location={incident.location}
        onLocationClick={onLocationClick}
        onFacilityClick={onFacilityClick}
      />
    </div>
  )
}

export default CompactOverviewTab
