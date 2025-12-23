/**
 * LocationStep - Step 3 of Incident Wizard
 *
 * Location selection with hierarchical tree, GPS, and floor plan marking.
 *
 * UX Flow:
 * 1. Primary: Search/browse hierarchical location tree
 * 2. When indoor location selected: Show floor plan to mark exact spot
 * 3. For outdoor: GPS button → captures current position
 */

import * as React from 'react'
import { useMemo } from 'react'
import { WizardStepHeader, WizardStepSection } from '../../provisioning/WizardStep'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { LocationPicker } from '../../ui/location-picker'
import type { LocationNode, LocationValue } from '../../ui/location-picker'
import { type StepProps } from '../types'

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Convert flat location options to hierarchical LocationNode tree
 */
function convertToLocationTree(
  locations: { value: string; label: string; group?: string; floorPlanImage?: string }[]
): LocationNode[] {
  // Group by the group property
  const grouped = new Map<string, typeof locations>()

  locations.forEach((loc) => {
    const group = loc.group || 'Other'
    if (!grouped.has(group)) {
      grouped.set(group, [])
    }
    grouped.get(group)!.push(loc)
  })

  // Convert to tree structure
  const tree: LocationNode[] = []

  // Icon mapping based on group names
  const groupIcons: Record<string, string> = {
    Warehouses: 'warehouse',
    Production: 'factory',
    Logistics: 'parking',
    Facilities: 'building',
    Office: 'building',
    Outdoor: 'outdoor',
  }

  for (const [group, locs] of grouped.entries()) {
    const groupNode: LocationNode = {
      id: `group-${group.toLowerCase().replace(/\s+/g, '-')}`,
      label: group,
      icon: groupIcons[group] || 'default',
      selectable: false,
      children: locs.map((loc) => ({
        id: loc.value,
        label: loc.label,
        selectable: true,
        floorPlanImage: loc.floorPlanImage,
      })),
    }
    tree.push(groupNode)
  }

  return tree
}

// =============================================================================
// COMPONENT
// =============================================================================

export function LocationStep({ data, onUpdate, locations = [] }: StepProps) {
  // Convert flat locations to hierarchical tree
  const locationTree = useMemo(() => convertToLocationTree(locations), [locations])

  // Current location value for the picker
  const pickerValue = useMemo<LocationValue | null>(() => {
    if (!data.location) return null

    // Check if it's a what3words address
    if (data.location.includes('.') && data.location.split('.').length === 3) {
      return {
        id: `w3w-${data.location}`,
        path: ['what3words'],
        label: `///` + data.location,
        what3words: data.location,
        precisionMarker: data.precisionMarker,
      }
    }

    // Find the location in the tree
    for (const group of locationTree) {
      if (group.children) {
        const found = group.children.find((loc) => loc.id === data.location)
        if (found) {
          return {
            id: found.id,
            path: [group.label, found.label],
            label: found.label,
            floorPlanImage: found.floorPlanImage,
            precisionMarker: data.precisionMarker,
          }
        }
      }
    }

    // Fallback for manual entry
    return {
      id: data.location,
      path: [data.location],
      label: data.location,
      precisionMarker: data.precisionMarker,
    }
  }, [data.location, data.precisionMarker, locationTree])

  // Handle location selection
  const handleLocationChange = (value: LocationValue | null) => {
    if (value) {
      onUpdate({
        location: value.what3words || value.id,
        locationCode: value.what3words ? `w3w:${value.what3words}` : '',
        precisionMarker: value.precisionMarker,
      })
    } else {
      onUpdate({ location: '', locationCode: '', precisionMarker: undefined })
    }
  }

  return (
    <div className="space-y-8">
      <WizardStepHeader
        title="Location & Time"
        description="Where and when did the incident occur?"
      />

      <WizardStepSection className="space-y-6">
        {/* Location Picker */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Location <span className="text-error">*</span>
          </Label>

          {locations.length > 0 ? (
            <>
              <LocationPicker
                locations={locationTree}
                value={pickerValue}
                onChange={handleLocationChange}
                placeholder="Search or select a location..."
                showGps
              />
              <p className="text-xs text-emphasis">
                Select from the list or use GPS. For indoor locations, mark the exact spot on the floor plan.
              </p>
            </>
          ) : (
            <>
              <Input
                id="location"
                placeholder="Enter the location (e.g., Building A, Floor 2)"
                value={data.location}
                onChange={(e) => onUpdate({ location: e.target.value })}
              />
              <p className="text-xs text-emphasis">
                Describe where the incident occurred
              </p>
            </>
          )}
        </div>

        {/* Location Code - only when not using what3words */}
        {!data.locationCode?.startsWith('w3w:') && (
          <div className="space-y-2">
            <Label htmlFor="locationCode" className="text-sm font-medium">
              Location Code / Area ID
            </Label>
            <Input
              id="locationCode"
              placeholder="e.g., A2-105, Zone 3"
              value={data.locationCode}
              onChange={(e) => onUpdate({ locationCode: e.target.value })}
            />
            <p className="text-xs text-emphasis">
              Optional. Enter a specific area code if applicable.
            </p>
          </div>
        )}

        {/* Date/Time */}
        <div className="space-y-2">
          <Label htmlFor="dateTime" className="text-sm font-medium">
            Date & Time of Incident <span className="text-error">*</span>
          </Label>
          <Input
            id="dateTime"
            type="datetime-local"
            value={data.dateTime}
            onChange={(e) => onUpdate({ dateTime: e.target.value })}
            max={new Date().toISOString().slice(0, 16)}
          />
          <p className="text-xs text-emphasis">
            When did the incident occur? Use your best estimate if exact time is unknown.
          </p>
        </div>
      </WizardStepSection>
    </div>
  )
}

LocationStep.displayName = 'LocationStep'

export default LocationStep
