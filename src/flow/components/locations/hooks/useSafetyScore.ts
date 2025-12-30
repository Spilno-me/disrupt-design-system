/**
 * useSafetyScore - Hook for calculating location safety scores
 *
 * Computes a 0-100 safety score based on:
 * - Incident severity (weighted)
 * - Open vs closed incidents
 * - Trend direction
 * - Recency of incidents
 *
 * Higher score = safer location
 */

import { useMemo } from 'react'
import type { LocationRiskData, RiskSeverity, SafetyScoreThresholds } from '../risk/types'
import { SEVERITY_WEIGHTS, DEFAULT_SAFETY_THRESHOLDS } from '../risk/types'

// =============================================================================
// TYPES
// =============================================================================

export interface SafetyScoreBreakdown {
  /** Final safety score (0-100) */
  score: number
  /** Score category (critical/warning/good) */
  category: 'critical' | 'warning' | 'good'
  /** Individual component scores */
  components: {
    /** Base score from incident count (lower count = higher score) */
    incidentBase: number
    /** Severity penalty (more severe = lower) */
    severityPenalty: number
    /** Open incidents penalty */
    openPenalty: number
    /** Trend bonus/penalty */
    trendAdjustment: number
    /** Recency bonus (longer since incident = higher) */
    recencyBonus: number
  }
  /** Suggested actions based on score */
  recommendations: string[]
}

export interface UseSafetyScoreOptions {
  /** Custom severity weights */
  weights?: Record<Exclude<RiskSeverity, 'none'>, number>
  /** Custom score thresholds */
  thresholds?: SafetyScoreThresholds
  /** Include recommendations */
  includeRecommendations?: boolean
}

export interface UseSafetyScoreReturn {
  /** Overall safety score */
  score: number
  /** Score category */
  category: 'critical' | 'warning' | 'good'
  /** Full breakdown */
  breakdown: SafetyScoreBreakdown
  /** Check if score is below threshold */
  isCritical: boolean
  isWarning: boolean
  isGood: boolean
}

// =============================================================================
// SCORE CALCULATION
// =============================================================================

/**
 * Calculate the incident base score
 * 0 incidents = 100, diminishing returns after
 */
function calculateIncidentBase(totalCount: number): number {
  if (totalCount === 0) return 100
  // Logarithmic scale: 1 incident = ~85, 5 = ~70, 20 = ~50
  return Math.max(0, Math.round(100 - Math.log(totalCount + 1) * 20))
}

/**
 * Calculate severity penalty
 * More critical incidents = higher penalty
 */
function calculateSeverityPenalty(
  bySeverity: { critical: number; high: number; medium: number; low: number },
  weights: Record<Exclude<RiskSeverity, 'none'>, number>
): number {
  const penalty =
    bySeverity.critical * weights.critical * 1.5 + // Extra weight for critical
    bySeverity.high * weights.high +
    bySeverity.medium * weights.medium +
    bySeverity.low * weights.low

  // Cap at 60 (won't reduce score below 40 from severity alone)
  return Math.min(60, penalty)
}

/**
 * Calculate penalty for open incidents
 * Open issues are worse than closed
 */
function calculateOpenPenalty(
  byStatus: { open: number; closed: number; investigation: number; review: number }
): number {
  const openCount = byStatus.open + byStatus.investigation + byStatus.review
  if (openCount === 0) return 0

  // Each open incident adds penalty, capped at 20
  return Math.min(20, openCount * 3)
}

/**
 * Calculate trend adjustment
 * Improving = bonus, worsening = penalty
 */
function calculateTrendAdjustment(
  trend: 'improving' | 'stable' | 'worsening',
  trendPercentage: number
): number {
  if (trend === 'improving') {
    // Bonus for improvement (max +10)
    return Math.min(10, Math.abs(trendPercentage) / 5)
  } else if (trend === 'worsening') {
    // Penalty for worsening (max -15)
    return -Math.min(15, Math.abs(trendPercentage) / 3)
  }
  return 0
}

/**
 * Calculate recency bonus
 * Longer since last incident = higher bonus
 */
function calculateRecencyBonus(daysSinceLastIncident: number | null): number {
  if (daysSinceLastIncident === null) return 10 // No incidents ever = bonus

  if (daysSinceLastIncident > 365) return 10 // Over a year
  if (daysSinceLastIncident > 180) return 7 // 6+ months
  if (daysSinceLastIncident > 90) return 5 // 3+ months
  if (daysSinceLastIncident > 30) return 3 // 1+ month
  if (daysSinceLastIncident > 7) return 1 // 1+ week
  return 0 // Recent incident
}

