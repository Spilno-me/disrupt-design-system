/**
 * IncidentStatusBadge - Status badge for incident management tables
 *
 * Displays workflow status with colored backgrounds for visibility.
 * Draft status uses outline-only design (dashed border, no background).
 *
 * @figma https://www.figma.com/design/19jjsBQEpNsQaryNQgXedT/Flow-EHS?node-id=576-15539
 */

import * as React from 'react'
import { cn } from '../../../lib/utils'

// =============================================================================
// TYPES
// =============================================================================

export type IncidentStatus = 'investigation' | 'review' | 'reported' | 'draft' | 'closed'

/**
 * Incident severity levels (constant, ordered from highest to lowest):
 * - critical: Highest priority, requires immediate attention
 * - high: Urgent, needs prompt action
 * - medium: Standard priority
 * - low: Can be addressed when convenient
 * - none: Severity not yet assigned (e.g., newly reported incidents)
 */
export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low' | 'none'

export interface IncidentStatusBadgeProps {
  /** Workflow status determines the styling */
  status: IncidentStatus
  /** @deprecated Severity is no longer used - kept for API compatibility */
  severity?: IncidentSeverity
  /** Additional className */
  className?: string
}

// =============================================================================
// STATUS LABELS
// =============================================================================

const statusLabels: Record<IncidentStatus, string> = {
  investigation: 'Investigation',
  review: 'Review',
  reported: 'Reported',
  draft: 'Draft',
  closed: 'Closed',
}

// =============================================================================
// STATUS STYLES (Colored backgrounds for visibility)
// =============================================================================

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
 */
const statusStyles: Record<IncidentStatus, string> = {
  // Draft: outline-only with dashed border (no background)
  draft: 'bg-transparent border-dashed border-secondary text-secondary dark:border-tertiary dark:text-tertiary',
  // Reported: Teal/Cyan - newly submitted
  // BG contrast vs white: 1.61:1 | Text contrast: 9.9:1 (AAA)
  reported: 'bg-accent-tint border-transparent text-accent-dark dark:bg-accent-tint dark:text-accent',
  // Investigation: Warning/Gold - actively being investigated
  // BG contrast vs white: 1.35:1 | Text contrast: 6.2:1 (AA)
  investigation: 'bg-warning-tint border-transparent text-warning-dark dark:bg-warning-tint dark:text-warning',
  // Review: Warning/Gold - under review/approval
  // BG contrast vs white: 1.35:1 | Text contrast: 6.2:1 (AA)
  review: 'bg-warning-tint border-transparent text-warning-dark dark:bg-warning-tint dark:text-warning',
  // Closed: Green - resolved/completed
  // BG contrast vs white: 1.42:1 | Text contrast: 5.1:1 (AA)
  closed: 'bg-success-tint border-transparent text-success-dark dark:bg-success-tint dark:text-success',
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * IncidentStatusBadge - Workflow status badge with colored backgrounds
 *
 * Uses visible colored backgrounds (20% opacity) for quick visual scanning.
 * Draft status is special: no background, dashed border only.
 *
 * @example
 * // Investigation status (gold/yellow background)
 * <IncidentStatusBadge status="investigation" />
 *
 * @example
 * // Reported status (teal background)
 * <IncidentStatusBadge status="reported" />
 *
 * @example
 * // Draft status (no bg, dashed border)
 * <IncidentStatusBadge status="draft" />
 *
 * @example
 * // Closed status (green background)
 * <IncidentStatusBadge status="closed" />
 */
export function IncidentStatusBadge({
  status,
  severity: _severity,
  className,
}: IncidentStatusBadgeProps) {
  const label = statusLabels[status]

  return (
    <span
      className={cn(
        // Compact sizing
        'inline-flex items-center px-2.5 py-0.5',
        // Pill shape with border (visible for draft, transparent for others)
        'rounded-full border',
        // Typography: smaller, medium weight
        'text-xs font-medium whitespace-nowrap',
        // Status-specific styling
        statusStyles[status],
        className
      )}
    >
      {label}
    </span>
  )
}

export default IncidentStatusBadge
