/**
 * CompactLocationCard - Sidebar-style location card with smaller map
 *
 * Designed for the 2-column compact layout where location info
 * appears as a narrower right sidebar. Features:
 * - Smaller map preview (120px height vs 160px)
 * - Vertically stacked location details
 * - More compact spacing
 *
 * @example
 * ```tsx
 * <CompactLocationCard
 *   location={{
 *     id: '1',
 *     name: 'Loading Dock - East',
 *     facility: 'Main Warehouse',
 *     facilityId: 'fac-1',
 *     coordinates: { lat: 49.8397, lng: 24.0297 },
 *     what3words: '///appealing.concluded.mugs',
 *   }}
 *   onLocationClick={(id) => navigate(`/locations/${id}`)}
 *   onFacilityClick={(id) => navigate(`/facilities/${id}`)}
 * />
 * ```
 */

import * as React from 'react'
import { MapPin, Building2, Grid3X3 } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { AppCard, AppCardContent } from '../../../ui/app-card'
import { IncidentMap } from './IncidentMap'
import type { LocationCardProps } from '../types'

/**
 * Compact info row for location details
 */
function InfoRow({
  icon: Icon,
  label,
  value,
  onClick,
  isLink = false,
  ariaLabel,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  onClick?: () => void
  isLink?: boolean
  ariaLabel?: string
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon
        className="size-4 text-tertiary mt-0.5 flex-shrink-0"
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <span
          className="text-xs text-tertiary block"
          id={`label-${label.toLowerCase().replace(/\s/g, '-')}`}
        >
          {label}
        </span>
        {isLink && onClick ? (
          <button
            type="button"
            onClick={onClick}
            className={cn(
              'text-sm font-medium text-link',
              'py-1 -my-1 pr-2 -mr-2',
              'hover:underline',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:rounded-sm',
              'text-left truncate max-w-full'
            )}
            aria-label={ariaLabel || `View ${label.toLowerCase()}: ${value}`}
          >
            {value}
          </button>
        ) : (
          <span className="text-sm font-medium text-primary truncate block">
            {value}
          </span>
        )}
      </div>
    </div>
  )
}

/**
 * CompactLocationCard - Sidebar-optimized location card
 */
export function CompactLocationCard({
  location,
  onLocationClick,
  onFacilityClick,
  className,
}: LocationCardProps) {
  return (
    <AppCard shadow="md" className={cn('h-full', className)}>
      <AppCardContent className="space-y-3 !p-0">
        {/* Smaller map preview */}
        <div className="p-3 pb-0">
          <IncidentMap
            coordinates={location.coordinates}
            what3words={location.what3words}
            height={120}
            showMarker
          />
        </div>

        {/* Location details - compact spacing */}
        <div className="space-y-2.5 px-3 pb-3">
          <InfoRow
            icon={MapPin}
            label="Location"
            value={location.name}
            onClick={() => onLocationClick?.(location.id)}
            isLink={!!onLocationClick}
            ariaLabel={`View location details for ${location.name}`}
          />

          <InfoRow
            icon={Building2}
            label="Facility"
            value={location.facility}
            onClick={() => onFacilityClick?.(location.facilityId)}
            isLink={!!onFacilityClick}
            ariaLabel={`View facility details for ${location.facility}`}
          />

          {location.what3words && (
            <InfoRow
              icon={Grid3X3}
              label="Coordinates"
              value={location.what3words}
            />
          )}
        </div>
      </AppCardContent>
    </AppCard>
  )
}

export default CompactLocationCard
