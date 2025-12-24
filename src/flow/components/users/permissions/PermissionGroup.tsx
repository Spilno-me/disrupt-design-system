/**
 * PermissionGroup - Collapsible resource-level permission section
 *
 * Implements progressive disclosure for permissions:
 * - Shows resource name with permission count when collapsed
 * - Expands to show individual PermissionItem rows
 */

import * as React from 'react'
import { ChevronDown, Settings2 } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../../../components/ui/badge'
import { PermissionItem } from './PermissionItem'
import type { EnhancedPermission, PermissionResource } from '../types'

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
  'corrective-actions': 'Corrective Actions',
  locations: 'Locations',
  modules: 'Modules',
  dictionary: 'Dictionary',
  'entity-templates': 'Entity Templates',
  'process-definition-templates': 'Process Definitions',
}

// =============================================================================
// TYPES
// =============================================================================

interface PermissionGroupProps {
  /** Resource type */
  resource: PermissionResource
  /** Permissions in this resource */
  permissions: EnhancedPermission[]
  /** Selected permission IDs (edit mode) */
  selectedIds?: string[]
  /** Callback when permission toggled (edit mode) */
  onToggle?: (permissionId: string, checked: boolean) => void
  /** Read-only mode - no checkboxes */
  readOnly?: boolean
  /** Show bitmask values (developer mode) */
  showBitmask?: boolean
  /** Default expanded state */
  defaultExpanded?: boolean
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function PermissionGroup({
  resource,
  permissions,
  selectedIds = [],
  onToggle,
  readOnly = false,
  showBitmask = false,
  defaultExpanded = false,
  className,
}: PermissionGroupProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

  const resourceLabel = RESOURCE_LABELS[resource] || resource
  const selectedCount = readOnly
    ? permissions.length
    : permissions.filter((p) => selectedIds.includes(p.id)).length
  const totalCount = permissions.length

  // In read-only mode, show selected count / total count
  // In edit mode, show selected count / total count
  const countLabel = readOnly
    ? `${selectedCount} permission${selectedCount !== 1 ? 's' : ''}`
    : `${selectedCount}/${totalCount}`

  const hasSelectedPermissions = selectedCount > 0

  return (
    <div
      data-slot="permission-group"
      className={cn(
        'rounded-lg border border-default overflow-hidden',
        className
      )}
    >
      {/* Header - clickable to expand/collapse */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'flex w-full items-center justify-between gap-3 p-3',
          'text-left transition-colors',
          'hover:bg-muted-bg/50',
          isExpanded && 'bg-muted-bg/30'
        )}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-accent/10 shrink-0">
            <Settings2 className="size-4 text-accent" />
          </div>
          <span className="font-medium text-primary">{resourceLabel}</span>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={hasSelectedPermissions ? 'success' : 'secondary'}
            size="sm"
          >
            {countLabel}
          </Badge>
          <ChevronDown
            className={cn(
              'size-4 text-tertiary transition-transform duration-200',
              isExpanded && 'rotate-180'
            )}
          />
        </div>
      </button>

      {/* Content - permission items */}
      {isExpanded && (
        <div className="border-t border-default px-3 pb-3 pt-1 space-y-0.5">
          {permissions.length === 0 ? (
            <p className="text-sm text-tertiary py-2 text-center">
              No permissions available
            </p>
          ) : (
            permissions.map((permission) => (
              <PermissionItem
                key={permission.id}
                permission={permission}
                checked={
                  readOnly ? true : selectedIds.includes(permission.id)
                }
                onChange={
                  !readOnly && onToggle
                    ? (checked) => onToggle(permission.id, checked)
                    : undefined
                }
                readOnly={readOnly}
                showBitmask={showBitmask}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

PermissionGroup.displayName = 'PermissionGroup'

export default PermissionGroup
