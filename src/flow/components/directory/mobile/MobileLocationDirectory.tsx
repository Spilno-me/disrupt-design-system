/**
 * MobileLocationDirectory - Drill-down navigation for mobile
 *
 * Full-screen directory experience with:
 * - Breadcrumb navigation at top
 * - List of sub-locations with people counts
 * - People section at current location
 * - Tap location to drill down, back button to go up
 */

import * as React from 'react'
import { useState, useMemo, useCallback } from 'react'
import { ChevronLeft, ChevronRight, MapPin, Users, Search, Eye, EyeOff } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { SearchFilter } from '../../../../components/shared/SearchFilter'
import { PersonCard } from '../people/PersonCard'
import { PersonDetailSheet } from './PersonDetailSheet'
import type { LocationWithPeople, DirectoryPerson } from '../types'

interface MobileLocationDirectoryProps {
  /** Location tree */
  locations: LocationWithPeople[]
  /** Callback when viewing full profile */
  onViewProfile: (userId: string) => void
  /** Callback when emailing */
  onEmail?: (email: string) => void
  /** Callback when calling */
  onCall?: (phone: string) => void
}

/**
 * Find a location by ID in the tree (recursive)
 */
function findLocationById(
  locations: LocationWithPeople[],
  id: string
): LocationWithPeople | null {
  for (const loc of locations) {
    if (loc.id === id) return loc
    if (loc.children) {
      const found = findLocationById(loc.children, id)
      if (found) return found
    }
  }
  return null
}

/**
 * Build breadcrumb path to a location
 */
function buildBreadcrumb(
  locations: LocationWithPeople[],
  targetId: string,
  path: LocationWithPeople[] = []
): LocationWithPeople[] | null {
  for (const loc of locations) {
    if (loc.id === targetId) {
      return [...path, loc]
    }
    if (loc.children) {
      const result = buildBreadcrumb(loc.children, targetId, [...path, loc])
      if (result) return result
    }
  }
  return null
}

