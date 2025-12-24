/**
 * UsersDataTable - Main user list table
 *
 * Features: Search, filters, sorting, selection, pagination, row actions
 */

import * as React from 'react'
import {
  MoreVertical,
  Edit2,
  Trash2,
  Shield,
  History,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { SearchFilter } from '../../../../components/shared/SearchFilter'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import { Checkbox } from '../../../../components/ui/checkbox'
import { Pagination } from '../../../../components/ui/Pagination'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'
import { UserPreviewCard } from '../cards/UserPreviewCard'
import type { FilterGroup } from '../../../../components/shared/SearchFilter'
import type { User, Role, UserStatus, UsersFilterState } from '../types'

// =============================================================================
// TYPES
// =============================================================================

// Re-export the SearchFilter's FilterGroup type for convenience
export type { FilterGroup, FilterOption } from '../../../../components/shared/SearchFilter'

interface UsersDataTableProps {
  users: User[]
  roles: Role[]
  isLoading?: boolean
  searchValue: string
  onSearchChange: (value: string) => void
  filterGroups: FilterGroup[]
  filters: UsersFilterState
  onFiltersChange: (filters: UsersFilterState) => void
  selectedRows: Set<string>
  onSelectionChange: (selected: Set<string>) => void
  sortColumn?: string
  sortDirection: 'asc' | 'desc'
  onSortChange: (column: string) => void
  currentPage: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onEditUser: (user: User) => void
  onDeleteUser: (user: User) => void
  onManageRoles: (user: User) => void
  onViewActivity: (user: User) => void
}

// =============================================================================
// STATUS CONFIG
// =============================================================================

const STATUS_CONFIG: Record<
  UserStatus,
  { label: string; variant: 'success' | 'secondary' | 'warning' | 'destructive' }
> = {
  active: { label: 'Active', variant: 'success' },
  inactive: { label: 'Inactive', variant: 'secondary' },
  pending: { label: 'Pending', variant: 'warning' },
  locked: { label: 'Locked', variant: 'destructive' },
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function UserAvatar({ user }: { user: User }) {
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()

  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={`${user.firstName} ${user.lastName}`}
        className="size-9 rounded-full object-cover"
      />
    )
  }

  return (
    <div className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-medium text-inverse">
      {initials}
    </div>
  )
}

