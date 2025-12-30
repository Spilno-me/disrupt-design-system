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
import { Users, Shield, Plus, RefreshCw, UserPlus } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { PageActionPanel } from '../../../components/ui/PageActionPanel'
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
      {/* Page Header - ActionCard style */}
      <PageActionPanel
        icon={<Users className="w-6 h-6 md:w-8 md:h-8" />}
        iconClassName="text-accent"
        title="User Management"
        subtitle="Manage user accounts, roles, and access controls"
        primaryAction={
          <Button
            size="sm"
            onClick={() => setCreateDialogOpen(true)}
            className="gap-1.5"
          >
            <UserPlus className="size-4" />
            <span className="sr-only sm:not-sr-only">Add User</span>
            <span className="sm:sr-only">Add</span>
          </Button>
        }
        actions={
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
            Refresh
          </Button>
        }
      />

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
                className="ml-1 rounded-xs bg-muted-bg text-primary"
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
                className="ml-1 rounded-xs bg-muted-bg text-primary"
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
