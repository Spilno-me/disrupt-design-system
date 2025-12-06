import type { Meta, StoryObj } from '@storybook/react'
import { CTASection } from './CTASection'

const meta: Meta<typeof CTASection> = {
  title: 'Website/Sections/CTASection',
  component: CTASection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Main heading text',
    },
    subtitle: {
      control: 'text',
      description: 'Supporting subtitle text',
    },
    buttonText: {
      control: 'text',
      description: 'Primary button text',
    },
    buttonVariant: {
      control: 'select',
      options: ['default', 'contact', 'outline'],
      description: 'Button style variant',
    },
    secondaryButtonText: {
      control: 'text',
      description: 'Secondary button text (optional)',
    },
    background: {
      control: 'select',
      options: ['white', 'cream', 'dark'],
      description: 'Background color',
    },
    centered: {
      control: 'boolean',
      description: 'Center content on all screen sizes',
    },
  },
}

export default meta
type Story = StoryObj<typeof CTASection>

// Default CTA
export const Default: Story = {
  args: {
    title: 'Ready to Get Started?',
    subtitle: 'Join thousands of companies already using our platform.',
    buttonText: 'Start Free Trial',
    buttonVariant: 'contact',
    centered: true,
  },
}

// Partner CTA (from website - ReadyToAchieveSection)
export const BecomePartner: Story = {
  args: {
    title: 'Ready to Achieve Predictive Prevention?',
    subtitle: 'Stop paying extra for AI, upgrades, and consulting that drains your ROI today.',
    buttonText: 'Become a Partner',
    buttonVariant: 'contact',
    centered: true,
  },
}

// With secondary button
export const WithSecondaryButton: Story = {
  args: {
    title: 'Transform Your Workflow',
    subtitle: 'See how our platform can help your team work smarter.',
    buttonText: 'Get Started',
    secondaryButtonText: 'Learn More',
    buttonVariant: 'contact',
    centered: true,
  },
}

// With custom content
export const WithCustomContent: Story = {
  render: () => (
    <CTASection
      title="Enterprise Solutions"
      subtitle="Custom pricing for large organizations"
      buttonText="Contact Sales"
      buttonVariant="contact"
    >
      <div className="flex gap-8 mb-8 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-teal/20 flex items-center justify-center text-teal text-xs">✓</span>
          Unlimited users
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-teal/20 flex items-center justify-center text-teal text-xs">✓</span>
          Dedicated support
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-teal/20 flex items-center justify-center text-teal text-xs">✓</span>
          Custom integrations
        </div>
      </div>
    </CTASection>
  ),
}
