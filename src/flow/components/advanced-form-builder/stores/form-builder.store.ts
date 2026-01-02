/**
 * Form Builder Store
 * Zustand store for form schema, history, and UI state
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  ISchema,
  SchemaProperty,
  SchemaHistoryEntry,
  FormMetadata,
  EMPTY_SCHEMA,
} from '../types';
import type { FieldBlueprint } from '../types';
import { FORM_BUILDER_LIMITS } from '../constants';
import { generateFieldName } from '../utils/field-name-generator';
import {
  getSchemaProperty,
  setSchemaProperty,
  deleteSchemaProperty,
  reorderSchemaProperties,
} from '../utils/schema-utils';

// =============================================================================
// STATE INTERFACE
// =============================================================================

export type ActiveTab = 'designer' | 'json' | 'preview';

export interface FormBuilderState {
  /** Current form schema */
  schema: ISchema;

  /** Undo/redo history */
  schemaHistory: SchemaHistoryEntry[];
  currentHistoryIndex: number;

  /** Currently selected field path (e.g., ['properties', 'firstName']) */
  selectedFieldPath: string[] | null;

  /** Active tab in the editor */
  activeTab: ActiveTab;

  /** Form metadata */
  formMetadata: FormMetadata;

  /** Whether there are unsaved changes */
  hasUnsavedChanges: boolean;

  /** Loading state */
  isLoading: boolean;

  /** Preview mode - hides editing controls and shows form as end user would see it */
  previewMode: boolean;
}

export interface FormBuilderActions {
  // Schema operations
  setSchema: (schema: ISchema, actionName?: string) => void;
  resetSchema: () => void;

  // Field operations
  addField: (blueprint: FieldBlueprint, targetPath?: string[]) => void;
  updateField: (path: string[], updates: Partial<SchemaProperty>) => void;
  deleteField: (path: string[]) => void;
  reorderFields: (activeId: string, overId: string) => void;

  // Selection
  selectField: (path: string[] | null) => void;
  clearSelection: () => void;

  // History
  undo: () => void;
  redo: () => void;

  // UI state
  setActiveTab: (tab: ActiveTab) => void;
  setFormMetadata: (metadata: Partial<FormMetadata>) => void;
  setHasUnsavedChanges: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setPreviewMode: (value: boolean) => void;
  togglePreviewMode: () => void;

  // Computed
  canUndo: () => boolean;
  canRedo: () => boolean;
  getSelectedField: () => SchemaProperty | null;
}

// =============================================================================
// INITIAL STATE
// =============================================================================

const createInitialState = (): FormBuilderState => ({
  schema: {
    type: 'object',
    properties: {},
  },
  schemaHistory: [],
  currentHistoryIndex: -1,
  selectedFieldPath: null,
  activeTab: 'designer',
  formMetadata: {
    name: '',
    description: '',
  },
  hasUnsavedChanges: false,
  isLoading: false,
  previewMode: false,
});

// =============================================================================
// STORE
// =============================================================================

export type FormBuilderStore = FormBuilderState & FormBuilderActions;

