import * as React from 'react'
import { cn } from '../../lib/utils'

// =============================================================================
// WIZARD CONTEXT
// =============================================================================

export interface WizardStep {
  id: string
  label: string
  description?: string
}

interface WizardContextValue {
  steps: WizardStep[]
  currentStep: number
  totalSteps: number
  isFirstStep: boolean
  isLastStep: boolean
  goToStep: (step: number) => void
  goToNext: () => void
  goToPrevious: () => void
  canGoToStep: (step: number) => boolean
  completedSteps: Set<number>
  markStepComplete: (step: number) => void
}

const WizardContext = React.createContext<WizardContextValue | null>(null)

export function useWizard() {
  const context = React.useContext(WizardContext)
  if (!context) {
    throw new Error('useWizard must be used within a Wizard component')
  }
  return context
}

// =============================================================================
// WIZARD COMPONENT
// =============================================================================

export interface WizardProps {
  /** Array of step definitions */
  steps: WizardStep[]
  /** Initial step index (0-based) */
  initialStep?: number
  /** Callback when step changes */
  onStepChange?: (step: number) => void
  /** Whether to allow navigating to any completed step */
  allowStepNavigation?: boolean
  /** Children components (typically WizardStepper and WizardContent) */
  children: React.ReactNode
  /** Additional className for the wrapper */
  className?: string
}

export function Wizard({
  steps,
  initialStep = 0,
  onStepChange,
  allowStepNavigation = true,
  children,
  className,
}: WizardProps) {
  const [currentStep, setCurrentStep] = React.useState(initialStep)
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(new Set())

  const totalSteps = steps.length
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  const canGoToStep = React.useCallback(
    (step: number) => {
      if (!allowStepNavigation) return false
      // Can go to any step that's been completed or is the current step
      return completedSteps.has(step) || step === currentStep || step < currentStep
    },
    [allowStepNavigation, completedSteps, currentStep]
  )

  const goToStep = React.useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) {
        setCurrentStep(step)
        onStepChange?.(step)
      }
    },
    [totalSteps, onStepChange]
  )

  const goToNext = React.useCallback(() => {
    if (currentStep < totalSteps - 1) {
      // Mark current step as complete when moving forward
      setCompletedSteps((prev) => new Set([...prev, currentStep]))
      goToStep(currentStep + 1)
    }
  }, [currentStep, totalSteps, goToStep])

  const goToPrevious = React.useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1)
    }
  }, [currentStep, goToStep])

  const markStepComplete = React.useCallback((step: number) => {
    setCompletedSteps((prev) => new Set([...prev, step]))
  }, [])

  const contextValue: WizardContextValue = React.useMemo(
    () => ({
      steps,
      currentStep,
      totalSteps,
      isFirstStep,
      isLastStep,
      goToStep,
      goToNext,
      goToPrevious,
      canGoToStep,
      completedSteps,
      markStepComplete,
    }),
    [
      steps,
      currentStep,
      totalSteps,
      isFirstStep,
      isLastStep,
      goToStep,
      goToNext,
      goToPrevious,
      canGoToStep,
      completedSteps,
      markStepComplete,
    ]
  )

  return (
    <WizardContext.Provider value={contextValue}>
      <div className={cn('flex flex-col', className)}>{children}</div>
    </WizardContext.Provider>
  )
}

// =============================================================================
// WIZARD CONTENT
// =============================================================================

export interface WizardContentProps {
  children: React.ReactNode
  className?: string
}

export function WizardContent({ children, className }: WizardContentProps) {
  return <div className={cn('flex-1', className)}>{children}</div>
}
