/**
 * useRiskRollup - Hook for recursive risk aggregation
 *
 * Rolls up risk data from child locations to parent locations.
 * Parent locations show:
 * - Combined incident counts from all descendants
 * - Highest severity among all descendants
 * - Aggregated type/status breakdowns
 */

import { useMemo } from 'react'
import type { Location } from '../types'
import type {
  LocationRiskData,
  RiskDataMap,
  RiskSeverity,
  RiskTrend,
} from '../risk/types'
import { maxSeverity, createEmptyRiskData } from '../risk/types'
import type { IncidentType } from '../../../../api/types/incident.types'

// =============================================================================
// TYPES
// =============================================================================

export interface RollupOptions {
  /** Include only direct incidents (no rollup) */
  directOnly?: boolean
  /** Maximum depth to roll up (default: unlimited) */
  maxDepth?: number
}

export interface UseRiskRollupReturn {
  /** Risk data with rolled-up totals */
  rolledUpRiskMap: RiskDataMap
  /** Get rolled-up risk for a location */
  getRolledUpRisk: (locationId: string) => LocationRiskData | undefined
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Merge two risk data objects (for aggregation)
 */
function mergeRiskData(
  base: LocationRiskData,
  child: LocationRiskData
): LocationRiskData {
  return {
    ...base,
    // Keep directCount as-is, update totalCount
    totalCount: base.totalCount + child.totalCount,
    // Merge severity counts
    bySeverity: {
      critical: base.bySeverity.critical + child.bySeverity.critical,
      high: base.bySeverity.high + child.bySeverity.high,
      medium: base.bySeverity.medium + child.bySeverity.medium,
      low: base.bySeverity.low + child.bySeverity.low,
    },
    // Merge status counts
    byStatus: {
      open: base.byStatus.open + child.byStatus.open,
      closed: base.byStatus.closed + child.byStatus.closed,
      investigation: base.byStatus.investigation + child.byStatus.investigation,
      review: base.byStatus.review + child.byStatus.review,
    },
    // Merge type counts
    byType: mergeTypeCounts(base.byType, child.byType),
    // Take highest severity
    highestSeverity: maxSeverity(base.highestSeverity, child.highestSeverity),
    // Use earliest "last incident" date
    daysSinceLastIncident: Math.min(
      base.daysSinceLastIncident ?? Infinity,
      child.daysSinceLastIncident ?? Infinity
    ) === Infinity
      ? null
      : Math.min(
          base.daysSinceLastIncident ?? Infinity,
          child.daysSinceLastIncident ?? Infinity
        ),
    // Recalculate trend based on merged data (simplified)
    trend: combineTrends(base.trend, child.trend),
    trendPercentage: Math.round((base.trendPercentage + child.trendPercentage) / 2),
    // Safety score will be recalculated
    safetyScore: Math.round((base.safetyScore * base.totalCount + child.safetyScore * child.totalCount) /
      (base.totalCount + child.totalCount) || base.safetyScore),
    // Merge sparkline data (if both exist)
    sparklineData: mergeSparklines(base.sparklineData, child.sparklineData),
    // Merge floor plan incidents
    floorPlanIncidents: [
      ...(base.floorPlanIncidents || []),
      ...(child.floorPlanIncidents || []),
    ],
    // Use most recent incident date
    lastIncidentDate: getMoreRecentDate(base.lastIncidentDate, child.lastIncidentDate),
  }
}

/**
 * Merge type count maps
 */
function mergeTypeCounts(
  a: Partial<Record<IncidentType, number>>,
  b: Partial<Record<IncidentType, number>>
): Partial<Record<IncidentType, number>> {
  const result: Partial<Record<IncidentType, number>> = { ...a }

  for (const [type, count] of Object.entries(b)) {
    result[type as IncidentType] = (result[type as IncidentType] || 0) + (count || 0)
  }

  return result
}

/**
 * Combine two trend directions
 */
function combineTrends(a: RiskTrend, b: RiskTrend): RiskTrend {
  // If either is worsening, combined is worsening
  if (a === 'worsening' || b === 'worsening') return 'worsening'
  // If both improving, combined is improving
  if (a === 'improving' && b === 'improving') return 'improving'
  // Otherwise stable
  return 'stable'
}

/**
 * Merge sparkline arrays (element-wise sum)
 */
function mergeSparklines(a?: number[], b?: number[]): number[] | undefined {
  if (!a && !b) return undefined
  if (!a) return b
  if (!b) return a

  const maxLen = Math.max(a.length, b.length)
  const result: number[] = []

  for (let i = 0; i < maxLen; i++) {
    result.push((a[i] || 0) + (b[i] || 0))
  }

  return result
}

/**
 * Get the more recent date string
 */
function getMoreRecentDate(a?: string, b?: string): string | undefined {
  if (!a) return b
  if (!b) return a
  return new Date(a) > new Date(b) ? a : b
}

// =============================================================================
// ROLLUP FUNCTION
// =============================================================================

/**
 * Build a location ID -> children map for efficient traversal
 */
function buildChildrenMap(locations: Location[]): Map<string, Location[]> {
  const map = new Map<string, Location[]>()

  const processLocation = (loc: Location) => {
    if (loc.children && loc.children.length > 0) {
      map.set(loc.id, loc.children)
      loc.children.forEach(processLocation)
    }
  }

  locations.forEach(processLocation)
  return map
}

/**
 * Recursively roll up risk data from children to parents
 */
function rollupLocation(
  locationId: string,
  childrenMap: Map<string, Location[]>,
  baseRiskMap: RiskDataMap,
  rolledUpMap: RiskDataMap,
  depth: number,
  maxDepth: number
): LocationRiskData {
  // Check if already computed
  const cached = rolledUpMap.get(locationId)
  if (cached) return cached

  // Start with base risk data (direct incidents only)
  let riskData = baseRiskMap.get(locationId) || createEmptyRiskData(locationId)
  riskData = { ...riskData } // Clone to avoid mutation

  // Get children
  const children = childrenMap.get(locationId)

  // If no children or max depth reached, return as-is
  if (!children || children.length === 0 || depth >= maxDepth) {
    rolledUpMap.set(locationId, riskData)
    return riskData
  }

  // Roll up from each child
  for (const child of children) {
    const childRisk = rollupLocation(
      child.id,
      childrenMap,
      baseRiskMap,
      rolledUpMap,
      depth + 1,
      maxDepth
    )
    riskData = mergeRiskData(riskData, childRisk)
  }

  // Cache and return
  rolledUpMap.set(locationId, riskData)
  return riskData
}

/**
 * Perform full rollup for all locations in tree
 */
function performRollup(
  locations: Location[],
  baseRiskMap: RiskDataMap,
  options: RollupOptions = {}
): RiskDataMap {
  const { directOnly = false, maxDepth = 100 } = options

  if (directOnly) {
    return new Map(baseRiskMap)
  }

  const childrenMap = buildChildrenMap(locations)
  const rolledUpMap: RiskDataMap = new Map()

  // Process each root location
  for (const location of locations) {
    rollupLocation(location.id, childrenMap, baseRiskMap, rolledUpMap, 0, maxDepth)
  }

  // Ensure all locations have risk data (even if not in tree)
  for (const [locId, riskData] of baseRiskMap) {
    if (!rolledUpMap.has(locId)) {
      rolledUpMap.set(locId, riskData)
    }
  }

  return rolledUpMap
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Hook to roll up risk data from children to parent locations
 *
 * @param locations - Location tree structure
 * @param baseRiskMap - Risk data computed from direct incidents only
 * @param options - Rollup options
 */
export function useRiskRollup(
  locations: Location[],
  baseRiskMap: RiskDataMap,
  options: RollupOptions = {}
): UseRiskRollupReturn {
  const { directOnly, maxDepth } = options

  return useMemo(() => {
    const rolledUpRiskMap = performRollup(locations, baseRiskMap, { directOnly, maxDepth })

    return {
      rolledUpRiskMap,
      getRolledUpRisk: (locationId: string) => rolledUpRiskMap.get(locationId),
    }
  }, [locations, baseRiskMap, directOnly, maxDepth])
}

export default useRiskRollup
