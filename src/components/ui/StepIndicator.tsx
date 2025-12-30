/**
 * StepIndicator - Contrast-compliant step progress indicator
 *
 * A reusable component for multi-step flows with built-in WCAG AA contrast compliance.
 * Uses bg-primary (12:1) for active states instead of bg-accent (3.57:1).
 *
 * @example
 * ```tsx
 * <StepIndicator
 *   steps={[
 *     { id: 'step1', label: 'Account' },
 *     { id: 'step2', label: 'Profile' },
 *     { id: 'step3', label: 'Complete' },
 *   ]}
 *   currentStep="step2"
 *   completedSteps={['step1']}
 * />
 * ```
 */

import * as React from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { cn } from '../../lib/utils'

// =============================================================================
// TYPES
// =============================================================================

export interface Step {
  /** Unique identifier for the step */
  id: string
  /** Display label for the step */
  label: string
}

export interface StepIndicatorProps {
  /** Array of steps to display */
  steps: Step[]
  /** ID of the current active step */
  currentStep: string
  /** IDs of completed steps */
  completedSteps?: string[]
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Show labels below step numbers */
  showLabels?: boolean
  /** Orientation */
  orientation?: 'horizontal' | 'vertical'
  /** Additional className */
  className?: string
  /** Callback when a completed step is clicked */
  onStepClick?: (stepId: string) => void
}

// =============================================================================
// SIZE CONFIGS
// =============================================================================

const sizeConfig = {
  sm: {
    circle: 'size-6',
    text: 'text-xs',
    icon: 'size-3',
    arrow: 'size-3',
    label: 'text-xs',
    gap: 'gap-3',
  },
  md: {
    circle: 'size-8',
    text: 'text-sm',
    icon: 'size-4',
    arrow: 'size-4',
    label: 'text-xs',
    gap: 'gap-4',
  },
  lg: {
    circle: 'size-10',
    text: 'text-base',
    icon: 'size-5',
    arrow: 'size-5',
    label: 'text-sm',
    gap: 'gap-6',
  },
}

// =============================================================================
// COMPONENT
// =============================================================================

export function StepIndicator({
  steps,
  currentStep,
  completedSteps = [],
  size = 'md',
  showLabels = true,
  orientation = 'horizontal',
  className,
  onStepClick,
}: StepIndicatorProps) {
  const config = sizeConfig[size]
  const isVertical = orientation === 'vertical'

  const getStepState = (stepId: string): 'completed' | 'active' | 'pending' => {
    if (completedSteps.includes(stepId)) return 'completed'
    if (stepId === currentStep) return 'active'
    return 'pending'
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center',
        config.gap,
        isVertical && 'flex-col',
        className
      )}
    >
      {steps.map((step, index) => {
        const state = getStepState(step.id)
        const isClickable = state === 'completed' && onStepClick

        return (
          <React.Fragment key={step.id}>
            <div
              className={cn(
                'flex items-center gap-1 transition-opacity',
                isVertical && 'flex-row',
                !isVertical && 'flex-col',
                state === 'pending' && 'opacity-40'
              )}
            >
              {/* Step circle with contrast-compliant colors */}
              {/* bg-primary (12:1) passes AA for normal text; bg-accent (3.57:1) fails */}
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.id)}
                className={cn(
                  'rounded-full flex items-center justify-center font-medium transition-colors',
                  config.circle,
                  config.text,
                  state === 'completed' && 'bg-success text-inverse',
                  state === 'active' && 'bg-primary text-inverse',
                  state === 'pending' && 'bg-muted-bg text-secondary',
                  isClickable && 'cursor-pointer hover:opacity-80',
                  !isClickable && 'cursor-default'
                )}
                aria-current={state === 'active' ? 'step' : undefined}
                aria-label={`Step ${index + 1}: ${step.label}${state === 'completed' ? ' (completed)' : state === 'active' ? ' (current)' : ''}`}
              >
                {state === 'completed' ? (
                  <CheckCircle2 className={config.icon} />
                ) : (
                  index + 1
                )}
              </button>

              {/* Step label */}
              {showLabels && (
                <span className={cn('text-secondary', config.label)}>
                  {step.label}
                </span>
              )}
            </div>

            {/* Arrow separator - text-tertiary (3.5:1) passes graphics threshold */}
            {index < steps.length - 1 && (
              <ArrowRight
                className={cn(
                  'text-tertiary flex-shrink-0',
                  config.arrow,
                  isVertical && 'rotate-90'
                )}
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

StepIndicator.displayName = 'StepIndicator'

export default StepIndicator
