/**
 * ViewRolePermissionsDialog - Read-only view of role permissions
 *
 * Shows role details and permissions with progressive disclosure.
 * Includes developer mode toggle to show bitmask values.
 */

import * as React from 'react'
import { Eye, Shield, Users } from 'lucide-react'
import { cn } from '../../../../lib/utils'
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
import { Label } from '../../../../components/ui/label'
import { Checkbox } from '../../../../components/ui/checkbox'
import { PermissionGroup } from '../permissions/PermissionGroup'
import type { Role, EnhancedPermission, PermissionResource } from '../types'

// =============================================================================
// TYPES
// =============================================================================

interface ViewRolePermissionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
}

// =============================================================================
// HELPER: Convert Role permissions to EnhancedPermission format
// =============================================================================

function convertToEnhancedPermissions(
  role: Role
): Map<PermissionResource, EnhancedPermission[]> {
  const grouped = new Map<PermissionResource, EnhancedPermission[]>()

  // Standard bitmask values
  const ACTION_BITMASKS: Record<string, number> = {
    create: 1,
    read: 2,
    update: 4,
    delete: 8,
    manage: 64,
    'read-own': 256,
    'update-own': 512,
    approve: 1024,
    'manage-own-tasks': 16384,
  }

  role.permissions.forEach((permission) => {
    const enhancedPerms = permission.actions.map((action) => ({
      id: `${permission.resource}-${action}`,
      resource: permission.resource,
      action,
      category: action.includes('manage') || action === 'delete'
        ? ('management' as const)
        : ('access' as const),
      bitmask: ACTION_BITMASKS[action] || 0,
      label: formatActionLabel(action, permission.resource),
      description: getActionDescription(action, permission.resource),
    }))

    const existing = grouped.get(permission.resource) || []
    grouped.set(permission.resource, [...existing, ...enhancedPerms])
  })

  return grouped
}

function formatActionLabel(action: string, resource: string): string {
  const resourceLabel = resource.replace(/-/g, ' ')
  const actionLabels: Record<string, string> = {
    create: `Create ${resourceLabel}`,
    read: `Read ${resourceLabel}`,
    update: `Update ${resourceLabel}`,
    delete: `Delete ${resourceLabel}`,
    approve: `Approve ${resourceLabel}`,
    'read-own': `Read own ${resourceLabel}`,
    'update-own': `Update own ${resourceLabel}`,
    'manage-own-tasks': 'Manage own tasks and forms',
  }
  return actionLabels[action] || action
}

function getActionDescription(action: string, resource: string): string {
  const descriptions: Record<string, string> = {
    create: `Permission to create new ${resource.replace(/-/g, ' ')} records`,
    read: `Permission to view all ${resource.replace(/-/g, ' ')} data`,
    update: `Permission to modify ${resource.replace(/-/g, ' ')} records`,
    delete: `Permission to permanently remove ${resource.replace(/-/g, ' ')} records`,
    approve: `Permission to approve ${resource.replace(/-/g, ' ')} submissions`,
    'read-own': `Permission to view only records you created`,
    'update-own': `Permission to modify only records you created`,
    'manage-own-tasks': 'Permission to manage tasks and forms assigned to you',
  }
  return descriptions[action] || ''
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ViewRolePermissionsDialog({
  open,
  onOpenChange,
  role,
}: ViewRolePermissionsDialogProps) {
  const [showDevMode, setShowDevMode] = React.useState(false)

  if (!role) return null

  const permissionsByResource = convertToEnhancedPermissions(role)
  const totalPermissions = role.permissions.reduce(
    (sum, p) => sum + p.actions.length,
    0
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-info/10">
              <Eye className="size-5 text-info" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <DialogTitle>{role.name}</DialogTitle>
                {role.isSystem && (
                  <Badge variant="warning" size="sm">
                    System
                  </Badge>
                )}
              </div>
              <DialogDescription>
                View permissions assigned to this role
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Role Details */}
        <div className="rounded-lg bg-muted-bg/50 p-4 space-y-3">
          {role.description && (
            <p className="text-sm text-secondary">{role.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-secondary">
              <Users className="size-4 text-tertiary" />
              <span>
                {role.userCount} {role.userCount === 1 ? 'user' : 'users'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-secondary">
              <Shield className="size-4 text-tertiary" />
              <span>{totalPermissions} permissions</span>
            </div>
          </div>
        </div>

        {/* Developer Mode Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primary">
            Assigned Permissions ({totalPermissions})
          </span>
          <div className="flex items-center gap-2">
            <Checkbox
              id="dev-mode-view"
              checked={showDevMode}
              onCheckedChange={(checked) => setShowDevMode(checked as boolean)}
            />
            <Label
              htmlFor="dev-mode-view"
              className="text-xs text-secondary cursor-pointer"
            >
              Dev Mode
            </Label>
          </div>
        </div>

        {/* Permission Groups - Scrollable */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {permissionsByResource.size === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-default bg-muted-bg/30 py-8">
              <Shield className="size-8 text-tertiary" />
              <p className="text-sm text-secondary">
                No permissions assigned to this role
              </p>
            </div>
          ) : (
            Array.from(permissionsByResource.entries()).map(
              ([resource, permissions]) => (
                <PermissionGroup
                  key={resource}
                  resource={resource}
                  permissions={permissions}
                  readOnly
                  showBitmask={showDevMode}
                  defaultExpanded={permissionsByResource.size <= 3}
                />
              )
            )
          )}
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

ViewRolePermissionsDialog.displayName = 'ViewRolePermissionsDialog'

export default ViewRolePermissionsDialog
