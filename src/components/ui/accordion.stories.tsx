import type { Meta, StoryObj } from '@storybook/react'
import {
  MOLECULE_META,
  moleculeDescription,
} from '@/stories/_infrastructure'
import { Accordion } from './Accordion'

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta<typeof Accordion> = {
  title: 'Core/Accordion',
  component: Accordion,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    docs: {
      description: {
        component: moleculeDescription(
          `Expandable/collapsible content component built on Radix UI Accordion.

**Features:**
- Keyboard navigation (Arrow keys, Home, End)
- ARIA attributes handled automatically
- Single or multiple expansion modes
- Animated open/close transitions

**Testing:** Use data-slot="accordion", "accordion-item", "accordion-trigger", "accordion-content"`
        ),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[600px] p-5">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Accordion>

// =============================================================================
// STORIES
// =============================================================================

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

/**
 * Default accordion with third item open by default. Single expansion mode (only one item can be open at a time).
 */
export const Default: Story = {
  args: {
    items: FAQ_ITEMS,
    defaultOpenIndex: 2,
  },
}

/**
 * Allow multiple items to be open simultaneously. User can expand multiple sections at once.
 */
export const AllowMultiple: Story = {
  args: {
    items: FAQ_ITEMS,
    allowMultiple: true,
    defaultOpenIndex: 0,
  },
}

/**
 * All states and behaviors demonstrated in a single story.
 *
 * Shows:
 * - All closed (default state)
 * - Single expansion mode
 * - Multiple expansion mode
 * - Focus states (keyboard navigation)
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-12 w-full max-w-2xl">
      {/* All Closed */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-primary">All Closed</h3>
        <Accordion items={FAQ_ITEMS} defaultOpenIndex={null} />
      </div>

      {/* Single Expansion (default) */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-primary">Single Expansion (One Open at a Time)</h3>
        <Accordion items={FAQ_ITEMS} defaultOpenIndex={1} />
      </div>

      {/* Multiple Expansion */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-primary">Multiple Expansion (Many Open at Once)</h3>
        <Accordion items={FAQ_ITEMS} allowMultiple defaultOpenIndex={0} />
      </div>

      {/* Keyboard Navigation Reference */}
      <div className="bg-surface border border-default rounded-md p-6">
        <h3 className="text-base font-semibold mb-3 text-primary">Keyboard Navigation</h3>
        <div className="space-y-2 text-sm text-secondary">
          <div className="flex justify-between">
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Space / Enter</kbd>
            <span>Toggle expansion</span>
          </div>
          <div className="flex justify-between">
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">↓ / ↑</kbd>
            <span>Navigate between items</span>
          </div>
          <div className="flex justify-between">
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Home / End</kbd>
            <span>First / Last item</span>
          </div>
          <div className="flex justify-between">
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Tab</kbd>
            <span>Focus next element (exits accordion)</span>
          </div>
        </div>
      </div>
    </div>
  ),
}
