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

  // Extended contact info for User Profile (optional for backward compatibility)
  /** Physical office/desk location (e.g., "Building A, Floor 3, Desk 42") */
  officeLocation?: string
  /** Working hours (e.g., "9:00 AM - 5:00 PM") */
  workingHours?: string
  /** IANA timezone (e.g., "America/New_York") */
  timezone?: string
  /** Flag for emergency response team members */
  isEmergencyContact?: boolean
  /** Slack handle for direct messaging */
  slackHandle?: string
  /** Microsoft Teams email for chat integration */
  teamsEmail?: string
}

// =============================================================================
// ROLE LEVEL TYPES (for Organization Directory hierarchy)
// =============================================================================

/**
 * Role hierarchy level for organization directory grouping.
 * Level 1 = highest authority, Level 5 = lowest.
 */
export type RoleLevel = 1 | 2 | 3 | 4 | 5

/**
 * Badge variant type for role levels.
 * Uses semantic badge variants for proper contrast and theming.
 */
export type RoleLevelBadgeVariant = 'warning' | 'info' | 'success' | 'secondary' | 'outline'

export const ROLE_LEVEL_CONFIG: Record<
  RoleLevel,
  { label: string; description: string; badgeVariant: RoleLevelBadgeVariant; iconColor: string }
> = {
  1: { label: 'Executive', description: 'Directors and senior leadership', badgeVariant: 'warning', iconColor: 'text-warning' },
  2: { label: 'Manager', description: 'Department and team managers', badgeVariant: 'info', iconColor: 'text-info' },
  3: { label: 'Specialist', description: 'Subject matter experts', badgeVariant: 'success', iconColor: 'text-success' },
  4: { label: 'Field Worker', description: 'Frontline workers', badgeVariant: 'secondary', iconColor: 'text-secondary' },
  5: { label: 'Viewer', description: 'Read-only access', badgeVariant: 'outline', iconColor: 'text-tertiary' },
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
  /** Role hierarchy level for organization directory grouping (1=Executive, 5=Viewer) */
  level?: RoleLevel
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
  // Admin-actionable metrics (EHS context)
  /** Accounts requiring admin attention */
  lockedAccounts?: number
  /** Users inactive for 30+ days */
  inactiveUsers?: number
  /** Percentage of users with 2FA enabled */
  twoFactorPercentage?: number
  /** Failed login attempts in last 24h */
  failedLogins24h?: number
  /** Users with certifications expiring in 30 days */
  expiringCertifications?: number
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
