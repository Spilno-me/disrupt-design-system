/**
 * EarningsContent - My Earnings tab content for Partner Portal
 *
 * Displays earnings summary and history.
 */

import * as React from 'react'
import { MyEarningsPage } from '../../../components/earnings'
import type { Earning, EarningsSummary } from '../../../components/earnings'

export interface EarningsContentProps {
  /** Earnings summary data */
  summary: EarningsSummary
  /** Earnings history */
  earnings: Earning[]
}

export function EarningsContent({ summary, earnings }: EarningsContentProps) {
  return (
    <div className="p-6">
      <MyEarningsPage summary={summary} earnings={earnings} />
    </div>
  )
}
