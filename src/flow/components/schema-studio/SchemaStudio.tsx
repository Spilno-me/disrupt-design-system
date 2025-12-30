/**
 * SchemaStudio - Hybrid JSON Schema Editor
 *
 * A comprehensive schema editor with Visual, Code, and Split modes.
 * Supports drag-drop field reordering, undo/redo, command palette,
 * and optional live preview.
 *
 * @component MOLECULE
 * @testId Accepts data-testid prop, auto-generates: schema-studio-toolbar,
 *         schema-studio-mode-{mode}, schema-studio-validation,
 *         schema-studio-undo, schema-studio-redo, schema-studio-save
 *
 * @example
 * ```tsx
 * <SchemaStudio
 *   initialSchema={mySchema}
 *   onChange={(schema) => console.log('Changed:', schema)}
 *   onSave={async (schema) => await saveSchema(schema)}
 *   defaultMode="visual"
 *   showPreview
 * />
 * ```
 */

import * as React from 'react'
import {
  Layout,
  Code2,
  Columns,
  Eye,
  EyeOff,
  Command,
  Undo2,
  Redo2,
  Save,
  AlertCircle,
  CheckCircle2,
  History,
} from 'lucide-react'
import { cn } from '../../../lib/utils'
import { toast } from '../../../components/ui/sonner'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../components/ui/tooltip'
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '../../../components/ui/resizable-panels'
import { SchemaStudioProvider, useSchemaStudio } from './context/SchemaStudioProvider'
import { VisualMode } from './modes/VisualMode'
import { CodeMode } from './modes/CodeMode'
import { SchemaSummary } from './components/SchemaSummary'
import { CommandPalette } from './components/CommandPalette'
import type { SchemaStudioProps, EditorMode, LookupOption } from './types'

// =============================================================================
// INNER COMPONENT (uses context)
// =============================================================================

interface SchemaStudioInnerProps {
  lookupOptions?: Record<string, LookupOption[]>
  onSave?: (schema: any) => Promise<void>
}

