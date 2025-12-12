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
import type { Lead } from './LeadCard'
import type { Partner } from './CreateLeadDialog'

// =============================================================================
// TYPES
// =============================================================================

export interface AssignLeadDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** The lead to assign */
  lead: Lead
  /** List of available partners */
  partners: Partner[]
  /** Callback when assignment is confirmed */
  onAssign: (leadId: string, partnerId: string, notes?: string) => void | Promise<void>
  /** Whether the assignment is in progress */
  isAssigning?: boolean
  /** Additional className */
  className?: string
}

// =============================================================================
// ASSIGN LEAD DIALOG COMPONENT
// =============================================================================

/**
 * AssignLeadDialog - Modal dialog for assigning a lead to a partner
 *
 * Features:
 * - Partner selection dropdown
 * - Optional notes field for assignment reason
 * - Lead context display (name and company)
 * - Form validation (partner selection required)
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false)
 * const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
 *
 * <AssignLeadDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   lead={selectedLead}
 *   partners={[
 *     { id: '1', name: 'Acme Partners' },
 *     { id: '2', name: 'Global Solutions' },
 *   ]}
 *   onAssign={(leadId, partnerId, notes) => {
 *     console.log('Assigning lead:', leadId, 'to partner:', partnerId)
 *     setOpen(false)
 *   }}
 * />
 * ```
 */
export function AssignLeadDialog({
  open,
  onOpenChange,
  lead,
  partners,
  onAssign,
  isAssigning = false,
  className,
}: AssignLeadDialogProps) {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [error, setError] = useState<string>('')

  // Reset form when dialog opens/closes
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (!newOpen) {
      setSelectedPartnerId('')
      setNotes('')
      setError('')
    }
    onOpenChange(newOpen)
  }, [onOpenChange])

  // Handle partner selection
  const handlePartnerChange = useCallback((value: string) => {
    setSelectedPartnerId(value)
    if (error) {
      setError('')
    }
  }, [error])

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!selectedPartnerId) {
      setError('Please select a partner')
      return
    }

    await onAssign(lead.id, selectedPartnerId, notes || undefined)
  }, [selectedPartnerId, notes, lead.id, onAssign])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={cn('sm:max-w-[480px]', className)}>
        <DialogHeader>
          <DialogTitle>Assign Lead to Partner</DialogTitle>
          <DialogDescription>
            Select a partner to assign this lead to. The partner will be notified of the assignment.
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
                <p className="text-sm text-muted truncate">{lead.email}</p>
              </div>
            </div>
          </div>

          {/* Partner Selection */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="partner" className="text-primary">
              Partner <span className="text-error">*</span>
            </Label>
            <Select
              value={selectedPartnerId}
              onValueChange={handlePartnerChange}
            >
              <SelectTrigger
                id="partner"
                className={cn(
                  'w-full',
                  error && 'border-error focus:ring-error'
                )}
                aria-invalid={!!error}
                aria-describedby={error ? 'partner-error' : undefined}
              >
                <SelectValue placeholder="Select a partner..." />
              </SelectTrigger>
              <SelectContent>
                {partners.length === 0 ? (
                  <div className="px-2 py-6 text-center text-sm text-secondary">
                    No partners available
                  </div>
                ) : (
                  partners.map((partner) => (
                    <SelectItem key={partner.id} value={partner.id}>
                      {partner.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {error && (
              <p id="partner-error" className="text-sm text-error">
                {error}
              </p>
            )}
            <p className="text-xs text-muted">
              The selected partner will receive a notification about this lead.
            </p>
          </div>

          {/* Assignment Notes */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes" className="text-primary">
              Assignment Notes <span className="text-muted font-normal">(Optional)</span>
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any context or instructions for the assigned partner..."
              rows={3}
            />
            <p className="text-xs text-muted">
              These notes will be visible to the assigned partner.
            </p>
          </div>

          {/* Footer */}
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isAssigning}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={isAssigning || partners.length === 0}
            >
              {isAssigning ? 'Assigning...' : 'Assign Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AssignLeadDialog
