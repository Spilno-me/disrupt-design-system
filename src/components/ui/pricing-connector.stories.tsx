import type { Meta, StoryObj } from '@storybook/react'
import { PricingConnector } from './pricing-connector'
import { Minus, X, ArrowRight } from 'lucide-react'

const meta = {
  title: 'Components/PricingConnector',
  component: PricingConnector,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A connector element used between pricing components. Displays a red circle with a plus icon by default. Supports periodic spin animation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    spinInterval: {
      control: { type: 'number', min: 500, max: 10000, step: 500 },
      description: 'Interval between spins in milliseconds',
    },
    spinDuration: {
      control: { type: 'number', min: 200, max: 2000, step: 100 },
      description: 'Duration of spin animation in milliseconds',
    },
  },
} satisfies Meta<typeof PricingConnector>

export default meta
type Story = StoryObj<typeof PricingConnector>

// Default (no spin)
export const Default: Story = {}

// With Periodic Spin (every 3 seconds)
export const WithSpin: Story = {
  args: {
    spinInterval: 3000,
  },
}

// Fast Spin (every 1.5 seconds)
export const FastSpin: Story = {
  args: {
    spinInterval: 1500,
    spinDuration: 400,
  },
}

// Slow Spin (every 5 seconds)
export const SlowSpin: Story = {
  args: {
    spinInterval: 5000,
    spinDuration: 800,
  },
}

// Custom Icon
export const CustomIcon: Story = {
  args: {
    icon: <ArrowRight className="w-5 h-5 text-white" strokeWidth={3} />,
    spinInterval: 2000,
  },
}

// Side by Side Comparison
export const Comparison: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <PricingConnector />
        <span className="text-sm text-muted">Static</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PricingConnector spinInterval={2000} />
        <span className="text-sm text-muted">Spinning (2s)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PricingConnector spinInterval={1000} spinDuration={300} />
        <span className="text-sm text-muted">Fast (1s)</span>
      </div>
    </div>
  ),
}
