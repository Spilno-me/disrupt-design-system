/**
 * StepsPage - Page for viewing and managing steps/tasks from incidents
 *
 * Displays steps that require user attention from different incidents.
 * Features tabs (My Steps / Team Steps), search, severity/status filters,
 * and pagination. Fully responsive for mobile and desktop.
 *
 * @example
 * ```tsx
 * <StepsPage
 *   mySteps={mySteps}
 *   teamSteps={teamSteps}
 *   onNextStep={(step) => navigate(`/incidents/${step.incidentDbId}`)}
 * />
 * ```
 */

import * as React from 'react'
import { useState, useMemo, useCallback } from 'react'
import { Waypoints, Download, Plus, X, ClipboardCheck } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { SearchFilter } from '../../shared/SearchFilter'
import { Pagination } from '../../ui/Pagination'
import { PageActionPanel } from '../../ui/PageActionPanel'
import { StepItem } from './StepItem'
import type {
  StepsPageProps,
  StepsTabId,
  IncidentSeverity,
  StepStatus,
} from './types'
import type { FilterGroup, FilterState } from '../../shared/SearchFilter/types'

// =============================================================================
// CONSTANTS
// =============================================================================

const SEVERITY_OPTIONS = [
  { id: 'critical', label: 'Critical' },
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
  { id: 'none', label: 'None' },
]

const STATUS_OPTIONS = [
  { id: 'pending', label: 'Pending' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'completed', label: 'Completed' },
]

const DEFAULT_PAGE_SIZE = 10
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

/**
 * Empty state display with optional action
 */
