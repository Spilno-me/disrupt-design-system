/**
 * DirectoryPage - Organization Directory Orchestrator
 *
 * Main page component with two-panel master-detail layout:
 * - Left: Location tree with people counts
 * - Right: People at selected location grouped by role level
 *
 * Features:
 * - Location-first navigation (Location is King!)
 * - QuickFilters for employee status (Active, Pending, Inactive, Locked)
 * - SearchFilter with Department, Status, Role dropdowns
 * - Toggle inherited vs direct employees
 * - Responsive: collapses to single panel on mobile
 *
 * Note: User creation is handled in User Management module.
 * Directory is a read-only view for browsing employees by location.
 *
 * UX Laws Applied:
 * - Hick's Law: Quick filters reduce decision complexity
 * - Fitts' Law: Touch-friendly targets for navigation
 * - Prägnanz: Clear empty states with actionable guidance
 */

import * as React from 'react'
import { useState, useMemo, useCallback, useRef } from 'react'
import {
  Contact2,
  RefreshCw,
  Download,
  Users,
  UserCheck,
  Clock,
  UserX,
  Lock,
} from 'lucide-react'
import { DirectoryTree } from './tree/DirectoryTree'
import { LocationPeoplePanel } from './panels/LocationPeoplePanel'
import { DirectorySearchResults } from './search/DirectorySearchResults'
import { PageActionPanel } from '../../../components/ui/PageActionPanel'
import { Button } from '../../../components/ui/button'
import { QuickFilter, QuickFilterItem } from '../../../components/ui/QuickFilter'
import { SearchFilter } from '../../../components/shared/SearchFilter/SearchFilter'
import type { FilterGroup, FilterState } from '../../../components/shared/SearchFilter/types'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ROLE_LEVEL_CONFIG, type RoleLevel } from '../users/types'
import {
  searchDirectory,
  flattenAllPeople,
  findLocationPath,
} from './utils/searchUtils'
import type {
  DirectoryPageProps,
  LocationWithPeople,
  DirectoryPerson,
  PeopleByRoleLevel,
  DirectoryQuickFilterType,
  DirectorySearchResult,
} from './types'

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

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
 * Find parent chain for a location (for getting inherited users)
 * Returns array from root to immediate parent (not including the target itself)
 */
function findParentChain(
  locations: LocationWithPeople[],
  targetId: string,
  currentChain: LocationWithPeople[] = []
): LocationWithPeople[] | null {
  for (const loc of locations) {
    if (loc.id === targetId) {
      // Found target - return current chain (parents)
      return currentChain
    }
    if (loc.children) {
      const found = findParentChain(loc.children, targetId, [...currentChain, loc])
      if (found) return found
    }
  }
  return null
}

/**
 * Get inherited users for a location from parent locations.
 * Only includes users whose assignment has cascadesToChildren=true.
 * We mark them with assignmentType: 'inherited'.
 */
function getInheritedPeopleForLocation(
  locations: LocationWithPeople[],
  locationId: string,
  locationName: string
): DirectoryPerson[] {
  const parentChain = findParentChain(locations, locationId)
  if (!parentChain || parentChain.length === 0) return []

  const inheritedPeople: DirectoryPerson[] = []
  const seenIds = new Set<string>()

  // Go through each parent and get their users who have cascadesToChildren=true
  for (const parent of parentChain) {
    if (parent.people) {
      for (const person of parent.people) {
        // Only include if their assignment cascades to children
        if (!person.cascadesToChildren) continue

        // Avoid duplicates (same person might be in multiple parent levels)
        if (seenIds.has(person.id)) continue
        seenIds.add(person.id)

        // Mark as inherited with parent location name
        inheritedPeople.push({
          ...person,
          assignmentType: 'inherited',
          inheritedFrom: parent.name,
        })
      }
    }
  }

  return inheritedPeople
}

/**
 * Group people by role level for panel display
 */
