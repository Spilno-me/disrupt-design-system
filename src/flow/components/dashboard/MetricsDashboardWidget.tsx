/**
 * MetricsDashboardWidget - Monday.com-style multi-metric widget
 *
 * Displays multiple related metrics in a horizontal row with a shared chart below.
 * Designed for executive dashboards where quick scanning of related KPIs is important.
 *
 * Design Reference: Monday.com dashboard widgets
 * Features:
 * - Multiple metrics in horizontal row with colored dot indicators
 * - Large typography for values with inline trend badges
 * - Shared multi-line chart at bottom
 * - Optional gradient border accent
 *
 * @example
 * <MetricsDashboardWidget
 *   metrics={[
 *     { label: 'Scope', value: 356, trend: '+32%', color: 'info' },
 *     { label: 'Started', value: 64, color: 'warning' },
 *     { label: 'Completed', value: 192, color: 'success' },
 *   ]}
 *   chartData={[
 *     { date: 'Nov 15', scope: 280, started: 40, completed: 150 },
 *     { date: 'Dec 15', scope: 310, started: 52, completed: 168 },
 *   ]}
 * />
 */
import * as React from 'react'
import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { cn } from '../../../lib/utils'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
  DDS_CHART_COLORS,
} from '../../../components/ui/chart'

// =============================================================================
// TYPES
// =============================================================================

/** Semantic color options for metric indicators - maps to DDS semantic tokens */
export type MetricColor = 'info' | 'warning' | 'success' | 'error' | 'accent' | 'secondary' | 'aging'

/** Individual metric configuration */
export interface MetricItem {
  /** Display label (e.g., "Scope", "Completed") */
  label: string
  /** Numeric value */
  value: number
  /** Optional trend indicator (e.g., "+32%", "-5%") */
  trend?: string
  /** Whether trend is positive (affects color). Defaults to true if trend starts with '+' */
  trendPositive?: boolean
  /** Indicator dot color - uses DDS semantic colors */
  color: MetricColor
  /** Key to match in chartData (defaults to lowercase label) */
  dataKey?: string
}

/** Chart data point - must include date and metric values */
export interface ChartDataPoint {
  /** X-axis label */
  date: string
  /** Metric values - keys should match metric dataKeys */
  [key: string]: string | number
}

/** Border style variants */
export type BorderStyle = 'default' | 'glass' | 'glass-gradient'

export interface MetricsDashboardWidgetProps {
  /** Metrics to display in horizontal row */
  metrics: MetricItem[]
  /** Time series data for the chart */
  chartData?: ChartDataPoint[]
  /** Show gradient border accent (deprecated, use borderStyle='gradient') */
  showGradientBorder?: boolean
  /** Border style variant: 'default', 'gradient', or 'glass' */
  borderStyle?: BorderStyle
  /** Chart height in pixels */
  chartHeight?: number
  /** Show area fill under lines */
  showAreaFill?: boolean
  /** Additional CSS classes */
  className?: string
  /** Optional header action (e.g., settings button) */
  headerAction?: React.ReactNode
}

// =============================================================================
// COLOR MAPPING - Uses DDS semantic tokens via shadcn Chart
// =============================================================================

/** Maps metric colors to Tailwind dot classes */
const DOT_CLASS_MAP: Record<MetricColor, string> = {
  info: 'bg-info',
  warning: 'bg-warning',
  success: 'bg-success',
  error: 'bg-error',
  accent: 'bg-accent-strong',
  secondary: 'bg-secondary',
  aging: 'bg-aging',
}

