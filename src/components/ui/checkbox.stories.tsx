import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';

const meta = {
  title: 'Components/Checkbox',
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
      <label htmlFor="terms" className="text-sm font-medium text-dark cursor-pointer">
        Accept terms and conditions
      </label>
    </div>
  ),
};

// Multiple Checkboxes
export const MultipleCheckboxes: Story = {
  render: () => (
    <div className="w-[350px] space-y-4 p-6 border border-dashed border-slate-300 rounded-lg bg-white">
      <h3 className="text-lg font-bold text-dark mb-4">Select Features</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox id="feature1" defaultChecked />
          <label htmlFor="feature1" className="text-sm text-dark cursor-pointer">
            Automated Reporting
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="feature2" defaultChecked />
          <label htmlFor="feature2" className="text-sm text-dark cursor-pointer">
            Real-time Notifications
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="feature3" />
          <label htmlFor="feature3" className="text-sm text-dark cursor-pointer">
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

// Form Example
export const FormExample: Story = {
  render: () => (
    <div className="w-[400px] space-y-4 p-6 border border-dashed border-slate-300 rounded-lg bg-white">
      <h3 className="text-lg font-bold text-dark">Preferences</h3>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-dark mb-3">Email Notifications</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox id="email1" defaultChecked />
              <label htmlFor="email1" className="text-sm text-dark cursor-pointer">
                Weekly summary
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="email2" />
              <label htmlFor="email2" className="text-sm text-dark cursor-pointer">
                Product updates
              </label>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-4">
          <h4 className="text-sm font-semibold text-dark mb-3">Privacy</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox id="privacy1" defaultChecked />
              <label htmlFor="privacy1" className="text-sm text-dark cursor-pointer">
                Make profile public
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="privacy2" defaultChecked />
              <label htmlFor="privacy2" className="text-sm text-dark cursor-pointer">
                Allow data collection
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
