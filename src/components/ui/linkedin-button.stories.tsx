import type { Meta, StoryObj } from '@storybook/react'
import { LinkedInButton } from './LinkedInButton'

const meta = {
  title: 'Website/LinkedInButton',
  component: LinkedInButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An animated LinkedIn icon button with spinning dashed border. Features a spin animation on hover with inertia and color fill effect.',
      },
    },
  },
  tags: ['autodocs'],
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
} satisfies Meta<typeof LinkedInButton>

export default meta
type Story = StoryObj<typeof LinkedInButton>

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