function SortIndicator({
  column,
  sortColumn,
  sortDirection,
}: {
  column: string
  sortColumn?: string
  sortDirection: 'asc' | 'desc'
}) {
  if (sortColumn !== column) {
    return (
      <span className="ml-1 text-tertiary opacity-0 group-hover:opacity-50">
        ↕
      </span>
    )
  }

  return (
    <span className="ml-1 text-accent">
      {sortDirection === 'asc' ? '↑' : '↓'}
    </span>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function UsersDataTable({
  users,
  roles,
  isLoading = false,
  searchValue,
  onSearchChange,
  filterGroups,
  filters,
  onFiltersChange,
  selectedRows,
  onSelectionChange,
  sortColumn,
  sortDirection,
  onSortChange,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onEditUser,
  onDeleteUser,
  onManageRoles,
  onViewActivity,
}: UsersDataTableProps) {
  // Select all handler
  const handleSelectAll = React.useCallback(
    (checked: boolean) => {
      if (checked) {
        onSelectionChange(new Set(users.map((u) => u.id)))
      } else {
        onSelectionChange(new Set())
      }
    },
    [users, onSelectionChange]
  )

  // Individual row selection
  const handleRowSelect = React.useCallback(
    (userId: string, checked: boolean) => {
      const newSelected = new Set(selectedRows)
      if (checked) {
        newSelected.add(userId)
      } else {
        newSelected.delete(userId)
      }
      onSelectionChange(newSelected)
    },
    [selectedRows, onSelectionChange]
  )

  // Convert filters to SearchFilter format
  const searchFilterFilters = React.useMemo(() => {
    const result: Record<string, string[]> = {}
    if (filters.departments.length > 0) result.departments = filters.departments
    if (filters.roles.length > 0) result.roles = filters.roles
    if (filters.statuses.length > 0) result.statuses = filters.statuses
    return result
  }, [filters])

  const handleFiltersChange = React.useCallback(
    (newFilters: Record<string, string[]>) => {
      onFiltersChange({
        departments: newFilters.departments || [],
        roles: newFilters.roles || [],
        statuses: (newFilters.statuses || []) as UserStatus[],
        locations: newFilters.locations || [],
      })
    },
    [onFiltersChange]
  )

  const allSelected = users.length > 0 && selectedRows.size === users.length
  const someSelected = selectedRows.size > 0 && selectedRows.size < users.length

  return (
    <div data-slot="users-data-table" className="flex flex-col gap-4">
      {/* Search and Filters */}
      <SearchFilter
        placeholder="Search users by name, email, department..."
        value={searchValue}
        onChange={onSearchChange}
        filterGroups={filterGroups}
        filters={searchFilterFilters}
        onFiltersChange={handleFiltersChange}
        size="default"
      />

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-default bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-default bg-muted-bg">
                {/* Selection checkbox */}
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all users"
                  />
                </th>

                {/* User column */}
                <th
                  className="group cursor-pointer px-4 py-3 text-left text-sm font-medium text-secondary"
                  onClick={() => onSortChange('lastName')}
                >
                  User
                  <SortIndicator
                    column="lastName"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                  />
                </th>

                {/* Email - hidden on mobile */}
                <th
                  className="group hidden cursor-pointer px-4 py-3 text-left text-sm font-medium text-secondary md:table-cell"
                  onClick={() => onSortChange('email')}
                >
                  Email
                  <SortIndicator
                    column="email"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                  />
                </th>

                {/* Department - hidden on mobile/tablet */}
                <th
                  className="group hidden cursor-pointer px-4 py-3 text-left text-sm font-medium text-secondary lg:table-cell"
                  onClick={() => onSortChange('department')}
                >
                  Department
                  <SortIndicator
                    column="department"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                  />
                </th>

                {/* Job Title - hidden on mobile/tablet */}
                <th
                  className="group hidden cursor-pointer px-4 py-3 text-left text-sm font-medium text-secondary lg:table-cell"
                  onClick={() => onSortChange('jobTitle')}
                >
                  Job Title
                  <SortIndicator
                    column="jobTitle"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                  />
                </th>

                {/* Roles - hidden on mobile */}
                <th className="hidden px-4 py-3 text-left text-sm font-medium text-secondary md:table-cell">
                  Roles
                </th>

                {/* Status */}
                <th
                  className="group cursor-pointer px-4 py-3 text-left text-sm font-medium text-secondary"
                  onClick={() => onSortChange('status')}
                >
                  Status
                  <SortIndicator
                    column="status"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                  />
                </th>

                {/* Created - hidden on mobile/tablet */}
                <th
                  className="group hidden cursor-pointer px-4 py-3 text-left text-sm font-medium text-secondary lg:table-cell"
                  onClick={() => onSortChange('createdAt')}
                >
                  Created
                  <SortIndicator
                    column="createdAt"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                  />
                </th>

                {/* Actions */}
                <th className="w-16 px-4 py-3 text-right text-sm font-medium text-secondary">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-default">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4">
                      <div className="size-5 rounded bg-muted-bg" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-muted-bg" />
                        <div className="h-5 w-32 rounded bg-muted-bg" />
                      </div>
                    </td>
                    <td className="hidden px-4 py-4 md:table-cell">
                      <div className="h-5 w-40 rounded bg-muted-bg" />
                    </td>
                    <td className="hidden px-4 py-4 lg:table-cell">
                      <div className="h-5 w-24 rounded bg-muted-bg" />
                    </td>
                    <td className="hidden px-4 py-4 lg:table-cell">
                      <div className="h-5 w-24 rounded bg-muted-bg" />
                    </td>
                    <td className="hidden px-4 py-4 md:table-cell">
                      <div className="h-6 w-20 rounded bg-muted-bg" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-6 w-16 rounded bg-muted-bg" />
                    </td>
                    <td className="hidden px-4 py-4 lg:table-cell">
                      <div className="h-5 w-24 rounded bg-muted-bg" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="ml-auto size-8 rounded bg-muted-bg" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center">
                    <p className="text-secondary">No users found</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className={cn(
                      'transition-colors hover:bg-muted-bg/50',
                      selectedRows.has(user.id) && 'bg-accent/5'
                    )}
                  >
                    {/* Selection */}
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={selectedRows.has(user.id)}
                        onCheckedChange={(checked) =>
                          handleRowSelect(user.id, checked as boolean)
                        }
                        aria-label={`Select ${user.firstName} ${user.lastName}`}
                      />
                    </td>

                    {/* User (Avatar + Name) */}
                    <td className="px-4 py-4">
                      <TooltipProvider>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <button className="flex items-center gap-3 text-left">
                              <UserAvatar user={user} />
                              <div>
                                <p className="font-medium text-primary">
                                  {user.firstName} {user.lastName}
                                </p>
                                <p className="text-sm text-secondary md:hidden">
                                  {user.email}
                                </p>
                              </div>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right" align="start" className="w-80 p-0">
                            <UserPreviewCard user={user} />
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>

                    {/* Email */}
                    <td className="hidden px-4 py-4 md:table-cell">
                      <a
                        href={`mailto:${user.email}`}
                        className="text-sm text-secondary hover:text-accent"
                      >
                        {user.email}
                      </a>
                    </td>

                    {/* Department */}
                    <td className="hidden px-4 py-4 lg:table-cell">
                      <span className="text-sm text-secondary">{user.department}</span>
                    </td>

                    {/* Job Title */}
                    <td className="hidden px-4 py-4 lg:table-cell">
                      <span className="text-sm text-secondary">{user.jobTitle}</span>
                    </td>

                    {/* Roles */}
                    <td className="hidden px-4 py-4 md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {user.roleAssignments.slice(0, 2).map((ra) => (
                          <Badge
                            key={ra.id}
                            variant="secondary"
                            size="sm"
                            className="font-normal"
                          >
                            {ra.role.name}
                          </Badge>
                        ))}
                        {user.roleAssignments.length > 2 && (
                          <Badge variant="outline" size="sm">
                            +{user.roleAssignments.length - 2}
                          </Badge>
                        )}
                        {user.roleAssignments.length === 0 && (
                          <span className="text-sm text-tertiary">No roles</span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <Badge
                        variant={STATUS_CONFIG[user.status].variant}
                        size="sm"
                        shape="pill"
                      >
                        {STATUS_CONFIG[user.status].label}
                      </Badge>
                    </td>

                    {/* Created */}
                    <td className="hidden px-4 py-4 lg:table-cell">
                      <span className="text-sm text-secondary">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            aria-label="User actions"
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditUser(user)}>
                            <Edit2 className="mr-2 size-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onManageRoles(user)}>
                            <Shield className="mr-2 size-4" />
                            Manage Roles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onViewActivity(user)}>
                            <History className="mr-2 size-4" />
                            View Activity
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDeleteUser(user)}
                            className="text-error focus:text-error"
                          >
                            <Trash2 className="mr-2 size-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalItems > 0 && (
          <div className="border-t border-default px-4 py-3">
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              pageSizeOptions={[10, 25, 50, 100]}
              showPageSizeSelector
              showResultsText
            />
          </div>
        )}
      </div>
    </div>
  )
}

UsersDataTable.displayName = 'UsersDataTable'

export default UsersDataTable
