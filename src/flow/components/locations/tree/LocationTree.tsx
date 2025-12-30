/**
 * LocationTree - Tree container component with search and header
 *
 * Features:
 * - Header with icon, title, count badge, and Add button
 * - Search input with filter icon
 * - Recursive tree rendering with expand/collapse
 * - Search filtering (matches name, type, code)
 * - Smart auto-expand (limited to 2 levels during search)
 * - Mobile support with swipe-to-reveal actions
 */

import * as React from 'react'
import { useMemo, useState } from 'react'
import { MapPin, Plus } from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import { SearchFilter } from '../../../../components/shared/SearchFilter'
import { LocationTreeItem } from './LocationTreeItem'
import {
  getTotalLocationCount,
  type Location,
  type LocationTreeProps,
} from '../types'

// Maximum depth to auto-expand during search (prevents overwhelming)
const MAX_AUTO_EXPAND_DEPTH = 2

export function LocationTree({
  locations,
  expandedIds,
  selectedId,
  searchValue,
  onExpandToggle,
  onSelect,
  onSearchChange,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onMapClick,
  isMobile = false,
  riskDataMap,
}: LocationTreeProps) {
  // Track which item has swipe actions revealed (only one at a time)
  const [swipedItemId, setSwipedItemId] = useState<string | null>(null)
  // Filter tree based on search value
  const filteredLocations = useMemo(() => {
    if (!searchValue.trim()) return locations

    const search = searchValue.toLowerCase().trim()

    // Recursive filter - include parent if any child matches
    const filterTree = (nodes: Location[]): Location[] => {
      return nodes.reduce<Location[]>((acc, node) => {
        const nameMatch = node.name.toLowerCase().includes(search)
        const typeMatch = node.type.toLowerCase().includes(search)
        const codeMatch = node.code.toLowerCase().includes(search)

        const filteredChildren = node.children ? filterTree(node.children) : []

        if (nameMatch || typeMatch || codeMatch || filteredChildren.length > 0) {
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

  // Auto-expand parents of matched items when searching
  // LIMITED to MAX_AUTO_EXPAND_DEPTH to prevent cognitive overload
  const effectiveExpandedIds = useMemo(() => {
    if (!searchValue.trim()) return expandedIds

    // When searching, expand nodes up to max depth
    const idsToExpand = new Set(expandedIds)

    const collectParentIds = (nodes: Location[], depth = 0) => {
      // Stop at max depth to prevent overwhelming the user
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

  const totalCount = getTotalLocationCount(locations)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-default">
        <div className="flex items-center gap-2">
          <MapPin className="size-5 text-accent-strong" />
          <h2 className="text-base font-semibold text-primary">
            Locations Overview
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-secondary">{totalCount} locations</span>
          <Button size="sm" variant="outline" onClick={onAddClick}>
            <Plus className="size-4 mr-1.5" />
            Add Location
          </Button>
        </div>
      </div>

      {/* Search bar - using shared SearchFilter for consistency */}
      <div className="px-4 py-3 border-b border-default">
        <SearchFilter
          placeholder="Search locations, types..."
          value={searchValue}
          onChange={onSearchChange}
          size="compact"
          hideFilters
        />
      </div>

      {/* Tree content */}
      <div
        role="tree"
        aria-label="Location hierarchy"
        className="flex-1 overflow-auto p-2"
      >
        {filteredLocations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted-bg mb-3">
              <MapPin className="size-6 text-tertiary" />
            </div>
            {searchValue ? (
              <>
                <p className="text-sm font-medium text-primary mb-1">
                  No locations found
                </p>
                <p className="text-xs text-secondary">
                  Try adjusting your search terms
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-primary mb-1">
                  No locations yet
                </p>
                <p className="text-xs text-secondary">
                  Click "Add Location" to create one
                </p>
              </>
            )}
          </div>
        ) : (
          filteredLocations.map((location) => (
            <LocationTreeItem
              key={location.id}
              location={location}
              depth={0}
              isExpanded={effectiveExpandedIds.has(location.id)}
              isSelected={selectedId === location.id}
              selectedId={selectedId}
              expandedIds={effectiveExpandedIds}
              onExpandToggle={onExpandToggle}
              onSelect={onSelect}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
              onMapClick={onMapClick}
              isMobile={isMobile}
              swipedItemId={swipedItemId}
              onSwipeChange={setSwipedItemId}
              riskData={riskDataMap?.get(location.id)}
              riskDataMap={riskDataMap}
            />
          ))
        )}
      </div>
    </div>
  )
}

LocationTree.displayName = 'LocationTree'

export default LocationTree
