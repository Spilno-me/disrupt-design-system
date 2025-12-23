/**
 * Incident Details Page Types
 *
 * Type definitions for the incident details page and its sub-components.
 * Extends existing incident types from the wizard flow.
 */

import type { IncidentCategory, SeverityLevel } from '../types'

// Re-export for convenience
export type { IncidentCategory, SeverityLevel }

// =============================================================================
// STATUS TYPES (aligned with IncidentStatusBadge)
// =============================================================================

/**
 * Incident workflow status - determines the status badge icon
 */
export type IncidentStatus = 'investigation' | 'review' | 'reported' | 'draft' | 'closed'

/**
 * Incident severity - determines the status badge color
 */
export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low' | 'none'

// =============================================================================
// CORE DATA TYPES
// =============================================================================

/**
 * Person reference (reporter, assignee, etc.)
 */
export interface IncidentPerson {
  id: string
  name: string
  email?: string
  avatar?: string
}

/**
 * Location with optional what3words and coordinates
 */
export interface IncidentLocation {
  id: string
  /** Display name (e.g., "Loading Dock - East") */
  name: string
  /** Facility name (e.g., "Main Warehouse") */
  facility: string
  facilityId: string
  /** GPS coordinates */
  coordinates?: {
    lat: number
    lng: number
  }
  /** What3Words address (e.g., "///appealing.concluded.mugs") */
  what3words?: string
  /** Street address */
  address?: string
}

/**
 * Simple workflow item (legacy, kept for backward compatibility)
 */
export interface IncidentWorkflow {
  id: string
  name: string
  status: 'pending' | 'in_progress' | 'completed'
  lastUpdatedBy: IncidentPerson
  lastUpdatedAt: string
}

// =============================================================================
// DETAILED WORKFLOW TYPES (for expanded workflow accordion)
// =============================================================================

/**
 * Workflow status
 */
export type WorkflowStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

/**
 * Workflow step status
 */
export type WorkflowStepStatus = 'pending' | 'active' | 'completed' | 'skipped'

/**
 * Form field types for workflow form submissions
 */
export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'datetime'
  | 'time'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'signature'
  | 'location'
  | 'person'
  | 'rating'

/**
 * Single form field with label and value
 */
export interface FormField {
  id: string
  /** Field label/question */
  label: string
  /** Field type for rendering */
  type: FormFieldType
  /** The submitted value */
  value: string | string[] | number | boolean | null
  /** Display value (formatted for presentation) */
  displayValue?: string
  /** Whether this field is required */
  required?: boolean
  /** Section/group this field belongs to */
  section?: string
  /** Additional metadata (e.g., file info, location coords) */
  metadata?: Record<string, unknown>
}

/**
 * Form section for grouping fields
 */
export interface FormSection {
  id: string
  title: string
  description?: string
  fields: FormField[]
}

/**
 * Complete form submission data
 */
export interface FormSubmissionData {
  /** Form template ID */
  formId: string
  /** Form template name */
  formName: string
  /** Form version */
  version?: string
  /** Organized sections with fields */
  sections: FormSection[]
  /** Flat list of all fields (alternative to sections) */
  fields?: FormField[]
  /** Submission metadata */
  submittedBy: IncidentPerson
  submittedAt: string
  /** Optional approval status */
  approvalStatus?: 'pending' | 'approved' | 'rejected' | 'revision_requested'
  /** Approver info if approved/rejected */
  reviewedBy?: IncidentPerson
  reviewedAt?: string
  /** Review notes */
  reviewNotes?: string
}

/**
 * Attachment linked to a workflow step (form, document, etc.)
 */
export interface WorkflowStepAttachment {
  id: string
  type: 'form' | 'document' | 'link'
  name: string
  url?: string
  submittedBy?: IncidentPerson
  submittedAt?: string
  /** Form submission data (when type is 'form') */
  formData?: FormSubmissionData
}

/**
 * Single step within a workflow
 */
