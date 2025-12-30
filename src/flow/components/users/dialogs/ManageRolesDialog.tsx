/**
 * ManageRolesDialog - Dialog for managing user role assignments
 *
 * Shows assigned roles and allows adding/editing/removing.
 */

import * as React from 'react'
import { Shield, Plus, Loader2 } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog'
import { Button } from '../../../../components/ui/button'
import { Label } from '../../../../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import { RoleCard } from '../cards/RoleCard'
import { LocationScopeSelector } from '../location-scope/LocationScopeSelector'
import type {
  User,
  Role,
  LocationNode,
  LocationScope,
  RoleAssignment,
  AddRoleAssignmentFormData,
  EditRoleAssignmentFormData,
} from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface ManageRolesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  roles: Role[]
  locations: LocationNode[]
  onRoleAssign?: (userId: string, data: AddRoleAssignmentFormData) => Promise<void>
  onRoleAssignmentUpdate?: (userId: string, data: EditRoleAssignmentFormData) => Promise<void>
  onRoleAssignmentRemove?: (userId: string, assignmentId: string) => Promise<void>
}

// =============================================================================
// SUB-DIALOGS
// =============================================================================

interface AddRoleSubDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roles: Role[]
  locations: LocationNode[]
  existingRoleIds: string[]
  onSubmit: (data: AddRoleAssignmentFormData) => Promise<void>
}

function AddRoleSubDialog({
  open,
  onOpenChange,
  roles,
  locations,
  existingRoleIds,
  onSubmit,
}: AddRoleSubDialogProps) {
  const [selectedRoleId, setSelectedRoleId] = React.useState<string>('')
  const [selectedScopes, setSelectedScopes] = React.useState<LocationScope[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Available roles (not already assigned)
  const availableRoles = roles.filter((r) => !existingRoleIds.includes(r.id))

  const handleSubmit = async () => {
    if (!selectedRoleId) return
    setIsSubmitting(true)
    try {
      await onSubmit({ roleId: selectedRoleId, scopes: selectedScopes })
      onOpenChange(false)
      setSelectedRoleId('')
      setSelectedScopes([])
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="size-5 text-success" />
            Add Role Assignment
          </DialogTitle>
          <DialogDescription>
            Assign a role with optional location-specific permissions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role-select">Role *</Label>
            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
              <SelectTrigger id="role-select">
                <SelectValue placeholder="Select a role..." />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.length === 0 ? (
                  <div className="py-2 px-3 text-sm text-secondary">
                    No available roles
                  </div>
                ) : (
                  availableRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Location Scope</Label>
            <p className="text-xs text-secondary">
              Select locations where this role applies. Leave empty for global access.
            </p>
            <LocationScopeSelector
              locations={locations}
              selectedScopes={selectedScopes}
              onChange={setSelectedScopes}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedRoleId || isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Assign Role
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface EditRoleSubDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assignment: RoleAssignment | null
  locations: LocationNode[]
  onSubmit: (data: EditRoleAssignmentFormData) => Promise<void>
}

function EditRoleSubDialog({
  open,
  onOpenChange,
  assignment,
  locations,
  onSubmit,
}: EditRoleSubDialogProps) {
  const [selectedScopes, setSelectedScopes] = React.useState<LocationScope[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Initialize scopes when assignment changes
  React.useEffect(() => {
    if (assignment) {
      setSelectedScopes(assignment.scopes)
    }
  }, [assignment])

  const handleSubmit = async () => {
    if (!assignment) return
    setIsSubmitting(true)
    try {
      await onSubmit({ assignmentId: assignment.id, scopes: selectedScopes })
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!assignment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Role Assignment</DialogTitle>
          <DialogDescription>
            Modify the location scope for {assignment.role.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border border-default bg-surface p-3">
            <p className="font-medium text-primary">{assignment.role.name}</p>
            <p className="text-sm text-secondary">
              {assignment.role.permissions.length} permissions
            </p>
          </div>

          <div className="space-y-2">
            <Label>Location Scope</Label>
            <p className="text-xs text-secondary">
              Select locations where this role applies.
            </p>
            <LocationScopeSelector
              locations={locations}
              selectedScopes={selectedScopes}
              onChange={setSelectedScopes}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Update Assignment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface RemoveRoleSubDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assignment: RoleAssignment | null
  onConfirm: () => Promise<void>
}

function RemoveRoleSubDialog({
  open,
  onOpenChange,
  assignment,
  onConfirm,
}: RemoveRoleSubDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleConfirm = async () => {
    setIsSubmitting(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!assignment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-error">
            <Shield className="size-5" />
            Remove Role Assignment
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to remove the "{assignment.role.name}" role?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-secondary">
            Removing this assignment will immediately revoke the associated
            permissions for this user. This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Remove Assignment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ManageRolesDialog({
  open,
  onOpenChange,
  user,
  roles,
  locations,
  onRoleAssign,
  onRoleAssignmentUpdate,
  onRoleAssignmentRemove,
}: ManageRolesDialogProps) {
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false)
  const [selectedAssignment, setSelectedAssignment] = React.useState<RoleAssignment | null>(null)

  if (!user) return null

  const fullName = `${user.firstName} ${user.lastName}`
  const existingRoleIds = user.roleAssignments.map((ra) => ra.role.id)

  const handleAddRole = async (data: AddRoleAssignmentFormData) => {
    if (onRoleAssign) {
      await onRoleAssign(user.id, data)
    }
  }

  const handleEditRole = async (data: EditRoleAssignmentFormData) => {
    if (onRoleAssignmentUpdate) {
      await onRoleAssignmentUpdate(user.id, data)
    }
  }

  const handleRemoveRole = async () => {
    if (onRoleAssignmentRemove && selectedAssignment) {
      await onRoleAssignmentRemove(user.id, selectedAssignment.id)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
                <Shield className="size-5 text-accent" />
              </div>
              <div>
                <DialogTitle>Manage Roles</DialogTitle>
                <DialogDescription>
                  {fullName} • {user.email}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Header with Add button */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-primary">
                Assigned Roles ({user.roleAssignments.length})
              </h3>
              <Button
                size="sm"
                onClick={() => setAddDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="size-4" />
                Add Role
              </Button>
            </div>

            {/* Role cards */}
            {user.roleAssignments.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-default bg-surface py-8">
                <Shield className="size-8 text-tertiary" />
                <div className="text-center">
                  <p className="font-medium text-primary">No roles assigned</p>
                  <p className="text-sm text-secondary">
                    Add a role to grant permissions
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {user.roleAssignments.map((assignment) => (
                  <RoleCard
                    key={assignment.id}
                    role={assignment.role}
                    assignment={assignment}
                    onEdit={() => {
                      setSelectedAssignment(assignment)
                      setEditDialogOpen(true)
                    }}
                    onRemove={() => {
                      setSelectedAssignment(assignment)
                      setRemoveDialogOpen(true)
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Sub-dialogs */}
      <AddRoleSubDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        roles={roles}
        locations={locations}
        existingRoleIds={existingRoleIds}
        onSubmit={handleAddRole}
      />

      <EditRoleSubDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        assignment={selectedAssignment}
        locations={locations}
        onSubmit={handleEditRole}
      />

      <RemoveRoleSubDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        assignment={selectedAssignment}
        onConfirm={handleRemoveRole}
      />
    </>
  )
}

ManageRolesDialog.displayName = 'ManageRolesDialog'

export default ManageRolesDialog
