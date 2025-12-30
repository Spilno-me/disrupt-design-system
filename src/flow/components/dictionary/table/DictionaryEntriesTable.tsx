/**
 * DictionaryEntriesTable - Right panel with entries table
 *
 * Displays dictionary entries for selected category with search, filters,
 * and CRUD actions.
 */

import * as React from 'react'
import {
  Upload,
  Download,
  Edit2,
  Trash2,
  GripVertical,
  Copy,
  Check,
  Plus,
  Search,
  Database,
  X,
  CheckSquare,
  Files,
  FileJson,
  FileSpreadsheet,
  FileText,
  ChevronDown,
  ChevronRight,
  List,
  Network,
  GitBranch,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Textarea } from '../../../../components/ui/textarea'
import { SearchFilter, type FilterGroup, type FilterState } from '../../../../components/shared/SearchFilter'
import { Badge } from '../../../../components/ui/badge'
import { Pagination } from '../../../../components/ui/Pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../components/ui/dropdown-menu'
import { Switch } from '../../../../components/ui/switch'
import { Checkbox } from '../../../../components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'
import { ActionTile } from '../../../../components/ui/ActionTile'
import { DictionaryEntryCard } from '../mobile/DictionaryEntryCard'
import { UndoToast } from '../UndoToast'
import type {
  DictionaryCategory,
  DictionaryEntry,
  EntryViewMode,
} from '../types'
import {
  buildEntryTree,
  flattenEntries,
  getEntryDepth,
  countEntryDescendants,
  BASE_INDENT,
  INDENT_PER_LEVEL,
  MAX_ENTRY_DEPTH,
} from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface DictionaryEntriesTableProps {
  category: DictionaryCategory | null
  entries: DictionaryEntry[]
  isLoading?: boolean
  onEntryCreate?: () => void
  onEntryEdit?: (entry: DictionaryEntry) => void
  onEntryDelete?: (entry: DictionaryEntry) => void
  /** Called to duplicate an entry (opens create dialog pre-filled) */
  onEntryDuplicate?: (entry: DictionaryEntry) => void
  /** Called when entry status is toggled. Enables quick active/inactive switching. */
  onEntryStatusChange?: (entryId: string, status: 'active' | 'inactive') => void
  /** Called when entries are reordered via drag-drop. Receives array of {id, order} with new orders. */
  onEntriesReorder?: (reorderedEntries: Array<{ id: string; order: number }>) => void
  onImport?: () => void
  /** Export callback with format selection. If only onExport is provided, shows single button. */
  onExport?: () => void
  /** Export to CSV format */
  onExportCSV?: () => void
  /** Export to JSON format */
  onExportJSON?: () => void
  /** Export to Excel format */
  onExportExcel?: () => void
  /** Called for bulk status change on selected entries */
  onBulkStatusChange?: (entryIds: string[], status: 'active' | 'inactive') => void
  /** Called for bulk delete on selected entries */
  onBulkDelete?: (entryIds: string[]) => void
  className?: string
  /** View mode: table (flat) or tree (hierarchical) */
  viewMode?: EntryViewMode
  /** Called when view mode changes */
  onViewModeChange?: (mode: EntryViewMode) => void
}

// =============================================================================
// STATUS CONFIG
// =============================================================================

const STATUS_CONFIG: Record<
  'active' | 'inactive',
  { label: string; variant: 'success' | 'secondary' }
> = {
  active: { label: 'Active', variant: 'success' },
  inactive: { label: 'Inactive', variant: 'secondary' },
}

/** Filter groups for SearchFilter - status filter */
const ENTRY_FILTER_GROUPS: FilterGroup[] = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { id: 'active', label: 'Active' },
      { id: 'inactive', label: 'Inactive' },
    ],
  },
]

// =============================================================================
// SEARCH HIGHLIGHT UTILITY
// =============================================================================

/**
 * Escape special regex characters in a string
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Highlight matching text in a string
 */
