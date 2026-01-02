/**
 * FormStructureTree - Hierarchical view of form fields
 *
 * Displays all fields in the form with icons and drag handles.
 * Clicking a field selects it for editing in the properties tab.
 *
 * @component ATOM
 */

import * as React from 'react';
import { ChevronRight, GripVertical, FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFormBuilder } from '../../context';
import { getOrderedFields } from '../../utils/schema-utils';
import { FIELD_BLUEPRINTS } from '../../constants';
import { CATEGORY_COLORS, type FieldCategory, type SchemaProperty } from '../../types';

// =============================================================================
// TYPES
// =============================================================================

export interface FormStructureTreeProps {
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function FormStructureTree({ className }: FormStructureTreeProps) {
  const { schema, selectedFieldPath, selectField } = useFormBuilder();
  const orderedFields = getOrderedFields(schema);

  if (orderedFields.length === 0) {
    return (
      <div className={cn('p-4 text-center', className)}>
        <div className="flex justify-center mb-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted-bg">
            <FileQuestion className="size-5 text-secondary" />
          </div>
        </div>
        <p className="text-sm text-secondary">
          No fields added yet
        </p>
        <p className="text-xs text-secondary/70 mt-1">
          Drag fields from the Component Library
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-1', className)}>
      <p className="text-xs font-medium text-secondary mb-2 px-1">
        Form Structure ({orderedFields.length} fields)
      </p>
      {orderedFields.map(([fieldKey, field]) => {
        const isSelected =
          selectedFieldPath?.[0] === 'properties' &&
          selectedFieldPath?.[1] === fieldKey;

        return (
          <TreeNode
            key={fieldKey}
            fieldKey={fieldKey}
            field={field}
            isSelected={isSelected}
            onSelect={() => selectField(['properties', fieldKey])}
          />
        );
      })}
    </div>
  );
}

FormStructureTree.displayName = 'FormStructureTree';

// =============================================================================
// TREE NODE
// =============================================================================

interface TreeNodeProps {
  fieldKey: string;
  field: SchemaProperty;
  isSelected: boolean;
  onSelect: () => void;
}

function TreeNode({ fieldKey, field, isSelected, onSelect }: TreeNodeProps) {
  const component = field['x-component'] || 'Input';
  const title = field.title || fieldKey;

  // Find blueprint by x-component
  const blueprint = FIELD_BLUEPRINTS.find(
    (b) => b.defaultSchema['x-component'] === component
  );

  const Icon = blueprint?.icon;
  const category = blueprint?.category as FieldCategory | undefined;
  const colors = category ? CATEGORY_COLORS[category] : null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onSelect}
          data-slot="tree-node"
          className={cn(
            'w-full flex items-center gap-2 px-2 py-2 rounded-lg',
            'text-left text-sm',
            'transition-all duration-150',
            // Selection state
            isSelected
              ? 'bg-accent/10 text-accent border border-accent/30'
              : 'hover:bg-surface/50 text-primary border border-transparent',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
          )}
        >
          {/* Drag handle */}
          <GripVertical
            className={cn(
              'size-3.5 flex-shrink-0 cursor-grab',
              isSelected ? 'text-accent/60' : 'text-secondary/40'
            )}
          />

          {/* Icon with category color */}
          {Icon && colors ? (
            <div
              className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded',
                colors.iconBg
              )}
            >
              <Icon className={cn('size-3.5', colors.text)} />
            </div>
          ) : (
            <div className="flex size-6 shrink-0 items-center justify-center rounded bg-muted-bg">
              <FileQuestion className="size-3.5 text-secondary" />
            </div>
          )}

          {/* Field title */}
          <span className="truncate flex-1 font-medium">{title}</span>

          {/* Required indicator */}
          {field.required && (
            <span className="text-xs text-error flex-shrink-0">*</span>
          )}

          {/* Arrow */}
          <ChevronRight
            className={cn(
              'size-4 flex-shrink-0 transition-transform',
              isSelected ? 'text-accent rotate-90' : 'text-secondary/50'
            )}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p className="font-medium">{title}</p>
        <p className="text-xs text-secondary">
          {blueprint?.name || component}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}

export default FormStructureTree;
