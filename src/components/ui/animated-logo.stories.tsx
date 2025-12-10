import type { Meta, StoryObj } from '@storybook/react'
import { AnimatedLogo } from './AnimatedLogo'

const meta: Meta<typeof AnimatedLogo> = {
  title: 'Website/AnimatedLogo',
  component: AnimatedLogo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    colorMode: {
      control: 'select',
      options: ['dark', 'light'],
      description: 'Color mode - dark text on light bg, or light text on dark bg',
    },
    showTagline: {
      control: 'boolean',
      description: 'Whether to show the "Software Inc." tagline',
    },
    alt: {
      control: 'text',
      description: 'Alt text for accessibility',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
}

export default meta
type Story = StoryObj<typeof AnimatedLogo>

// Default logo
export const Default: Story = {
  args: {
    showTagline: true,
    colorMode: 'dark',
  },
}

// Dark mode (light text for dark backgrounds)
export const LightMode: Story = {
  args: {
    showTagline: true,
    colorMode: 'light',
  },
  decorators: [
    (Story) => (
      <div className="bg-inverseBg p-8 rounded-lg">
        <Story />
      </div>
    ),
  ],
}

// Without tagline
export const WithoutTagline: Story = {
  args: {
    showTagline: false,
    colorMode: 'dark',
  },
}

// Interactive demo
export const Interactive: Story = {
  args: {
    showTagline: true,
    colorMode: 'dark',
    onClick: () => alert('Logo clicked!'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Hover over the logo to see the pixel explosion animation. Click to trigger the animation manually.',
      },
    },
  },
}

// Comparison on different backgrounds
export const BackgroundComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="bg-page p-8 rounded-lg">
        <p className="text-sm text-muted mb-4">Light background (colorMode: dark)</p>
        <AnimatedLogo colorMode="dark" showTagline={true} />
      </div>
      <div className="bg-inverseBg p-8 rounded-lg">
        <p className="text-sm text-white/70 mb-4">Dark background (colorMode: light)</p>
        <AnimatedLogo colorMode="light" showTagline={true} />
      </div>
    </div>
  ),
}
