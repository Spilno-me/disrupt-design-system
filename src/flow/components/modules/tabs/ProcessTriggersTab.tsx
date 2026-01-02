/**
 * ProcessTriggersTab - Entity-to-workflow triggers for automated process initiation
 *
 * Manages EntityActionProcessTrigger configurations that auto-start workflows
 * when entities are created or updated.
 *
 * Key EMEX concepts:
 * - triggerAction: 'create' or 'update' events
 * - Variable mappings: Handlebars templates ({{entity.field}} → process variable)
 * - Candidate group assignment via user group codes
 *
 * @component ORGANISM
 */

import * as React from 'react'
import { useState, useMemo } from 'react'
import {
  Zap,
  Plus,
  Edit2,
  ChevronRight,
  Search,
  Play,
  Pause,
  ArrowRight,
  FileText,
  GitBranch,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { Input } from '../../../../components/ui/input'
import { EmptyState } from '../../../../components/ui/EmptyState'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'
import type { ModulePermissions } from '../ModuleCard'

// =============================================================================
// TYPES
// =============================================================================

export type TriggerAction = 'create' | 'update'

/**
 * Variable mapping from entity field to process variable
 * Uses Handlebars template syntax for complex mappings
 */
export interface VariableMapping {
  /** Process variable name */
  processVariable: string
  /**
   * Source template - can be:
   * - Simple field: {{entity.title}}
   * - Nested field: {{entity.location.name}}
   * - Form field: {{form.actionOwner}}
   * - Static value: "hardcoded"
   */
  sourceTemplate: string
  /** Optional description of what this mapping does */
  description?: string
}

/**
 * ProcessTriggerItem - Configuration for auto-starting workflows
 *
 * Enhanced to match EMEX EntityActionProcessTrigger:
 * - Links entity templates to process definitions
 * - Supports variable mapping via Handlebars templates
 * - Can be enabled/disabled without deletion
 */
export interface ProcessTriggerItem {
  id: string
  /** Human-readable trigger name */
  name: string
  /** Optional description */
  description?: string
  /** Module this trigger belongs to (FK scoping) */
  moduleId?: string

  // Trigger Configuration
  /** Entity template code that triggers this workflow */
  entityTemplateCode: string
  /** Entity template name for display */
  entityTemplateName?: string
  /** Action that triggers the workflow */
  triggerAction: TriggerAction
  /** Optional condition expression (future: SpEL or similar) */
  conditionExpression?: string

  // Process Configuration
  /** Target process definition key */
  processDefinitionKey: string
  /** Process definition name for display */
  processDefinitionName?: string
  /** Variable mappings from entity to process */
  variableMappings: VariableMapping[]

  // Status
  /** Whether the trigger is currently active */
  isActive: boolean
  /** Is this a system trigger that can't be deleted */
  isSystem?: boolean

  createdAt: Date | string
  updatedAt: Date | string
}

export interface ProcessTriggersTabProps {
  moduleId: string
  triggers: ProcessTriggerItem[]
  isLoading?: boolean
  onTriggerClick?: (triggerId: string) => void
  onEdit?: (triggerId: string) => void
  onToggleActive?: (triggerId: string, isActive: boolean) => void
  onCreate?: () => void
  permissions?: ModulePermissions
  className?: string
}

// =============================================================================
// CONSTANTS
// =============================================================================

const TRIGGER_ACTION_CONFIG: Record<
  TriggerAction,
  { label: string; description: string }
> = {
  create: { label: 'On Create', description: 'Triggers when entity is created' },
  update: { label: 'On Update', description: 'Triggers when entity is updated' },
}

// =============================================================================
// COMPONENTS
// =============================================================================

function TriggerRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-muted-bg/50" />
        <div className="space-y-2">
          <div className="h-4 w-48 rounded bg-muted-bg/50" />
          <div className="h-3 w-32 rounded bg-muted-bg/30" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-6 w-16 rounded bg-muted-bg/30" />
        <div className="h-8 w-8 rounded bg-muted-bg/30" />
      </div>
    </div>
  )
}

