/**
 * Mock Roles Data - Disrupt Flow App
 *
 * SINGLE SOURCE OF TRUTH for role definitions used across:
 * - User Management page
 * - Organization Directory
 * - Permission dialogs
 * - Flow stories
 */

import type { Role, Permission, EnhancedPermission } from '../components/users/types'

// =============================================================================
// BASE PERMISSIONS
// =============================================================================

export const mockPermissions: Permission[] = [
  { id: 'perm-1', resource: 'incidents', actions: ['create', 'read', 'update', 'delete'] },
  { id: 'perm-2', resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
  { id: 'perm-3', resource: 'reports', actions: ['read'] },
  { id: 'perm-4', resource: 'settings', actions: ['read', 'update'] },
  { id: 'perm-5', resource: 'inspections', actions: ['create', 'read', 'update'] },
  { id: 'perm-6', resource: 'tasks', actions: ['create', 'read', 'update', 'delete'] },
]

// =============================================================================
// ENHANCED PERMISSIONS (for role creation/editing dialogs)
// =============================================================================

export const mockEnhancedPermissions: EnhancedPermission[] = [
  // Incidents
  { id: 'incidents-create', resource: 'incidents', action: 'create', category: 'access', bitmask: 1, label: 'Create incidents', description: 'Permission to create new incident reports' },
  { id: 'incidents-read', resource: 'incidents', action: 'read', category: 'access', bitmask: 2, label: 'View incidents', description: 'Permission to view all incident data' },
  { id: 'incidents-update', resource: 'incidents', action: 'update', category: 'access', bitmask: 4, label: 'Update incidents', description: 'Permission to modify incident records' },
  { id: 'incidents-delete', resource: 'incidents', action: 'delete', category: 'management', bitmask: 8, label: 'Delete incidents', description: 'Permission to permanently remove incident records' },
  { id: 'incidents-approve', resource: 'incidents', action: 'approve', category: 'management', bitmask: 1024, label: 'Approve incidents', description: 'Permission to approve incident submissions' },
  // Users
  { id: 'users-create', resource: 'users', action: 'create', category: 'access', bitmask: 1, label: 'Create users', description: 'Permission to create new user accounts' },
  { id: 'users-read', resource: 'users', action: 'read', category: 'access', bitmask: 2, label: 'View users', description: 'Permission to view all user data' },
  { id: 'users-update', resource: 'users', action: 'update', category: 'access', bitmask: 4, label: 'Update users', description: 'Permission to modify user accounts' },
  { id: 'users-delete', resource: 'users', action: 'delete', category: 'management', bitmask: 8, label: 'Delete users', description: 'Permission to permanently remove user accounts' },
  // Reports
  { id: 'reports-create', resource: 'reports', action: 'create', category: 'access', bitmask: 1, label: 'Create reports', description: 'Permission to generate new reports' },
  { id: 'reports-read', resource: 'reports', action: 'read', category: 'access', bitmask: 2, label: 'View reports', description: 'Permission to view report data' },
  { id: 'reports-update', resource: 'reports', action: 'update', category: 'access', bitmask: 4, label: 'Update reports', description: 'Permission to modify report configurations' },
  { id: 'reports-delete', resource: 'reports', action: 'delete', category: 'management', bitmask: 8, label: 'Delete reports', description: 'Permission to remove reports' },
  // Settings
  { id: 'settings-read', resource: 'settings', action: 'read', category: 'access', bitmask: 2, label: 'View settings', description: 'Permission to view system settings' },
  { id: 'settings-update', resource: 'settings', action: 'update', category: 'management', bitmask: 4, label: 'Update settings', description: 'Permission to modify system settings' },
  // Inspections
  { id: 'inspections-create', resource: 'inspections', action: 'create', category: 'access', bitmask: 1, label: 'Create inspections', description: 'Permission to create new inspections' },
  { id: 'inspections-read', resource: 'inspections', action: 'read', category: 'access', bitmask: 2, label: 'View inspections', description: 'Permission to view inspection data' },
  { id: 'inspections-update', resource: 'inspections', action: 'update', category: 'access', bitmask: 4, label: 'Update inspections', description: 'Permission to modify inspections' },
  // Tasks
  { id: 'tasks-create', resource: 'tasks', action: 'create', category: 'access', bitmask: 1, label: 'Create tasks', description: 'Permission to create new tasks' },
  { id: 'tasks-read', resource: 'tasks', action: 'read', category: 'access', bitmask: 2, label: 'View tasks', description: 'Permission to view task data' },
  { id: 'tasks-update', resource: 'tasks', action: 'update', category: 'access', bitmask: 4, label: 'Update tasks', description: 'Permission to modify tasks' },
  { id: 'tasks-delete', resource: 'tasks', action: 'delete', category: 'management', bitmask: 8, label: 'Delete tasks', description: 'Permission to remove tasks' },
]

// =============================================================================
// ROLE DEFINITIONS
// =============================================================================

export const mockRoles: Role[] = [
  {
    id: 'role-admin',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    permissions: mockPermissions,
    isSystem: true,
    userCount: 3,
    level: 1, // Executive
  },
  {
    id: 'role-manager',
    name: 'EHS Manager',
    description: 'Manage incidents, users, and reports for assigned locations',
    permissions: mockPermissions.filter(p => p.resource !== 'settings'),
    isSystem: false,
    userCount: 8,
    level: 2, // Manager
  },
  {
    id: 'role-investigator',
    name: 'Investigator',
    description: 'Investigate and update assigned incidents',
    permissions: mockPermissions.filter(p => p.resource === 'incidents'),
    isSystem: false,
    userCount: 15,
    level: 3, // Specialist
  },
  {
    id: 'role-reporter',
    name: 'Reporter',
    description: 'Create and view incident reports',
    permissions: [{ id: 'perm-inc-cr', resource: 'incidents', actions: ['create', 'read'] }],
    isSystem: false,
    userCount: 142,
    level: 4, // Field Worker
  },
  {
    id: 'role-viewer',
    name: 'Viewer',
    description: 'Read-only access to incidents and reports',
    permissions: [
      { id: 'perm-inc-r', resource: 'incidents', actions: ['read'] },
      { id: 'perm-rep-r', resource: 'reports', actions: ['read'] },
    ],
    isSystem: true,
    userCount: 56,
    level: 5, // Viewer
  },
]

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get a role by ID
 */
export function getRoleById(roleId: string): Role | undefined {
  return mockRoles.find((r) => r.id === roleId)
}

/**
 * Get roles by level
 */
export function getRolesByLevel(level: 1 | 2 | 3 | 4 | 5): Role[] {
  return mockRoles.filter((r) => r.level === level)
}
