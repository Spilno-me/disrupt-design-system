/**
 * User Management Components
 *
 * Configuration page for managing users, roles, and permissions.
 *
 * @usage
 * ```tsx
 * import { UsersPage } from '@adrozdenko/design-system/flow'
 *
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
 *   onRoleAssign={handleRoleAssign}
 * />
 * ```
 */

// Main page
export { UsersPage } from './UsersPage'

// Tab components
export { UsersTab } from './tabs/UsersTab'
export { RolesTab } from './tabs/RolesTab'

// Card components
export { UserStatsCards } from './cards/UserStatsCards'
export { UserPreviewCard } from './cards/UserPreviewCard'
export { RoleCard } from './cards/RoleCard'

// Table components
export { UsersDataTable } from './table/UsersDataTable'
export { BulkActionsBar } from './table/BulkActionsBar'

// Dialog components
export { CreateUserDialog } from './dialogs/CreateUserDialog'
export { EditUserDialog } from './dialogs/EditUserDialog'
export { DeleteUserDialog } from './dialogs/DeleteUserDialog'
export { ManageRolesDialog } from './dialogs/ManageRolesDialog'
// Role dialogs
export { CreateRoleDialog } from './dialogs/CreateRoleDialog'
export { EditRoleDialog } from './dialogs/EditRoleDialog'
export { ViewRolePermissionsDialog } from './dialogs/ViewRolePermissionsDialog'
export { DeleteRoleDialog } from './dialogs/DeleteRoleDialog'

// Location scope
export { LocationScopeSelector } from './location-scope/LocationScopeSelector'

// Activity
export { UserActivitySheet } from './activity/UserActivitySheet'

// Types
export type {
  User,
  UserStatus,
  Role,
  Permission,
  PermissionResource,
  PermissionAction,
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
  UsersPageProps,
  UsersTabProps,
  RolesTabProps,
  // Enhanced role/permission types
  EnhancedPermission,
  PermissionCategory,
  CreateRoleFormData,
  EditRoleFormData,
  RoleFilterType,
} from './types'

// Constants
export { USER_STATUS_CONFIG, ACTIVITY_TYPE_CONFIG } from './types'