export interface WorkflowStep {
  id: string
  name: string
  stepNumber: number
  totalSteps: number
  status: WorkflowStepStatus
  /** Person assigned to this step (for active steps) */
  assignedTo?: IncidentPerson
  /** When was this step assigned */
  assignedAt?: string
  /** Due date for this step */
  dueDate?: string
  /** Whether this step is overdue */
  isOverdue?: boolean
  /** Completed date (if completed) */
  completedAt?: string
  /** Completed by person (if completed) */
  completedBy?: IncidentPerson
  /** Attachments for this step (forms, documents) */
  attachments?: WorkflowStepAttachment[]
}

/**
 * Current stage in the workflow
 */
export interface WorkflowStage {
  id: string
  name: string
  /** Short code like "RCA" */
  code: string
}

/**
 * Detailed workflow with steps, progress, and stages
 */
export interface DetailedWorkflow {
  id: string
  name: string
  status: WorkflowStatus
  /** Current stage (e.g., "RCA", "Investigation") */
  currentStage?: WorkflowStage
  /** Number of completed steps */
  completedSteps: number
  /** Total number of steps */
  totalSteps: number
  /** All steps in this workflow */
  steps: WorkflowStep[]
  /** Last updated by */
  lastUpdatedBy: IncidentPerson
  /** Last updated date */
  lastUpdatedAt: string
  /** Can this workflow be cancelled? */
  canCancel?: boolean
}

/**
 * Props for the WorkflowsSection component
 */
export interface WorkflowsSectionProps {
  workflows: DetailedWorkflow[]
  /** Incident severity - controls border colors at each depth level */
  incidentSeverity?: IncidentSeverity
  /** Callback when a step attachment is viewed */
  onViewAttachment?: (attachment: WorkflowStepAttachment) => void
  /** Callback when a step attachment is downloaded */
  onDownloadAttachment?: (attachment: WorkflowStepAttachment) => void
  /** Callback when a workflow is cancelled */
  onCancelWorkflow?: (workflowId: string) => void
  /** Callback when a person link is clicked */
  onPersonClick?: (person: IncidentPerson) => void
  /** Callback when a stage link is clicked */
  onStageClick?: (stage: WorkflowStage) => void
  className?: string
}

/**
 * Form submission linked to incident
 */