/**
 * Get category from score and thresholds
 */
function getCategory(
  score: number,
  thresholds: SafetyScoreThresholds
): 'critical' | 'warning' | 'good' {
  if (score < thresholds.critical) return 'critical'
  if (score < thresholds.warning) return 'warning'
  return 'good'
}

/**
 * Generate recommendations based on risk data
 */
function generateRecommendations(
  riskData: LocationRiskData,
  category: 'critical' | 'warning' | 'good'
): string[] {
  const recommendations: string[] = []

  if (category === 'critical') {
    recommendations.push('Schedule immediate safety audit')

    if (riskData.bySeverity.critical > 0) {
      recommendations.push(`Address ${riskData.bySeverity.critical} critical incident(s)`)
    }

    if (riskData.byStatus.open > 3) {
      recommendations.push('Prioritize closing open incidents')
    }
  } else if (category === 'warning') {
    if (riskData.trend === 'worsening') {
      recommendations.push('Investigate recent incident increase')
    }

    if (riskData.bySeverity.high > 2) {
      recommendations.push('Review high-severity incidents')
    }
  }

  if (riskData.daysSinceLastIncident !== null && riskData.daysSinceLastIncident < 7) {
    recommendations.push('Monitor recent incident closely')
  }

  return recommendations
}

/**
 * Calculate full safety score breakdown
 */
export function calculateSafetyScore(
  riskData: LocationRiskData,
  options: UseSafetyScoreOptions = {}
): SafetyScoreBreakdown {
  const {
    weights = SEVERITY_WEIGHTS,
    thresholds = DEFAULT_SAFETY_THRESHOLDS,
    includeRecommendations = true,
  } = options

  // Calculate components
  const incidentBase = calculateIncidentBase(riskData.totalCount)
  const severityPenalty = calculateSeverityPenalty(riskData.bySeverity, weights)
  const openPenalty = calculateOpenPenalty(riskData.byStatus)
  const trendAdjustment = calculateTrendAdjustment(riskData.trend, riskData.trendPercentage)
  const recencyBonus = calculateRecencyBonus(riskData.daysSinceLastIncident)

  // Calculate final score
  let score = incidentBase - severityPenalty - openPenalty + trendAdjustment + recencyBonus

  // Clamp to 0-100
  score = Math.max(0, Math.min(100, Math.round(score)))

  const category = getCategory(score, thresholds)
  const recommendations = includeRecommendations
    ? generateRecommendations(riskData, category)
    : []

  return {
    score,
    category,
    components: {
      incidentBase,
      severityPenalty,
      openPenalty,
      trendAdjustment,
      recencyBonus,
    },
    recommendations,
  }
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Hook to calculate safety score for a location
 *
 * @param riskData - Risk data for the location
 * @param options - Calculation options
 */
export function useSafetyScore(
  riskData: LocationRiskData | null,
  options: UseSafetyScoreOptions = {}
): UseSafetyScoreReturn {
  const { weights, thresholds = DEFAULT_SAFETY_THRESHOLDS, includeRecommendations } = options

  return useMemo(() => {
    if (!riskData) {
      return {
        score: 100,
        category: 'good' as const,
        breakdown: {
          score: 100,
          category: 'good' as const,
          components: {
            incidentBase: 100,
            severityPenalty: 0,
            openPenalty: 0,
            trendAdjustment: 0,
            recencyBonus: 10,
          },
          recommendations: [],
        },
        isCritical: false,
        isWarning: false,
        isGood: true,
      }
    }

    const breakdown = calculateSafetyScore(riskData, { weights, thresholds, includeRecommendations })

    return {
      score: breakdown.score,
      category: breakdown.category,
      breakdown,
      isCritical: breakdown.category === 'critical',
      isWarning: breakdown.category === 'warning',
      isGood: breakdown.category === 'good',
    }
  }, [riskData, weights, thresholds, includeRecommendations])
}

// =============================================================================
// UTILITY HOOKS
// =============================================================================

/**
 * Hook to get safety score color token based on category
 */
export function useSafetyScoreColor(category: 'critical' | 'warning' | 'good'): string {
  const colorMap = {
    critical: 'error',
    warning: 'warning',
    good: 'success',
  }
  return colorMap[category]
}

/**
 * Hook to get safety score label
 */
export function useSafetyScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 80) return 'Good'
  if (score >= 70) return 'Satisfactory'
  if (score >= 60) return 'Fair'
  if (score >= 50) return 'Needs Attention'
  if (score >= 40) return 'At Risk'
  return 'Critical'
}

export default useSafetyScore
