import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn, expect, userEvent, within } from 'storybook/test'
import {
  OrganizationSizeSelector,
  type OrganizationSizeTier,
} from '../../../components/partners/PricingCalculator'
import { MOLECULE_META, moleculeDescription } from '../../_infrastructure'

// =============================================================================
// STORY CONFIGURATION
// =============================================================================

const meta: Meta<typeof OrganizationSizeSelector> = {
  title: 'Partner/TenantRequest/OrganizationSizeSelector',
  component: OrganizationSizeSelector,
  ...MOLECULE_META,
  parameters: {
    ...MOLECULE_META.parameters,
    layout: 'centered',
    docs: {
      description: {
        component: moleculeDescription(`Organization size tier selector dropdown.

## Features
- 6 organization size tiers with user ranges and annual prices
- Shows tier label, user range, and platform base price
- Glass Depth 2 styling (card wrapper)
- Inline mode available for form integration

## Tiers
| Tier | Users | Platform Base |
|------|-------|---------------|
| Micro | 1-10 | $3,000/yr |
| Small | 11-50 | $5,000/yr |
| Mid-Market | 51-100 | $7,000/yr |
| Upper Mid-Market | 101-250 | $10,000/yr |
| Enterprise | 251-500 | $13,000/yr |
| Large Enterprise | 500+ | $18,000/yr |

## Usage
Used in TenantRequestWizard Step 2 to determine platform base pricing.`),
      },
    },
  },
  argTypes: {
    value: {
      control: 'select',
      options: ['', 'micro', 'small', 'mid_market', 'upper_mid', 'enterprise', 'large_enterprise'],
      description: 'Selected organization size tier',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when selection changes',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the selector',
    },
    inline: {
      control: 'boolean',
      description: 'Hide card wrapper for form integration',
    },
  },
}

export default meta
type Story = StoryObj<typeof OrganizationSizeSelector>

// =============================================================================
// STATEFUL WRAPPER
// =============================================================================

function StatefulSelector({
  initialValue = '',
  ...props
}: Omit<React.ComponentProps<typeof OrganizationSizeSelector>, 'value' | 'onChange'> & {
  initialValue?: OrganizationSizeTier | ''
}) {
  const [value, setValue] = React.useState<OrganizationSizeTier | ''>(initialValue)
  return <OrganizationSizeSelector {...props} value={value} onChange={setValue} />
}

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default state with no selection.
 */
export const Default: Story = {
  args: {
    value: '',
    onChange: fn(),
  },
}

/**
 * Interactive selector with state management.
 */
export const Interactive: Story = {
  render: () => <StatefulSelector />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByTestId('org-size-selector-trigger')

    // Open dropdown
    await userEvent.click(trigger)

    // Select Mid-Market tier
    const option = await canvas.findByTestId('org-size-selector-option-mid_market')
    await userEvent.click(option)

    // Verify selection shows in trigger
    await expect(trigger).toHaveTextContent('Mid-Market')
  },
}

/**
 * Pre-selected tier (Small business).
 */
export const PreselectedSmall: Story = {
  args: {
    value: 'small',
    onChange: fn(),
  },
}

/**
 * Pre-selected tier (Enterprise).
 */
export const PreselectedEnterprise: Story = {
  args: {
    value: 'enterprise',
    onChange: fn(),
  },
}

/**
 * Large Enterprise tier (highest pricing).
 */
export const LargeEnterprise: Story = {
  args: {
    value: 'large_enterprise',
    onChange: fn(),
  },
}

/**
 * Disabled state.
 */
export const Disabled: Story = {
  args: {
    value: 'mid_market',
    onChange: fn(),
    disabled: true,
  },
}

/**
 * Inline mode (no card wrapper) for form integration.
 */
export const Inline: Story = {
  args: {
    value: '',
    onChange: fn(),
    inline: true,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
}

/**
 * Inline mode with selection.
 */
export const InlineWithSelection: Story = {
  args: {
    value: 'upper_mid',
    onChange: fn(),
    inline: true,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
}

/**
 * All tiers demonstration - shows each tier's pricing.
 */
export const AllTiers: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      {(['micro', 'small', 'mid_market', 'upper_mid', 'enterprise', 'large_enterprise'] as const).map(
        (tier) => (
          <OrganizationSizeSelector
            key={tier}
            value={tier}
            onChange={fn()}
            inline
          />
        )
      )}
    </div>
  ),
}

/**
 * Mobile viewport.
 */
export const Mobile: Story = {
  args: {
    value: 'small',
    onChange: fn(),
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

/**
 * Dark mode.
 */
export const DarkMode: Story = {
  args: {
    value: 'enterprise',
    onChange: fn(),
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
}
