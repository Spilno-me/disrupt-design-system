/**
 * SwipeableTreeItem - iOS-style swipe-to-reveal actions wrapper
 *
 * Wraps tree item content and reveals action buttons (Edit, Delete)
 * when user swipes left. Follows iOS UX patterns for familiarity.
 *
 * Features:
 * - Swipe left to reveal actions
 * - Swipe right or tap elsewhere to dismiss
 * - Spring animation on release
 * - Touch threshold prevents accidental triggers
 * - Only one item can be swiped open at a time
 */

import * as React from 'react'
import { useRef, useState, useCallback, useEffect } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import type { Location } from '../types'

// Action panel width (2 buttons * 48px each)
const ACTION_WIDTH = 96
// Minimum swipe distance to trigger reveal
const SWIPE_THRESHOLD = 50

export interface SwipeableTreeItemProps {
  /** The tree item content to wrap */
  children: React.ReactNode
  /** Location data for action callbacks */
  location: Location
  /** Callback when edit action is triggered */
  onEdit: (location: Location) => void
  /** Callback when delete action is triggered */
  onDelete: (location: Location) => void
  /** ID of currently swiped item (for closing others) */
  swipedItemId: string | null
  /** Callback to set the currently swiped item */
  onSwipeChange: (id: string | null) => void
  /** Additional class name */
  className?: string
}

export function SwipeableTreeItem({
  children,
  location,
  onEdit,
  onDelete,
  swipedItemId,
  onSwipeChange,
  className,
}: SwipeableTreeItemProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [translateX, setTranslateX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef(0)
  const startTranslateRef = useRef(0)

  // Check if this item is currently swiped open
  const isSwiped = swipedItemId === location.id

  // Sync with external swiped state
  useEffect(() => {
    if (isSwiped) {
      setTranslateX(-ACTION_WIDTH)
    } else {
      setTranslateX(0)
    }
  }, [isSwiped])

  // Handle touch start
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX
    startTranslateRef.current = translateX
    setIsDragging(true)
  }, [translateX])

  // Handle touch move
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return

    const currentX = e.touches[0].clientX
    const diff = startXRef.current - currentX
    const newTranslate = startTranslateRef.current - diff

    // Clamp between -ACTION_WIDTH and 0
    // Allow slight overscroll for elastic feel
    const clamped = Math.max(
      -ACTION_WIDTH - 20, // Slight overscroll
      Math.min(20, newTranslate) // Slight resistance on right swipe
    )

    setTranslateX(clamped)
  }, [isDragging])

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)

    // Determine if we should snap open or closed
    if (translateX < -SWIPE_THRESHOLD) {
      // Snap open
      setTranslateX(-ACTION_WIDTH)
      onSwipeChange(location.id)
    } else {
      // Snap closed
      setTranslateX(0)
      if (isSwiped) {
        onSwipeChange(null)
      }
    }
  }, [translateX, location.id, isSwiped, onSwipeChange])

  // Handle edit action
  const handleEdit = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    onSwipeChange(null) // Close after action
    onEdit(location)
  }, [location, onEdit, onSwipeChange])

  // Handle delete action
  const handleDelete = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    onSwipeChange(null) // Close after action
    onDelete(location)
  }, [location, onDelete, onSwipeChange])

  // Close on click outside (when swiped)
  const handleContentClick = useCallback(() => {
    if (isSwiped) {
      onSwipeChange(null)
    }
  }, [isSwiped, onSwipeChange])

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
    >
      {/* Action buttons (revealed on swipe) */}
      <div
        className="absolute inset-y-0 right-0 flex items-stretch"
        style={{ width: ACTION_WIDTH }}
      >
        {/* Edit button */}
        <button
          type="button"
          className="flex flex-1 items-center justify-center bg-info text-white active:bg-info/90 transition-colors"
          onClick={handleEdit}
          onTouchEnd={handleEdit}
          aria-label="Edit location"
        >
          <Pencil className="size-5" />
        </button>

        {/* Delete button */}
        <button
          type="button"
          className="flex flex-1 items-center justify-center bg-error text-white active:bg-error/90 transition-colors"
          onClick={handleDelete}
          onTouchEnd={handleDelete}
          aria-label="Delete location"
        >
          <Trash2 className="size-5" />
        </button>
      </div>

      {/* Swipeable content */}
      <div
        className={cn(
          'relative bg-surface',
          isDragging ? 'transition-none' : 'transition-transform duration-200 ease-out'
        )}
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleContentClick}
      >
        {children}
      </div>
    </div>
  )
}

SwipeableTreeItem.displayName = 'SwipeableTreeItem'

export default SwipeableTreeItem
