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
 * Text color choices based on WCAG contrast requirements:
 * - Dark fills (red): Use white text (4.79:1 contrast)
 * - Bright fills (orange, yellow, green): Use dark text for readability
 * - Teal fill: Use dark text (white only gets 3.57:1)
 *
 * WCAG AA requires 4.5:1 for normal text, 3:1 for UI components.
 * These small badges with "!", "!!" text need readable contrast.
 */
const severityConfig: Record<SeverityLevel, SeverityConfig> = {
  critical: {
    fill: 'var(--color-error)',
    stroke: 'var(--color-error-light)',
    text: '',
    textColor: 'var(--brand-white)',  // White on red: 4.79:1 ✓
    showFlame: true,
    label: 'Critical',
  },
  high: {
    fill: 'var(--color-aging)',       // Orange for high priority
    stroke: 'var(--color-aging-light)',
    text: '!!!',
    textColor: 'var(--brand-abyss-900)',  // Dark on orange for contrast
    showFlame: false,
    label: 'High',
  },
  medium: {
    fill: 'var(--color-warning)',
    stroke: 'var(--color-warning-light)',
    text: '!!',
    textColor: 'var(--brand-abyss-900)',  // Dark on yellow for contrast
    showFlame: false,
    label: 'Medium',
  },
  low: {
    fill: 'var(--color-success)',
    stroke: 'var(--color-success-light)',
    text: '!',
    textColor: 'var(--brand-abyss-900)',  // Dark on green for contrast
    showFlame: false,
    label: 'Low',
  },
  none: {
    fill: 'var(--color-accent-strong)',
    stroke: 'var(--color-accent-bg)',
    text: '--',
    textColor: 'var(--brand-abyss-900)',  // Dark on teal for contrast
    showFlame: false,
    label: 'None',
  },
}

// =============================================================================
// SUBCOMPONENTS
// =============================================================================

/** Squircle background shape */
const SquircleBackground: React.FC<{
  fill: string
  stroke: string
  size: 'sm' | 'md'
}> = ({ fill, stroke, size }) => {
  const dimensions = size === 'sm'
    ? { width: 24, height: 20, viewBox: '0 0 30 25' }
    : { width: 30, height: 25, viewBox: '0 0 30 25' }

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
      <path
        d="M15 3.125C24 3.125 26.25 5 26.25 12.5C26.25 20 24 21.875 15 21.875C6 21.875 3.75 20 3.75 12.5C3.75 5 6 3.125 15 3.125Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="2"
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

  const dimensions = size === 'sm'
    ? { width: 24, height: 20 }
    : { width: 30, height: 25 }

  const fontSize = size === 'sm' ? 11 : 14

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
          size={size === 'sm' ? 12 : 14}
          color={config.textColor}
          fill={config.textColor}
          aria-hidden="true"
        />
      ) : (
        <span
          className="relative z-10 font-medium leading-none select-none"
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
