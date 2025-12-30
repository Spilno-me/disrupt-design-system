/**
 * FieldList - Reorderable list of schema fields
 *
 * Uses Framer Motion Reorder for smooth drag-and-drop reordering.
 * Supports search filtering, selection, and all field actions.
 */

import * as React from 'react'
import { Reorder, AnimatePresence, motion, useDragControls } from 'motion/react'
import { Plus, Search, X, GripVertical } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { SHADOWS, Z_INDEX } from '../../../../constants/designTokens'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { FieldCard, FieldCardSkeleton } from './FieldCard'
import type { FieldListProps, FieldWithKey } from '../types'

// =============================================================================
// DRAGGABLE FIELD ITEM
// =============================================================================

interface DraggableFieldItemProps {
  field: FieldWithKey
  isSelected: boolean
  isDragEnabled: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
  onToggleRequired: () => void
}

function DraggableFieldItem({
  field,
  isSelected,
  isDragEnabled,
  onSelect,
  onEdit,
  onDelete,
  onToggleRequired,
}: DraggableFieldItemProps) {
  const dragControls = useDragControls()

  // Non-draggable mode (search active)
  if (!isDragEnabled) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
      >
        <FieldCard
          field={field}
          isSelected={isSelected}
          onClick={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleRequired={onToggleRequired}
        />
      </motion.div>
    )
  }

  return (
    <Reorder.Item
      as="div"
      value={field.key}
      id={field.key}
      dragListener={false}
      dragControls={dragControls}
      className="relative group list-none"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
      whileDrag={{
        scale: 1.02,
        boxShadow: SHADOWS.lg,
        zIndex: Z_INDEX.header,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {/* Custom Drag Handle Overlay */}
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center z-10',
          'cursor-grab active:cursor-grabbing',
          'touch-none select-none'
        )}
        onPointerDown={(e) => dragControls.start(e)}
      >
        <GripVertical className="size-4 text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <FieldCard
        field={field}
        isSelected={isSelected}
        onClick={onSelect}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleRequired={onToggleRequired}
      />
    </Reorder.Item>
  )
}

// =============================================================================
// EMPTY STATE
// =============================================================================

interface EmptyStateProps {
  isSearching: boolean
  searchQuery: string
  onAddField: () => void
  onClearSearch: () => void
}

