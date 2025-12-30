/**
 * DeleteEntryDialog - Confirmation dialog for deleting dictionary entries
 *
 * Shows entry details and warns about deletion impact.
 */

import * as React from 'react'
import { Trash2, Loader2, AlertTriangle, GitBranch } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog'
import { Button } from '../../../../components/ui/button'
import type { DictionaryEntry } from '../types'
import { getDescendantIds, findEntryById, buildEntryTree } from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface DeleteEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry: DictionaryEntry | null
  onConfirm: (entryId: string) => Promise<void>
  isSubmitting?: boolean
  /** All entries in the current category (for calculating descendants) */
  entries?: DictionaryEntry[]
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DeleteEntryDialog({
  open,
  onOpenChange,
  entry,
  onConfirm,
  isSubmitting = false,
  entries = [],
}: DeleteEntryDialogProps) {
  // Calculate descendants for cascade delete warning
  const { descendantCount, childEntries } = React.useMemo(() => {
    if (!entry || !entries.length) return { descendantCount: 0, childEntries: [] }

    // Build tree to get proper children populated
    const tree = buildEntryTree(entries)
    const entryWithChildren = findEntryById(tree, entry.id)

    if (!entryWithChildren) return { descendantCount: 0, childEntries: [] }

    const descendantIds = getDescendantIds(entryWithChildren)
    const children = entries.filter((e) => descendantIds.includes(e.id))

    return {
      descendantCount: descendantIds.length,
      childEntries: children.slice(0, 5), // Show first 5 for preview
    }
  }, [entry, entries])

  const totalDeleteCount = 1 + descendantCount

  const handleConfirm = React.useCallback(async () => {
    if (!entry) return
    await onConfirm(entry.id)
  }, [entry, onConfirm])

  if (!entry) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-error/10">
              <Trash2 className="size-5 text-error" />
            </div>
            <div>
              <DialogTitle>Delete Dictionary Entry</DialogTitle>
              <DialogDescription>
                This action cannot be undone
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-secondary">
            Are you sure you want to delete the dictionary entry{' '}
            <span className="font-semibold text-primary">"{entry.value}"</span>?
          </p>

          {/* Cascade Delete Warning */}
          {descendantCount > 0 ? (
            <div className="flex gap-3 rounded-lg border border-error/30 bg-error/5 p-3">
              <AlertTriangle className="size-4 shrink-0 text-error mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-error">
                  This will also delete {descendantCount} child {descendantCount === 1 ? 'entry' : 'entries'}
                </p>
                <p className="text-sm text-error/80">
                  All nested entries under this item will be permanently removed.
                </p>
                {/* Preview of child entries */}
                <div className="mt-2 space-y-1">
                  {childEntries.map((child) => (
                    <div key={child.id} className="flex items-center gap-2 text-xs text-error/70">
                      <GitBranch className="size-3" />
                      <span>{child.value}</span>
                    </div>
                  ))}
                  {descendantCount > 5 && (
                    <p className="text-xs text-error/60">
                      ...and {descendantCount - 5} more
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 rounded-lg border border-warning/30 bg-warning/5 p-3">
              <AlertTriangle className="size-4 shrink-0 text-warning mt-0.5" />
              <p className="text-sm text-warning">
                Deleting this entry may affect existing records that reference this value.
                Make sure no active records depend on this dictionary entry.
              </p>
            </div>
          )}

          {/* Entry Details */}
          <div className="rounded-lg border border-default bg-surface p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Code:</span>
              <code className="font-mono text-primary">{entry.code}</code>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Value:</span>
              <span className="text-primary">{entry.value}</span>
            </div>
            {entry.description && (
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Description:</span>
                <span className="text-primary line-clamp-1 max-w-[200px]">
                  {entry.description}
                </span>
              </div>
            )}
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
            {totalDeleteCount > 1 ? `Delete ${totalDeleteCount} Entries` : 'Delete Entry'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

DeleteEntryDialog.displayName = 'DeleteEntryDialog'

export default DeleteEntryDialog
