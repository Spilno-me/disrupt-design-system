/**
 * Conditional Visibility Types
 * Types for show/hide/disable logic based on field values
 */

/** Condition operators for comparing field values */
export type VisibilityCondition = 'equals' | 'notEquals' | 'hasValue' | 'isEmpty';

/** Action to take when condition is met */
export type VisibilityAction = 'show' | 'hide' | 'disable';

/** Conditional visibility rule configuration */
export interface ConditionalVisibilityRule {
  /** Field name/key of the parent field this depends on */
  parentField: string;
  /** How to compare the parent field's value */
  condition: VisibilityCondition;
  /** Value to compare against (not needed for hasValue/isEmpty) */
  targetValue?: string | boolean | number;
  /** Action to take when condition is met */
  action: VisibilityAction;
}

/** Option for parent field selector dropdown */
export interface ParentFieldOption {
  value: string;
  label: string;
  type: string;
  hasOptions: boolean;
  options?: Array<{ label: string; value: unknown }>;
}

/** Condition definitions for the UI */
export const CONDITION_OPTIONS: Array<{
  value: VisibilityCondition;
  label: string;
  requiresValue: boolean;
}> = [
  { value: 'equals', label: 'Equals', requiresValue: true },
  { value: 'notEquals', label: 'Not Equals', requiresValue: true },
  { value: 'hasValue', label: 'Has Value', requiresValue: false },
  { value: 'isEmpty', label: 'Is Empty', requiresValue: false },
];

/** Action definitions for the UI */
export const ACTION_OPTIONS: Array<{
  value: VisibilityAction;
  label: string;
  description: string;
}> = [
  { value: 'show', label: 'Show', description: 'Show field when condition is met' },
  { value: 'hide', label: 'Hide', description: 'Hide field when condition is met' },
  { value: 'disable', label: 'Disable', description: 'Disable field when condition is met' },
];
