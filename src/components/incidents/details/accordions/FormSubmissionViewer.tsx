/**
 * FormSubmissionViewer - Read-only view of submitted form data
 *
 * Displays form submission data in a clean, organized format with:
 * - Section headers with collapsible content
 * - Field type-specific rendering (text, date, checkbox, file, etc.)
 * - Submission metadata (who, when, approval status)
 * - Mobile-responsive sheet/dialog presentation
 *
 * @example
 * ```tsx
 * <FormSubmissionViewer
 *   open={isViewerOpen}
 *   onOpenChange={setIsViewerOpen}
 *   attachment={selectedAttachment}
 * />
 * ```
 */

import * as React from 'react'
import { useState, useEffect } from 'react'
import {
  X,
  User,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Check,
  CheckSquare,
  Star,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Download,
  ExternalLink,
  ChevronDown,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../../ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../../../ui/sheet'
import { Badge } from '../../../ui/badge'
import type {
  WorkflowStepAttachment,
  FormSubmissionData,
  FormField,
  FormSection,
  FormFieldType,
} from '../types'

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Simple media query hook for responsive rendering
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

// =============================================================================
// TYPES
// =============================================================================

export interface FormSubmissionViewerProps {
  /** Whether the viewer is open */
  open: boolean
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void
  /** The attachment to view */
  attachment: WorkflowStepAttachment | null
  /** Optional callback when download is clicked */
  onDownload?: (attachment: WorkflowStepAttachment) => void
  /** Additional className */
  className?: string
}

// =============================================================================
// CONSTANTS
// =============================================================================

const APPROVAL_STATUS_CONFIG = {
  pending: {
    label: 'Pending Review',
    icon: Clock,
    className: 'bg-warning/10 text-warning-dark dark:text-warning border-warning/30',
  },
  approved: {
    label: 'Approved',
    icon: CheckCircle2,
    className: 'bg-success/10 text-success border-success/30',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    className: 'bg-error/10 text-error border-error/30',
  },
  revision_requested: {
    label: 'Revision Requested',
    icon: RotateCcw,
    className: 'bg-warning/10 text-warning-dark dark:text-warning border-warning/30',
  },
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  return (
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) +
    ' at ' +
    date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  )
}

// =============================================================================
// FIELD RENDERERS
// =============================================================================

/**
 * Get the appropriate icon for a field type
 */
function FieldTypeIcon({ type }: { type: FormFieldType }) {
  const iconClass = 'size-4 text-tertiary flex-shrink-0'

  switch (type) {
    case 'date':
    case 'datetime':
      return <Calendar className={iconClass} />
    case 'time':
      return <Clock className={iconClass} />
    case 'location':
      return <MapPin className={iconClass} />
    case 'file':
      return <FileText className={iconClass} />
    case 'person':
      return <User className={iconClass} />
    case 'checkbox':
      return <CheckSquare className={iconClass} />
    case 'rating':
      return <Star className={iconClass} />
    default:
      return null
  }
}

/**
 * Render a single field value based on type
 */
