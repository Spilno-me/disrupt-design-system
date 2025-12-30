/**
 * DeleteUserDialog - Confirmation dialog for deleting users
 */

import * as React from 'react'
import { Trash2, Loader2, AlertTriangle, Shield, Briefcase } from 'lucide-react'
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
import type { User } from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface DeleteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onConfirm: () => Promise<void>
  isSubmitting?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DeleteUserDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
  isSubmitting = false,
}: DeleteUserDialogProps) {
  if (!user) return null

  const fullName = `${user.firstName} ${user.lastName}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-error/10">
              <Trash2 className="size-5 text-error" />
            </div>
            <div>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* User info */}
          <div className="rounded-lg border border-default bg-surface p-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-accent text-sm font-medium text-inverse">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-primary truncate">{fullName}</p>
                <p className="text-sm text-secondary truncate">{user.email}</p>
              </div>
            </div>

            {/* Additional context */}
            <div className="mt-3 flex flex-wrap gap-2 border-t border-default pt-3">
              <div className="flex items-center gap-1.5 text-xs text-secondary">
                <Briefcase className="size-3.5 text-tertiary" />
                <span>{user.jobTitle}</span>
                <span className="text-tertiary">•</span>
                <span>{user.department}</span>
              </div>
            </div>

            {/* Role assignments */}
            {user.roleAssignments.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Shield className="size-3.5 text-tertiary mt-0.5" />
                {user.roleAssignments.slice(0, 3).map((ra) => (
                  <Badge key={ra.id} variant="secondary" size="sm" className="font-normal">
                    {ra.role.name}
                  </Badge>
                ))}
                {user.roleAssignments.length > 3 && (
                  <Badge variant="outline" size="sm">
                    +{user.roleAssignments.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Warning */}
          <div className="flex gap-3 rounded-lg border border-error/30 bg-error/5 p-4">
            <AlertTriangle className="size-5 text-error shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-error">
                This action cannot be undone
              </p>
              <p className="text-sm text-secondary">
                Deleting this user will permanently remove their account
                {user.roleAssignments.length > 0 && (
                  <>, including {user.roleAssignments.length} role assignment{user.roleAssignments.length !== 1 ? 's' : ''}</>
                )}, and all associated data from the system.
              </p>
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
            Delete User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

DeleteUserDialog.displayName = 'DeleteUserDialog'

export default DeleteUserDialog
