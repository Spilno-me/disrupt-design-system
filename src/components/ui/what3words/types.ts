/**
 * What3Words Types
 *
 * TypeScript interfaces for the What3Words location selector component.
 * Based on the what3words API v3 response structure.
 */

// =============================================================================
// CORE TYPES
// =============================================================================

/**
 * Geographic coordinates (latitude/longitude)
 */
export interface What3WordsCoordinates {
  lat: number
  lng: number
}

/**
 * A what3words autosuggest suggestion
 */
export interface What3WordsSuggestion {
  /** Full what3words address (e.g., "filled.count.soap") */
  words: string
  /** Nearest named place (e.g., "Bayswater, London") */
  nearestPlace: string
  /** Country name */
  country: string
  /** Distance from focus point in km (when focus coordinates provided) */
  distanceToFocusKm?: number
  /** Geographic coordinates */
  coordinates: What3WordsCoordinates
}

/**
 * Selected what3words value with full details
 */
export interface What3WordsValue {
  /** Full what3words address (e.g., "filled.count.soap") */
  words: string
  /** Geographic coordinates */
  coordinates: What3WordsCoordinates
  /** Nearest named place */
  nearestPlace: string
  /** Country name */
  country: string
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================

/**
 * Props for the What3WordsInput component
 */
export interface What3WordsInputProps {
  /** Currently selected what3words value */
  value?: What3WordsValue | null
  /** Called when user selects a what3words address */
  onChange: (value: What3WordsValue | null) => void
  /** Placeholder text for the input */
  placeholder?: string
  /** Disable the input */
  disabled?: boolean
  /** Show the mini map preview below the input */
  showMap?: boolean
  /** Focus suggestions around these coordinates (e.g., user's GPS location) */
  focusCoordinates?: What3WordsCoordinates
  /** Error state */
  error?: boolean
  /** Additional className for the container */
  className?: string
  /** what3words API key (enables real map when showMap=true) */
  apiKey?: string
  /** Google Maps API key (required for real map) */
  googleMapsApiKey?: string
}

/**
 * Props for the What3WordsMap preview component
 */
export interface What3WordsMapProps {
  /** The selected what3words value to display */
  value: What3WordsValue | null
  /** Additional className */
  className?: string
}

/**
 * Props for the UseMyLocationButton component
 */
export interface UseMyLocationButtonProps {
  /** Called when GPS location is successfully retrieved */
  onLocationFound: (coords: What3WordsCoordinates) => void
  /** Called when GPS retrieval fails */
  onError?: (error: GeolocationPositionError) => void
  /** Disable the button */
  disabled?: boolean
  /** Additional className */
  className?: string
}

// =============================================================================
// INTERNAL TYPES
// =============================================================================

/**
 * GPS permission status
 */
export type GpsPermissionStatus = 'prompt' | 'granted' | 'denied' | 'unavailable'

/**
 * Internal state for the What3WordsInput component
 */
export interface What3WordsInputState {
  /** Current input text */
  query: string
  /** Whether suggestions dropdown is open */
  isOpen: boolean
  /** Current suggestions from autosuggest */
  suggestions: What3WordsSuggestion[]
  /** Loading state for API/mock calls */
  isLoading: boolean
  /** Currently highlighted suggestion index (for keyboard nav) */
  highlightedIndex: number
}