function FieldValue({ field }: { field: FormField }) {
  const { type, value, displayValue, metadata } = field

  // Use displayValue if available, otherwise format based on type
  if (displayValue) {
    return <span className="text-primary">{displayValue}</span>
  }

  // Handle null/empty values
  if (value === null || value === undefined || value === '') {
    return <span className="text-tertiary italic">Not provided</span>
  }

  // Type-specific rendering
  switch (type) {
    case 'checkbox':
      return (
        <span className="flex items-center gap-1.5">
          {value ? (
            <>
              <Check className="size-4 text-success" />
              <span className="text-primary">Yes</span>
            </>
          ) : (
            <>
              <X className="size-4 text-tertiary" />
              <span className="text-secondary">No</span>
            </>
          )}
        </span>
      )

    case 'multiselect':
      if (Array.isArray(value)) {
        return (
          <div className="flex flex-wrap gap-1.5">
            {value.map((v, i) => (
              <Badge key={i} variant="secondary" size="sm">
                {v}
              </Badge>
            ))}
          </div>
        )
      }
      return <span className="text-primary">{String(value)}</span>

    case 'rating':
      const rating = Number(value)
      const maxRating = (metadata?.maxRating as number) || 5
      return (
        <span className="flex items-center gap-0.5">
          {Array.from({ length: maxRating }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                'size-4',
                i < rating ? 'text-warning fill-warning' : 'text-muted-bg'
              )}
            />
          ))}
          <span className="text-secondary ml-1.5">({rating}/{maxRating})</span>
        </span>
      )

    case 'file':
      const fileName = metadata?.fileName as string || String(value)
      const fileUrl = metadata?.url as string
      return (
        <span className="flex items-center gap-2">
          <FileText className="size-4 text-accent" />
          {fileUrl ? (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link hover:text-link-hover hover:underline"
            >
              {fileName}
              <ExternalLink className="size-3 inline ml-1" />
            </a>
          ) : (
            <span className="text-primary">{fileName}</span>
          )}
        </span>
      )

    case 'location':
      const address = metadata?.address as string
      const coords = metadata?.coordinates as { lat: number; lng: number }
      return (
        <div className="space-y-0.5">
          <span className="text-primary">{String(value)}</span>
          {address && <p className="text-xs text-secondary">{address}</p>}
          {coords && (
            <p className="text-xs text-tertiary">
              {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
            </p>
          )}
        </div>
      )

    case 'person':
      return (
        <span className="flex items-center gap-1.5">
          <User className="size-4 text-accent" />
          <span className="text-link">{String(value)}</span>
        </span>
      )

    case 'date':
      return <span className="text-primary">{formatDate(String(value))}</span>

    case 'datetime':
      return <span className="text-primary">{formatDateTime(String(value))}</span>

    case 'textarea':
      return (
        <p className="text-primary whitespace-pre-wrap bg-muted-bg/50 rounded-lg p-3 text-sm">
          {String(value)}
        </p>
      )

    case 'signature':
      const sigUrl = metadata?.signatureUrl as string
      if (sigUrl) {
        return (
          <div className="bg-white rounded-lg border border-default p-2 inline-block">
            <img src={sigUrl} alt="Signature" className="h-12 object-contain" />
          </div>
        )
      }
      return <span className="text-primary italic">Signed</span>

    default:
      return <span className="text-primary">{String(value)}</span>
  }
}

/**
 * Single field row
 */
function FieldRow({ field }: { field: FormField }) {
  return (
    <div className="py-3 border-b border-default last:border-b-0">
      <div className="flex items-start gap-2 mb-1">
        <FieldTypeIcon type={field.type} />
        <span className="text-sm font-medium text-secondary flex-1">
          {field.label}
          {field.required && <span className="text-error ml-0.5">*</span>}
        </span>
      </div>
      <div className="pl-6 sm:pl-0 sm:mt-1">
        <FieldValue field={field} />
      </div>
    </div>
  )
}

/**
 * Collapsible section
 */