function EmptyState({
  message,
  description,
  actionLabel,
  onAction,
  isFiltered,
  onClearFilters,
}: {
  message: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  isFiltered?: boolean
  onClearFilters?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="size-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
        <ClipboardCheck className="size-8 text-success" />
      </div>
      <p className="text-primary font-medium mb-1">{message}</p>
      {description && (
        <p className="text-secondary text-sm mb-4 max-w-sm">{description}</p>
      )}
      <div className="flex flex-col sm:flex-row gap-2">
        {isFiltered && onClearFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            <X className="size-4" />
            Clear filters
          </Button>
        )}
        {actionLabel && onAction && (
          <Button variant="default" size="sm" onClick={onAction}>
            <Plus className="size-4" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

/**
 * Skeleton loading state
 */
function SkeletonItem() {
  return (
    <div className="p-4 border-l-4 border-muted-bg animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-muted-bg rounded w-1/3 mb-2" />
          <div className="flex gap-4">
            <div className="h-3 bg-muted-bg rounded w-20" />
            <div className="h-3 bg-muted-bg rounded w-16" />
            <div className="h-3 bg-muted-bg rounded w-24 hidden sm:block" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 bg-muted-bg rounded w-16" />
          <div className="h-8 bg-muted-bg rounded w-20" />
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * StepsPage - Main page component for viewing steps/tasks
 */
export function StepsPage({
  mySteps,
  teamSteps,
  activeTab: controlledActiveTab,
  onTabChange,
  onNextStep,
  onIncidentClick,
  onAssigneeClick,
  onReporterClick,
  onLocationClick,
  defaultPageSize = DEFAULT_PAGE_SIZE,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  isLoading = false,
  className,
  // Page header props
  pageIcon,
  pageTitle = 'Steps',
  pageSubtitle = 'View and manage tasks from incidents',
  headerActions,
  headerPrimaryAction,
  onExport,
  onAddStep,
}: StepsPageProps) {
  // ==========================================================================
  // STATE
  // ==========================================================================

  // Tab state (controlled or uncontrolled)
  const [internalActiveTab, setInternalActiveTab] = useState<StepsTabId>('my-steps')
  const activeTab = controlledActiveTab ?? internalActiveTab
  const setActiveTab = (tab: StepsTabId) => {
    setInternalActiveTab(tab)
    onTabChange?.(tab)
  }

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>({})

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)

  // Expanded step state
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null)

  // ==========================================================================
  // DERIVED DATA
  // ==========================================================================

  // Get steps based on active tab
  const currentSteps = activeTab === 'my-steps' ? mySteps : teamSteps

  // Filter groups for SearchFilter
  const filterGroups: FilterGroup[] = useMemo(
    () => [
      {
        key: 'severity',
        label: 'All Severities',
        options: SEVERITY_OPTIONS,
      },
      {
        key: 'status',
        label: 'All Statuses',
        options: STATUS_OPTIONS,
      },
    ],
    []
  )

  // Apply search and filters
  const filteredSteps = useMemo(() => {
    return currentSteps.filter((step) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          step.title.toLowerCase().includes(query) ||
          step.incidentId.toLowerCase().includes(query) ||
          step.location.toLowerCase().includes(query) ||
          step.assignee.name.toLowerCase().includes(query) ||
          step.reporter.name.toLowerCase().includes(query) ||
          (step.description && step.description.toLowerCase().includes(query))
        if (!matchesSearch) return false
      }

      // Severity filter
      const selectedSeverities = (filters.severity || []) as IncidentSeverity[]
      if (selectedSeverities.length > 0 && !selectedSeverities.includes(step.severity)) {
        return false
      }

      // Status filter
      const selectedStatuses = (filters.status || []) as StepStatus[]
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(step.status)) {
        return false
      }

      return true
    })
  }, [currentSteps, searchQuery, filters])

  // Paginate filtered steps
  const paginatedSteps = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredSteps.slice(start, start + pageSize)
  }, [filteredSteps, currentPage, pageSize])

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }, [])

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }, [])

  const handleTabChange = useCallback(
    (value: string) => {
      const tab = value as StepsTabId
      setActiveTab(tab)
      setCurrentPage(1)
      setExpandedStepId(null)
    },
    [setActiveTab]
  )

  const handleToggleExpand = useCallback((stepId: string) => {
    setExpandedStepId((current) => (current === stepId ? null : stepId))
  }, [])

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }, [])

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return searchQuery.length > 0 || Object.values(filters).some((arr) => arr.length > 0)
  }, [searchQuery, filters])

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearchQuery('')
    setFilters({})
    setCurrentPage(1)
  }, [])

  // ==========================================================================
  // RENDER
  // ==========================================================================

  // Default icon if not provided
  const defaultIcon = <Waypoints className="w-8 h-8" />

  // Build header actions based on provided handlers
  const buildHeaderActions = () => {
    const actions: React.ReactNode[] = []

    if (onExport) {
      actions.push(
        <Button key="export" variant="outline" size="sm" onClick={onExport}>
          <Download className="w-4 h-4" />
          Export
        </Button>
      )
    }

    if (onAddStep) {
      actions.push(
        <Button key="add" variant="default" size="sm" onClick={onAddStep}>
          <Plus className="w-4 h-4" />
          Add Step
        </Button>
      )
    }

    return actions.length > 0 ? <>{actions}</> : null
  }

  // Mobile primary action - prefer Add Step over Export
  const buildPrimaryAction = () => {
    if (onAddStep) {
      return (
        <Button variant="default" size="sm" onClick={onAddStep}>
          <Plus className="w-4 h-4" />
          Add
        </Button>
      )
    }
    if (onExport) {
      return (
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="w-4 h-4" />
          Export
        </Button>
      )
    }
    return null
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Page Action Panel - only show actions if handlers provided */}
      <PageActionPanel
        icon={pageIcon ?? defaultIcon}
        title={pageTitle}
        subtitle={pageSubtitle}
        iconClassName="text-accent"
        primaryAction={headerPrimaryAction ?? buildPrimaryAction()}
        actions={headerActions ?? buildHeaderActions()}
      />

      {/* Tabs - badge shows filtered count, not total (UX fix) */}
      {/* Note: Using secondary variant instead of destructive to reduce alert fatigue */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList variant="accent" animated className="w-fit">
          <TabsTrigger variant="accent" value="my-steps">
            My Steps
            <Badge variant="secondary" size="sm" className="ml-1.5">
              {activeTab === 'my-steps' && hasActiveFilters ? `${filteredSteps.length}/${mySteps.length}` : mySteps.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger variant="accent" value="team-steps">
            Team Steps
            <Badge variant="secondary" size="sm" className="ml-1.5">
              {activeTab === 'team-steps' && hasActiveFilters ? `${filteredSteps.length}/${teamSteps.length}` : teamSteps.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search and filters with clear button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchFilter
            placeholder="Search steps by title, incident, location..."
            value={searchQuery}
            onChange={handleSearchChange}
            filterGroups={filterGroups}
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>
        {/* Clear filters button - only show when filters active */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="min-h-11 sm:min-h-0 self-start"
          >
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Main content card */}
      <div className="bg-surface border border-default rounded-xl overflow-hidden shadow-sm">
        {/* Steps list */}
        {isLoading ? (
          // Skeleton loading - shows 5 placeholder items
          <div className="divide-y divide-default">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonItem key={i} />
            ))}
          </div>
        ) : filteredSteps.length === 0 ? (
          <EmptyState
            message={
              hasActiveFilters
                ? 'No steps match your filters'
                : activeTab === 'my-steps'
                  ? 'All caught up!'
                  : 'No team steps'
            }
            description={
              hasActiveFilters
                ? 'Try adjusting your search or filter criteria'
                : activeTab === 'my-steps'
                  ? 'You have no pending steps assigned to you'
                  : 'There are no steps assigned to your team'
            }
            isFiltered={hasActiveFilters}
            onClearFilters={handleClearFilters}
            actionLabel={onAddStep ? 'Add Step' : undefined}
            onAction={onAddStep}
          />
        ) : (
          <div className="divide-y divide-default">
            {paginatedSteps.map((step) => (
              <StepItem
                key={step.id}
                step={step}
                isExpanded={expandedStepId === step.id}
                onToggleExpand={() => handleToggleExpand(step.id)}
                onNextStep={onNextStep}
                onIncidentClick={onIncidentClick}
                onAssigneeClick={onAssigneeClick}
                onReporterClick={onReporterClick}
                onLocationClick={onLocationClick}
              />
            ))}
          </div>
        )}

        {/* Pagination - responsive */}
        {filteredSteps.length > 0 && (
          <div className="px-3 sm:px-4 py-3 border-t border-default">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredSteps.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={pageSizeOptions}
              showPageSizeSelector
              showResultsText
              showFirstLastButtons
              maxPageButtons={5}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default StepsPage
