/**
 * RoleCard - Role display card with permissions
 *
 * Used in both RolesTab and ManageRolesDialog.
 * Enhanced with View/Edit/Delete actions and resource-level permission summaries.
 */

import * as React from 'react'
import { Shield, Users, Edit2, Trash2, MapPin, Info, Eye } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'
import type { Role, RoleAssignment, LocationScope, PermissionResource } from '../types'

// =============================================================================
// RESOURCE LABEL MAPPING
// =============================================================================

const RESOURCE_LABELS: Record<PermissionResource, string> = {
  incidents: 'Incidents',
  inspections: 'Inspections',
  permits: 'Permits',
  tasks: 'Tasks',
  users: 'Users',
  reports: 'Reports',
  settings: 'Settings',
  'corrective-actions': 'Actions',
  locations: 'Locations',
  modules: 'Modules',
  dictionary: 'Dictionary',
  'entity-templates': 'Templates',
  'process-definition-templates': 'Processes',
}

// =============================================================================
// TYPES
// =============================================================================

interface RoleCardProps {
  role: Role
  /** Role assignment data (when showing user's assigned role) */
  assignment?: RoleAssignment
  /** Show user count badge */
  showUserCount?: boolean
  /** Show role description */
  showDescription?: boolean
  /** Show action buttons footer (View, Edit, Delete) */
  showActions?: boolean
  /** Enable edit action (for role assignments - legacy) */
  onEdit?: () => void
  /** Enable remove action (for role assignments - legacy) */
  onRemove?: () => void
  /** View role permissions */
  onViewPermissions?: () => void
  /** Edit role (custom roles only) */
  onEditRole?: () => void
  /** Delete role (custom roles only) */
  onDeleteRole?: () => void
  className?: string
}

// =============================================================================
// ROLE ICON COLORS
// =============================================================================

const ROLE_COLORS: Record<string, { bg: string; icon: string }> = {
  'User': { bg: 'bg-info/10', icon: 'text-info' },
  'Admin': { bg: 'bg-error/10', icon: 'text-error' },
  'Super Administrator': { bg: 'bg-error/10', icon: 'text-error' },
  'Safety Manager': { bg: 'bg-success/10', icon: 'text-success' },
  'Safety Team': { bg: 'bg-success/10', icon: 'text-success' },
  'Incident Creator': { bg: 'bg-warning/10', icon: 'text-warning' },
  'Incident Manager': { bg: 'bg-warning/10', icon: 'text-warning' },
  'Corrective Action Creator': { bg: 'bg-accent/10', icon: 'text-accent' },
  'Corrective Action Manager': { bg: 'bg-accent/10', icon: 'text-accent' },
  default: { bg: 'bg-muted-bg', icon: 'text-tertiary' },
}

function getRoleColors(roleName: string) {
  return ROLE_COLORS[roleName] || ROLE_COLORS.default
}

// =============================================================================
// COMPONENT
// =============================================================================

export function RoleCard({
  role,
  assignment,
  showUserCount = false,
  showDescription = false,
  showActions = false,
  onEdit,
  onRemove,
  onViewPermissions,
  onEditRole,
  onDeleteRole,
  className,
}: RoleCardProps) {
  const colors = getRoleColors(role.name)
  const scopes = assignment?.scopes || []
  const maxVisiblePermissions = 4

  // Calculate total permission count
  const totalPermissions = role.permissions.reduce(
    (sum, p) => sum + p.actions.length,
    0
  )

  // Check if any action callbacks are provided
  const hasRoleActions = showActions && (onViewPermissions || onEditRole || onDeleteRole)

  return (
    <div
      data-slot="role-card"
      className={cn(
        // Depth 3 glass - content cards over blob background
        // Light: white glass, Dark: black glass
        'flex flex-col rounded-lg bg-white/20 dark:bg-black/20 backdrop-blur-[2px] border-2 border-accent p-4 shadow-sm',
        'transition-shadow hover:shadow-md',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={cn('flex size-10 items-center justify-center rounded-lg', colors.bg)}>
            <Shield className={cn('size-5', colors.icon)} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-primary">{role.name}</h3>
              {role.isSystem && (
                <Badge variant="warning" size="sm">
                  System
                </Badge>
              )}
            </div>
            {showDescription && role.description && (
              <p className="text-sm text-secondary line-clamp-2">{role.description}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        {(onEdit || onRemove) && (
          <div className="flex gap-1">
            {onEdit && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={onEdit}
                      aria-label="Edit assignment"
                    >
                      <Edit2 className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit assignment</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {onRemove && !role.isSystem && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-error hover:text-error"
                      onClick={onRemove}
                      aria-label="Remove role"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Remove role</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
      </div>

      {/* User count */}
      {showUserCount && (
        <div className="mt-3 flex items-center gap-2 text-sm text-secondary">
          <Users className="size-4 text-tertiary" />
          <span>
            {role.userCount} {role.userCount === 1 ? 'user' : 'users'}
          </span>
        </div>
      )}

      {/* Permissions - Resource-level summaries */}
      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-tertiary uppercase tracking-wide">
          Permissions ({totalPermissions})
        </p>
        <div className="flex flex-wrap gap-1">
          {role.permissions.slice(0, maxVisiblePermissions).map((permission) => (
            <Badge
              key={permission.id}
              variant="outline"
              size="sm"
              className="font-normal"
            >
              {RESOURCE_LABELS[permission.resource] || permission.resource}: {permission.actions.length}
            </Badge>
          ))}
          {role.permissions.length > maxVisiblePermissions && (
            <Badge variant="outline" size="sm">
              +{role.permissions.length - maxVisiblePermissions} more
            </Badge>
          )}
          {role.permissions.length === 0 && (
            <span className="text-sm text-tertiary">No permissions</span>
          )}
        </div>
      </div>

      {/* Location Scope (for assignments) */}
      {scopes.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-tertiary uppercase tracking-wide">
            Location Scope
          </p>
          <div className="flex flex-wrap gap-1">
            {scopes.slice(0, 2).map((scope) => (
              <Badge
                key={scope.id}
                variant="secondary"
                size="sm"
                className="font-normal gap-1"
              >
                <MapPin className="size-3" />
                {scope.locationName}
                {scope.includeChildren && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="size-3 text-tertiary" />
                      </TooltipTrigger>
                      <TooltipContent>Includes child locations</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </Badge>
            ))}
            {scopes.length > 2 && (
              <Badge variant="outline" size="sm">
                +{scopes.length - 2} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Actions Footer */}
      {hasRoleActions && (
        <div className="mt-4 flex items-center gap-2 border-t border-accent/30 pt-3">
          {onViewPermissions && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 min-h-9"
              onClick={onViewPermissions}
              aria-label={`View permissions for ${role.name}`}
            >
              <Eye className="size-4" />
              View
            </Button>
          )}
          {onEditRole && !role.isSystem && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 min-h-9"
              onClick={onEditRole}
              aria-label={`Edit ${role.name} role`}
            >
              <Edit2 className="size-4" />
              Edit
            </Button>
          )}
          {onDeleteRole && !role.isSystem && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 min-h-9 text-error hover:text-error"
              onClick={onDeleteRole}
              aria-label={`Delete ${role.name} role`}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

RoleCard.displayName = 'RoleCard'

export default RoleCard
