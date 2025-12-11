import type { Meta, StoryObj } from '@storybook/react'

// Placeholder component for Market section
const MarketPlaceholder = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-bold text-dark mb-2">Market Components</h2>
    <p className="text-muted">Components for the Market section will be added here.</p>
  </div>
)

const meta: Meta<typeof MarketPlaceholder> = {
  title: 'Market/Overview',
  component: MarketPlaceholder,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof MarketPlaceholder>

export const ComingSoon: Story = {}
