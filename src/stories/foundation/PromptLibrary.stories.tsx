/**
 * Prompt Library - Interactive documentation for agent prompts
 *
 * Human-to-Agent prompt templates for consistent, high-quality DDS operations.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { PromptLibrary, DDS_PROMPTS } from '../../components/shared/PromptLibrary'

const meta: Meta<typeof PromptLibrary> = {
  title: 'Foundation/Prompt Library',
  component: PromptLibrary,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## Prompt Library

Human-to-Agent prompt templates for consistent, high-quality DDS operations.

### How to Use

1. **Find** the prompt you need using search or category filters
2. **Copy** the prompt using the copy button
3. **Replace** variables like \`{COMPONENT}\` with your actual values
4. **Paste** to your AI agent (Claude, etc.)

### Categories

| Category | Use For |
|----------|---------|
| **Stories** | Creating Storybook stories and documentation |
| **Components** | Building and stabilizing UI components |
| **Tokens** | Managing design tokens (colors, spacing, etc.) |
| **Documentation** | Writing MDX pages and updating rules |
| **Review** | Code review and compliance checks |

### Adding New Prompts

Edit \`src/components/shared/PromptLibrary/prompts.ts\`
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof PromptLibrary>

/**
 * Full prompt library with all DDS operation prompts.
 * Use search and category filters to find the prompt you need.
 */
export const Default: Story = {
  args: {
    prompts: DDS_PROMPTS,
  },
}

/**
 * Filtered to show only story-related prompts.
 */
export const StoriesOnly: Story = {
  args: {
    prompts: DDS_PROMPTS.filter((p) => p.category === 'stories'),
  },
}

/**
 * Filtered to show only component-related prompts.
 */
export const ComponentsOnly: Story = {
  args: {
    prompts: DDS_PROMPTS.filter((p) => p.category === 'components'),
  },
}

/**
 * Filtered to show only review-related prompts.
 */
export const ReviewOnly: Story = {
  args: {
    prompts: DDS_PROMPTS.filter((p) => p.category === 'review'),
  },
}
