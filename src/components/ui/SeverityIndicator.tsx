import * as React from 'react'
import { Flame } from 'lucide-react'
import { cn } from '../../lib/utils'

// =============================================================================
// TYPES
// =============================================================================

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'none'

export interface SeverityIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Severity level to display */
  level: SeverityLevel
  /** Additional className */
  className?: string
  /** Size variant */
  size?: 'sm' | 'md'
}

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * CSS Custom Property mappings for severity colors.
 * Uses theme-aware tokens that automatically switch between light/dark mode.
 *
 * Dark mode behavior (per design system rules):
 * - Fill colors: 1 step lighter (500→400) for visibility
 * - Stroke colors: Scale inversion (50→900) for dark backgrounds
 * - Text: Always white on filled badges for contrast
 */
interface SeverityConfig {
  fill: string
  stroke: string
  text: string
  textColor: string
  showFlame: boolean
  label: string
}

/**
 * Text color choices: Darker shade of same color family for cohesive look
 * - Critical: White on red (high contrast needed for urgency)
 * - High/Medium/Low/None: Dark shade of fill color (800 level)
 *
 * Using same-family dark shades creates visual harmony while maintaining
 * good contrast for readability.
 */
const severityConfig: Record<SeverityLevel, SeverityConfig> = {
  critical: {
    fill: 'var(--color-error)',
    stroke: 'var(--color-error-light)',
    text: '',
    textColor: 'var(--brand-white)',  // White for maximum urgency contrast
    showFlame: true,
    label: 'Critical',
  },
  high: {
    fill: 'var(--color-aging)',
    stroke: 'var(--color-aging-light)',
    text: '!!!',
    textColor: 'var(--color-aging-dark)',  // Dark orange from same family
    showFlame: false,
    label: 'High',
  },
  medium: {
    fill: 'var(--color-warning)',
    stroke: 'var(--color-warning-light)',
    text: '!!',
    textColor: 'var(--color-warning-dark)',  // Dark amber from same family
    showFlame: false,
    label: 'Medium',
  },
  low: {
    fill: 'var(--color-success)',
    stroke: 'var(--color-success-light)',
    text: '!',
    textColor: 'var(--color-success-dark)',  // Dark green from same family
    showFlame: false,
    label: 'Low',
  },
  none: {
    fill: 'var(--color-accent-strong)',
    stroke: 'var(--color-accent-bg)',
    text: '––',
    textColor: 'var(--color-accent-dark)',  // Dark teal from same family
    showFlame: false,
    label: 'None',
  },
}

// =============================================================================
// SUBCOMPONENTS
// =============================================================================

/** Squircle background shape - horizontally stretched per Figma reference */
const SquircleBackground: React.FC<{
  fill: string
  stroke: string
  size: 'sm' | 'md'
}> = ({ fill, stroke, size }) => {
  // Dimensions match Figma reference: wider aspect ratio
  const dimensions = size === 'sm'
    ? { width: 32, height: 24, viewBox: '0 0 40 30' }
    : { width: 40, height: 30, viewBox: '0 0 40 30' }

  return (
    <svg
      width={dimensions.width}
      height={dimensions.height}
      viewBox={dimensions.viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0"
      aria-hidden="true"
    >
      {/* Squircle path: smooth corners with horizontal stretch */}
      <path
        d="M20 3C32 3 36 6 36 15C36 24 32 27 20 27C8 27 4 24 4 15C4 6 8 3 20 3Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// =============================================================================
// SEVERITY INDICATOR COMPONENT
// =============================================================================

/**
 * SeverityIndicator - Visual indicator for severity/priority levels
 *
 * Displays a squircle-shaped badge with color-coded severity levels.
 * Used in leads management, incident tracking, and priority displays.
 *
 * ATOM: Accepts data-testid via props. Consumer/parent component provides context-specific testId.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <SeverityIndicator level="critical" />
 * <SeverityIndicator level="high" />
 * <SeverityIndicator level="medium" />
 * <SeverityIndicator level="low" />
 * <SeverityIndicator level="none" />
 *
 * // Size variants
 * <SeverityIndicator level="high" size="sm" />
 * <SeverityIndicator level="high" size="md" />
 *
 * // With data-testid (consumer provides context)
 * <SeverityIndicator
 *   level="critical"
 *   data-testid="lead-priority-123"
 * />
 *
 * // Used in molecules (parent provides testId)
 * // LeadCard auto-generates testIds for child atoms
 * <LeadCard lead={lead} />
 * // → SeverityIndicator gets data-testid="lead-card-123-priority"
 * ```
 */
export function SeverityIndicator({
  level,
  className,
  size = 'md',
  ...props
}: SeverityIndicatorProps) {
  const config = severityConfig[level]

  // Dimensions match Figma reference: wider aspect ratio
  const dimensions = size === 'sm'
    ? { width: 32, height: 24 }
    : { width: 40, height: 30 }

  const fontSize = size === 'sm' ? 12 : 15

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center flex-shrink-0',
        className
      )}
      style={{ width: dimensions.width, height: dimensions.height }}
      role="img"
      aria-label={`Severity: ${config.label}`}
      title={config.label}
      {...props}
    >
      <SquircleBackground
        fill={config.fill}
        stroke={config.stroke}
        size={size}
      />
      {config.showFlame ? (
        <Flame
          className="relative z-10"
          size={size === 'sm' ? 14 : 18}
          color={config.textColor}
          fill={config.textColor}
          aria-hidden="true"
        />
      ) : (
        <span
          className="relative z-10 font-bold leading-none select-none tracking-tight"
          style={{
            color: config.textColor,
            fontSize,
          }}
        >
          {config.text}
        </span>
      )}
    </div>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

SeverityIndicator.displayName = "SeverityIndicator"

export default SeverityIndicator
