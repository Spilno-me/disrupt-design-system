/**
 * Corrective Actions - Module Exports
 *
 * Complete UI toolkit for corrective and preventive action management.
 * Full EMEX parity with 30+ fields and complete workflow support.
 */

// =============================================================================
// TYPES
// =============================================================================

export type {
  // Core types
  CorrectiveActionStatus,
  CorrectiveActionPriority,
  EffectivenessAssessment,
  ActionType,
  // Reference types
  UserReference,
  LocationReference,
  DepartmentReference,
  DictionaryReference,
  EvidenceFile,
  // Main entity
  CorrectiveAction,
  // Component props
  CorrectiveActionPermissions,
  CorrectiveActionFilterState,
  // Timeline
  TimelineEventType,
  TimelineEvent,
} from './types'

// =============================================================================
// HELPERS
// =============================================================================

export {
  // Status
  STATUS_CONFIG,
  VALID_STATUSES,
  // Priority
  PRIORITY_CONFIG,
  VALID_PRIORITIES,
  // Effectiveness
  EFFECTIVENESS_CONFIG,
  // Timeline
  TIMELINE_EVENT_CONFIG,
  // Date utilities
  parseDate,
  formatDate,
  formatDateTime,
  formatRelativeDate,
  getDueDateState,
  getDaysUntilDue,
  // Validation
  isValidStatus,
  isValidPriority,
  canTransitionTo,
  // Sorting & filtering
  sortByPriority,
  sortByDueDate,
  isOverdue,
  // User display
  getUserDisplayName,
  getUserInitials,
} from './helpers'

export type { StatusConfig, PriorityConfig, EffectivenessConfig, DueDateState } from './helpers'

// =============================================================================
// DISPLAY ATOMS
// =============================================================================

export { CorrectiveActionStatusBadge } from './CorrectiveActionStatusBadge'
export type { CorrectiveActionStatusBadgeProps } from './CorrectiveActionStatusBadge'

export { PriorityIndicator } from './PriorityIndicator'
export type { PriorityIndicatorProps } from './PriorityIndicator'

export { DueDateDisplay } from './DueDateDisplay'
export type { DueDateDisplayProps } from './DueDateDisplay'

// =============================================================================
// LIST COMPONENTS
// =============================================================================

export { CorrectiveActionCard } from './CorrectiveActionCard'
export type { CorrectiveActionCardProps } from './CorrectiveActionCard'

export { CorrectiveActionsGrid } from './CorrectiveActionsGrid'
export type { CorrectiveActionsGridProps } from './CorrectiveActionsGrid'

export { CorrectiveActionsTable } from './CorrectiveActionsTable'
export type { CorrectiveActionsTableProps } from './CorrectiveActionsTable'

export { CorrectiveActionsPage } from './CorrectiveActionsPage'
export type { CorrectiveActionsPageProps } from './CorrectiveActionsPage'

// =============================================================================
// DETAIL COMPONENTS
// =============================================================================

export { CorrectiveActionHeader } from './CorrectiveActionHeader'
export type { CorrectiveActionHeaderProps } from './CorrectiveActionHeader'

export { CorrectiveActionTimeline } from './CorrectiveActionTimeline'
export type { CorrectiveActionTimelineProps } from './CorrectiveActionTimeline'

export { CorrectiveActionSidebar } from './CorrectiveActionSidebar'
export type { CorrectiveActionSidebarProps } from './CorrectiveActionSidebar'

export { CorrectiveActionDetailsPage } from './CorrectiveActionDetailsPage'
export type { CorrectiveActionDetailsPageProps } from './CorrectiveActionDetailsPage'

// =============================================================================
// FORM DIALOGS
// =============================================================================

export { ExtensionRequestDialog } from './ExtensionRequestDialog'
export type { ExtensionRequestDialogProps, ExtensionRequestData } from './ExtensionRequestDialog'

export { ClosureApprovalDialog } from './ClosureApprovalDialog'
export type {
  ClosureApprovalDialogProps,
  ClosureApprovalData,
  ClosureRejectionData,
} from './ClosureApprovalDialog'

export { CompletionFormDialog } from './CompletionFormDialog'
export type { CompletionFormDialogProps, CompletionFormData } from './CompletionFormDialog'

export { CreateCorrectiveActionSheet } from './CreateCorrectiveActionSheet'
export type {
  CreateCorrectiveActionSheetProps,
  CreateCorrectiveActionData,
} from './CreateCorrectiveActionSheet'
