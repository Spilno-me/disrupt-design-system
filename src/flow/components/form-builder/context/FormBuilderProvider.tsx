/**
 * Form Builder Provider
 * Provides form builder context with DnD integration
 */

import { useState, useMemo, useCallback, type ReactNode } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { FormBuilderContext, type FormBuilderContextValue } from './FormBuilderContext';
import { useFormBuilderStore } from '../stores/form-builder.store';
import { FIELD_BLUEPRINTS } from '../constants';
import type { FieldBlueprint } from '../types';
import { PaletteItemOverlay } from '../components/palette/PaletteItem';

interface FormBuilderProviderProps {
  children: ReactNode;
}

export function FormBuilderProvider({ children }: FormBuilderProviderProps) {
  // ─────────────────────────────────────────────────────────────────────
  // STORE STATE
  // ─────────────────────────────────────────────────────────────────────
  const {
    schema,
    selectedFieldPath,
    activeTab,
    hasUnsavedChanges,
    isLoading,
    schemaHistory,
    currentHistoryIndex,
    setSchema,
    addField,
    updateField,
    deleteField,
    reorderFields,
    selectField,
    undo,
    redo,
    setActiveTab,
    getSelectedField,
  } = useFormBuilderStore();

  // ─────────────────────────────────────────────────────────────────────
  // DRAG STATE
  // ─────────────────────────────────────────────────────────────────────
  const [isDragging, setIsDragging] = useState(false);
  const [activeBlueprint, setActiveBlueprint] = useState<FieldBlueprint | null>(null);

  // ─────────────────────────────────────────────────────────────────────
  // DND SENSORS
  // ─────────────────────────────────────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum drag distance before activation
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ─────────────────────────────────────────────────────────────────────
  // DND HANDLERS
  // ─────────────────────────────────────────────────────────────────────
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id as string;

    // Check if dragging from palette
    if (activeId.startsWith('palette-')) {
      const blueprintKey = activeId.replace('palette-', '');
      const blueprint = FIELD_BLUEPRINTS.find((b) => b.key === blueprintKey);

      if (blueprint) {
        setActiveBlueprint(blueprint);
        setIsDragging(true);
      }
    } else {
      // Dragging existing field (for reordering)
      setIsDragging(true);
    }
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setIsDragging(false);
      setActiveBlueprint(null);

      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      // Check if dropping from palette
      if (activeId.startsWith('palette-')) {
        // Accept drop on canvas or any existing field
        const isValidTarget = overId === 'form-canvas' || !overId.startsWith('palette-');

        if (isValidTarget) {
          const blueprintKey = activeId.replace('palette-', '');
          const blueprint = FIELD_BLUEPRINTS.find((b) => b.key === blueprintKey);

          if (blueprint) {
            addField(blueprint);
          }
        }
      }
      // Reordering existing fields
      else if (!activeId.startsWith('palette-') && activeId !== overId) {
        reorderFields(activeId, overId);
      }
    },
    [addField, reorderFields]
  );

  // ─────────────────────────────────────────────────────────────────────
  // COMPUTED VALUES
  // ─────────────────────────────────────────────────────────────────────
  const selectedField = useMemo(() => getSelectedField(), [getSelectedField, selectedFieldPath]);
  const canUndo = currentHistoryIndex >= 0;
  const canRedo = currentHistoryIndex < schemaHistory.length - 1;

  // ─────────────────────────────────────────────────────────────────────
  // CONTEXT VALUE
  // ─────────────────────────────────────────────────────────────────────
  const contextValue: FormBuilderContextValue = useMemo(
    () => ({
      // Schema
      schema,
      updateSchema: setSchema,

      // Field operations
      addField,
      updateField,
      deleteField,
      reorderFields,

      // Selection
      selectedFieldPath,
      selectedField,
      selectField,

      // History
      undo,
      redo,
      canUndo,
      canRedo,

      // UI state
      activeTab,
      setActiveTab,
      hasUnsavedChanges,
      isLoading,

      // Drag state
      isDragging,
      activeBlueprint,
    }),
    [
      schema,
      setSchema,
      addField,
      updateField,
      deleteField,
      reorderFields,
      selectedFieldPath,
      selectedField,
      selectField,
      undo,
      redo,
      canUndo,
      canRedo,
      activeTab,
      setActiveTab,
      hasUnsavedChanges,
      isLoading,
      isDragging,
      activeBlueprint,
    ]
  );

  return (
    <FormBuilderContext.Provider value={contextValue}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {children}

        {/* Drag overlay for visual feedback */}
        <DragOverlay>
          {activeBlueprint && <PaletteItemOverlay blueprint={activeBlueprint} />}
        </DragOverlay>
      </DndContext>
    </FormBuilderContext.Provider>
  );
}
