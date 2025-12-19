import type { Meta, StoryObj } from '@storybook/react'
import { MOLECULE_META, moleculeDescription } from './_infrastructure'

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
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription('Placeholder for Flow section components. Components for EHS workflow management will be added here.'),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof FlowPlaceholder>

export const ComingSoon: Story = {}
