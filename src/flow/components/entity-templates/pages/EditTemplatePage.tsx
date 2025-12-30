/**
 * EditTemplatePage - Full-screen page for editing entity templates
 *
 * A dedicated page component for editing template configuration and schema.
 * Provides more space for the SchemaStudio editor compared to inline panels.
 *
 * @example
 * ```tsx
 * <EditTemplatePage
 *   template={selectedTemplate}
 *   onSubmit={handleUpdate}
 *   onBack={() => navigate('/entity-templates')}
 * />
 * ```
 */

import * as React from 'react'
import {
  FileText,
  Copy,
  Check,
  AlertTriangle,
  HelpCircle,
  ArrowLeft,
  Save,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import { Badge } from '../../../../components/ui/badge'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../../../components/ui/tooltip'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../../../../components/ui/collapsible'
import { PageActionPanel } from '../../../../components/ui/PageActionPanel'
import { GridBlobBackground } from '../../../../components/ui/GridBlobCanvas'
import { SchemaStudio } from '../../schema-studio'
import type { JSONSchema } from '../../schema-studio/types'
import type { EntityTemplate, EditTemplateFormData } from '../types'
import { validateTemplateName, getCategoryInfo } from '../types'

// =============================================================================
// TYPES
// =============================================================================

export interface EditTemplatePageProps {
  /** The template to edit */
  template: EntityTemplate
  /** Callback when template is saved */
  onSubmit?: (data: EditTemplateFormData) => Promise<void>
  /** Callback to navigate back to list */
  onBack: () => void
  /** Optional loading state */
  isLoading?: boolean
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
          aria-label={copied ? 'Copied' : 'Copy to clipboard'}
          className={cn(
            'inline-flex items-center justify-center size-7 rounded-md',
            'text-secondary hover:text-primary hover:bg-muted-bg',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            className
          )}
        >
          {copied ? (
            <Check className="size-4 text-success" />
          ) : (
            <Copy className="size-4" />
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

export function EditTemplatePage({
  template,
  onSubmit,
  onBack,
  isLoading = false,
  className,
}: EditTemplatePageProps) {
  // Form state
  const [name, setName] = React.useState('')
  const [businessKeyTemplate, setBusinessKeyTemplate] = React.useState('')
  const [schema, setSchema] = React.useState<JSONSchema | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isDirty, setIsDirty] = React.useState(false)

  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)
  const [isTemplateInfoOpen, setIsTemplateInfoOpen] = React.useState(true)
  const [isConfigOpen, setIsConfigOpen] = React.useState(true)

  // Validation errors
  const [nameError, setNameError] = React.useState<string | undefined>()

  // Initialize form when template loads
  React.useEffect(() => {
    if (template) {
      setName(template.name)
      setBusinessKeyTemplate(template.businessKeyTemplate ?? '')
      setSchema(parseSchemaString(template.jsonSchema))
      setNameError(undefined)
      setIsDirty(false)
    }
  }, [template])

  // Validate name
  const handleNameChange = React.useCallback(
    (value: string) => {
      setName(value)
      setIsDirty(true)
      if (value && !template?.isSystem) {
        const validation = validateTemplateName(value)
        setNameError(validation.error)
      } else {
        setNameError(undefined)
      }
    },
    [template?.isSystem]
  )

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
        setIsDirty(false)
        onBack()
      } finally {
        setIsSubmitting(false)
      }
    },
    [template, schema, name, businessKeyTemplate, onSubmit, onBack]
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

  const hasFields = schema ? Object.keys(schema.properties).length > 0 : false
  const isValid =
    !nameError &&
    (template.isSystem || name.trim().length >= 5) &&
    hasFields

  const categoryInfo = getCategoryInfo(template.category)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 animate-spin rounded-full border-3 border-accent border-t-transparent" />
          <p className="text-secondary">Loading template...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      data-slot="edit-template-page"
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
          title={`Edit: ${template.name}`}
          subtitle="Modify template configuration and schema fields"
          primaryAction={
            <Button
              type="submit"
              form="edit-template-form"
              disabled={!isValid || isSubmitting}
              className="gap-2"
            >
              <Save className="size-4" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
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
          id="edit-template-form"
          onSubmit={handleSubmit}
          className={cn(
            'grid grid-cols-1 gap-4 transition-all duration-300',
            isSidebarCollapsed
              ? 'lg:grid-cols-[56px_1fr]'
              : 'lg:grid-cols-[320px_1fr]'
          )}
        >
          {/* Left Sidebar - Configuration (Depth 2 Glass) */}
          <div
            className={cn(
              'rounded-xl bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent shadow-md',
              'transition-all duration-300 self-start lg:sticky lg:top-6',
              isSidebarCollapsed ? 'p-2' : 'p-3 space-y-3'
            )}
          >
            {/* Collapsed State */}
            {isSidebarCollapsed ? (
              <div className="flex flex-col items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsSidebarCollapsed(false)}
                      className="size-10"
                      aria-label="Expand sidebar"
                    >
                      <PanelLeft className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Expand sidebar</TooltipContent>
                </Tooltip>
                <div className="w-8 h-px bg-default" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center size-10 rounded-lg bg-muted-bg">
                      <FileText className="size-4 text-accent" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <div className="text-left">
                      <p className="font-medium">{template.code}</p>
                      <p className="text-xs text-secondary">
                        {schema ? Object.keys(schema.properties).length : 0} fields
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            ) : (
              <>
                {/* Sidebar Header with collapse button */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-secondary uppercase tracking-wide">
                    Configuration
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarCollapsed(true)}
                        className="size-6"
                        aria-label="Collapse sidebar"
                      >
                        <PanelLeftClose className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Collapse sidebar</TooltipContent>
                  </Tooltip>
                </div>

                {/* Template Info Card - Collapsible */}
                <Collapsible open={isTemplateInfoOpen} onOpenChange={setIsTemplateInfoOpen}>
                  <div className="rounded-lg border border-default bg-surface shadow-sm overflow-hidden">
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted-bg/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-accent" />
                        <span className="text-sm font-medium text-primary">Template Info</span>
                      </div>
                      {isTemplateInfoOpen ? (
                        <ChevronDown className="size-4 text-secondary" />
                      ) : (
                        <ChevronRight className="size-4 text-secondary" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-3 pb-3 space-y-3">
                        {/* System template warning */}
                        {template.isSystem && (
                          <div className="flex items-start gap-2 p-2 rounded-md bg-warning/10 border border-warning/30">
                            <AlertTriangle className="size-3.5 text-warning flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-warning">
                              System template. Name cannot be modified.
                            </p>
                          </div>
                        )}

                        {/* Metadata badges */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge
                            variant={template.isSystem ? 'destructive' : 'outline'}
                            size="sm"
                            className={cn(
                              template.isSystem
                                ? 'bg-coral-100 text-coral-700 border-coral-200'
                                : 'bg-muted-bg text-secondary border-default'
                            )}
                          >
                            {template.isSystem ? 'System' : 'Custom'}
                          </Badge>
                          <Badge variant="outline" size="sm" className="bg-muted-bg text-secondary border-default">
                            v{template.version}
                          </Badge>
                          {categoryInfo && (
                            <Badge variant="outline" size="sm" className="bg-accent/10 text-accent border-accent/30">
                              {categoryInfo.name}
                            </Badge>
                          )}
                        </div>

                        {/* Code display */}
                        <div className="flex items-center gap-2 p-2 rounded-md bg-muted-bg border border-default">
                          <code className="flex-1 font-mono text-xs font-medium text-primary truncate">
                            {template.code}
                          </code>
                          <CopyButton value={template.code} className="size-5" />
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>

                {/* Configuration Card - Collapsible */}
                <Collapsible open={isConfigOpen} onOpenChange={setIsConfigOpen}>
                  <div className="rounded-lg border border-default bg-surface shadow-sm overflow-hidden">
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted-bg/50 transition-colors">
                      <span className="text-sm font-medium text-primary">Configuration</span>
                      {isConfigOpen ? (
                        <ChevronDown className="size-4 text-secondary" />
                      ) : (
                        <ChevronRight className="size-4 text-secondary" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-3 pb-3 space-y-3">
                        {/* Template Name */}
                        <div className="space-y-1.5">
                          <Label htmlFor="template-name" className="text-xs">
                            Template Name{' '}
                            {!template.isSystem && <span className="text-error">*</span>}
                          </Label>
                          <Input
                            id="template-name"
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            disabled={template.isSystem}
                            placeholder="Enter template name"
                            aria-invalid={!!nameError}
                            className={cn('h-8 text-sm', template.isSystem && 'bg-muted-bg')}
                          />
                          {nameError && (
                            <p className="text-xs text-error">{nameError}</p>
                          )}
                        </div>

                        {/* Business Key Template */}
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1">
                            <Label htmlFor="business-key" className="text-xs">Business Key</Label>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  className="text-secondary hover:text-primary"
                                  aria-label="Learn about business key template format"
                                >
                                  <HelpCircle className="size-3" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs text-xs">
                                Optional template for generating business keys
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Input
                            id="business-key"
                            value={businessKeyTemplate}
                            onChange={(e) => handleBusinessKeyChange(e.target.value)}
                            placeholder="e.g., INC-{sequence}"
                            maxLength={100}
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>

                {/* Schema Fields Summary */}
                <div className="rounded-lg border border-default bg-surface p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-secondary">Schema Fields</span>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        hasFields ? 'text-primary' : 'text-warning'
                      )}
                    >
                      {schema ? Object.keys(schema.properties).length : 0}
                    </span>
                  </div>
                  {!hasFields && (
                    <p className="text-[10px] text-warning mt-1">
                      Add at least one field
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Content - Schema Studio (Depth 2 Glass) */}
          <div className="rounded-xl bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent shadow-md p-4 min-h-[600px] flex flex-col gap-4">
            <div>
              <h3 className="font-semibold text-primary">Schema Editor</h3>
              <p className="text-sm text-secondary">
                Define the fields and validation rules for this template
              </p>
            </div>
            {schema && (
              <SchemaStudio
                key={template.id}
                initialSchema={schema}
                onChange={handleSchemaChange}
                defaultMode="visual"
                showPreview
                className="h-full flex-1"
              />
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

EditTemplatePage.displayName = 'EditTemplatePage'

export default EditTemplatePage
