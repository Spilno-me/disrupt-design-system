/**
 * Incidents API Service
 *
 * REST-like API for incident management.
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
  generateHumanId,
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
  Incident,
  IncidentListItem,
  IncidentType,
  CreateIncidentInput,
  UpdateIncidentInput,
  IncidentListFilters,
} from '../types/incident.types'

// =============================================================================
// VALIDATION
// =============================================================================

const VALID_TYPES: IncidentType[] = [
  'injury', 'near_miss', 'environmental', 'equipment', 'chemical', 'fire', 'other'
]

const VALID_SEVERITIES = ['critical', 'high', 'medium', 'low', 'none']
const VALID_STATUSES = ['draft', 'reported', 'investigation', 'review', 'closed']

function validateCreateIncident(input: CreateIncidentInput): void {
  const errors: Record<string, string[]> = {}

  if (!input.title?.trim()) {
    errors.title = ['Title is required']
  } else if (input.title.length < 5) {
    errors.title = ['Title must be at least 5 characters']
  } else if (input.title.length > 200) {
    errors.title = ['Title must be 200 characters or less']
  }

  if (!input.description?.trim()) {
    errors.description = ['Description is required']
  }

  if (!input.type || !VALID_TYPES.includes(input.type)) {
    errors.type = ['Invalid incident type']
  }

  if (!input.severity || !VALID_SEVERITIES.includes(input.severity)) {
    errors.severity = ['Invalid severity level']
  }

  if (!input.locationId?.trim()) {
    errors.locationId = ['Location is required']
  }

  if (!input.reporterId?.trim()) {
    errors.reporterId = ['Reporter is required']
  }

  if (Object.keys(errors).length > 0) {
    throw ValidationError.fromFields(errors)
  }
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Calculate step counts for an incident
 */
function calculateStepCounts(incidentId: string): { stepsTotal: number; stepsCompleted: number } {
  const steps = getEntities<'steps'>('steps')
  const incidentSteps = steps.filter((s) => s.incidentDbId === incidentId)
  const completed = incidentSteps.filter((s) => s.status === 'completed').length
  return { stepsTotal: incidentSteps.length, stepsCompleted: completed }
}

/**
 * Update computed fields on an incident
 */
function updateComputedFields(incident: Incident): Incident {
  const { stepsTotal, stepsCompleted } = calculateStepCounts(incident.id)
  const daysOpen = daysBetween(incident.createdAt)

  return {
    ...incident,
    stepsTotal,
    stepsCompleted,
    daysOpen,
  }
}

/**
 * Convert Incident to list item
 */
function toListItem(incident: Incident): IncidentListItem {
  return {
    id: incident.id,
    incidentId: incident.incidentId,
    title: incident.title,
    status: incident.status,
    severity: incident.severity,
    type: incident.type,
    locationName: incident.locationName,
    reporterName: incident.reporterName,
    assigneeName: incident.assigneeName,
    createdAt: incident.createdAt,
    daysOpen: incident.daysOpen,
    isOverdue: incident.isOverdue,
    stepsTotal: incident.stepsTotal,
    stepsCompleted: incident.stepsCompleted,
  }
}

// =============================================================================
// API SERVICE
// =============================================================================

