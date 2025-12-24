/**
 * UsersPage - Main User Management Page
 *
 * Single-page configuration for user management with tabbed navigation.
 * Supports full RBAC with location-based permission scoping.
 *
 * @example
 * ```tsx
 * <UsersPage
 *   users={users}
 *   roles={roles}
 *   locations={locations}
 *   departments={departments}
 *   jobTitles={jobTitles}
 *   stats={stats}
 *   onUserCreate={handleCreate}
 *   onUserUpdate={handleUpdate}
 *   onUserDelete={handleDelete}
 * />
 * ```
 */

import * as React from 'react'
import { Users, Shield, Plus, RefreshCw } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { UsersTab } from './tabs/UsersTab'
import { RolesTab } from './tabs/RolesTab'
import type { UsersPageProps } from './types'

// =============================================================================
// COMPONENT
// =============================================================================

export function UsersPage({
  users,
  roles,
  locations,
  departments,
  jobTitles,
  stats,
  isLoading = false,
  onUserCreate,
  onUserUpdate,
  onUserDelete,
  onRoleAssign,
  onRoleAssignmentUpdate,
  onRoleAssignmentRemove,
  onBulkAction,
  onFetchUserActivity,
  // Role CRUD props
  availablePermissions,
  onRoleCreate,
  onRoleUpdate,
  onRoleDelete,
}: UsersPageProps) {
  const [activeTab, setActiveTab] = React.useState('users')
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false)
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  // Handler for refresh button
  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true)
    // Simulate refresh delay - in real app, would refetch data
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsRefreshing(false)
  }, [])

  return (
    <div
      data-slot="users-page"
      className="flex flex-col gap-6 p-4 md:p-6"
    >
      {/* Page Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-primary">
            User Management
          </h1>
          <p className="text-sm text-secondary">
            Manage user accounts, roles, and access controls
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw
              className={cn(
                'size-4',
                isRefreshing && 'animate-spin'
              )}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setCreateDialogOpen(true)}
            className="gap-2"
          >
            <Plus className="size-4" />
            <span>Add User</span>
          </Button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList variant="accent" animated className="w-full max-w-md">
          <TabsTrigger
            variant="accent"
            value="users"
            className="gap-2"
          >
            <Users className="size-4" />
            <span>Users</span>
            {users.length > 0 && (
              <Badge
                variant="secondary"
                size="sm"
                className="ml-1 bg-surface/50"
              >
                {users.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            variant="accent"
            value="roles"
            className="gap-2"
          >
            <Shield className="size-4" />
            <span>Roles</span>
            {roles.length > 0 && (
              <Badge
                variant="secondary"
                size="sm"
                className="ml-1 bg-surface/50"
              >
                {roles.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Users Tab Content */}
        <TabsContent value="users" className="mt-6">
          <UsersTab
            users={users}
            roles={roles}
            locations={locations}
            departments={departments}
            jobTitles={jobTitles}
            stats={stats}
            isLoading={isLoading}
            createDialogOpen={createDialogOpen}
            onCreateDialogOpenChange={setCreateDialogOpen}
            onUserCreate={onUserCreate}
            onUserUpdate={onUserUpdate}
            onUserDelete={onUserDelete}
            onRoleAssign={onRoleAssign}
            onRoleAssignmentUpdate={onRoleAssignmentUpdate}
            onRoleAssignmentRemove={onRoleAssignmentRemove}
            onBulkAction={onBulkAction}
            onFetchUserActivity={onFetchUserActivity}
          />
        </TabsContent>

        {/* Roles Tab Content */}
        <TabsContent value="roles" className="mt-6">
          <RolesTab
            roles={roles}
            isLoading={isLoading}
            availablePermissions={availablePermissions}
            onRoleCreate={onRoleCreate}
            onRoleUpdate={onRoleUpdate}
            onRoleDelete={onRoleDelete}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

UsersPage.displayName = 'UsersPage'

export default UsersPage
