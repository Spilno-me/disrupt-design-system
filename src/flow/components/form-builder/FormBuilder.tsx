/**
 * FormBuilder - Main page component for building forms
 *
 * A full-featured form builder with drag-and-drop field creation,
 * real-time preview, and JSON schema editing. Uses DDS glass styling
 * with GridBlobBackground for visual interest.
 *
 * @component PAGE
 */

import * as React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { GridBlobBackground } from '@/components/ui/GridBlobCanvas';
import { FormBuilderProvider } from './context';
import { FormBuilderHeader } from './components/FormBuilderHeader';
import { FormBuilderContent } from './components/FormBuilderContent';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export interface EntityTemplate {
  value: string;
  label: string;
}

export interface FormBuilderProps {
  /** Initial form name */
  formName?: string;
  /** Initial form description */
  description?: string;
  /** Selected entity template */
  entityTemplate?: string;
  /** Available entity templates for selection */
  entityTemplates?: EntityTemplate[];
  /** Callback when form name changes */
  onFormNameChange?: (name: string) => void;
  /** Callback when description changes */
  onDescriptionChange?: (description: string) => void;
  /** Callback when entity template changes */
  onEntityTemplateChange?: (template: string) => void;
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
// DEFAULT ENTITY TEMPLATES
// =============================================================================

const DEFAULT_ENTITY_TEMPLATES: EntityTemplate[] = [
  { value: 'incident', label: 'Incident Report' },
  { value: 'inspection', label: 'Safety Inspection' },
  { value: 'audit', label: 'Compliance Audit' },
  { value: 'observation', label: 'Field Observation' },
  { value: 'permit', label: 'Work Permit' },
];

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Form Builder Component
 *
 * @example
 * ```tsx
 * <FormBuilder
 *   formName="Safety Inspection Form"
 *   onBack={() => navigate('/forms')}
 *   onSave={() => saveForm()}
 * />
 * ```
 */
export function FormBuilder({
  formName: initialFormName = '',
  description: initialDescription = '',
  entityTemplate: initialEntityTemplate,
  entityTemplates = DEFAULT_ENTITY_TEMPLATES,
  onFormNameChange,
  onDescriptionChange,
  onEntityTemplateChange,
  onBack,
  onSchemaViewer,
  onSave,
  isSaving = false,
  className,
}: FormBuilderProps) {
  // Local state for controlled form metadata
  const [formName, setFormName] = React.useState(initialFormName);
  const [description, setDescription] = React.useState(initialDescription);
  const [entityTemplate, setEntityTemplate] = React.useState(initialEntityTemplate);

  // Handlers that sync local state and notify parent
  const handleFormNameChange = React.useCallback(
    (name: string) => {
      setFormName(name);
      onFormNameChange?.(name);
    },
    [onFormNameChange]
  );

  const handleDescriptionChange = React.useCallback(
    (desc: string) => {
      setDescription(desc);
      onDescriptionChange?.(desc);
    },
    [onDescriptionChange]
  );

  const handleEntityTemplateChange = React.useCallback(
    (template: string) => {
      setEntityTemplate(template);
      onEntityTemplateChange?.(template);
    },
    [onEntityTemplateChange]
  );

  return (
    <TooltipProvider>
      <FormBuilderProvider>
        <div
          data-slot="form-builder"
          className={cn(
            'relative flex flex-col h-screen overflow-hidden',
            // Background gradient (Depth 1 - furthest back)
            'bg-gradient-to-br from-surface via-surface to-muted-bg',
            className
          )}
        >
          {/* Grid blob background for visual interest */}
          <GridBlobBackground scale={0.8} blobCount={2} />

          {/* Content layer (above background) */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Header */}
            <FormBuilderHeader
              formName={formName}
              onFormNameChange={handleFormNameChange}
              description={description}
              onDescriptionChange={handleDescriptionChange}
              entityTemplate={entityTemplate}
              onEntityTemplateChange={handleEntityTemplateChange}
              entityTemplates={entityTemplates}
              onBack={onBack}
              onSchemaViewer={onSchemaViewer}
              onSave={onSave}
              isSaving={isSaving}
            />

            {/* Three-panel content */}
            <FormBuilderContent className="flex-1 min-h-0" />
          </div>
        </div>
      </FormBuilderProvider>
    </TooltipProvider>
  );
}

FormBuilder.displayName = 'FormBuilder';
