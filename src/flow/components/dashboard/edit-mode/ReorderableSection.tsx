/**
 * Reorderable Section
 *
 * A drag-and-drop container for dashboard widgets within a section.
 * Uses Framer Motion Reorder for smooth reordering animations.
 */
import * as React from 'react'
import { Reorder, AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import { cn } from '../../../../lib/utils'
import { useDashboardEditOptional } from './DashboardEditContext'

// =============================================================================
// TYPES
// =============================================================================

export interface ReorderableSectionProps {
  sectionId: string
  children: React.ReactNode
  className?: string
  gridClassName?: string
  onAddWidget?: () => void
  addWidgetLabel?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ReorderableSection({
  sectionId,
  children,
  className,
  gridClassName = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
  onAddWidget,
  addWidgetLabel = 'Add Widget',
}: ReorderableSectionProps) {
  const context = useDashboardEditOptional()

  // Extract widget IDs from children
  const childArray = React.Children.toArray(children)
  const widgetIds = childArray
    .map((child) => {
      if (React.isValidElement(child)) {
        return (child.props as { id?: string }).id
      }
      return null
    })
    .filter(Boolean) as string[]

  // Handle reorder
  const handleReorder = (newOrder: string[]) => {
    context?.reorderWidgets(sectionId, newOrder)
  }

  // Non-edit mode: simple grid
  if (!context?.isEditMode) {
    return (
      <div className={cn(gridClassName, className)}>
        {children}
      </div>
    )
  }

  // Edit mode: reorderable grid
  return (
    <div className={className}>
      <Reorder.Group
        axis="x"
        values={widgetIds}
        onReorder={handleReorder}
        className={cn(gridClassName, 'relative')}
        as="div"
      >
        <AnimatePresence mode="popLayout">
          {children}
        </AnimatePresence>

        {/* Add Widget Button */}
        {onAddWidget && (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-1"
          >
            <Button
              variant="outline"
              className={cn(
                'w-full h-full min-h-[120px] border-dashed border-2',
                'hover:border-accent hover:bg-accent/5',
                'flex flex-col items-center justify-center gap-2',
                'text-muted hover:text-accent-strong transition-colors'
              )}
              onClick={onAddWidget}
            >
              <Plus className="w-6 h-6" />
              <span className="text-sm font-medium">{addWidgetLabel}</span>
            </Button>
          </motion.div>
        )}
      </Reorder.Group>

      {/* Drop Zone Indicator */}
      {context.draggedWidgetId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            'absolute inset-0 rounded-xl border-2 border-dashed border-accent/50',
            'bg-accent/5 pointer-events-none z-50'
          )}
        />
      )}
    </div>
  )
}

// =============================================================================
// DROP ZONE (for cross-section drops)
// =============================================================================

export interface WidgetDropZoneProps {
  sectionId: string
  children: React.ReactNode
  className?: string
  onDrop?: (widgetId: string) => void
}

export function WidgetDropZone({
  sectionId,
  children,
  className,
  onDrop,
}: WidgetDropZoneProps) {
  const context = useDashboardEditOptional()
  const [isDragOver, setIsDragOver] = React.useState(false)

  if (!context?.isEditMode) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      className={cn('relative', className)}
      onDragEnter={(e) => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        setIsDragOver(false)
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        if (context.draggedWidgetId) {
          onDrop?.(context.draggedWidgetId)
        }
      }}
    >
      {children}

      {/* Drop indicator */}
      <AnimatePresence>
        {isDragOver && context.draggedWidgetId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              'absolute inset-0 rounded-xl',
              'border-2 border-dashed border-accent',
              'bg-accent/10 pointer-events-none z-50',
              'flex items-center justify-center'
            )}
          >
            <div className="px-4 py-2 rounded-full bg-accent text-accent-foreground font-medium text-sm shadow-lg">
              Drop here to move to {sectionId}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
