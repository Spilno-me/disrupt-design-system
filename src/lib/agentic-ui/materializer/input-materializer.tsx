/**
 * Input Materializer
 *
 * Renders input intentions (provide-text, provide-data) as appropriate
 * UI components based on resolution constraints:
 *
 * - Text → Single line input or textarea
 * - Number → Number input with validation
 * - Date → Date picker
 * - Long text → Textarea
 */

import * as React from 'react'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { Label } from '../../../components/ui/label'
import { cn } from '../../../lib/utils'
import type { PatternMaterializer, MaterializerProps } from './types'
import { getFieldLabel, getPlaceholder, isRequired } from './types'

// =============================================================================
// CONSTANTS
// =============================================================================

const TEXTAREA_TYPES = ['message', 'text', 'summary']
const NUMBER_TYPES = ['number']
const DATE_TYPES = ['date', 'time']

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Single line text input
 */
function TextInput({
  resolution,
  value,
  onChange,
  disabled,
  className,
}: MaterializerProps) {
  const label = getFieldLabel(resolution.sourceIntention)
  const placeholder = getPlaceholder(resolution.sourceIntention)
  const required = isRequired(resolution.sourceIntention)
  const { min, max, pattern } = resolution.sourceIntention.subject.constraints ?? {}

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={label} className="text-sm font-medium">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </Label>
      <Input
        id={label}
        type="text"
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        minLength={min}
        maxLength={max}
        pattern={pattern?.toString()}
        className="w-full"
      />
      {max && (
        <p className="text-xs text-muted">
          {((value as string) ?? '').length} / {max} characters
        </p>
      )}
    </div>
  )
}

/**
 * Multi-line textarea
 */
function TextareaInput({
  resolution,
  value,
  onChange,
  disabled,
  className,
}: MaterializerProps) {
  const label = getFieldLabel(resolution.sourceIntention)
  const placeholder = getPlaceholder(resolution.sourceIntention)
  const required = isRequired(resolution.sourceIntention)
  const { min, max } = resolution.sourceIntention.subject.constraints ?? {}

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={label} className="text-sm font-medium">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </Label>
      <Textarea
        id={label}
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        minLength={min}
        maxLength={max}
        className="w-full min-h-[120px] resize-y"
      />
      {max && (
        <p className="text-xs text-muted">
          {((value as string) ?? '').length} / {max} characters
        </p>
      )}
    </div>
  )
}

/**
 * Number input
 */
function NumberInput({
  resolution,
  value,
  onChange,
  disabled,
  className,
}: MaterializerProps) {
  const label = getFieldLabel(resolution.sourceIntention)
  const placeholder = getPlaceholder(resolution.sourceIntention)
  const required = isRequired(resolution.sourceIntention)
  const { min, max } = resolution.sourceIntention.subject.constraints ?? {}

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={label} className="text-sm font-medium">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </Label>
      <Input
        id={label}
        type="number"
        value={(value as number) ?? ''}
        onChange={(e) => onChange(e.target.valueAsNumber || e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
        className="w-full"
      />
      {(min !== undefined || max !== undefined) && (
        <p className="text-xs text-muted">
          {min !== undefined && `Min: ${min}`}
          {min !== undefined && max !== undefined && ' | '}
          {max !== undefined && `Max: ${max}`}
        </p>
      )}
    </div>
  )
}

/**
 * Date input
 */
function DateInput({
  resolution,
  value,
  onChange,
  disabled,
  className,
}: MaterializerProps) {
  const label = getFieldLabel(resolution.sourceIntention)
  const required = isRequired(resolution.sourceIntention)
  const subjectType = resolution.sourceIntention.subject.type

  const inputType = subjectType === 'time' ? 'time' : 'date'

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={label} className="text-sm font-medium">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </Label>
      <Input
        id={label}
        type={inputType}
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        className="w-full"
      />
    </div>
  )
}

// =============================================================================
// INPUT MATERIALIZER
// =============================================================================

export const InputMaterializer: PatternMaterializer = {
  pattern: 'input',

  canHandle: (resolution) => resolution.manifestation.pattern === 'input',

  render: (props) => {
    const { resolution } = props
    const subjectType = resolution.sourceIntention.subject.type
    const { max } = resolution.sourceIntention.subject.constraints ?? {}

    // Date/time inputs
    if (DATE_TYPES.includes(subjectType)) {
      return <DateInput {...props} />
    }

    // Number inputs
    if (NUMBER_TYPES.includes(subjectType)) {
      return <NumberInput {...props} />
    }

    // Long text or message type → Textarea
    if (TEXTAREA_TYPES.includes(subjectType) || (max && max > 200)) {
      return <TextareaInput {...props} />
    }

    // Default: Single line text input
    return <TextInput {...props} />
  },
}
