/**
 * Advanced Conditional Logic Editor
 *
 * Configure complex show/hide/disable rules with AND/OR condition groups.
 * Supports multiple conditions combined with logical operators.
 *
 * @component MOLECULE
 */

import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, Ban, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFormBuilder } from '../../context';
import { getOrderedFields } from '../../utils/schema-utils';
import {
  CONDITION_OPTIONS,
  ACTION_OPTIONS,
  type VisibilityCondition,
  type VisibilityAction,
  type LogicOperator,
  type ConditionItem,
  type ConditionGroup,
  type AdvancedConditionalVisibility,
  type ParentFieldOption,
} from '../../types';
import type { SchemaProperty } from '../../types';

// =============================================================================
// TYPES
// =============================================================================

interface AdvancedConditionalLogicProps {
  fieldKey: string;
  field: SchemaProperty;
  onUpdate: (updates: Partial<SchemaProperty>) => void;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/** Generate unique ID */
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/** Create a new empty condition */
function createCondition(parentFieldOptions: ParentFieldOption[]): ConditionItem {
  return {
    id: generateId(),
    parentField: parentFieldOptions[0]?.value || '',
    condition: 'hasValue',
  };
}

/** Create a new empty condition group */
function createGroup(parentFieldOptions: ParentFieldOption[]): ConditionGroup {
  return {
    id: generateId(),
    operator: 'AND',
    conditions: [createCondition(parentFieldOptions)],
  };
}

/** Parse advanced config from x-reactions */
function parseAdvancedConfig(field: SchemaProperty): AdvancedConditionalVisibility | null {
  const reactions = field['x-reactions'];
  if (!reactions) return null;

  // Cast to unknown first, then to Record for type-safe property access
  const reactionsObj = reactions as unknown as Record<string, unknown>;

  // Check for _advancedConditional metadata
  const advancedMeta = reactionsObj._advancedConditional as AdvancedConditionalVisibility | undefined;
  if (advancedMeta) return advancedMeta;

  // Check for legacy single condition format and convert
  const legacyMeta = reactionsObj._conditionalVisibility;
  if (legacyMeta && typeof legacyMeta === 'object') {
    const legacy = legacyMeta as { parentField?: string; condition?: VisibilityCondition; targetValue?: unknown; action?: VisibilityAction };
    return {
      enabled: true,
      groups: [{
        id: generateId(),
        operator: 'AND',
        conditions: [{
          id: generateId(),
          parentField: legacy.parentField || '',
          condition: legacy.condition || 'hasValue',
          targetValue: legacy.targetValue as string | number | boolean | undefined,
        }],
      }],
      groupOperator: 'AND',
      action: legacy.action || 'show',
    };
  }

  return null;
}

/** Build Formily expression from advanced config */
function buildFormilyExpression(config: AdvancedConditionalVisibility): {
  dependencies: string[];
  fulfill: { state: { visible?: string; disabled?: string } };
  _advancedConditional: AdvancedConditionalVisibility;
} {
  // Collect all unique field dependencies
  const dependencies = [...new Set(
    config.groups.flatMap(g => g.conditions.map(c => c.parentField))
  )];

  // Build expression parts for each group
  const groupExpressions = config.groups.map(group => {
    const conditionExpressions = group.conditions.map((condition, index) => {
      const depIndex = dependencies.indexOf(condition.parentField);
      const depRef = `$deps[${depIndex}]`;

      switch (condition.condition) {
        case 'hasValue':
          return `!!${depRef}`;
        case 'isEmpty':
          return `!${depRef}`;
        case 'equals':
          return `${depRef} === ${JSON.stringify(condition.targetValue)}`;
        case 'notEquals':
          return `${depRef} !== ${JSON.stringify(condition.targetValue)}`;
        case 'greaterThan':
          return `${depRef} > ${JSON.stringify(Number(condition.targetValue))}`;
        case 'lessThan':
          return `${depRef} < ${JSON.stringify(Number(condition.targetValue))}`;
        case 'contains':
          return `String(${depRef}).includes(${JSON.stringify(condition.targetValue)})`;
        default:
          return 'true';
      }
    });

    // Join conditions with group operator
    const groupOperator = group.operator === 'AND' ? ' && ' : ' || ';
    return conditionExpressions.length > 1
      ? `(${conditionExpressions.join(groupOperator)})`
      : conditionExpressions[0];
  });

  // Join groups with groupOperator
  const groupOperator = config.groupOperator === 'AND' ? ' && ' : ' || ';
  let expression = groupExpressions.length > 1
    ? `(${groupExpressions.join(groupOperator)})`
    : groupExpressions[0] || 'true';

  // Wrap in Formily syntax
  expression = `{{${expression}}}`;

  // Invert for hide action
  if (config.action === 'hide') {
    expression = `{{!(${expression.slice(2, -2)})}}`;
  }

  const state = config.action === 'disable'
    ? { disabled: expression }
    : { visible: expression };

  return {
    dependencies,
    fulfill: { state },
    _advancedConditional: config,
  };
}

// =============================================================================
// CONDITION ROW COMPONENT
// =============================================================================

interface ConditionRowProps {
  condition: ConditionItem;
  parentFieldOptions: ParentFieldOption[];
  isOnly: boolean;
  onUpdate: (updates: Partial<ConditionItem>) => void;
  onRemove: () => void;
}

function ConditionRow({
  condition,
  parentFieldOptions,
  isOnly,
  onUpdate,
  onRemove,
}: ConditionRowProps) {
  const selectedParent = parentFieldOptions.find(p => p.value === condition.parentField);
  const conditionOption = CONDITION_OPTIONS.find(c => c.value === condition.condition);
  const needsValue = conditionOption?.needsValue ?? false;

  return (
    <div className="flex items-start gap-2 p-2 bg-surface/30 rounded-md border border-default">
      {/* Parent Field */}
      <Select
        value={condition.parentField}
        onValueChange={(value) => onUpdate({ parentField: value })}
      >
        <SelectTrigger className="h-8 text-xs w-32">
          <SelectValue placeholder="Field..." />
        </SelectTrigger>
        <SelectContent>
          {parentFieldOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Condition */}
      <Select
        value={condition.condition}
        onValueChange={(value) => onUpdate({ condition: value as VisibilityCondition })}
      >
        <SelectTrigger className="h-8 text-xs w-28">
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

      {/* Target Value */}
      {needsValue && (
        selectedParent?.hasOptions ? (
          <Select
            value={String(condition.targetValue || '')}
            onValueChange={(value) => onUpdate({ targetValue: value })}
          >
            <SelectTrigger className="h-8 text-xs w-24">
              <SelectValue placeholder="Value..." />
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
            value={String(condition.targetValue || '')}
            onChange={(e) => onUpdate({ targetValue: e.target.value })}
            placeholder="Value..."
            className="h-8 text-xs w-24"
          />
        )
      )}

      {/* Remove Button */}
      {!isOnly && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-secondary hover:text-error"
              onClick={onRemove}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Remove condition</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

// =============================================================================
// CONDITION GROUP COMPONENT
// =============================================================================

interface ConditionGroupRowProps {
  group: ConditionGroup;
  groupIndex: number;
  totalGroups: number;
  parentFieldOptions: ParentFieldOption[];
  onUpdate: (updates: Partial<ConditionGroup>) => void;
  onRemove: () => void;
  onUpdateCondition: (conditionId: string, updates: Partial<ConditionItem>) => void;
  onRemoveCondition: (conditionId: string) => void;
  onAddCondition: () => void;
}

function ConditionGroupRow({
  group,
  groupIndex,
  totalGroups,
  parentFieldOptions,
  onUpdate,
  onRemove,
  onUpdateCondition,
  onRemoveCondition,
  onAddCondition,
}: ConditionGroupRowProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border border-accent/30 rounded-lg overflow-hidden">
      {/* Group Header */}
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2',
          'bg-accent/5 border-b border-accent/20',
          'cursor-pointer hover:bg-accent/10'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Button variant="ghost" size="icon" className="size-5">
          {isExpanded ? (
            <ChevronDown className="size-3.5 text-accent" />
          ) : (
            <ChevronRight className="size-3.5 text-accent" />
          )}
        </Button>

        <span className="text-xs font-medium text-primary flex-1">
          Condition Group {groupIndex + 1}
        </span>

        {/* Operator Toggle */}
        <div className="flex items-center gap-1">
          <Button
            variant={group.operator === 'AND' ? 'default' : 'ghost'}
            size="sm"
            className="h-6 text-xs px-2"
            onClick={(e) => {
              e.stopPropagation();
              onUpdate({ operator: 'AND' });
            }}
          >
            AND
          </Button>
          <Button
            variant={group.operator === 'OR' ? 'default' : 'ghost'}
            size="sm"
            className="h-6 text-xs px-2"
            onClick={(e) => {
              e.stopPropagation();
              onUpdate({ operator: 'OR' });
            }}
          >
            OR
          </Button>
        </div>

        {/* Remove Group */}
        {totalGroups > 1 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 text-secondary hover:text-error"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Remove group</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Group Conditions */}
      {isExpanded && (
        <div className="p-2 space-y-2">
          {group.conditions.map((condition, index) => (
            <React.Fragment key={condition.id}>
              {index > 0 && (
                <div className="flex items-center justify-center">
                  <Badge variant="secondary" className="text-xs">
                    {group.operator}
                  </Badge>
                </div>
              )}
              <ConditionRow
                condition={condition}
                parentFieldOptions={parentFieldOptions}
                isOnly={group.conditions.length === 1}
                onUpdate={(updates) => onUpdateCondition(condition.id, updates)}
                onRemove={() => onRemoveCondition(condition.id)}
              />
            </React.Fragment>
          ))}

          {/* Add Condition Button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full gap-2 text-xs text-accent hover:text-accent hover:bg-accent/10"
            onClick={onAddCondition}
          >
            <Plus className="size-3.5" />
            Add Condition
          </Button>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function AdvancedConditionalLogic({
  fieldKey,
  field,
  onUpdate,
}: AdvancedConditionalLogicProps) {
  const { schema } = useFormBuilder();

  // Get available parent fields (all fields except this one)
  const parentFieldOptions = useMemo((): ParentFieldOption[] => {
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

  // Get current advanced config
  const currentConfig = useMemo(() => parseAdvancedConfig(field), [field]);

  const isEnabled = currentConfig?.enabled ?? false;

  // Enable/disable
  const handleToggle = useCallback(
    (enabled: boolean) => {
      if (enabled) {
        const defaultConfig: AdvancedConditionalVisibility = {
          enabled: true,
          groups: [createGroup(parentFieldOptions)],
          groupOperator: 'AND',
          action: 'show',
        };
        onUpdate({ 'x-reactions': buildFormilyExpression(defaultConfig) });
      } else {
        onUpdate({ 'x-reactions': undefined });
      }
    },
    [parentFieldOptions, onUpdate]
  );

  // Update config
  const updateConfig = useCallback(
    (updates: Partial<AdvancedConditionalVisibility>) => {
      if (!currentConfig) return;
      const newConfig = { ...currentConfig, ...updates };
      onUpdate({ 'x-reactions': buildFormilyExpression(newConfig) });
    },
    [currentConfig, onUpdate]
  );

  // Add group
  const handleAddGroup = useCallback(() => {
    if (!currentConfig) return;
    updateConfig({
      groups: [...currentConfig.groups, createGroup(parentFieldOptions)],
    });
  }, [currentConfig, parentFieldOptions, updateConfig]);

  // Remove group
  const handleRemoveGroup = useCallback((groupId: string) => {
    if (!currentConfig) return;
    updateConfig({
      groups: currentConfig.groups.filter(g => g.id !== groupId),
    });
  }, [currentConfig, updateConfig]);

  // Update group
  const handleUpdateGroup = useCallback((groupId: string, updates: Partial<ConditionGroup>) => {
    if (!currentConfig) return;
    updateConfig({
      groups: currentConfig.groups.map(g =>
        g.id === groupId ? { ...g, ...updates } : g
      ),
    });
  }, [currentConfig, updateConfig]);

  // Add condition to group
  const handleAddCondition = useCallback((groupId: string) => {
    if (!currentConfig) return;
    updateConfig({
      groups: currentConfig.groups.map(g =>
        g.id === groupId
          ? { ...g, conditions: [...g.conditions, createCondition(parentFieldOptions)] }
          : g
      ),
    });
  }, [currentConfig, parentFieldOptions, updateConfig]);

  // Remove condition from group
  const handleRemoveCondition = useCallback((groupId: string, conditionId: string) => {
    if (!currentConfig) return;
    updateConfig({
      groups: currentConfig.groups.map(g =>
        g.id === groupId
          ? { ...g, conditions: g.conditions.filter(c => c.id !== conditionId) }
          : g
      ),
    });
  }, [currentConfig, updateConfig]);

  // Update condition in group
  const handleUpdateCondition = useCallback(
    (groupId: string, conditionId: string, updates: Partial<ConditionItem>) => {
      if (!currentConfig) return;
      updateConfig({
        groups: currentConfig.groups.map(g =>
          g.id === groupId
            ? {
                ...g,
                conditions: g.conditions.map(c =>
                  c.id === conditionId ? { ...c, ...updates } : c
                ),
              }
            : g
        ),
      });
    },
    [currentConfig, updateConfig]
  );

  if (parentFieldOptions.length === 0) {
    return (
      <div className="text-sm text-secondary text-center py-4">
        Add more fields to enable conditional logic
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">Advanced Conditions</Label>
          <p className="text-xs text-secondary">
            Multiple conditions with AND/OR logic
          </p>
        </div>
        <Switch checked={isEnabled} onCheckedChange={handleToggle} />
      </div>

      {isEnabled && currentConfig && (
        <div className="space-y-3">
          {/* Condition Groups */}
          {currentConfig.groups.map((group, index) => (
            <React.Fragment key={group.id}>
              {index > 0 && (
                <div className="flex items-center gap-2 justify-center">
                  <div className="h-px flex-1 bg-border-default" />
                  <div className="flex items-center gap-1">
                    <Button
                      variant={currentConfig.groupOperator === 'AND' ? 'default' : 'outline'}
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => updateConfig({ groupOperator: 'AND' })}
                    >
                      AND
                    </Button>
                    <Button
                      variant={currentConfig.groupOperator === 'OR' ? 'default' : 'outline'}
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => updateConfig({ groupOperator: 'OR' })}
                    >
                      OR
                    </Button>
                  </div>
                  <div className="h-px flex-1 bg-border-default" />
                </div>
              )}
              <ConditionGroupRow
                group={group}
                groupIndex={index}
                totalGroups={currentConfig.groups.length}
                parentFieldOptions={parentFieldOptions}
                onUpdate={(updates) => handleUpdateGroup(group.id, updates)}
                onRemove={() => handleRemoveGroup(group.id)}
                onUpdateCondition={(conditionId, updates) =>
                  handleUpdateCondition(group.id, conditionId, updates)
                }
                onRemoveCondition={(conditionId) =>
                  handleRemoveCondition(group.id, conditionId)
                }
                onAddCondition={() => handleAddCondition(group.id)}
              />
            </React.Fragment>
          ))}

          {/* Add Group Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 text-xs"
            onClick={handleAddGroup}
          >
            <Plus className="size-3.5" />
            Add Condition Group
          </Button>

          {/* Action Selection */}
          <div className="pt-2 border-t border-default">
            <Label className="text-xs text-secondary mb-2 block">
              When conditions are met
            </Label>
            <div className="flex gap-2">
              {ACTION_OPTIONS.map((option) => {
                const isSelected = currentConfig.action === option.value;
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
                    onClick={() => updateConfig({ action: option.value as VisibilityAction })}
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Logic Preview */}
          <div className="p-2 bg-muted-bg rounded text-xs text-secondary">
            <strong>Logic Preview:</strong>
            <p className="mt-1 font-mono text-[10px] break-all">
              {buildLogicPreview(currentConfig, parentFieldOptions)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Build human-readable preview of the logic
 */
function buildLogicPreview(
  config: AdvancedConditionalVisibility,
  parentFieldOptions: ParentFieldOption[]
): string {
  const getFieldLabel = (fieldKey: string) => {
    const opt = parentFieldOptions.find(p => p.value === fieldKey);
    return opt?.label || fieldKey;
  };

  const getConditionText = (condition: ConditionItem): string => {
    const fieldLabel = getFieldLabel(condition.parentField);
    switch (condition.condition) {
      case 'hasValue':
        return `"${fieldLabel}" has value`;
      case 'isEmpty':
        return `"${fieldLabel}" is empty`;
      case 'equals':
        return `"${fieldLabel}" = "${condition.targetValue}"`;
      case 'notEquals':
        return `"${fieldLabel}" ≠ "${condition.targetValue}"`;
      case 'greaterThan':
        return `"${fieldLabel}" > ${condition.targetValue}`;
      case 'lessThan':
        return `"${fieldLabel}" < ${condition.targetValue}`;
      case 'contains':
        return `"${fieldLabel}" contains "${condition.targetValue}"`;
      default:
        return `"${fieldLabel}"`;
    }
  };

  const groupTexts = config.groups.map(group => {
    const condTexts = group.conditions.map(getConditionText);
    const joined = condTexts.join(` ${group.operator} `);
    return condTexts.length > 1 ? `(${joined})` : joined;
  });

  const fullExpression = groupTexts.join(` ${config.groupOperator} `);

  const actionText = config.action === 'show'
    ? 'SHOW'
    : config.action === 'hide'
      ? 'HIDE'
      : 'DISABLE';

  return `IF ${fullExpression} THEN ${actionText} this field`;
}

AdvancedConditionalLogic.displayName = 'AdvancedConditionalLogic';

export default AdvancedConditionalLogic;
