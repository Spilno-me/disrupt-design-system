/**
 * IncidentStatusBadge - Status badge for incident management tables
 *
 * Displays workflow status with semantic icons and severity-based colors.
 * The icon is determined by the status, the color by the row severity.
 * Outline-only design (no filled background) for a lighter visual weight.
 *
 * @figma https://www.figma.com/design/19jjsBQEpNsQaryNQgXedT/Flow-EHS?node-id=576-15539
 */

import * as React from 'react'
import { Search, User, Flag, FileText } from 'lucide-react'
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
  /** Workflow status determines the icon */
  status: IncidentStatus
  /** Row severity determines the color (except draft which has its own style) */
  severity?: IncidentSeverity
  /** Additional className */
  className?: string
}

// =============================================================================
// STATUS ICONS
// =============================================================================

const statusIcons: Record<IncidentStatus, React.ComponentType<{ className?: string }>> = {
  investigation: Search,
  review: User,
  reported: Flag,
  draft: FileText,
  closed: FileText,
}

const statusLabels: Record<IncidentStatus, string> = {
  investigation: 'Investigation',
  review: 'Review',
  reported: 'Reported',
  draft: 'Draft',
  closed: 'Closed',
}

// =============================================================================
// SEVERITY COLORS (Outline-only design)
// =============================================================================

/**
 * Severity color classes for badges.
 * Outline-only: border and text in same color, transparent background.
 * Uses semantic tokens for consistent theming with WCAG AA contrast.
 *
 * Order: critical (red) → high (orange) → medium (amber) → low (green) → none (cyan/teal)
 */
const severityColors: Record<IncidentSeverity, { border: string; text: string }> = {
  critical: {
    // Coral/red - uses error token
    border: 'border-error',
    text: 'text-error',
  },
  high: {
    // Orange - uses aging token (darker in light mode for contrast)
    border: 'border-aging-dark dark:border-aging',
    text: 'text-aging-dark dark:text-aging',
  },
  medium: {
    // Yellow/amber - uses warning token (darker in light mode for contrast)
    border: 'border-warning-dark dark:border-warning',
    text: 'text-warning-dark dark:text-warning',
  },
  low: {
    // Green - uses success token (stronger in light mode for contrast)
    border: 'border-success-strong dark:border-success',
    text: 'text-success-strong dark:text-success',
  },
  none: {
    // Cyan/teal - for incidents without assigned severity (e.g., "Reported" status)
    border: 'border-info',
    text: 'text-info',
  },
}

// Draft has special styling (dashed border, muted colors)
// Dark mode: DUSK_REEF[300] (#9F93B7) for better contrast on dark backgrounds
const draftColors = {
  border: 'border-dashed border-secondary dark:border-tertiary',
  text: 'text-secondary dark:text-tertiary',
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * IncidentStatusBadge - Workflow status badge with severity-based colors
 *
 * Outline-only design: thin border with icon + label, no filled background.
 * This provides a lighter visual weight that doesn't compete with row content.
 *
 * @example
 * // Investigation with critical severity (coral/pink outline)
 * <IncidentStatusBadge status="investigation" severity="critical" />
 *
 * @example
 * // Review with high severity (orange outline)
 * <IncidentStatusBadge status="review" severity="high" />
 *
 * @example
 * // Reported with info severity (cyan/teal outline)
 * <IncidentStatusBadge status="reported" severity="info" />
 *
 * @example
 * // Draft status (gray dashed outline)
 * <IncidentStatusBadge status="draft" />
 */
export function IncidentStatusBadge({
  status,
  severity = 'none',
  className,
}: IncidentStatusBadgeProps) {
  const Icon = statusIcons[status]
  const label = statusLabels[status]

  // Draft always uses its own style regardless of severity
  const colors = status === 'draft' ? draftColors : severityColors[severity]

  return (
    <span
      className={cn(
        // Compact sizing: smaller padding, thinner appearance
        'inline-flex items-center gap-1.5 px-2.5 py-0.5',
        // Pill shape with thin border (1px via border class)
        'rounded-full border',
        // Transparent background - outline only
        'bg-transparent',
        // Typography: smaller, medium weight
        'text-xs font-medium',
        colors.border,
        colors.text,
        className
      )}
    >
      <Icon className="size-4 flex-shrink-0" />
      {label}
    </span>
  )
}

export default IncidentStatusBadge
