/**
 * StepsTab - Displays incident workflow steps
 *
 * Shows steps/tasks associated with an incident using the same
 * StepItem component as the main Steps page for consistency.
 *
 * @example
 * ```tsx
 * <StepsTab
 *   steps={incidentSteps}
 *   onNextStep={(step) => navigate(`/incidents/${step.incidentDbId}`)}
 * />
 * ```
 */

import * as React from 'react'
import { useState } from 'react'
import { ListTodo, ClipboardCheck } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { StepItem } from '../../steps-page/StepItem'
import type { Step, StepItemProps } from '../../steps-page/types'

// =============================================================================
// TYPES
// =============================================================================

export interface StepsTabProps {
  /** Steps for this incident */
  steps?: Step[]
  /** Handler when "Next Step" button is clicked */
  onNextStep?: StepItemProps['onNextStep']
  /** Handler when incident ID link is clicked */
  onIncidentClick?: StepItemProps['onIncidentClick']
  /** Handler when assignee name is clicked */
  onAssigneeClick?: StepItemProps['onAssigneeClick']
  /** Handler when reporter name is clicked */
  onReporterClick?: StepItemProps['onReporterClick']
  /** Handler when location is clicked */
  onLocationClick?: StepItemProps['onLocationClick']
  /** Loading state */
  isLoading?: boolean
  /** Additional className */
  className?: string
}

// =============================================================================
// EMPTY STATE
// =============================================================================

function EmptyState() {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'py-16 px-8',
        'bg-surface rounded-xl border border-default'
      )}
    >
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
        <ClipboardCheck className="size-8 text-success" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-primary mb-2">
        All caught up!
      </h3>

      {/* Description */}
      <p className="text-sm text-secondary text-center max-w-md">
        There are no pending steps for this incident.
      </p>
    </div>
  )
}

// =============================================================================
// LOADING STATE
// =============================================================================

function LoadingSkeleton() {
  return (
    <div className="bg-surface border border-default rounded-xl overflow-hidden">
      <div className="divide-y divide-default">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 border-l-4 border-muted-bg animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-muted-bg rounded w-1/3 mb-2" />
                <div className="flex gap-4">
                  <div className="h-3 bg-muted-bg rounded w-20" />
                  <div className="h-3 bg-muted-bg rounded w-16" />
                  <div className="h-3 bg-muted-bg rounded w-24 hidden sm:block" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 bg-muted-bg rounded w-16" />
                <div className="h-8 bg-muted-bg rounded w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * StepsTab - Workflow steps for an incident
 */
export function StepsTab({
  steps = [],
  onNextStep,
  onIncidentClick,
  onAssigneeClick,
  onReporterClick,
  onLocationClick,
  isLoading = false,
  className,
}: StepsTabProps) {
  // Track expanded step
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null)

  const handleToggleExpand = (stepId: string) => {
    setExpandedStepId((current) => (current === stepId ? null : stepId))
  }

  // Loading state
  if (isLoading) {
    return <LoadingSkeleton />
  }

  // Empty state
  if (steps.length === 0) {
    return <EmptyState />
  }

  // Steps list
  return (
    <div className={cn('bg-surface border border-default rounded-xl overflow-hidden shadow-sm', className)}>
      <div className="divide-y divide-default">
        {steps.map((step) => (
          <StepItem
            key={step.id}
            step={step}
            isExpanded={expandedStepId === step.id}
            onToggleExpand={() => handleToggleExpand(step.id)}
            onNextStep={onNextStep}
            onIncidentClick={onIncidentClick}
            onAssigneeClick={onAssigneeClick}
            onReporterClick={onReporterClick}
            onLocationClick={onLocationClick}
          />
        ))}
      </div>
    </div>
  )
}

export default StepsTab
