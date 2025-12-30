/**
 * useSchemaState - Schema manipulation hook with undo/redo
 *
 * Manages JSON Schema state with full undo/redo history.
 * Uses immer-style immutable updates for safe state management.
 */

import { useReducer, useCallback, useMemo } from 'react'
import type {
  JSONSchema,
  SchemaField,
  FieldWithKey,
  HistoryEntry,
  ValidationError,
} from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface SchemaState {
  schema: JSONSchema
  history: HistoryEntry[]
  historyIndex: number
  isDirty: boolean
}

type SchemaAction =
  | { type: 'SET_SCHEMA'; payload: JSONSchema; description?: string }
  | { type: 'UPDATE_FIELD'; payload: { key: string; field: Partial<SchemaField> } }
  | { type: 'ADD_FIELD'; payload: { key: string; field: SchemaField } }
  | { type: 'REMOVE_FIELD'; payload: string }
  | { type: 'RENAME_FIELD'; payload: { oldKey: string; newKey: string } }
  | { type: 'REORDER_FIELDS'; payload: string[] }
  | { type: 'TOGGLE_REQUIRED'; payload: string }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'MARK_SAVED' }

// =============================================================================
// HELPERS
// =============================================================================

/** Create a history entry from schema */
function createHistoryEntry(schema: JSONSchema, description?: string): HistoryEntry {
  return {
    schema: JSON.parse(JSON.stringify(schema)), // Deep clone
    timestamp: Date.now(),
    description,
  }
}

/** Deep clone schema */
function cloneSchema(schema: JSONSchema): JSONSchema {
  return JSON.parse(JSON.stringify(schema))
}

// =============================================================================
// REDUCER
// =============================================================================

function schemaReducer(state: SchemaState, action: SchemaAction): SchemaState {
  switch (action.type) {
    case 'SET_SCHEMA': {
      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        createHistoryEntry(action.payload, action.description),
      ]
      return {
        schema: cloneSchema(action.payload),
        history: newHistory,
        historyIndex: newHistory.length - 1,
        isDirty: true,
      }
    }

    case 'UPDATE_FIELD': {
      const { key, field } = action.payload
      const newSchema = cloneSchema(state.schema)
      if (newSchema.properties[key]) {
        newSchema.properties[key] = {
          ...newSchema.properties[key],
          ...field,
        }
      }
      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        createHistoryEntry(newSchema, `Updated field: ${key}`),
      ]
      return {
        schema: newSchema,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        isDirty: true,
      }
    }

    case 'ADD_FIELD': {
      const { key, field } = action.payload
      const newSchema = cloneSchema(state.schema)
      newSchema.properties[key] = field

      // Add to ui:order if exists
      if (newSchema['ui:order']) {
        newSchema['ui:order'] = [...newSchema['ui:order'], key]
      }

      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        createHistoryEntry(newSchema, `Added field: ${key}`),
      ]
      return {
        schema: newSchema,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        isDirty: true,
      }
    }

    case 'REMOVE_FIELD': {
      const key = action.payload
      const newSchema = cloneSchema(state.schema)

      // Remove from properties
      delete newSchema.properties[key]

      // Remove from required
      if (newSchema.required) {
        newSchema.required = newSchema.required.filter((k) => k !== key)
      }

      // Remove from ui:order
      if (newSchema['ui:order']) {
        newSchema['ui:order'] = newSchema['ui:order'].filter((k) => k !== key)
      }

      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        createHistoryEntry(newSchema, `Removed field: ${key}`),
      ]
      return {
        schema: newSchema,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        isDirty: true,
      }
    }

    case 'RENAME_FIELD': {
      const { oldKey, newKey } = action.payload
      if (oldKey === newKey) return state

      const newSchema = cloneSchema(state.schema)

      // Rename in properties
      const field = newSchema.properties[oldKey]
      delete newSchema.properties[oldKey]
      newSchema.properties[newKey] = field

      // Rename in required
      if (newSchema.required) {
        newSchema.required = newSchema.required.map((k) =>
          k === oldKey ? newKey : k
        )
      }

      // Rename in ui:order
      if (newSchema['ui:order']) {
        newSchema['ui:order'] = newSchema['ui:order'].map((k) =>
          k === oldKey ? newKey : k
        )
      }

      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        createHistoryEntry(newSchema, `Renamed field: ${oldKey} → ${newKey}`),
      ]
      return {
        schema: newSchema,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        isDirty: true,
      }
    }

    case 'REORDER_FIELDS': {
      const newSchema = cloneSchema(state.schema)
      newSchema['ui:order'] = action.payload

      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        createHistoryEntry(newSchema, 'Reordered fields'),
      ]
      return {
        schema: newSchema,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        isDirty: true,
      }
    }

    case 'TOGGLE_REQUIRED': {
      const key = action.payload
      const newSchema = cloneSchema(state.schema)

      if (!newSchema.required) {
        newSchema.required = []
      }

      const isRequired = newSchema.required.includes(key)
      if (isRequired) {
        newSchema.required = newSchema.required.filter((k) => k !== key)
      } else {
        newSchema.required = [...newSchema.required, key]
      }

      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        createHistoryEntry(
          newSchema,
          `${isRequired ? 'Made optional' : 'Made required'}: ${key}`
        ),
      ]
      return {
        schema: newSchema,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        isDirty: true,
      }
    }

    case 'UNDO': {
      if (state.historyIndex <= 0) return state
      const newIndex = state.historyIndex - 1
      return {
        ...state,
        schema: cloneSchema(state.history[newIndex].schema),
        historyIndex: newIndex,
        isDirty: true,
      }
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state
      const newIndex = state.historyIndex + 1
      return {
        ...state,
        schema: cloneSchema(state.history[newIndex].schema),
        historyIndex: newIndex,
        isDirty: true,
      }
    }

    case 'MARK_SAVED': {
      return {
        ...state,
        isDirty: false,
      }
    }

    default:
      return state
  }
}

