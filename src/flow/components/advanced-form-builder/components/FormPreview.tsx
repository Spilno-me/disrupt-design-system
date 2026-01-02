/**
 * Form Preview
 * Live preview of the form with mock data entry
 * Supports: FormSection, ArrayField, CalculatedField, Conditional Visibility
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { RefreshCw, ChevronDown, ChevronRight, Plus, Trash2, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFormBuilder } from '../context';
import type { SchemaProperty } from '../types';

/**
 * Safe expression evaluator for conditional visibility
 * Parses expressions like: $deps[0] === 'value' || $deps[1] === true
 */
function evaluateVisibilityExpression(expression: string, deps: unknown[]): boolean {
  // Remove template brackets
  const cleanExpr = expression.replace(/\{\{|\}\}/g, '').trim();

  // Handle simple cases
  if (cleanExpr === 'true') return true;
  if (cleanExpr === 'false') return false;

  // Parse OR conditions (split by ||)
  const orParts = cleanExpr.split('||').map(s => s.trim());

  for (const orPart of orParts) {
    // Parse AND conditions (split by &&)
    const andParts = orPart.split('&&').map(s => s.trim());
    let allAndTrue = true;

    for (const andPart of andParts) {
      if (!evaluateSingleCondition(andPart, deps)) {
        allAndTrue = false;
        break;
      }
    }

    if (allAndTrue) return true;
  }

  return false;
}

/**
 * Evaluate a single condition like "$deps[0] === 'value'" or "!$deps[0]"
 */
function evaluateSingleCondition(condition: string, deps: unknown[]): boolean {
  const trimmed = condition.trim();

  // Handle negation: !$deps[0]
  if (trimmed.startsWith('!')) {
    const inner = trimmed.slice(1).trim();
    return !evaluateSingleCondition(inner, deps);
  }

  // Handle parentheses
  if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
    return evaluateVisibilityExpression(trimmed.slice(1, -1), deps);
  }

  // Handle comparisons: $deps[0] === 'value', $deps[0] !== 'value'
  const eqMatch = trimmed.match(/\$deps\[(\d+)\]\s*(===|!==|==|!=)\s*(.+)/);
  if (eqMatch) {
    const depIndex = parseInt(eqMatch[1], 10);
    const operator = eqMatch[2];
    const rawValue = eqMatch[3].trim();
    const depValue = deps[depIndex];

    // Parse the comparison value
    let compareValue: unknown;
    if (rawValue === 'true') compareValue = true;
    else if (rawValue === 'false') compareValue = false;
    else if (rawValue === 'null' || rawValue === 'undefined') compareValue = null;
    else if (rawValue.startsWith("'") && rawValue.endsWith("'")) compareValue = rawValue.slice(1, -1);
    else if (rawValue.startsWith('"') && rawValue.endsWith('"')) compareValue = rawValue.slice(1, -1);
    else if (!isNaN(Number(rawValue))) compareValue = Number(rawValue);
    else compareValue = rawValue;

    if (operator === '===' || operator === '==') return depValue === compareValue;
    if (operator === '!==' || operator === '!=') return depValue !== compareValue;
  }

  // Handle just $deps[0] (truthy check)
  const depMatch = trimmed.match(/^\$deps\[(\d+)\]$/);
  if (depMatch) {
    const depIndex = parseInt(depMatch[1], 10);
    return Boolean(deps[depIndex]);
  }

  // Default to true if we can't parse
  return true;
}

/**
 * Safe math expression parser - no eval/Function used
 * Supports: +, -, *, /, parentheses, numbers
 */
