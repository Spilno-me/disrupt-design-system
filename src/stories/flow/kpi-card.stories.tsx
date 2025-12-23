/**
 * KPICard Stories - Enhanced metric visualization with status zones
 *
 * Features demonstrated:
 * - Status zone gradient sparklines (red/amber/green thermometer)
 * - Temporal progress indicator ("now" marker for incomplete periods)
 * - State transitions (success → warning → critical)
 * - Frosted glass status text for contrast
 * - Threshold-based automatic status detection
 */
import * as React from 'react'
import { useState, useEffect } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { TriangleAlert, ShieldCheck, Activity, Heart } from 'lucide-react'
import { KPICard, type StatusThresholds } from '../../flow/components/dashboard/KPICard'
import { IPhoneFrame } from '../_infrastructure/device-frames'

const meta: Meta<typeof KPICard> = {
  title: 'Flow/Dashboard/KPICard',
  component: KPICard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof KPICard>

// =============================================================================
// SAMPLE DATA
// =============================================================================

// Simulate a month of LTIR data (injury rate that stays at 0)
const ltirSuccessData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

// Simulate data where an incident occurs mid-month
const ltirIncidentData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

// Simulate fluctuating data crossing thresholds
const fluctuatingData = [0.2, 0.5, 0.3, 0.8, 1.2, 0.9, 1.5, 2.1, 1.8, 2.5, 2.2, 1.9, 2.8, 3.1, 2.6]

// Positive metric (higher is better) - completion rate
const completionData = [65, 68, 72, 70, 75, 78, 82, 80, 85, 88, 90, 92, 95, 93, 97]

// Standard thresholds for LTIR (injuries per 200k hours)
const ltirThresholds: StatusThresholds = {
  warning: 1,    // 1+ = warning
  critical: 3,   // 3+ = critical
}

// Completion rate thresholds (inverse - lower is worse)
const completionThresholds: StatusThresholds = {
  warning: 70,   // Below 70% = warning
  critical: 50,  // Below 50% = critical
}

// =============================================================================
// BASIC STORIES
// =============================================================================

/**
 * Default success state - zero injuries, target achieved
 */
export const SuccessState: Story = {
  args: {
    title: 'Lost Time Injury Rate',
    value: 0,
    isHero: true,
    zeroIsCelebratory: true,
    isNegativeMetric: true,
    sparklineData: ltirSuccessData,
    thresholds: ltirThresholds,
    showStatusZones: true,
  },
}

/**
 * Warning state - approaching threshold
 */
export const WarningState: Story = {
  args: {
    title: 'Lost Time Injury Rate',
    value: 1.5,
    isHero: true,
    isNegativeMetric: true,
    sparklineData: fluctuatingData,
    thresholds: ltirThresholds,
    showStatusZones: true,
    statusMessages: {
      warning: '1.5 injuries - above target',
    },
  },
}

/**
 * Critical state - needs immediate action
 */
export const CriticalState: Story = {
  args: {
    title: 'Lost Time Injury Rate',
    value: 3.2,
    isHero: true,
    isNegativeMetric: true,
    sparklineData: [...fluctuatingData, 3.0, 3.1, 3.2],
    thresholds: ltirThresholds,
    showStatusZones: true,
    statusMessages: {
      critical: 'Immediate review required',
    },
  },
}

// =============================================================================
// TEMPORAL PROGRESS STORIES
// =============================================================================

/**
 * Mid-month view - shows "now" marker and faded future
 *
 * Key insight: The chart doesn't extend to the right edge because
 * we're only 60% through the measurement period.
 */
export const MidPeriodProgress: Story = {
  args: {
    title: 'Lost Time Injury Rate',
    value: 0,
    description: 'Month to date (Day 18 of 30)',
    isHero: true,
    zeroIsCelebratory: true,
    isNegativeMetric: true,
    sparklineData: ltirSuccessData,
    thresholds: ltirThresholds,
    showStatusZones: true,
    periodProgress: 60, // 60% through the month
  },
}

/**
 * Quarter start - minimal progress shown
 */
export const QuarterStart: Story = {
  args: {
    title: 'Quarterly Safety Score',
    value: 98,
    description: 'Q4 2024 (Week 2 of 13)',
    isHero: true,
    isNegativeMetric: false, // Higher is better
    sparklineData: [95, 96, 97, 98],
    thresholds: { warning: 80, critical: 60 },
    showStatusZones: true,
    periodProgress: 15, // 15% through the quarter
  },
}

// =============================================================================
// STATUS ZONE GRADIENT STORIES
// =============================================================================

/**
 * Status zones visible - shows red/amber/green gradient background
 *
 * The gradient creates an immediate "thermometer" mental model:
 * - Bottom (green): target zone
 * - Middle (amber): caution zone
 * - Top (red): danger zone
 */
export const WithStatusZones: Story = {
  args: {
    title: 'Total Recordable Incidents',
    value: 1.8,
    isNegativeMetric: true,
    sparklineData: fluctuatingData,
    thresholds: { warning: 1.5, critical: 2.5 },
    showStatusZones: true,
    icon: <TriangleAlert className="w-5 h-5" />,
  },
}

/**
 * Positive metric with zones - higher is better
 *
 * For metrics like completion rate, the zones are inverted:
 * - Top (green): excellent
 * - Middle (amber): needs improvement
 * - Bottom (red): critical
 */
export const PositiveMetricZones: Story = {
  args: {
    title: 'Training Completion',
    value: 92,
    isNegativeMetric: false,
    sparklineData: completionData,
    thresholds: completionThresholds,
    showStatusZones: true,
    icon: <ShieldCheck className="w-5 h-5" />,
    statusMessages: {
      success: '92% completed - excellent!',
    },
  },
}

// =============================================================================
// STATE TRANSITION DEMO
// =============================================================================

/**
 * Interactive state transition demo
 *
 * This story simulates what happens when an injury occurs:
 * 1. Status changes from success → warning/critical
 * 2. Colors transition smoothly (300ms)
 * 3. Icon changes to reflect new state
 * 4. Chart line crosses into danger zone
 */
export const StateTransitionDemo: Story = {
  render: function StateTransitionStory() {
    const [value, setValue] = useState(0)
    const [data, setData] = useState(ltirSuccessData)

    // Simulate an incident occurring
    const triggerIncident = () => {
      setValue(1)
      setData(ltirIncidentData)
    }

    // Reset to success state
    const reset = () => {
      setValue(0)
      setData(ltirSuccessData)
    }

    // Auto-cycle for demo
    useEffect(() => {
      const interval = setInterval(() => {
        setValue(prev => {
          if (prev === 0) {
            setData(ltirIncidentData)
            return 1
          } else if (prev === 1) {
            setData([...fluctuatingData, 3.0, 3.1, 3.2])
            return 3.2
          } else {
            setData(ltirSuccessData)
            return 0
          }
        })
      }, 3000)

      return () => clearInterval(interval)
    }, [])

    return (
      <div className="space-y-4">
        <KPICard
          title="Lost Time Injury Rate"
          value={value}
          isHero
          zeroIsCelebratory
          isNegativeMetric
          sparklineData={data}
          thresholds={ltirThresholds}
          showStatusZones
          periodProgress={75}
        />

        <div className="flex gap-2 text-xs">
          <button
            onClick={reset}
            className="px-3 py-1.5 bg-success/10 text-success rounded-md hover:bg-success/20"
          >
            Reset (0)
          </button>
          <button
            onClick={triggerIncident}
            className="px-3 py-1.5 bg-warning/10 text-warning-dark rounded-md hover:bg-warning/20"
          >
            Warning (1)
          </button>
          <button
            onClick={() => {
              setValue(3.2)
              setData([...fluctuatingData, 3.0, 3.1, 3.2])
            }}
            className="px-3 py-1.5 bg-error/10 text-error rounded-md hover:bg-error/20"
          >
            Critical (3.2)
          </button>
        </div>

        <p className="text-xs text-muted">
          States auto-cycle every 3s. Watch the smooth color transitions.
        </p>
      </div>
    )
  },
}

// =============================================================================
// COMPARISON: OLD VS NEW
// =============================================================================

/**
 * Side-by-side comparison of old vs new styling
 */
export const BeforeAfterComparison: Story = {
  render: () => (
    <div className="space-y-6 w-[680px]">
      <h3 className="text-sm font-semibold text-primary">Before vs After</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* OLD: Basic sparkline, text blends with line */}
        <div className="space-y-2">
          <p className="text-xs text-muted uppercase tracking-wide">Before</p>
          <KPICard
            title="Lost Time Injury Rate"
            value={0}
            isHero
            zeroIsCelebratory
            isNegativeMetric
            sparklineData={ltirSuccessData}
            // No thresholds, no zones, no progress
          />
          <ul className="text-[10px] text-muted space-y-0.5">
            <li>• Green text blends with green line</li>
            <li>• No indication of "where we are" in period</li>
            <li>• Chart appears finished</li>
          </ul>
        </div>

        {/* NEW: Status zones, temporal progress, frosted glass text */}
        <div className="space-y-2">
          <p className="text-xs text-muted uppercase tracking-wide">After</p>
          <KPICard
            title="Lost Time Injury Rate"
            value={0}
            isHero
            zeroIsCelebratory
            isNegativeMetric
            sparklineData={ltirSuccessData}
            thresholds={ltirThresholds}
            showStatusZones
            periodProgress={65}
          />
          <ul className="text-[10px] text-muted space-y-0.5">
            <li>• Frosted glass background for text contrast</li>
            <li>• "Now" marker shows current position</li>
            <li>• Status zones provide context</li>
          </ul>
        </div>
      </div>
    </div>
  ),
}

