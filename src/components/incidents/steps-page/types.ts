/**
 * Steps Page Types
 *
 * Type definitions for the Steps page where users view and manage
 * tasks/steps from different incidents that require their attention.
 */

import type * as React from 'react'
import type { IncidentPerson, IncidentSeverity, IncidentStatus } from '../details/types'

// Re-export for convenience
export type { IncidentPerson, IncidentSeverity, IncidentStatus }

// =============================================================================
// STEP TYPES
// =============================================================================

/**
 * Step status - whether the step is actionable
 */
export type StepStatus = 'pending' | 'in_progress' | 'overdue' | 'completed'

/**
 * A step/task from an incident that requires user attention
 */
export interface Step {
  /** Unique step ID */
  id: string
  /** Step title (e.g., "Safety Protocol Review") */
  title: string
  /** Step description (expandable) */
  description?: string
  /** Info tooltip text */
  tooltip?: string
  /** Linked incident ID (e.g., "INC-567482") */
  incidentId: string
  /** Linked incident database ID for navigation */
  incidentDbId: string
  /** Incident severity - determines border color and NextStep button color */
  severity: IncidentSeverity
  /** Step status */
  status: StepStatus
  /** Location name */
  location: string
  /** Person assigned to this step */
  assignee: IncidentPerson
  /** Person who reported the incident */
  reporter: IncidentPerson
  /** When the step was created (ISO string) */
  createdAt: string
  /** Due date for the step (ISO string) */
  dueDate?: string
  /** Days since creation (for aging indicator) */
  daysOpen: number
  /** Whether the step is overdue */
  isOverdue?: boolean
}

// =============================================================================
// FILTER TYPES
// =============================================================================

/**
 * Available filters for the steps list
 */
export interface StepsFilterState {
  /** Text search query */
  search?: string
  /** Filter by severity */
  severity?: IncidentSeverity[]
  /** Filter by status */
  status?: StepStatus[]
}

// =============================================================================
// TAB TYPES
// =============================================================================

/**
 * Tab identifiers for the steps page
 */
export type StepsTabId = 'my-steps' | 'team-steps'

/**
 * Tab data with count badge
 */
export interface StepsPageTab {
  id: StepsTabId
  label: string
  count: number
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================

/**
 * Props for individual step item
 */
export interface StepItemProps {
  /** Step data */
  step: Step
  /** Whether the step is expanded to show description */
  isExpanded?: boolean
  /** Toggle expand/collapse */
  onToggleExpand?: () => void
  /** Handler when "Next Step" button is clicked */
  onNextStep?: (step: Step) => void
  /** Handler when incident ID link is clicked */
  onIncidentClick?: (incidentDbId: string, incidentId: string) => void
  /** Handler when assignee name is clicked */
  onAssigneeClick?: (person: IncidentPerson) => void
  /** Handler when reporter name is clicked */
  onReporterClick?: (person: IncidentPerson) => void
  /** Handler when location is clicked */
  onLocationClick?: (location: string) => void
  /** Additional className */
  className?: string
}

/**
 * Props for the steps list container
 */
export interface StepsListProps {
  /** List of steps to display */
  steps: Step[]
  /** Handler when "Next Step" button is clicked */
  onNextStep?: (step: Step) => void
  /** Handler when incident ID link is clicked */
  onIncidentClick?: (incidentDbId: string, incidentId: string) => void
  /** Handler when assignee name is clicked */
  onAssigneeClick?: (person: IncidentPerson) => void
  /** Handler when reporter name is clicked */
  onReporterClick?: (person: IncidentPerson) => void
  /** Handler when location is clicked */
  onLocationClick?: (location: string) => void
  /** Empty state message */
  emptyMessage?: string
  /** Additional className */
  className?: string
}

/**
 * Props for the main StepsPage component
 */
export interface StepsPageProps {
  /** Steps for "My Steps" tab */
  mySteps: Step[]
  /** Steps for "Team Steps" tab */
  teamSteps: Step[]
  /** Currently active tab */
  activeTab?: StepsTabId
  /** Tab change handler */
  onTabChange?: (tab: StepsTabId) => void
  /** Handler when "Next Step" button is clicked - navigates to incident */
  onNextStep?: (step: Step) => void
  /** Handler when incident ID link is clicked */
  onIncidentClick?: (incidentDbId: string, incidentId: string) => void
  /** Handler when assignee name is clicked */
  onAssigneeClick?: (person: IncidentPerson) => void
  /** Handler when reporter name is clicked */
  onReporterClick?: (person: IncidentPerson) => void
  /** Handler when location is clicked */
  onLocationClick?: (location: string) => void
  /** Initial page size */
  defaultPageSize?: number
  /** Page size options */
  pageSizeOptions?: number[]
  /** Loading state */
  isLoading?: boolean
  /** Additional className */
  className?: string

  // Page header props (PageActionPanel)
  /** Page icon for header - defaults to Waypoints icon */
  pageIcon?: React.ReactNode
  /** Page title for header - defaults to "Steps" */
  pageTitle?: string
  /** Page subtitle for header - defaults to "View and manage tasks from incidents" */
  pageSubtitle?: string
  /** Action buttons for the page header (e.g., Export button) */
  headerActions?: React.ReactNode
  /** Primary action for mobile view */
  headerPrimaryAction?: React.ReactNode
  /** Handler for export button - if not provided, export button won't be shown */
  onExport?: () => void
  /** Handler for reporting a new step/task - shows "Add Step" button if provided */
  onAddStep?: () => void
}

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Status labels for display
 */
export const STEP_STATUS_LABELS: Record<StepStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  overdue: 'Overdue',
  completed: 'Completed',
}

/**
 * Severity labels for display
 */
export const SEVERITY_LABELS: Record<IncidentSeverity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  none: 'None',
}
