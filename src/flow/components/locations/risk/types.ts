/**
 * Location Risk Intelligence Types
 *
 * Type definitions for risk tracking, safety scores, and incident aggregation
 * per location. Integrates with the existing incident system.
 */

import type { IncidentType } from '../../../../api/types/incident.types'
import type { Location, FloorPlan } from '../types'

// =============================================================================
// SEVERITY & TREND TYPES
// =============================================================================

/** Risk severity level (aligned with incident severity) */
export type RiskSeverity = 'critical' | 'high' | 'medium' | 'low' | 'none'

/** Risk trend direction over time */
export type RiskTrend = 'improving' | 'stable' | 'worsening'

/** Incident status for filtering */
export type IncidentStatus = 'open' | 'closed' | 'investigation' | 'review' | 'reported' | 'draft'

// =============================================================================
// INCIDENT REFERENCE (linked to location)
// =============================================================================

/**
 * Lightweight incident reference for risk calculations
 * Contains only fields needed for aggregation and display
 */
export interface LocationIncident {
  /** Incident UUID */
  id: string
  /** Human-readable ID (e.g., "INC-2025-0847") */
  incidentId: string
  /** Location where incident occurred */
  locationId: string
  /** Incident severity */
  severity: RiskSeverity
  /** Incident category */
  type: IncidentType
  /** Current status */
  status: IncidentStatus
  /** Incident title */
  title: string
  /** When incident was created */
  createdAt: string
  /** When incident was closed (if applicable) */
  closedAt?: string
  /** Precision marker on floor plan (if captured) */
  precisionMarker?: {
    x: number
    y: number
    floorPlanId?: string
    description?: string
  }
}

// =============================================================================
// AGGREGATED RISK DATA (per location)
// =============================================================================

/**
 * Aggregated risk data for a single location
 * Computed from incidents linked to this location
 */
export interface LocationRiskData {
  /** Location ID this data belongs to */
  locationId: string

  /** Incident count directly at this location */
  directCount: number

  /** Total incident count including all descendants (rolled up) */
  totalCount: number

  /** Breakdown by severity */
  bySeverity: {
    critical: number
    high: number
    medium: number
    low: number
  }

  /** Breakdown by status */
  byStatus: {
    open: number
    closed: number
    investigation: number
    review: number
  }

  /** Breakdown by incident type/category */
  byType: Partial<Record<IncidentType, number>>

  /** Days since last incident (null if no incidents ever) */
  daysSinceLastIncident: number | null

  /** Recent trend (comparing current period to previous) */
  trend: RiskTrend

  /** Trend percentage change (e.g., +15 or -20) */
  trendPercentage: number

  /** Highest severity incident at this location */
  highestSeverity: RiskSeverity

  /** Calculated safety score 0-100 (higher = safer) */
  safetyScore: number

  /** Sparkline data - incident counts for last 30 days */
  sparklineData?: number[]

  /** Incidents with floor plan markers (for heatmap) */
  floorPlanIncidents?: LocationIncident[]

  /** Last incident date */
  lastIncidentDate?: string
}

// =============================================================================
// SAFETY SCORE CONFIGURATION
// =============================================================================

/**
 * Thresholds for safety score interpretation
 */
export interface SafetyScoreThresholds {
  /** Score below this = critical (red) */
  critical: number
  /** Score below this = warning (amber) */
  warning: number
  // Above warning = good (green)
}

/** Default safety score thresholds */
export const DEFAULT_SAFETY_THRESHOLDS: SafetyScoreThresholds = {
  critical: 40,
  warning: 70,
}

/**
 * Weights for safety score calculation
 * Higher weight = more impact on score
 */
