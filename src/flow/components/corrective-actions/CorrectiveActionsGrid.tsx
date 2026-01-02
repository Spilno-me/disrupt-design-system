/**
 * CorrectiveActionsGrid
 *
 * Grid layout for corrective action cards with filtering controls.
 * Follows DDS depth layering rules with proper token usage.
 *
 * Features:
 * - Status, priority, and assignee filtering via SearchFilter component
 * - Search functionality with debounce
 * - Responsive grid columns
 * - Proper loading and empty states
 */

import { useState, useMemo, useCallback } from 'react'
import { X, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchFilter } from '@/components/shared/SearchFilter'
import type { FilterGroup, FilterState } from '@/components/shared/SearchFilter'
import { CorrectiveActionCard } from './CorrectiveActionCard'
import {
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  VALID_STATUSES,
  VALID_PRIORITIES,
  isOverdue,
} from './helpers'
import type {
  CorrectiveAction,
  CorrectiveActionFilterState,
  CorrectiveActionPermissions,
} from './types'
import { cn } from '@/lib/utils'

export interface CorrectiveActionsGridProps {
  /** List of corrective actions to display */
  actions: CorrectiveAction[]
  /** User permissions */
  permissions?: CorrectiveActionPermissions
  /** Card click handler */
  onActionClick?: (action: CorrectiveAction) => void
  /** Edit action handler */
  onEdit?: (action: CorrectiveAction) => void
  /** Delete action handler */
  onDelete?: (action: CorrectiveAction) => void
  /** Request extension handler */
  onRequestExtension?: (action: CorrectiveAction) => void
  /** Initial filter state */
  initialFilters?: Partial<CorrectiveActionFilterState>
  /** Show filter controls */
  showFilters?: boolean
  /** Grid columns configuration */
  columns?: 1 | 2 | 3 | 4
  /** Loading state */
  isLoading?: boolean
  /** Empty state message */
  emptyMessage?: string
  /** Additional CSS classes */
  className?: string
}

const columnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

