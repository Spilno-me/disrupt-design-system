/**
 * WorkflowsSection - Detailed workflow tracking with steps, progress, and attachments
 *
 * Features:
 * - Collapsible workflows with progress bars
 * - Step-by-step tracking with status indicators
 * - Active step highlighting with overdue warnings
 * - Expandable steps with form/document attachments
 * - Mobile-responsive design
 *
 * @example
 * ```tsx
 * <WorkflowsSection
 *   workflows={detailedWorkflows}
 *   onViewAttachment={(attachment) => console.log('View:', attachment)}
 *   onCancelWorkflow={(id) => console.log('Cancel:', id)}
 * />
 * ```
 */

import * as React from 'react'
import { useState } from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import {
  ChevronDown,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Key,
  FileText,
  Eye,
  Download,
  XCircle,
  Square,
  ExternalLink,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../ui/button'
import { FormSubmissionViewer } from './FormSubmissionViewer'
import type {
  WorkflowsSectionProps,
  DetailedWorkflow,
  WorkflowStep,
  WorkflowStepAttachment,
  WorkflowStatus,
  WorkflowStepStatus,
  IncidentPerson,
  WorkflowStage,
  IncidentSeverity,
} from '../types'

// =============================================================================
// CONSTANTS
// =============================================================================

const WORKFLOW_STATUS_CONFIG: Record<WorkflowStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-muted-bg text-secondary border-default',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-warning/10 text-warning-dark dark:text-warning border-warning/30',
  },
  completed: {
    label: 'Complete',
    className: 'bg-success/10 text-success border-success/30',
  },
  cancelled: {
    label: 'CANCELLED',
    className: 'bg-muted-bg text-tertiary border-default uppercase tracking-wider',
  },
}

const STEP_STATUS_CONFIG: Record<WorkflowStepStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-muted-bg text-secondary border-default',
  },
  active: {
    label: 'Active',
    className: 'bg-success/10 text-success border-success/30',
  },
  completed: {
    label: 'Complete',
    className: 'bg-success/10 text-success border-success/30',
  },
  skipped: {
    label: 'Skipped',
    className: 'bg-muted-bg text-tertiary border-default',
  },
}

/**
 * Severity to CSS color variable mapping for gradient borders
 * Each severity has 3 depth levels (progressively darker)
 * Using design token color variables
 */
const SEVERITY_BORDER_COLORS: Record<IncidentSeverity, { level1: string; level2: string; level3: string }> = {
  critical: {
    level1: 'var(--color-error)',        // CORAL[500] - base
    level2: 'var(--color-error-strong)', // CORAL[700] - 1 step darker
    level3: 'var(--brand-coral-800)',    // CORAL[800] - 2 steps darker
  },
  high: {
    level1: 'var(--color-aging)',        // ORANGE[500] - base
    level2: 'var(--brand-orange-600)',   // ORANGE[600] - 1 step darker
    level3: 'var(--brand-orange-700)',   // ORANGE[700] - 2 steps darker
  },
  medium: {
    level1: 'var(--color-warning)',      // SUNRISE[500] - base
    level2: 'var(--brand-sunrise-600)',  // SUNRISE[600] - 1 step darker
    level3: 'var(--brand-sunrise-700)',  // SUNRISE[700] - 2 steps darker
  },
  low: {
    level1: 'var(--color-success)',        // HARBOR[500] - base
    level2: 'var(--color-success-strong)', // HARBOR[700] - 1 step darker
    level3: 'var(--color-success-dark)',   // HARBOR[800] - 2 steps darker
  },
  none: {
    level1: 'var(--color-warning)',      // Default to warning if no severity
    level2: 'var(--brand-sunrise-600)',
    level3: 'var(--brand-sunrise-700)',
  },
}

/**
 * Get gradient background for severity border element
 * Used with absolute positioned element for rounded corner support
 */
