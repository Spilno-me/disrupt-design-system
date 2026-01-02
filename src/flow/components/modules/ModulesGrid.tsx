/**
 * ModulesGrid - Responsive grid container for module cards
 *
 * Displays modules in a responsive grid layout with:
 * - 1 column on mobile
 * - 2 columns on tablet+
 * - Loading skeleton state
 * - Empty state with icon
 * - Error state
 *
 * @component ORGANISM
 */

import * as React from 'react'
import { Package } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ErrorState } from '../../../components/ui/ErrorState'
import { ModuleCard, type ModuleItem, type ModulePermissions } from './ModuleCard'

// =============================================================================
// TYPES
// =============================================================================

export interface ModulesGridProps {
  /** Array of modules to display */
  modules: ModuleItem[]
  /** Show loading skeleton state */
  isLoading?: boolean
  /** Error message to display */
  error?: string | null
  /** Callback when a module is opened/clicked */
  onOpen?: (module: ModuleItem) => void
  /** Callback when edit is clicked */
  onEdit?: (module: ModuleItem) => void
  /** Callback when status toggle is clicked */
  onToggleStatus?: (module: ModuleItem) => void
  /** Callback when create entity is clicked */
  onCreateEntity?: (module: ModuleItem) => void
  /** Permission flags for all modules */
  permissions?: ModulePermissions
  /** Custom empty state message (when no search results) */
  emptySearchMessage?: string
  /** Whether user has applied search/filters */
  hasFilters?: boolean
  /** Callback to clear filters (shown in empty state) */
  onClearFilters?: () => void
  /** Callback to retry loading (shown in error state) */
  onRetry?: () => void
  /** Additional class names */
  className?: string
}

// =============================================================================
// SKELETON COMPONENT
// =============================================================================

function ModuleCardSkeleton() {
  return (
    <div
      className={cn(
        // Depth 2 glass styling (matches ModuleCard)
        'flex flex-col rounded-lg bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent/30 p-4 shadow-md',
        'animate-pulse'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Icon placeholder */}
          <div className="size-10 rounded-lg bg-muted-bg/50" />
          {/* Name + version */}
          <div className="space-y-2">
            <div className="h-5 w-32 rounded bg-muted-bg/50" />
            <div className="h-3 w-24 rounded bg-muted-bg/30" />
          </div>
        </div>
        {/* Status badge placeholder */}
        <div className="h-5 w-16 rounded bg-muted-bg/50" />
      </div>

      {/* Metadata */}
      <div className="mt-4 space-y-2">
        <div className="h-4 w-40 rounded bg-muted-bg/30" />
        <div className="h-4 w-32 rounded bg-muted-bg/30" />
        <div className="h-3 w-48 rounded bg-muted-bg/20" />
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2 border-t border-accent/20 pt-3">
        <div className="h-9 w-16 rounded bg-muted-bg/30" />
        <div className="h-9 w-16 rounded bg-muted-bg/30" />
        <div className="h-9 w-20 rounded bg-muted-bg/30" />
      </div>
    </div>
  )
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ModulesGrid({
  modules,
  isLoading = false,
  error = null,
  onOpen,
  onEdit,
  onToggleStatus,
  onCreateEntity,
  permissions,
  emptySearchMessage = 'No modules match your search criteria',
  hasFilters = false,
  onClearFilters,
  onRetry,
  className,
}: ModulesGridProps) {
  // Error state
  if (error) {
    return (
      <ErrorState
        icon="error"
        title="Failed to load modules"
        message={error}
        showRetry={!!onRetry}
        onRetry={onRetry}
      />
    )
  }

  // Loading state - show skeleton grid
  if (isLoading) {
    return (
      <div
        className={cn(
          'grid gap-4',
          'grid-cols-1 sm:grid-cols-2',
          className
        )}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <ModuleCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  // Empty state - no modules
  if (modules.length === 0) {
    return (
      <EmptyState
        variant={hasFilters ? 'filter' : 'default'}
        icon={<Package className="size-12" />}
        title={hasFilters ? 'No modules found' : 'No modules available'}
        description={
          hasFilters
            ? emptySearchMessage
            : 'Get started by creating your first module.'
        }
        actionLabel={hasFilters && onClearFilters ? 'Clear filters' : undefined}
        onAction={onClearFilters}
      />
    )
  }

  // Populated grid
  return (
    <div
      className={cn(
        'grid gap-4',
        'grid-cols-1 sm:grid-cols-2',
        className
      )}
    >
      {modules.map((module) => (
        <ModuleCard
          key={module.id}
          module={module}
          onOpen={onOpen}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
          onCreateEntity={onCreateEntity}
          permissions={permissions}
        />
      ))}
    </div>
  )
}

ModulesGrid.displayName = 'ModulesGrid'

export default ModulesGrid
