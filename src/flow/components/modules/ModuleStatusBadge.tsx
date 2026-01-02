/**
 * ModuleStatusBadge - Status indicator for module lifecycle state
 *
 * Displays the current status of a module (Active, Inactive, Draft)
 * with appropriate semantic colors following DDS guidelines.
 *
 * @component ATOM
 */

import * as React from 'react'
import { Badge } from '../../../components/ui/badge'
import { MODULE_STATUS_CONFIG, isValidModuleStatus, type ModuleStatus } from './helpers'

// =============================================================================
// TYPES
// =============================================================================

export interface ModuleStatusBadgeProps {
  /** Module status value */
  status: ModuleStatus
  /** Badge size */
  size?: 'sm' | 'md' | 'lg'
  /** Additional class names */
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ModuleStatusBadge({
  status,
  size = 'sm',
  className,
}: ModuleStatusBadgeProps) {
  // Defensive: validate status before rendering
  if (!isValidModuleStatus(status)) {
    return (
      <Badge variant="destructive" size={size} className={className}>
        Invalid
      </Badge>
    )
  }

  const config = MODULE_STATUS_CONFIG[status]

  return (
    <Badge
      variant={config.variant}
      size={size}
      className={className}
      title={config.description}
    >
      {config.label}
    </Badge>
  )
}

ModuleStatusBadge.displayName = 'ModuleStatusBadge'

export default ModuleStatusBadge
