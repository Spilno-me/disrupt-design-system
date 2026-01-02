/**
 * ProcessDefinitionsTab - Workflow process definitions for a module
 * @component ORGANISM
 */

import * as React from 'react'
import { useState, useMemo } from 'react'
import { GitBranch, Plus, Edit2, Rocket, Play, Pause, ChevronRight, Search } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { Input } from '../../../../components/ui/input'
import { EmptyState } from '../../../../components/ui/EmptyState'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../components/ui/tooltip'
import type { ModulePermissions } from '../ModuleCard'

export type ProcessDefinitionStatus = 'draft' | 'deployed' | 'suspended'

/**
 * ProcessDefinitionItem - Workflow process definition for a module
 *
 * Enhanced to match EMEX Module architecture:
 * - `bpmnXml` stores the actual BPMN 2.0 XML content
 * - `flowableDeploymentId` links to deployed Flowable engine
 * - `isSystem` marks core system processes that can't be deleted
 * - `moduleId` scopes the process to a specific module
 */
export interface ProcessDefinitionItem {
  id: string
  /** Human-readable process name */
  name: string
  /** Unique process key used in BPMN (e.g., 'corrective-action-workflow') */
  processDefinitionKey: string
  /** Optional description */
  description?: string
  /** Process version number */
  version: number
  /** Current status */
  status: ProcessDefinitionStatus
  /** Module this process belongs to (FK scoping) */
  moduleId?: string
  /**
   * BPMN 2.0 XML content - the actual workflow definition
   * Loaded on demand (not in list views)
   */
  bpmnXml?: string
  /** Flowable deployment ID when deployed */
  flowableDeploymentId?: string
  /** When the process was deployed to Flowable */
  deployedAt?: Date | string
  /** System processes cannot be deleted */
  isSystem?: boolean
  /** Category for grouping (e.g., 'approval', 'review', 'notification') */
  category?: string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface ProcessDefinitionsTabProps {
  moduleId: string
  processDefinitions: ProcessDefinitionItem[]
  isLoading?: boolean
  onProcessClick?: (processId: string) => void
  onEdit?: (processId: string) => void
  onDeploy?: (processId: string) => void
  onSuspend?: (processId: string) => void
  onResume?: (processId: string) => void
  onCreate?: () => void
  permissions?: ModulePermissions
  className?: string
}

const STATUS_CONFIG: Record<ProcessDefinitionStatus, { label: string; variant: 'success' | 'secondary' | 'warning' }> = {
  draft: { label: 'Draft', variant: 'secondary' },
  deployed: { label: 'Deployed', variant: 'success' },
  suspended: { label: 'Suspended', variant: 'warning' },
}

function ProcessRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-muted-bg/50" />
        <div className="space-y-2"><div className="h-4 w-40 rounded bg-muted-bg/50" /><div className="h-3 w-32 rounded bg-muted-bg/30" /></div>
      </div>
      <div className="flex items-center gap-2"><div className="h-6 w-16 rounded bg-muted-bg/30" /><div className="h-8 w-8 rounded bg-muted-bg/30" /></div>
    </div>
  )
}

interface ProcessRowProps {
  process: ProcessDefinitionItem
  onProcessClick?: (processId: string) => void
  onEdit?: (processId: string) => void
  onDeploy?: (processId: string) => void
  onSuspend?: (processId: string) => void
  onResume?: (processId: string) => void
  canEdit?: boolean
  canDeploy?: boolean
}