// =============================================================================
// MOBILE VIEW
// =============================================================================

/**
 * Mobile dashboard layout with multiple KPI cards
 */
export const MobileDashboard: Story = {
  render: () => (
    <IPhoneFrame model="iphone15pro">
      <div className="p-4 space-y-3 bg-cream">
        <h2 className="text-lg font-semibold text-primary">Safety Metrics</h2>
        <p className="text-xs text-muted">December 2024 (Day 18 of 31)</p>

        <div className="space-y-3">
          <KPICard
            title="Lost Time Injury Rate"
            value={0}
            isHero
            zeroIsCelebratory
            isNegativeMetric
            sparklineData={ltirSuccessData}
            thresholds={ltirThresholds}
            showStatusZones
            periodProgress={58}
          />

          <div className="grid grid-cols-2 gap-3">
            <KPICard
              title="Near Miss Reports"
              value={12}
              icon={<Activity className="w-5 h-5" />}
              sparklineData={[5, 7, 8, 9, 10, 11, 12]}
              isNegativeMetric={false}
              thresholds={{ warning: 5, critical: 2 }}
              showStatusZones
              periodProgress={58}
            />

            <KPICard
              title="Training Complete"
              value="94%"
              icon={<ShieldCheck className="w-5 h-5" />}
              sparklineData={[85, 87, 89, 91, 92, 93, 94]}
              isNegativeMetric={false}
              thresholds={{ warning: 80, critical: 60 }}
              showStatusZones
              periodProgress={58}
            />
          </div>

          <KPICard
            title="Days Since Last Incident"
            value={127}
            description="Keep the streak going!"
            isPositive
            icon={<Heart className="w-5 h-5" />}
            sparklineData={[100, 105, 110, 115, 118, 120, 123, 125, 127]}
          />
        </div>
      </div>
    </IPhoneFrame>
  ),
}

