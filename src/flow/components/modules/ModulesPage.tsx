/**
 * ModulesPage - Full page composition for module management
 *
 * Provides complete module configuration interface with:
 * - Page header with title and add button
 * - SearchFilter for text search and status filtering
 * - ModulesGrid for displaying modules
 * - Pagination for large module lists
 *
 * @component PAGE
 */

import * as React from 'react'
import { useState, useMemo, useCallback } from 'react'
import { Plus, RefreshCw, Package } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Button } from '../../../components/ui/button'
import { PageActionPanel } from '../../../components/ui/PageActionPanel'
import { SearchFilter } from '../../../components/shared/SearchFilter/SearchFilter'
import { Pagination } from '../../../components/ui/Pagination'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../components/ui/tooltip'
import { ModulesGrid } from './ModulesGrid'
import { MODULE_STATUS_CONFIG, type ModuleStatus } from './helpers'
import type { ModuleItem, ModulePermissions } from './ModuleCard'
import type { FilterGroup, FilterState } from '../../../components/shared/SearchFilter/types'

// =============================================================================
// TYPES
// =============================================================================

export interface ModulesFilterState {
  search: string
  status: ModuleStatus | 'all'
}

export interface ModulesPageProps {
  /** Array of modules to display */
  modules: ModuleItem[]
  /** Show loading state */
  isLoading?: boolean
  /** Error message to display */
  error?: string | null
  /** Current page (1-indexed) */
  currentPage?: number
  /** Items per page */
  pageSize?: number
  /** Total number of modules (for pagination) */
  totalModules?: number
  /** Callback when page changes */
  onPageChange?: (page: number) => void
  /** Callback when page size changes */
  onPageSizeChange?: (size: number) => void
  /** Callback when search value changes */
  onSearchChange?: (search: string) => void
  /** Callback when status filter changes */
  onStatusChange?: (status: ModuleStatus | 'all') => void
  /** Callback when a module is opened/clicked */
  onOpenModule?: (module: ModuleItem) => void
  /** Callback when edit is clicked */
  onEditModule?: (module: ModuleItem) => void
  /** Callback when status toggle is clicked */
  onToggleModuleStatus?: (module: ModuleItem) => void
  /** Callback when create entity is clicked */
  onCreateEntity?: (module: ModuleItem) => void
  /** Callback when add new module is clicked */
  onAddModule?: () => void
  /** Callback when refresh is clicked */
  onRefresh?: () => void
  /** Permission flags for all modules */
  permissions?: ModulePermissions
  /** Whether user can add new modules */
  canAddModule?: boolean
  /** Page title */
  title?: string
  /** Page description */
  description?: string
  /** Additional class names */
  className?: string
}

// =============================================================================
// CONSTANTS
// =============================================================================

const STATUS_FILTER_OPTIONS = [
  { id: 'all', label: 'All Status' },
  { id: 'active', label: MODULE_STATUS_CONFIG.active.label },
  { id: 'inactive', label: MODULE_STATUS_CONFIG.inactive.label },
  { id: 'draft', label: MODULE_STATUS_CONFIG.draft.label },
]

const STATUS_FILTER_GROUP: FilterGroup = {
  key: 'status',
  label: 'Status',
  options: STATUS_FILTER_OPTIONS,
}

const PAGE_SIZE_OPTIONS = [10, 20, 50]

// =============================================================================
// COMPONENT
// =============================================================================

export function ModulesPage({
  modules,
  isLoading = false,
  error = null,
  currentPage = 1,
  pageSize = 10,
  totalModules,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onStatusChange,
  onOpenModule,
  onEditModule,
  onToggleModuleStatus,
  onCreateEntity,
  onAddModule,
  onRefresh,
  permissions,
  canAddModule = true,
  title = 'Modules',
  description,
  className,
}: ModulesPageProps) {
  // Local state for search (controlled by parent if onSearchChange provided)
  const [localSearch, setLocalSearch] = useState('')
  const [localStatus, setLocalStatus] = useState<ModuleStatus | 'all'>('all')

  // Handle search change
  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalSearch(value)
      onSearchChange?.(value)
    },
    [onSearchChange]
  )

  // Handle debounced search (for API calls)
  const handleDebouncedSearch = useCallback(
    (value: string) => {
      onSearchChange?.(value)
    },
    [onSearchChange]
  )

  // Convert filter state to/from SearchFilter format
  const filters: FilterState = useMemo(
    () => ({
      status: localStatus === 'all' ? [] : [localStatus],
    }),
    [localStatus]
  )

  const handleFiltersChange = useCallback(
    (newFilters: FilterState) => {
      const statusFilter = newFilters.status?.[0] as ModuleStatus | undefined
      const newStatus = statusFilter || 'all'
      setLocalStatus(newStatus)
      onStatusChange?.(newStatus)
    },
    [onStatusChange]
  )

  // Clear filters
  const handleClearFilters = useCallback(() => {
    setLocalSearch('')
    setLocalStatus('all')
    onSearchChange?.('')
    onStatusChange?.('all')
  }, [onSearchChange, onStatusChange])

  // Calculate if filters are applied
  const hasFilters = localSearch.trim() !== '' || localStatus !== 'all'

  // Pagination calculations
  const total = totalModules ?? modules.length
  const totalPages = Math.ceil(total / pageSize)
  const showPagination = totalPages > 1 || (onPageSizeChange && total > PAGE_SIZE_OPTIONS[0])

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Page Header - PageActionPanel for consistent styling */}
      <PageActionPanel
        icon={<Package className="size-5" />}
        iconClassName="text-accent"
        title={title}
        subtitle={description}
        actions={
          onRefresh && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-9"
                    onClick={onRefresh}
                    disabled={isLoading}
                    aria-label="Refresh modules"
                  >
                    <RefreshCw className={cn('size-4', isLoading && 'animate-spin')} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh modules</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        }
        primaryAction={
          onAddModule && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-2"
                    onClick={onAddModule}
                    disabled={!canAddModule}
                    aria-label="Add new module"
                  >
                    <Plus className="size-4" />
                    <span className="hidden sm:inline">Add Module</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {canAddModule ? 'Add a new module' : 'No permission to add modules'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        }
      />

      {/* Search and Filters */}
      <SearchFilter
        placeholder="Search modules..."
        value={localSearch}
        onChange={handleSearchChange}
        onDebouncedChange={handleDebouncedSearch}
        debounceMs={300}
        filterGroups={[STATUS_FILTER_GROUP]}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        isSearching={isLoading}
      />

      {/* Module Stats (only when not loading and has modules) */}
      {!isLoading && !error && modules.length > 0 && (
        <div className="flex flex-wrap gap-2 text-sm text-secondary">
          <span>
            Showing {modules.length} of {total} modules
          </span>
          {hasFilters && (
            <button
              className="text-accent hover:underline"
              onClick={handleClearFilters}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Modules Grid */}
      <ModulesGrid
        modules={modules}
        isLoading={isLoading}
        error={error}
        onOpen={onOpenModule}
        onEdit={onEditModule}
        onToggleStatus={onToggleModuleStatus}
        onCreateEntity={onCreateEntity}
        permissions={permissions}
        hasFilters={hasFilters}
        onClearFilters={handleClearFilters}
        onRetry={onRefresh}
      />

      {/* Pagination */}
      {showPagination && !isLoading && !error && modules.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={total}
          pageSize={pageSize}
          onPageChange={onPageChange ?? (() => {})}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          showPageSizeSelector={!!onPageSizeChange}
          showResultsText={false}
        />
      )}
    </div>
  )
}

ModulesPage.displayName = 'ModulesPage'

export default ModulesPage
