/**
 * CreateTemplatePage - Full-screen page for creating entity templates
 *
 * A dedicated page component for creating new template configuration and schema.
 * Provides more space for the SchemaStudio editor compared to dialog approach.
 *
 * @example
 * ```tsx
 * <CreateTemplatePage
 *   onSubmit={handleCreate}
 *   onBack={() => navigate('/entity-templates')}
 * />
 * ```
 */

import * as React from 'react'
import {
  FileText,
  HelpCircle,
  ArrowLeft,
  Plus,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../../../components/ui/tooltip'
import { PageActionPanel } from '../../../../components/ui/PageActionPanel'
import { GridBlobBackground } from '../../../../components/ui/GridBlobCanvas'
import { SchemaStudio } from '../../schema-studio'
import type { JSONSchema } from '../../schema-studio/types'
import type { CreateTemplateFormData, TemplateCategory } from '../types'
import {
  TEMPLATE_CATEGORIES,
  validateTemplateName,
  generateTemplateCode,
} from '../types'

// =============================================================================
// TYPES
// =============================================================================

export interface CreateTemplatePageProps {
  /** Callback when template is created */
  onSubmit?: (data: CreateTemplateFormData) => Promise<void>
  /** Callback to navigate back to list */
  onBack: () => void
  /** Optional loading state */
  isLoading?: boolean
  /** Pre-selected category (e.g., from list page filter) */
  initialCategory?: TemplateCategory
  className?: string
}

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

export function CreateTemplatePage({
  onSubmit,
  onBack,
  isLoading = false,
  initialCategory = 'custom',
  className,
}: CreateTemplatePageProps) {
  // Form state (category initialized from list page filter if provided)
  const [name, setName] = React.useState('')
  const [category, setCategory] = React.useState<TemplateCategory>(initialCategory)
  const [businessKeyTemplate, setBusinessKeyTemplate] = React.useState('')
  const [schema, setSchema] = React.useState<JSONSchema>(DEFAULT_SCHEMA)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isDirty, setIsDirty] = React.useState(false)

  // Validation errors
  const [nameError, setNameError] = React.useState<string | undefined>()

  // Validate name
  const handleNameChange = React.useCallback((value: string) => {
    setName(value)
    setIsDirty(true)
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

  // Handle category change
  const handleCategoryChange = React.useCallback((value: TemplateCategory) => {
    setCategory(value)
    setIsDirty(true)
  }, [])

  // Handle business key change
  const handleBusinessKeyChange = React.useCallback((value: string) => {
    setBusinessKeyTemplate(value)
    setIsDirty(true)
  }, [])

  // Handle schema change from SchemaStudio
  const handleSchemaChange = React.useCallback((newSchema: JSONSchema) => {
    setSchema(newSchema)
    setIsDirty(true)
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
        return
      }

      setIsSubmitting(true)
      try {
        const formData: CreateTemplateFormData = {
          name: name.trim(),
          category,
          businessKeyTemplate: businessKeyTemplate.trim() || undefined,
          jsonSchema: JSON.stringify(schema, null, 2),
        }
        await onSubmit?.(formData)
        setIsDirty(false)
        onBack()
      } finally {
        setIsSubmitting(false)
      }
    },
    [name, category, schema, businessKeyTemplate, onSubmit, onBack]
  )

  // Handle back with dirty check
  const handleBack = React.useCallback(() => {
    if (isDirty) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      )
      if (!confirmed) return
    }
    onBack()
  }, [isDirty, onBack])

  const hasFields = Object.keys(schema.properties).length > 0
  const isValid = !nameError && name.trim().length >= 5 && hasFields

  // Generated code preview
  const generatedCode = name.trim() ? generateTemplateCode(name) : ''

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 animate-spin rounded-full border-3 border-accent border-t-transparent" />
          <p className="text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      data-slot="create-template-page"
      className={cn('relative min-h-screen bg-page overflow-hidden', className)}
    >
      {/* Animated grid blob background */}
      <GridBlobBackground scale={1.2} blobCount={2} />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6 p-4 md:p-6">
        {/* Page Header */}
        <PageActionPanel
          icon={<FileText className="w-6 h-6 md:w-8 md:h-8" />}
          iconClassName="text-accent"
          title="Create Entity Template"
          subtitle="Define a new template with its structure and validation rules"
          primaryAction={
            <Button
              type="submit"
              form="create-template-form"
              disabled={!isValid || isSubmitting}
              className="gap-2"
            >
              <Plus className="size-4" />
              {isSubmitting ? 'Creating...' : 'Create Template'}
            </Button>
          }
          actions={
            <Button variant="outline" onClick={handleBack} className="gap-2">
              <ArrowLeft className="size-4" />
              Back to Templates
            </Button>
          }
        />

        {/* Main Content */}
        <form
          id="create-template-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6"
        >
          {/* Left Sidebar - Configuration (Depth 2 Glass) */}
          <div className="rounded-xl bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent shadow-md p-4 space-y-4">
            {/* Template Info Card */}
            <div className="rounded-lg border border-default bg-surface p-4 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 p-2 rounded-lg bg-muted-bg">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-primary">New Template</h2>
                  <p className="text-sm text-secondary">
                    Configure your template properties
                  </p>
                </div>
              </div>

              {/* Code preview */}
              {generatedCode && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted-bg border border-default">
                  <span className="text-sm text-secondary">Code:</span>
                  <code className="flex-1 font-mono font-medium text-primary">
                    {generatedCode}
                  </code>
                </div>
              )}
            </div>

            {/* Configuration Card */}
            <div className="rounded-lg border border-default bg-surface p-4 shadow-sm">
              <h3 className="font-semibold text-primary mb-4">Configuration</h3>

              <div className="space-y-4">
                {/* Template Name */}
                <div className="space-y-2">
                  <Label htmlFor="template-name">
                    Template Name <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="template-name"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., Safety Inspection"
                    aria-invalid={!!nameError}
                  />
                  {nameError && (
                    <p className="text-sm text-error">{nameError}</p>
                  )}
                  <p className="text-xs text-tertiary">
                    Letters and spaces only, 5-100 characters
                  </p>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="template-category">Category</Label>
                  <Select
                    value={category}
                    onValueChange={(value) =>
                      handleCategoryChange(value as TemplateCategory)
                    }
                  >
                    <SelectTrigger id="template-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEMPLATE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-tertiary">
                    Choose a category to organize this template
                  </p>
                </div>

                {/* Business Key Template */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="business-key">Business Key Template</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="text-secondary hover:text-primary"
                          aria-label="Learn about business key template format"
                        >
                          <HelpCircle className="size-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        Optional template for generating business keys. Use{' '}
                        {'{code}'}, {'{sequence}'}, {'{date}'}, {'{id}'}.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="business-key"
                    value={businessKeyTemplate}
                    onChange={(e) => handleBusinessKeyChange(e.target.value)}
                    placeholder="e.g., SI-{sequence}"
                    maxLength={100}
                  />
                  <p className="text-xs text-tertiary">
                    Available tokens: {'{code}'}, {'{sequence}'}, {'{date}'}, {'{id}'}
                  </p>
                </div>
              </div>
            </div>

            {/* Schema Fields Card */}
            <div className="rounded-lg border border-default bg-surface p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary">Schema Fields</span>
                <span
                  className={cn(
                    'text-sm font-medium',
                    hasFields ? 'text-primary' : 'text-warning'
                  )}
                >
                  {Object.keys(schema.properties).length} fields
                </span>
              </div>
              {!hasFields && (
                <p className="text-xs text-warning mt-2">
                  Add at least one field to create the template
                </p>
              )}
            </div>
          </div>

          {/* Right Content - Schema Studio (Depth 2 Glass) */}
          <div className="rounded-xl bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent shadow-md p-4 min-h-[600px] flex flex-col gap-4">
            <div>
              <h3 className="font-semibold text-primary">Schema Editor</h3>
              <p className="text-sm text-secondary">
                Define the fields and validation rules for this template
              </p>
            </div>
            <SchemaStudio
              initialSchema={schema}
              onChange={handleSchemaChange}
              defaultMode="visual"
              showPreview
              className="h-full flex-1"
            />
          </div>
        </form>
      </div>
    </div>
  )
}

CreateTemplatePage.displayName = 'CreateTemplatePage'

export default CreateTemplatePage
