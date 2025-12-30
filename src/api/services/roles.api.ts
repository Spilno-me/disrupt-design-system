/**
 * Roles API Service
 *
 * REST-like API for role and permission management.
 */

import {
  simulateNetwork,
  buildResponse,
  buildPaginatedResponse,
  paginate,
  sortBy,
  searchFilter,
  generateId,
  timestamp,
  logApiCall,
  deepClone,
} from '../core/utils'
import {
  ValidationError,
  NotFoundError,
  ConflictError,
  ForbiddenError,
} from '../core/errors'
import {
  getEntities,
  getEntity,
  getStoreActions,
} from '../core/store'
import type { ApiResponse, PaginatedResponse, QueryParams } from '../core/types'
import type {
  Role,
  Permission,
  EnhancedPermission,
  CreateRoleInput,
  UpdateRoleInput,
  RoleListFilters,
  RoleLevel,
} from '../types/user.types'

// =============================================================================
// VALIDATION
// =============================================================================

function validateCreateRole(input: CreateRoleInput): void {
  const errors: Record<string, string[]> = {}

  if (!input.name?.trim()) {
    errors.name = ['Role name is required']
  } else if (input.name.length > 50) {
    errors.name = ['Role name must be 50 characters or less']
  }

  if (!input.level || input.level < 1 || input.level > 5) {
    errors.level = ['Level must be between 1 and 5']
  }

  if (!input.permissions || input.permissions.length === 0) {
    errors.permissions = ['At least one permission is required']
  }

  if (Object.keys(errors).length > 0) {
    throw ValidationError.fromFields(errors)
  }
}

// =============================================================================
// API SERVICE
// =============================================================================

