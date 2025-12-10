import * as React from 'react'
import { Flame } from 'lucide-react'
import { cn } from '../../lib/utils'
import { CORAL, ORANGE, SUNRISE, HARBOR, DEEP_CURRENT } from '../../constants/designTokens'

// =============================================================================
// TYPES
// =============================================================================

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'none'

export interface SeverityIndicatorProps {
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
    fill: CORAL[600],      // #DC2626
    stroke: CORAL[200],    // #FECACA
    text: '',
    textColor: '#FFFFFF',
    showFlame: true,
    label: 'Critical',
  },
  high: {
    fill: ORANGE[500],     // #F97316
    stroke: ORANGE[200],   // #FED7AA
    text: '!!!',
    textColor: '#FFFFFF',
    showFlame: false,
    label: 'High',
  },
  medium: {
    fill: SUNRISE[500],    // #EAB308
    stroke: ORANGE[200],   // #FED7AA (matches Figma)
    text: '!!',
    textColor: '#FFFFFF',
    showFlame: false,
    label: 'Medium',
  },
  low: {
    fill: HARBOR[500],     // #22C55E
    stroke: HARBOR[200],   // #BBF7D0
    text: '!',
    textColor: '#FFFFFF',
    showFlame: false,
    label: 'Low',
  },
  none: {
    fill: DEEP_CURRENT[200], // #67E8F9 (cyan-300 equivalent)
    stroke: DEEP_CURRENT[100], // #A5F3FC (cyan-200 equivalent)
    text: '--',
    textColor: DEEP_CURRENT[500], // #06B6D4
    showFlame: false,
    label: 'None',
  },
}

// Override none colors to match Figma exactly (uses cyan palette not in our tokens)
severityConfig.none.fill = '#67E8F9'
severityConfig.none.stroke = '#A5F3FC'
severityConfig.none.textColor = '#06B6D4'

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
 * @example
 * ```tsx
 * // Critical - shows flame icon
 * <SeverityIndicator level="critical" />
 *
 * // High priority - shows "!!!"
 * <SeverityIndicator level="high" />
 *
 * // Medium priority - shows "!!"
 * <SeverityIndicator level="medium" />
 *
 * // Low priority - shows "!"
 * <SeverityIndicator level="low" />
 *
 * // No priority - shows "--"
 * <SeverityIndicator level="none" />
 *
 * // Small size variant
 * <SeverityIndicator level="high" size="sm" />
 * ```
 */
export function SeverityIndicator({
  level,
  className,
  size = 'md',
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
            fontFamily: 'Fixel Text, sans-serif',
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

export default SeverityIndicator
