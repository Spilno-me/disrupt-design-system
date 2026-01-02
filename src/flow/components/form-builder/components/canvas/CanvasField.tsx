/**
 * CanvasField - Renders a single field on the form canvas
 *
 * Displays field preview with selection, drag handle, and delete action.
 * Uses DDS glass styling for elevated appearance.
 *
 * @component ATOM
 */

import * as React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { SchemaProperty } from '../../types';

// =============================================================================
// TYPES
// =============================================================================

export interface CanvasFieldProps {
  /** Field name/key */
  fieldKey: string;
  /** Field schema definition */
  field: SchemaProperty;
  /** Whether field is currently selected */
  isSelected: boolean;
  /** Called when field is selected */
  onSelect: () => void;
  /** Called when field should be deleted */
  onDelete: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CanvasField({
  fieldKey,
  field,
  isSelected,
  onSelect,
  onDelete,
}: CanvasFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: fieldKey });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-slot="canvas-field"
      className={cn(
        'group relative',
        // Glass card (Depth 3 - surface)
        'bg-white/20 dark:bg-black/20 backdrop-blur-[2px]',
        'rounded-lg border transition-all duration-150',
        // Selection states
        isSelected
          ? 'border-2 border-accent ring-2 ring-accent/20 shadow-md'
          : 'border border-default hover:border-accent/50 hover:shadow-sm',
        // Dragging
        isDragging && 'opacity-50 shadow-lg scale-[1.02]'
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Drag Handle - appears on left */}
      <div className="absolute -left-px top-0 bottom-0 flex flex-col justify-center py-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              {...attributes}
              {...listeners}
              className={cn(
                'flex items-center justify-center',
                'size-6 -ml-3',
                'rounded bg-surface border border-default',
                'text-secondary hover:text-primary',
                'cursor-grab active:cursor-grabbing',
                'opacity-0 group-hover:opacity-100 transition-opacity',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                isSelected && 'opacity-100'
              )}
            >
              <GripVertical className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">Drag to reorder</TooltipContent>
        </Tooltip>
      </div>

      {/* Delete Button - appears on right */}
      <div className="absolute -right-px top-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'size-6 -mr-3',
                'rounded bg-surface border border-default',
                'text-secondary hover:text-error hover:bg-error/10',
                'opacity-0 group-hover:opacity-100 transition-opacity',
                isSelected && 'opacity-100'
              )}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Delete field</TooltipContent>
        </Tooltip>
      </div>

      {/* Field Preview */}
      <div className="p-4">
        <FieldPreview fieldKey={fieldKey} field={field} />
      </div>
    </div>
  );
}

CanvasField.displayName = 'CanvasField';

// =============================================================================
// FIELD PREVIEW - Renders preview based on field type
// =============================================================================

interface FieldPreviewProps {
  fieldKey: string;
  field: SchemaProperty;
}

function FieldPreview({ fieldKey, field }: FieldPreviewProps) {
  const component = field['x-component'];
  const title = field.title || fieldKey;
  const required = field.required;

  // Label for field
  const fieldLabel = (
    <Label className="text-sm font-medium text-primary">
      {title}
      {required && <span className="text-error ml-1">*</span>}
    </Label>
  );

  // Render based on component type
  switch (component) {
    case 'FormText':
      return (
        <p className="text-sm text-secondary">
          {(field['x-component-props']?.content as string) || 'Static text'}
        </p>
      );

    case 'Input':
      return (
        <div className="space-y-1.5">
          {fieldLabel}
          <Input
            placeholder="Text input"
            disabled
            className="bg-surface/50"
          />
        </div>
      );

    case 'TextArea':
      return (
        <div className="space-y-1.5">
          {fieldLabel}
          <Textarea
            placeholder="Multi-line text"
            disabled
            rows={3}
            className="bg-surface/50 resize-none"
          />
        </div>
      );

    case 'NumberPicker':
      return (
        <div className="space-y-1.5">
          {fieldLabel}
          <Input
            type="number"
            placeholder="0"
            disabled
            className="bg-surface/50"
          />
        </div>
      );

    case 'Select':
    case 'DictionarySelect':
    case 'LocationSelect':
    case 'UserSelect':
    case 'UserMultiSelect':
    case 'RoleFilteredUserSelect':
    case 'AssetSelect':
    case 'VehicleSelect':
    case 'GenericEntitySelect':
      return (
        <div className="space-y-1.5">
          {fieldLabel}
          <Select disabled>
            <SelectTrigger className="bg-surface/50">
              <SelectValue placeholder="Select option..." />
            </SelectTrigger>
            <SelectContent>
              {field.enum?.map((opt, i) => (
                <SelectItem key={i} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              )) || <SelectItem value="option">Option</SelectItem>}
            </SelectContent>
          </Select>
        </div>
      );

    case 'RadioGroup':
      return (
        <div className="space-y-2">
          {fieldLabel}
          <div className="space-y-1.5">
            {(
              field.enum || [
                { label: 'Option A', value: 'a' },
                { label: 'Option B', value: 'b' },
              ]
            ).map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="size-4 rounded-full border border-default bg-surface/50" />
                <span className="text-sm text-secondary">{opt.label}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'Checkbox':
      return (
        <div className="flex items-center gap-2">
          <Checkbox disabled className="bg-surface/50" />
          <Label className="text-sm text-primary">{title}</Label>
        </div>
      );

    case 'DatePicker':
      return (
        <div className="space-y-1.5">
          {fieldLabel}
          <Input
            type="text"
            placeholder="Select date..."
            disabled
            className="bg-surface/50"
          />
        </div>
      );

    case 'Upload':
      return (
        <div className="space-y-1.5">
          {fieldLabel}
          <div
            className={cn(
              'border-2 border-dashed border-default rounded-lg',
              'p-4 text-center bg-surface/30'
            )}
          >
            <p className="text-sm text-secondary">Click or drag to upload</p>
          </div>
        </div>
      );

    default:
      return (
        <div className="space-y-1.5">
          {fieldLabel}
          <Input
            placeholder={component || 'Field'}
            disabled
            className="bg-surface/50"
          />
        </div>
      );
  }
}

export default CanvasField;
