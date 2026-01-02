/**
 * UserGroupsTab - User groups for module access control
 * @component ORGANISM
 */

import * as React from 'react'
import { useState, useMemo } from 'react'
import { Users, Plus, Edit2, ChevronRight, Search, Shield, UserCheck } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { Input } from '../../../../components/ui/input'
import { EmptyState } from '../../../../components/ui/EmptyState'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../components/ui/tooltip'
import type { ModulePermissions } from '../ModuleCard'

export type AccessLevel = 'view' | 'edit' | 'admin'

/**
 * User information for group membership display
 */
export interface UserGroupMember {
  id: string
  email: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
}

/**
 * UserGroupItem - Module user group for access control
 *
 * Enhanced to match EMEX Module architecture:
 * - `code` is CRITICAL for BPMN candidate group assignment (e.g., 'corrective-actions-safety-manager')
 * - `moduleId` scopes the group to a specific module
 * - `users[]` provides membership details beyond just count
 */
export interface UserGroupItem {
  id: string
  /** Human-readable group name */
  name: string
  /**
   * CRITICAL: Unique code for BPMN candidate group assignment
   * Format: {module-code}-{role} (e.g., 'corrective-actions-safety-manager')
   * This is what Flowable uses to assign workflow tasks
   */
  code: string
  /** Optional description */
  description?: string
  /** Module this group belongs to (FK scoping) */
  moduleId?: string
  /** Number of users (for display when users[] not loaded) */
  userCount: number
  /** Full user list when expanded/detailed view */
  users?: UserGroupMember[]
  /** Access level within the module */
  accessLevel: AccessLevel
  /** System groups cannot be deleted */
  isSystemGroup?: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface UserGroupsTabProps {
  moduleId: string
  userGroups: UserGroupItem[]
  isLoading?: boolean
  onGroupClick?: (groupId: string) => void
  onEdit?: (groupId: string) => void
  onCreate?: () => void
  permissions?: ModulePermissions
  className?: string
}

const ACCESS_CONFIG: Record<AccessLevel, { label: string; variant: 'success' | 'info' | 'secondary'; icon: React.ComponentType<{ className?: string }> }> = {
  view: { label: 'View', variant: 'secondary', icon: Users },
  edit: { label: 'Edit', variant: 'info', icon: UserCheck },
  admin: { label: 'Admin', variant: 'success', icon: Shield },
}

function GroupRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-muted-bg/50" />
        <div className="space-y-2"><div className="h-4 w-36 rounded bg-muted-bg/50" /><div className="h-3 w-24 rounded bg-muted-bg/30" /></div>
      </div>
      <div className="flex items-center gap-2"><div className="h-6 w-16 rounded bg-muted-bg/30" /><div className="h-8 w-8 rounded bg-muted-bg/30" /></div>
    </div>
  )
}

interface GroupRowProps {
  group: UserGroupItem
  onGroupClick?: (groupId: string) => void
  onEdit?: (groupId: string) => void
  canEdit?: boolean
}

