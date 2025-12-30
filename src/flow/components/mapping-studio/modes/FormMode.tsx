/**
 * FormMode - Row-based mapping editor
 *
 * Simple row-based interface for creating field mappings.
 * Best for quick 1:1 mappings with optional transforms.
 */

import * as React from 'react'
import {
  Plus,
  Trash2,
  ArrowRight,
  GripVertical,
  Wand2,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { Input } from '../../../../components/ui/input'
import { Checkbox } from '../../../../components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../../../components/ui/collapsible'
import { EmptyState } from '../../../../components/ui/EmptyState'
import { useMappingStudio } from '../context/MappingStudioProvider'
import type {
  FieldMapping,
  MappingField,
  TransformConfig,
  TransformType,
} from '../types'
import { TRANSFORM_DEFINITIONS, FIELD_TYPE_LABELS } from '../types'

// =============================================================================
// FIELD SELECTOR
// =============================================================================

interface FieldSelectorProps {
  fields: MappingField[]
  value: string
  onChange: (path: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

function FieldSelector({
  fields,
  value,
  onChange,
  placeholder = 'Select field...',
  disabled,
  className,
}: FieldSelectorProps) {
  const selectedField = fields.find((f) => f.path === value)

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={cn('h-9', className)}>
        <SelectValue placeholder={placeholder}>
          {selectedField && (
            <div className="flex items-center gap-2">
              <span className="truncate">{selectedField.label || selectedField.path}</span>
              <Badge variant="secondary" size="sm" className="text-[10px]">
                {FIELD_TYPE_LABELS[selectedField.type]}
              </Badge>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {fields.map((field) => (
          <SelectItem key={field.path} value={field.path}>
            <div className="flex items-center justify-between gap-4 w-full">
              <div className="flex flex-col">
                <span className="font-medium">{field.label || field.path}</span>
                {field.description && (
                  <span className="text-xs text-secondary truncate max-w-[200px]">
                    {field.description}
                  </span>
                )}
              </div>
              <Badge variant="secondary" size="sm" className="text-[10px] shrink-0">
                {FIELD_TYPE_LABELS[field.type]}
              </Badge>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// =============================================================================
// TRANSFORM SELECTOR
// =============================================================================

interface TransformSelectorProps {
  value: TransformConfig | undefined
  onChange: (transform: TransformConfig | undefined) => void
  disabled?: boolean
  className?: string
}

function TransformSelector({
  value,
  onChange,
  disabled,
  className,
}: TransformSelectorProps) {
  const currentType = value?.type || 'none'

  const handleTypeChange = (type: string) => {
    if (type === 'none') {
      onChange(undefined)
    } else {
      onChange({ type: type as TransformType })
    }
  }

  return (
    <Select value={currentType} onValueChange={handleTypeChange} disabled={disabled}>
      <SelectTrigger className={cn('h-9 w-[160px]', className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {TRANSFORM_DEFINITIONS.map((def) => (
          <SelectItem key={def.type} value={def.type}>
            <div className="flex items-center gap-2">
              <span>{def.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// =============================================================================
// MAPPING ROW
// =============================================================================

interface MappingRowProps {
  mapping: FieldMapping
  index: number
  isSelected: boolean
  sourceFields: MappingField[]
  targetFields: MappingField[]
  readOnly: boolean
  hasError: boolean
  hasWarning: boolean
  onUpdate: (updates: Partial<FieldMapping>) => void
  onDelete: () => void
  onSelect: () => void
}

function MappingRow({
  mapping,
  index,
  isSelected,
  sourceFields,
  targetFields,
  readOnly,
  hasError,
  hasWarning,
  onUpdate,
  onDelete,
  onSelect,
}: MappingRowProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <div
      className={cn(
        'group relative border rounded-lg transition-all',
        isSelected
          ? 'border-accent bg-accent/5 shadow-sm'
          : 'border-default hover:border-accent/50',
        !mapping.enabled && 'opacity-50',
        hasError && 'border-error',
        hasWarning && !hasError && 'border-warning'
      )}
      onClick={onSelect}
    >
      {/* Main Row */}
      <div className="flex items-center gap-2 p-3">
        {/* Drag Handle */}
        {!readOnly && (
          <div className="cursor-grab text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="size-4" />
          </div>
        )}

        {/* Row Number */}
        <span className="text-xs text-secondary w-6 text-center shrink-0">
          {index + 1}
        </span>

        {/* Enable/Disable */}
        <Checkbox
          checked={mapping.enabled}
          onCheckedChange={(checked) => onUpdate({ enabled: !!checked })}
          disabled={readOnly}
          className="shrink-0"
        />

        {/* Source Field */}
        <FieldSelector
          fields={sourceFields}
          value={mapping.sourcePath}
          onChange={(path) => onUpdate({ sourcePath: path })}
          placeholder="Source field..."
          disabled={readOnly}
          className="flex-1 min-w-[180px]"
        />

        {/* Arrow */}
        <ArrowRight className="size-4 text-secondary shrink-0" />

        {/* Target Field */}
        <FieldSelector
          fields={targetFields}
          value={mapping.targetPath}
          onChange={(path) => onUpdate({ targetPath: path })}
          placeholder="Target field..."
          disabled={readOnly}
          className="flex-1 min-w-[180px]"
        />

        {/* Transform */}
        <TransformSelector
          value={mapping.transform}
          onChange={(transform) => onUpdate({ transform })}
          disabled={readOnly}
        />

        {/* Status Indicator */}
        {hasError && (
          <Tooltip>
            <TooltipTrigger>
              <AlertCircle className="size-4 text-error shrink-0" />
            </TooltipTrigger>
            <TooltipContent>Has validation errors</TooltipContent>
          </Tooltip>
        )}
        {hasWarning && !hasError && (
          <Tooltip>
            <TooltipTrigger>
              <AlertCircle className="size-4 text-warning shrink-0" />
            </TooltipTrigger>
            <TooltipContent>Has warnings</TooltipContent>
          </Tooltip>
        )}
        {!hasError && !hasWarning && mapping.enabled && mapping.sourcePath && mapping.targetPath && (
          <CheckCircle2 className="size-4 text-success shrink-0" />
        )}

        {/* Expand/Collapse (for notes) */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="size-8 p-0 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <ChevronDown
                className={cn(
                  'size-4 transition-transform',
                  isExpanded && 'rotate-180'
                )}
              />
            </Button>
          </CollapsibleTrigger>
        </Collapsible>

        {/* Delete */}
        {!readOnly && (
          <Button
            variant="ghost"
            size="sm"
            className="size-8 p-0 opacity-0 group-hover:opacity-100 text-error hover:text-error hover:bg-error/10 shrink-0"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>

      {/* Expanded Content (Notes) */}
      <Collapsible open={isExpanded}>
        <CollapsibleContent>
          <div className="px-3 pb-3 pt-0 border-t border-default">
            <div className="pt-3">
              <label className="text-xs text-secondary mb-1 block">Notes</label>
              <Input
                value={mapping.notes || ''}
                onChange={(e) => onUpdate({ notes: e.target.value })}
                placeholder="Add notes about this mapping..."
                disabled={readOnly}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

// =============================================================================
// FORM MODE
// =============================================================================

export interface FormModeProps {
  className?: string
}

export function FormMode({ className }: FormModeProps) {
  const {
    config,
    sourceFields,
    targetFields,
    filteredMappings,
    selectedMappingId,
    selectMapping,
    addMapping,
    updateMapping,
    removeMapping,
    autoMap,
    validationErrors,
    readOnly,
    searchQuery,
    setSearchQuery,
  } = useMappingStudio()

  // Get error/warning status for each mapping
  const getMappingStatus = (mappingId: string) => {
    const errors = validationErrors.filter((e) => e.path === mappingId)
    return {
      hasError: errors.some((e) => e.severity === 'error'),
      hasWarning: errors.some((e) => e.severity === 'warning'),
    }
  }

  const handleAddMapping = () => {
    addMapping({
      sourcePath: '',
      targetPath: '',
      enabled: true,
    })
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-3 p-4 border-b border-default">
        {/* Search */}
        <Input
          placeholder="Search mappings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs h-9"
        />

        <div className="flex-1" />

        {/* Actions */}
        {!readOnly && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={autoMap}
                  className="gap-2"
                >
                  <Wand2 className="size-4" />
                  Auto-Map
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Automatically map fields with matching names
              </TooltipContent>
            </Tooltip>

            <Button size="sm" onClick={handleAddMapping} className="gap-2">
              <Plus className="size-4" />
              Add Mapping
            </Button>
          </>
        )}
      </div>

      {/* Mapping Stats */}
      <div className="flex items-center gap-4 px-4 py-2 text-sm border-b border-default bg-page">
        <span className="text-secondary">
          {config.mappings.length} mapping{config.mappings.length !== 1 ? 's' : ''}
        </span>
        <span className="text-secondary">•</span>
        <span className="text-success">
          {config.mappings.filter((m) => m.enabled).length} enabled
        </span>
        {validationErrors.filter((e) => e.severity === 'error').length > 0 && (
          <>
            <span className="text-secondary">•</span>
            <span className="text-error">
              {validationErrors.filter((e) => e.severity === 'error').length} errors
            </span>
          </>
        )}
        {validationErrors.filter((e) => e.severity === 'warning').length > 0 && (
          <>
            <span className="text-secondary">•</span>
            <span className="text-warning">
              {validationErrors.filter((e) => e.severity === 'warning').length} warnings
            </span>
          </>
        )}
      </div>

      {/* Mapping List */}
      <div className="flex-1 overflow-auto p-4">
        {filteredMappings.length > 0 ? (
          <div className="space-y-2">
            {filteredMappings.map((mapping, index) => {
              const { hasError, hasWarning } = getMappingStatus(mapping.id)
              return (
                <MappingRow
                  key={mapping.id}
                  mapping={mapping}
                  index={index}
                  isSelected={mapping.id === selectedMappingId}
                  sourceFields={sourceFields}
                  targetFields={targetFields}
                  readOnly={readOnly}
                  hasError={hasError}
                  hasWarning={hasWarning}
                  onUpdate={(updates) => updateMapping(mapping.id, updates)}
                  onDelete={() => removeMapping(mapping.id)}
                  onSelect={() => selectMapping(mapping.id)}
                />
              )
            })}
          </div>
        ) : searchQuery ? (
          <EmptyState
            variant="search"
            title="No mappings found"
            description={`No mappings match "${searchQuery}"`}
            actionLabel="Clear search"
            onAction={() => setSearchQuery('')}
          />
        ) : (
          <EmptyState
            variant="default"
            title="No mappings yet"
            description="Add field mappings to connect source and target schemas"
            actionLabel={readOnly ? undefined : 'Add Mapping'}
            onAction={readOnly ? undefined : handleAddMapping}
          />
        )}
      </div>
    </div>
  )
}

FormMode.displayName = 'FormMode'

export default FormMode
