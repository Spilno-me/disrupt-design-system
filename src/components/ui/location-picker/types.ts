/**
 * Location Picker Types
 *
 * Hierarchical location selection with search, GPS, and optional what3words.
 */

import type { What3WordsCoordinates } from '../what3words'

// =============================================================================
// LOCATION DATA TYPES
// =============================================================================

/**
 * A location node in the hierarchy
 */
export interface LocationNode {
  /** Unique identifier */
  id: string
  /** Display name */
  label: string
  /** Optional icon name (lucide icon) */
  icon?: string
  /** Child locations */
  children?: LocationNode[]
  /** GPS coordinates if known */
  coordinates?: What3WordsCoordinates
  /** What3words address if known */
  what3words?: string
  /** Whether this is a selectable leaf node */
  selectable?: boolean
  /** URL to floor plan image for precise indoor marking */
  floorPlanImage?: string
  /** Optional real-world bounds for floor plan (for coordinate mapping) */
  floorPlanBounds?: {
    north: number
    south: number
    east: number
    west: number
  }
}

/**
 * Precision marker position on a floor plan
 */
export interface PrecisionMarker {
  /** X position as percentage (0-100) */
  x: number
  /** Y position as percentage (0-100) */
  y: number
  /** Optional description of the precise location */
  description?: string
}

/**
 * Selected location value
 */
export interface LocationValue {
  /** Location node ID */
  id: string
  /** Full path labels (e.g., ["Warehouses", "Warehouse A", "Section 1"]) */
  path: string[]
  /** Display label */
  label: string
  /** Coordinates if available */
  coordinates?: What3WordsCoordinates
  /** What3words if available */
  what3words?: string
  /** Floor plan image URL (copied from LocationNode for convenience) */
  floorPlanImage?: string
  /** Precise marker position on floor plan */
  precisionMarker?: PrecisionMarker
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================

export interface LocationPickerProps {
  /** Available locations (hierarchical) */
  locations: LocationNode[]
  /** Currently selected location */
  value?: LocationValue | null
  /** Called when location changes */
  onChange: (value: LocationValue | null) => void
  /** Placeholder text */
  placeholder?: string
  /** Show GPS button */
  showGps?: boolean
  /** Disable the picker */
  disabled?: boolean
  /** Error state */
  error?: boolean
  /** Additional className */
  className?: string
}

export interface LocationTreeProps {
  /** Location nodes to render */
  nodes: LocationNode[]
  /** Current search query */
  searchQuery: string
  /** Currently selected location ID */
  selectedId?: string
  /** Called when a location is selected */
  onSelect: (node: LocationNode, path: string[]) => void
  /** Expanded node IDs */
  expandedIds: Set<string>
  /** Toggle node expansion */
  onToggle: (id: string) => void
  /** Parent path for building full path */
  parentPath?: string[]
  /** Depth level for indentation */
  depth?: number
  /** Show drill-down mode (flat list with arrows for folders) */
  showDrillDown?: boolean
}
