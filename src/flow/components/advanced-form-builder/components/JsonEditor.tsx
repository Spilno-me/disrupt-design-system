/**
 * JSON Editor
 * Direct schema editing via JSON
 */

import { useState, useEffect, useCallback } from 'react';
import { AlertCircle, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useFormBuilder } from '../context';
import type { ISchema } from '../types';

export function JsonEditor() {
  const { schema, updateSchema } = useFormBuilder();
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync schema to text
  useEffect(() => {
    setJsonText(JSON.stringify(schema, null, 2));
    setError(null);
  }, [schema]);

  // Validate and update schema
  const handleTextChange = useCallback((value: string) => {
    setJsonText(value);

    try {
      const parsed = JSON.parse(value) as ISchema;

      // Basic validation
      if (parsed.type !== 'object') {
        setError('Schema type must be "object"');
        return;
      }

      if (!parsed.properties || typeof parsed.properties !== 'object') {
        setError('Schema must have a "properties" object');
        return;
      }

      setError(null);
      updateSchema(parsed);
    } catch (e) {
      if (e instanceof SyntaxError) {
        setError('Invalid JSON syntax');
      } else {
        setError('Invalid schema format');
      }
    }
  }, [updateSchema]);

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }, [jsonText]);

  // Format JSON
  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch {
      setError('Cannot format invalid JSON');
    }
  }, [jsonText]);

  return (
    <div className="flex flex-col h-full bg-surface-primary">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">JSON Schema</h2>
          <p className="text-xs text-text-secondary">
            Edit the form schema directly
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleFormat}>
            Format
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="m-4 mb-0">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Editor */}
      <div className="flex-1 p-4 min-h-0">
        <Textarea
          value={jsonText}
          onChange={(e) => handleTextChange(e.target.value)}
          className={cn(
            'h-full font-mono text-sm resize-none',
            'bg-surface-secondary',
            error && 'border-error focus-visible:ring-error'
          )}
          placeholder="Enter JSON schema..."
          spellCheck={false}
        />
      </div>
    </div>
  );
}
