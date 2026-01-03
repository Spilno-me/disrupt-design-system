/**
 * SafetyScoreCard - Display location safety score with visual indicators
 *
 * Shows a 0-100 safety score with:
 * - Circular progress indicator
 * - Trend direction with sparkline
 * - Color-coded status (critical/warning/good)
 * - Optional location name context
 *
 * Follows KPICard design pattern from dashboard.
 */

import * as React from 'react'
import { useMemo } from 'react'
import { Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { AreaChart, Area, YAxis } from 'recharts'
import { cn } from '../../../../lib/utils'
import {
  AppCard,
  AppCardContent,
} from '../../../../components/ui/app-card'
import {
  ChartContainer,
  type ChartConfig,
} from '../../../../components/ui/chart'
import type { SafetyScoreCardProps, RiskTrend } from './types'
import { DEFAULT_SAFETY_THRESHOLDS } from './types'

// =============================================================================
// HELPERS
// =============================================================================

type ScoreCategory = 'critical' | 'warning' | 'good'

function getScoreCategory(
  score: number,
  thresholds = DEFAULT_SAFETY_THRESHOLDS
): ScoreCategory {
  if (score < thresholds.critical) return 'critical'
  if (score < thresholds.warning) return 'warning'
  return 'good'
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 80) return 'Good'
  if (score >= 70) return 'Fair'
  if (score >= 60) return 'Needs Attention'
  if (score >= 40) return 'At Risk'
  return 'Critical'
}

const CATEGORY_COLORS: Record<ScoreCategory, {
  text: string
  bg: string
  ring: string
  gradient: string
}> = {
  good: {
    text: 'text-success',
    bg: 'bg-success/10',
    ring: 'ring-success/30',
    gradient: 'var(--color-success)',
  },
  warning: {
    text: 'text-warning-dark',
    bg: 'bg-warning/10',
    ring: 'ring-warning/30',
    gradient: 'var(--color-warning)',
  },
  critical: {
    text: 'text-error',
    bg: 'bg-error/10',
    ring: 'ring-error/30',
    gradient: 'var(--color-error)',
  },
}

// =============================================================================
// SPARKLINE
// =============================================================================

interface SparklineProps {
  data: number[]
  category: ScoreCategory
}

/** Build ChartConfig for sparkline based on score category */
function buildSparklineConfig(category: ScoreCategory): ChartConfig {
  const colors = CATEGORY_COLORS[category]
  return {
    value: {
      label: 'Score',
      color: colors.gradient,
    },
  }
}

function Sparkline({ data, category }: SparklineProps) {
  const chartData = useMemo(
    () => data.map((value, index) => ({ index, value })),
    [data]
  )

  const chartConfig = useMemo(() => buildSparklineConfig(category), [category])

  if (!data || data.length < 2) return null

  const minValue = Math.min(...data)
  const maxValue = Math.max(...data)
  const range = maxValue - minValue || 1
  const padding = range * 0.15

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <AreaChart
        data={chartData}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="fill-value" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <YAxis domain={[minValue - padding, maxValue + padding]} hide />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--color-value)"
          strokeWidth={2}
          fill="url(#fill-value)"
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}

// =============================================================================
// TREND INDICATOR
// =============================================================================

function TrendIndicator({
  trend,
  percentage,
}: {
  trend: RiskTrend
  percentage: number
}) {
  const Icon = trend === 'improving'
    ? TrendingDown
    : trend === 'worsening'
      ? TrendingUp
      : Minus

  const colorClass = trend === 'improving'
    ? 'text-success'
    : trend === 'worsening'
      ? 'text-error'
      : 'text-tertiary'

  return (
    <div className={cn('flex items-center gap-1 text-xs', colorClass)}>
      <Icon className="size-3.5" />
      {percentage !== 0 && (
        <span className="font-medium tabular-nums">
          {percentage > 0 ? '+' : ''}
          {percentage}%
        </span>
      )}
    </div>
  )
}

// =============================================================================
// CIRCULAR PROGRESS
// =============================================================================

function CircularProgress({
  score,
  category,
  size = 80,
}: {
  score: number
  category: ScoreCategory
  size?: number
}) {
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const colors = CATEGORY_COLORS[category]

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted-bg"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className={cn('transition-all duration-500', colors.text)}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-2xl font-bold tabular-nums', colors.text)}>
          {score}
        </span>
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function SafetyScoreCard({
  score,
  thresholds = DEFAULT_SAFETY_THRESHOLDS,
  trend,
  trendPercentage,
  sparklineData,
  locationName,
  className,
}: SafetyScoreCardProps) {
  const category = getScoreCategory(score, thresholds)
  const colors = CATEGORY_COLORS[category]
  const label = getScoreLabel(score)

  return (
    <AppCard
      variant="default"
      shadow="md"
      className={cn(
        'overflow-hidden relative',
        `ring-2 ${colors.ring}`,
        className
      )}
    >
      {/* Sparkline background */}
      {sparklineData && sparklineData.length >= 2 && (
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-0">
          <Sparkline data={sparklineData} category={category} />
        </div>
      )}

      <AppCardContent className="relative z-10 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={cn('p-1.5 rounded-lg', colors.bg)}>
              <Shield className={cn('size-4', colors.text)} />
            </div>
            <span className="text-sm font-medium text-primary">
              Safety Score
            </span>
          </div>
          {trend && (
            <TrendIndicator trend={trend} percentage={trendPercentage || 0} />
          )}
        </div>

        {/* Score display */}
        <div className="flex items-center gap-4">
          <CircularProgress score={score} category={category} />
          <div className="flex-1 min-w-0">
            <p className={cn('text-lg font-semibold', colors.text)}>
              {label}
            </p>
            {locationName && (
              <p className="text-xs text-tertiary truncate mt-0.5">
                {locationName}
              </p>
            )}
            <p className="text-xs text-tertiary mt-2">
              {score < thresholds.critical
                ? 'Immediate attention required'
                : score < thresholds.warning
                  ? 'Monitor and improve'
                  : 'Maintain current practices'}
            </p>
          </div>
        </div>
      </AppCardContent>
    </AppCard>
  )
}

SafetyScoreCard.displayName = 'SafetyScoreCard'

export default SafetyScoreCard
