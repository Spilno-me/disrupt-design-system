/**
 * Location API Types
 *
 * Re-exports location types from flow components and adds API-specific input types.
 */

// Re-export all location types from the source of truth
export type {
  Location,
  LocationType,
  FloorPlan,
  RightPanelMode,
  LocationFormData,
  CreateLocationFormData,
  EditLocationFormData,
  LocationTreeState,
  DeleteLocationPayload,
} from '../../flow/components/locations/types'

// Re-export constants and helpers
export {
  LOCATION_TYPE_CONFIG,
  TIMEZONE_OPTIONS,
  LOCATION_TYPE_OPTIONS,
  countDescendants,
  flattenLocations,
  findLocationById,
  getTotalLocationCount,
} from '../../flow/components/locations/types'

// =============================================================================
// API INPUT TYPES
// =============================================================================

/**
 * Input for creating a new location via API
 */
export interface CreateLocationInput {
  name: string
  type: 'facility' | 'department' | 'zone' | 'building' | 'floor' | 'area' | 'equipment'
  code: string
  description?: string
  address?: string
  latitude?: number
  longitude?: number
  timezone: string
  parentId?: string | null
}

/**
 * Input for updating a location via API
 */
export interface UpdateLocationInput {
  name?: string
  type?: 'facility' | 'department' | 'zone' | 'building' | 'floor' | 'area' | 'equipment'
  code?: string
  description?: string
  address?: string
  latitude?: number
  longitude?: number
  timezone?: string
  parentId?: string | null
}

/**
 * Filter options for listing locations
 */
export interface LocationListFilters {
  type?: ('facility' | 'department' | 'zone' | 'building' | 'floor' | 'area' | 'equipment')[]
  parentId?: string | null
  search?: string
}

/**
 * Options for getting locations
 */
export interface GetLocationsOptions {
  /** Return as flat array instead of tree */
  flat?: boolean
  /** Include only locations of these types */
  types?: ('facility' | 'department' | 'zone' | 'building' | 'floor' | 'area' | 'equipment')[]
  /** Include child counts in response */
  includeChildCounts?: boolean
}

/**
 * Location with computed counts
 */
export interface LocationWithCounts {
  id: string
  name: string
  type: 'facility' | 'department' | 'zone' | 'building' | 'floor' | 'area' | 'equipment'
  code: string
  description?: string
  address?: string
  latitude?: number
  longitude?: number
  timezone: string
  parentId: string | null
  createdAt: string
  updatedAt: string
  /** Number of direct children */
  directChildCount: number
  /** Number of all descendants */
  totalDescendantCount: number
  /** Number of users assigned to this location */
  userCount: number
}
