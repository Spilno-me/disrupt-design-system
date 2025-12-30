/**
 * UsersTab - Users list tab content
 *
 * Contains stats cards, search/filter, data table, and bulk actions.
 */

import * as React from 'react'
import { cn } from '../../../../lib/utils'
import { UserStatsCards } from '../cards/UserStatsCards'
import { UsersDataTable } from '../table/UsersDataTable'
import { BulkActionsBar } from '../table/BulkActionsBar'
import { CreateUserDialog } from '../dialogs/CreateUserDialog'
import { EditUserDialog } from '../dialogs/EditUserDialog'
import { DeleteUserDialog } from '../dialogs/DeleteUserDialog'
import { ManageRolesDialog } from '../dialogs/ManageRolesDialog'
import type {
  UsersTabProps,
  User,
  UserStatus,
  UsersFilterState,
  QuickFilterStatus,
  CreateUserFormData,
  EditUserFormData,
  AddRoleAssignmentFormData,
  BulkActionPayload,
} from '../types'

// =============================================================================
// EXTENDED PROPS
// =============================================================================

interface ExtendedUsersTabProps extends UsersTabProps {
  createDialogOpen: boolean
  onCreateDialogOpenChange: (open: boolean) => void
}

// =============================================================================
// QUICK FILTER OPTIONS
// =============================================================================

const QUICK_FILTERS: Array<{ value: QuickFilterStatus; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'locked', label: 'Locked' },
]

// =============================================================================
// COMPONENT
// =============================================================================

