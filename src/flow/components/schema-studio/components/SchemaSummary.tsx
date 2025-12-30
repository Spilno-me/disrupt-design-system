/**
 * SchemaSummary - Power user schema overview panel
 *
 * Shows entity template structure in a scannable, technical format:
 * - Field table with types, constraints, relationships
 * - Quick stats (total fields, required, lookups)
 * - Validation warnings
 * - Sample data preview
 *
 * Designed for data architects and power users who need to verify
 * schema structure, not see a form mockup.
 */

import * as React from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Link2,
  Hash,
  Type,
  ToggleLeft,
  Calendar,
  List,
  Box,
  Asterisk,
  Info,
  ChevronDown,
  ChevronRight,
  Braces,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
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
import type { JSONSchema, SchemaField, SchemaFieldType, ValidationError } from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface SchemaSummaryProps {
  schema: JSONSchema
  validationErrors?: ValidationError[]
  className?: string
}

interface FieldSummary {
  key: string
  field: SchemaField
  isRequired: boolean
  constraints: string[]
  lookupTarget?: string
}

// =============================================================================
// HELPERS
// =============================================================================

/** Get icon for field type */
function getTypeIcon(type: SchemaFieldType): React.ReactNode {
  const iconClass = 'size-3.5'
  switch (type) {
    case 'string':
      return <Type className={iconClass} />
    case 'number':
    case 'integer':
      return <Hash className={iconClass} />
    case 'boolean':
      return <ToggleLeft className={iconClass} />
    case 'array':
      return <List className={iconClass} />
    case 'object':
      return <Box className={iconClass} />
    default:
      return <Type className={iconClass} />
  }
}

/** Get display label for field type */
function getTypeLabel(field: SchemaField): string {
  // Check for special formats first
  if (field.format) {
    switch (field.format) {
      case 'date':
        return 'date'
      case 'date-time':
        return 'datetime'
      case 'time':
        return 'time'
      case 'email':
        return 'email'
      case 'uri':
        return 'url'
      case 'uuid':
        return 'uuid'
    }
  }

  // Check for enum (select)
  if (field.enum && field.enum.length > 0) {
    return 'enum'
  }

  // Check for lookup
  if (field['ui:lookup']) {
    return 'lookup'
  }

  // Check for widget hint
  if (field['ui:widget'] === 'textarea') {
    return 'text (long)'
  }

  return field.type
}

/** Extract constraints from field */
function getConstraints(field: SchemaField): string[] {
  const constraints: string[] = []

  // String constraints
  if (field.minLength !== undefined) {
    constraints.push(`min: ${field.minLength}`)
  }
  if (field.maxLength !== undefined) {
    constraints.push(`max: ${field.maxLength}`)
  }
  if (field.pattern) {
    constraints.push(`pattern`)
  }

  // Number constraints
  if (field.minimum !== undefined) {
    constraints.push(`≥ ${field.minimum}`)
  }
  if (field.maximum !== undefined) {
    constraints.push(`≤ ${field.maximum}`)
  }

  // Enum
  if (field.enum && field.enum.length > 0) {
    const enumPreview = field.enum.slice(0, 3).join(', ')
    const suffix = field.enum.length > 3 ? `, +${field.enum.length - 3}` : ''
    constraints.push(`[${enumPreview}${suffix}]`)
  }

  // Default value
  if (field.default !== undefined) {
    constraints.push(`default: ${JSON.stringify(field.default)}`)
  }

  return constraints
}

/** Generate sample data for a field */
function getSampleValue(key: string, field: SchemaField): unknown {
  if (field.default !== undefined) return field.default

  if (field.enum && field.enum.length > 0) {
    return field.enum[0]
  }

  switch (field.type) {
    case 'string':
      if (field.format === 'date') return '2025-01-15'
      if (field.format === 'date-time') return '2025-01-15T09:30:00Z'
      if (field.format === 'email') return 'user@example.com'
      if (field.format === 'uri') return 'https://example.com'
      if (field['ui:lookup']) return `<${field['ui:lookup']}_id>`
      return field.title || key
    case 'number':
      return 42.5
    case 'integer':
      return 42
    case 'boolean':
      return true
    case 'array':
      return ['item1', 'item2']
    case 'object':
      return {}
    default:
      return null
  }
}

/** Analyze schema and generate warnings */
function analyzeSchema(schema: JSONSchema): ValidationError[] {
  const warnings: ValidationError[] = []

  // Check for fields without descriptions
  Object.entries(schema.properties).forEach(([key, field]) => {
    if (!field.description) {
      warnings.push({
        path: key,
        message: `'${field.title || key}' has no description`,
        severity: 'info',
      })
    }
  })

  // Check for enum fields without default
  Object.entries(schema.properties).forEach(([key, field]) => {
    if (field.enum && field.enum.length > 0 && field.default === undefined) {
      warnings.push({
        path: key,
        message: `'${field.title || key}' enum has no default value`,
        severity: 'warning',
      })
    }
  })

  // Check for very long text fields without maxLength
  Object.entries(schema.properties).forEach(([key, field]) => {
    if (field.type === 'string' && field['ui:widget'] === 'textarea' && !field.maxLength) {
      warnings.push({
        path: key,
        message: `'${field.title || key}' textarea has no max length`,
        severity: 'info',
      })
    }
  })

  return warnings
}

