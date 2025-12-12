import * as React from 'react'
import { useState, useCallback } from 'react'
import { cn } from '../../lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../ui/dialog'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import type { Lead, LeadStatus } from './LeadCard'

// =============================================================================
// TYPES
// =============================================================================

export interface StatusUpdateDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** The lead being updated */
  lead: Lead
  /** Callback when status is updated */
  onStatusUpdate: (leadId: string, newStatus: LeadStatus, notes?: string) => void | Promise<void>
  /** Whether the update is in progress */
  isUpdating?: boolean
  /** Additional className */
  className?: string
}

// =============================================================================
// STATUS CONFIGURATION
// =============================================================================

const STATUS_OPTIONS: Array<{
  value: LeadStatus
  label: string
  description: string
  colorClass: string
}> = [
  {
    value: 'new',
    label: 'New',
    description: 'Lead just received, not yet contacted',
    colorClass: 'bg-info-light text-info border-info',
  },
  {
    value: 'contacted',
    label: 'Contacted',
    description: 'Initial contact made with the lead',
    colorClass: 'bg-warning-light text-warning border-warning',
  },
  {
    value: 'qualified',
    label: 'Qualified',
    description: 'Lead meets criteria and shows interest',
    colorClass: 'bg-accent-bg text-accent border-accent',
  },
  {
    value: 'converted',
    label: 'Converted',
    description: 'Lead successfully converted to customer',
    colorClass: 'bg-success-light text-success border-success',
  },
  {
    value: 'lost',
    label: 'Lost',
    description: 'Lead is no longer pursuing',
    colorClass: 'bg-error-light text-error border-error',
  },
]

// =============================================================================
// STATUS UPDATE DIALOG COMPONENT
// =============================================================================

/**
 * StatusUpdateDialog - Modal dialog for updating lead stage/status
 *
 * Features:
 * - Current status display with visual badge
 * - Status selector with descriptions
 * - Optional notes field for change reason
 * - Validation (prevents selecting same status)
 * - Lead context display
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false)
 * const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
 *
 * <StatusUpdateDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   lead={selectedLead}
 *   onStatusUpdate={(leadId, newStatus, notes) => {
 *     console.log('Updating lead status:', leadId, newStatus)
 *     setOpen(false)
 *   }}
 * />
 * ```
 */
export function StatusUpdateDialog({
  open,
  onOpenChange,
  lead,
  onStatusUpdate,
  isUpdating = false,
  className,
}: StatusUpdateDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus>(lead.status)
  const [notes, setNotes] = useState<string>('')
  const [error, setError] = useState<string>('')

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setSelectedStatus(lead.status)
      setNotes('')
      setError('')
    }
  }, [open, lead.status])

  // Reset form when dialog closes
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (!newOpen) {
      setError('')
    }
    onOpenChange(newOpen)
  }, [onOpenChange])

  // Handle status selection
  const handleStatusChange = useCallback((value: string) => {
    setSelectedStatus(value as LeadStatus)
    if (error) {
      setError('')
    }
  }, [error])

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation: prevent selecting same status
    if (selectedStatus === lead.status) {
      setError('Please select a different status')
      return
    }

    await onStatusUpdate(lead.id, selectedStatus, notes || undefined)
  }, [selectedStatus, notes, lead.id, lead.status, onStatusUpdate])

  const currentStatusOption = STATUS_OPTIONS.find(opt => opt.value === lead.status)
  const selectedStatusOption = STATUS_OPTIONS.find(opt => opt.value === selectedStatus)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={cn('sm:max-w-[520px]', className)}>
        <DialogHeader>
          <DialogTitle>Update Lead Status</DialogTitle>
          <DialogDescription>
            Change the status of this lead to track progress through your sales pipeline.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Lead Context */}
          <div className="p-4 bg-muted-bg rounded-lg border border-subtle">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-accent-strong text-inverse flex items-center justify-center font-semibold text-sm flex-shrink-0">
                {lead.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </div>

              {/* Lead Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-primary truncate">{lead.name}</p>
                <p className="text-sm text-secondary truncate">{lead.company}</p>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="flex flex-col gap-2">
            <Label className="text-primary">Current Status</Label>
            <div className="flex items-center gap-3 p-3 bg-surface border border-default rounded-lg">
              <span className={cn(
                'inline-flex px-3 py-1.5 text-sm font-semibold rounded border',
                currentStatusOption?.colorClass
              )}>
                {currentStatusOption?.label}
              </span>
              <p className="text-sm text-muted flex-1">
                {currentStatusOption?.description}
              </p>
            </div>
          </div>

          {/* New Status Selection */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="status" className="text-primary">
              New Status <span className="text-error">*</span>
            </Label>
            <Select
              value={selectedStatus}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger
                id="status"
                className={cn(
                  'w-full',
                  error && 'border-error focus:ring-error'
                )}
                aria-invalid={!!error}
                aria-describedby={error ? 'status-error' : undefined}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.value === lead.status}
                  >
                    <div className="flex items-center gap-2 py-1">
                      <span className={cn(
                        'inline-flex px-2 py-0.5 text-xs font-semibold rounded border',
                        option.colorClass
                      )}>
                        {option.label}
                      </span>
                      <span className="text-xs text-muted">
                        {option.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && (
              <p id="status-error" className="text-sm text-error">
                {error}
              </p>
            )}
            {selectedStatus !== lead.status && selectedStatusOption && (
              <div className="mt-2 p-3 bg-accent-bg border border-accent rounded-lg">
                <p className="text-sm text-primary">
                  <span className="font-semibold">Status will change to:</span>{' '}
                  {selectedStatusOption.label}
                </p>
                <p className="text-xs text-muted mt-1">
                  {selectedStatusOption.description}
                </p>
              </div>
            )}
          </div>

          {/* Status Change Notes */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes" className="text-primary">
              Notes <span className="text-muted font-normal">(Optional)</span>
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about why the status is changing..."
              rows={3}
            />
            <p className="text-xs text-muted">
              Document the reason for this status change for future reference.
            </p>
          </div>

          {/* Footer */}
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={isUpdating || selectedStatus === lead.status}
            >
              {isUpdating ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default StatusUpdateDialog