export function CorrectiveActionsGrid({
  actions,
  permissions,
  onActionClick,
  onEdit,
  onDelete,
  onRequestExtension,
  initialFilters,
  showFilters = true,
  columns = 3,
  isLoading = false,
  emptyMessage = 'No corrective actions found',
  className,
}: CorrectiveActionsGridProps) {
  // Search state
  const [searchValue, setSearchValue] = useState(initialFilters?.search || '')

  // Filter state for SearchFilter component (Record<string, string[]>)
  const [filterState, setFilterState] = useState<FilterState>(() => {
    const initial: FilterState = {}
    if (initialFilters?.status && initialFilters.status !== 'all') {
      initial.status = [initialFilters.status]
    }
    if (initialFilters?.priority && initialFilters.priority !== 'all') {
      initial.priority = [initialFilters.priority]
    }
    if (initialFilters?.assignee && initialFilters.assignee !== 'all') {
      initial.assignee = [initialFilters.assignee]
    }
    return initial
  })

  // Overdue toggle (separate from SearchFilter)
  const [showOverdue, setShowOverdue] = useState(initialFilters?.overdue || false)

  // Build filter groups from actions data
  const filterGroups = useMemo<FilterGroup[]>(() => {
    // Status filter options
    const statusOptions = VALID_STATUSES.map((status) => ({
      id: status,
      label: STATUS_CONFIG[status].label,
    }))

    // Priority filter options
    const priorityOptions = VALID_PRIORITIES.map((priority) => ({
      id: priority,
      label: PRIORITY_CONFIG[priority].label,
    }))

    // Assignee filter options (from actions data)
    const uniqueAssignees = new Map<string, string>()
    actions.forEach((action) => {
      if (action.actionOwner) {
        const name = action.actionOwner.firstName && action.actionOwner.lastName
          ? `${action.actionOwner.firstName} ${action.actionOwner.lastName}`
          : action.actionOwner.email || action.actionOwner.id
        uniqueAssignees.set(action.actionOwner.id, name)
      }
    })
    const assigneeOptions = Array.from(uniqueAssignees.entries()).map(([id, name]) => ({
      id,
      label: name,
    }))

    const groups: FilterGroup[] = [
      { key: 'status', label: 'Status', options: statusOptions },
      { key: 'priority', label: 'Priority', options: priorityOptions },
    ]

    // Only add assignee filter if there are assignees
    if (assigneeOptions.length > 0) {
      groups.push({ key: 'assignee', label: 'Assignee', options: assigneeOptions })
    }

    return groups
  }, [actions])

  // Filter actions based on search and filters
  const filteredActions = useMemo(() => {
    return actions.filter((action) => {
      // Search filter
      if (searchValue) {
        const searchLower = searchValue.toLowerCase()
        const matchesSearch =
          action.title.toLowerCase().includes(searchLower) ||
          action.description.toLowerCase().includes(searchLower) ||
          action.referenceNumber.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Status filter (from filterState)
      const selectedStatuses = filterState.status || []
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(action.status)) {
        return false
      }

      // Priority filter (from filterState)
      const selectedPriorities = filterState.priority || []
      if (selectedPriorities.length > 0 && !selectedPriorities.includes(action.priority)) {
        return false
      }

      // Assignee filter (from filterState)
      const selectedAssignees = filterState.assignee || []
      if (selectedAssignees.length > 0 && !selectedAssignees.includes(action.actionOwner?.id || '')) {
        return false
      }

      // Overdue filter
      if (showOverdue && !isOverdue(action)) {
        return false
      }

      return true
    })
  }, [actions, searchValue, filterState, showOverdue])

  // Active filter count for badge
  const activeFilterCount = useMemo(() => {
    let count = 0
    if ((filterState.status?.length || 0) > 0) count++
    if ((filterState.priority?.length || 0) > 0) count++
    if ((filterState.assignee?.length || 0) > 0) count++
    if (showOverdue) count++
    return count
  }, [filterState, showOverdue])

  const clearFilters = useCallback(() => {
    setFilterState({})
    setShowOverdue(false)
  }, [])

  if (isLoading) {
    return (
      <div className={cn('grid gap-4', columnClasses[columns], className)}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-xl bg-surface border border-default"
          />
        ))}
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Filter Controls - Using SearchFilter component */}
      {showFilters && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* SearchFilter with surface styling (no glass - grid is inside page's glass panel) */}
          <SearchFilter
            placeholder="Search actions..."
            value={searchValue}
            onChange={setSearchValue}
            filterGroups={filterGroups}
            filters={filterState}
            onFiltersChange={setFilterState}
            size="compact"
            className="flex-1 !bg-surface !backdrop-blur-none !border-default !shadow-sm"
          />

          {/* Overdue toggle (separate from SearchFilter) */}
          <div className="flex items-center gap-2">
            <Button
              variant={showOverdue ? 'destructive' : 'outline'}
              size="sm"
              onClick={() => setShowOverdue(!showOverdue)}
            >
              Overdue
            </Button>

            {/* Clear filters */}
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-1 text-secondary hover:text-primary"
              >
                <X className="h-4 w-4" />
                Clear ({activeFilterCount})
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-secondary">
        {filteredActions.length} of {actions.length} actions
        {searchValue && ` matching "${searchValue}"`}
      </div>

      {/* Grid */}
      {filteredActions.length > 0 ? (
        <div className={cn('grid gap-4', columnClasses[columns])}>
          {filteredActions.map((action) => (
            <CorrectiveActionCard
              key={action.id}
              action={action}
              permissions={permissions}
              onClick={onActionClick}
              onEdit={onEdit}
              onDelete={onDelete}
              onRequestExtension={onRequestExtension}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-lg border border-dashed border-default bg-surface/50">
          <div className="p-4 rounded-full bg-muted-bg mb-4">
            <ClipboardList className="h-8 w-8 text-tertiary" />
          </div>
          <p className="text-lg font-medium text-primary mb-1">{emptyMessage}</p>
          <p className="text-sm text-secondary">
            {activeFilterCount > 0
              ? 'Try adjusting your filters'
              : 'Create a new corrective action to get started'}
          </p>
          {activeFilterCount > 0 && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mt-4"
            >
              <X className="h-4 w-4 mr-2" />
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default CorrectiveActionsGrid