export const incidentsApi = {
  /**
   * Get all incidents with optional filtering and pagination
   */
  getAll: async (
    params: QueryParams<IncidentListFilters> = {}
  ): Promise<PaginatedResponse<IncidentListItem>> => {
    logApiCall('incidentsApi.getAll', params)

    return simulateNetwork(() => {
      let incidents = getEntities<'incidents'>('incidents').map(updateComputedFields)

      // Apply search
      if (params.search) {
        incidents = searchFilter(incidents, params.search, [
          'title',
          'incidentId',
          'locationName',
          'reporterName',
          'assigneeName',
        ])
      }

      // Apply filters
      if (params.filters) {
        const filters = params.filters

        if (filters.status && filters.status.length > 0) {
          const statusFilter = filters.status as string[]
          incidents = incidents.filter((i) => statusFilter.includes(i.status))
        }

        if (filters.severity && filters.severity.length > 0) {
          const severityFilter = filters.severity as string[]
          incidents = incidents.filter((i) => severityFilter.includes(i.severity))
        }

        if (filters.type && filters.type.length > 0) {
          const typeFilter = filters.type as string[]
          incidents = incidents.filter((i) => typeFilter.includes(i.type))
        }

        if (filters.locationId) {
          incidents = incidents.filter((i) => i.locationId === filters.locationId)
        }

        if (filters.reporterId) {
          incidents = incidents.filter((i) => i.reporterId === filters.reporterId)
        }

        if (filters.assigneeId) {
          incidents = incidents.filter((i) => i.assigneeId === filters.assigneeId)
        }

        if (filters.isOverdue !== undefined) {
          incidents = incidents.filter((i) => i.isOverdue === filters.isOverdue)
        }

        if (filters.createdAfter) {
          incidents = incidents.filter((i) => i.createdAt >= filters.createdAfter!)
        }

        if (filters.createdBefore) {
          incidents = incidents.filter((i) => i.createdAt <= filters.createdBefore!)
        }
      }

      // Apply sorting
      const sortField = (params.sortBy as keyof Incident) || 'createdAt'
      incidents = sortBy(incidents, sortField, params.sortOrder || 'desc')

      // Get total before pagination
      const total = incidents.length

      // Apply pagination
      incidents = paginate(incidents, params)

      // Convert to list items
      const listItems = incidents.map(toListItem)

      return buildPaginatedResponse(listItems, total, params)
    })
  },

  /**
   * Get a single incident by ID
   */
  getById: async (id: string): Promise<ApiResponse<Incident>> => {
    logApiCall('incidentsApi.getById', { id })

    return simulateNetwork(() => {
      const incident = getEntity<'incidents'>('incidents', id)

      if (!incident) {
        throw new NotFoundError('Incident', id)
      }

      return buildResponse(updateComputedFields(deepClone(incident)))
    })
  },

  /**
   * Get incident by human-readable ID
   */
  getByIncidentId: async (incidentId: string): Promise<ApiResponse<Incident>> => {
    logApiCall('incidentsApi.getByIncidentId', { incidentId })

    return simulateNetwork(() => {
      const incidents = getEntities<'incidents'>('incidents')
      const incident = incidents.find((i) => i.incidentId === incidentId)

      if (!incident) {
        throw new NotFoundError('Incident', incidentId)
      }

      return buildResponse(updateComputedFields(deepClone(incident)))
    })
  },

  /**
   * Create a new incident
   */
  create: async (input: CreateIncidentInput): Promise<ApiResponse<Incident>> => {
    logApiCall('incidentsApi.create', { input })

    return simulateNetwork(() => {
      // Validate input
      validateCreateIncident(input)

      // Validate location exists
      const location = getEntity<'locations'>('locations', input.locationId)
      if (!location) {
        throw new NotFoundError('Location', input.locationId)
      }

      // Validate reporter exists
      const reporter = getEntity<'users'>('users', input.reporterId)
      if (!reporter) {
        throw new NotFoundError('Reporter', input.reporterId)
      }

      // Validate assignee if provided
      let assigneeName: string | undefined
      if (input.assigneeId) {
        const assignee = getEntity<'users'>('users', input.assigneeId)
        if (!assignee) {
          throw new NotFoundError('Assignee', input.assigneeId)
        }
        assigneeName = `${assignee.firstName} ${assignee.lastName}`
      }

      // Generate incident ID
      const sequence = getStoreActions().getNextSequence('incident')
      const year = new Date().getFullYear()
      const incidentId = generateHumanId('INC', year, sequence)

      // Create incident
      const now = timestamp()
      const incident: Incident = {
        id: generateId(),
        incidentId,
        title: input.title.trim(),
        description: input.description.trim(),
        status: input.status || 'reported',
        severity: input.severity,
        type: input.type,
        locationId: input.locationId,
        locationName: location.name,
        facilityName: undefined, // Would need to traverse to find facility
        reporterId: input.reporterId,
        reporterName: `${reporter.firstName} ${reporter.lastName}`,
        assigneeId: input.assigneeId,
        assigneeName,
        occurredAt: input.occurredAt || now,
        createdAt: now,
        updatedAt: now,
        stepsTotal: 0,
        stepsCompleted: 0,
        documentsCount: 0,
        daysOpen: 0,
        isOverdue: false,
        reference: input.reference,
        coordinates: input.coordinates,
        what3words: input.what3words,
      }

      // Add to store
      getStoreActions().setEntity('incidents', incident.id, incident)

      return buildResponse(deepClone(incident))
    })
  },

  /**
   * Update an existing incident
   */
  update: async (id: string, input: UpdateIncidentInput): Promise<ApiResponse<Incident>> => {
    logApiCall('incidentsApi.update', { id, input })

    return simulateNetwork(() => {
      // Get existing incident
      const incident = getEntity<'incidents'>('incidents', id)
      if (!incident) {
        throw new NotFoundError('Incident', id)
      }

      // Validate location if changing
      let locationName = incident.locationName
      if (input.locationId && input.locationId !== incident.locationId) {
        const location = getEntity<'locations'>('locations', input.locationId)
        if (!location) {
          throw new NotFoundError('Location', input.locationId)
        }
        locationName = location.name
      }

      // Validate assignee if changing
      let assigneeName = incident.assigneeName
      let assigneeId = incident.assigneeId
      if (input.assigneeId !== undefined) {
        if (input.assigneeId === null) {
          assigneeName = undefined
          assigneeId = undefined
        } else if (input.assigneeId !== incident.assigneeId) {
          const assignee = getEntity<'users'>('users', input.assigneeId)
          if (!assignee) {
            throw new NotFoundError('Assignee', input.assigneeId)
          }
          assigneeName = `${assignee.firstName} ${assignee.lastName}`
          assigneeId = input.assigneeId
        }
      }

      // Update incident
      const now = timestamp()
      const updatedIncident: Incident = {
        ...incident,
        ...(input.title && { title: input.title.trim() }),
        ...(input.description && { description: input.description.trim() }),
        ...(input.type && { type: input.type }),
        ...(input.severity && { severity: input.severity }),
        ...(input.status && { status: input.status }),
        ...(input.locationId && { locationId: input.locationId, locationName }),
        assigneeId,
        assigneeName,
        ...(input.reference !== undefined && { reference: input.reference }),
        ...(input.coordinates && { coordinates: input.coordinates }),
        ...(input.what3words !== undefined && { what3words: input.what3words }),
        updatedAt: now,
        ...(input.status === 'closed' && !incident.closedAt && { closedAt: now }),
      }

      // Save to store
      getStoreActions().setEntity('incidents', id, updatedIncident)

      return buildResponse(updateComputedFields(deepClone(updatedIncident)))
    })
  },

  /**
   * Delete an incident
   */
  delete: async (id: string): Promise<ApiResponse<{ deleted: boolean; id: string }>> => {
    logApiCall('incidentsApi.delete', { id })

    return simulateNetwork(() => {
      const incident = getEntity<'incidents'>('incidents', id)
      if (!incident) {
        throw new NotFoundError('Incident', id)
      }

      // Delete related steps first (cascade)
      const steps = getEntities<'steps'>('steps')
      const relatedSteps = steps.filter((s) => s.incidentDbId === id)
      for (const step of relatedSteps) {
        getStoreActions().deleteEntity('steps', step.id)
      }

      // Delete the incident
      getStoreActions().deleteEntity('incidents', id)

      return buildResponse({ deleted: true, id })
    })
  },

  /**
   * Update incident status
   */
  updateStatus: async (
    id: string,
    status: Incident['status']
  ): Promise<ApiResponse<Incident>> => {
    logApiCall('incidentsApi.updateStatus', { id, status })

    return incidentsApi.update(id, { status })
  },

  /**
   * Assign incident to a user
   */
  assign: async (id: string, assigneeId: string | null): Promise<ApiResponse<Incident>> => {
    logApiCall('incidentsApi.assign', { id, assigneeId })

    return incidentsApi.update(id, { assigneeId })
  },

  /**
   * Get incident stats
   */
  getStats: async (): Promise<ApiResponse<Record<string, number>>> => {
    logApiCall('incidentsApi.getStats')

    return simulateNetwork(() => {
      const incidents = getEntities<'incidents'>('incidents')

      const stats: Record<string, number> = {
        total: incidents.length,
        open: 0,
        closed: 0,
        overdue: 0,
      }

      // Count by status
      for (const status of VALID_STATUSES) {
        stats[status] = incidents.filter((i) => i.status === status).length
      }

      // Count by severity
      for (const severity of VALID_SEVERITIES) {
        stats[`severity_${severity}`] = incidents.filter((i) => i.severity === severity).length
      }

      // Open = not closed or draft
      stats.open = incidents.filter((i) => !['closed', 'draft'].includes(i.status)).length

      // Closed
      stats.closed = incidents.filter((i) => i.status === 'closed').length

      // Overdue
      stats.overdue = incidents.filter((i) => i.isOverdue).length

      return buildResponse(stats)
    })
  },
}
