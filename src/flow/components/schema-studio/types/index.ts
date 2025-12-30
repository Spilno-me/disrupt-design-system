/**
 * Schema Studio Types
 *
 * Type definitions for the JSON Schema editor with visual and code modes.
 */

// =============================================================================
// JSON SCHEMA TYPES
// =============================================================================

/** Supported JSON Schema field types */
export type SchemaFieldType =
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'array'
  | 'object'

/** UI widget types for form rendering */
export type UIWidget =
  | 'text'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'datetime'
  | 'time'
  | 'file'
  | 'hidden'
  | 'password'
  | 'email'
  | 'url'
  | 'tel'
  | 'number'
  | 'range'
  | 'color'

/** Enum option for select/radio fields */
export interface EnumOption {
  value: string
  label: string
}

/** File attachment in schema */
export interface FileAttachment {
  file_url: string
  file_name: string
  file_type: string
}

/** Single field definition in JSON Schema */
export interface SchemaField {
  // Core JSON Schema properties
  type: SchemaFieldType
  title?: string
  description?: string
  default?: unknown

  // String validations
  maxLength?: number
  minLength?: number
  pattern?: string
  format?: 'uuid' | 'email' | 'uri' | 'date' | 'date-time' | 'time'

  // Number validations
  minimum?: number
  maximum?: number
  exclusiveMinimum?: number
  exclusiveMaximum?: number
  multipleOf?: number

  // Enum (select/radio)
  enum?: string[]

  // Array items
  items?: SchemaField | { type: string; properties?: Record<string, SchemaField> }

  // UI Hints (custom extensions)
  'ui:widget'?: UIWidget
  'ui:placeholder'?: string
  'ui:rows'?: number
  'ui:order'?: number
  'ui:hidden'?: boolean
  'ui:disabled'?: boolean
  'ui:readonly'?: boolean

  // Lookup/relationship hint
  'ui:lookup'?: string // e.g., "users", "locations", "departments"

  // Conditional visibility
  'ui:visibleWhen'?: {
    field: string
    value: unknown
    operator?: 'eq' | 'neq' | 'in' | 'contains'
  }
}

/** Root JSON Schema object */
export interface JSONSchema {
  type: 'object'
  title: string
  description?: string
  required?: string[]
  'ui:order'?: string[]
  properties: Record<string, SchemaField>
}

// =============================================================================
// STUDIO STATE TYPES
// =============================================================================

/** Editor mode */
export type EditorMode = 'visual' | 'code' | 'split'

/** Field with key for internal use */
export interface FieldWithKey extends SchemaField {
  key: string
  isRequired: boolean
}

/** Validation error */
export interface ValidationError {
  path: string
  message: string
  severity: 'error' | 'warning' | 'info'
}

/** Undo/redo history entry */
export interface HistoryEntry {
  schema: JSONSchema
  timestamp: number
  description?: string
}

/** Schema Studio state */
export interface SchemaStudioState {
  // Current schema
  schema: JSONSchema

  // Editor state
  mode: EditorMode
  selectedFieldKey: string | null
  isFieldEditorOpen: boolean

  // Search/filter
  searchQuery: string

  // Validation
  validationErrors: ValidationError[]
  isValidating: boolean

  // History
  history: HistoryEntry[]
  historyIndex: number

  // UI state
  isDirty: boolean
  isSaving: boolean
  lastSaved: Date | null
}

/** Schema Studio actions */
export interface SchemaStudioActions {
  // Schema mutations
  setSchema: (schema: JSONSchema) => void
  updateField: (key: string, field: Partial<SchemaField>) => void
  addField: (key: string, field: SchemaField) => void
  removeField: (key: string) => void
  renameField: (oldKey: string, newKey: string) => void
  reorderFields: (orderedKeys: string[]) => void
  toggleRequired: (key: string) => void

  // Editor state
  setMode: (mode: EditorMode) => void
  selectField: (key: string | null) => void
  openFieldEditor: (key: string) => void
  closeFieldEditor: () => void

  // Search
  setSearchQuery: (query: string) => void

  // History
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean

  // Persistence
  save: () => Promise<void>
  exportJSON: () => string
  importJSON: (json: string) => void

