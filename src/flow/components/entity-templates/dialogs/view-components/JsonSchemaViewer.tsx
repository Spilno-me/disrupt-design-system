/**
 * JsonSchemaViewer - Collapsible raw JSON schema viewer
 *
 * Shows formatted JSON schema with copy functionality.
 * Collapsed by default to reduce visual noise.
 *
 * @component ATOM
 */

import * as React from 'react'
import { Copy, Check, ChevronDown, ChevronRight, Code, X } from 'lucide-react'

// =============================================================================
// TYPES
// =============================================================================

export interface JsonSchemaViewerProps {
  jsonSchema: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function JsonSchemaViewer({ jsonSchema }: JsonSchemaViewerProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const [copyError, setCopyError] = React.useState(false)

  const formattedJson = React.useMemo(() => {
    try {
      return JSON.stringify(JSON.parse(jsonSchema), null, 2)
    } catch {
      return jsonSchema
    }
  }, [jsonSchema])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedJson)
      setCopied(true)
      setCopyError(false)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy JSON schema:', err)
      setCopyError(true)
      setTimeout(() => setCopyError(false), 2000)
    }
  }

  return (
    <div className="rounded-lg border border-default overflow-hidden" data-testid="view-template-json-viewer">
      {/* Header - clickable to expand */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        data-testid="view-template-json-toggle"
        className="w-full flex items-center justify-between p-3 bg-muted-bg/30 hover:bg-muted-bg/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="size-4 text-secondary" />
          ) : (
            <ChevronRight className="size-4 text-secondary" />
          )}
          <Code className="size-4 text-secondary" />
          <span className="text-sm font-medium text-primary">Raw JSON Schema</span>
        </div>
        <span className="text-xs text-tertiary">
          {formattedJson.split('\n').length} lines
        </span>
      </button>

      {/* Expandable content */}
      {isExpanded && (
        <div className="relative">
          {/* Copy button */}
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? 'Copied' : copyError ? 'Copy failed' : 'Copy JSON schema'}
            data-testid="view-template-json-copy"
            className="absolute top-2 right-2 p-1.5 rounded bg-surface border border-default hover:bg-muted-bg transition-colors"
          >
            {copied ? (
              <Check className="size-3.5 text-success" />
            ) : copyError ? (
              <X className="size-3.5 text-error" />
            ) : (
              <Copy className="size-3.5 text-secondary" />
            )}
          </button>

          {/* Code block */}
          <pre className="p-4 pt-10 text-xs font-mono text-secondary bg-muted-bg/20 overflow-x-auto max-h-[300px] overflow-y-auto">
            {formattedJson}
          </pre>
        </div>
      )}
    </div>
  )
}

JsonSchemaViewer.displayName = 'JsonSchemaViewer'

export default JsonSchemaViewer
