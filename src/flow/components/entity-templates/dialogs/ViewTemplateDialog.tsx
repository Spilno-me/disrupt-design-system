/**
 * ViewTemplateDialog - Read-only view of entity template details
 *
 * Displays template configuration and visual schema preview.
 * Responsive: Full-screen sheet on mobile, centered dialog on desktop.
 */

import * as React from 'react'
import {
  FileText,
  Settings,
  Calendar,
  Tag,
  Hash,
  Info,
  Layers,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { useIsMobile } from '../../../../hooks/useIsMobile'
import { BREAKPOINTS } from '../../../../constants/appConstants'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { CopyButton } from '../../../../components/ui/CopyButton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../../../components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '../../../../components/ui/sheet'
import type { JSONSchema } from '../../schema-studio/types'
import type { ViewTemplateDialogProps } from '../types'
import { getCategoryInfo, CATEGORY_ICONS, CATEGORY_COLORS } from '../types'
import { SchemaFieldsList, EnhancedSchemaFields, JsonSchemaViewer } from './view-components'

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
// DATE FORMATTING
// =============================================================================

function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return isoString
  }
}

// =============================================================================
// MOBILE CONTENT COMPONENT (Compact)
// =============================================================================

interface MobileContentProps {
  template: NonNullable<ViewTemplateDialogProps['template']>
  schema: JSONSchema
}

function MobileContent({ template, schema }: MobileContentProps) {
  return (
    <div className="flex flex-col" data-testid={`view-template-mobile-${template.id}`}>
      {/* Template metadata badges */}
      <div className="flex flex-wrap items-center gap-2" data-testid={`view-template-metadata-${template.id}`}>
        <div className="flex items-center gap-1">
          <code className="text-sm font-mono font-medium text-primary bg-muted-bg px-2 py-0.5 rounded" data-testid={`view-template-code-${template.id}`}>
            {template.code}
          </code>
          <CopyButton value={template.code} label="Copy template code" data-testid={`view-template-copy-code-${template.id}`} />
        </div>
        <Badge variant="outline" size="sm" data-testid={`view-template-version-${template.id}`}>
          v{template.version}
        </Badge>
        <Badge
          variant={template.isSystem ? 'warning' : 'outline'}
          size="sm"
          data-testid={`view-template-type-${template.id}`}
          className={cn(
            template.isSystem
              ? 'bg-sunrise-100 text-sunrise-700 border-sunrise-200'
              : 'bg-muted-bg text-secondary border-default'
          )}
        >
          {template.isSystem ? 'System' : 'Custom'}
        </Badge>
      </div>

      {/* Content area */}
      <div className="space-y-4 mt-4">
        {/* Business Key (if present) */}
        {template.businessKeyTemplate && (
          <div className="rounded-lg border border-default p-3" data-testid={`view-template-business-key-${template.id}`}>
            <label className="text-xs font-medium text-tertiary uppercase tracking-wide">Business Key</label>
            <div className="mt-1 flex items-center gap-2">
              <code className="text-sm font-mono bg-muted-bg px-2 py-1 rounded truncate flex-1">
                {template.businessKeyTemplate}
              </code>
              <CopyButton value={template.businessKeyTemplate} label="Copy business key pattern" data-testid={`view-template-copy-business-key-${template.id}`} />
            </div>
          </div>
        )}

        {/* Fields Section */}
        <div className="rounded-lg border border-default p-4" data-testid={`view-template-fields-${template.id}`}>
          <h3 className="font-semibold text-primary text-sm mb-3">Fields</h3>
          <SchemaFieldsList schema={schema} />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex flex-col">
        <SheetClose asChild>
          <Button variant="outline" className="w-full" data-testid={`view-template-close-${template.id}`}>
            Close
          </Button>
        </SheetClose>
      </div>
    </div>
  )
}

// =============================================================================
// DESKTOP CONTENT COMPONENT (Rich)
// =============================================================================

interface DesktopContentProps {
  template: NonNullable<ViewTemplateDialogProps['template']>
  schema: JSONSchema
  onClose: () => void
}

