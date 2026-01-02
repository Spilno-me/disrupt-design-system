/**
 * MetricsDashboardWidget Stories
 *
 * Monday.com-style multi-metric widget for executive dashboards.
 * Displays multiple related KPIs in a horizontal row with a shared chart.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { MoreHorizontal } from 'lucide-react'
import {
  MOLECULE_META,
  moleculeDescription,
  StorySection,
} from '../_infrastructure'
import { MetricsDashboardWidget } from '../../flow/components/dashboard'
import { BlobSection } from '../../components/ui/GridBlobCanvas'
import type {
  MetricItem,
  ChartDataPoint,
} from '../../flow/components/dashboard'
import { Button } from '../../components/ui/button'

// =============================================================================
// MOCK DATA - Dynamic dates based on current month
// =============================================================================

/** Generate chart dates relative to current date */
function getRecentDates(count: number = 6): string[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const dates: string[] = []

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(1) // First of month
    d.setMonth(d.getMonth() - Math.floor(i / 2))
    const day = i % 2 === 0 ? 1 : 15
    dates.push(`${months[d.getMonth()]} ${day}`)
  }
  return dates
}

const recentDates = getRecentDates(6)

const mockChartData: ChartDataPoint[] = [
  { date: recentDates[0], scope: 280, started: 40, completed: 150 },
  { date: recentDates[1], scope: 295, started: 45, completed: 158 },
  { date: recentDates[2], scope: 310, started: 52, completed: 168 },
  { date: recentDates[3], scope: 330, started: 58, completed: 178 },
  { date: recentDates[4], scope: 350, started: 62, completed: 188 },
  { date: recentDates[5], scope: 356, started: 64, completed: 192 },
]

const projectMetrics: MetricItem[] = [
  { label: 'Scope', value: 356, trend: '+32%', color: 'info' },
  { label: 'Started', value: 64, color: 'aging' },
  { label: 'Completed', value: 192, color: 'success' },
]

const ehsMetrics: MetricItem[] = [
  { label: 'Incidents', value: 12, trend: '-15%', trendPositive: true, color: 'error' },
  { label: 'Near Misses', value: 28, color: 'warning' },
  { label: 'Days Safe', value: 147, trend: '+147', color: 'success' },
]

/** Generate recent month names */
function getRecentMonths(count: number = 6): string[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const result: string[] = []

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setMonth(d.getMonth() - i)
    result.push(months[d.getMonth()])
  }
  return result
}

const recentMonths = getRecentMonths(6)

const ehsChartData: ChartDataPoint[] = [
  { date: recentMonths[0], incidents: 18, nearmisses: 35, dayssafe: 0 },
  { date: recentMonths[1], incidents: 15, nearmisses: 32, dayssafe: 31 },
  { date: recentMonths[2], incidents: 14, nearmisses: 30, dayssafe: 61 },
  { date: recentMonths[3], incidents: 13, nearmisses: 29, dayssafe: 92 },
  { date: recentMonths[4], incidents: 12, nearmisses: 28, dayssafe: 122 },
  { date: recentMonths[5], incidents: 12, nearmisses: 28, dayssafe: 147 },
]

const salesMetrics: MetricItem[] = [
  { label: 'Revenue', value: 284500, trend: '+12%', color: 'success' },
  { label: 'Pipeline', value: 892000, color: 'info' },
  { label: 'Closed Won', value: 45, trend: '+8', color: 'accent' },
]

const salesChartData: ChartDataPoint[] = [
  { date: 'Q1', revenue: 180000, pipeline: 650000, closedwon: 28 },
  { date: 'Q2', revenue: 210000, pipeline: 720000, closedwon: 32 },
  { date: 'Q3', revenue: 245000, pipeline: 810000, closedwon: 38 },
  { date: 'Q4', revenue: 284500, pipeline: 892000, closedwon: 45 },
]

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof MetricsDashboardWidget> = {
  title: 'Flow/MetricsDashboardWidget',
  component: MetricsDashboardWidget,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    layout: 'fullscreen',
    docs: {
      description: {
        component: moleculeDescription(`
Monday.com-style multi-metric dashboard widget.

**Features:**
- Multiple metrics displayed horizontally with colored dot indicators
- Large typography for quick value scanning
- Inline trend badges (+/- percentages)
- Shared multi-line area chart
- Optional glass border with glassmorphism effect
- Designed for grid + blob background pages

**Use Cases:**
- Executive dashboards with related KPIs
- Project progress tracking
- EHS safety metrics overview
- Sales pipeline summaries
        `),
      },
    },
  },
  decorators: [
    (Story) => (
      <BlobSection className="min-h-screen w-full p-8 bg-page flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <Story />
        </div>
      </BlobSection>
    ),
  ],
  argTypes: {
    borderStyle: {
      control: 'select',
      options: ['glass', 'glass-gradient', 'default'],
      description: 'Border style variant (glass is default)',
    },
    showAreaFill: {
      control: 'boolean',
      description: 'Show area fill under chart lines',
    },
    chartHeight: {
      control: { type: 'range', min: 100, max: 300, step: 20 },
      description: 'Height of the chart area in pixels',
    },
  },
}

export default meta
type Story = StoryObj<typeof MetricsDashboardWidget>

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default configuration - glass border with gradient accent.
 * Shows project progress metrics with a multi-line chart.
 */
