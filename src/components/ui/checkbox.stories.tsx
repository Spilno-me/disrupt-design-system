import type { Meta, StoryObj } from '@storybook/react'
import {
  ATOM_META,
  atomDescription,
} from '@/stories/_infrastructure'
import { Checkbox } from './checkbox'

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta: Meta<typeof Checkbox> = {
  title: 'Core/Checkbox',
  component: Checkbox,
  ...ATOM_META,
  parameters: {
    ...ATOM_META.parameters,
    docs: {
      description: {
        component: atomDescription(
          'Checkbox component for selections and toggles. Built on Radix UI Checkbox primitive. Unchecked: Dark teal border (DEEP_CURRENT[700]) for high visibility. Checked: Teal background (DEEP_CURRENT[500]) matching Button accent variant.'
        ),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>

// Default Checkbox (for Controls panel)
export const Default: Story = {
  args: {
    'aria-label': 'Example checkbox',
  },
};

// All States (Visual Matrix - No interaction needed)
export const AllStates: Story = {
  render: () => (
    <div className="w-[500px] space-y-8 p-6">
      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Unchecked (Default)</h4>
        <Checkbox aria-label="Unchecked" />
        <p className="text-xs text-secondary mt-2">Dark teal border (DEEP_CURRENT[700], 2px) for high visibility</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Checked</h4>
        <Checkbox defaultChecked aria-label="Checked" />
        <p className="text-xs text-secondary mt-2">Teal background matches Button accent variant</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Focus State (Real Component Behavior - Tab to See)</h4>
        <Checkbox
          aria-label="Focused"
          autoFocus
        />
        <p className="text-xs text-secondary mt-2">Focus ring color matches design tokens (--ring variable)</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Checked + Focused (Real Behavior - Click to See)</h4>
        <div className="flex items-center gap-2">
          <Checkbox
            defaultChecked
            aria-label="Checked and focused"
            id="checked-focused"
          />
          <label htmlFor="checked-focused" className="text-sm text-secondary cursor-pointer">Click checkbox to see focus ring</label>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Error State (aria-invalid)</h4>
        <Checkbox
          aria-invalid="true"
          aria-label="Invalid"
        />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Disabled (Unchecked)</h4>
        <Checkbox disabled aria-label="Disabled unchecked" />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Disabled (Checked)</h4>
        <Checkbox disabled defaultChecked aria-label="Disabled checked" />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">With Label</h4>
        <div className="flex items-center gap-2">
          <Checkbox id="with-label" defaultChecked />
          <label htmlFor="with-label" className="text-sm font-medium text-primary cursor-pointer">
            Accept terms and conditions
          </label>
        </div>
      </div>
    </div>
  ),
};
