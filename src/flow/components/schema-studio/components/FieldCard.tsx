/**
 * FieldCard - Visual representation of a schema field
 *
 * Displays field information with type icon, title, badges,
 * and action buttons. Supports selection, drag handles,
 * and responsive layout.
 *
 * @component MOLECULE
 * @testId Auto-generated: field-card-{key}, field-card-required-{key},
 *         field-card-edit-{key}, field-card-delete-{key}
 */

import * as React from 'react'
import {
  GripVertical,
  Pencil,
  Trash2,
  Asterisk,
  Type,
  Hash,
  ToggleLeft,
  List,
  Box,
  Calendar,
  Mail,
  Link,
  Phone,
  Lock,
  FileText,
  ChevronRight,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'
import {
  ActionSheet,
  ActionSheetTrigger,
  ActionSheetContent,
  ActionSheetItem,
  ActionSheetLabel,
} from '../../../../components/ui/ActionSheet'
import type { FieldCardProps, SchemaFieldType, UIWidget } from '../types'

// =============================================================================
// TYPE ICON MAP
// =============================================================================

const TYPE_ICONS: Record<SchemaFieldType, React.ElementType> = {
  string: Type,
  number: Hash,
  integer: Hash,
  boolean: ToggleLeft,
  array: List,
  object: Box,
}

const WIDGET_ICONS: Partial<Record<UIWidget, React.ElementType>> = {
  date: Calendar,
  datetime: Calendar,
  email: Mail,
  url: Link,
  tel: Phone,
  password: Lock,
  textarea: FileText,
  file: FileText,
}

// =============================================================================
// TYPE BADGE VARIANTS
// =============================================================================

const TYPE_BADGE_VARIANTS: Record<SchemaFieldType, 'default' | 'secondary' | 'outline'> = {
  string: 'default',
  number: 'secondary',
  integer: 'secondary',
  boolean: 'outline',
  array: 'outline',
  object: 'outline',
}

// =============================================================================
// COMPONENT
// =============================================================================

export function FieldCard({
  field,
  isSelected = false,
  isDragging = false,
  onClick,
  onEdit,
  onDelete,
  onToggleRequired,
  className,
}: FieldCardProps) {
  // Get appropriate icon based on widget or type
  const widget = field['ui:widget']
  const IconComponent = (widget && WIDGET_ICONS[widget]) || TYPE_ICONS[field.type]

  // Display title (fallback to key)
  const displayTitle = field.title || field.key

  // Format type display
  const typeDisplay = field.type === 'string' && widget ? widget : field.type

  return (
    <div
      className={cn(
        // Base styles - elevated card with shadow (no border to avoid clipping)
        'group relative flex items-center gap-2 px-3 py-2',
        'bg-elevated border border-transparent rounded-lg shadow-md',
        'transition-all duration-150',
        // Hover state - show border instead of more shadow
        'hover:border-accent/50 hover:bg-elevated',
        // Selected state
        isSelected && 'border-accent bg-accent/5 ring-1 ring-accent/20',
        // Dragging state
        isDragging && 'opacity-50 shadow-lg scale-[1.02]',
        // Clickable
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
      data-testid={`field-card-${field.key}`}
    >
      {/* Drag Handle */}
      <div
        className={cn(
          'flex-shrink-0 cursor-grab active:cursor-grabbing',
          'text-tertiary hover:text-secondary',
          'touch-none select-none'
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <GripVertical className="size-4" />
      </div>

      {/* Type Icon */}
      <div
        className={cn(
          'flex-shrink-0 size-7 rounded-md',
          'flex items-center justify-center',
          'bg-muted-bg text-secondary',
          isSelected && 'bg-accent/10 text-accent'
        )}
      >
        <IconComponent className="size-3.5" />
      </div>

      {/* Field Info */}
      <div className="flex-1 min-w-0">
        {/* Title Row */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'font-medium text-primary truncate',
              isSelected && 'text-accent'
            )}
          >
            {displayTitle}
          </span>

          {/* Required Indicator */}
          {field.isRequired && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Asterisk className="size-3 text-error flex-shrink-0" />
              </TooltipTrigger>
              <TooltipContent>Required field</TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Meta Row */}
        <div className="flex items-center gap-2 mt-0.5">
          {/* Type Badge */}
          <Badge
            variant={TYPE_BADGE_VARIANTS[field.type]}
            size="sm"
            className="capitalize"
          >
            {typeDisplay}
          </Badge>

          {/* Key (if different from title) */}
          {field.title && field.title !== field.key && (
            <span className="text-xs text-tertiary font-mono truncate">
              {field.key}
            </span>
          )}

          {/* Description preview */}
          {field.description && (
            <span className="text-xs text-tertiary truncate hidden sm:inline">
              {field.description}
            </span>
          )}
        </div>
      </div>

      {/* Actions - Always Visible */}
      <div
        className={cn(
          'flex-shrink-0 items-center gap-1',
          'hidden sm:flex'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toggle Required */}
        {onToggleRequired && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onToggleRequired}
                className={cn(
                  'size-7 p-0',
                  field.isRequired && 'text-error hover:text-error'
                )}
                data-testid={`field-card-required-${field.key}`}
              >
                <Asterisk className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {field.isRequired ? 'Make optional' : 'Make required'}
            </TooltipContent>
          </Tooltip>
        )}

        {/* Edit */}
        {onEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="size-7 p-0"
                data-testid={`field-card-edit-${field.key}`}
              >
                <Pencil className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit field</TooltipContent>
          </Tooltip>
        )}

        {/* Delete with ActionSheet confirmation */}
        {onDelete && (
          <ActionSheet>
            <Tooltip>
              <TooltipTrigger asChild>
                <ActionSheetTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="size-7 p-0 text-error hover:text-error hover:bg-error/10"
                    data-testid={`field-card-delete-${field.key}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </ActionSheetTrigger>
              </TooltipTrigger>
              <TooltipContent>Delete field</TooltipContent>
            </Tooltip>
            <ActionSheetContent align="end">
              <ActionSheetLabel>Delete "{displayTitle}"?</ActionSheetLabel>
              <ActionSheetItem
                variant="destructive"
                icon={<Trash2 className="size-4" />}
                onSelect={onDelete}
              >
                Delete Field
              </ActionSheetItem>
            </ActionSheetContent>
          </ActionSheet>
        )}
      </div>

      {/* Chevron - Mobile (indicates tappable) */}
      <ChevronRight
        className={cn(
          'size-4 text-tertiary flex-shrink-0',
          'sm:hidden', // Only show on mobile
          isSelected && 'text-accent'
        )}
      />
    </div>
  )
}

// =============================================================================
// SKELETON VARIANT
// =============================================================================

export function FieldCardSkeleton() {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-elevated rounded-lg shadow-md animate-pulse">
      {/* Drag handle placeholder */}
      <div className="w-4 h-4 bg-muted-bg rounded" />

      {/* Icon placeholder */}
      <div className="size-7 bg-muted-bg rounded-md" />

      {/* Content placeholder */}
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 bg-muted-bg rounded w-1/3" />
        <div className="h-3 bg-muted-bg rounded w-1/4" />
      </div>
    </div>
  )
}

// =============================================================================
// COMPACT VARIANT (for dense lists)
// =============================================================================

export function FieldCardCompact({
  field,
  isSelected = false,
  onClick,
  className,
}: Pick<FieldCardProps, 'field' | 'isSelected' | 'onClick' | 'className'>) {
  const widget = field['ui:widget']
  const IconComponent = (widget && WIDGET_ICONS[widget]) || TYPE_ICONS[field.type]
  const displayTitle = field.title || field.key

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2',
        'hover:bg-muted-bg rounded-md cursor-pointer',
        'transition-colors duration-100',
        isSelected && 'bg-accent/10 text-accent',
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <IconComponent className="size-3.5 text-tertiary flex-shrink-0" />
      <span className="text-sm truncate flex-1">{displayTitle}</span>
      {field.isRequired && (
        <Asterisk className="size-3 text-error flex-shrink-0" />
      )}
    </div>
  )
}

export default FieldCard
