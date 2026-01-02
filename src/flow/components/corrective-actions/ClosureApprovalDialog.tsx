/**
 * ClosureApprovalDialog
 *
 * Dialog for approving or rejecting the closure of a corrective action.
 * Used by managers/approvers to finalize completed actions.
 */

import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  EFFECTIVENESS_CONFIG,
  formatDate,
  getUserDisplayName,
} from './helpers'
import type { CorrectiveAction } from './types'

export interface ClosureApprovalDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Handler for open state changes */
  onOpenChange: (open: boolean) => void
  /** The corrective action to approve/reject */
  action: CorrectiveAction
  /** Approval handler */
  onApprove: (data: ClosureApprovalData) => void | Promise<void>
  /** Rejection handler */
  onReject: (data: ClosureRejectionData) => void | Promise<void>
  /** Loading state */
  isLoading?: boolean
}

export interface ClosureApprovalData {
  actionId: string
  comments: string
}

export interface ClosureRejectionData {
  actionId: string
  reason: string
}

export function ClosureApprovalDialog({
  open,
  onOpenChange,
  action,
  onApprove,
  onReject,
  isLoading = false,
}: ClosureApprovalDialogProps) {
  const [comments, setComments] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [mode, setMode] = useState<'review' | 'reject'>('review')
  const [error, setError] = useState<string | null>(null)

  const handleApprove = async () => {
    setError(null)
    try {
      await onApprove({
        actionId: action.id,
        comments: comments.trim(),
      })
      setComments('')
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve closure')
    }
  }

  const handleReject = async () => {
    setError(null)
    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejection')
      return
    }
    try {
      await onReject({
        actionId: action.id,
        reason: rejectionReason.trim(),
      })
      setRejectionReason('')
      setMode('review')
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject closure')
    }
  }

  const handleCancel = () => {
    setComments('')
    setRejectionReason('')
    setMode('review')
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === 'review' ? 'Review Closure Request' : 'Reject Closure'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'review'
              ? `Review and approve closure for ${action.referenceNumber}`
              : `Provide reason for rejecting closure of ${action.referenceNumber}`}
          </DialogDescription>
        </DialogHeader>

        {mode === 'review' ? (
          <div className="space-y-4">
            {/* Action summary */}
            <div className="rounded-lg bg-muted-bg p-4 space-y-3">
              <h4 className="font-medium text-primary">{action.title}</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-secondary">Completed:</span>{' '}
                  <span className="text-primary">
                    {formatDate(action.completedDate)}
                  </span>
                </div>
                <div>
                  <span className="text-secondary">Owner:</span>{' '}
                  <span className="text-primary">
                    {getUserDisplayName(action.actionOwner)}
                  </span>
                </div>
              </div>
              {action.effectivenessAssessment && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary">Effectiveness:</span>
                  <Badge
                    variant={
                      EFFECTIVENESS_CONFIG[action.effectivenessAssessment]
                        .variant
                    }
                  >
                    {
                      EFFECTIVENESS_CONFIG[action.effectivenessAssessment]
                        .label
                    }
                  </Badge>
                </div>
              )}
            </div>

            {/* Completion notes */}
            {action.completionNotes && (
              <div>
                <Label className="text-sm text-secondary">Completion Notes</Label>
                <div className="mt-1 rounded bg-surface border border-default p-3 text-sm">
                  {action.completionNotes}
                </div>
              </div>
            )}

            {/* Evidence summary */}
            {action.completionEvidence && action.completionEvidence.length > 0 && (
              <div>
                <Label className="text-sm text-secondary">
                  Evidence ({action.completionEvidence.length} files)
                </Label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {action.completionEvidence.map((file) => (
                    <a
                      key={file.id}
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent hover:underline"
                    >
                      {file.fileName}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Approval comments */}
            <div className="space-y-2">
              <Label htmlFor="comments">Approval Comments (Optional)</Label>
              <Textarea
                id="comments"
                placeholder="Add any comments about the closure..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                disabled={isLoading}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="rounded-lg bg-error/10 border border-error/20 p-3 text-sm text-error">
                {error}
              </div>
            )}

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setMode('reject')}
                disabled={isLoading}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                type="button"
                onClick={handleApprove}
                disabled={isLoading}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isLoading ? 'Approving...' : 'Approve Closure'}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Rejection reason */}
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">Reason for Rejection *</Label>
              <Textarea
                id="rejectionReason"
                placeholder="Explain why the closure is being rejected and what needs to be addressed..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-tertiary">
                This will be sent to the action owner
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="rounded-lg bg-error/10 border border-error/20 p-3 text-sm text-error">
                {error}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setMode('review')
                  setError(null)
                }}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleReject}
                disabled={isLoading}
              >
                {isLoading ? 'Rejecting...' : 'Confirm Rejection'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ClosureApprovalDialog
