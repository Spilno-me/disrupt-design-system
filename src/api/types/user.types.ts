/**
 * User API Types
 *
 * Re-exports user types from flow components and adds API-specific input types.
 */

// Re-export all user types from the source of truth
export type {
  User,
  UserStatus,
  RoleLevel,
  Permission,
  PermissionResource,
  PermissionAction,
  Role,
  LocationNode,
  LocationScope,
  RoleAssignment,
  UserActivity,
  UserActivityType,
  CreateUserFormData,
  EditUserFormData,
  AddRoleAssignmentFormData,
  EditRoleAssignmentFormData,
  BulkActionType,
  BulkActionPayload,
  QuickFilterStatus,
  UsersFilterState,
  UserStats,
  EnhancedPermission,
  PermissionCategory,
  ResourcePermissionSummary,
  CreateRoleFormData,
  EditRoleFormData,
  RoleFilterType,
} from '../../flow/components/users/types'

// Re-export constants
export {
  ROLE_LEVEL_CONFIG,
  USER_STATUS_CONFIG,
  ACTIVITY_TYPE_CONFIG,
} from '../../flow/components/users/types'

// =============================================================================
// API INPUT TYPES
// =============================================================================

/**
 * Input for creating a new user via API
 */
export interface CreateUserInput {
  email: string
  firstName: string
  lastName: string
  phone?: string
  jobTitle: string
  department: string
  bio?: string
  status?: 'active' | 'inactive' | 'pending'
  officeLocation?: string
  workingHours?: string
  timezone?: string
  isEmergencyContact?: boolean
  slackHandle?: string
  teamsEmail?: string
}

/**
 * Input for updating a user via API
 */
export interface UpdateUserInput {
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
  avatarUrl?: string
  jobTitle?: string
  department?: string
  bio?: string
  status?: 'active' | 'inactive' | 'pending' | 'locked'
  officeLocation?: string
  workingHours?: string
  timezone?: string
  isEmergencyContact?: boolean
  slackHandle?: string
  teamsEmail?: string
}

/**
 * Input for creating a role assignment
 */
export interface CreateRoleAssignmentInput {
  userId: string
  roleId: string
  scopes: Array<{
    locationId: string
    includeChildren: boolean
  }>
}

/**
 * Input for updating user status in bulk
 */
export interface BulkStatusUpdateInput {
  userIds: string[]
  status: 'active' | 'inactive' | 'locked'
}

/**
 * Filter options for listing users
 */
export interface UserListFilters {
  status?: ('active' | 'inactive' | 'pending' | 'locked')[]
  departments?: string[]
  roles?: string[]
  locations?: string[]
  search?: string
}

// =============================================================================
// API ROLE INPUT TYPES
// =============================================================================

/**
 * Input for creating a new role
 */
export interface CreateRoleInput {
  name: string
  description?: string
  level: 1 | 2 | 3 | 4 | 5
  permissions: string[] // Permission IDs
}

/**
 * Input for updating a role
 */
export interface UpdateRoleInput {
  name?: string
  description?: string
  level?: 1 | 2 | 3 | 4 | 5
  permissions?: string[] // Permission IDs
}

/**
 * Filter options for listing roles
 */
export interface RoleListFilters {
  isSystem?: boolean
  level?: (1 | 2 | 3 | 4 | 5)[]
  search?: string
}
