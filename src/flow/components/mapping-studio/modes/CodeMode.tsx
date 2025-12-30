/**
 * CodeMode - JSON editor for mappings
 *
 * Provides a code-style editor for advanced users who prefer JSON.
 * Includes line numbers, validation, and apply/revert controls.
 */

import * as React from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Download,
  RefreshCw,
  Check,
  Upload,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'
import { useMappingStudio } from '../context/MappingStudioProvider'

// =============================================================================
// CODE EDITOR
// =============================================================================

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  errors?: Array<{ line?: number; message: string }>
  readOnly?: boolean
  className?: string
}

function CodeEditor({
  value,
  onChange,
  errors = [],
  readOnly = false,
  className,
}: CodeEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = React.useRef<HTMLDivElement>(null)
  const [lineCount, setLineCount] = React.useState(1)

  // Sync line numbers with content
  React.useEffect(() => {
    const lines = value.split('\n').length
    setLineCount(Math.max(lines, 1))
  }, [value])

  // Sync scroll between line numbers and textarea
  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  // Handle tab key for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newValue = value.substring(0, start) + '  ' + value.substring(end)
      onChange(newValue)
      // Set cursor position after inserted spaces
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2
          textareaRef.current.selectionEnd = start + 2
        }
      })
    }
  }

  return (
    <div
      className={cn(
        'relative flex border border-default rounded-lg overflow-hidden bg-page font-mono text-sm',
        errors.length > 0 && 'border-error',
        className
      )}
    >
      {/* Line Numbers */}
      <div
        ref={lineNumbersRef}
        className="flex flex-col items-end py-3 px-3 bg-muted-bg border-r border-default overflow-hidden select-none"
        style={{ minWidth: '3rem' }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div
            key={i + 1}
            className={cn(
              'leading-6 text-secondary text-xs',
              errors.some((e) => e.line === i + 1) && 'text-error font-bold'
            )}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        readOnly={readOnly}
        spellCheck={false}
        className={cn(
          'flex-1 p-3 resize-none bg-transparent outline-none min-h-[400px]',
          'leading-6 text-primary',
          'placeholder:text-secondary',
          readOnly && 'cursor-not-allowed opacity-70'
        )}
        placeholder="Enter mapping JSON..."
      />
    </div>
  )
}

// =============================================================================
// CODE MODE
// =============================================================================

export interface CodeModeProps {
  className?: string
}

export function CodeMode({ className }: CodeModeProps) {
  const {
    jsonValue,
    setJsonValue,
    jsonErrors,
    applyJsonChanges,
    exportJSON,
    readOnly,
    isDirty: _isDirty,
    config,
  } = useMappingStudio()

  const [copied, setCopied] = React.useState(false)
  const [hasUnappliedChanges, setHasUnappliedChanges] = React.useState(false)

  // Track if JSON has been modified since last apply
  const lastAppliedRef = React.useRef(jsonValue)

  React.useEffect(() => {
    setHasUnappliedChanges(jsonValue !== lastAppliedRef.current)
  }, [jsonValue])

  const handleApply = () => {
    if (applyJsonChanges()) {
      lastAppliedRef.current = jsonValue
      setHasUnappliedChanges(false)
    }
  }

  const handleRevert = () => {
    const json = exportJSON()
    setJsonValue(json)
    lastAppliedRef.current = json
    setHasUnappliedChanges(false)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonValue)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([jsonValue], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mapping-${config.name || 'export'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const text = await file.text()
        setJsonValue(text)
      }
    }
    input.click()
  }

  const isValid = jsonErrors.length === 0

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 p-4 border-b border-default">
        <div className="flex items-center gap-3">
          {/* Status */}
          {isValid ? (
            <Badge variant="success" size="sm" className="gap-1">
              <CheckCircle2 className="size-3" />
              Valid JSON
            </Badge>
          ) : (
            <Badge variant="destructive" size="sm" className="gap-1">
              <AlertCircle className="size-3" />
              {jsonErrors.length} error{jsonErrors.length !== 1 ? 's' : ''}
            </Badge>
          )}

          {hasUnappliedChanges && (
            <Badge variant="warning" size="sm">
              Unapplied changes
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Import */}
          {!readOnly && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={handleImport}>
                  <Upload className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Import JSON file</TooltipContent>
            </Tooltip>
          )}

          {/* Download */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={handleDownload}>
                <Download className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download JSON</TooltipContent>
          </Tooltip>

          {/* Copy */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? (
                  <Check className="size-4 text-success" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{copied ? 'Copied!' : 'Copy to clipboard'}</TooltipContent>
          </Tooltip>

          <div className="w-px h-6 bg-default" />

          {/* Revert */}
          {!readOnly && hasUnappliedChanges && (
            <Button variant="secondary" size="sm" onClick={handleRevert}>
              <RefreshCw className="size-4 mr-2" />
              Revert
            </Button>
          )}

          {/* Apply */}
          {!readOnly && (
            <Button
              size="sm"
              onClick={handleApply}
              disabled={!isValid || !hasUnappliedChanges}
            >
              Apply Changes
            </Button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto p-4">
        <CodeEditor
          value={jsonValue}
          onChange={setJsonValue}
          errors={jsonErrors.map((e) => ({ message: e.message }))}
          readOnly={readOnly}
          className="h-full"
        />
      </div>

      {/* Error Panel */}
      {jsonErrors.length > 0 && (
        <div className="border-t border-default bg-error/5 p-4">
          <h4 className="text-sm font-medium text-error mb-2">Errors</h4>
          <ul className="space-y-1">
            {jsonErrors.map((error, index) => (
              <li key={index} className="text-sm text-error flex items-start gap-2">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{error.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

CodeMode.displayName = 'CodeMode'

export default CodeMode
