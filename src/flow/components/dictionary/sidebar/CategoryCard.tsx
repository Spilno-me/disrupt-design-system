/**
 * CategoryCard - Dictionary category display card
 *
 * Shows category info with type badge, item count, and description.
 * Highlights selected state with accent border.
 */

import * as React from 'react'
import { Database } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../../../components/ui/badge'
import type { DictionaryCategory } from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface CategoryCardProps {
  category: DictionaryCategory
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CategoryCard({
  category,
  isSelected = false,
  onClick,
  className,
}: CategoryCardProps) {
  const isSystem = category.type === 'system'

  return (
    <button
      type="button"
      onClick={onClick}
      data-slot="category-card"
      className={cn(
        'flex w-full flex-col gap-1 rounded-lg p-3 text-left transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        isSelected
          // Selected: Solid elevated (lighter) + accent left border indicator
          // No glass - nested in glass sidebar (avoid double-frosting)
          ? 'border-l-[5px] border-l-accent border-y border-r border-default bg-elevated shadow-sm'
          // Non-selected: Solid surface with default border
          : 'border border-default bg-surface hover:bg-surfaceHover hover:shadow-sm',
        className
      )}
    >
      {/* Type Badge */}
      <div className="flex items-center justify-between">
        <Badge
          variant={isSystem ? 'secondary' : 'outline'}
          size="sm"
          className="gap-1"
        >
          <Database className="size-3" />
          {isSystem ? 'System' : 'Custom'}
        </Badge>
        <span className="text-sm font-medium text-secondary">
          {category.itemCount}
        </span>
      </div>

      {/* Category Name */}
      <h3 className="font-medium text-primary line-clamp-1">
        {category.name}
      </h3>

      {/* Description */}
      {category.description && (
        <p className="text-xs text-secondary line-clamp-2">
          {category.description}
        </p>
      )}
    </button>
  )
}

CategoryCard.displayName = 'CategoryCard'

export default CategoryCard