export const rolesApi = {
  /**
   * Get all roles with optional filtering and pagination
   */
  getAll: async (
    params: QueryParams<RoleListFilters> = {}
  ): Promise<PaginatedResponse<Role>> => {
    logApiCall('rolesApi.getAll', params)

    return simulateNetwork(() => {
      let roles = getEntities<'roles'>('roles')

      // Apply search
      if (params.search) {
        roles = searchFilter(roles, params.search, ['name', 'description'])
      }

      // Apply filters
      if (params.filters) {
        const filters = params.filters

        if (filters.isSystem !== undefined) {
          roles = roles.filter((r) => r.isSystem === filters.isSystem)
        }

        if (filters.level && filters.level.length > 0) {
          const levelFilter = filters.level as number[]
          roles = roles.filter((r) => r.level && levelFilter.includes(r.level))
        }
      }

      // Apply sorting (by level then name)
      const sortField = (params.sortBy as keyof Role) || 'level'
      roles = sortBy(roles, sortField, params.sortOrder || 'asc')

      // Get total before pagination
      const total = roles.length

      // Apply pagination
      roles = paginate(roles, params)

      return buildPaginatedResponse(roles, total, params)
    })
  },

  /**
   * Get a single role by ID
   */
  getById: async (id: string): Promise<ApiResponse<Role>> => {
    logApiCall('rolesApi.getById', { id })

    return simulateNetwork(() => {
      const role = getEntity<'roles'>('roles', id)

      if (!role) {
        throw new NotFoundError('Role', id)
      }

      return buildResponse(deepClone(role))
    })
  },

  /**
   * Create a new role
   */
  create: async (input: CreateRoleInput): Promise<ApiResponse<Role>> => {
    logApiCall('rolesApi.create', { input })

    return simulateNetwork(() => {
      // Validate input
      validateCreateRole(input)

      // Check for duplicate name
      const roles = getEntities<'roles'>('roles')
      const existing = roles.find(
        (r) => r.name.toLowerCase() === input.name.toLowerCase()
      )
      if (existing) {
        throw ConflictError.duplicate('name', input.name)
      }

      // Build permissions from IDs
      const allPermissions = getEntities<'permissions'>('permissions')
      const permissions = allPermissions.filter((p) =>
        input.permissions.includes(p.id)
      )

      // Create role
      const role: Role = {
        id: generateId(),
        name: input.name.trim(),
        description: input.description?.trim(),
        level: input.level as RoleLevel,
        permissions: deepClone(permissions),
        isSystem: false,
        userCount: 0,
      }

      // Add to store
      getStoreActions().setEntity('roles', role.id, role)

      return buildResponse(deepClone(role))
    })
  },

  /**
   * Update an existing role
   */
  update: async (id: string, input: UpdateRoleInput): Promise<ApiResponse<Role>> => {
    logApiCall('rolesApi.update', { id, input })

    return simulateNetwork(() => {
      // Get existing role
      const role = getEntity<'roles'>('roles', id)
      if (!role) {
        throw new NotFoundError('Role', id)
      }

      // Cannot modify system roles
      if (role.isSystem) {
        throw new ForbiddenError('System roles cannot be modified')
      }

      // Check for duplicate name if changing
      if (input.name && input.name.toLowerCase() !== role.name.toLowerCase()) {
        const roles = getEntities<'roles'>('roles')
        const existing = roles.find(
          (r) => r.id !== id && r.name.toLowerCase() === input.name!.toLowerCase()
        )
        if (existing) {
          throw ConflictError.duplicate('name', input.name)
        }
      }

      // Build permissions if provided
      let permissions = role.permissions
      if (input.permissions) {
        const allPermissions = getEntities<'permissions'>('permissions')
        permissions = allPermissions.filter((p) =>
          input.permissions!.includes(p.id)
        )
      }

      // Update role
      const updatedRole: Role = {
        ...role,
        ...(input.name && { name: input.name.trim() }),
        ...(input.description !== undefined && { description: input.description?.trim() }),
        ...(input.level && { level: input.level as RoleLevel }),
        permissions: deepClone(permissions),
      }

      // Save to store
      getStoreActions().setEntity('roles', id, updatedRole)

      return buildResponse(deepClone(updatedRole))
    })
  },

  /**
   * Delete a role
   */
  delete: async (id: string): Promise<ApiResponse<{ deleted: boolean; id: string }>> => {
    logApiCall('rolesApi.delete', { id })

    return simulateNetwork(() => {
      const role = getEntity<'roles'>('roles', id)
      if (!role) {
        throw new NotFoundError('Role', id)
      }

      // Cannot delete system roles
      if (role.isSystem) {
        throw new ForbiddenError('System roles cannot be deleted')
      }

      // Check if role is assigned to any users
      const users = getEntities<'users'>('users')
      const usersWithRole = users.filter((u) =>
        u.roleAssignments.some((ra) => ra.role.id === id)
      )

      if (usersWithRole.length > 0) {
        throw new ValidationError(
          `Cannot delete role that is assigned to ${usersWithRole.length} user(s)`,
          { role: ['Role is currently assigned to users'] }
        )
      }

      // Delete from store
      getStoreActions().deleteEntity('roles', id)

      return buildResponse({ deleted: true, id })
    })
  },

  /**
   * Get all permissions
   */
  getPermissions: async (): Promise<ApiResponse<Permission[]>> => {
    logApiCall('rolesApi.getPermissions')

    return simulateNetwork(() => {
      const permissions = getEntities<'permissions'>('permissions')
      return buildResponse(deepClone(permissions))
    })
  },

  /**
   * Get all enhanced permissions (for UI)
   */
  getEnhancedPermissions: async (): Promise<ApiResponse<EnhancedPermission[]>> => {
    logApiCall('rolesApi.getEnhancedPermissions')

    return simulateNetwork(() => {
      const permissions = getEntities<'enhancedPermissions'>('enhancedPermissions')
      return buildResponse(deepClone(permissions))
    })
  },

  /**
   * Get roles by level
   */
  getByLevel: async (level: RoleLevel): Promise<ApiResponse<Role[]>> => {
    logApiCall('rolesApi.getByLevel', { level })

    return simulateNetwork(() => {
      const roles = getEntities<'roles'>('roles')
      const filtered = roles.filter((r) => r.level === level)
      return buildResponse(deepClone(filtered))
    })
  },

  /**
   * Recalculate user counts for all roles
   */
  recalculateUserCounts: async (): Promise<ApiResponse<void>> => {
    logApiCall('rolesApi.recalculateUserCounts')

    return simulateNetwork(() => {
      const users = getEntities<'users'>('users')
      const roles = getEntities<'roles'>('roles')

      // Count users for each role
      const counts = new Map<string, number>()
      for (const user of users) {
        for (const assignment of user.roleAssignments) {
          const current = counts.get(assignment.role.id) || 0
          counts.set(assignment.role.id, current + 1)
        }
      }

      // Update role user counts
      for (const role of roles) {
        const userCount = counts.get(role.id) || 0
        if (role.userCount !== userCount) {
          getStoreActions().updateEntity('roles', role.id, { userCount })
        }
      }

      return buildResponse(undefined)
    })
  },
}
