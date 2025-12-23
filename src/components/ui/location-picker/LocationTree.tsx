/**
 * LocationTree - Hierarchical tree view for location selection
 *
 * Renders a collapsible tree of locations with search highlighting.
 */

import * as React from 'react'
import { ChevronRight, MapPin, Building2, Warehouse, Factory, Car, Trees } from 'lucide-react'
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
  default: MapPin,
}

function getIcon(iconName?: string) {
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
        const Icon = getIcon(node.icon)

        return (
          <li key={node.id} role="treeitem" aria-expanded={hasChildren ? String(isExpanded) as 'true' | 'false' : undefined}>
            <div
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors',
                'min-h-[48px]', // 48px touch target for mobile
                'hover:bg-muted-bg active:bg-muted-bg',
                isSelected && 'bg-accent/10 text-accent-strong',
                !isSelectable && hasChildren && 'cursor-default'
              )}
              style={{ paddingLeft: `${depth * 20 + 12}px` }}
              onClick={() => {
                if (hasChildren) {
                  onToggle(node.id)
                }
                if (isSelectable) {
                  onSelect(node, currentPath)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  if (hasChildren) {
                    onToggle(node.id)
                  }
                  if (isSelectable) {
                    onSelect(node, currentPath)
                  }
                }
              }}
              tabIndex={0}
              role="option"
              aria-selected={isSelected}
            >
              {/* Expand/collapse chevron */}
              {hasChildren ? (
                <ChevronRight
                  className={cn(
                    'h-5 w-5 text-tertiary shrink-0 transition-transform',
                    isExpanded && 'rotate-90'
                  )}
                />
              ) : (
                <span className="w-5 shrink-0" />
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

              {/* Selection indicator */}
              {isSelected && (
                <span className="ml-auto text-accent">✓</span>
              )}
            </div>

            {/* Children */}
            {hasChildren && isExpanded && (
              <LocationTree
                nodes={node.children!}
                searchQuery={searchQuery}
                selectedId={selectedId}
                onSelect={onSelect}
                expandedIds={expandedIds}
                onToggle={onToggle}
                parentPath={currentPath}
                depth={depth + 1}
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
