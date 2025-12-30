/**
 * Step API Types
 *
 * Re-exports step types from components and adds API-specific input types.
 * Steps are tasks/actions that need to be completed as part of incident resolution.
 */

// Re-export from steps-page types
export type {
  Step,
  StepStatus,
  StepsFilterState,
  StepsTabId,
  StepsPageTab,
} from '../../components/incidents/steps-page/types'

// Re-export constants
export {
  STEP_STATUS_LABELS,
  SEVERITY_LABELS,
} from '../../components/incidents/steps-page/types'

// Re-export person type
export type { IncidentPerson } from '../../components/incidents/details/types'

// =============================================================================
// API INPUT TYPES
// =============================================================================

/**
 * Input for creating a new step
 */
export interface CreateStepInput {
  /** Parent incident database ID */
  incidentId: string
  /** Step title */
  title: string
  /** Detailed description */
  description?: string
  /** Tooltip text */
  tooltip?: string
  /** Person assigned to complete this step */
  assigneeId: string
  /** Due date (ISO string) */
  dueDate?: string
  /** Initial status */
  status?: 'pending' | 'in_progress'
}

/**
 * Input for updating a step
 */
export interface UpdateStepInput {
  title?: string
  description?: string
  tooltip?: string
  status?: 'pending' | 'in_progress' | 'overdue' | 'completed'
  assigneeId?: string
  dueDate?: string
}

/**
 * Filter options for listing steps
 */
export interface StepListFilters {
  /** Filter by incident */
  incidentId?: string
  /** Filter by assignee */
  assigneeId?: string
  /** Filter by status */
  status?: ('pending' | 'in_progress' | 'overdue' | 'completed')[]
  /** Filter by severity (inherited from incident) */
  severity?: ('critical' | 'high' | 'medium' | 'low' | 'none')[]
  /** Filter overdue only */
  isOverdue?: boolean
  /** Search in title/description */
  search?: string
}

/**
 * Step with full incident context (for list views)
 */
export interface StepWithContext extends Omit<import('../../components/incidents/steps-page/types').Step, 'reporter'> {
  /** Full incident details for context */
  incident: {
    id: string
    incidentId: string
    title: string
    status: string
    severity: string
  }
  /** Reporter info */
  reporter: {
    id: string
    name: string
    email?: string
    avatar?: string
  }
}

/**
 * Bulk step update input
 */
export interface BulkStepUpdateInput {
  stepIds: string[]
  updates: {
    status?: 'pending' | 'in_progress' | 'completed'
    assigneeId?: string
  }
}
