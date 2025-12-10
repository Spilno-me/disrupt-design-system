import * as React from 'react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { useWizard } from './Wizard'

// =============================================================================
// WIZARD NAVIGATION
// =============================================================================

export interface WizardNavigationProps {
  /** Text for the back/cancel button */
  backLabel?: string
  /** Text for the next button */
  nextLabel?: string
  /** Text for the submit button (last step) */
  submitLabel?: string
  /** Whether to show cancel button on first step */
  showCancelOnFirst?: boolean
  /** Callback when cancel is clicked (first step) */
  onCancel?: () => void
  /** Callback when next is clicked (return false to prevent navigation) */
  onNext?: () => boolean | void | Promise<boolean | void>
  /** Callback when submit is clicked (last step) */
  onSubmit?: () => void | Promise<void>
  /** Whether the next/submit button is disabled */
  disabled?: boolean
  /** Whether a submission is in progress */
  isSubmitting?: boolean
  /** Additional className */
  className?: string
  /** Custom left side content (replaces back button) */
  leftContent?: React.ReactNode
  /** Custom right side content (replaces next/submit button) */
  rightContent?: React.ReactNode
}

export function WizardNavigation({
  backLabel = 'Back',
  nextLabel = 'Continue',
  submitLabel = 'Submit',
  showCancelOnFirst = true,
  onCancel,
  onNext,
  onSubmit,
  disabled = false,
  isSubmitting = false,
  className,
  leftContent,
  rightContent,
}: WizardNavigationProps) {
  const { isFirstStep, isLastStep, goToPrevious, goToNext } = useWizard()
  const [isLoading, setIsLoading] = React.useState(false)

  const handleNext = async () => {
    if (disabled || isLoading || isSubmitting) return

    if (onNext) {
      setIsLoading(true)
      try {
        const result = await onNext()
        if (result === false) {
          setIsLoading(false)
          return
        }
      } catch {
        setIsLoading(false)
        return
      }
      setIsLoading(false)
    }

    if (!isLastStep) {
      goToNext()
    }
  }

  const handleSubmit = async () => {
    if (disabled || isSubmitting) return

    if (onSubmit) {
      await onSubmit()
    }
  }

  const handleBack = () => {
    if (isFirstStep && onCancel) {
      onCancel()
    } else {
      goToPrevious()
    }
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between pt-6 border-t border-default',
        className
      )}
    >
      {/* Left side - Back/Cancel button */}
      <div>
        {leftContent ?? (
          <>
            {(isFirstStep && showCancelOnFirst) || !isFirstStep ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                {isFirstStep ? 'Cancel' : backLabel}
              </Button>
            ) : null}
          </>
        )}
      </div>

      {/* Right side - Next/Submit button */}
      <div>
        {rightContent ?? (
          <Button
            type={isLastStep ? 'submit' : 'button'}
            variant="accent"
            onClick={isLastStep ? handleSubmit : handleNext}
            disabled={disabled || isLoading || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : isLastStep ? (
              submitLabel
            ) : (
              nextLabel
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// WIZARD FOOTER (sticky variant)
// =============================================================================

export interface WizardFooterProps extends WizardNavigationProps {
  /** Whether the footer should be sticky at the bottom */
  sticky?: boolean
}

export function WizardFooter({ sticky = true, className, ...props }: WizardFooterProps) {
  return (
    <div
      className={cn(
        'bg-surface px-6 py-4',
        sticky && 'sticky bottom-0 border-t border-default shadow-sm',
        className
      )}
    >
      <WizardNavigation {...props} className="pt-0 border-t-0" />
    </div>
  )
}
