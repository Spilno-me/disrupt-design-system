/**
 * DictionaryEntryCard - Card-based entry display for mobile
 *
 * Replaces table rows on mobile with touch-friendly cards.
 * Shows VALUE as title, DESCRIPTION as subtitle, STATUS badge,
 * and expandable action buttons.
 */

import * as React from 'react'
import { Edit2, Trash2, GripVertical, Copy, Check, Files, ChevronRight } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import { ActionTile } from '../../../../components/ui/ActionTile'
import { Switch } from '../../../../components/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'
import type { DictionaryEntry } from '../types'
import { INDENT_PER_LEVEL, countEntryDescendants } from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface DictionaryEntryCardProps {
  entry: DictionaryEntry
  onEdit?: (entry: DictionaryEntry) => void
  onDelete?: (entry: DictionaryEntry) => void
  /** Called to duplicate an entry */
  onDuplicate?: (entry: DictionaryEntry) => void
  /** Called when entry status is toggled */
  onStatusChange?: (entryId: string, status: 'active' | 'inactive') => void
  /** Enable drag-and-drop reordering */
  isDraggable?: boolean
  /** Is this entry currently being dragged? */
  isDragging?: boolean
  /** Is another entry being dragged over this one? */
  isDragOver?: boolean
  /** Called when drag starts on this entry */
  onDragStart?: () => void
  /** Called when dragging over this entry */
  onDragOver?: (e: React.DragEvent) => void
  /** Called when drag leaves this entry */
  onDragLeave?: () => void
  /** Called when dropping on this entry */
  onDrop?: (e: React.DragEvent) => void
  /** Called when drag ends */
  onDragEnd?: () => void
  className?: string
  // Hierarchy props
  /** Depth level in hierarchy (0 = root) */
  depth?: number
  /** Whether this entry has children */
  hasChildren?: boolean
  /** Whether children are currently visible (expanded) */
  isExpanded?: boolean
  /** Called when expand/collapse is toggled */
  onToggleExpand?: () => void
}

// =============================================================================
// STATUS CONFIG
// =============================================================================

const STATUS_CONFIG: Record<
  'active' | 'inactive',
  { label: string; variant: 'success' | 'secondary' }