/** Build ChartConfig from metrics array */
function buildChartConfig(metrics: MetricItem[]): ChartConfig {
  return metrics.reduce((config, metric) => {
    const key = metric.dataKey || metric.label.toLowerCase()
    const colorDef = DDS_CHART_COLORS[metric.color as keyof typeof DDS_CHART_COLORS]
    config[key] = {
      label: metric.label,
      color: colorDef?.color || 'var(--color-accent)',
    }
    return config
  }, {} as ChartConfig)
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/** Metric item with dot indicator, label, and value */
function MetricDisplay({ metric }: { metric: MetricItem }) {
  const dotClass = DOT_CLASS_MAP[metric.color]

  // Determine if trend is positive (default: check if starts with '+')
  const isPositive = metric.trendPositive ?? (metric.trend?.startsWith('+') ?? true)

  return (
    <div className="flex flex-col gap-1">
      {/* Label row with dot indicator */}
      <div className="flex items-center gap-2">
        <span className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0', dotClass)} />
        <span className="text-sm text-secondary font-medium">{metric.label}</span>
      </div>
      {/* Value row with optional trend */}
      <div className="flex items-baseline gap-2 pl-[18px]">
        <span className="text-3xl font-bold text-primary tabular-nums">
          {metric.value.toLocaleString()}
        </span>
        {metric.trend && (
          <span
            className={cn(
              'text-sm font-semibold',
              isPositive ? 'text-success' : 'text-error'
            )}
          >
            {metric.trend}
          </span>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function MetricsDashboardWidget({
  metrics,
  chartData,
  showGradientBorder = false,
  borderStyle,
  chartHeight = 160,
  showAreaFill = true,
  className,
  headerAction,
}: MetricsDashboardWidgetProps) {
  // Resolve border style (glass is the default, glass-gradient adds accent stripe)
  const resolvedBorderStyle: BorderStyle = borderStyle ?? (showGradientBorder ? 'glass-gradient' : 'glass')

  // Build chart config from metrics (memoized for performance)
  const chartConfig = useMemo(() => buildChartConfig(metrics), [metrics])

  // Compute chart domain for consistent Y-axis
  const chartDomain = useMemo(() => {
    if (!chartData?.length) return [0, 100]
    const allValues = chartData.flatMap((point) =>
      metrics.map((m) => {
        const key = m.dataKey || m.label.toLowerCase()
        return typeof point[key] === 'number' ? point[key] : 0
      })
    )
    const max = Math.max(...(allValues as number[]))
    return [0, Math.ceil(max * 1.1)]
  }, [chartData, metrics])

  // Content rendering (shared between styles)
  const renderContent = () => (
    <>
      {/* Header with optional action */}
      {headerAction && (
        <div className="flex items-center justify-end px-5 pt-4">
          {headerAction}
        </div>
      )}

      {/* Metrics row - evenly distributed */}
      <div
        className={cn(
          'grid gap-4 px-6',
          headerAction ? 'pt-2 pb-5' : 'pt-6 pb-5',
          // Dynamic columns based on metric count
          metrics.length === 2 && 'grid-cols-2',
          metrics.length === 3 && 'grid-cols-3',
          metrics.length >= 4 && 'grid-cols-4'
        )}
      >
        {metrics.map((metric) => (
          <MetricDisplay key={metric.label} metric={metric} />
        ))}
      </div>

      {/* Chart area - uses shadcn ChartContainer for consistent styling */}
      {chartData && chartData.length > 0 && (
        <div className="px-4 pb-5">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto w-full"
            style={{ height: chartHeight }}
          >
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 16, left: 24, bottom: 0 }}
            >
              <defs>
                {metrics.map((metric) => {
                  const key = metric.dataKey || metric.label.toLowerCase()
                  return (
                    <linearGradient
                      key={key}
                      id={`fill-${key}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={`var(--color-${key})`} stopOpacity={showAreaFill ? 0.2 : 0} />
                      <stop offset="100%" stopColor={`var(--color-${key})`} stopOpacity={showAreaFill ? 0.02 : 0} />
                    </linearGradient>
                  )
                })}
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border-subtle)"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--color-text-muted)', fontSize: 11, fontWeight: 500 }}
                dy={8}
                tickMargin={4}
              />

              <YAxis
                domain={chartDomain}
                axisLine={false}
                tickLine={false}
                tick={false}
                width={0}
              />

              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />

              {metrics.map((metric) => {
                const key = metric.dataKey || metric.label.toLowerCase()
                return (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={`var(--color-${key})`}
                    strokeWidth={2}
                    fill={`url(#fill-${key})`}
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: `var(--color-${key})`,
                      stroke: 'var(--color-bg-elevated)',
                      strokeWidth: 2,
                    }}
                  />
                )
              })}
            </AreaChart>
          </ChartContainer>
        </div>
      )}
    </>
  )

  // Default (non-glass) style - simple card
  if (resolvedBorderStyle === 'default') {
    return (
      <div
        className={cn(
          'relative overflow-hidden',
          'bg-elevated dark:bg-abyss-900',
          'rounded-2xl',
          'transition-all duration-200',
          'shadow-md hover:shadow-lg',
          'border border-default',
          className
        )}
      >
        {renderContent()}
      </div>
    )
  }

  // Glass styles - wrapper structure for true frosted glass effect
  // Structure: Outer wrapper > Glass layer (blur) > Gradient on right border > Content card

  return (
    <div className={cn('relative p-1.5 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200', className)}>
      {/* Glass border layer - frosted glass on all four sides, semi-transparent to show grid */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.06) 100%)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
        }}
      />

      {/* Gradient border - single stripe with rounded outer edge, fades at ends */}
      {resolvedBorderStyle === 'glass-gradient' && (
        <div
          className="absolute right-0 w-1.5"
          style={{
            top: 0,
            bottom: 0,
            borderRadius: '0 16px 16px 0',
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 5%, var(--color-accent) 20%, var(--color-success) 50%, var(--color-warning) 80%, rgba(0,0,0,0) 95%, rgba(0,0,0,0) 100%)',
          }}
        />
      )}

      {/* Content card - fills the padded area, glass border visible around it */}
      <div
        className={cn(
          'relative',
          'bg-elevated dark:bg-abyss-900',
          'rounded-xl',
          'overflow-hidden'
        )}
      >
        {renderContent()}
      </div>
    </div>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export type {
  MetricItem as MetricsDashboardWidgetMetricItem,
  ChartDataPoint as MetricsDashboardWidgetChartDataPoint,
  BorderStyle as MetricsDashboardWidgetBorderStyle,
}
