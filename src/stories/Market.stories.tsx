import type { Meta, StoryObj } from '@storybook/react'
import { MOLECULE_META, moleculeDescription } from './_infrastructure'

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
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription('Placeholder for Market section components. Components for marketplace management will be added here.'),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof MarketPlaceholder>

export const ComingSoon: Story = {}
