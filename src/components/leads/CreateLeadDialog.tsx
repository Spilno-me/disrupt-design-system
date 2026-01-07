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

// =============================================================================
// TYPES
// =============================================================================

export interface Partner {
  /** Unique identifier */
  id: string
  /** Partner name */
  name: string
}

export interface CreateLeadFormData {
  /** Company name (required) */
  companyName: string
  /** Contact name (required) */
  contactName: string
  /** Contact email (required) */
  contactEmail: string
  /** Contact phone (optional) */
  contactPhone: string
  /** Lead priority */
  priority: LeadPriority
  /** Lead source */
  source: LeadSource
  /** Assigned partner ID (optional) */
  assignedPartnerId?: string
  /** Notes (optional) */
  notes: string
}

export interface CreateLeadDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Callback when form is submitted successfully */
  onSubmit: (data: CreateLeadFormData) => void | Promise<void>
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
  contactPhone?: string
  notes?: string
}

// =============================================================================
// INITIAL STATE
// =============================================================================

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

// =============================================================================
// CREATE LEAD DIALOG COMPONENT
// =============================================================================

/**
 * CreateLeadDialog - Modal dialog for creating a new lead
 *
 * Features:
 * - Required field validation (Company Name, Contact Name, Contact Email)
 * - Email format validation
 * - Priority and Source dropdowns
 * - Optional Partner assignment
 * - Notes textarea
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false)
 *
 * <CreateLeadDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   onSubmit={(data) => {
 *     console.log('Creating lead:', data)
 *     setOpen(false)
 *   }}
 *   partners={[
 *     { id: '1', name: 'Acme Partners' },
 *     { id: '2', name: 'Global Solutions' },
 *   ]}
 * />
 * ```
 */
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

  // Validate all required fields and return errors
  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {}

    // Company name: 2-150 chars
    const companyTrimmed = formData.companyName.trim()
    if (!companyTrimmed) {
      newErrors.companyName = 'Company name is required.'
    } else if (companyTrimmed.length < 2) {
      newErrors.companyName = 'Company name must be at least 2 characters.'
    } else if (companyTrimmed.length > 150) {
      newErrors.companyName = 'Company name must be 150 characters or less.'
    }

    // Contact name: must have 2+ words (first + last)
    const nameTrimmed = formData.contactName.trim()
    if (!nameTrimmed) {
      newErrors.contactName = 'Contact name is required.'
    } else {
      const words = nameTrimmed.split(/\s+/).filter(w => w.length > 0)
      if (words.length < 2) {
        newErrors.contactName = 'Enter first and last name (e.g., John Smith).'
      }
    }

    // Email: required, valid format, max 254
    const emailTrimmed = formData.contactEmail.trim()
    if (!emailTrimmed) {
      newErrors.contactEmail = 'Email is required.'
    } else if (emailTrimmed.length > 254) {
      newErrors.contactEmail = 'Email must be 254 characters or less.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      newErrors.contactEmail = 'Enter a valid email address.'
    }

    // Phone: optional, but if provided must have min 7 digits
    const phoneTrimmed = formData.contactPhone.trim()
    if (phoneTrimmed) {
      const digitCount = (phoneTrimmed.match(/\d/g) || []).length
      if (digitCount < 7) {
        newErrors.contactPhone = 'Enter a valid phone number.'
      }
    }

    // Notes: max 2000 chars
    if (formData.notes.length > 2000) {
      newErrors.notes = 'Notes must be 2000 characters or less.'
    }

    return newErrors
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

    await onSubmit(formData)
  }, [formData, validateForm, onSubmit])

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
                aria-invalid={!!errors.contactPhone}
                aria-describedby={errors.contactPhone ? 'contactPhone-error' : undefined}
              />
              {errors.contactPhone && (
                <p id="contactPhone-error" className="text-sm text-error">
                  {errors.contactPhone}
                </p>
              )}
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
                formData.notes.length > 2000 ? "text-error" : "text-muted"
              )}>
                {formData.notes.length}/2000
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
              {isSubmitting ? 'Creating...' : 'Create Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateLeadDialog
