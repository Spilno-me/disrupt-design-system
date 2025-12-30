/**
 * FieldEditor - Dialog for editing schema field properties
 *
 * Comprehensive form for editing all field attributes including
 * type, validations, UI hints, and enum options.
 *
 * @component MOLECULE
 * @testId Auto-generated: field-editor-dialog, field-editor-tab-{tab},
 *         field-editor-save, field-editor-cancel, field-editor-delete
 */

import * as React from 'react'
import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  X,
  Trash2,
  Plus,
  GripVertical,
  AlertCircle,
  Info,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import { Textarea } from '../../../../components/ui/textarea'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs'
import type {
  FieldEditorProps,
  SchemaField,
  SchemaFieldType,
  UIWidget,
  FIELD_TYPE_CONFIGS,
  WIDGET_CONFIGS,
} from '../types'

// =============================================================================
// CONSTANTS
// =============================================================================

const FIELD_TYPES: { value: SchemaFieldType; label: string }[] = [
  { value: 'string', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'integer', label: 'Integer' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'array', label: 'Array' },
  { value: 'object', label: 'Object' },
]

const STRING_WIDGETS: { value: UIWidget; label: string }[] = [
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'select', label: 'Dropdown' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'date', label: 'Date Picker' },
  { value: 'datetime', label: 'Date & Time' },
  { value: 'time', label: 'Time Picker' },
  { value: 'email', label: 'Email' },
  { value: 'url', label: 'URL' },
  { value: 'tel', label: 'Phone' },
  { value: 'password', label: 'Password' },
  { value: 'file', label: 'File Upload' },
  { value: 'hidden', label: 'Hidden' },
]

const NUMBER_WIDGETS: { value: UIWidget; label: string }[] = [
  { value: 'number', label: 'Number Input' },
  { value: 'range', label: 'Range Slider' },
  { value: 'select', label: 'Dropdown' },
  { value: 'radio', label: 'Radio Buttons' },
]

const BOOLEAN_WIDGETS: { value: UIWidget; label: string }[] = [
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio (Yes/No)' },
  { value: 'select', label: 'Dropdown' },
]

// Placeholder value for "no selection" since Radix Select forbids empty strings
const NONE_VALUE = '__none__'

const STRING_FORMATS: { value: string; label: string }[] = [
  { value: NONE_VALUE, label: 'None' },
  { value: 'email', label: 'Email' },
  { value: 'uri', label: 'URL' },
  { value: 'uuid', label: 'UUID' },
  { value: 'date', label: 'Date (YYYY-MM-DD)' },
  { value: 'date-time', label: 'Date-Time (ISO 8601)' },
  { value: 'time', label: 'Time (HH:MM:SS)' },
]

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

interface FormFieldProps {
  label: string
  htmlFor: string
  description?: string
  required?: boolean
  error?: string
  children: React.ReactNode
}

