/**
 * CodeMode - JSON Schema code editor
 *
 * Provides raw JSON editing with syntax validation, formatting,
 * and error highlighting. Uses a textarea with JSON validation.
 *
 * Note: Can be enhanced with Monaco Editor later by installing
 * @monaco-editor/react and replacing the textarea component.
 */

import * as React from 'react'
import { useState, useCallback, useEffect, useRef } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Download,
  Upload,
  Braces,
  Undo2,
  Redo2,
  Clipboard,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Textarea } from '../../../../components/ui/textarea'
import { Badge } from '../../../../components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'
import { useSchemaStudio } from '../context/SchemaStudioProvider'
import type { ValidationError } from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface CodeModeProps {
  /** Additional class name */
  className?: string
}

interface ParseResult {
  valid: boolean
  errors: ValidationError[]
  formattedJson?: string
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Parse and validate JSON string
 */
function parseJson(json: string): ParseResult {
  const errors: ValidationError[] = []

  if (!json.trim()) {
    return { valid: false, errors: [{ path: '', message: 'Empty input', severity: 'error' }] }
  }

  try {
    const parsed = JSON.parse(json)

    // Validate it's a valid schema structure
    if (typeof parsed !== 'object' || parsed === null) {
      errors.push({
        path: '',
        message: 'Schema must be an object',
        severity: 'error',
      })
    } else {
      // Check required fields
      if (parsed.type !== 'object') {
        errors.push({
          path: 'type',
          message: 'Root type must be "object"',
          severity: 'error',
        })
      }

      if (!parsed.properties || typeof parsed.properties !== 'object') {
        errors.push({
          path: 'properties',
          message: 'Schema must have a "properties" object',
          severity: 'error',
        })
      }

      if (!parsed.title) {
        errors.push({
          path: 'title',
          message: 'Schema should have a title',
          severity: 'warning',
        })
      }
    }

    return {
      valid: errors.filter((e) => e.severity === 'error').length === 0,
      errors,
      formattedJson: JSON.stringify(parsed, null, 2),
    }
  } catch (e) {
    // Extract line/column from JSON parse error
    const errorMessage = e instanceof Error ? e.message : 'Invalid JSON'
    const match = errorMessage.match(/at position (\d+)/)
    let path = ''

    if (match) {
      const position = parseInt(match[1], 10)
      const lines = json.substring(0, position).split('\n')
      const line = lines.length
      const column = lines[lines.length - 1].length + 1
      path = `Line ${line}, Column ${column}`
    }

    errors.push({
      path,
      message: errorMessage,
      severity: 'error',
    })

    return { valid: false, errors }
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CodeMode({ className }: CodeModeProps) {
  const {
    schema,
    exportJSON,
    importJSON,
    undo,
    redo,
    canUndo,
    canRedo,
    isDirty,
  } = useSchemaStudio()

  // Local state for editing
  const [code, setCode] = useState('')
  const [parseResult, setParseResult] = useState<ParseResult>({ valid: true, errors: [] })
  const [hasLocalChanges, setHasLocalChanges] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Sync from schema when it changes externally
  useEffect(() => {
    if (!hasLocalChanges) {
      const formatted = exportJSON()
      setCode(formatted)
      setParseResult({ valid: true, errors: [], formattedJson: formatted })
    }
  }, [schema, exportJSON, hasLocalChanges])

  // Handle code changes
  const handleCodeChange = useCallback((value: string) => {
    setCode(value)
    setHasLocalChanges(true)

    // Debounced validation
    const result = parseJson(value)
    setParseResult(result)
  }, [])

  // Apply changes to schema
  const handleApply = useCallback(() => {
    const errors = importJSON(code)
    if (errors.length === 0) {
      setHasLocalChanges(false)
    }
  }, [code, importJSON])

  // Format JSON
  const handleFormat = useCallback(() => {
    if (parseResult.formattedJson) {
      setCode(parseResult.formattedJson)
    }
  }, [parseResult.formattedJson])

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [code])

  // Paste from clipboard
  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText()
      handleCodeChange(text)
    } catch (err) {
      console.error('Failed to paste:', err)
    }
  }, [handleCodeChange])

  // Download as file
  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${schema.title?.toLowerCase().replace(/\s+/g, '-') || 'schema'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [code, schema.title])

  // Upload from file
  const handleUpload = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          handleCodeChange(content)
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }, [handleCodeChange])

  // Discard local changes
  const handleDiscard = useCallback(() => {
    const formatted = exportJSON()
    setCode(formatted)
    setParseResult({ valid: true, errors: [], formattedJson: formatted })
    setHasLocalChanges(false)
  }, [exportJSON])

  // Count lines for gutter
  const lineCount = code.split('\n').length

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-default bg-muted-bg/50">
        {/* Left side - Status */}
        <div className="flex items-center gap-2">
          {parseResult.valid ? (
            <Badge variant="success" size="sm" className="gap-1">
              <CheckCircle2 className="size-3" />
              Valid JSON
            </Badge>
          ) : (
            <Badge variant="destructive" size="sm" className="gap-1">
              <AlertCircle className="size-3" />
              {parseResult.errors.length} error{parseResult.errors.length !== 1 ? 's' : ''}
            </Badge>
          )}

          {hasLocalChanges && (
            <Badge variant="secondary" size="sm">
              Unsaved changes
            </Badge>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-1">
          {/* Undo/Redo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="size-8 p-0"
                onClick={undo}
                disabled={!canUndo}
              >
                <Undo2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (⌘Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="size-8 p-0"
                onClick={redo}
                disabled={!canRedo}
              >
                <Redo2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (⌘⇧Z)</TooltipContent>
          </Tooltip>

          <div className="w-px h-4 bg-default mx-1" />

          {/* Format */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="size-8 p-0"
                onClick={handleFormat}
                disabled={!parseResult.valid}
              >
                <Braces className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Format JSON</TooltipContent>
          </Tooltip>

          {/* Copy */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="size-8 p-0"
                onClick={handleCopy}
              >
                <Copy className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy to clipboard</TooltipContent>
          </Tooltip>

          {/* Paste */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="size-8 p-0"
                onClick={handlePaste}
              >
                <Clipboard className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Paste from clipboard</TooltipContent>
          </Tooltip>

          <div className="w-px h-4 bg-default mx-1" />

          {/* Upload */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="size-8 p-0"
                onClick={handleUpload}
              >
                <Upload className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Upload JSON file</TooltipContent>
          </Tooltip>

          {/* Download */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="size-8 p-0"
                onClick={handleDownload}
              >
                <Download className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download JSON file</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Line Numbers Gutter */}
        <div className="w-12 bg-muted-bg border-r border-default overflow-hidden">
          <div className="py-3 px-2 text-right font-mono text-xs text-tertiary select-none">
            {Array.from({ length: lineCount }).map((_, i) => (
              <div key={i} className="h-[1.5rem] leading-6">
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Code Area */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className={cn(
              'absolute inset-0 resize-none rounded-none border-0',
              'font-mono text-sm leading-6 py-3 px-4',
              'focus-visible:ring-0 focus-visible:ring-offset-0',
              !parseResult.valid && 'text-error'
            )}
            placeholder="Paste your JSON Schema here..."
            spellCheck={false}
          />
        </div>
      </div>

      {/* Error Panel */}
      {parseResult.errors.length > 0 && (
        <div className="border-t border-default bg-surface max-h-32 overflow-y-auto">
          <div className="px-4 py-2 space-y-1">
            {parseResult.errors.map((error, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-start gap-2 text-sm',
                  error.severity === 'error' && 'text-error',
                  error.severity === 'warning' && 'text-warning',
                  error.severity === 'info' && 'text-secondary'
                )}
              >
                <AlertCircle className="size-4 mt-0.5 flex-shrink-0" />
                <span>
                  {error.path && <span className="font-mono text-xs">{error.path}: </span>}
                  {error.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Bar (when changes exist) */}
      {hasLocalChanges && (
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-default bg-muted-bg/50">
          <Button type="button" variant="outline" size="sm" onClick={handleDiscard}>
            Discard
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleApply}
            disabled={!parseResult.valid}
          >
            Apply Changes
          </Button>
        </div>
      )}
    </div>
  )
}

export default CodeMode
