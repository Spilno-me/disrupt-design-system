/**
 * BulkActionsBar - Floating action bar for bulk operations
 *
 * Appears when users are selected, providing bulk assign/deactivate actions.
 */

import * as React from 'react'
import { X, ShieldPlus, UserMinus, Loader2 } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import { Label } from '../../../../components/ui/label'
import { LocationScopeSelector } from '../location-scope/LocationScopeSelector'
import type { Role, LocationNode, LocationScope, AddRoleAssignmentFormData } from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface SelectedUserPreview {
  id: string
  firstName: string
  lastName: string
}

interface BulkActionsBarProps {
  selectedCount: number
  /** Optional list of selected users for preview display */
  selectedUsers?: SelectedUserPreview[]
  roles: Role[]
  locations: LocationNode[]
  onAssignRole: (roleId: string, scopes: LocationScope[]) => Promise<void>
  onDeactivate: () => Promise<void>
  onClearSelection: () => void
  isSubmitting?: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

export function BulkActionsBar({
  selectedCount,
  selectedUsers = [],
  roles,
  locations,
  onAssignRole,
  onDeactivate,
  onClearSelection,
  isSubmitting = false,
}: BulkActionsBarProps) {
  const [assignDialogOpen, setAssignDialogOpen] = React.useState(false)
  const [deactivateDialogOpen, setDeactivateDialogOpen] = React.useState(false)
  const [selectedRoleId, setSelectedRoleId] = React.useState<string>('')
  const [selectedScopes, setSelectedScopes] = React.useState<LocationScope[]>([])

  const handleAssignSubmit = React.useCallback(async () => {
    if (!selectedRoleId) return
    await onAssignRole(selectedRoleId, selectedScopes)
    setAssignDialogOpen(false)
    setSelectedRoleId('')
    setSelectedScopes([])
  }, [selectedRoleId, selectedScopes, onAssignRole])

  const handleDeactivateConfirm = React.useCallback(async () => {
    await onDeactivate()
    setDeactivateDialogOpen(false)
  }, [onDeactivate])

  return (
    <>
      {/* Floating Action Bar - Depth 1 glass (elevated, floating UI) */}
      <div
        data-slot="bulk-actions-bar"
        className={cn(
          'fixed left-1/2 z-50 -translate-x-1/2',
          // Mobile: higher to avoid bottom nav; Desktop: standard position
          'bottom-20 sm:bottom-6',
          // Safe area padding for mobile devices with home indicators
          'pb-safe-area-inset-bottom',
          // Depth 1 glass - elevated floating element
          // Light: white glass, Dark: black glass
          'flex items-center gap-2 sm:gap-3 rounded-xl bg-white/60 dark:bg-black/60 backdrop-blur-[8px] border-2 border-accent px-3 sm:px-4 py-2.5 sm:py-3 shadow-lg',
          // Ensure minimum touch targets on mobile
          'max-w-[calc(100vw-2rem)]'
        )}
      >
        {/* Selected count */}
        <div className="flex items-center gap-2 pr-3 border-r border-accent/30">
          <span className="flex size-6 items-center justify-center rounded-full bg-accent text-xs font-medium text-inverse">
            {selectedCount}
          </span>
          <span className="text-sm font-medium text-primary">
            {selectedCount === 1 ? 'user' : 'users'} selected
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAssignDialogOpen(true)}
            disabled={isSubmitting}
            className="gap-2"
          >
            <ShieldPlus className="size-4" />
            Assign Role
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeactivateDialogOpen(true)}
            disabled={isSubmitting}
            className="gap-2 text-warning hover:text-warning"
          >
            <UserMinus className="size-4" />
            Deactivate
          </Button>
        </div>

        {/* Clear selection */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearSelection}
          className="ml-2 size-8"
          aria-label="Clear selection"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Bulk Assign Role Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Role to {selectedCount} Users</DialogTitle>
            <DialogDescription>
              Select a role and optionally define location scopes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Affected Users Preview */}
            {selectedUsers.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs text-tertiary">Affected Users</Label>
                <div className="max-h-24 overflow-y-auto rounded-md border border-default bg-muted-bg/50 p-2">
                  <div className="flex flex-wrap gap-1.5">
                    {selectedUsers.slice(0, 8).map((user) => (
                      <span
                        key={user.id}
                        className="inline-flex items-center rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-secondary"
                      >
                        {user.firstName} {user.lastName}
                      </span>
                    ))}
                    {selectedUsers.length > 8 && (
                      <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                        +{selectedUsers.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="bulk-role">Role *</Label>
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger id="bulk-role">
                  <SelectValue placeholder="Select a role..." />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                      {role.isSystem && (
                        <span className="ml-2 text-xs text-tertiary">(System)</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Scope */}
            <div className="space-y-2">
              <Label>Location Scope (Optional)</Label>
              <p className="text-xs text-secondary">
                Define where this role applies. Leave empty for global access.
              </p>
              <LocationScopeSelector
                locations={locations}
                selectedScopes={selectedScopes}
                onChange={setSelectedScopes}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignSubmit}
              disabled={!selectedRoleId || isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Assign Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Deactivate Dialog */}
      <Dialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Deactivate {selectedCount} Users?</DialogTitle>
            <DialogDescription>
              This will deactivate the selected users. They will no longer be able to
              log in until reactivated.
            </DialogDescription>
          </DialogHeader>

          {/* Affected Users Preview */}
          {selectedUsers.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs text-tertiary">Users to be deactivated</Label>
              <div className="max-h-24 overflow-y-auto rounded-md border border-default bg-muted-bg/50 p-2">
                <div className="flex flex-wrap gap-1.5">
                  {selectedUsers.slice(0, 8).map((user) => (
                    <span
                      key={user.id}
                      className="inline-flex items-center rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-secondary"
                    >
                      {user.firstName} {user.lastName}
                    </span>
                  ))}
                  {selectedUsers.length > 8 && (
                    <span className="inline-flex items-center rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
                      +{selectedUsers.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
            <p className="text-sm text-warning">
              <strong>Warning:</strong> Deactivated users will immediately lose access
              to the system. This action can be reversed by editing individual users.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeactivateDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeactivateConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Deactivate {selectedCount} Users
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

BulkActionsBar.displayName = 'BulkActionsBar'

export default BulkActionsBar
