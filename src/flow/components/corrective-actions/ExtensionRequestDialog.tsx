/**
 * ExtensionRequestDialog
 *
 * Dialog for requesting a due date extension on a corrective action.
 * Captures new requested date and justification.
 */

import { useState } from 'react'
import { Calendar } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatDate } from './helpers'
import type { CorrectiveAction } from './types'
import { cn } from '@/lib/utils'

export interface ExtensionRequestDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Handler for open state changes */
  onOpenChange: (open: boolean) => void
  /** The corrective action to request extension for */
  action: CorrectiveAction
  /** Submit handler */
  onSubmit: (data: ExtensionRequestData) => void | Promise<void>
  /** Loading state */
  isLoading?: boolean
}

export interface ExtensionRequestData {
  actionId: string
  requestedDueDate: string
  justification: string
}

export function ExtensionRequestDialog({
  open,
  onOpenChange,
  action,
  onSubmit,
  isLoading = false,
}: ExtensionRequestDialogProps) {
  const [requestedDate, setRequestedDate] = useState('')
  const [justification, setJustification] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!requestedDate) {
      setError('Please select a new due date')
      return
    }

    const newDate = new Date(requestedDate)
    const currentDue = new Date(action.dueDate)
    if (newDate <= currentDue) {
      setError('New due date must be after the current due date')
      return
    }

    if (!justification.trim()) {
      setError('Please provide a justification for the extension')
      return
    }

    try {
      await onSubmit({
        actionId: action.id,
        requestedDueDate: requestedDate,
        justification: justification.trim(),
      })
      // Reset form
      setRequestedDate('')
      setJustification('')
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request')
    }
  }

  const handleCancel = () => {
    setRequestedDate('')
    setJustification('')
    setError(null)
    onOpenChange(false)
  }

  // Format current due date for display and min date for input
  const currentDueDate = new Date(action.dueDate)
  const minDate = new Date(currentDueDate)
  minDate.setDate(minDate.getDate() + 1)
  const minDateString = minDate.toISOString().split('T')[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Extension</DialogTitle>
          <DialogDescription>
            Request a new due date for action{' '}
            <span className="font-mono text-primary">
              {action.referenceNumber}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current due date info */}
          <div className="rounded-lg bg-muted-bg p-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-secondary" />
              <span className="text-secondary">Current due date:</span>
              <span className="font-medium text-primary">
                {formatDate(action.dueDate)}
              </span>
            </div>
          </div>

          {/* New due date */}
          <div className="space-y-2">
            <Label htmlFor="requestedDate">New Due Date *</Label>
            <Input
              id="requestedDate"
              type="date"
              value={requestedDate}
              onChange={(e) => setRequestedDate(e.target.value)}
              min={minDateString}
              required
              disabled={isLoading}
            />
          </div>

          {/* Justification */}
          <div className="space-y-2">
            <Label htmlFor="justification">Justification *</Label>
            <Textarea
              id="justification"
              placeholder="Explain why an extension is needed..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={4}
              required
              disabled={isLoading}
            />
            <p className="text-xs text-tertiary">
              Provide a clear explanation for the extension request
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
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ExtensionRequestDialog
