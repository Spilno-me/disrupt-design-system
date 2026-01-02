/**
 * Validation Types
 * Types for configuring field validation rules
 */

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

/** Validation rule definitions for the UI */
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
    description: 'Minimum character length',
    hasValue: true,
    valueType: 'number',
    defaultMessage: 'Must be at least {value} characters',
    applicableTo: ['string'],
  },
  {
    type: 'maxLength',
    label: 'Max Length',
    description: 'Maximum character length',
    hasValue: true,
    valueType: 'number',
    defaultMessage: 'Must be no more than {value} characters',
    applicableTo: ['string'],
  },
  {
    type: 'minimum',
    label: 'Minimum Value',
    description: 'Minimum numeric value',
    hasValue: true,
    valueType: 'number',
    defaultMessage: 'Must be at least {value}',
    applicableTo: ['number'],
  },
  {
    type: 'maximum',
    label: 'Maximum Value',
    description: 'Maximum numeric value',
    hasValue: true,
    valueType: 'number',
    defaultMessage: 'Must be no more than {value}',
    applicableTo: ['number'],
  },
  {
    type: 'email',
    label: 'Email Format',
    description: 'Must be a valid email address',
    hasValue: false,
    defaultMessage: 'Must be a valid email address',
    applicableTo: ['string'],
  },
  {
    type: 'url',
    label: 'URL Format',
    description: 'Must be a valid URL',
    hasValue: false,
    defaultMessage: 'Must be a valid URL',
    applicableTo: ['string'],
  },
  {
    type: 'phone',
    label: 'Phone Format',
    description: 'Must be a valid phone number',
    hasValue: false,
    defaultMessage: 'Must be a valid phone number',
    applicableTo: ['string'],
  },
  {
    type: 'pattern',
    label: 'Pattern (Regex)',
    description: 'Must match a regular expression',
    hasValue: true,
    valueType: 'string',
    defaultMessage: 'Invalid format',
    applicableTo: ['string'],
  },
];
