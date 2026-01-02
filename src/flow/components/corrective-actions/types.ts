/**
 * Corrective Actions - Type Definitions
 *
 * Full EMEX parity with corrective-action-schema.json
 * Supports the complete workflow: assigned → in-progress → pending-approval → completed → closed
 */

// =============================================================================
// ENUMS & UNIONS
// =============================================================================

/**
 * Status flow:
 * assigned → in-progress → pending-approval → completed → closed
 *                ↓                              ↓
 *             deferred                     (rejected back)
 */
export type CorrectiveActionStatus =
  | 'assigned'
  | 'in-progress'
  | 'pending-approval'
  | 'completed'
  | 'closed'
  | 'deferred'

export type CorrectiveActionPriority = 'low' | 'medium' | 'high' | 'urgent'

export type EffectivenessAssessment =
  | 'highly-effective'
  | 'effective'
  | 'partially-effective'
  | 'not-effective'
  | 'too-early'

export type ActionType = 'corrective' | 'preventive'

// =============================================================================
// REFERENCE TYPES
// =============================================================================

export interface UserReference {
  id: string
  firstName?: string
  lastName?: string
  email?: string
  avatarUrl?: string
}

export interface LocationReference {
  id: string
  name: string
  code?: string
  parentId?: string
}

export interface DepartmentReference {
  id: string
  name: string
  code?: string
}

export interface DictionaryReference {
  id: string
  name: string
  code: string
  value?: string
}

export interface EvidenceFile {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  uploadedAt: Date | string
  uploadedBy?: UserReference
}

// =============================================================================
// MAIN ENTITY
// =============================================================================

/**
 * CorrectiveAction - Full entity matching EMEX corrective-action-schema.json
 *
 * Contains all 30+ fields organized by category:
 * - Core identification
 * - Classification (type, category, source)
 * - Assignment (owner, department, location)
 * - Dates (due, assigned, completed, closure)
 * - Root cause analysis
 * - Implementation details
 * - Completion & evidence
 * - Closure approval
 * - Extension requests
 */
export interface CorrectiveAction {
  id: string

  // ─────────────────────────────────────────────────────────────────────────
  // CORE
  // ─────────────────────────────────────────────────────────────────────────
  /** Reference number (auto-generated, e.g., CA-2025-001) */
  referenceNumber: string
  /** Brief descriptive title */
  title: string
  /** Detailed description of the action */
  description: string
  /** Current workflow status */
  status: CorrectiveActionStatus
  /** Priority level */
  priority: CorrectiveActionPriority

  // ─────────────────────────────────────────────────────────────────────────
  // CLASSIFICATION
  // ─────────────────────────────────────────────────────────────────────────
  /** Type: corrective or preventive */
  actionType?: DictionaryReference
  /** Category from dictionary */
  category?: DictionaryReference
  /** Source type (audit, incident, observation, etc.) */
  sourceType?: DictionaryReference
  /** Reference number from source */
  sourceReferenceNumber?: string
  /** Related entity (incident, audit, etc.) */
  relatedEntityId?: string
  relatedEntityType?: string

  // ─────────────────────────────────────────────────────────────────────────
  // ASSIGNMENT
  // ─────────────────────────────────────────────────────────────────────────
  /** Person responsible for completing the action */
  actionOwner?: UserReference
  /** Department responsible */
  responsibleDepartment?: DepartmentReference
  /** Primary location */
  location?: LocationReference
  /** Additional location details */
  specificLocationDetails?: string

  // ─────────────────────────────────────────────────────────────────────────
  // DATES
  // ─────────────────────────────────────────────────────────────────────────
  /** When assigned to owner */
  assignedDate?: Date | string
  /** Target completion date */
  dueDate: Date | string
  /** Actual completion date */
  completedDate?: Date | string
  /** Official closure date */
  closureDate?: Date | string

  // ─────────────────────────────────────────────────────────────────────────
  // ROOT CAUSE
  // ─────────────────────────────────────────────────────────────────────────
  /** Root cause category from dictionary */
  rootCauseCategory?: DictionaryReference
  /** Detailed root cause analysis */
  rootCauseAnalysis?: string

  // ─────────────────────────────────────────────────────────────────────────
  // IMPLEMENTATION
  // ─────────────────────────────────────────────────────────────────────────
  /** Detailed implementation plan */
  implementationPlan?: string
  /** How effectiveness will be verified */
  verificationMethod?: string
  /** Criteria for measuring success */
  successCriteria?: string
  /** Estimated cost */
  estimatedCost?: number

  // ─────────────────────────────────────────────────────────────────────────
  // COMPLETION
  // ─────────────────────────────────────────────────────────────────────────
  /** Notes about completion */
  completionNotes?: string
  /** Evidence files */
  completionEvidence?: EvidenceFile[]
  /** Effectiveness assessment */
  effectivenessAssessment?: EffectivenessAssessment

  // ─────────────────────────────────────────────────────────────────────────
  // CLOSURE
  // ─────────────────────────────────────────────────────────────────────────
  /** Whether closure is approved */
  closureApproved?: boolean
  /** Who approved closure */
  closureApprovedBy?: UserReference
  /** Closure comments from approver */
  closureComments?: string

  // ─────────────────────────────────────────────────────────────────────────
  // EXTENSION
  // ─────────────────────────────────────────────────────────────────────────
  /** Extension requested */
  extensionRequested?: boolean
  /** Requested new due date */
  requestedDueDate?: Date | string
  /** Justification for extension */
  extensionJustification?: string
  /** Extension approved */
  extensionApproved?: boolean
  /** Approved new due date */
  approvedDueDate?: Date | string
  /** Reason for rejection */
  rejectionReason?: string

  // ─────────────────────────────────────────────────────────────────────────
  // DEFERRAL
  // ─────────────────────────────────────────────────────────────────────────
  /** Reason for deferring */
  deferredReason?: string

  // ─────────────────────────────────────────────────────────────────────────
  // METADATA
  // ─────────────────────────────────────────────────────────────────────────
  createdAt: Date | string
  createdBy?: UserReference
  updatedAt: Date | string
  updatedBy?: UserReference
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================

export interface CorrectiveActionPermissions {
  canView: boolean
  canEdit: boolean
  canCreate: boolean
  canDelete: boolean
  canApprove: boolean
  canRequestExtension: boolean
}

export interface CorrectiveActionFilterState {
  search: string
  status: CorrectiveActionStatus | 'all'
  priority: CorrectiveActionPriority | 'all'
  assignee: string | 'all'
  overdue: boolean
}

// =============================================================================
// HISTORY/TIMELINE
// =============================================================================

export type TimelineEventType =
  | 'created'
  | 'assigned'
  | 'status_changed'
  | 'comment_added'
  | 'evidence_uploaded'
  | 'extension_requested'
  | 'extension_approved'
  | 'extension_rejected'
  | 'completed'
  | 'closure_requested'
  | 'closure_approved'
  | 'closure_rejected'
  | 'deferred'
  | 'reopened'

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  timestamp: Date | string
  user?: UserReference
  details?: string
  previousValue?: string
  newValue?: string
}
