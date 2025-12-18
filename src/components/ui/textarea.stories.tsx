import type { Meta, StoryObj } from '@storybook/react'
import {
  ATOM_META,
  atomDescription,
} from '@/stories/_infrastructure'
import { Textarea } from './textarea'

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta<typeof Textarea> = {
  title: 'Core/Textarea',
  component: Textarea,
  ...ATOM_META,
  parameters: {
    ...ATOM_META.parameters,
    docs: {
      description: {
        component: atomDescription(
          'Multi-line text input for longer user content. Supports placeholder, disabled, and error states.'
        ),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Textarea>

// Default Textarea (for Controls panel)
export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
  },
};

// All States (Visual Matrix - No interaction needed)
export const AllStates: Story = {
  render: () => (
    <div className="w-[500px] space-y-8 p-6">
      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Default (Empty)</h4>
        <Textarea placeholder="Enter your message..." rows={3} />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">With Value</h4>
        <Textarea
          defaultValue="This is sample text content in a textarea component."
          rows={3}
        />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Focus State (Real Component Behavior - Tab to See)</h4>
        <Textarea
          placeholder="Click or tab to focus"
          rows={3}
          autoFocus
        />
        <p className="text-xs text-secondary mt-2">Focus ring color matches design tokens (--ring variable)</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Error State (aria-invalid)</h4>
        <Textarea
          placeholder="Invalid input"
          aria-invalid="true"
          rows={3}
          defaultValue="Error state example"
        />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Disabled State</h4>
        <Textarea
          placeholder="Disabled textarea"
          disabled
          rows={3}
          defaultValue="Cannot edit this text"
        />
      </div>
    </div>
  ),
};
