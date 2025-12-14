import * as React from 'react'
import { Flame } from 'lucide-react'
import { cn } from '../../lib/utils'
import { ALIAS } from '../../constants/designTokens'

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

interface SeverityConfig {
  fill: string
  stroke: string
  text: string
  textColor: string
  showFlame: boolean
  label: string
}

const severityConfig: Record<SeverityLevel, SeverityConfig> = {
  critical: {
    fill: ALIAS.status.error,
    stroke: ALIAS.background.error,
    text: '',
    textColor: ALIAS.text.inverse,
    showFlame: true,
    label: 'Critical',
  },
  high: {
    fill: ALIAS.feature.adapt,    // Orange/warning color
    stroke: ALIAS.background.warning,
    text: '!!!',
    textColor: ALIAS.text.inverse,
    showFlame: false,
    label: 'High',
  },
  medium: {
    fill: ALIAS.status.warning,
    stroke: ALIAS.background.warning,
    text: '!!',
    textColor: ALIAS.text.inverse,
    showFlame: false,
    label: 'Medium',
  },
  low: {
    fill: ALIAS.status.success,
    stroke: ALIAS.background.success,
    text: '!',
    textColor: ALIAS.text.inverse,
    showFlame: false,
    label: 'Low',
  },
  none: {
    fill: ALIAS.interactive.accent,    // Teal/cyan
    stroke: ALIAS.background.accent,
    text: '--',
    textColor: ALIAS.interactive.accent,
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
          className="relative z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]"
          size={size === 'sm' ? 12 : 14}
          color="white"
          fill="white"
          aria-hidden="true"
        />
      ) : (
        <span
          className="relative z-10 font-medium leading-none select-none"
          style={{
            color: config.textColor,
            fontSize,
            textShadow: '0 1px 1px rgba(0,0,0,0.3)',
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
