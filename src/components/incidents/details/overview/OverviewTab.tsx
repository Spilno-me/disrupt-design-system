/**
 * OverviewTab - Overview tab content for incident details
 *
 * Three-column responsive layout containing:
 * - LocationCard (left)
 * - IncidentInfoCard (center)
 * - DescriptionCard (right)
 *
 * @example
 * ```tsx
 * <OverviewTab
 *   incident={incident}
 *   onLocationClick={(id) => navigate(`/locations/${id}`)}
 *   onFacilityClick={(id) => navigate(`/facilities/${id}`)}
 *   onReporterClick={(id) => navigate(`/users/${id}`)}
 * />
 * ```
 */

import * as React from 'react'
import { cn } from '../../../../lib/utils'
import { LocationCard } from './LocationCard'
import { IncidentInfoCard } from './IncidentInfoCard'
import { DescriptionCard } from './DescriptionCard'
import type { IncidentDetail } from '../types'

export interface OverviewTabProps {
  incident: IncidentDetail
  onLocationClick?: (id: string) => void
  onFacilityClick?: (id: string) => void
  onReporterClick?: (id: string) => void
  onEdit?: () => void
  className?: string
}

/**
 * OverviewTab - Three-column overview layout
 */
export function OverviewTab({
  incident,
  onLocationClick,
  onFacilityClick,
  onReporterClick,
  onEdit,
  className,
}: OverviewTabProps) {
  return (
    <div
      className={cn(
        // Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        // Responsive gap: tighter on mobile
        'gap-4 lg:gap-6',
        className
      )}
    >
      {/* Location Card */}
      <LocationCard
        location={incident.location}
        onLocationClick={onLocationClick}
        onFacilityClick={onFacilityClick}
      />

      {/* Incident Info Card */}
      <IncidentInfoCard
        status={incident.status}
        severity={incident.severity}
        type={incident.type}
        reference={incident.reference || incident.incidentId}
        reporter={incident.reporter}
        createdAt={incident.createdAt}
        onReporterClick={onReporterClick}
        onEdit={onEdit}
      />

      {/* Description Card */}
      <DescriptionCard
        description={incident.description}
        maxLines={8}
      />
    </div>
  )
}

export default OverviewTab
