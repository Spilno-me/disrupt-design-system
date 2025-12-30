/**
 * EditTemplatePane - Inline edit pane for split-view layout
 *
 * A non-overlay panel that appears beside the template table when editing.
 * Used in conditional split-view layout where table shrinks to make room.
 *
 * @example
 * ```tsx
 * // In a split-view layout:
 * <div className="grid grid-cols-[1fr_500px]">
 *   <TemplateTable />
 *   {isEditing && (
 *     <EditTemplatePane
 *       template={selectedTemplate}
 *       onSubmit={handleUpdate}
 *       onClose={() => setIsEditing(false)}
 *     />
 *   )}
 * </div>
 * ```
 */

import * as React from 'react'
import { FileText, Copy, Check, AlertTriangle, HelpCircle, X } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../../../components/ui/tooltip'
import { SchemaStudio } from '../../schema-studio'
import type { JSONSchema } from '../../schema-studio/types'
import type { EntityTemplate, EditTemplateFormData } from '../types'
import { validateTemplateName } from '../types'

// =============================================================================
// TYPES
// =============================================================================

export interface EditTemplatePaneProps {
  template: EntityTemplate
  onSubmit?: (data: EditTemplateFormData) => Promise<void>
  onClose: () => void
  className?: string
}

// =============================================================================
// COPY BUTTON COMPONENT
// =============================================================================

interface CopyButtonProps {
  value: string
  className?: string
}