function SectionBlock({ section, defaultExpanded = true }: { section: FormSection; defaultExpanded?: boolean }) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

  return (
    <div className="border border-default rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-3 bg-muted-bg/50 hover:bg-muted-bg transition-colors text-left"
      >
        <ChevronDown
          className={cn(
            'size-5 text-tertiary transition-transform duration-200',
            isExpanded && 'rotate-180'
          )}
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-primary">{section.title}</h4>
          {section.description && (
            <p className="text-xs text-secondary mt-0.5 truncate">{section.description}</p>
          )}
        </div>
        <span className="text-xs text-tertiary">{section.fields.length} fields</span>
      </button>

      {isExpanded && (
        <div className="px-3 sm:px-4 divide-y divide-default">
          {section.fields.map((field) => (
            <FieldRow key={field.id} field={field} />
          ))}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// MAIN CONTENT COMPONENT
// =============================================================================

function FormViewerContent({
  formData,
  attachment,
  onDownload,
}: {
  formData: FormSubmissionData
  attachment: WorkflowStepAttachment
  onDownload?: (attachment: WorkflowStepAttachment) => void
}) {
  const approvalConfig = formData.approvalStatus
    ? APPROVAL_STATUS_CONFIG[formData.approvalStatus]
    : null

  return (
    <div className="space-y-3">
      {/* Submission metadata */}
      <div className="bg-muted-bg/50 rounded-lg p-3 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <User className="size-4 text-tertiary" />
            <span className="text-sm text-secondary">Submitted by</span>
            <span className="text-sm font-medium text-primary">{formData.submittedBy.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary">
            <Calendar className="size-4 text-tertiary" />
            {formatDateTime(formData.submittedAt)}
          </div>
        </div>

        {/* Approval status */}
        {approvalConfig && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-default">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border w-fit',
                approvalConfig.className
              )}
            >
              <approvalConfig.icon className="size-3.5" />
              {approvalConfig.label}
            </span>
            {formData.reviewedBy && (
              <span className="text-xs text-secondary">
                by {formData.reviewedBy.name}
                {formData.reviewedAt && ` on ${formatDate(formData.reviewedAt)}`}
              </span>
            )}
          </div>
        )}

        {/* Review notes */}
        {formData.reviewNotes && (
          <div className="pt-2 border-t border-default">
            <p className="text-xs text-secondary mb-1">Review Notes:</p>
            <p className="text-sm text-primary bg-surface rounded p-2">{formData.reviewNotes}</p>
          </div>
        )}
      </div>

      {/* Form sections */}
      <div className="space-y-3">
        {formData.sections.map((section, index) => (
          <SectionBlock
            key={section.id}
            section={section}
            defaultExpanded={index === 0}
          />
        ))}
      </div>

      {/* Download button */}
      {onDownload && (
        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => onDownload(attachment)}
          >
            <Download className="size-4 mr-2" />
            Download Form PDF
          </Button>
        </div>
      )}
    </div>
  )
}

/**
 * Empty state when no form data available
 */
function EmptyFormState({ attachment }: { attachment: WorkflowStepAttachment }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="size-12 text-tertiary mb-4" />
      <h4 className="text-lg font-medium text-primary mb-2">Form Data Unavailable</h4>
      <p className="text-sm text-secondary max-w-sm mb-4">
        The form submission data for "{attachment.name}" is not available for preview.
      </p>
      {attachment.url && (
        <Button variant="outline" asChild>
          <a href={attachment.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-4 mr-2" />
            Open in New Tab
          </a>
        </Button>
      )}
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function FormSubmissionViewer({
  open,
  onOpenChange,
  attachment,
  onDownload,
  className,
}: FormSubmissionViewerProps) {
  const isMobile = useMediaQuery('(max-width: 640px)')

  // Don't render if no attachment
  if (!attachment) return null

  const formData = attachment.formData
  const title = formData?.formName || attachment.name

  const content = formData ? (
    <FormViewerContent
      formData={formData}
      attachment={attachment}
      onDownload={onDownload}
    />
  ) : (
    <EmptyFormState attachment={attachment} />
  )

  // Mobile: use Sheet
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className={cn('h-[85vh] flex flex-col', className)}>
          <SheetHeader className="text-left border-b border-default flex-shrink-0 -mx-6 px-6 pb-3">
            <SheetTitle className="flex items-center gap-2">
              <FileText className="size-5 text-accent" />
              <span className="truncate">{title}</span>
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto pt-3 pb-4 -mx-6 px-6">
            {content}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop: use Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('max-w-2xl max-h-[85vh] flex flex-col !gap-0', className)}>
        <DialogHeader className="border-b border-default flex-shrink-0 -mx-6 px-6 pb-3 -mt-1">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-5 text-accent" />
            <span className="truncate">{title}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pt-3 pb-2 -mb-2">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FormSubmissionViewer
