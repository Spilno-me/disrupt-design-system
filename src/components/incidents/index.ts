/**
 * Incident Reporting & Details Components
 *
 * Multi-step wizard for incident reporting and full-featured details page.
 */

// Incident Reporting Wizard
export { IncidentReportingFlow } from './IncidentReportingFlow'
export type { IncidentReportingFlowProps } from './IncidentReportingFlow'
export { IncidentWizard } from './IncidentWizard'

// Incident Action Menu (iOS-style contextual actions)
export { IncidentActionMenu } from './IncidentActionMenu'
export type { IncidentActionMenuProps } from './IncidentActionMenu'

// Incident Action Dialogs (submit, edit, delete)
export { DeleteIncidentDialog } from './DeleteIncidentDialog'
export type { DeleteIncidentDialogProps, IncidentToDelete } from './DeleteIncidentDialog'

export { SubmitIncidentDialog } from './SubmitIncidentDialog'
export type { SubmitIncidentDialogProps, IncidentToSubmit } from './SubmitIncidentDialog'

export { EditIncidentFlow } from './EditIncidentFlow'
export type { EditIncidentFlowProps, IncidentToEdit } from './EditIncidentFlow'

// Complete Table with Integrated Dialogs
export { IncidentManagementTableWithDialogs } from './IncidentManagementTableWithDialogs'
export type { IncidentManagementTableWithDialogsProps } from './IncidentManagementTableWithDialogs'

// Incident Details Page
export {
  IncidentDetailsPage,
  Breadcrumb,
  IncidentStatsBar,
  IncidentDetailsHeader,
  OverviewTab,
  LocationCard,
  IncidentInfoCard,
  DescriptionCard,
  IncidentMap,
  IncidentAccordionSection,
  WorkflowsSection,
  FormSubmissionViewer,
  FormSubmissionsSection,
  StepsTab,
  AdvisorTab,
  INCIDENT_TYPE_LABELS,
  INCIDENT_STATUS_LABELS,
  INCIDENT_SEVERITY_LABELS,
  FORM_TYPE_LABELS,
  INCIDENT_ROLE_LABELS,
} from './details'

// Wizard Types
export type {
  IncidentFormData,
  IncidentCategory,
  SeverityLevel,
  LocationOption,
} from './types'

// Details Types
export type {
  IncidentDetail,
  IncidentLocation,
  IncidentPerson,
  IncidentWorkflow,
  FormSubmission,
  Activity,
  IncidentStatus,
  IncidentSeverity,
  IncidentTab,
  IncidentDetailsPageProps,
  BreadcrumbItem,
  BreadcrumbProps,
  IncidentStatsBarProps,
  IncidentDetailsHeaderProps,
  LocationCardProps,
  IncidentMapProps,
  IncidentInfoCardProps,
  DescriptionCardProps,
  IncidentAccordionSectionProps,
  PlaceholderTabProps,
  // Document & Evidence types
  EvidenceDocument,
  DocumentUserContext,
  DocumentType,
  DocumentVisibility,
  IncidentRole,
  DocumentsEvidenceSectionProps,
  // Detailed Workflow types
  DetailedWorkflow,
  WorkflowStep,
  WorkflowStepAttachment,
  WorkflowStage,
  WorkflowStatus,
  WorkflowStepStatus,
  WorkflowsSectionProps,
  // Form submission types
  FormFieldType,
  FormField,
  FormSection,
  FormSubmissionData,
  FormSubmissionViewerProps,
  // Extended form submissions section types
  FormType,
  ExtendedFormSubmission,
  FormSubmissionsSectionProps,
} from './details'

// Wizard Constants
export {
  INCIDENT_CATEGORIES,
  SEVERITY_LEVELS,
  INCIDENT_WIZARD_STEPS,
  DEFAULT_FORM_DATA,
} from './types'

// Steps Page - View and manage incident steps/tasks
export { StepsPage, StepItem, STEP_STATUS_LABELS } from './steps-page'
export type {
  Step,
  StepStatus,
  StepsTabId,
  StepsPageTab,
  StepsFilterState,
  StepItemProps,
  StepsPageProps,
} from './steps-page'

// Incidents Page - Full incidents management page
export { IncidentsPage } from './incidents-page'
export type { IncidentsPageProps } from './incidents-page'
