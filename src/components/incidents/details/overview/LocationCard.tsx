/**
 * LocationCard - Location details card for incident overview
 *
 * Displays a map preview with location name, facility, and what3words address.
 * Links are clickable to navigate to location/facility details.
 *
 * @example
 * ```tsx
 * <LocationCard
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
 * Info row component for location details
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
      <Icon className="size-4 text-tertiary mt-0.5 flex-shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <span className="text-xs text-tertiary block" id={`label-${label.toLowerCase().replace(/\s/g, '-')}`}>
          {label}
        </span>
        {isLink && onClick ? (
          <button
            type="button"
            onClick={onClick}
            className={cn(
              'text-sm font-medium text-link',
              // Responsive touch targets with negative margin to maintain visual spacing
              'py-2 lg:py-1 -my-2 lg:-my-1',
              'pr-2 -mr-2',
              'hover:underline',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:rounded-sm',
              'text-left'
            )}
            aria-label={ariaLabel || `View ${label.toLowerCase()}: ${value}`}
          >
            {value}
          </button>
        ) : (
          <span className="text-sm font-medium text-primary">{value}</span>
        )}
      </div>
    </div>
  )
}

/**
 * LocationCard - Location information card
 */
export function LocationCard({
  location,
  onLocationClick,
  onFacilityClick,
  className,
}: LocationCardProps) {
  return (
    <AppCard shadow="md" className={cn('h-full', className)}>
      <AppCardContent className="space-y-4 !px-0 !pt-0">
        {/* Map preview */}
        <div className="px-4 pt-4">
          <IncidentMap
            coordinates={location.coordinates}
            what3words={location.what3words}
            height={160}
            showMarker
          />
        </div>

        {/* Location details */}
        <div className="space-y-3 px-4 pb-4">
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

export default LocationCard