> = {
  active: { label: 'Active', variant: 'success' },
  inactive: { label: 'Inactive', variant: 'secondary' },
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DictionaryEntryCard({
  entry,
  onEdit,
  onDelete,
  onDuplicate,
  onStatusChange,
  isDraggable = false,
  isDragging = false,
  isDragOver = false,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  className,
  // Hierarchy props
  depth = 0,
  hasChildren = false,
  isExpanded = false,
  onToggleExpand,
}: DictionaryEntryCardProps) {
  const [isCopied, setIsCopied] = React.useState(false)

  // Calculate indentation based on depth
  const indentPx = depth * INDENT_PER_LEVEL

  // Count descendants for badge
  const childCount = React.useMemo(() => {
    if (!hasChildren) return 0
    return countEntryDescendants(entry)
  }, [entry, hasChildren])

  const handleCopyCode = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(entry.code)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }, [entry.code])

  const hasActions = Boolean(onEdit || onDelete || onDuplicate)
  const canDelete = onDelete && !entry.isSystem

  return (
    <div
      data-slot="dictionary-entry-card"
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      style={{ marginLeft: indentPx }}
      className={cn(
        // Depth 2: Card with shadow per depth-layering-rules
        'group flex items-start gap-3 rounded-lg border border-default bg-surface shadow-sm p-3 transition-all duration-150 relative',
        isDragging && 'opacity-40 bg-muted-bg scale-[0.98]',
        isDragOver && [
          'bg-accent/10 border-accent',
          // Top insertion bar - thick and visible
          'before:absolute before:inset-x-0 before:-top-1 before:h-1 before:bg-accent before:rounded-full',
          // Left circle indicator at insertion point
          'after:absolute after:left-3 after:-top-1 after:-translate-y-1/2 after:size-3 after:rounded-full after:bg-accent after:border-2 after:border-surface after:shadow-lg after:z-10',
        ],
        !isDragging && !isDragOver && 'hover:bg-muted-bg/30',
        // Depth level indicator via left border
        depth > 0 && 'border-l-2 border-l-accent/30',
        className
      )}
    >
      {/* Expand/Collapse Button for parent entries */}
      {hasChildren && onToggleExpand ? (
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 size-8 -ml-1 -my-1"
          onClick={(e) => {
            e.stopPropagation()
            onToggleExpand()
          }}
          aria-label={isExpanded ? 'Collapse children' : 'Expand children'}
        >
          <ChevronRight
            className={cn(
              'size-4 text-tertiary transition-transform duration-200',
              isExpanded && 'rotate-90'
            )}
          />
        </Button>
      ) : (
        /* Drag Handle - 44px touch target per Fitts's Law */
        <div
          className={cn(
            'shrink-0 flex items-center justify-center min-h-11 min-w-8 -ml-2 -my-1 rounded',
            isDraggable
              ? 'cursor-grab text-tertiary hover:text-secondary hover:bg-muted-bg active:cursor-grabbing'
              : 'text-tertiary/30'
          )}
          aria-label={isDraggable ? 'Drag to reorder' : undefined}
        >
          <GripVertical className="size-4" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        {/* Value + Status Row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-primary leading-snug">
              {entry.value}
            </span>
            {/* Child count badge when collapsed */}
            {hasChildren && !isExpanded && childCount > 0 && (
              <Badge variant="secondary" size="sm" className="font-normal">
                {childCount} {childCount === 1 ? 'child' : 'children'}
              </Badge>
            )}
          </div>
          {onStatusChange ? (
            <div className="flex items-center gap-2 shrink-0">
              <Switch
                checked={entry.status === 'active'}
                onCheckedChange={(checked) =>
                  onStatusChange(entry.id, checked ? 'active' : 'inactive')
                }
                aria-label={`Toggle ${entry.value} status`}
              />
              <span className={cn(
                'text-xs font-medium',
                entry.status === 'active' ? 'text-success' : 'text-secondary'
              )}>
                {STATUS_CONFIG[entry.status].label}
              </span>
            </div>
          ) : (
            <Badge
              variant={STATUS_CONFIG[entry.status].variant}
              size="sm"
              className="shrink-0"
            >
              {STATUS_CONFIG[entry.status].label}
            </Badge>
          )}
        </div>

        {/* Description */}
        {entry.description && (
          <p className="text-sm text-secondary line-clamp-2">
            {entry.description}
          </p>
        )}

        {/* Code Row with Copy */}
        <div className="flex items-center gap-2 pt-1">
          <code className="font-mono text-xs text-secondary bg-muted-bg px-1.5 py-0.5 rounded max-w-[180px] truncate">
            {entry.code}
          </code>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 shrink-0"
            onClick={handleCopyCode}
          >
            {isCopied ? (
              <Check className="size-3.5 text-success" />
            ) : (
              <Copy className="size-3.5 text-tertiary" />
            )}
          </Button>
          {entry.isSystem && (
            <Badge variant="secondary" size="sm">
              System
            </Badge>
          )}
        </div>
      </div>

      {/* Actions - ≤3 visible buttons per UX rule */}
      {hasActions && (
        <div className="flex items-center gap-1.5 shrink-0">
          {onEdit && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ActionTile
                    variant="info"
                    appearance="filled"
                    size="xs"
                    onClick={() => onEdit(entry)}
                    aria-label={`Edit ${entry.value}`}
                  >
                    <Edit2 className="size-4" />
                  </ActionTile>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {onDuplicate && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ActionTile
                    variant="neutral"
                    appearance="filled"
                    size="xs"
                    onClick={() => onDuplicate(entry)}
                    aria-label={`Duplicate ${entry.value}`}
                  >
                    <Files className="size-4" />
                  </ActionTile>
                </TooltipTrigger>
                <TooltipContent>Duplicate</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {canDelete && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ActionTile
                    variant="destructive"
                    appearance="filled"
                    size="xs"
                    onClick={() => onDelete(entry)}
                    aria-label={`Delete ${entry.value}`}
                  >
                    <Trash2 className="size-4" />
                  </ActionTile>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}
    </div>
  )
}

DictionaryEntryCard.displayName = 'DictionaryEntryCard'

export default DictionaryEntryCard
