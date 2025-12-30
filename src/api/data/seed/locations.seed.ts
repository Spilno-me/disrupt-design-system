/**
 * Location Seed Data
 *
 * Re-exports existing mock locations and provides utilities
 * for flattening the hierarchical structure for Map storage.
 */

// Import existing mock data
import { mockLocations } from '../../../flow/components/locations/data/mockLocations'
import type { Location } from '../../types/location.types'

/**
 * Seed locations (hierarchical structure)
 */
export const seedLocationsTree: Location[] = mockLocations

/**
 * Extended locations (alias for stories that need "extended" naming)
 */
export const seedLocationsTreeExtended: Location[] = mockLocations

/**
 * Empty locations array for empty state testing
 */
export const emptyLocations: Location[] = []

/**
 * Flatten location tree into array for Map storage
 * Preserves parentId for reconstruction
 */
export function flattenLocationTree(locations: Location[]): Location[] {
  const result: Location[] = []

  function traverse(locs: Location[]) {
    for (const loc of locs) {
      // Create a copy without children for flat storage
      const { children, ...flatLoc } = loc
      result.push(flatLoc as Location)

      // Recurse into children
      if (children && children.length > 0) {
        traverse(children)
      }
    }
  }

  traverse(locations)
  return result
}

/**
 * Seed locations (flat array for API store)
 */
export const seedLocations: Location[] = flattenLocationTree(seedLocationsTree)

/**
 * Rebuild tree structure from flat array
 */
export function buildLocationTree(flatLocations: Location[]): Location[] {
  const locationMap = new Map<string, Location & { children: Location[] }>()
  const roots: Location[] = []

  // First pass: create all nodes with empty children arrays
  for (const loc of flatLocations) {
    locationMap.set(loc.id, { ...loc, children: [] })
  }

  // Second pass: build relationships
  for (const loc of flatLocations) {
    const node = locationMap.get(loc.id)!
    if (loc.parentId === null) {
      roots.push(node)
    } else {
      const parent = locationMap.get(loc.parentId)
      if (parent) {
        parent.children.push(node)
      } else {
        // Orphaned node, add to roots
        roots.push(node)
      }
    }
  }

  return roots
}

/**
 * Get all location IDs
 */
export function getAllLocationIds(): string[] {
  return seedLocations.map((l) => l.id)
}

/**
 * Get location by ID from seed data
 */
export function getSeedLocationById(id: string): Location | undefined {
  return seedLocations.find((l) => l.id === id)
}

/**
 * Get child locations for a parent
 */
export function getChildLocations(parentId: string): Location[] {
  return seedLocations.filter((l) => l.parentId === parentId)
}

/**
 * Get root locations (facilities)
 */
export function getRootLocations(): Location[] {
  return seedLocations.filter((l) => l.parentId === null)
}

/**
 * Generate location options for select dropdowns.
 * Groups locations by their parent facility.
 */
export function getLocationSelectOptions(): Array<{ value: string; label: string; group?: string }> {
  const facilityMap = new Map<string | null, string>()

  // Build facility name map
  for (const loc of seedLocations) {
    if (loc.type === 'facility') {
      facilityMap.set(loc.id, loc.name)
    }
  }

  // Find facility for a location (traverse up the tree)
  function getFacilityName(loc: Location): string {
    if (loc.type === 'facility') return loc.name
    if (!loc.parentId) return 'Other'

    const parent = seedLocations.find((l) => l.id === loc.parentId)
    if (!parent) return 'Other'
    return getFacilityName(parent)
  }

  return seedLocations
    .filter((l) => l.type !== 'facility') // Exclude facilities themselves
    .map((loc) => ({
      value: loc.id,
      label: loc.name,
      group: getFacilityName(loc),
    }))
    .sort((a, b) => {
      // Sort by group, then label
      if (a.group !== b.group) return (a.group || '').localeCompare(b.group || '')
      return a.label.localeCompare(b.label)
    })
}
