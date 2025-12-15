import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';

const meta = {
  title: 'Core/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof Checkbox>;

// Default Checkbox
export const Default: Story = {
  args: {},
};

// Checked
export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

// Disabled
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

// Disabled Checked
export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

// With Label
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <label htmlFor="terms" className="text-sm font-medium text-primary cursor-pointer">
        Accept terms and conditions
      </label>
    </div>
  ),
};

// Multiple Checkboxes
export const MultipleCheckboxes: Story = {
  render: () => (
    <div className="w-[350px] space-y-4 p-6 border border-dashed border-default rounded-lg bg-white">
      <h3 className="text-lg font-bold text-primary mb-4">Select Features</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox id="feature1" defaultChecked />
          <label htmlFor="feature1" className="text-sm text-primary cursor-pointer">
            Automated Reporting
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="feature2" defaultChecked />
          <label htmlFor="feature2" className="text-sm text-primary cursor-pointer">
            Real-time Notifications
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="feature3" />
          <label htmlFor="feature3" className="text-sm text-primary cursor-pointer">
            Advanced Analytics
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="feature4" disabled />
          <label htmlFor="feature4" className="text-sm text-muted cursor-not-allowed">
            Premium Support (Enterprise only)
          </label>
        </div>
      </div>
    </div>
  ),
};

// All States (Visual Matrix - No interaction needed)
export const AllStates: Story = {
  render: () => (
    <div className="w-[500px] space-y-8 p-6">
      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Unchecked (Default)</h4>
        <Checkbox aria-label="Unchecked" />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Checked</h4>
        <Checkbox defaultChecked aria-label="Checked" />
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
