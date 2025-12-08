import type { Meta, StoryObj } from '@storybook/react'
import { Accordion } from './Accordion'
import { Card } from './card'
import { COLORS } from '../../constants/designTokens'

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An expandable/collapsible content component for FAQs and similar use cases.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '600px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof Accordion>

const FAQ_ITEMS = [
  {
    question: 'How does migration from legacy systems work?',
    answer: 'Our migration team works with you to map your existing data structures, workflows, and configurations. We provide automated migration tools and dedicated support to ensure a smooth transition with minimal disruption to your operations.',
  },
  {
    question: 'Is my data secure and resilient?',
    answer: 'Your data is encrypted at rest and in transit using industry-standard AES-256 encryption. We use geo-redundant cloud infrastructure with automatic failover.',
  },
  {
    question: 'Can I customize workflows without coding?',
    answer: 'Yes. The Creator tier allows for natural language prompts to generate mobile forms, flows, and dashboards instantly.',
  },
  {
    question: 'What support is included?',
    answer: 'All tiers include access to our knowledge base, community forums, and email support. Higher tiers unlock priority support channels.',
  },
]

// Default
export const Default: Story = {
  args: {
    items: FAQ_ITEMS,
    defaultOpenIndex: 2,
  },
}

// All Closed
export const AllClosed: Story = {
  args: {
    items: FAQ_ITEMS,
    defaultOpenIndex: null,
  },
}

// Allow Multiple
export const AllowMultiple: Story = {
  args: {
    items: FAQ_ITEMS,
    allowMultiple: true,
    defaultOpenIndex: 0,
  },
}

// In Card
export const InCard: Story = {
  render: () => (
    <Card variant="pricing" shadow="sm" style={{ borderColor: COLORS.teal }}>
      <Accordion items={FAQ_ITEMS} defaultOpenIndex={1} />
    </Card>
  ),
}

// Custom Colors
export const CustomColors: Story = {
  args: {
    items: FAQ_ITEMS,
    defaultOpenIndex: 0,
    borderColor: COLORS.circleBlue,
    answerBgColor: 'rgba(60, 118, 236, 0.1)',
  },
}
