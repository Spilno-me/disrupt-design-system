/**
 * MobileCategorySheet - Bottom sheet for category selection on mobile
 *
 * Replaces stacked sidebar on mobile with a familiar bottom sheet pattern.
 * Uses radio selection for single category choice with search filtering.
 */

import * as React from 'react'
import { ChevronDown, Search, Database, Check } from 'lucide-react'
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
import type { DictionaryCategory } from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface MobileCategorySheetProps {
  categories: DictionaryCategory[]
  selectedCategoryId?: string
  onCategorySelect: (categoryId: string) => void
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function MobileCategorySheet({
  categories,
  selectedCategoryId,
  onCategorySelect,
  className,
}: MobileCategorySheetProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  // Get selected category name for trigger
  const selectedCategory = React.useMemo(
    () => categories.find((c) => c.id === selectedCategoryId),
    [categories, selectedCategoryId]
  )

  // Filter categories by search
  const filteredCategories = React.useMemo(() => {
    if (!searchQuery.trim()) return categories
    const search = searchQuery.toLowerCase()
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.description?.toLowerCase().includes(search)
    )
  }, [categories, searchQuery])

  // Handle category selection
  const handleSelect = React.useCallback(
    (categoryId: string) => {
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
          <Database className="size-4 shrink-0 text-tertiary" />
          <span className="truncate">
            {selectedCategory?.name || 'Select Category'}
          </span>
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
            {filteredCategories.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-secondary">No categories found</p>
              </div>
            ) : (
              filteredCategories.map((category) => {
                const isSelected = category.id === selectedCategoryId
                const isSystem = category.type === 'system'

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
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-primary truncate">
                          {category.name}
                        </span>
                        {isSystem && (
                          <Badge variant="secondary" size="sm">
                            System
                          </Badge>
                        )}
                      </div>
                      {category.description && (
                        <p className="text-xs text-secondary line-clamp-1">
                          {category.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm text-secondary">
                        {category.itemCount}
                      </span>
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

MobileCategorySheet.displayName = 'MobileCategorySheet'

export default MobileCategorySheet
