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
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, ChevronDown, ChevronRight, Plus, Layers, Repeat2, Calculator } from 'lucide-react';
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
  /** Full path to the field (e.g., ['properties', 'section', 'properties', 'field']) */
  fieldPath: string[];
  /** Field schema definition */
  field: SchemaProperty;
  /** Whether field is currently selected */
  isSelected: boolean;
  /** Called when field is selected with its path */
  onSelect: (path: string[]) => void;
  /** Called when field should be deleted with its path */
  onDelete: (path: string[]) => void;
  /** Currently selected field path for checking nested selection */
  selectedFieldPath: string[] | null;
  /** Whether preview mode is active - hides editing controls */
  previewMode?: boolean;
  /** Nesting depth for visual indication */
  depth?: number;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CanvasField({
  fieldKey,
  fieldPath,
  field,
  isSelected,
  onSelect,
  onDelete,
  selectedFieldPath,
  previewMode = false,
  depth = 0,
}: CanvasFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: fieldPath.join('.'), disabled: previewMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-slot="canvas-field"
      data-preview-mode={previewMode}
      className={cn(
        'group relative',
        // Glass card (Depth 3 - surface)
        'bg-white/20 dark:bg-black/20 backdrop-blur-[2px]',
        'rounded-lg border transition-all duration-150',
        // Preview mode - clean styling without selection indicators
        previewMode
          ? 'border border-default cursor-default'
          : cn(
              // Selection states (only when not in preview mode)
              isSelected
                ? 'border-2 border-accent ring-2 ring-accent/20 shadow-md'
                : 'border border-default hover:border-accent/50 hover:shadow-sm',
              // Dragging
              isDragging && 'opacity-50 shadow-lg scale-[1.02]'
            )
      )}
      onClick={(e) => {
        if (previewMode) return; // Disable selection in preview mode
        e.stopPropagation();
        onSelect(fieldPath);
      }}
    >
      {/* Drag Handle - appears on left (hidden in preview mode) */}
      {!previewMode && (
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
      )}

      {/* Delete Button - appears on right (hidden in preview mode) */}
      {!previewMode && (
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
                  onDelete(fieldPath);
                }}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Delete field</TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Field Preview */}
      <div className="p-4">
        <FieldPreview
          fieldKey={fieldKey}
          fieldPath={fieldPath}
          field={field}
          onSelect={onSelect}
          onDelete={onDelete}
          selectedFieldPath={selectedFieldPath}
          previewMode={previewMode}
          depth={depth}
        />
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
  fieldPath: string[];
  field: SchemaProperty;
  onSelect: (path: string[]) => void;
  onDelete: (path: string[]) => void;
  selectedFieldPath: string[] | null;
  previewMode?: boolean;
  depth: number;
}

