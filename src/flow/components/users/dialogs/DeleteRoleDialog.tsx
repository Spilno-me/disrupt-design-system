/**
 * DeleteRoleDialog - Confirmation dialog for deleting roles
 *
 * Shows role info, affected user count, and warning message.
 * CRITICAL: Follows correct button pattern - Cancel=outline, Delete=destructive
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
import { Badge } from '../../../../components/ui/badge'
import type { Role } from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface DeleteRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
  onConfirm: () => Promise<void>
  isSubmitting?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DeleteRoleDialog({
  open,
  onOpenChange,
  role,
  onConfirm,
  isSubmitting = false,
}: DeleteRoleDialogProps) {
  if (!role) return null

  // System roles cannot be deleted
  if (role.isSystem) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-warning/10">
                <Shield className="size-5 text-warning" />
              </div>
              <div>
                <DialogTitle>Cannot Delete System Role</DialogTitle>
                <DialogDescription>
                  System roles are protected and cannot be deleted
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-secondary">
              The role "{role.name}" is a system role required for core
              application functionality. System roles cannot be modified or
              deleted.
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

  const hasUsers = role.userCount > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-error/10">
              <Trash2 className="size-5 text-error" />
            </div>
            <div>
              <DialogTitle>Delete Role</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this role?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Role info */}
          <div className="flex items-center gap-3 rounded-lg border border-default bg-muted-bg/50 p-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
              <Shield className="size-5 text-accent" />
            </div>
            <div>
              <p className="font-medium text-primary">{role.name}</p>
              <p className="text-sm text-secondary">
                Custom role
                {hasUsers && (
                  <>
                    {' '}
                    • <span className="text-warning">{role.userCount} users affected</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="flex gap-3 rounded-lg border border-error/30 bg-error/5 p-4">
            <AlertTriangle className="size-5 text-error shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-error">
                This action cannot be undone
              </p>
              <p className="text-sm text-secondary">
                {hasUsers ? (
                  <>
                    Deleting this role will immediately revoke the associated
                    permissions for all {role.userCount} user{role.userCount !== 1 ? 's' : ''}.
                    These users will need to be reassigned to other roles.
                  </>
                ) : (
                  <>
                    This role will be permanently removed from the system. Any
                    references to this role will be cleared.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          {/* CORRECT: Cancel = outline (neutral), Delete = destructive (danger) */}
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
            Delete Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

DeleteRoleDialog.displayName = 'DeleteRoleDialog'

export default DeleteRoleDialog
