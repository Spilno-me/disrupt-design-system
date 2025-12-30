/**
 * EntityTemplatesPage - Entity Templates List Page
 *
 * List page for managing entity templates that define
 * the structure and validation rules for entities.
 *
 * Features:
 * - Collapsible categories sidebar
 * - Full-featured data table with all columns
 * - Category filtering
 * - Search and type filters
 * - Navigation to dedicated create/edit pages
 *
 * @component PAGE
 * @testId Named regions: entity-templates-page, entity-templates-header,
 *         entity-templates-sidebar, entity-templates-content, entity-templates-table
 *
 * @example
 * ```tsx
 * <EntityTemplatesPage
 *   templates={templates}
 *   onCreateNavigate={() => navigate('/templates/create')}
 *   onEditNavigate={(template) => navigate(`/templates/${template.id}/edit`)}
 *   onTemplateDelete={handleDelete}
 * />
 * ```
 */

import * as React from 'react'
import { FileText, Plus, RefreshCw } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Button } from '../../../components/ui/button'
import { PageActionPanel } from '../../../components/ui/PageActionPanel'
import { GridBlobBackground } from '../../../components/ui/GridBlobCanvas'
import { SearchFilter } from '../../../components/shared/SearchFilter'
import type { FilterGroup, FilterState } from '../../../components/shared/SearchFilter/types'
import { TemplateCategorySidebar } from './sidebar'
import { EntityTemplatesTable } from './table/EntityTemplatesTable'
import { ViewTemplateDialog } from './dialogs/ViewTemplateDialog'
import { DeleteTemplateDialog } from './dialogs/DeleteTemplateDialog'
import { MobileTemplateCategorySheet } from './mobile/MobileTemplateCategorySheet'
import type {
  EntityTemplatesPageProps,
  EntityTemplate,
  TemplateCategory,
} from './types'
import { getCategoryInfo } from './types'

// =============================================================================
// FILTER GROUPS
// =============================================================================

const FILTER_GROUPS: FilterGroup[] = [
  {
    key: 'type',
    label: 'Type',
    options: [
      { id: 'system', label: 'System' },
      { id: 'custom', label: 'Custom' },
    ],
  },
]

// =============================================================================
// COMPONENT
// =============================================================================