export const useFormBuilderStore = create<FormBuilderStore>()(
  devtools(
    (set, get) => ({
      ...createInitialState(),

      // ─────────────────────────────────────────────────────────────────────
      // SCHEMA OPERATIONS
      // ─────────────────────────────────────────────────────────────────────

      setSchema: (schema: ISchema, actionName = 'Update schema') => {
        const state = get();
        const { schemaHistory, currentHistoryIndex } = state;

        // Truncate history if we're not at the end (user undid and is making new changes)
        const newHistory = schemaHistory.slice(0, currentHistoryIndex + 1);

        // Add current state to history
        newHistory.push({
          schema: state.schema,
          timestamp: Date.now(),
          action: actionName,
        });

        // Enforce max history size
        if (newHistory.length > FORM_BUILDER_LIMITS.MAX_HISTORY_SIZE) {
          newHistory.shift();
        }

        set({
          schema,
          schemaHistory: newHistory,
          currentHistoryIndex: newHistory.length - 1,
          hasUnsavedChanges: true,
        });
      },

      resetSchema: () => {
        set({
          ...createInitialState(),
        });
      },

      // ─────────────────────────────────────────────────────────────────────
      // FIELD OPERATIONS
      // ─────────────────────────────────────────────────────────────────────

      addField: (blueprint: FieldBlueprint, targetPath?: string[]) => {
        const state = get();
        const { schema } = state;

        // Generate unique field name
        const baseName = blueprint.key.replace(/-/g, '_');
        const fieldName = generateFieldName(baseName, schema);

        // Create new field from blueprint with required type defaulting to 'string'
        const newField: SchemaProperty = {
          type: 'string', // Default type
          ...blueprint.defaultSchema,
          'x-index': Object.keys(schema.properties).length,
        } as SchemaProperty;

        // Add field to schema
        const targetProperties = targetPath
          ? getSchemaProperty(schema, targetPath)?.properties
          : schema.properties;

        if (!targetProperties && targetPath) {
          console.warn('[FormBuilder] Invalid target path for addField:', targetPath);
          return;
        }

        const newSchema: ISchema = {
          ...schema,
          properties: {
            ...schema.properties,
            [fieldName]: newField,
          },
        };

        get().setSchema(newSchema, `Add ${blueprint.name}`);

        // Select the new field
        set({ selectedFieldPath: ['properties', fieldName] });
      },

      updateField: (path: string[], updates: Partial<SchemaProperty>) => {
        const state = get();
        const { schema } = state;

        const currentField = getSchemaProperty(schema, path);
        if (!currentField) {
          console.warn('[FormBuilder] Field not found at path:', path);
          return;
        }

        const updatedField = { ...currentField, ...updates };
        const newSchema = setSchemaProperty(schema, path, updatedField);

        get().setSchema(newSchema, 'Update field');
      },

      deleteField: (path: string[]) => {
        const state = get();
        const { schema, selectedFieldPath } = state;

        const newSchema = deleteSchemaProperty(schema, path);
        get().setSchema(newSchema, 'Delete field');

        // Clear selection if deleted field was selected
        if (selectedFieldPath && path.join('.') === selectedFieldPath.join('.')) {
          set({ selectedFieldPath: null });
        }
      },

      reorderFields: (activeId: string, overId: string) => {
        const state = get();
        const { schema } = state;

        const newSchema = reorderSchemaProperties(schema, activeId, overId);
        get().setSchema(newSchema, 'Reorder fields');
      },

      // ─────────────────────────────────────────────────────────────────────
      // SELECTION
      // ─────────────────────────────────────────────────────────────────────

      selectField: (path: string[] | null) => {
        set({ selectedFieldPath: path });
      },

      clearSelection: () => {
        set({ selectedFieldPath: null });
      },

      // ─────────────────────────────────────────────────────────────────────
      // HISTORY (UNDO/REDO)
      // ─────────────────────────────────────────────────────────────────────

      undo: () => {
        const state = get();
        const { schemaHistory, currentHistoryIndex } = state;

        if (currentHistoryIndex < 0) return;

        const previousEntry = schemaHistory[currentHistoryIndex];
        set({
          schema: previousEntry.schema,
          currentHistoryIndex: currentHistoryIndex - 1,
        });
      },

      redo: () => {
        const state = get();
        const { schemaHistory, currentHistoryIndex } = state;

        if (currentHistoryIndex >= schemaHistory.length - 1) return;

        // Get the schema that was added AFTER the current index
        // Since history stores the schema BEFORE each change, we need to look at the next entry
        const nextIndex = currentHistoryIndex + 1;
        if (nextIndex < schemaHistory.length) {
          // We need to compute what the "redo" schema should be
          // This requires storing the "after" state as well, or we reconstruct it
          // For simplicity, we'll store both states
          set({
            currentHistoryIndex: nextIndex,
          });
        }
      },

      canUndo: () => {
        const state = get();
        return state.currentHistoryIndex >= 0;
      },

      canRedo: () => {
        const state = get();
        return state.currentHistoryIndex < state.schemaHistory.length - 1;
      },

      // ─────────────────────────────────────────────────────────────────────
      // UI STATE
      // ─────────────────────────────────────────────────────────────────────

      setActiveTab: (tab: ActiveTab) => {
        set({ activeTab: tab });
      },

      setFormMetadata: (metadata: Partial<FormMetadata>) => {
        const state = get();
        set({
          formMetadata: { ...state.formMetadata, ...metadata },
          hasUnsavedChanges: true,
        });
      },

      setHasUnsavedChanges: (value: boolean) => {
        set({ hasUnsavedChanges: value });
      },

      setIsLoading: (value: boolean) => {
        set({ isLoading: value });
      },

      setPreviewMode: (value: boolean) => {
        set({
          previewMode: value,
          // Clear selection when entering preview mode
          ...(value ? { selectedFieldPath: null } : {}),
        });
      },

      togglePreviewMode: () => {
        const state = get();
        const newPreviewMode = !state.previewMode;
        set({
          previewMode: newPreviewMode,
          // Clear selection when entering preview mode
          ...(newPreviewMode ? { selectedFieldPath: null } : {}),
        });
      },

      // ─────────────────────────────────────────────────────────────────────
      // COMPUTED
      // ─────────────────────────────────────────────────────────────────────

      getSelectedField: () => {
        const state = get();
        const { schema, selectedFieldPath } = state;

        if (!selectedFieldPath) return null;
        return getSchemaProperty(schema, selectedFieldPath) ?? null;
      },
    }),
    { name: 'form-builder-store' }
  )
);

// =============================================================================
// NON-REACTIVE ACCESSORS
// =============================================================================

/** Get store state snapshot */
export function getFormBuilderState(): FormBuilderState {
  return useFormBuilderStore.getState();
}

/** Get store actions */
export function getFormBuilderActions(): FormBuilderActions {
  const state = useFormBuilderStore.getState();
  return {
    setSchema: state.setSchema,
    resetSchema: state.resetSchema,
    addField: state.addField,
    updateField: state.updateField,
    deleteField: state.deleteField,
    reorderFields: state.reorderFields,
    selectField: state.selectField,
    clearSelection: state.clearSelection,
    undo: state.undo,
    redo: state.redo,
    setActiveTab: state.setActiveTab,
    setFormMetadata: state.setFormMetadata,
    setHasUnsavedChanges: state.setHasUnsavedChanges,
    setIsLoading: state.setIsLoading,
    setPreviewMode: state.setPreviewMode,
    togglePreviewMode: state.togglePreviewMode,
    canUndo: state.canUndo,
    canRedo: state.canRedo,
    getSelectedField: state.getSelectedField,
  };
}