export const SEVERITY_WEIGHTS: Record<Exclude<RiskSeverity, 'none'>, number> = {
  critical: 40,
  high: 20,
  medium: 10,
  low: 5,
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================

/**
 * Props for LocationRiskBadge (tree item badge)
 */
export interface LocationRiskBadgeProps {
  /** Risk data for this location */
  riskData: LocationRiskData | null
  /** Show rolled-up count (includes children) vs direct only */
  showRolledUp?: boolean
  /** Size variant */
  size?: 'sm' | 'md'
  /** Show trend indicator arrow */
  showTrend?: boolean
  /** Additional className */
  className?: string
}

/**
 * Props for LocationRiskSummary (compact panel in LocationInfo)
 */
export interface LocationRiskSummaryProps {
  /** Risk data for selected location */
  riskData: LocationRiskData
  /** Handler to view all incidents */
  onViewIncidents?: () => void
  /** Handler to schedule audit */
  onScheduleAudit?: () => void
  /** Additional className */
  className?: string
}

/**
 * Props for LocationRiskTab (dedicated analysis view)
 */
export interface LocationRiskTabProps {
  /** Location being viewed */
  location: Location
  /** Risk data for this location */
  riskData: LocationRiskData
  /** All incidents at this location (for details/heatmap) */
  incidents: LocationIncident[]
  /** Sibling locations for comparison */
  siblingLocations?: Array<{ location: Location; riskData: LocationRiskData }>
  /** Handler to view specific incident */
  onViewIncident?: (incidentId: string) => void
  /** Handler to view all incidents (filtered) */
  onViewAllIncidents?: () => void
  /** Handler to schedule audit */
  onScheduleAudit?: () => void
  /** Additional className */
  className?: string
}

/**
 * Props for SafetyScoreCard
 */
export interface SafetyScoreCardProps {
  /** Safety score 0-100 */
  score: number
  /** Score thresholds */
  thresholds?: SafetyScoreThresholds
  /** Trend direction */
  trend?: RiskTrend
  /** Trend percentage */
  trendPercentage?: number
  /** Sparkline data */
  sparklineData?: number[]
  /** Location name for context */
  locationName?: string
  /** Additional className */
  className?: string
}

/**
 * Props for RiskTypeBreakdown
 */
export interface RiskTypeBreakdownProps {
  /** Breakdown by incident type */
  byType: Partial<Record<IncidentType, number>>
  /** Total incidents for percentage calculation */
  totalCount: number
  /** Additional className */
  className?: string
}

/**
 * Props for ComparativeBenchmark
 */
export interface ComparativeBenchmarkProps {
  /** Current location name */
  locationName: string
  /** Current location risk data */
  currentRisk: LocationRiskData
  /** Sibling/peer locations for comparison */
  peerRisks: Array<{ name: string; riskData: LocationRiskData }>
  /** Average/benchmark risk data */
  averageRisk?: LocationRiskData
  /** Additional className */
  className?: string
}

/**
 * Props for TrendingRiskAlert
 */
export interface TrendingRiskAlertProps {
  /** Trend direction */
  trend: RiskTrend
  /** Percentage change */
  trendPercentage: number
  /** Current period incident count */
  currentCount: number
  /** Previous period incident count */
  previousCount: number
  /** Period label (e.g., "this month") */
  periodLabel?: string
  /** Handler to dismiss alert */
  onDismiss?: () => void
  /** Additional className */
  className?: string
}

/**
 * Props for FloorPlanHeatmap
 */
export interface FloorPlanHeatmapProps {
  /** Floor plan image URL */
  imageUrl: string
  /** Incidents with precision markers */
  incidents: LocationIncident[]
  /** Available floor plans (for multi-floor) */
  floorPlans?: FloorPlan[]
  /** Selected floor plan ID */
  selectedFloorId?: string
  /** Handler when floor changes */
  onFloorChange?: (floorId: string) => void
  /** Handler when incident marker clicked */
  onIncidentClick?: (incident: LocationIncident) => void
  /** Enable heatmap density overlay */
  showHeatmap?: boolean
  /** Enable zoom controls */
  enableZoom?: boolean
  /** Additional className */
  className?: string
}

/**
 * Props for MultiFloorSelector
 */
export interface MultiFloorSelectorProps {
  /** Available floor plans */
  floorPlans: FloorPlan[]
  /** Currently selected floor plan */
  selectedId?: string
  /** Handler when selection changes */
  onSelect: (floorPlanId: string) => void
  /** Additional className */
  className?: string
}

// =============================================================================
// HELPER TYPES
// =============================================================================

/**
 * Map of location ID to risk data
 * Used for efficient lookup in hooks
 */
export type RiskDataMap = Map<string, LocationRiskData>

/**
 * Map of location ID to incidents
 * Used for grouping incidents by location
 */
export type IncidentsByLocation = Map<string, LocationIncident[]>

/**
 * Risk calculation options
 */
export interface RiskCalculationOptions {
  /** Number of days for "recent" period (default: 30) */
  recentPeriodDays?: number
  /** Include children in roll-up (default: true) */
  includeChildren?: boolean
  /** Calculate sparkline data (default: false for performance) */
  calculateSparkline?: boolean
}

// =============================================================================
// SEVERITY HELPERS
// =============================================================================

/** Severity order for comparison (higher = more severe) */
export const SEVERITY_ORDER: Record<RiskSeverity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
  none: 0,
}

/**
 * Get the more severe of two severities
 */
export function maxSeverity(a: RiskSeverity, b: RiskSeverity): RiskSeverity {
  return SEVERITY_ORDER[a] >= SEVERITY_ORDER[b] ? a : b
}

/**
 * Get severity from incident count
 */
export function getSeverityFromCount(
  count: number,
  thresholds = { critical: 10, high: 5, medium: 2 }
): RiskSeverity {
  if (count >= thresholds.critical) return 'critical'
  if (count >= thresholds.high) return 'high'
  if (count >= thresholds.medium) return 'medium'
  if (count > 0) return 'low'
  return 'none'
}

/**
 * Empty risk data for locations with no incidents
 */
export function createEmptyRiskData(locationId: string): LocationRiskData {
  return {
    locationId,
    directCount: 0,
    totalCount: 0,
    bySeverity: { critical: 0, high: 0, medium: 0, low: 0 },
    byStatus: { open: 0, closed: 0, investigation: 0, review: 0 },
    byType: {},
    daysSinceLastIncident: null,
    trend: 'stable',
    trendPercentage: 0,
    highestSeverity: 'none',
    safetyScore: 100,
    sparklineData: [],
    floorPlanIncidents: [],
  }
}
