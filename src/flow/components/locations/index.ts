/**
 * Location Management Module
 *
 * Exports for the Location Management page and related components.
 * Includes mobile-responsive components with swipe-to-reveal actions.
 */

// Main page component
export { LocationsPage } from './LocationsPage'
export { default as LocationsPageDefault } from './LocationsPage'

// Tree components
export { LocationTree } from './tree/LocationTree'
export { LocationTreeItem } from './tree/LocationTreeItem'
export { SwipeableTreeItem } from './tree/SwipeableTreeItem'

// Panel components
export { LocationEmptyState } from './panels/LocationEmptyState'
export { LocationForm } from './panels/LocationForm'
export { LocationInfo } from './panels/LocationInfo'

// Mobile components
export { LocationDetailSheet } from './mobile/LocationDetailSheet'

// Dialog components
export { DeleteLocationDialog } from './dialogs/DeleteLocationDialog'

// Hooks
export { useIsMobile } from './hooks/useIsMobile'
export { useLocationRiskData } from './hooks/useLocationRiskData'
export { useRiskRollup } from './hooks/useRiskRollup'
export { useSafetyScore } from './hooks/useSafetyScore'

// Risk Intelligence Components
export {
  LocationRiskBadge,
  TrendingRiskAlert,
  LocationRiskSummary,
  SafetyScoreCard,
  RiskTypeBreakdown,
  ComparativeBenchmark,
  MultiFloorSelector,
  FloorPlanHeatmap,
  LocationRiskTab,
} from './risk'

// Types
export type {
  Location,
  LocationType,
  RightPanelMode,
  LocationFormData,
  CreateLocationFormData,
  EditLocationFormData,
  LocationTreeState,
  DeleteLocationPayload,
  LocationsPageProps,
  LocationTreeProps,
  LocationTreeItemProps,
  LocationFormProps,
  LocationInfoProps,
  DeleteLocationDialogProps,
} from './types'

// Constants and config
export {
  LOCATION_TYPE_CONFIG,
  TIMEZONE_OPTIONS,
  LOCATION_TYPE_OPTIONS,
  countDescendants,
  flattenLocations,
  findLocationById,
  getTotalLocationCount,
} from './types'

// Risk types
export type {
  LocationRiskData,
  LocationIncident,
  RiskSeverity,
  RiskTrend,
  RiskDataMap,
  IncidentsByLocation,
  LocationRiskBadgeProps,
  TrendingRiskAlertProps,
  LocationRiskSummaryProps,
  SafetyScoreCardProps,
  RiskTypeBreakdownProps,
  ComparativeBenchmarkProps,
  MultiFloorSelectorProps,
  FloorPlanHeatmapProps,
  LocationRiskTabProps,
} from './risk/types'

export {
  maxSeverity,
  getSeverityFromCount,
  createEmptyRiskData,
  SEVERITY_WEIGHTS,
  DEFAULT_SAFETY_THRESHOLDS,
} from './risk/types'

// Mock data (for development/stories)
export {
  mockLocations,
  mockLocationsExtended,
  emptyLocations,
  mockUserLocationAssignments,
  getAllLocationIds,
} from './data/mockLocations'
export type { UserLocationAssignment } from './data/mockLocations'