  // Validation
  validate: () => ValidationError[]
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================

/** Main SchemaStudio props */
export interface SchemaStudioProps {
  /** Initial schema to edit */
  initialSchema: JSONSchema
  /** Callback when schema changes */
  onChange?: (schema: JSONSchema) => void
  /** Callback when saved */
  onSave?: (schema: JSONSchema) => Promise<void>
  /** Initial editor mode */
  defaultMode?: EditorMode
  /** Enable auto-save */
  autoSave?: boolean
  /** Auto-save debounce in ms */
  autoSaveDebounce?: number
  /** Show live preview panel */
  showPreview?: boolean
  /** Custom field templates */
  fieldTemplates?: FieldTemplate[]
  /** Lookup options for UUID fields */
  lookupOptions?: Record<string, LookupOption[]>
  /** Additional class name */
  className?: string
}

/** Field template for quick add */
export interface FieldTemplate {
  id: string
  name: string
  description: string
  icon?: React.ReactNode
  fields: Record<string, SchemaField>
}

/** Lookup option for select fields */
export interface LookupOption {
  id: string
  label: string
  description?: string
}

/** FieldCard props */
export interface FieldCardProps {
  field: FieldWithKey
  isSelected?: boolean
  isDragging?: boolean
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onToggleRequired?: () => void
  className?: string
}

/** FieldEditor props */
export interface FieldEditorProps {
  field: FieldWithKey | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (key: string, field: SchemaField) => void
  onDelete?: (key: string) => void
  existingKeys: string[]
  lookupOptions?: Record<string, LookupOption[]>
}

/** FieldList props */
export interface FieldListProps {
  fields: FieldWithKey[]
  selectedKey?: string | null
  searchQuery?: string
  onFieldSelect: (key: string) => void
  onFieldEdit: (key: string) => void
  onFieldDelete: (key: string) => void
  onFieldToggleRequired: (key: string) => void
  onReorder: (orderedKeys: string[]) => void
  onAddField: () => void
  className?: string
}

/** LivePreview props */
export interface LivePreviewProps {
  schema: JSONSchema
  className?: string
}

/** CodeEditor props */
export interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  errors?: ValidationError[]
  onValidate?: () => void
  className?: string
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/** Field type display config */
export interface FieldTypeConfig {
  type: SchemaFieldType
  label: string
  icon: string
  description: string
  defaultWidget: UIWidget
  supportsEnum: boolean
  supportsLookup: boolean
}

/** UI Widget display config */
export interface WidgetConfig {
  widget: UIWidget
  label: string
  icon: string
  compatibleTypes: SchemaFieldType[]
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const FIELD_TYPE_CONFIGS: Record<SchemaFieldType, FieldTypeConfig> = {
  string: {
    type: 'string',
    label: 'Text',
    icon: '📝',
    description: 'Single or multi-line text',
    defaultWidget: 'text',
    supportsEnum: true,
    supportsLookup: true,
  },
  number: {
    type: 'number',
    label: 'Number',
    icon: '🔢',
    description: 'Decimal numbers',
    defaultWidget: 'number',
    supportsEnum: false,
    supportsLookup: false,
  },
  integer: {
    type: 'integer',
    label: 'Integer',
    icon: '#️⃣',
    description: 'Whole numbers only',
    defaultWidget: 'number',
    supportsEnum: false,
    supportsLookup: false,
  },
  boolean: {
    type: 'boolean',
    label: 'Boolean',
    icon: '☑️',
    description: 'Yes/No, True/False',
    defaultWidget: 'checkbox',
    supportsEnum: false,
    supportsLookup: false,
  },
  array: {
    type: 'array',
    label: 'Array',
    icon: '📋',
    description: 'List of items',
    defaultWidget: 'text',
    supportsEnum: false,
    supportsLookup: false,
  },
  object: {
    type: 'object',
    label: 'Object',
    icon: '📦',
    description: 'Nested object',
    defaultWidget: 'text',
    supportsEnum: false,
    supportsLookup: false,
  },
}

export const WIDGET_CONFIGS: WidgetConfig[] = [
  { widget: 'text', label: 'Text Input', icon: '📝', compatibleTypes: ['string'] },
  { widget: 'textarea', label: 'Text Area', icon: '📄', compatibleTypes: ['string'] },
  { widget: 'select', label: 'Dropdown', icon: '▼', compatibleTypes: ['string', 'number', 'integer'] },
  { widget: 'radio', label: 'Radio Buttons', icon: '⊙', compatibleTypes: ['string', 'number', 'integer'] },
  { widget: 'checkbox', label: 'Checkbox', icon: '☑', compatibleTypes: ['boolean'] },
  { widget: 'date', label: 'Date Picker', icon: '📅', compatibleTypes: ['string'] },
  { widget: 'datetime', label: 'Date & Time', icon: '🕐', compatibleTypes: ['string'] },
  { widget: 'time', label: 'Time Picker', icon: '⏰', compatibleTypes: ['string'] },
  { widget: 'file', label: 'File Upload', icon: '📎', compatibleTypes: ['string', 'array'] },
  { widget: 'number', label: 'Number Input', icon: '🔢', compatibleTypes: ['number', 'integer'] },
  { widget: 'email', label: 'Email', icon: '✉️', compatibleTypes: ['string'] },
  { widget: 'url', label: 'URL', icon: '🔗', compatibleTypes: ['string'] },
  { widget: 'tel', label: 'Phone', icon: '📞', compatibleTypes: ['string'] },
  { widget: 'password', label: 'Password', icon: '🔒', compatibleTypes: ['string'] },
  { widget: 'hidden', label: 'Hidden', icon: '👁️‍🗨️', compatibleTypes: ['string', 'number', 'integer', 'boolean'] },
]