export function UsersTab({
  users,
  roles,
  locations,
  departments,
  jobTitles,
  stats,
  isLoading = false,
  createDialogOpen,
  onCreateDialogOpenChange,
  onUserCreate,
  onUserUpdate,
  onUserDelete,
  onRoleAssign,
  onRoleAssignmentUpdate,
  onRoleAssignmentRemove,
  onBulkAction,
  onFetchUserActivity,
}: ExtendedUsersTabProps) {
  // Search and filter state
  const [searchValue, setSearchValue] = React.useState('')
  const [quickFilter, setQuickFilter] = React.useState<QuickFilterStatus>('all')
  const [filters, setFilters] = React.useState<UsersFilterState>({
    departments: [],
    roles: [],
    statuses: [],
    locations: [],
  })

  // Table state
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [sortColumn, setSortColumn] = React.useState<string | undefined>('lastName')
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc')

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [manageRolesDialogOpen, setManageRolesDialogOpen] = React.useState(false)
  // Selected user for actions
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)

  // Submission states
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Filter users based on search, quick filter, and advanced filters
  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      // Search filter
      if (searchValue) {
        const search = searchValue.toLowerCase()
        const matchesSearch =
          user.firstName.toLowerCase().includes(search) ||
          user.lastName.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          user.department.toLowerCase().includes(search) ||
          user.jobTitle.toLowerCase().includes(search)
        if (!matchesSearch) return false
      }

      // Quick filter (status)
      if (quickFilter !== 'all' && user.status !== quickFilter) {
        return false
      }

      // Advanced filters
      if (filters.departments.length > 0 && !filters.departments.includes(user.department)) {
        return false
      }
      if (filters.statuses.length > 0 && !filters.statuses.includes(user.status)) {
        return false
      }
      if (filters.roles.length > 0) {
        const userRoleIds = user.roleAssignments.map((ra) => ra.role.id)
        if (!filters.roles.some((roleId) => userRoleIds.includes(roleId))) {
          return false
        }
      }

      return true
    })
  }, [users, searchValue, quickFilter, filters])

  // Sort users
  const sortedUsers = React.useMemo(() => {
    if (!sortColumn) return filteredUsers

    return [...filteredUsers].sort((a, b) => {
      let aVal: string | number
      let bVal: string | number

      switch (sortColumn) {
        case 'firstName':
          aVal = a.firstName.toLowerCase()
          bVal = b.firstName.toLowerCase()
          break
        case 'lastName':
          aVal = a.lastName.toLowerCase()
          bVal = b.lastName.toLowerCase()
          break
        case 'email':
          aVal = a.email.toLowerCase()
          bVal = b.email.toLowerCase()
          break
        case 'department':
          aVal = a.department.toLowerCase()
          bVal = b.department.toLowerCase()
          break
        case 'jobTitle':
          aVal = a.jobTitle.toLowerCase()
          bVal = b.jobTitle.toLowerCase()
          break
        case 'status':
          aVal = a.status
          bVal = b.status
          break
        case 'createdAt':
          aVal = new Date(a.createdAt).getTime()
          bVal = new Date(b.createdAt).getTime()
          break
        default:
          return 0
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredUsers, sortColumn, sortDirection])

  // Paginate users
  const paginatedUsers = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedUsers.slice(start, start + pageSize)
  }, [sortedUsers, currentPage, pageSize])

  // Handle sort change
  const handleSortChange = React.useCallback((column: string) => {
    setSortColumn((prev) => {
      if (prev === column) {
        setSortDirection((dir) => (dir === 'asc' ? 'desc' : 'asc'))
        return column
      }
      setSortDirection('asc')
      return column
    })
  }, [])

  // Handle user actions
  const handleEditUser = React.useCallback((user: User) => {
    setSelectedUser(user)
    setEditDialogOpen(true)
  }, [])

  const handleDeleteUser = React.useCallback((user: User) => {
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }, [])

  const handleManageRoles = React.useCallback((user: User) => {
    setSelectedUser(user)
    setManageRolesDialogOpen(true)
  }, [])

  // CRUD handlers
  const handleCreateSubmit = React.useCallback(
    async (data: CreateUserFormData) => {
      if (!onUserCreate) return
      setIsSubmitting(true)
      try {
        await onUserCreate(data)
        onCreateDialogOpenChange(false)
      } finally {
        setIsSubmitting(false)
      }
    },
    [onUserCreate, onCreateDialogOpenChange]
  )

  const handleEditSubmit = React.useCallback(
    async (data: EditUserFormData) => {
      if (!onUserUpdate) return
      setIsSubmitting(true)
      try {
        await onUserUpdate(data)
        setEditDialogOpen(false)
        setSelectedUser(null)
      } finally {
        setIsSubmitting(false)
      }
    },
    [onUserUpdate]
  )

  const handleDeleteConfirm = React.useCallback(async () => {
    if (!onUserDelete || !selectedUser) return
    setIsSubmitting(true)
    try {
      await onUserDelete(selectedUser.id)
      setDeleteDialogOpen(false)
      setSelectedUser(null)
    } finally {
      setIsSubmitting(false)
    }
  }, [onUserDelete, selectedUser])

  // Bulk action handlers
  const handleBulkAssignRole = React.useCallback(
    async (roleId: string, scopes: AddRoleAssignmentFormData['scopes']) => {
      if (!onBulkAction) return
      setIsSubmitting(true)
      try {
        await onBulkAction({
          userIds: Array.from(selectedRows),
          action: 'assign_role',
          roleId,
          scopes,
        })
        setSelectedRows(new Set())
      } finally {
        setIsSubmitting(false)
      }
    },
    [onBulkAction, selectedRows]
  )

  const handleBulkDeactivate = React.useCallback(async () => {
    if (!onBulkAction) return
    setIsSubmitting(true)
    try {
      await onBulkAction({
        userIds: Array.from(selectedRows),
        action: 'deactivate',
      })
      setSelectedRows(new Set())
    } finally {
      setIsSubmitting(false)
    }
  }, [onBulkAction, selectedRows])

  const handleClearSelection = React.useCallback(() => {
    setSelectedRows(new Set())
  }, [])

  // Build filter groups for SearchFilter
  const filterGroups = React.useMemo(
    () => [
      {
        key: 'departments',
        label: 'Department',
        options: departments.map((d) => ({ id: d, label: d })),
      },
      {
        key: 'roles',
        label: 'Role',
        options: roles.map((r) => ({ id: r.id, label: r.name })),
      },
      {
        key: 'statuses',
        label: 'Status',
        options: [
          { id: 'active', label: 'Active' },
          { id: 'inactive', label: 'Inactive' },
          { id: 'pending', label: 'Pending' },
          { id: 'locked', label: 'Locked' },
        ],
      },
    ],
    [departments, roles]
  )

  return (
    <div data-slot="users-tab" className="flex flex-col gap-6">
      {/* Stats Cards */}
      {stats && <UserStatsCards stats={stats} />}

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {QUICK_FILTERS.map((filter) => {
          const isActive = quickFilter === filter.value
          const count =
            filter.value === 'all'
              ? users.length
              : users.filter((u) => u.status === filter.value).length

          return (
            <button
              key={filter.value}
              onClick={() => setQuickFilter(filter.value)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                'min-h-11 sm:min-h-9', // Touch target: 44px mobile, 36px desktop (Fitts's Law)
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
                // Glass effect - Light: white glass, Dark: black glass
                isActive
                  // Use bg-accent-noise for reliable teal (same as tabs sliding indicator)
                  ? 'bg-accent-noise text-white'
                  : 'bg-white/20 dark:bg-black/20 backdrop-blur-[2px] text-secondary hover:bg-white/35 dark:hover:bg-black/35 hover:text-primary border border-white/30 dark:border-white/10'
              )}
            >
              {filter.label}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-xs font-medium',
                  // Active: white bg with accent text for max contrast on teal
                  // Inactive: muted-bg gives visible boundary on white surface
                  isActive ? 'bg-white text-accent' : 'bg-muted-bg text-primary'
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Users Data Table */}
      <UsersDataTable
        users={paginatedUsers}
        roles={roles}
        isLoading={isLoading}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterGroups={filterGroups}
        filters={filters}
        onFiltersChange={setFilters}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={sortedUsers.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onManageRoles={handleManageRoles}
      />

      {/* Bulk Actions Bar */}
      {selectedRows.size > 0 && (
        <BulkActionsBar
          selectedCount={selectedRows.size}
          selectedUsers={users
            .filter((u) => selectedRows.has(u.id))
            .map((u) => ({ id: u.id, firstName: u.firstName, lastName: u.lastName }))}
          roles={roles}
          locations={locations}
          onAssignRole={handleBulkAssignRole}
          onDeactivate={handleBulkDeactivate}
          onClearSelection={handleClearSelection}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Dialogs */}
      <CreateUserDialog
        open={createDialogOpen}
        onOpenChange={onCreateDialogOpenChange}
        departments={departments}
        jobTitles={jobTitles}
        onSubmit={handleCreateSubmit}
        isSubmitting={isSubmitting}
      />

      <EditUserDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        user={selectedUser}
        departments={departments}
        jobTitles={jobTitles}
        onSubmit={handleEditSubmit}
        isSubmitting={isSubmitting}
      />

      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        user={selectedUser}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isSubmitting}
      />

      <ManageRolesDialog
        open={manageRolesDialogOpen}
        onOpenChange={setManageRolesDialogOpen}
        user={selectedUser}
        roles={roles}
        locations={locations}
        onRoleAssign={onRoleAssign}
        onRoleAssignmentUpdate={onRoleAssignmentUpdate}
        onRoleAssignmentRemove={onRoleAssignmentRemove}
      />
    </div>
  )
}

UsersTab.displayName = 'UsersTab'

export default UsersTab
