/**
 * Incident Details Page Components
 *
 * Full-featured incident details page for Flow EHS with interactive map,
 * copyable IDs, workflow integration, and accordion sections.
 */

// Main page component
export { IncidentDetailsPage } from './IncidentDetailsPage'

// Header components
export { Breadcrumb, IncidentStatsBar, IncidentDetailsHeader } from './header'

// Overview tab components
export { OverviewTab, LocationCard, IncidentInfoCard, DescriptionCard, IncidentMap } from './overview'

// Accordion components
export { IncidentAccordionSection, WorkflowsSection, FormSubmissionViewer, FormSubmissionsSection } from './accordions'
export type { FormSubmissionViewerProps } from './accordions'

// Tab components
export { StepsTab, AdvisorTab } from './tabs'
export type { StepsTabProps } from './tabs'

// Types
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
  // Extended form submissions section types
  FormType,
  ExtendedFormSubmission,
  FormSubmissionsSectionProps,
} from './types'

export {
  INCIDENT_TYPE_LABELS,
  INCIDENT_STATUS_LABELS,
  INCIDENT_SEVERITY_LABELS,
  FORM_TYPE_LABELS,
  INCIDENT_ROLE_LABELS,
} from './types'
