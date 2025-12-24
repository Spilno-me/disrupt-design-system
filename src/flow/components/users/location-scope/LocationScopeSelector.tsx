/**
 * LocationScopeSelector - Multi-select tree for location scoping
 *
 * Adapts the LocationTree pattern for scope selection with cascade options.
 */

import * as React from 'react'
import { ChevronRight, MapPin, X, Check } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../../../components/ui/badge'
import { Checkbox } from '../../../../components/ui/checkbox'
import { Label } from '../../../../components/ui/label'
import type { LocationNode, LocationScope } from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface LocationScopeSelectorProps {
  locations: LocationNode[]
  selectedScopes: LocationScope[]
  onChange: (scopes: LocationScope[]) => void
  className?: string
}

interface TreeNodeProps {
  node: LocationNode
  selectedScopes: LocationScope[]
  onToggle: (node: LocationNode, path: string[]) => void
  onToggleChildren: (scopeId: string, include: boolean) => void
  expandedIds: Set<string>
  onExpandToggle: (id: string) => void
  path: string[]
  depth: number
}

// =============================================================================
// TREE NODE COMPONENT
// =============================================================================

function TreeNode({
  node,
  selectedScopes,
  onToggle,
  onToggleChildren,
  expandedIds,
  onExpandToggle,
  path,
  depth,
}: TreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expandedIds.has(node.id)
  const currentPath = [...path, node.label]

  // Find if this node is selected
  const selectedScope = selectedScopes.find((s) => s.locationId === node.id)
  const isSelected = !!selectedScope

  return (
    <li>
      <div
        className={cn(
          'flex items-center gap-2 rounded-md px-2 py-2 transition-colors',
          'hover:bg-muted-bg',
          isSelected && 'bg-accent/10'
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {/* Expand/Collapse */}
        {hasChildren ? (
          <button
            type="button"
            onClick={() => onExpandToggle(node.id)}
            className="flex size-6 items-center justify-center rounded hover:bg-muted-bg"
          >
            <ChevronRight
              className={cn(
                'size-4 text-tertiary transition-transform',
                isExpanded && 'rotate-90'
              )}
            />
          </button>
        ) : (
          <span className="w-6" />
        )}

        {/* Checkbox */}
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggle(node, currentPath)}
          id={`loc-${node.id}`}
        />

        {/* Icon */}
        <MapPin className="size-4 text-tertiary" />

        {/* Label */}
        <label
          htmlFor={`loc-${node.id}`}
          className={cn(
            'flex-1 cursor-pointer text-sm',
            isSelected ? 'font-medium text-primary' : 'text-secondary'
          )}
        >
          {node.label}
          {node.level !== undefined && node.level > 0 && (
            <span className="ml-2 text-xs text-secondary">(Level {node.level})</span>
          )}
        </label>

        {/* Include children checkbox (if selected and has children) */}
        {isSelected && hasChildren && (
          <div className="flex items-center gap-1.5">
            <Checkbox
              checked={selectedScope?.includeChildren || false}
              onCheckedChange={(checked) =>
                onToggleChildren(selectedScope!.id, checked as boolean)
              }
              id={`children-${node.id}`}
              className="size-3.5"
            />
            <label
              htmlFor={`children-${node.id}`}
              className="text-xs text-tertiary cursor-pointer"
            >
              Include children
            </label>
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <ul>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              selectedScopes={selectedScopes}
              onToggle={onToggle}
              onToggleChildren={onToggleChildren}
              expandedIds={expandedIds}
              onExpandToggle={onExpandToggle}
              path={currentPath}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function LocationScopeSelector({
  locations,
  selectedScopes,
  onChange,
  className,
}: LocationScopeSelectorProps) {
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set())

  // Toggle location selection
  const handleToggle = React.useCallback(
    (node: LocationNode, path: string[]) => {
      const existingIndex = selectedScopes.findIndex((s) => s.locationId === node.id)

      if (existingIndex >= 0) {
        // Remove
        onChange(selectedScopes.filter((_, i) => i !== existingIndex))
      } else {
        // Add
        const newScope: LocationScope = {
          id: `scope-${node.id}-${Date.now()}`,
          locationId: node.id,
          locationName: node.label,
          locationPath: path,
          includeChildren: false,
        }
        onChange([...selectedScopes, newScope])
      }
    },
    [selectedScopes, onChange]
  )

  // Toggle include children
  const handleToggleChildren = React.useCallback(
    (scopeId: string, include: boolean) => {
      onChange(
        selectedScopes.map((s) =>
          s.id === scopeId ? { ...s, includeChildren: include } : s
        )
      )
    },
    [selectedScopes, onChange]
  )

  // Toggle expand
  const handleExpandToggle = React.useCallback((id: string) => {
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

  // Remove scope
  const handleRemoveScope = React.useCallback(
    (scopeId: string) => {
      onChange(selectedScopes.filter((s) => s.id !== scopeId))
    },
    [selectedScopes, onChange]
  )

  return (
    <div data-slot="location-scope-selector" className={cn('space-y-3', className)}>
      {/* Selected scopes as badges */}
      {selectedScopes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedScopes.map((scope) => (
            <Badge
              key={scope.id}
              variant="secondary"
              className="gap-1.5 pr-1"
            >
              <MapPin className="size-3" />
              {scope.locationName}
              {scope.includeChildren && (
                <span className="text-xs text-secondary">+ children</span>
              )}
              <button
                type="button"
                onClick={() => handleRemoveScope(scope.id)}
                className="ml-1 rounded-full p-0.5 hover:bg-surface"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Tree */}
      <div className="max-h-64 overflow-y-auto rounded-lg border border-default bg-surface">
        {locations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MapPin className="size-8 text-tertiary" />
            <p className="mt-2 text-sm text-secondary">No locations available</p>
          </div>
        ) : (
          <ul className="p-2">
            {locations.map((location) => (
              <TreeNode
                key={location.id}
                node={location}
                selectedScopes={selectedScopes}
                onToggle={handleToggle}
                onToggleChildren={handleToggleChildren}
                expandedIds={expandedIds}
                onExpandToggle={handleExpandToggle}
                path={[]}
                depth={0}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Help text */}
      {selectedScopes.length === 0 && (
        <p className="text-xs text-tertiary">
          Select locations to limit where this role applies
        </p>
      )}
    </div>
  )
}

LocationScopeSelector.displayName = 'LocationScopeSelector'

export default LocationScopeSelector
