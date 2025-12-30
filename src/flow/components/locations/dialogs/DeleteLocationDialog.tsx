/**
 * DeleteLocationDialog - Confirmation dialog for deleting locations
 *
 * UX-optimized with single consolidated warning:
 * - Warning icon header with location name
 * - Location info (name, type, code) in warning box
 * - Single clear message about affected locations
 * - Reduced alert fatigue (no multiple warnings)
 */

import * as React from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Badge } from '../../../../components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog'
import { Button } from '../../../../components/ui/button'
import { LOCATION_TYPE_CONFIG, type DeleteLocationDialogProps } from '../types'

export function DeleteLocationDialog({
  open,
  onOpenChange,
  location,
  childCount,
  onConfirm,
  isSubmitting = false,
}: DeleteLocationDialogProps) {
  if (!location) return null

  const typeConfig = LOCATION_TYPE_CONFIG[location.type]
  const totalToDelete = childCount + 1 // Include the location itself
  const hasChildren = childCount > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-error/10">
              <AlertTriangle className="size-5 text-error" />
            </div>
            <div>
              <DialogTitle>Delete {location.name}?</DialogTitle>
              <DialogDescription>
                This action will permanently delete{' '}
                <strong>{location.name}</strong>
                {hasChildren && ' and all containing locations'}. This cannot be
                undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Consolidated warning - single clear message */}
        <div className="py-4">
          <div className="rounded-lg border border-error/30 bg-error/5 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="size-5 text-error shrink-0 mt-0.5" />
              <div className="space-y-2">
                {/* Location info */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-primary">
                    {location.name}
                  </span>
                  <Badge variant={typeConfig.variant} size="sm">
                    {typeConfig.label}
                  </Badge>
                  <Badge
                    variant="outline"
                    size="sm"
                    className="bg-warning/10 text-warning-dark border-warning/30"
                  >
                    {location.code}
                  </Badge>
                </div>

                {/* Warning message */}
                <p className="text-sm font-medium text-error">
                  {hasChildren
                    ? `Delete ${totalToDelete} locations permanently?`
                    : 'Delete this location permanently?'}
                </p>
                <p className="text-sm text-secondary">
                  {hasChildren
                    ? `This will remove "${location.name}" and ${childCount} nested location${childCount !== 1 ? 's' : ''}. This action cannot be undone.`
                    : `This will remove "${location.name}" and all associated data. This action cannot be undone.`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Delete {hasChildren ? `${totalToDelete} Locations` : 'Location'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

DeleteLocationDialog.displayName = 'DeleteLocationDialog'

export default DeleteLocationDialog
