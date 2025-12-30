/**
 * Mapping Studio
 *
 * Visual mapping editor that replaces JSON editing with a user-friendly
 * interface for creating field-to-field mappings.
 *
 * Features:
 * - Form Mode: Row-based editor for quick 1:1 mappings
 * - Code Mode: JSON editor for advanced users
 * - Visual Mode: Drag-drop builder (future)
 * - Undo/Redo support
 * - Auto-mapping by field name
 * - Transform functions
 * - Validation
 */

// Main component
export { MappingStudio } from './MappingStudio'
export { default as MappingStudioDefault } from './MappingStudio'

// Context
export {
  MappingStudioProvider,
  useMappingStudio,
} from './context/MappingStudioProvider'
export type { MappingStudioProviderProps } from './context/MappingStudioProvider'

// Modes
export { FormMode } from './modes/FormMode'
export type { FormModeProps } from './modes/FormMode'

export { CodeMode } from './modes/CodeMode'
export type { CodeModeProps } from './modes/CodeMode'

// Types
export type {
  // Core types
  FieldDataType,
  TransformType,
  MappingField,
  TransformConfig,
  FieldMapping,
  MappingConfig,
  SourceSchema,
  TargetSchema,
  // State types
  MappingEditorMode,
  MappingValidationError,
  MappingHistoryEntry,
  MappingStudioState,
  // Props types
  MappingStudioProps,
  MappingRowProps,
  FieldSelectorProps,
  TransformSelectorProps,
  MappingPreviewProps,
  // Transform types
  TransformDefinition,
  TransformParamDef,
} from './types'

// Constants
export {
  TRANSFORM_DEFINITIONS,
  FIELD_TYPE_ICONS,
  FIELD_TYPE_LABELS,
} from './types'
