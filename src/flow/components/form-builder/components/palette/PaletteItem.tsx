/**
 * PaletteItem - Draggable field type item in the component palette
 *
 * Displays a single field blueprint with icon, name, and description.
 * Uses DDS category colors for visual organization.
 *
 * @component ATOM
 */

import * as React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CATEGORY_COLORS, type FieldCategory } from '../../types';
import type { FieldBlueprint } from '../../constants';

// =============================================================================
// COLOR MAPPING
// =============================================================================

/**
 * Maps category to DDS color classes using CSS variables
 * for proper light/dark mode support
 */
const PALETTE_ITEM_COLORS: Record<
  FieldCategory,
  {
    iconBg: string;
    iconText: string;
    hoverBg: string;
  }
> = {
  // Harbor/Green for Basic Form Fields
  form: {
    iconBg: 'bg-[var(--brand-harbor-100)] dark:bg-[var(--brand-harbor-900)]',
    iconText: 'text-[var(--brand-harbor-600)] dark:text-[var(--brand-harbor-300)]',
    hoverBg: 'hover:bg-[var(--brand-harbor-50)]/50 dark:hover:bg-[var(--brand-harbor-900)]/20',
  },
  // Orange for Business Entities
  data: {
    iconBg: 'bg-[var(--brand-orange-100)] dark:bg-[var(--brand-orange-900)]',
    iconText: 'text-[var(--brand-orange-600)] dark:text-[var(--brand-orange-300)]',
    hoverBg: 'hover:bg-[var(--brand-orange-50)]/50 dark:hover:bg-[var(--brand-orange-900)]/20',
  },
  // Coral/Red for Dictionary & References
  dictionary: {
    iconBg: 'bg-[var(--brand-coral-100)] dark:bg-[var(--brand-coral-900)]',
    iconText: 'text-[var(--brand-coral-500)] dark:text-[var(--brand-coral-300)]',
    hoverBg: 'hover:bg-[var(--brand-coral-50)]/50 dark:hover:bg-[var(--brand-coral-900)]/20',
  },
};

// =============================================================================
// TYPES
// =============================================================================

export interface PaletteItemProps {
  /** Field blueprint data */
  blueprint: FieldBlueprint;
  /** Whether in compact mode (icon only with tooltip) */
  isCompact?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function PaletteItem({
  blueprint,
  isCompact = false,
  className,
}: PaletteItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${blueprint.key}`,
    data: { blueprint },
  });

  const Icon = blueprint.icon;
  const colors = PALETTE_ITEM_COLORS[blueprint.category];

  // Compact mode - icon only with tooltip
  if (isCompact) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            ref={setNodeRef}
            type="button"
            {...listeners}
            {...attributes}
            aria-label={blueprint.name}
            data-slot="palette-item"
            className={cn(
              // Base
              'flex items-center justify-center p-2 rounded-lg',
              'transition-all duration-150',
              'cursor-grab active:cursor-grabbing',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              // Hover
              colors.hoverBg,
              // Dragging
              isDragging && 'opacity-50 scale-95',
              className
            )}
          >
            <div
              className={cn(
                'flex size-8 items-center justify-center rounded-md',
                colors.iconBg
              )}
            >
              <Icon className={cn('size-4', colors.iconText)} />
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <p className="font-medium">{blueprint.name}</p>
          <p className="text-xs text-secondary">{blueprint.description}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  // Full mode
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          ref={setNodeRef}
          type="button"
          {...listeners}
          {...attributes}
          data-slot="palette-item"
          className={cn(
            // Base - Depth 4 surface (most transparent)
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg',
            'text-sm text-left',
            'bg-white/5 dark:bg-black/5',
            'border border-transparent',
            'transition-all duration-150',
            'cursor-grab active:cursor-grabbing',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            // Hover - subtle background
            colors.hoverBg,
            'hover:border-default',
            // Dragging
            isDragging && 'opacity-50 scale-95',
            className
          )}
        >
          {/* Icon with category color */}
          <div
            className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-md',
              colors.iconBg
            )}
          >
            <Icon className={cn('size-4', colors.iconText)} />
          </div>

          {/* Name */}
          <span className="truncate font-medium text-primary">
            {blueprint.name}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-xs">
        <p>{blueprint.description}</p>
      </TooltipContent>
    </Tooltip>
  );
}

PaletteItem.displayName = 'PaletteItem';

// =============================================================================
// OVERLAY (shown while dragging)
// =============================================================================

export interface PaletteItemOverlayProps {
  blueprint: FieldBlueprint;
}

export function PaletteItemOverlay({ blueprint }: PaletteItemOverlayProps) {
  const Icon = blueprint.icon;
  const colors = PALETTE_ITEM_COLORS[blueprint.category];

  return (
    <div
      data-slot="palette-item-overlay"
      className={cn(
        // Elevated card appearance (Depth 1)
        'flex items-center gap-3 px-3 py-2.5 rounded-lg',
        'text-sm',
        'bg-white/60 dark:bg-black/60 backdrop-blur-[8px]',
        'border-2 border-accent',
        'shadow-lg',
        'cursor-grabbing'
      )}
    >
      {/* Icon with category color */}
      <div
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-md',
          colors.iconBg
        )}
      >
        <Icon className={cn('size-4', colors.iconText)} />
      </div>

      {/* Name */}
      <span className="font-medium text-primary">{blueprint.name}</span>
    </div>
  );
}

PaletteItemOverlay.displayName = 'PaletteItemOverlay';