function SchemaStudioInner({ lookupOptions, onSave }: SchemaStudioInnerProps) {
  const {
    mode,
    setMode,
    schema,
    isDirty,
    isSaving,
    setIsSaving,
    canUndo,
    canRedo,
    undo,
    redo,
    historyLength,
    showPreview,
    validationErrors,
    runValidation,
    isCommandPaletteOpen,
    openCommandPalette,
    closeCommandPalette,
    markSaved,
  } = useSchemaStudio()

  // State for preview visibility
  const [previewVisible, setPreviewVisible] = React.useState(showPreview)

  // Handle save
  const handleSave = React.useCallback(async () => {
    if (!onSave || !isDirty) return

    setIsSaving(true)
    try {
      await onSave(schema)
      markSaved()
      toast.success('Template saved', {
        description: `"${schema.title || 'Untitled'}" has been saved successfully.`,
      })
    } catch (error) {
      toast.error('Failed to save', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      })
    } finally {
      setIsSaving(false)
    }
  }, [onSave, isDirty, schema, setIsSaving, markSaved])

  // Mode icons
  const modeIcons: Record<EditorMode, React.ReactNode> = {
    visual: <Layout className="size-4" />,
    code: <Code2 className="size-4" />,
    split: <Columns className="size-4" />,
  }

  return (
    <div className="flex flex-col h-full bg-surface border border-default rounded-xl overflow-hidden shadow-sm">
      {/* Header Toolbar */}
      <div
        className="flex items-center justify-between gap-4 px-4 py-2 border-b border-default bg-muted-bg"
        data-testid="schema-studio-toolbar"
      >
        {/* Left side - Mode Switcher */}
        <div className="flex items-center gap-3">
          <Tabs value={mode} onValueChange={(v) => setMode(v as EditorMode)}>
            <TabsList variant="accent" animated>
              <TabsTrigger variant="accent" value="visual" className="gap-1.5" data-testid="schema-studio-mode-visual">
                <Layout className="size-3.5" />
                <span className="hidden sm:inline">Visual</span>
              </TabsTrigger>
              <TabsTrigger variant="accent" value="code" className="gap-1.5" data-testid="schema-studio-mode-code">
                <Code2 className="size-3.5" />
                <span className="hidden sm:inline">Code</span>
              </TabsTrigger>
              <TabsTrigger variant="accent" value="split" className="gap-1.5 hidden md:flex" data-testid="schema-studio-mode-split">
                <Columns className="size-3.5" />
                <span className="hidden lg:inline">Split</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Schema Title */}
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-default">
            <span className="text-sm font-medium text-primary truncate max-w-[200px]">
              {schema.title || 'Untitled Schema'}
            </span>
            {isDirty && (
              <Badge variant="secondary" size="sm">
                Modified
              </Badge>
            )}
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-1">
          {/* Validation status */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  'size-8 p-0',
                  validationErrors.length > 0 && 'text-warning'
                )}
                onClick={runValidation}
                data-testid="schema-studio-validation"
              >
                {validationErrors.length > 0 ? (
                  <AlertCircle className="size-4" />
                ) : (
                  <CheckCircle2 className="size-4 text-success" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {validationErrors.length > 0
                ? `${validationErrors.length} validation issue${validationErrors.length !== 1 ? 's' : ''}`
                : 'Schema is valid'}
            </TooltipContent>
          </Tooltip>

          {/* History indicator */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 px-2 py-1 text-xs text-tertiary">
                <History className="size-3" />
                <span className="hidden sm:inline">{historyLength}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {historyLength} state{historyLength !== 1 ? 's' : ''} in history
            </TooltipContent>
          </Tooltip>

          <div className="w-px h-4 bg-default" />

          {/* Undo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="size-8 p-0"
                onClick={undo}
                disabled={!canUndo}
                data-testid="schema-studio-undo"
              >
                <Undo2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (⌘Z)</TooltipContent>
          </Tooltip>

          {/* Redo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="size-8 p-0"
                onClick={redo}
                disabled={!canRedo}
                data-testid="schema-studio-redo"
              >
                <Redo2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (⌘⇧Z)</TooltipContent>
          </Tooltip>

          {/* Toggle Summary Panel */}
          {showPreview && (
            <>
              <div className="w-px h-4 bg-default" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="size-8 p-0"
                    onClick={() => setPreviewVisible(!previewVisible)}
                  >
                    {previewVisible ? (
                      <Eye className="size-4" />
                    ) : (
                      <EyeOff className="size-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {previewVisible ? 'Hide Summary' : 'Show Summary'}
                </TooltipContent>
              </Tooltip>
            </>
          )}

          {/* Command Palette */}
          <div className="w-px h-4 bg-default" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="size-8 p-0"
                onClick={openCommandPalette}
              >
                <Command className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Command Palette (⌘K)</TooltipContent>
          </Tooltip>

          {/* Save */}
          {onSave && (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="gap-1.5"
              data-testid="schema-studio-save"
            >
              <Save className="size-4" />
              <span className="hidden sm:inline">
                {isSaving ? 'Saving...' : 'Save'}
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Area - Resizable */}
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full"
          key={showPreview && previewVisible ? 'with-preview' : 'no-preview'}
        >
          {/* Editor Panel */}
          <ResizablePanel
            defaultSize={showPreview && previewVisible ? 70 : 100}
            minSize={showPreview && previewVisible ? 40 : 100}
            maxSize={showPreview && previewVisible ? 85 : 100}
          >
            <div
              className={cn(
                'h-full flex',
                mode === 'split' && 'divide-x divide-default'
              )}
            >
              {/* Visual Mode */}
              {(mode === 'visual' || mode === 'split') && (
                <div
                  className={cn(
                    'flex-1 min-w-0 p-4',
                    mode === 'split' && 'w-1/2'
                  )}
                >
                  <VisualMode lookupOptions={lookupOptions} />
                </div>
              )}

              {/* Code Mode */}
              {(mode === 'code' || mode === 'split') && (
                <div
                  className={cn(
                    'flex-1 min-w-0 overflow-hidden',
                    mode === 'split' && 'w-1/2'
                  )}
                >
                  <CodeMode />
                </div>
              )}
            </div>
          </ResizablePanel>

          {/* Resizable Handle & Schema Summary Panel */}
          {showPreview && previewVisible && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={30} minSize={15} maxSize={50}>
                <div className="h-full border-l border-default bg-muted-bg overflow-hidden">
                  <SchemaSummary schema={schema} validationErrors={validationErrors} />
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>

      {/* Command Palette */}
      <CommandPalette
        open={isCommandPaletteOpen}
        onOpenChange={(open) => (open ? openCommandPalette() : closeCommandPalette())}
      />
    </div>
  )
}

// =============================================================================
// MAIN EXPORT (wraps with provider)
// =============================================================================

export function SchemaStudio({
  initialSchema,
  onChange,
  onSave,
  defaultMode = 'visual',
  autoSave = false,
  autoSaveDebounce = 2000,
  showPreview = true,
  fieldTemplates,
  lookupOptions,
  className,
}: SchemaStudioProps) {
  return (
    <SchemaStudioProvider
      initialSchema={initialSchema}
      onChange={onChange}
      onSave={onSave}
      defaultMode={defaultMode}
      autoSave={autoSave}
      showPreview={showPreview}
    >
      <div className={cn('h-[600px]', className)}>
        <SchemaStudioInner lookupOptions={lookupOptions} onSave={onSave} />
      </div>
    </SchemaStudioProvider>
  )
}

export default SchemaStudio
