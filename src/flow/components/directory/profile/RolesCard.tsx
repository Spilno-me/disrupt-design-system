/**
 * RolesCard - Roles and permissions card for user profile
 *
 * Shows all roles assigned to the user with their permissions.
 */

import * as React from 'react'
import { useState } from 'react'
import { Shield, ChevronDown, Check } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../../../components/ui/badge'
import { ROLE_LEVEL_CONFIG } from '../../users/types'
import type { UserProfileData } from '../types'
import type { RoleAssignment, Permission, PermissionResource } from '../../users/types'

interface RolesCardProps {
  /** User profile data */
  profile: UserProfileData
}

// Resource display names
const RESOURCE_LABELS: Record<PermissionResource, string> = {
  incidents: 'Incidents',
  inspections: 'Inspections',
  permits: 'Permits',
  tasks: 'Tasks',
  users: 'Users',
  reports: 'Reports',
  settings: 'Settings',
  'corrective-actions': 'Corrective Actions',
  locations: 'Locations',
  modules: 'Modules',
  dictionary: 'Dictionary',
  'entity-templates': 'Entity Templates',
  'process-definition-templates': 'Process Templates',
}

interface RoleItemProps {
  assignment: RoleAssignment
}

function RoleItem({ assignment }: RoleItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const role = assignment.role
  const roleLevelConfig = role.level ? ROLE_LEVEL_CONFIG[role.level] : null

  // Group permissions by resource
  const permissionsByResource = role.permissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) {
      acc[perm.resource] = []
    }
    acc[perm.resource].push(perm)
    return acc
  }, {} as Record<PermissionResource, Permission[]>)

  return (
    <div className="border border-default rounded-lg overflow-hidden">
      {/* Role header */}
      <button
        type="button"
        className={cn(
          'w-full flex items-center gap-3 p-4 transition-colors text-left',
          'hover:bg-muted-bg/50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-strong'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-center size-10 rounded-full bg-accent/10 shrink-0">
          <Shield className="size-5 text-accent" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-primary">{role.name}</p>
            {role.isSystem && (
              <Badge variant="secondary" size="sm">
                System
              </Badge>
            )}
          </div>
          {role.description && (
            <p className="text-xs text-secondary truncate">{role.description}</p>
          )}
          {roleLevelConfig && (
            <Badge variant={roleLevelConfig.badgeVariant} size="sm" className="mt-1">
              {roleLevelConfig.label}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" size="sm">
            {role.permissions.length} permissions
          </Badge>
          <ChevronDown
            className={cn(
              'size-4 text-tertiary transition-transform',
              isExpanded && 'rotate-180'
            )}
          />
        </div>
      </button>

      {/* Expanded permissions */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 bg-muted-bg/30 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="space-y-3">
            {Object.entries(permissionsByResource).map(([resource, perms]) => (
              <div key={resource}>
                <p className="text-xs font-medium text-secondary uppercase tracking-wider mb-1.5">
                  {RESOURCE_LABELS[resource as PermissionResource] || resource}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {perms.flatMap((perm) =>
                    perm.actions.map((action) => (
                      <Badge
                        key={`${perm.id}-${action}`}
                        variant="outline"
                        size="sm"
                        className="gap-1 bg-surface"
                      >
                        <Check className="size-3 text-success" />
                        {action.replace('-', ' ')}
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function RolesCard({ profile }: RolesCardProps) {
  if (profile.roleAssignments.length === 0) {
    return (
      <div className="p-4 bg-surface border border-default rounded-xl">
        <h3 className="text-sm font-semibold text-primary mb-3">
          Roles & Permissions
        </h3>
        <div className="py-6 text-center">
          <Shield className="size-8 text-tertiary mx-auto mb-2" />
          <p className="text-sm text-secondary">No roles assigned</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-surface border border-default rounded-xl">
      <h3 className="text-sm font-semibold text-primary mb-3">
        Roles & Permissions
      </h3>

      <div className="space-y-3">
        {profile.roleAssignments.map((assignment) => (
          <RoleItem key={assignment.id} assignment={assignment} />
        ))}
      </div>
    </div>
  )
}

RolesCard.displayName = 'RolesCard'

export default RolesCard