// =============================================================================
// HOOK
// =============================================================================

export interface UseSchemaStateOptions {
  initialSchema: JSONSchema
  onChange?: (schema: JSONSchema) => void
}

export interface UseSchemaStateReturn {
  // State
  schema: JSONSchema
  fields: FieldWithKey[]
  isDirty: boolean

  // Actions
  setSchema: (schema: JSONSchema, description?: string) => void
  updateField: (key: string, field: Partial<SchemaField>) => void
  addField: (key: string, field: SchemaField) => void
  removeField: (key: string) => void
  renameField: (oldKey: string, newKey: string) => void
  reorderFields: (orderedKeys: string[]) => void
  toggleRequired: (key: string) => void

  // History
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  historyLength: number

  // Persistence
  markSaved: () => void
  exportJSON: () => string
  importJSON: (json: string) => ValidationError[]

  // Validation
  validate: () => ValidationError[]
  getFieldByKey: (key: string) => FieldWithKey | undefined
}

export function useSchemaState({
  initialSchema,
  onChange,
}: UseSchemaStateOptions): UseSchemaStateReturn {
  // Initialize state
  const [state, dispatch] = useReducer(schemaReducer, {
    schema: cloneSchema(initialSchema),
    history: [createHistoryEntry(initialSchema, 'Initial state')],
    historyIndex: 0,
    isDirty: false,
  })

  // Convert properties to ordered fields array
  const fields = useMemo((): FieldWithKey[] => {
    const { schema } = state
    const order = schema['ui:order'] || Object.keys(schema.properties)
    const required = new Set(schema.required || [])

    return order
      .filter((key) => key in schema.properties)
      .map((key) => ({
        key,
        ...schema.properties[key],
        isRequired: required.has(key),
      }))
  }, [state.schema])

  // Actions
  const setSchema = useCallback(
    (schema: JSONSchema, description?: string) => {
      dispatch({ type: 'SET_SCHEMA', payload: schema, description })
      onChange?.(schema)
    },
    [onChange]
  )

  const updateField = useCallback(
    (key: string, field: Partial<SchemaField>) => {
      dispatch({ type: 'UPDATE_FIELD', payload: { key, field } })
      // Note: onChange called after dispatch in a useEffect would be cleaner
    },
    []
  )

  const addField = useCallback((key: string, field: SchemaField) => {
    dispatch({ type: 'ADD_FIELD', payload: { key, field } })
  }, [])

  const removeField = useCallback((key: string) => {
    dispatch({ type: 'REMOVE_FIELD', payload: key })
  }, [])

  const renameField = useCallback((oldKey: string, newKey: string) => {
    dispatch({ type: 'RENAME_FIELD', payload: { oldKey, newKey } })
  }, [])

  const reorderFields = useCallback((orderedKeys: string[]) => {
    dispatch({ type: 'REORDER_FIELDS', payload: orderedKeys })
  }, [])

  const toggleRequired = useCallback((key: string) => {
    dispatch({ type: 'TOGGLE_REQUIRED', payload: key })
  }, [])

  // History
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), [])
  const redo = useCallback(() => dispatch({ type: 'REDO' }), [])
  const canUndo = state.historyIndex > 0
  const canRedo = state.historyIndex < state.history.length - 1

  // Persistence
  const markSaved = useCallback(() => dispatch({ type: 'MARK_SAVED' }), [])

  const exportJSON = useCallback(() => {
    return JSON.stringify(state.schema, null, 2)
  }, [state.schema])

  const importJSON = useCallback(
    (json: string): ValidationError[] => {
      const errors: ValidationError[] = []
      try {
        const parsed = JSON.parse(json)

        // Basic validation
        if (parsed.type !== 'object') {
          errors.push({
            path: 'type',
            message: 'Root type must be "object"',
            severity: 'error',
          })
        }

        if (!parsed.properties || typeof parsed.properties !== 'object') {
          errors.push({
            path: 'properties',
            message: 'Schema must have properties object',
            severity: 'error',
          })
        }

        if (errors.length === 0) {
          setSchema(parsed as JSONSchema, 'Imported from JSON')
        }
      } catch (e) {
        errors.push({
          path: '',
          message: `Invalid JSON: ${e instanceof Error ? e.message : 'Unknown error'}`,
          severity: 'error',
        })
      }
      return errors
    },
    [setSchema]
  )

  // Validation
  const validate = useCallback((): ValidationError[] => {
    const errors: ValidationError[] = []
    const { schema } = state

    // Check required fields exist in properties
    if (schema.required) {
      for (const key of schema.required) {
        if (!(key in schema.properties)) {
          errors.push({
            path: `required.${key}`,
            message: `Required field "${key}" not found in properties`,
            severity: 'error',
          })
        }
      }
    }

    // Check ui:order fields exist
    if (schema['ui:order']) {
      for (const key of schema['ui:order']) {
        if (!(key in schema.properties)) {
          errors.push({
            path: `ui:order.${key}`,
            message: `Field "${key}" in ui:order not found in properties`,
            severity: 'warning',
          })
        }
      }
    }

    // Check for fields not in ui:order
    if (schema['ui:order']) {
      const orderSet = new Set(schema['ui:order'])
      for (const key of Object.keys(schema.properties)) {
        if (!orderSet.has(key)) {
          errors.push({
            path: `properties.${key}`,
            message: `Field "${key}" not included in ui:order`,
            severity: 'info',
          })
        }
      }
    }

    // Field-specific validations
    for (const [key, field] of Object.entries(schema.properties)) {
      // Enum without options
      if (field['ui:widget'] === 'select' && !field.enum?.length) {
        errors.push({
          path: `properties.${key}`,
          message: `Select field "${key}" has no enum options`,
          severity: 'warning',
        })
      }

      // Date format without format specifier
      if (
        (field['ui:widget'] === 'date' || field['ui:widget'] === 'datetime') &&
        !field.format
      ) {
        errors.push({
          path: `properties.${key}`,
          message: `Date field "${key}" should have format: "date" or "date-time"`,
          severity: 'info',
        })
      }
    }

    return errors
  }, [state.schema])

  // Get single field
  const getFieldByKey = useCallback(
    (key: string): FieldWithKey | undefined => {
      return fields.find((f) => f.key === key)
    },
    [fields]
  )

  return {
    // State
    schema: state.schema,
    fields,
    isDirty: state.isDirty,

    // Actions
    setSchema,
    updateField,
    addField,
    removeField,
    renameField,
    reorderFields,
    toggleRequired,

    // History
    undo,
    redo,
    canUndo,
    canRedo,
    historyLength: state.history.length,

    // Persistence
    markSaved,
    exportJSON,
    importJSON,

    // Validation
    validate,
    getFieldByKey,
  }
}

export default useSchemaState
