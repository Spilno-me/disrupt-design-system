/**
 * LocationSearchResult - Compact location result row for search dropdown
 *
 * Displays: Location type icon, Name, Type label, People count badge
 */

import * as React from 'react'
import { MapPin, Building2, Factory, Warehouse, Users } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../../../components/ui/badge'
import { highlightMatch } from '../utils/searchUtils'
import type { LocationWithPeople } from '../types'
import type { LocationType } from '../../locations/types'

export interface LocationSearchResultProps {
  /** Location data */
  location: LocationWithPeople
  /** Search query for highlighting */
  query: string
  /** Whether this result is keyboard-selected */
  isSelected?: boolean
  /** Click handler */
  onClick: () => void
}

// Location type icons
const LOCATION_TYPE_ICONS: Record<string, React.ElementType> = {
  region: Building2,
  site: Factory,
  building: Building2,
  floor: Building2,
  area: Warehouse,
  default: MapPin,
}

// Location type labels
const LOCATION_TYPE_LABELS: Record<string, string> = {
  region: 'Region',
  site: 'Site',
  building: 'Building',
  floor: 'Floor',
  area: 'Area',
  default: 'Location',
}

/**
 * Render text with highlighted matches
 */
function HighlightedText({
  text,
  query,
  className,
}: {
  text: string
  query: string
  className?: string
}) {
  const segments = highlightMatch(text, query)

  return (
    <span className={className}>
      {segments.map((segment, i) =>
        segment.isMatch ? (
          <mark
            key={i}
            className="bg-warning/30 text-inherit rounded-sm px-0.5"
          >
            {segment.text}
          </mark>
        ) : (
          <span key={i}>{segment.text}</span>
        )
      )}
    </span>
  )
}

export function LocationSearchResult({
  location,
  query,
  isSelected = false,
  onClick,
}: LocationSearchResultProps) {
  const LocationIcon = LOCATION_TYPE_ICONS[location.type] || LOCATION_TYPE_ICONS.default
  const typeLabel = LOCATION_TYPE_LABELS[location.type] || LOCATION_TYPE_LABELS.default

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors rounded-md',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset',
        isSelected
          ? 'bg-accent/10 text-primary'
          : 'hover:bg-surface-hover text-primary'
      )}
      data-slot="location-search-result"
    >
      {/* Location icon */}
      <div className="flex items-center justify-center size-8 rounded-md bg-white/40 dark:bg-black/40 border border-accent/20 shrink-0">
        <LocationIcon className="size-4 text-accent" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <HighlightedText
            text={location.name}
            query={query}
            className="text-sm font-medium truncate"
          />
          {location.code && (
            <Badge
              variant="outline"
              size="sm"
              className="bg-warning/10 text-warning-dark border-warning/30 shrink-0"
            >
              <HighlightedText text={location.code} query={query} />
            </Badge>
          )}
        </div>
        <p className="text-xs text-secondary">{typeLabel}</p>
      </div>

      {/* People count */}
      {location.totalUserCount > 0 && (
        <Badge
          variant="outline"
          size="sm"
          className="bg-accent/10 text-accent border-accent/30 gap-1 shrink-0"
        >
          <Users className="size-3" />
          <span>{location.totalUserCount}</span>
        </Badge>
      )}
    </button>
  )
}

LocationSearchResult.displayName = 'LocationSearchResult'