function CopyButton({ value, className }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = React.useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()
      try {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    },
    [value]
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            'inline-flex items-center justify-center size-6 rounded-sm',
            'text-secondary hover:text-primary hover:bg-muted-bg',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            className
          )}
        >
          {copied ? (
            <Check className="size-3.5 text-success" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>{copied ? 'Copied!' : 'Copy to clipboard'}</TooltipContent>
    </Tooltip>
  )
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Parse JSON schema string to object, with fallback
 */
function parseSchemaString(jsonString: string): JSONSchema {
  try {
    const parsed = JSON.parse(jsonString)
    return {
      type: 'object',
      title: parsed.title || 'Untitled',
      description: parsed.description,
      required: parsed.required || [],
      'ui:order': parsed['ui:order'] || Object.keys(parsed.properties || {}),
      properties: parsed.properties || {},
    }
  } catch {
    return {
      type: 'object',
      title: 'Invalid Schema',
      required: [],
      properties: {},
    }
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export function EditTemplatePane({
  template,
  onSubmit,
  onClose,
  className,
}: EditTemplatePaneProps) {
  // Form state
  const [name, setName] = React.useState('')
  const [businessKeyTemplate, setBusinessKeyTemplate] = React.useState('')
  const [schema, setSchema] = React.useState<JSONSchema | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Validation errors
  const [nameError, setNameError] = React.useState<string | undefined>()

  // Reset form when template changes
  React.useEffect(() => {
    if (template) {
      setName(template.name)
      setBusinessKeyTemplate(template.businessKeyTemplate ?? '')
      setSchema(parseSchemaString(template.jsonSchema))
      setNameError(undefined)
    }
  }, [template])

  // Validate name
  const handleNameChange = React.useCallback(
    (value: string) => {
      setName(value)
      if (value && !template?.isSystem) {
        const validation = validateTemplateName(value)
        setNameError(validation.error)
      } else {
        setNameError(undefined)
      }
    },
    [template?.isSystem]
  )

  // Handle schema change from SchemaStudio
  const handleSchemaChange = React.useCallback((newSchema: JSONSchema) => {
    setSchema(newSchema)
  }, [])

  // Form submission
  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!template || !schema) return

      // Validate name
      const nameValidation = template.isSystem
        ? { valid: true }
        : validateTemplateName(name)

      if (!nameValidation.valid) {
        setNameError(nameValidation.error)
        return
      }

      // Check schema has at least one property
      if (Object.keys(schema.properties).length === 0) {
        return
      }

      setIsSubmitting(true)
      try {
        const formData: EditTemplateFormData = {
          id: template.id,
          name: template.isSystem ? template.name : name.trim(),
          category: template.category,
          businessKeyTemplate: businessKeyTemplate.trim() || undefined,
          jsonSchema: JSON.stringify(schema, null, 2),
        }
        await onSubmit?.(formData)
        onClose()
      } finally {
        setIsSubmitting(false)
      }
    },
    [template, schema, name, businessKeyTemplate, onSubmit, onClose]
  )

  const hasFields = schema ? Object.keys(schema.properties).length > 0 : false
  const isValid =
    !nameError &&
    (template.isSystem || name.trim().length >= 5) &&
    hasFields

  return (
    <div
      data-slot="edit-template-pane"
      className={cn(
        'flex flex-col h-full bg-surface border-l border-default',
        'animate-in slide-in-from-right-5 duration-200',
        className
      )}
    >
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-default">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex-shrink-0 p-2 rounded-lg bg-muted-bg">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-primary truncate">
                Edit: {template.name}
              </h2>
              <p className="text-sm text-secondary mt-0.5">
                Modify template configuration and schema
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="flex-shrink-0"
            aria-label="Close edit panel"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* System template warning */}
        {template.isSystem && (
          <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-warning/10 border border-warning/30">
            <AlertTriangle className="size-4 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-sm text-warning">
              System template. Name cannot be modified.
            </p>
          </div>
        )}

        {/* Template metadata */}
        <div className="flex items-center gap-4 mt-3 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-secondary">Code:</span>
            <code className="font-mono font-medium text-primary bg-muted-bg px-2 py-0.5 rounded">
              {template.code}
            </code>
            <CopyButton value={template.code} />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-secondary">v{template.version}</span>
          </div>
        </div>
      </div>

      {/* Scrollable form content */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 min-h-0 flex flex-col"
      >
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
          {/* Template Configuration Section */}
          <div className="rounded-lg border border-default p-4">
            <h3 className="font-semibold text-primary mb-3 text-sm">
              Configuration
            </h3>

            <div className="space-y-3">
              {/* Template Name */}
              <div className="space-y-1.5">
                <Label htmlFor="pane-template-name" className="text-sm">
                  Template Name{' '}
                  {!template.isSystem && <span className="text-error">*</span>}
                </Label>
                <Input
                  id="pane-template-name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  disabled={template.isSystem}
                  placeholder="Enter template name"
                  aria-invalid={!!nameError}
                  className={cn(template.isSystem && 'bg-muted-bg')}
                />
                {nameError && <p className="text-xs text-error">{nameError}</p>}
              </div>

              {/* Business Key Template */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <Label htmlFor="pane-business-key" className="text-sm">Business Key</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="text-secondary hover:text-primary"
                      >
                        <HelpCircle className="size-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      Optional template for generating business keys. Use{' '}
                      {'{code}'}, {'{sequence}'}, {'{date}'}, {'{id}'}.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="pane-business-key"
                  value={businessKeyTemplate}
                  onChange={(e) => setBusinessKeyTemplate(e.target.value)}
                  placeholder="e.g., INC-{sequence}"
                  maxLength={100}
                />
              </div>
            </div>
          </div>

          {/* Schema Studio Section */}
          <div className="rounded-lg border border-default overflow-hidden min-h-[350px]">
            {schema && (
              <SchemaStudio
                key={template.id}
                initialSchema={schema}
                onChange={handleSchemaChange}
                defaultMode="visual"
                showPreview={false}
                className="h-full"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-default bg-muted-bg/30">
          <div className="flex items-center justify-between">
            <p className="text-sm text-secondary">
              {hasFields && schema
                ? `${Object.keys(schema.properties).length} field${Object.keys(schema.properties).length !== 1 ? 's' : ''}`
                : 'Add at least one field'}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!isValid || isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

EditTemplatePane.displayName = 'EditTemplatePane'

export default EditTemplatePane
