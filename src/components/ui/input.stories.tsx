import type { Meta, StoryObj } from '@storybook/react'
import { expect, within, userEvent } from 'storybook/test'
import {
  ATOM_META,
  atomDescription,
} from '@/stories/_infrastructure'
import { Input } from './input'

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta<typeof Input> = {
  title: 'Core/Input',
  component: Input,
  ...ATOM_META,
  parameters: {
    ...ATOM_META.parameters,
    docs: {
      description: {
        component: atomDescription(
          'Text input field for user data entry. Supports placeholder, disabled, and error states.'
        ),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Input>

// Default Input (for Controls panel)
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

// Interactive typing test
export const WithTyping: Story = {
  args: {
    placeholder: 'Type here...',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('Type here...')

    // Clear and type new text
    await userEvent.clear(input)
    await userEvent.type(input, 'Hello, World!', { delay: 50 })

    // Verify the value
    await expect(input).toHaveValue('Hello, World!')
  },
}

// All States (Visual Matrix - No interaction needed)
export const AllStates: Story = {
  render: () => (
    <div className="w-[500px] space-y-8 p-6">
      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Default (Empty)</h4>
        <Input placeholder="Enter text" />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">With Value</h4>
        <Input defaultValue="John Doe" placeholder="Enter name" />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Focus State (Real Component Behavior - Tab to See)</h4>
        <Input
          placeholder="Click or tab to focus"
          autoFocus
        />
        <p className="text-xs text-secondary mt-2">Focus ring color matches design tokens (--ring variable)</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Error State (aria-invalid)</h4>
        <Input
          placeholder="Invalid email"
          aria-invalid="true"
          defaultValue="invalid-email"
        />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Disabled State</h4>
        <Input
          placeholder="Disabled input"
          disabled
          defaultValue="Cannot edit"
        />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Input Types</h4>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-secondary mb-2">Password (larger text, wider spacing)</p>
            <Input
              type="password"
              defaultValue="password123"
              placeholder="Enter password"
            />
          </div>
          <div>
            <p className="text-xs text-secondary mb-2">Email</p>
            <Input
              type="email"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <p className="text-xs text-secondary mb-2">Number</p>
            <Input
              type="number"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>
  ),
};
