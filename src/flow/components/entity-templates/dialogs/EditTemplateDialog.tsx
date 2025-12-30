/**
 * EditTemplateDialog - Edit entity template configuration
 *
 * Form dialog for editing template name, business key template, and JSON schema.
 * System templates have restrictions on name editing.
 */

import * as React from 'react'
import { FileText, Copy, Check, AlertTriangle, HelpCircle } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../../components/ui/dialog'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../../../components/ui/tooltip'
import { SchemaStudio } from '../../schema-studio'
import type { JSONSchema } from '../../schema-studio/types'
import type { EditTemplateDialogProps, EditTemplateFormData } from '../types'
import { validateTemplateName } from '../types'

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

export function EditTemplateDialog({
  template,
  open,
  onOpenChange,
  onSubmit,
}: EditTemplateDialogProps) {
  // Form state
  const [name, setName] = React.useState('')
  const [businessKeyTemplate, setBusinessKeyTemplate] = React.useState('')
  const [schema, setSchema] = React.useState<JSONSchema | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Validation errors
  const [nameError, setNameError] = React.useState<string | undefined>()

  // Reset form when template changes
  React.useEffect(() => {
    if (template && open) {
      setName(template.name)
      setBusinessKeyTemplate(template.businessKeyTemplate ?? '')
      setSchema(parseSchemaString(template.jsonSchema))
      setNameError(undefined)
    }
  }, [template, open])

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
        onOpenChange(false)
      } finally {
        setIsSubmitting(false)
      }
    },
    [template, schema, name, businessKeyTemplate, onSubmit, onOpenChange]
  )

  if (!template) return null

  const hasFields = schema ? Object.keys(schema.properties).length > 0 : false
  const isValid =
    !nameError &&
    (template.isSystem || name.trim().length >= 5) &&
    hasFields

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 rounded-lg bg-muted-bg">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-semibold">
                Edit: {template.name}
              </DialogTitle>
              <DialogDescription className="mt-1">
                Modify the entity template configuration and schema definition.
              </DialogDescription>
            </div>
          </div>

          {/* System template warning */}
          {template.isSystem && (
            <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-warning/10 border border-warning/30">
              <AlertTriangle className="size-4 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-sm text-warning">
                This is a system template. Name cannot be modified.
              </p>
            </div>
          )}

          {/* Template metadata */}
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-secondary">Code:</span>
              <code className="font-mono font-medium text-primary bg-muted-bg px-2 py-0.5 rounded">
                {template.code}
              </code>
              <CopyButton value={template.code} />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-secondary">Version:</span>
              <span className="font-medium text-primary">{template.version}</span>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex-1 min-h-0 flex flex-col mt-4"
        >
          {/* Scrollable content area */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-2">
            {/* Template Configuration Section */}
            <div className="rounded-lg border border-default p-4">
            <h3 className="font-semibold text-primary mb-4">
              Template Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Template Name */}
              <div className="space-y-2">
                <Label htmlFor="edit-template-name">
                  Template Name{' '}
                  {!template.isSystem && <span className="text-error">*</span>}
                </Label>
                <Input
                  id="edit-template-name"
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
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Label htmlFor="edit-business-key">Business Key</Label>
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
                  id="edit-business-key"
                  value={businessKeyTemplate}
                  onChange={(e) => setBusinessKeyTemplate(e.target.value)}
                  placeholder="e.g., INC-{sequence}"
                  maxLength={100}
                />
              </div>
            </div>
            </div>

            {/* Schema Studio Section */}
            <div className="rounded-lg border border-default overflow-hidden min-h-[400px]">
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

          <DialogFooter className="flex-shrink-0 mt-4 pt-4 border-t border-default">
            <div className="flex items-center justify-between w-full">
              <p className="text-sm text-secondary">
                {hasFields && schema
                  ? `${Object.keys(schema.properties).length} field${Object.keys(schema.properties).length !== 1 ? 's' : ''} defined`
                  : 'Add at least one field'}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!isValid || isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Template'}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

EditTemplateDialog.displayName = 'EditTemplateDialog'

export default EditTemplateDialog
