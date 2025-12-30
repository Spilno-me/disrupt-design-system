/**
 * Location Management Types
 *
 * TypeScript interfaces for the Location Management configuration page.
 * Supports hierarchical location structures for facility management.
 */

import type { LocationRiskData, RiskDataMap } from './risk/types'

// =============================================================================
// LOCATION TYPES
// =============================================================================

export type LocationType =
  | 'facility'
  | 'department'
  | 'zone'
  | 'building'
  | 'floor'
  | 'area'
  | 'equipment'

/**
 * Floor plan configuration for a location
 * Allows precise indoor positioning on uploaded floor plan images
 */
export interface FloorPlan {
  /** URL to the uploaded floor plan image */
  imageUrl: string
  /** Original image width in pixels */
  imageWidth?: number
  /** Original image height in pixels */
  imageHeight?: number
  /** Display name for the floor plan (e.g., "Ground Floor", "Level 2") */
  name?: string
  /** Real-world bounds for GPS coordinate mapping */
  bounds?: {
    north: number
    south: number
    east: number
    west: number
  }
  /** Calibration points for indoor positioning (image x,y to real-world lat,lng) */
  calibrationPoints?: Array<{
    imageX: number // Percentage (0-100)
    imageY: number // Percentage (0-100)
    latitude: number
    longitude: number
  }>
}

export interface Location {
  id: string
  name: string
  type: LocationType
  code: string // Location code (e.g., "FAC-001")
  description?: string
  address?: string
  latitude?: number
  longitude?: number
  timezone: string
  parentId: string | null // null = root location
  children?: Location[] // For hierarchical tree rendering
  /** Floor plan(s) for this location - allows multiple views */
  floorPlans?: FloorPlan[]
  /** Primary floor plan image URL (convenience accessor) */
  floorPlanImage?: string
  createdAt: string
  updatedAt: string
}

// =============================================================================
// VIEW MODE TYPES
// =============================================================================

export type RightPanelMode = 'empty' | 'create' | 'edit' | 'view'

// =============================================================================
// FORM DATA TYPES
// =============================================================================

export interface LocationFormData {
  name: string
  type: LocationType
  code: string
  description?: string
  address?: string
  timezone: string
  latitude?: number
  longitude?: number
  parentId?: string | null
  /** Floor plans for this location */
  floorPlans?: FloorPlan[]
  /** Primary floor plan image URL */
  floorPlanImage?: string
}

export interface CreateLocationFormData extends LocationFormData {}

export interface EditLocationFormData extends LocationFormData {
  id: string
}

// =============================================================================
// TREE STATE TYPES
// =============================================================================

export interface LocationTreeState {
  expandedIds: Set<string>
  selectedId: string | null
  searchValue: string
}

// =============================================================================
// DELETE PAYLOAD
// =============================================================================

export interface DeleteLocationPayload {
  location: Location
  childCount: number // Count of all nested children
  affectedLocations: Location[] // Flat list for display
}

// =============================================================================
// COMPONENT PROPS TYPES
// =============================================================================

export interface LocationsPageProps {
  /** Hierarchical location data */
  locations: Location[]
  /** Loading state */
  isLoading?: boolean
  /** CRUD callbacks */
  onLocationCreate?: (data: CreateLocationFormData) => Promise<void>
  onLocationUpdate?: (data: EditLocationFormData) => Promise<void>
  onLocationDelete?: (locationId: string) => Promise<void>
  /** Refresh callback */
  onRefresh?: () => Promise<void>
  /** Incidents for risk intelligence (optional) */
  incidents?: Array<{
    id: string
    incidentId: string
    locationId: string
    severity: 'critical' | 'high' | 'medium' | 'low' | 'none'
    type: string
    status: string
    title: string
    createdAt: string
    closedAt?: string
    precisionMarker?: { x: number; y: number; floorPlanId?: string }
  }>
  /** Handler to view specific incident */
  onViewIncident?: (incidentId: string) => void
  /** Handler to view all incidents for a location */
  onViewAllIncidents?: (locationId: string) => void
  /** Handler to schedule safety audit for a location */
  onScheduleAudit?: (locationId: string) => void
}

export interface LocationTreeProps {
  locations: Location[]
  expandedIds: Set<string>
  selectedId: string | null
  searchValue: string
  onExpandToggle: (id: string) => void
  onSelect: (location: Location) => void
  onSearchChange: (value: string) => void
  onAddClick: () => void
  onEditClick: (location: Location) => void
  onDeleteClick: (location: Location) => void
  onMapClick?: (location: Location) => void
  /** Whether to render in mobile mode */
  isMobile?: boolean
  /** Risk data map for displaying risk badges on tree items */
  riskDataMap?: RiskDataMap
}

