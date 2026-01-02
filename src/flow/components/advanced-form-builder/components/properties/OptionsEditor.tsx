/**
 * Options Editor
 * Editor for enum options in Select/Radio fields
 */

import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Option {
  label: string;
  value: string | number | boolean;
}

interface OptionsEditorProps {
  options: Option[];
  onChange: (options: Option[]) => void;
  maxOptions?: number;
}

export function OptionsEditor({
  options,
  onChange,
  maxOptions = 50,
}: OptionsEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddOption = () => {
    if (options.length >= maxOptions) return;

    const newIndex = options.length + 1;
    const newOption: Option = {
      label: `Option ${newIndex}`,
      value: `option_${newIndex}`,
    };

    onChange([...options, newOption]);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    onChange(newOptions);
  };

  const handleUpdateOption = (index: number, updates: Partial<Option>) => {
    const newOptions = options.map((opt, i) =>
      i === index ? { ...opt, ...updates } : opt
    );
    onChange(newOptions);
  };

  const handleLabelChange = (index: number, label: string) => {
    // Auto-generate value from label if user hasn't customized it
    const currentOption = options[index];
    const isValueDefault = String(currentOption.value).startsWith('option_');

    const updates: Partial<Option> = { label };
    if (isValueDefault) {
      updates.value = label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    }

    handleUpdateOption(index, updates);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-text-primary">Options</Label>
        <span className="text-xs text-text-secondary">
          {options.length} / {maxOptions}
        </span>
      </div>

      {/* Options List */}
      <div className="space-y-2">
        {options.map((option, index) => (
          <div
            key={index}
            className={cn(
              'flex items-center gap-2 p-2 rounded-md',
              'bg-surface-secondary border border-border-subtle',
              editingIndex === index && 'ring-2 ring-accent-primary/20'
            )}
          >
            <GripVertical className="w-4 h-4 text-text-tertiary flex-shrink-0 cursor-grab" />

            <div className="flex-1 grid grid-cols-2 gap-2">
              <Input
                value={option.label}
                onChange={(e) => handleLabelChange(index, e.target.value)}
                onFocus={() => setEditingIndex(index)}
                onBlur={() => setEditingIndex(null)}
                placeholder="Label"
                className="h-8 text-sm"
              />
              <Input
                value={String(option.value)}
                onChange={(e) => handleUpdateOption(index, { value: e.target.value })}
                onFocus={() => setEditingIndex(index)}
                onBlur={() => setEditingIndex(null)}
                placeholder="Value"
                className="h-8 text-sm font-mono"
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-text-secondary hover:text-error"
              onClick={() => handleRemoveOption(index)}
              disabled={options.length <= 1}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add Option Button */}
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={handleAddOption}
        disabled={options.length >= maxOptions}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Option
      </Button>

      {options.length >= maxOptions && (
        <p className="text-xs text-warning text-center">
          Maximum {maxOptions} options reached
        </p>
      )}
    </div>
  );
}
