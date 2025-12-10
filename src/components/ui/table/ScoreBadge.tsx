/**
 * ScoreBadge - Reusable score/rating badge component for DataTable cells
 *
 * Displays numeric scores with color-coded backgrounds based on thresholds.
 * Ensures WCAG AAA contrast (12.31:1+) by always using text-primary.
 */

import * as React from 'react'
import { cn } from '../../../lib/utils'

// =============================================================================
// TYPES
// =============================================================================

export interface ScoreBadgeProps {
  /** Score value (0-100) */
  score: number
  /** Custom thresholds (defaults: high=80, medium=50) */
  thresholds?: {
    high: number
    medium: number
  }
  /** Additional className */
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ScoreBadge - Color-coded score display for tables
 *
 * Color mapping:
 * - Score >= 80: Green background (high/good)
 * - Score >= 50: Yellow background (medium/okay)
 * - Score < 50: Gray background (low/needs attention)
 *
 * @example
 * ```tsx
 * {
 *   id: 'score',
 *   header: 'Score',
 *   accessor: (row) => <ScoreBadge score={row.score} />,
 * }
 * ```
 *
 * @example
 * // Custom thresholds
 * <ScoreBadge score={65} thresholds={{ high: 90, medium: 60 }} />
 */
export function ScoreBadge({
  score,
  thresholds = { high: 80, medium: 50 },
  className,
}: ScoreBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center w-10 h-6 text-xs font-semibold rounded',
        score >= thresholds.high && 'bg-success-light text-primary',
        score >= thresholds.medium && score < thresholds.high && 'bg-warning-light text-primary',
        score < thresholds.medium && 'bg-muted-bg text-primary',
        className
      )}
    >
      {score}
    </span>
  )
}

export default ScoreBadge
