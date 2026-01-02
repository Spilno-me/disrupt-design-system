/**
 * Advanced Form Builder - Barrel Export
 *
 * Enhanced form builder for EHS applications with advanced features:
 * - Repeating sections (array fields)
 * - Advanced conditional logic (AND/OR)
 * - Scoring fields (pass/fail, risk matrix)
 * - Section grouping
 * - Multi-page forms
 *
 * @example
 * ```tsx
 * import { AdvancedFormBuilder } from '@/flow/components/advanced-form-builder';
 *
 * function MyPage() {
 *   return (
 *     <AdvancedFormBuilder
 *       formName="Safety Inspection"
 *       onSave={() => console.log('Save')}
 *     />
 *   );
 * }
 * ```
 */

// Main component
export { AdvancedFormBuilder } from './AdvancedFormBuilder';
export type { AdvancedFormBuilderProps, EntityTemplate } from './AdvancedFormBuilder';

// Context and hooks (using same context as base form builder)
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
export {
  FIELD_BLUEPRINTS,
  FIELD_BLUEPRINTS_BY_CATEGORY,
  FIELD_ICON_MAP,
  getFieldBlueprint,
  type CategoryMeta,
  FORM_BUILDER_LIMITS,
} from './constants';

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
