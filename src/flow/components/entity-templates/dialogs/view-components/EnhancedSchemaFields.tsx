/**
 * EnhancedSchemaFields - Rich schema field display for desktop
 *
 * Shows full field details including validation, UI hints, and constraints.
 * Used in ViewTemplateDialog desktop view.
 *
 * @component MOLECULE
 */

import * as React from 'react'
import { Badge } from '../../../../../components/ui/badge'
import type { JSONSchema } from '../../../schema-studio/types'

// =============================================================================
// UI WIDGET LABELS
// =============================================================================

const UI_WIDGET_LABELS: Record<string, string> = {
  text: 'Text Input',
  textarea: 'Text Area',
  select: 'Dropdown',
  radio: 'Radio Buttons',
  checkbox: 'Checkbox',
  date: 'Date Picker',
  datetime: 'Date & Time',
  time: 'Time Picker',
  file: 'File Upload',
  number: 'Number Input',
  email: 'Email Input',
  url: 'URL Input',
  tel: 'Phone Input',
  password: 'Password',
  hidden: 'Hidden',
  range: 'Slider',
  color: 'Color Picker',
}

// =============================================================================
// TYPES
// =============================================================================

export interface EnhancedSchemaFieldsProps {
  schema: JSONSchema
}

/** Extended property type with UI hints */
interface ExtendedSchemaProperty {
  'ui:widget'?: string
  'ui:placeholder'?: string
  'ui:lookup'?: string
  'ui:hidden'?: boolean
  'ui:readonly'?: boolean
  'ui:visibleWhen'?: { field: string; value: unknown }
  pattern?: string
  default?: unknown
}

/** Parsed field with all extracted metadata */
interface ParsedSchemaField {
  name: string
  title: string
  type: string
  description?: string
  isRequired: boolean
  defaultValue?: unknown
  enumValues?: string[]
  format?: string
  pattern?: string
  minLength?: number
  maxLength?: number
  minimum?: number
  maximum?: number
  widget?: string
  placeholder?: string
  lookup?: string
  hidden?: boolean
  readonly?: boolean
  visibleWhen?: { field: string; value: unknown }
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Parse a single schema property into a structured field object
 */
function parseSchemaField(
  key: string,
  prop: JSONSchema['properties'][string],
  isRequired: boolean
): ParsedSchemaField {
  const extended = prop as typeof prop & ExtendedSchemaProperty

  return {
    name: key,
    title: prop.title || key,
    type: prop.type || 'string',
    description: prop.description,
    isRequired,
    // Values
    defaultValue: extended.default,
    enumValues: prop.enum,
    // Validations
    format: prop.format,
    pattern: extended.pattern,
    minLength: prop.minLength,
    maxLength: prop.maxLength,
    minimum: prop.minimum,
    maximum: prop.maximum,
    // UI hints
    widget: extended['ui:widget'],
    placeholder: extended['ui:placeholder'],
    lookup: extended['ui:lookup'],
    hidden: extended['ui:hidden'],
    readonly: extended['ui:readonly'],
    // Conditional
    visibleWhen: extended['ui:visibleWhen'],
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export function EnhancedSchemaFields({ schema }: EnhancedSchemaFieldsProps) {
  const fields = React.useMemo(() => {
    const props = schema.properties || {}
    const required = new Set(schema.required || [])
    const order = schema['ui:order'] || Object.keys(props)

    return order
      .filter(key => props[key])
      .map(key => parseSchemaField(key, props[key], required.has(key)))
  }, [schema])

  const requiredCount = React.useMemo(
    () => fields.filter(f => f.isRequired).length,
    [fields]
  )

  if (fields.length === 0) {
    return (
      <p className="text-sm text-secondary italic">No fields defined</p>
    )
  }

  return (
    <div className="space-y-3" data-testid="view-template-enhanced-fields">
      {fields.map(field => (
        <div
          key={field.name}
          data-testid={`view-template-field-${field.name}`}
          className="rounded-lg border border-default p-3 bg-surface"
        >
          {/* Field header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-wrap">
              <span className="text-sm font-medium text-primary">
                {field.title}
              </span>
              {field.isRequired && (
                <Badge variant="destructive" size="sm" className="text-xs">
                  Required
                </Badge>
              )}
              {field.hidden && (
                <Badge variant="outline" size="sm" className="text-xs">
                  Hidden
                </Badge>
              )}
              {field.readonly && (
                <Badge variant="outline" size="sm" className="text-xs">
                  Read-only
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {field.widget && (
                <Badge variant="secondary" size="sm" className="text-xs">
                  {UI_WIDGET_LABELS[field.widget] || field.widget}
                </Badge>
              )}
              <Badge variant="outline" size="sm" className="text-xs font-mono">
                {field.type}{field.format ? `:${field.format}` : ''}
              </Badge>
            </div>
          </div>

          {/* Field description */}
          {field.description && (
            <p className="text-sm text-secondary mt-1.5">
              {field.description}
            </p>
          )}

          {/* Field details grid */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-tertiary">
            {/* Default value */}
            {field.defaultValue !== undefined && (
              <span>
                Default: <code className="bg-muted-bg px-1 rounded">{String(field.defaultValue)}</code>
              </span>
            )}

            {/* Placeholder */}
            {field.placeholder && (
              <span>
                Placeholder: "{field.placeholder}"
              </span>
            )}

            {/* Lookup reference */}
            {field.lookup && (
              <span className="text-accent">
                Lookup: {field.lookup}
              </span>
            )}

            {/* Enum options */}
            {field.enumValues && (
              <span>
                Options: {field.enumValues.slice(0, 3).join(', ')}
                {field.enumValues.length > 3 && ` +${field.enumValues.length - 3} more`}
              </span>
            )}

            {/* Pattern */}
            {field.pattern && (
              <span>
                Pattern: <code className="bg-muted-bg px-1 rounded">{field.pattern}</code>
              </span>
            )}

            {/* Length constraints */}
            {(field.minLength !== undefined || field.maxLength !== undefined) && (
              <span>
                Length: {field.minLength ?? 0}–{field.maxLength ?? '∞'}
              </span>
            )}

            {/* Range constraints */}
            {(field.minimum !== undefined || field.maximum !== undefined) && (
              <span>
                Range: {field.minimum ?? '–∞'}–{field.maximum ?? '∞'}
              </span>
            )}

            {/* Conditional visibility */}
            {field.visibleWhen && (
              <span className="text-warning-dark">
                Conditional: when {field.visibleWhen.field} = {String(field.visibleWhen.value)}
              </span>
            )}
          </div>
        </div>
      ))}

      {/* Summary */}
      <div className="flex items-center justify-between text-xs text-tertiary pt-2 border-t border-default">
        <span>{fields.length} field{fields.length !== 1 ? 's' : ''}</span>
        <span>{requiredCount} required</span>
      </div>
    </div>
  )
}

EnhancedSchemaFields.displayName = 'EnhancedSchemaFields'

export default EnhancedSchemaFields