function groupPeopleByRoleLevel(people: DirectoryPerson[]): PeopleByRoleLevel[] {
  const groups: PeopleByRoleLevel[] = ([1, 2, 3, 4, 5] as RoleLevel[]).map((level) => {
    const config = ROLE_LEVEL_CONFIG[level]
    return {
      level,
      label: config.label,
      description: config.description,
      badgeVariant: config.badgeVariant,
      iconColor: config.iconColor,
      people: people.filter((p) => p.roleLevel === level),
    }
  })

  return groups.filter((g) => g.people.length > 0)
}

/**
 * Count UNIQUE users by status across all locations.
 * Uses Set to avoid double-counting users who appear in multiple locations (inheritance).
 */
function countUsersByStatus(locations: LocationWithPeople[]): Record<string, number> {
  const seenUsers = new Set<string>()
  const counts = { active: 0, pending: 0, inactive: 0, locked: 0 }

  const countInLocation = (loc: LocationWithPeople) => {
    if (loc.people) {
      loc.people.forEach((person) => {
        // Only count each user once (skip if already seen)
        if (seenUsers.has(person.id)) return
        seenUsers.add(person.id)

        if (person.status === 'active') counts.active++
        else if (person.status === 'pending') counts.pending++
        else if (person.status === 'inactive') counts.inactive++
        else if (person.status === 'locked') counts.locked++
      })
    }
    loc.children?.forEach(countInLocation)
  }

  locations.forEach(countInLocation)
  return counts
}

// =============================================================================
// DEFAULT FILTER GROUPS
// =============================================================================

const createFilterGroups = (departments: string[], roles: { id: string; name: string }[]): FilterGroup[] => [
  {
    key: 'department',
    label: 'Department',
    options: departments.map((dept) => ({ id: dept, label: dept })),
  },
  {
    key: 'status',
    label: 'Status',
    options: [
      { id: 'active', label: 'Active' },
      { id: 'pending', label: 'Pending' },
      { id: 'inactive', label: 'Inactive' },
      { id: 'locked', label: 'Locked' },
    ],
  },
  {
    key: 'role',
    label: 'Role',
    options: roles.map((role) => ({ id: role.id, label: role.name })),
  },
]

// =============================================================================
// COMPONENT
// =============================================================================

