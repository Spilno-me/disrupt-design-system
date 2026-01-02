/**
 * Form Preview
 * Live preview of the form with mock data entry
 */

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
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
import { getOrderedFields } from '../utils/schema-utils';
import type { SchemaProperty } from '../types';

export function FormPreview() {
  const { schema } = useFormBuilder();
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  const orderedFields = getOrderedFields(schema);

  const handleReset = () => {
    setFormData({});
  };

  const handleFieldChange = (fieldKey: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  return (
    <div className="flex flex-col h-full bg-surface-secondary">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle bg-surface-primary">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Form Preview</h2>
          <p className="text-xs text-text-secondary">
            Test your form with live data entry
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
              {orderedFields.map(([fieldKey, field]) => (
                <PreviewField
                  key={fieldKey}
                  fieldKey={fieldKey}
                  field={field}
                  value={formData[fieldKey]}
                  onChange={(value) => handleFieldChange(fieldKey, value)}
                />
              ))}

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
 * Preview Field - Interactive field renderer
 */
interface PreviewFieldProps {
  fieldKey: string;
  field: SchemaProperty;
  value: unknown;
  onChange: (value: unknown) => void;
}

function PreviewField({ fieldKey, field, value, onChange }: PreviewFieldProps) {
  const component = field['x-component'];
  const title = field.title || fieldKey;
  const required = field.required;
  const description = field.description;

  const fieldLabel = (
    <Label className="text-sm font-medium text-text-primary">
      {title}
      {required && <span className="text-error ml-1">*</span>}
    </Label>
  );

  const helpText = description && (
    <p className="text-xs text-text-secondary mt-1">{description}</p>
  );

  switch (component) {
    case 'FormText':
      return (
        <p className="text-text-secondary">
          {(field['x-component-props']?.content as string) || 'Static text'}
        </p>
      );

    case 'Input':
      return (
        <div className="space-y-1.5">
          {fieldLabel}
          <Input
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${title.toLowerCase()}...`}
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
          />
          {helpText}
        </div>
      );

    case 'Select':
    case 'DictionarySelect':
    case 'LocationSelect':
    case 'UserSelect':
    case 'AssetSelect':
    case 'VehicleSelect':
    case 'GenericEntitySelect':
      return (
        <div className="space-y-1.5">
          {fieldLabel}
          <Select
            value={(value as string) || ''}
            onValueChange={onChange}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${title.toLowerCase()}...`} />
            </SelectTrigger>
            <SelectContent>
              {field.enum?.map((opt, i) => (
                <SelectItem key={i} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {helpText}
        </div>
      );

    case 'RadioGroup':
      return (
        <div className="space-y-2">
          {fieldLabel}
          <div className="space-y-2">
            {field.enum?.map((opt, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={fieldKey}
                  value={String(opt.value)}
                  checked={value === opt.value}
                  onChange={() => onChange(opt.value)}
                  className="w-4 h-4"
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
        <div className="flex items-start gap-2">
          <Checkbox
            id={fieldKey}
            checked={(value as boolean) || false}
            onCheckedChange={onChange}
            className="mt-0.5"
          />
          <div>
            <Label htmlFor={fieldKey} className="text-sm cursor-pointer">
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
          />
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
          />
          {helpText}
        </div>
      );
  }
}
