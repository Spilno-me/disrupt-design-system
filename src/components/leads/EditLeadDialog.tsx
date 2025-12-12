import * as React from 'react'
import { useState, useCallback, useEffect } from 'react'
import { cn } from '../../lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import type { Lead } from './LeadCard'
import type { CreateLeadFormData, Partner } from './CreateLeadDialog'

// =============================================================================
// TYPES
// =============================================================================

export interface EditLeadDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** The lead to edit (pre-populates form) */
  lead: Lead
  /** Callback when form is submitted successfully */
  onSubmit: (leadId: string, data: CreateLeadFormData) => void | Promise<void>
  /** List of available partners for assignment */
  partners?: Partner[]
  /** Whether the form is in a submitting state */
  isSubmitting?: boolean
  /** Additional className for the dialog */
  className?: string
}

interface FormErrors {
  companyName?: string
  contactName?: string
  contactEmail?: string
}

// =============================================================================
// EDIT LEAD DIALOG COMPONENT
// =============================================================================

/**
 * EditLeadDialog - Modal dialog for editing an existing lead
 *
 * Features:
 * - Pre-populated form with lead data
 * - Required field validation (Company Name, Contact Name, Contact Email)
 * - Email format validation
 * - Priority and Source dropdowns
 * - Optional Partner assignment
 * - Notes textarea
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false)
 * const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
 *
 * <EditLeadDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   lead={selectedLead}
 *   onSubmit={(leadId, data) => {
 *     console.log('Updating lead:', leadId, data)
 *     setOpen(false)
 *   }}
 *   partners={[
 *     { id: '1', name: 'Acme Partners' },
 *     { id: '2', name: 'Global Solutions' },
 *   ]}
 * />
 * ```
 */
export function EditLeadDialog({
  open,
  onOpenChange,
  lead,
  onSubmit,
  partners = [],
  isSubmitting = false,
  className,
}: EditLeadDialogProps) {
  const [formData, setFormData] = useState<CreateLeadFormData>({
    companyName: lead.company,
    contactName: lead.name,
    contactEmail: lead.email,
    contactPhone: lead.phone || '',
    priority: lead.priority,
    source: lead.source,
    assignedPartnerId: undefined,
    notes: lead.description || '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  // Refs for focusing first invalid field
  const companyNameRef = React.useRef<HTMLInputElement>(null)
  const contactNameRef = React.useRef<HTMLInputElement>(null)
  const contactEmailRef = React.useRef<HTMLInputElement>(null)

  // Update form when lead changes
  useEffect(() => {
    if (open) {
      setFormData({
        companyName: lead.company,
        contactName: lead.name,
        contactEmail: lead.email,
        contactPhone: lead.phone || '',
        priority: lead.priority,
        source: lead.source,
        assignedPartnerId: undefined,
        notes: lead.description || '',
      })
      setErrors({})
    }
  }, [open, lead])

  // Reset form when dialog closes
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (!newOpen) {
      setErrors({})
    }
    onOpenChange(newOpen)
  }, [onOpenChange])

  // Validate all required fields and return errors
  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {}

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required'
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact name is required'
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address'
    }

    return newErrors
  }, [formData])

  // Handle input change
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear error for this field when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }, [errors])

  // Handle select change
  const handleSelectChange = useCallback((name: string, value: string) => {
    if (name === 'assignedPartnerId' && value === 'none') {
      setFormData(prev => ({ ...prev, [name]: undefined }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }, [])

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validateForm()
    setErrors(validationErrors)

    // If there are errors, focus the first invalid field
    if (Object.keys(validationErrors).length > 0) {
      if (validationErrors.companyName) {
        companyNameRef.current?.focus()
      } else if (validationErrors.contactName) {
        contactNameRef.current?.focus()
      } else if (validationErrors.contactEmail) {
        contactEmailRef.current?.focus()
      }
      return
    }

    await onSubmit(lead.id, formData)
  }, [formData, validateForm, onSubmit, lead.id])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={cn('sm:max-w-[520px]', className)}>
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>
          <DialogDescription>
            Update the lead information below. All changes will be saved to the system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Lead Information Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-primary">Lead Information</h3>

            {/* Company Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="companyName" className="text-primary">
                Company Name <span className="text-error">*</span>
              </Label>
              <Input
                ref={companyNameRef}
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
                aria-invalid={!!errors.companyName}
                aria-describedby={errors.companyName ? 'companyName-error' : undefined}
              />
              {errors.companyName && (
                <p id="companyName-error" className="text-sm text-error">
                  {errors.companyName}
                </p>
              )}
            </div>

            {/* Contact Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contactName" className="text-primary">
                Contact Name <span className="text-error">*</span>
              </Label>
              <Input
                ref={contactNameRef}
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="Enter contact name"
                aria-invalid={!!errors.contactName}
                aria-describedby={errors.contactName ? 'contactName-error' : undefined}
              />
              {errors.contactName && (
                <p id="contactName-error" className="text-sm text-error">
                  {errors.contactName}
                </p>
              )}
            </div>

            {/* Contact Email */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contactEmail" className="text-primary">
                Contact Email <span className="text-error">*</span>
              </Label>
              <Input
                ref={contactEmailRef}
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="Enter email address"
                aria-invalid={!!errors.contactEmail}
                aria-describedby={errors.contactEmail ? 'contactEmail-error' : undefined}
              />
              {errors.contactEmail && (
                <p id="contactEmail-error" className="text-sm text-error">
                  {errors.contactEmail}
                </p>
              )}
            </div>

            {/* Contact Phone */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contactPhone" className="text-primary">
                Contact Phone
              </Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            {/* Priority and Source Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="priority" className="text-primary">
                  Priority
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleSelectChange('priority', value)}
                >
                  <SelectTrigger id="priority" className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Lead Source */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="source" className="text-primary">
                  Lead Source
                </Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) => handleSelectChange('source', value)}
                >
                  <SelectTrigger id="source" className="w-full">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="cold_outreach">Cold Outreach</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Partner Assignment Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-primary">
              Partner Assignment <span className="text-muted font-normal">(Optional)</span>
            </h3>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="assignedPartnerId" className="text-primary">
                Assign to Partner
              </Label>
              <Select
                value={formData.assignedPartnerId ?? 'none'}
                onValueChange={(value) => handleSelectChange('assignedPartnerId', value)}
              >
                <SelectTrigger id="assignedPartnerId" className="w-full">
                  <SelectValue placeholder="Select partner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No partner assigned</SelectItem>
                  {partners.map((partner) => (
                    <SelectItem key={partner.id} value={partner.id}>
                      {partner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes Section */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes" className="text-primary">
              Notes
            </Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes about this lead..."
              rows={3}
            />
          </div>

          {/* Footer */}
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditLeadDialog
