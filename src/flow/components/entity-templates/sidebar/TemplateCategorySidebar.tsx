/**
 * TemplateCategorySidebar - Left panel with template categories
 *
 * Features:
 * - Predefined categories with semantic colors
 * - "All Templates" option at the top
 * - Template count per category
 * - Search filtering
 * - Collapsible to icon-only mode
 */

import * as React from 'react'
import { Layers, LayoutGrid, PanelLeftClose, PanelLeft } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../../../components/ui/tooltip'
import { SearchFilter } from '../../../../components/shared/SearchFilter'
import { TemplateCategoryCard } from './TemplateCategoryCard'
import {
  TEMPLATE_CATEGORIES,
  type TemplateCategory,
  type EntityTemplate,
} from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface TemplateCategorySidebarProps {
  templates: EntityTemplate[]
  selectedCategory: TemplateCategory | 'all'
  onCategorySelect: (category: TemplateCategory | 'all') => void
  isLoading?: boolean
  /** Whether the sidebar is collapsed (icon-only mode) */
  isCollapsed?: boolean
  /** Callback when collapse state changes */
  onCollapsedChange?: (collapsed: boolean) => void
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function TemplateCategorySidebar({
  templates,
  selectedCategory,
  onCategorySelect,
  isLoading = false,
  isCollapsed = false,
  onCollapsedChange,
  className,
}: TemplateCategorySidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState('')

  // Calculate counts per category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: templates.length }

    TEMPLATE_CATEGORIES.forEach((cat) => {
      counts[cat.id] = templates.filter((t) => t.category === cat.id).length
    })

    return counts
  }, [templates])

  // Filter categories by search
  const filteredCategories = React.useMemo(() => {
    if (!searchQuery.trim()) return TEMPLATE_CATEGORIES

    const search = searchQuery.toLowerCase()
    return TEMPLATE_CATEGORIES.filter(
      (cat) =>
        cat.name.toLowerCase().includes(search) ||
        cat.description.toLowerCase().includes(search)
    )
  }, [searchQuery])

  // Collapsed mode - icon-only sidebar
  if (isCollapsed) {
    return (
      <aside
        data-slot="template-categories-sidebar"
        data-collapsed="true"
        className={cn(
          'flex flex-col items-center rounded-xl border-2 border-accent bg-white/40 dark:bg-black/40 backdrop-blur-[4px] shadow-md py-3 px-2',
          'transition-all duration-300',
          className
        )}
      >
        {/* Expand Button */}
        {onCollapsedChange && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onCollapsedChange(false)}
                className="mb-3"
                aria-label="Expand sidebar"
              >
                <PanelLeft className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Expand categories</TooltipContent>
          </Tooltip>
        )}

        {/* All Templates - compact */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => onCategorySelect('all')}
              aria-label={`All Templates (${categoryCounts.all})`}
              className={cn(
                // Base styles - elevated card appearance (Depth 3)
                'flex items-center justify-center rounded-lg border p-2 transition-all mb-2',
                'bg-surface shadow-sm',
                'hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                // Selected state - enhanced elevation
                selectedCategory === 'all'
                  ? 'border-2 border-[var(--brand-deep-current-500)] dark:border-[var(--brand-deep-current-400)] bg-[var(--brand-deep-current-50)] dark:bg-[var(--brand-deep-current-900)]/50 shadow-md'
                  : 'border-default hover:bg-surfaceHover'
              )}
            >
              <div className="flex size-8 items-center justify-center rounded-md bg-[var(--brand-deep-current-100)] dark:bg-[var(--brand-deep-current-900)]">
                <LayoutGrid className="size-4 text-[var(--brand-deep-current-500)] dark:text-[var(--brand-deep-current-300)]" />
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            <span className="font-medium">All Templates</span>
            <span className="text-xs text-secondary">({categoryCounts.all})</span>
          </TooltipContent>
        </Tooltip>

        {/* Divider */}
        <div className="w-8 h-px bg-default my-2" />

        {/* Category Cards - compact */}
        <div className="flex flex-col items-center gap-2">
          {TEMPLATE_CATEGORIES.map((category) => (
            <TemplateCategoryCard
              key={category.id}
              category={category}
              count={categoryCounts[category.id] || 0}
              isSelected={selectedCategory === category.id}
              onClick={() => onCategorySelect(category.id)}
              isCompact
            />
          ))}
        </div>
      </aside>
    )
  }

  // Expanded mode - full sidebar
  return (
    <aside
      data-slot="template-categories-sidebar"
      data-collapsed="false"
      className={cn(
        'flex flex-col rounded-xl border-2 border-accent bg-white/40 dark:bg-black/40 backdrop-blur-[4px] shadow-md',
        'transition-all duration-300',
        className
      )}
    >
      {/* Header - matches main panel header styling */}
      <div className="flex items-center gap-3 border-b border-default p-4">
        <div className="flex-shrink-0 p-2 rounded-lg bg-muted-bg">
          <Layers className="w-5 h-5 text-accent" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-primary truncate">Categories</h2>
          <p className="text-sm text-secondary">Filter by type</p>
        </div>
        {onCollapsedChange && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onCollapsedChange(true)}
                className="size-8"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Collapse sidebar</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Search - Depth 3 Surface (nested inside glass) */}
      <div className="p-3 border-b border-default">
        <SearchFilter
          placeholder="Search categories..."
          value={searchQuery}
          onChange={setSearchQuery}
          size="compact"
          hideFilters
          className="w-full bg-surface border border-default backdrop-blur-0 shadow-sm rounded-lg"
        />
      </div>

      {/* Category List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="size-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <p className="mt-3 text-sm text-secondary">Loading categories...</p>
          </div>
        ) : (
          <>
            {/* All Templates - always shown */}
            {(!searchQuery.trim() || 'all templates'.includes(searchQuery.toLowerCase())) && (
              <button
                type="button"
                onClick={() => onCategorySelect('all')}
                className={cn(
                  // Base styles - elevated card appearance (Depth 3)
                  'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all',
                  'bg-surface shadow-sm',
                  'hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                  // Selected state - enhanced elevation
                  selectedCategory === 'all'
                    ? 'border-l-4 border-l-[var(--brand-deep-current-500)] dark:border-l-[var(--brand-deep-current-400)] border-t-default border-r-default border-b-default bg-[var(--brand-deep-current-50)] dark:bg-[var(--brand-deep-current-900)]/50 shadow-md'
                    : 'border-default hover:bg-surfaceHover'
                )}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-deep-current-100)] dark:bg-[var(--brand-deep-current-900)]">
                  <LayoutGrid className="size-5 text-[var(--brand-deep-current-500)] dark:text-[var(--brand-deep-current-300)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium text-primary">All Templates</h3>
                    <span className="text-sm font-medium text-secondary">{categoryCounts.all}</span>
                  </div>
                  <p className="text-xs text-secondary">View all templates</p>
                </div>
              </button>
            )}

            {/* Category Cards */}
            {filteredCategories.map((category) => (
              <TemplateCategoryCard
                key={category.id}
                category={category}
                count={categoryCounts[category.id] || 0}
                isSelected={selectedCategory === category.id}
                onClick={() => onCategorySelect(category.id)}
              />
            ))}

            {/* Empty state */}
            {filteredCategories.length === 0 && searchQuery.trim() && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Layers className="size-10 text-tertiary opacity-50" />
                <p className="mt-3 text-sm text-secondary">
                  No categories match "{searchQuery}"
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Stats */}
      <div className="border-t border-default px-4 py-3">
        <div className="flex items-center justify-between text-xs text-tertiary">
          <span>{TEMPLATE_CATEGORIES.length} categories</span>
          <span>{templates.length} total templates</span>
        </div>
      </div>
    </aside>
  )
}

TemplateCategorySidebar.displayName = 'TemplateCategorySidebar'

export default TemplateCategorySidebar
