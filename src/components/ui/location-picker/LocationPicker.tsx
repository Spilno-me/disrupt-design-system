/**
 * LocationPicker - Mobile-optimized location selector
 *
 * Designed for field workers with simple, intuitive UX:
 * 1. GPS button is PRIMARY (big, prominent, one-tap)
 * 2. Recent locations for quick access
 * 3. Browse all locations via bottom sheet
 * 4. Preview card before final selection
 * 5. Breadcrumb navigation in tree view
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
  ChevronLeft,
  Search,
  X,
  Check,
  Home,
  Image as ImageIcon,
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

/**
 * Find a node by ID in the tree
 */
function findNodeById(nodes: LocationNode[], id: string): LocationNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNodeById(node.children, id)
      if (found) return found
    }
  }
  return null
}

/**
 * Get path to a node
 */
function getPathToNode(
  nodes: LocationNode[],
  targetId: string,
  currentPath: LocationNode[] = []
): LocationNode[] | null {
  for (const node of nodes) {
    const newPath = [...currentPath, node]
    if (node.id === targetId) return newPath
    if (node.children) {
      const found = getPathToNode(node.children, targetId, newPath)
      if (found) return found
    }
  }
  return null
}

// =============================================================================
// BREADCRUMB COMPONENT
// =============================================================================

interface BreadcrumbProps {
  path: LocationNode[]
  onNavigate: (node: LocationNode | null) => void
}