export function MobileLocationDirectory({
  locations,
  onViewProfile,
  onEmail,
  onCall,
}: MobileLocationDirectoryProps) {
  // Navigation state
  const [currentLocationId, setCurrentLocationId] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [showInherited, setShowInherited] = useState(true)

  // Person detail sheet state
  const [selectedPerson, setSelectedPerson] = useState<DirectoryPerson | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Get current location data
  const currentLocation = useMemo(
    () => (currentLocationId ? findLocationById(locations, currentLocationId) : null),
    [locations, currentLocationId]
  )

  // Build breadcrumb
  const breadcrumb = useMemo(() => {
    if (!currentLocationId) return []
    return buildBreadcrumb(locations, currentLocationId) || []
  }, [locations, currentLocationId])

  // Get items to display (root locations or children of current)
  const displayLocations = useMemo(() => {
    if (!currentLocation) return locations
    return currentLocation.children || []
  }, [currentLocation, locations])

  // Get people at current location
  const currentPeople = useMemo(() => {
    if (!currentLocation?.people) return []
    if (showInherited) return currentLocation.people
    return currentLocation.people.filter((p) => p.assignmentType === 'direct')
  }, [currentLocation, showInherited])

  // Filter locations by search
  const filteredLocations = useMemo(() => {
    if (!searchValue.trim()) return displayLocations
    const search = searchValue.toLowerCase()
    return displayLocations.filter((loc) =>
      loc.name.toLowerCase().includes(search) ||
      loc.code?.toLowerCase().includes(search)
    )
  }, [displayLocations, searchValue])

  // Handle location tap (drill down)
  const handleLocationTap = useCallback((locationId: string) => {
    setCurrentLocationId(locationId)
    setSearchValue('')
  }, [])

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (breadcrumb.length <= 1) {
      setCurrentLocationId(null)
    } else {
      const parentIndex = breadcrumb.length - 2
      setCurrentLocationId(breadcrumb[parentIndex].id)
    }
  }, [breadcrumb])

  // Handle person tap
  const handlePersonTap = useCallback((person: DirectoryPerson) => {
    setSelectedPerson(person)
    setIsSheetOpen(true)
  }, [])

  // Handle email action
  const handleEmail = useCallback((email: string) => {
    window.location.href = `mailto:${email}`
    onEmail?.(email)
  }, [onEmail])

  // Handle call action
  const handleCall = useCallback((phone: string) => {
    window.location.href = `tel:${phone}`
    onCall?.(phone)
  }, [onCall])

  return (
    <div className="flex flex-col h-full bg-canvas">
      {/* Header with back button and title */}
      <div className="sticky top-0 z-10 bg-surface border-b border-default">
        <div className="flex items-center gap-3 px-4 py-3">
          {currentLocationId && (
            <Button
              variant="ghost"
              size="sm"
              className="size-10 p-0 shrink-0"
              onClick={handleBack}
            >
              <ChevronLeft className="size-5" />
            </Button>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-primary truncate">
              {currentLocation?.name || 'Directory'}
            </h1>
            {breadcrumb.length > 1 && (
              <p className="text-xs text-secondary truncate">
                {breadcrumb.slice(0, -1).map((l) => l.name).join(' → ')}
              </p>
            )}
          </div>

          {/* Inherited toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="size-10 p-0 shrink-0"
            onClick={() => setShowInherited(!showInherited)}
          >
            {showInherited ? (
              <Eye className="size-5" />
            ) : (
              <EyeOff className="size-5" />
            )}
          </Button>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <SearchFilter
            placeholder="Search..."
            value={searchValue}
            onChange={setSearchValue}
            size="compact"
            hideFilters
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Sub-locations list */}
        {filteredLocations.length > 0 && (
          <div className="p-2">
            <div className="text-xs font-medium text-tertiary uppercase tracking-wider px-2 py-1.5">
              Locations
            </div>
            <div className="space-y-1">
              {filteredLocations.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors',
                    'hover:bg-muted-bg/50 active:bg-muted-bg',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong'
                  )}
                  onClick={() => handleLocationTap(loc.id)}
                >
                  <MapPin className="size-5 text-tertiary shrink-0" />
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-primary truncate">
                      {loc.name}
                    </p>
                    {loc.code && (
                      <p className="text-xs text-tertiary">{loc.code}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" size="sm" className="gap-1">
                      <Users className="size-3" />
                      {showInherited ? loc.totalUserCount : loc.directUserCount}
                    </Badge>
                    <ChevronRight className="size-4 text-tertiary" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* People at current location */}
        {currentLocation && currentPeople.length > 0 && (
          <div className="p-2">
            <div className="text-xs font-medium text-tertiary uppercase tracking-wider px-2 py-1.5 flex items-center justify-between">
              <span>People ({currentPeople.length})</span>
              {currentLocation.inheritedUserCount > 0 && (
                <span className="normal-case font-normal">
                  {showInherited ? 'All' : 'Direct only'}
                </span>
              )}
            </div>
            <div className="space-y-1">
              {currentPeople.map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  variant="compact"
                  onClick={() => handlePersonTap(person)}
                  onEmail={handleEmail}
                  onCall={handleCall}
                  onViewProfile={onViewProfile}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty states */}
        {filteredLocations.length === 0 && currentPeople.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted-bg mb-4">
              <Users className="size-7 text-tertiary" />
            </div>
            {searchValue ? (
              <>
                <p className="text-sm font-medium text-primary mb-1">
                  No results found
                </p>
                <p className="text-xs text-secondary">
                  Try adjusting your search
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-primary mb-1">
                  No locations or people
                </p>
                <p className="text-xs text-secondary">
                  This location has no sub-locations or people assigned
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Person detail sheet */}
      <PersonDetailSheet
        person={selectedPerson}
        location={currentLocation}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onViewProfile={onViewProfile}
        onEmail={handleEmail}
        onCall={handleCall}
      />
    </div>
  )
}

MobileLocationDirectory.displayName = 'MobileLocationDirectory'

export default MobileLocationDirectory