export const Default: Story = {
  args: {
    metrics: projectMetrics,
    chartData: mockChartData,
    borderStyle: 'glass-gradient',
  },
}

/**
 * Glass border only - clean glass effect without gradient accent.
 */
export const GlassOnly: Story = {
  args: {
    metrics: projectMetrics,
    chartData: mockChartData,
    borderStyle: 'glass',
  },
}

/**
 * EHS Safety metrics showing incident tracking.
 */
export const EHSSafetyMetrics: Story = {
  args: {
    metrics: ehsMetrics,
    chartData: ehsChartData,
    chartHeight: 140,
    borderStyle: 'glass-gradient',
  },
}

/**
 * Sales metrics with revenue and pipeline data.
 */
export const SalesMetrics: Story = {
  args: {
    metrics: salesMetrics,
    chartData: salesChartData,
    borderStyle: 'glass-gradient',
  },
}

/**
 * Minimal widget without chart - metrics only.
 */
export const MetricsOnly: Story = {
  args: {
    metrics: projectMetrics,
    borderStyle: 'glass-gradient',
  },
}

/**
 * With custom header action button.
 */
export const WithHeaderAction: Story = {
  args: {
    metrics: projectMetrics,
    chartData: mockChartData,
    borderStyle: 'glass-gradient',
    headerAction: (
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <MoreHorizontal className="w-4 h-4" />
      </Button>
    ),
  },
}

/**
 * Lines only - no area fill under the chart.
 */
export const LinesOnly: Story = {
  args: {
    metrics: projectMetrics,
    chartData: mockChartData,
    showAreaFill: false,
    borderStyle: 'glass-gradient',
  },
}

/**
 * Two metrics - simpler layout.
 */
export const TwoMetrics: Story = {
  args: {
    metrics: [
      { label: 'Active', value: 128, trend: '+12', color: 'info' },
      { label: 'Resolved', value: 95, trend: '+8', color: 'success' },
    ],
    chartData: [
      { date: 'Week 1', active: 100, resolved: 70 },
      { date: 'Week 2', active: 110, resolved: 78 },
      { date: 'Week 3', active: 118, resolved: 85 },
      { date: 'Week 4', active: 128, resolved: 95 },
    ],
    borderStyle: 'glass-gradient',
  },
}

/**
 * AllStates - Comprehensive showcase of all variants and configurations.
 */
export const AllStates: Story = {
  decorators: [
    (Story) => (
      <div className="space-y-8">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      <StorySection title="Glass + Gradient (Default)">
        <MetricsDashboardWidget
          metrics={projectMetrics}
          chartData={mockChartData}
          borderStyle="glass-gradient"
        />
      </StorySection>

      <StorySection title="Glass Only">
        <MetricsDashboardWidget
          metrics={projectMetrics}
          chartData={mockChartData}
          borderStyle="glass"
        />
      </StorySection>

      <StorySection title="EHS Safety Metrics">
        <MetricsDashboardWidget
          metrics={ehsMetrics}
          chartData={ehsChartData}
          chartHeight={140}
          borderStyle="glass-gradient"
        />
      </StorySection>

      <StorySection title="Sales Dashboard">
        <MetricsDashboardWidget
          metrics={salesMetrics}
          chartData={salesChartData}
          borderStyle="glass-gradient"
        />
      </StorySection>

      <StorySection title="Metrics Only (No Chart)">
        <MetricsDashboardWidget
          metrics={projectMetrics}
          borderStyle="glass-gradient"
        />
      </StorySection>

      <StorySection title="Lines Only (No Area Fill)">
        <MetricsDashboardWidget
          metrics={projectMetrics}
          chartData={mockChartData}
          showAreaFill={false}
          borderStyle="glass-gradient"
        />
      </StorySection>

      <StorySection title="Two Metrics">
        <MetricsDashboardWidget
          metrics={[
            { label: 'Active', value: 128, trend: '+12', color: 'info' },
            { label: 'Resolved', value: 95, trend: '+8', color: 'success' },
          ]}
          chartData={[
            { date: 'Week 1', active: 100, resolved: 70 },
            { date: 'Week 2', active: 110, resolved: 78 },
            { date: 'Week 3', active: 118, resolved: 85 },
            { date: 'Week 4', active: 128, resolved: 95 },
          ]}
          borderStyle="glass-gradient"
        />
      </StorySection>

      <StorySection title="With Header Action">
        <MetricsDashboardWidget
          metrics={projectMetrics}
          chartData={mockChartData}
          borderStyle="glass-gradient"
          headerAction={
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          }
        />
      </StorySection>

      <StorySection title="Color Variants">
        <div className="space-y-6">
          <MetricsDashboardWidget
            metrics={[
              { label: 'Info', value: 100, color: 'info' },
              { label: 'Success', value: 200, color: 'success' },
              { label: 'Warning', value: 50, color: 'warning' },
              { label: 'Error', value: 10, color: 'error' },
            ]}
            borderStyle="glass-gradient"
          />
          <MetricsDashboardWidget
            metrics={[
              { label: 'Accent', value: 75, color: 'accent' },
              { label: 'Aging', value: 30, color: 'aging' },
              { label: 'Secondary', value: 45, color: 'secondary' },
            ]}
            borderStyle="glass-gradient"
          />
        </div>
      </StorySection>
    </>
  ),
}