function getSeverityGradient(severity: IncidentSeverity | undefined, level: 1 | 2 | 3): string {
  const colors = SEVERITY_BORDER_COLORS[severity || 'none']
  const color = level === 1 ? colors.level1 : level === 2 ? colors.level2 : colors.level3
  return `linear-gradient(to bottom, transparent 0%, ${color} 30%, ${color} 70%, transparent 100%)`
}

/**
 * Gradient border element that follows rounded corners
 * Use inside a relative container with overflow-hidden and rounded-lg
 */
function GradientBorder({
  severity,
  level
}: {
  severity?: IncidentSeverity
  level: 1 | 2 | 3
}) {
  const width = level === 1 ? '3px' : '2px'
  return (
    <div
      className="absolute left-0 top-0 bottom-0 z-0"
      style={{
        width,
        background: getSeverityGradient(severity, level)
      }}
    />
  )
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

/**
 * Status badge component
 */
function StatusBadge({
  status,
  config,
}: {
  status: string
  config: { label: string; className: string }
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className
      )}
    >
      {config.label}
    </span>
  )
}

/**
 * Progress bar with percentage and shimmer animation
 */
function ProgressBar({
  completed,
  total,
}: {
  completed: number
  total: number
}) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  const isComplete = completed >= total

  return (
    <div className="space-y-1.5">
      {/* Mobile: stacked layout, Desktop: inline */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-0.5 text-sm">
        <span className="text-secondary">Progress</span>
        <span className="text-secondary text-xs xs:text-sm">
          {completed} of {total} steps ({percentage}%)
        </span>
      </div>
      <div className="h-2.5 bg-default rounded-full overflow-hidden">
        <div
          className="h-full bg-success rounded-full transition-all duration-300 relative overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer sweep animation - only when not complete */}
          {!isComplete && percentage > 0 && (
            <div
              className="absolute inset-0 animate-shimmer"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Step status icon
 */
function StepIcon({ status }: { status: WorkflowStepStatus }) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="size-5 text-success" />
    case 'active':
      return <Clock className="size-5 text-warning" />
    case 'skipped':
      return <XCircle className="size-5 text-tertiary" />
    case 'pending':
    default:
      return <Circle className="size-5 text-tertiary" />
  }
}

/**
 * Person link component
 */
function PersonLink({
  person,
  onClick,
}: {
  person: IncidentPerson
  onClick?: (person: IncidentPerson) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(person)}
      className="text-link hover:text-link-hover hover:underline focus:outline-none focus-visible:ring-ring/40 focus-visible:ring-2 rounded-sm"
    >
      {person.name}
    </button>
  )
}

/**
 * Stage link component
 */
function StageLink({
  stage,
  onClick,
}: {
  stage: WorkflowStage
  onClick?: (stage: WorkflowStage) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(stage)}
      className="text-link hover:text-link-hover hover:underline font-medium focus:outline-none focus-visible:ring-ring/40 focus-visible:ring-2 rounded-sm"
    >
      {stage.code}
    </button>
  )
}

/**
 * Overdue badge
 */
function OverdueBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-error/10 text-error border border-error/20">
      <AlertTriangle className="size-3" />
      Overdue
    </span>
  )
}

/**
 * Format date for display
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Format date with time
 */
function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  return (
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) +
    ' ' +
    date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  )
}

/**
 * Step attachment row
 */
