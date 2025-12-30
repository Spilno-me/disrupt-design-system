/**
 * DictionaryPage - Main Dictionary Management Page
 *
 * Two-panel layout for managing system dictionaries and lookup values.
 * Left panel: Category sidebar with search and selection
 * Right panel: Dictionary entries table for selected category
 *
 * @example
 * ```tsx
 * <DictionaryPage
 *   categories={categories}
 *   entries={entries}
 *   selectedCategoryId={selectedId}
 *   onCategorySelect={handleSelect}
 *   onEntryCreate={handleCreate}
 *   onEntryUpdate={handleUpdate}
 *   onEntryDelete={handleDelete}
 * />
 * ```
 */

import * as React from 'react'
import { BookOpen, RefreshCw, Plus } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Button } from '../../../components/ui/button'
import { PageActionPanel } from '../../../components/ui/PageActionPanel'
import { CategoriesSidebar } from './sidebar/CategoriesSidebar'
import { DictionaryEntriesTable } from './table/DictionaryEntriesTable'
import { MobileCategorySheet } from './mobile/MobileCategorySheet'
import { CreateCategoryDialog } from './dialogs/CreateCategoryDialog'
import { DeleteCategoryDialog } from './dialogs/DeleteCategoryDialog'
import { CreateEntryDialog } from './dialogs/CreateEntryDialog'
import { EditEntryDialog } from './dialogs/EditEntryDialog'
import { DeleteEntryDialog } from './dialogs/DeleteEntryDialog'
import type {
  DictionaryPageProps,
  DictionaryCategory,
  DictionaryEntry,
  CreateCategoryFormData,
  CreateEntryFormData,
  EditEntryFormData,
  EntryStatus,
} from './types'

// =============================================================================
// COMPONENT
// =============================================================================

