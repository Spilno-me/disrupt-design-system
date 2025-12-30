/**
 * Mapping Studio Types
 *
 * Type definitions for the visual mapping editor that replaces JSON editing.
 * Supports field-to-field mappings with optional transforms.
 */

// =============================================================================
// CORE MAPPING TYPES
// =============================================================================

/** Data types for source/target fields */
export type FieldDataType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'uuid'
  | 'array'
  | 'object'
  | 'any'

/** Available transform functions */
export type TransformType =
  | 'none'
  | 'toString'
  | 'toNumber'
  | 'toBoolean'
  | 'toDate'
  | 'toUpperCase'
  | 'toLowerCase'
  | 'trim'
  | 'dateFormat'
  | 'numberFormat'
  | 'concat'
  | 'split'
  | 'substring'
  | 'replace'
  | 'lookup'
  | 'default'
  | 'expression'

/** Field definition for source/target schemas */
export interface MappingField {
  /** Field path (e.g., "address.city" for nested) */
  path: string
  /** Display label */
  label: string
  /** Data type */
  type: FieldDataType
  /** Whether field is required */
  required?: boolean
  /** Nested fields for object types */
  children?: MappingField[]
  /** Field description */
  description?: string
  /** Example value */
  example?: string
}

/** Transform configuration */
export interface TransformConfig {
  /** Transform type */
  type: TransformType
  /** Transform parameters (varies by type) */
  params?: Record<string, unknown>
}

/** Single field mapping */
export interface FieldMapping {
  /** Unique ID for this mapping */
  id: string
  /** Source field path */
  sourcePath: string
  /** Target field path */
  targetPath: string
  /** Optional transform to apply */
  transform?: TransformConfig
  /** Whether this mapping is enabled */
  enabled: boolean
  /** Optional description/notes */
  notes?: string
}

/** Complete mapping configuration */
export interface MappingConfig {
  /** Unique identifier */
  id?: string
  /** Display name */
  name?: string
  /** Description */
  description?: string
  /** Version number */
  version?: string
  /** Source entity/form ID */
  sourceId?: string
  /** Target entity/process ID */
  targetId?: string
  /** List of field mappings */
  mappings: FieldMapping[]
  /** Created timestamp */
  createdAt?: string
  /** Updated timestamp */
  updatedAt?: string
}

// =============================================================================
// SCHEMA TYPES (for autocomplete)
// =============================================================================

/** Source schema definition */
export interface SourceSchema {
  /** Schema identifier */
  id: string
  /** Display name */
  name: string
  /** Schema description */
  description?: string
  /** Available fields */
  fields: MappingField[]
}

/** Target schema definition */
export interface TargetSchema {
  /** Schema identifier */
  id: string
  /** Display name */
  name: string
  /** Schema description */
  description?: string
  /** Available fields */
  fields: MappingField[]
  /** Required fields that must be mapped */
  requiredFields?: string[]
}

// =============================================================================
// STUDIO STATE TYPES
// =============================================================================

/** Editor mode */
export type MappingEditorMode = 'visual' | 'form' | 'code'

/** Validation error */
export interface MappingValidationError {
  /** Mapping ID or path */
  path: string
  /** Error message */
  message: string
  /** Severity level */
  severity: 'error' | 'warning' | 'info'
  /** Error code for programmatic handling */
  code?: string
}

/** Undo/redo history entry */
export interface MappingHistoryEntry {
  /** Mapping state */
  config: MappingConfig
  /** When this state was created */
  timestamp: number
  /** Optional description */
  description?: string
}

/** Mapping Studio state */
export interface MappingStudioState {
  // Current mapping
  config: MappingConfig

  // Source/target schemas
  sourceSchema: SourceSchema | null
  targetSchema: TargetSchema | null

  // Editor state
  mode: MappingEditorMode
  selectedMappingId: string | null

  // Search/filter
  searchQuery: string

  // Validation
  validationErrors: MappingValidationError[]
  isValidating: boolean

  // History
  history: MappingHistoryEntry[]
  historyIndex: number

  // UI state
  isDirty: boolean
  isSaving: boolean
  lastSaved: Date | null

