/**
 * CreateEntitySheet - Quick entity creation from module card
 *
 * A mobile-friendly bottom sheet that allows users to:
 * - Select entity type (if module has multiple)
 * - Confirm and navigate to the entity creation form
 *
 * @component ORGANISM
 */

import * as React from 'react'
import { useState, useCallback, useEffect } from 'react'
import { Plus, FileText, ArrowRight } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '../../../components/ui/sheet'
import { getModuleIcon, getModuleColors } from './helpers'
import type { ModuleItem, EntityTemplateInfo } from './ModuleCard'

// =============================================================================
// TYPES
// =============================================================================

export interface CreateEntitySheetProps {
  /** Whether the sheet is open */
  open: boolean
  /** Callback when sheet open state changes */
  onOpenChange: (open: boolean) => void
  /** Module to create entity for */
  module: ModuleItem | null
  /** Callback when user confirms entity creation */
  onCreateEntity?: (moduleId: string, entityTemplate: EntityTemplateInfo) => void
  /** Additional class names for sheet content */
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CreateEntitySheet({
  open,
  onOpenChange,
  module,
  onCreateEntity,
  className,
}: CreateEntitySheetProps) {
  // Selected entity template (defaults to primary)
  const [selectedTemplate, setSelectedTemplate] = useState<EntityTemplateInfo | null>(null)

  // Reset selection when module changes
  useEffect(() => {
    if (module) {
      setSelectedTemplate(module.primaryEntityTemplate ?? null)
    }
  }, [module])

  // Handle create action
  const handleCreate = useCallback(() => {
    if (!module || !selectedTemplate || !onCreateEntity) return
    onCreateEntity(module.id, selectedTemplate)
    onOpenChange(false)
  }, [module, selectedTemplate, onCreateEntity, onOpenChange])

  if (!module) return null

  const IconComponent = getModuleIcon(module.code)
  const colors = getModuleColors(module.code)

  // Get available entity templates (only primary if no secondary)
  const availableTemplates = module.entityTemplates ?? []
  const hasSingleTemplate = availableTemplates.length === 1
  const hasMultipleTemplates = availableTemplates.length > 1

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className={cn(
          'rounded-t-xl',
          // Dynamic height based on content
          hasMultipleTemplates ? 'h-auto max-h-[70vh]' : 'h-auto',
          className
        )}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-muted" />
        </div>

        <SheetHeader className="text-left">
          {/* Module Context */}
          <div className="flex items-center gap-3">
            <div className={cn('flex size-10 items-center justify-center rounded-lg', colors.bg)}>
              <IconComponent className={cn('size-5', colors.icon)} />
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="truncate">Create New Entity</SheetTitle>
              <SheetDescription className="truncate">
                {module.name}
              </SheetDescription>
            </div>
            <Plus className="size-5 text-accent" />
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="px-4 py-4 space-y-4">
          {/* Single template - just show info */}
          {hasSingleTemplate && selectedTemplate && (
            <div
              className={cn(
                'flex items-center justify-between p-4 rounded-lg',
                'bg-accent/10 border-2 border-accent'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent/20">
                  <FileText className="size-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-primary">{selectedTemplate.name}</p>
                  <p className="text-xs text-tertiary font-mono">{selectedTemplate.code}</p>
                </div>
              </div>
              <Badge variant="info" size="sm">Primary</Badge>
            </div>
          )}

          {/* Multiple templates - allow selection */}
          {hasMultipleTemplates && (
            <div className="space-y-2">
              <p className="text-sm text-secondary">Select entity type:</p>
              <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                {availableTemplates.map((template) => {
                  const isSelected = selectedTemplate?.id === template.id
                  const isPrimary = module.primaryEntityTemplate?.id === template.id

                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setSelectedTemplate(template)}
                      className={cn(
                        'w-full flex items-center justify-between p-4 rounded-lg text-left',
                        'transition-colors border-2',
                        isSelected
                          ? 'bg-accent/10 border-accent'
                          : 'bg-white/10 dark:bg-black/10 border-transparent hover:border-accent/30'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex size-10 items-center justify-center rounded-lg',
                            isSelected ? 'bg-accent/20' : 'bg-muted-bg'
                          )}
                        >
                          <FileText
                            className={cn(
                              'size-5',
                              isSelected ? 'text-accent' : 'text-tertiary'
                            )}
                          />
                        </div>
                        <div>
                          <p className={cn(
                            'font-medium',
                            isSelected ? 'text-primary' : 'text-secondary'
                          )}>
                            {template.name}
                          </p>
                          <p className="text-xs text-tertiary font-mono">{template.code}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isPrimary && (
                          <Badge variant="info" size="sm">Primary</Badge>
                        )}
                        {isSelected && (
                          <div className="size-5 rounded-full bg-accent flex items-center justify-center">
                            <svg
                              className="size-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* No templates available */}
          {availableTemplates.length === 0 && (
            <div className="text-center py-8">
              <FileText className="size-12 text-tertiary mx-auto mb-3" />
              <p className="text-secondary">No entity templates available</p>
              <p className="text-xs text-tertiary mt-1">
                Configure entity templates for this module first.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <SheetFooter className="border-t border-accent/30">
          <SheetClose asChild>
            <Button variant="outline" className="flex-1 sm:flex-initial">
              Cancel
            </Button>
          </SheetClose>
          <Button
            variant="default"
            className="flex-1 sm:flex-initial gap-2"
            onClick={handleCreate}
            disabled={!selectedTemplate}
          >
            Continue
            <ArrowRight className="size-4" />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

CreateEntitySheet.displayName = 'CreateEntitySheet'

export default CreateEntitySheet