function DesktopContent({ template, schema, onClose }: DesktopContentProps) {
  const categoryInfo = getCategoryInfo(template.category)
  const CategoryIcon = CATEGORY_ICONS[template.category] || Layers

  return (
    <div className="flex flex-col" data-testid={`view-template-desktop-${template.id}`}>
      {/* Top metadata row */}
      <div className="flex flex-wrap items-center gap-2 mt-2" data-testid={`view-template-metadata-${template.id}`}>
        <div className="flex items-center gap-1">
          <code className="text-sm font-mono font-medium text-primary bg-muted-bg px-2 py-0.5 rounded" data-testid={`view-template-code-${template.id}`}>
            {template.code}
          </code>
          <CopyButton value={template.code} label="Copy template code" data-testid={`view-template-copy-code-${template.id}`} />
        </div>
        <Badge variant="outline" size="sm" data-testid={`view-template-version-${template.id}`}>
          v{template.version}
        </Badge>
        <Badge
          variant={template.isSystem ? 'warning' : 'outline'}
          size="sm"
          data-testid={`view-template-type-${template.id}`}
          className={cn(
            template.isSystem
              ? 'bg-sunrise-100 text-sunrise-700 border-sunrise-200'
              : 'bg-muted-bg text-secondary border-default'
          )}
        >
          {template.isSystem ? 'System' : 'Custom'}
        </Badge>
      </div>

      {/* Description (if available) */}
      {template.description && (
        <p className="text-sm text-secondary mt-3" data-testid={`view-template-description-${template.id}`}>
          {template.description}
        </p>
      )}

      {/* Schema-level description (if different from template) */}
      {schema.description && schema.description !== template.description && (
        <div className="mt-3 p-3 rounded-lg bg-accent/5 border border-accent/20" data-testid={`view-template-schema-description-${template.id}`}>
          <div className="flex items-start gap-2">
            <Info className="size-4 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-accent mb-1">Schema Description</p>
              <p className="text-sm text-secondary">{schema.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content sections */}
      <div className="space-y-4 mt-4">
        {/* Overview Section - Category, Dates, IDs, Business Key */}
        <div className="rounded-lg border border-default p-4" data-testid={`view-template-overview-${template.id}`}>
          <div className="flex items-center gap-2 mb-3">
            <Settings className="size-4 text-secondary" />
            <h3 className="font-semibold text-primary text-sm">Overview</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div data-testid={`view-template-category-${template.id}`}>
              <label className="text-xs font-medium text-tertiary uppercase tracking-wide flex items-center gap-1">
                <Tag className="size-3" />
                Category
              </label>
              <div className="mt-1 flex items-center gap-2">
                <div className={cn(
                  'inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-sm font-medium',
                  CATEGORY_COLORS[template.category] || 'bg-muted-bg text-secondary border-default'
                )}>
                  <CategoryIcon className="size-3.5" />
                  {categoryInfo.name}
                </div>
              </div>
            </div>

            {/* Template ID */}
            <div data-testid={`view-template-id-display-${template.id}`}>
              <label className="text-xs font-medium text-tertiary uppercase tracking-wide flex items-center gap-1">
                <Hash className="size-3" />
                Template ID
              </label>
              <div className="mt-1 flex items-center gap-1">
                <code className="text-xs font-mono text-secondary bg-muted-bg px-1.5 py-0.5 rounded truncate max-w-[150px]">
                  {template.id}
                </code>
                <CopyButton value={template.id} label="Copy template ID" data-testid={`view-template-copy-id-${template.id}`} />
              </div>
            </div>

            {/* Created */}
            <div data-testid={`view-template-created-${template.id}`}>
              <label className="text-xs font-medium text-tertiary uppercase tracking-wide flex items-center gap-1">
                <Calendar className="size-3" />
                Created
              </label>
              <p className="mt-1 text-sm text-primary">
                {formatDate(template.createdAt)}
              </p>
            </div>

            {/* Updated (if different from created) */}
            {template.updatedAt && template.updatedAt !== template.createdAt && (
              <div data-testid={`view-template-updated-${template.id}`}>
                <label className="text-xs font-medium text-tertiary uppercase tracking-wide">
                  Last Updated
                </label>
                <p className="mt-1 text-sm text-primary">
                  {formatDate(template.updatedAt)}
                </p>
              </div>
            )}

            {/* Business Key Template */}
            {template.businessKeyTemplate && (
              <div className="col-span-2" data-testid={`view-template-business-key-${template.id}`}>
                <label className="text-xs font-medium text-tertiary uppercase tracking-wide">
                  Business Key Pattern
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <code className="text-sm font-mono bg-muted-bg px-2 py-1 rounded">
                    {template.businessKeyTemplate}
                  </code>
                  <CopyButton value={template.businessKeyTemplate} label="Copy business key pattern" data-testid={`view-template-copy-business-key-${template.id}`} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Schema Fields Section - Enhanced view */}
        <div className="rounded-lg border border-default p-4" data-testid={`view-template-fields-${template.id}`}>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="size-4 text-secondary" />
            <h3 className="font-semibold text-primary text-sm">Schema Fields</h3>
          </div>
          <EnhancedSchemaFields schema={schema} />
        </div>

        {/* Raw JSON Schema - Collapsible */}
        <JsonSchemaViewer jsonSchema={template.jsonSchema} />
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={onClose} data-testid={`view-template-close-${template.id}`}>
          Close
        </Button>
      </div>
    </div>
  )
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ViewTemplateDialog - Read-only view of entity template details.
 *
 * @component MOLECULE
 * @testId Auto-generated: `view-template-{element}-${template.id}`
 *
 * Test IDs follow pattern: `view-template-{element}-${template.id}`
 * - `view-template-dialog-${id}` - Root dialog/sheet container
 * - `view-template-title-${id}` - Template name
 * - `view-template-mobile-${id}` - Mobile content wrapper
 * - `view-template-desktop-${id}` - Desktop content wrapper
 * - `view-template-code-${id}` - Template code badge
 * - `view-template-version-${id}` - Version badge
 * - `view-template-type-${id}` - System/Custom badge
 * - `view-template-category-${id}` - Category display
 * - `view-template-fields-${id}` - Schema fields section
 * - `view-template-field-${fieldName}` - Individual field card
 * - `view-template-close-${id}` - Close button
 * - `view-template-json-viewer` - JSON schema viewer
 * - `view-template-json-toggle` - JSON viewer toggle
 */
export function ViewTemplateDialog({ template, open, onOpenChange }: ViewTemplateDialogProps) {
  const isMobile = useIsMobile(BREAKPOINTS.LG)

  const schema = React.useMemo(
    () => (template ? parseSchemaString(template.jsonSchema) : null),
    [template?.jsonSchema]
  )

  if (!template || !schema) return null

  const handleClose = () => onOpenChange(false)

  // Mobile: Bottom sheet - auto height with max, content-driven
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="max-h-[85vh] rounded-t-xl p-0 overflow-y-auto"
          data-testid={`view-template-dialog-${template.id}`}
        >
          {/* Drag handle indicator */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-muted" />
          </div>

          {/* Header */}
          <SheetHeader className="px-4 pb-3 border-b border-default">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 p-2 rounded-lg bg-accent/10">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <SheetTitle
                  className="text-base font-semibold truncate"
                  data-testid={`view-template-title-${template.id}`}
                >
                  {template.name}
                </SheetTitle>
                <SheetDescription className="text-sm">
                  Template details
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* Content - compact mobile view */}
          <div className="p-4 pb-8">
            <MobileContent template={template} schema={schema} />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop: Centered dialog with rich details
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        data-testid={`view-template-dialog-${template.id}`}
      >
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 rounded-lg bg-muted-bg">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle
                className="text-lg font-semibold"
                data-testid={`view-template-title-${template.id}`}
              >
                {template.name}
              </DialogTitle>
              <DialogDescription className="mt-1">
                Template configuration and schema details
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DesktopContent
          template={template}
          schema={schema}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  )
}

ViewTemplateDialog.displayName = 'ViewTemplateDialog'

export default ViewTemplateDialog
