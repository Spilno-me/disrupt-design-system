import type { Meta, StoryObj } from '@storybook/react'
import { StatsCard } from './StatsCard'

const meta: Meta<typeof StatsCard> = {
  title: 'Partner/Components/StatsCard',
  component: StatsCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    trendDirection: {
      control: 'select',
      options: ['up', 'down', 'neutral'],
    },
  },
}

export default meta
type Story = StoryObj<typeof StatsCard>

export const Default: Story = {
  args: {
    title: 'Total Leads',
    value: 6,
    trend: '+12%',
    trendDirection: 'up',
  },
}

export const TrendUp: Story = {
  args: {
    title: 'Revenue',
    value: '$15,231',
    trend: '+24.5%',
    trendDirection: 'up',
    description: 'Compared to last month',
  },
}

export const TrendDown: Story = {
  args: {
    title: 'Churn Rate',
    value: '5.2%',
    trend: '-2.1%',
    trendDirection: 'down',
  },
}

export const NeutralTrend: Story = {
  args: {
    title: 'Converted',
    value: 0,
    trend: '0.0%',
    trendDirection: 'neutral',
  },
}

export const WithDescription: Story = {
  args: {
    title: 'Avg Response Time',
    value: '24h',
    trend: '-2h',
    trendDirection: 'up',
    description: 'Faster than last week',
  },
}

export const NoTrend: Story = {
  args: {
    title: 'High Priority',
    value: 3,
  },
}

export const LargeNumber: Story = {
  args: {
    title: 'Total Users',
    value: '1,234,567',
    trend: '+45%',
    trendDirection: 'up',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-page">
      <StatsCard
        title="Total Leads"
        value={6}
        trend="+12%"
        trendDirection="up"
      />
      <StatsCard
        title="New Leads"
        value={0}
        trend="+5"
        trendDirection="up"
      />
      <StatsCard
        title="Converted"
        value={0}
        trend="0.0%"
        trendDirection="neutral"
      />
      <StatsCard
        title="Lost"
        value={2}
        trend="-3"
        trendDirection="down"
      />
    </div>
  ),
}
