import type { Meta, StoryObj } from '@storybook/react'
import { MOLECULE_META, moleculeDescription } from './_infrastructure'

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
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription('Placeholder for Partner section components. Components for partner portal management will be added here.'),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof PartnerPlaceholder>

export const ComingSoon: Story = {}
