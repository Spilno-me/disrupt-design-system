/**
 * FormTemplatesTab - Form templates for a module
 * @component ORGANISM
 */

import * as React from 'react'
import { useState, useMemo } from 'react'
import { FileText, Plus, Edit2, ChevronRight, Search, Copy, Eye } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { Input } from '../../../../components/ui/input'
import { EmptyState } from '../../../../components/ui/EmptyState'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../components/ui/tooltip'
import type { ModulePermissions } from '../ModuleCard'

export type FormTemplateStatus = 'draft' | 'published' | 'archived'

/**
 * Form field definition within schemaJson
 */
export interface FormFieldDefinition {
  name: string
  type: 'text' | 'textarea' | 'number' | 'date' | 'datetime' | 'select' | 'multiselect' | 'checkbox' | 'file' | 'location' | 'user' | 'entity'
  label: string
  required?: boolean
  validation?: Record<string, unknown>
  options?: Array<{ value: string; label: string }>
  dictionaryCode?: string
}

/**
 * FormTemplateItem - Form definition for a module
 *
 * Enhanced to match EMEX Module architecture:
 * - `schemaJson` stores the JSON Schema for runtime form rendering
 * - `entityTemplateCode` links to the entity this form creates/updates
 * - `moduleId` scopes the form to a specific module
 * - Supports versioning with archived forms preserved
 */
export interface FormTemplateItem {
  id: string
  /** Human-readable form name */
  name: string
  /** Unique form code (e.g., 'corrective-action-main') */
  code: string
  /** Optional description */
  description?: string
  /** Form version number */
  version: number
  /** Current status */
  status: FormTemplateStatus
  /** Module this form belongs to (FK scoping) */
  moduleId?: string
  /**
   * JSON Schema definition for the form
   * Contains field definitions, validation rules, layout hints
   * Loaded on demand (not in list views)
   */
  schemaJson?: Record<string, unknown>
  /**
   * Entity template code this form is associated with
   * e.g., 'corrective-action', 'incident'
   */
  entityTemplateCode?: string
  /** Number of fields in the form (calculated from schema) */
  fieldCount?: number
  /** Field definitions extracted from schemaJson for preview */
  fields?: FormFieldDefinition[]
  /** Form category for grouping */
  category?: 'main' | 'workflow' | 'quick' | 'mobile'
  /** Is this a system form that can't be deleted */
  isSystem?: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface FormTemplatesTabProps {
  moduleId: string
  formTemplates: FormTemplateItem[]
  isLoading?: boolean
  onFormClick?: (formId: string) => void
  onEdit?: (formId: string) => void
  onDuplicate?: (formId: string) => void
  onCreate?: () => void
  permissions?: ModulePermissions
  className?: string
}

const STATUS_CONFIG: Record<FormTemplateStatus, { label: string; variant: 'success' | 'secondary' | 'outline' }> = {
  draft: { label: 'Draft', variant: 'secondary' },
  published: { label: 'Published', variant: 'success' },
  archived: { label: 'Archived', variant: 'outline' },
}

function FormRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-muted-bg/50" />
        <div className="space-y-2"><div className="h-4 w-36 rounded bg-muted-bg/50" /><div className="h-3 w-28 rounded bg-muted-bg/30" /></div>
      </div>
      <div className="flex items-center gap-2"><div className="h-6 w-16 rounded bg-muted-bg/30" /><div className="h-8 w-8 rounded bg-muted-bg/30" /></div>
    </div>
  )
}

interface FormRowProps {
  form: FormTemplateItem
  onFormClick?: (formId: string) => void
  onEdit?: (formId: string) => void
  onDuplicate?: (formId: string) => void
  canEdit?: boolean
}

