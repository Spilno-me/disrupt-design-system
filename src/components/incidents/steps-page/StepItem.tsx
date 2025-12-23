/**
 * StepItem - Expandable step row for the Steps page
 *
 * Displays a task/step from an incident that requires user attention.
 * Features severity-colored border, metadata, aging indicator, and
 * expandable description section. Fully responsive for mobile and desktop.
 *
 * @example
 * ```tsx
 * <StepItem
 *   step={step}
 *   onNextStep={(step) => navigate(`/incidents/${step.incidentDbId}`)}
 *   onIncidentClick={(dbId, id) => navigate(`/incidents/${dbId}`)}
 * />
 * ```
 */

import * as React from 'react'
import { ChevronDown, Info, Clock } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { NextStepButton, type NextStepSeverity } from '../../../flow/components/next-step-button'
import { SeverityIndicator } from '../../ui/SeverityIndicator'
import type { StepItemProps, IncidentSeverity, StepStatus } from './types'

// =============================================================================
// SEVERITY STYLING
// =============================================================================

/**
 * Severity to CSS color variable mapping for borders
 */
const SEVERITY_BORDER_COLORS: Record<IncidentSeverity, string> = {
  critical: 'var(--color-error)',
  high: 'var(--color-aging)',
  medium: 'var(--color-warning)',
  low: 'var(--color-success)',
  none: 'var(--color-accent)',
}

/**
 * Font weight hierarchy for severity labels
 * Higher severity = bolder text for intuitive visual urgency
 */
const SEVERITY_FONT_WEIGHTS: Record<IncidentSeverity, string> = {
  critical: 'font-bold',
  high: 'font-semibold',
  medium: 'font-medium',
  low: 'font-normal',
  none: 'font-light',
}

/**
 * Aging indicator colors based on days open
 * Note: Uses text-error-accessible (4.83:1) instead of text-error (4.18:1) for WCAG AA compliance
 */
function getAgingColor(daysOpen: number, isOverdue?: boolean): string {
  if (isOverdue) return 'text-error-accessible'
  if (daysOpen >= 7) return 'text-aging-dark dark:text-aging'
  if (daysOpen >= 3) return 'text-warning-dark dark:text-warning'
  return 'text-success-strong dark:text-success'
}

/**
 * Map IncidentSeverity to NextStepSeverity
 */
function mapSeverityToNextStep(severity: IncidentSeverity): NextStepSeverity {
  return severity as NextStepSeverity
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

/**
 * Info tooltip icon - 44px touch target on mobile (Fitts' Law)
 */
function InfoTooltip({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center justify-center size-6 sm:size-5 rounded-full bg-accent/10 text-accent cursor-help min-h-11 min-w-11 sm:min-h-0 sm:min-w-0"
      title={label}
    >
      <Info className="size-3.5 sm:size-3" />
    </span>
  )
}

/**
 * Severity labels for display
 */
const SEVERITY_LABELS: Record<IncidentSeverity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  none: 'None',
}

/**
 * Status labels for display
 */
const STATUS_LABELS: Record<StepStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  overdue: 'Overdue',
  completed: 'Completed',
}

/**
 * Status badge styling - visible backgrounds for better scannability
 * Uses 30% opacity tint backgrounds (via color-mix) with WCAG AA contrast
 *
 * Light mode contrasts (BG vs white | Text on BG):
 * - Pending: 1.8:1 | 8.5:1 (AAA)
 * - In Progress: 1.61:1 | 9.9:1 (AAA)
 * - Overdue: 1.5:1 | 5.1:1 (AA)
 * - Completed: 1.42:1 | 5.1:1 (AA)
 */
const STATUS_STYLES: Record<StepStatus, string> = {
  pending: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  in_progress: 'bg-accent-tint text-accent-dark dark:bg-accent-tint dark:text-accent',
  overdue: 'bg-error-tint text-error-dark dark:bg-error-tint dark:text-error',
  completed: 'bg-success-tint text-success-dark dark:bg-success-tint dark:text-success',
}

/**
 * Status badge - small pill showing step status
 * Provides at-a-glance status without expanding (UX improvement)
 */
