/**
 * PricingCalculatorContent - Pricing calculator tab content for Partner Portal
 *
 * Pricing estimation and quote generation.
 */

import * as React from 'react'
import { PricingCalculator, type CalculateRequest } from '../../../components/partners/PricingCalculator'

export interface PricingCalculatorContentProps {
  /** Callback when calculating pricing */
  onCalculate?: (request: CalculateRequest) => void
  /** Callback when generating a quote */
  onGenerateQuote?: (request: CalculateRequest) => void
  /** Whether to show commission (admin only) */
  showCommission?: boolean
}

export function PricingCalculatorContent({
  onCalculate,
  onGenerateQuote,
  showCommission = false,
}: PricingCalculatorContentProps) {
  return (
    <div className="p-6">
      <PricingCalculator
        onCalculate={onCalculate}
        onGenerateQuote={onGenerateQuote}
        showCommission={showCommission}
      />
    </div>
  )
}