function FormRow({ form, onFormClick, onEdit, onDuplicate, canEdit = true }: FormRowProps) {
  const statusConfig = STATUS_CONFIG[form.status]
  return (
    <div className={cn('flex items-center justify-between gap-4 p-4 rounded-lg transition-colors hover:bg-muted-bg/50', onFormClick && 'cursor-pointer')}
      onClick={() => onFormClick?.(form.id)} role={onFormClick ? 'button' : undefined} tabIndex={onFormClick ? 0 : undefined}>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex size-10 items-center justify-center rounded-lg bg-info/10 shrink-0"><FileText className="size-5 text-info" /></div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-primary truncate">{form.name}</span>
            <Badge variant="outline" size="sm" className="font-mono shrink-0">v{form.version}</Badge>
            {form.category && <Badge variant="secondary" size="sm">{form.category}</Badge>}
            {form.isSystem && <TooltipProvider><Tooltip><TooltipTrigger asChild><Badge variant="warning" size="sm">System</Badge></TooltipTrigger><TooltipContent>System form - cannot be deleted</TooltipContent></Tooltip></TooltipProvider>}
          </div>
          <div className="flex items-center gap-2 text-xs text-tertiary">
            <span className="font-mono truncate">{form.code}</span>
            {form.entityTemplateCode && <><span>•</span><TooltipProvider><Tooltip><TooltipTrigger asChild><span className="font-mono text-accent cursor-help">{form.entityTemplateCode}</span></TooltipTrigger><TooltipContent>Linked entity template</TooltipContent></Tooltip></TooltipProvider></>}
            {form.fieldCount !== undefined && <><span>•</span><span>{form.fieldCount} {form.fieldCount === 1 ? 'field' : 'fields'}</span></>}
          </div>
          {form.description && <p className="text-xs text-secondary mt-1 line-clamp-1">{form.description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
        <Badge variant={statusConfig.variant} size="sm">{statusConfig.label}</Badge>
        {onFormClick && <TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="size-8" onClick={() => onFormClick(form.id)}><Eye className="size-4" /></Button></TooltipTrigger><TooltipContent>Preview form</TooltipContent></Tooltip></TooltipProvider>}
        {onEdit && <TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="size-8" disabled={!canEdit} onClick={() => onEdit(form.id)}><Edit2 className="size-4" /></Button></TooltipTrigger><TooltipContent>{canEdit ? 'Edit form' : 'No permission'}</TooltipContent></Tooltip></TooltipProvider>}
        {onDuplicate && <TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="size-8" disabled={!canEdit} onClick={() => onDuplicate(form.id)}><Copy className="size-4" /></Button></TooltipTrigger><TooltipContent>{canEdit ? 'Duplicate' : 'No permission'}</TooltipContent></Tooltip></TooltipProvider>}
        {onFormClick && <ChevronRight className="size-4 text-tertiary" />}
      </div>
    </div>
  )
}

export function FormTemplatesTab({ moduleId, formTemplates, isLoading = false, onFormClick, onEdit, onDuplicate, onCreate, permissions, className }: FormTemplatesTabProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const canEdit = permissions?.canEdit ?? true
  const canCreate = permissions?.canEdit ?? true
  const filteredForms = useMemo(() => {
    if (!searchTerm.trim()) return formTemplates
    const lower = searchTerm.toLowerCase()
    return formTemplates.filter((f) => f.name.toLowerCase().includes(lower) || f.code.toLowerCase().includes(lower))
  }, [formTemplates, searchTerm])

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between gap-4"><div className="h-10 w-64 rounded bg-muted-bg/50 animate-pulse" /><div className="h-9 w-32 rounded bg-muted-bg/50 animate-pulse" /></div>
        <div className="rounded-lg bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border border-accent/30 overflow-hidden"><FormRowSkeleton /><FormRowSkeleton /></div>
      </div>
    )
  }

  if (formTemplates.length === 0) {
    return <div className={className}><EmptyState icon={<FileText className="size-12" />} title="No form templates" description="Create form templates to capture data for entities in this module." actionLabel={onCreate && canCreate ? 'Create Form Template' : undefined} onAction={onCreate} /></div>
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-tertiary" /><Input placeholder="Search forms..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" /></div>
        {onCreate && canCreate && <Button variant="default" size="sm" className="gap-2 shrink-0" onClick={onCreate}><Plus className="size-4" />Create Form</Button>}
      </div>
      {filteredForms.length === 0 ? (
        <EmptyState variant="filter" icon={<Search className="size-12" />} title="No matching forms" description={`No form templates match "${searchTerm}"`} actionLabel="Clear search" onAction={() => setSearchTerm('')} />
      ) : (
        <div className="rounded-lg bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border border-accent/30 overflow-hidden divide-y divide-accent/10">
          {filteredForms.map((form) => <FormRow key={form.id} form={form} onFormClick={onFormClick} onEdit={onEdit} onDuplicate={onDuplicate} canEdit={canEdit} />)}
        </div>
      )}
      {searchTerm && filteredForms.length > 0 && <p className="text-sm text-secondary">Showing {filteredForms.length} of {formTemplates.length} forms</p>}
    </div>
  )
}

FormTemplatesTab.displayName = 'FormTemplatesTab'
export default FormTemplatesTab
