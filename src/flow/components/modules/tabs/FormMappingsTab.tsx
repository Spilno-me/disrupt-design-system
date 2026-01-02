/**
 * FormMappingsTab - Form-entity-workflow mappings for a module
 * @component ORGANISM
 */

import * as React from 'react'
import { useState, useMemo } from 'react'
import { Link2, Plus, Edit2, ChevronRight, Search, Trash2, FileText, Database, GitBranch } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { Input } from '../../../../components/ui/input'
import { EmptyState } from '../../../../components/ui/EmptyState'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../components/ui/tooltip'
import type { ModulePermissions } from '../ModuleCard'

export type MappingType = 'entity' | 'workflow'

export interface FormMappingItem {
  id: string
  name: string
  formName: string
  formId: string
  targetName: string
  targetId: string
  mappingType: MappingType
  description?: string
  isActive: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface FormMappingsTabProps {
  moduleId: string
  formMappings: FormMappingItem[]
  isLoading?: boolean
  onMappingClick?: (mappingId: string) => void
  onEdit?: (mappingId: string) => void
  onDelete?: (mappingId: string) => void
  onCreate?: () => void
  permissions?: ModulePermissions
  className?: string
}

function MappingRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 p-4 animate-pulse">
      <div className="flex items-center gap-3 flex-1">
        <div className="size-10 rounded-lg bg-muted-bg/50" />
        <div className="space-y-2 flex-1"><div className="h-4 w-48 rounded bg-muted-bg/50" /><div className="h-3 w-64 rounded bg-muted-bg/30" /></div>
      </div>
      <div className="flex items-center gap-2"><div className="h-6 w-16 rounded bg-muted-bg/30" /><div className="h-8 w-8 rounded bg-muted-bg/30" /></div>
    </div>
  )
}

interface MappingRowProps {
  mapping: FormMappingItem
  onMappingClick?: (mappingId: string) => void
  onEdit?: (mappingId: string) => void
  onDelete?: (mappingId: string) => void
  canEdit?: boolean
  canDelete?: boolean
}

function MappingRow({ mapping, onMappingClick, onEdit, onDelete, canEdit = true, canDelete = true }: MappingRowProps) {
  const isEntity = mapping.mappingType === 'entity'
  const TargetIcon = isEntity ? Database : GitBranch
  return (
    <div className={cn('flex items-center justify-between gap-4 p-4 rounded-lg transition-colors hover:bg-muted-bg/50', onMappingClick && 'cursor-pointer')}
      onClick={() => onMappingClick?.(mapping.id)} role={onMappingClick ? 'button' : undefined} tabIndex={onMappingClick ? 0 : undefined}>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex size-10 items-center justify-center rounded-lg bg-warning/10 shrink-0"><Link2 className="size-5 text-warning" /></div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-primary truncate">{mapping.name}</span>
            {!mapping.isActive && <Badge variant="outline" size="sm">Inactive</Badge>}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-secondary mt-1 flex-wrap">
            <span className="flex items-center gap-1"><FileText className="size-3" />{mapping.formName}</span>
            <span className="text-tertiary">→</span>
            <span className="flex items-center gap-1"><TargetIcon className="size-3" />{mapping.targetName}</span>
          </div>
          {mapping.description && <p className="text-xs text-tertiary mt-1 line-clamp-1">{mapping.description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
        <Badge variant={isEntity ? 'info' : 'secondary'} size="sm">{isEntity ? 'Entity' : 'Workflow'}</Badge>
        {onEdit && <TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="size-8" disabled={!canEdit} onClick={() => onEdit(mapping.id)}><Edit2 className="size-4" /></Button></TooltipTrigger><TooltipContent>{canEdit ? 'Edit mapping' : 'No permission'}</TooltipContent></Tooltip></TooltipProvider>}
        {onDelete && <TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="size-8 text-error hover:text-error" disabled={!canDelete} onClick={() => onDelete(mapping.id)}><Trash2 className="size-4" /></Button></TooltipTrigger><TooltipContent>{canDelete ? 'Delete mapping' : 'No permission'}</TooltipContent></Tooltip></TooltipProvider>}
        {onMappingClick && <ChevronRight className="size-4 text-tertiary" />}
      </div>
    </div>
  )
}

export function FormMappingsTab({ moduleId, formMappings, isLoading = false, onMappingClick, onEdit, onDelete, onCreate, permissions, className }: FormMappingsTabProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const canEdit = permissions?.canEdit ?? true
  const canCreate = permissions?.canEdit ?? true
  const filteredMappings = useMemo(() => {
    if (!searchTerm.trim()) return formMappings
    const lower = searchTerm.toLowerCase()
    return formMappings.filter((m) => m.name.toLowerCase().includes(lower) || m.formName.toLowerCase().includes(lower) || m.targetName.toLowerCase().includes(lower))
  }, [formMappings, searchTerm])

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between gap-4"><div className="h-10 w-64 rounded bg-muted-bg/50 animate-pulse" /><div className="h-9 w-32 rounded bg-muted-bg/50 animate-pulse" /></div>
        <div className="rounded-lg bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border border-accent/30 overflow-hidden"><MappingRowSkeleton /><MappingRowSkeleton /></div>
      </div>
    )
  }

  if (formMappings.length === 0) {
    return <div className={className}><EmptyState icon={<Link2 className="size-12" />} title="No form mappings" description="Create mappings to connect forms with entities and workflows." actionLabel={onCreate && canCreate ? 'Create Mapping' : undefined} onAction={onCreate} /></div>
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-tertiary" /><Input placeholder="Search mappings..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" /></div>
        {onCreate && canCreate && <Button variant="default" size="sm" className="gap-2 shrink-0" onClick={onCreate}><Plus className="size-4" />Create Mapping</Button>}
      </div>
      {filteredMappings.length === 0 ? (
        <EmptyState variant="filter" icon={<Search className="size-12" />} title="No matching mappings" description={`No form mappings match "${searchTerm}"`} actionLabel="Clear search" onAction={() => setSearchTerm('')} />
      ) : (
        <div className="rounded-lg bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border border-accent/30 overflow-hidden divide-y divide-accent/10">
          {filteredMappings.map((mapping) => <MappingRow key={mapping.id} mapping={mapping} onMappingClick={onMappingClick} onEdit={onEdit} onDelete={onDelete} canEdit={canEdit} canDelete={canEdit} />)}
        </div>
      )}
      {searchTerm && filteredMappings.length > 0 && <p className="text-sm text-secondary">Showing {filteredMappings.length} of {formMappings.length} mappings</p>}
    </div>
  )
}

FormMappingsTab.displayName = 'FormMappingsTab'
export default FormMappingsTab
