/**
 * LocationPicker - Mobile-optimized location selector
 *
 * Designed for field workers with simple, intuitive UX:
 * 1. GPS button is PRIMARY (big, prominent, one-tap)
 * 2. Recent locations for quick access
 * 3. Browse all locations via bottom sheet
 *
 * @example
 * ```tsx
 * <LocationPicker
 *   locations={locationTree}
 *   value={selectedLocation}
 *   onChange={setSelectedLocation}
 *   showGps
 * />
 * ```
 */

import * as React from 'react'
import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import {
  MapPin,
  Loader2,
  Navigation,
  Clock,
  ChevronRight,
  Search,
  X,
  Check,
} from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Button } from '../button'
import { LocationTree } from './LocationTree'
import { FloorPlanMarker } from './FloorPlanMarker'
import { mockConvertToWords } from '../what3words/mock-data'
import type { What3WordsCoordinates } from '../what3words'
import type { LocationPickerProps, LocationNode, LocationValue, PrecisionMarker } from './types'

// =============================================================================
// CONSTANTS
// =============================================================================

const RECENT_LOCATIONS_KEY = 'dds-recent-locations'
const MAX_RECENT_LOCATIONS = 5

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Get recent locations from localStorage
 */
function getRecentLocations(): LocationValue[] {
  try {
    const stored = localStorage.getItem(RECENT_LOCATIONS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Save a location to recent history
 */
function saveToRecent(location: LocationValue) {
  try {
    const recent = getRecentLocations()
    // Remove if already exists (to move to top)
    const filtered = recent.filter((r) => r.id !== location.id)
    // Add to front
    const updated = [location, ...filtered].slice(0, MAX_RECENT_LOCATIONS)
    localStorage.setItem(RECENT_LOCATIONS_KEY, JSON.stringify(updated))
  } catch {
    // Silently fail
  }
}

/**
 * Flatten tree to get all node IDs
 */
function getAllNodeIds(nodes: LocationNode[]): string[] {
  const ids: string[] = []
  const traverse = (nodeList: LocationNode[]) => {
    for (const node of nodeList) {
      ids.push(node.id)
      if (node.children) {
        traverse(node.children)
      }
    }
  }
  traverse(nodes)
  return ids
}

// =============================================================================
// COMPONENT
// =============================================================================

export function LocationPicker({
  locations,
  value,
  onChange,
  placeholder = 'Select location',
  showGps = true,
  disabled = false,
  error = false,
  className,
}: LocationPickerProps) {
  // State
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [isGpsLoading, setIsGpsLoading] = useState(false)
  const [recentLocations, setRecentLocations] = useState<LocationValue[]>([])

  // Refs
  const sheetRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Load recent locations on mount
  useEffect(() => {
    setRecentLocations(getRecentLocations())
  }, [])

  // Expand all when searching
  useEffect(() => {
    if (searchQuery) {
      setExpandedIds(new Set(getAllNodeIds(locations)))
    }
  }, [searchQuery, locations])

  // Focus search input when sheet opens
  useEffect(() => {
    if (isSheetOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [isSheetOpen])

  // Handle node selection
  const handleSelect = useCallback(
    (node: LocationNode, path: string[]) => {
      const newValue: LocationValue = {
        id: node.id,
        path,
        label: node.label,
        coordinates: node.coordinates,
        what3words: node.what3words,
        floorPlanImage: node.floorPlanImage,
        // Reset precision marker when selecting new location
        precisionMarker: undefined,
      }
      onChange(newValue)
      saveToRecent(newValue)
      setRecentLocations(getRecentLocations())
      setIsSheetOpen(false)
      setSearchQuery('')
    },
    [onChange]
  )

  // Handle precision marker change on floor plan
  const handlePrecisionMarkerChange = useCallback(
    (marker: PrecisionMarker | null) => {
      if (!value) return
      onChange({
        ...value,
        precisionMarker: marker || undefined,
      })
    },
    [value, onChange]
  )

  // Handle recent location selection
  const handleRecentSelect = (location: LocationValue) => {
    onChange(location)
    saveToRecent(location)
    setRecentLocations(getRecentLocations())
  }

  // Toggle node expansion
  const handleToggle = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  // Handle GPS location
  const handleGpsClick = async () => {
    if (!navigator.geolocation) {
      alert('GPS is not available on this device')
      return
    }

    setIsGpsLoading(true)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        })
      })

      const coords: What3WordsCoordinates = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }

      // Convert to what3words
      const w3wValue = await mockConvertToWords(coords)

      const newValue: LocationValue = {
        id: `gps-${Date.now()}`,
        path: ['Current Location'],
        label: `///` + w3wValue.words,
        coordinates: coords,
        what3words: w3wValue.words,
      }

      onChange(newValue)
      saveToRecent(newValue)
      setRecentLocations(getRecentLocations())
    } catch (err) {
      const geoError = err as GeolocationPositionError
      if (geoError.code === geoError.PERMISSION_DENIED) {
        alert('Location permission denied. Please enable in your device settings.')
      } else {
        alert('Could not get your location. Please try again.')
      }
    } finally {
      setIsGpsLoading(false)
    }
  }

  // Clear selection
  const handleClear = () => {
    onChange(null)
  }

  // Close sheet on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsSheetOpen(false)
      setSearchQuery('')
    }
  }

  // Display value
  const displayValue = useMemo(() => {
    if (!value) return null
    if (value.what3words) {
      return `///` + value.what3words
    }
    return value.label
  }, [value])

  return (
    <div className={cn('space-y-3', className)}>
      {/* Selected Location Display */}
      {value && (
        <div
          className={cn(
            'flex items-center gap-3 p-3 rounded-lg border bg-surface',
            error ? 'border-error' : 'border-success bg-success/5'
          )}
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
            <Check className="h-5 w-5 text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary truncate">{displayValue}</p>
            {value.path.length > 1 && (
              <p className="text-xs text-tertiary truncate">
                {value.path.slice(0, -1).join(' → ')}
              </p>
            )}
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 hover:bg-muted-bg rounded-lg transition-colors"
              aria-label="Clear selection"
            >
              <X className="h-5 w-5 text-tertiary" />
            </button>
          )}
        </div>
      )}

      {/* Floor Plan Marker - show when location has floor plan */}
      {value?.floorPlanImage && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary">
            Mark the exact spot on the floor plan
          </p>
          <FloorPlanMarker
            imageUrl={value.floorPlanImage}
            marker={value.precisionMarker || null}
            onMarkerChange={handlePrecisionMarkerChange}
            disabled={disabled}
            showDescription
            descriptionPlaceholder="Describe the exact spot (optional)"
          />
        </div>
      )}

      {/* GPS Button - PRIMARY ACTION */}
      {showGps && !value && (
        <button
          type="button"
          onClick={handleGpsClick}
          disabled={disabled || isGpsLoading}
          className={cn(
            'w-full flex items-center gap-4 p-4 rounded-lg border-2 border-dashed transition-all',
            'min-h-[72px]', // 72px touch target
            disabled
              ? 'opacity-50 cursor-not-allowed border-default bg-muted-bg'
              : 'border-accent bg-accent/5 hover:bg-accent/10 hover:border-accent active:scale-[0.98]'
          )}
        >
          <div
            className={cn(
              'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center',
              isGpsLoading ? 'bg-accent/20' : 'bg-accent/10'
            )}
          >
            {isGpsLoading ? (
              <Loader2 className="h-6 w-6 text-accent animate-spin" />
            ) : (
              <Navigation className="h-6 w-6 text-accent" />
            )}
          </div>
          <div className="flex-1 text-left">
            <p className="text-base font-semibold text-accent">
              {isGpsLoading ? 'Getting location...' : 'Use My Current Location'}
            </p>
            <p className="text-sm text-tertiary">
              {isGpsLoading ? 'Please wait' : 'Tap to capture GPS position'}
            </p>
          </div>
        </button>
      )}

      {/* Recent Locations */}
      {!value && recentLocations.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Clock className="h-4 w-4 text-tertiary" />
            <span className="text-xs font-medium text-tertiary uppercase tracking-wide">
              Recent
            </span>
          </div>
          <div className="space-y-1">
            {recentLocations.slice(0, 3).map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleRecentSelect(loc)}
                disabled={disabled}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-3 rounded-lg border border-default bg-surface transition-colors',
                  'min-h-[48px]', // 48px touch target
                  disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-muted-bg active:bg-muted-bg'
                )}
              >
                <MapPin className="h-5 w-5 text-tertiary flex-shrink-0" />
                <span className="flex-1 text-left text-sm text-primary truncate">
                  {loc.what3words ? `///${loc.what3words}` : loc.label}
                </span>
                <ChevronRight className="h-4 w-4 text-tertiary flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Browse All Locations Button */}
      {!value && (
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsSheetOpen(true)}
          disabled={disabled}
          className="w-full min-h-[48px] justify-between"
        >
          <span className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>{placeholder}</span>
          </span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* Change Location Button (when selected) */}
      {value && !disabled && (
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsSheetOpen(true)}
          className="w-full min-h-[48px]"
        >
          Change Location
        </Button>
      )}

      {/* Bottom Sheet */}
      {isSheetOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center sm:items-center"
          onClick={handleBackdropClick}
        >
          <div
            ref={sheetRef}
            className={cn(
              'w-full max-w-lg bg-surface rounded-t-2xl sm:rounded-2xl shadow-xl',
              'max-h-[85vh] flex flex-col',
              'animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Header */}
            <div className="flex items-center justify-between p-4 border-b border-default">
              <h2 className="text-lg font-semibold text-primary">Select Location</h2>
              <button
                type="button"
                onClick={() => {
                  setIsSheetOpen(false)
                  setSearchQuery('')
                }}
                className="p-2 hover:bg-muted-bg rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-tertiary" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-3 border-b border-default">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-tertiary" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search locations..."
                  className={cn(
                    'w-full h-12 pl-10 pr-4 rounded-lg border border-default bg-surface',
                    'text-base text-primary placeholder:text-tertiary',
                    'focus:outline-none focus:border-ring focus:ring-ring/40 focus:ring-2'
                  )}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted-bg rounded"
                  >
                    <X className="h-4 w-4 text-tertiary" />
                  </button>
                )}
              </div>
            </div>

            {/* Location Tree */}
            <div className="flex-1 overflow-y-auto p-3">
              {locations.length > 0 ? (
                <LocationTree
                  nodes={locations}
                  searchQuery={searchQuery}
                  selectedId={value?.id}
                  onSelect={handleSelect}
                  expandedIds={expandedIds}
                  onToggle={handleToggle}
                />
              ) : (
                <p className="text-sm text-tertiary text-center py-8">
                  No locations available
                </p>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

LocationPicker.displayName = 'LocationPicker'

export default LocationPicker
