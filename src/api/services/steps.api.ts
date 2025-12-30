/**
 * Steps API Service
 *
 * REST-like API for step/task management.
 * Steps are actions required to resolve incidents.
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
  daysBetween,
  isPast,
  logApiCall,
  deepClone,
} from '../core/utils'
import {
  ValidationError,
  NotFoundError,
} from '../core/errors'
import {
  getEntities,
  getEntity,
  getStoreActions,
} from '../core/store'
import type { ApiResponse, PaginatedResponse, QueryParams } from '../core/types'
import type {
  Step,
  StepStatus,
  CreateStepInput,
  UpdateStepInput,
  StepListFilters,
} from '../types/step.types'

// =============================================================================
// VALIDATION
// =============================================================================

const VALID_STATUSES: StepStatus[] = ['pending', 'in_progress', 'overdue', 'completed']

function validateCreateStep(input: CreateStepInput): void {
  const errors: Record<string, string[]> = {}

  if (!input.incidentId?.trim()) {
    errors.incidentId = ['Incident ID is required']
  }

  if (!input.title?.trim()) {
    errors.title = ['Title is required']
  } else if (input.title.length < 5) {
    errors.title = ['Title must be at least 5 characters']
  } else if (input.title.length > 200) {
    errors.title = ['Title must be 200 characters or less']
  }

  if (!input.assigneeId?.trim()) {
    errors.assigneeId = ['Assignee is required']
  }

  if (Object.keys(errors).length > 0) {
    throw ValidationError.fromFields(errors)
  }
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Update computed fields on a step
 */
function updateComputedFields(step: Step): Step {
  const daysOpen = daysBetween(step.createdAt)
  const isOverdue = step.dueDate && isPast(step.dueDate) && step.status !== 'completed'

  return {
    ...step,
    daysOpen,
    isOverdue: isOverdue || false,
    // Auto-set status to overdue if past due
    status: isOverdue && step.status !== 'completed' ? 'overdue' : step.status,
  }
}

// =============================================================================
// API SERVICE
// =============================================================================

