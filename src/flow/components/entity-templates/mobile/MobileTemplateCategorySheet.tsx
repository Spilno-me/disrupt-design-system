/**
 * MobileTemplateCategorySheet - Bottom sheet for category selection on mobile
 *
 * Replaces stacked sidebar on mobile with a familiar bottom sheet pattern.
 * Uses radio selection for single category choice with search filtering.
 *
 * @component MOLECULE
 * @category Mobile
 */

import * as React from 'react'
import {
  ChevronDown,
  Search,
  Layers,
  Check,
  AlertTriangle,
  ClipboardCheck,
  FileSearch,
  Wrench,
  FileKey,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Badge } from '../../../../components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../../../../components/ui/sheet'
import type { TemplateCategory, EntityTemplate } from '../types'
import { TEMPLATE_CATEGORIES } from '../types'

// =============================================================================
// ICON MAPPING
// =============================================================================

const CATEGORY_ICONS: Record<TemplateCategory, LucideIcon> = {
  incident: AlertTriangle,
  inspection: ClipboardCheck,
  audit: FileSearch,
  corrective_action: Wrench,
  permit: FileKey,
  training: GraduationCap,
  custom: Layers,
}

// =============================================================================
// TYPES
// =============================================================================

interface MobileTemplateCategorySheetProps {
  templates: EntityTemplate[]
  selectedCategory: TemplateCategory | 'all'
  onCategorySelect: (category: TemplateCategory | 'all') => void
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function MobileTemplateCategorySheet({
  templates,
  selectedCategory,
  onCategorySelect,
  className,
}: MobileTemplateCategorySheetProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  // Count templates per category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: templates.length }
    TEMPLATE_CATEGORIES.forEach((cat) => {
      counts[cat.id] = templates.filter((t) => t.category === cat.id).length
    })
    return counts
  }, [templates])

  // Get selected category name for trigger
  const selectedCategoryInfo = React.useMemo(() => {
    if (selectedCategory === 'all') {
      return { name: 'All Categories', icon: Layers }
    }
    const category = TEMPLATE_CATEGORIES.find((c) => c.id === selectedCategory)
    return {
      name: category?.name ?? 'Unknown',
      icon: category ? CATEGORY_ICONS[category.id] : Layers,
    }
  }, [selectedCategory])

  // Filter categories by search
  const filteredCategories = React.useMemo(() => {
    if (!searchQuery.trim()) return TEMPLATE_CATEGORIES
    const search = searchQuery.toLowerCase()
    return TEMPLATE_CATEGORIES.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.description?.toLowerCase().includes(search)
    )
  }, [searchQuery])

  // Handle category selection
  const handleSelect = React.useCallback(
    (categoryId: TemplateCategory | 'all') => {
      onCategorySelect(categoryId)
      setOpen(false)
      setSearchQuery('')
    },
    [onCategorySelect]
  )

  // Reset search when sheet closes
  React.useEffect(() => {
    if (!open) {
      setSearchQuery('')
    }
  }, [open])

  const TriggerIcon = selectedCategoryInfo.icon

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className={cn(
          'w-full justify-between min-h-11 gap-2',
          className
        )}
      >
        <span className="flex items-center gap-2 truncate">
          <TriggerIcon className="size-4 shrink-0 text-tertiary" />
          <span className="truncate">{selectedCategoryInfo.name}</span>
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" size="sm">
              {categoryCounts[selectedCategory]}
            </Badge>
          )}
        </span>
        <ChevronDown className="size-4 shrink-0 text-tertiary" />
      </Button>

      {/* Bottom Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[80vh] rounded-t-xl">
          <SheetHeader className="pb-2">
            <SheetTitle>Select Category</SheetTitle>
          </SheetHeader>

          {/* Search */}
          <div className="relative px-4 pb-4">
            <Search className="absolute left-7 top-1/2 size-4 -translate-y-1/2 text-tertiary pointer-events-none" />
            <Input
              type="search"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 md:pl-10"
            />
          </div>

          {/* Category List */}
          <div className="flex flex-col overflow-y-auto max-h-[calc(80vh-140px)] px-4 pb-4">
            {/* All Categories Option */}
            {!searchQuery && (
              <button
                type="button"
                onClick={() => handleSelect('all')}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-lg px-3 py-3 text-left transition-colors min-h-11',
                  'hover:bg-muted-bg/50 active:bg-muted-bg',
                  selectedCategory === 'all' && 'bg-accent/10'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-8 rounded-lg bg-muted-bg">
                    <Layers className="size-4 text-secondary" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-medium text-primary">
                      All Categories
                    </span>
                    <p className="text-xs text-secondary">
                      View all templates
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm text-secondary">
                    {categoryCounts.all}
                  </span>
                  {selectedCategory === 'all' && (
                    <Check className="size-4 text-accent" />
                  )}
                </div>
              </button>
            )}

            {/* Separator */}
            {!searchQuery && filteredCategories.length > 0 && (
              <div className="h-px bg-default my-2" />
            )}

            {filteredCategories.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-secondary">No categories found</p>
              </div>
            ) : (
              filteredCategories.map((category) => {
                const isSelected = category.id === selectedCategory
                const CategoryIcon = CATEGORY_ICONS[category.id]
                const count = categoryCounts[category.id] ?? 0

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleSelect(category.id)}
                    className={cn(
                      'flex items-center justify-between gap-3 rounded-lg px-3 py-3 text-left transition-colors min-h-11',
                      'hover:bg-muted-bg/50 active:bg-muted-bg',
                      isSelected && 'bg-accent/10'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex items-center justify-center size-8 rounded-lg',
                          isSelected ? 'bg-accent/20' : 'bg-muted-bg'
                        )}
                      >
                        <CategoryIcon
                          className={cn(
                            'size-4',
                            isSelected ? 'text-accent' : 'text-secondary'
                          )}
                        />
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-medium text-primary truncate">
                          {category.name}
                        </span>
                        {category.description && (
                          <p className="text-xs text-secondary line-clamp-1">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm text-secondary">{count}</span>
                      {isSelected && (
                        <Check className="size-4 text-accent" />
                      )}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

MobileTemplateCategorySheet.displayName = 'MobileTemplateCategorySheet'

export default MobileTemplateCategorySheet
