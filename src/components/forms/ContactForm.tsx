import { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'

// =============================================================================
// TYPES
// =============================================================================

export interface ContactFormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
}

export interface ContactFormProps {
  /** Form fields to display */
  fields?: ContactFormField[]
  /** Submit button text */
  submitButtonText?: string
  /** Form submission handler */
  onSubmit?: (data: Record<string, string | boolean>) => void
  /** Whether the form is submitting */
  isSubmitting?: boolean
  /** Show glass/electric effect on inputs */
  showEffects?: boolean
  /** Privacy policy label/link */
  privacyPolicyLabel?: ReactNode
  /** Additional class name */
  className?: string
}

// =============================================================================
// DEFAULT FIELDS
// =============================================================================

const defaultFields: ContactFormField[] = [
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Your name', required: true },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com', required: true },
  { name: 'company', label: 'Company', type: 'text', placeholder: 'Company name' },
  { name: 'message', label: 'Message', type: 'textarea', placeholder: 'How can we help?', required: true },
]

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Reusable Contact Form with configurable fields.
 * Supports text, email, tel, textarea, and checkbox fields.
 */
export function ContactForm({
  fields = defaultFields,
  submitButtonText = 'Send Message',
  onSubmit,
  isSubmitting = false,
  showEffects = false,
  privacyPolicyLabel,
  className,
}: ContactFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Record<string, string | boolean> = {}

    fields.forEach((field) => {
      if (field.type === 'checkbox') {
        data[field.name] = formData.get(field.name) === 'on'
      } else {
        data[field.name] = formData.get(field.name) as string || ''
      }
    })

    onSubmit?.(data)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex flex-col gap-6', className)}
      data-element="contact-form"
    >
      {fields.map((field) => (
        <div key={field.name} className="grid gap-2">
          {field.type !== 'checkbox' && (
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
          )}

          {field.type === 'textarea' ? (
            <Textarea
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              className="min-h-[120px]"
            />
          ) : field.type === 'checkbox' ? (
            <div className="flex items-center space-x-2">
              <Checkbox id={field.name} name={field.name} />
              <Label htmlFor={field.name} className="font-normal">
                {field.label}
              </Label>
            </div>
          ) : (
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
            />
          )}
        </div>
      ))}

      {privacyPolicyLabel && (
        <div className="flex items-start space-x-2">
          <Checkbox id="privacy" name="privacy" required />
          <Label htmlFor="privacy" className="font-normal text-sm text-muted-foreground leading-tight">
            {privacyPolicyLabel}
          </Label>
        </div>
      )}

      <Button type="submit" variant="contact" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Sending...' : submitButtonText}
      </Button>
    </form>
  )
}
