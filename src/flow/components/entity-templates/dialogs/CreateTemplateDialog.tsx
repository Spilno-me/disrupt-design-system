/**
 * CreateTemplateDialog - Create new entity template
 *
 * Form dialog for creating a new entity template with name,
 * business key template, and visual JSON schema editor.
 */

import * as React from 'react'
import { FileText } from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../../components/ui/dialog'
import { SchemaStudio } from '../../schema-studio'
import type { JSONSchema } from '../../schema-studio/types'
import type {
  CreateTemplateDialogProps,
  CreateTemplateFormData,
  TemplateCategory,
} from '../types'
import { validateTemplateName } from '../types'
import { TemplateConfigSection } from './form-components'

// =============================================================================
// DEFAULT SCHEMA
// =============================================================================

const DEFAULT_SCHEMA: JSONSchema = {
  type: 'object',
  title: 'New Template',
  description: '',
  required: [],
  properties: {},
  'ui:order': [],
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CreateTemplateDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateTemplateDialogProps) {
  // Form state
  const [name, setName] = React.useState('')
  const [category, setCategory] = React.useState<TemplateCategory>('custom')
  const [businessKeyTemplate, setBusinessKeyTemplate] = React.useState('')
  const [schema, setSchema] = React.useState<JSONSchema>(DEFAULT_SCHEMA)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Validation and error state
  const [nameError, setNameError] = React.useState<string | undefined>()
  const [submitError, setSubmitError] = React.useState<string | null>(null)

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setName('')
      setCategory('custom')
      setBusinessKeyTemplate('')
      setSchema({ ...DEFAULT_SCHEMA, title: 'New Template' })
      setNameError(undefined)
      setSubmitError(null)
    }
  }, [open])

  // Validate name
  const handleNameChange = React.useCallback((value: string) => {
    setName(value)
    if (value) {
      const validation = validateTemplateName(value)
      setNameError(validation.error)
    } else {
      setNameError(undefined)
    }
  }, [])

  // Update schema title when name changes
  React.useEffect(() => {
    if (name.trim()) {
      setSchema((prev) => ({ ...prev, title: name.trim() }))
    }
  }, [name])

  // Handle schema change from SchemaStudio
  const handleSchemaChange = React.useCallback((newSchema: JSONSchema) => {
    setSchema(newSchema)
  }, [])

  // Form submission
  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Validate name
      const nameValidation = validateTemplateName(name)
      if (!nameValidation.valid) {
        setNameError(nameValidation.error)
        return
      }

      // Check schema has at least one property
      if (Object.keys(schema.properties).length === 0) {
        return // Schema validation handled by SchemaStudio
      }

      setIsSubmitting(true)
      setSubmitError(null)
      try {
        const formData: CreateTemplateFormData = {
          name: name.trim(),
          category,
          businessKeyTemplate: businessKeyTemplate.trim() || undefined,
          jsonSchema: JSON.stringify(schema, null, 2),
        }
        await onSubmit?.(formData)
        onOpenChange(false)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create template. Please try again.'
        setSubmitError(message)
        console.error('Create template error:', err)
      } finally {
        setIsSubmitting(false)
      }
    },
    [name, category, businessKeyTemplate, schema, onSubmit, onOpenChange]
  )

  const hasFields = Object.keys(schema.properties).length > 0
  const isValid = validateTemplateName(name.trim()).valid && hasFields

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
                Create Entity Template
              </DialogTitle>
              <DialogDescription className="mt-1">
                Create a new entity template to define the structure and validation
                rules for entities.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex-1 min-h-0 flex flex-col mt-4"
        >
          {/* Submit error message */}
          {submitError && (
            <div className="mb-4 rounded-lg border border-error bg-error/10 p-3">
              <p className="text-sm text-error font-medium">{submitError}</p>
            </div>
          )}

          {/* Scrollable content area */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-2">
            {/* Template Configuration Section */}
            <TemplateConfigSection
              name={name}
              onNameChange={handleNameChange}
              nameError={nameError}
              category={category}
              onCategoryChange={setCategory}
              businessKeyTemplate={businessKeyTemplate}
              onBusinessKeyChange={setBusinessKeyTemplate}
            />

            {/* Schema Studio Section */}
            <div className="rounded-lg border border-default overflow-hidden min-h-[400px]">
              <SchemaStudio
                initialSchema={schema}
                onChange={handleSchemaChange}
                defaultMode="visual"
                showPreview={false}
                className="h-full"
              />
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 mt-4 pt-4 border-t border-default">
            <div className="flex items-center justify-between w-full">
              <p className="text-sm text-secondary">
                {hasFields
                  ? `${Object.keys(schema.properties).length} field${Object.keys(schema.properties).length !== 1 ? 's' : ''} defined`
                  : 'Add at least one field to create the template'}
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
                  {isSubmitting ? 'Creating...' : 'Create Template'}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

CreateTemplateDialog.displayName = 'CreateTemplateDialog'

export default CreateTemplateDialog
