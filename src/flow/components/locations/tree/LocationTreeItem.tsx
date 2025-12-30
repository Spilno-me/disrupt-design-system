/**
 * LocationTreeItem - Individual tree node component (recursive)
 *
 * Renders a single location with:
 * - Expand/collapse chevron
 * - Location icon and name
 * - Type badge and code badge
 * - Action buttons (hover on desktop, swipe on mobile)
 * - Recursive children rendering
 *
 * Mobile UX:
 * - 44px minimum touch targets (Fitts' Law compliance)
 * - Swipe-to-reveal actions via SwipeableTreeItem wrapper
 * - Reduced indentation (16px per level, capped at depth 4)
 */

import * as React from 'react'
import { ChevronRight, MapPin, MapPinned, Pencil, Trash2 } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../../../components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'
import { SwipeableTreeItem } from './SwipeableTreeItem'
import { LOCATION_TYPE_CONFIG, type LocationTreeItemProps } from '../types'
import { LocationRiskBadge } from '../risk/LocationRiskBadge'

// Indentation configuration
const INDENT_PER_LEVEL = 12 // Reduced from 16px for deep hierarchies
const MAX_INDENT_DEPTH = 3 // Cap visual depth earlier
const BASE_INDENT = 8
const HIDE_CODE_BADGE_DEPTH = 3 // Hide code badge at this depth to save space

export function LocationTreeItem({
  location,
  depth,
  isExpanded,
  isSelected,
  expandedIds,
  onExpandToggle,
  onSelect,
  onEditClick,
  onDeleteClick,
  onMapClick,
  isMobile = false,
  swipedItemId,
  onSwipeChange,
  selectedId,
  riskData,
  riskDataMap,
}: LocationTreeItemProps) {
  const hasChildren = location.children && location.children.length > 0
  const typeConfig = LOCATION_TYPE_CONFIG[location.type]

  // Calculate indentation with cap
  const indentDepth = Math.min(depth, MAX_INDENT_DEPTH)
  const paddingLeft = BASE_INDENT + indentDepth * INDENT_PER_LEVEL

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onExpandToggle(location.id)
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEditClick(location)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDeleteClick(location)
  }

  const handleMapClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onMapClick?.(location)
  }

  // Main row content (extracted for potential wrapping)
  const rowContent = (
    <div
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      tabIndex={0}
      className={cn(
        'group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors',
        'hover:bg-muted-bg/50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong focus-visible:ring-offset-2',
        isSelected &&
          'bg-accent-strong/10 border border-accent-strong/30 hover:bg-accent-strong/15',
        // Mobile: slightly taller rows for better touch targets
        isMobile && 'py-3'
      )}
      style={{ paddingLeft: `${paddingLeft}px` }}
      onClick={() => onSelect(location)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(location)
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
          'flex items-center justify-center rounded transition-transform',
          'hover:bg-muted-bg',
          !hasChildren && 'invisible',
          // Mobile: 44px touch target (Fitts' Law)
          isMobile ? 'size-11' : 'size-6'
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
      <MapPin className="size-4 text-tertiary shrink-0" />

      {/* Location name */}
      <span className="flex-1 text-sm font-medium text-primary truncate min-w-0">
        {location.name}
      </span>

      {/* Type badge */}
      <Badge variant={typeConfig.variant} size="sm" className="shrink-0">
        {typeConfig.label}
      </Badge>

      {/* Risk badge */}
      {riskData && riskData.totalCount > 0 && (
        <LocationRiskBadge
          riskData={riskData}
          showRolledUp={true}
          size="sm"
          showTrend={false}
        />
      )}

      {/* Code badge (hidden at deep levels to save space) */}
      {depth < HIDE_CODE_BADGE_DEPTH && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              size="sm"
              className="bg-warning/10 text-warning-dark border-warning/30 max-w-24 shrink-0"
            >
              <span className="truncate">{location.code}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="font-mono text-xs">{location.code}</p>
          </TooltipContent>
        </Tooltip>
      )}

      {/* Action buttons - hidden on mobile (use swipe-to-reveal instead) */}
      {!isMobile && (
        <div
          className={cn(
            'flex items-center gap-1 transition-opacity',
            'opacity-0 group-hover:opacity-100',
            isSelected && 'opacity-100'
          )}
        >
          {onMapClick && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="flex size-8 items-center justify-center rounded hover:bg-muted-bg text-tertiary hover:text-primary transition-colors"
                  onClick={handleMapClick}
                  aria-label="View on map"
                >
                  <MapPinned className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">View on map</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded hover:bg-muted-bg text-tertiary hover:text-primary transition-colors"
                onClick={handleEditClick}
                aria-label="Edit location"
              >
                <Pencil className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Edit location</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded hover:bg-error/10 text-tertiary hover:text-error transition-colors"
                onClick={handleDeleteClick}
                aria-label="Delete location"
              >
                <Trash2 className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Delete location</TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  )

  // Render with or without swipe wrapper based on mobile
  const wrappedRow = isMobile && onSwipeChange ? (
    <SwipeableTreeItem
      location={location}
      onEdit={onEditClick}
      onDelete={onDeleteClick}
      swipedItemId={swipedItemId ?? null}
      onSwipeChange={onSwipeChange}
    >
      {rowContent}
    </SwipeableTreeItem>
  ) : (
    rowContent
  )

  return (
    <div className="select-none">
      {wrappedRow}

      {/* Children (recursive) */}
      {hasChildren && isExpanded && (
        <div role="group" className="animate-in fade-in slide-in-from-top-1 duration-200">
          {location.children!.map((child) => (
            <LocationTreeItem
              key={child.id}
              location={child}
              depth={depth + 1}
              isExpanded={expandedIds.has(child.id)}
              isSelected={selectedId === child.id}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onExpandToggle={onExpandToggle}
              onSelect={onSelect}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
              onMapClick={onMapClick}
              isMobile={isMobile}
              swipedItemId={swipedItemId}
              onSwipeChange={onSwipeChange}
              riskData={riskDataMap?.get(child.id)}
              riskDataMap={riskDataMap}
            />
          ))}
        </div>
      )}
    </div>
  )
}

LocationTreeItem.displayName = 'LocationTreeItem'

export default LocationTreeItem
