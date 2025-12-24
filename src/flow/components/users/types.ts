/**
 * User Management Types
 *
 * TypeScript interfaces for the User Management configuration page.
 * Supports full RBAC with location-based permission scoping.
 */

// =============================================================================
// USER TYPES
// =============================================================================

export type UserStatus = 'active' | 'inactive' | 'pending' | 'locked'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
  phone?: string
  jobTitle: string
  department: string
  bio?: string
  status: UserStatus
  createdAt: string
  lastLoginAt?: string
  roleAssignments: RoleAssignment[]
}

// =============================================================================
// ROLE & PERMISSION TYPES
// =============================================================================

export type PermissionResource =
  | 'incidents'
  | 'inspections'
  | 'permits'
  | 'tasks'
  | 'users'
  | 'reports'
  | 'settings'
  | 'corrective-actions'
  | 'locations'
  | 'modules'
  | 'dictionary'
  | 'entity-templates'
  | 'process-definition-templates'

export type PermissionAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'approve'
  | 'read-own'
  | 'update-own'
  | 'manage-own-tasks'

export interface Permission {
  id: string
  resource: PermissionResource
  actions: PermissionAction[]
}

export interface Role {
  id: string
  name: string
  description?: string
  permissions: Permission[]
  isSystem: boolean // System roles cannot be deleted
  userCount: number
}

// =============================================================================
// LOCATION SCOPE TYPES
// =============================================================================

export interface LocationNode {
  id: string
  label: string
  level: number
  icon?: string
  children?: LocationNode[]
  selectable?: boolean
}

export interface LocationScope {
  id: string
  locationId: string
  locationName: string
  locationPath: string[] // ["Root Location", "Company A", "Department A1"]
  includeChildren: boolean
}

export interface RoleAssignment {
  id: string
  role: Role
  scopes: LocationScope[]
  assignedAt: string
  assignedBy: string
}

// =============================================================================
// ACTIVITY TYPES
// =============================================================================

export type UserActivityType =
  | 'login'
  | 'logout'
  | 'password_change'
  | 'role_assigned'
  | 'role_removed'
  | 'scope_changed'
  | 'status_changed'
  | 'profile_updated'
  | 'created'

export interface UserActivity {
  id: string
  userId: string
  type: UserActivityType
  title: string
  details?: string
  timestamp: string
  performedBy: {
    id: string
    name: string
  }
  metadata?: Record<string, unknown>
}

// =============================================================================
// FORM DATA TYPES
// =============================================================================

export interface CreateUserFormData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  jobTitle: string
  department: string
  bio?: string
  status: UserStatus
}

export interface EditUserFormData extends CreateUserFormData {
  id: string
}

export interface AddRoleAssignmentFormData {
  roleId: string
  scopes: LocationScope[]
}

export interface EditRoleAssignmentFormData {
  assignmentId: string
  scopes: LocationScope[]
}

// =============================================================================
// BULK ACTION TYPES
// =============================================================================

export type BulkActionType = 'assign_role' | 'deactivate' | 'activate' | 'delete'

export interface BulkActionPayload {
  userIds: string[]
  action: BulkActionType
  roleId?: string
  scopes?: LocationScope[]
}

// =============================================================================
// FILTER & STATS TYPES
// =============================================================================

export type QuickFilterStatus = 'all' | UserStatus

export interface UsersFilterState {
  departments: string[]
  roles: string[]
  statuses: UserStatus[]
  locations: string[]
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  pendingInvites: number
  roleDistribution: Array<{
    roleName: string
    count: number
    percentage: number
  }>
  trend?: {
    direction: 'up' | 'down' | 'stable'
    percentage: number
  }
}

// =============================================================================
// COMPONENT PROPS TYPES
// =============================================================================

export interface UsersPageProps {
  /** User data */
  users: User[]
  /** Available roles */
  roles: Role[]
  /** Location tree for scope selection */
  locations: LocationNode[]
  /** Available departments for filtering */
  departments: string[]
  /** Available job titles */
  jobTitles: string[]
  /** User statistics */
  stats?: UserStats
  /** Loading state */
  isLoading?: boolean

  // CRUD callbacks
  onUserCreate?: (data: CreateUserFormData) => Promise<void>
  onUserUpdate?: (data: EditUserFormData) => Promise<void>
  onUserDelete?: (userId: string) => Promise<void>

  // Role assignment callbacks
  onRoleAssign?: (userId: string, data: AddRoleAssignmentFormData) => Promise<void>
  onRoleAssignmentUpdate?: (userId: string, data: EditRoleAssignmentFormData) => Promise<void>
  onRoleAssignmentRemove?: (userId: string, assignmentId: string) => Promise<void>