interface TriggerRowProps {
  trigger: ProcessTriggerItem
  onTriggerClick?: (triggerId: string) => void
  onEdit?: (triggerId: string) => void
  onToggleActive?: (triggerId: string, isActive: boolean) => void
  canEdit?: boolean
}

function TriggerRow({
  trigger,
  onTriggerClick,
  onEdit,
  onToggleActive,
  canEdit = true,
}: TriggerRowProps) {
  const actionConfig = TRIGGER_ACTION_CONFIG[trigger.triggerAction]

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 p-4 rounded-lg transition-colors hover:bg-muted-bg/50',
        onTriggerClick && 'cursor-pointer',
        !trigger.isActive && 'opacity-60'
      )}
      onClick={() => onTriggerClick?.(trigger.id)}
      role={onTriggerClick ? 'button' : undefined}
      tabIndex={onTriggerClick ? 0 : undefined}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className={cn(
            'flex size-10 items-center justify-center rounded-lg shrink-0',
            trigger.isActive ? 'bg-success/10' : 'bg-muted-bg/50'
          )}
        >
          <Zap
            className={cn(
              'size-5',
              trigger.isActive ? 'text-success' : 'text-tertiary'
            )}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-primary truncate">
              {trigger.name}
            </span>
            <Badge
              variant={trigger.triggerAction === 'create' ? 'info' : 'secondary'}
              size="sm"
            >
              {actionConfig.label}
            </Badge>
            {trigger.isSystem && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="warning" size="sm">
                      System
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    System trigger - cannot be deleted
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          {/* Flow visualization: Entity → Process */}
          <div className="flex items-center gap-2 text-xs text-tertiary mt-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1 font-mono bg-muted-bg/30 px-1.5 py-0.5 rounded">
                    <FileText className="size-3" />
                    {trigger.entityTemplateCode}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {trigger.entityTemplateName || 'Entity Template'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <ArrowRight className="size-3 text-accent" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1 font-mono bg-muted-bg/30 px-1.5 py-0.5 rounded">
                    <GitBranch className="size-3" />
                    {trigger.processDefinitionKey}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {trigger.processDefinitionName || 'Process Definition'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {trigger.variableMappings.length > 0 && (
              <>
                <span>•</span>
                <span>
                  {trigger.variableMappings.length}{' '}
                  {trigger.variableMappings.length === 1
                    ? 'mapping'
                    : 'mappings'}
                </span>
              </>
            )}
          </div>

          {trigger.description && (
            <p className="text-xs text-secondary mt-1 line-clamp-1">
              {trigger.description}
            </p>
          )}
        </div>
      </div>

      <div
        className="flex items-center gap-2 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <Badge variant={trigger.isActive ? 'success' : 'outline'} size="sm">
          {trigger.isActive ? 'Active' : 'Inactive'}
        </Badge>

        {onToggleActive && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'size-8',
                    trigger.isActive
                      ? 'text-warning hover:text-warning'
                      : 'text-success hover:text-success'
                  )}
                  disabled={!canEdit}
                  onClick={() => onToggleActive(trigger.id, !trigger.isActive)}
                >
                  {trigger.isActive ? (
                    <Pause className="size-4" />
                  ) : (
                    <Play className="size-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {canEdit
                  ? trigger.isActive
                    ? 'Deactivate trigger'
                    : 'Activate trigger'
                  : 'No permission'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {onEdit && !trigger.isSystem && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  disabled={!canEdit}
                  onClick={() => onEdit(trigger.id)}
                >
                  <Edit2 className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {canEdit ? 'Edit trigger' : 'No permission'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {onTriggerClick && <ChevronRight className="size-4 text-tertiary" />}
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ProcessTriggersTab({
  moduleId,
  triggers,
  isLoading = false,
  onTriggerClick,
  onEdit,
  onToggleActive,
  onCreate,
  permissions,
  className,
}: ProcessTriggersTabProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const canEdit = permissions?.canEdit ?? true
  const canCreate = permissions?.canEdit ?? true

  const filteredTriggers = useMemo(() => {
    if (!searchTerm.trim()) return triggers
    const lower = searchTerm.toLowerCase()
    return triggers.filter(
      (t) =>
        t.name.toLowerCase().includes(lower) ||
        t.entityTemplateCode.toLowerCase().includes(lower) ||
        t.processDefinitionKey.toLowerCase().includes(lower)
    )
  }, [triggers, searchTerm])

  const stats = useMemo(
    () => ({
      total: triggers.length,
      active: triggers.filter((t) => t.isActive).length,
      createTriggers: triggers.filter((t) => t.triggerAction === 'create')
        .length,
    }),
    [triggers]
  )

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between gap-4">
          <div className="h-10 w-64 rounded bg-muted-bg/50 animate-pulse" />
          <div className="h-9 w-32 rounded bg-muted-bg/50 animate-pulse" />
        </div>
        <div className="rounded-lg bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border border-accent/30 overflow-hidden">
          <TriggerRowSkeleton />
          <TriggerRowSkeleton />
        </div>
      </div>
    )
  }

  if (triggers.length === 0) {
    return (
      <div className={className}>
        <EmptyState
          icon={<Zap className="size-12" />}
          title="No process triggers"
          description="Create triggers to automatically start workflows when entities are created or updated."
          actionLabel={onCreate && canCreate ? 'Create Trigger' : undefined}
          onAction={onCreate}
        />
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Stats Summary */}
      <div className="flex flex-wrap gap-4 p-4 rounded-lg bg-surface/50 border border-accent/20">
        <div className="flex items-center gap-2">
          <Zap className="size-5 text-accent" />
          <span className="text-sm">
            <span className="font-semibold text-primary">{stats.total}</span>
            <span className="text-secondary">
              {' '}
              {stats.total === 1 ? 'trigger' : 'triggers'}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Play className="size-5 text-success" />
          <span className="text-sm">
            <span className="font-semibold text-primary">{stats.active}</span>
            <span className="text-secondary"> active</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Plus className="size-5 text-info" />
          <span className="text-sm">
            <span className="font-semibold text-primary">
              {stats.createTriggers}
            </span>
            <span className="text-secondary"> on-create</span>
          </span>
        </div>
      </div>

      {/* Search + Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-tertiary" />
          <Input
            placeholder="Search triggers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        {onCreate && canCreate && (
          <Button
            variant="default"
            size="sm"
            className="gap-2 shrink-0"
            onClick={onCreate}
          >
            <Plus className="size-4" />
            Create Trigger
          </Button>
        )}
      </div>

      {/* Trigger List */}
      {filteredTriggers.length === 0 ? (
        <EmptyState
          variant="filter"
          icon={<Search className="size-12" />}
          title="No matching triggers"
          description={`No triggers match "${searchTerm}"`}
          actionLabel="Clear search"
          onAction={() => setSearchTerm('')}
        />
      ) : (
        <div className="rounded-lg bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border border-accent/30 overflow-hidden divide-y divide-accent/10">
          {filteredTriggers.map((trigger) => (
            <TriggerRow
              key={trigger.id}
              trigger={trigger}
              onTriggerClick={onTriggerClick}
              onEdit={onEdit}
              onToggleActive={onToggleActive}
              canEdit={canEdit}
            />
          ))}
        </div>
      )}

      {searchTerm && filteredTriggers.length > 0 && (
        <p className="text-sm text-secondary">
          Showing {filteredTriggers.length} of {triggers.length} triggers
        </p>
      )}
    </div>
  )
}

ProcessTriggersTab.displayName = 'ProcessTriggersTab'

export default ProcessTriggersTab
