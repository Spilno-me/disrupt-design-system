import type { Meta, StoryObj } from '@storybook/react'
import {
  ATOM_META,
  atomDescription,
} from '@/stories/_infrastructure'
import { LinkedInButton } from './LinkedInButton'

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta<typeof LinkedInButton> = {
  title: 'Website/LinkedInButton',
  component: LinkedInButton,
  ...ATOM_META,
  parameters: {
    ...ATOM_META.parameters,
    docs: {
      description: {
        component: atomDescription(
          'Animated LinkedIn icon button with spinning dashed border. Features spin animation on hover with inertia and color fill effect.'
        ),
      },
    },
  },
  argTypes: {
    href: {
      control: 'text',
      description: 'LinkedIn profile/company URL',
    },
    size: {
      control: { type: 'number', min: 24, max: 64, step: 4 },
      description: 'Button size in pixels',
    },
  },
}

export default meta
type Story = StoryObj<typeof LinkedInButton>

// =============================================================================
// STORIES
// =============================================================================

// Default
export const Default: Story = {
  args: {
    href: 'https://linkedin.com/company/disrupt-software',
  },
}

// Small Size
export const Small: Story = {
  args: {
    href: 'https://linkedin.com',
    size: 24,
  },
}

// Large Size
export const Large: Story = {
  args: {
    href: 'https://linkedin.com',
    size: 48,
  },
}

// Size Comparison
export const SizeComparison: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <LinkedInButton size={24} />
        <span className="text-sm text-muted">24px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <LinkedInButton size={32} />
        <span className="text-sm text-muted">32px (default)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <LinkedInButton size={48} />
        <span className="text-sm text-muted">48px</span>
      </div>
    </div>
  ),
}
