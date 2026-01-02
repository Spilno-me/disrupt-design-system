/**
 * EmptyState - Shown when the form canvas has no fields
 *
 * Visual placeholder encouraging users to drag fields from the palette.
 *
 * @component ATOM
 */

import * as React from 'react';
import { MousePointerClick, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export interface EmptyStateProps {
  /** Whether a draggable item is currently over the drop zone */
  isOver?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function EmptyState({ isOver }: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        'flex flex-col items-center justify-center',
        'min-h-[400px] p-8',
        // Dashed border container
        'border-2 border-dashed rounded-xl',
        'transition-all duration-200',
        // State-based styling
        isOver
          ? 'border-accent bg-accent/10 scale-[1.01]'
          : 'border-default bg-surface/30'
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex items-center justify-center',
          'size-14 rounded-2xl mb-4',
          'transition-all duration-200',
          isOver
            ? 'bg-accent/20 text-accent scale-110'
            : 'bg-muted-bg text-secondary'
        )}
      >
        {isOver ? (
          <Sparkles className="size-7" />
        ) : (
          <MousePointerClick className="size-7" />
        )}
      </div>

      {/* Title */}
      <h3
        className={cn(
          'text-lg font-semibold mb-1 transition-colors',
          isOver ? 'text-accent' : 'text-primary'
        )}
      >
        {isOver ? 'Drop to add field' : 'No fields yet'}
      </h3>

      {/* Description */}
      <p className="text-sm text-secondary text-center max-w-xs">
        {isOver
          ? 'Release to add this field to your form'
          : 'Drag fields from the Component Library to start building your form'}
      </p>

      {/* Decorative dots (only when not dragging over) */}
      {!isOver && (
        <div className="flex gap-1.5 mt-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="size-1.5 rounded-full bg-secondary/30"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

EmptyState.displayName = 'EmptyState';

export default EmptyState;