function highlightMatch(text: string, search: string): React.ReactNode {
  if (!search.trim() || !text) return text

  const regex = new RegExp(`(${escapeRegExp(search)})`, 'gi')
  const parts = text.split(regex)

  if (parts.length === 1) return text

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-warning/30 text-primary rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DictionaryEntriesTable({
  category,
  entries,
  isLoading = false,
  onEntryCreate,
  onEntryEdit,
  onEntryDelete,
  onEntryDuplicate,
  onEntryStatusChange,
  onEntriesReorder,
  onImport,
  onExport,
  onExportCSV,
  onExportJSON,
  onExportExcel,
  onBulkStatusChange,
  onBulkDelete,
  className,
  viewMode = 'table',
  onViewModeChange,
}: DictionaryEntriesTableProps) {
  // Determine if we have format-specific export options
  const hasExportFormats = Boolean(onExportCSV || onExportJSON || onExportExcel)
  // Initialize state from URL params for persistence
  const getInitialStateFromUrl = React.useCallback(() => {
    if (typeof window === 'undefined') return { search: '', status: [] as string[], page: 1 }
    const params = new URLSearchParams(window.location.search)
    return {
      search: params.get('q') || '',
      status: params.get('status')?.split(',').filter(Boolean) || [],
      page: parseInt(params.get('page') || '1', 10) || 1,
    }
  }, [])

  const initialState = React.useMemo(() => getInitialStateFromUrl(), [getInitialStateFromUrl])

  const [searchQuery, setSearchQuery] = React.useState(initialState.search)
  const [filters, setFilters] = React.useState<FilterState>(
    initialState.status.length > 0 ? { status: initialState.status } : {}
  )
  const [currentPage, setCurrentPage] = React.useState(initialState.page)
  const [pageSize, setPageSize] = React.useState(50)

  // Update URL when filters change (debounced to avoid excessive updates)
  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(window.location.search)

      // Update or remove search param
      if (searchQuery) {
        params.set('q', searchQuery)
      } else {
        params.delete('q')
      }

      // Update or remove status param
      const statusFilter = filters.status || []
      if (statusFilter.length > 0) {
        params.set('status', statusFilter.join(','))
      } else {
        params.delete('status')
      }

      // Update or remove page param (only if not page 1)
      if (currentPage > 1) {
        params.set('page', String(currentPage))
      } else {
        params.delete('page')
      }

      // Update URL without page reload
      const newUrl = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, filters, currentPage])

  // Keyboard navigation state
  const [focusedRowIndex, setFocusedRowIndex] = React.useState<number | null>(null)
  const tableContainerRef = React.useRef<HTMLDivElement>(null)

  // Bulk selection state
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const hasBulkActions = Boolean(onBulkStatusChange || onBulkDelete)
  const hasSelection = selectedIds.size > 0

  // Inline editing state
  const [inlineEditId, setInlineEditId] = React.useState<string | null>(null)
  const [inlineEditField, setInlineEditField] = React.useState<'value' | 'description' | null>(null)
  const [inlineEditValue, setInlineEditValue] = React.useState('')
  const inlineInputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  // Copy feedback state - tracks which entry code was just copied
  const [copiedEntryId, setCopiedEntryId] = React.useState<string | null>(null)

  // Undo deletion state - tracks entry pending deletion for grace period
  const [pendingDeletion, setPendingDeletion] = React.useState<DictionaryEntry | null>(null)

  // Tree view state - expanded entry IDs
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(() => new Set())

  // Build tree structure from flat entries
  const treeEntries = React.useMemo(() => buildEntryTree(entries), [entries])

  // Toggle expand/collapse for tree view
  const toggleExpand = React.useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  // Flatten tree entries with depth info for rendering (respects expanded state)
  const flattenedTreeEntries = React.useMemo(() => {
    if (viewMode !== 'tree') return []

    const result: Array<{ entry: DictionaryEntry; depth: number }> = []

    const traverse = (entries: DictionaryEntry[], depth: number) => {
      for (const entry of entries) {
        result.push({ entry, depth })
        if (entry.children?.length && expandedIds.has(entry.id)) {
          traverse(entry.children, depth + 1)
        }
      }
    }

    traverse(treeEntries, 0)
    return result
  }, [viewMode, treeEntries, expandedIds])

  // Copy code to clipboard
  const handleCopyCode = React.useCallback(async (entry: DictionaryEntry) => {
    try {
      await navigator.clipboard.writeText(entry.code)
      setCopiedEntryId(entry.id)
      // Reset after 2 seconds
      setTimeout(() => setCopiedEntryId(null), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }, [])

  // Drag-and-drop state
  const [draggedEntryId, setDraggedEntryId] = React.useState<string | null>(null)
  const [dragOverEntryId, setDragOverEntryId] = React.useState<string | null>(null)

  // Internal order state for immediate UI feedback
  const [orderedIds, setOrderedIds] = React.useState<string[]>(() =>
    [...entries].sort((a, b) => a.order - b.order).map((e) => e.id)
  )

  // Sync orderedIds when entries prop changes
  React.useEffect(() => {
    const entryIds = new Set(entries.map((e) => e.id))
    const currentIds = new Set(orderedIds)

    const hasChanges =
      entries.length !== orderedIds.length ||
      entries.some((e) => !currentIds.has(e.id))

    if (hasChanges) {
      // Preserve existing order, add new items sorted by their order prop
      const existingOrder = orderedIds.filter((id) => entryIds.has(id))
      const newEntries = entries
        .filter((e) => !currentIds.has(e.id))
        .sort((a, b) => a.order - b.order)
        .map((e) => e.id)
      setOrderedIds([...existingOrder, ...newEntries])
    }
  }, [entries, orderedIds])

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filters, category?.id])

  // Clear selection when category changes
  React.useEffect(() => {
    setSelectedIds(new Set())
  }, [category?.id])

  // Sort entries by internal order
  const orderedEntries = React.useMemo(() => {
    const entryMap = new Map(entries.map((e) => [e.id, e]))
    return orderedIds
      .map((id) => entryMap.get(id))
      .filter((e): e is DictionaryEntry => e !== undefined)
  }, [entries, orderedIds])

  // Extract status filter from filters state
  const statusFilter = filters.status || []
  const hasStatusFilter = statusFilter.length > 0

  // Filter entries
  const filteredEntries = React.useMemo(() => {
    let result = [...orderedEntries]

    // Search filter
    if (searchQuery.trim()) {
      const search = searchQuery.toLowerCase()
      result = result.filter(
        (entry) =>
          entry.code.toLowerCase().includes(search) ||
          entry.value.toLowerCase().includes(search) ||
          entry.description?.toLowerCase().includes(search)
      )
    }

    // Status filter - empty array means "all"
    if (hasStatusFilter) {
      result = result.filter((entry) => statusFilter.includes(entry.status))
    }

    return result
  }, [orderedEntries, searchQuery, statusFilter, hasStatusFilter])

  // Paginate
  const paginatedEntries = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredEntries.slice(start, start + pageSize)
  }, [filteredEntries, currentPage, pageSize])

  // Selection handlers
  const toggleSelectAll = React.useCallback(() => {
    if (selectedIds.size === filteredEntries.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredEntries.map((e) => e.id)))
    }
  }, [filteredEntries, selectedIds.size])

  const toggleSelectEntry = React.useCallback((entryId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(entryId)) {
        next.delete(entryId)
      } else {
        next.add(entryId)
      }
      return next
    })
  }, [])

  const clearSelection = React.useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  // Inline editing handlers
  const startInlineEdit = React.useCallback((entry: DictionaryEntry, field: 'value' | 'description') => {
    if (!onEntryEdit) return // Only enable if editing is possible
    setInlineEditId(entry.id)
    setInlineEditField(field)
    setInlineEditValue(field === 'value' ? entry.value : entry.description || '')
    // Focus input after render
    setTimeout(() => inlineInputRef.current?.focus(), 0)
  }, [onEntryEdit])

  const cancelInlineEdit = React.useCallback(() => {
    setInlineEditId(null)
    setInlineEditField(null)
    setInlineEditValue('')
  }, [])

  const saveInlineEdit = React.useCallback(async (entry: DictionaryEntry) => {
    if (!onEntryEdit || !inlineEditField) return

    const trimmedValue = inlineEditValue.trim()

    // Validate value field
    if (inlineEditField === 'value' && !trimmedValue) {
      cancelInlineEdit()
      return
    }

    // Only save if changed
    const originalValue = inlineEditField === 'value' ? entry.value : entry.description || ''
    if (trimmedValue === originalValue) {
      cancelInlineEdit()
      return
    }

    // Call the edit handler with updated entry
    onEntryEdit({
      ...entry,
      [inlineEditField]: inlineEditField === 'description' ? (trimmedValue || undefined) : trimmedValue,
    } as DictionaryEntry)

    cancelInlineEdit()
  }, [onEntryEdit, inlineEditField, inlineEditValue, cancelInlineEdit])

  // Drag-and-drop handlers
  const handleDragStart = React.useCallback((entryId: string) => {
    setDraggedEntryId(entryId)
  }, [])

  const handleDragOver = React.useCallback((e: React.DragEvent, entryId: string) => {
    e.preventDefault()
    if (draggedEntryId && draggedEntryId !== entryId) {
      setDragOverEntryId(entryId)
    }
  }, [draggedEntryId])

  const handleDragLeave = React.useCallback(() => {
    setDragOverEntryId(null)
  }, [])

  const handleDrop = React.useCallback((e: React.DragEvent, targetEntryId: string) => {
    e.preventDefault()

    if (!draggedEntryId || draggedEntryId === targetEntryId) {
      setDraggedEntryId(null)
      setDragOverEntryId(null)
      return
    }

    // Work with internal orderedIds for immediate UI update
    const currentOrder = [...orderedIds]
    const draggedIndex = currentOrder.indexOf(draggedEntryId)
    const targetIndex = currentOrder.indexOf(targetEntryId)

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedEntryId(null)
      setDragOverEntryId(null)
      return
    }

    // Remove dragged item and insert at target position
    currentOrder.splice(draggedIndex, 1)
    currentOrder.splice(targetIndex, 0, draggedEntryId)

    // Update internal state immediately for responsive UI
    setOrderedIds(currentOrder)

    // Notify parent with new order values (1-based)
    if (onEntriesReorder) {
      const reorderedEntries = currentOrder.map((id, index) => ({
        id,
        order: index + 1,
      }))
      onEntriesReorder(reorderedEntries)
    }

    setDraggedEntryId(null)
    setDragOverEntryId(null)
  }, [draggedEntryId, orderedIds, onEntriesReorder])

  const handleDragEnd = React.useCallback(() => {
    setDraggedEntryId(null)
    setDragOverEntryId(null)
  }, [])

  // Undo deletion handlers - intercepts delete to add grace period
  const handleDeleteWithUndo = React.useCallback((entry: DictionaryEntry) => {
    // Start pending deletion - actual delete happens after countdown
    setPendingDeletion(entry)
  }, [])

  const handleUndoDeletion = React.useCallback(() => {
    // User clicked Undo - cancel the pending deletion
    setPendingDeletion(null)
  }, [])

  const handleConfirmDeletion = React.useCallback(() => {
    // Countdown completed - execute actual deletion
    if (pendingDeletion && onEntryDelete) {
      onEntryDelete(pendingDeletion)
    }
    setPendingDeletion(null)
  }, [pendingDeletion, onEntryDelete])

  // Keyboard navigation handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts when typing in inputs (unless it's Escape)
      const isTyping = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)
      const isModifier = e.ctrlKey || e.metaKey

      // Escape: Cancel inline edit, clear selection, or clear search
      if (e.key === 'Escape') {
        if (inlineEditId) {
          cancelInlineEdit()
          e.preventDefault()
          return
        }
        if (hasSelection) {
          clearSelection()
          e.preventDefault()
          return
        }
        if (searchQuery) {
          setSearchQuery('')
          e.preventDefault()
          return
        }
        setFocusedRowIndex(null)
        return
      }

      // Skip other shortcuts when typing
      if (isTyping && e.key !== 'Escape') return

      // Ctrl/Cmd + N: Create new entry
      if (isModifier && e.key === 'n' && onEntryCreate) {
        e.preventDefault()
        onEntryCreate()
        return
      }

      // Ctrl/Cmd + F: Focus search
      if (isModifier && e.key === 'f') {
        e.preventDefault()
        // Find the search input within the table container
        const searchInput = tableContainerRef.current?.querySelector('input[type="text"], input[type="search"]') as HTMLInputElement
        searchInput?.focus()
        return
      }

      // Ctrl/Cmd + A: Select all
      if (isModifier && e.key === 'a' && hasBulkActions && filteredEntries.length > 0) {
        e.preventDefault()
        setSelectedIds(new Set(filteredEntries.map((e) => e.id)))
        return
      }

      // Delete/Backspace: Delete selected entries
      if ((e.key === 'Delete' || e.key === 'Backspace') && hasSelection && onBulkDelete) {
        e.preventDefault()
        onBulkDelete(Array.from(selectedIds))
        clearSelection()
        return
      }

      // Arrow keys: Navigate rows
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const maxIndex = paginatedEntries.length - 1

        if (focusedRowIndex === null) {
          setFocusedRowIndex(e.key === 'ArrowDown' ? 0 : maxIndex)
        } else {
          const newIndex = e.key === 'ArrowDown'
            ? Math.min(focusedRowIndex + 1, maxIndex)
            : Math.max(focusedRowIndex - 1, 0)
          setFocusedRowIndex(newIndex)
        }
        return
      }

      // Space: Toggle selection on focused row
      if (e.key === ' ' && focusedRowIndex !== null && hasBulkActions) {
        e.preventDefault()
        const entry = paginatedEntries[focusedRowIndex]
        if (entry) {
          toggleSelectEntry(entry.id)
        }
        return
      }

      // Enter: Edit focused row
      if (e.key === 'Enter' && focusedRowIndex !== null && onEntryEdit) {
        e.preventDefault()
        const entry = paginatedEntries[focusedRowIndex]
        if (entry) {
          onEntryEdit(entry)
        }
        return
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [
    inlineEditId,
    cancelInlineEdit,
    hasSelection,
    clearSelection,
    searchQuery,
    onEntryCreate,
    hasBulkActions,
    filteredEntries,
    selectedIds,
    onBulkDelete,
    paginatedEntries,
    focusedRowIndex,
    toggleSelectEntry,
    onEntryEdit,
  ])

  // Reset focused row when data changes
  React.useEffect(() => {
    setFocusedRowIndex(null)
  }, [category?.id, currentPage, searchQuery])

  // No category selected
  if (!category) {
    return (
      <div
        data-slot="dictionary-entries-table"
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border border-dashed border-default bg-surface p-12',
          className
        )}
      >
        <p className="text-sm text-secondary">
          Select a category to view its dictionary entries
        </p>
      </div>
    )
  }

  return (
    <div ref={tableContainerRef}>
    <div
      data-slot="dictionary-entries-table"
      className={cn(
        // Depth 2: Glass card per glass-transparency-model
        // bg-white/40 (light) + bg-black/40 (dark) + blur-[4px] + accent border
        'flex flex-col rounded-xl',
        'bg-white/40 dark:bg-black/40 backdrop-blur-[4px]',
        'border-2 border-accent shadow-md',
        'gap-4 p-4',
        className
      )}
    >
      {/* Category Title + Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-primary">{category.name}</h2>

        {/* View Mode Toggle + Import/Export Actions */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle - only show if hierarchy exists */}
          {entries.some(e => e.parentId !== null || e.children?.length) && onViewModeChange && (
            <div className="flex items-center rounded-lg border border-default p-0.5">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === 'table' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => onViewModeChange('table')}
                      className="h-7 px-2"
                    >
                      <List className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Table view</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === 'tree' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => onViewModeChange('tree')}
                      className="h-7 px-2"
                    >
                      <Network className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Tree view</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          {onImport && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={onImport} className="gap-2">
                    <Upload className="size-4" />
                    <span className="hidden sm:inline">Import</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Import entries</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {/* Export - dropdown if format options available, simple button otherwise */}
          {hasExportFormats ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="size-4" />
                  <span className="hidden sm:inline">Export</span>
                  <ChevronDown className="size-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {onExportCSV && (
                  <DropdownMenuItem onClick={onExportCSV} className="gap-2">
                    <FileText className="size-4" />
                    Export as CSV
                  </DropdownMenuItem>
                )}
                {onExportJSON && (
                  <DropdownMenuItem onClick={onExportJSON} className="gap-2">
                    <FileJson className="size-4" />
                    Export as JSON
                  </DropdownMenuItem>
                )}
                {onExportExcel && (
                  <DropdownMenuItem onClick={onExportExcel} className="gap-2">
                    <FileSpreadsheet className="size-4" />
                    Export as Excel
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : onExport && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={onExport} className="gap-2">
                    <Download className="size-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export entries</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Search + Filters - integrated into SearchFilter */}
      <SearchFilter
        placeholder={`Search ${category.name.toLowerCase()}...`}
        value={searchQuery}
        onChange={setSearchQuery}
        filterGroups={ENTRY_FILTER_GROUPS}
        filters={filters}
        onFiltersChange={setFilters}
        size="compact"
      />

      {/* Bulk Action Bar - shown when items are selected */}
      {hasBulkActions && hasSelection && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3">
          <div className="flex items-center gap-3">
            <CheckSquare className="size-5 text-accent" />
            <span className="text-sm font-medium text-primary">
              {selectedIds.size} {selectedIds.size === 1 ? 'entry' : 'entries'} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onBulkStatusChange && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onBulkStatusChange(Array.from(selectedIds), 'active')
                    clearSelection()
                  }}
                  className="gap-2"
                >
                  <Check className="size-4" />
                  Activate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onBulkStatusChange(Array.from(selectedIds), 'inactive')
                    clearSelection()
                  }}
                  className="gap-2"
                >
                  Deactivate
                </Button>
              </>
            )}
            {onBulkDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onBulkDelete(Array.from(selectedIds))
                  clearSelection()
                }}
                className="gap-2 text-error hover:text-error hover:border-error"
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="gap-2"
            >
              <X className="size-4" />
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Loading State - Skeleton for better perceived performance */}
      {isLoading && (
        <div className="flex flex-col gap-2">
          {/* Mobile skeleton */}
          <div className="lg:hidden space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-lg border border-default bg-surface p-3 animate-pulse"
              >
                <div className="w-4 h-4 bg-muted-bg rounded mt-1" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 bg-muted-bg rounded w-1/3" />
                    <div className="h-5 bg-muted-bg rounded w-16" />
                  </div>
                  <div className="h-3 bg-muted-bg rounded w-2/3" />
                  <div className="h-4 bg-muted-bg rounded w-24" />
                </div>
              </div>
            ))}
          </div>
          {/* Desktop skeleton */}
          <div className="hidden lg:block overflow-hidden rounded-xl border border-default">
            <div className="bg-surface-hover px-4 py-3 border-b border-default flex gap-4">
              <div className="w-10 h-4 bg-muted-bg rounded" />
              <div className="w-24 h-4 bg-muted-bg rounded" />
              <div className="w-32 h-4 bg-muted-bg rounded" />
              <div className="flex-1 h-4 bg-muted-bg rounded" />
              <div className="w-16 h-4 bg-muted-bg rounded" />
              <div className="w-20 h-4 bg-muted-bg rounded" />
              <div className="w-20 h-4 bg-muted-bg rounded" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-4 py-3 border-b border-default last:border-b-0 animate-pulse"
              >
                <div className="w-6 h-6 bg-muted-bg rounded" />
                <div className="w-32 h-4 bg-muted-bg rounded" />
                <div className="w-40 h-4 bg-muted-bg rounded" />
                <div className="flex-1 h-4 bg-muted-bg rounded" />
                <div className="w-12 h-4 bg-muted-bg rounded" />
                <div className="w-16 h-5 bg-muted-bg rounded-full" />
                <div className="w-16 h-6 bg-muted-bg rounded" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State - actionable with guidance */}
      {!isLoading && paginatedEntries.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-default bg-surface py-12 px-6">
          {searchQuery || hasStatusFilter ? (
            // Filtered empty state
            <>
              <div className="flex size-12 items-center justify-center rounded-full bg-muted-bg mb-4">
                <Search className="size-6 text-tertiary" />
              </div>
              <h3 className="text-base font-medium text-primary mb-1">
                No matching entries
              </h3>
              <p className="text-sm text-secondary text-center mb-4">
                No entries match {searchQuery && `"${searchQuery}"`}
                {searchQuery && hasStatusFilter && ' with '}
                {hasStatusFilter && `status: ${statusFilter.join(', ')}`}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setFilters({})
                }}
              >
                Clear all filters
              </Button>
            </>
          ) : (
            // Initial empty state
            <>
              <div className="flex size-12 items-center justify-center rounded-full bg-accent/10 mb-4">
                <Database className="size-6 text-accent" />
              </div>
              <h3 className="text-base font-medium text-primary mb-1">
                No dictionary entries yet
              </h3>
              <p className="text-sm text-secondary text-center mb-4 max-w-sm">
                Create your first entry for &quot;{category.name}&quot; to start building your lookup values.
              </p>
              {onEntryCreate && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={onEntryCreate}
                  className="gap-2"
                >
                  <Plus className="size-4" />
                  Add First Entry
                </Button>
              )}
            </>
          )}
        </div>
      )}

      {/* Mobile Card View (visible below lg) */}
      {!isLoading && paginatedEntries.length > 0 && (
        <div className="flex flex-col gap-2 lg:hidden">
          {paginatedEntries.map((entry) => (
            <DictionaryEntryCard
              key={entry.id}
              entry={entry}
              onEdit={onEntryEdit}
              onDelete={onEntryDelete ? handleDeleteWithUndo : undefined}
              onDuplicate={onEntryDuplicate}
              onStatusChange={onEntryStatusChange}
              isDraggable={Boolean(onEntriesReorder)}
              isDragging={draggedEntryId === entry.id}
              isDragOver={dragOverEntryId === entry.id}
              onDragStart={() => handleDragStart(entry.id)}
              onDragOver={(e) => handleDragOver(e, entry.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, entry.id)}
              onDragEnd={handleDragEnd}
              className={cn(
                pendingDeletion?.id === entry.id && [
                  'opacity-40 bg-error/5 border-error/30',
                  'line-through decoration-error/50',
                ]
              )}
            />
          ))}
        </div>
      )}

      {/* Desktop Table (visible on lg+) - matches DataTable standard */}
      {!isLoading && paginatedEntries.length > 0 && (
        <div className="hidden lg:block overflow-hidden rounded-xl border border-default shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                className="border-b border-default"
                style={{
                  background: 'linear-gradient(180deg, var(--color-surface) 0%, var(--color-surface) 20%, var(--color-surface-hover) 100%)',
                }}
              >
                <tr className="shadow-[inset_0_-1px_0_0_var(--border)]">
                  {/* Select All Checkbox */}
                  {hasBulkActions && (
                    <th className="w-12 px-3 py-3 text-center border-r border-default">
                      <Checkbox
                        checked={
                          filteredEntries.length > 0 &&
                          selectedIds.size === filteredEntries.length
                        }
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all entries"
                      />
                    </th>
                  )}
                  <th className="w-10 px-3 py-3 text-left text-sm font-medium text-secondary border-r border-default" />
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary whitespace-nowrap border-r border-default">
                    Value
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary whitespace-nowrap border-r border-default">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary whitespace-nowrap border-r border-default">
                    Description
                  </th>
                  <th className="w-20 px-4 py-3 text-center text-sm font-medium text-secondary whitespace-nowrap border-r border-default">
                    Order
                  </th>
                  <th className="w-24 px-4 py-3 text-center text-sm font-medium text-secondary whitespace-nowrap border-r border-default">
                    Status
                  </th>
                  <th className="w-20 px-4 py-3 text-center text-sm font-medium text-secondary whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-surface divide-y divide-default">
                {/* Render either flat table or hierarchical tree */}
                {(viewMode === 'tree' ? flattenedTreeEntries : paginatedEntries.map(e => ({ entry: e, depth: 0 }))).map(({ entry, depth }, index) => {
                  const hasChildren = Boolean(entry.children?.length)
                  const isExpanded = expandedIds.has(entry.id)
                  const childCount = hasChildren ? countEntryDescendants(entry) + (entry.children?.length || 0) : 0
                  const indentPx = viewMode === 'tree' ? BASE_INDENT + Math.min(depth, MAX_ENTRY_DEPTH - 1) * INDENT_PER_LEVEL : 0

                  return (
                  <tr
                    key={entry.id}
                    draggable={Boolean(onEntriesReorder) && viewMode === 'table'}
                    onDragStart={() => viewMode === 'table' && handleDragStart(entry.id)}
                    onDragOver={(e) => viewMode === 'table' && handleDragOver(e, entry.id)}
                    onDragLeave={viewMode === 'table' ? handleDragLeave : undefined}
                    onDrop={(e) => viewMode === 'table' && handleDrop(e, entry.id)}
                    onDragEnd={viewMode === 'table' ? handleDragEnd : undefined}
                    className={cn(
                      'group transition-all duration-200 relative',
                      // Pending deletion: faded with error tint
                      pendingDeletion?.id === entry.id && [
                        'opacity-40 bg-error/5',
                        '[&_*]:line-through [&_*]:decoration-error/50',
                      ],
                      // Focused row (keyboard navigation)
                      focusedRowIndex === index && !pendingDeletion && [
                        'bg-accent/10',
                        'ring-2 ring-accent ring-inset',
                      ],
                      // Dragged item: subtle ghost effect
                      draggedEntryId === entry.id && [
                        'opacity-30',
                        'bg-accent/5',
                        'outline-2 outline-dashed outline-accent/40 outline-offset-[-2px]',
                      ],
                      // Drop target: enhanced insertion indicator
                      dragOverEntryId === entry.id && [
                        'bg-accent/5',
                        // Top insertion bar - animated glow effect
                        'before:absolute before:inset-x-0 before:-top-[2px] before:h-1 before:bg-gradient-to-r before:from-transparent before:via-accent before:to-transparent before:rounded-full before:shadow-[0_0_8px_var(--color-accent)]',
                        // Left circle indicator - larger and more visible
                        'after:absolute after:left-0 after:-top-[2px] after:-translate-y-1/2 after:size-3 after:rounded-full after:bg-accent after:border-2 after:border-surface after:shadow-[0_0_6px_var(--color-accent)] after:z-10',
                      ],
                      // Default hover (only when not focused or pending)
                      !draggedEntryId && focusedRowIndex !== index && !pendingDeletion && 'hover:bg-muted-bg/50'
                    )}
                  >
                    {/* Row Selection Checkbox */}
                    {hasBulkActions && (
                      <td className="px-3 py-3 text-center">
                        <Checkbox
                          checked={selectedIds.has(entry.id)}
                          onCheckedChange={() => toggleSelectEntry(entry.id)}
                          aria-label={`Select ${entry.value}`}
                        />
                      </td>
                    )}

                    {/* Drag Handle / Tree Expand - 44px touch target per Fitts's Law */}
                    <td className="px-1 py-3">
                      {viewMode === 'tree' ? (
                        // Tree mode: show expand/collapse chevron
                        <div
                          className="flex items-center justify-center min-h-11 min-w-11"
                          style={{ paddingLeft: indentPx }}
                        >
                          {hasChildren ? (
                            <button
                              onClick={() => toggleExpand(entry.id)}
                              className={cn(
                                'flex items-center justify-center size-6 rounded transition-colors',
                                'text-tertiary hover:text-secondary hover:bg-muted-bg'
                              )}
                              aria-label={isExpanded ? 'Collapse' : 'Expand'}
                            >
                              <ChevronRight
                                className={cn(
                                  'size-4 transition-transform duration-200',
                                  isExpanded && 'rotate-90'
                                )}
                              />
                            </button>
                          ) : (
                            <div className="size-6" /> // Spacer for alignment
                          )}
                        </div>
                      ) : onEntriesReorder ? (
                        // Table mode with reorder: show drag handle
                        <div
                          className={cn(
                            'flex items-center justify-center min-h-11 min-w-11 rounded transition-colors',
                            'cursor-grab active:cursor-grabbing',
                            'text-tertiary hover:text-secondary hover:bg-muted-bg',
                            draggedEntryId === entry.id && 'cursor-grabbing text-accent bg-accent/10'
                          )}
                          aria-label="Drag to reorder"
                        >
                          <GripVertical className="size-4" />
                        </div>
                      ) : (
                        // Table mode without reorder: disabled drag handle
                        <div className="flex items-center justify-center min-h-11 min-w-11 text-tertiary/20">
                          <GripVertical className="size-4" />
                        </div>
                      )}
                    </td>

                  {/* Value - with inline editing, search highlighting, and child count badge */}
                  <td
                    className="px-4 py-3"
                    onDoubleClick={() => onEntryEdit && startInlineEdit(entry, 'value')}
                  >
                    <div className="flex items-center gap-2">
                      {inlineEditId === entry.id && inlineEditField === 'value' ? (
                        <Input
                          ref={inlineInputRef as React.RefObject<HTMLInputElement>}
                          value={inlineEditValue}
                          onChange={(e) => setInlineEditValue(e.target.value)}
                          onBlur={() => saveInlineEdit(entry)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              saveInlineEdit(entry)
                            }
                            if (e.key === 'Escape') {
                              cancelInlineEdit()
                            }
                          }}
                          className="h-8 text-sm font-medium flex-1"
                          maxLength={100}
                        />
                      ) : (
                        <>
                          {/* Parent indicator icon for entries with children */}
                          {hasChildren && viewMode === 'table' && (
                            <GitBranch className="size-3.5 text-tertiary shrink-0" />
                          )}
                          <span
                            className={cn(
                              'text-sm font-medium text-primary',
                              onEntryEdit && 'cursor-text hover:bg-muted-bg/50 px-1 -mx-1 py-0.5 rounded'
                            )}
                            title={onEntryEdit ? 'Double-click to edit' : undefined}
                          >
                            {highlightMatch(entry.value, searchQuery)}
                          </span>
                          {/* Child count badge */}
                          {hasChildren && (
                            <Badge variant="outline" size="sm" className="text-tertiary font-normal">
                              {entry.children?.length}
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  </td>

                  {/* Code with Copy Button - with search highlighting */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-xs text-secondary bg-muted-bg px-1.5 py-0.5 rounded max-w-[200px] truncate">
                        {highlightMatch(entry.code, searchQuery)}
                      </code>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-6 shrink-0"
                              onClick={() => handleCopyCode(entry)}
                            >
                              {copiedEntryId === entry.id ? (
                                <Check className="size-3.5 text-success" />
                              ) : (
                                <Copy className="size-3.5 text-tertiary" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {copiedEntryId === entry.id ? 'Copied!' : 'Copy code'}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </td>

                  {/* Description - with inline editing and search highlighting */}
                  <td
                    className="px-4 py-3"
                    onDoubleClick={() => onEntryEdit && startInlineEdit(entry, 'description')}
                  >
                    {inlineEditId === entry.id && inlineEditField === 'description' ? (
                      <Textarea
                        ref={inlineInputRef as React.RefObject<HTMLTextAreaElement>}
                        value={inlineEditValue}
                        onChange={(e) => setInlineEditValue(e.target.value)}
                        onBlur={() => saveInlineEdit(entry)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            saveInlineEdit(entry)
                          }
                          if (e.key === 'Escape') {
                            cancelInlineEdit()
                          }
                        }}
                        className="min-h-[60px] text-sm resize-none"
                        maxLength={200}
                        rows={2}
                      />
                    ) : (
                      <span
                        className={cn(
                          'text-sm text-secondary line-clamp-1',
                          onEntryEdit && entry.description && 'cursor-text hover:bg-muted-bg/50 px-1 -mx-1 py-0.5 rounded',
                          onEntryEdit && !entry.description && 'cursor-text hover:bg-muted-bg/50 px-1 -mx-1 py-0.5 rounded italic text-tertiary'
                        )}
                        title={onEntryEdit ? 'Double-click to edit' : undefined}
                      >
                        {entry.description ? highlightMatch(entry.description, searchQuery) : (onEntryEdit ? 'Click to add...' : '—')}
                      </span>
                    )}
                  </td>

                  {/* Order - shows visual position in list */}
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm text-secondary tabular-nums">
                      {(currentPage - 1) * pageSize + index + 1}
                    </span>
                  </td>

                  {/* Status - Quick toggle or badge */}
                  <td className="px-4 py-3 text-center">
                    {onEntryStatusChange ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="inline-flex items-center gap-2">
                              <Switch
                                checked={entry.status === 'active'}
                                onCheckedChange={(checked) =>
                                  onEntryStatusChange(entry.id, checked ? 'active' : 'inactive')
                                }
                                aria-label={`Toggle ${entry.value} status`}
                              />
                              <span className={cn(
                                'text-xs font-medium',
                                entry.status === 'active' ? 'text-success' : 'text-secondary'
                              )}>
                                {STATUS_CONFIG[entry.status].label}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            Click to {entry.status === 'active' ? 'deactivate' : 'activate'}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge
                        variant={STATUS_CONFIG[entry.status].variant}
                        size="sm"
                      >
                        {STATUS_CONFIG[entry.status].label}
                      </Badge>
                    )}
                  </td>

                  {/* Actions - ≤3 visible buttons per UX rule */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      {onEntryEdit && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <ActionTile
                                variant="info"
                                appearance="filled"
                                size="xs"
                                onClick={() => onEntryEdit(entry)}
                                aria-label={`Edit ${entry.value}`}
                              >
                                <Edit2 className="size-4" />
                              </ActionTile>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {onEntryDuplicate && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <ActionTile
                                variant="neutral"
                                appearance="filled"
                                size="xs"
                                onClick={() => onEntryDuplicate(entry)}
                                aria-label={`Duplicate ${entry.value}`}
                              >
                                <Files className="size-4" />
                              </ActionTile>
                            </TooltipTrigger>
                            <TooltipContent>Duplicate</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {onEntryDelete && !entry.isSystem && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <ActionTile
                                variant="destructive"
                                appearance="filled"
                                size="xs"
                                onClick={() => handleDeleteWithUndo(entry)}
                                aria-label={`Delete ${entry.value}`}
                              >
                                <Trash2 className="size-4" />
                              </ActionTile>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </td>
                </tr>
                  )
                })}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-secondary">
          {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
        </p>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-secondary">Items per page</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPageSize(Number(v))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredEntries.length > pageSize && (
            <Pagination
              currentPage={currentPage}
              totalItems={filteredEntries.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              compact
            />
          )}
        </div>
      </div>

      {/* Undo Toast - shown when entry is pending deletion */}
      {pendingDeletion && (
        <UndoToast
          message={`"${pendingDeletion.value}" will be deleted`}
          onUndo={handleUndoDeletion}
          onComplete={handleConfirmDeletion}
          duration={5000}
        />
      )}
    </div>
    </div>
  )
}

DictionaryEntriesTable.displayName = 'DictionaryEntriesTable'

export default DictionaryEntriesTable
