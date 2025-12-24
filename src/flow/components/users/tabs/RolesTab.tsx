/**
 * RolesTab - Role definitions tab content
 *
 * Displays all available roles with their permissions.
 * Enhanced with filter, create button, and CRUD dialogs.
 */

import * as React from 'react'
import { Search, ShieldCheck, Key, Plus, Filter } from 'lucide-react'
import { Input } from '../../../../components/ui/input'
import { Button } from '../../../../components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import { RoleCard } from '../cards/RoleCard'
import { CreateRoleDialog } from '../dialogs/CreateRoleDialog'
import { EditRoleDialog } from '../dialogs/EditRoleDialog'
import { ViewRolePermissionsDialog } from '../dialogs/ViewRolePermissionsDialog'
import { DeleteRoleDialog } from '../dialogs/DeleteRoleDialog'
import type {
  Role,
  RolesTabProps,
  RoleFilterType,
  CreateRoleFormData,
  EditRoleFormData,
} from '../types'

// =============================================================================
// COMPONENT
// =============================================================================

export function RolesTab({
  roles,
  isLoading = false,
  availablePermissions = [],
  onRoleCreate,
  onRoleUpdate,
  onRoleDelete,
}: RolesTabProps) {
  const [searchValue, setSearchValue] = React.useState('')
  const [filterType, setFilterType] = React.useState<RoleFilterType>('all')

  // Dialog state
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [selectedRole, setSelectedRole] = React.useState<Role | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Calculate role type counts
  const systemRoleCount = React.useMemo(
    () => roles.filter((r) => r.isSystem).length,
    [roles]
  )
  const customRoleCount = React.useMemo(
    () => roles.filter((r) => !r.isSystem).length,
    [roles]
  )

  // Filter roles based on search and type filter
  const filteredRoles = React.useMemo(() => {
    let filtered = roles

    // Apply type filter
    if (filterType === 'system') {
      filtered = filtered.filter((r) => r.isSystem)
    } else if (filterType === 'custom') {
      filtered = filtered.filter((r) => !r.isSystem)
    }

    // Apply search filter
    if (searchValue) {
      const search = searchValue.toLowerCase()
      filtered = filtered.filter(
        (role) =>
          role.name.toLowerCase().includes(search) ||
          role.description?.toLowerCase().includes(search) ||
          role.permissions.some((p) => p.resource.toLowerCase().includes(search))
      )
    }

    return filtered
  }, [roles, searchValue, filterType])

  // Dialog handlers
  const handleViewPermissions = React.useCallback((role: Role) => {
    setSelectedRole(role)
    setViewDialogOpen(true)
  }, [])

  const handleEditRole = React.useCallback((role: Role) => {
    setSelectedRole(role)
    setEditDialogOpen(true)
  }, [])

  const handleDeleteRole = React.useCallback((role: Role) => {
    setSelectedRole(role)
    setDeleteDialogOpen(true)
  }, [])

  // CRUD handlers
  const handleCreateSubmit = React.useCallback(
    async (data: CreateRoleFormData) => {
      if (!onRoleCreate) return
      setIsSubmitting(true)
      try {
        await onRoleCreate(data)
        setCreateDialogOpen(false)
      } finally {
        setIsSubmitting(false)
      }
    },
    [onRoleCreate]
  )

  const handleEditSubmit = React.useCallback(
    async (data: EditRoleFormData) => {
      if (!onRoleUpdate) return
      setIsSubmitting(true)
      try {
        await onRoleUpdate(data)
        setEditDialogOpen(false)
        setSelectedRole(null)
      } finally {
        setIsSubmitting(false)
      }
    },
    [onRoleUpdate]
  )

  const handleDeleteConfirm = React.useCallback(async () => {
    if (!onRoleDelete || !selectedRole) return
    setIsSubmitting(true)
    try {
      await onRoleDelete(selectedRole.id)
      setDeleteDialogOpen(false)
      setSelectedRole(null)
    } finally {
      setIsSubmitting(false)
    }
  }, [onRoleDelete, selectedRole])

  if (isLoading) {
    return (
      <div data-slot="roles-tab" className="flex flex-col gap-6">
        {/* Loading skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-10 w-64 animate-pulse rounded-md bg-muted-bg" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-lg bg-muted-bg"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div data-slot="roles-tab" className="flex flex-col gap-6">
      {/* Header with search, filter, and create button */}
      <div className="flex flex-col gap-4">
        {/* Title row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
              <ShieldCheck className="size-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary">Role Definitions</h2>
              <p className="text-sm text-secondary">
                {roles.length} role{roles.length !== 1 ? 's' : ''}
                <span className="mx-1.5 text-tertiary">•</span>
                <span className="text-warning">{systemRoleCount} system</span>
                <span className="mx-1.5 text-tertiary">•</span>
                <span className="text-info">{customRoleCount} custom</span>
              </p>
            </div>
          </div>

          {/* Create Role button */}
          {onRoleCreate && (
            <Button
              className="gap-1.5"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className="size-4" />
              Create Role
            </Button>
          )}
        </div>

        {/* Search and filter row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-tertiary" />
            <Input
              type="search"
              placeholder="Search roles..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filter */}
          <Select
            value={filterType}
            onValueChange={(value) => setFilterType(value as RoleFilterType)}
          >
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="mr-2 size-4 text-tertiary" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="system">System Roles</SelectItem>
              <SelectItem value="custom">Custom Roles</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Roles Grid */}
      {filteredRoles.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-default bg-muted-bg/50 py-12">
          <div className="flex size-12 items-center justify-center rounded-full bg-surface">
            <Key className="size-6 text-tertiary" />
          </div>
          <div className="text-center">
            <p className="font-medium text-primary">No roles found</p>
            <p className="text-sm text-secondary">
              {searchValue || filterType !== 'all'
                ? 'Try adjusting your search or filter'
                : 'No roles have been configured yet'}
            </p>
          </div>
          {!searchValue && filterType === 'all' && onRoleCreate && (
            <Button
              variant="outline"
              className="gap-1.5"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className="size-4" />
              Create First Role
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRoles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              showUserCount
              showDescription
              showActions
              onViewPermissions={() => handleViewPermissions(role)}
              onEditRole={onRoleUpdate ? () => handleEditRole(role) : undefined}
              onDeleteRole={onRoleDelete ? () => handleDeleteRole(role) : undefined}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CreateRoleDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        availablePermissions={availablePermissions}
        onSubmit={handleCreateSubmit}
        isSubmitting={isSubmitting}
      />

      <EditRoleDialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open)
          if (!open) setSelectedRole(null)
        }}
        role={selectedRole}
        availablePermissions={availablePermissions}
        onSubmit={handleEditSubmit}
        isSubmitting={isSubmitting}
      />

      <ViewRolePermissionsDialog
        open={viewDialogOpen}
        onOpenChange={(open) => {
          setViewDialogOpen(open)
          if (!open) setSelectedRole(null)
        }}
        role={selectedRole}
      />

      <DeleteRoleDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open)
          if (!open) setSelectedRole(null)
        }}
        role={selectedRole}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

RolesTab.displayName = 'RolesTab'

export default RolesTab
