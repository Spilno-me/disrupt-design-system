/**
 * Editable Widget Wrapper
 *
 * Wraps dashboard widgets with edit mode functionality:
 * - Drag handle for reordering
 * - Selection state with visual feedback
 * - Context menu for widget actions
 * - Resize handles (when enabled)
 *
 * Uses Framer Motion for smooth animations and drag interactions.
 */
import * as React from 'react'
import { forwardRef, useState } from 'react'
import { motion, Reorder, useDragControls } from 'motion/react'
import {
  Pencil,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
  Maximize2,
  Settings2,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '../../../../components/ui/dropdown-menu'
import { Button } from '../../../../components/ui/button'
import { cn } from '../../../../lib/utils'
import { useDashboardEditOptional, type WidgetSize } from './DashboardEditContext'

// =============================================================================
// TYPES
// =============================================================================

export interface EditableWidgetProps {
  id: string
  children: React.ReactNode
  className?: string
  size?: WidgetSize
  visible?: boolean
  onEdit?: () => void
  onSettingsOpen?: () => void
  /** Drag controls from parent (for Reorder integration) */
  dragControls?: ReturnType<typeof useDragControls>
}

// =============================================================================
// SIZE CONFIG
// =============================================================================

const sizeClasses: Record<WidgetSize, string> = {
  '1x1': 'col-span-1',
  '2x1': 'col-span-2',
  '1x2': 'col-span-1 row-span-2',
  '2x2': 'col-span-2 row-span-2',
}

// =============================================================================
// COMPONENT
// =============================================================================

export const EditableWidget = forwardRef<HTMLDivElement, EditableWidgetProps>(
  function EditableWidget(
    {
      id,
      children,
      className,
      size = '1x1',
      visible = true,
      onEdit,
      onSettingsOpen,
      dragControls: externalDragControls,
    },
    ref
  ) {
    const context = useDashboardEditOptional()
    const internalDragControls = useDragControls()
    // Use external drag controls if provided (from ReorderableWidget), otherwise use internal
    const dragControls = externalDragControls || internalDragControls
    const [isHovered, setIsHovered] = useState(false)

    // If no context, render children directly (non-edit mode)
    if (!context) {
      return (
        <div ref={ref} className={cn(sizeClasses[size], className)}>
          {children}
        </div>
      )
    }

    const {
      isEditMode,
      selectedWidgetId,
      selectWidget,
      setDraggedWidget,
      removeWidget,
      duplicateWidget,
      toggleWidgetVisibility,
      resizeWidget,
    } = context

    const isSelected = selectedWidgetId === id
    const isDragging = context.draggedWidgetId === id

    // Non-edit mode: simple render
    if (!isEditMode) {
      if (!visible) return null
      return (
        <div ref={ref} className={cn(sizeClasses[size], className)}>
          {children}
        </div>
      )
    }

    // Edit mode: full editable wrapper
    return (
      <motion.div
        ref={ref}
        layout
        layoutId={id}
        className={cn(
          'relative group',
          sizeClasses[size],
          className,
          !visible && 'opacity-40'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          e.stopPropagation()
          selectWidget(id)
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: 1,
          scale: isDragging ? 1.02 : 1,
        }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {/* Selection Ring - matches input focus ring style (ring-4 ring-ring/40) */}
        <div
          className={cn(
            'absolute -inset-0 rounded-xl pointer-events-none transition-all duration-200',
            isSelected && 'ring-[3px] ring-accent',
            !isSelected && isHovered && 'ring-[3px] ring-accent/40',
            !isSelected && !isHovered && 'ring-0'
          )}
        />

        {/* Paper tab handle - floats ABOVE everything including nav bar */}
        <motion.div
          className={cn(
            // Position: sticks out from left edge
            'absolute -left-6 top-1/2 -translate-y-1/2',
            // Z-index: ABOVE nav bar (z-[9999]) for dramatic drag effect
            'z-[10000]',
            // Remove all focus rings
            'outline-none focus:outline-none focus-visible:outline-none',
            'opacity-0 group-hover:opacity-100 transition-all duration-200',
            isSelected && 'opacity-100'
          )}
          onPointerDown={(e) => {
            e.stopPropagation()
            setDraggedWidget(id)
            dragControls.start(e)
          }}
          onPointerUp={() => setDraggedWidget(null)}
        >
          {/* The paper tab - solid background matching card */}
          <div
            className={cn(
              'relative flex items-center justify-center cursor-grab active:cursor-grabbing',
              // Remove all focus rings
              'outline-none focus:outline-none focus-visible:outline-none',
              // Size
              'w-8 h-20',
              // Rounded on left, flat on right to blend into card
              'rounded-l-xl rounded-r-none',
              // Same solid background as card (bg-elevated)
              'bg-elevated',
              // Subtle border on 3 sides (top, left, bottom) - no right border
              'border-l border-t border-b border-r-0 border-default/30',
              // Shadow on left side
              'shadow-[-6px_2px_16px_rgba(0,0,0,0.1)]'
            )}
          >
            {/* Grip dots */}
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-1">
                <div className={cn('w-1.5 h-1.5 rounded-full transition-colors', isSelected ? 'bg-accent-strong' : 'bg-abyss-300 dark:bg-abyss-500')} />
                <div className={cn('w-1.5 h-1.5 rounded-full transition-colors', isSelected ? 'bg-accent-strong' : 'bg-abyss-300 dark:bg-abyss-500')} />
              </div>
              <div className="flex gap-1">
                <div className={cn('w-1.5 h-1.5 rounded-full transition-colors', isSelected ? 'bg-accent-strong' : 'bg-abyss-300 dark:bg-abyss-500')} />
                <div className={cn('w-1.5 h-1.5 rounded-full transition-colors', isSelected ? 'bg-accent-strong' : 'bg-abyss-300 dark:bg-abyss-500')} />
              </div>
              <div className="flex gap-1">
                <div className={cn('w-1.5 h-1.5 rounded-full transition-colors', isSelected ? 'bg-accent-strong' : 'bg-abyss-300 dark:bg-abyss-500')} />
                <div className={cn('w-1.5 h-1.5 rounded-full transition-colors', isSelected ? 'bg-accent-strong' : 'bg-abyss-300 dark:bg-abyss-500')} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Drag shadow when dragging */}
        {isDragging && (
          <div className="absolute -inset-1 rounded-2xl bg-abyss-950/10 blur-xl -z-10" />
        )}

        {/* Edit Mode Overlay */}
        <div
          className={cn(
            'absolute inset-0 rounded-xl transition-colors duration-200 pointer-events-none z-10',
            isEditMode && 'bg-accent/5',
            isDragging && 'bg-accent/10'
          )}
        />

        {/* Action Menu */}
        <div
          className={cn(
            'absolute -top-2 -right-2 z-20',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
            isSelected && 'opacity-100'
          )}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-7 w-7 p-0 rounded-full shadow-md bg-surface"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {onEdit && (
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Widget
                </DropdownMenuItem>
              )}
              {onSettingsOpen && (
                <DropdownMenuItem onClick={onSettingsOpen}>
                  <Settings2 className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => duplicateWidget(id)}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleWidgetVisibility(id)}>
                {visible ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Hide Widget
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Show Widget
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Resize Submenu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Resize
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={size}
                    onValueChange={(v) => resizeWidget(id, v as WidgetSize)}
                  >
                    <DropdownMenuRadioItem value="1x1">
                      Small (1x1)
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="2x1">
                      Wide (2x1)
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="1x2">
                      Tall (1x2)
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="2x2">
                      Large (2x2)
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => removeWidget(id)}
                className="text-error focus:text-error"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove Widget
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Widget Content */}
        <div className="relative z-0 h-full">{children}</div>

        {/* Hidden Badge */}
        {!visible && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-default shadow-lg">
              <EyeOff className="w-4 h-4 text-muted" />
              <span className="text-sm font-medium text-muted">Hidden</span>
            </div>
          </div>
        )}
      </motion.div>
    )
  }
)

// =============================================================================
// REORDERABLE WIDGET (for use with Framer Motion Reorder)
// =============================================================================

export interface ReorderableWidgetProps extends EditableWidgetProps {
  value: string // Required for Reorder.Item
}

export const ReorderableWidget = forwardRef<HTMLDivElement, ReorderableWidgetProps>(
  function ReorderableWidget({ value, ...props }, ref) {
    const context = useDashboardEditOptional()
    const dragControls = useDragControls()

    if (!context?.isEditMode) {
      return <EditableWidget ref={ref} {...props} />
    }

    return (
      <Reorder.Item
        value={value}
        id={value}
        as="div"
        className={cn(sizeClasses[props.size || '1x1'])}
        dragListener={false}
        dragControls={dragControls}
        onDragStart={() => context.setDraggedWidget(value)}
        onDragEnd={() => context.setDraggedWidget(null)}
      >
        <EditableWidget ref={ref} {...props} dragControls={dragControls} />
      </Reorder.Item>
    )
  }
)
