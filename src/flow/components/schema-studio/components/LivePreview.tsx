/**
 * LivePreview - Real-time form preview based on schema
 *
 * Renders a non-functional preview of what the form would look like
 * based on the current schema definition.
 */

import * as React from 'react'
import { List, FileText } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Textarea } from '../../../../components/ui/textarea'
import { Label } from '../../../../components/ui/label'
import { Checkbox } from '../../../../components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import type { LivePreviewProps, JSONSchema, SchemaField, UIWidget } from '../types'

// =============================================================================
// FIELD PREVIEW COMPONENTS
// =============================================================================

interface PreviewFieldProps {
  fieldKey: string
  field: SchemaField
  isRequired: boolean
}

function PreviewField({ fieldKey, field, isRequired }: PreviewFieldProps) {
  const widget = field['ui:widget'] || getDefaultWidget(field.type)
  const label = field.title || fieldKey
  const placeholder = field['ui:placeholder'] || `Enter ${label.toLowerCase()}...`

  // Hidden fields
  if (field['ui:hidden']) return null

  return (
    <div className="space-y-1.5">
      {/* Label */}
      <Label className="text-xs font-medium">
        {label}
        {isRequired && <span className="text-error ml-0.5">*</span>}
      </Label>

      {/* Field Widget */}
      {renderWidget(widget, field, placeholder)}

      {/* Description */}
      {field.description && (
        <p className="text-[10px] text-tertiary">{field.description}</p>
      )}
    </div>
  )
}

function getDefaultWidget(type: SchemaField['type']): UIWidget {
  switch (type) {
    case 'boolean':
      return 'checkbox'
    case 'number':
    case 'integer':
      return 'number'
    default:
      return 'text'
  }
}

function renderWidget(
  widget: UIWidget,
  field: SchemaField,
  placeholder: string
): React.ReactNode {
  const isDisabled = field['ui:disabled'] || field['ui:readonly']

  switch (widget) {
    case 'textarea':
      return (
        <Textarea
          placeholder={placeholder}
          rows={field['ui:rows'] || 3}
          disabled={isDisabled}
          className="text-xs resize-none"
        />
      )

    case 'select':
      return (
        <Select disabled={isDisabled}>
          <SelectTrigger className="text-xs h-8">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.enum?.filter((option) => option).map((option) => (
              <SelectItem key={option} value={option} className="text-xs">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )

    case 'radio':
      return (
        <div className="space-y-1">
          {field.enum?.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 text-xs cursor-pointer"
            >
              <input
                type="radio"
                name={field.title || 'radio'}
                disabled={isDisabled}
                className="size-3"
              />
              {option}
            </label>
          ))}
        </div>
      )

    case 'checkbox':
      return (
        <div className="flex items-center gap-2">
          <Checkbox disabled={isDisabled} className="size-4" />
          <span className="text-xs">Yes</span>
        </div>
      )

    case 'date':
    case 'datetime':
    case 'time':
      return (
        <Input
          type={widget === 'time' ? 'time' : widget === 'datetime' ? 'datetime-local' : 'date'}
          disabled={isDisabled}
          className="text-xs h-8"
        />
      )

    case 'email':
      return (
        <Input
          type="email"
          placeholder={placeholder}
          disabled={isDisabled}
          className="text-xs h-8"
        />
      )

    case 'url':
      return (
        <Input
          type="url"
          placeholder="https://example.com"
          disabled={isDisabled}
          className="text-xs h-8"
        />
      )

    case 'tel':
      return (
        <Input
          type="tel"
          placeholder="+1 (555) 000-0000"
          disabled={isDisabled}
          className="text-xs h-8"
        />
      )

    case 'password':
      return (
        <Input
          type="password"
          placeholder="••••••••"
          disabled={isDisabled}
          className="text-xs h-8"
        />
      )

    case 'number':
    case 'range':
      return (
        <Input
          type="number"
          placeholder="0"
          min={field.minimum}
          max={field.maximum}
          disabled={isDisabled}
          className="text-xs h-8"
        />
      )

    case 'file':
      return (
        <div className="flex items-center gap-2 p-2 border border-dashed border-default rounded text-xs text-tertiary">
          <FileText className="size-4" />
          <span>Click to upload or drag file</span>
        </div>
      )

    case 'hidden':
      return null

    default:
      return (
        <Input
          type="text"
          placeholder={placeholder}
          disabled={isDisabled}
          className="text-xs h-8"
        />
      )
  }
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function LivePreview({
  schema,
  className,
}: LivePreviewProps) {
  // Get ordered fields
  const orderedFields = React.useMemo(() => {
    const order = schema['ui:order'] || Object.keys(schema.properties)
    const required = new Set(schema.required || [])

    return order
      .filter((key) => key in schema.properties)
      .map((key) => ({
        key,
        field: schema.properties[key],
        isRequired: required.has(key),
      }))
  }, [schema])

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-default">
        <span className="text-sm font-medium text-primary">Preview</span>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-full">
          {/* Form Card */}
          <div className="bg-surface border border-default rounded-lg shadow-sm overflow-hidden">
            {/* Form Header */}
            <div className="px-4 py-3 border-b border-default bg-muted-bg/30">
              <h3 className="text-sm font-semibold text-primary">
                {schema.title || 'Form Preview'}
              </h3>
              {schema.description && (
                <p className="text-xs text-secondary mt-0.5">
                  {schema.description}
                </p>
              )}
            </div>

            {/* Form Fields */}
            <div className="p-4 space-y-4">
              {orderedFields.length === 0 ? (
                <div className="text-center py-8 text-secondary text-sm">
                  <List className="size-8 mx-auto mb-2 opacity-50" />
                  <p>No fields defined</p>
                  <p className="text-xs">Add fields in Visual mode</p>
                </div>
              ) : (
                orderedFields.map(({ key, field, isRequired }) => (
                  <PreviewField
                    key={key}
                    fieldKey={key}
                    field={field}
                    isRequired={isRequired}
                  />
                ))
              )}
            </div>

            {/* Form Footer */}
            {orderedFields.length > 0 && (
              <div className="px-4 py-3 border-t border-default bg-muted-bg/30 flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" className="text-xs h-7" disabled>
                  Cancel
                </Button>
                <Button type="button" size="sm" className="text-xs h-7" disabled>
                  Submit
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="px-4 py-2 border-t border-default text-xs text-tertiary">
        {orderedFields.length} field{orderedFields.length !== 1 ? 's' : ''} •{' '}
        {orderedFields.filter((f) => f.isRequired).length} required
      </div>
    </div>
  )
}

export default LivePreview
