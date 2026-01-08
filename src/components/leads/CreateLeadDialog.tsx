import * as React from 'react'
import { useState, useCallback } from 'react'
import { cn } from '../../lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import type { LeadPriority, LeadSource } from './LeadCard'
import {
  LEAD_VALIDATION,
  validateCompanyName,
  validateContactName,
  validateEmail,
  validatePhone,
  validateNotes,
} from './constants'

/** Form field placeholders */
const PLACEHOLDERS = {
  COMPANY_NAME: 'Enter company name',
  CONTACT_NAME: 'Enter contact name',
  CONTACT_EMAIL: 'Enter email address',
  CONTACT_PHONE: 'Enter phone number',
  NOTES: 'Add any additional notes about this lead...',
} as const

/** Partner type for assignment dropdown */
export interface Partner { id: string; name: string }

/** Form data for creating a lead */
export interface CreateLeadFormData {
  companyName: string
  contactName: string
  contactEmail: string
  contactPhone: string
  priority: LeadPriority
  source: LeadSource
  assignedPartnerId?: string
  notes: string
}

/** Props for CreateLeadDialog */
export interface CreateLeadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateLeadFormData) => void | Promise<void>
  partners?: Partner[]
  isSubmitting?: boolean
  className?: string
}

interface FormErrors {
  companyName?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  notes?: string
}

const initialFormData: CreateLeadFormData = {
  companyName: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  priority: 'medium',
  source: 'other',
  assignedPartnerId: undefined,
  notes: '',
}

interface FormFieldProps { id: string; label: string; required?: boolean; error?: string; children: React.ReactNode }

/** Form field wrapper with label and error display */
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

/** CreateLeadDialog - Modal dialog for creating a new lead with validation */
export function CreateLeadDialog({
  open,
  onOpenChange,
  onSubmit,
  partners: _partners = [],
  isSubmitting = false,
  className,
}: CreateLeadDialogProps) {
  const [formData, setFormData] = useState<CreateLeadFormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})

  // Refs for focusing first invalid field
  const companyNameRef = React.useRef<HTMLInputElement>(null)
  const contactNameRef = React.useRef<HTMLInputElement>(null)
  const contactEmailRef = React.useRef<HTMLInputElement>(null)

  // Reset form when dialog closes
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (!newOpen) {
      // Reset form state when closing
      setFormData(initialFormData)
      setErrors({})
    }
    onOpenChange(newOpen)
  }, [onOpenChange])

  // Validate all fields using individual validators
  const validateForm = useCallback((): FormErrors => {
    return {
      companyName: validateCompanyName(formData.companyName),
      contactName: validateContactName(formData.contactName),
      contactEmail: validateEmail(formData.contactEmail),
      contactPhone: validatePhone(formData.contactPhone),
      notes: validateNotes(formData.notes),
    }
  }, [formData])

  // Handle input change
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear error for this field when user types (after failed submit)
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

    // Check if any field has an error
    const hasErrors = Object.values(validationErrors).some(Boolean)
    if (hasErrors) {
      focusFirstInvalidField(validationErrors)
      return
    }

    await onSubmit(formData)
  }, [formData, validateForm, onSubmit])

  // Focus the first field that has an error
  const focusFirstInvalidField = (errors: FormErrors) => {
    if (errors.companyName) companyNameRef.current?.focus()
    else if (errors.contactName) contactNameRef.current?.focus()
    else if (errors.contactEmail) contactEmailRef.current?.focus()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={cn('sm:max-w-[520px]', className)}>
        <DialogHeader>
          <DialogTitle>Create New Lead</DialogTitle>
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
                placeholder={PLACEHOLDERS.COMPANY_NAME}
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
                placeholder={PLACEHOLDERS.CONTACT_NAME}
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
                placeholder={PLACEHOLDERS.CONTACT_EMAIL}
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
                placeholder={PLACEHOLDERS.CONTACT_PHONE}
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

          {/* Partner Assignment Section - HIDDEN PER MVP SPEC (Section 10)
           * "Assign to Partner: Hidden or disabled in MVP.
           * Field is reserved for future assignment logic.
           * Must not affect lead creation in MVP."
           *
           * TODO: Re-enable when assignment workflow is implemented post-MVP
           */}

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
              placeholder={PLACEHOLDERS.NOTES}
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
              {isSubmitting ? 'Creating...' : 'Create Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateLeadDialog
