import type { Meta, StoryObj } from '@storybook/react'
import {
  ATOM_META,
  atomDescription,
} from '@/stories/_infrastructure'
import { MadeWithLove } from './MadeWithLove'

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta<typeof MadeWithLove> = {
  title: 'Shared/Components/MadeWithLove',
  component: MadeWithLove,
  ...ATOM_META,
  parameters: {
    ...ATOM_META.parameters,
    docs: {
      description: {
        component: atomDescription(
          'Branded "Made with ❤️" footer attribution with light and dark color modes.'
        ),
      },
    },
  },
  argTypes: {
    colorMode: {
      control: 'radio',
      options: ['dark', 'light'],
      description: 'Color mode for light or dark backgrounds',
    },
    onClick: {
      action: 'clicked',
      description: 'Optional click handler',
    },
  },
}

export default meta
type Story = StoryObj<typeof MadeWithLove>

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default variant for light backgrounds (footer on cream/white)
 */
export const Default: Story = {
  args: {
    colorMode: 'dark',
  },
}

/**
 * Light variant for dark backgrounds
 */
export const OnDarkBackground: Story = {
  args: {
    colorMode: 'light',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="bg-inverse-bg p-8 rounded-lg">
        <Story />
      </div>
    ),
  ],
}

/**
 * With click handler - makes it interactive
 */
export const Clickable: Story = {
  args: {
    colorMode: 'dark',
    onClick: () => alert('Clicked! Could navigate to Disrupt website'),
  },
}

/**
 * In a footer context
 */
export const InFooterContext: Story = {
  args: {
    colorMode: 'dark',
  },
  decorators: [
    (Story) => (
      <footer className="bg-page p-6 border-t border-default w-full max-w-md">
        <div className="flex flex-col items-center gap-4">
          <div className="text-xs text-muted">
            © 2024 Your Company. All rights reserved.
          </div>
          <Story />
        </div>
      </footer>
    ),
  ],
}

/**
 * In dark footer context
 */
export const InDarkFooterContext: Story = {
  args: {
    colorMode: 'light',
  },
  decorators: [
    (Story) => (
      <footer className="bg-inverse-bg p-6 border-t border-strong w-full max-w-md">
        <div className="flex flex-col items-center gap-4">
          <div className="text-xs text-inverse/60">
            © 2024 Your Company. All rights reserved.
          </div>
          <Story />
        </div>
      </footer>
    ),
  ],
}
