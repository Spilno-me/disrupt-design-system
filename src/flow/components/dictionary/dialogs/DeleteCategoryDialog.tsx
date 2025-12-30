/**
 * DeleteCategoryDialog - Confirmation dialog for deleting dictionary categories
 *
 * Shows category details and warns about deletion impact.
 * System categories cannot be deleted.
 */

import * as React from 'react'
import { Trash2, Loader2, AlertTriangle, Shield } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog'
import { Button } from '../../../../components/ui/button'
import type { DictionaryCategory } from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface DeleteCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: DictionaryCategory | null
  onConfirm: (categoryId: string) => Promise<void>
  isSubmitting?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
  onConfirm,
  isSubmitting = false,
}: DeleteCategoryDialogProps) {
  const handleConfirm = React.useCallback(async () => {
    if (!category) return
    await onConfirm(category.id)
  }, [category, onConfirm])

  if (!category) return null

  // System categories cannot be deleted
  if (category.type === 'system') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-warning/10">
                <Shield className="size-5 text-warning" />
              </div>
              <div>
                <DialogTitle>Cannot Delete System Category</DialogTitle>
                <DialogDescription>
                  System categories are protected and cannot be removed
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-secondary">
              The category "{category.name}" is a system category required for core
              application functionality. System categories cannot be modified or deleted.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-error/10">
              <Trash2 className="size-5 text-error" />
            </div>
            <div>
              <DialogTitle>Delete Category</DialogTitle>
              <DialogDescription>
                This action cannot be undone
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-secondary">
            Are you sure you want to delete the category{' '}
            <span className="font-semibold text-primary">"{category.name}"</span>?
          </p>

          {category.itemCount > 0 && (
            <div className="flex gap-3 rounded-lg border border-error/30 bg-error/5 p-3">
              <AlertTriangle className="size-4 shrink-0 text-error mt-0.5" />
              <p className="text-sm text-error">
                This category contains {category.itemCount} dictionary{' '}
                {category.itemCount === 1 ? 'entry' : 'entries'} that will also be deleted.
              </p>
            </div>
          )}

          <div className="flex gap-3 rounded-lg border border-warning/30 bg-warning/5 p-3">
            <AlertTriangle className="size-4 shrink-0 text-warning mt-0.5" />
            <p className="text-sm text-warning">
              Deleting this category may affect existing records that reference its dictionary values.
              Make sure no active records depend on this category.
            </p>
          </div>

          {/* Category Details */}
          <div className="rounded-lg border border-default bg-surface p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Name:</span>
              <span className="text-primary">{category.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Code:</span>
              <code className="font-mono text-primary">{category.code}</code>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Entries:</span>
              <span className="text-primary">{category.itemCount}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            Delete Category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

DeleteCategoryDialog.displayName = 'DeleteCategoryDialog'

export default DeleteCategoryDialog
