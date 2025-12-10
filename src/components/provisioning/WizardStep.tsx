import * as React from 'react'
import { cn } from '../../lib/utils'
import { useWizard } from './Wizard'

// =============================================================================
// WIZARD STEP
// =============================================================================

export interface WizardStepProps {
  /** The step index this content belongs to (0-based) */
  step: number
  /** Children to render when this step is active */
  children: React.ReactNode
  /** Additional className */
  className?: string
  /** Whether to keep the step mounted when not active (for form state preservation) */
  keepMounted?: boolean
}

export function WizardStep({
  step,
  children,
  className,
  keepMounted = false,
}: WizardStepProps) {
  const { currentStep } = useWizard()
  const isActive = currentStep === step

  if (!isActive && !keepMounted) {
    return null
  }

  return (
    <div
      className={cn(
        'animate-in fade-in-0 duration-200',
        !isActive && keepMounted && 'hidden',
        className
      )}
      data-step={step}
      data-active={isActive}
    >
      {children}
    </div>
  )
}

// =============================================================================
// WIZARD STEP HEADER
// =============================================================================

export interface WizardStepHeaderProps {
  /** Main title */
  title: string
  /** Optional description/subtitle */
  description?: string
  /** Additional className */
  className?: string
}

export function WizardStepHeader({
  title,
  description,
  className,
}: WizardStepHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      <h2 className="text-xl font-semibold text-primary font-sans">{title}</h2>
      {description && (
        <p className="mt-1 text-sm font-sans text-emphasis">{description}</p>
      )}
    </div>
  )
}

// =============================================================================
// WIZARD STEP SECTION
// =============================================================================

export interface WizardStepSectionProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Children content */
  children: React.ReactNode
  /** Additional className */
  className?: string
}

export function WizardStepSection({
  title,
  description,
  children,
  className,
}: WizardStepSectionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-base font-semibold font-sans text-primary">{title}</h3>
          )}
          {description && (
            <p className="mt-0.5 text-sm font-sans text-emphasis">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
