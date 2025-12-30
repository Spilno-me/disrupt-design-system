/**
 * DraggableCategoryCard - Drag-and-drop wrapper for CategoryCard
 *
 * Uses Framer Motion Reorder for smooth drag animations.
 * Shows drag handle on hover/focus for discoverability.
 */

import * as React from 'react'
import { Reorder, useDragControls } from 'motion/react'
import { GripVertical } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { CategoryCard } from './CategoryCard'
import type { DictionaryCategory } from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface DraggableCategoryCardProps {
  category: DictionaryCategory
  isSelected?: boolean
  onClick?: () => void
  isDragEnabled?: boolean
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DraggableCategoryCard({
  category,
  isSelected = false,
  onClick,
  isDragEnabled = true,
  className,
}: DraggableCategoryCardProps) {
  const dragControls = useDragControls()

  // Non-draggable mode
  if (!isDragEnabled) {
    return (
      <div>
        <CategoryCard
          category={category}
          isSelected={isSelected}
          onClick={onClick}
          className={className}
        />
      </div>
    )
  }

  return (
    <Reorder.Item
      as="div"
      value={category.id}
      id={category.id}
      dragListener={false}
      dragControls={dragControls}
      className={cn('relative group list-none', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
      whileDrag={{
        scale: 1.02,
        boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
        zIndex: 50,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {/* Drag Handle - visible on hover */}
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center',
          'cursor-grab active:cursor-grabbing z-10',
          'opacity-0 group-hover:opacity-100 transition-opacity',
          'touch-none select-none'
        )}
        onPointerDown={(e) => dragControls.start(e)}
      >
        <GripVertical className="size-4 text-tertiary" />
      </div>

      {/* Card with left padding for drag handle */}
      <div className="pl-5">
        <CategoryCard
          category={category}
          isSelected={isSelected}
          onClick={onClick}
        />
      </div>
    </Reorder.Item>
  )
}

DraggableCategoryCard.displayName = 'DraggableCategoryCard'

export default DraggableCategoryCard
