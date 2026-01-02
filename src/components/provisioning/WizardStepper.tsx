import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useWizard } from './Wizard'

// =============================================================================
// WIZARD STEPPER
// =============================================================================

export interface WizardStepperProps {
  /** Whether to allow clicking on steps to navigate */
  clickable?: boolean
  /** Additional className */
  className?: string
  /** Orientation of the stepper */
  orientation?: 'horizontal' | 'vertical'
}

export function WizardStepper({
  clickable = true,
  className,
  orientation = 'horizontal',
}: WizardStepperProps) {
  const { steps, currentStep, completedSteps, canGoToStep, goToStep } = useWizard()

  return (
    <nav
      aria-label="Wizard progress"
      className={cn(
        'w-full',
        orientation === 'horizontal' ? 'px-4 py-6' : 'px-6 py-4',
        className
      )}
    >
      <ol
        className={cn(
          'flex',
          orientation === 'horizontal'
            ? 'flex-row items-center justify-between'
            : 'flex-col gap-4'
        )}
      >
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index) && index < currentStep
          const isCurrent = index === currentStep
          const isClickable = clickable && canGoToStep(index)
          const isUpcoming = index > currentStep && !completedSteps.has(index)
          const stepStatus = isCompleted ? 'completed' : isCurrent ? 'current' : 'upcoming'

          return (
            <React.Fragment key={step.id}>
              {/* Step Item */}
              <li
                className={cn(
                  'flex items-center gap-3',
                  orientation === 'vertical' && 'flex-1',
                  isClickable && 'cursor-pointer group'
                )}
                onClick={isClickable ? () => goToStep(index) : undefined}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : undefined}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Step ${index + 1}: ${step.label}, ${stepStatus}`}
                onKeyDown={
                  isClickable
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          goToStep(index)
                        }
                      }
                    : undefined
                }
              >
                {/* Step Circle */}
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold font-sans transition-colors shrink-0',
                    // Completed state - green with checkmark
                    isCompleted && 'bg-success text-inverse',
                    // Current state - green filled with number
                    isCurrent && 'bg-success text-inverse',
                    // Upcoming state - gray outline with good contrast
                    isUpcoming && 'bg-surface border-2 border-default text-emphasis',
                    // Hover states for clickable
                    isClickable &&
                      !isCurrent &&
                      !isCompleted &&
                      'group-hover:border-accent group-hover:text-accent'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" strokeWidth={3} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={cn(
                    'text-sm font-medium font-sans transition-colors whitespace-nowrap',
                    isCurrent && 'text-primary',
                    isCompleted && 'text-primary',
                    isUpcoming && 'text-emphasis',
                    isClickable && !isCurrent && 'group-hover:text-accent'
                  )}
                >
                  {step.label}
                </span>
              </li>

              {/* Connector Line (between steps) */}
              {index < steps.length - 1 && orientation === 'horizontal' && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-4 transition-colors',
                    // Line color based on completion
                    index < currentStep ? 'bg-success' : 'bg-slate'
                  )}
                />
              )}

              {/* Vertical connector */}
              {index < steps.length - 1 && orientation === 'vertical' && (
                <div
                  className={cn(
                    'w-0.5 h-6 ml-4 transition-colors',
                    index < currentStep ? 'bg-success' : 'bg-slate'
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

// =============================================================================
// COMPACT STEPPER (for mobile or narrow layouts)
// =============================================================================

export interface CompactStepperProps {
  className?: string
}

export function CompactStepper({ className }: CompactStepperProps) {
  const { steps, currentStep, totalSteps } = useWizard()
  const currentStepData = steps[currentStep]
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100)

  return (
    <div className={cn('px-4 py-3', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full bg-success text-inverse text-sm font-semibold font-sans"
            aria-hidden="true"
          >
            {currentStep + 1}
          </div>
          <div>
            <p className="text-sm font-medium font-sans text-primary" id="current-step-label">
              {currentStepData?.label}
            </p>
            <p className="text-xs font-sans text-emphasis">
              Step {currentStep + 1} of {totalSteps}
            </p>
          </div>
        </div>

        {/* Progress dots - accessible progress indicator */}
        <div
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={`Wizard progress: step ${currentStep + 1} of ${totalSteps}, ${progressPercent}% complete`}
          aria-describedby="current-step-label"
          className="flex items-center gap-1.5"
        >
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                index <= currentStep ? 'bg-success' : 'bg-slate'
              )}
              aria-hidden="true"
              title={step.label}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
