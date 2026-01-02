/**
 * ModuleConfigSheet - Mobile bottom sheet for editing module settings
 *
 * Provides a mobile-friendly interface for configuring module settings:
 * - Status toggle (Active/Inactive)
 * - Primary form selection
 * - Entity template overview
 *
 * Uses bottom sheet pattern per DDS UX guidelines for mobile.
 *
 * @component ORGANISM
 */

import * as React from 'react'
import { useState, useCallback, useEffect } from 'react'
import { Database, Power, FileText, Info } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Button } from '../../../components/ui/button'
import { Switch } from '../../../components/ui/switch'
import { Label } from '../../../components/ui/label'
import { Badge } from '../../../components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '../../../components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../components/ui/tooltip'
import { ModuleStatusBadge } from './ModuleStatusBadge'
import { getModuleIcon, getModuleColors, type ModuleStatus } from './helpers'
import type { ModuleItem, EntityTemplateInfo } from './ModuleCard'

// =============================================================================
// TYPES
// =============================================================================

/**
 * Form template for selection.
 */
export interface FormTemplateOption {
  id: string
  name: string
  code: string
}

/**
 * Module configuration data for editing.
 */
export interface ModuleConfigData {
  status: ModuleStatus
  primaryFormTemplateId: string | null
}

export interface ModuleConfigSheetProps {
  /** Whether the sheet is open */
  open: boolean
  /** Callback when sheet open state changes */
  onOpenChange: (open: boolean) => void
  /** Module being configured */
  module: ModuleItem | null
  /** Available form templates for selection */
  formTemplates?: FormTemplateOption[]
  /** Currently selected primary form ID */
  currentPrimaryFormId?: string | null
  /** Whether save is in progress */
  isSaving?: boolean
  /** Callback when configuration is saved */
  onSave?: (moduleId: string, config: ModuleConfigData) => void
  /** Additional class names for sheet content */
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ModuleConfigSheet({
  open,
  onOpenChange,
  module,
  formTemplates = [],
  currentPrimaryFormId = null,
  isSaving = false,
  onSave,
  className,
}: ModuleConfigSheetProps) {
  // Local state for form values
  const [isActive, setIsActive] = useState(module?.status === 'active')
  const [selectedFormId, setSelectedFormId] = useState<string | null>(currentPrimaryFormId)

  // Reset state when module changes
  useEffect(() => {
    if (module) {
      setIsActive(module.status === 'active')
      setSelectedFormId(currentPrimaryFormId)
    }
  }, [module, currentPrimaryFormId])

  // Handle save
  const handleSave = useCallback(() => {
    if (!module || !onSave) return

    onSave(module.id, {
      status: isActive ? 'active' : 'inactive',
      primaryFormTemplateId: selectedFormId,
    })
  }, [module, onSave, isActive, selectedFormId])

  // Check if there are unsaved changes
  const hasChanges =
    module &&
    ((isActive ? 'active' : 'inactive') !== module.status ||
      selectedFormId !== currentPrimaryFormId)

  // Module is draft - can't toggle status
  const isDraft = module?.status === 'draft'

  if (!module) return null

  const IconComponent = getModuleIcon(module.code)
  const colors = getModuleColors(module.code)
  const entityCount = module.entityTemplates?.length ?? 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className={cn(
          'h-[85vh] max-h-[85vh] rounded-t-xl',
          className
        )}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-muted" />
        </div>

        <SheetHeader className="text-left">
          {/* Module Header */}
          <div className="flex items-center gap-3">
            <div className={cn('flex size-10 items-center justify-center rounded-lg', colors.bg)}>
              <IconComponent className={cn('size-5', colors.icon)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <SheetTitle className="truncate">{module.name}</SheetTitle>
                <Badge variant="outline" size="sm" className="font-mono shrink-0">
                  v{module.version}
                </Badge>
              </div>
              <SheetDescription className="font-mono truncate">
                {module.code}
              </SheetDescription>
            </div>
            <ModuleStatusBadge status={module.status} />
          </div>
        </SheetHeader>

        {/* Configuration Form */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Status Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Power className="size-4 text-tertiary" />
                <Label htmlFor="module-status" className="text-sm font-medium">
                  Module Status
                </Label>
                {isDraft && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="size-3.5 text-tertiary" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Draft modules cannot be activated. Publish the module first.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <Switch
                id="module-status"
                checked={isActive}
                onCheckedChange={setIsActive}
                disabled={isDraft}
              />
            </div>
            <p className="text-xs text-tertiary">
              {isDraft
                ? 'This module is in draft mode and cannot be activated yet.'
                : isActive
                  ? 'Module is active and available for use.'
                  : 'Module is inactive. Users cannot create new entities.'}
            </p>
          </div>

          {/* Primary Form Selection */}
          {module.primaryEntityTemplate && formTemplates.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-tertiary" />
                <Label htmlFor="primary-form" className="text-sm font-medium">
                  Primary Form
                </Label>
              </div>
              <Select
                value={selectedFormId ?? ''}
                onValueChange={(value) => setSelectedFormId(value || null)}
              >
                <SelectTrigger id="primary-form">
                  <SelectValue placeholder="Select primary form..." />
                </SelectTrigger>
                <SelectContent>
                  {formTemplates.map((form) => (
                    <SelectItem key={form.id} value={form.id}>
                      {form.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-tertiary">
                The form used when creating new {module.primaryEntityTemplate.name} entities.
              </p>
            </div>
          )}

          {/* Entity Templates Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Database className="size-4 text-tertiary" />
              <span className="text-sm font-medium">Entity Templates ({entityCount})</span>
            </div>

            {entityCount > 0 ? (
              <div className="space-y-2">
                {module.entityTemplates?.map((template) => (
                  <div
                    key={template.id}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg',
                      'bg-white/10 dark:bg-black/10 border border-accent/20'
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium text-primary">{template.name}</p>
                      <p className="text-xs text-tertiary font-mono">{template.code}</p>
                    </div>
                    {module.primaryEntityTemplate?.id === template.id && (
                      <Badge variant="info" size="sm">Primary</Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-tertiary">No entity templates configured.</p>
            )}
          </div>
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
            className="flex-1 sm:flex-initial"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

ModuleConfigSheet.displayName = 'ModuleConfigSheet'

export default ModuleConfigSheet
