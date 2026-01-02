/**
 * Form Builder - Barrel Export
 *
 * Full-featured form builder with drag-and-drop field creation,
 * real-time preview, and JSON schema editing.
 *
 * @example
 * ```tsx
 * import { FormBuilder } from '@/flow/components/form-builder';
 *
 * function MyPage() {
 *   return (
 *     <FormBuilder
 *       title="Create Form"
 *       onSave={() => console.log('Save')}
 *     />
 *   );
 * }
 * ```
 */

// Main component
export { FormBuilder } from './FormBuilder';
export type { FormBuilderProps, EntityTemplate } from './FormBuilder';

// Context and hooks
export {
  FormBuilderProvider,
  useFormBuilder,
  FormBuilderContext,
} from './context';
export type { FormBuilderContextValue } from './context';

// Store
export {
  useFormBuilderStore,
  getFormBuilderState,
  getFormBuilderActions,
} from './stores/form-builder.store';
export type {
  FormBuilderState,
  FormBuilderActions,
  FormBuilderStore,
  ActiveTab,
} from './stores/form-builder.store';

// Types (main source of truth for type definitions)
export * from './types';

// Constants (field blueprints, limits)
// Note: FieldBlueprint type is re-exported from types, not duplicated
export {
  FIELD_BLUEPRINTS,
  FIELD_BLUEPRINTS_BY_CATEGORY,
  FIELD_ICON_MAP,
  getFieldBlueprint,
  type CategoryMeta,
  FORM_BUILDER_LIMITS,
} from './constants';
// Note: FIELD_CATEGORIES is exported from types.ts as FieldCategoryInfo[]

// Utilities
export { getOrderedFields } from './utils';

// Individual components (for custom layouts)
export {
  ComponentPalette,
  PaletteItem,
  PaletteItemOverlay,
} from './components/palette';

export {
  FormCanvas,
  CanvasField,
  EmptyState,
} from './components/canvas';

export {
  PropertiesPanel,
  FormStructureTree,
  FieldPropertiesPanel,
  OptionsEditor,
  ValidationRulesEditor,
  ConditionalVisibility,
} from './components/properties';

export {
  FormBuilderHeader,
  FormBuilderContent,
  JsonEditor,
  FormPreview,
} from './components';
