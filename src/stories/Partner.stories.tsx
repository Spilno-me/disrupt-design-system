import type { Meta, StoryObj } from '@storybook/react'

// Placeholder component for Partner section
const PartnerPlaceholder = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-bold text-dark mb-2">Partner Components</h2>
    <p className="text-muted">Components for the Partner section will be added here.</p>
  </div>
)

const meta: Meta<typeof PartnerPlaceholder> = {
  title: 'Partner/Overview',
  component: PartnerPlaceholder,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof PartnerPlaceholder>

export const ComingSoon: Story = {}