function parseMathExpression(expr: string): number | null {
  let pos = 0;
  const str = expr.replace(/\s+/g, '');

  function parseNumber(): number | null {
    let numStr = '';
    while (pos < str.length && (str[pos] >= '0' && str[pos] <= '9' || str[pos] === '.')) {
      numStr += str[pos];
      pos++;
    }
    if (numStr === '') return null;
    return parseFloat(numStr);
  }

  function parseFactor(): number | null {
    if (str[pos] === '(') {
      pos++; // skip '('
      const result = parseExpression();
      if (str[pos] === ')') pos++; // skip ')'
      return result;
    }
    if (str[pos] === '-') {
      pos++;
      const factor = parseFactor();
      return factor !== null ? -factor : null;
    }
    return parseNumber();
  }

  function parseTerm(): number | null {
    let left = parseFactor();
    if (left === null) return null;

    while (pos < str.length && (str[pos] === '*' || str[pos] === '/')) {
      const op = str[pos];
      pos++;
      const right = parseFactor();
      if (right === null) return null;
      if (op === '*') left = left * right;
      else if (op === '/') left = right !== 0 ? left / right : null;
      if (left === null) return null;
    }
    return left;
  }

  function parseExpression(): number | null {
    let left = parseTerm();
    if (left === null) return null;

    while (pos < str.length && (str[pos] === '+' || str[pos] === '-')) {
      const op = str[pos];
      pos++;
      const right = parseTerm();
      if (right === null) return null;
      if (op === '+') left = left + right;
      else if (op === '-') left = left - right;
    }
    return left;
  }

  try {
    const result = parseExpression();
    return pos === str.length ? result : null;
  } catch {
    return null;
  }
}

/**
 * Safe formula evaluator for calculated fields
 * Replaces field names with values, then parses the math expression
 */
function evaluateFormula(formula: string, values: Record<string, number>): number | null {
  // Replace field names with their values
  let expr = formula;
  for (const [field, value] of Object.entries(values)) {
    const fieldName = field.split('.').pop() || field;
    expr = expr.replace(new RegExp(`\\b${fieldName}\\b`, 'g'), String(value ?? 0));
  }

  // Only allow safe characters: numbers, operators, parentheses, spaces, decimal points
  if (!/^[\d\s+\-*/().]+$/.test(expr)) {
    return null;
  }

  return parseMathExpression(expr);
}

