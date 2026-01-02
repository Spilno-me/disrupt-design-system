/**
 * ModuleCard - Module display card with status, metadata, and actions
 *
 * Used in the modules configuration interface to display individual modules
 * with their status, entity count, and management actions.
 *
 * Follows DDS patterns:
 * - Glass-morphism styling (depth 3)
 * - 44px touch targets (Fitts' Law)
 * - ≤3 visible actions (Hick's Law)
 * - Disable don't hide for permissions
 * - Primary color for actions (not green)
 *
 * @component MOLECULE
 */

import * as React from 'react'
import {
  Database,
  Edit2,
  Eye,
  Plus,
  Power,
  Calendar,
  RefreshCw,
} from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../components/ui/tooltip'
import { ModuleStatusBadge } from './ModuleStatusBadge'
import {
  getModuleIcon,
  getModuleColors,
  formatRelativeDate,
  formatShortDate,
  type ModuleStatus,
} from './helpers'

// =============================================================================
// TYPES
// =============================================================================

/**
 * Entity template attached to a module.
 * Simplified from full Flow EntityTemplateResponse.
 */
export interface EntityTemplateInfo {
  id: string
  name: string
  code: string
}

/**
 * Module data structure for display.
 * Aligned with Flow ModuleItemResponse.
 */
export interface ModuleItem {
  id: string
  name: string
  code: string
  version: string
  status: ModuleStatus
  createdAt: Date | string
  updatedAt: Date | string
  entityTemplates?: EntityTemplateInfo[]
  primaryEntityTemplate?: EntityTemplateInfo
}

/**
 * Permission flags for module actions.
 */
export interface ModulePermissions {
  canView: boolean
  canEdit: boolean
  canToggleStatus: boolean
  canCreateEntity: boolean
}

export interface ModuleCardProps {
  /** Module data to display */
  module: ModuleItem
  /** Callback when module is opened/clicked */
  onOpen?: (module: ModuleItem) => void
  /** Callback when edit is clicked */
  onEdit?: (module: ModuleItem) => void
  /** Callback when status toggle is clicked */
  onToggleStatus?: (module: ModuleItem) => void
  /** Callback when create entity is clicked */
  onCreateEntity?: (module: ModuleItem) => void
  /** Permission flags for enabling/disabling actions */
  permissions?: ModulePermissions
  /** Additional class names */
  className?: string
}

// =============================================================================
// DEFAULT PERMISSIONS
// =============================================================================

const DEFAULT_PERMISSIONS: ModulePermissions = {
  canView: true,
  canEdit: true,
  canToggleStatus: true,
  canCreateEntity: true,
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ModuleCard({
  module,
  onOpen,
  onEdit,
  onToggleStatus,
  onCreateEntity,
  permissions = DEFAULT_PERMISSIONS,
  className,
}: ModuleCardProps) {
  const IconComponent = getModuleIcon(module.code)
  const colors = getModuleColors(module.code)
  const entityCount = module.entityTemplates?.length ?? 0

  // Check if user has any permission for actions
  const hasAnyActionPermission =
    permissions.canView || permissions.canEdit || permissions.canToggleStatus || permissions.canCreateEntity

  // Determine if module can have entities created
  const canCreate = module.status === 'active' && module.primaryEntityTemplate

  return (
    <div
      data-slot="module-card"
      className={cn(
        // Depth 2 glass - primary content cards over blob background
        'flex flex-col rounded-lg bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent p-4 shadow-md',
        'transition-all hover:shadow-lg hover:bg-white/50 dark:hover:bg-black/50',
        // Clickable card
        onOpen && 'cursor-pointer',
        className
      )}
      onClick={() => onOpen?.(module)}
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onKeyDown={(e) => {
        if (onOpen && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onOpen(module)
        }
      }}
    >
      {/* Header: Icon + Name + Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Module Icon */}
          <div className={cn('flex size-10 items-center justify-center rounded-lg', colors.bg)}>
            <IconComponent className={cn('size-5', colors.icon)} />
          </div>

          {/* Name + Version */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-primary">{module.name}</h3>
              <Badge variant="outline" size="sm" className="font-mono">
                v{module.version}
              </Badge>
            </div>
            {/* Code - monospace */}
            <p className="text-xs text-tertiary font-mono mt-0.5">{module.code}</p>
          </div>
        </div>

        {/* Status Badge */}
        <ModuleStatusBadge status={module.status} />
      </div>

      {/* Metadata Section */}
      <div className="mt-4 space-y-2">
        {/* Entity Templates Count */}
        <div className="flex items-center gap-2 text-sm text-secondary">
          <Database className="size-4 text-tertiary" />
          <span>
            {entityCount} {entityCount === 1 ? 'entity template' : 'entity templates'}
          </span>
        </div>

        {/* Primary Entity (if exists) */}
        {module.primaryEntityTemplate && (
          <div className="flex items-center gap-2">
            <Badge variant="info" size="sm" className="font-normal">
              Primary: {module.primaryEntityTemplate.name}
            </Badge>
          </div>
        )}

        {/* Dates */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-tertiary">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-1 cursor-help">
                  <Calendar className="size-3" />
                  Created {formatRelativeDate(module.createdAt)}
                </span>
              </TooltipTrigger>
              <TooltipContent>{formatShortDate(module.createdAt)}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-1 cursor-help">
                  <RefreshCw className="size-3" />
                  Updated {formatRelativeDate(module.updatedAt)}
                </span>
              </TooltipTrigger>
              <TooltipContent>{formatShortDate(module.updatedAt)}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Actions Footer - Only show if user has at least one permission */}
      {hasAnyActionPermission && (
        <div
          className="mt-4 flex items-center gap-2 border-t border-accent/30 pt-3"
          onClick={(e) => e.stopPropagation()} // Prevent card click
        >
          {/* View/Open */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 min-h-9"
                  disabled={!permissions.canView}
                  onClick={() => onOpen?.(module)}
                  aria-label={`View ${module.name} details`}
                >
                  <Eye className="size-4" />
                  View
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {permissions.canView ? 'View module details' : 'No permission to view'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Edit */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 min-h-9"
                  disabled={!permissions.canEdit}
                  onClick={() => onEdit?.(module)}
                  aria-label={`Edit ${module.name}`}
                >
                  <Edit2 className="size-4" />
                  Edit
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {permissions.canEdit ? 'Edit module settings' : 'No permission to edit'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Toggle Status */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'gap-1.5 min-h-9',
                    module.status === 'active' && 'text-warning hover:text-warning'
                  )}
                  disabled={!permissions.canToggleStatus || module.status === 'draft'}
                  onClick={() => onToggleStatus?.(module)}
                  aria-label={`Toggle ${module.name} status`}
                >
                  <Power className="size-4" />
                  {module.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {module.status === 'draft'
                  ? 'Draft modules cannot be toggled'
                  : !permissions.canToggleStatus
                    ? 'No permission to change status'
                    : module.status === 'active'
                      ? 'Deactivate this module'
                      : 'Activate this module'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Create Entity (only for active modules with primary entity) */}
          {canCreate && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-1.5 min-h-9 ml-auto"
                    disabled={!permissions.canCreateEntity}
                    onClick={() => onCreateEntity?.(module)}
                    aria-label={`Create ${module.primaryEntityTemplate?.name}`}
                  >
                    <Plus className="size-4" />
                    Create
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {permissions.canCreateEntity
                    ? `Create new ${module.primaryEntityTemplate?.name}`
                    : 'No permission to create entities'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}
    </div>
  )
}

ModuleCard.displayName = 'ModuleCard'

export default ModuleCard
