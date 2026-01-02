/**
 * Form Builder Types
 *
 * TypeScript interfaces for the Form Builder component.
 * Defines field blueprints, categories, schema types, and component props.
 */

import type { ElementType } from 'react';
import {
  Type,
  TextCursorInput,
  AlignLeft,
  Hash,
  ListFilter,
  CircleDot,
  CheckSquare,
  Calendar,
  Upload,
  MapPin,
  User,
  Users,
  UserCog,
  Package,
  Car,
  Building2,
  BookOpen,
  GitBranch,
  type LucideIcon,
} from 'lucide-react';

// =============================================================================
// FIELD CATEGORIES
// =============================================================================

/** Field category for organizing in the palette */
export type FieldCategory = 'form' | 'data' | 'dictionary';

/**
 * Category color types - using DDS palette names
 * Each maps to a unique color from the design system
 */
export type CategoryColor = 'harbor' | 'orange' | 'coral';

/** Category metadata for display */
export interface FieldCategoryInfo {
  id: FieldCategory;
  name: string;
  description: string;
  color: CategoryColor;
}

/** All available field categories with metadata */
export const FIELD_CATEGORIES: FieldCategoryInfo[] = [
  {
    id: 'form',
    name: 'Basic Form Fields',
    description: 'Standard form inputs and controls',
    color: 'harbor',
  },
  {
    id: 'data',
    name: 'Business Entities',
    description: 'Entity selectors and lookups',
    color: 'orange',
  },
  {
    id: 'dictionary',
    name: 'Dictionary & References',
    description: 'Dictionary and cascading selects',
    color: 'coral',
  },
];

/** Get category info by ID */
export function getCategoryInfo(categoryId: FieldCategory): FieldCategoryInfo {
  return (
    FIELD_CATEGORIES.find((c) => c.id === categoryId) ||
    FIELD_CATEGORIES[0]
  );
}

// =============================================================================
// CATEGORY STYLING - Icons and Colors
// =============================================================================

/**
 * Maps category IDs to their color classes
 * Uses DDS CSS variables for maintainability
 *
 * - iconBg: Background color for the category icon/badge
 * - text: Text/icon color
 * - headerBg: Accordion header background
 * - headerBorder: Left border accent on expanded headers
 */
export const CATEGORY_COLORS: Record<
  FieldCategory,
  {
    iconBg: string;
    text: string;
    headerBg: string;
    headerBorder: string;
    badge: string;
  }
> = {
  // HARBOR palette - Green (Basic Form Fields)
  form: {
    iconBg: 'bg-[var(--brand-harbor-100)] dark:bg-[var(--brand-harbor-900)]',
    text: 'text-[var(--brand-harbor-600)] dark:text-[var(--brand-harbor-300)]',
    headerBg: 'bg-[var(--brand-harbor-50)]/50 dark:bg-[var(--brand-harbor-900)]/30',
    headerBorder: 'border-l-[var(--brand-harbor-500)]',
    badge: 'bg-harbor-100 text-harbor-700 border-harbor-200',
  },
  // ORANGE palette - Orange (Business Entities)
  data: {
    iconBg: 'bg-[var(--brand-orange-100)] dark:bg-[var(--brand-orange-900)]',
    text: 'text-[var(--brand-orange-600)] dark:text-[var(--brand-orange-300)]',
    headerBg: 'bg-[var(--brand-orange-50)]/50 dark:bg-[var(--brand-orange-900)]/30',
    headerBorder: 'border-l-[var(--brand-orange-500)]',
    badge: 'bg-aging-light text-aging-dark border-aging-light',
  },
  // CORAL palette - Red (Dictionary & References)
  dictionary: {
    iconBg: 'bg-[var(--brand-coral-100)] dark:bg-[var(--brand-coral-900)]',
    text: 'text-[var(--brand-coral-500)] dark:text-[var(--brand-coral-300)]',
    headerBg: 'bg-[var(--brand-coral-50)]/50 dark:bg-[var(--brand-coral-900)]/30',
    headerBorder: 'border-l-[var(--brand-coral-500)]',
    badge: 'bg-coral-100 text-coral-700 border-coral-200',
  },
};