function AttachmentRow({
  attachment,
  onView,
  onDownload,
}: {
  attachment: WorkflowStepAttachment
  onView?: (attachment: WorkflowStepAttachment) => void
  onDownload?: (attachment: WorkflowStepAttachment) => void
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 px-3 sm:py-2 sm:pl-8 md:pl-12 gap-2 bg-surface rounded-lg shadow-md mx-2 my-2 first:mt-3 last:mb-3">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <FileText className="size-5 sm:size-4 text-tertiary flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => onView?.(attachment)}
            className="text-sm text-link hover:text-link-hover hover:underline text-left break-words line-clamp-2 sm:line-clamp-1 focus:outline-none focus-visible:ring-ring/40 focus-visible:ring-2 rounded-sm"
          >
            {attachment.name}
          </button>
          {attachment.submittedBy && attachment.submittedAt && (
            <p className="text-xs text-secondary truncate">
              {attachment.submittedBy.name} • {formatDate(attachment.submittedAt)}
            </p>
          )}
        </div>
      </div>
      {/* Mobile: full-width action buttons, Desktop: inline icons */}
      <div className="flex items-center gap-2 flex-shrink-0 sm:ml-2">
        <button
          type="button"
          onClick={() => onView?.(attachment)}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-sm text-secondary hover:text-primary active:text-primary transition-colors p-3 sm:p-2 rounded-lg sm:rounded hover:bg-muted-bg/50 min-h-[44px] sm:min-h-0 focus:outline-none focus-visible:ring-ring/40 focus-visible:ring-4"
        >
          <Eye className="size-5 sm:size-4" />
          <span className="sm:hidden md:inline">View</span>
        </button>
        <button
          type="button"
          onClick={() => onDownload?.(attachment)}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-sm text-secondary hover:text-primary active:text-primary transition-colors p-3 sm:p-2 rounded-lg sm:rounded hover:bg-muted-bg/50 min-h-[44px] sm:min-h-0 focus:outline-none focus-visible:ring-ring/40 focus-visible:ring-4"
        >
          <Download className="size-5 sm:size-4" />
          <span className="sm:hidden md:inline">Download</span>
        </button>
      </div>
    </div>
  )
}

/**
 * Single workflow step row
 */
