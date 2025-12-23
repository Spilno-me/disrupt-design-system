import * as React from 'react'
import { SearchX, Inbox } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from './button'

// =============================================================================
// TYPES
// =============================================================================

export type EmptyStateVariant = 'search' | 'filter' | 'default'

export interface EmptyStateProps {
  /** Variant determines the icon shown */
  variant?: EmptyStateVariant
  /** Custom icon to override variant icon */
  icon?: React.ReactNode
  /** Main heading text */
  title?: string
  /** Description text below heading */
  description?: string
  /** Primary action button text */
  actionLabel?: string
  /** Callback when action button is clicked */
  onAction?: () => void
  /** Additional class names */
  className?: string
}

// =============================================================================
// ICON MAP
// =============================================================================

const variantIcons: Record<EmptyStateVariant, React.ReactNode> = {
  search: <SearchX className="w-12 h-12" />,
  filter: <SearchX className="w-12 h-12" />,
  default: <Inbox className="w-12 h-12" />,
}

const defaultTitles: Record<EmptyStateVariant, string> = {
  search: 'No results found',
  filter: 'No matches',
  default: 'No items yet',
}

const defaultDescriptions: Record<EmptyStateVariant, string> = {
  search: 'Try adjusting your search terms',
  filter: 'Try clearing some filters to see more results',
  default: 'Items will appear here once created',
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * EmptyState - A feedback component for empty lists or no search results.
 *
 * UX Laws Applied:
 * - Prägnanz: Simple, clear visual communication
 * - Feedback principle: Clear indication of state
 * - Fitts' Law: Prominent action button (44px touch target)
 *
 * Variants:
 * - search: No search results (SearchX icon)
 * - filter: No filter matches (SearchX icon)
 * - default: Empty list (Inbox icon)
 *
 * @example
 * // Basic usage
 * <EmptyState variant="filter" onAction={() => clearFilters()} />
 *
 * @example
 * // Custom content
 * <EmptyState
 *   icon={<SearchX className="w-12 h-12" />}
 *   title="No incidents found"
 *   description="Your search criteria returned no results."
 *   actionLabel="Clear all filters"
 *   onAction={handleClearFilters}
 * />
 */
export function EmptyState({
  variant = 'default',
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const displayIcon = icon ?? variantIcons[variant]
  const displayTitle = title ?? defaultTitles[variant]
  const displayDescription = description ?? defaultDescriptions[variant]
  const displayActionLabel = actionLabel ?? (variant === 'filter' ? 'Clear filters' : undefined)

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      {/* Icon */}
      <div className="text-secondary mb-4">
        {displayIcon}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-primary mb-2">
        {displayTitle}
      </h3>

      {/* Description */}
      <p className="text-sm text-secondary max-w-md mb-6">
        {displayDescription}
      </p>

      {/* Action button */}
      {onAction && displayActionLabel && (
        <Button
          variant="outline"
          size="default"
          onClick={onAction}
          className="min-h-11" // 44px touch target (Fitts' Law)
        >
          {displayActionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
