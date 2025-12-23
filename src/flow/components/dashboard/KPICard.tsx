/**
 * KPI Card - Enhanced metric card with icon, sparkline, and status states
 *
 * Supports:
 * - sparklineData: Array of numbers for mini trend chart (uses Recharts)
 * - isNegativeMetric: "up" trends are bad (e.g., incidents)
 * - isHero: visual prominence for most important metric (Von Restorff effect)
 * - zeroIsCelebratory: shows success state when value is 0
 * - isPositive: explicit positive state override
 * - periodProgress: 0-100% showing how far through the measurement period (temporal honesty)
 * - showStatusZones: renders gradient background zones (red/amber/green thermometer)
 * - thresholds: { warning, critical } values for zone boundaries
 */
import * as React from 'react'
import { useMemo, useId } from 'react'
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  YAxis,
  ReferenceLine,
  XAxis,
} from 'recharts'
import {
  AppCard,
  AppCardContent,
} from '../../../components/ui/app-card'
import { Badge } from '../../../components/ui/badge'
import { cn } from '../../../lib/utils'

// =============================================================================
// TYPES
// =============================================================================

interface StatusThresholds {
  /** Value at or above which status is "warning" (amber zone) */
  warning: number
  /** Value at or above which status is "critical" (red zone) */
  critical: number
}

type SparklineColor = 'success' | 'warning' | 'error' | 'accent' | 'muted'

// =============================================================================
// STATUS ZONE SPARKLINE COMPONENT (Enhanced with gradient zones)
// =============================================================================

interface SparklineProps {
  data: number[]
  color?: SparklineColor
  className?: string
  /** Progress through the period (0-100). Shows "today" marker and fades future */
  periodProgress?: number
  /** Enable vertical status zone gradient background */
  showStatusZones?: boolean
  /** Thresholds for status zones (required if showStatusZones is true) */
  thresholds?: StatusThresholds
  /** If true, lower values are better (0 injuries = good) */
  invertZones?: boolean
}

// Color mapping to CSS variables
const colorMap: Record<string, { stroke: string; fill: string; gradient: string }> = {
  success: {
    stroke: 'var(--color-success)',
    fill: 'url(#sparklineGradientSuccess)',
    gradient: 'var(--color-success)',
  },
  warning: {
    stroke: 'var(--color-warning)',
    fill: 'url(#sparklineGradientWarning)',
    gradient: 'var(--color-warning)',
  },
  error: {
    stroke: 'var(--color-error)',
    fill: 'url(#sparklineGradientError)',
    gradient: 'var(--color-error)',
  },
  accent: {
    stroke: 'var(--color-accent)',
    fill: 'url(#sparklineGradientAccent)',
    gradient: 'var(--color-accent)',
  },
  muted: {
    stroke: 'var(--color-text-muted)',
    fill: 'url(#sparklineGradientMuted)',
    gradient: 'var(--color-text-muted)',
  },
}

// Status zone colors (using design system tokens)
const ZONE_COLORS = {
  success: 'var(--brand-harbor-500)',  // Green - target achieved
  warning: 'var(--brand-sunrise-500)', // Amber - caution
  error: 'var(--brand-coral-500)',     // Red - critical
}

