/**
 * Form Builder Context
 * Context definition for the form builder
 */

import { createContext, useContext } from 'react';
import type { ISchema, SchemaProperty, FieldBlueprint } from '../types';
import type { ActiveTab } from '../stores/form-builder.store';

export interface FormBuilderContextValue {
  // ─────────────────────────────────────────────────────────────────────
  // SCHEMA STATE
  // ─────────────────────────────────────────────────────────────────────
  schema: ISchema;
  updateSchema: (schema: ISchema) => void;

  // ─────────────────────────────────────────────────────────────────────
  // FIELD OPERATIONS
  // ─────────────────────────────────────────────────────────────────────
  addField: (blueprint: FieldBlueprint, targetPath?: string[]) => void;
  updateField: (path: string[], updates: Partial<SchemaProperty>) => void;
  deleteField: (path: string[]) => void;
  reorderFields: (activeId: string, overId: string) => void;

  // ─────────────────────────────────────────────────────────────────────
  // SELECTION
  // ─────────────────────────────────────────────────────────────────────
  selectedFieldPath: string[] | null;
  selectedField: SchemaProperty | null;
  selectField: (path: string[] | null) => void;

  // ─────────────────────────────────────────────────────────────────────
  // HISTORY
  // ─────────────────────────────────────────────────────────────────────
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // ─────────────────────────────────────────────────────────────────────
  // UI STATE
  // ─────────────────────────────────────────────────────────────────────
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  hasUnsavedChanges: boolean;
  isLoading: boolean;

  // ─────────────────────────────────────────────────────────────────────
  // PREVIEW MODE
  // ─────────────────────────────────────────────────────────────────────
  /** When true, hides editing controls and shows form as end user would see it */
  previewMode: boolean;
  setPreviewMode: (value: boolean) => void;
  togglePreviewMode: () => void;

  // ─────────────────────────────────────────────────────────────────────
  // DRAG STATE
  // ─────────────────────────────────────────────────────────────────────
  isDragging: boolean;
  activeBlueprint: FieldBlueprint | null;
}

export const FormBuilderContext = createContext<FormBuilderContextValue | null>(null);

/**
 * Hook to access form builder context
 * @throws Error if used outside FormBuilderProvider
 */
export function useFormBuilder(): FormBuilderContextValue {
  const context = useContext(FormBuilderContext);

  if (!context) {
    throw new Error('useFormBuilder must be used within a FormBuilderProvider');
  }

  return context;
}
