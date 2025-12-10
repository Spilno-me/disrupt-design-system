import { ChevronDown, X } from 'lucide-react'
import * as Collapsible from '@radix-ui/react-collapsible'
import { cn } from '../../../lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../../ui/sheet'
import { Button } from '../../ui/button'
import { Checkbox } from '../../ui/checkbox'
import type { FilterGroup, FilterOption } from './types'

// =============================================================================
// COLLAPSIBLE FILTER GROUP
// =============================================================================

interface CollapsibleFilterGroupProps {
  label: string
  options: FilterOption[]
  selectedIds: string[]
  onToggle: (id: string) => void
  defaultOpen?: boolean
}

/**
 * Collapsible filter group using Radix Collapsible.
 * Proper height animation without max-height hacks.
 */
function CollapsibleFilterGroup({
  label,
  options,
  selectedIds,
  onToggle,
  defaultOpen = false,
}: CollapsibleFilterGroupProps) {
  const selectedCount = selectedIds.length

  return (
    <Collapsible.Root
      defaultOpen={defaultOpen}
      className="border-b border-subtle last:border-b-0"
    >
      <Collapsible.Trigger asChild>
        <button
          type="button"
          className={cn(
            'w-full flex items-center justify-between py-4 px-5 text-left',
            'hover:bg-muted-bg transition-colors',
            'group'
          )}
        >
          <span className="text-base font-semibold text-primary">
            {label}
            {selectedCount > 0 && (
              <span className="ml-2 text-sm font-medium text-accent">
                ({selectedCount})
              </span>
            )}
          </span>
          <ChevronDown
            className={cn(
              'w-5 h-5 text-secondary transition-transform duration-200',
              'group-data-[state=open]:rotate-180'
            )}
            aria-hidden="true"
          />
        </button>
      </Collapsible.Trigger>

      <Collapsible.Content
        className={cn(
          'overflow-hidden',
          'data-[state=open]:animate-collapsible-down',
          'data-[state=closed]:animate-collapsible-up'
        )}
      >
        <div className="pb-3 px-5 space-y-1" role="group" aria-label={label}>
          {options.map((option) => {
            const isChecked = selectedIds.includes(option.id)
            const optionId = `filter-${label}-${option.id}`

            return (
              <label
                key={option.id}
                htmlFor={optionId}
                className={cn(
                  'w-full flex items-center gap-3 py-3 px-4 rounded-md cursor-pointer',
                  'transition-colors',
                  isChecked ? 'bg-accentBg' : 'hover:bg-muted-bg'
                )}
              >
                <Checkbox
                  id={optionId}
                  checked={isChecked}
                  onCheckedChange={() => onToggle(option.id)}
                />
                <span
                  className={cn(
                    'text-base text-primary',
                    isChecked && 'font-medium'
                  )}
                >
                  {option.label}
                </span>
              </label>
            )
          })}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

// =============================================================================
// MOBILE FILTER SHEET
// =============================================================================

export interface MobileFilterSheetProps {
  /** Whether sheet is open */
  open: boolean
  /** Handle open state change */
  onOpenChange: (open: boolean) => void
  /** Filter groups to display */
  filterGroups: FilterGroup[]
  /** Get selected options for a group */
  getSelectedForGroup: (groupKey: string) => string[]
  /** Toggle filter option */
  onToggle: (groupKey: string, optionId: string) => void
  /** Clear all filters */
  onClearAll: () => void
  /** Number of active filters */
  activeCount: number
}

/**
 * Mobile bottom sheet for filter selection.
 * Uses Radix Collapsible for proper height animations.
 * Pure Tailwind classes - no inline styles.
 */
export function MobileFilterSheet({
  open,
  onOpenChange,
  filterGroups,
  getSelectedForGroup,
  onToggle,
  onClearAll,
  activeCount,
}: MobileFilterSheetProps) {
  const handleApply = () => {
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        hideCloseButton
        className="rounded-t-2xl px-0 pb-8 max-h-[85vh]"
      >
        {/* Handle bar for drag affordance */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-secondary" aria-hidden="true" />
        </div>

        {/* Header */}
        <SheetHeader className="px-5 py-3 border-b border-subtle">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold text-primary">
              Filters
              {activeCount > 0 && (
                <span className="ml-2 text-sm font-medium text-accent">
                  ({activeCount} active)
                </span>
              )}
            </SheetTitle>
            <div className="flex items-center gap-2">
              {activeCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAll}
                  className="text-secondary hover:text-primary"
                >
                  Clear all
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 -mr-2"
                aria-label="Close filters"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        {/* Filter groups with Radix Collapsible */}
        <div className="flex-1 overflow-y-auto">
          {filterGroups.map((group, index) => (
            <CollapsibleFilterGroup
              key={group.key}
              label={group.label}
              options={group.options}
              selectedIds={getSelectedForGroup(group.key)}
              onToggle={(optionId) => onToggle(group.key, optionId)}
              defaultOpen={index === 0}
            />
          ))}
        </div>

        {/* Apply button */}
        <div className="px-5 pt-4 border-t border-subtle">
          <Button
            variant="accent"
            fullWidth
            onClick={handleApply}
            className="h-12 text-base"
          >
            Apply Filters
            {activeCount > 0 && ` (${activeCount})`}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