function ProcessRow({ process, onProcessClick, onEdit, onDeploy, onSuspend, onResume, canEdit = true, canDeploy = true }: ProcessRowProps) {
  const statusConfig = STATUS_CONFIG[process.status]
  return (
    <div className={cn('flex items-center justify-between gap-4 p-4 rounded-lg transition-colors hover:bg-muted-bg/50', onProcessClick && 'cursor-pointer')}
      onClick={() => onProcessClick?.(process.id)} role={onProcessClick ? 'button' : undefined} tabIndex={onProcessClick ? 0 : undefined}>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 shrink-0"><GitBranch className="size-5 text-accent" /></div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-primary truncate">{process.name}</span>
            <Badge variant="outline" size="sm" className="font-mono shrink-0">v{process.version}</Badge>
            {process.isSystem && <TooltipProvider><Tooltip><TooltipTrigger asChild><Badge variant="warning" size="sm">System</Badge></TooltipTrigger><TooltipContent>System process - cannot be deleted</TooltipContent></Tooltip></TooltipProvider>}
          </div>
          <div className="flex items-center gap-2 text-xs text-tertiary">
            <span className="font-mono truncate">{process.processDefinitionKey}</span>
            {process.deployedAt && <><span>•</span><span>Deployed {typeof process.deployedAt === 'string' ? new Date(process.deployedAt).toLocaleDateString() : process.deployedAt.toLocaleDateString()}</span></>}
          </div>
          {process.description && <p className="text-xs text-secondary mt-1 line-clamp-1">{process.description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
        <Badge variant={statusConfig.variant} size="sm">{statusConfig.label}</Badge>
        {onEdit && <TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="size-8" disabled={!canEdit} onClick={() => onEdit(process.id)}><Edit2 className="size-4" /></Button></TooltipTrigger><TooltipContent>{canEdit ? 'Edit BPMN definition' : 'No permission'}</TooltipContent></Tooltip></TooltipProvider>}
        {process.status === 'draft' && onDeploy && <TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="size-8 text-success hover:text-success" disabled={!canDeploy} onClick={() => onDeploy(process.id)}><Rocket className="size-4" /></Button></TooltipTrigger><TooltipContent>{canDeploy ? 'Deploy' : 'No permission'}</TooltipContent></Tooltip></TooltipProvider>}
        {process.status === 'suspended' && onResume && <TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="size-8 text-success hover:text-success" disabled={!canDeploy} onClick={() => onResume(process.id)}><Play className="size-4" /></Button></TooltipTrigger><TooltipContent>{canDeploy ? 'Resume' : 'No permission'}</TooltipContent></Tooltip></TooltipProvider>}
        {process.status === 'deployed' && onSuspend && <TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="size-8 text-warning hover:text-warning" disabled={!canDeploy} onClick={() => onSuspend(process.id)}><Pause className="size-4" /></Button></TooltipTrigger><TooltipContent>{canDeploy ? 'Suspend' : 'No permission'}</TooltipContent></Tooltip></TooltipProvider>}
        {onProcessClick && <ChevronRight className="size-4 text-tertiary" />}
      </div>
    </div>
  )
}

export function ProcessDefinitionsTab({ moduleId, processDefinitions, isLoading = false, onProcessClick, onEdit, onDeploy, onSuspend, onResume, onCreate, permissions, className }: ProcessDefinitionsTabProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const canEdit = permissions?.canEdit ?? true
  const canCreate = permissions?.canEdit ?? true
  const filteredProcesses = useMemo(() => {
    if (!searchTerm.trim()) return processDefinitions
    const lower = searchTerm.toLowerCase()
    return processDefinitions.filter((p) => p.name.toLowerCase().includes(lower) || p.processDefinitionKey.toLowerCase().includes(lower))
  }, [processDefinitions, searchTerm])

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between gap-4"><div className="h-10 w-64 rounded bg-muted-bg/50 animate-pulse" /><div className="h-9 w-32 rounded bg-muted-bg/50 animate-pulse" /></div>
        <div className="rounded-lg bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border border-accent/30 overflow-hidden"><ProcessRowSkeleton /><ProcessRowSkeleton /><ProcessRowSkeleton /></div>
      </div>
    )
  }

  if (processDefinitions.length === 0) {
    return <div className={className}><EmptyState icon={<GitBranch className="size-12" />} title="No process definitions" description="Create workflow definitions to automate business processes." actionLabel={onCreate && canCreate ? 'Create Process Definition' : undefined} onAction={onCreate} /></div>
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-tertiary" /><Input placeholder="Search processes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" /></div>
        {onCreate && canCreate && <Button variant="default" size="sm" className="gap-2 shrink-0" onClick={onCreate}><Plus className="size-4" />Create Process</Button>}
      </div>
      {filteredProcesses.length === 0 ? (
        <EmptyState variant="filter" icon={<Search className="size-12" />} title="No matching processes" description={`No process definitions match "${searchTerm}"`} actionLabel="Clear search" onAction={() => setSearchTerm('')} />
      ) : (
        <div className="rounded-lg bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border border-accent/30 overflow-hidden divide-y divide-accent/10">
          {filteredProcesses.map((process) => <ProcessRow key={process.id} process={process} onProcessClick={onProcessClick} onEdit={onEdit} onDeploy={onDeploy} onSuspend={onSuspend} onResume={onResume} canEdit={canEdit} canDeploy={canCreate} />)}
        </div>
      )}
      {searchTerm && filteredProcesses.length > 0 && <p className="text-sm text-secondary">Showing {filteredProcesses.length} of {processDefinitions.length} processes</p>}
    </div>
  )
}

ProcessDefinitionsTab.displayName = 'ProcessDefinitionsTab'
export default ProcessDefinitionsTab
