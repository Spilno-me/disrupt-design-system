/**
 * IncidentAccordionSection - Collapsible sections for incident details
 *
 * Displays Workflows, Form Submissions, and Activities in expandable accordions.
 * Features a teal/accent left border for visual distinction.
 *
 * @example
 * ```tsx
 * <IncidentAccordionSection
 *   workflows={[...]}
 *   formSubmissions={[...]}
 *   activities={[...]}
 *   defaultExpanded={['workflows']}
 * />
 * ```
 */

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import {
  ChevronDown,
  GitBranch,
  FileText,
  Activity,
  MessageCircle,
  RefreshCw,
  UserPlus,
  Paperclip,
  Settings,
  Files,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { DocumentsEvidenceSection } from './DocumentsEvidenceSection'
import { WorkflowsSection } from './WorkflowsSection'
import { FormSubmissionsSection } from './FormSubmissionsSection'
import { ActivityTimeline, type TimelineActivity } from './ActivityTimeline'
import type {
  IncidentAccordionSectionProps,
  IncidentWorkflow,
  FormSubmission,
  ExtendedFormSubmission,
  Activity as ActivityType,
  ExtendedActivity,
  IncidentPerson,
  DocumentUserContext,
  DetailedWorkflow,
  IncidentSeverity,
} from '../types'

// =============================================================================
// SEVERITY BORDER COLORS
// =============================================================================

/**
 * Severity to CSS color variable mapping for gradient borders
 * Level 1 uses the base severity color (this component handles Level 1)
 */
const SEVERITY_BORDER_COLORS: Record<IncidentSeverity, string> = {
  critical: 'var(--color-error)',   // CORAL[500]
  high: 'var(--color-aging)',       // ORANGE[500]
  medium: 'var(--color-warning)',   // SUNRISE[500]
  low: 'var(--color-success)',      // HARBOR[500]
  none: 'var(--color-warning)',     // Default to warning
}

/**
 * Get gradient background for severity border element
 */
function getSeverityGradient(severity: IncidentSeverity | undefined): string {
  const color = SEVERITY_BORDER_COLORS[severity || 'none']
  return `linear-gradient(to bottom, transparent 0%, ${color} 30%, ${color} 70%, transparent 100%)`
}

/**
 * Gradient border element that follows rounded corners
 * Use inside a relative container with overflow-hidden and rounded-lg
 * z-20 ensures it stays above nested content (workflow items use z-10)
 */
function GradientBorder({ severity }: { severity?: IncidentSeverity }) {
  return (
    <div
      className="absolute left-0 top-0 bottom-0 w-[3px] z-20"
      style={{ background: getSeverityGradient(severity) }}
    />
  )
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

/**
 * Last updated info display
 */
function LastUpdatedInfo({
  person,
  date,
}: {
  person: IncidentPerson
  date: string
}) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }) + ' - ' + new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <span className="text-xs text-tertiary">
      Last updated by: <span className="text-link">{person.name}</span>
      <span className="mx-2">·</span>
      Updated date: {formattedDate}
    </span>
  )
}

/**
 * Custom accordion item wrapper with table-row-like styling
 *
 * Visual design matches IncidentManagementTable rows:
 * - Left border in warning/orange color (consistent with table priority borders)
 * - Bottom border separating items (no margins)
 * - Clean, flat appearance (no rounded corners)
 */