// =============================================================================
// ALL STATES GRID
// =============================================================================

/**
 * All possible states in a grid for visual QA
 */
export const AllStatesGrid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-[1000px]">
      {/* Success states */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-success uppercase">Success</p>
        <KPICard
          title="LTIR (Zero)"
          value={0}
          zeroIsCelebratory
          isNegativeMetric
          sparklineData={ltirSuccessData}
          thresholds={ltirThresholds}
          showStatusZones
        />
        <KPICard
          title="Completion (High)"
          value="95%"
          isNegativeMetric={false}
          sparklineData={completionData}
          thresholds={completionThresholds}
          showStatusZones
        />
      </div>

      {/* Warning states */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-warning-dark uppercase">Warning</p>
        <KPICard
          title="LTIR (1 incident)"
          value={1.2}
          isNegativeMetric
          sparklineData={[0, 0, 0.2, 0.5, 0.8, 1.0, 1.2]}
          thresholds={ltirThresholds}
          showStatusZones
        />
        <KPICard
          title="Completion (Low)"
          value="68%"
          isNegativeMetric={false}
          sparklineData={[80, 78, 75, 72, 70, 68]}
          thresholds={completionThresholds}
          showStatusZones
        />
      </div>

      {/* Critical states */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-error uppercase">Critical</p>
        <KPICard
          title="LTIR (Multiple)"
          value={3.5}
          isNegativeMetric
          sparklineData={[0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5]}
          thresholds={ltirThresholds}
          showStatusZones
        />
        <KPICard
          title="Completion (Critical)"
          value="45%"
          isNegativeMetric={false}
          sparklineData={[70, 65, 60, 55, 50, 45]}
          thresholds={completionThresholds}
          showStatusZones
        />
      </div>
    </div>
  ),
}