export interface LocationTreeItemProps {
  location: Location
  depth: number
  isExpanded: boolean
  isSelected: boolean
  expandedIds: Set<string>
  onExpandToggle: (id: string) => void
  onSelect: (location: Location) => void
  onEditClick: (location: Location) => void
  onDeleteClick: (location: Location) => void
  onMapClick?: (location: Location) => void
  /** Mobile: Whether to use swipe-to-reveal actions */
  isMobile?: boolean
  /** Mobile: Currently swiped item ID */
  swipedItemId?: string | null
  /** Mobile: Callback when swipe state changes */
  onSwipeChange?: (id: string | null) => void
  /** Selected location ID for passing to children */
  selectedId?: string | null
  /** Risk data for this location (for badge display) */
  riskData?: LocationRiskData | null
  /** Risk data map for passing to children */
  riskDataMap?: RiskDataMap
}

export interface LocationFormProps {
  mode: 'create' | 'edit'
  location?: Location | null
  parentLocation?: Location | null
  onSubmit: (data: LocationFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export interface LocationInfoProps {
  location: Location
  onEditClick: () => void
  /** Risk data for this location (enables Risk tab) */
  riskData?: LocationRiskData | null
  /** Incidents at this location (for Risk tab) */
  incidents?: Array<{
    id: string
    incidentId: string
    locationId: string
    severity: 'critical' | 'high' | 'medium' | 'low' | 'none'
    type: string
    status: string
    title: string
    createdAt: string
    closedAt?: string
    precisionMarker?: { x: number; y: number; floorPlanId?: string }
  }>
  /** Sibling locations for peer comparison */
  siblingLocations?: Array<{ location: Location; riskData: LocationRiskData }>
  /** Handler to view specific incident */
  onViewIncident?: (incidentId: string) => void
  /** Handler to view all incidents */
  onViewAllIncidents?: () => void
  /** Handler to schedule audit */
  onScheduleAudit?: () => void
}

export interface DeleteLocationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  location: Location | null
  childCount: number
  onConfirm: () => Promise<void>
  isSubmitting?: boolean
}

// =============================================================================
// LOCATION TYPE CONFIG (for badges)
// =============================================================================

export const LOCATION_TYPE_CONFIG: Record<
  LocationType,
  { label: string; variant: 'success' | 'info' | 'secondary' | 'warning' }
> = {
  facility: { label: 'Facility', variant: 'success' },
  department: { label: 'Department', variant: 'info' },
  zone: { label: 'Zone', variant: 'secondary' },
  building: { label: 'Building', variant: 'warning' },
  floor: { label: 'Floor', variant: 'secondary' },
  area: { label: 'Area', variant: 'secondary' },
  equipment: { label: 'Equipment', variant: 'info' },
}

// =============================================================================
// TIMEZONE OPTIONS
// =============================================================================

export const TIMEZONE_OPTIONS = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'Europe/London', label: 'GMT/BST' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Europe/Berlin', label: 'Central European Time (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
  { value: 'Asia/Singapore', label: 'Singapore Time (SGT)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
  { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
] as const

// =============================================================================
// LOCATION TYPE OPTIONS (for select)
// =============================================================================

export const LOCATION_TYPE_OPTIONS = [
  { value: 'facility', label: 'Facility' },
  { value: 'department', label: 'Department' },
  { value: 'zone', label: 'Zone' },
  { value: 'building', label: 'Building' },
  { value: 'floor', label: 'Floor' },
  { value: 'area', label: 'Area' },
  { value: 'equipment', label: 'Equipment' },
] as const

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Count all descendants of a location
 */
export function countDescendants(location: Location): number {
  if (!location.children?.length) return 0
  return location.children.reduce(
    (count, child) => count + 1 + countDescendants(child),
    0
  )
}

/**
 * Flatten hierarchical location tree into a flat array
 */
export function flattenLocations(locations: Location[]): Location[] {
  return locations.flatMap((loc) => [
    loc,
    ...(loc.children ? flattenLocations(loc.children) : []),
  ])
}

/**
 * Find a location by ID in a hierarchical tree
 */
export function findLocationById(
  locations: Location[],
  id: string
): Location | null {
  for (const location of locations) {
    if (location.id === id) return location
    if (location.children) {
      const found = findLocationById(location.children, id)
      if (found) return found
    }
  }
  return null
}

/**
 * Get total count of all locations in the tree
 */
export function getTotalLocationCount(locations: Location[]): number {
  return locations.reduce(
    (count, loc) =>
      count + 1 + (loc.children ? getTotalLocationCount(loc.children) : 0),
    0
  )
}
