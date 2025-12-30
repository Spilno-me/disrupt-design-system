/**
 * LocationTree - Hierarchical tree view for location selection
 *
 * Renders a collapsible tree of locations with search highlighting.
 * Supports two modes:
 * - Tree mode (default): Expandable hierarchy with indentation
 * - Drill-down mode: Flat list where folders navigate to children
 */

import * as React from 'react'
import {
  ChevronRight,
  MapPin,
  Building2,
  Warehouse,
  Factory,
  Car,
  Trees,
  FolderOpen,
  Image as ImageIcon,
} from 'lucide-react'
import { cn } from '../../../lib/utils'
import type { LocationNode, LocationTreeProps } from './types'

// =============================================================================
// ICON MAPPING
// =============================================================================

const iconMap: Record<string, React.ElementType> = {
  warehouse: Warehouse,
  building: Building2,
  factory: Factory,
  parking: Car,
  outdoor: Trees,
  folder: FolderOpen,
  default: MapPin,
}

function getIcon(iconName?: string, hasChildren?: boolean) {
  if (hasChildren && !iconName) return FolderOpen
  if (!iconName) return MapPin
  return iconMap[iconName.toLowerCase()] || MapPin
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Check if a node or its children match the search query
 */
function nodeMatchesSearch(node: LocationNode, query: string): boolean {
  const queryLower = query.toLowerCase()

  // Check if this node matches
  if (node.label.toLowerCase().includes(queryLower)) {
    return true
  }

  // Check if any children match
  if (node.children) {
    return node.children.some((child) => nodeMatchesSearch(child, query))
  }

  return false
}

/**
 * Highlight matching text in a string
 */
function highlightMatch(text: string, query: string) {
  if (!query) return text

  const queryLower = query.toLowerCase()
  const textLower = text.toLowerCase()
  const index = textLower.indexOf(queryLower)

  if (index === -1) return text

  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-warning/30 text-primary rounded px-0.5">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  )
}

// =============================================================================
// COMPONENT
// =============================================================================

export function LocationTree({
  nodes,
  searchQuery,
  selectedId,
  onSelect,
  expandedIds,
  onToggle,
  parentPath = [],
  depth = 0,
  showDrillDown = false,
}: LocationTreeProps) {
  // Filter nodes based on search
  const filteredNodes = searchQuery
    ? nodes.filter((node) => nodeMatchesSearch(node, searchQuery))
    : nodes

  if (filteredNodes.length === 0) {
    return null
  }

  return (
    <ul className="space-y-0.5" role="tree" aria-label="Location tree">
      {filteredNodes.map((node) => {
        const hasChildren = node.children && node.children.length > 0
        const isExpanded = expandedIds.has(node.id) || (searchQuery && nodeMatchesSearch(node, searchQuery))
        const isSelected = selectedId === node.id
        const isSelectable = node.selectable !== false && (!hasChildren || node.selectable === true)
        const currentPath = [...parentPath, node.label]
        const Icon = getIcon(node.icon, hasChildren && !isSelectable)
        const hasFloorPlan = !!node.floorPlanImage

        // In drill-down mode, render flat list (no indentation)
        const effectiveDepth = showDrillDown ? 0 : depth

        return (
          <li key={node.id} role="treeitem" aria-expanded={hasChildren ? String(isExpanded) as 'true' | 'false' : undefined}>
            <div
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors',
                'min-h-[48px]', // 48px touch target for mobile
                'hover:bg-muted-bg active:bg-muted-bg',
                isSelected && 'bg-accent/10 text-accent-strong',
                !isSelectable && hasChildren && !showDrillDown && 'cursor-default'
              )}
              style={{ paddingLeft: `${effectiveDepth * 20 + 12}px` }}
              onClick={() => {
                if (showDrillDown) {
                  // In drill-down mode, clicking always calls onSelect
                  // Parent component decides whether to drill or preview
                  onSelect(node, currentPath)
                } else {
                  // In tree mode, toggle folders, select leaves
                  if (hasChildren) {
                    onToggle(node.id)
                  }
                  if (isSelectable) {
                    onSelect(node, currentPath)
                  }
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  if (showDrillDown) {
                    onSelect(node, currentPath)
                  } else {
                    if (hasChildren) {
                      onToggle(node.id)
                    }
                    if (isSelectable) {
                      onSelect(node, currentPath)
                    }
                  }
                }
              }}
              tabIndex={0}
              role="option"
              aria-selected={isSelected}
            >
              {/* Expand/collapse chevron - only in tree mode */}
              {!showDrillDown && (
                hasChildren ? (
                  <ChevronRight
                    className={cn(
                      'h-5 w-5 text-tertiary shrink-0 transition-transform',
                      isExpanded && 'rotate-90'
                    )}
                  />
                ) : (
                  <span className="w-5 shrink-0" />
                )
              )}

              {/* Icon */}
              <Icon
                className={cn(
                  'h-5 w-5 shrink-0',
                  isSelected ? 'text-accent' : 'text-tertiary'
                )}
              />

              {/* Label */}
              <span
                className={cn(
                  'text-base truncate flex-1',
                  isSelected ? 'font-medium' : 'font-normal'
                )}
              >
                {highlightMatch(node.label, searchQuery)}
              </span>

              {/* Floor plan indicator */}
              {hasFloorPlan && !showDrillDown && (
                <ImageIcon className="h-4 w-4 text-accent shrink-0" />
              )}

              {/* Children count badge - in drill-down mode */}
              {showDrillDown && hasChildren && (
                <span className="text-xs text-tertiary bg-muted-bg px-2 py-0.5 rounded-full shrink-0">
                  {node.children!.length}
                </span>
              )}

              {/* Drill-down arrow - in drill-down mode for folders */}
              {showDrillDown && hasChildren && !isSelectable && (
                <ChevronRight className="h-5 w-5 text-tertiary shrink-0" />
              )}

              {/* Floor plan indicator - in drill-down mode */}
              {showDrillDown && hasFloorPlan && isSelectable && (
                <ImageIcon className="h-4 w-4 text-accent shrink-0" />
              )}

              {/* Selection indicator */}
              {isSelected && (
                <span className="text-accent shrink-0">✓</span>
              )}
            </div>

            {/* Children - only in tree mode (not drill-down) */}
            {!showDrillDown && hasChildren && isExpanded && (
              <LocationTree
                nodes={node.children!}
                searchQuery={searchQuery}
                selectedId={selectedId}
                onSelect={onSelect}
                expandedIds={expandedIds}
                onToggle={onToggle}
                parentPath={currentPath}
                depth={depth + 1}
                showDrillDown={false}
              />
            )}
          </li>
        )
      })}
    </ul>
  )
}

LocationTree.displayName = 'LocationTree'

export default LocationTree