// =============================================================================
// FIELD ICONS MAPPING
// =============================================================================

/** Maps field type keys to their Lucide icon components */
export const FIELD_ICONS: Record<string, LucideIcon> = {
  // Basic Form Fields
  label: Type,
  input: TextCursorInput,
  textarea: AlignLeft,
  number: Hash,
  select: ListFilter,
  radio: CircleDot,
  checkbox: CheckSquare,
  date: Calendar,
  upload: Upload,
  // Business Entities
  'location-select': MapPin,
  'user-select': User,
  'user-multiselect': Users,
  'role-filtered-user': UserCog,
  'asset-select': Package,
  'vehicle-select': Car,
  'entity-select': Building2,
  // Dictionary Fields
  'dictionary-select': BookOpen,
  'cascading-dictionary': GitBranch,
};

// =============================================================================
// SCHEMA TYPES (Formily Compatible)
// =============================================================================

/** Validation rule for x-validator array */
export interface ValidationRule {
  required?: boolean;
  format?: 'email' | 'url' | 'phone';
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  message?: string;
}

/** Conditional visibility metadata stored in x-reactions */
export interface ConditionalVisibilityMetadata {
  enabled?: boolean;
  parentField: string;
  condition: 'equals' | 'notEquals' | 'hasValue' | 'isEmpty';
  targetValue?: string | boolean | number;
  action: 'show' | 'hide' | 'disable';
}

/** Conditional visibility reaction for x-reactions */
export interface ConditionalReaction {
  dependencies: string[];
  fulfill: {
    state: {
      visible?: string;
      disabled?: string;
    };
  };
  /** Metadata for UI without string expressions */
  _conditionalVisibility?: ConditionalVisibilityMetadata;
}

/** Single field/property in the schema */
export interface SchemaProperty {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'void';
  title?: string;
  description?: string;
  required?: boolean;
  default?: unknown;

  /** Formily-specific properties */
  'x-component'?: string;
  'x-component-props'?: Record<string, unknown>;
  'x-decorator'?: string;
  'x-decorator-props'?: Record<string, unknown>;
  'x-validator'?: ValidationRule[];
  'x-reactions'?: ConditionalReaction;
  'x-index'?: number;
  'x-custom-name'?: boolean;

  /** Standard JSON Schema */
  enum?: Array<{ label: string; value: string | number | boolean }>;
  format?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;

  /** Nested properties for object/section types */
  properties?: Record<string, SchemaProperty>;
  items?: SchemaProperty;
}

/** Root form schema (Formily ISchema compatible) */
export interface ISchema {
  type: 'object';
  title?: string;
  description?: string;
  properties: Record<string, SchemaProperty>;
  required?: string[];
}

/** History entry for undo/redo */
export interface SchemaHistoryEntry {
  schema: ISchema;
  timestamp: number;
  action: string;
}

// =============================================================================
// FIELD BLUEPRINT TYPES
// =============================================================================

/** Blueprint for a field type in the component palette */
export interface FieldBlueprint {
  /** Unique identifier for the field type */
  key: string;
  /** Display name in the palette */
  name: string;
  /** Icon component from Lucide */
  icon: LucideIcon;
  /** Category for grouping in palette */
  category: FieldCategory;
  /** Tooltip/description text */
  description: string;
  /** Default schema generated when field is added */
  defaultSchema: Partial<SchemaProperty>;
}

/** Dragging state for palette items */
export interface DragState {
  isDragging: boolean;
  activeId: string | null;
  activeBlueprint: FieldBlueprint | null;
}

/** Drop target information */
export interface DropTarget {
  path: string[];
  position: 'before' | 'after' | 'inside';
}

