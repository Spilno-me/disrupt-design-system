/**
 * UsersDataTable - Main user list table
 *
 * Features: Search, filters, sorting, selection, pagination, row actions
 */

import * as React from 'react'
import {
  Edit2,
  Trash2,
  Shield,
  Users,
  SearchX,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { SearchFilter } from '../../../../components/shared/SearchFilter'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import { ActionTile } from '../../../../components/ui/ActionTile'
import { Checkbox } from '../../../../components/ui/checkbox'
import { Pagination } from '../../../../components/ui/Pagination'
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

      {/* Table - Depth 2 glass for prominent content container */}
      {/* Light: white glass, Dark: black glass */}
      <div className="overflow-hidden rounded-xl bg-white/40 dark:bg-black/40 backdrop-blur-[4px] border-2 border-accent shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead
              className="border-b border-accent/30 bg-white/30 dark:bg-black/30"
            >
              <tr>
                {/* Selection checkbox */}
                <th className="w-12 px-4 py-3 border-r border-accent/20">
                  <Checkbox
                    checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all users"
                  />
                </th>

                {/* User column */}
                <th
                  className="group cursor-pointer px-4 py-3 text-left text-sm font-medium text-secondary whitespace-nowrap border-r border-accent/20 hover:text-primary transition-colors"
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
                  className="group hidden cursor-pointer px-4 py-3 text-left text-sm font-medium text-secondary whitespace-nowrap border-r border-accent/20 hover:text-primary transition-colors md:table-cell"
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
                  className="group hidden cursor-pointer px-4 py-3 text-left text-sm font-medium text-secondary whitespace-nowrap border-r border-accent/20 hover:text-primary transition-colors lg:table-cell"
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
                  className="group hidden cursor-pointer px-4 py-3 text-left text-sm font-medium text-secondary whitespace-nowrap border-r border-accent/20 hover:text-primary transition-colors lg:table-cell"
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
                <th className="hidden px-4 py-3 text-left text-sm font-medium text-secondary whitespace-nowrap border-r border-accent/20 md:table-cell">
                  Roles
                </th>

                {/* Status */}
                <th
                  className="group cursor-pointer px-4 py-3 text-left text-sm font-medium text-secondary whitespace-nowrap border-r border-accent/20 hover:text-primary transition-colors"
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
                  className="group hidden cursor-pointer px-4 py-3 text-left text-sm font-medium text-secondary whitespace-nowrap border-r border-accent/20 hover:text-primary transition-colors lg:table-cell"
                  onClick={() => onSortChange('createdAt')}
                >
                  Created
                  <SortIndicator
                    column="createdAt"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                  />
                </th>

                {/* Actions - 3 visible buttons per UX rule (no right border on last column) */}
                <th className="w-28 px-4 py-3 text-right text-sm font-medium text-secondary whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white/20 dark:bg-black/20 divide-y divide-accent/20">
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
                  <td colSpan={9} className="px-4 py-12">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-full bg-muted-bg">
                        {searchValue ? (
                          <SearchX className="size-6 text-tertiary" />
                        ) : (
                          <Users className="size-6 text-tertiary" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-primary">No users found</p>
                        <p className="mt-1 text-sm text-secondary">
                          {searchValue
                            ? 'Try adjusting your search terms or clearing filters'
                            : 'Add your first team member to get started'}
                        </p>
                      </div>
                      {searchValue && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSearchChange('')}
                          className="mt-2"
                        >
                          Clear Search
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    tabIndex={0}
                    className={cn(
                      'transition-colors hover:bg-muted-bg/50',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent',
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

                    {/* Actions - 3 visible ActionTile buttons (≤3 actions rule) */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <ActionTile
                                variant="info"
                                appearance="filled"
                                size="xs"
                                onClick={() => onEditUser(user)}
                                aria-label={`Edit ${user.firstName} ${user.lastName}`}
                              >
                                <Edit2 className="size-4" />
                              </ActionTile>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <ActionTile
                                variant="neutral"
                                appearance="filled"
                                size="xs"
                                onClick={() => onManageRoles(user)}
                                aria-label={`Manage roles for ${user.firstName} ${user.lastName}`}
                              >
                                <Shield className="size-4" />
                              </ActionTile>
                            </TooltipTrigger>
                            <TooltipContent>Roles</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <ActionTile
                                variant="destructive"
                                appearance="filled"
                                size="xs"
                                onClick={() => onDeleteUser(user)}
                                aria-label={`Delete ${user.firstName} ${user.lastName}`}
                              >
                                <Trash2 className="size-4" />
                              </ActionTile>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - glass styling to match container */}
        {totalItems > 0 && (
          <div
            className="border-t border-accent/30 bg-white/30 dark:bg-black/30 px-4 py-3"
          >
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
