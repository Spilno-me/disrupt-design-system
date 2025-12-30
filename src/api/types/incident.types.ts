/**
 * Incident API Types
 *
 * Defines incident types for the API layer.
 * These consolidate types from various incident-related components.
 */

// Re-export from details types
export type {
  IncidentStatus,
  IncidentSeverity,
  IncidentPerson,
  IncidentLocation,
  IncidentWorkflow,
  WorkflowStatus,
  WorkflowStepStatus,
  FormFieldType,
  FormField,
  FormSection,
  FormSubmissionData,
  WorkflowStepAttachment,
  WorkflowStep,
} from '../../components/incidents/details/types'

// =============================================================================
// CORE INCIDENT TYPES
// =============================================================================

/**
 * Incident category/type
 */
export type IncidentType =
  | 'injury'
  | 'near_miss'
  | 'environmental'
  | 'equipment'
  | 'chemical'
  | 'fire'
  | 'other'

/**
 * Full incident entity for API operations
 */
export interface Incident {
  /** Database UUID */
  id: string
  /** Human-readable incident ID (e.g., "INC-2025-0847") */
  incidentId: string
  /** Incident title */
  title: string
  /** Detailed description */
  description: string
  /** Current workflow status */
  status: 'investigation' | 'review' | 'reported' | 'draft' | 'closed'
  /** Severity level */
  severity: 'critical' | 'high' | 'medium' | 'low' | 'none'
  /** Incident category */
  type: IncidentType
  /** Location where incident occurred */
  locationId: string
  /** Location name (denormalized for display) */
  locationName: string
  /** Facility name (denormalized for display) */
  facilityName?: string
  /** Reporter user ID */
  reporterId: string
  /** Reporter name (denormalized) */
  reporterName: string
  /** Assignee user ID (optional) */
  assigneeId?: string
  /** Assignee name (denormalized) */
  assigneeName?: string
  /** When incident occurred */
  occurredAt: string
  /** When incident was reported/created */
  createdAt: string
  /** Last update timestamp */
  updatedAt: string
  /** When incident was closed (if closed) */
  closedAt?: string
  /** Total number of steps */
  stepsTotal: number
  /** Number of completed steps */
  stepsCompleted: number
  /** Number of attached documents */
  documentsCount: number
  /** Days since creation */
  daysOpen: number
  /** Whether incident is overdue */
  isOverdue?: boolean
  /** External reference number */
  reference?: string
  /** GPS coordinates */
  coordinates?: {
    lat: number
    lng: number
  }
  /** What3Words address */
  what3words?: string
}

/**
 * Lightweight incident for list views
 */
export interface IncidentListItem {
  id: string
  incidentId: string
  title: string
  status: 'investigation' | 'review' | 'reported' | 'draft' | 'closed'
  severity: 'critical' | 'high' | 'medium' | 'low' | 'none'
  type: IncidentType
  locationName: string
  reporterName: string
  assigneeName?: string
  createdAt: string
  daysOpen: number
  isOverdue?: boolean
  stepsTotal: number
  stepsCompleted: number
}

// =============================================================================
// API INPUT TYPES
// =============================================================================

/**
 * Input for creating a new incident
 */
export interface CreateIncidentInput {
  title: string
  description: string
  type: IncidentType
  severity: 'critical' | 'high' | 'medium' | 'low' | 'none'
  locationId: string
  reporterId: string
  assigneeId?: string
  occurredAt?: string
  reference?: string
  coordinates?: {
    lat: number
    lng: number
  }
  what3words?: string
  /** Start as draft or reported */
  status?: 'draft' | 'reported'
}

/**
 * Input for updating an incident
 */
export interface UpdateIncidentInput {
  title?: string
  description?: string
  type?: IncidentType
  severity?: 'critical' | 'high' | 'medium' | 'low' | 'none'
  status?: 'investigation' | 'review' | 'reported' | 'draft' | 'closed'
  locationId?: string
  assigneeId?: string | null
  reference?: string
  coordinates?: {
    lat: number
    lng: number
  }
  what3words?: string
}

/**
 * Filter options for listing incidents
 */
export interface IncidentListFilters {
  status?: ('investigation' | 'review' | 'reported' | 'draft' | 'closed')[]
  severity?: ('critical' | 'high' | 'medium' | 'low' | 'none')[]
  type?: IncidentType[]
  locationId?: string
  reporterId?: string
  assigneeId?: string
  isOverdue?: boolean
  createdAfter?: string
  createdBefore?: string
  search?: string
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const INCIDENT_STATUS_LABELS: Record<string, string> = {
  investigation: 'Under Investigation',
  review: 'In Review',
  reported: 'Reported',
  draft: 'Draft',
  closed: 'Closed',
}

export const INCIDENT_SEVERITY_LABELS: Record<string, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  none: 'None',
}

export const INCIDENT_TYPE_LABELS: Record<IncidentType, string> = {
  injury: 'Injury',
  near_miss: 'Near Miss',
  environmental: 'Environmental',
  equipment: 'Equipment Failure',
  chemical: 'Chemical Spill',
  fire: 'Fire',
  other: 'Other',
}
