import type { Meta, StoryObj } from '@storybook/react'
import { CheckListItem } from './CheckListItem'

const meta: Meta<typeof CheckListItem> = {
  title: 'Website/Components/CheckListItem',
  component: CheckListItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Bold label text',
    },
    text: {
      control: 'text',
      description: 'Description text following the label',
    },
    boldLabel: {
      control: 'boolean',
      description: 'Whether the label should be bold',
    },
    textColor: {
      control: 'select',
      options: ['dark', 'muted'],
      description: 'Text color for the content',
    },
    autoAnimate: {
      control: 'boolean',
      description: 'Whether to animate immediately on mount',
    },
    index: {
      control: { type: 'number', min: 0, max: 10 },
      description: 'Index for staggered animations',
    },
  },
}

export default meta
type Story = StoryObj<typeof CheckListItem>

// Default check list item
export const Default: Story = {
  args: {
    label: 'For Companies →',
    text: 'Automate and streamline environmental compliance workflows.',
    autoAnimate: true,
  },
}

// With muted text color
export const MutedText: Story = {
  args: {
    label: 'Feature:',
    text: 'This is a feature description with muted text styling.',
    textColor: 'muted',
    autoAnimate: true,
  },
}

// Without bold label
export const NoBoldLabel: Story = {
  args: {
    label: 'Simple item',
    text: 'with non-bold label text.',
    boldLabel: false,
    autoAnimate: true,
  },
}

// List of items
export const ListOfItems: Story = {
  render: () => (
    <div className="space-y-4 max-w-lg">
      <CheckListItem
        label="For Companies →"
        text="Automate and streamline environmental compliance workflows."
        index={0}
        autoAnimate
      />
      <CheckListItem
        label="For Consultants →"
        text="Deliver faster, more accurate reports for your clients."
        index={1}
        autoAnimate
      />
      <CheckListItem
        label="For Regulators →"
        text="Access real-time data and improve oversight capabilities."
        index={2}
        autoAnimate
      />
    </div>
  ),
}

// Feature list style
export const FeatureList: Story = {
  render: () => (
    <div className="space-y-3 max-w-md">
      <CheckListItem
        label="Real-time Monitoring"
        text="— Track compliance status 24/7"
        index={0}
        autoAnimate
      />
      <CheckListItem
        label="Automated Reports"
        text="— Generate reports with one click"
        index={1}
        autoAnimate
      />
      <CheckListItem
        label="Smart Alerts"
        text="— Get notified before deadlines"
        index={2}
        autoAnimate
      />
      <CheckListItem
        label="Secure Storage"
        text="— All data encrypted at rest"
        index={3}
        autoAnimate
      />
    </div>
  ),
}

// Benefits section style
export const BenefitsSection: Story = {
  render: () => (
    <div className="p-6 bg-page rounded-lg max-w-lg">
      <h3 className="text-xl font-bold text-primary mb-4">Why Choose Us</h3>
      <div className="space-y-4">
        <CheckListItem
          label="Save Time"
          text="Reduce compliance tasks by 70% with automation."
          index={0}
          autoAnimate
        />
        <CheckListItem
          label="Reduce Risk"
          text="Stay ahead of regulatory changes with real-time updates."
          index={1}
          autoAnimate
        />
        <CheckListItem
          label="Cut Costs"
          text="Lower operational expenses by streamlining workflows."
          index={2}
          autoAnimate
        />
      </div>
    </div>
  ),
}

// Compact list
export const CompactList: Story = {
  render: () => (
    <div className="space-y-2 max-w-sm">
      {[
        'Air quality monitoring',
        'Water discharge tracking',
        'Waste management logging',
        'Emissions reporting',
      ].map((item, index) => (
        <CheckListItem
          key={item}
          label=""
          text={item}
          boldLabel={false}
          index={index}
          autoAnimate
        />
      ))}
    </div>
  ),
}

// Dark background context
export const OnDarkBackground: Story = {
  render: () => (
    <div className="p-6 bg-inverseBg rounded-lg max-w-lg">
      <h3 className="text-xl font-bold text-white mb-4">Platform Features</h3>
      <div className="space-y-4 text-white">
        <div className="flex items-start gap-3 sm:gap-4">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5 sm:mt-1">
            <path d="M7 12.5L10.5 16L17 9" stroke="#08A4BD" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-base sm:text-lg leading-relaxed">
            <span className="font-semibold">Dashboard →</span> Real-time overview of all compliance metrics
          </p>
        </div>
        <div className="flex items-start gap-3 sm:gap-4">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5 sm:mt-1">
            <path d="M7 12.5L10.5 16L17 9" stroke="#08A4BD" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-base sm:text-lg leading-relaxed">
            <span className="font-semibold">Analytics →</span> Deep insights into your environmental data
          </p>
        </div>
      </div>
    </div>
  ),
}