export interface FormSubmission {
  id: string
  formName: string
  submittedBy: IncidentPerson
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

/**
 * Activity log entry (simple)
 */
export interface Activity {
  id: string
  type: 'comment' | 'status_change' | 'assignment' | 'document_upload' | 'workflow_update'
  description: string
  user: IncidentPerson
  timestamp: string
  metadata?: Record<string, unknown>
}

/**
 * Extended activity type for timeline display
 */
export type ActivityTimelineType =
  | 'status_change'
  | 'document_upload'
  | 'comment'
  | 'assignment'
  | 'workflow_update'
  | 'approval'
  | 'rejection'

/**
 * Extended activity for timeline visualization
 * Adds support for expandable notes and better metadata typing
 */
export interface ExtendedActivity {
  id: string
  /** Activity type determines the icon */
  type: ActivityTimelineType
  /** Main activity description (e.g., "Status changed to "Review"") */
  title: string
  /** Optional detailed note/comment that can be expanded */
  note?: string
  /** Person who performed the activity */
  user: IncidentPerson
  /** ISO timestamp of the activity */
  timestamp: string
  /** Optional metadata for additional context */
  metadata?: {
    /** Old status value */
    fromStatus?: string
    /** New status value */
    toStatus?: string
    /** Document name if type is document_upload */
    documentName?: string
    /** Workflow name if type is workflow_update */
    workflowName?: string
  }
}

// =============================================================================
// DOCUMENTS & EVIDENCE TYPES
// =============================================================================

/**
 * User role in the incident workflow
 * Determines document visibility and edit permissions
 */
export type IncidentRole =
  | 'reporter'      // Initial incident reporter
  | 'investigator'  // Person investigating the incident
  | 'reviewer'      // Person reviewing/approving the investigation
  | 'admin'         // Full access to all documents
  | 'viewer'        // Read-only access to permitted documents

/**
 * Document type for filtering
 */
export type DocumentType =
  | 'image'         // Photos, screenshots
  | 'video'         // Video recordings
  | 'document'      // PDF, Word, etc.
  | 'form'          // Submitted forms
  | 'other'         // Other file types

/**
 * Document visibility level - determines who can see the document
 * Higher roles can see documents at their level and below
 */
export type DocumentVisibility =
  | 'reporter'      // Only reporter and higher can see
  | 'investigator'  // Only investigator and higher can see
  | 'reviewer'      // Only reviewer and admin can see
  | 'all'           // Everyone with access to the incident can see

/**
 * Evidence document attached to an incident
 */
export interface EvidenceDocument {
  id: string
  /** Original filename */
  name: string
  /** File type for filtering and icon display */
  type: DocumentType
  /** MIME type */
  mimeType: string
  /** File size in bytes */
  size: number
  /** URL to download/view the file */
  url: string
  /** Thumbnail URL for images/videos */
  thumbnailUrl?: string
  /** Person who uploaded the document */
  uploadedBy: IncidentPerson
  /** Upload timestamp (ISO string) */
  uploadedAt: string
  /** Role that uploaded this document */
  uploadedByRole: IncidentRole
  /** Who can see this document */
  visibility: DocumentVisibility
  /** Has sensitive/graphic content warning */
  isGraphic?: boolean
  /** Document description or notes */
  description?: string
  /** Tags for categorization */
  tags?: string[]
}

/**
 * Current user's context for permission checks
 */
export interface DocumentUserContext {
  /** User's ID */
  userId: string
  /** User's name */
  userName: string
  /** User's role in this incident */
  role: IncidentRole
  /** Is the user the original reporter */
  isReporter: boolean
  /** Is the user currently assigned to the incident */
  isAssigned: boolean
}

/**
 * Props for DocumentsEvidenceSection component
 */
export interface DocumentsEvidenceSectionProps {
  /** List of evidence documents */
  documents: EvidenceDocument[]
  /** Current incident status (affects edit permissions) */
  incidentStatus: IncidentStatus
  /** Current user context for permissions */
  userContext: DocumentUserContext
  /** Last person who updated documents */
  lastUpdatedBy?: IncidentPerson
  /** Last update timestamp */
  lastUpdatedAt?: string
  /** Callback when documents are uploaded */
  onUpload?: (files: File[]) => Promise<void>
  /** Callback when a document is deleted */
  onDelete?: (documentIds: string[]) => Promise<void>
  /** Callback when a document is downloaded */
  onDownload?: (documentIds: string[]) => void
  /** Callback when viewing a document */
  onView?: (document: EvidenceDocument) => void
  /** Is upload in progress */
  isUploading?: boolean
  /** Additional className */
  className?: string
}

/**
 * Full incident detail data structure
 */
export interface IncidentDetail {
  /** Database ID */
  id: string
  /** Human-readable incident ID (e.g., "INC-51634456533") */
  incidentId: string
  /** Short title/summary for header */
  title: string
  /** Long description for the description card */
  description: string

  // Classification
  status: IncidentStatus
  severity: IncidentSeverity
  type: IncidentCategory

  // Location
  location: IncidentLocation

  // People
  reporter: IncidentPerson
  assignee?: IncidentPerson

  // Dates (ISO strings)
  createdAt: string
  updatedAt: string
  closedAt?: string

  // Stats
  stepsTotal: number
  stepsCompleted: number
  documentsCount: number
  daysOpen: number

  // Related data
  workflows: IncidentWorkflow[]
  formSubmissions: FormSubmission[]
  activities: Activity[]

