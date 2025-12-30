/**
 * VisualMode - Visual schema editor layout
 *
 * Provides the drag-and-drop field list with optional preview panel.
 * Connects to SchemaStudio context for state management.
 */

import * as React from 'react'
import { cn } from '../../../../lib/utils'
import { FieldList } from '../components/FieldList'
import { FieldEditor } from '../components/FieldEditor'
import { useSchemaStudio } from '../context/SchemaStudioProvider'
import type { SchemaField, LookupOption } from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface VisualModeProps {
  /** Additional class name */
  className?: string
  /** Lookup options for select fields */
  lookupOptions?: Record<string, LookupOption[]>
}

// =============================================================================
// COMPONENT
// =============================================================================

export function VisualMode({ className, lookupOptions }: VisualModeProps) {
  const {
    // State
    fields,
    filteredFields,
    selectedFieldKey,
    selectedField,
    searchQuery,
    isFieldEditorOpen,

    // Actions
    selectField,
    openFieldEditor,
    closeFieldEditor,
    setSearchQuery,
    addField,
    updateField,
    removeField,
    toggleRequired,
    reorderFields,
  } = useSchemaStudio()

  // Track if adding new field
  const [isAddingNew, setIsAddingNew] = React.useState(false)

  // Handle add new field
  const handleAddField = React.useCallback(() => {
    setIsAddingNew(true)
    openFieldEditor()
  }, [openFieldEditor])

  // Handle field edit
  const handleEditField = React.useCallback(
    (key: string) => {
      setIsAddingNew(false)
      openFieldEditor(key)
    },
    [openFieldEditor]
  )

  // Handle save from editor
  const handleSaveField = React.useCallback(
    (key: string, field: SchemaField) => {
      if (isAddingNew) {
        addField(key, field)
      } else if (selectedFieldKey && selectedFieldKey !== key) {
        // Key was renamed - remove old, add new
        removeField(selectedFieldKey)
        addField(key, field)
      } else {
        updateField(key, field)
      }
    },
    [isAddingNew, selectedFieldKey, addField, removeField, updateField]
  )

  // Handle delete from editor
  const handleDeleteField = React.useCallback(
    (key: string) => {
      removeField(key)
      selectField(null)
    },
    [removeField, selectField]
  )

  // Handle editor close
  const handleEditorClose = React.useCallback(
    (open: boolean) => {
      if (!open) {
        closeFieldEditor()
        setIsAddingNew(false)
      }
    },
    [closeFieldEditor]
  )

  // Get existing keys for duplicate detection
  const existingKeys = React.useMemo(
    () => fields.map((f) => f.key).filter((k) => k !== selectedFieldKey),
    [fields, selectedFieldKey]
  )

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Field List */}
      <FieldList
        fields={fields}
        selectedKey={selectedFieldKey}
        searchQuery={searchQuery}
        onFieldSelect={selectField}
        onFieldEdit={handleEditField}
        onFieldDelete={handleDeleteField}
        onFieldToggleRequired={toggleRequired}
        onReorder={reorderFields}
        onAddField={handleAddField}
        className="flex-1 min-h-0"
      />

      {/* Field Editor Sheet */}
      <FieldEditor
        field={isAddingNew ? null : selectedField ?? null}
        open={isFieldEditorOpen}
        onOpenChange={handleEditorClose}
        onSave={handleSaveField}
        onDelete={handleDeleteField}
        existingKeys={existingKeys}
        lookupOptions={lookupOptions}
      />
    </div>
  )
}

export default VisualMode
