/**
 * Earnings Module Exports
 * @module earnings
 */

// Main page component
export { MyEarningsPage, EARNING_DOT_STATUS_MAP } from "./MyEarningsPage"
export { default as MyEarningsPageDefault } from "./MyEarningsPage"

// Types
export type {
  EarningType,
  EarningStatus,
  Earning,
  EarningsSummary,
  MyEarningsPageProps,
} from "./types"

// Data
export { MOCK_EARNINGS, MOCK_EARNINGS_SUMMARY } from "./data/mock-earnings"