function StatusBadge({ status }: { status: StepStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
        STATUS_STYLES[status]
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

/**
 * Aging indicator with clock icon and days
 */
function AgingIndicator({ daysOpen, isOverdue }: { daysOpen: number; isOverdue?: boolean }) {
  const colorClass = getAgingColor(daysOpen, isOverdue)

  return (
    <div className={cn('flex items-center gap-1', colorClass)}>
      <Clock className="size-4" />
      <span className="text-sm font-medium">{daysOpen}d</span>
    </div>
  )
}

/**
 * Clickable link-styled text with proper touch targets (Fitts' Law)
 * Note: Underline is ALWAYS shown for WCAG compliance (text-link alone is 2.98:1)
 * The underline provides sufficient affordance even at lower contrast ratios.
 */
function ClickableLink({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  if (!onClick) {
    return <span className={cn('text-primary', className)}>{children}</span>
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={cn(
        // Underline always visible for WCAG accessibility (link color 2.98:1 fails without affordance)
        'text-link underline decoration-link/50 hover:decoration-link hover:text-link-hover transition-colors',
        // 44px touch target on mobile (Fitts' Law)
        'min-h-11 sm:min-h-0 inline-flex items-center',
        className
      )}
    >
      {children}
    </button>
  )
}

/**
 * Format date for display
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }) + ' - ' + date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Format date short (just date, no time)
 */
function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Get critical severity styling for Von Restorff effect
 */
function getCriticalStyling(severity: IncidentSeverity) {
  if (severity === 'critical') {
    return {
      className: 'bg-error/5 dark:bg-error/10',
      borderWidth: '4px',
    }
  }
  return {
    className: '',
    borderWidth: '4px',
  }
}

/**
 * StepItem - Expandable row for a step/task
 */
export function StepItem({
  step,
  isExpanded = false,
  onToggleExpand,
  onNextStep,
  onIncidentClick,
  onAssigneeClick,
  onReporterClick,
  onLocationClick,
  className,
}: StepItemProps) {
  const severityColor = SEVERITY_BORDER_COLORS[step.severity]
  const criticalStyling = getCriticalStyling(step.severity)

  // Count hidden fields on mobile for expand hint
  // Includes: Location, Assignee, Reporter, Created, optionally Due
  const hiddenFieldsCount = 4 + (step.dueDate ? 1 : 0)

  return (
    <div
      className={cn(
        'relative bg-surface',
        criticalStyling.className,
        className
      )}
      style={{
        borderLeft: `${criticalStyling.borderWidth} solid ${severityColor}`,
      }}
    >
      {/* Bottom border gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(to right, ${severityColor} 0%, ${severityColor} 70%, transparent 100%)`,
        }}
      />

      {/* Main content row - responsive layout */}
      {/* NOTE: onClick on content area only, NOT on action buttons */}
      <div
        className={cn(
          'flex flex-col sm:flex-row sm:items-center sm:justify-between',
          'py-3 px-3 sm:px-4',
          'hover:bg-muted-bg/50 transition-colors'
        )}
      >
        {/* Left section: Title + Metadata - CLICKABLE for expansion */}
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={onToggleExpand}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onToggleExpand?.()
            }
          }}
        >
          {/* Title row with status badge */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-semibold text-sm text-primary line-clamp-1">{step.title}</span>
            {step.tooltip && <InfoTooltip label={step.tooltip} />}
            <StatusBadge status={step.status} />
          </div>

          {/* Metadata row - wraps on mobile */}
          <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-xs sm:text-sm">
            {/* Incident ID */}
            <span className="text-secondary">
              Incident:{' '}
              <ClickableLink
                onClick={
                  onIncidentClick
                    ? () => onIncidentClick(step.incidentDbId, step.incidentId)
                    : undefined
                }
              >
                {step.incidentId}
              </ClickableLink>
            </span>

            {/* Severity indicator - always visible */}
            <span className="flex items-center gap-1.5">
              <SeverityIndicator level={step.severity} size="sm" />
              <span className={cn('text-xs text-primary', SEVERITY_FONT_WEIGHTS[step.severity])}>
                {SEVERITY_LABELS[step.severity]}
              </span>
            </span>

            {/* Location - truncated on mobile */}
            <span className="text-secondary hidden sm:inline">
              Location:{' '}
              <ClickableLink
                onClick={
                  onLocationClick
                    ? () => onLocationClick(step.location)
                    : undefined
                }
                className="text-primary"
              >
                {step.location}
              </ClickableLink>
            </span>

            {/* Assignee - hidden on smallest screens */}
            <span className="text-secondary hidden md:inline">
              Assignee:{' '}
              <ClickableLink
                onClick={
                  onAssigneeClick
                    ? () => onAssigneeClick(step.assignee)
                    : undefined
                }
              >
                {step.assignee.name}
              </ClickableLink>
            </span>

            {/* Reporter moved to expanded view only (Miller's Law - reduce info density) */}

            {/* Mobile expand hint - shows how many fields are hidden */}
            {/* Note: Uses text-secondary (7.25:1) for WCAG AA compliance at small size */}
            {!isExpanded && (
              <span className="sm:hidden text-secondary flex items-center gap-1">
                <ChevronDown className="size-3" />
                <span>+{hiddenFieldsCount} more</span>
              </span>
            )}
          </div>
        </div>

        {/* Right section: Actions - NOT clickable for expansion */}
        {/* Note: Created/Due dates moved to expanded view only (Miller's Law - aging indicator suffices for quick scan) */}
        {/* Layout: Aging | Expand/Collapse | Next Step (Fitts' Law: primary CTA on right for thumb reach) */}
        <div className="flex items-center gap-2 sm:gap-4 mt-3 sm:mt-0 sm:ml-4 flex-shrink-0">
          {/* Aging indicator - always visible (tells the story without full dates) */}
          <AgingIndicator daysOpen={step.daysOpen} isOverdue={step.isOverdue} />

          {/* Expand/collapse button - center position, 44px touch target */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpand?.()
            }}
            className="min-h-11 min-w-11 sm:min-h-8 sm:min-w-8 flex items-center justify-center rounded-lg hover:bg-muted-bg transition-colors"
            aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
            aria-expanded={isExpanded}
          >
            <ChevronDown
              className={cn(
                'size-5 text-tertiary transition-transform duration-200',
                isExpanded && 'rotate-180'
              )}
            />
          </button>

          {/* Next Step button - right position for thumb reachability (Fitts' Law) */}
          <NextStepButton
            severity={mapSeverityToNextStep(step.severity)}
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onNextStep?.(step)
            }}
          />
        </div>
      </div>

      {/* Expandable description - with animation */}
      <div
        className={cn(
          'grid transition-all duration-200 ease-out',
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div className="px-3 sm:px-4 pb-4 space-y-3">
          {/* Expanded metadata - shown for all screen sizes */}
          {/* Note: Labels use text-secondary (7.25:1) for WCAG AA compliance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-sm">
            {/* Location - mobile only (visible on sm+ in collapsed) */}
            <p className="sm:hidden">
              <span className="text-secondary">Location:</span>{' '}
              <ClickableLink
                onClick={
                  onLocationClick
                    ? () => onLocationClick(step.location)
                    : undefined
                }
                className="text-primary"
              >
                {step.location}
              </ClickableLink>
            </p>

            {/* Assignee - mobile only (visible on md+ in collapsed) */}
            <p className="md:hidden">
              <span className="text-secondary">Assignee:</span>{' '}
              <ClickableLink
                onClick={
                  onAssigneeClick
                    ? () => onAssigneeClick(step.assignee)
                    : undefined
                }
              >
                {step.assignee.name}
              </ClickableLink>
            </p>

            {/* Reporter - all screens (moved from collapsed for cleaner rows) */}
            <p>
              <span className="text-secondary">Reporter:</span>{' '}
              <ClickableLink
                onClick={
                  onReporterClick
                    ? () => onReporterClick(step.reporter)
                    : undefined
                }
              >
                {step.reporter.name}
              </ClickableLink>
            </p>

            {/* Due date - all screens (moved from collapsed for cleaner rows) */}
            {step.dueDate && (
              <p>
                <span className="text-secondary">Due:</span>{' '}
                <span className="text-primary">{formatDateShort(step.dueDate)}</span>
              </p>
            )}

            {/* Created date - all screens (moved from collapsed for cleaner rows) */}
            <p>
              <span className="text-secondary">Created:</span>{' '}
              <span className="text-primary">{formatDate(step.createdAt)}</span>
            </p>
          </div>

          {/* Description */}
          {step.description && (
            <div className="bg-muted-bg/30 dark:bg-black/10 rounded-lg p-3 sm:p-4">
              <p className="text-xs text-secondary mb-1">Description:</p>
              <p className="text-sm text-primary">{step.description}</p>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StepItem
