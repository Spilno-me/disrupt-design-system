/**
 * SchemaStudioProvider - Context provider for Schema Studio
 *
 * Combines schema state management with UI state for the editor.
 * Provides centralized access to schema operations, mode switching,
 * field selection, and panel states.
 */

import * as React from 'react'
import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { useSchemaState, type UseSchemaStateReturn } from '../hooks/useSchemaState'
import type {
  JSONSchema,
  EditorMode,
  FieldWithKey,
  ValidationError,
  SchemaStudioProps,
} from '../types'

// =============================================================================
// CONTEXT TYPES
// =============================================================================

interface SchemaStudioContextValue extends UseSchemaStateReturn {
  // Editor mode
  mode: EditorMode
  setMode: (mode: EditorMode) => void

  // Field selection
  selectedFieldKey: string | null
  selectField: (key: string | null) => void
  selectedField: FieldWithKey | undefined

  // Field editor panel
  isFieldEditorOpen: boolean
  openFieldEditor: (key?: string) => void
  closeFieldEditor: () => void

  // Search/filter
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredFields: FieldWithKey[]

  // Validation
  validationErrors: ValidationError[]
  runValidation: () => void
  clearValidation: () => void

  // Command palette
  isCommandPaletteOpen: boolean
  openCommandPalette: () => void
  closeCommandPalette: () => void

  // UI flags
  isSaving: boolean
  setIsSaving: (saving: boolean) => void

  // Props passthrough
  showPreview: boolean
  autoSave: boolean
}

// =============================================================================
// CONTEXT
// =============================================================================

const SchemaStudioContext = createContext<SchemaStudioContextValue | null>(null)

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

export interface SchemaStudioProviderProps extends SchemaStudioProps {
  children: React.ReactNode
}

export function SchemaStudioProvider({
  children,
  initialSchema,
  onChange,
  onSave,
  defaultMode = 'visual',
  autoSave = false,
  showPreview = true,
}: SchemaStudioProviderProps) {
  // ==========================================================================
  // SCHEMA STATE (from hook)
  // ==========================================================================

  const schemaState = useSchemaState({
    initialSchema,
    onChange,
  })

  // ==========================================================================
  // UI STATE
  // ==========================================================================

  // Editor mode
  const [mode, setMode] = useState<EditorMode>(defaultMode)

  // Field selection
  const [selectedFieldKey, setSelectedFieldKey] = useState<string | null>(null)

  // Field editor panel
  const [isFieldEditorOpen, setIsFieldEditorOpen] = useState(false)

  // Search/filter
  const [searchQuery, setSearchQuery] = useState('')

  // Validation
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])

  // Command palette
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  // Saving state
  const [isSaving, setIsSaving] = useState(false)

  // ==========================================================================
  // DERIVED STATE
  // ==========================================================================

  // Get selected field object
  const selectedField = useMemo(() => {
    if (!selectedFieldKey) return undefined
    return schemaState.fields.find((f) => f.key === selectedFieldKey)
  }, [selectedFieldKey, schemaState.fields])

  // Filter fields by search query
  const filteredFields = useMemo(() => {
    if (!searchQuery.trim()) return schemaState.fields

    const query = searchQuery.toLowerCase()
    return schemaState.fields.filter((field) => {
      return (
        field.key.toLowerCase().includes(query) ||
        field.title?.toLowerCase().includes(query) ||
        field.description?.toLowerCase().includes(query) ||
        field.type.toLowerCase().includes(query)
      )
    })
  }, [schemaState.fields, searchQuery])

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  // Field selection
  const selectField = useCallback((key: string | null) => {
    setSelectedFieldKey(key)
  }, [])

  // Field editor panel
  const openFieldEditor = useCallback((key?: string) => {
    if (key) {
      setSelectedFieldKey(key)
    }
    setIsFieldEditorOpen(true)
  }, [])

  const closeFieldEditor = useCallback(() => {
    setIsFieldEditorOpen(false)
  }, [])

  // Validation
  const runValidation = useCallback(() => {
    const errors = schemaState.validate()
    setValidationErrors(errors)
  }, [schemaState])

  const clearValidation = useCallback(() => {
    setValidationErrors([])
  }, [])

  // Command palette
  const openCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen(true)
  }, [])

  const closeCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen(false)
  }, [])

  // ==========================================================================
  // KEYBOARD SHORTCUTS
  // ==========================================================================

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette: ⌘K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsCommandPaletteOpen((open) => !open)
      }

      // Undo: ⌘Z or Ctrl+Z
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        schemaState.undo()
      }

      // Redo: ⌘⇧Z or Ctrl+Shift+Z or Ctrl+Y
      if (
        ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') ||
        ((e.metaKey || e.ctrlKey) && e.key === 'y')
      ) {
        e.preventDefault()
        schemaState.redo()
      }

      // Save: ⌘S or Ctrl+S
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        if (onSave && schemaState.isDirty) {
          setIsSaving(true)
          onSave(schemaState.schema)
            .then(() => {
              schemaState.markSaved()
            })
            .finally(() => {
              setIsSaving(false)
            })
        }
      }

      // Escape: Close panels
      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) {
          setIsCommandPaletteOpen(false)
        } else if (isFieldEditorOpen) {
          setIsFieldEditorOpen(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [schemaState, onSave, isCommandPaletteOpen, isFieldEditorOpen])

  // ==========================================================================
  // AUTO-SAVE
  // ==========================================================================

  React.useEffect(() => {
    if (!autoSave || !onSave || !schemaState.isDirty) return

    const timeoutId = setTimeout(() => {
      setIsSaving(true)
      onSave(schemaState.schema)
        .then(() => {
          schemaState.markSaved()
        })
        .finally(() => {
          setIsSaving(false)
        })
    }, 2000) // 2 second debounce

    return () => clearTimeout(timeoutId)
  }, [autoSave, onSave, schemaState.schema, schemaState.isDirty, schemaState.markSaved])

  // ==========================================================================
  // CONTEXT VALUE
  // ==========================================================================

  const contextValue = useMemo<SchemaStudioContextValue>(
    () => ({
      // Schema state (spread from hook)
      ...schemaState,

      // Editor mode
      mode,
      setMode,

      // Field selection
      selectedFieldKey,
      selectField,
      selectedField,

      // Field editor panel
      isFieldEditorOpen,
      openFieldEditor,
      closeFieldEditor,

      // Search/filter
      searchQuery,
      setSearchQuery,
      filteredFields,

      // Validation
      validationErrors,
      runValidation,
      clearValidation,

      // Command palette
      isCommandPaletteOpen,
      openCommandPalette,
      closeCommandPalette,

      // UI flags
      isSaving,
      setIsSaving,

      // Props passthrough
      showPreview,
      autoSave,
    }),
    [
      schemaState,
      mode,
      selectedFieldKey,
      selectField,
      selectedField,
      isFieldEditorOpen,
      openFieldEditor,
      closeFieldEditor,
      searchQuery,
      filteredFields,
      validationErrors,
      runValidation,
      clearValidation,
      isCommandPaletteOpen,
      openCommandPalette,
      closeCommandPalette,
      isSaving,
      showPreview,
      autoSave,
    ]
  )

  return (
    <SchemaStudioContext.Provider value={contextValue}>
      {children}
    </SchemaStudioContext.Provider>
  )
}

// =============================================================================
// HOOK
// =============================================================================

export function useSchemaStudio(): SchemaStudioContextValue {
  const context = useContext(SchemaStudioContext)
  if (!context) {
    throw new Error('useSchemaStudio must be used within a SchemaStudioProvider')
  }
  return context
}

export default SchemaStudioProvider
