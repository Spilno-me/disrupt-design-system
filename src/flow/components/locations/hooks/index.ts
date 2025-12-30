/**
 * Location Hooks
 *
 * Custom hooks for location management
 */

// Device detection
export { useIsMobile } from './useIsMobile'

// Risk intelligence
export { useLocationRiskData, computeLocationRisk } from './useLocationRiskData'
export type { UseLocationRiskDataOptions, UseLocationRiskDataReturn } from './useLocationRiskData'

export { useRiskRollup } from './useRiskRollup'
export type { RollupOptions, UseRiskRollupReturn } from './useRiskRollup'

export { useSafetyScore, useSafetyScoreColor, useSafetyScoreLabel, calculateSafetyScore } from './useSafetyScore'
export type { SafetyScoreBreakdown, UseSafetyScoreOptions, UseSafetyScoreReturn } from './useSafetyScore'