function EmptyState({
  isSearching,
  searchQuery,
  onAddField,
  onClearSearch,
}: EmptyStateProps) {
  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="size-12 rounded-full bg-muted-bg flex items-center justify-center mb-3">
          <Search className="size-5 text-tertiary" />
        </div>
        <p className="text-primary font-medium mb-1">No fields match "{searchQuery}"</p>
        <p className="text-secondary text-sm mb-4">
          Try a different search term
        </p>
        <Button type="button" variant="outline" size="sm" onClick={onClearSearch}>
          <X className="size-4" />
          Clear search
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="size-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
        <Plus className="size-5 text-accent" />
      </div>
      <p className="text-primary font-medium mb-1">No fields yet</p>
      <p className="text-secondary text-sm mb-4">
        Add your first field to start building the schema
      </p>
      <Button type="button" variant="default" size="sm" onClick={onAddField}>
        <Plus className="size-4" />
        Add Field
      </Button>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function FieldList({
  fields,
  selectedKey = null,
  searchQuery = '',
  onFieldSelect,
  onFieldEdit,
  onFieldDelete,
  onFieldToggleRequired,
  onReorder,
  onAddField,
  className,
}: FieldListProps) {
  // Internal search state if not controlled
  const [internalSearch, setInternalSearch] = React.useState('')
  const effectiveSearch = searchQuery || internalSearch

  // Filter fields by search
  const filteredFields = React.useMemo(() => {
    if (!effectiveSearch.trim()) return fields

    const query = effectiveSearch.toLowerCase()
    return fields.filter((field) => {
      return (
        field.key.toLowerCase().includes(query) ||
        field.title?.toLowerCase().includes(query) ||
        field.description?.toLowerCase().includes(query) ||
        field.type.toLowerCase().includes(query)
      )
    })
  }, [fields, effectiveSearch])

  // Whether drag is enabled (disabled during search)
  const isDragEnabled = !effectiveSearch.trim()

  // Handle reorder
  const handleReorder = React.useCallback(
    (newOrder: string[]) => {
      // Only reorder if not searching
      if (isDragEnabled) {
        onReorder(newOrder)
      }
    },
    [onReorder, isDragEnabled]
  )

  // Clear search
  const handleClearSearch = React.useCallback(() => {
    setInternalSearch('')
  }, [])

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header with search and add button */}
      <div className="flex items-center gap-2 mb-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-tertiary pointer-events-none" />
          <Input
            type="text"
            placeholder="Search fields..."
            value={effectiveSearch}
            onChange={(e) => setInternalSearch(e.target.value)}
            className="pl-10 md:pl-10"
          />
          {effectiveSearch && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 size-7 p-0"
              onClick={handleClearSearch}
            >
              <X className="size-3.5" />
            </Button>
          )}
        </div>

        {/* Add field button */}
        <Button type="button" variant="default" size="sm" onClick={onAddField}>
          <Plus className="size-4" />
          <span className="hidden sm:inline">Add Field</span>
        </Button>
      </div>

      {/* Field count */}
      <div className="flex items-center justify-between text-sm text-secondary mb-3">
        <span>
          {effectiveSearch
            ? `${filteredFields.length} of ${fields.length} fields`
            : `${fields.length} field${fields.length !== 1 ? 's' : ''}`}
        </span>
        {isDragEnabled && fields.length > 1 && (
          <span className="text-xs text-tertiary">Drag to reorder</span>
        )}
      </div>

      {/* Field list - px/mx offset gives shadows room to render within scroll container */}
      <div className="flex-1 overflow-y-auto min-h-0 px-2 -mx-2 py-1">
        {filteredFields.length === 0 ? (
          <EmptyState
            isSearching={!!effectiveSearch}
            searchQuery={effectiveSearch}
            onAddField={onAddField}
            onClearSearch={handleClearSearch}
          />
        ) : isDragEnabled ? (
          // Draggable list
          <Reorder.Group
            axis="y"
            values={filteredFields.map((f) => f.key)}
            onReorder={handleReorder}
            className="space-y-2 list-none m-0 p-0"
            as="div"
          >
            <AnimatePresence mode="popLayout">
              {filteredFields.map((field) => (
                <DraggableFieldItem
                  key={field.key}
                  field={field}
                  isSelected={selectedKey === field.key}
                  isDragEnabled={isDragEnabled}
                  onSelect={() => onFieldSelect(field.key)}
                  onEdit={() => onFieldEdit(field.key)}
                  onDelete={() => onFieldDelete(field.key)}
                  onToggleRequired={() => onFieldToggleRequired(field.key)}
                />
              ))}
            </AnimatePresence>
          </Reorder.Group>
        ) : (
          // Static filtered list (search active)
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredFields.map((field) => (
                <DraggableFieldItem
                  key={field.key}
                  field={field}
                  isSelected={selectedKey === field.key}
                  isDragEnabled={false}
                  onSelect={() => onFieldSelect(field.key)}
                  onEdit={() => onFieldEdit(field.key)}
                  onDelete={() => onFieldDelete(field.key)}
                  onToggleRequired={() => onFieldToggleRequired(field.key)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// SKELETON
// =============================================================================

export function FieldListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-10 bg-muted-bg rounded-lg animate-pulse" />
        <div className="w-24 h-10 bg-muted-bg rounded-lg animate-pulse" />
      </div>

      {/* Count skeleton */}
      <div className="h-4 w-20 bg-muted-bg rounded animate-pulse" />

      {/* Fields skeleton */}
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <FieldCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export default FieldList
