import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

const meta = {
  title: 'Core/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `**Type:** ATOM

Separator component for visual division of content.

## Two Separator Types

### 1. Solid Separator (Component)
Use the \`<Separator />\` component for solid divider lines.

- Horizontal (default) or vertical orientation
- Teal brand color for consistency

### 2. Dashed Separator (CSS Class)
Use \`<div className="separator-dashed" />\` for dashed dividers.

- Same teal brand color
- 4px dash, 4px gap pattern
- Used in website sections

## Accessibility

- **Decorative** (default): Not announced to screen readers
- **Semantic**: Set \`decorative={false}\` for meaningful separators that should be announced
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Separator orientation',
      table: {
        type: { summary: 'horizontal | vertical' },
      },
    },
    decorative: {
      control: 'boolean',
      description: 'Whether separator is decorative or semantic for screen readers',
      table: {
        type: { summary: 'boolean' },
      },
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof Separator>;

// Default Separator (for Controls panel)
export const Default: Story = {
  render: () => (
    <div className="w-[400px]">
      <p className="mb-4 text-primary">Section above</p>
      <Separator />
      <p className="mt-4 text-primary">Section below</p>
    </div>
  ),
};

// All States (Visual Matrix - No interaction needed)
export const AllStates: Story = {
  render: () => (
    <div className="w-[500px] space-y-8 p-6">
      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Horizontal Orientation (Default)</h4>
        <div className="w-full">
          <p className="mb-4 text-primary text-sm">Content above</p>
          <Separator />
          <p className="mt-4 text-primary text-sm">Content below</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Vertical Orientation</h4>
        <div className="flex items-center h-16 gap-4">
          <span className="text-primary">Item 1</span>
          <Separator orientation="vertical" />
          <span className="text-primary">Item 2</span>
          <Separator orientation="vertical" />
          <span className="text-primary">Item 3</span>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-primary mb-4">Dashed Variant (Website Style)</h4>
        <div className="w-full">
          <p className="mb-4 text-primary text-sm">Section above</p>
          <div className="separator-dashed" />
          <p className="mt-4 text-primary text-sm">Section below</p>
        </div>
        <p className="text-xs text-secondary mt-2">Uses .separator-dashed CSS class (teal #08A4BD, 4px dash, 4px gap)</p>
        <p className="text-xs text-secondary">Used in website: ContactInfo, SectionLayout</p>
      </div>
    </div>
  ),
};
