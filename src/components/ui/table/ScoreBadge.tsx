import * as React from "react"
import { cn } from "../../../lib/utils"

// ============== CONSTANTS ==============

/** Default threshold for high/good scores (green) */
const DEFAULT_HIGH_THRESHOLD = 80

/** Default threshold for medium/okay scores (yellow) */
const DEFAULT_MEDIUM_THRESHOLD = 50

/** Badge dimensions */
const BADGE_WIDTH_CLASS = "w-10"
const BADGE_HEIGHT_CLASS = "h-6"

// ============== TYPES ==============

export interface ScoreBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Score value (0-100) */
  score: number
  /** Custom thresholds (defaults: high=80, medium=50) */
  thresholds?: {
    high: number
    medium: number
  }
}

// ============== COMPONENTS ==============

/**
 * ScoreBadge - Color-coded numeric score badge for data tables
 *
 * @component ATOM
 *
 * Displays numeric scores with semantic color-coded backgrounds based on configurable thresholds.
 * Ensures WCAG AAA contrast (12.31:1+) by always using text-primary on muted backgrounds.
 *
 * Color mapping:
 * - Score >= high threshold: `bg-success-light` (green - good performance)
 * - Score >= medium threshold: `bg-warning-light` (yellow - needs attention)
 * - Score < medium threshold: `bg-muted-bg` (gray - low/poor)
 *
 * @example
 * ```tsx
 * // Basic usage in DataTable column
 * {
 *   id: "score",
 *   header: "Score",
 *   accessor: (row) => <ScoreBadge score={row.score} />,
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Custom thresholds
 * <ScoreBadge score={65} thresholds={{ high: 90, medium: 60 }} />
 * ```
 *
 * @testing
 * - `data-slot="score-badge"` - Root badge element
 *
 * @accessibility
 * - Uses text-primary for WCAG AAA contrast ratios
 * - Semantic background colors convey meaning through color alone - consider adding aria-label for screen readers
 */
export function ScoreBadge({
  score,
  thresholds = { high: DEFAULT_HIGH_THRESHOLD, medium: DEFAULT_MEDIUM_THRESHOLD },
  className,
  ...props
}: ScoreBadgeProps) {
  const isHigh = score >= thresholds.high
  const isMedium = score >= thresholds.medium && score < thresholds.high
  const isLow = score < thresholds.medium

  return (
    <span
      data-slot="score-badge"
      className={cn(
        "inline-flex items-center justify-center text-xs font-semibold rounded",
        BADGE_WIDTH_CLASS,
        BADGE_HEIGHT_CLASS,
        isHigh && "bg-success-light text-primary",
        isMedium && "bg-warning-light text-primary",
        isLow && "bg-muted-bg text-primary",
        className
      )}
      {...props}
    >
      {score}
    </span>
  )
}

ScoreBadge.displayName = "ScoreBadge"

export default ScoreBadge