function AccordionSection({
  value,
  icon: _Icon, // Reserved for future use
  title,
  lastUpdatedBy,
  lastUpdatedAt,
  children,
  isEmpty,
  incidentSeverity,
}: {
  value: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  lastUpdatedBy?: IncidentPerson
  lastUpdatedAt?: string
  children: React.ReactNode
  isEmpty?: boolean
  incidentSeverity?: IncidentSeverity
}) {
  // Get severity color for borders
  const severityColor = SEVERITY_BORDER_COLORS[incidentSeverity || 'none']

  return (
    <AccordionPrimitive.Item
      value={value}
      className="relative bg-surface last:[&>div:first-child]:hidden"
      style={{
        // Severity-based left border
        borderLeft: `4px solid ${severityColor}`,
      }}
    >
      {/* Gradient bottom border - solid severity color on left, fading to transparent, z-10 to stay above hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none z-10"
        style={{
          background: `linear-gradient(to right, ${severityColor} 0%, ${severityColor} 70%, transparent 100%)`,
        }}
      />
      {/* Header wrapper with bottom padding to prevent hover overlapping border */}
      <AccordionPrimitive.Header className="flex pb-px">
        <AccordionPrimitive.Trigger
          className={cn(
            'flex flex-1 items-center justify-between py-3 px-4 text-left',
            'hover:bg-muted-bg/50 transition-colors',
            'data-[state=open]:bg-muted-bg/50',
            'focus:outline-none focus-visible:ring-ring/40 focus-visible:ring-4',
            'group'
          )}
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Title */}
            <span className="font-medium text-sm text-primary">{title}</span>

            {/* Last updated info (if available) */}
            {lastUpdatedBy && lastUpdatedAt && (
              <LastUpdatedInfo person={lastUpdatedBy} date={lastUpdatedAt} />
            )}
          </div>

          {/* Chevron */}
          <ChevronDown
            className={cn(
              'size-5 text-tertiary transition-transform duration-200',
              'group-data-[state=open]:rotate-180'
            )}
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      <AccordionPrimitive.Content
        className={cn(
          'overflow-hidden',
          'data-[state=open]:animate-accordion-down',
          'data-[state=closed]:animate-accordion-up'
        )}
      >
        {/* Level 1: 1 tone darker background with severity-colored gradient border */}
        <div className="bg-muted-bg/30 dark:bg-black/10 mx-4 mb-3 rounded-lg relative overflow-hidden">
          <GradientBorder severity={incidentSeverity} />
          <div className="px-4 pt-5 pb-3 relative z-10">
            {isEmpty ? (
              <p className="text-sm text-tertiary italic">No items</p>
            ) : (
              children
            )}
          </div>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}

// =============================================================================
// CONTENT RENDERERS
// =============================================================================

/**
 * Workflow status badge
 */
function WorkflowStatusBadge({ status }: { status: IncidentWorkflow['status'] }) {
  const statusStyles = {
    pending: 'bg-warning/10 text-warning-dark dark:text-warning border-warning/30',
    in_progress: 'bg-info/10 text-info border-info/30',
    completed: 'bg-success/10 text-success border-success/30',
  }

  const statusLabels = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
        statusStyles[status]
      )}
    >
      {statusLabels[status]}
    </span>
  )
}

/**
 * Workflows content
 */
function WorkflowsContent({ workflows }: { workflows: IncidentWorkflow[] }) {
  return (
    <div className="space-y-3">
      {workflows.map((workflow) => (
        <div
          key={workflow.id}
          className="w-full flex items-center justify-between p-3 bg-muted-bg/50 rounded-lg"
        >
          <div>
            <span className="text-sm font-medium text-primary">{workflow.name}</span>
          </div>
          <WorkflowStatusBadge status={workflow.status} />
        </div>
      ))}
    </div>
  )
}

/**
 * Form submission status badge
 */
function FormStatusBadge({ status }: { status: FormSubmission['status'] }) {
  const statusStyles = {
    pending: 'bg-warning/10 text-warning-dark dark:text-warning border-warning/30',
    approved: 'bg-success/10 text-success border-success/30',
    rejected: 'bg-error/10 text-error border-error/30',
  }

  const statusLabels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
        statusStyles[status]
      )}
    >
      {statusLabels[status]}
    </span>
  )
}

/**
 * Form submissions content
 */
function FormSubmissionsContent({ submissions }: { submissions: FormSubmission[] }) {
  return (
    <div className="space-y-3">
      {submissions.map((submission) => (
        <div
          key={submission.id}
          className="w-full flex items-center justify-between p-3 bg-muted-bg/50 rounded-lg"
        >
          <div>
            <span className="text-sm font-medium text-primary">{submission.formName}</span>
            <span className="text-xs text-tertiary ml-2">
              by {submission.submittedBy.name}
            </span>
          </div>
          <FormStatusBadge status={submission.status} />
        </div>
      ))}
    </div>
  )
}