export const stepsApi = {
  /**
   * Get all steps with optional filtering and pagination
   */
  getAll: async (
    params: QueryParams<StepListFilters> = {}
  ): Promise<PaginatedResponse<Step>> => {
    logApiCall('stepsApi.getAll', params)

    return simulateNetwork(() => {
      let steps = getEntities<'steps'>('steps').map(updateComputedFields)

      // Apply search
      if (params.search) {
        steps = searchFilter(steps, params.search, [
          'title',
          'description',
          'incidentId',
          'location',
        ])
      }

      // Apply filters
      if (params.filters) {
        const filters = params.filters

        if (filters.incidentId) {
          // Filter by incident database ID
          steps = steps.filter((s) => s.incidentDbId === filters.incidentId)
        }

        if (filters.assigneeId) {
          steps = steps.filter((s) => s.assignee.id === filters.assigneeId)
        }

        if (filters.status && filters.status.length > 0) {
          const statusFilter = filters.status as string[]
          steps = steps.filter((s) => statusFilter.includes(s.status))
        }

        if (filters.severity && filters.severity.length > 0) {
          const severityFilter = filters.severity as string[]
          steps = steps.filter((s) => severityFilter.includes(s.severity))
        }

        if (filters.isOverdue !== undefined) {
          steps = steps.filter((s) => s.isOverdue === filters.isOverdue)
        }
      }

      // Apply sorting
      const sortField = (params.sortBy as keyof Step) || 'createdAt'
      steps = sortBy(steps, sortField, params.sortOrder || 'desc')

      // Get total before pagination
      const total = steps.length

      // Apply pagination
      steps = paginate(steps, params)

      return buildPaginatedResponse(steps, total, params)
    })
  },

  /**
   * Get steps for a specific incident
   */
  getByIncident: async (incidentId: string): Promise<ApiResponse<Step[]>> => {
    logApiCall('stepsApi.getByIncident', { incidentId })

    return simulateNetwork(() => {
      const steps = getEntities<'steps'>('steps')
      const incidentSteps = steps
        .filter((s) => s.incidentDbId === incidentId)
        .map(updateComputedFields)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))

      return buildResponse(deepClone(incidentSteps))
    })
  },

  /**
   * Get steps assigned to a user
   */
  getByAssignee: async (assigneeId: string): Promise<ApiResponse<Step[]>> => {
    logApiCall('stepsApi.getByAssignee', { assigneeId })

    return simulateNetwork(() => {
      const steps = getEntities<'steps'>('steps')
      const userSteps = steps
        .filter((s) => s.assignee.id === assigneeId)
        .map(updateComputedFields)
        .sort((a, b) => {
          // Sort by severity then due date
          const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, none: 4 }
          const severityDiff = severityOrder[a.severity] - severityOrder[b.severity]
          if (severityDiff !== 0) return severityDiff
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return a.dueDate.localeCompare(b.dueDate)
        })

      return buildResponse(deepClone(userSteps))
    })
  },

  /**
   * Get a single step by ID
   */
  getById: async (id: string): Promise<ApiResponse<Step>> => {
    logApiCall('stepsApi.getById', { id })

    return simulateNetwork(() => {
      const step = getEntity<'steps'>('steps', id)

      if (!step) {
        throw new NotFoundError('Step', id)
      }

      return buildResponse(updateComputedFields(deepClone(step)))
    })
  },

  /**
   * Create a new step
   */
  create: async (input: CreateStepInput): Promise<ApiResponse<Step>> => {
    logApiCall('stepsApi.create', { input })

    return simulateNetwork(() => {
      // Validate input
      validateCreateStep(input)

      // Find incident by database ID
      const incident = getEntity<'incidents'>('incidents', input.incidentId)
      if (!incident) {
        throw new NotFoundError('Incident', input.incidentId)
      }

      // Validate assignee exists
      const assignee = getEntity<'users'>('users', input.assigneeId)
      if (!assignee) {
        throw new NotFoundError('Assignee', input.assigneeId)
      }

      // Get reporter from incident
      const reporter = getEntity<'users'>('users', incident.reporterId)

      // Create step
      const now = timestamp()
      const step: Step = {
        id: generateId(),
        title: input.title.trim(),
        description: input.description?.trim(),
        tooltip: input.tooltip?.trim(),
        incidentId: incident.incidentId, // Human-readable ID
        incidentDbId: incident.id, // Database ID
        severity: incident.severity,
        status: input.status || 'pending',
        location: incident.locationName,
        assignee: {
          id: assignee.id,
          name: `${assignee.firstName} ${assignee.lastName}`,
          email: assignee.email,
        },
        reporter: reporter ? {
          id: reporter.id,
          name: `${reporter.firstName} ${reporter.lastName}`,
          email: reporter.email,
        } : {
          id: incident.reporterId,
          name: incident.reporterName,
        },
        createdAt: now,
        dueDate: input.dueDate,
        daysOpen: 0,
        isOverdue: false,
      }

      // Add to store
      getStoreActions().setEntity('steps', step.id, step)

      return buildResponse(deepClone(step))
    })
  },

  /**
   * Update an existing step
   */
  update: async (id: string, input: UpdateStepInput): Promise<ApiResponse<Step>> => {
    logApiCall('stepsApi.update', { id, input })

    return simulateNetwork(() => {
      // Get existing step
      const step = getEntity<'steps'>('steps', id)
      if (!step) {
        throw new NotFoundError('Step', id)
      }

      // Validate assignee if changing
      let assignee = step.assignee
      if (input.assigneeId && input.assigneeId !== step.assignee.id) {
        const user = getEntity<'users'>('users', input.assigneeId)
        if (!user) {
          throw new NotFoundError('Assignee', input.assigneeId)
        }
        assignee = {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        }
      }

      // Update step
      const updatedStep: Step = {
        ...step,
        ...(input.title && { title: input.title.trim() }),
        ...(input.description !== undefined && { description: input.description?.trim() }),
        ...(input.tooltip !== undefined && { tooltip: input.tooltip?.trim() }),
        ...(input.status && { status: input.status }),
        ...(input.dueDate !== undefined && { dueDate: input.dueDate }),
        assignee,
      }

      // Save to store
      getStoreActions().setEntity('steps', id, updatedStep)

      return buildResponse(updateComputedFields(deepClone(updatedStep)))
    })
  },

  /**
   * Delete a step
   */
  delete: async (id: string): Promise<ApiResponse<{ deleted: boolean; id: string }>> => {
    logApiCall('stepsApi.delete', { id })

    return simulateNetwork(() => {
      const step = getEntity<'steps'>('steps', id)
      if (!step) {
        throw new NotFoundError('Step', id)
      }

      // Delete the step
      getStoreActions().deleteEntity('steps', id)

      return buildResponse({ deleted: true, id })
    })
  },

  /**
   * Update step status
   */
  updateStatus: async (id: string, status: StepStatus): Promise<ApiResponse<Step>> => {
    logApiCall('stepsApi.updateStatus', { id, status })

    return stepsApi.update(id, { status })
  },

  /**
   * Complete a step
   */
  complete: async (id: string): Promise<ApiResponse<Step>> => {
    logApiCall('stepsApi.complete', { id })

    return stepsApi.updateStatus(id, 'completed')
  },

  /**
   * Reassign a step
   */
  reassign: async (id: string, assigneeId: string): Promise<ApiResponse<Step>> => {
    logApiCall('stepsApi.reassign', { id, assigneeId })

    return stepsApi.update(id, { assigneeId })
  },

  /**
   * Bulk update step status
   */
  bulkUpdateStatus: async (
    ids: string[],
    status: StepStatus
  ): Promise<ApiResponse<{ updated: number; failed: string[] }>> => {
    logApiCall('stepsApi.bulkUpdateStatus', { ids, status })

    return simulateNetwork(() => {
      const failed: string[] = []
      let updated = 0

      for (const id of ids) {
        const step = getEntity<'steps'>('steps', id)
        if (step) {
          getStoreActions().updateEntity('steps', id, { status })
          updated++
        } else {
          failed.push(id)
        }
      }

      return buildResponse({ updated, failed })
    })
  },

  /**
   * Get step stats
   */
  getStats: async (): Promise<ApiResponse<Record<string, number>>> => {
    logApiCall('stepsApi.getStats')

    return simulateNetwork(() => {
      const steps = getEntities<'steps'>('steps').map(updateComputedFields)

      const stats: Record<string, number> = {
        total: steps.length,
        pending: 0,
        in_progress: 0,
        completed: 0,
        overdue: 0,
      }

      for (const step of steps) {
        stats[step.status]++
        if (step.isOverdue) stats.overdue++
      }

      return buildResponse(stats)
    })
  },
}
