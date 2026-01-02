/**
 * Field Type Definitions
 *
 * Blueprints for all available field types in the component palette.
 * Uses DDS color tokens for category styling.
 */

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
  // Layout & Structure Icons
  Layers,
  Repeat2,
  // Calculated Field Icon
  Calculator,
  type LucideIcon,
} from 'lucide-react';
import type { FieldCategory, FieldBlueprint } from '../types';

// Re-export FieldBlueprint for convenience
export type { FieldBlueprint } from '../types';

// =============================================================================
// CATEGORY METADATA
// =============================================================================

/** Category metadata for display */
export interface CategoryMeta {
  key: FieldCategory;
  label: string;
  description: string;
  /** Count of fields in this category */
  count: number;
}

/** All field categories with metadata and counts */
export const FIELD_CATEGORIES: CategoryMeta[] = [
  {
    key: 'layout',
    label: 'Layout & Structure',
    description: 'Sections and repeating groups',
    count: 2,
  },
  {
    key: 'form',
    label: 'Basic Form Fields',
    description: 'Standard input fields',
    count: 10,
  },
  {
    key: 'data',
    label: 'Business Entities',
    description: 'Entity reference selectors',
    count: 7,
  },
  {
    key: 'dictionary',
    label: 'Dictionary & References',
    description: 'Data dictionary fields',
    count: 2,
  },
];

// =============================================================================
// ICON MAPPING
// =============================================================================