export function EntityTemplatesPage({
  templates,
  isLoading = false,
  initialCategory = 'all',
  onCategoryChange,
  onCreateNavigate,
  onTemplateDelete,
  onEditNavigate,
  onRefresh,
}: EntityTemplatesPageProps) {
  // Category filter state (initialized from URL param via initialCategory)
  const [selectedCategory, setSelectedCategory] = React.useState<TemplateCategory | 'all'>(initialCategory)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)

  // Handler for category selection (syncs to URL if callback provided)
  const handleCategorySelect = React.useCallback(
    (category: TemplateCategory | 'all') => {
      setSelectedCategory(category)
      onCategoryChange?.(category)
    },
    [onCategoryChange]
  )

  // Search and filter state
  const [searchValue, setSearchValue] = React.useState('')
  const [filters, setFilters] = React.useState<FilterState>({})

  // Pagination and sorting state
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [sortColumn, setSortColumn] = React.useState<string | undefined>('name')
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc' | null>('asc')

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [selectedTemplate, setSelectedTemplate] = React.useState<EntityTemplate | null>(null)

  // Refresh state
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  // Filter templates based on category, search and type filter
  const filteredTemplates = React.useMemo(() => {
    return templates.filter((template) => {
      // Category filter
      if (selectedCategory !== 'all' && template.category !== selectedCategory) {
        return false
      }

      // Search filter
      if (searchValue) {
        const search = searchValue.toLowerCase()
        const matchesSearch =
          template.name.toLowerCase().includes(search) ||
          template.code.toLowerCase().includes(search) ||
          (template.businessKeyTemplate?.toLowerCase().includes(search) ?? false) ||
          (template.description?.toLowerCase().includes(search) ?? false)
        if (!matchesSearch) return false
      }

      // Type filter
      const typeFilters = filters.type || []
      if (typeFilters.length > 0) {
        const templateType = template.isSystem ? 'system' : 'custom'
        if (!typeFilters.includes(templateType)) return false
      }

      return true
    })
  }, [templates, selectedCategory, searchValue, filters])

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchValue, filters])

  // Handler for refresh button
  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true)
    await onRefresh?.()
    await new Promise((resolve) => setTimeout(resolve, 300))
    setIsRefreshing(false)
  }, [onRefresh])

  // Handler for viewing template
  const handleView = React.useCallback((template: EntityTemplate) => {
    setSelectedTemplate(template)
    setViewDialogOpen(true)
  }, [])

  // Handler for editing template (navigates to edit page)
  const handleEdit = React.useCallback(
    (template: EntityTemplate) => {
      onEditNavigate?.(template)
    },
    [onEditNavigate]
  )

  // Handler for deleting template
  const handleDelete = React.useCallback((template: EntityTemplate) => {
    setSelectedTemplate(template)
    setDeleteDialogOpen(true)
  }, [])

  // Handler for sort change
  const handleSortChange = React.useCallback(
    (column: string, direction: 'asc' | 'desc' | null) => {
      setSortColumn(direction ? column : undefined)
      setSortDirection(direction)
    },
    []
  )

  // Handler for delete confirmation
  const handleDeleteConfirm = React.useCallback(
    async (templateId: string) => {
      await onTemplateDelete?.(templateId)
      setDeleteDialogOpen(false)
      setSelectedTemplate(null)
    },
    [onTemplateDelete]
  )

  // Get category info for header
  const categoryInfo = selectedCategory !== 'all' ? getCategoryInfo(selectedCategory) : null

  return (
    <main
      data-slot="entity-templates-page"
      data-testid="entity-templates-page"
      className="relative min-h-screen bg-page overflow-hidden"
    >
      {/* Animated grid blob background */}
      <GridBlobBackground scale={1.2} blobCount={2} />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6 p-4 md:p-6">
        {/* Page Header */}
        <PageActionPanel
          data-testid="entity-templates-header"
          icon={<FileText className="w-6 h-6 md:w-8 md:h-8" />}
          iconClassName="text-accent"
          title="Entity Templates"
          subtitle={
            categoryInfo
              ? `Managing ${categoryInfo.name.toLowerCase()} templates`
              : 'Manage entity templates that define the structure and validation for entities'
          }
          primaryAction={
            onCreateNavigate && (
              <Button
                data-testid="entity-templates-create-button"
                variant="default"
                size="sm"
                onClick={onCreateNavigate}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Template
              </Button>
            )
          }
          actions={
            <Button
              data-testid="entity-templates-refresh-button"
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

        {/* Mobile Category Selector - Show at top on mobile for better UX */}
        <div className="lg:hidden">
          <MobileTemplateCategorySheet
            templates={templates}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        </div>

        {/* Main Content - Sidebar + Table Layout */}
        <div
          className={cn(
            'grid grid-cols-1 gap-6 transition-all duration-300',
            isSidebarCollapsed
              ? 'lg:grid-cols-[64px_1fr]'
              : 'lg:grid-cols-[300px_1fr]'
          )}
        >
          {/* Left Sidebar - Categories (collapsible) - Desktop only */}
          <TemplateCategorySidebar
            data-testid="entity-templates-sidebar"
            templates={templates}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            isLoading={isLoading}
            isCollapsed={isSidebarCollapsed}
            onCollapsedChange={setIsSidebarCollapsed}
            className="hidden lg:flex lg:sticky lg:top-6 lg:self-start"
          />

          {/* Templates Table Panel */}
          <section
            data-testid="entity-templates-content"
            className={cn(
              'rounded-xl border-2 border-accent bg-white/40 dark:bg-black/40 backdrop-blur-[4px] shadow-md',
              'flex flex-col'
            )}
          >
            {/* Section Header */}
            <div className="flex items-center gap-3 border-b border-default p-4">
              <div className="flex-shrink-0 p-2 rounded-lg bg-muted-bg">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-primary truncate">
                  {categoryInfo ? categoryInfo.name : 'All Templates'}
                </h2>
                <p className="text-sm text-secondary">
                  {categoryInfo
                    ? categoryInfo.description
                    : `${filteredTemplates.length} templates available`}
                </p>
              </div>
            </div>

            {/* Content area with padding */}
            <div className="flex flex-col gap-4 p-4 md:p-6">
              {/* Search and Filter Bar - Depth 3 Surface (nested inside glass) */}
              <SearchFilter
                data-testid="entity-templates-search"
                placeholder="Search templates by name, code, business key..."
                value={searchValue}
                onChange={setSearchValue}
                filterGroups={FILTER_GROUPS}
                filters={filters}
                onFiltersChange={setFilters}
                size="default"
                className="bg-surface border border-default backdrop-blur-0 shadow-sm rounded-lg"
              />

              {/* Data Table / Mobile Cards */}
              <EntityTemplatesTable
                data-testid="entity-templates-table"
                templates={filteredTemplates}
                isLoading={isLoading}
                currentPage={currentPage}
                pageSize={pageSize}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onView={handleView}
                onEdit={onEditNavigate ? handleEdit : undefined}
                onDelete={onTemplateDelete ? handleDelete : undefined}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                onSortChange={handleSortChange}
              />
            </div>
          </section>
        </div>
      </div>

      {/* View Dialog */}
      <ViewTemplateDialog
        template={selectedTemplate}
        open={viewDialogOpen}
        onOpenChange={(open) => {
          setViewDialogOpen(open)
          if (!open) setSelectedTemplate(null)
        }}
      />

      {/* Delete Dialog */}
      <DeleteTemplateDialog
        template={selectedTemplate}
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open)
          if (!open) setSelectedTemplate(null)
        }}
        onConfirm={handleDeleteConfirm}
      />
    </main>
  )
}

EntityTemplatesPage.displayName = 'EntityTemplatesPage'

export default EntityTemplatesPage
