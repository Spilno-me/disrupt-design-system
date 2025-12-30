/**
 * DirectoryTreeItem - Location node with people counts
 *
 * Displays:
 * - Location name with expand/collapse
 * - People count badges (direct [D] + inherited [I])
 * - Click to select and show people in panel
 * - Recursive children rendering
 */

import * as React from 'react'
import { ChevronRight, MapPin, Building2, Factory, Warehouse, Users } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../../../components/ui/badge'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../../../components/ui/tooltip'
import type { LocationWithPeople, DirectoryPerson, DirectoryTreeItemProps } from '../types'

// Location type icons
const LOCATION_TYPE_ICONS: Record<string, React.ElementType> = {
  region: Building2,
  site: Factory,
  building: Building2,
  floor: Building2,
  area: Warehouse,
  default: MapPin,
}

// Indentation configuration
const INDENT_PER_LEVEL = 12 // Reduced for deep hierarchies
const MAX_INDENT_DEPTH = 3 // Cap visual depth earlier
const BASE_INDENT = 8
const HIDE_CODE_BADGE_DEPTH = 3 // Hide code badge at deep levels

export function DirectoryTreeItem({
  location,
  depth,
  isExpanded,
  isSelected,
  selectedLocationId,
  expandedIds,
  showInherited,
  onExpandToggle,
  onSelect,
  onPersonClick,
}: DirectoryTreeItemProps) {
  const hasChildren = location.children && location.children.length > 0
  const hasPeople = location.totalUserCount > 0

  // Get icon for location type
  const LocationIcon = LOCATION_TYPE_ICONS[location.type] || LOCATION_TYPE_ICONS.default

  // Calculate indentation with cap
  const indentDepth = Math.min(depth, MAX_INDENT_DEPTH)
  const paddingLeft = BASE_INDENT + indentDepth * INDENT_PER_LEVEL

  // Display count based on showInherited toggle
  const displayCount = showInherited
    ? location.totalUserCount
    : location.directUserCount

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onExpandToggle(location.id)
  }

  return (
    <div className="select-none">
      {/* Location row */}
      <div
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isSelected}
        tabIndex={0}
        className={cn(
          'group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors',
          'hover:bg-muted-bg/50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong focus-visible:ring-offset-2',
          isSelected &&
            'bg-accent-strong/10 border border-accent-strong/30 hover:bg-accent-strong/15'
        )}
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={() => onSelect(location.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect(location.id)
          }
          if (e.key === 'ArrowRight' && hasChildren && !isExpanded) {
            e.preventDefault()
            onExpandToggle(location.id)
          }
          if (e.key === 'ArrowLeft' && hasChildren && isExpanded) {
            e.preventDefault()
            onExpandToggle(location.id)
          }
        }}
      >
        {/* Expand/collapse chevron */}
        <button
          type="button"
          className={cn(
            'flex items-center justify-center size-6 rounded transition-transform',
            'hover:bg-muted-bg',
            !hasChildren && 'invisible'
          )}
          onClick={handleExpandClick}
          tabIndex={-1}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          <ChevronRight
            className={cn(
              'size-4 text-tertiary transition-transform duration-200',
              isExpanded && 'rotate-90'
            )}
          />
        </button>

        {/* Location icon */}
        <LocationIcon className="size-4 text-tertiary shrink-0" />

        {/* Location name */}
        <span className="flex-1 text-sm font-medium text-primary truncate min-w-0">
          {location.name}
        </span>

        {/* People count badges */}
        {hasPeople && (
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Direct users badge */}
            {location.directUserCount > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    size="sm"
                    className="bg-accent/10 text-accent border-accent/30 gap-1 cursor-help"
                  >
                    <Users className="size-3" />
                    <span>{location.directUserCount} direct</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={4}>
                  {location.directUserCount} people assigned directly to this location
                </TooltipContent>
              </Tooltip>
            )}

            {/* Inherited users badge (only if showing inherited) */}
            {showInherited && location.inheritedUserCount > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    size="sm"
                    className="bg-muted-bg text-secondary border-default gap-1 cursor-help"
                  >
                    <Users className="size-3" />
                    <span>{location.inheritedUserCount} inherited</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={4}>
                  {location.inheritedUserCount} people from sub-locations
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )}

        {/* Location type badge (hidden at deep levels to save space) */}
        {location.type && depth < HIDE_CODE_BADGE_DEPTH && (
          <Badge
            variant="outline"
            size="sm"
            className="bg-warning/10 text-warning-dark border-warning/30 shrink-0 capitalize"
          >
            {location.type}
          </Badge>
        )}
      </div>

      {/* Children (recursive) */}
      {hasChildren && isExpanded && (
        <div role="group" className="animate-in fade-in slide-in-from-top-1 duration-200">
          {location.children!.map((child) => (
            <DirectoryTreeItem
              key={child.id}
              location={child}
              depth={depth + 1}
              isExpanded={expandedIds.has(child.id)}
              isSelected={selectedLocationId === child.id}
              selectedLocationId={selectedLocationId}
              expandedIds={expandedIds}
              showInherited={showInherited}
              onExpandToggle={onExpandToggle}
              onSelect={onSelect}
              onPersonClick={onPersonClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}

DirectoryTreeItem.displayName = 'DirectoryTreeItem'

export default DirectoryTreeItem