function FieldPreview({
  fieldKey,
  fieldPath,
  field,
  onSelect,
  onDelete,
  selectedFieldPath,
  previewMode,
  depth,
}: FieldPreviewProps) {
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

    case 'CalculatedField':
      return (
        <CalculatedFieldPreview title={title} field={field} />
      );

    // Layout & Structure Components
    case 'FormSection':
      return (
        <SectionPreview
          title={title}
          field={field}
          fieldPath={fieldPath}
          onSelect={onSelect}
          onDelete={onDelete}
          selectedFieldPath={selectedFieldPath}
          previewMode={previewMode}
          depth={depth}
        />
      );

    case 'ArrayField':
      return (
        <ArrayFieldPreview
          title={title}
          field={field}
          fieldPath={fieldPath}
          onSelect={onSelect}
          onDelete={onDelete}
          selectedFieldPath={selectedFieldPath}
          previewMode={previewMode}
          depth={depth}
        />
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

// =============================================================================
// NESTED CANVAS FIELD - Sortable field card for nested contexts
// =============================================================================

interface NestedCanvasFieldProps {
  fieldKey: string;
  fieldPath: string[];
  field: SchemaProperty;
  isSelected: boolean;
  onSelect: (path: string[]) => void;
  onDelete: (path: string[]) => void;
  selectedFieldPath: string[] | null;
  previewMode?: boolean;
  depth: number;
}

function NestedCanvasField({
  fieldKey,
  fieldPath,
  field,
  isSelected,
  onSelect,
  onDelete,
  selectedFieldPath,
  previewMode = false,
  depth,
}: NestedCanvasFieldProps) {
  const sortableId = fieldPath.join('.');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sortableId, disabled: previewMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-slot="nested-canvas-field"
      className={cn(
        'group relative',
        // Glass card styling
        'bg-white/30 dark:bg-black/20 backdrop-blur-[1px]',
        'rounded-lg border transition-all duration-150',
        // Preview mode - simple styling
        previewMode
          ? 'border border-default cursor-default'
          : cn(
              // Selection states
              isSelected
                ? 'border-2 border-accent ring-2 ring-accent/20 shadow-sm'
                : 'border border-default hover:border-accent/50 hover:shadow-sm',
              // Dragging
              isDragging && 'opacity-50 shadow-lg scale-[1.02]'
            )
      )}
      onClick={(e) => {
        if (previewMode) return;
        e.stopPropagation();
        onSelect(fieldPath);
      }}
    >
      {/* Drag Handle for nested field */}
      {!previewMode && (
        <div className="absolute -left-1 top-1/2 -translate-y-1/2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                {...attributes}
                {...listeners}
                className={cn(
                  'flex items-center justify-center',
                  'size-5',
                  'rounded-full bg-surface border border-default',
                  'text-secondary hover:text-primary',
                  'cursor-grab active:cursor-grabbing',
                  'opacity-0 group-hover:opacity-100 transition-opacity',
                  isSelected && 'opacity-100'
                )}
              >
                <GripVertical className="size-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Drag to reorder</TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Delete Button for nested field */}
      {!previewMode && (
        <div className="absolute -right-1 -top-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'size-5',
                  'rounded-full bg-surface border border-default',
                  'text-secondary hover:text-error hover:bg-error/10',
                  'opacity-0 group-hover:opacity-100 transition-opacity',
                  isSelected && 'opacity-100'
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(fieldPath);
                }}
              >
                <Trash2 className="size-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Delete field</TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Field Preview */}
      <div className="p-3">
        <FieldPreview
          fieldKey={fieldKey}
          fieldPath={fieldPath}
          field={field}
          onSelect={onSelect}
          onDelete={onDelete}
          selectedFieldPath={selectedFieldPath}
          previewMode={previewMode}
          depth={depth}
        />
      </div>
    </div>
  );
}

// =============================================================================
// SECTION PREVIEW - Collapsible section with nested fields
// =============================================================================

interface SectionPreviewProps {
  title: string;
  field: SchemaProperty;
  fieldPath: string[];
  onSelect: (path: string[]) => void;
  onDelete: (path: string[]) => void;
  selectedFieldPath: string[] | null;
  previewMode?: boolean;
  depth: number;
}

function SectionPreview({
  title,
  field,
  fieldPath,
  onSelect,
  onDelete,
  selectedFieldPath,
  previewMode,
  depth,
}: SectionPreviewProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(
    field['x-component-props']?.defaultCollapsed || false
  );
  const collapsible = field['x-component-props']?.collapsible !== false;

  // Droppable zone ID for this section
  const droppableId = `section:${fieldPath.join('.')}`;
  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
    disabled: previewMode,
  });

  // Get ordered nested fields
  const nestedFields = React.useMemo(() => {
    const properties = field.properties || {};
    return Object.entries(properties).sort((a, b) => {
      const indexA = a[1]['x-index'] ?? 999;
      const indexB = b[1]['x-index'] ?? 999;
      return indexA - indexB;
    });
  }, [field.properties]);

  // Sortable IDs for nested fields
  const sortableIds = React.useMemo(() => {
    return nestedFields.map(([nestedKey]) => [...fieldPath, 'properties', nestedKey].join('.'));
  }, [nestedFields, fieldPath]);

  const childCount = nestedFields.length;

  return (
    <div className="space-y-2">
      {/* Section Header */}
      <div
        className={cn(
          'flex items-center gap-2 p-2 -m-2 rounded-lg',
          'bg-accent/5 border border-accent/20',
          collapsible && 'cursor-pointer hover:bg-accent/10'
        )}
        onClick={(e) => {
          e.stopPropagation();
          if (collapsible) setIsCollapsed(!isCollapsed);
        }}
      >
        {/* Collapse Toggle */}
        {collapsible && (
          <Button variant="ghost" size="icon" className="size-6 shrink-0">
            {isCollapsed ? (
              <ChevronRight className="size-4 text-accent" />
            ) : (
              <ChevronDown className="size-4 text-accent" />
            )}
          </Button>
        )}

        {/* Section Icon */}
        <Layers className="size-4 text-accent shrink-0" />

        {/* Section Title */}
        <span className="text-sm font-semibold text-primary flex-1">
          {title}
        </span>

        {/* Field Count */}
        <span className="text-xs text-secondary bg-surface/50 px-2 py-0.5 rounded-full">
          {childCount} field{childCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Section Content - Droppable zone with nested fields */}
      {!isCollapsed && (
        <div
          ref={setNodeRef}
          className={cn(
            'ml-4 pl-3 border-l-2 border-accent/30 space-y-2 min-h-[48px]',
            'transition-colors duration-200',
            isOver && 'bg-accent/10 border-accent'
          )}
        >
          <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
            {childCount > 0 ? (
              nestedFields.map(([nestedKey, nestedField]) => {
                const nestedPath = [...fieldPath, 'properties', nestedKey];
                const isNestedSelected =
                  selectedFieldPath?.join('.') === nestedPath.join('.');

                return (
                  <NestedCanvasField
                    key={nestedKey}
                    fieldKey={nestedKey}
                    fieldPath={nestedPath}
                    field={nestedField}
                    isSelected={isNestedSelected}
                    onSelect={onSelect}
                    onDelete={onDelete}
                    selectedFieldPath={selectedFieldPath}
                    previewMode={previewMode}
                    depth={depth + 1}
                  />
                );
              })
            ) : (
              <div className={cn(
                'min-h-[48px] flex items-center justify-center text-xs italic rounded-lg',
                'border-2 border-dashed',
                isOver
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-default text-muted'
              )}>
                {isOver ? 'Drop here to add' : 'Drop fields here to add to section'}
              </div>
            )}
          </SortableContext>

          {/* Drop indicator when dragging over */}
          {isOver && childCount > 0 && (
            <div className="h-12 border-2 border-dashed border-accent bg-accent/10 rounded-lg flex items-center justify-center">
              <span className="text-xs text-accent font-medium">Drop here to add</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// ARRAY FIELD PREVIEW - Repeating section with template fields
// =============================================================================

interface ArrayFieldPreviewProps {
  title: string;
  field: SchemaProperty;
  fieldPath: string[];
  onSelect: (path: string[]) => void;
  onDelete: (path: string[]) => void;
  selectedFieldPath: string[] | null;
  previewMode?: boolean;
  depth: number;
}

function ArrayFieldPreview({
  title,
  field,
  fieldPath,
  onSelect,
  onDelete,
  selectedFieldPath,
  previewMode,
  depth,
}: ArrayFieldPreviewProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const componentProps = field['x-component-props'] || {};
  const minItems = Number(componentProps.minItems) || 0;
  const maxItems = Number(componentProps.maxItems) || 10;
  const addButtonText = String(componentProps.addButtonText || 'Add Entry');

  // Get ordered template fields from items.properties
  const templateFields = React.useMemo(() => {
    const itemsSchema = field.items as SchemaProperty | undefined;
    const properties = itemsSchema?.properties || {};
    return Object.entries(properties).sort((a, b) => {
      const indexA = a[1]['x-index'] ?? 999;
      const indexB = b[1]['x-index'] ?? 999;
      return indexA - indexB;
    });
  }, [field.items]);

  const fieldCount = templateFields.length;

  return (
    <div className="space-y-2">
      {/* Repeating Section Header */}
      <div
        className={cn(
          'flex items-center gap-2 p-2 -m-2 rounded-lg bg-warning/5 border border-warning/20',
          'cursor-pointer hover:bg-warning/10'
        )}
        onClick={(e) => {
          e.stopPropagation();
          setIsCollapsed(!isCollapsed);
        }}
      >
        {/* Collapse Toggle */}
        <Button variant="ghost" size="icon" className="size-6 shrink-0">
          {isCollapsed ? (
            <ChevronRight className="size-4 text-warning" />
          ) : (
            <ChevronDown className="size-4 text-warning" />
          )}
        </Button>

        {/* Repeating Icon */}
        <Repeat2 className="size-4 text-warning shrink-0" />

        {/* Section Title */}
        <span className="text-sm font-semibold text-primary flex-1">
          {title}
        </span>

        {/* Limits Badge */}
        <span className="text-xs text-secondary bg-surface/50 px-2 py-0.5 rounded-full">
          {minItems}-{maxItems} entries
        </span>
      </div>

      {/* Entry Template - Show actual fields */}
      {!isCollapsed && (
        <div className="ml-4 pl-3 border-l-2 border-warning/30 space-y-2">
          {/* Template Header */}
          <div className="flex items-center justify-between py-1">
            <span className="text-xs font-medium text-secondary uppercase tracking-wider">
              Entry Template
            </span>
            <span className="text-xs text-muted">
              {fieldCount} field{fieldCount !== 1 ? 's' : ''} per entry
            </span>
          </div>

          {/* Template Fields */}
          {fieldCount > 0 ? (
            <div className="space-y-2">
              {templateFields.map(([nestedKey, nestedField]) => {
                // Path for items template: fieldPath.items.properties.nestedKey
                const nestedPath = [...fieldPath, 'items', 'properties', nestedKey];
                const isNestedSelected =
                  selectedFieldPath?.join('.') === nestedPath.join('.');

                return (
                  <NestedCanvasField
                    key={nestedKey}
                    fieldKey={nestedKey}
                    fieldPath={nestedPath}
                    field={nestedField}
                    isSelected={isNestedSelected}
                    onSelect={onSelect}
                    onDelete={onDelete}
                    selectedFieldPath={selectedFieldPath}
                    previewMode={previewMode}
                    depth={depth + 1}
                  />
                );
              })}
            </div>
          ) : (
            <div className="min-h-[48px] flex items-center justify-center text-xs text-muted italic bg-surface/30 rounded-lg border border-dashed border-default">
              Configure fields for each repeating entry
            </div>
          )}

          {/* Add Button Preview */}
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-warning border-warning/30 hover:bg-warning/10"
            disabled
          >
            <Plus className="size-3.5" />
            {addButtonText}
          </Button>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// CALCULATED FIELD PREVIEW - Auto-computed value component
// =============================================================================

interface CalculatedFieldPreviewProps {
  title: string;
  field: SchemaProperty;
}

function CalculatedFieldPreview({ title, field }: CalculatedFieldPreviewProps) {
  const componentProps = field['x-component-props'] || {};
  const formula = String(componentProps.formula || 'No formula set');
  const sourceFields = (componentProps.sourceFields as string[]) || [];
  const resultType = String(componentProps.resultType || 'number');
  const decimalPlaces = Number(componentProps.decimalPlaces) || 2;

  return (
    <div className="space-y-2">
      {/* Calculated Field Header */}
      <div className="flex items-center gap-2 p-2 -m-2 rounded-lg bg-harbor-50/50 dark:bg-harbor-900/30 border border-harbor-200 dark:border-harbor-800">
        {/* Calculator Icon */}
        <Calculator className="size-4 text-harbor-600 dark:text-harbor-400 shrink-0" />

        {/* Field Title */}
        <span className="text-sm font-semibold text-primary flex-1">
          {title}
        </span>

        {/* Result Type Badge */}
        <span className="text-xs text-secondary bg-surface/50 px-2 py-0.5 rounded-full">
          {resultType}
        </span>
      </div>

      {/* Formula Display */}
      <div className="ml-4 pl-3 border-l-2 border-harbor-300 dark:border-harbor-700 space-y-2">
        {/* Formula Expression */}
        <div className="bg-surface/30 rounded-lg p-3 border border-dashed border-default">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-secondary uppercase tracking-wider">
              Formula
            </span>
            {resultType === 'number' && (
              <span className="text-xs text-muted">
                {decimalPlaces} decimal places
              </span>
            )}
          </div>

          {formula && formula !== 'No formula set' ? (
            <code className="text-xs font-mono text-harbor-600 dark:text-harbor-400 bg-harbor-50 dark:bg-harbor-900/50 px-2 py-1 rounded">
              {formula}
            </code>
          ) : (
            <p className="text-xs text-muted italic">
              Configure formula in properties panel
            </p>
          )}
        </div>

        {/* Source Fields */}
        {sourceFields.length > 0 && (
          <div className="flex flex-wrap gap-1">
            <span className="text-xs text-secondary">Uses:</span>
            {sourceFields.map((field, i) => (
              <span
                key={i}
                className="text-xs bg-harbor-100 dark:bg-harbor-900 text-harbor-700 dark:text-harbor-300 px-1.5 py-0.5 rounded"
              >
                {field}
              </span>
            ))}
          </div>
        )}

        {/* Result Preview */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-secondary">Result:</span>
          <div className="flex-1 bg-surface/50 rounded px-2 py-1 text-sm text-muted">
            = <span className="italic">calculated at runtime</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CanvasField;