/** Maps field key to its Lucide icon */
export const FIELD_ICON_MAP: Record<string, LucideIcon> = {
  // Layout & Structure
  section: Layers,
  'repeating-section': Repeat2,
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
  calculated: Calculator,
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
// FIELD BLUEPRINTS
// =============================================================================

/** All available field blueprints */
export const FIELD_BLUEPRINTS: FieldBlueprint[] = [
  // ═══════════════════════════════════════════════════════════════
  // LAYOUT & STRUCTURE FIELDS (Purple)
  // ═══════════════════════════════════════════════════════════════
  {
    key: 'section',
    name: 'Section',
    icon: Layers,
    category: 'layout',
    description: 'Collapsible group of related fields',
    defaultSchema: {
      type: 'object',
      title: 'Section',
      'x-component': 'FormSection',
      'x-decorator': 'FormItem',
      'x-component-props': {
        collapsible: true,
        defaultCollapsed: false,
      },
      properties: {},
    },
  },
  {
    key: 'repeating-section',
    name: 'Repeating Section',
    icon: Repeat2,
    category: 'layout',
    description: 'Add multiple entries (e.g., witnesses, PPE items)',
    defaultSchema: {
      type: 'array',
      title: 'Repeating Section',
      'x-component': 'ArrayField',
      'x-decorator': 'FormItem',
      'x-component-props': {
        minItems: 0,
        maxItems: 10,
        addButtonText: 'Add Entry',
      },
      items: {
        type: 'object',
        properties: {},
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // BASIC FORM FIELDS (Harbor/Green)
  // ═══════════════════════════════════════════════════════════════
  {
    key: 'label',
    name: 'Label',
    icon: Type,
    category: 'form',
    description: 'Static text display',
    defaultSchema: {
      type: 'void',
      'x-component': 'FormText',
      'x-component-props': {
        content: 'Static label text',
      },
    },
  },
  {
    key: 'input',
    name: 'Text Input',
    icon: TextCursorInput,
    category: 'form',
    description: 'Single-line text input',
    defaultSchema: {
      type: 'string',
      title: 'Text Field',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
    },
  },
  {
    key: 'textarea',
    name: 'Text Area',
    icon: AlignLeft,
    category: 'form',
    description: 'Multi-line text input',
    defaultSchema: {
      type: 'string',
      title: 'Text Area',
      'x-component': 'TextArea',
      'x-decorator': 'FormItem',
      'x-component-props': {
        rows: 4,
      },
    },
  },
  {
    key: 'number',
    name: 'Number',
    icon: Hash,
    category: 'form',
    description: 'Numeric input field',
    defaultSchema: {
      type: 'number',
      title: 'Number',
      'x-component': 'NumberPicker',
      'x-decorator': 'FormItem',
    },
  },
  {
    key: 'select',
    name: 'Select',
    icon: ListFilter,
    category: 'form',
    description: 'Dropdown selection',
    defaultSchema: {
      type: 'string',
      title: 'Select',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      enum: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
      ],
    },
  },
  {
    key: 'radio',
    name: 'Radio Group',
    icon: CircleDot,
    category: 'form',
    description: 'Radio button selection',
    defaultSchema: {
      type: 'string',
      title: 'Radio Group',
      'x-component': 'RadioGroup',
      'x-decorator': 'FormItem',
      enum: [
        { label: 'Option A', value: 'a' },
        { label: 'Option B', value: 'b' },
        { label: 'Option C', value: 'c' },
      ],
    },
  },
  {
    key: 'checkbox',
    name: 'Checkbox',
    icon: CheckSquare,
    category: 'form',
    description: 'Boolean checkbox toggle',
    defaultSchema: {
      type: 'boolean',
      title: 'Checkbox',
      'x-component': 'Checkbox',
      'x-decorator': 'FormItem',
    },
  },
  {
    key: 'date',
    name: 'Date Picker',
    icon: Calendar,
    category: 'form',
    description: 'Date selection',
    defaultSchema: {
      type: 'string',
      title: 'Date',
      'x-component': 'DatePicker',
      'x-decorator': 'FormItem',
    },
  },
  {
    key: 'upload',
    name: 'File Upload',
    icon: Upload,
    category: 'form',
    description: 'File attachment upload',
    defaultSchema: {
      type: 'array',
      title: 'File Upload',
      'x-component': 'Upload',
      'x-decorator': 'FormItem',
      'x-component-props': {
        maxCount: 5,
        maxSize: 10 * 1024 * 1024,
      },
    },
  },
  {
    key: 'calculated',
    name: 'Calculated',
    icon: Calculator,
    category: 'form',
    description: 'Auto-calculated value from formula',
    defaultSchema: {
      type: 'number',
      title: 'Calculated Field',
      'x-component': 'CalculatedField',
      'x-decorator': 'FormItem',
      'x-component-props': {
        formula: '',
        sourceFields: [],
        resultType: 'number',
        decimalPlaces: 2,
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // BUSINESS ENTITY FIELDS (Orange)
  // ═══════════════════════════════════════════════════════════════
  {
    key: 'location-select',
    name: 'Location',
    icon: MapPin,
    category: 'data',
    description: 'Hierarchical location tree selection',
    defaultSchema: {
      type: 'string',
      title: 'Location',
      'x-component': 'LocationSelect',
      'x-decorator': 'FormItem',
    },
  },
  {
    key: 'user-select',
    name: 'User',
    icon: User,
    category: 'data',
    description: 'Single user selection with search',
    defaultSchema: {
      type: 'string',
      title: 'User',
      'x-component': 'UserSelect',
      'x-decorator': 'FormItem',
    },
  },
  {
    key: 'user-multiselect',
    name: 'Users (Multi)',
    icon: Users,
    category: 'data',
    description: 'Multiple user selection',
    defaultSchema: {
      type: 'array',
      title: 'Users',
      'x-component': 'UserMultiSelect',
      'x-decorator': 'FormItem',
    },
  },
  {
    key: 'role-filtered-user',
    name: 'Role User',
    icon: UserCog,
    category: 'data',
    description: 'User selection filtered by role',
    defaultSchema: {
      type: 'string',
      title: 'Role User',
      'x-component': 'RoleFilteredUserSelect',
      'x-decorator': 'FormItem',
      'x-component-props': {
        roleFilter: '',
      },
    },
  },
  {
    key: 'asset-select',
    name: 'Asset',
    icon: Package,
    category: 'data',
    description: 'Asset selection with type filtering',
    defaultSchema: {
      type: 'string',
      title: 'Asset',
      'x-component': 'AssetSelect',
      'x-decorator': 'FormItem',
    },
  },
  {
    key: 'vehicle-select',
    name: 'Vehicle',
    icon: Car,
    category: 'data',
    description: 'Vehicle selection',
    defaultSchema: {
      type: 'string',
      title: 'Vehicle',
      'x-component': 'VehicleSelect',
      'x-decorator': 'FormItem',
    },
  },
  {
    key: 'entity-select',
    name: 'Entity',
    icon: Building2,
    category: 'data',
    description: 'Dynamic entity type selection',
    defaultSchema: {
      type: 'string',
      title: 'Entity',
      'x-component': 'GenericEntitySelect',
      'x-decorator': 'FormItem',
      'x-component-props': {
        entityType: '',
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // DICTIONARY FIELDS (Coral/Red)
  // ═══════════════════════════════════════════════════════════════
  {
    key: 'dictionary-select',
    name: 'Dictionary',
    icon: BookOpen,
    category: 'dictionary',
    description: 'Configurable dictionary dropdown',
    defaultSchema: {
      type: 'string',
      title: 'Dictionary',
      'x-component': 'DictionarySelect',
      'x-decorator': 'FormItem',
      'x-component-props': {
        dictionaryCode: '',
      },
    },
  },
  {
    key: 'cascading-dictionary',
    name: 'Cascading Dict',
    icon: GitBranch,
    category: 'dictionary',
    description: 'Parent-child dictionary filtering',
    defaultSchema: {
      type: 'string',
      title: 'Cascading Dictionary',
      'x-component': 'DictionarySelect',
      'x-decorator': 'FormItem',
      'x-component-props': {
        dictionaryCode: '',
        parentDictionaryId: '',
      },
    },
  },
];

// =============================================================================
// COMPUTED EXPORTS
// =============================================================================

/** Group blueprints by category */
export const FIELD_BLUEPRINTS_BY_CATEGORY: Record<FieldCategory, FieldBlueprint[]> = {
  layout: FIELD_BLUEPRINTS.filter((b) => b.category === 'layout'),
  form: FIELD_BLUEPRINTS.filter((b) => b.category === 'form'),
  data: FIELD_BLUEPRINTS.filter((b) => b.category === 'data'),
  dictionary: FIELD_BLUEPRINTS.filter((b) => b.category === 'dictionary'),
};

/** Get a blueprint by its key */
export function getFieldBlueprint(key: string): FieldBlueprint | undefined {
  return FIELD_BLUEPRINTS.find((b) => b.key === key);
}
