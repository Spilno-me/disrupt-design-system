/**
 * Users API Service
 *
 * REST-like API for user management operations.
 */

import {
  simulateNetwork,
  buildResponse,
  buildPaginatedResponse,
  paginate,
  sortBy,
  searchFilter,
  applyFilters,
  generateId,
  timestamp,
  isValidEmail,
  logApiCall,
  deepClone,
} from '../core/utils'
import {
  ValidationError,
  NotFoundError,
  ConflictError,
} from '../core/errors'
import {
  getEntities,
  getEntity,
  getStoreActions,
} from '../core/store'
import type { ApiResponse, PaginatedResponse, QueryParams } from '../core/types'
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
  UserListFilters,
  UserStatus,
  RoleAssignment,
  LocationScope,
} from '../types/user.types'

// =============================================================================
// VALIDATION
// =============================================================================

function validateCreateUser(input: CreateUserInput): void {
  const errors: Record<string, string[]> = {}

  if (!input.email?.trim()) {
    errors.email = ['Email is required']
  } else if (!isValidEmail(input.email)) {
    errors.email = ['Invalid email format']
  }

  if (!input.firstName?.trim()) {
    errors.firstName = ['First name is required']
  } else if (input.firstName.length > 50) {
    errors.firstName = ['First name must be 50 characters or less']
  }

  if (!input.lastName?.trim()) {
    errors.lastName = ['Last name is required']
  } else if (input.lastName.length > 50) {
    errors.lastName = ['Last name must be 50 characters or less']
  }

  if (!input.jobTitle?.trim()) {
    errors.jobTitle = ['Job title is required']
  }

  if (!input.department?.trim()) {
    errors.department = ['Department is required']
  }

  if (Object.keys(errors).length > 0) {
    throw ValidationError.fromFields(errors)
  }
}

function validateUpdateUser(input: UpdateUserInput): void {
  const errors: Record<string, string[]> = {}

  if (input.email !== undefined && !isValidEmail(input.email)) {
    errors.email = ['Invalid email format']
  }

  if (input.firstName !== undefined && input.firstName.length > 50) {
    errors.firstName = ['First name must be 50 characters or less']
  }

  if (input.lastName !== undefined && input.lastName.length > 50) {
    errors.lastName = ['Last name must be 50 characters or less']
  }

  if (Object.keys(errors).length > 0) {
    throw ValidationError.fromFields(errors)
  }
}

// =============================================================================
// API SERVICE
// =============================================================================

