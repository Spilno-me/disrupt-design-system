/**
 * DirectorySearchResults - Unified search dropdown for Organization Directory
 *
 * Features:
 * - Dropdown overlay anchored to search input
 * - Two sections: People (max 5) and Locations (max 3)
 * - Keyboard navigation (↑↓ arrows, Enter to select)
 * - Glass styling with accent border
 * - Click outside to close
 */

import * as React from 'react'
import { useRef, useEffect, useCallback, useState } from 'react'
import { Users, MapPin, Search, ChevronRight } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { PersonSearchResult } from './PersonSearchResult'
import { LocationSearchResult } from './LocationSearchResult'
import { findPersonLocation } from '../utils/searchUtils'
import type { DirectorySearchResult, DirectoryPerson, LocationWithPeople } from '../types'

export interface DirectorySearchResultsProps {
  /** Search results */
  results: DirectorySearchResult
  /** Search query */
  query: string
  /** All locations (for finding person's location) */
  locations: LocationWithPeople[]
  /** Whether dropdown is open */
  isOpen: boolean
  /** Close handler */
  onClose: () => void
  /** Person click handler */
  onPersonSelect: (person: DirectoryPerson, locationId: string) => void
  /** Location click handler */
  onLocationSelect: (locationId: string) => void
  /** Show all results handler */
  onShowAllResults?: () => void
}

export function DirectorySearchResults({
  results,
  query,
  locations,
  isOpen,
  onClose,
  onPersonSelect,
  onLocationSelect,
  onShowAllResults,
}: DirectorySearchResultsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  // Total selectable items
  const totalItems = results.people.length + results.locations.length
  const hasResults = totalItems > 0
  const hasMorePeople = results.totalPeopleCount > results.people.length
  const hasMoreLocations = results.totalLocationCount > results.locations.length

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(-1)
  }, [results])

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    // Delay to avoid immediate close on open
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 0)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen || !hasResults) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < totalItems - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : totalItems - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0) {
            handleItemSelect(selectedIndex)
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, hasResults, totalItems, selectedIndex])

  // Select item by index
  const handleItemSelect = useCallback(
    (index: number) => {
      if (index < results.people.length) {
        // Person selected
        const person = results.people[index]
        const personLocation = findPersonLocation(locations, person.id)
        if (personLocation) {
          onPersonSelect(person, personLocation.id)
        }
      } else {
        // Location selected
        const locationIndex = index - results.people.length
        const location = results.locations[locationIndex]
        onLocationSelect(location.id)
      }
      onClose()
    },
    [results, locations, onPersonSelect, onLocationSelect, onClose]
  )

  // Get location name for a person
  const getPersonLocationName = useCallback(
    (person: DirectoryPerson) => {
      const location = findPersonLocation(locations, person.id)
      return location?.name
    },
    [locations]
  )

  if (!isOpen) return null

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute top-full left-0 right-0 mt-2 z-50',
        'bg-white/60 dark:bg-black/60 backdrop-blur-[8px]',
        'border-2 border-accent rounded-lg shadow-lg',
        'max-h-96 overflow-auto',
        'animate-in fade-in slide-in-from-top-2 duration-200'
      )}
      role="listbox"
      aria-label="Search results"
      data-slot="directory-search-results"
    >
      {!hasResults ? (
        // Empty state
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted-bg mb-3">
            <Search className="size-5 text-tertiary" />
          </div>
          <p className="text-sm font-medium text-primary mb-1">
            No results found
          </p>
          <p className="text-xs text-secondary">
            Try a different search term
          </p>
        </div>
      ) : (
        <>
          {/* People section */}
          {results.people.length > 0 && (
            <div className="py-2">
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-secondary uppercase tracking-wide">
                <Users className="size-3.5" />
                <span>People</span>
                <span className="text-tertiary">
                  ({results.totalPeopleCount})
                </span>
              </div>
              {results.people.map((person, index) => (
                <PersonSearchResult
                  key={person.id}
                  person={person}
                  query={query}
                  locationName={getPersonLocationName(person)}
                  isSelected={selectedIndex === index}
                  onClick={() => handleItemSelect(index)}
                />
              ))}
              {hasMorePeople && (
                <button
                  type="button"
                  onClick={onShowAllResults}
                  className="w-full flex items-center justify-center gap-1 px-3 py-2 text-xs text-accent hover:text-accent-strong transition-colors"
                >
                  <span>See all {results.totalPeopleCount} people</span>
                  <ChevronRight className="size-3" />
                </button>
              )}
            </div>
          )}

          {/* Separator */}
          {results.people.length > 0 && results.locations.length > 0 && (
            <div className="h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent mx-3" />
          )}

          {/* Locations section */}
          {results.locations.length > 0 && (
            <div className="py-2">
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-secondary uppercase tracking-wide">
                <MapPin className="size-3.5" />
                <span>Locations</span>
                <span className="text-tertiary">
                  ({results.totalLocationCount})
                </span>
              </div>
              {results.locations.map((location, index) => {
                const globalIndex = results.people.length + index
                return (
                  <LocationSearchResult
                    key={location.id}
                    location={location}
                    query={query}
                    isSelected={selectedIndex === globalIndex}
                    onClick={() => handleItemSelect(globalIndex)}
                  />
                )
              })}
              {hasMoreLocations && (
                <button
                  type="button"
                  onClick={onShowAllResults}
                  className="w-full flex items-center justify-center gap-1 px-3 py-2 text-xs text-accent hover:text-accent-strong transition-colors"
                >
                  <span>See all {results.totalLocationCount} locations</span>
                  <ChevronRight className="size-3" />
                </button>
              )}
            </div>
          )}

          {/* Keyboard hint */}
          <div className="flex items-center justify-center gap-4 px-3 py-2 border-t border-accent/10 text-[10px] text-tertiary">
            <span>
              <kbd className="px-1 py-0.5 rounded bg-muted-bg text-secondary font-mono">
                ↑↓
              </kbd>{' '}
              navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-muted-bg text-secondary font-mono">
                ↵
              </kbd>{' '}
              select
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-muted-bg text-secondary font-mono">
                esc
              </kbd>{' '}
              close
            </span>
          </div>
        </>
      )}
    </div>
  )
}

DirectorySearchResults.displayName = 'DirectorySearchResults'