function WorkflowStepRow({
  step,
  isExpanded,
  onToggle,
  onViewAttachment,
  onDownloadAttachment,
  onPersonClick,
  incidentSeverity,
}: {
  step: WorkflowStep
  isExpanded: boolean
  onToggle: () => void
  onViewAttachment?: (attachment: WorkflowStepAttachment) => void
  onDownloadAttachment?: (attachment: WorkflowStepAttachment) => void
  onPersonClick?: (person: IncidentPerson) => void
  incidentSeverity?: IncidentSeverity
}) {
  const hasAttachments = step.attachments && step.attachments.length > 0
  const isActive = step.status === 'active'

  return (
    <div
      className={cn(
        'border border-default rounded-lg overflow-hidden shadow-sm bg-surface',
        isActive && step.isOverdue && 'border-l-4 border-l-error bg-error/5'
      )}
    >
      {/* Step header - touch-friendly with min-height */}
      <button
        type="button"
        onClick={onToggle}
        disabled={!hasAttachments}
        className={cn(
          'w-full flex items-start sm:items-center gap-3 p-3 sm:p-3 text-left min-h-[56px]',
          'focus:outline-none focus-visible:ring-ring/40 focus-visible:ring-4 focus-visible:rounded-lg',
          hasAttachments && 'hover:bg-muted-bg/50 active:bg-muted-bg/50 cursor-pointer',
          !hasAttachments && 'cursor-default'
        )}
      >
        {/* Status icon */}
        <div className="mt-0.5 sm:mt-0">
          <StepIcon status={step.status} />
        </div>

        {/* Step info - mobile: stack metadata vertically */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start sm:items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-primary line-clamp-2 sm:line-clamp-none">{step.name}</span>
            {isActive && step.isOverdue && <OverdueBadge />}
          </div>
          {/* Mobile: stacked metadata, Desktop: inline */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-xs text-secondary mt-1 sm:mt-0.5">
            <span>Step {step.stepNumber} of {step.totalSteps}</span>
            {isActive && step.assignedTo && (
              <span className="flex items-center gap-1 flex-wrap">
                <span className="hidden sm:inline">•</span>
                <span>Assigned to</span>
                <PersonLink person={step.assignedTo} onClick={onPersonClick} />
              </span>
            )}
            {isActive && step.dueDate && (
              <span className={cn(step.isOverdue && 'text-error font-medium')}>
                <span className="hidden sm:inline">• </span>Due: {formatDate(step.dueDate)}
              </span>
            )}
          </div>
        </div>

        {/* Right side: status badge + chevron */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Status badge - hide on mobile, show on larger screens */}
          <div className="hidden sm:block">
            <StatusBadge status={step.status} config={STEP_STATUS_CONFIG[step.status]} />
          </div>

          {/* Chevron (only if has attachments) */}
          {hasAttachments && (
            <ChevronDown
              className={cn(
                'size-5 text-tertiary transition-transform duration-200',
                isExpanded && 'rotate-180'
              )}
            />
          )}
        </div>
      </button>

      {/* Level 3: 3 tones darker background with severity-colored gradient border */}
      {isExpanded && hasAttachments && (
        <div className="bg-page/80 dark:bg-black/35 mx-2 mb-2 rounded-lg relative overflow-hidden">
          <GradientBorder severity={incidentSeverity} level={3} />
          <div className="py-1 relative z-10">
            {step.attachments!.map((attachment) => (
              <AttachmentRow
                key={attachment.id}
                attachment={attachment}
                onView={onViewAttachment}
                onDownload={onDownloadAttachment}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Single workflow accordion item
 */
function WorkflowAccordionItem({
  workflow,
  incidentSeverity,
  onViewAttachment,
  onDownloadAttachment,
  onCancelWorkflow,
  onPersonClick,
  onStageClick,
}: {
  workflow: DetailedWorkflow
  incidentSeverity?: IncidentSeverity
  onViewAttachment?: (attachment: WorkflowStepAttachment) => void
  onDownloadAttachment?: (attachment: WorkflowStepAttachment) => void
  onCancelWorkflow?: (workflowId: string) => void
  onPersonClick?: (person: IncidentPerson) => void
  onStageClick?: (stage: WorkflowStage) => void
}) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set())

  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev)
      if (next.has(stepId)) {
        next.delete(stepId)
      } else {
        next.add(stepId)
      }
      return next
    })
  }

  // Get severity color for gradient border
  const severityColor = SEVERITY_BORDER_COLORS[incidentSeverity || 'none'].level1

  return (
    <AccordionPrimitive.Item value={workflow.id} className="relative last:[&>div:first-child]:hidden">
      {/* Gradient bottom border - solid on left, fading to transparent on right, z-10 to stay above hover */}
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
            'flex flex-1 items-center gap-2 sm:gap-3 py-3 px-3 sm:px-4 text-left min-h-[56px]',
            'hover:bg-muted-bg/50 active:bg-muted-bg/50 transition-colors',
            'focus:outline-none focus-visible:ring-ring/40 focus-visible:ring-4',
            'group'
          )}
        >
          {/* Workflow icon */}
          <Key className="size-5 text-tertiary flex-shrink-0" />

          {/* Workflow name - allow wrapping, max 2 lines on mobile, full on desktop */}
          <span className="flex-1 text-sm font-medium text-primary min-w-0 break-words line-clamp-2 sm:line-clamp-none">
            {workflow.name}
          </span>

          {/* Cancel button - icon only on mobile, text on desktop */}
          {workflow.canCancel && workflow.status === 'in_progress' && (
            <Button
              variant="outline"
              size="sm"
              className="text-error border-error/30 hover:bg-error/10 hover:text-error active:bg-error/20 mr-1 sm:mr-2 aspect-square sm:aspect-auto px-0 sm:px-3"
              onClick={(e) => {
                e.stopPropagation()
                onCancelWorkflow?.(workflow.id)
              }}
            >
              <Square className="size-3.5 sm:size-3 sm:mr-1 fill-current" />
              <span className="hidden sm:inline">Cancel</span>
            </Button>
          )}

          {/* Status badge - smaller on mobile */}
          <div className="flex-shrink-0">
            <span
              className={cn(
                'inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border',
                WORKFLOW_STATUS_CONFIG[workflow.status].className
              )}
            >
              {WORKFLOW_STATUS_CONFIG[workflow.status].label}
            </span>
          </div>

          {/* Chevron */}
          <ChevronDown
            className={cn(
              'size-5 text-tertiary transition-transform duration-200 flex-shrink-0',
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
        {/* Level 2: 2 tones darker background with severity-colored gradient border */}
        <div className="bg-muted-bg/60 dark:bg-black/25 mx-2 mb-2 rounded-lg relative overflow-hidden">
          <GradientBorder severity={incidentSeverity} level={2} />
          <div className="px-3 py-3 space-y-3 relative z-10">
          {/* Progress bar */}
          <ProgressBar completed={workflow.completedSteps} total={workflow.totalSteps} />

          {/* Current stage */}
          {workflow.currentStage && (
            <div className="flex items-center gap-2 text-sm">
              <Key className="size-4 text-accent flex-shrink-0" />
              <span className="text-secondary">Current Stage:</span>
              <StageLink stage={workflow.currentStage} onClick={onStageClick} />
            </div>
          )}

          {/* Steps list */}
          <div className="space-y-2">
            {workflow.steps.map((step) => (
              <WorkflowStepRow
                key={step.id}
                step={step}
                isExpanded={expandedSteps.has(step.id)}
                onToggle={() => toggleStep(step.id)}
                onViewAttachment={onViewAttachment}
                onDownloadAttachment={onDownloadAttachment}
                onPersonClick={onPersonClick}
                incidentSeverity={incidentSeverity}
              />
            ))}
          </div>
          </div>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function WorkflowsSection({
  workflows,
  incidentSeverity,
  onViewAttachment,
  onDownloadAttachment,
  onCancelWorkflow,
  onPersonClick,
  onStageClick,
  className,
}: WorkflowsSectionProps) {
  // State for form viewer
  const [viewingAttachment, setViewingAttachment] = useState<WorkflowStepAttachment | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  // All workflows collapsed by default - user expands as needed
  const defaultExpanded: string[] = []

  // Handle view attachment - show form viewer for forms, call callback for others
  const handleViewAttachment = (attachment: WorkflowStepAttachment) => {
    if (attachment.type === 'form') {
      // Show form viewer for form attachments
      setViewingAttachment(attachment)
      setIsViewerOpen(true)
    } else if (attachment.type === 'link' && attachment.url) {
      // Open links in new tab
      window.open(attachment.url, '_blank', 'noopener,noreferrer')
    } else {
      // Call external handler for documents/other
      onViewAttachment?.(attachment)
    }
  }

  // Handle form viewer close
  const handleViewerClose = (open: boolean) => {
    setIsViewerOpen(open)
    if (!open) {
      // Delay clearing attachment to allow animation
      setTimeout(() => setViewingAttachment(null), 200)
    }
  }

  if (workflows.length === 0) {
    return (
      <p className="text-sm text-tertiary italic py-4">No workflows assigned</p>
    )
  }

  return (
    <>
      <AccordionPrimitive.Root
        type="multiple"
        defaultValue={defaultExpanded}
        className={cn('-mx-4 -my-3 space-y-0 pl-[3px]', className)}
      >
        {workflows.map((workflow) => (
          <WorkflowAccordionItem
            key={workflow.id}
            workflow={workflow}
            incidentSeverity={incidentSeverity}
            onViewAttachment={handleViewAttachment}
            onDownloadAttachment={onDownloadAttachment}
            onCancelWorkflow={onCancelWorkflow}
            onPersonClick={onPersonClick}
            onStageClick={onStageClick}
          />
        ))}
      </AccordionPrimitive.Root>

      {/* Form Submission Viewer */}
      <FormSubmissionViewer
        open={isViewerOpen}
        onOpenChange={handleViewerClose}
        attachment={viewingAttachment}
        onDownload={onDownloadAttachment}
      />
    </>
  )
}

export default WorkflowsSection
