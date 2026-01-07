// =============================================================================
// FORM FIELD COMPONENT
// Reusable form field wrapper with label and error handling
// =============================================================================

import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import { cn } from '../../../lib/utils'
import { Label } from '../../ui/label'

export interface FormFieldProps {
  name: string
  label: string
  required?: boolean
  helperText?: string
  children: React.ReactNode
  className?: string
}

export function FormField({
  name,
  label,
  required,
  helperText,
  children,
  className,
}: FormFieldProps) {
  const { formState: { errors } } = useFormContext()
  const error = errors[name]

  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={name} className="text-primary font-medium font-sans">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </Label>
      {children}
      {helperText && !error && (
        <p className="text-xs font-sans text-emphasis">{helperText}</p>
      )}
      {error && (
        <p className="text-xs font-sans text-error">{error.message as string}</p>
      )}
    </div>
  )
}