  // Bulk action callback
  onBulkAction?: (payload: BulkActionPayload) => Promise<void>

  // Activity callback
  onFetchUserActivity?: (userId: string) => Promise<UserActivity[]>

  // Role CRUD callbacks (for RolesTab)
  /** Available permissions for role creation/editing */
  availablePermissions?: EnhancedPermission[]
  /** Create new custom role */
  onRoleCreate?: (data: CreateRoleFormData) => Promise<void>
  /** Update existing custom role */
  onRoleUpdate?: (data: EditRoleFormData) => Promise<void>
  /** Delete custom role */
  onRoleDelete?: (roleId: string) => Promise<void>
}

export interface UsersTabProps {
  users: User[]
  roles: Role[]
  locations: LocationNode[]
  departments: string[]
  jobTitles: string[]
  stats?: UserStats
  isLoading?: boolean
  onUserCreate?: (data: CreateUserFormData) => Promise<void>
  onUserUpdate?: (data: EditUserFormData) => Promise<void>
  onUserDelete?: (userId: string) => Promise<void>
  onRoleAssign?: (userId: string, data: AddRoleAssignmentFormData) => Promise<void>
  onRoleAssignmentUpdate?: (userId: string, data: EditRoleAssignmentFormData) => Promise<void>
  onRoleAssignmentRemove?: (userId: string, assignmentId: string) => Promise<void>
  onBulkAction?: (payload: BulkActionPayload) => Promise<void>
  onFetchUserActivity?: (userId: string) => Promise<UserActivity[]>
}

// =============================================================================
// ENHANCED PERMISSION TYPES (for progressive disclosure UI)
// =============================================================================

export type PermissionCategory = 'management' | 'access'

/**
 * Enhanced permission with human-readable labels and bitmask value.
 * Used in role creation/editing dialogs with progressive disclosure.
 */
export interface EnhancedPermission {
  id: string
  resource: PermissionResource
  action: PermissionAction
  category: PermissionCategory
  /** Bitmask value - hidden by default, shown in developer mode */
  bitmask: number
  /** Human-readable label (e.g., "Create users") */
  label: string
  /** Description for tooltip/help text */
  description?: string
}

/**
 * Resource-level permission summary for card display.
 * Groups permissions by resource with count for progressive disclosure.
 */
export interface ResourcePermissionSummary {
  resource: PermissionResource
  /** Human-readable resource name (e.g., "Users") */
  resourceLabel: string
  /** Total permission count for this resource */
  count: number
  /** Permissions in this resource */
  permissions: EnhancedPermission[]
}

// =============================================================================
// ROLE FORM DATA TYPES
// =============================================================================

export interface CreateRoleFormData {
  name: string
  description?: string
  /** Array of permission IDs to assign */
  permissions: string[]
}

export interface EditRoleFormData extends CreateRoleFormData {
  id: string
}

// =============================================================================
// ROLE FILTER TYPES
// =============================================================================

export type RoleFilterType = 'all' | 'system' | 'custom'

export interface RolesTabProps {
  roles: Role[]
  isLoading?: boolean
  /** Available permissions for role creation/editing */
  availablePermissions?: EnhancedPermission[]
  /** CRUD callbacks */
  onRoleCreate?: (data: CreateRoleFormData) => Promise<void>
  onRoleUpdate?: (data: EditRoleFormData) => Promise<void>
  onRoleDelete?: (roleId: string) => Promise<void>
}

// =============================================================================
// STATUS DISPLAY HELPERS
// =============================================================================

export const USER_STATUS_CONFIG: Record<
  UserStatus,
  { label: string; variant: 'success' | 'secondary' | 'warning' | 'destructive' }
> = {
  active: { label: 'Active', variant: 'success' },
  inactive: { label: 'Inactive', variant: 'secondary' },
  pending: { label: 'Pending', variant: 'warning' },
  locked: { label: 'Locked', variant: 'destructive' },
}

export const ACTIVITY_TYPE_CONFIG: Record<
  UserActivityType,
  { label: string; icon: string }
> = {
  login: { label: 'Logged in', icon: 'LogIn' },
  logout: { label: 'Logged out', icon: 'LogOut' },
  password_change: { label: 'Password changed', icon: 'Key' },
  role_assigned: { label: 'Role assigned', icon: 'ShieldPlus' },
  role_removed: { label: 'Role removed', icon: 'ShieldMinus' },
  scope_changed: { label: 'Scope changed', icon: 'MapPin' },
  status_changed: { label: 'Status changed', icon: 'UserCog' },
  profile_updated: { label: 'Profile updated', icon: 'UserPen' },
  created: { label: 'Account created', icon: 'UserPlus' },
}