export function DirectoryPage({
  locations,
  users,
  roles,
  departments,
  isLoading = false,
  onViewProfile,
  onFetchLocationPeople,
  onRefresh,
  onExport,
}: DirectoryPageProps) {
  // =============================================================================
  // STATE
  // =============================================================================

  // Location tree state
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [locationPeople, setLocationPeople] = useState<DirectoryPerson[]>([])
  const [isPeopleLoading, setIsPeopleLoading] = useState(false)
  const [showInherited, setShowInherited] = useState(true)

  // Filter state
  const [searchValue, setSearchValue] = useState('')
  const [filters, setFilters] = useState<FilterState>({})
  const [activeQuickFilter, setActiveQuickFilter] = useState<DirectoryQuickFilterType>('all')

  // Unified search state
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  // Get selected location data
  const selectedLocation = useMemo(
    () => (selectedLocationId ? findLocationById(locations, selectedLocationId) : null),
    [locations, selectedLocationId]
  )

  // Count users by status for QuickFilter badges
  const statusCounts = useMemo(() => countUsersByStatus(locations), [locations])

  // Filter location tree based on QuickFilter selection
  // Only show locations that have users with the selected status
  const filteredLocations = useMemo(() => {
    if (activeQuickFilter === 'all') return locations

    const filterTree = (locs: LocationWithPeople[]): LocationWithPeople[] => {
      return locs.reduce<LocationWithPeople[]>((acc, loc) => {
        // Check if this location has any users with the selected status
        const hasMatchingUsers = loc.people?.some((p) => p.status === activeQuickFilter)

        // Recursively filter children
        const filteredChildren = loc.children ? filterTree(loc.children) : []

        // Include location if it has matching users OR has children with matching users
        if (hasMatchingUsers || filteredChildren.length > 0) {
          acc.push({
            ...loc,
            // Filter people to only show matching status
            people: loc.people?.filter((p) => p.status === activeQuickFilter),
            children: filteredChildren.length > 0 ? filteredChildren : undefined,
          })
        }

        return acc
      }, [])
    }

    return filterTree(locations)
  }, [locations, activeQuickFilter])

  // Flatten all people from location tree for unified search
  const allPeople = useMemo(() => flattenAllPeople(locations), [locations])

  // Unified search results
  const searchResults = useMemo<DirectorySearchResult>(() => {
    if (!searchValue || searchValue.length < 2) {
      return { people: [], locations: [], totalPeopleCount: 0, totalLocationCount: 0 }
    }
    return searchDirectory(searchValue, allPeople, locations)
  }, [searchValue, allPeople, locations])

  // Filter groups for SearchFilter
  const filterGroups = useMemo(
    () => createFilterGroups(departments, roles.map((r) => ({ id: r.id, name: r.name }))),
    [departments, roles]
  )

  // Filter people based on search, filters, and quick filter
  const filteredPeople = useMemo(() => {
    let people = locationPeople

    // Apply quick filter
    if (activeQuickFilter !== 'all') {
      people = people.filter((p) => p.status === activeQuickFilter)
    }

    // Apply search filter
    if (searchValue) {
      const searchLower = searchValue.toLowerCase()
      people = people.filter(
        (p) =>
          p.firstName.toLowerCase().includes(searchLower) ||
          p.lastName.toLowerCase().includes(searchLower) ||
          p.email.toLowerCase().includes(searchLower) ||
          p.jobTitle.toLowerCase().includes(searchLower) ||
          p.department.toLowerCase().includes(searchLower)
      )
    }

    // Apply dropdown filters
    if (filters.department?.length) {
      people = people.filter((p) => filters.department?.includes(p.department))
    }
    if (filters.status?.length) {
      people = people.filter((p) => filters.status?.includes(p.status))
    }
    if (filters.role?.length) {
      people = people.filter((p) => filters.role?.some((roleId) => p.roleName.includes(roleId)))
    }

    return people
  }, [locationPeople, activeQuickFilter, searchValue, filters])

  // Group filtered people by role level
  const peopleByLevel = useMemo(
    () => groupPeopleByRoleLevel(filteredPeople),
    [filteredPeople]
  )

  // Compute total people count
  const totalPeopleCount = useMemo(() => {
    const countPeople = (locs: LocationWithPeople[]): number => {
      return locs.reduce((sum, loc) => {
        const children = loc.children ? countPeople(loc.children) : 0
        return sum + loc.directUserCount + children
      }, 0)
    }
    return countPeople(locations)
  }, [locations])

  // Check if filters are active
  const hasActiveFilters = searchValue || activeQuickFilter !== 'all' || Object.keys(filters).length > 0

  // =============================================================================
  // HANDLERS
  // =============================================================================

  // Handle location selection
  const handleLocationSelect = useCallback(
    async (locationId: string) => {
      setSelectedLocationId(locationId)

      // Fetch people for this location
      const location = findLocationById(locations, locationId)

      // Get direct users (marked with assignmentType: 'direct')
      let directPeople: DirectoryPerson[] = []
      if (location?.people) {
        // Use cached people - ensure they're marked as direct
        directPeople = location.people.map(p => ({
          ...p,
          assignmentType: 'direct' as const,
        }))
      } else if (onFetchLocationPeople) {
        // Fetch from API
        setIsPeopleLoading(true)
        try {
          const people = await onFetchLocationPeople(locationId)
          directPeople = people.map(p => ({
            ...p,
            assignmentType: 'direct' as const,
          }))
        } catch (error) {
          console.error('Failed to fetch location people:', error)
          directPeople = []
        } finally {
          setIsPeopleLoading(false)
        }
      }

      // Get inherited users from parent locations
      const inheritedPeople = getInheritedPeopleForLocation(
        locations,
        locationId,
        location?.name || ''
      )

      // Combine direct + inherited (direct users already in location shouldn't appear as inherited)
      const directIds = new Set(directPeople.map(p => p.id))
      const uniqueInherited = inheritedPeople.filter(p => !directIds.has(p.id))

      setLocationPeople([...directPeople, ...uniqueInherited])
    },
    [locations, onFetchLocationPeople]
  )

  // Handle expand/collapse
  const handleToggleExpand = useCallback((locationId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(locationId)) {
        next.delete(locationId)
      } else {
        next.add(locationId)
      }
      return next
    })
  }, [])

  // Handle person click (show detail sheet on mobile, or expand card on desktop)
  const handlePersonClick = useCallback(
    (person: DirectoryPerson) => {
      onViewProfile?.(person.id)
    },
    [onViewProfile]
  )

  // Handle view profile
  const handleViewProfile = useCallback(
    (userId: string) => {
      onViewProfile?.(userId)
    },
    [onViewProfile]
  )

  // Handle quick filter click
  const handleQuickFilterClick = (filter: DirectoryQuickFilterType) => {
    setActiveQuickFilter((prev) => (prev === filter ? 'all' : filter))
    // Clear dropdown filters when using quick filter
    if (filter !== 'all') {
      setFilters({})
    }
  }

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    // Open dropdown when typing 2+ characters
    if (value.length >= 2) {
      setIsSearchDropdownOpen(true)
    } else {
      setIsSearchDropdownOpen(false)
    }
  }

  // Handle person selection from search dropdown
  const handleSearchPersonSelect = useCallback(
    (person: DirectoryPerson, locationId: string) => {
      // Expand the tree path to the location
      const path = findLocationPath(locations, locationId)
      setExpandedIds((prev) => {
        const next = new Set(prev)
        path.forEach((id) => next.add(id))
        return next
      })

      // Select the location
      handleLocationSelect(locationId)

      // Close dropdown and optionally view profile
      setIsSearchDropdownOpen(false)
    },
    [locations, handleLocationSelect]
  )

  // Handle location selection from search dropdown
  const handleSearchLocationSelect = useCallback(
    (locationId: string) => {
      // Expand the tree path to the location
      const path = findLocationPath(locations, locationId)
      setExpandedIds((prev) => {
        const next = new Set(prev)
        path.forEach((id) => next.add(id))
        return next
      })

      // Select the location
      handleLocationSelect(locationId)

      // Close dropdown
      setIsSearchDropdownOpen(false)
    },
    [locations, handleLocationSelect]
  )

  // Close search dropdown
  const handleCloseSearchDropdown = useCallback(() => {
    setIsSearchDropdownOpen(false)
  }, [])

  // Handle dropdown filters change
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    // Reset quick filter when using dropdown filters
    if (Object.keys(newFilters).length > 0) {
      setActiveQuickFilter('all')
    }
  }

  // Clear all filters
  const handleClearFilters = () => {
    setSearchValue('')
    setFilters({})
    setActiveQuickFilter('all')
  }

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div
      data-slot="directory-page"
      className="flex flex-col h-full gap-6 p-4 md:p-6 bg-canvas"
    >
      {/* Page Header with Actions */}
      <PageActionPanel
        icon={<Contact2 className="w-6 h-6 md:w-8 md:h-8" />}
        iconClassName="text-accent"
        title="Organization Directory"
        subtitle={`Browse ${totalPeopleCount} employees across ${locations.length} locations`}
        actions={
          <div className="flex items-center gap-2">
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport} className="gap-2">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            )}
            {onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                className="gap-2"
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            )}
          </div>
        }
      />

      {/* Quick Filters */}
      <QuickFilter gap="sm" fullBleed>
        <QuickFilterItem
          variant="info"
          label="Active"
          icon={<UserCheck size={24} />}
          count={statusCounts.active}
          selected={activeQuickFilter === 'active'}
          onClick={() => handleQuickFilterClick('active')}
          size="xs"
        />
        <QuickFilterItem
          variant="warning"
          label="Pending"
          icon={<Clock size={24} />}
          count={statusCounts.pending}
          selected={activeQuickFilter === 'pending'}
          onClick={() => handleQuickFilterClick('pending')}
          size="xs"
        />
        <QuickFilterItem
          variant="default"
          label="Inactive"
          icon={<UserX size={24} />}
          count={statusCounts.inactive}
          selected={activeQuickFilter === 'inactive'}
          onClick={() => handleQuickFilterClick('inactive')}
          size="xs"
        />
        <QuickFilterItem
          variant="primary"
          label="Locked"
          icon={<Lock size={24} />}
          count={statusCounts.locked}
          selected={activeQuickFilter === 'locked'}
          onClick={() => handleQuickFilterClick('locked')}
          size="xs"
        />
      </QuickFilter>

      {/* Search and Filters with Unified Search Dropdown */}
      <div ref={searchContainerRef} className="relative">
        <SearchFilter
          placeholder="Search people by name, email, role, department..."
          value={searchValue}
          onChange={handleSearchChange}
          filterGroups={filterGroups}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          size="compact"
        />

        {/* Unified Search Results Dropdown */}
        <DirectorySearchResults
          results={searchResults}
          query={searchValue}
          locations={locations}
          isOpen={isSearchDropdownOpen && searchValue.length >= 2}
          onClose={handleCloseSearchDropdown}
          onPersonSelect={handleSearchPersonSelect}
          onLocationSelect={handleSearchLocationSelect}
        />
      </div>

      {/* Two-panel Layout - Glass container with accent border */}
      <div className="flex flex-1 overflow-hidden min-h-0 rounded-lg border-2 border-accent bg-white/40 dark:bg-black/40 backdrop-blur-[4px] shadow-md">
        {/* Left panel: Directory Tree - Glass depth 3 */}
        <div className="w-full md:w-1/2 lg:w-[550px] xl:w-[600px] shrink-0 border-r border-accent/30 bg-white/20 dark:bg-black/20 backdrop-blur-[2px] overflow-hidden flex flex-col">
          <DirectoryTree
            locations={filteredLocations}
            expandedIds={expandedIds}
            selectedLocationId={selectedLocationId}
            searchValue={searchValue}
            showInherited={showInherited}
            onLocationSelect={handleLocationSelect}
            onToggleExpand={handleToggleExpand}
            onPersonClick={handlePersonClick}
            onSearchChange={setSearchValue}
          />
        </div>

        {/* Right panel: People at location (hidden on mobile) - Glass depth 3 */}
        <div className="hidden md:flex flex-1 flex-col overflow-hidden bg-white/10 dark:bg-black/10 backdrop-blur-[1px]">
          {selectedLocation ? (
            filteredPeople.length > 0 ? (
              <LocationPeoplePanel
                location={selectedLocation}
                peopleByLevel={peopleByLevel}
                showInherited={showInherited}
                isLoading={isPeopleLoading}
                onToggleInherited={setShowInherited}
                onPersonClick={handlePersonClick}
                onViewProfile={handleViewProfile}
              />
            ) : hasActiveFilters ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <EmptyState
                  variant="filter"
                  title="No people match your filters"
                  description="Try adjusting your search terms or clearing some filters to see more results."
                  actionLabel="Clear all filters"
                  onAction={handleClearFilters}
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6">
                <EmptyState
                  variant="default"
                  title="No employees at this location"
                  description="This location doesn't have any employees assigned yet. Employees can be assigned to locations through User Management."
                />
              </div>
            )
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <EmptyState
                variant="default"
                icon={<Users className="w-12 h-12 text-tertiary" />}
                title="Select a location"
                description="Choose a location from the tree to view the people working there."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

DirectoryPage.displayName = 'DirectoryPage'

export default DirectoryPage