// =============================================================================
// VALIDATION TYPES
// =============================================================================

/** Available validation rule types */
export type ValidationRuleType =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'email'
  | 'url'
  | 'phone'
  | 'minimum'
  | 'maximum';

/** Validation rule configuration in the UI */
export interface ValidationRuleConfig {
  type: ValidationRuleType;
  enabled: boolean;
  value?: string | number;
  message: string;
}

/** Available validation rules with metadata */
export interface ValidationRuleDefinition {
  type: ValidationRuleType;
  label: string;
  description: string;
  hasValue: boolean;
  valueType?: 'string' | 'number';
  defaultMessage: string;
  applicableTo: Array<'string' | 'number' | 'boolean' | 'array'>;
}

/** All available validation rules */
export const VALIDATION_RULES: ValidationRuleDefinition[] = [
  {
    type: 'required',
    label: 'Required',
    description: 'Field must have a value',
    hasValue: false,
    defaultMessage: 'This field is required',
    applicableTo: ['string', 'number', 'boolean', 'array'],
  },
  {
    type: 'minLength',
    label: 'Min Length',
    description: 'Minimum character count',
    hasValue: true,
    valueType: 'number',
    defaultMessage: 'Must be at least {value} characters',
    applicableTo: ['string'],
  },
  {
    type: 'maxLength',
    label: 'Max Length',
    description: 'Maximum character count',
    hasValue: true,
    valueType: 'number',
    defaultMessage: 'Must be at most {value} characters',
    applicableTo: ['string'],
  },
  {
    type: 'pattern',
    label: 'Pattern',
    description: 'Regex pattern to match',
    hasValue: true,
    valueType: 'string',
    defaultMessage: 'Value does not match pattern',
    applicableTo: ['string'],
  },
  {
    type: 'email',
    label: 'Email',
    description: 'Must be valid email',
    hasValue: false,
    defaultMessage: 'Must be a valid email address',
    applicableTo: ['string'],
  },
  {
    type: 'url',
    label: 'URL',
    description: 'Must be valid URL',
    hasValue: false,
    defaultMessage: 'Must be a valid URL',
    applicableTo: ['string'],
  },
  {
    type: 'phone',
    label: 'Phone',
    description: 'Must be valid phone',
    hasValue: false,
    defaultMessage: 'Must be a valid phone number',
    applicableTo: ['string'],
  },
  {
    type: 'minimum',
    label: 'Minimum',
    description: 'Minimum numeric value',
    hasValue: true,
    valueType: 'number',
    defaultMessage: 'Must be at least {value}',
    applicableTo: ['number'],
  },
  {
    type: 'maximum',
    label: 'Maximum',
    description: 'Maximum numeric value',
    hasValue: true,
    valueType: 'number',
    defaultMessage: 'Must be at most {value}',
    applicableTo: ['number'],
  },
];

// =============================================================================
// CONDITIONAL VISIBILITY TYPES
// =============================================================================

/** Condition operators for conditional visibility */
export type VisibilityCondition = 'equals' | 'notEquals' | 'hasValue' | 'isEmpty';

/** Action to take when condition is met */
export type VisibilityAction = 'show' | 'hide' | 'disable';

/** Conditional visibility rule structure */
export interface ConditionalVisibilityRule {
  enabled: boolean;
  parentField: string;
  condition: VisibilityCondition;
  targetValue?: string | number | boolean;
  action: VisibilityAction;
}

/** Parent field option for conditional visibility UI */
export interface ParentFieldOption {
  value: string;
  label: string;
  type: string;
  hasOptions: boolean;
  options?: Array<{ label: string; value: string | number | boolean }>;
}

/** Condition option for dropdown */
export interface ConditionOption {
  value: VisibilityCondition;
  label: string;
  needsValue: boolean;
}

/** Action option for dropdown */
export interface ActionOption {
  value: VisibilityAction;
  label: string;
  icon: string;
}