function Breadcrumbs({ path, onNavigate }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-1 px-3 py-2 bg-muted-bg/50 border-b border-default overflow-x-auto">
      <button
        type="button"
        onClick={() => onNavigate(null)}
        className={cn(
          'flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors shrink-0',
          path.length === 0
            ? 'bg-accent/10 text-accent'
            : 'text-tertiary hover:text-primary hover:bg-muted-bg'
        )}
      >
        <Home className="h-3.5 w-3.5" />
        <span>All</span>
      </button>
      {path.map((node, index) => (
        <React.Fragment key={node.id}>
          <ChevronRight className="h-3.5 w-3.5 text-tertiary shrink-0" />
          <button
            type="button"
            onClick={() => onNavigate(node)}
            className={cn(
              'px-2 py-1 rounded text-xs font-medium transition-colors truncate max-w-[120px] shrink-0',
              index === path.length - 1
                ? 'bg-accent/10 text-accent'
                : 'text-tertiary hover:text-primary hover:bg-muted-bg'
            )}
          >
            {node.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  )
}

// =============================================================================
// PREVIEW CARD COMPONENT
// =============================================================================

interface PreviewCardProps {
  node: LocationNode
  path: string[]
  onConfirm: () => void
  onCancel: () => void
}

function PreviewCard({ node, path, onConfirm, onCancel }: PreviewCardProps) {
  const hasFloorPlan = !!node.floorPlanImage

  return (
    <div className="p-4 border-t border-default bg-surface">
      <div className="flex gap-4">
        {/* Floor plan preview */}
        {hasFloorPlan && (
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted-bg shrink-0">
            <img
              src={node.floorPlanImage}
              alt={`${node.label} floor plan`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-primary truncate">{node.label}</h3>
          <p className="text-xs text-tertiary truncate mt-0.5">
            {path.slice(0, -1).join(' → ') || 'Root location'}
          </p>
          {hasFloorPlan && (
            <div className="flex items-center gap-1 mt-2 text-xs text-accent">
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Floor plan available</span>
            </div>
          )}
          {node.coordinates && (
            <p className="text-xs text-tertiary mt-1">
              {node.coordinates.lat.toFixed(4)}, {node.coordinates.lng.toFixed(4)}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <Button
          type="button"
          variant="default"
          onClick={onConfirm}
          className="flex-1"
        >
          <Check className="h-4 w-4 mr-1" />
          Select
        </Button>
      </div>
    </div>
  )
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

  // Breadcrumb navigation state
  const [currentParentId, setCurrentParentId] = useState<string | null>(null)
  const [breadcrumbPath, setBreadcrumbPath] = useState<LocationNode[]>([])

  // Preview state - node selected but not confirmed
  const [previewNode, setPreviewNode] = useState<{
    node: LocationNode
    path: string[]
  } | null>(null)

  // Refs
  const sheetRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Current level nodes based on breadcrumb navigation
  const currentNodes = useMemo(() => {
    if (searchQuery) return locations // Show all when searching
    if (!currentParentId) return locations
    const parent = findNodeById(locations, currentParentId)
    return parent?.children || []
  }, [locations, currentParentId, searchQuery])

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

  // Reset navigation when sheet closes
  useEffect(() => {
    if (!isSheetOpen) {
      setCurrentParentId(null)
      setBreadcrumbPath([])
      setPreviewNode(null)
    }
  }, [isSheetOpen])

  // Handle breadcrumb navigation
  const handleBreadcrumbNavigate = useCallback((node: LocationNode | null) => {
    setPreviewNode(null)
    if (!node) {
      setCurrentParentId(null)
      setBreadcrumbPath([])
    } else {
      setCurrentParentId(node.id)
      // Update path to this node
      const pathToNode = getPathToNode(locations, node.id)
      setBreadcrumbPath(pathToNode || [])
    }
  }, [locations])

  // Handle node click - drill down or preview
  const handleNodeClick = useCallback(
    (node: LocationNode, path: string[]) => {
      const isSelectable = node.selectable !== false
      const hasChildren = node.children && node.children.length > 0

      if (hasChildren && !isSelectable) {
        // Navigate into folder
        setCurrentParentId(node.id)
        const pathToNode = getPathToNode(locations, node.id)
        setBreadcrumbPath(pathToNode || [])
        setPreviewNode(null)
      } else if (isSelectable) {
        // Show preview card
        setPreviewNode({ node, path })
      }
    },
    [locations]
  )

  // Handle final selection
  const handleConfirmSelection = useCallback(() => {
    if (!previewNode) return

    const { node, path } = previewNode
    const newValue: LocationValue = {
      id: node.id,
      path,
      label: node.label,
      coordinates: node.coordinates,
      what3words: node.what3words,
      floorPlanImage: node.floorPlanImage,
      precisionMarker: undefined,
    }
    onChange(newValue)
    saveToRecent(newValue)
    setRecentLocations(getRecentLocations())
    setIsSheetOpen(false)
    setSearchQuery('')
    setPreviewNode(null)
  }, [previewNode, onChange])

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

  // Toggle node expansion (for search mode)
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
                {loc.floorPlanImage && (
                  <ImageIcon className="h-4 w-4 text-accent flex-shrink-0" />
                )}
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

            {/* Breadcrumbs - only show when not searching */}
            {!searchQuery && breadcrumbPath.length > 0 && (
              <Breadcrumbs
                path={breadcrumbPath}
                onNavigate={handleBreadcrumbNavigate}
              />
            )}

            {/* Location Tree */}
            <div className="flex-1 overflow-y-auto p-3">
              {currentNodes.length > 0 ? (
                <LocationTree
                  nodes={currentNodes}
                  searchQuery={searchQuery}
                  selectedId={value?.id}
                  onSelect={handleNodeClick}
                  expandedIds={expandedIds}
                  onToggle={handleToggle}
                  showDrillDown={!searchQuery}
                />
              ) : (
                <p className="text-sm text-tertiary text-center py-8">
                  {searchQuery ? 'No locations match your search' : 'No locations available'}
                </p>
              )}
            </div>

            {/* Preview Card */}
            {previewNode && (
              <PreviewCard
                node={previewNode.node}
                path={previewNode.path}
                onConfirm={handleConfirmSelection}
                onCancel={() => setPreviewNode(null)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

LocationPicker.displayName = 'LocationPicker'

export default LocationPicker
