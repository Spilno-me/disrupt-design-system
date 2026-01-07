/**
 * Type definitions for My Earnings page
 * @module earnings/types/earnings.types
 */

// =============================================================================
// EARNING TYPES
// =============================================================================

export type EarningType = "direct" | "passive"

export type EarningStatus = "paid" | "pending" | "processing"

// =============================================================================
// CORE ENTITIES
// =============================================================================

export interface Earning {
  /** Unique identifier */
  id: string
  /** Date of the earning */
  date: Date
  /** Name of the tenant */
  tenantName: string
  /** Type of commission */
  type: EarningType
  /** Amount in USD */
  amount: number
  /** Status of the payment */
  status: EarningStatus
}

export interface EarningsSummary {
  /** Total earnings across all time */
  totalEarnings: number
  /** Direct commission total */
  directCommission: number
  /** Passive commission total */
  passiveCommission: number
  /** Pending payouts awaiting processing */
  pendingPayouts: number
}

// =============================================================================
// PAGE PROPS
// =============================================================================

export interface MyEarningsPageProps {
  /** Summary data for stats cards */
  summary?: EarningsSummary
  /** List of earnings records */
  earnings?: Earning[]
  /** Loading state */
  loading?: boolean
  /** Additional className for the container */
  className?: string
}
