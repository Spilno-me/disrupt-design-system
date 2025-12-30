/**
 * ComparativeBenchmark - Compare location risk against siblings/peers
 *
 * Shows how a location's safety score compares to:
 * - Sibling locations (same parent)
 * - Company/facility average
 * - Best performer in group
 */

import * as React from 'react'
import { TrendingUp, TrendingDown, Minus, Award, Target, Users } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../../../components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/ui/tooltip'
import type { ComparativeBenchmarkProps, LocationRiskData } from './types'
import { DEFAULT_SAFETY_THRESHOLDS } from './types'

// =============================================================================
// HELPERS
// =============================================================================

type ScoreCategory = 'critical' | 'warning' | 'good'

function getScoreCategory(score: number): ScoreCategory {
  if (score < DEFAULT_SAFETY_THRESHOLDS.critical) return 'critical'
  if (score < DEFAULT_SAFETY_THRESHOLDS.warning) return 'warning'
  return 'good'
}

function getScoreColor(score: number): string {
  const category = getScoreCategory(score)
  switch (category) {
    case 'critical':
      return 'text-error'
    case 'warning':
      return 'text-warning-dark'
    default:
      return 'text-success'
  }
}

function getBarColor(score: number): string {
  const category = getScoreCategory(score)
  switch (category) {
    case 'critical':
      return 'bg-error'
    case 'warning':
      return 'bg-warning'
    default:
      return 'bg-success'
  }
}

// =============================================================================
// COMPARISON BAR
// =============================================================================

interface ComparisonBarProps {
  name: string
  score: number
  maxScore: number
  isCurrent?: boolean
  isAverage?: boolean
  isBest?: boolean
}

function ComparisonBar({
  name,
  score,
  maxScore,
  isCurrent,
  isAverage,
  isBest,
}: ComparisonBarProps) {
  const barWidth = maxScore > 0 ? (score / maxScore) * 100 : 0

  return (
    <div
      className={cn(
        'group p-2 rounded-lg transition-colors',
        isCurrent && 'bg-accent-strong/5 ring-1 ring-accent-strong/20'
      )}
    >
      {/* Label row */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          {isCurrent && (
            <Target className="size-3.5 text-accent-strong shrink-0" />
          )}
          {isAverage && (
            <Users className="size-3.5 text-tertiary shrink-0" />
          )}
          {isBest && (
            <Award className="size-3.5 text-warning shrink-0" />
          )}
          <span
            className={cn(
              'text-sm truncate',
              isCurrent ? 'font-medium text-primary' : 'text-secondary'
            )}
          >
            {name}
          </span>
          {isCurrent && (
            <Badge variant="secondary" size="sm" className="shrink-0">
              Current
            </Badge>
          )}
          {isBest && !isCurrent && (
            <Badge variant="warning" size="sm" className="shrink-0">
              Best
            </Badge>
          )}
        </div>
        <span
          className={cn(
            'text-sm font-semibold tabular-nums shrink-0',
            getScoreColor(score)
          )}
        >
          {score}
        </span>
      </div>

      {/* Bar */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="h-2 bg-muted-bg rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300',
                getBarColor(score)
              )}
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs">
            {name}: Safety Score {score}/100
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

// =============================================================================
// STATS CARD
// =============================================================================

interface StatsCardProps {
  label: string
  value: number | string
  sublabel?: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ReactNode
}

function StatsCard({ label, value, sublabel, trend, icon }: StatsCardProps) {
  const TrendIcon = trend === 'up'
    ? TrendingUp
    : trend === 'down'
      ? TrendingDown
      : Minus

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted-bg/50 border border-default">
      {icon && (
        <div className="flex size-9 items-center justify-center rounded-lg bg-surface">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-tertiary">{label}</p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">{value}</span>
          {trend && trend !== 'neutral' && (
            <TrendIcon
              className={cn(
                'size-3.5',
                trend === 'up' ? 'text-success' : 'text-error'
              )}
            />
          )}
        </div>
        {sublabel && (
          <p className="text-xs text-tertiary mt-0.5">{sublabel}</p>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ComparativeBenchmark({
  locationName,
  currentRisk,
  peerRisks,
  averageRisk,
  className,
}: ComparativeBenchmarkProps) {
  // Calculate statistics
  const allScores = [
    currentRisk.safetyScore,
    ...peerRisks.map((p) => p.riskData.safetyScore),
  ]
  const avgScore = averageRisk
    ? averageRisk.safetyScore
    : Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
  const maxScore = Math.max(...allScores, avgScore)
  const bestScore = Math.max(...allScores)
  const bestPeer = peerRisks.find((p) => p.riskData.safetyScore === bestScore)

  // Ranking
  const rank = allScores.filter((s) => s > currentRisk.safetyScore).length + 1
  const totalLocations = allScores.length

  // Difference from average
  const diffFromAvg = currentRisk.safetyScore - avgScore
  const diffTrend = diffFromAvg > 5 ? 'up' : diffFromAvg < -5 ? 'down' : 'neutral'

  // Sort peers by score descending
  const sortedPeers = [...peerRisks].sort(
    (a, b) => b.riskData.safetyScore - a.riskData.safetyScore
  )

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-primary">
          Peer Comparison
        </h4>
        <span className="text-xs text-tertiary">
          vs {peerRisks.length} sibling location{peerRisks.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatsCard
          label="Ranking"
          value={`#${rank}`}
          sublabel={`of ${totalLocations} locations`}
          icon={<Award className="size-4 text-warning" />}
        />
        <StatsCard
          label="vs Average"
          value={diffFromAvg > 0 ? `+${diffFromAvg}` : diffFromAvg}
          sublabel={
            diffFromAvg > 0
              ? 'Above average'
              : diffFromAvg < 0
                ? 'Below average'
                : 'At average'
          }
          trend={diffTrend}
          icon={<Target className="size-4 text-accent-strong" />}
        />
      </div>

      {/* Comparison bars */}
      <div className="space-y-1 pt-2">
        {/* Current location */}
        <ComparisonBar
          name={locationName}
          score={currentRisk.safetyScore}
          maxScore={100}
          isCurrent
          isBest={currentRisk.safetyScore === bestScore}
        />

        {/* Average line */}
        <ComparisonBar
          name="Average"
          score={avgScore}
          maxScore={100}
          isAverage
        />

        {/* Peer locations (top 5) */}
        {sortedPeers.slice(0, 5).map(({ name, riskData }) => (
          <ComparisonBar
            key={name}
            name={name}
            score={riskData.safetyScore}
            maxScore={100}
            isBest={riskData.safetyScore === bestScore && !bestPeer?.riskData.safetyScore}
          />
        ))}

        {sortedPeers.length > 5 && (
          <p className="text-xs text-tertiary text-center py-2">
            +{sortedPeers.length - 5} more location{sortedPeers.length - 5 !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Insight */}
      {rank === 1 && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/30">
          <Award className="size-5 text-success shrink-0" />
          <p className="text-sm text-success-dark">
            <span className="font-semibold">{locationName}</span> is the safest
            location in this group!
          </p>
        </div>
      )}
      {rank === totalLocations && totalLocations > 1 && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-error/10 border border-error/30">
          <Target className="size-5 text-error shrink-0" />
          <p className="text-sm text-error">
            This location ranks last. Review safety practices to improve.
          </p>
        </div>
      )}
    </div>
  )
}

ComparativeBenchmark.displayName = 'ComparativeBenchmark'

export default ComparativeBenchmark
