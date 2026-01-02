/**
 * Schema Types for Form Builder
 * Based on Formily ISchema with extensions for form building
 */

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
  _conditionalVisibility?: {
    parentField: string;
    condition: 'equals' | 'notEquals' | 'hasValue' | 'isEmpty';
    targetValue?: string | boolean | number;
    action: 'show' | 'hide' | 'disable';
  };
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

/** Form metadata (name, description, etc.) */
export interface FormMetadata {
  name: string;
  description: string;
  category?: string;
  entityTemplateCode?: string;
  lastModified?: Date;
}

/** Empty schema for new forms */
export const EMPTY_SCHEMA: ISchema = {
  type: 'object',
  properties: {},
};