export function DictionaryPage({
  categories,
  entries,
  selectedCategoryId,
  isLoading = false,
  onCategorySelect,
  onCategoryCreate,
  onCategoryDelete,
  onEntryCreate,
  onEntryUpdate,
  onEntryDelete,
  onEntryStatusChange,
  onEntriesReorder,
  onImport,
  onExport,
  onBulkStatusChange,
  onBulkDelete,
}: DictionaryPageProps) {
  // Dialog states
  const [createCategoryDialogOpen, setCreateCategoryDialogOpen] = React.useState(false)
  const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen] = React.useState(false)
  const [categoryToDelete, setCategoryToDelete] = React.useState<DictionaryCategory | null>(null)

  const [createEntryDialogOpen, setCreateEntryDialogOpen] = React.useState(false)
  const [editEntryDialogOpen, setEditEntryDialogOpen] = React.useState(false)
  const [deleteEntryDialogOpen, setDeleteEntryDialogOpen] = React.useState(false)
  const [selectedEntry, setSelectedEntry] = React.useState<DictionaryEntry | null>(null)
  /** Entry being duplicated - used to pre-fill create dialog */
  const [entryToDuplicate, setEntryToDuplicate] = React.useState<DictionaryEntry | null>(null)

  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Get selected category
  const selectedCategory = React.useMemo(
    () => categories.find((c) => c.id === selectedCategoryId) || null,
    [categories, selectedCategoryId]
  )

  // Handler for refresh button
  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true)
    // Simulate refresh delay - in real app, would refetch data
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsRefreshing(false)
  }, [])

  // Category handlers
  const handleCreateCategory = React.useCallback(
    async (data: CreateCategoryFormData) => {
      if (!onCategoryCreate) return
      setIsSubmitting(true)
      try {
        await onCategoryCreate(data)
        setCreateCategoryDialogOpen(false)
      } finally {
        setIsSubmitting(false)
      }
    },
    [onCategoryCreate]
  )

  const handleDeleteCategory = React.useCallback(
    async (categoryId: string) => {
      if (!onCategoryDelete) return
      setIsSubmitting(true)
      try {
        await onCategoryDelete(categoryId)
        setDeleteCategoryDialogOpen(false)
        setCategoryToDelete(null)
      } finally {
        setIsSubmitting(false)
      }
    },
    [onCategoryDelete]
  )

  // Entry handlers
  const handleCreateEntry = React.useCallback(
    async (data: CreateEntryFormData) => {
      if (!onEntryCreate) return
      setIsSubmitting(true)
      try {
        await onEntryCreate(data)
        setCreateEntryDialogOpen(false)
        setEntryToDuplicate(null) // Clear duplicate state after creation
      } finally {
        setIsSubmitting(false)
      }
    },
    [onEntryCreate]
  )

  // Handle create dialog close - clear duplicate state
  const handleCreateDialogOpenChange = React.useCallback((open: boolean) => {
    setCreateEntryDialogOpen(open)
    if (!open) {
      setEntryToDuplicate(null)
    }
  }, [])

  const handleEditEntry = React.useCallback(
    async (data: EditEntryFormData) => {
      if (!onEntryUpdate) return
      setIsSubmitting(true)
      try {
        await onEntryUpdate(data)
        setEditEntryDialogOpen(false)
        setSelectedEntry(null)
      } finally {
        setIsSubmitting(false)
      }
    },
    [onEntryUpdate]
  )

  const handleDeleteEntry = React.useCallback(
    async (entryId: string) => {
      if (!onEntryDelete) return
      setIsSubmitting(true)
      try {
        await onEntryDelete(entryId)
        setDeleteEntryDialogOpen(false)
        setSelectedEntry(null)
      } finally {
        setIsSubmitting(false)
      }
    },
    [onEntryDelete]
  )

  // Quick status toggle handler
  const handleEntryStatusChange = React.useCallback(
    async (entryId: string, status: EntryStatus) => {
      if (!onEntryStatusChange) return
      await onEntryStatusChange(entryId, status)
    },
    [onEntryStatusChange]
  )

  // Open edit entry dialog
  const openEditEntryDialog = React.useCallback((entry: DictionaryEntry) => {
    setSelectedEntry(entry)
    setEditEntryDialogOpen(true)
  }, [])

  // Open delete entry dialog
  const openDeleteEntryDialog = React.useCallback((entry: DictionaryEntry) => {
    setSelectedEntry(entry)
    setDeleteEntryDialogOpen(true)
  }, [])

  // Open create dialog with pre-filled values for duplication
  const handleDuplicateEntry = React.useCallback((entry: DictionaryEntry) => {
    setEntryToDuplicate(entry)
    setCreateEntryDialogOpen(true)
  }, [])

  return (
    <div
      data-slot="dictionary-page"
      className="flex flex-col gap-6 p-4 md:p-6"
    >
      {/* Page Header - ActionCard style matching Incidents page */}
      <PageActionPanel
        icon={<BookOpen className="w-6 h-6 md:w-8 md:h-8" />}
        iconClassName="text-accent"
        title="Dictionary Management"
        subtitle={
          selectedCategory
            ? `Manage ${selectedCategory.name} lookup values`
            : 'Manage system dictionaries and lookup values'
        }
        primaryAction={
          onEntryCreate && selectedCategory ? (
            <Button
              variant="default"
              size="sm"
              onClick={() => setCreateEntryDialogOpen(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Entry
            </Button>
          ) : undefined
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw
              className={cn(
                'size-4',
                isRefreshing && 'animate-spin'
              )}
            />
            Refresh
          </Button>
        }
      />

      {/* Mobile Category Selector (visible below lg) */}
      <div className="lg:hidden">
        <MobileCategorySheet
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={onCategorySelect || (() => {})}
        />
      </div>

      {/* Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Left Panel: Categories (hidden on mobile, visible on lg+) */}
        <CategoriesSidebar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          isLoading={isLoading}
          onCategorySelect={onCategorySelect || (() => {})}
          onCategoryCreate={onCategoryCreate ? () => setCreateCategoryDialogOpen(true) : undefined}
          className="hidden lg:flex lg:sticky lg:top-6 lg:max-h-[calc(100vh-6rem)]"
        />

        {/* Right Panel: Entries Table */}
        <DictionaryEntriesTable
          category={selectedCategory}
          entries={entries}
          isLoading={isLoading}
          onEntryCreate={onEntryCreate ? () => setCreateEntryDialogOpen(true) : undefined}
          onEntryEdit={onEntryUpdate ? openEditEntryDialog : undefined}
          onEntryDelete={onEntryDelete ? openDeleteEntryDialog : undefined}
          onEntryDuplicate={onEntryCreate ? handleDuplicateEntry : undefined}
          onEntryStatusChange={onEntryStatusChange ? handleEntryStatusChange : undefined}
          onEntriesReorder={onEntriesReorder}
          onImport={onImport ? () => onImport(selectedCategoryId!, new File([], '')) : undefined}
          onExport={onExport ? () => onExport(selectedCategoryId!) : undefined}
          onBulkStatusChange={onBulkStatusChange}
          onBulkDelete={onBulkDelete}
        />
      </div>

      {/* Dialogs */}
      <CreateCategoryDialog
        open={createCategoryDialogOpen}
        onOpenChange={setCreateCategoryDialogOpen}
        onSubmit={handleCreateCategory}
        isSubmitting={isSubmitting}
      />

      <DeleteCategoryDialog
        open={deleteCategoryDialogOpen}
        onOpenChange={setDeleteCategoryDialogOpen}
        category={categoryToDelete}
        onConfirm={handleDeleteCategory}
        isSubmitting={isSubmitting}
      />

      <CreateEntryDialog
        open={createEntryDialogOpen}
        onOpenChange={handleCreateDialogOpenChange}
        category={selectedCategory}
        onSubmit={handleCreateEntry}
        isSubmitting={isSubmitting}
        entries={entries}
        defaultValues={entryToDuplicate ? {
          value: entryToDuplicate.value,
          description: entryToDuplicate.description,
          parentId: entryToDuplicate.parentId,
        } : undefined}
      />

      <EditEntryDialog
        open={editEntryDialogOpen}
        onOpenChange={setEditEntryDialogOpen}
        category={selectedCategory}
        entry={selectedEntry}
        onSubmit={handleEditEntry}
        isSubmitting={isSubmitting}
        entries={entries}
      />

      <DeleteEntryDialog
        open={deleteEntryDialogOpen}
        onOpenChange={setDeleteEntryDialogOpen}
        entry={selectedEntry}
        onConfirm={handleDeleteEntry}
        isSubmitting={isSubmitting}
        entries={entries}
      />
    </div>
  )
}

DictionaryPage.displayName = 'DictionaryPage'

export default DictionaryPage
