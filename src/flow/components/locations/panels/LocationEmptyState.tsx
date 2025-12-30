/**
 * LocationEmptyState - Empty state for when no location is selected
 */

import * as React from 'react'
import { MapPin } from 'lucide-react'

export function LocationEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted-bg mb-4">
        <MapPin className="size-8 text-tertiary" />
      </div>
      <h3 className="text-lg font-semibold text-primary mb-2">
        Select a location
      </h3>
      <p className="text-sm text-secondary max-w-xs leading-relaxed">
        Choose a location from the hierarchy tree to view its detailed
        information and manage its settings.
      </p>
    </div>
  )
}

LocationEmptyState.displayName = 'LocationEmptyState'

export default LocationEmptyState
