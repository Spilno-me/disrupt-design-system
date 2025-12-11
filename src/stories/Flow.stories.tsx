import type { Meta, StoryObj } from '@storybook/react'

// Placeholder component for Flow section
const FlowPlaceholder = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-bold text-dark mb-2">Flow Components</h2>
    <p className="text-muted">Components for the Flow section will be added here.</p>
  </div>
)

const meta: Meta<typeof FlowPlaceholder> = {
  title: 'Flow/Overview',
  component: FlowPlaceholder,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof FlowPlaceholder>

export const ComingSoon: Story = {}
