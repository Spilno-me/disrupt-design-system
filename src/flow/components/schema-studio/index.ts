/**
 * SchemaStudio - Hybrid JSON Schema Editor
 *
 * A comprehensive editor with Visual, Code, and Split modes
 * for creating and editing JSON Schema definitions.
 *
 * @example
 * ```tsx
 * import { SchemaStudio } from './schema-studio'
 *
 * <SchemaStudio
 *   initialSchema={mySchema}
 *   onChange={(schema) => console.log('Changed:', schema)}
 *   onSave={async (schema) => await saveSchema(schema)}
 *   defaultMode="visual"
 *   showPreview
 * />
 * ```
 */

// Main component
export { SchemaStudio, default } from './SchemaStudio'

// Context and hooks
export {
  SchemaStudioProvider,
  useSchemaStudio,
} from './context/SchemaStudioProvider'
export { useSchemaState } from './hooks/useSchemaState'

// Mode components
export { VisualMode } from './modes/VisualMode'
export { CodeMode } from './modes/CodeMode'

// UI components
export { FieldCard, FieldCardSkeleton, FieldCardCompact } from './components/FieldCard'
export { FieldList, FieldListSkeleton } from './components/FieldList'
export { FieldEditor } from './components/FieldEditor'
export { SchemaSummary } from './components/SchemaSummary'
/** @deprecated Use SchemaSummary instead - LivePreview shows a form which is conceptually incorrect for Entity Templates */
export { LivePreview } from './components/LivePreview'
export { CommandPalette } from './components/CommandPalette'

// Types
export type {
  // JSON Schema types
  JSONSchema,
  SchemaField,
  SchemaFieldType,
  UIWidget,
  EnumOption,
  FileAttachment,

  // Editor types
  EditorMode,
  FieldWithKey,
  ValidationError,
  HistoryEntry,

  // State types
  SchemaStudioState,
  SchemaStudioActions,

  // Props types
  SchemaStudioProps,
  FieldTemplate,
  LookupOption,
  FieldCardProps,
  FieldEditorProps,
  FieldListProps,
  LivePreviewProps,
  CodeEditorProps,

  // Config types
  FieldTypeConfig,
  WidgetConfig,
} from './types'

// Constants
export { FIELD_TYPE_CONFIGS, WIDGET_CONFIGS } from './types'
