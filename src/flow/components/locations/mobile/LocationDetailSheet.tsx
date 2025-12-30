/**
 * LocationDetailSheet - Bottom sheet for mobile location details
 *
 * Renders location details (view/create/edit modes) in a bottom sheet
 * that slides up from the bottom on mobile devices. Uses the existing
 * Sheet component with side="bottom".
 *
 * Features:
 * - 85vh max height for comfortable viewing
 * - Drag handle for visual affordance
 * - Same content as desktop right panel
 * - Proper focus management and accessibility
 */

import * as React from 'react'
import { GripHorizontal } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../../../../components/ui/sheet'
import { LocationEmptyState } from '../panels/LocationEmptyState'
import { LocationForm } from '../panels/LocationForm'
import { LocationInfo } from '../panels/LocationInfo'
import type {
  Location,
  LocationFormData,
  RightPanelMode,
} from '../types'
import type { LocationRiskData, LocationIncident } from '../risk/types'

export interface LocationDetailSheetProps {
  /** Whether the sheet is open */
  open: boolean
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void
  /** Current panel mode */
  mode: RightPanelMode
  /** Selected location (for view/edit modes) */
  location: Location | null
  /** Parent location (for create mode with parent context) */
  parentLocation?: Location | null
  /** Callback for form submission */
  onSubmit: (data: LocationFormData) => Promise<void>
  /** Callback for cancel action */
  onCancel: () => void
  /** Callback for edit button click in view mode */
  onEditClick: () => void
  /** Whether form is submitting */
  isSubmitting?: boolean
  /** Risk data for the location */
  riskData?: LocationRiskData | null
  /** Incidents for the location */
  incidents?: LocationIncident[]
  /** Sibling locations for comparison */
  siblingLocations?: Array<{ location: Location; riskData: LocationRiskData }>
  /** Handler to view specific incident */
  onViewIncident?: (incidentId: string) => void
  /** Handler to view all incidents */
  onViewAllIncidents?: () => void
  /** Handler to schedule audit */
  onScheduleAudit?: () => void
}

export function LocationDetailSheet({
  open,
  onOpenChange,
  mode,
  location,
  parentLocation,
  onSubmit,
  onCancel,
  onEditClick,
  isSubmitting = false,
  riskData,
  incidents = [],
  siblingLocations,
  onViewIncident,
  onViewAllIncidents,
  onScheduleAudit,
}: LocationDetailSheetProps) {
  // Get title based on mode
  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Create Location'
      case 'edit':
        return 'Edit Location'
      case 'view':
        return location?.name ?? 'Location Details'
      default:
        return 'Location'
    }
  }

  // Handle cancel - close sheet
  const handleCancel = () => {
    onCancel()
    onOpenChange(false)
  }

  // Handle form submit - stay open on success, form handles state
  const handleSubmit = async (data: LocationFormData) => {
    await onSubmit(data)
    // Close sheet after successful submit
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[85vh] max-h-[85vh] rounded-t-2xl flex flex-col overflow-hidden"
        hideCloseButton
      >
        {/* Drag handle - visual affordance for swipe-to-dismiss */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="flex items-center justify-center w-12 h-1.5 rounded-full bg-muted-bg">
            <GripHorizontal className="size-4 text-tertiary" />
          </div>
        </div>

        {/* Header with title */}
        <SheetHeader className="px-4 py-2 border-b border-default">
          <SheetTitle className="text-lg font-semibold text-primary">
            {getTitle()}
          </SheetTitle>
        </SheetHeader>

        {/* Content area - scrollable */}
        <div className="flex-1 overflow-auto">
          {mode === 'empty' && <LocationEmptyState />}

          {mode === 'create' && (
            <LocationForm
              mode="create"
              parentLocation={parentLocation}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          )}

          {mode === 'edit' && location && (
            <LocationForm
              mode="edit"
              location={location}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          )}

          {mode === 'view' && location && (
            <LocationInfo
              location={location}
              onEditClick={onEditClick}
              riskData={riskData}
              incidents={incidents}
              siblingLocations={siblingLocations}
              onViewIncident={onViewIncident}
              onViewAllIncidents={onViewAllIncidents}
              onScheduleAudit={onScheduleAudit}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

LocationDetailSheet.displayName = 'LocationDetailSheet'

export default LocationDetailSheet
