/**
 * SubmitIncidentDialog - Confirmation dialog for submitting draft incidents
 *
 * @component MOLECULE
 *
 * @description
 * A success-oriented confirmation dialog for submitting draft incidents.
 * Shows incident preview and explains what happens after submission.
 * Transforms a draft into an active incident in the management workflow.
 *
 * UX Laws Applied:
 * - Feedback: Shows summary of what's being submitted
 * - Progressive Disclosure: Explains workflow after submission
 * - Fitts' Law: Primary action button is prominent and accessible
 *
 * @example
 * ```tsx
 * <SubmitIncidentDialog
 *   open={submitDialogOpen}
 *   onOpenChange={setSubmitDialogOpen}
 *   incident={incidentToSubmit}
 *   onConfirm={handleSubmitConfirm}
 *   isSubmitting={isSubmitting}
 * />
 * ```
 */

import * as React from 'react'
import { Rocket, CheckCircle2 } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog'
import { DataTableSeverity } from '../ui/table/DataTableSeverity'
import type { IncidentSeverity } from '../ui/table/IncidentStatusBadge'

// =============================================================================
// TYPES
// =============================================================================

export interface IncidentToSubmit {
  /** Unique identifier */
  id: string
  /** Display ID (e.g., INC-000001) */
  incidentId: string
  /** Incident title */
  title: string
  /** Location where incident occurred */
  location: string
  /** Person who reported the incident */
  reporter: string
  /** Severity level */
  severity: IncidentSeverity
  /** Category of incident */
  category?: string
}

export interface SubmitIncidentDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Incident to submit */
  incident: IncidentToSubmit | null
  /** Callback when submission is confirmed */
  onConfirm: (incident: IncidentToSubmit) => void | Promise<void>
  /** Whether the submission is currently in progress */
  isSubmitting?: boolean
}

// =============================================================================
// CONSTANTS
// =============================================================================

const SEVERITY_MAP = {
  critical: { level: 'critical' as const, label: 'Critical' },
  high: { level: 'high' as const, label: 'High' },
  medium: { level: 'medium' as const, label: 'Medium' },
  low: { level: 'low' as const, label: 'Low' },
  none: { level: 'none' as const, label: 'None' },
}

const WORKFLOW_STEPS = [
  'Incident enters active investigation queue',
  'Assigned investigator notified',
  'Reporter receives confirmation email',
  'Audit trail begins tracking',
]

// =============================================================================
// COMPONENT
// =============================================================================

export function SubmitIncidentDialog({
  open,
  onOpenChange,
  incident,
  onConfirm,
  isSubmitting = false,
}: SubmitIncidentDialogProps) {
  const handleConfirm = async () => {
    if (incident) {
      await onConfirm(incident)
    }
  }

  if (!incident) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-light">
              <Rocket className="h-5 w-5 text-success" />
            </div>
            <DialogTitle className="text-lg font-semibold text-primary">
              Submit Incident Report
            </DialogTitle>
          </div>
          <DialogDescription className="pt-3 text-sm text-muted">
            You're about to submit{' '}
            <span className="font-medium text-primary">{incident.incidentId}</span>
            {' '}for investigation. Please review the details below.
          </DialogDescription>
        </DialogHeader>

        {/* Incident summary */}
        <div className="rounded-lg border border-default bg-muted-bg/50 p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted">ID</span>
            <span className="text-primary font-mono font-medium">{incident.incidentId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Title</span>
            <span className="text-primary font-medium truncate max-w-[200px]">
              {incident.title}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Location</span>
            <span className="text-primary">{incident.location}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Reporter</span>
            <span className="text-primary">{incident.reporter}</span>
          </div>
          {incident.category && (
            <div className="flex justify-between text-sm">
              <span className="text-muted">Category</span>
              <span className="text-primary capitalize">{incident.category.replace('_', ' ')}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted">Severity</span>
            <DataTableSeverity
              value={incident.severity}
              mapping={SEVERITY_MAP}
              size="sm"
              showLabel
            />
          </div>
        </div>

        {/* What happens next */}
        <div className="rounded-lg border border-success bg-success-light/30 p-4">
          <p className="text-sm font-medium text-success mb-2">What happens next:</p>
          <ul className="space-y-1.5">
            {WORKFLOW_STEPS.map((step) => (
              <li key={step} className="flex items-start gap-2 text-sm text-primary">
                <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="accent"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Submitting...'
            ) : (
              <>
                <Rocket className="h-4 w-4" />
                Submit Report
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

SubmitIncidentDialog.displayName = 'SubmitIncidentDialog'

export default SubmitIncidentDialog
