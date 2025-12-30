/**
 * MappingStudio - Visual mapping editor
 *
 * Replaces JSON editing with a user-friendly interface for creating
 * field-to-field mappings between source and target schemas.
 *
 * Three modes:
 * - Form: Row-based editor for quick 1:1 mappings
 * - Code: JSON editor for advanced users
 * - Visual: Drag-drop builder (future)
 */

import * as React from 'react'
import {
  Code2,
  FormInput,
  GitBranch,
  Undo2,
  Redo2,
  Save,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from '../../../components/ui/tooltip'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '../../../components/ui/toggle-group'
import {
  MappingStudioProvider,
  useMappingStudio,
} from './context/MappingStudioProvider'
import { FormMode } from './modes/FormMode'
import { CodeMode } from './modes/CodeMode'
import type { MappingStudioProps, MappingEditorMode } from './types'

// =============================================================================
// MODE TOGGLE
// =============================================================================

function ModeToggle() {
  const { mode, setMode, readOnly } = useMappingStudio()

  return (
    <ToggleGroup
      type="single"
      value={mode}
      onValueChange={(value: string) => value && setMode(value as MappingEditorMode)}
      size="sm"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem value="form" aria-label="Form mode">
            <FormInput className="size-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Form Mode - Row-based editor</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem value="code" aria-label="Code mode">
            <Code2 className="size-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Code Mode - JSON editor</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem value="visual" aria-label="Visual mode" disabled>
            <GitBranch className="size-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Visual Mode - Drag &amp; drop (coming soon)</TooltipContent>
      </Tooltip>
    </ToggleGroup>
  )
}

// =============================================================================
// TOOLBAR
// =============================================================================

function StudioToolbar() {
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    save,
    validate,
    isDirty,
    isSaving,
    readOnly,
    validationErrors,
    config,
    sourceSchema,
    targetSchema,
  } = useMappingStudio()

  const errorCount = validationErrors.filter((e) => e.severity === 'error').length
  const warningCount = validationErrors.filter((e) => e.severity === 'warning').length

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-default bg-surface">
      {/* Left: Title and Status */}
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-sm font-semibold text-primary">
            {config.name || 'Mapping Editor'}
          </h2>
          <p className="text-xs text-secondary">
            {sourceSchema.name} → {targetSchema.name}
          </p>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2">
          {isDirty && (
            <Badge variant="warning" size="sm">
              Unsaved
            </Badge>
          )}
          {errorCount > 0 && (
            <Badge variant="destructive" size="sm" className="gap-1">
              <AlertTriangle className="size-3" />
              {errorCount} error{errorCount !== 1 ? 's' : ''}
            </Badge>
          )}
          {warningCount > 0 && errorCount === 0 && (
            <Badge variant="warning" size="sm" className="gap-1">
              <AlertTriangle className="size-3" />
              {warningCount} warning{warningCount !== 1 ? 's' : ''}
            </Badge>
          )}
          {errorCount === 0 && warningCount === 0 && config.mappings.length > 0 && (
            <Badge variant="success" size="sm" className="gap-1">
              <CheckCircle2 className="size-3" />
              Valid
            </Badge>
          )}
        </div>
      </div>

      {/* Center: Mode Toggle */}
      <ModeToggle />

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        {!readOnly && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={undo}
                  disabled={!canUndo}
                  className="size-8 p-0"
                >
                  <Undo2 className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (⌘Z)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={redo}
                  disabled={!canRedo}
                  className="size-8 p-0"
                >
                  <Redo2 className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (⌘⇧Z)</TooltipContent>
            </Tooltip>

            <div className="w-px h-6 bg-default" />
          </>
        )}

        {/* Validate */}
        <Button variant="secondary" size="sm" onClick={validate}>
          Validate
        </Button>

        {/* Save */}
        {!readOnly && (
          <Button
            size="sm"
            onClick={save}
            disabled={!isDirty || isSaving}
            className="gap-2"
          >
            <Save className="size-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// CONTENT
// =============================================================================

function StudioContent() {
  const { mode } = useMappingStudio()

  return (
    <div className="flex-1 overflow-hidden">
      {mode === 'form' && <FormMode className="h-full" />}
      {mode === 'code' && <CodeMode className="h-full" />}
      {mode === 'visual' && (
        <div className="h-full flex items-center justify-center text-secondary">
          <div className="text-center">
            <GitBranch className="size-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Visual Mode</h3>
            <p className="text-sm">Drag-and-drop mapping builder coming soon</p>
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// INNER COMPONENT (uses context)
// =============================================================================

function MappingStudioInner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col h-full bg-surface border border-default rounded-lg overflow-hidden',
        className
      )}
    >
      <StudioToolbar />
      <StudioContent />
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function MappingStudio({
  initialConfig,
  sourceSchema,
  targetSchema,
  onChange,
  onSave,
  defaultMode = 'form',
  autoSave = false,
  autoSaveDebounce = 2000,
  showPreview = false,
  readOnly = false,
  className,
}: MappingStudioProps) {
  return (
    <TooltipProvider>
      <MappingStudioProvider
        initialConfig={initialConfig}
        sourceSchema={sourceSchema}
        targetSchema={targetSchema}
        onChange={onChange}
        onSave={onSave}
        defaultMode={defaultMode}
        autoSave={autoSave}
        autoSaveDebounce={autoSaveDebounce}
        showPreview={showPreview}
        readOnly={readOnly}
      >
        <MappingStudioInner className={className} />
      </MappingStudioProvider>
    </TooltipProvider>
  )
}

MappingStudio.displayName = 'MappingStudio'

export default MappingStudio
