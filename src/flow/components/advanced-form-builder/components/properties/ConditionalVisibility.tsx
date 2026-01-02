/**
 * Conditional Visibility Editor
 * Configure show/hide/disable rules based on other field values
 */

import { useCallback, useMemo } from 'react';
import { Trash2, Eye, EyeOff, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormBuilder } from '../../context';
import { getOrderedFields } from '../../utils/schema-utils';
import {
  CONDITION_OPTIONS,
  ACTION_OPTIONS,
  type ConditionalVisibilityMetadata,
  type VisibilityCondition,
  type VisibilityAction,
} from '../../types';
import type { SchemaProperty, ConditionalReaction } from '../../types';

// Local type alias for the component
type ConditionalVisibilityRule = ConditionalVisibilityMetadata & { enabled?: boolean };

interface ConditionalVisibilityProps {
  fieldKey: string;
  field: SchemaProperty;
  onUpdate: (updates: Partial<SchemaProperty>) => void;
}

export function ConditionalVisibility({
  fieldKey,
  field,
  onUpdate,
}: ConditionalVisibilityProps) {
  const { schema } = useFormBuilder();

  // Get available parent fields (all fields except this one)
  const parentFieldOptions = useMemo(() => {
    const orderedFields = getOrderedFields(schema);
    return orderedFields
      .filter(([key]) => key !== fieldKey)
      .map(([key, f]) => ({
        value: key,
        label: f.title || key,
        type: f.type,
        hasOptions: !!f.enum,
        options: f.enum,
      }));
  }, [schema, fieldKey]);

  // Get current conditional visibility rule from x-reactions
  const currentRule = useMemo((): ConditionalVisibilityRule | null => {
    const reactions = field['x-reactions'] as ConditionalReaction | undefined;
    if (!reactions?._conditionalVisibility) return null;
    return reactions._conditionalVisibility;
  }, [field]);

  // Check if conditional visibility is enabled
  const isEnabled = !!currentRule;

  // Enable/disable conditional visibility
  const handleToggle = useCallback(
    (enabled: boolean) => {
      if (enabled) {
        // Enable with default rule
        const defaultRule: ConditionalVisibilityRule = {
          enabled: true,
          parentField: parentFieldOptions[0]?.value || '',
          condition: 'hasValue',
          action: 'show',
        };

        const reaction: ConditionalReaction = {
          dependencies: [defaultRule.parentField],
          fulfill: {
            state: {
              visible: '{{$deps[0]}}',
            },
          },
          _conditionalVisibility: defaultRule,
        };

        onUpdate({ 'x-reactions': reaction });
      } else {
        // Disable
        onUpdate({ 'x-reactions': undefined });
      }
    },
    [parentFieldOptions, onUpdate]
  );

  // Update the rule
  const handleUpdateRule = useCallback(
    (updates: Partial<ConditionalVisibilityRule>) => {
      if (!currentRule) return;

      const newRule: ConditionalVisibilityRule = {
        ...currentRule,
        ...updates,
      };

      // Build the x-reactions expression
      const reaction: ConditionalReaction = {
        dependencies: [newRule.parentField],
        fulfill: {
          state: buildStateExpression(newRule),
        },
        _conditionalVisibility: newRule,
      };

      onUpdate({ 'x-reactions': reaction });
    },
    [currentRule, onUpdate]
  );

  // Get target value options if parent field has enum
  const selectedParent = useMemo(() => {
    return parentFieldOptions.find((p) => p.value === currentRule?.parentField);
  }, [parentFieldOptions, currentRule?.parentField]);

  const showTargetValueInput = useMemo(() => {
    if (!currentRule) return false;
    const condition = currentRule.condition;
    return condition === 'equals' || condition === 'notEquals';
  }, [currentRule]);

  if (parentFieldOptions.length === 0) {
    return (
      <div className="text-sm text-text-secondary text-center py-4">
        Add more fields to enable conditional visibility
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">Conditional Visibility</Label>
          <p className="text-xs text-text-secondary">
            Show, hide, or disable based on another field
          </p>
        </div>
        <Switch checked={isEnabled} onCheckedChange={handleToggle} />
      </div>

      {isEnabled && currentRule && (
        <div
          className={cn(
            'p-3 rounded-md space-y-3',
            'bg-surface-secondary border border-border-subtle'
          )}
        >
          {/* Parent Field Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs text-text-secondary">When field</Label>
            <Select
              value={currentRule.parentField}
              onValueChange={(value) => handleUpdateRule({ parentField: value })}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select field..." />
              </SelectTrigger>
              <SelectContent>
                {parentFieldOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Condition Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs text-text-secondary">Condition</Label>
            <Select
              value={currentRule.condition}
              onValueChange={(value) =>
                handleUpdateRule({ condition: value as VisibilityCondition })
              }
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONDITION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Target Value (for equals/notEquals) */}
          {showTargetValueInput && (
            <div className="space-y-1.5">
              <Label className="text-xs text-text-secondary">Value</Label>
              {selectedParent?.hasOptions ? (
                <Select
                  value={String(currentRule.targetValue || '')}
                  onValueChange={(value) => handleUpdateRule({ targetValue: value })}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select value..." />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedParent.options?.map((opt, i) => (
                      <SelectItem key={i} value={String(opt.value)}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={String(currentRule.targetValue || '')}
                  onChange={(e) => handleUpdateRule({ targetValue: e.target.value })}
                  placeholder="Enter value..."
                  className="h-8 text-sm"
                />
              )}
            </div>
          )}

          {/* Action Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs text-text-secondary">Then</Label>
            <div className="flex gap-2">
              {ACTION_OPTIONS.map((option) => {
                const isSelected = currentRule.action === option.value;
                const Icon =
                  option.value === 'show'
                    ? Eye
                    : option.value === 'hide'
                      ? EyeOff
                      : Ban;

                return (
                  <Button
                    key={option.value}
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      handleUpdateRule({ action: option.value as VisibilityAction })
                    }
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Preview of the logic */}
          <div className="mt-2 p-2 bg-surface-tertiary rounded text-xs text-text-secondary">
            <strong>Logic:</strong>{' '}
            {buildLogicPreview(currentRule, selectedParent?.label || currentRule.parentField)}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Build Formily state expression based on rule
 */
function buildStateExpression(rule: ConditionalVisibilityRule): {
  visible?: string;
  disabled?: string;
} {
  let expression: string;

  switch (rule.condition) {
    case 'hasValue':
      expression = '{{!!$deps[0]}}';
      break;
    case 'isEmpty':
      expression = '{{!$deps[0]}}';
      break;
    case 'equals':
      expression = `{{$deps[0] === ${JSON.stringify(rule.targetValue)}}}`;
      break;
    case 'notEquals':
      expression = `{{$deps[0] !== ${JSON.stringify(rule.targetValue)}}}`;
      break;
    default:
      expression = '{{true}}';
  }

  // Invert for hide action
  if (rule.action === 'hide') {
    expression = expression.replace('{{', '{{!(').replace('}}', ')}}');
  }

  if (rule.action === 'disable') {
    return { disabled: expression };
  }

  return { visible: expression };
}

/**
 * Build human-readable preview of the logic
 */
function buildLogicPreview(rule: ConditionalVisibilityRule, parentLabel: string): string {
  let conditionText: string;

  switch (rule.condition) {
    case 'hasValue':
      conditionText = 'has a value';
      break;
    case 'isEmpty':
      conditionText = 'is empty';
      break;
    case 'equals':
      conditionText = `equals "${rule.targetValue}"`;
      break;
    case 'notEquals':
      conditionText = `does not equal "${rule.targetValue}"`;
      break;
    default:
      conditionText = 'matches condition';
  }

  const actionText =
    rule.action === 'show'
      ? 'show this field'
      : rule.action === 'hide'
        ? 'hide this field'
        : 'disable this field';

  return `When "${parentLabel}" ${conditionText}, ${actionText}`;
}
