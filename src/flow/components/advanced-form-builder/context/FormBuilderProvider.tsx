/**
 * Form Builder Provider
 * Provides form builder context with DnD integration
 */

import { useState, useMemo, useCallback, useEffect, type ReactNode } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  pointerWithin,
  rectIntersection,
  type DragStartEvent,
  type DragEndEvent,
  type CollisionDetection,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { FormBuilderContext, type FormBuilderContextValue } from './FormBuilderContext';
import { useFormBuilderStore } from '../stores/form-builder.store';
import { FIELD_BLUEPRINTS } from '../constants';
import type { FieldBlueprint, ISchema } from '../types';
import { PaletteItemOverlay } from '../components/palette/PaletteItem';

interface FormBuilderProviderProps {
  children: ReactNode;
  /** Initial schema to load (for editing existing forms) */
  initialSchema?: ISchema;
}

export function FormBuilderProvider({ children, initialSchema }: FormBuilderProviderProps) {
  // ─────────────────────────────────────────────────────────────────────
  // STORE STATE
  // ─────────────────────────────────────────────────────────────────────
  const {
    schema,
    selectedFieldPath,
    activeTab,
    hasUnsavedChanges,
    isLoading,
    previewMode,
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
    setHasUnsavedChanges,
    setPreviewMode,
    togglePreviewMode,
  } = useFormBuilderStore();

  // ─────────────────────────────────────────────────────────────────────
  // INITIAL SCHEMA LOADING
  // ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (initialSchema && Object.keys(initialSchema.properties || {}).length > 0) {
      setSchema(initialSchema, 'Load initial schema');
      // Reset unsaved changes flag since this is the initial load
      setHasUnsavedChanges(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSchema]);

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
  // CUSTOM COLLISION DETECTION
  // Prioritizes section droppables when dragging from palette
  // ─────────────────────────────────────────────────────────────────────
  const customCollisionDetection: CollisionDetection = useCallback((args) => {
    // First check pointerWithin - this finds containers the pointer is inside
    const pointerCollisions = pointerWithin(args);

    // If dragging from palette, prioritize section droppables
    const activeId = args.active.id as string;
    if (activeId.startsWith('palette-')) {
      // Find section collisions first
      const sectionCollision = pointerCollisions.find(
        (collision) => (collision.id as string).startsWith('section:')
      );
      if (sectionCollision) {
        return [sectionCollision];
      }
    }

    // If we have pointer collisions, use them
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }

    // Fallback to rect intersection for edge cases
    return rectIntersection(args);
  }, []);

  // ─────────────────────────────────────────────────────────────────────
  // NESTED DND OPERATIONS (must be defined before handleDragEnd)
  // ─────────────────────────────────────────────────────────────────────

  // Add field to a specific section
  const addFieldToSection = useCallback(
    (blueprint: FieldBlueprint, sectionPath: string[]) => {
      const currentSchema = schema;

      // Navigate to the section
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let section: any = currentSchema;
      for (const key of sectionPath) {
        if (!section) return;
        section = section[key];
      }

      if (!section || !section.properties) {
        // Initialize properties if it doesn't exist
        section = { ...section, properties: {} };
      }

      // Generate unique field name within the section
      const existingKeys = Object.keys(section.properties || {});
      const baseName = blueprint.key.replace(/-/g, '_');
      let fieldName = baseName;
      let counter = 1;
      while (existingKeys.includes(fieldName)) {
        fieldName = `${baseName}_${counter++}`;
      }

      // Create new field from blueprint
      const newField = {
        type: 'string' as const,
        ...blueprint.defaultSchema,
        'x-index': existingKeys.length,
      };

      // Build the updated schema
      const newSchema = JSON.parse(JSON.stringify(currentSchema));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let target: any = newSchema;
      for (const key of sectionPath) {
        target = target[key];
      }

      if (!target.properties) {
        target.properties = {};
      }
      target.properties[fieldName] = newField;

      setSchema(newSchema, `Add ${blueprint.name} to section`);

      // Select the new field
      selectField([...sectionPath, 'properties', fieldName]);
    },
    [schema, setSchema, selectField]
  );

  // Reorder nested fields within a section
  const reorderNestedFields = useCallback(
    (activePath: string[], overPath: string[]) => {
      const currentSchema = schema;
      const newSchema = JSON.parse(JSON.stringify(currentSchema));

      // Get parent path (everything except the last element)
      const parentPath = activePath.slice(0, -1);
      const activeKey = activePath[activePath.length - 1];
      const overKey = overPath[overPath.length - 1];

      // Navigate to the parent
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let parent: any = newSchema;
      for (const key of parentPath) {
        if (!parent) return;
        parent = parent[key];
      }

      if (!parent || typeof parent !== 'object') return;

      // Get entries sorted by x-index
      const entries = Object.entries(parent).sort((a, b) => {
        const indexA = (a[1] as { 'x-index'?: number })['x-index'] ?? 0;
        const indexB = (b[1] as { 'x-index'?: number })['x-index'] ?? 0;
        return indexA - indexB;
      });

      const activeIndex = entries.findIndex(([key]) => key === activeKey);
      const overIndex = entries.findIndex(([key]) => key === overKey);

      if (activeIndex === -1 || overIndex === -1) return;

      // Move the item
      const [removed] = entries.splice(activeIndex, 1);
      entries.splice(overIndex, 0, removed);

      // Re-index and rebuild parent
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const reorderedParent: Record<string, any> = {};
      entries.forEach(([key, value], index) => {
        reorderedParent[key] = {
          ...(value as object),
          'x-index': index,
        };
      });

      // Set the reordered parent back
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let targetParent: any = newSchema;
      for (let i = 0; i < parentPath.length - 1; i++) {
        targetParent = targetParent[parentPath[i]];
      }
      targetParent[parentPath[parentPath.length - 1]] = reorderedParent;

      setSchema(newSchema, 'Reorder nested fields');
    },
    [schema, setSchema]
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
        const blueprintKey = activeId.replace('palette-', '');
        const blueprint = FIELD_BLUEPRINTS.find((b) => b.key === blueprintKey);

        if (!blueprint) return;

        // Check if dropping into a section
        if (overId.startsWith('section:')) {
          // Extract the section path from "section:properties.section_1"
          const sectionPath = overId.replace('section:', '').split('.');
          addFieldToSection(blueprint, sectionPath);
        }
        // Drop on canvas or existing field (top level)
        else if (overId === 'form-canvas' || !overId.startsWith('palette-')) {
          addField(blueprint);
        }
      }
      // Reordering existing fields
      else if (!activeId.startsWith('palette-') && activeId !== overId && !overId.startsWith('section:')) {
        // Parse paths to check if they're in the same parent
        const activePath = activeId.split('.');
        const overPath = overId.split('.');

        // Check if both are top-level fields (properties.fieldKey)
        if (activePath.length === 2 && overPath.length === 2) {
          const activeKey = activePath[1];
          const overKey = overPath[1];
          reorderFields(activeKey, overKey);
        }
        // Check if both are nested within the same section
        else if (activePath.length > 2 && overPath.length > 2) {
          // Find the common parent path (everything except the last element)
          const activeParent = activePath.slice(0, -1).join('.');
          const overParent = overPath.slice(0, -1).join('.');

          if (activeParent === overParent) {
            // Same parent - reorder within that context
            reorderNestedFields(activePath, overPath);
          }
        }
      }
    },
    [addField, reorderFields, addFieldToSection, reorderNestedFields]
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

      // Preview mode
      previewMode,
      setPreviewMode,
      togglePreviewMode,

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
      previewMode,
      setPreviewMode,
      togglePreviewMode,
      isDragging,
      activeBlueprint,
    ]
  );

  return (
    <FormBuilderContext.Provider value={contextValue}>
      <DndContext
        sensors={sensors}
        collisionDetection={customCollisionDetection}
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
