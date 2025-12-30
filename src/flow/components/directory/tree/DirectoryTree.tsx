/**
 * DirectoryTree - Location-first organization directory tree
 *
 * Features:
 * - Location hierarchy with people counts
 * - Search for locations or people
 * - Expand/collapse with person counts per location
 * - Toggle inherited vs direct users
 * - Click location to show people in right panel
 */

import * as React from 'react'
import { useMemo, useState } from 'react'
import { Users, Search, Eye, EyeOff } from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import { SearchFilter } from '../../../../components/shared/SearchFilter'
import { DirectoryTreeItem } from './DirectoryTreeItem'
import type {
  LocationWithPeople,
  DirectoryTreeProps,
  DirectoryPerson,
} from '../types'

// Maximum depth to auto-expand during search
const MAX_AUTO_EXPAND_DEPTH = 2

/**
 * Get total people count across all locations (for header display)
 */
function getTotalPeopleCount(locations: LocationWithPeople[]): number {
  return locations.reduce((sum, loc) => {
    const childCount = loc.children ? getTotalPeopleCount(loc.children) : 0
    return sum + loc.directUserCount + childCount
  }, 0)
}

export function DirectoryTree({
  locations,
  expandedIds,
  selectedLocationId,
  searchValue,
  showInherited,
  onLocationSelect,
  onToggleExpand,
  onPersonClick,
  onSearchChange,
}: DirectoryTreeProps) {
  const [showInheritedLocal, setShowInheritedLocal] = useState(showInherited)

  // Filter tree based on search value (matches location name or person name)
  const filteredLocations = useMemo(() => {
    if (!searchValue.trim()) return locations

    const search = searchValue.toLowerCase().trim()

    // Recursive filter - include parent if any child matches or people match
    const filterTree = (nodes: LocationWithPeople[]): LocationWithPeople[] => {
      return nodes.reduce<LocationWithPeople[]>((acc, node) => {
        const nameMatch = node.name.toLowerCase().includes(search)
        const codeMatch = node.code?.toLowerCase().includes(search)

        // Check if any person at this location matches (extended fields)
        const personMatch = node.people?.some(
          (p) =>
            p.firstName.toLowerCase().includes(search) ||
            p.lastName.toLowerCase().includes(search) ||
            `${p.firstName} ${p.lastName}`.toLowerCase().includes(search) ||
            p.email.toLowerCase().includes(search) ||
            p.jobTitle.toLowerCase().includes(search) ||
            p.department.toLowerCase().includes(search) ||
            p.roleName.toLowerCase().includes(search) ||
            (p.phone && p.phone.toLowerCase().includes(search))
        )

        const filteredChildren = node.children ? filterTree(node.children) : []

        if (nameMatch || codeMatch || personMatch || filteredChildren.length > 0) {
          acc.push({
            ...node,
            children:
              filteredChildren.length > 0 ? filteredChildren : node.children,
          })
        }

        return acc
      }, [])
    }

    return filterTree(locations)
  }, [locations, searchValue])

  // Auto-expand parents when searching (limited depth)
  const effectiveExpandedIds = useMemo(() => {
    if (!searchValue.trim()) return expandedIds

    const idsToExpand = new Set(expandedIds)

    const collectParentIds = (nodes: LocationWithPeople[], depth = 0) => {
      if (depth >= MAX_AUTO_EXPAND_DEPTH) return

      nodes.forEach((node) => {
        if (node.children && node.children.length > 0) {
          idsToExpand.add(node.id)
          collectParentIds(node.children, depth + 1)
        }
      })
    }

    collectParentIds(filteredLocations)
    return idsToExpand
  }, [expandedIds, filteredLocations, searchValue])

  const totalPeople = getTotalPeopleCount(locations)

  return (
    <div className="flex flex-col h-full">
      {/* Header - Glass depth 2 with elevation */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-b border-accent/20">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-accent-strong" />
          <h2 className="text-base font-semibold text-primary">
            Organization Directory
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-secondary">{totalPeople} people</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowInheritedLocal(!showInheritedLocal)}
            className="gap-1.5"
          >
            {showInheritedLocal ? (
              <>
                <Eye className="size-4" />
                <span className="hidden sm:inline">Inherited</span>
              </>
            ) : (
              <>
                <EyeOff className="size-4" />
                <span className="hidden sm:inline">Direct only</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Search bar - Glass depth 3 */}
      <div className="px-4 py-3 bg-white/20 dark:bg-black/20 backdrop-blur-[2px] border-b border-accent/10">
        <SearchFilter
          placeholder="Search locations or people..."
          value={searchValue}
          onChange={onSearchChange}
          size="compact"
          hideFilters
        />
      </div>

      {/* Tree content */}
      <div
        role="tree"
        aria-label="Organization directory by location"
        className="flex-1 overflow-auto p-2"
      >
        {filteredLocations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted-bg mb-3">
              <Users className="size-6 text-tertiary" />
            </div>
            {searchValue ? (
              <>
                <p className="text-sm font-medium text-primary mb-1">
                  No results found
                </p>
                <p className="text-xs text-secondary">
                  Try adjusting your search terms
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-primary mb-1">
                  No locations with people
                </p>
                <p className="text-xs text-secondary">
                  Add users to locations to see them here
                </p>
              </>
            )}
          </div>
        ) : (
          filteredLocations.map((location) => (
            <DirectoryTreeItem
              key={location.id}
              location={location}
              depth={0}
              isExpanded={effectiveExpandedIds.has(location.id)}
              isSelected={selectedLocationId === location.id}
              selectedLocationId={selectedLocationId}
              expandedIds={effectiveExpandedIds}
              showInherited={showInheritedLocal}
              onExpandToggle={onToggleExpand}
              onSelect={onLocationSelect}
              onPersonClick={onPersonClick}
            />
          ))
        )}
      </div>
    </div>
  )
}

DirectoryTree.displayName = 'DirectoryTree'

export default DirectoryTree