  // Optional external reference
  reference?: string
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================

/**
 * Props for the main IncidentDetailsPage component
 */
export interface IncidentDetailsPageProps {
  /** Full incident data */
  incident: IncidentDetail
  /** Current active tab */
  activeTab?: 'overview' | 'steps' | 'advisor'
  /** Use compact 2-column layout (saves ~30% vertical space) */
  compactLayout?: boolean
  /** Tab change handler */
  onTabChange?: (tab: 'overview' | 'steps' | 'advisor') => void
  /** Breadcrumb navigation handler */
  onNavigate?: (path: string) => void
  /** Edit action handler */
  onEdit?: () => void
  /** Refresh data handler */
  onRefresh?: () => void
  /** Location click handler */
  onLocationClick?: (locationId: string) => void
  /** Facility click handler */
  onFacilityClick?: (facilityId: string) => void
  /** Reporter click handler */
  onReporterClick?: (reporterId: string) => void
  /** Loading state */
  isLoading?: boolean
  /** Additional className */
  className?: string
  // Document & Evidence props
  /** Evidence documents for the incident */
  documents?: EvidenceDocument[]
  /** Current user context for document permissions */
  userContext?: DocumentUserContext
  /** Callback when documents are uploaded */
  onDocumentUpload?: (files: File[]) => Promise<void>
  /** Callback when documents are deleted */
  onDocumentDelete?: (documentIds: string[]) => Promise<void>
  /** Callback when documents are downloaded */
  onDocumentDownload?: (documentIds: string[]) => void
  /** Callback when viewing a document */
  onDocumentView?: (document: EvidenceDocument) => void
  // Workflow props
  /** Detailed workflows with steps (takes precedence over incident.workflows) */
  detailedWorkflows?: DetailedWorkflow[]
  /** Callback when a workflow step attachment is viewed */
  onWorkflowAttachmentView?: (attachment: WorkflowStepAttachment) => void
  /** Callback when a workflow step attachment is downloaded */
  onWorkflowAttachmentDownload?: (attachment: WorkflowStepAttachment) => void
  /** Callback when a workflow is cancelled */
  onWorkflowCancel?: (workflowId: string) => void
  /** Callback when a person link is clicked in workflows */
  onWorkflowPersonClick?: (person: IncidentPerson) => void
  /** Callback when a stage link is clicked in workflows */
  onWorkflowStageClick?: (stage: WorkflowStage) => void
  // Form Submission props
  /** Extended form submissions with search/filter (takes precedence over incident.formSubmissions) */
  extendedFormSubmissions?: ExtendedFormSubmission[]
  /** Callback when a form submission is viewed */
  onFormSubmissionView?: (submission: ExtendedFormSubmission) => void
  /** Callback when a form submission is downloaded */
  onFormSubmissionDownload?: (submission: ExtendedFormSubmission) => void
  /** Callback when a person link is clicked in form submissions */
  onFormSubmissionPersonClick?: (person: IncidentPerson) => void
  // Activity props
  /** Extended activities with timeline support (takes precedence over incident.activities) */
  extendedActivities?: ExtendedActivity[]
  /** Callback when activities are exported */
  onActivitiesExport?: (activities: ExtendedActivity[]) => void
  /** Callback when a person link is clicked in activities */
  onActivityPersonClick?: (person: IncidentPerson) => void
  // Steps tab props
  /** Steps for this incident (shown in Steps tab) */
  incidentSteps?: import('../steps-page/types').Step[]
  /** Handler when "Next Step" button is clicked in Steps tab */
  onStepNextStep?: (step: import('../steps-page/types').Step) => void
  /** Handler when assignee name is clicked in Steps tab */
  onStepAssigneeClick?: (person: IncidentPerson) => void
  /** Handler when reporter name is clicked in Steps tab */
  onStepReporterClick?: (person: IncidentPerson) => void
  /** Handler when location is clicked in Steps tab */
  onStepLocationClick?: (location: string) => void
}

/**
 * Breadcrumb navigation item
 */
export interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
}

/**
 * Props for Breadcrumb component
 */
export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

/**
 * Props for IncidentStatsBar component
 */
export interface IncidentStatsBarProps {
  stepsCompleted: number
  stepsTotal: number
  documentsCount: number
  daysOpen: number
  className?: string
}

/**
 * Props for IncidentDetailsHeader component
 */
export interface IncidentDetailsHeaderProps {
  incidentId: string
  title: string
  severity: IncidentSeverity
  stepsCompleted: number
  stepsTotal: number
  documentsCount: number
  daysOpen: number
  onRefresh?: () => void
  className?: string
}

/**
 * Props for LocationCard component
 */
export interface LocationCardProps {
  location: IncidentLocation
  onLocationClick?: (id: string) => void
  onFacilityClick?: (id: string) => void
  className?: string
}

/**
 * Props for IncidentMap component
 */
export interface IncidentMapProps {
  coordinates?: { lat: number; lng: number }
  what3words?: string
  /** Map height (default: 180) */
  height?: number | string
  /** Zoom level (default: 15) */
  zoom?: number
  /** Enable interactions (default: false for preview) */
  interactive?: boolean
  /** Show marker at coordinates */
  showMarker?: boolean
  className?: string
}

/**
 * Props for IncidentInfoCard component
 */
export interface IncidentInfoCardProps {
  status: IncidentStatus
  severity: IncidentSeverity
  type: IncidentCategory
  reference?: string
  reporter: IncidentPerson
  createdAt: string
  onReporterClick?: (id: string) => void
  onEdit?: () => void
  className?: string
}

/**
 * Props for DescriptionCard component
 */
export interface DescriptionCardProps {
  title?: string
  description: string
  /** Max lines before truncation (default: 6) */
  maxLines?: number
  className?: string
}

/**
 * Props for IncidentAccordionSection component
 */
export interface IncidentAccordionSectionProps {
  /** Simple workflows (legacy) */
  workflows: IncidentWorkflow[]
  /** Detailed workflows with steps (optional, takes precedence over simple workflows) */
  detailedWorkflows?: DetailedWorkflow[]
  /** Simple form submissions (legacy) */
  formSubmissions: FormSubmission[]
  /** Extended form submissions with search/filter (optional, takes precedence) */
  extendedFormSubmissions?: ExtendedFormSubmission[]
  /** Simple activities (legacy) */
  activities: Activity[]
  /** Extended activities with timeline support (optional, takes precedence) */
  extendedActivities?: ExtendedActivity[]
  /** Evidence documents */
  documents?: EvidenceDocument[]
  /** Current incident status for document permissions */
  incidentStatus?: IncidentStatus
  /** Incident severity - controls border colors at each depth level */
  incidentSeverity?: IncidentSeverity
  /** Current user context for document permissions */
  userContext?: DocumentUserContext
  /** Callback when documents are uploaded */
  onDocumentUpload?: (files: File[]) => Promise<void>
  /** Callback when documents are deleted */
  onDocumentDelete?: (documentIds: string[]) => Promise<void>
  /** Callback when documents are downloaded */
  onDocumentDownload?: (documentIds: string[]) => void
  /** Callback when viewing a document */
  onDocumentView?: (document: EvidenceDocument) => void
  /** Callback when a workflow step attachment is viewed */
  onWorkflowAttachmentView?: (attachment: WorkflowStepAttachment) => void
  /** Callback when a workflow step attachment is downloaded */
  onWorkflowAttachmentDownload?: (attachment: WorkflowStepAttachment) => void
  /** Callback when a workflow is cancelled */
  onWorkflowCancel?: (workflowId: string) => void
  /** Callback when a person link is clicked in workflows */
  onWorkflowPersonClick?: (person: IncidentPerson) => void
  /** Callback when a stage link is clicked in workflows */
  onWorkflowStageClick?: (stage: WorkflowStage) => void
  /** Callback when a form submission is viewed */
  onFormSubmissionView?: (submission: ExtendedFormSubmission) => void
  /** Callback when a form submission is downloaded */
  onFormSubmissionDownload?: (submission: ExtendedFormSubmission) => void
  /** Callback when a person link is clicked in form submissions */
  onFormSubmissionPersonClick?: (person: IncidentPerson) => void
  /** Callback when activities are exported */
  onActivitiesExport?: (activities: ExtendedActivity[]) => void
  /** Callback when a person link is clicked in activities */
  onActivityPersonClick?: (person: IncidentPerson) => void
  /** Default expanded accordion IDs */
  defaultExpanded?: string[]
  className?: string
}

/**
 * Props for placeholder tab components
 */
export interface PlaceholderTabProps {
  title?: string
  description?: string
  className?: string
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Tab identifier type
 */
export type IncidentTab = 'overview' | 'steps' | 'advisor'

/**
 * Type labels for display
 */
export const INCIDENT_TYPE_LABELS: Record<IncidentCategory, string> = {
  injury: 'Injury',
  near_miss: 'Near Miss',
  environmental: 'Environmental',
  equipment: 'Equipment Damage',
  chemical: 'Chemical Spill',
  fire: 'Fire/Explosion',
  other: 'Other',
}

/**
 * Status labels for display
 */
export const INCIDENT_STATUS_LABELS: Record<IncidentStatus, string> = {
  investigation: 'Investigation',
  review: 'Review',
  reported: 'Reported',
  draft: 'Draft',
  closed: 'Closed',
}

/**
 * Severity labels for display
 */
export const INCIDENT_SEVERITY_LABELS: Record<IncidentSeverity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  none: 'None',
}

// =============================================================================
// FORM SUBMISSIONS SECTION TYPES
// =============================================================================

/**
 * Form submission type for filtering
 */
export type FormType = 'incident_report' | 'investigation' | 'corrective_action' | 'audit' | 'checklist' | 'other'

/**
 * Extended form submission with additional metadata
 */
export interface ExtendedFormSubmission extends FormSubmission {
  /** Form type for filtering */
  type?: FormType
  /** Role of the submitter */
  submitterRole?: IncidentRole
  /** File size in bytes (if applicable) */
  fileSize?: number
  /** URL to view/download the form */
  url?: string
}

/**
 * Props for FormSubmissionsSection component
 */
export interface FormSubmissionsSectionProps {
  /** List of form submissions */
  submissions: ExtendedFormSubmission[]
  /** Incident severity - controls border colors */
  incidentSeverity?: IncidentSeverity
  /** Last person who updated */
  lastUpdatedBy?: IncidentPerson
  /** Last update timestamp */
  lastUpdatedAt?: string
  /** Whether the section is collapsible (default: true) */
  collapsible?: boolean
  /** Whether the section starts expanded (default: true) */
  defaultExpanded?: boolean
  /** Callback when a form is viewed */
  onView?: (submission: ExtendedFormSubmission) => void
  /** Callback when a form is downloaded */
  onDownload?: (submission: ExtendedFormSubmission) => void
  /** Callback when a person link is clicked */
  onPersonClick?: (person: IncidentPerson) => void
  /** Items per page (default: 10) */
  pageSize?: number
  /** Page size options */
  pageSizeOptions?: number[]
  /** Additional className */
  className?: string
}

/**
 * Form type labels for display
 */
export const FORM_TYPE_LABELS: Record<FormType, string> = {
  incident_report: 'Incident Report',
  investigation: 'Investigation',
  corrective_action: 'Corrective Action',
  audit: 'Audit',
  checklist: 'Checklist',
  other: 'Other',
}

/**
 * Role labels for display in filters
 */
export const INCIDENT_ROLE_LABELS: Record<IncidentRole, string> = {
  reporter: 'Reporter',
  investigator: 'Investigator',
  reviewer: 'Reviewer',
  admin: 'Admin',
  viewer: 'Viewer',
}
