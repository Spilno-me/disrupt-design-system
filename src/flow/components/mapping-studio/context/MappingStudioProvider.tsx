/**
 * MappingStudioProvider - Context provider for Mapping Studio
 *
 * Manages mapping state with undo/redo, validation, and mode switching.
 * Provides centralized access to mapping operations.
 */

import * as React from 'react'
import { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react'
import type {
  MappingConfig,
  FieldMapping,
  TransformConfig,
  SourceSchema,
  TargetSchema,
  MappingField,
  MappingEditorMode,
  MappingValidationError,
  MappingHistoryEntry,
  MappingStudioProps,
} from '../types'

// =============================================================================
// CONTEXT TYPES
// =============================================================================

interface MappingStudioContextValue {
  // Current mapping config
  config: MappingConfig
  setConfig: (config: MappingConfig) => void

  // Schemas
  sourceSchema: SourceSchema
  targetSchema: TargetSchema
  sourceFields: MappingField[]
  targetFields: MappingField[]

  // Mapping operations
  addMapping: (mapping: Omit<FieldMapping, 'id'>) => void
  updateMapping: (id: string, updates: Partial<FieldMapping>) => void
  removeMapping: (id: string) => void
  toggleMapping: (id: string) => void
  reorderMappings: (orderedIds: string[]) => void
  autoMap: () => void
  clearMappings: () => void

  // Editor mode
  mode: MappingEditorMode
  setMode: (mode: MappingEditorMode) => void

  // Selection
  selectedMappingId: string | null
  selectMapping: (id: string | null) => void
  selectedMapping: FieldMapping | undefined

  // Search/filter
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredMappings: FieldMapping[]

  // Validation
  validationErrors: MappingValidationError[]
  validate: () => MappingValidationError[]
  clearValidation: () => void

  // History (undo/redo)
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean

  // JSON/Code mode
  jsonValue: string
  setJsonValue: (json: string) => void
  jsonErrors: MappingValidationError[]
  applyJsonChanges: () => boolean

  // State flags
  isDirty: boolean
  isSaving: boolean
  readOnly: boolean

  // Persistence
  save: () => Promise<void>
  exportJSON: () => string
}

// =============================================================================
// CONTEXT
// =============================================================================

const MappingStudioContext = createContext<MappingStudioContextValue | null>(null)

// =============================================================================
// UTILITIES
// =============================================================================

function generateId(): string {
  return `mapping-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function flattenFields(fields: MappingField[], prefix = ''): MappingField[] {
  const result: MappingField[] = []
  for (const field of fields) {
    const path = prefix ? `${prefix}.${field.path}` : field.path
    result.push({ ...field, path })
    if (field.children) {
      result.push(...flattenFields(field.children, path))
    }
  }
  return result
}

function configToJson(config: MappingConfig): string {
  // Convert to the format expected by the backend
  const output: Record<string, unknown> = {}

  // Handle case where config.mappings might not exist or not be an array
  const mappings = Array.isArray(config?.mappings) ? config.mappings : []

  for (const mapping of mappings) {
    if (mapping.enabled) {
      if (mapping.transform && mapping.transform.type !== 'none') {
        output[mapping.targetPath] = {
          source: mapping.sourcePath,
          transform: mapping.transform,
        }
      } else {
        output[mapping.targetPath] = mapping.sourcePath
      }
    }
  }
  return JSON.stringify(output, null, 2)
}

function jsonToMappings(json: string): FieldMapping[] {
  const parsed = JSON.parse(json)
  const mappings: FieldMapping[] = []

  for (const [targetPath, value] of Object.entries(parsed)) {
    if (typeof value === 'string') {
      mappings.push({
        id: generateId(),
        sourcePath: value,
        targetPath,
        enabled: true,
      })
    } else if (typeof value === 'object' && value !== null) {
      const obj = value as { source?: string; transform?: TransformConfig }
      mappings.push({
        id: generateId(),
        sourcePath: obj.source || '',
        targetPath,
        transform: obj.transform,
        enabled: true,
      })
    }
  }

  return mappings
}

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

export interface MappingStudioProviderProps extends MappingStudioProps {
  children: React.ReactNode
}

export function MappingStudioProvider({
  children,
  initialConfig,
  sourceSchema,
  targetSchema,
  onChange,
  onSave,
  defaultMode = 'form',
  autoSave = false,
  autoSaveDebounce = 2000,
  readOnly = false,
}: MappingStudioProviderProps) {
  // ==========================================================================
  // STATE
  // ==========================================================================

  const [config, setConfigInternal] = useState<MappingConfig>(initialConfig)
  const [mode, setMode] = useState<MappingEditorMode>(defaultMode)
  const [selectedMappingId, setSelectedMappingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [validationErrors, setValidationErrors] = useState<MappingValidationError[]>([])
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // History for undo/redo
  const [history, setHistory] = useState<MappingHistoryEntry[]>([
    { config: initialConfig, timestamp: Date.now() },
  ])
  const [historyIndex, setHistoryIndex] = useState(0)

  // JSON mode state
  const [jsonValue, setJsonValueInternal] = useState(() => configToJson(initialConfig))
  const [jsonErrors, setJsonErrors] = useState<MappingValidationError[]>([])

  // Refs
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ==========================================================================
  // DERIVED STATE
  // ==========================================================================

  const sourceFields = useMemo(() => flattenFields(sourceSchema.fields), [sourceSchema])
  const targetFields = useMemo(() => flattenFields(targetSchema.fields), [targetSchema])

  const selectedMapping = useMemo(
    () => config.mappings.find((m) => m.id === selectedMappingId),
    [config.mappings, selectedMappingId]
  )

  const filteredMappings = useMemo(() => {
    if (!searchQuery.trim()) return config.mappings
    const query = searchQuery.toLowerCase()
    return config.mappings.filter(
      (m) =>
        m.sourcePath.toLowerCase().includes(query) ||
        m.targetPath.toLowerCase().includes(query) ||
        m.notes?.toLowerCase().includes(query)
    )
  }, [config.mappings, searchQuery])

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  // ==========================================================================
  // CONFIG UPDATES
  // ==========================================================================

  const setConfig = useCallback(
    (newConfig: MappingConfig) => {
      if (readOnly) return

      setConfigInternal(newConfig)
      setIsDirty(true)
      setJsonValueInternal(configToJson(newConfig))

      // Add to history
      const newEntry: MappingHistoryEntry = {
        config: newConfig,
        timestamp: Date.now(),
      }
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), newEntry])
      setHistoryIndex((prev) => prev + 1)

      // Notify parent
      onChange?.(newConfig)

      // Auto-save
      if (autoSave && onSave) {
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current)
        }
        autoSaveTimeoutRef.current = setTimeout(() => {
          setIsSaving(true)
          onSave(newConfig).finally(() => {
            setIsSaving(false)
            setIsDirty(false)
          })
        }, autoSaveDebounce)
      }
    },
    [readOnly, historyIndex, onChange, autoSave, onSave, autoSaveDebounce]
  )

  // ==========================================================================
  // MAPPING OPERATIONS
  // ==========================================================================

  const addMapping = useCallback(
    (mapping: Omit<FieldMapping, 'id'>) => {
      const newMapping: FieldMapping = {
        ...mapping,
        id: generateId(),
      }
      setConfig({
        ...config,
        mappings: [...config.mappings, newMapping],
      })
    },
    [config, setConfig]
  )

  const updateMapping = useCallback(
    (id: string, updates: Partial<FieldMapping>) => {
      setConfig({
        ...config,
        mappings: config.mappings.map((m) => (m.id === id ? { ...m, ...updates } : m)),
      })
    },
    [config, setConfig]
  )

  const removeMapping = useCallback(
    (id: string) => {
      setConfig({
        ...config,
        mappings: config.mappings.filter((m) => m.id !== id),
      })
      if (selectedMappingId === id) {
        setSelectedMappingId(null)
      }
    },
    [config, setConfig, selectedMappingId]
  )

  const toggleMapping = useCallback(
    (id: string) => {
      setConfig({
        ...config,
        mappings: config.mappings.map((m) =>
          m.id === id ? { ...m, enabled: !m.enabled } : m
        ),
      })
    },
    [config, setConfig]
  )

  const reorderMappings = useCallback(
    (orderedIds: string[]) => {
      const reordered = orderedIds
        .map((id) => config.mappings.find((m) => m.id === id))
        .filter((m): m is FieldMapping => m !== undefined)
      setConfig({
        ...config,
        mappings: reordered,
      })
    },
    [config, setConfig]
  )

  const autoMap = useCallback(() => {
    // Auto-map fields with matching names
    const newMappings: FieldMapping[] = []
    const mappedTargets = new Set(config.mappings.map((m) => m.targetPath))

    for (const targetField of targetFields) {
      if (mappedTargets.has(targetField.path)) continue

      // Find matching source field by path or label
      const matchingSource = sourceFields.find(
        (sf) =>
          sf.path.toLowerCase() === targetField.path.toLowerCase() ||
          sf.label.toLowerCase() === targetField.label.toLowerCase()
      )

      if (matchingSource) {
        newMappings.push({
          id: generateId(),
          sourcePath: matchingSource.path,
          targetPath: targetField.path,
          enabled: true,
        })
      }
    }

    if (newMappings.length > 0) {
      setConfig({
        ...config,
        mappings: [...config.mappings, ...newMappings],
      })
    }
  }, [config, setConfig, sourceFields, targetFields])

  const clearMappings = useCallback(() => {
    setConfig({
      ...config,
      mappings: [],
    })
    setSelectedMappingId(null)
  }, [config, setConfig])

  // ==========================================================================
  // SELECTION
  // ==========================================================================

  const selectMapping = useCallback((id: string | null) => {
    setSelectedMappingId(id)
  }, [])

  // ==========================================================================
  // VALIDATION
  // ==========================================================================

  const validate = useCallback((): MappingValidationError[] => {
    const errors: MappingValidationError[] = []

    // Check for required target fields not mapped
    if (targetSchema.requiredFields) {
      for (const requiredPath of targetSchema.requiredFields) {
        const hasMapped = config.mappings.some(
          (m) => m.targetPath === requiredPath && m.enabled
        )
        if (!hasMapped) {
          errors.push({
            path: requiredPath,
            message: `Required field "${requiredPath}" is not mapped`,
            severity: 'error',
            code: 'REQUIRED_UNMAPPED',
          })
        }
      }
    }

    // Check for duplicate target mappings
    const targetCounts = new Map<string, number>()
    for (const mapping of config.mappings) {
      if (mapping.enabled) {
        const count = targetCounts.get(mapping.targetPath) || 0
        targetCounts.set(mapping.targetPath, count + 1)
      }
    }
    for (const [path, count] of targetCounts) {
      if (count > 1) {
        errors.push({
          path,
          message: `Target field "${path}" has ${count} mappings`,
          severity: 'warning',
          code: 'DUPLICATE_TARGET',
        })
      }
    }

    // Check for type mismatches
    for (const mapping of config.mappings) {
      if (!mapping.enabled) continue
      const sourceField = sourceFields.find((f) => f.path === mapping.sourcePath)
      const targetField = targetFields.find((f) => f.path === mapping.targetPath)

      if (sourceField && targetField) {
        if (
          sourceField.type !== targetField.type &&
          sourceField.type !== 'any' &&
          targetField.type !== 'any' &&
          !mapping.transform
        ) {
          errors.push({
            path: mapping.id,
            message: `Type mismatch: ${sourceField.type} → ${targetField.type}. Consider adding a transform.`,
            severity: 'warning',
            code: 'TYPE_MISMATCH',
          })
        }
      }
    }

    setValidationErrors(errors)
    return errors
  }, [config.mappings, sourceFields, targetFields, targetSchema.requiredFields])

  const clearValidation = useCallback(() => {
    setValidationErrors([])
  }, [])

  // ==========================================================================
  // HISTORY (UNDO/REDO)
  // ==========================================================================

  const undo = useCallback(() => {
    if (!canUndo) return
    const newIndex = historyIndex - 1
    const entry = history[newIndex]
    setConfigInternal(entry.config)
    setJsonValueInternal(configToJson(entry.config))
    setHistoryIndex(newIndex)
    setIsDirty(true)
    onChange?.(entry.config)
  }, [canUndo, historyIndex, history, onChange])

  const redo = useCallback(() => {
    if (!canRedo) return
    const newIndex = historyIndex + 1
    const entry = history[newIndex]
    setConfigInternal(entry.config)
    setJsonValueInternal(configToJson(entry.config))
    setHistoryIndex(newIndex)
    setIsDirty(true)
    onChange?.(entry.config)
  }, [canRedo, historyIndex, history, onChange])

  // ==========================================================================
  // JSON MODE
  // ==========================================================================

  const setJsonValue = useCallback((json: string) => {
    setJsonValueInternal(json)
    // Validate JSON
    try {
      JSON.parse(json)
      setJsonErrors([])
    } catch (e) {
      setJsonErrors([
        {
          path: 'json',
          message: e instanceof Error ? e.message : 'Invalid JSON',
          severity: 'error',
          code: 'INVALID_JSON',
        },
      ])
    }
  }, [])

  const applyJsonChanges = useCallback((): boolean => {
    if (jsonErrors.length > 0) return false
    try {
      const mappings = jsonToMappings(jsonValue)
      setConfig({
        ...config,
        mappings,
      })
      return true
    } catch {
      setJsonErrors([
        {
          path: 'json',
          message: 'Failed to parse mappings from JSON',
          severity: 'error',
          code: 'PARSE_ERROR',
        },
      ])
      return false
    }
  }, [jsonValue, jsonErrors, config, setConfig])

  // ==========================================================================
  // PERSISTENCE
  // ==========================================================================

  const save = useCallback(async () => {
    if (!onSave) return
    setIsSaving(true)
    try {
      await onSave(config)
      setIsDirty(false)
    } finally {
      setIsSaving(false)
    }
  }, [config, onSave])

  const exportJSON = useCallback(() => {
    return configToJson(config)
  }, [config])

  // ==========================================================================
  // KEYBOARD SHORTCUTS
  // ==========================================================================

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: ⌘Z or Ctrl+Z
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }

      // Redo: ⌘⇧Z or Ctrl+Shift+Z or Ctrl+Y
      if (
        ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') ||
        ((e.metaKey || e.ctrlKey) && e.key === 'y')
      ) {
        e.preventDefault()
        redo()
      }

      // Save: ⌘S or Ctrl+S
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        save()
      }

      // Escape: Deselect
      if (e.key === 'Escape') {
        setSelectedMappingId(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, save])

  // ==========================================================================
  // CONTEXT VALUE
  // ==========================================================================

  const contextValue = useMemo<MappingStudioContextValue>(
    () => ({
      // Config
      config,
      setConfig,

      // Schemas
      sourceSchema,
      targetSchema,
      sourceFields,
      targetFields,

      // Mapping operations
      addMapping,
      updateMapping,
      removeMapping,
      toggleMapping,
      reorderMappings,
      autoMap,
      clearMappings,

      // Mode
      mode,
      setMode,

      // Selection
      selectedMappingId,
      selectMapping,
      selectedMapping,

      // Search
      searchQuery,
      setSearchQuery,
      filteredMappings,

      // Validation
      validationErrors,
      validate,
      clearValidation,

      // History
      undo,
      redo,
      canUndo,
      canRedo,

      // JSON mode
      jsonValue,
      setJsonValue,
      jsonErrors,
      applyJsonChanges,

      // State
      isDirty,
      isSaving,
      readOnly,

      // Persistence
      save,
      exportJSON,
    }),
    [
      config,
      setConfig,
      sourceSchema,
      targetSchema,
      sourceFields,
      targetFields,
      addMapping,
      updateMapping,
      removeMapping,
      toggleMapping,
      reorderMappings,
      autoMap,
      clearMappings,
      mode,
      selectedMappingId,
      selectMapping,
      selectedMapping,
      searchQuery,
      filteredMappings,
      validationErrors,
      validate,
      clearValidation,
      undo,
      redo,
      canUndo,
      canRedo,
      jsonValue,
      setJsonValue,
      jsonErrors,
      applyJsonChanges,
      isDirty,
      isSaving,
      readOnly,
      save,
      exportJSON,
    ]
  )

  return (
    <MappingStudioContext.Provider value={contextValue}>
      {children}
    </MappingStudioContext.Provider>
  )
}

// =============================================================================
// HOOK
// =============================================================================

export function useMappingStudio(): MappingStudioContextValue {
  const context = useContext(MappingStudioContext)
  if (!context) {
    throw new Error('useMappingStudio must be used within a MappingStudioProvider')
  }
  return context
}

export default MappingStudioProvider
