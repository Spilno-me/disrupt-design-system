/**
 * Example Usage of PricingCalculator
 *
 * This shows how to integrate the component into your app.
 */

import React from 'react'
import { PricingCalculator, PricingInput, PricingBreakdown } from './PricingCalculator'

// Import the design tokens CSS
import './tokens.css'

export function PricingCalculatorExample() {
  // Handler for when pricing is calculated
  const handleCalculate = (input: PricingInput, breakdown: PricingBreakdown) => {
    console.log('Pricing calculated:', {
      input,
      breakdown,
    })

    // You might want to save this to state or send to an API
  }

  // Handler for when user clicks "Generate Quote"
  const handleGenerateQuote = (input: PricingInput, breakdown: PricingBreakdown) => {
    console.log('Generating quote for:', {
      companySize: input.companySize,
      tier: input.tier,
      totalUsers: input.totalUsers,
      total: breakdown.total,
      commission: breakdown.partnerCommission,
    })

    // Example: Open a modal, navigate to quote page, or call an API
    alert(`
      Quote Generated!

      Company Size: ${input.companySize}
      Tier: ${input.tier}
      Total Users: ${input.totalUsers}

      Annual Total: $${breakdown.total.toLocaleString()}
      Your Commission: $${breakdown.partnerCommission.toLocaleString()}
    `)
  }

  return (
    <div className="min-h-screen bg-page p-6">
      <PricingCalculator
        commissionPercentage={15}  // Your partner commission %
        onCalculate={handleCalculate}
        onGenerateQuote={handleGenerateQuote}
      />
    </div>
  )
}

// =============================================================================
// TYPES REFERENCE (exported from PricingCalculator.tsx)
// =============================================================================

/*
type CompanySize = 'startup' | 'small' | 'medium' | 'enterprise'
type BillingCycle = 'monthly' | 'annual'
type PricingTier = 'starter' | 'professional' | 'enterprise'

interface PricingInput {
  companySize: CompanySize
  totalUsers: number
  viewerUsers: number
  contributorUsers: number
  powerUsers: number
  creatorUsers: number
  tier: PricingTier
  billingCycle: BillingCycle
}

interface PricingBreakdown {
  platformBase: number
  viewerLicenses: number
  contributorLicenses: number
  powerUserLicenses: number
  creatorLicenses: number
  subtotal: number
  annualDiscount: number
  total: number
  partnerCommission: number
  monthlyEquivalent: number
}
*/

export default PricingCalculatorExample
