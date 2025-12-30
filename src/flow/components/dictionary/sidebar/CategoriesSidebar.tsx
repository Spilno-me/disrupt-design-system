/**
 * CategoriesSidebar - Left panel with category list
 *
 * Features:
 * - SearchFilter for filtering categories
 * - Add category button
 * - Collapsible list (shows 5 by default, "Show more/less" button)
 * - Auto-expands when searching
 * - Keeps selected category visible even when collapsed
 * - Drag-and-drop reordering (disabled during search)
 */

import * as React from 'react'
import { Reorder, AnimatePresence } from 'motion/react'
import { Database, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'
import { SearchFilter } from '../../../../components/shared/SearchFilter'
import { DraggableCategoryCard } from './DraggableCategoryCard'
import type { DictionaryCategory } from '../types'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Default number of categories to show when collapsed (Miller's Law: 7±2) */
const DEFAULT_VISIBLE_COUNT = 7

// =============================================================================
// TYPES
// =============================================================================

interface CategoriesSidebarProps {
  categories: DictionaryCategory[]
  selectedCategoryId?: string
  isLoading?: boolean
  onCategorySelect: (categoryId: string) => void
  onCategoryCreate?: () => void
  /** Callback when categories are reordered via drag-and-drop */
  onCategoriesReorder?: (reorderedIds: string[]) => void
  className?: string
  /** Initial collapsed state. Default: true (collapsed) */
  defaultCollapsed?: boolean
  /** Enable drag-and-drop reordering. Default: true */
  enableReorder?: boolean
  /** Number of categories visible when collapsed (Miller's Law: 7±2). Default: 7 */
  visibleCount?: number
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CategoriesSidebar({
  categories,
  selectedCategoryId,
  isLoading = false,
  onCategorySelect,
  onCategoryCreate,
  onCategoriesReorder,
  className,
  defaultCollapsed = true,
  enableReorder = true,
  visibleCount = DEFAULT_VISIBLE_COUNT,
}: CategoriesSidebarProps) {
  // Use configurable visible count for power users
  const collapsedVisibleCount = visibleCount
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

  // Internal order state - tracks category IDs in display order
  const [orderedIds, setOrderedIds] = React.useState<string[]>(() =>
    categories.map((c) => c.id)
  )

  // Sync orderedIds when categories prop changes (new items added/removed)
  React.useEffect(() => {
    const categoryIds = new Set(categories.map((c) => c.id))
    const currentIds = new Set(orderedIds)

    // Check if categories changed (added or removed)
    const hasChanges =
      categories.length !== orderedIds.length ||
      categories.some((c) => !currentIds.has(c.id))

    if (hasChanges) {
      // Preserve existing order, add new items at end, remove deleted
      const newOrder = orderedIds.filter((id) => categoryIds.has(id))
      const newIds = categories
        .filter((c) => !currentIds.has(c.id))
        .map((c) => c.id)
      setOrderedIds([...newOrder, ...newIds])
    }
  }, [categories, orderedIds])

  // Sort categories by internal order
  const orderedCategories = React.useMemo(() => {
    const categoryMap = new Map(categories.map((c) => [c.id, c]))
    return orderedIds
      .map((id) => categoryMap.get(id))
      .filter((c): c is DictionaryCategory => c !== undefined)
  }, [categories, orderedIds])

  // Filter categories by search
  const filteredCategories = React.useMemo(() => {
    if (!searchQuery.trim()) return orderedCategories

    const search = searchQuery.toLowerCase()
    return orderedCategories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(search) ||
        cat.description?.toLowerCase().includes(search)
    )
  }, [orderedCategories, searchQuery])

  // Determine if we should show the expand/collapse button
  const hasMoreCategories = filteredCategories.length > collapsedVisibleCount
  const hiddenCount = filteredCategories.length - collapsedVisibleCount

  // When searching, always show all results (auto-expand)
  const isSearching = searchQuery.trim().length > 0

  // Get visible categories based on collapsed state
  const visibleCategories = React.useMemo(() => {
    // Always show all when searching or expanded
    if (isSearching || !isCollapsed) return filteredCategories

    // Check if selected category is beyond visible range
    const selectedIndex = filteredCategories.findIndex(
      (cat) => cat.id === selectedCategoryId
    )

    // If selected is in the hidden portion, show all up to and including it
    if (selectedIndex >= collapsedVisibleCount) {
      return filteredCategories.slice(0, selectedIndex + 1)
    }

    return filteredCategories.slice(0, collapsedVisibleCount)
  }, [filteredCategories, isCollapsed, isSearching, selectedCategoryId, collapsedVisibleCount])

  // Handle reorder - update internal state immediately for smooth UI
  const handleReorder = React.useCallback((newVisibleOrder: string[]) => {
    if (!enableReorder || isSearching) return

    // Build new full order: reordered visible items + hidden items
    const hiddenIds = isCollapsed && hasMoreCategories
      ? filteredCategories.slice(visibleCategories.length).map((c) => c.id)
      : []

    const newOrder = [...newVisibleOrder, ...hiddenIds]

    // Update internal state immediately (makes UI responsive)
    setOrderedIds(newOrder)

    // Notify parent
    onCategoriesReorder?.(newOrder)
  }, [enableReorder, isSearching, isCollapsed, hasMoreCategories, filteredCategories, visibleCategories, onCategoriesReorder])

  return (
    <aside
      data-slot="categories-sidebar"
      className={cn(
        // Depth 3: Glass surface panel per glass-transparency-model
        // bg-white/20 (light) + bg-black/20 (dark) + blur-[2px] + accent border
        'flex flex-col rounded-lg',
        'bg-white/20 dark:bg-black/20 backdrop-blur-[2px]',
        'border-2 border-accent shadow-sm',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-default p-4">
        <Database className="size-5 text-tertiary" />
        <h2 className="font-semibold text-primary">Categories</h2>
      </div>

      {/* Search + Add */}
      <div className="flex items-center gap-2 p-3 border-b border-default">
        <SearchFilter
          placeholder="Search categories..."
          value={searchQuery}
          onChange={setSearchQuery}
          size="compact"
          hideFilters
          className="flex-1"
        />
        {onCategoryCreate && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0"
                  onClick={onCategoryCreate}
                >
                  <Plus className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add category</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Category List */}
      <div className="flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="size-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <p className="mt-3 text-sm text-secondary">Loading categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Database className="size-10 text-tertiary" />
            <p className="mt-3 text-sm text-secondary">
              {searchQuery ? 'No categories match your search' : 'No categories available'}
            </p>
          </div>
        ) : (
          <>
            {/* Reorderable category list - drag disabled during search */}
            <Reorder.Group
              axis="y"
              values={visibleCategories.map((c) => c.id)}
              onReorder={handleReorder}
              className="space-y-2 list-none m-0 p-0"
              as="div"
            >
              <AnimatePresence mode="popLayout">
                {visibleCategories.map((category) => (
                  <DraggableCategoryCard
                    key={category.id}
                    category={category}
                    isSelected={category.id === selectedCategoryId}
                    onClick={() => onCategorySelect(category.id)}
                    isDragEnabled={enableReorder && !isSearching}
                  />
                ))}
              </AnimatePresence>
            </Reorder.Group>

            {/* Show more/less button - only when not searching and has hidden items */}
            {!isSearching && hasMoreCategories && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center gap-1.5 text-secondary hover:text-primary mt-3"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? (
                  <>
                    <ChevronDown className="size-4" />
                    Show {hiddenCount} more
                  </>
                ) : (
                  <>
                    <ChevronUp className="size-4" />
                    Show less
                  </>
                )}
              </Button>
            )}
          </>
        )}
      </div>
    </aside>
  )
}

CategoriesSidebar.displayName = 'CategoriesSidebar'

export default CategoriesSidebar
