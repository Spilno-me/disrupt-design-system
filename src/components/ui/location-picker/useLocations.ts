/**
 * useLocations - Hook to fetch and transform locations for LocationPicker
 *
 * Fetches from the locations API and transforms to LocationNode format.
 *
 * @example
 * ```tsx
 * const { locations, isLoading, error, refetch } = useLocations()
 *
 * <LocationPicker
 *   locations={locations}
 *   value={selected}
 *   onChange={setSelected}
 * />
 * ```
 */

import { useState, useEffect, useCallback } from 'react'
import { locationsApi } from '../../../api'
import type { Location } from '../../../api/types/location.types'
import type { LocationNode } from './types'

// =============================================================================
// TYPES
// =============================================================================

export interface UseLocationsOptions {
  /** Filter by location types */
  types?: ('facility' | 'department' | 'zone' | 'building' | 'floor' | 'area' | 'equipment')[]
  /** Include only selectable leaf nodes (default: false - all nodes selectable) */
  onlyLeaves?: boolean
}

export interface UseLocationsReturn {
  /** Location nodes for the picker */
  locations: LocationNode[]
  /** Loading state */
  isLoading: boolean
  /** Error message if any */
  error: string | null
  /** Refetch locations */
  refetch: () => Promise<void>
}

// =============================================================================
// TRANSFORM FUNCTION
// =============================================================================

/**
 * Map location type to icon name for the tree view
 */
function getIconForType(type: Location['type']): string | undefined {
  const iconMap: Record<string, string> = {
    facility: 'building',
    building: 'building',
    warehouse: 'warehouse',
    floor: 'folder',
    department: 'folder',
    zone: 'warehouse',
    area: 'folder',
    equipment: 'default',
  }
  return iconMap[type] || undefined
}

/**
 * Transform API Location to LocationNode format
 */
function transformToNode(location: Location, onlyLeaves: boolean): LocationNode {
  const hasChildren = location.children && location.children.length > 0

  // Get floor plan image - prefer direct floorPlanImage, fallback to first in floorPlans array
  const floorPlanImage = location.floorPlanImage || location.floorPlans?.[0]?.imageUrl

  // Get floor plan bounds if available
  const floorPlanBounds = location.floorPlans?.[0]?.bounds

  return {
    id: location.id,
    label: location.name,
    // Map location type to icon
    icon: getIconForType(location.type),
    // Only leaf nodes are selectable if onlyLeaves is true
    selectable: onlyLeaves ? !hasChildren : true,
    // Add coordinates if available
    coordinates: location.latitude && location.longitude
      ? { lat: location.latitude, lng: location.longitude }
      : undefined,
    // Add floor plan image URL if available
    floorPlanImage,
    // Add floor plan bounds for coordinate mapping
    floorPlanBounds,
    // Recursively transform children
    children: hasChildren
      ? location.children!.map((child) => transformToNode(child, onlyLeaves))
      : undefined,
  }
}

/**
 * Transform Location tree to LocationNode tree
 */
function transformLocations(locations: Location[], onlyLeaves: boolean): LocationNode[] {
  return locations.map((loc) => transformToNode(loc, onlyLeaves))
}

// =============================================================================
// HOOK
// =============================================================================

export function useLocations(options: UseLocationsOptions = {}): UseLocationsReturn {
  const { types, onlyLeaves = false } = options

  const [locations, setLocations] = useState<LocationNode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLocations = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await locationsApi.getTree()

      // Response shape: { data: Location[], meta: {...} }
      let data = response.data

      // Filter by types if specified
      if (types && types.length > 0) {
        const filterByType = (locs: Location[]): Location[] => {
          return locs
            .filter((loc) => types.includes(loc.type))
            .map((loc) => ({
              ...loc,
              children: loc.children ? filterByType(loc.children) : undefined,
            }))
        }
        data = filterByType(data)
      }

      const transformed = transformLocations(data, onlyLeaves)
      setLocations(transformed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load locations')
    } finally {
      setIsLoading(false)
    }
  }, [types, onlyLeaves])

  useEffect(() => {
    fetchLocations()
  }, [fetchLocations])

  return {
    locations,
    isLoading,
    error,
    refetch: fetchLocations,
  }
}

export default useLocations
