import * as React from 'react'
import { useState, useCallback, useEffect } from 'react'
import { cn } from '../../lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import type { Lead } from './LeadCard'
import type { CreateLeadFormData, Partner } from './CreateLeadDialog'
import { LEAD_VALIDATION, validateCompanyName, validateContactName, validateEmail, validatePhone, validateNotes } from './constants'

// =============================================================================
// TYPES
// =============================================================================

interface FormErrors {
  companyName?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  notes?: string
}

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

// =============================================================================
// FORM FIELD SUB-COMPONENT
// =============================================================================

interface FormFieldProps {
  id: string
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}

function FormField({ id, label, required, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-primary">
        {label} {required && <span className="text-error">*</span>}
      </Label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  )
}

// =============================================================================
// EDIT LEAD DIALOG COMPONENT
// =============================================================================

/**
 * EditLeadDialog - Modal dialog for editing an existing lead
 *
 * Features: Pre-populated form, required field validation (Company, Contact, Email),
 * priority/source dropdowns, optional partner assignment, notes textarea.
 *
 * @example
 * <EditLeadDialog open={open} onOpenChange={setOpen} lead={selectedLead}
 *   onSubmit={(leadId, data) => handleUpdate(leadId, data)} partners={partners} />
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
    const companyNameError = validateCompanyName(formData.companyName)
    const contactNameError = validateContactName(formData.contactName)
    const contactEmailError = validateEmail(formData.contactEmail)
    const contactPhoneError = validatePhone(formData.contactPhone)
    const notesError = validateNotes(formData.notes)

    return {
      ...(companyNameError && { companyName: companyNameError }),
      ...(contactNameError && { contactName: contactNameError }),
      ...(contactEmailError && { contactEmail: contactEmailError }),
      ...(contactPhoneError && { contactPhone: contactPhoneError }),
      ...(notesError && { notes: notesError }),
    }
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
            <FormField id="companyName" label="Company Name" required error={errors.companyName}>
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
            </FormField>

            {/* Contact Name */}
            <FormField id="contactName" label="Contact Name" required error={errors.contactName}>
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
            </FormField>

            {/* Contact Email */}
            <FormField id="contactEmail" label="Contact Email" required error={errors.contactEmail}>
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
            </FormField>

            {/* Contact Phone */}
            <FormField id="contactPhone" label="Contact Phone" error={errors.contactPhone}>
              <Input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="Enter phone number"
                aria-invalid={!!errors.contactPhone}
                aria-describedby={errors.contactPhone ? 'contactPhone-error' : undefined}
              />
            </FormField>

            {/* Priority and Source Row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField id="priority" label="Priority">
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
              </FormField>

              <FormField id="source" label="Lead Source">
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
              </FormField>
            </div>
          </div>

          {/* Partner Assignment Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-primary">
              Partner Assignment <span className="text-muted font-normal">(Optional)</span>
            </h3>

            <FormField id="assignedPartnerId" label="Assign to Partner">
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
            </FormField>
          </div>

          {/* Notes Section */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="notes" className="text-primary">
                Notes
              </Label>
              <span className={cn(
                "text-xs",
                formData.notes.length > LEAD_VALIDATION.NOTES_MAX ? "text-error" : "text-muted"
              )}>
                {formData.notes.length}/{LEAD_VALIDATION.NOTES_MAX}
              </span>
            </div>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes about this lead..."
              rows={3}
              aria-invalid={!!errors.notes}
              aria-describedby={errors.notes ? 'notes-error' : undefined}
            />
            {errors.notes && (
              <p id="notes-error" className="text-sm text-error">
                {errors.notes}
              </p>
            )}
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