function GroupRow({ group, onGroupClick, onEdit, canEdit = true }: GroupRowProps) {
  const accessConfig = ACCESS_CONFIG[group.accessLevel]
  const AccessIcon = accessConfig.icon
  return (
    <div className={cn('flex items-center justify-between gap-4 p-4 rounded-lg transition-colors hover:bg-muted-bg/50', onGroupClick && 'cursor-pointer')}
      onClick={() => onGroupClick?.(group.id)} role={onGroupClick ? 'button' : undefined} tabIndex={onGroupClick ? 0 : undefined}>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={cn('flex size-10 items-center justify-center rounded-lg shrink-0', group.isSystemGroup ? 'bg-warning/10' : 'bg-success/10')}>
          <Users className={cn('size-5', group.isSystemGroup ? 'text-warning' : 'text-success')} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-primary truncate">{group.name}</span>
            {group.isSystemGroup && <TooltipProvider><Tooltip><TooltipTrigger asChild><Badge variant="warning" size="sm">System</Badge></TooltipTrigger><TooltipContent>System group - cannot be deleted</TooltipContent></Tooltip></TooltipProvider>}
          </div>
          <div className="flex items-center gap-2 text-xs text-tertiary mt-0.5">
            <span className="font-mono truncate">{group.code}</span>
            <span>•</span>
            <span>{group.userCount} {group.userCount === 1 ? 'user' : 'users'}</span>
          </div>
          {group.description && <p className="text-xs text-secondary mt-1 line-clamp-1">{group.description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
        <TooltipProvider><Tooltip><TooltipTrigger asChild><Badge variant={accessConfig.variant} size="sm" className="gap-1"><AccessIcon className="size-3" />{accessConfig.label}</Badge></TooltipTrigger>
          <TooltipContent>
            {group.accessLevel === 'view' && 'Can view module data'}
            {group.accessLevel === 'edit' && 'Can view and edit module data'}
            {group.accessLevel === 'admin' && 'Full administrative access'}
          </TooltipContent>
        </Tooltip></TooltipProvider>
        {onEdit && !group.isSystemGroup && <TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="size-8" disabled={!canEdit} onClick={() => onEdit(group.id)}><Edit2 className="size-4" /></Button></TooltipTrigger><TooltipContent>{canEdit ? 'Edit group permissions' : 'No permission'}</TooltipContent></Tooltip></TooltipProvider>}
        {onGroupClick && <ChevronRight className="size-4 text-tertiary" />}
      </div>
    </div>
  )
}

export function UserGroupsTab({ moduleId, userGroups, isLoading = false, onGroupClick, onEdit, onCreate, permissions, className }: UserGroupsTabProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const canEdit = permissions?.canEdit ?? true
  const canCreate = permissions?.canEdit ?? true
  const filteredGroups = useMemo(() => {
    if (!searchTerm.trim()) return userGroups
    const lower = searchTerm.toLowerCase()
    return userGroups.filter((g) => g.name.toLowerCase().includes(lower) || g.code.toLowerCase().includes(lower))
  }, [userGroups, searchTerm])
  const stats = useMemo(() => ({ totalUsers: userGroups.reduce((sum, g) => sum + g.userCount, 0), adminCount: userGroups.filter((g) => g.accessLevel === 'admin').length }), [userGroups])

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between gap-4"><div className="h-10 w-64 rounded bg-muted-bg/50 animate-pulse" /><div className="h-9 w-32 rounded bg-muted-bg/50 animate-pulse" /></div>
        <div className="rounded-lg bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border border-accent/30 overflow-hidden"><GroupRowSkeleton /><GroupRowSkeleton /></div>
      </div>
    )
  }

  if (userGroups.length === 0) {
    return <div className={className}><EmptyState icon={<Users className="size-12" />} title="No user groups" description="Create user groups to manage access to this module." actionLabel={onCreate && canCreate ? 'Create User Group' : undefined} onAction={onCreate} /></div>
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-wrap gap-4 p-4 rounded-lg bg-surface/50 border border-accent/20">
        <div className="flex items-center gap-2"><Users className="size-5 text-accent" /><span className="text-sm"><span className="font-semibold text-primary">{stats.totalUsers}</span><span className="text-secondary"> total users</span></span></div>
        <div className="flex items-center gap-2"><Shield className="size-5 text-success" /><span className="text-sm"><span className="font-semibold text-primary">{stats.adminCount}</span><span className="text-secondary"> admin {stats.adminCount === 1 ? 'group' : 'groups'}</span></span></div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-tertiary" /><Input placeholder="Search groups..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" /></div>
        {onCreate && canCreate && <Button variant="default" size="sm" className="gap-2 shrink-0" onClick={onCreate}><Plus className="size-4" />Add Group</Button>}
      </div>
      {filteredGroups.length === 0 ? (
        <EmptyState variant="filter" icon={<Search className="size-12" />} title="No matching groups" description={`No user groups match "${searchTerm}"`} actionLabel="Clear search" onAction={() => setSearchTerm('')} />
      ) : (
        <div className="rounded-lg bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border border-accent/30 overflow-hidden divide-y divide-accent/10">
          {filteredGroups.map((group) => <GroupRow key={group.id} group={group} onGroupClick={onGroupClick} onEdit={onEdit} canEdit={canEdit} />)}
        </div>
      )}
      {searchTerm && filteredGroups.length > 0 && <p className="text-sm text-secondary">Showing {filteredGroups.length} of {userGroups.length} groups</p>}
    </div>
  )
}

UserGroupsTab.displayName = 'UserGroupsTab'
export default UserGroupsTab
