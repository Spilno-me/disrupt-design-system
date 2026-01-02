/**
 * Validation Rules Editor
 * Configure validation rules for a field
 */

import { useCallback, useMemo } from 'react';
import { Plus, Trash2 } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { VALIDATION_RULES, type ValidationRuleType } from '../../types';
import type { SchemaProperty, ValidationRule } from '../../types';

interface ValidationRulesEditorProps {
  field: SchemaProperty;
  onUpdate: (updates: Partial<SchemaProperty>) => void;
}

export function ValidationRulesEditor({
  field,
  onUpdate,
}: ValidationRulesEditorProps) {
  const fieldType = field.type;
  const currentRules = (field['x-validator'] || []) as ValidationRule[];

  // Filter applicable rules based on field type
  const applicableRules = useMemo(() => {
    return VALIDATION_RULES.filter((rule) =>
      rule.applicableTo.includes(fieldType as 'string' | 'number' | 'boolean' | 'array')
    );
  }, [fieldType]);

  // Get currently used rule types
  const usedRuleTypes = useMemo(() => {
    return new Set(
      currentRules.map((r) => {
        if (r.required !== undefined) return 'required';
        if (r.format !== undefined) return r.format;
        if (r.minLength !== undefined) return 'minLength';
        if (r.maxLength !== undefined) return 'maxLength';
        if (r.minimum !== undefined) return 'minimum';
        if (r.maximum !== undefined) return 'maximum';
        if (r.pattern !== undefined) return 'pattern';
        return null;
      }).filter(Boolean)
    );
  }, [currentRules]);

  // Add a new validation rule
  const handleAddRule = useCallback(
    (ruleType: ValidationRuleType) => {
      const ruleDef = VALIDATION_RULES.find((r) => r.type === ruleType);
      if (!ruleDef) return;

      const newRule: ValidationRule = {
        message: ruleDef.defaultMessage,
      };

      // Set the appropriate property based on rule type
      switch (ruleType) {
        case 'required':
          newRule.required = true;
          break;
        case 'email':
        case 'url':
        case 'phone':
          newRule.format = ruleType;
          break;
        case 'minLength':
          newRule.minLength = 1;
          break;
        case 'maxLength':
          newRule.maxLength = 100;
          break;
        case 'minimum':
          newRule.minimum = 0;
          break;
        case 'maximum':
          newRule.maximum = 100;
          break;
        case 'pattern':
          newRule.pattern = '';
          break;
      }

      onUpdate({
        'x-validator': [...currentRules, newRule],
      });
    },
    [currentRules, onUpdate]
  );

  // Update a validation rule
  const handleUpdateRule = useCallback(
    (index: number, updates: Partial<ValidationRule>) => {
      const newRules = currentRules.map((rule, i) =>
        i === index ? { ...rule, ...updates } : rule
      );
      onUpdate({ 'x-validator': newRules });
    },
    [currentRules, onUpdate]
  );

  // Remove a validation rule
  const handleRemoveRule = useCallback(
    (index: number) => {
      const newRules = currentRules.filter((_, i) => i !== index);
      onUpdate({ 'x-validator': newRules.length > 0 ? newRules : undefined });
    },
    [currentRules, onUpdate]
  );

  // Get available rules (not already added)
  const availableRules = useMemo(() => {
    return applicableRules.filter((rule) => !usedRuleTypes.has(rule.type));
  }, [applicableRules, usedRuleTypes]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
          Validation Rules
        </h4>
        <span className="text-xs text-text-tertiary">
          {currentRules.length} rule{currentRules.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Current Rules */}
      {currentRules.length > 0 && (
        <div className="space-y-3">
          {currentRules.map((rule, index) => (
            <ValidationRuleItem
              key={index}
              rule={rule}
              onUpdate={(updates) => handleUpdateRule(index, updates)}
              onRemove={() => handleRemoveRule(index)}
            />
          ))}
        </div>
      )}

      {/* Add Rule */}
      {availableRules.length > 0 && (
        <>
          {currentRules.length > 0 && <Separator />}
          <div className="space-y-2">
            <Label className="text-sm">Add Validation</Label>
            <Select onValueChange={(value) => handleAddRule(value as ValidationRuleType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a rule..." />
              </SelectTrigger>
              <SelectContent>
                {availableRules.map((rule) => (
                  <SelectItem key={rule.type} value={rule.type}>
                    <div className="flex flex-col">
                      <span>{rule.label}</span>
                      <span className="text-xs text-text-secondary">
                        {rule.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {currentRules.length === 0 && availableRules.length === 0 && (
        <p className="text-sm text-text-secondary text-center py-2">
          No validation rules available for this field type
        </p>
      )}
    </div>
  );
}

/**
 * Individual validation rule item
 */
interface ValidationRuleItemProps {
  rule: ValidationRule;
  onUpdate: (updates: Partial<ValidationRule>) => void;
  onRemove: () => void;
}

function ValidationRuleItem({ rule, onUpdate, onRemove }: ValidationRuleItemProps) {
  // Determine rule type and label
  let ruleType: ValidationRuleType = 'required';
  let ruleLabel = 'Required';

  if (rule.required !== undefined) {
    ruleType = 'required';
    ruleLabel = 'Required';
  } else if (rule.format === 'email') {
    ruleType = 'email';
    ruleLabel = 'Email Format';
  } else if (rule.format === 'url') {
    ruleType = 'url';
    ruleLabel = 'URL Format';
  } else if (rule.format === 'phone') {
    ruleType = 'phone';
    ruleLabel = 'Phone Format';
  } else if (rule.minLength !== undefined) {
    ruleType = 'minLength';
    ruleLabel = 'Min Length';
  } else if (rule.maxLength !== undefined) {
    ruleType = 'maxLength';
    ruleLabel = 'Max Length';
  } else if (rule.minimum !== undefined) {
    ruleType = 'minimum';
    ruleLabel = 'Minimum Value';
  } else if (rule.maximum !== undefined) {
    ruleType = 'maximum';
    ruleLabel = 'Maximum Value';
  } else if (rule.pattern !== undefined) {
    ruleType = 'pattern';
    ruleLabel = 'Pattern';
  }

  const ruleDef = VALIDATION_RULES.find((r) => r.type === ruleType);

  return (
    <div
      className={cn(
        'p-3 rounded-md',
        'bg-surface-secondary border border-border-subtle'
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-text-primary">{ruleLabel}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-text-secondary hover:text-error"
          onClick={onRemove}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Value input for rules that require it */}
      {ruleDef?.hasValue && (
        <div className="mb-2">
          <Input
            type={ruleDef.valueType === 'number' ? 'number' : 'text'}
            value={
              rule.minLength ??
              rule.maxLength ??
              rule.minimum ??
              rule.maximum ??
              rule.pattern ??
              ''
            }
            onChange={(e) => {
              const value =
                ruleDef.valueType === 'number'
                  ? parseInt(e.target.value) || 0
                  : e.target.value;

              if (ruleType === 'minLength') onUpdate({ minLength: value as number });
              else if (ruleType === 'maxLength') onUpdate({ maxLength: value as number });
              else if (ruleType === 'minimum') onUpdate({ minimum: value as number });
              else if (ruleType === 'maximum') onUpdate({ maximum: value as number });
              else if (ruleType === 'pattern') onUpdate({ pattern: value as string });
            }}
            placeholder={ruleDef.valueType === 'number' ? '0' : 'Enter pattern...'}
            className="h-8 text-sm"
          />
        </div>
      )}

      {/* Error message */}
      <div>
        <Label className="text-xs text-text-secondary">Error Message</Label>
        <Input
          value={rule.message || ''}
          onChange={(e) => onUpdate({ message: e.target.value })}
          placeholder="Enter error message..."
          className="h-8 text-sm mt-1"
        />
      </div>
    </div>
  );
}
