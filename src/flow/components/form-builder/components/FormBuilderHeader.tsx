/**
 * FormBuilderHeader - Header bar with form metadata and actions
 *
 * Contains form name, description, entity template selector,
 * and action buttons for schema viewer and save.
 *
 * @component MOLECULE
 */

import * as React from 'react';
import { ArrowLeft, Code, Save, Undo2, Redo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useFormBuilder } from '../context';

// =============================================================================
// TYPES
// =============================================================================

export interface FormBuilderHeaderProps {
  /** Form name value */
  formName?: string;
  /** Called when form name changes */
  onFormNameChange?: (name: string) => void;
  /** Form description value */
  description?: string;
  /** Called when description changes */
  onDescriptionChange?: (description: string) => void;
  /** Selected entity template */
  entityTemplate?: string;
  /** Called when entity template changes */
  onEntityTemplateChange?: (template: string) => void;
  /** Available entity templates */
  entityTemplates?: Array<{ value: string; label: string }>;
  /** Callback when back button is clicked */
  onBack?: () => void;
  /** Callback when schema viewer is clicked */
  onSchemaViewer?: () => void;
  /** Callback when save button is clicked */
  onSave?: () => void;
  /** Whether save is in progress */
  isSaving?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function FormBuilderHeader({
  formName = '',
  onFormNameChange,
  description = '',
  onDescriptionChange,
  entityTemplate,
  onEntityTemplateChange,
  entityTemplates = [],
  onBack,
  onSchemaViewer,
  onSave,
  isSaving = false,
  className,
}: FormBuilderHeaderProps) {
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    hasUnsavedChanges,
  } = useFormBuilder();

  return (
    <header
      data-slot="form-builder-header"
      className={cn(
        // Glass header card (Depth 2)
        'flex items-center gap-4 px-4 py-3',
        'bg-white/40 dark:bg-black/40 backdrop-blur-[4px]',
        'border-2 border-accent shadow-md',
        'rounded-xl',
        // Margin from page edges
        'mx-4 mt-4',
        className
      )}
    >
      {/* Back Button */}
      {onBack && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="size-9 shrink-0"
            >
              <ArrowLeft className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Go back</TooltipContent>
        </Tooltip>
      )}

      {/* Form Name */}
      <div className="flex-1 min-w-0 max-w-xs">
        <label className="text-xs font-medium text-secondary mb-1 block">
          Form Name
        </label>
        <Input
          value={formName}
          onChange={(e) => onFormNameChange?.(e.target.value)}
          placeholder="Enter form name..."
          className="h-9 bg-surface/50"
        />
      </div>

      {/* Description */}
      <div className="flex-1 min-w-0 max-w-sm hidden md:block">
        <label className="text-xs font-medium text-secondary mb-1 block">
          Description
        </label>
        <Input
          value={description}
          onChange={(e) => onDescriptionChange?.(e.target.value)}
          placeholder="Enter description..."
          className="h-9 bg-surface/50"
        />
      </div>

      {/* Entity Template */}
      <div className="min-w-0 w-48 hidden lg:block">
        <label className="text-xs font-medium text-secondary mb-1 block">
          Entity Template
        </label>
        <Select
          value={entityTemplate}
          onValueChange={onEntityTemplateChange}
        >
          <SelectTrigger className="h-9 bg-surface/50">
            <SelectValue placeholder="Select template..." />
          </SelectTrigger>
          <SelectContent>
            {entityTemplates.length > 0 ? (
              entityTemplates.map((template) => (
                <SelectItem key={template.value} value={template.value}>
                  {template.label}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                No templates available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Unsaved indicator */}
      {hasUnsavedChanges && (
        <span className="text-xs text-warning bg-warning/10 px-2 py-1 rounded-md border border-warning/20">
          Unsaved changes
        </span>
      )}

      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={undo}
              disabled={!canUndo}
              className="size-9"
            >
              <Undo2 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={redo}
              disabled={!canRedo}
              className="size-9"
            >
              <Redo2 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
        </Tooltip>
      </div>

      {/* Schema Viewer */}
      {onSchemaViewer && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onSchemaViewer}
              className="gap-2"
            >
              <Code className="size-4" />
              <span className="hidden sm:inline">Schema Viewer</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>View JSON Schema</TooltipContent>
        </Tooltip>
      )}

      {/* Save */}
      {onSave && (
        <Button
          onClick={onSave}
          size="sm"
          disabled={isSaving}
          className="gap-2"
        >
          <Save className="size-4" />
          {isSaving ? 'Saving...' : 'Save Form'}
        </Button>
      )}
    </header>
  );
}

FormBuilderHeader.displayName = 'FormBuilderHeader';

export default FormBuilderHeader;