/** Available condition options */
export const CONDITION_OPTIONS: ConditionOption[] = [
  { value: 'equals', label: 'Equals', needsValue: true },
  { value: 'notEquals', label: 'Not Equals', needsValue: true },
  { value: 'hasValue', label: 'Has Value', needsValue: false },
  { value: 'isEmpty', label: 'Is Empty', needsValue: false },
];

/** Available action options */
export const ACTION_OPTIONS: ActionOption[] = [
  { value: 'show', label: 'Show', icon: 'eye' },
  { value: 'hide', label: 'Hide', icon: 'eye-off' },
  { value: 'disable', label: 'Disable', icon: 'ban' },
];

// Legacy aliases for backwards compatibility
export type ConditionOperator = VisibilityCondition;
export type ConditionAction = VisibilityAction;
export type ConditionConfig = ConditionalVisibilityRule;

// =============================================================================
// FORM METADATA
// =============================================================================

/** Form metadata (name, description, etc.) */
export interface FormMetadata {
  name: string;
  description: string;
  category?: string;
  entityTemplateCode?: string;
  lastModified?: Date;
}

// =============================================================================
// COMPONENT PROPS TYPES
// =============================================================================

/** Active tab in the form builder */
export type FormBuilderTab = 'designer' | 'json' | 'preview';

/** Main FormBuilder component props */
export interface FormBuilderProps {
  /** Form title displayed in header */
  title?: string;
  /** Initial form name */
  initialFormName?: string;
  /** Initial form description */
  initialDescription?: string;
  /** Initial entity template code */
  initialEntityTemplate?: string;
  /** Initial schema (for editing existing forms) */
  initialSchema?: ISchema;
  /** Callback when back button is clicked */
  onBack?: () => void;
  /** Callback when save button is clicked */
  onSave?: (data: { metadata: FormMetadata; schema: ISchema }) => void;
  /** Callback when schema viewer is clicked */
  onSchemaViewer?: () => void;
  /** Loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/** ComponentPalette props */
export interface ComponentPaletteProps {
  /** Whether the palette is collapsed (icon-only mode) */
  isCollapsed?: boolean;
  /** Callback when collapse state changes */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Additional CSS classes */
  className?: string;
}

/** FormCanvas props */
export interface FormCanvasProps {
  /** Additional CSS classes */
  className?: string;
}

/** ConfigurationPanel props */
export interface ConfigurationPanelProps {
  /** Whether the panel is collapsed */
  isCollapsed?: boolean;
  /** Callback when collapse state changes */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Additional CSS classes */
  className?: string;
}

/** PaletteItem props */
export interface PaletteItemProps {
  /** Field blueprint data */
  blueprint: FieldBlueprint;
  /** Whether in compact mode (icon only) */
  isCompact?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/** FieldCard props (for canvas) */
export interface FieldCardProps {
  /** Field name/key */
  fieldKey: string;
  /** Field schema */
  schema: SchemaProperty;
  /** Path to field in schema */
  path: string[];
  /** Whether field is selected */
  isSelected?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Delete handler */
  onDelete?: () => void;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Empty schema for new forms */
export const EMPTY_SCHEMA: ISchema = {
  type: 'object',
  properties: {},
};

/** Maximum history entries for undo/redo */
export const MAX_HISTORY_SIZE = 50;

/** Maximum fields per form */
export const MAX_FIELDS = 100;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/** Get icon component for a field type */
export function getFieldIcon(fieldKey: string): ElementType {
  return FIELD_ICONS[fieldKey] || Type;
}

/** Generate a unique field name */
export function generateFieldName(baseName: string, existingNames: string[]): string {
  let counter = 1;
  let name = baseName.toLowerCase().replace(/\s+/g, '_');

  while (existingNames.includes(name)) {
    name = `${baseName.toLowerCase().replace(/\s+/g, '_')}_${counter}`;
    counter++;
  }

  return name;
}