// =============================================================================
// COMPONENTS
// =============================================================================

/** Field row in the summary table */
function FieldRow({ summary }: { summary: FieldSummary }) {
  const { key, field, isRequired, constraints, lookupTarget } = summary

  return (
    <tr className="group border-b border-default last:border-b-0 hover:bg-muted-bg/30 transition-colors">
      {/* Field Name */}
      <td className="px-2 py-1.5">
        <div className="flex items-center gap-1">
          <code className="text-[11px] font-mono font-medium text-primary truncate max-w-[120px]">{key}</code>
          {lookupTarget && (
            <Tooltip>
              <TooltipTrigger>
                <Link2 className="size-3 text-accent flex-shrink-0" />
              </TooltipTrigger>
              <TooltipContent>Lookup: {lookupTarget}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </td>

      {/* Type */}
      <td className="px-2 py-1.5">
        <div className="flex items-center gap-1">
          <span className="text-secondary">{getTypeIcon(field.type)}</span>
          <code className="text-[11px] font-mono text-secondary">{getTypeLabel(field)}</code>
        </div>
      </td>

      {/* Required */}
      <td className="px-2 py-1.5 text-center w-8">
        {isRequired ? (
          <Asterisk className="size-3 text-error mx-auto" />
        ) : (
          <span className="text-tertiary text-[10px]">—</span>
        )}
      </td>

      {/* Constraints */}
      <td className="px-2 py-1.5">
        {constraints.length > 0 ? (
          <Tooltip>
            <TooltipTrigger className="text-left">
              <span className="text-[10px] font-mono text-secondary truncate block max-w-[100px]">
                {constraints[0]}
                {constraints.length > 1 && ` +${constraints.length - 1}`}
              </span>
            </TooltipTrigger>
            <TooltipContent className="font-mono text-xs max-w-[200px]">
              {constraints.join('\n')}
            </TooltipContent>
          </Tooltip>
        ) : (
          <span className="text-tertiary text-[10px]">—</span>
        )}
      </td>
    </tr>
  )
}

/** Stats badge component - ultra compact (non-interactive display) */
function StatBadge({
  icon,
  value,
  label,
  variant = 'default',
}: {
  icon: React.ReactNode
  value: number
  label: string
  variant?: 'default' | 'warning' | 'success'
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* Use span instead of button to prevent form submission */}
        <span
          className={cn(
            'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] cursor-default',
            variant === 'default' && 'bg-muted-bg/70 text-secondary',
            variant === 'warning' && 'bg-warning/10 text-warning',
            variant === 'success' && 'bg-success/10 text-success'
          )}
        >
          {icon}
          <span className="font-medium">{value}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent className="text-xs">{label}</TooltipContent>
    </Tooltip>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function SchemaSummary({
  schema,
  validationErrors = [],
  className,
}: SchemaSummaryProps) {
  // State for issues section
  const [isIssuesOpen, setIsIssuesOpen] = React.useState(false)
  const [showAllIssues, setShowAllIssues] = React.useState(false)
  const issuesSectionRef = React.useRef<HTMLDivElement>(null)

  // Process fields
  const fieldSummaries = React.useMemo<FieldSummary[]>(() => {
    const order = schema['ui:order'] || Object.keys(schema.properties)
    const required = new Set(schema.required || [])

    return order
      .filter((key) => key in schema.properties)
      .map((key) => {
        const field = schema.properties[key]
        return {
          key,
          field,
          isRequired: required.has(key),
          constraints: getConstraints(field),
          lookupTarget: field['ui:lookup'],
        }
      })
  }, [schema])

  // Generate sample data
  const sampleData = React.useMemo(() => {
    const data: Record<string, unknown> = {}
    fieldSummaries.forEach(({ key, field }) => {
      data[key] = getSampleValue(key, field)
    })
    return data
  }, [fieldSummaries])

  // Analyze for warnings
  const schemaWarnings = React.useMemo(() => analyzeSchema(schema), [schema])
  const allIssues = [...validationErrors, ...schemaWarnings]

  // Stats
  const stats = React.useMemo(() => {
    const requiredCount = fieldSummaries.filter((f) => f.isRequired).length
    const lookupCount = fieldSummaries.filter((f) => f.lookupTarget).length
    const warningCount = allIssues.filter((e) => e.severity === 'warning').length
    return { total: fieldSummaries.length, required: requiredCount, lookups: lookupCount, warnings: warningCount }
  }, [fieldSummaries, allIssues])

  // Scroll to and open issues section
  const handleWarningClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsIssuesOpen(true)
    // Small delay to allow Collapsible to open before scrolling
    setTimeout(() => {
      issuesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }, [])

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header - Compact */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-default bg-muted-bg/30">
        <span className="text-xs font-medium text-primary">Schema Summary</span>
        <div className="flex items-center gap-1.5">
          <StatBadge
            icon={<Hash className="size-2.5" />}
            value={stats.total}
            label={`${stats.total} fields`}
          />
          <StatBadge
            icon={<Asterisk className="size-2.5" />}
            value={stats.required}
            label={`${stats.required} required`}
          />
          {stats.lookups > 0 && (
            <StatBadge
              icon={<Link2 className="size-2.5" />}
              value={stats.lookups}
              label={`${stats.lookups} lookups`}
            />
          )}
          {stats.warnings > 0 && (
            <button
              type="button"
              onClick={handleWarningClick}
              className="focus:outline-none focus:ring-1 focus:ring-warning rounded"
            >
              <StatBadge
                icon={<AlertTriangle className="size-2.5" />}
                value={stats.warnings}
                label="Click to view issues"
                variant="warning"
              />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Schema Title - Compact */}
        <div className="px-3 py-2 border-b border-default">
          <h3 className="text-xs font-semibold text-primary truncate">
            {schema.title || 'Untitled Schema'}
          </h3>
          {schema.description && (
            <p className="text-[10px] text-secondary mt-0.5 line-clamp-1">{schema.description}</p>
          )}
        </div>

        {/* Field Table */}
        {fieldSummaries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Box className="size-8 text-tertiary opacity-50 mb-2" />
            <p className="text-sm text-secondary">No fields defined</p>
            <p className="text-xs text-tertiary">Add fields in Visual mode</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted-bg/50 border-b border-default">
                  <th className="px-2 py-1.5 text-left text-[10px] font-medium text-secondary uppercase tracking-wide">
                    Field
                  </th>
                  <th className="px-2 py-1.5 text-left text-[10px] font-medium text-secondary uppercase tracking-wide">
                    Type
                  </th>
                  <th className="px-2 py-1.5 text-center text-[10px] font-medium text-secondary uppercase tracking-wide w-8">
                    Req
                  </th>
                  <th className="px-2 py-1.5 text-left text-[10px] font-medium text-secondary uppercase tracking-wide">
                    Constraints
                  </th>
                </tr>
              </thead>
              <tbody>
                {fieldSummaries.map((summary) => (
                  <FieldRow key={summary.key} summary={summary} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Warnings Section - Collapsible & Compact */}
        {allIssues.length > 0 && (
          <div ref={issuesSectionRef}>
            <Collapsible open={isIssuesOpen} onOpenChange={setIsIssuesOpen}>
              <CollapsibleTrigger className="flex items-center gap-2 w-full px-3 py-1.5 border-t border-default hover:bg-muted-bg/30 transition-colors">
                <AlertTriangle className="size-3 text-warning" />
                <span className="text-[10px] font-medium text-secondary flex-1 text-left">
                  {allIssues.length} issue{allIssues.length !== 1 ? 's' : ''}
                </span>
                {isIssuesOpen ? (
                  <ChevronDown className="size-3 text-tertiary" />
                ) : (
                  <ChevronRight className="size-3 text-tertiary" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-3 pb-2 space-y-0.5">
                  {(showAllIssues ? allIssues : allIssues.slice(0, 4)).map((issue, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex items-start gap-1.5 text-[10px] px-1.5 py-0.5 rounded',
                        issue.severity === 'error' && 'bg-error/10 text-error',
                        issue.severity === 'warning' && 'bg-warning/10 text-warning',
                        issue.severity === 'info' && 'bg-accent/5 text-accent'
                      )}
                    >
                      {issue.severity === 'info' ? (
                        <Info className="size-2.5 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="size-2.5 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="truncate">{issue.message}</span>
                    </div>
                  ))}
                  {allIssues.length > 4 && !showAllIssues && (
                    <button
                      type="button"
                      onClick={() => setShowAllIssues(true)}
                      className="text-[10px] text-secondary font-medium hover:text-primary px-1.5 underline underline-offset-2"
                    >
                      +{allIssues.length - 4} more
                    </button>
                  )}
                  {showAllIssues && allIssues.length > 4 && (
                    <button
                      type="button"
                      onClick={() => setShowAllIssues(false)}
                      className="text-[10px] text-tertiary hover:text-secondary px-1.5 hover:underline"
                    >
                      Show less
                    </button>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}

        {/* Sample Data Preview - Expanded by default, fills remaining space */}
        {fieldSummaries.length > 0 && (
          <div className="flex-1 flex flex-col min-h-0 border-t border-default">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted-bg/30">
              <Braces className="size-3 text-secondary" />
              <span className="text-[10px] font-medium text-secondary">Sample Data</span>
            </div>
            <div className="flex-1 px-3 pb-2 min-h-0">
              <pre className="text-[9px] font-mono bg-inverse-bg text-inverse p-2 rounded h-full overflow-auto">
                {JSON.stringify(sampleData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Minimal */}
      <div className="px-3 py-1 border-t border-default text-[10px] text-tertiary flex items-center justify-between">
        <span>{stats.total} fields • {stats.required} required</span>
        {stats.warnings === 0 && stats.total > 0 && (
          <div className="flex items-center gap-0.5 text-success">
            <CheckCircle2 className="size-2.5" />
            <span>Valid</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default SchemaSummary
