import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';

const meta = {
  title: 'Core/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `**Type:** ATOM

Checkbox component for selections and toggles. Built on Radix UI Checkbox primitive.

## Styling
- **Unchecked**: Dark teal border (DEEP_CURRENT[700] = #056271) for high visibility on light backgrounds
- **Checked**: Teal background (DEEP_CURRENT[500] = #08A4BD) matching Button accent variant
- **Focus**: Teal focus ring matching design token system
- **Size**: 16px (size-4) for easy clicking

## Visual Consistency
Checkbox checked state matches Button accent variant for brand consistency across interactive elements.
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof Checkbox>;

// Default Checkbox (for Controls panel)
export const Default: Story = {
  args: {},
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
