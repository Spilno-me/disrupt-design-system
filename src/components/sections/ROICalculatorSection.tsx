import { useState, useMemo } from 'react'
import { Card } from '../ui/card'
import { Slider } from '../ui/Slider'
import { COLORS } from '@/constants/designTokens'

// =============================================================================
// CONSTANTS
// =============================================================================

const WORKING_DAYS_PER_YEAR = 250
const AGENTIC_MONTHLY_COST_PER_USER = 10 // Viewer License
const INCUMBENT_COST_PER_TASK = 2.5

// =============================================================================
// COST DISPLAY COMPONENT
// =============================================================================

interface CostDisplayProps {
  label: string
  amount: number
  subtitle: string
  variant: 'incumbent' | 'agentic' | 'savings'
}

function CostDisplay({ label, amount, subtitle, variant }: CostDisplayProps) {
  const amountColors = {
    incumbent: COLORS.circleRed,
    agentic: COLORS.dark,
    savings: COLORS.circleGreen,
  }

  const subtitleColors = {
    incumbent: `${COLORS.red}B3`, // 70% opacity
    agentic: COLORS.muted,
    savings: COLORS.circleGreen,
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="font-sans text-sm uppercase tracking-wider font-medium text-primary">
        {label}
      </span>
      <span
        className={`font-display font-bold ${variant === 'savings' ? 'text-4xl lg:text-5xl' : 'text-3xl lg:text-4xl'}`}
        style={{ color: amountColors[variant] }}
      >
        ${amount.toLocaleString()}
      </span>
      <span className="font-sans text-xs" style={{ color: subtitleColors[variant] }}>
        {subtitle}
      </span>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ROICalculatorSection() {
  const [workers, setWorkers] = useState(100)
  const [tasksPerDay, setTasksPerDay] = useState(5)

  const calculations = useMemo(() => {
    const totalTasksPerYear = workers * tasksPerDay * WORKING_DAYS_PER_YEAR
    const incumbentAnnualCost = totalTasksPerYear * INCUMBENT_COST_PER_TASK
    const agenticAnnualCost = workers * AGENTIC_MONTHLY_COST_PER_USER * 12
    const annualSavings = incumbentAnnualCost - agenticAnnualCost

    return {
      incumbentAnnualCost: Math.round(incumbentAnnualCost),
      agenticAnnualCost: Math.round(agenticAnnualCost),
      annualSavings: Math.round(annualSavings),
    }
  }, [workers, tasksPerDay])

  return (
    <section
      className="py-11 bg-page border-y-dashed-figma"
      data-element="roi-calculator-section"
    >
      <div className="max-w-container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col items-start lg:items-center gap-3 lg:gap-5 mb-11">
          <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-[30px] leading-[1.2] tracking-tight text-left lg:text-center text-primary">
            ROI CALCULATOR: See Your Savings
          </h2>
          <p className="font-display font-medium text-sm sm:text-base lg:text-lg text-left lg:text-center max-w-[800px] text-accent">
            Drag the sliders to see how much incumbent "Flat-Tax" fees are costing you versus our Flat-Rate model.
          </p>
        </div>

        {/* Calculator Card */}
        <Card variant="pricing" shadow="sm" className="max-w-[1120px] mx-auto overflow-hidden !p-0">
          <div className="flex flex-col lg:flex-row">
            {/* Results - Top on mobile, Right on desktop */}
            <div className="flex-1 p-6 lg:p-8 lg:pl-12 order-1 lg:order-2 lg:border-l lg:border-dashed border-default flex flex-col justify-center gap-8">
              <CostDisplay
                label="Incumbent Annual Cost"
                amount={calculations.incumbentAnnualCost}
                subtitle="Variable & Unpredictable"
                variant="incumbent"
              />

              <CostDisplay
                label="Agentic Annual Cost"
                amount={calculations.agenticAnnualCost}
                subtitle="Predictable"
                variant="agentic"
              />

              <div className="pt-6 border-t border-default">
                <CostDisplay
                  label="Total Annual Savings"
                  amount={calculations.annualSavings}
                  subtitle=""
                  variant="savings"
                />
              </div>
            </div>

            {/* Sliders - Bottom on mobile, Left on desktop */}
            <div className="flex-1 p-6 lg:p-8 order-2 lg:order-1 border-t lg:border-t-0 border-default">
              <div className="flex flex-col gap-10">
                {/* Workers Slider */}
                <Slider
                  label="Number of Field Workers"
                  value={workers}
                  min={10}
                  max={1000}
                  step={10}
                  unit="Workers"
                  onChange={setWorkers}
                />

                {/* Tasks Slider */}
                <Slider
                  label="Daily AI Tasks Per Worker (Photos/Video)"
                  value={tasksPerDay}
                  min={1}
                  max={20}
                  step={1}
                  unit="Tasks/Day"
                  onChange={setTasksPerDay}
                />

                {/* Assumptions Box */}
                <div className="p-4 rounded-sm bg-muted-100">
                  <p className="font-sans font-semibold text-xs mb-2 text-muted">
                    Assumptions:
                  </p>
                  <ul className="flex flex-col gap-1">
                    <li className="font-sans text-xs text-muted">
                      Working Days: {WORKING_DAYS_PER_YEAR}/year
                    </li>
                    <li className="font-sans text-xs text-muted">
                      Agentic Cost: Flat ${AGENTIC_MONTHLY_COST_PER_USER}/mo per user (Viewer License)
                    </li>
                    <li className="font-sans text-xs text-muted">
                      Incumbent Cost: ${INCUMBENT_COST_PER_TASK.toFixed(2)} per task
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