/**
 * Activity type icon - using Lucide icons for consistency
 */
function ActivityIcon({ type }: { type: ActivityType['type'] }) {
  const iconMap: Record<ActivityType['type'], React.ComponentType<{ className?: string }>> = {
    comment: MessageCircle,
    status_change: RefreshCw,
    assignment: UserPlus,
    document_upload: Paperclip,
    workflow_update: Settings,
  }

  const Icon = iconMap[type]

  return (
    <div className="size-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
      <Icon className="size-4 text-accent" aria-hidden="true" />
    </div>
  )
}

/**
 * Activities content
 */
function ActivitiesContent({ activities }: { activities: ActivityType[] }) {
  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="w-full flex items-start gap-3 p-3 bg-muted-bg/50 rounded-lg"
        >
          <ActivityIcon type={activity.type} />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-primary">{activity.description}</p>
            <p className="text-xs text-tertiary mt-1">
              {activity.user.name} · {new Date(activity.timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * IncidentAccordionSection - Collapsible workflow/forms/activities sections
 */
export function IncidentAccordionSection({
  workflows,
  detailedWorkflows,
  formSubmissions,
  extendedFormSubmissions,
  activities,
  extendedActivities,
  documents = [],
  incidentStatus = 'draft',
  incidentSeverity,
  userContext,
  onDocumentUpload,
  onDocumentDelete,
  onDocumentDownload,
  onDocumentView,
  onWorkflowAttachmentView,
  onWorkflowAttachmentDownload,
  onWorkflowCancel,
  onWorkflowPersonClick,
  onWorkflowStageClick,
  onFormSubmissionView,
  onFormSubmissionDownload,
  onFormSubmissionPersonClick,
  onActivitiesExport,
  onActivityPersonClick,
  defaultExpanded = [],
  className,
}: IncidentAccordionSectionProps) {
  // Determine if we should use detailed workflows
  const useDetailedWorkflows = detailedWorkflows && detailedWorkflows.length > 0

  // Determine if we should use extended form submissions
  const useExtendedFormSubmissions = extendedFormSubmissions && extendedFormSubmissions.length > 0

  // Determine if we should use extended activities (timeline format)
  const useExtendedActivities = extendedActivities && extendedActivities.length > 0

  // Convert simple activities to timeline format for backwards compatibility
  const timelineActivities: TimelineActivity[] = useExtendedActivities
    ? extendedActivities!.map((activity) => ({
        id: activity.id,
        type: activity.type,
        title: activity.title,
        note: activity.note,
        user: activity.user,
        timestamp: activity.timestamp,
        metadata: activity.metadata,
      }))
    : activities.map((activity) => ({
        id: activity.id,
        type: activity.type as TimelineActivity['type'],
        title: activity.description,
        user: activity.user,
        timestamp: activity.timestamp,
      }))

  // Get most recent update info for each section
  const getLatestWorkflow = () => {
    if (useDetailedWorkflows) {
      if (detailedWorkflows!.length === 0) return null
      return detailedWorkflows!.reduce((latest, current) =>
        new Date(current.lastUpdatedAt) > new Date(latest.lastUpdatedAt) ? current : latest
      )
    }
    if (workflows.length === 0) return null
    return workflows.reduce((latest, current) =>
      new Date(current.lastUpdatedAt) > new Date(latest.lastUpdatedAt) ? current : latest
    )
  }

  const getLatestSubmission = () => {
    if (useExtendedFormSubmissions) {
      if (extendedFormSubmissions!.length === 0) return null
      return extendedFormSubmissions!.reduce((latest, current) =>
        new Date(current.submittedAt) > new Date(latest.submittedAt) ? current : latest
      )
    }
    if (formSubmissions.length === 0) return null
    return formSubmissions.reduce((latest, current) =>
      new Date(current.submittedAt) > new Date(latest.submittedAt) ? current : latest
    )
  }

  const getLatestDocument = () => {
    if (documents.length === 0) return null
    return documents.reduce((latest, current) =>
      new Date(current.uploadedAt) > new Date(latest.uploadedAt) ? current : latest
    )
  }

  const latestWorkflow = getLatestWorkflow()
  const latestSubmission = getLatestSubmission()
  const latestDocument = getLatestDocument()

  // Default user context if not provided
  const defaultUserContext: DocumentUserContext = userContext || {
    userId: 'current-user',
    userName: 'Current User',
    role: 'reporter',
    isReporter: true,
    isAssigned: incidentStatus === 'draft',
  }

  return (
    <AccordionPrimitive.Root
      type="multiple"
      defaultValue={defaultExpanded}
      className={cn(
        // Container with top/bottom borders - items have left + bottom borders
        'border-t border-b border-default rounded-lg overflow-hidden',
        className
      )}
    >
      {/* Documents & Evidence Section - First */}
      <AccordionSection
        value="documents"
        icon={Files}
        title="Documents & Evidence"
        lastUpdatedBy={latestDocument?.uploadedBy}
        lastUpdatedAt={latestDocument?.uploadedAt}
        isEmpty={documents.length === 0 && !onDocumentUpload}
        incidentSeverity={incidentSeverity}
      >
        <DocumentsEvidenceSection
          documents={documents}
          incidentStatus={incidentStatus}
          userContext={defaultUserContext}
          onUpload={onDocumentUpload}
          onDelete={onDocumentDelete}
          onDownload={onDocumentDownload}
          onView={onDocumentView}
        />
      </AccordionSection>

      {/* Workflows Section */}
      <AccordionSection
        value="workflows"
        icon={GitBranch}
        title="Workflows"
        lastUpdatedBy={latestWorkflow?.lastUpdatedBy}
        lastUpdatedAt={latestWorkflow?.lastUpdatedAt}
        isEmpty={useDetailedWorkflows ? detailedWorkflows!.length === 0 : workflows.length === 0}
        incidentSeverity={incidentSeverity}
      >
        {useDetailedWorkflows ? (
          <WorkflowsSection
            workflows={detailedWorkflows!}
            incidentSeverity={incidentSeverity}
            onViewAttachment={onWorkflowAttachmentView}
            onDownloadAttachment={onWorkflowAttachmentDownload}
            onCancelWorkflow={onWorkflowCancel}
            onPersonClick={onWorkflowPersonClick}
            onStageClick={onWorkflowStageClick}
          />
        ) : (
          <WorkflowsContent workflows={workflows} />
        )}
      </AccordionSection>

      {/* Form Submissions Section */}
      <AccordionSection
        value="formSubmissions"
        icon={FileText}
        title="Form Submissions"
        lastUpdatedBy={latestSubmission?.submittedBy}
        lastUpdatedAt={latestSubmission?.submittedAt}
        isEmpty={useExtendedFormSubmissions ? extendedFormSubmissions!.length === 0 : formSubmissions.length === 0}
        incidentSeverity={incidentSeverity}
      >
        {useExtendedFormSubmissions ? (
          <FormSubmissionsSection
            submissions={extendedFormSubmissions!}
            incidentSeverity={incidentSeverity}
            collapsible={false}
            onView={onFormSubmissionView}
            onDownload={onFormSubmissionDownload}
            onPersonClick={onFormSubmissionPersonClick}
          />
        ) : (
          <FormSubmissionsContent submissions={formSubmissions} />
        )}
      </AccordionSection>

      {/* Activities Section */}
      <AccordionSection
        value="activities"
        icon={Activity}
        title="Activities"
        isEmpty={timelineActivities.length === 0}
        incidentSeverity={incidentSeverity}
      >
        <ActivityTimeline
          activities={timelineActivities}
          onExport={onActivitiesExport ? (acts) => onActivitiesExport(acts as ExtendedActivity[]) : undefined}
          onUserClick={onActivityPersonClick}
          showSearch={timelineActivities.length > 3}
          showExport={!!onActivitiesExport}
        />
      </AccordionSection>
    </AccordionPrimitive.Root>
  )
}

export default IncidentAccordionSection
