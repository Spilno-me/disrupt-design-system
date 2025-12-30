/**
 * MultiFloorSelector - Switch between floor plans for multi-story locations
 *
 * Displays a tab-like interface to select floor plans:
 * - Vertical list for sidebar placement
 * - Horizontal tabs for inline placement
 * - Shows floor name and incident count badge
 */

import * as React from 'react'
import { Building2, Layers } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../../../components/ui/badge'
import type { MultiFloorSelectorProps } from './types'

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function MultiFloorSelector({
  floorPlans,
  selectedId,
  onSelect,
  className,
}: MultiFloorSelectorProps) {
  // If only one floor plan, don't show selector
  if (!floorPlans || floorPlans.length <= 1) return null

  return (
    <div className={cn('space-y-1.5', className)}>
      {/* Header */}
      <div className="flex items-center gap-2 px-2 py-1">
        <Layers className="size-3.5 text-tertiary" />
        <span className="text-xs font-medium text-secondary uppercase tracking-wider">
          Floors
        </span>
      </div>

      {/* Floor buttons */}
      <div className="flex flex-col gap-1">
        {floorPlans.map((floor, index) => {
          const isSelected = selectedId
            ? floor.imageUrl === selectedId || floor.name === selectedId
            : index === 0

          return (
            <button
              key={floor.imageUrl || floor.name || index}
              type="button"
              onClick={() => onSelect(floor.imageUrl || floor.name || String(index))}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                'hover:bg-muted-bg',
                isSelected && 'bg-accent-strong/10 border border-accent-strong/30'
              )}
            >
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-md',
                  isSelected ? 'bg-accent-strong/20 text-accent-strong' : 'bg-muted-bg text-tertiary'
                )}
              >
                <Building2 className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    'text-sm font-medium truncate',
                    isSelected ? 'text-accent-strong' : 'text-primary'
                  )}
                >
                  {floor.name || `Floor ${index + 1}`}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

MultiFloorSelector.displayName = 'MultiFloorSelector'

export default MultiFloorSelector
