import { Fragment } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../../lib/utils'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '../../ui/dropdown-menu'
import { FilterIcon } from './icons'
import { FilterBadge } from './FilterBadge'
import type { FilterGroup } from './types'

export interface FilterDropdownProps {
  /** Filter groups to display */
  filterGroups: FilterGroup[]
  /** Check if option is selected */
  isSelected: (groupKey: string, optionId: string) => boolean
  /** Toggle filter option */
  onToggle: (groupKey: string, optionId: string) => void
  /** Clear all filters */
  onClearAll: () => void
  /** Number of active filters */
  activeCount: number
  /** Whether dropdown is open */
  open: boolean
  /** Handle open state change */
  onOpenChange: (open: boolean) => void
  /** Whether the dropdown is disabled */
  disabled?: boolean
  /** Whether filters are loading */
  isLoading?: boolean
}

/**
 * Desktop filter dropdown with checkbox items.
 * Pure Tailwind classes - zero inline styles.
 */
export function FilterDropdown({
  filterGroups,
  isSelected,
  onToggle,
  onClearAll,
  activeCount,
  open,
  onOpenChange,
  disabled = false,
  isLoading = false,
}: FilterDropdownProps) {
  const hasFilters = filterGroups.length > 0

  return (
    <DropdownMenu open={open} onOpenChange={disabled ? undefined : onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'relative hidden md:flex items-center justify-center',
            'w-9 h-9 flex-shrink-0',
            'bg-overlay-white-50 border border-overlay-subtle rounded-sm',
            'transition-all hover:opacity-80',
            'outline-none focus:outline-none',
            'focus-visible:ring-[0.5px] focus-visible:ring-accent',
            'data-[state=open]:ring-[0.5px] data-[state=open]:ring-accent',
            disabled && 'opacity-50 cursor-not-allowed hover:opacity-50'
          )}
          aria-label={`Filter options${activeCount > 0 ? ` (${activeCount} active)` : ''}`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-accent animate-spin" aria-hidden="true" />
          ) : (
            <FilterIcon className="text-accent" />
          )}
          <FilterBadge count={activeCount} size="sm" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 text-accent animate-spin" />
            <span className="ml-2 text-sm text-secondary">Loading filters...</span>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !hasFilters && (
          <div className="py-4 text-center text-sm text-secondary">
            No filters available
          </div>
        )}

        {/* Filter content */}
        {!isLoading && hasFilters && (
          <>
            {/* Header with Clear all button */}
            {activeCount > 0 && (
              <>
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className="text-xs font-medium text-secondary">
                    {activeCount} filter{activeCount !== 1 ? 's' : ''} active
                  </span>
                  <button
                    type="button"
                    onClick={onClearAll}
                    className="text-xs font-medium text-accent hover:text-accent/80 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                <DropdownMenuSeparator />
              </>
            )}

            {/* Filter groups */}
            {filterGroups.map((group, index) => (
              <Fragment key={group.key}>
                {index > 0 && <DropdownMenuSeparator />}
                <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
                <DropdownMenuGroup>
                  {group.options.map((option) => (
                    <DropdownMenuCheckboxItem
                      key={option.id}
                      checked={isSelected(group.key, option.id)}
                      onCheckedChange={() => onToggle(group.key, option.id)}
                    >
                      {option.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </Fragment>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
