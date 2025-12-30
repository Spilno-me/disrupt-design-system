/**
 * DeleteTemplateDialog - Confirmation dialog for deleting entity templates
 *
 * Shows a warning before permanently deleting a template.
 * System templates cannot be deleted.
 * Responsive: Bottom sheet on mobile, centered dialog on desktop.
 *
 * Design Note: This component handles two states (system rejection + delete confirm)
 * via internal sub-components (SystemTemplateContent, DeleteConfirmContent).
 * This is intentional - both states share the same dialog shell and responsive
 * behavior, making extraction premature. Split only if requirements diverge.
 *
 * @component MOLECULE
 * @testId Auto-generated: delete-template-dialog-{id}, delete-template-close-{id} (system),
 *         delete-template-cancel-{id}, delete-template-confirm-{id}
 */

import * as React from 'react'
import { AlertTriangle } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { useIsMobile } from '../../../../hooks/useIsMobile'
import { BREAKPOINTS } from '../../../../constants/appConstants'
import { Button } from '../../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../../../components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '../../../../components/ui/sheet'
import type { DeleteTemplateDialogProps } from '../types'

// =============================================================================
// SHARED CONTENT COMPONENTS
// =============================================================================

interface SystemTemplateContentProps {
  template: NonNullable<DeleteTemplateDialogProps['template']>
  onClose: () => void
  isMobile?: boolean
}

function SystemTemplateContent({ template, onClose, isMobile }: SystemTemplateContentProps) {
  return (
    <div className="flex flex-col">
      <p className="text-secondary">
        System templates are managed by the application and cannot be deleted.
      </p>

      {/* Footer - inline in flow */}
      <div className={cn(
        'mt-6 flex',
        isMobile ? 'flex-col' : 'justify-end'
      )}>
        {isMobile ? (
          // Use SheetClose for proper slide-out animation
          <SheetClose asChild>
            <Button
              variant="outline"
              className="w-full"
              data-testid={`delete-template-close-${template.id}`}
            >
              Close
            </Button>
          </SheetClose>
        ) : (
          <Button
            variant="outline"
            onClick={onClose}
            data-testid={`delete-template-close-${template.id}`}
          >
            Close
          </Button>
        )}
      </div>
    </div>
  )
}

interface DeleteConfirmContentProps {
  template: NonNullable<DeleteTemplateDialogProps['template']>
  isDeleting: boolean
  error: string | null
  onCancel: () => void
  onConfirm: () => void
  isMobile?: boolean
}