function FormField({
  label,
  htmlFor,
  description,
  required,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1">
        <Label htmlFor={htmlFor} className={error ? 'text-error' : undefined}>
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </Label>
        {description && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="size-3.5 text-tertiary cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              {description}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      {children}
      {error && (
        <p className="text-xs text-error flex items-center gap-1">
          <AlertCircle className="size-3" />
          {error}
        </p>
      )}
    </div>
  )
}

// =============================================================================
// ENUM OPTIONS EDITOR
// =============================================================================

interface EnumOption {
  value: string
  label?: string
}

interface EnumOptionsEditorProps {
  options: string[]
  onChange: (options: string[]) => void
}

function EnumOptionsEditor({ options, onChange }: EnumOptionsEditorProps) {
  const handleAdd = () => {
    onChange([...options, ''])
  }

  const handleRemove = (index: number) => {
    onChange(options.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    onChange(newOptions)
  }

  return (
    <div className="space-y-2">
      {options.map((option, index) => (
        <div key={index} className="flex items-center gap-2">
          <GripVertical className="size-4 text-tertiary cursor-grab" />
          <Input
            value={option}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder={`Option ${index + 1}`}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="size-8 p-0 text-error hover:text-error hover:bg-error/10"
            onClick={() => handleRemove(index)}
            disabled={options.length <= 1}
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
        className="w-full"
      >
        <Plus className="size-4" />
        Add Option
      </Button>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function FieldEditor({
  field,
  open,
  onOpenChange,
  onSave,
  onDelete,
  existingKeys,
  lookupOptions,
}: FieldEditorProps) {
  // Form state
  const [key, setKey] = useState('')
  const [type, setType] = useState<SchemaFieldType>('string')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isRequired, setIsRequired] = useState(false)
  const [widget, setWidget] = useState<UIWidget | ''>('')
  const [format, setFormat] = useState('')
  const [defaultValue, setDefaultValue] = useState('')
  const [placeholder, setPlaceholder] = useState('')
  const [enumOptions, setEnumOptions] = useState<string[]>([])
  const [minLength, setMinLength] = useState<number | ''>('')
  const [maxLength, setMaxLength] = useState<number | ''>('')
  const [minimum, setMinimum] = useState<number | ''>('')
  const [maximum, setMaximum] = useState<number | ''>('')
  const [pattern, setPattern] = useState('')
  const [rows, setRows] = useState<number | ''>('')
  const [lookup, setLookup] = useState('')
  const [isHidden, setIsHidden] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [isReadonly, setIsReadonly] = useState(false)

  // UI state
  const [activeTab, setActiveTab] = useState('basic')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Derived state
  const isNewField = !field
  const originalKey = field?.key || ''

  // Initialize form from field
  useEffect(() => {
    if (field) {
      setKey(field.key)
      setType(field.type)
      setTitle(field.title || '')
      setDescription(field.description || '')
      setIsRequired(field.isRequired)
      setWidget((field['ui:widget'] as UIWidget) || '')
      setFormat(field.format || '')
      setDefaultValue(field.default !== undefined ? String(field.default) : '')
      setPlaceholder(field['ui:placeholder'] || '')
      setEnumOptions(field.enum || [])
      setMinLength(field.minLength ?? '')
      setMaxLength(field.maxLength ?? '')
      setMinimum(field.minimum ?? '')
      setMaximum(field.maximum ?? '')
      setPattern(field.pattern || '')
      setRows(field['ui:rows'] ?? '')
      setLookup(field['ui:lookup'] || '')
      setIsHidden(field['ui:hidden'] || false)
      setIsDisabled(field['ui:disabled'] || false)
      setIsReadonly(field['ui:readonly'] || false)
    } else {
      // Reset to defaults for new field
      setKey('')
      setType('string')
      setTitle('')
      setDescription('')
      setIsRequired(false)
      setWidget('')
      setFormat('')
      setDefaultValue('')
      setPlaceholder('')
      setEnumOptions([])
      setMinLength('')
      setMaxLength('')
      setMinimum('')
      setMaximum('')
      setPattern('')
      setRows('')
      setLookup('')
      setIsHidden(false)
      setIsDisabled(false)
      setIsReadonly(false)
    }
    setErrors({})
    setActiveTab('basic')
  }, [field, open])

  // Get available widgets based on type
  const availableWidgets = useMemo(() => {
    switch (type) {
      case 'string':
        return STRING_WIDGETS
      case 'number':
      case 'integer':
        return NUMBER_WIDGETS
      case 'boolean':
        return BOOLEAN_WIDGETS
      default:
        return []
    }
  }, [type])

  // Whether to show enum options
  const showEnumOptions = widget === 'select' || widget === 'radio'

  // Validate form
  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {}

    // Key is required
    if (!key.trim()) {
      newErrors.key = 'Field key is required'
    } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
      newErrors.key = 'Key must start with letter/underscore, contain only letters, numbers, underscores'
    } else if (key !== originalKey && existingKeys.includes(key)) {
      newErrors.key = 'A field with this key already exists'
    }

    // Enum options required for select/radio
    if (showEnumOptions && enumOptions.filter((o) => o.trim()).length === 0) {
      newErrors.enum = 'At least one option is required'
    }

    // Numeric validations
    if (minLength !== '' && maxLength !== '' && minLength > maxLength) {
      newErrors.minLength = 'Min must be less than max'
    }
    if (minimum !== '' && maximum !== '' && minimum > maximum) {
      newErrors.minimum = 'Min must be less than max'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [key, originalKey, existingKeys, showEnumOptions, enumOptions, minLength, maxLength, minimum, maximum])

  // Handle save
  const handleSave = useCallback(() => {
    if (!validate()) return

    const fieldData: SchemaField = {
      type,
      ...(title && { title }),
      ...(description && { description }),
      ...(format && { format: format as SchemaField['format'] }),
      ...(defaultValue && { default: type === 'number' || type === 'integer' ? Number(defaultValue) : type === 'boolean' ? defaultValue === 'true' : defaultValue }),
      ...(widget && { 'ui:widget': widget as UIWidget }),
      ...(placeholder && { 'ui:placeholder': placeholder }),
      ...(rows !== '' && { 'ui:rows': Number(rows) }),
      ...(enumOptions.length > 0 && showEnumOptions && { enum: enumOptions.filter((o) => o.trim()) }),
      ...(minLength !== '' && { minLength: Number(minLength) }),
      ...(maxLength !== '' && { maxLength: Number(maxLength) }),
      ...(minimum !== '' && { minimum: Number(minimum) }),
      ...(maximum !== '' && { maximum: Number(maximum) }),
      ...(pattern && { pattern }),
      ...(lookup && { 'ui:lookup': lookup }),
      ...(isHidden && { 'ui:hidden': true }),
      ...(isDisabled && { 'ui:disabled': true }),
      ...(isReadonly && { 'ui:readonly': true }),
    }

    onSave(key, fieldData)
    onOpenChange(false)
  }, [
    validate,
    type,
    title,
    description,
    format,
    defaultValue,
    widget,
    placeholder,
    rows,
    enumOptions,
    showEnumOptions,
    minLength,
    maxLength,
    minimum,
    maximum,
    pattern,
    lookup,
    isHidden,
    isDisabled,
    isReadonly,
    key,
    onSave,
    onOpenChange,
  ])

  // Handle delete
  const handleDelete = useCallback(() => {
    if (onDelete && originalKey) {
      onDelete(originalKey)
      onOpenChange(false)
    }
    setShowDeleteDialog(false)
  }, [onDelete, originalKey, onOpenChange])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col" data-testid="field-editor-dialog">
          <DialogHeader>
            <DialogTitle>
              {isNewField ? 'Add Field' : `Edit: ${field?.title || field?.key}`}
            </DialogTitle>
            <DialogDescription>
              {isNewField
                ? 'Create a new field for your schema'
                : 'Modify field properties and validations'}
            </DialogDescription>
          </DialogHeader>

          {/* Tabbed Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList variant="accent" animated className="w-full grid grid-cols-3 flex-shrink-0">
              <TabsTrigger variant="accent" value="basic" data-testid="field-editor-tab-basic">Basic</TabsTrigger>
              <TabsTrigger variant="accent" value="validation" data-testid="field-editor-tab-validation">Validation</TabsTrigger>
              <TabsTrigger variant="accent" value="ui" data-testid="field-editor-tab-ui">UI Options</TabsTrigger>
            </TabsList>

            {/* Basic Tab */}
            <TabsContent value="basic" className="space-y-4 pt-4 px-1 overflow-y-auto flex-1">
              {/* Field Key */}
              <FormField
                label="Field Key"
                htmlFor="field-key"
                description="Unique identifier used in the schema (e.g., first_name)"
                required
                error={errors.key}
              >
                <Input
                  id="field-key"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="field_name"
                  className={errors.key ? 'border-error' : ''}
                />
              </FormField>

              {/* Title */}
              <FormField
                label="Display Title"
                htmlFor="field-title"
                description="Human-readable label shown in forms"
              >
                <Input
                  id="field-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Field Title"
                />
              </FormField>

              {/* Description */}
              <FormField
                label="Description"
                htmlFor="field-description"
                description="Help text shown below the field"
              >
                <Textarea
                  id="field-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a helpful description..."
                  rows={2}
                />
              </FormField>

              {/* Type */}
              <FormField
                label="Data Type"
                htmlFor="field-type"
                description="The JSON Schema type for this field"
                required
              >
                <Select value={type} onValueChange={(v) => setType(v as SchemaFieldType)}>
                  <SelectTrigger id="field-type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              {/* Widget (only for types that support it) */}
              {availableWidgets.length > 0 && (
                <FormField
                  label="Widget Type"
                  htmlFor="field-widget"
                  description="How this field should render in forms"
                >
                  <Select value={widget || NONE_VALUE} onValueChange={(v) => setWidget(v === NONE_VALUE ? '' as UIWidget : v as UIWidget)}>
                    <SelectTrigger id="field-widget" className="w-full">
                      <SelectValue placeholder="Auto (based on type)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE_VALUE}>Auto (based on type)</SelectItem>
                      {availableWidgets.map((w) => (
                        <SelectItem key={w.value} value={w.value}>
                          {w.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              )}

              {/* Enum Options (for select/radio) */}
              {showEnumOptions && (
                <FormField
                  label="Options"
                  htmlFor="field-enum"
                  description="Available choices for this field"
                  required
                  error={errors.enum}
                >
                  <EnumOptionsEditor
                    options={enumOptions.length > 0 ? enumOptions : ['']}
                    onChange={setEnumOptions}
                  />
                </FormField>
              )}

              {/* Required Toggle */}
              <div className="flex items-start gap-3 py-2">
                <Checkbox
                  id="field-required"
                  checked={isRequired}
                  onCheckedChange={(checked) => setIsRequired(checked === true)}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <Label htmlFor="field-required" className="cursor-pointer">Required Field</Label>
                  <p className="text-xs text-secondary">
                    User must fill this field to submit
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Validation Tab */}
            <TabsContent value="validation" className="space-y-4 pt-4 px-1 overflow-y-auto flex-1">
              {/* String Format */}
              {type === 'string' && (
                <FormField
                  label="Format"
                  htmlFor="field-format"
                  description="Expected string format for validation"
                >
                  <Select value={format || NONE_VALUE} onValueChange={(v) => setFormat(v === NONE_VALUE ? '' : v)}>
                    <SelectTrigger id="field-format" className="w-full">
                      <SelectValue placeholder="No format validation" />
                    </SelectTrigger>
                    <SelectContent>
                      {STRING_FORMATS.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              )}

              {/* String Length */}
              {type === 'string' && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Min Length"
                    htmlFor="field-minlength"
                    error={errors.minLength}
                  >
                    <Input
                      id="field-minlength"
                      type="number"
                      min={0}
                      value={minLength}
                      onChange={(e) => setMinLength(e.target.value ? Number(e.target.value) : '')}
                      placeholder="0"
                    />
                  </FormField>
                  <FormField label="Max Length" htmlFor="field-maxlength">
                    <Input
                      id="field-maxlength"
                      type="number"
                      min={0}
                      value={maxLength}
                      onChange={(e) => setMaxLength(e.target.value ? Number(e.target.value) : '')}
                      placeholder="No limit"
                    />
                  </FormField>
                </div>
              )}

              {/* Number Range */}
              {(type === 'number' || type === 'integer') && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Minimum"
                    htmlFor="field-minimum"
                    error={errors.minimum}
                  >
                    <Input
                      id="field-minimum"
                      type="number"
                      value={minimum}
                      onChange={(e) => setMinimum(e.target.value ? Number(e.target.value) : '')}
                      placeholder="No minimum"
                    />
                  </FormField>
                  <FormField label="Maximum" htmlFor="field-maximum">
                    <Input
                      id="field-maximum"
                      type="number"
                      value={maximum}
                      onChange={(e) => setMaximum(e.target.value ? Number(e.target.value) : '')}
                      placeholder="No maximum"
                    />
                  </FormField>
                </div>
              )}

              {/* Pattern (Regex) */}
              {type === 'string' && (
                <FormField
                  label="Pattern (Regex)"
                  htmlFor="field-pattern"
                  description="Regular expression for custom validation (e.g., ^[A-Z]{2}\d{4}$ for codes like AB1234)"
                >
                  <Input
                    id="field-pattern"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="^[A-Z]{2}[0-9]{4}$"
                    className="font-mono text-sm"
                  />
                  {pattern && (
                    <p className="text-xs text-secondary mt-1.5">
                      Tip: Use ^ and $ to match the full string, \d for digits, [A-Z] for letters
                    </p>
                  )}
                </FormField>
              )}

              {/* Default Value */}
              <FormField
                label="Default Value"
                htmlFor="field-default"
                description="Pre-filled value when form loads"
              >
                {type === 'boolean' ? (
                  <Select value={defaultValue || NONE_VALUE} onValueChange={(v) => setDefaultValue(v === NONE_VALUE ? '' : v)}>
                    <SelectTrigger id="field-default" className="w-full">
                      <SelectValue placeholder="No default" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE_VALUE}>No default</SelectItem>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="field-default"
                    type={type === 'number' || type === 'integer' ? 'number' : 'text'}
                    value={defaultValue}
                    onChange={(e) => setDefaultValue(e.target.value)}
                    placeholder="Enter default value..."
                  />
                )}
              </FormField>
            </TabsContent>

            {/* UI Options Tab */}
            <TabsContent value="ui" className="space-y-4 pt-4 px-1 overflow-y-auto flex-1">
              {/* Placeholder */}
              <FormField
                label="Placeholder"
                htmlFor="field-placeholder"
                description="Hint text shown when field is empty"
              >
                <Input
                  id="field-placeholder"
                  value={placeholder}
                  onChange={(e) => setPlaceholder(e.target.value)}
                  placeholder="e.g., Enter your name"
                />
              </FormField>

              {/* Textarea Rows */}
              {widget === 'textarea' && (
                <FormField
                  label="Rows"
                  htmlFor="field-rows"
                  description="Number of visible text lines"
                >
                  <Input
                    id="field-rows"
                    type="number"
                    min={1}
                    max={20}
                    value={rows}
                    onChange={(e) => setRows(e.target.value ? Number(e.target.value) : '')}
                    placeholder="3"
                  />
                </FormField>
              )}

              {/* Lookup */}
              {lookupOptions && Object.keys(lookupOptions).length > 0 && (
                <FormField
                  label="Lookup Source"
                  htmlFor="field-lookup"
                  description="Load options from external data source"
                >
                  <Select value={lookup || NONE_VALUE} onValueChange={(v) => setLookup(v === NONE_VALUE ? '' : v)}>
                    <SelectTrigger id="field-lookup" className="w-full">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE_VALUE}>None</SelectItem>
                      {Object.keys(lookupOptions).map((key) => (
                        <SelectItem key={key} value={key}>
                          {key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              )}

              {/* Visibility Toggles */}
              <div className="space-y-3 pt-2 border-t border-default">
                <p className="text-sm font-medium text-primary">Visibility & State</p>
                <p className="text-xs text-secondary -mt-1">Choose one state at a time</p>

                <div className="flex items-start gap-3 py-1">
                  <Checkbox
                    id="field-hidden"
                    checked={isHidden}
                    onCheckedChange={(checked) => {
                      const isChecked = checked === true
                      setIsHidden(isChecked)
                      // Hidden makes Disabled/Readonly irrelevant
                      if (isChecked) {
                        setIsDisabled(false)
                        setIsReadonly(false)
                      }
                    }}
                    className="mt-0.5"
                  />
                  <div>
                    <Label htmlFor="field-hidden" className="cursor-pointer">Hidden</Label>
                    <p className="text-xs text-secondary">Field exists but is not shown</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 py-1">
                  <Checkbox
                    id="field-disabled"
                    checked={isDisabled}
                    disabled={isHidden}
                    onCheckedChange={(checked) => {
                      const isChecked = checked === true
                      setIsDisabled(isChecked)
                      // Disabled and Readonly are mutually exclusive
                      if (isChecked) {
                        setIsReadonly(false)
                      }
                    }}
                    className="mt-0.5"
                  />
                  <div className={isHidden ? 'opacity-50' : ''}>
                    <Label htmlFor="field-disabled" className="cursor-pointer">Disabled</Label>
                    <p className="text-xs text-secondary">Visible but cannot be edited</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 py-1">
                  <Checkbox
                    id="field-readonly"
                    checked={isReadonly}
                    disabled={isHidden}
                    onCheckedChange={(checked) => {
                      const isChecked = checked === true
                      setIsReadonly(isChecked)
                      // Readonly and Disabled are mutually exclusive
                      if (isChecked) {
                        setIsDisabled(false)
                      }
                    }}
                    className="mt-0.5"
                  />
                  <div className={isHidden ? 'opacity-50' : ''}>
                    <Label htmlFor="field-readonly" className="cursor-pointer">Read-only</Label>
                    <p className="text-xs text-secondary">Visible, can select but not change</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <DialogFooter className="border-t border-default pt-4 flex-shrink-0">
            {/* Delete button (only for existing fields) */}
            {!isNewField && onDelete && (
              <Button
                type="button"
                variant="outline"
                className="text-error hover:text-error hover:bg-error/10 mr-auto"
                onClick={() => setShowDeleteDialog(true)}
                data-testid="field-editor-delete"
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="field-editor-cancel"
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} data-testid="field-editor-save">
              {isNewField ? 'Add Field' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete field?</DialogTitle>
            <DialogDescription>
              This will remove "{field?.title || field?.key}" from the schema.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              className="bg-error hover:bg-error/90"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default FieldEditor