export const usersApi = {
  /**
   * Get all users with optional filtering and pagination
   */
  getAll: async (
    params: QueryParams<UserListFilters> = {}
  ): Promise<PaginatedResponse<User>> => {
    logApiCall('usersApi.getAll', params)

    return simulateNetwork(() => {
      let users = getEntities<'users'>('users')

      // Apply search
      if (params.search) {
        users = searchFilter(users, params.search, [
          'firstName',
          'lastName',
          'email',
          'jobTitle',
          'department',
        ])
      }

      // Apply filters
      if (params.filters) {
        const filters = params.filters

        // Status filter
        if (filters.status && filters.status.length > 0) {
          const statusFilter = filters.status as string[]
          users = users.filter((u) => statusFilter.includes(u.status))
        }

        // Department filter
        if (filters.departments && filters.departments.length > 0) {
          const deptFilter = filters.departments as string[]
          users = users.filter((u) => deptFilter.includes(u.department))
        }

        // Role filter (check roleAssignments)
        if (filters.roles && filters.roles.length > 0) {
          const roleFilter = filters.roles as string[]
          users = users.filter((u) =>
            u.roleAssignments.some((ra) => roleFilter.includes(ra.role.id))
          )
        }

        // Location filter (check roleAssignment scopes)
        if (filters.locations && filters.locations.length > 0) {
          const locFilter = filters.locations as string[]
          users = users.filter((u) =>
            u.roleAssignments.some((ra) =>
              ra.scopes.some((s) => locFilter.includes(s.locationId))
            )
          )
        }
      }

      // Apply sorting
      const sortField = (params.sortBy as keyof User) || 'lastName'
      users = sortBy(users, sortField, params.sortOrder || 'asc')

      // Get total before pagination
      const total = users.length

      // Apply pagination
      users = paginate(users, params)

      return buildPaginatedResponse(users, total, params)
    })
  },

  /**
   * Get a single user by ID
   */
  getById: async (id: string): Promise<ApiResponse<User>> => {
    logApiCall('usersApi.getById', { id })

    return simulateNetwork(() => {
      const user = getEntity<'users'>('users', id)

      if (!user) {
        throw new NotFoundError('User', id)
      }

      return buildResponse(deepClone(user))
    })
  },

  /**
   * Get a user by email
   */
  getByEmail: async (email: string): Promise<ApiResponse<User | null>> => {
    logApiCall('usersApi.getByEmail', { email })

    return simulateNetwork(() => {
      const users = getEntities<'users'>('users')
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

      return buildResponse(user ? deepClone(user) : null)
    })
  },

  /**
   * Create a new user
   */
  create: async (input: CreateUserInput): Promise<ApiResponse<User>> => {
    logApiCall('usersApi.create', { input })

    return simulateNetwork(() => {
      // Validate input
      validateCreateUser(input)

      // Check for duplicate email
      const users = getEntities<'users'>('users')
      const existing = users.find(
        (u) => u.email.toLowerCase() === input.email.toLowerCase()
      )
      if (existing) {
        throw ConflictError.duplicate('email', input.email)
      }

      // Create user
      const now = timestamp()
      const user: User = {
        id: generateId(),
        email: input.email.trim(),
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        phone: input.phone?.trim(),
        avatarUrl: undefined,
        jobTitle: input.jobTitle.trim(),
        department: input.department.trim(),
        bio: input.bio?.trim(),
        status: input.status || 'pending',
        officeLocation: input.officeLocation?.trim(),
        workingHours: input.workingHours?.trim(),
        timezone: input.timezone || 'America/New_York',
        isEmergencyContact: input.isEmergencyContact || false,
        slackHandle: input.slackHandle?.trim(),
        teamsEmail: input.teamsEmail?.trim(),
        roleAssignments: [],
        createdAt: now,
        lastLoginAt: undefined,
      }

      // Add to store
      getStoreActions().setEntity('users', user.id, user)

      return buildResponse(deepClone(user))
    })
  },

  /**
   * Update an existing user
   */
  update: async (id: string, input: UpdateUserInput): Promise<ApiResponse<User>> => {
    logApiCall('usersApi.update', { id, input })

    return simulateNetwork(() => {
      // Validate input
      validateUpdateUser(input)

      // Get existing user
      const user = getEntity<'users'>('users', id)
      if (!user) {
        throw new NotFoundError('User', id)
      }

      // Check for duplicate email if changing
      if (input.email && input.email.toLowerCase() !== user.email.toLowerCase()) {
        const users = getEntities<'users'>('users')
        const existing = users.find(
          (u) => u.id !== id && u.email.toLowerCase() === input.email!.toLowerCase()
        )
        if (existing) {
          throw ConflictError.duplicate('email', input.email)
        }
      }

      // Update user
      const updatedUser: User = {
        ...user,
        ...(input.email && { email: input.email.trim() }),
        ...(input.firstName && { firstName: input.firstName.trim() }),
        ...(input.lastName && { lastName: input.lastName.trim() }),
        ...(input.phone !== undefined && { phone: input.phone?.trim() }),
        ...(input.avatarUrl !== undefined && { avatarUrl: input.avatarUrl }),
        ...(input.jobTitle && { jobTitle: input.jobTitle.trim() }),
        ...(input.department && { department: input.department.trim() }),
        ...(input.bio !== undefined && { bio: input.bio?.trim() }),
        ...(input.status && { status: input.status }),
        ...(input.officeLocation !== undefined && { officeLocation: input.officeLocation?.trim() }),
        ...(input.workingHours !== undefined && { workingHours: input.workingHours?.trim() }),
        ...(input.timezone !== undefined && { timezone: input.timezone }),
        ...(input.isEmergencyContact !== undefined && { isEmergencyContact: input.isEmergencyContact }),
        ...(input.slackHandle !== undefined && { slackHandle: input.slackHandle?.trim() }),
        ...(input.teamsEmail !== undefined && { teamsEmail: input.teamsEmail?.trim() }),
      }

      // Save to store
      getStoreActions().setEntity('users', id, updatedUser)

      return buildResponse(deepClone(updatedUser))
    })
  },

  /**
   * Delete a user
   */
  delete: async (id: string): Promise<ApiResponse<{ deleted: boolean; id: string }>> => {
    logApiCall('usersApi.delete', { id })

    return simulateNetwork(() => {
      const user = getEntity<'users'>('users', id)
      if (!user) {
        throw new NotFoundError('User', id)
      }

      // Delete from store
      getStoreActions().deleteEntity('users', id)

      return buildResponse({ deleted: true, id })
    })
  },

  /**
   * Update user status
   */
  updateStatus: async (
    id: string,
    status: UserStatus
  ): Promise<ApiResponse<User>> => {
    logApiCall('usersApi.updateStatus', { id, status })

    return usersApi.update(id, { status })
  },

  /**
   * Bulk update user status
   */
  bulkUpdateStatus: async (
    ids: string[],
    status: UserStatus
  ): Promise<ApiResponse<{ updated: number; failed: string[] }>> => {
    logApiCall('usersApi.bulkUpdateStatus', { ids, status })

    return simulateNetwork(() => {
      const failed: string[] = []
      let updated = 0

      for (const id of ids) {
        const user = getEntity<'users'>('users', id)
        if (user) {
          getStoreActions().updateEntity('users', id, { status })
          updated++
        } else {
          failed.push(id)
        }
      }

      return buildResponse({ updated, failed })
    })
  },

  /**
   * Assign a role to a user
   */
  assignRole: async (
    userId: string,
    roleId: string,
    scopes: LocationScope[]
  ): Promise<ApiResponse<User>> => {
    logApiCall('usersApi.assignRole', { userId, roleId, scopes })

    return simulateNetwork(() => {
      const user = getEntity<'users'>('users', userId)
      if (!user) {
        throw new NotFoundError('User', userId)
      }

      const role = getEntity<'roles'>('roles', roleId)
      if (!role) {
        throw new NotFoundError('Role', roleId)
      }

      // Create new role assignment
      const assignment: RoleAssignment = {
        id: generateId(),
        role: deepClone(role),
        scopes: deepClone(scopes),
        assignedAt: timestamp(),
        assignedBy: 'System', // In real app, would be current user
      }

      // Update user
      const updatedUser: User = {
        ...user,
        roleAssignments: [...user.roleAssignments, assignment],
      }

      getStoreActions().setEntity('users', userId, updatedUser)

      return buildResponse(deepClone(updatedUser))
    })
  },

  /**
   * Remove a role assignment from a user
   */
  removeRoleAssignment: async (
    userId: string,
    assignmentId: string
  ): Promise<ApiResponse<User>> => {
    logApiCall('usersApi.removeRoleAssignment', { userId, assignmentId })

    return simulateNetwork(() => {
      const user = getEntity<'users'>('users', userId)
      if (!user) {
        throw new NotFoundError('User', userId)
      }

      const assignmentIndex = user.roleAssignments.findIndex(
        (ra) => ra.id === assignmentId
      )
      if (assignmentIndex === -1) {
        throw new NotFoundError('Role assignment', assignmentId)
      }

      // Remove assignment
      const updatedUser: User = {
        ...user,
        roleAssignments: user.roleAssignments.filter((ra) => ra.id !== assignmentId),
      }

      getStoreActions().setEntity('users', userId, updatedUser)

      return buildResponse(deepClone(updatedUser))
    })
  },

  /**
   * Get all unique departments
   */
  getDepartments: async (): Promise<ApiResponse<string[]>> => {
    logApiCall('usersApi.getDepartments')

    return simulateNetwork(() => {
      const users = getEntities<'users'>('users')
      const departments = [...new Set(users.map((u) => u.department))].sort()
      return buildResponse(departments)
    })
  },

  /**
   * Get all unique job titles
   */
  getJobTitles: async (): Promise<ApiResponse<string[]>> => {
    logApiCall('usersApi.getJobTitles')

    return simulateNetwork(() => {
      const users = getEntities<'users'>('users')
      const titles = [...new Set(users.map((u) => u.jobTitle))].sort()
      return buildResponse(titles)
    })
  },
}
