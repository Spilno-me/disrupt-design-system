/**
 * useLocationRiskData - Hook to compute aggregated risk data per location
 *
 * Groups incidents by location and computes:
 * - Incident counts (direct and rolled-up)
 * - Breakdowns by severity, status, and type
 * - Trend analysis (current vs previous period)
 * - Days since last incident
 */

import { useMemo } from 'react'
import type { IncidentType } from '../../../../api/types/incident.types'
import type {
  LocationIncident,
  LocationRiskData,
  RiskSeverity,
  RiskTrend,
  RiskDataMap,
  IncidentsByLocation,
  RiskCalculationOptions,
  SEVERITY_WEIGHTS,
} from '../risk/types'
import { maxSeverity, createEmptyRiskData } from '../risk/types'

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Group incidents by locationId
 */
function groupIncidentsByLocation(incidents: LocationIncident[]): IncidentsByLocation {
  const map: IncidentsByLocation = new Map()

  for (const incident of incidents) {
    const existing = map.get(incident.locationId) || []
    existing.push(incident)
    map.set(incident.locationId, existing)
  }

  return map
}

/**
 * Calculate days since a date
 */
function daysSince(dateStr: string): number {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

/**
 * Determine trend from counts
 */
function calculateTrend(current: number, previous: number): { trend: RiskTrend; percentage: number } {
  if (previous === 0 && current === 0) {
    return { trend: 'stable', percentage: 0 }
  }

  if (previous === 0) {
    return { trend: 'worsening', percentage: 100 }
  }

  const percentChange = Math.round(((current - previous) / previous) * 100)

  if (percentChange > 10) {
    return { trend: 'worsening', percentage: percentChange }
  } else if (percentChange < -10) {
    return { trend: 'improving', percentage: percentChange }
  }

  return { trend: 'stable', percentage: percentChange }
}

/**
 * Generate sparkline data (incident counts per day for last N days)
 */
function generateSparkline(incidents: LocationIncident[], days: number = 30): number[] {
  const now = new Date()
  const counts: number[] = new Array(days).fill(0)

  for (const incident of incidents) {
    const incidentDate = new Date(incident.createdAt)
    const daysAgo = Math.floor((now.getTime() - incidentDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysAgo >= 0 && daysAgo < days) {
      counts[days - 1 - daysAgo]++
    }
  }

  return counts
}

/**
 * Calculate safety score from incidents
 * Formula: 100 - weighted severity score
 * Score capped at 0-100
 */
function calculateSafetyScore(
  incidents: LocationIncident[],
  weights: Record<Exclude<RiskSeverity, 'none'>, number>
): number {
  if (incidents.length === 0) return 100

  // Only count open/active incidents for safety score
  const activeIncidents = incidents.filter(
    (inc) => inc.status === 'open' || inc.status === 'investigation' || inc.status === 'review'
  )

  if (activeIncidents.length === 0) return 95 // No active issues, but had incidents

  let totalPenalty = 0
  for (const incident of activeIncidents) {
    const severity = incident.severity === 'none' ? 'low' : incident.severity
    totalPenalty += weights[severity] || 0
  }

  // Apply decay: more incidents = diminishing returns on penalty
  // First incident full weight, subsequent ones reduced
  const adjustedPenalty = Math.log(totalPenalty + 1) * 15

  return Math.max(0, Math.min(100, Math.round(100 - adjustedPenalty)))
}

// =============================================================================
// MAIN AGGREGATION FUNCTION
// =============================================================================

/**
 * Compute risk data for a single location from its incidents
 */
export function computeLocationRisk(
  locationId: string,
  incidents: LocationIncident[],
  options: RiskCalculationOptions = {}
): LocationRiskData {
  const {
    recentPeriodDays = 30,
    calculateSparkline: doSparkline = false,
  } = options

  if (incidents.length === 0) {
    return createEmptyRiskData(locationId)
  }

  // Count by severity
  const bySeverity = { critical: 0, high: 0, medium: 0, low: 0 }
  for (const inc of incidents) {
    if (inc.severity !== 'none') {
      bySeverity[inc.severity]++
    }
  }

  // Count by status
  const byStatus = { open: 0, closed: 0, investigation: 0, review: 0 }
  for (const inc of incidents) {
    if (inc.status in byStatus) {
      byStatus[inc.status as keyof typeof byStatus]++
    }
  }

  // Count by type
  const byType: Partial<Record<IncidentType, number>> = {}
  for (const inc of incidents) {
    byType[inc.type] = (byType[inc.type] || 0) + 1
  }

  // Find highest severity
  let highest: RiskSeverity = 'none'
  for (const inc of incidents) {
    highest = maxSeverity(highest, inc.severity)
  }

  // Calculate days since last incident
  let lastIncidentDate: string | undefined
  let daysSinceLast: number | null = null

  if (incidents.length > 0) {
    // Sort by date descending
    const sorted = [...incidents].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    lastIncidentDate = sorted[0].createdAt
    daysSinceLast = daysSince(lastIncidentDate)
  }

  // Calculate trend (current period vs previous period)
  const now = new Date()
  const periodStart = new Date(now.getTime() - recentPeriodDays * 24 * 60 * 60 * 1000)
  const previousPeriodStart = new Date(periodStart.getTime() - recentPeriodDays * 24 * 60 * 60 * 1000)

  const currentPeriodIncidents = incidents.filter(
    (inc) => new Date(inc.createdAt) >= periodStart
  )
  const previousPeriodIncidents = incidents.filter(
    (inc) => {
      const date = new Date(inc.createdAt)
      return date >= previousPeriodStart && date < periodStart
    }
  )

  const { trend, percentage } = calculateTrend(
    currentPeriodIncidents.length,
    previousPeriodIncidents.length
  )

  // Safety score
  const safetyScore = calculateSafetyScore(incidents, {
    critical: 40,
    high: 20,
    medium: 10,
    low: 5,
  })

  // Sparkline data
  const sparklineData = doSparkline ? generateSparkline(incidents, 30) : undefined

  // Floor plan incidents (those with precision markers)
  const floorPlanIncidents = incidents.filter((inc) => inc.precisionMarker)

  return {
    locationId,
    directCount: incidents.length,
    totalCount: incidents.length, // Will be updated by rollup hook
    bySeverity,
    byStatus,
    byType,
    daysSinceLastIncident: daysSinceLast,
    trend,
    trendPercentage: percentage,
    highestSeverity: highest,
    safetyScore,
    sparklineData,
    floorPlanIncidents: floorPlanIncidents.length > 0 ? floorPlanIncidents : undefined,
    lastIncidentDate,
  }
}

// =============================================================================
// HOOK
// =============================================================================

export interface UseLocationRiskDataOptions extends RiskCalculationOptions {
  /** Location IDs to compute risk for (if empty, computes for all) */
  locationIds?: string[]
}

export interface UseLocationRiskDataReturn {
  /** Map of location ID to risk data */
  riskDataMap: RiskDataMap
  /** Incidents grouped by location */
  incidentsByLocation: IncidentsByLocation
  /** Get risk data for a specific location */
  getRiskData: (locationId: string) => LocationRiskData | undefined
  /** Total incidents across all locations */
  totalIncidents: number
}

/**
 * Hook to compute risk data for locations from incidents
 */
export function useLocationRiskData(
  incidents: LocationIncident[],
  options: UseLocationRiskDataOptions = {}
): UseLocationRiskDataReturn {
  const { locationIds, ...calculationOptions } = options

  return useMemo(() => {
    // Group incidents by location
    const incidentsByLocation = groupIncidentsByLocation(incidents)

    // Determine which locations to process
    const locationsToProcess = locationIds || Array.from(incidentsByLocation.keys())

    // Compute risk data for each location
    const riskDataMap: RiskDataMap = new Map()

    for (const locationId of locationsToProcess) {
      const locationIncidents = incidentsByLocation.get(locationId) || []
      const riskData = computeLocationRisk(locationId, locationIncidents, calculationOptions)
      riskDataMap.set(locationId, riskData)
    }

    return {
      riskDataMap,
      incidentsByLocation,
      getRiskData: (locationId: string) => riskDataMap.get(locationId),
      totalIncidents: incidents.length,
    }
  }, [incidents, locationIds, calculationOptions])
}

export default useLocationRiskData