  // Code mode state
  jsonValue: string
  jsonErrors: MappingValidationError[]
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================

/** Main MappingStudio props */
export interface MappingStudioProps {
  /** Initial mapping configuration */
  initialConfig: MappingConfig
  /** Source schema for autocomplete */
  sourceSchema: SourceSchema
  /** Target schema for autocomplete */
  targetSchema: TargetSchema
  /** Callback when mapping changes */
  onChange?: (config: MappingConfig) => void
  /** Callback when saved */
  onSave?: (config: MappingConfig) => Promise<void>
  /** Initial editor mode */
  defaultMode?: MappingEditorMode
  /** Enable auto-save */
  autoSave?: boolean
  /** Auto-save debounce in ms */
  autoSaveDebounce?: number
  /** Show JSON preview panel */
  showPreview?: boolean
  /** Read-only mode */
  readOnly?: boolean
  /** Additional class name */
  className?: string
}

/** MappingRow props (for Form mode) */
export interface MappingRowProps {
  /** The mapping data */
  mapping: FieldMapping
  /** Source schema fields for dropdown */
  sourceFields: MappingField[]
  /** Target schema fields for dropdown */
  targetFields: MappingField[]
  /** Whether this row is selected */
  isSelected?: boolean
  /** Read-only mode */
  readOnly?: boolean
  /** Callback when mapping is updated */
  onUpdate: (mapping: FieldMapping) => void
  /** Callback when mapping is deleted */
  onDelete: () => void
  /** Callback when row is selected */
  onSelect?: () => void
  /** Additional class name */
  className?: string
}

/** FieldSelector props */
export interface FieldSelectorProps {
  /** Available fields */
  fields: MappingField[]
  /** Currently selected field path */
  value: string
  /** Callback when selection changes */
  onChange: (path: string) => void
  /** Placeholder text */
  placeholder?: string
  /** Whether to show field types */
  showTypes?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Filter to specific types */
  filterTypes?: FieldDataType[]
  /** Additional class name */
  className?: string
}

/** TransformSelector props */
export interface TransformSelectorProps {
  /** Current transform config */
  value: TransformConfig | undefined
  /** Callback when transform changes */
  onChange: (transform: TransformConfig | undefined) => void
  /** Source field type (for filtering compatible transforms) */
  sourceType?: FieldDataType
  /** Target field type (for filtering compatible transforms) */
  targetType?: FieldDataType
  /** Disabled state */
  disabled?: boolean
  /** Additional class name */
  className?: string
}

/** MappingPreview props */
export interface MappingPreviewProps {
  /** Current mapping config */
  config: MappingConfig
  /** Preview format */
  format?: 'json' | 'yaml'
  /** Additional class name */
  className?: string
}

// =============================================================================
// TRANSFORM CONFIGS
// =============================================================================

/** Transform function definition */
export interface TransformDefinition {
  /** Transform type identifier */
  type: TransformType
  /** Display name */
  label: string
  /** Description */
  description: string
  /** Icon (lucide name) */
  icon: string
  /** Compatible source types */
  sourceTypes: FieldDataType[]
  /** Output type */
  outputType: FieldDataType
  /** Parameter definitions */
  params?: TransformParamDef[]
}

/** Transform parameter definition */
export interface TransformParamDef {
  /** Parameter name */
  name: string
  /** Display label */
  label: string
  /** Parameter type */
  type: 'string' | 'number' | 'boolean' | 'select'
  /** Default value */
  default?: unknown
  /** Required flag */
  required?: boolean
  /** Options for select type */
  options?: Array<{ value: string; label: string }>
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Available transforms with metadata */
export const TRANSFORM_DEFINITIONS: TransformDefinition[] = [
  {
    type: 'none',
    label: 'No Transform',
    description: 'Pass value through unchanged',
    icon: 'ArrowRight',
    sourceTypes: ['string', 'number', 'boolean', 'date', 'datetime', 'uuid', 'any'],
    outputType: 'any',
  },
  {
    type: 'toString',
    label: 'To String',
    description: 'Convert value to string',
    icon: 'Type',
    sourceTypes: ['number', 'boolean', 'date', 'datetime', 'any'],
    outputType: 'string',
  },
  {
    type: 'toNumber',
    label: 'To Number',
    description: 'Parse string as number',
    icon: 'Hash',
    sourceTypes: ['string', 'any'],
    outputType: 'number',
  },
  {
    type: 'toBoolean',
    label: 'To Boolean',
    description: 'Convert to true/false',
    icon: 'ToggleLeft',
    sourceTypes: ['string', 'number', 'any'],
    outputType: 'boolean',
  },
  {
    type: 'toDate',
    label: 'To Date',
    description: 'Parse string as date',
    icon: 'Calendar',
    sourceTypes: ['string', 'any'],
    outputType: 'date',
  },
  {
    type: 'toUpperCase',
    label: 'To Uppercase',
    description: 'Convert to uppercase',
    icon: 'CaseSensitive',
    sourceTypes: ['string'],
    outputType: 'string',
  },
  {
    type: 'toLowerCase',
    label: 'To Lowercase',
    description: 'Convert to lowercase',
    icon: 'CaseLower',
    sourceTypes: ['string'],
    outputType: 'string',
  },
  {
    type: 'trim',
    label: 'Trim',
    description: 'Remove leading/trailing whitespace',
    icon: 'Scissors',
    sourceTypes: ['string'],
    outputType: 'string',
  },
  {
    type: 'dateFormat',
    label: 'Format Date',
    description: 'Format date with pattern',
    icon: 'CalendarDays',
    sourceTypes: ['date', 'datetime', 'string'],
    outputType: 'string',
    params: [
      {
        name: 'format',
        label: 'Format Pattern',
        type: 'select',
        default: 'YYYY-MM-DD',
        options: [
          { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
          { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
          { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
          { value: 'YYYY-MM-DD HH:mm', label: 'YYYY-MM-DD HH:mm' },
          { value: 'custom', label: 'Custom...' },
        ],
      },
    ],
  },
  {
    type: 'concat',
    label: 'Concatenate',
    description: 'Join with other values',
    icon: 'Link',
    sourceTypes: ['string', 'number'],
    outputType: 'string',
    params: [
      { name: 'separator', label: 'Separator', type: 'string', default: '' },
      { name: 'suffix', label: 'Suffix', type: 'string' },
      { name: 'prefix', label: 'Prefix', type: 'string' },
    ],
  },
  {
    type: 'default',
    label: 'Default Value',
    description: 'Use fallback if empty',
    icon: 'ShieldCheck',
    sourceTypes: ['string', 'number', 'boolean', 'date', 'any'],
    outputType: 'any',
    params: [
      { name: 'defaultValue', label: 'Default Value', type: 'string', required: true },
    ],
  },
  {
    type: 'lookup',
    label: 'Lookup',
    description: 'Map value using lookup table',
    icon: 'Search',
    sourceTypes: ['string', 'number'],
    outputType: 'any',
    params: [
      { name: 'lookupTable', label: 'Lookup Table', type: 'string', required: true },
    ],
  },
  {
    type: 'expression',
    label: 'Expression',
    description: 'Custom JavaScript expression',
    icon: 'Code',
    sourceTypes: ['any'],
    outputType: 'any',
    params: [
      { name: 'expression', label: 'Expression', type: 'string', required: true },
    ],
  },
]

/** Field type icons */
export const FIELD_TYPE_ICONS: Record<FieldDataType, string> = {
  string: 'Type',
  number: 'Hash',
  boolean: 'ToggleLeft',
  date: 'Calendar',
  datetime: 'Clock',
  uuid: 'Key',
  array: 'List',
  object: 'Braces',
  any: 'Asterisk',
}

/** Field type labels */
export const FIELD_TYPE_LABELS: Record<FieldDataType, string> = {
  string: 'Text',
  number: 'Number',
  boolean: 'Boolean',
  date: 'Date',
  datetime: 'DateTime',
  uuid: 'UUID',
  array: 'Array',
  object: 'Object',
  any: 'Any',
}
