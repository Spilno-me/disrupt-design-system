/**
 * Field Properties Panel
 * Configuration form for the selected field
 */

import { useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useFormBuilder } from '../../context';
import type { SchemaProperty } from '../../types';
import { OptionsEditor } from './OptionsEditor';
import { ValidationRulesEditor } from './ValidationRulesEditor';
import { ConditionalVisibility } from './ConditionalVisibility';

interface FieldPropertiesPanelProps {
  className?: string;
}

export function FieldPropertiesPanel({ className }: FieldPropertiesPanelProps) {
  const {
    selectedFieldPath,
    selectedField,
    updateField,
    deleteField,
  } = useFormBuilder();

  const handleUpdate = useCallback(
    (updates: Partial<SchemaProperty>) => {
      if (!selectedFieldPath) return;
      updateField(selectedFieldPath, updates);
    },
    [selectedFieldPath, updateField]
  );

  const handleDelete = useCallback(() => {
    if (!selectedFieldPath) return;
    deleteField(selectedFieldPath);
  }, [selectedFieldPath, deleteField]);

  if (!selectedFieldPath || !selectedField) {
    return (
      <div className={cn('p-4 text-center', className)}>
        <p className="text-sm text-text-secondary">
          Select a field to edit its properties
        </p>
      </div>
    );
  }

  const fieldKey = selectedFieldPath[selectedFieldPath.length - 1];
  const component = selectedField['x-component'] || 'Input';
  const hasOptions = ['Select', 'RadioGroup'].includes(component);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">
            Field Properties
          </h3>
          <p className="text-xs text-text-secondary mt-0.5 font-mono">
            {fieldKey}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-text-secondary hover:text-error"
          onClick={handleDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <Separator />

      {/* Basic Properties */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
          Basic
        </h4>

        {/* Label */}
        <div className="space-y-1.5">
          <Label htmlFor="field-label" className="text-sm">
            Label
          </Label>
          <Input
            id="field-label"
            value={selectedField.title || ''}
            onChange={(e) => handleUpdate({ title: e.target.value })}
            placeholder="Field label"
          />
        </div>

        {/* Description / Help Text */}
        <div className="space-y-1.5">
          <Label htmlFor="field-description" className="text-sm">
            Help Text
          </Label>
          <Textarea
            id="field-description"
            value={selectedField.description || ''}
            onChange={(e) => handleUpdate({ description: e.target.value })}
            placeholder="Optional help text shown below the field"
            rows={2}
          />
        </div>

        {/* Required Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="field-required" className="text-sm">
              Required
            </Label>
            <p className="text-xs text-text-secondary">
              Field must have a value
            </p>
          </div>
          <Switch
            id="field-required"
            checked={selectedField.required || false}
            onCheckedChange={(checked) => handleUpdate({ required: checked })}
          />
        </div>
      </div>

      {/* Options (for Select/Radio) */}
      {hasOptions && (
        <>
          <Separator />
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              Options
            </h4>
            <OptionsEditor
              options={
                (selectedField.enum as Array<{ label: string; value: string | number | boolean }>) || []
              }
              onChange={(options) => handleUpdate({ enum: options })}
            />
          </div>
        </>
      )}

      {/* Component-Specific Properties */}
      <ComponentSpecificProps
        field={selectedField}
        onUpdate={handleUpdate}
      />

      {/* Default Value */}
      {selectedField.type !== 'void' && (
        <>
          <Separator />
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              Default Value
            </h4>
            <div className="space-y-1.5">
              <Label htmlFor="field-default" className="text-sm">
                Default
              </Label>
              <Input
                id="field-default"
                value={String(selectedField.default || '')}
                onChange={(e) =>
                  handleUpdate({
                    default: e.target.value || undefined,
                  })
                }
                placeholder="No default value"
              />
            </div>
          </div>
        </>
      )}

      {/* Validation Rules */}
      {selectedField.type !== 'void' && (
        <>
          <Separator />
          <ValidationRulesEditor field={selectedField} onUpdate={handleUpdate} />
        </>
      )}

      {/* Conditional Visibility */}
      {selectedField.type !== 'void' && (
        <>
          <Separator />
          <ConditionalVisibility
            fieldKey={fieldKey}
            field={selectedField}
            onUpdate={handleUpdate}
          />
        </>
      )}
    </div>
  );
}

/**
 * Component-specific property editors
 */
interface ComponentSpecificPropsProps {
  field: SchemaProperty;
  onUpdate: (updates: Partial<SchemaProperty>) => void;
}

function ComponentSpecificProps({ field, onUpdate }: ComponentSpecificPropsProps) {
  const component = field['x-component'];
  const componentProps = field['x-component-props'] || {};

  const updateComponentProps = (updates: Record<string, unknown>) => {
    onUpdate({
      'x-component-props': {
        ...componentProps,
        ...updates,
      },
    });
  };

  switch (component) {
    case 'TextArea':
      return (
        <>
          <Separator />
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              Text Area
            </h4>
            <div className="space-y-1.5">
              <Label htmlFor="textarea-rows" className="text-sm">
                Rows
              </Label>
              <Input
                id="textarea-rows"
                type="number"
                min={2}
                max={20}
                value={(componentProps.rows as number) || 4}
                onChange={(e) =>
                  updateComponentProps({ rows: parseInt(e.target.value) || 4 })
                }
              />
            </div>
          </div>
        </>
      );

    case 'NumberPicker':
      return (
        <>
          <Separator />
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              Number
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="number-min" className="text-sm">
                  Minimum
                </Label>
                <Input
                  id="number-min"
                  type="number"
                  value={field.minimum ?? ''}
                  onChange={(e) =>
                    onUpdate({
                      minimum: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  placeholder="No min"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="number-max" className="text-sm">
                  Maximum
                </Label>
                <Input
                  id="number-max"
                  type="number"
                  value={field.maximum ?? ''}
                  onChange={(e) =>
                    onUpdate({
                      maximum: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  placeholder="No max"
                />
              </div>
            </div>
          </div>
        </>
      );

    case 'FormText':
      return (
        <>
          <Separator />
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              Static Text
            </h4>
            <div className="space-y-1.5">
              <Label htmlFor="static-content" className="text-sm">
                Content
              </Label>
              <Textarea
                id="static-content"
                value={(componentProps.content as string) || ''}
                onChange={(e) => updateComponentProps({ content: e.target.value })}
                placeholder="Enter static text content"
                rows={3}
              />
            </div>
          </div>
        </>
      );

    case 'Upload':
      return (
        <>
          <Separator />
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              File Upload
            </h4>
            <div className="space-y-1.5">
              <Label htmlFor="upload-max" className="text-sm">
                Max Files
              </Label>
              <Input
                id="upload-max"
                type="number"
                min={1}
                max={10}
                value={(componentProps.maxCount as number) || 5}
                onChange={(e) =>
                  updateComponentProps({ maxCount: parseInt(e.target.value) || 5 })
                }
              />
            </div>
          </div>
        </>
      );

    case 'DictionarySelect':
      return (
        <>
          <Separator />
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              Dictionary
            </h4>
            <div className="space-y-1.5">
              <Label htmlFor="dict-code" className="text-sm">
                Dictionary Code
              </Label>
              <Input
                id="dict-code"
                value={(componentProps.dictionaryCode as string) || ''}
                onChange={(e) => updateComponentProps({ dictionaryCode: e.target.value })}
                placeholder="e.g., incident_types"
              />
            </div>
          </div>
        </>
      );

    default:
      return null;
  }
}
