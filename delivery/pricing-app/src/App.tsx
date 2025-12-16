import { PricingCalculator } from './components/PricingCalculator'
import type { PricingInput, PricingBreakdown } from './components/PricingCalculator'

function App() {
  // Handler for when pricing is calculated
  const handleCalculate = (input: PricingInput, breakdown: PricingBreakdown) => {
    console.log('Pricing calculated:', {
      input,
      breakdown,
    })
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
      <div className="max-w-6xl mx-auto">
        <PricingCalculator
          commissionPercentage={15}
          onCalculate={handleCalculate}
          onGenerateQuote={handleGenerateQuote}
        />
      </div>
    </div>
  )
}

export default App
