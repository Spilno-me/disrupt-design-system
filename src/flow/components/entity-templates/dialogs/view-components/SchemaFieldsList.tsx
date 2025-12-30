/**
 * SchemaFieldsList - Mobile-friendly summary of schema fields
 *
 * Displays a compact list of fields with type badges.
 * Used in ViewTemplateDialog mobile view.
 *
 * @component ATOM
 */

import * as React from 'react'
import { Badge } from '../../../../../components/ui/badge'
import type { JSONSchema } from '../../../schema-studio/types'

// =============================================================================
// TYPES
// =============================================================================

export interface SchemaFieldsListProps {
  schema: JSONSchema
}

// =============================================================================
// COMPONENT
// =============================================================================

export function SchemaFieldsList({ schema }: SchemaFieldsListProps) {
  const fields = React.useMemo(() => {
    const props = schema.properties || {}
    const required = new Set(schema.required || [])
    const order = schema['ui:order'] || Object.keys(props)

    return order
      .filter(key => props[key])
      .map(key => ({
        name: key,
        title: props[key].title || key,
        type: props[key].type || 'string',
        isRequired: required.has(key),
      }))
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
    <div className="space-y-2" data-testid="view-template-fields-list">
      {fields.map(field => (
        <div
          key={field.name}
          data-testid={`view-template-field-${field.name}`}
          className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted-bg/50"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium text-primary truncate">
              {field.title}
            </span>
            {field.isRequired && (
              <span className="text-error text-xs">*</span>
            )}
          </div>
          <Badge variant="outline" size="sm" className="shrink-0 text-xs">
            {field.type}
          </Badge>
        </div>
      ))}
      <p className="text-xs text-tertiary mt-2">
        {requiredCount} required field{requiredCount !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

SchemaFieldsList.displayName = 'SchemaFieldsList'

export default SchemaFieldsList