export function FormPreview() {
  const { schema } = useFormBuilder();
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  // Initialize collapsed sections from schema defaults when schema changes
  useEffect(() => {
    const initialCollapsed = new Set<string>();
    Object.entries(schema.properties || {}).forEach(([key, field]) => {
      if (field['x-component'] === 'FormSection' && field['x-component-props']?.defaultCollapsed) {
        initialCollapsed.add(key);
      }
    });
    setCollapsedSections(initialCollapsed);
    // Reset form data when schema changes
    setFormData({});
  }, [schema]);

  const handleReset = () => {
    setFormData({});
  };

  const handleFieldChange = useCallback((fieldPath: string, value: unknown) => {
    setFormData((prev) => {
      const newData = { ...prev };
      // Handle nested paths like "section.field" or "array.0.field"
      const parts = fieldPath.split('.');
      let current: Record<string, unknown> = newData;

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (current[part] === undefined) {
          // Check if next part is a number (array index)
          current[part] = isNaN(Number(parts[i + 1])) ? {} : [];
        }
        current = current[part] as Record<string, unknown>;
      }

      current[parts[parts.length - 1]] = value;
      return newData;
    });
  }, []);

  const getFieldValue = useCallback((fieldPath: string): unknown => {
    const parts = fieldPath.split('.');
    let current: unknown = formData;

    for (const part of parts) {
      if (current === undefined || current === null) return undefined;
      current = (current as Record<string, unknown>)[part];
    }

    return current;
  }, [formData]);

  const toggleSection = useCallback((sectionKey: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) {
        next.delete(sectionKey);
      } else {
        next.add(sectionKey);
      }
      return next;
    });
  }, []);

  // Check if a field should be visible based on x-reactions
  const isFieldVisible = useCallback((field: SchemaProperty): boolean => {
    const reactions = field['x-reactions'];
    if (!reactions) return true;

    const { dependencies, fulfill } = reactions;
    if (!dependencies || !fulfill?.state?.visible) return true;

    // Get dependency values
    const depValues = dependencies.map((dep) => getFieldValue(dep));

    // Use safe expression evaluator
    return evaluateVisibilityExpression(fulfill.state.visible, depValues);
  }, [getFieldValue]);

  // Check if a field should be disabled based on x-reactions
  const isFieldDisabled = useCallback((field: SchemaProperty): boolean => {
    const reactions = field['x-reactions'];
    if (!reactions) return false;

    const { dependencies, fulfill } = reactions;
    if (!dependencies || !fulfill?.state?.disabled) return false;

    const depValues = dependencies.map((dep) => getFieldValue(dep));

    // Use safe expression evaluator
    return evaluateVisibilityExpression(fulfill.state.disabled, depValues);
  }, [getFieldValue]);

  // Get ordered fields from schema
  const orderedFields = useMemo(() => {
    const fields = Object.entries(schema.properties || {});
    return fields.sort((a, b) => {
      const indexA = a[1]['x-index'] ?? 999;
      const indexB = b[1]['x-index'] ?? 999;
      return indexA - indexB;
    });
  }, [schema]);

  return (
    <div className="flex flex-col h-full bg-surface-secondary">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle bg-surface-primary">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Form Preview</h2>
          <p className="text-xs text-text-secondary">
            Test your form with live data entry • {orderedFields.length} top-level fields
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleReset}>
          <RefreshCw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Preview Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 max-w-2xl mx-auto">
          {orderedFields.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-secondary">
                Add fields to see the preview
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {orderedFields.map(([fieldKey, field]) => {
                // Check visibility
                if (!isFieldVisible(field)) return null;

                // Handle FormSection
                if (field['x-component'] === 'FormSection') {
                  return (
                    <FormSectionPreview
                      key={fieldKey}
                      fieldKey={fieldKey}
                      field={field}
                      formData={formData}
                      isCollapsed={collapsedSections.has(fieldKey)}
                      onToggle={() => toggleSection(fieldKey)}
                      onFieldChange={handleFieldChange}
                      getFieldValue={getFieldValue}
                      isFieldVisible={isFieldVisible}
                      isFieldDisabled={isFieldDisabled}
                    />
                  );
                }

                // Handle ArrayField
                if (field['x-component'] === 'ArrayField') {
                  return (
                    <ArrayFieldPreview
                      key={fieldKey}
                      fieldKey={fieldKey}
                      field={field}
                      value={(getFieldValue(fieldKey) as unknown[]) || []}
                      onChange={(val) => handleFieldChange(fieldKey, val)}
                      isFieldVisible={isFieldVisible}
                      isFieldDisabled={isFieldDisabled}
                    />
                  );
                }

                // Regular field
                return (
                  <PreviewField
                    key={fieldKey}
                    fieldKey={fieldKey}
                    field={field}
                    value={getFieldValue(fieldKey)}
                    onChange={(value) => handleFieldChange(fieldKey, value)}
                    disabled={isFieldDisabled(field)}
                    formData={formData}
                  />
                );
              })}

              {/* Submit Button Preview */}
              <div className="pt-4 border-t border-border-subtle">
                <Button
                  onClick={() => {
                    console.log('Form Data:', formData);
                    alert('Form submitted! Check console for data.');
                  }}
                >
                  Submit Form
                </Button>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Debug Panel */}
      {Object.keys(formData).length > 0 && (
        <div className="border-t border-border-subtle bg-surface-primary p-4">
          <details className="text-xs">
            <summary className="cursor-pointer text-text-secondary hover:text-text-primary">
              Form Data (Debug)
            </summary>
            <pre className="mt-2 p-2 bg-surface-secondary rounded text-text-secondary overflow-auto max-h-32">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

/**
 * FormSection Preview - Collapsible section container
 */
interface FormSectionPreviewProps {
  fieldKey: string;
  field: SchemaProperty;
  formData: Record<string, unknown>;
  isCollapsed: boolean;
  onToggle: () => void;
  onFieldChange: (path: string, value: unknown) => void;
  getFieldValue: (path: string) => unknown;
  isFieldVisible: (field: SchemaProperty) => boolean;
  isFieldDisabled: (field: SchemaProperty) => boolean;
}

function FormSectionPreview({
  fieldKey,
  field,
  isCollapsed,
  onToggle,
  onFieldChange,
  getFieldValue,
  isFieldVisible,
  isFieldDisabled,
  formData,
}: FormSectionPreviewProps) {
  const props = field['x-component-props'] || {};
  const collapsible = props.collapsible !== false;
  const title = field.title || fieldKey;

  // Get nested fields
  const nestedFields = useMemo(() => {
    const fields = Object.entries(field.properties || {});
    return fields.sort((a, b) => {
      const indexA = a[1]['x-index'] ?? 999;
      const indexB = b[1]['x-index'] ?? 999;
      return indexA - indexB;
    });
  }, [field.properties]);

  return (
    <div className="border border-border-default rounded-lg overflow-hidden bg-surface-primary">
      {/* Section Header */}
      <button
        type="button"
        onClick={collapsible ? onToggle : undefined}
        className={cn(
          'w-full flex items-center gap-2 px-4 py-3 text-left',
          'bg-surface-secondary border-b border-border-subtle',
          collapsible && 'hover:bg-surface-tertiary cursor-pointer',
          !collapsible && 'cursor-default'
        )}
        disabled={!collapsible}
      >
        {collapsible && (
          isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-text-secondary" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-secondary" />
          )
        )}
        <span className="text-sm font-semibold text-text-primary">{title}</span>
        {field.description && (
          <span className="text-xs text-text-secondary ml-2">
            {field.description}
          </span>
        )}
      </button>

      {/* Section Content */}
      {!isCollapsed && (
        <div className="p-4 space-y-4">
          {nestedFields.length === 0 ? (
            <p className="text-sm text-text-secondary italic">
              No fields in this section
            </p>
          ) : (
            nestedFields.map(([nestedKey, nestedField]) => {
              const fullPath = `${fieldKey}.${nestedKey}`;

              if (!isFieldVisible(nestedField)) return null;

              // Handle ArrayField inside section
              if (nestedField['x-component'] === 'ArrayField') {
                return (
                  <ArrayFieldPreview
                    key={nestedKey}
                    fieldKey={fullPath}
                    field={nestedField}
                    value={(getFieldValue(fullPath) as unknown[]) || []}
                    onChange={(val) => onFieldChange(fullPath, val)}
                    isFieldVisible={isFieldVisible}
                    isFieldDisabled={isFieldDisabled}
                  />
                );
              }

              return (
                <PreviewField
                  key={nestedKey}
                  fieldKey={fullPath}
                  field={nestedField}
                  value={getFieldValue(fullPath)}
                  onChange={(value) => onFieldChange(fullPath, value)}
                  disabled={isFieldDisabled(nestedField)}
                  formData={formData}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

/**
 * ArrayField Preview - Repeating section with add/remove
 */
interface ArrayFieldPreviewProps {
  fieldKey: string;
  field: SchemaProperty;
  value: unknown[];
  onChange: (value: unknown[]) => void;
  isFieldVisible: (field: SchemaProperty) => boolean;
  isFieldDisabled: (field: SchemaProperty) => boolean;
}

function ArrayFieldPreview({
  fieldKey,
  field,
  value,
  onChange,
  isFieldVisible,
  isFieldDisabled,
}: ArrayFieldPreviewProps) {
  const props = field['x-component-props'] || {};
  const minItems = (props.minItems as number) || 0;
  const maxItems = (props.maxItems as number) || 10;
  const addButtonText = (props.addButtonText as string) || 'Add Item';
  const title = field.title || fieldKey;
  const itemSchema = field.items;

  const handleAdd = () => {
    if (value.length < maxItems) {
      onChange([...value, {}]);
    }
  };

  const handleRemove = (index: number) => {
    if (value.length > minItems) {
      onChange(value.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, itemKey: string, itemValue: unknown) => {
    const newValue = [...value];
    newValue[index] = {
      ...(newValue[index] as Record<string, unknown>),
      [itemKey]: itemValue,
    };
    onChange(newValue);
  };

  // Get item fields
  const itemFields = useMemo(() => {
    if (!itemSchema?.properties) return [];
    return Object.entries(itemSchema.properties);
  }, [itemSchema]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-text-primary">{title}</Label>
        <span className="text-xs text-text-secondary">
          {value.length} / {maxItems} items
        </span>
      </div>

      {field.description && (
        <p className="text-xs text-text-secondary">{field.description}</p>
      )}

      {/* Items */}
      <div className="space-y-3">
        {value.map((item, index) => (
          <div
            key={index}
            className="border border-border-default rounded-lg p-4 bg-surface-secondary relative"
          >
            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(index)}
                disabled={value.length <= minItems}
                className="h-6 w-6 p-0 text-text-secondary hover:text-error"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="space-y-3 pr-8">
              {itemFields.map(([itemKey, itemField]) => {
                if (!isFieldVisible(itemField)) return null;

                return (
                  <PreviewField
                    key={itemKey}
                    fieldKey={`${fieldKey}.${index}.${itemKey}`}
                    field={itemField}
                    value={(item as Record<string, unknown>)?.[itemKey]}
                    onChange={(val) => handleItemChange(index, itemKey, val)}
                    disabled={isFieldDisabled(itemField)}
                    formData={{}}
                    compact
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleAdd}
        disabled={value.length >= maxItems}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-1" />
        {addButtonText}
      </Button>
    </div>
  );
}

/**
 * Preview Field - Interactive field renderer
 */
interface PreviewFieldProps {
  fieldKey: string;
  field: SchemaProperty;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  formData: Record<string, unknown>;
  compact?: boolean;
}

function PreviewField({ fieldKey, field, value, onChange, disabled, formData, compact }: PreviewFieldProps) {
  const component = field['x-component'];
  const title = field.title || fieldKey.split('.').pop() || fieldKey;
  const required = field.required;
  const description = field.description;

  const fieldLabel = (
    <Label className={cn('font-medium text-text-primary', compact ? 'text-xs' : 'text-sm')}>
      {title}
      {required && <span className="text-error ml-1">*</span>}
    </Label>
  );

  const helpText = description && !compact && (
    <p className="text-xs text-text-secondary mt-1">{description}</p>
  );

  const inputClass = cn(disabled && 'opacity-50 cursor-not-allowed');

  switch (component) {
    case 'FormText':
      return (
        <p className="text-text-secondary text-sm">
          {(field['x-component-props']?.content as string) || 'Static text'}
        </p>
      );

    case 'CalculatedField': {
      // Evaluate formula using safe evaluator
      const props = field['x-component-props'] || {};
      const formula = props.formula as string;
      const sourceFields = (props.sourceFields as string[]) || [];
      const decimalPlaces = (props.decimalPlaces as number) ?? 2;

      let calculatedValue: string = '—';

      if (formula && sourceFields.length > 0) {
        const values: Record<string, number> = {};
        sourceFields.forEach((sourceField) => {
          const val = getNestedValue(formData, sourceField);
          values[sourceField] = typeof val === 'number' ? val : 0;
        });

        const result = evaluateFormula(formula, values);
        if (result !== null) {
          calculatedValue = result.toFixed(decimalPlaces);
        } else {
          calculatedValue = 'Error';
        }
      }

      return (
        <div className="space-y-1.5">
          {fieldLabel}
          <div className="flex items-center gap-2 px-3 py-2 bg-surface-tertiary border border-border-default rounded-md">
            <Calculator className="w-4 h-4 text-text-secondary" />
            <span className="text-sm font-mono text-text-primary">{calculatedValue}</span>
          </div>
          {helpText}
        </div>
      );
    }

    case 'Input':
      return (
        <div className="space-y-1.5">
          {fieldLabel}
          <Input
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${title.toLowerCase()}...`}
            disabled={disabled}
            className={inputClass}
          />
          {helpText}
        </div>
      );

    case 'TextArea':
      return (
        <div className="space-y-1.5">
          {fieldLabel}
          <Textarea
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${title.toLowerCase()}...`}
            rows={(field['x-component-props']?.rows as number) || 4}
            disabled={disabled}
            className={inputClass}
          />
          {helpText}
        </div>
      );

    case 'NumberPicker':
      return (
        <div className="space-y-1.5">
          {fieldLabel}
          <Input
            type="number"
            value={(value as number) ?? ''}
            onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
            min={field.minimum}
            max={field.maximum}
            placeholder="0"
            disabled={disabled}
            className={inputClass}
          />
          {helpText}
        </div>
      );

    case 'Select':
    case 'DictionarySelect':
    case 'LocationSelect':
    case 'UserSelect':
    case 'RoleFilteredUserSelect':
    case 'AssetSelect':
    case 'VehicleSelect':
    case 'GenericEntitySelect':
      return (
        <div className="space-y-1.5">
          {fieldLabel}
          <Select
            value={(value as string) || ''}
            onValueChange={onChange}
            disabled={disabled}
          >
            <SelectTrigger className={inputClass}>
              <SelectValue placeholder={`Select ${title.toLowerCase()}...`} />
            </SelectTrigger>
            <SelectContent>
              {field.enum?.map((opt, i) => (
                <SelectItem key={i} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              )) || (
                // Mock options for entity selects
                <>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          {helpText}
        </div>
      );

    case 'RadioGroup':
      return (
        <div className="space-y-2">
          {fieldLabel}
          <div className={cn('space-y-2', disabled && 'opacity-50')}>
            {field.enum?.map((opt, i) => (
              <label key={i} className={cn('flex items-center gap-2', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}>
                <input
                  type="radio"
                  name={fieldKey}
                  value={String(opt.value)}
                  checked={value === opt.value}
                  onChange={() => onChange(opt.value)}
                  className="w-4 h-4"
                  disabled={disabled}
                />
                <span className="text-sm text-text-primary">{opt.label}</span>
              </label>
            ))}
          </div>
          {helpText}
        </div>
      );

    case 'Checkbox':
      return (
        <div className={cn('flex items-start gap-2', disabled && 'opacity-50')}>
          <Checkbox
            id={fieldKey}
            checked={(value as boolean) || false}
            onCheckedChange={onChange}
            className="mt-0.5"
            disabled={disabled}
          />
          <div>
            <Label htmlFor={fieldKey} className={cn('text-sm', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}>
              {title}
            </Label>
            {helpText}
          </div>
        </div>
      );

    case 'DatePicker':
      return (
        <div className="space-y-1.5">
          {fieldLabel}
          <Input
            type="date"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={inputClass}
          />
          {helpText}
        </div>
      );

    case 'Upload':
      return (
        <div className="space-y-1.5">
          {fieldLabel}
          <Input
            type="file"
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                onChange(Array.from(files).map((f) => f.name));
              }
            }}
            multiple={(field['x-component-props']?.maxCount as number) > 1}
            disabled={disabled}
            className={inputClass}
          />
          {helpText}
        </div>
      );

    case 'UserMultiSelect':
      return (
        <div className="space-y-1.5">
          {fieldLabel}
          <div className={cn('p-2 border border-border-default rounded-md bg-surface-secondary', inputClass)}>
            <p className="text-xs text-text-secondary">Multi-select (mock)</p>
          </div>
          {helpText}
        </div>
      );

    default:
      return (
        <div className="space-y-1.5">
          {fieldLabel}
          <Input
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={component || 'Enter value...'}
            disabled={disabled}
            className={inputClass}
          />
          {helpText}
        </div>
      );
  }
}

// Helper to get nested value from formData
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}