function DeleteConfirmContent({
  template,
  isDeleting,
  error,
  onCancel,
  onConfirm,
  isMobile,
}: DeleteConfirmContentProps) {
  return (
    <div className="flex flex-col">
      {/* Error message */}
      {error && (
        <div className="mb-4 rounded-lg border border-error bg-error/10 p-3">
          <p className="text-sm text-error font-medium">{error}</p>
        </div>
      )}

      {/* Content area */}
      <div className="space-y-4">
        {/* Warning message */}
        <div className="rounded-lg border border-error/30 bg-error/5 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="size-5 text-error shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-primary">
                Delete "{template.name}" permanently?
              </p>
              <p className="text-sm text-secondary">
                This will remove the template and all associated configuration.
                Any entities using this template will not be affected, but you won't
                be able to create new entities with this template.
              </p>
            </div>
          </div>
        </div>

        {/* Template info - inline on mobile too for compactness */}
        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm">
          <div>
            <span className="text-secondary">Code: </span>
            <code className="font-mono font-medium text-primary bg-muted-bg px-1.5 py-0.5 rounded">
              {template.code}
            </code>
          </div>
          <div>
            <span className="text-secondary">Version: </span>
            <span className="font-medium text-primary">{template.version}</span>
          </div>
        </div>
      </div>

      {/* Footer - inline in flow, right-aligned on desktop */}
      <div className={cn(
        'mt-6 flex gap-2',
        isMobile ? 'flex-col-reverse' : 'justify-end'
      )}>
        {isMobile ? (
          // Use SheetClose for proper slide-out animation
          <SheetClose asChild>
            <Button
              variant="outline"
              disabled={isDeleting}
              className="w-full"
              data-testid={`delete-template-cancel-${template.id}`}
            >
              Cancel
            </Button>
          </SheetClose>
        ) : (
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isDeleting}
            data-testid={`delete-template-cancel-${template.id}`}
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={onConfirm}
          disabled={isDeleting}
          className={cn(
            'bg-error hover:bg-error/90 text-white',
            isMobile && 'w-full'
          )}
          data-testid={`delete-template-confirm-${template.id}`}
        >
          {isDeleting ? 'Deleting...' : 'Delete Template'}
        </Button>
      </div>
    </div>
  )
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DeleteTemplateDialog({
  template,
  open,
  onOpenChange,
  onConfirm,
}: DeleteTemplateDialogProps) {
  const isMobile = useIsMobile(BREAKPOINTS.LG)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Reset error when dialog opens/closes
  React.useEffect(() => {
    if (open) {
      setError(null)
    }
  }, [open])

  // Handle delete confirmation
  const handleConfirm = React.useCallback(async () => {
    if (!template) return

    setIsDeleting(true)
    setError(null)
    try {
      await onConfirm?.(template.id)
      onOpenChange(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete template. Please try again.'
      setError(message)
      console.error('Delete template error:', err)
    } finally {
      setIsDeleting(false)
    }
  }, [template, onConfirm, onOpenChange])

  if (!template) return null

  const handleClose = () => onOpenChange(false)

  // ==========================================================================
  // SYSTEM TEMPLATE (Cannot delete)
  // ==========================================================================
  if (template.isSystem) {
    // Mobile: Bottom sheet - auto height, content-driven
    if (isMobile) {
      return (
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent
            side="bottom"
            className="rounded-t-xl p-0"
            data-testid={`delete-template-dialog-${template.id}`}
          >
            {/* Drag handle indicator */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted" />
            </div>

            {/* Header */}
            <SheetHeader className="px-4 pb-3 border-b border-default">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 p-2 rounded-lg bg-error/10">
                  <AlertTriangle className="w-5 h-5 text-error" />
                </div>
                <div className="flex-1 min-w-0">
                  <SheetTitle className="text-base font-semibold">
                    Cannot Delete System Template
                  </SheetTitle>
                  <SheetDescription className="text-sm">
                    Action not allowed
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            {/* Content - natural flow */}
            <div className="p-4 pb-8">
              <SystemTemplateContent
                template={template}
                onClose={handleClose}
                isMobile
              />
            </div>
          </SheetContent>
        </Sheet>
      )
    }

    // Desktop: Dialog
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-w-md"
          data-testid={`delete-template-dialog-${template.id}`}
        >
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 p-2 rounded-lg bg-error/10">
                <AlertTriangle className="w-5 h-5 text-error" />
              </div>
              <div>
                <DialogTitle>Cannot Delete System Template</DialogTitle>
                <DialogDescription className="mt-1">
                  Action not allowed
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <SystemTemplateContent
            template={template}
            onClose={handleClose}
          />
        </DialogContent>
      </Dialog>
    )
  }

  // ==========================================================================
  // DELETE CONFIRMATION
  // ==========================================================================

  // Mobile: Bottom sheet - auto height, content-driven
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="rounded-t-xl p-0"
          data-testid={`delete-template-dialog-${template.id}`}
        >
          {/* Drag handle indicator */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-muted" />
          </div>

          {/* Header */}
          <SheetHeader className="px-4 pb-3 border-b border-default">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 p-2 rounded-lg bg-error/10">
                <AlertTriangle className="w-5 h-5 text-error" />
              </div>
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-base font-semibold">
                  Delete Template
                </SheetTitle>
                <SheetDescription className="text-sm">
                  This action cannot be undone
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* Content - natural flow, no fixed height */}
          <div className="p-4 pb-8">
            <DeleteConfirmContent
              template={template}
              isDeleting={isDeleting}
              error={error}
              onCancel={handleClose}
              onConfirm={handleConfirm}
              isMobile
            />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop: Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md"
        data-testid={`delete-template-dialog-${template.id}`}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 p-2 rounded-lg bg-error/10">
              <AlertTriangle className="w-5 h-5 text-error" />
            </div>
            <div>
              <DialogTitle>Delete Template</DialogTitle>
              <DialogDescription className="mt-1">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DeleteConfirmContent
          template={template}
          isDeleting={isDeleting}
          error={error}
          onCancel={handleClose}
          onConfirm={handleConfirm}
        />
      </DialogContent>
    </Dialog>
  )
}

DeleteTemplateDialog.displayName = 'DeleteTemplateDialog'

export default DeleteTemplateDialog
