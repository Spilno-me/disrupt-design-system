/**
 * FormCanvas - Center panel for Live Preview
 *
 * Drop zone for fields with sortable functionality.
 * Displays real-time form preview with field selection.
 *
 * @component MOLECULE
 */

import * as React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFormBuilder } from '../../context';
import { getOrderedFields } from '../../utils/schema-utils';
import { CanvasField } from './CanvasField';
import { EmptyState } from './EmptyState';

// =============================================================================
// TYPES
// =============================================================================

export interface FormCanvasProps {
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function FormCanvas({ className }: FormCanvasProps) {
  const {
    schema,
    selectedFieldPath,
    selectField,
    deleteField,
  } = useFormBuilder();

  const { setNodeRef, isOver } = useDroppable({
    id: 'form-canvas',
  });

  const orderedFields = getOrderedFields(schema);
  const hasFields = orderedFields.length > 0;

  const handleFieldSelect = (fieldKey: string) => {
    selectField(['properties', fieldKey]);
  };

  const handleFieldDelete = (fieldKey: string) => {
    deleteField(['properties', fieldKey]);
  };

  const handleCanvasClick = () => {
    selectField(null);
  };

  return (
    <section
      data-slot="form-canvas"
      data-testid="form-canvas"
      className={cn(
        // Glass panel (Depth 2)
        'flex flex-col flex-1 rounded-xl',
        'bg-white/40 dark:bg-black/40 backdrop-blur-[4px]',
        'border-2 border-accent shadow-md',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-default px-4 py-3">
        {/* Icon */}
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted-bg">
          <FileText className="size-5 text-accent" />
        </div>

        {/* Title & Count */}
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-primary">
            Live Preview
          </h2>
          <p className="text-xs text-secondary">
            {hasFields
              ? `${orderedFields.length} field${orderedFields.length !== 1 ? 's' : ''}`
              : 'Drop fields here to build form'}
          </p>
        </div>
      </div>

      {/* Canvas Content */}
      <ScrollArea className="flex-1">
        <div
          ref={setNodeRef}
          className={cn(
            'min-h-full p-4 md:p-6',
            'transition-colors duration-200',
            isOver && !hasFields && 'bg-accent/5'
          )}
          onClick={handleCanvasClick}
        >
          {hasFields ? (
            <SortableContext
              items={orderedFields.map(([key]) => key)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3 max-w-2xl mx-auto">
                {orderedFields.map(([fieldKey, field]) => {
                  const isSelected =
                    selectedFieldPath?.[0] === 'properties' &&
                    selectedFieldPath?.[1] === fieldKey;

                  return (
                    <CanvasField
                      key={fieldKey}
                      fieldKey={fieldKey}
                      field={field}
                      isSelected={isSelected}
                      onSelect={() => handleFieldSelect(fieldKey)}
                      onDelete={() => handleFieldDelete(fieldKey)}
                    />
                  );
                })}

                {/* Drop zone at end when dragging over */}
                {isOver && (
                  <div
                    className={cn(
                      'h-16 border-2 border-dashed rounded-lg',
                      'border-accent bg-accent/10',
                      'flex items-center justify-center'
                    )}
                  >
                    <span className="text-sm text-accent font-medium">
                      Drop here to add
                    </span>
                  </div>
                )}
              </div>
            </SortableContext>
          ) : (
            <EmptyState isOver={isOver} />
          )}
        </div>
      </ScrollArea>
    </section>
  );
}

FormCanvas.displayName = 'FormCanvas';

export default FormCanvas;
