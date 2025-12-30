/**
 * IncidentStatusBadge - Status badge for incident management tables
 *
 * Displays workflow status with colored backgrounds for visibility.
 * Draft status uses outline-only design (dashed border, no background).
 * Ensures WCAG AA contrast compliance for all status colors.
 *
 * @component ATOM
 *
 * @figma https://www.figma.com/design/19jjsBQEpNsQaryNQgXedT/Flow-EHS?node-id=576-15539
 *
 * @example
 * ```tsx
 * // Investigation status (gold/yellow background)
 * <IncidentStatusBadge status="investigation" />
 *
 * // Reported status (teal background)
 * <IncidentStatusBadge status="reported" />
 *
 * // Draft status (no bg, dashed border)
 * <IncidentStatusBadge status="draft" />
 *
 * // Closed status (green background)
 * <IncidentStatusBadge status="closed" />
 *
 * // With custom className
 * <IncidentStatusBadge status="review" className="ml-2" />
 * ```
 */

import * as React from 'react'
import { cn } from '../../../lib/utils'

// ============== CONSTANTS ==============

/** Base styling for all status badges */
const BADGE_BASE_CLASSES = 'inline-flex items-center px-2.5 py-0.5 rounded-full border text-xs font-medium whitespace-nowrap'

// ============== TYPES ==============

/**
 * Incident workflow status values
 * - draft: Not yet submitted
 * - reported: Newly submitted, awaiting action
 * - investigation: Actively being investigated
 * - review: Under review/approval
 * - closed: Resolved/completed
 */
export type IncidentStatus = 'investigation' | 'review' | 'reported' | 'draft' | 'closed'

/**
 * Incident severity levels (constant, ordered from highest to lowest):
 * - critical: Highest priority, requires immediate attention
 * - high: Urgent, needs prompt action
 * - medium: Standard priority
 * - low: Can be addressed when convenient
 * - none: Severity not yet assigned (e.g., newly reported incidents)
 *
 * @deprecated Severity is no longer displayed in badges - kept for API compatibility
 */
export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low' | 'none'

/**
 * Props for IncidentStatusBadge component
 * Extends HTMLSpanElement attributes for maximum flexibility
 */
export interface IncidentStatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Workflow status determines the styling */
  status: IncidentStatus
  /** @deprecated Severity is no longer used - kept for API compatibility */
  severity?: IncidentSeverity
}

// ============== STATUS CONFIG ==============

/** Display labels for each status */
const STATUS_LABELS: Record<IncidentStatus, string> = {
  investigation: 'Investigation',
  review: 'Review',
  reported: 'Reported',
  draft: 'Draft',
  closed: 'Closed',
}

/**
 * Status-based styling for badges.
 * Uses visible colored backgrounds (20% opacity) for quick scanning.
 * Draft is special: no background, dashed border only.
 *
 * Color mapping:
 * - Draft: No bg, dashed gray border - not yet submitted
 * - Reported: Teal/Cyan bg - newly submitted, awaiting action
 * - Investigation: Warning/Gold bg - actively being investigated
 * - Review: Warning/Gold bg - under review/approval
 * - Closed: Green bg - resolved/completed
 *
 * Contrast ratios (WCAG AA compliant):
 * - Reported: BG 1.61:1 | Text 9.9:1 (AAA)
 * - Investigation: BG 1.35:1 | Text 6.2:1 (AA)
 * - Review: BG 1.35:1 | Text 6.2:1 (AA)
 * - Closed: BG 1.42:1 | Text 5.1:1 (AA)
 */
const STATUS_STYLES: Record<IncidentStatus, string> = {
  // Draft: outline-only with dashed border (no background)
  draft: 'bg-transparent border-dashed border-secondary text-secondary dark:border-tertiary dark:text-tertiary',
  // Reported: Teal/Cyan - newly submitted
  reported: 'bg-accent-tint border-transparent text-accent-dark dark:bg-accent-tint dark:text-accent',
  // Investigation: Warning/Gold - actively being investigated
  investigation: 'bg-warning-tint border-transparent text-warning-dark dark:bg-warning-tint dark:text-warning',
  // Review: Warning/Gold - under review/approval
  review: 'bg-warning-tint border-transparent text-warning-dark dark:bg-warning-tint dark:text-warning',
  // Closed: Green - resolved/completed
  closed: 'bg-success-tint border-transparent text-success-dark dark:bg-success-tint dark:text-success',
}

// ============== COMPONENTS ==============

/**
 * IncidentStatusBadge - Workflow status badge with colored backgrounds
 *
 * Uses visible colored backgrounds (20% opacity) for quick visual scanning.
 * Draft status is special: no background, dashed border only.
 */
export function IncidentStatusBadge({
  status,
  severity: _severity,
  className,
  ...props
}: IncidentStatusBadgeProps) {
  const label = STATUS_LABELS[status]

  return (
    <span
      data-slot="incident-status-badge"
      className={cn(
        BADGE_BASE_CLASSES,
        STATUS_STYLES[status],
        className
      )}
      {...props}
    >
      {label}
    </span>
  )
}

IncidentStatusBadge.displayName = 'IncidentStatusBadge'

export default IncidentStatusBadge
