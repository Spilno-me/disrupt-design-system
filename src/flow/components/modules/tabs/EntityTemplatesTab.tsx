/**
 * EntityTemplatesTab - Entity configuration for a module
 * @component ORGANISM
 */

import * as React from 'react'
import { Database, Star, ChevronRight, AlertCircle } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { EmptyState } from '../../../../components/ui/EmptyState'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../components/ui/tooltip'
import type { ModuleItem, ModulePermissions, EntityTemplateInfo } from '../ModuleCard'

export interface EntityTemplatesTabProps {
  module: ModuleItem
  isLoading?: boolean
  onEntityClick?: (entityId: string) => void
  permissions?: ModulePermissions
  className?: string
}

function EntityRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-muted-bg/50" />
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-muted-bg/50" />
          <div className="h-3 w-24 rounded bg-muted-bg/30" />
        </div>
      </div>
      <div className="h-8 w-16 rounded bg-muted-bg/30" />
    </div>
  )
}

interface EntityRowProps {
  entity: EntityTemplateInfo
  isPrimary?: boolean
  onEntityClick?: (entityId: string) => void
  canView?: boolean
}

function EntityRow({ entity, isPrimary = false, onEntityClick, canView = true }: EntityRowProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 p-4 rounded-lg transition-colors border border-transparent',
        onEntityClick && canView && 'hover:bg-muted-bg/50 cursor-pointer',
        isPrimary && 'bg-info/5 border-info/20'
      )}
      onClick={() => canView && onEntityClick?.(entity.id)}
      role={onEntityClick && canView ? 'button' : undefined}
      tabIndex={onEntityClick && canView ? 0 : undefined}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={cn('flex size-10 items-center justify-center rounded-lg shrink-0', isPrimary ? 'bg-info/10' : 'bg-muted-bg')}>
          <Database className={cn('size-5', isPrimary ? 'text-info' : 'text-tertiary')} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-primary truncate">{entity.name}</span>
            {isPrimary && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="info" size="sm" className="gap-1 shrink-0">
                      <Star className="size-3" />Primary
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>This is the primary entity for this module</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <p className="text-xs text-tertiary font-mono truncate">{entity.code}</p>
        </div>
      </div>
      {onEntityClick && canView && (
        <Button variant="ghost" size="sm" className="shrink-0 gap-1" onClick={(e) => { e.stopPropagation(); onEntityClick(entity.id) }}>
          View<ChevronRight className="size-4" />
        </Button>
      )}
    </div>
  )
}

export function EntityTemplatesTab({ module, isLoading = false, onEntityClick, permissions, className }: EntityTemplatesTabProps) {
  const canView = permissions?.canView ?? true
  const entityTemplates = module.entityTemplates ?? []
  const primaryEntity = module.primaryEntityTemplate
  const relatedEntities = entityTemplates.filter((e) => e.id !== primaryEntity?.id)

  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="rounded-lg bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border border-accent/30">
          <div className="p-4 border-b border-accent/20"><div className="h-5 w-48 rounded bg-muted-bg/50 animate-pulse" /></div>
          <EntityRowSkeleton />
        </div>
        <div className="rounded-lg bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border border-accent/30">
          <div className="p-4 border-b border-accent/20"><div className="h-5 w-36 rounded bg-muted-bg/50 animate-pulse" /></div>
          <EntityRowSkeleton /><EntityRowSkeleton />
        </div>
      </div>
    )
  }

  if (entityTemplates.length === 0) {
    return <EmptyState icon={<Database className="size-12" />} title="No entity templates" description="This module has no entity templates configured yet." className={className} />
  }

  return (
    <div className={cn('space-y-6', className)}>
      {primaryEntity && (
        <div className="rounded-lg bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border border-accent/30 overflow-hidden">
          <div className="p-4 border-b border-accent/20 bg-surface/30">
            <h3 className="font-semibold text-primary flex items-center gap-2"><Star className="size-4 text-info" />Primary Entity Configuration</h3>
            <p className="text-sm text-secondary mt-1">The main entity type for creating records in this module</p>
          </div>
          <EntityRow entity={primaryEntity} isPrimary onEntityClick={onEntityClick} canView={canView} />
        </div>
      )}
      {relatedEntities.length > 0 && (
        <div className="rounded-lg bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border border-accent/30 overflow-hidden">
          <div className="p-4 border-b border-accent/20 bg-surface/30">
            <h3 className="font-semibold text-primary">Related Entities</h3>
            <p className="text-sm text-secondary mt-1">Additional entity templates associated with this module</p>
          </div>
          <div className="divide-y divide-accent/10">
            {relatedEntities.map((entity) => <EntityRow key={entity.id} entity={entity} onEntityClick={onEntityClick} canView={canView} />)}
          </div>
        </div>
      )}
      {primaryEntity && relatedEntities.length === 0 && (
        <div className="rounded-lg bg-muted-bg/30 border border-dashed border-accent/30 p-6 text-center">
          <AlertCircle className="size-8 mx-auto text-tertiary mb-2" />
          <p className="text-sm text-secondary">No additional entity templates configured for this module.</p>
        </div>
      )}
    </div>
  )
}

EntityTemplatesTab.displayName = 'EntityTemplatesTab'
export default EntityTemplatesTab