function Sparkline({
  data,
  color = 'accent',
  className,
  periodProgress,
  showStatusZones = false,
  thresholds,
  invertZones = false,
}: SparklineProps) {
  // Generate unique IDs for gradients to avoid collisions
  const instanceId = useId()

  // Transform data for Recharts
  const chartData = useMemo(
    () => data.map((value, index) => ({ index, value })),
    [data]
  )

  if (!data || data.length < 2) return null

  const colors = colorMap[color]
  const gradientId = `sparkline-${instanceId}-fill`
  const statusZoneId = `sparkline-${instanceId}-zones`
  const futureClipId = `sparkline-${instanceId}-future`

  // Calculate domain with padding for visual appeal
  const minValue = Math.min(...data)
  const maxValue = Math.max(...data)
  const range = maxValue - minValue || 1
  const padding = range * 0.15

  // Calculate "today" position based on periodProgress
  const todayIndex = periodProgress !== undefined
    ? Math.floor((periodProgress / 100) * (data.length - 1))
    : data.length - 1

  // Calculate zone boundaries as percentages of the Y-axis
  const getZoneStops = () => {
    if (!thresholds) return []

    const domainMin = minValue - padding
    const domainMax = maxValue + padding
    const domainRange = domainMax - domainMin

    // Convert threshold values to percentages (0% = top, 100% = bottom in SVG)
    const warningPct = 1 - ((thresholds.warning - domainMin) / domainRange)
    const criticalPct = 1 - ((thresholds.critical - domainMin) / domainRange)

    if (invertZones) {
      // For negative metrics (injuries): top = bad (red), bottom = good (green)
      return [
        { offset: '0%', color: ZONE_COLORS.error, opacity: 0.15 },
        { offset: `${Math.max(0, Math.min(100, criticalPct * 100))}%`, color: ZONE_COLORS.error, opacity: 0.15 },
        { offset: `${Math.max(0, Math.min(100, criticalPct * 100))}%`, color: ZONE_COLORS.warning, opacity: 0.12 },
        { offset: `${Math.max(0, Math.min(100, warningPct * 100))}%`, color: ZONE_COLORS.warning, opacity: 0.12 },
        { offset: `${Math.max(0, Math.min(100, warningPct * 100))}%`, color: ZONE_COLORS.success, opacity: 0.1 },
        { offset: '100%', color: ZONE_COLORS.success, opacity: 0.1 },
      ]
    } else {
      // For positive metrics: top = good (green), bottom = bad (red)
      return [
        { offset: '0%', color: ZONE_COLORS.success, opacity: 0.1 },
        { offset: `${Math.max(0, Math.min(100, criticalPct * 100))}%`, color: ZONE_COLORS.success, opacity: 0.1 },
        { offset: `${Math.max(0, Math.min(100, criticalPct * 100))}%`, color: ZONE_COLORS.warning, opacity: 0.12 },
        { offset: `${Math.max(0, Math.min(100, warningPct * 100))}%`, color: ZONE_COLORS.warning, opacity: 0.12 },
        { offset: `${Math.max(0, Math.min(100, warningPct * 100))}%`, color: ZONE_COLORS.error, opacity: 0.15 },
        { offset: '100%', color: ZONE_COLORS.error, opacity: 0.15 },
      ]
    }
  }

  const zoneStops = showStatusZones ? getZoneStops() : []

  return (
    <div className={cn('w-full h-full relative', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            {/* Status zone gradient background */}
            {showStatusZones && zoneStops.length > 0 && (
              <linearGradient id={statusZoneId} x1="0" y1="0" x2="0" y2="1">
                {zoneStops.map((stop, i) => (
                  <stop
                    key={i}
                    offset={stop.offset}
                    stopColor={stop.color}
                    stopOpacity={stop.opacity}
                  />
                ))}
              </linearGradient>
            )}

            {/* Line fill gradient */}
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.gradient} stopOpacity={0.4} />
              <stop offset="100%" stopColor={colors.gradient} stopOpacity={0.05} />
            </linearGradient>

            {/* Clip path for future fade (when periodProgress is set) */}
            {periodProgress !== undefined && periodProgress < 100 && (
              <clipPath id={futureClipId}>
                <rect
                  x="0"
                  y="0"
                  width={`${periodProgress}%`}
                  height="100%"
                />
              </clipPath>
            )}
          </defs>

          {/* Status zone background rectangle */}
          {showStatusZones && (
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill={`url(#${statusZoneId})`}
            />
          )}

          <XAxis dataKey="index" hide />
          <YAxis
            domain={[minValue - padding, maxValue + padding]}
            hide
          />

          {/* "Today" marker line */}
          {periodProgress !== undefined && periodProgress < 100 && (
            <ReferenceLine
              x={todayIndex}
              stroke="var(--color-text-muted)"
              strokeWidth={1}
              strokeDasharray="3 3"
              label={{
                value: 'now',
                position: 'top',
                fill: 'var(--color-text-muted)',
                fontSize: 9,
              }}
            />
          )}

          {/* Main area - shows only actual data up to "now" */}
          <Area
            type="monotone"
            dataKey="value"
            stroke={colors.stroke}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
            clipPath={periodProgress !== undefined && periodProgress < 100
              ? `url(#${futureClipId})`
              : undefined
            }
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// =============================================================================
// KPI CARD TYPES
// =============================================================================

export type KPIStatus = 'success' | 'warning' | 'critical' | 'neutral'

export interface KPICardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: string
  trendDirection?: 'up' | 'down' | 'neutral'
  sparklineData?: number[] // Historical data points for mini chart
  isNegativeMetric?: boolean // When true, "up" is bad (e.g., more incidents)
  isPositive?: boolean // For contextual positive states (e.g., "No LTI on record")
  isHero?: boolean // Visual prominence (Von Restorff effect)
  zeroIsCelebratory?: boolean // When true and value is 0, show success state
  /** Progress through measurement period (0-100). Shows "today" marker when < 100 */
  periodProgress?: number
  /** Enable status zone gradient background on sparkline */
  showStatusZones?: boolean
  /** Thresholds for status zones (required if showStatusZones is true) */
  thresholds?: StatusThresholds
  /** Custom status message for each state */
  statusMessages?: {
    success?: string
    warning?: string
    critical?: string
  }
}

// Helper to determine current status based on value and thresholds
function getCurrentStatus(
  value: string | number,
  thresholds?: StatusThresholds,
  isNegativeMetric?: boolean,
  zeroIsCelebratory?: boolean
): KPIStatus {
  const numValue = typeof value === 'string' ? parseFloat(value) : value

  // Zero celebration overrides thresholds
  if (zeroIsCelebratory && numValue === 0) return 'success'

  if (!thresholds) return 'neutral'

  if (isNegativeMetric) {
    // For negative metrics: lower is better
    if (numValue >= thresholds.critical) return 'critical'
    if (numValue >= thresholds.warning) return 'warning'
    return 'success'
  } else {
    // For positive metrics: higher is better (inverse thresholds)
    if (numValue <= thresholds.critical) return 'critical'
    if (numValue <= thresholds.warning) return 'warning'
    return 'success'
  }
}

// Status icon mapping
const STATUS_ICONS = {
  success: CheckCircle2,
  warning: AlertTriangle,
  critical: XCircle,
  neutral: null,
}

// Default status messages
const DEFAULT_STATUS_MESSAGES = {
  success: 'Excellent - target achieved',
  warning: 'Needs attention',
  critical: 'Critical - action required',
}

export function KPICard({
  title,
  value,
  description,
  icon,
  trend,
  trendDirection,
  sparklineData,
  isNegativeMetric = false,
  isPositive = false,
  isHero = false,
  zeroIsCelebratory = false,
  periodProgress,
  showStatusZones = false,
  thresholds,
  statusMessages,
}: KPICardProps) {
  // Check if this is a celebratory zero state
  const isCelebratoryZero = zeroIsCelebratory && (value === 0 || value === '0')

  // Compute current status from thresholds
  const currentStatus = getCurrentStatus(value, thresholds, isNegativeMetric, zeroIsCelebratory)
  const hasThresholdStatus = thresholds && currentStatus !== 'neutral'

  // Determine badge variant based on metric type
  const getBadgeVariant = () => {
    if (!trend || !trendDirection) return 'secondary'
    if (trendDirection === 'neutral') return 'secondary'

    // For negative metrics (incidents, errors), up is bad
    if (isNegativeMetric) {
      return trendDirection === 'up' ? 'destructive' : 'success'
    }
    // For positive metrics (completions, revenue), up is good
    return trendDirection === 'up' ? 'success' : 'destructive'
  }

  // Determine sparkline color based on current status or trend
  const getSparklineColor = (): SparklineColor => {
    // If we have threshold-based status, use that
    if (hasThresholdStatus) {
      if (currentStatus === 'critical') return 'error'
      if (currentStatus === 'warning') return 'warning'
      if (currentStatus === 'success') return 'success'
    }

    // Fall back to trend-based coloring
    if (isCelebratoryZero || isPositive) return 'success'
    if (!trendDirection || trendDirection === 'neutral') return 'muted'

    // For negative metrics, down is good
    if (isNegativeMetric) {
      return trendDirection === 'down' ? 'success' : 'error'
    }
    // For positive metrics, up is good
    return trendDirection === 'up' ? 'success' : 'error'
  }

  // Determine visual state
  const showSuccess = isPositive || isCelebratoryZero || currentStatus === 'success'
  const showWarning = currentStatus === 'warning'
  const showCritical = currentStatus === 'critical'

  // Get status message
  const getStatusMessage = () => {
    if (isCelebratoryZero) {
      return statusMessages?.success || DEFAULT_STATUS_MESSAGES.success
    }
    if (hasThresholdStatus) {
      return statusMessages?.[currentStatus] || DEFAULT_STATUS_MESSAGES[currentStatus] || description
    }
    return description
  }

  // Get status icon
  const StatusIcon = hasThresholdStatus ? STATUS_ICONS[currentStatus] : null

  // Determine text/icon colors based on status
  const getStatusColorClasses = () => {
    if (showSuccess || isCelebratoryZero) return 'text-success'
    if (showWarning) return 'text-warning-dark'
    if (showCritical) return 'text-error'
    return 'text-muted'
  }

  // Determine ring color based on status
  const getRingClasses = () => {
    if (isCelebratoryZero || (hasThresholdStatus && currentStatus === 'success')) {
      return 'ring-2 ring-success/20 dark:ring-success/30'
    }
    if (showWarning) {
      return 'ring-2 ring-warning/30 dark:ring-warning/40'
    }
    if (showCritical) {
      return 'ring-2 ring-error/30 dark:ring-error/40'
    }
    if (isHero) {
      return 'ring-2 ring-accent-strong/20 dark:ring-accent-strong/30'
    }
    return ''
  }

  return (
    <AppCard
      variant="default"
      shadow={isHero ? 'lg' : 'md'}
      className={cn(
        'h-full overflow-hidden relative !py-0',
        // Smooth transitions for state changes
        'transition-all duration-300 ease-out',
        getRingClasses()
      )}
    >
      {/* Sparkline - positioned at card level, flush with bottom */}
      {sparklineData && sparklineData.length >= 2 && (
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-0">
          <Sparkline
            data={sparklineData}
            color={getSparklineColor()}
            periodProgress={periodProgress}
            showStatusZones={showStatusZones}
            thresholds={thresholds}
            invertZones={isNegativeMetric}
          />
        </div>
      )}

      <AppCardContent className={cn('px-5 pt-4 pb-5 relative z-10', isHero && 'px-6 pt-4 pb-6')}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Title row - badge on separate line for hero cards to prevent truncation */}
            <div className="mb-1">
              <p className={cn(
                'text-sm font-medium',
                isHero ? 'text-primary' : 'text-muted'
              )}>
                {title}
              </p>
              {isHero && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 mt-1">
                  Key Metric
                </Badge>
              )}
            </div>
            {/* Value display with transition */}
            <div className="flex items-baseline gap-2 mt-2">
              <span className={cn(
                'font-bold',
                // Use normal font feature settings to avoid slashed zero
                'font-sans',
                'transition-colors duration-300',
                isHero ? 'text-4xl' : 'text-3xl',
                showSuccess ? 'text-success' : showWarning ? 'text-warning-dark' : showCritical ? 'text-error' : 'text-primary'
              )}>
                {value}
              </span>
              {trend && (
                <Badge variant={getBadgeVariant()} className="text-xs">
                  {trend}
                </Badge>
              )}
            </div>
            {/* Status message with frosted glass background for contrast */}
            {(description || isCelebratoryZero || hasThresholdStatus) && (
              <div className={cn(
                'inline-flex items-center gap-1.5 mt-2 px-2 py-1 rounded-md',
                'transition-all duration-300',
                // Frosted glass effect for text contrast against sparkline
                'bg-white/80 dark:bg-abyss-800/80 backdrop-blur-sm',
                getStatusColorClasses()
              )}>
                {(StatusIcon || isCelebratoryZero) && (
                  <span className="flex-shrink-0 transition-transform duration-300">
                    {isCelebratoryZero ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : StatusIcon ? (
                      <StatusIcon className="w-4 h-4" />
                    ) : null}
                  </span>
                )}
                <p className="text-xs font-medium">
                  {getStatusMessage()}
                </p>
              </div>
            )}
          </div>
          {/* Icon - show status icon when threshold-based, otherwise provided icon */}
          {(icon || isCelebratoryZero || hasThresholdStatus) && (
            <div className={cn(
              'flex-shrink-0 p-2.5 rounded-xl transition-all duration-300',
              showSuccess || isCelebratoryZero
                ? 'bg-[var(--brand-harbor-100)] text-success dark:bg-[var(--brand-harbor-900)] dark:text-[var(--brand-harbor-400)]'
                : showWarning
                ? 'bg-[var(--brand-sunrise-100)] text-warning-dark dark:bg-[var(--brand-sunrise-900)] dark:text-[var(--brand-sunrise-400)]'
                : showCritical
                ? 'bg-[var(--brand-coral-100)] text-error dark:bg-[var(--brand-coral-900)] dark:text-[var(--brand-coral-400)]'
                : isHero
                ? 'bg-accent-bg text-accent-strong'
                : 'bg-muted-bg text-secondary'
            )}>
              {isCelebratoryZero ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : hasThresholdStatus && StatusIcon ? (
                <StatusIcon className="w-5 h-5" />
              ) : icon}
            </div>
          )}
        </div>
      </AppCardContent>
    </AppCard>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export type { StatusThresholds, SparklineProps }
