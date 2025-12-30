/**
 * Role Seed Data
 *
 * Re-exports existing mock roles and permissions from the flow data layer.
 */

// Import existing mock data
import { mockRoles, mockPermissions, mockEnhancedPermissions } from '../../../flow/data/mockRoles'
import type { Role, Permission, EnhancedPermission } from '../../types/user.types'

/**
 * Seed roles for API initialization
 * 5 system roles with varying permission levels.
 */
export const seedRoles: Role[] = mockRoles

/**
 * Seed base permissions
 */
export const seedPermissions: Permission[] = mockPermissions

/**
 * Seed enhanced permissions (for role creation UI)
 */
export const seedEnhancedPermissions: EnhancedPermission[] = mockEnhancedPermissions

/**
 * Get role by level
 */
export function getRoleByLevel(level: 1 | 2 | 3 | 4 | 5): Role | undefined {
  return seedRoles.find((r) => r.level === level)
}

/**
 * Get all permissions for a resource
 */
export function getPermissionsForResource(resource: string): EnhancedPermission[] {
  return seedEnhancedPermissions.filter((p) => p.resource === resource)
}
