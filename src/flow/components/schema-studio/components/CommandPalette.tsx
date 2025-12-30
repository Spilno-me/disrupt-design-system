/**
 * CommandPalette - Quick action search dialog (⌘K)
 *
 * Provides keyboard-accessible commands for schema operations,
 * navigation, and settings.
 */

import * as React from 'react'
import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import {
  Command,
  Search,
  Plus,
  Layout,
  Code2,
  Columns,
  Undo2,
  Redo2,
  Save,
  Download,
  Upload,
  Braces,
  Eye,
  EyeOff,
  Type,
  Hash,
  ToggleLeft,
  Calendar,
  List,
  FileText,
  Trash2,
  Copy,
  Clipboard,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '../../../../components/ui/dialog'
import { Input } from '../../../../components/ui/input'
import { useSchemaStudio } from '../context/SchemaStudioProvider'
import type { SchemaFieldType } from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface CommandItem {
  id: string
  label: string
  description?: string
  icon: React.ElementType
  shortcut?: string
  action: () => void
  group: 'field' | 'mode' | 'history' | 'file' | 'other'
  disabled?: boolean
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const {
    mode,
    setMode,
    fields,
    addField,
    undo,
    redo,
    canUndo,
    canRedo,
    exportJSON,
    importJSON,
    schema,
    openFieldEditor,
    isDirty,
    showPreview,
  } = useSchemaStudio()

  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Reset state when opened
  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      // Focus input after a brief delay for animation
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Helper to create field of type
  const createFieldOfType = useCallback(
    (type: SchemaFieldType, widget?: string) => {
      const baseName = type === 'string' ? 'text' : type
      let fieldName = `new_${baseName}_field`
      let counter = 1
      while (fields.some((f) => f.key === fieldName)) {
        fieldName = `new_${baseName}_field_${counter++}`
      }

      addField(fieldName, {
        type,
        title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
        ...(widget && { 'ui:widget': widget as any }),
      })
      openFieldEditor(fieldName)
    },
    [fields, addField, openFieldEditor]
  )

  // Build command list
  const commands = useMemo<CommandItem[]>(() => {
    const items: CommandItem[] = [
      // Field commands
      {
        id: 'add-text',
        label: 'Add Text Field',
        description: 'Create a new text input field',
        icon: Type,
        action: () => createFieldOfType('string'),
        group: 'field',
      },
      {
        id: 'add-textarea',
        label: 'Add Text Area',
        description: 'Create a multi-line text field',
        icon: FileText,
        action: () => createFieldOfType('string', 'textarea'),
        group: 'field',
      },
      {
        id: 'add-number',
        label: 'Add Number Field',
        description: 'Create a numeric input field',
        icon: Hash,
        action: () => createFieldOfType('number'),
        group: 'field',
      },
      {
        id: 'add-boolean',
        label: 'Add Checkbox',
        description: 'Create a yes/no checkbox field',
        icon: ToggleLeft,
        action: () => createFieldOfType('boolean'),
        group: 'field',
      },
      {
        id: 'add-date',
        label: 'Add Date Field',
        description: 'Create a date picker field',
        icon: Calendar,
        action: () => createFieldOfType('string', 'date'),
        group: 'field',
      },
      {
        id: 'add-select',
        label: 'Add Dropdown',
        description: 'Create a select/dropdown field',
        icon: List,
        action: () => createFieldOfType('string', 'select'),
        group: 'field',
      },

      // Mode commands
      {
        id: 'mode-visual',
        label: 'Visual Mode',
        description: 'Switch to visual editor',
        icon: Layout,
        action: () => setMode('visual'),
        group: 'mode',
        disabled: mode === 'visual',
      },
      {
        id: 'mode-code',
        label: 'Code Mode',
        description: 'Switch to JSON editor',
        icon: Code2,
        action: () => setMode('code'),
        group: 'mode',
        disabled: mode === 'code',
      },
      {
        id: 'mode-split',
        label: 'Split Mode',
        description: 'Show both visual and code editors',
        icon: Columns,
        action: () => setMode('split'),
        group: 'mode',
        disabled: mode === 'split',
      },

      // History commands
      {
        id: 'undo',
        label: 'Undo',
        description: 'Undo last change',
        icon: Undo2,
        shortcut: '⌘Z',
        action: undo,
        group: 'history',
        disabled: !canUndo,
      },
      {
        id: 'redo',
        label: 'Redo',
        description: 'Redo last undone change',
        icon: Redo2,
        shortcut: '⌘⇧Z',
        action: redo,
        group: 'history',
        disabled: !canRedo,
      },

      // File commands
      {
        id: 'copy-json',
        label: 'Copy Schema JSON',
        description: 'Copy schema to clipboard',
        icon: Copy,
        action: async () => {
          await navigator.clipboard.writeText(exportJSON())
        },
        group: 'file',
      },
      {
        id: 'paste-json',
        label: 'Paste Schema JSON',
        description: 'Replace schema from clipboard',
        icon: Clipboard,
        action: async () => {
          const text = await navigator.clipboard.readText()
          importJSON(text)
        },
        group: 'file',
      },
      {
        id: 'download-json',
        label: 'Download Schema',
        description: 'Save schema as JSON file',
        icon: Download,
        action: () => {
          const blob = new Blob([exportJSON()], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${schema.title?.toLowerCase().replace(/\s+/g, '-') || 'schema'}.json`
          a.click()
          URL.revokeObjectURL(url)
        },
        group: 'file',
      },
      {
        id: 'format-json',
        label: 'Format JSON',
        description: 'Pretty-print the JSON',
        icon: Braces,
        action: () => {
          // Re-import with formatting
          const json = exportJSON()
          importJSON(json)
        },
        group: 'file',
      },
    ]

    return items
  }, [
    mode,
    setMode,
    createFieldOfType,
    undo,
    redo,
    canUndo,
    canRedo,
    exportJSON,
    importJSON,
    schema.title,
  ])

  // Filter commands by query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands

    const q = query.toLowerCase()
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.description?.toLowerCase().includes(q)
    )
  }, [commands, query])

  // Group filtered commands
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {
      field: [],
      mode: [],
      history: [],
      file: [],
      other: [],
    }

    filteredCommands.forEach((cmd) => {
      groups[cmd.group].push(cmd)
    })

    return groups
  }, [filteredCommands])

  // Group labels
  const groupLabels: Record<string, string> = {
    field: 'Add Field',
    mode: 'Editor Mode',
    history: 'History',
    file: 'File',
    other: 'Other',
  }

  // Handle selection
  const handleSelect = useCallback(
    (command: CommandItem) => {
      if (command.disabled) return
      command.action()
      onOpenChange(false)
    },
    [onOpenChange]
  )

  // Keyboard navigation
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const command = filteredCommands[selectedIndex]
        if (command) handleSelect(command)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, filteredCommands, selectedIndex, handleSelect])

  // Keep selection in view
  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const selected = list.querySelector('[data-selected="true"]')
    if (selected) {
      selected.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Calculate flat index for selection
  let flatIndex = -1

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-lg overflow-hidden">
        <DialogTitle className="sr-only">Command Palette</DialogTitle>

        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-default">
          <Search className="size-4 text-tertiary" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="border-0 p-0 h-auto text-sm focus-visible:ring-0 shadow-none"
          />
          <kbd className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-medium text-tertiary bg-muted-bg rounded">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-sm text-secondary">
              No commands found for "{query}"
            </div>
          ) : (
            Object.entries(groupedCommands).map(([group, items]) => {
              if (items.length === 0) return null

              return (
                <div key={group} className="mb-2 last:mb-0">
                  <div className="px-2 py-1 text-xs font-medium text-tertiary">
                    {groupLabels[group]}
                  </div>
                  {items.map((command) => {
                    flatIndex++
                    const isSelected = flatIndex === selectedIndex
                    const Icon = command.icon

                    return (
                      <button
                        key={command.id}
                        data-selected={isSelected}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-lg',
                          'text-left text-sm transition-colors',
                          isSelected && 'bg-accent/10 text-accent',
                          !isSelected && 'hover:bg-muted-bg',
                          command.disabled && 'opacity-50 cursor-not-allowed'
                        )}
                        onClick={() => handleSelect(command)}
                        disabled={command.disabled}
                      >
                        <Icon className="size-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{command.label}</div>
                          {command.description && (
                            <div className="text-xs text-tertiary truncate">
                              {command.description}
                            </div>
                          )}
                        </div>
                        {command.shortcut && (
                          <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-tertiary bg-muted-bg rounded">
                            {command.shortcut}
                          </kbd>
                        )}
                      </button>
                    )
                  })}
                </div>
              )
            })
          )}
        </div>

        {/* Footer Hint */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-default text-xs text-tertiary bg-muted-bg/30">
          <span>
            <kbd className="px-1 bg-muted-bg rounded">↑↓</kbd> navigate
          </span>
          <span>
            <kbd className="px-1 bg-muted-bg rounded">↵</kbd> select
          </span>
          <span>
            <kbd className="px-1 bg-muted-bg rounded">esc</kbd> close
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommandPalette
